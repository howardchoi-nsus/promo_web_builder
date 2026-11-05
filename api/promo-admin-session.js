const {
  ADMIN_SESSION_MAX_AGE_SECONDS,
  adminAccessKey,
  adminCookieValue,
  adminSecret,
  clearAdminCookie,
  createAdminSessionToken,
  resolveAdminOwner,
  verifyAdminAccessKey,
} = require("./_promo-admin-auth");

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function requestHost(req) {
  return String(req.headers?.["x-forwarded-host"] || req.headers?.host || "").split(",")[0].trim();
}

function assertSameOrigin(req) {
  const origin = String(req.headers?.origin || "").trim();
  if (!origin) return;
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    // Invalid origins are rejected below.
  }
  if (!originHost || originHost !== requestHost(req)) {
    throw Object.assign(new Error("Admin session requests must use the same origin"), {
      statusCode: 403,
      code: "ADMIN_SESSION_ORIGIN_INVALID",
    });
  }
}

function requireConfiguration(env) {
  if (adminSecret(env) && adminAccessKey(env)) return;
  throw Object.assign(new Error("Admin authentication is not configured"), {
    statusCode: 503,
    code: "ADMIN_AUTH_NOT_CONFIGURED",
  });
}

function createHandler({ env = process.env } = {}) {
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "private, no-store");
    try {
      if (req.method === "GET") {
        requireConfiguration(env);
        const admin = resolveAdminOwner(req, res, { env });
        return res.status(200).json({
          ok: true,
          authenticated: true,
          subject: admin.actorSubject,
          roles: admin.roles,
          expiresAt: admin.expiresAt,
        });
      }

      if (req.method === "POST") {
        requireConfiguration(env);
        assertSameOrigin(req);
        const body = parseBody(req.body);
        if (!verifyAdminAccessKey(body.accessKey, env)) {
          return res.status(401).json({
            error: "Administrator authentication failed",
            code: "ADMIN_ACCESS_DENIED",
          });
        }
        const subject = String(env.PROMO_ADMIN_SUBJECT || "promo-admin").trim() || "promo-admin";
        const token = createAdminSessionToken({
          subject,
          ttlSeconds: ADMIN_SESSION_MAX_AGE_SECONDS,
        }, env);
        res.setHeader("Set-Cookie", adminCookieValue(token, { env }));
        return res.status(200).json({
          ok: true,
          authenticated: true,
          subject,
          roles: ["admin"],
          expiresAt: new Date(Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000).toISOString(),
        });
      }

      if (req.method === "DELETE") {
        assertSameOrigin(req);
        res.setHeader("Set-Cookie", clearAdminCookie(env));
        return res.status(200).json({ ok: true, authenticated: false });
      }

      res.setHeader("Allow", "GET, POST, DELETE");
      return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
      const missingSession = error.code === "ADMIN_SESSION_REQUIRED";
      return res.status(missingSession ? 401 : error.statusCode || 500).json({
        error: error.message,
        code: error.code || null,
        authenticated: false,
      });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
