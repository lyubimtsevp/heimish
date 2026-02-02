"use strict";

module.exports = {
  register({ strapi }) {},

  async bootstrap({ strapi }) {
    console.log("=== Strapi bootstrap hook ===");

    const publicRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (publicRole) {
      const permissionsToGrant = [
        "plugin::i18n.locales.listLocales",
        "api::product.product.find",
        "api::product.product.findOne",
        "api::product.product.create",
        "api::review.review.find",
        "api::review.review.findOne",
        "api::banner.banner.find",
        "api::banner.banner.findOne",
        "api::faq.faq.find",
        "api::faq.faq.findOne",
        "api::video.video.find",
        "api::video.video.findOne",
      ];

      for (const action of permissionsToGrant) {
        const existingPermission = await strapi
          .query("plugin::users-permissions.permission")
          .findOne({
            where: {
              role: publicRole.id,
              action: action,
            },
          });

        if (!existingPermission) {
          await strapi.query("plugin::users-permissions.permission").create({
            data: {
              action: action,
              role: publicRole.id,
            },
          });
          console.log("Added permission:", action);
        }
      }
    }
  },
};
