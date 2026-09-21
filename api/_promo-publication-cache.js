const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function revalidationConfig(env = process.env) {
  const endpoint = String(env.NUXT_REVALIDATE_URL || "").trim();
  const secret = String(env.NUXT_REVALIDATE_SECRET || "");
  if (!endpoint && !secret) return { enabled: false, reason: "not_configured" };
  if (!endpoint || !secret) return { enabled: false, reason: "incomplete_config" };

  let url;
  try {
    url = new URL(endpoint);
  } catch {
    return { enabled: false, reason: "invalid_url" };
  }
  const hosted = Boolean(env.VERCEL) || ["preview", "production"].includes(
    String(env.VERCEL_ENV || env.NODE_ENV || "").trim().toLowerCase(),
  );
  const localHost = LOCAL_HOSTS.has(url.hostname.toLowerCase());
  if (url.protocol !== "https:" && !(localHost && !hosted)) {
    return { enabled: false, reason: "https_required" };
  }
  if (url.username || url.password || url.search || url.hash) {
    return { enabled: false, reason: "unsafe_url" };
  }
  return { enabled: true, endpoint: url.toString(), secret };
}

async function invalidatePublicationCache(input, options = {}) {
  const config = revalidationConfig(options.env || process.env);
  if (!config.enabled) {
    return {
      status: config.reason === "not_configured" ? "skipped" : "failed",
      reason: config.reason,
    };
  }

  const fetchImpl = options.fetchImpl || globalThis.fetch;
  try {
    const response = await fetchImpl(config.endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-promo-revalidate-secret": config.secret,
      },
      redirect: "error",
      signal: AbortSignal.timeout(Number(options.timeoutMs || 5_000)),
      body: JSON.stringify({
        slug: String(input.slug || "").trim().toLowerCase(),
        locale: String(input.locale || "ko-KR").trim(),
        reason: String(input.reason || "publication_changed").trim(),
      }),
    });
    if (!response.ok) {
      return { status: "failed", reason: `http_${response.status}` };
    }
    return { status: "completed" };
  } catch (error) {
    return {
      status: "failed",
      reason: error?.name === "TimeoutError" ? "timeout" : "request_failed",
    };
  }
}

module.exports = {
  invalidatePublicationCache,
  revalidationConfig,
};
