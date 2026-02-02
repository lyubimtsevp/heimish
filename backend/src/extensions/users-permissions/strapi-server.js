module.exports = (plugin) => {
  plugin.bootstrap = async ({ strapi }) => {
    console.log("🔐 Setting up public API permissions...");
    
    const publicRole = await strapi.query("plugin::users-permissions.role").findOne({
      where: { type: "public" }
    });
    
    if (!publicRole) {
      console.log("❌ Public role not found");
      return;
    }
    
    const permissions = [
      "api::product.product.find",
      "api::product.product.findOne",
      "api::category.category.find",
      "api::category.category.findOne",
      "api::order.order.create"
    ];
    
    for (const action of permissions) {
      const existingPermission = await strapi.query("plugin::users-permissions.permission").findOne({
        where: { action }
      });
      
      if (!existingPermission) {
        const newPermission = await strapi.query("plugin::users-permissions.permission").create({
          data: { action }
        });
        
        // Link to public role
        await strapi.db.query("plugin::users-permissions.permission").update({
          where: { id: newPermission.id },
          data: { role: publicRole.id }
        });
        
        console.log("✅ Created permission:", action);
      } else {
        console.log("⏭️ Permission exists:", action);
      }
    }
    
    console.log("✅ Public permissions setup complete!");
  };
  
  return plugin;
};
