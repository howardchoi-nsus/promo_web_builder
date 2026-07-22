const assert = require("node:assert/strict");
const { getDatabaseUrl } = require("../api/_db");

assert.equal(
  getDatabaseUrl({
    VERCEL_ENV: "preview",
    PREVIEW_DATABASE_URL: "postgresql://preview-db",
    NEON_DATABASE_URL: "postgresql://managed-neon-db",
    DATABASE_URL: "postgresql://production-db",
  }),
  "postgresql://preview-db",
  "Vercel Preview must use the explicitly isolated Preview database",
);

assert.equal(
  getDatabaseUrl({
    VERCEL_ENV: "production",
    PREVIEW_DATABASE_URL: "postgresql://preview-db",
    NEON_DATABASE_URL: "postgresql://managed-neon-db",
    DATABASE_URL: "postgresql://production-db",
  }),
  "postgresql://managed-neon-db",
  "Production must ignore PREVIEW_DATABASE_URL",
);

assert.equal(
  getDatabaseUrl({
    VERCEL_ENV: "preview",
    PREVIEW_DATABASE_URL: "   ",
    DATABASE_URL: "postgresql://fallback-db",
  }),
  "postgresql://fallback-db",
  "Preview must preserve the existing fallback when its override is empty",
);

assert.equal(
  getDatabaseUrl({
    VERCEL_ENV: "development",
    PGHOST: "localhost",
    PGDATABASE: "promo",
    PGUSER: "developer",
    PGPASSWORD: "secret value",
  }),
  "postgresql://developer:secret%20value@localhost:5432/promo?sslmode=require",
  "Existing local connection-part fallback must remain available",
);

console.log("Database environment selection contract test passed");
