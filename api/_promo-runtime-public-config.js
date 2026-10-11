const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function runtimePublicConfig(env = process.env) {
  const raw = String(env.PROMO_RUNTIME_PUBLIC_URL || "").trim();
  if (!raw) return { publicUrl: "", configured: false, reason: "not_configured" };
  let url;
  try {
    url = new URL(raw);
  } catch {
    return { publicUrl: "", configured: false, reason: "invalid_url" };
  }
  const hosted = Boolean(env.VERCEL)
    || ["preview", "production"].includes(String(env.VERCEL_ENV || env.NODE_ENV || "").toLowerCase());
  const localHost = LOCAL_HOSTS.has(url.hostname.toLowerCase());
  if (url.protocol !== "https:" && !(localHost && !hosted)) {
    return { publicUrl: "", configured: false, reason: "https_required" };
  }
  if (url.username || url.password || url.search || url.hash) {
    return { publicUrl: "", configured: false, reason: "unsafe_url" };
  }
  if (url.pathname !== "/") return { publicUrl: "", configured: false, reason: "origin_required" };
  return { publicUrl: url.origin, configured: true, reason: "" };
}

module.exports = { runtimePublicConfig };
