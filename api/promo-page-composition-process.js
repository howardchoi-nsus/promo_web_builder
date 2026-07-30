const { timingSafeEqual, createHmac } = require("node:crypto");
const { parseBody } = require("./_wizard-form-templates-store");
const { processCompositionProposal } = require("./_promo-page-composition-service");

function validWorkerToken(req, proposalId) {
  const secret = String(process.env.PROMO_COMPOSITION_WORKER_SECRET || "").trim();
  if (secret.length < 32) return false;
  const supplied = Buffer.from(String(req.headers["x-promo-worker-token"] || ""));
  const expected = Buffer.from(createHmac("sha256", secret).update(proposalId).digest("hex"));
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const body = parseBody(req.body);
  const proposalId = String(body.proposalId || "").trim();
  if (!proposalId || !validWorkerToken(req, proposalId)) {
    return res.status(403).json({ error: "Worker authorization failed" });
  }
  res.setHeader("Cache-Control", "no-store");
  const result = await processCompositionProposal(proposalId);
  return res.status(result.ok ? 200 : result.skipped ? 409 : 502).json(result);
};

module.exports.validWorkerToken = validWorkerToken;
