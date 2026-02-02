import { Product, ProductVideo } from "@/types/product";
import localProductsData from "@/data/products.json";

// Directus API Configuration
const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || "https://heimish.ru/directus";
const API_URL = `${DIRECTUS_URL}/items`;

// Local products for image fallback
const localProducts = localProductsData as Product[];

// Directus response types
interface DirectusProduct {
  id: number;
  title: string;
  slug: string | null;
  price: string;
  old_price: string | null;
  is_on_sale: number | boolean;
  description: string | null;
  category: string | null;
  line: string | null;
  rating: string | null;
  reviews_count: number;
  in_stock: number | boolean;
  image_url: string | null;
  images: string[] | null;
  reviews?: DirectusReview[];
  videos?: DirectusVideo[];
}

interface DirectusReview {
  id: number;
  author: string;
  rating: number;
  text: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  product_id: number | null;
  date_created?: string;
}

interface DirectusVideo {
  id: number;
  title: string;
  youtube_url: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  product_id: number | null;
}

interface DirectusFAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  category: string | null;
}

interface DirectusResponse<T> {
  data: T;
  meta?: {
    total_count?: number;
    filter_count?: number;
  };
}

// Transform Directus product to our Product type
function transformProduct(dp: DirectusProduct): Product {
  let images: string[] = [];

  if (dp.images && dp.images.length > 0) {
    images = dp.images;
  } else {
    // Fallback to localProducts (products.json)
    const localProduct = localProducts.find(p => p.title === dp.title);
    if (localProduct && localProduct.images) {
      images = localProduct.images;
    } else if (dp.image_url) {
      images = [dp.image_url];
    }
  }

  return {
    id: String(dp.id),
    handle: String(dp.id),
    code: String(dp.id),
    title: dp.title,
    price: parseFloat(dp.price) || 0,
    oldPrice: dp.old_price ? parseFloat(dp.old_price) : undefined,
    isOnSale: dp.is_on_sale === 1 || dp.is_on_sale === true,
    category: dp.category || "",
    line: dp.line || "",
    images,
    description: dp.description || "",
    rating: dp.rating ? parseFloat(dp.rating) : 0,
    reviews: dp.reviews_count || 0,
    inStock: dp.in_stock === 1 || dp.in_stock === true,
    videos: dp.videos?.filter(v => v.is_active).map((video) => ({
      id: String(video.id),
      title: video.title,
      type: video.youtube_url ? "youtube" as const : "local" as const,
      url: video.youtube_url || "",
      thumbnail: undefined,
    })) || [],
  };
}

// API Functions
export async function fetchProducts(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  line?: string;
  sort?: string;
}): Promise<{ products: Product[]; total: number; pageCount: number }> {
  try {
    const searchParams = new URLSearchParams();

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 25;
    searchParams.set("page", String(page));
    searchParams.set("limit", String(pageSize));
    searchParams.set("meta", "total_count,filter_count");

    if (params?.category && params.category !== "all") {
      searchParams.set("filter[category][_eq]", params.category);
    }
    if (params?.line && params.line !== "all") {
      searchParams.set("filter[line][_eq]", params.line);
    }

    if (params?.sort) {
      switch (params.sort) {
        case "price-low":
          searchParams.set("sort", "price");
          break;
        case "price-high":
          searchParams.set("sort", "-price");
          break;
        case "rating":
          searchParams.set("sort", "-rating");
          break;
        case "reviews":
          searchParams.set("sort", "-reviews_count");
          break;
        case "newest":
          searchParams.set("sort", "-date_created");
          break;
        default:
          searchParams.set("sort", "-reviews_count");
      }
    }

    const response = await fetch(`${API_URL}/products?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: DirectusResponse<DirectusProduct[]> = await response.json();
    const total = data.meta?.filter_count || data.meta?.total_count || 0;

    return {
      products: data.data.map(transformProduct),
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    const localProducts = await import("@/data/products.json");
    return {
      products: localProducts.default as Product[],
      total: (localProducts.default as Product[]).length,
      pageCount: 1,
    };
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/products/${id}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: DirectusResponse<DirectusProduct> = await response.json();

    if (data.data) {
      return transformProduct(data.data);
    }

    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    const localProducts = await import("@/data/products.json");
    const product = (localProducts.default as Product[]).find(
      (p) => p.id === id || p.code === id
    );
    return product || null;
  }
}

export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_URL}/products?limit=-1`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: DirectusResponse<DirectusProduct[]> = await response.json();
    return data.data.map(transformProduct);
  } catch (error) {
    console.error("Error fetching all products:", error);
    const localProducts = await import("@/data/products.json");
    return localProducts.default as Product[];
  }
}

// Fetch reviews for a product
export async function fetchProductReviews(productId: string): Promise<{
  id: string;
  author: string;
  rating: number;
  text: string;
  isVerified: boolean;
  createdAt: string;
}[]> {
  try {
    const response = await fetch(
      `${API_URL}/reviews?filter[product_id][_eq]=${productId}&sort=-date_created`
    );

    if (!response.ok) {
      return [];
    }

    const data: DirectusResponse<DirectusReview[]> = await response.json();

    return data.data.map((review) => ({
      id: String(review.id),
      author: review.author,
      rating: review.rating,
      text: review.text || "",
      isVerified: review.is_approved || false,
      createdAt: review.date_created || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// Fetch questions for a product (not implemented in Directus yet - return empty)
export async function fetchProductQuestions(productId: string): Promise<{
  id: string;
  author: string;
  question: string;
  answer: string | null;
  createdAt: string;
}[]> {
  return [];
}

// Create order in Directus
export async function createOrder(orderData: {
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  comment?: string;
  deliveryMethod: "courier" | "pickup";
  promoCode?: string;
  discount?: number;
}): Promise<{ success: boolean; orderId?: number; error?: string }> {
  try {
    const orderNumber = "HM-" + Date.now().toString(36).toUpperCase();

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail || null,
        delivery_address: orderData.address,
        delivery_method: orderData.deliveryMethod === "courier" ? "Курьер" : "Самовывоз",
        payment_method: "Картой",
        status: "Новый",
        items: orderData.items,
        total: orderData.total,
        discount: orderData.discount || 0,
        notes: orderData.comment || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, orderId: data.data.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ошибка при создании заказа"
    };
  }
}

// Fetch FAQ data (legacy - kept for compatibility)
export async function fetchFAQ(): Promise<{ question: string; answer: string }[]> {
  return fetchFAQItems();
}

export function getStrapiUrl(): string {
  return DIRECTUS_URL;
}

// Create review
export async function createReview(data: {
  productId: string;
  author: string;
  rating: number;
  text: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: parseInt(data.productId) || null,
        author: data.author,
        rating: data.rating,
        text: data.text,
        is_approved: false,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error creating review:", error);
    return false;
  }
}

// Create question (not implemented in Directus yet)
export async function createQuestion(data: {
  productId: string;
  author: string;
  question: string;
}): Promise<boolean> {
  console.warn("Questions not yet implemented in Directus");
  return false;
}

// Fetch FAQ items from Directus
export async function fetchFAQItems(): Promise<{ id: number; question: string; answer: string; category?: string; order?: number }[]> {
  try {
    const response = await fetch(`${API_URL}/faqs?sort=sort_order`);

    if (!response.ok) {
      console.error("FAQ API Error:", response.status);
      return [];
    }

    const data: DirectusResponse<DirectusFAQ[]> = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data.map((item) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        category: item.category || undefined,
        order: item.sort_order
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return [];
  }
}
