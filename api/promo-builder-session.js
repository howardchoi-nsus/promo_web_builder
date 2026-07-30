const { resolveBuilderOwner } = require("./_promo-builder-auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveBuilderOwner(req, res, { issue: true });
    return res.status(200).json({
      ok: true,
      session: {
        authenticated: owner.authenticated,
        expiresAt: owner.expiresAt,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Builder session failed",
      code: error.code || null,
      message: error.message,
    });
  }
};
