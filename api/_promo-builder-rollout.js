const { createHash } = require("node:crypto");

function percent(value, fallback = 100) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(100, parsed));
}

function rolloutBucket(ownerSubject, namespace = "builder") {
  const digest = createHash("sha256").update(`${namespace}:${ownerSubject}`).digest();
  return digest.readUInt32BE(0) % 100;
}

function requireBuilderRollout(ownerSubject, {
  env = process.env,
  envName = "PROMO_BUILDER_EXPORT_ROLLOUT_PERCENT",
  namespace = "builder-export",
} = {}) {
  const allowedPercent = percent(env[envName], 100);
  if (allowedPercent < 100 && rolloutBucket(ownerSubject, namespace) >= allowedPercent) {
    const error = new Error("Builder feature is not enabled for this rollout group");
    error.statusCode = 404;
    error.code = "BUILDER_ROLLOUT_NOT_ENABLED";
    throw error;
  }
  return true;
}

module.exports = { percent, rolloutBucket, requireBuilderRollout };
