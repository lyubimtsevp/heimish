export default ({ env }) => ({
  documentation: {
    enabled: true,
    config: {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Heimish API",
        description: "API интернет-магазина Heimish",
      },
    },
  },
  seo: {
    enabled: true,
  },
  "color-picker": {
    enabled: true,
  },
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        product: {
          field: "slug",
          references: "title",
        },
      },
    },
  },
  i18n: {
    enabled: true,
    config: {
      defaultLocale: "ru",
      locales: ["ru", "en"],
    },
  },
});
