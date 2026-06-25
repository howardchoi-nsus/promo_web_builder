function buildPostgresUrlFromParts(env) {
  const host = env.PGHOST || env.POSTGRES_HOST;
  const database = env.PGDATABASE || env.POSTGRES_DATABASE;
  const user = env.PGUSER || env.POSTGRES_USER;
  const password = env.PGPASSWORD || env.POSTGRES_PASSWORD;
  const port = env.PGPORT || env.POSTGRES_PORT || "5432";

  if (!host || !database || !user || !password) return "";

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  return `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${database}?sslmode=require`;
}

function getDatabaseUrl() {
  return (
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    buildPostgresUrlFromParts(process.env)
  );
}

module.exports = {
  getDatabaseUrl,
};
