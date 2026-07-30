const assert = require("node:assert/strict");
const {
  COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  ownerSubjectForSession,
  resolveBuilderOwner,
} = require("../api/_promo-builder-auth");

const created = createSessionToken(1_000);
const verified = verifySessionToken(created.token, 1_001);
assert.equal(verified.sessionId, created.sessionId);
assert.equal(verifySessionToken(`${created.token}x`, 1_001), null);
assert.equal(verifySessionToken(created.token, created.expiresAt + 1), null);
assert.match(ownerSubjectForSession(created.sessionId), /^anon:[a-f0-9]{64}$/);

const headers = {};
const response = { setHeader(name, value) { headers[name] = value; } };
const owner = resolveBuilderOwner({ headers: {} }, response, { issue: true });
assert.equal(owner.authenticated, false);
assert.match(headers["Set-Cookie"], new RegExp(`^${COOKIE_NAME}=`));
assert.match(headers["Set-Cookie"], /HttpOnly/);
assert.match(headers["Set-Cookie"], /SameSite=Lax/);

assert.throws(
  () => resolveBuilderOwner({ headers: {} }, response),
  /valid Builder session/,
);

console.log("Promo Builder auth tests passed");
