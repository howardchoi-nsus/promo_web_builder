const assert = require("node:assert/strict");
const { requirePromoServiceV3, suppliedToken } = require("../api/_promo-service-v3-auth");

const token = "v3-service-token-which-is-at-least-32-characters";
assert.equal(suppliedToken({ headers: { authorization: `Bearer ${token}` } }), token);
assert.equal(requirePromoServiceV3(
  { headers: { authorization: `Bearer ${token}` } },
  { env: { VERCEL_ENV: "preview", PROMO_SERVICE_V3_TOKEN: token } },
).authenticated, true);
assert.throws(() => requirePromoServiceV3(
  { headers: { authorization: "Bearer wrong" } },
  { env: { VERCEL_ENV: "preview", PROMO_SERVICE_V3_TOKEN: token } },
), (error) => error.statusCode === 403 && error.code === "PROMO_SERVICE_V3_AUTH_REQUIRED");
assert.throws(() => requirePromoServiceV3(
  { headers: {} },
  { env: { VERCEL_ENV: "production" } },
), (error) => error.statusCode === 503 && error.code === "PROMO_SERVICE_V3_AUTH_NOT_CONFIGURED");
assert.equal(requirePromoServiceV3(
  { headers: {} },
  { env: { PROMO_SERVICE_V3_LOCAL_ACCESS_ENABLED: "true" } },
).localOnly, true);

console.log("Promo service V3 authentication tests passed");
