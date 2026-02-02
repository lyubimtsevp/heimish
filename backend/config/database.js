module.exports = ({ env }) => ({
  connection: {
    client: "mysql",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 3306),
      database: env("DATABASE_NAME", "heimish_db"),
      user: env("DATABASE_USERNAME", "heimish"),
      password: env("DATABASE_PASSWORD", "HeimishDB2025!"),
      ssl: false,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
});
