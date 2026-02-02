const http = require('http');
const mysql = require('/var/www/directus/node_modules/mysql2/promise');

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 8055, path, method, headers: { 'Content-Type': 'application/json' } };
    if (global.TOKEN) opts.headers['Authorization'] = 'Bearer ' + global.TOKEN;
    const req = http.request(opts, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve({raw: d}); } }); });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  // Login
  const login = await api('POST', '/auth/login', { email: 'admin@heimish.ru', password: 'HeimishAdmin2025!' });
  global.TOKEN = login.data.access_token;
  console.log('Logged in to Directus');

  // === SET PUBLIC ACCESS PERMISSIONS ===
  // In Directus 11, permissions use "policy" not "role"
  // Find the public policy
  const policies = await api('GET', '/policies');
  const publicPolicy = policies.data.find(p => p.name === '$t:public_label' || p.name === 'Public');
  const publicPolicyId = publicPolicy ? publicPolicy.id : null;
  console.log('Public policy ID:', publicPolicyId);

  if (!publicPolicyId) {
    console.log('ERROR: No public policy found!');
    process.exit(1);
  }

  // Set public read permissions for collections
  const publicReadCollections = ['products', 'reviews', 'faqs', 'banners', 'videos', 'orders'];

  for (const coll of publicReadCollections) {
    const r = await api('POST', '/permissions', {
      collection: coll,
      action: 'read',
      policy: publicPolicyId,
      fields: ['*'],
      permissions: {},
      validation: {}
    });
    console.log('Public read ' + coll + ':', r.data ? 'OK' : JSON.stringify(r.errors || r).substring(0, 120));
  }

  // Public create for orders
  const orderPerm = await api('POST', '/permissions', {
    collection: 'orders',
    action: 'create',
    policy: publicPolicyId,
    fields: ['*'],
    permissions: {},
    validation: {}
  });
  console.log('Public create orders:', orderPerm.data ? 'OK' : JSON.stringify(orderPerm.errors || orderPerm).substring(0, 120));

  // Public create for reviews
  const reviewPerm = await api('POST', '/permissions', {
    collection: 'reviews',
    action: 'create',
    policy: publicPolicyId,
    fields: ['*'],
    permissions: {},
    validation: {}
  });
  console.log('Public create reviews:', reviewPerm.data ? 'OK' : JSON.stringify(reviewPerm.errors || reviewPerm).substring(0, 120));

  // === MIGRATE DATA FROM STRAPI ===
  // Connect to Strapi DB using socketPath for root
  const conn = await mysql.createConnection({
    socketPath: '/var/run/mysqld/mysqld.sock',
    user: 'root',
    database: 'heimish_db'
  });
  console.log('Connected to Strapi MySQL');

  // Load local products.json for images
  const fs = require('fs');
  let localProducts = [];
  try {
    localProducts = JSON.parse(fs.readFileSync('/var/www/heimish.ru/client/data/products.json', 'utf8'));
  } catch(e) { console.log('No local products.json'); }

  // Migrate products
  const [products] = await conn.execute('SELECT * FROM products');
  console.log('\nMigrating ' + products.length + ' products...');

  let productMap = {}; // old_id -> new_id

  for (const p of products) {
    // Find matching local product for images
    const local = localProducts.find(lp => lp.title === p.title);
    const images = local ? local.images : (p.image_url ? [p.image_url] : []);

    // Normalize category
    let category = p.category;
    if (category === 'крем') category = 'Кремы';

    const item = {
      title: p.title,
      slug: p.slug || null,
      price: parseFloat(p.price) || 0,
      old_price: p.old_price ? parseFloat(p.old_price) : null,
      is_on_sale: p.is_on_sale === 1,
      description: p.description || (local ? local.description : null),
      category: category,
      line: p.line || null,
      rating: parseFloat(p.rating) || (local ? local.rating : 0),
      reviews_count: p.reviews_count || (local ? local.reviews : 0),
      in_stock: p.in_stock !== 0,
      image_url: p.image_url || (images.length > 0 ? images[0] : null),
      images: images
    };

    const r = await api('POST', '/items/products', item);
    if (r.data) {
      productMap[p.id] = r.data.id;
      process.stdout.write('.');
    } else {
      console.log('\nERROR product "' + p.title + '":', JSON.stringify(r.errors || r).substring(0, 150));
    }
  }
  console.log('\nProducts migrated: ' + Object.keys(productMap).length);

  // Migrate FAQ
  const [faqs] = await conn.execute('SELECT * FROM faqs WHERE published_at IS NOT NULL');
  console.log('\nMigrating ' + faqs.length + ' FAQs...');

  for (const f of faqs) {
    const r = await api('POST', '/items/faqs', {
      question: f.question,
      answer: f.answer,
      sort_order: f.order || 0,
      category: f.category || null
    });
    if (r.data) {
      process.stdout.write('.');
    } else {
      console.log('\nERROR FAQ:', JSON.stringify(r.errors || r).substring(0, 100));
    }
  }
  console.log('\nFAQs migrated');

  // Migrate Reviews
  const [reviews] = await conn.execute('SELECT * FROM reviews WHERE published_at IS NOT NULL');
  console.log('\nMigrating ' + reviews.length + ' reviews...');

  for (const rv of reviews) {
    // Find product link
    const [links] = await conn.execute('SELECT * FROM reviews_product_lnk WHERE review_id = ?', [rv.id]);
    const productOldId = links.length > 0 ? links[0].product_id : null;
    const productNewId = productOldId ? productMap[productOldId] : null;

    const r = await api('POST', '/items/reviews', {
      author: rv.author,
      rating: rv.rating || 5,
      text: rv.text || null,
      avatar_url: rv.avatar_url || null,
      is_approved: rv.is_approved === 1,
      product_id: productNewId
    });
    if (r.data) {
      process.stdout.write('.');
    } else {
      console.log('\nERROR review:', JSON.stringify(r.errors || r).substring(0, 100));
    }
  }
  console.log('\nReviews migrated');

  await conn.end();

  // Verify
  const prods = await api('GET', '/items/products?limit=0&meta=total_count');
  const faqsCount = await api('GET', '/items/faqs?limit=0&meta=total_count');
  const revCount = await api('GET', '/items/reviews?limit=0&meta=total_count');

  console.log('\n=== VERIFICATION ===');
  console.log('Products in Directus:', prods.meta.total_count);
  console.log('FAQs in Directus:', faqsCount.meta.total_count);
  console.log('Reviews in Directus:', revCount.meta.total_count);

  // Verify Strapi untouched
  const conn2 = await mysql.createConnection({
    socketPath: '/var/run/mysqld/mysqld.sock',
    user: 'root',
    database: 'heimish_db'
  });
  const [check] = await conn2.execute('SELECT COUNT(*) as cnt FROM products');
  console.log('Products in Strapi DB (untouched):', check[0].cnt);
  await conn2.end();

  // Test public access (no token)
  global.TOKEN = null;
  const publicTest = await api('GET', '/items/products?limit=1');
  console.log('Public access test:', publicTest.data ? 'OK (' + publicTest.data.length + ' items)' : 'FAIL');

  console.log('\nDone!');
})().catch(e => console.error('FATAL:', e));
