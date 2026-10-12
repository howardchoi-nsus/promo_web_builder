const finalDesignHandler = require("./promo-generation-final-designs");

// Versioned public entrypoint. The shared persistence/callback implementation stays
// in promo-generation-final-designs so v1 result retrieval remains compatible.
module.exports = async function handler(req, res) {
  if (req.method === "POST") {
    let body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    if (typeof req.body === "string") {
      try {
        body = JSON.parse(req.body);
      } catch {
        body = {};
      }
    }
    req.body = { ...body, pipelineVersion: "v2" };
  }
  return finalDesignHandler(req, res);
};
