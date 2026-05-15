module.exports = ({ env }) => {
  const client = env("DATABASE_CLIENT", "sqlite");

  const connection = client === "postgres"
    ? {
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "gp_strapi"),
        user: env("DATABASE_USERNAME", "gp_admin"),
        password: env("DATABASE_PASSWORD", ""),
        ssl: env.bool("DATABASE_SSL", false) ? { rejectUnauthorized: false } : false,
      }
    : {
        filename: env("DATABASE_FILENAME", ".tmp/data.db"),
      };

  return {
    connection: {
      client,
      connection,
      debug: false,
      useNullAsDefault: true,
      pool: { min: 2, max: 10 },
    },
  };
};
