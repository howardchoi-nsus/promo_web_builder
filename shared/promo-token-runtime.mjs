const PROMO_TOKEN_KEY = /^--promo-[a-z0-9-]+$/;

export function normalizePromoTokenValues(input) {
  if (Array.isArray(input)) {
    return Object.fromEntries(input
      .map((entry) => [
        String(entry?.tokenKey || entry?.token_key || "").trim(),
        String(entry?.value ?? entry?.tokenValue ?? entry?.token_value ?? "").trim(),
      ])
      .filter(([key, value]) => PROMO_TOKEN_KEY.test(key) && value));
  }
  if (!input || typeof input !== "object") return {};
  return Object.fromEntries(Object.entries(input)
    .map(([key, value]) => [String(key).trim(), String(value ?? "").trim()])
    .filter(([key, value]) => PROMO_TOKEN_KEY.test(key) && value));
}

export function createPromoTokenRuntimeStyle(input, fallbacks = {}) {
  const tokens = normalizePromoTokenValues(input);
  const background = String(fallbacks.background || "#f5f7fb");
  const text = String(fallbacks.text || "#172033");
  const muted = String(fallbacks.muted || "#64748b");
  const accent = String(fallbacks.accent || "#2563eb");
  const cta = String(fallbacks.cta || accent);
  const ctaInk = String(fallbacks.ctaInk || "#ffffff");
  const radius = String(fallbacks.radius || "2px");
  const shadow = String(fallbacks.shadow || "0 10px 32px rgba(33, 43, 61, .12)");

  return {
    "--promo-bg": `var(--promo-surface, ${background})`,
    "--promo-ink": `var(--promo-text, ${text})`,
    "--promo-muted-ink": `var(--promo-muted, ${muted})`,
    "--promo-accent": `var(--promo-accent-token, ${accent})`,
    "--promo-cta": `var(--promo-accent, ${cta})`,
    "--promo-cta-bg": fallbacks.ctaTransparent === true ? "transparent" : `var(--promo-accent, ${cta})`,
    "--promo-cta-ink": fallbacks.ctaTransparent === true ? `var(--promo-accent, ${cta})` : ctaInk,
    "--promo-cta-radius": `var(--promo-radius, ${radius})`,
    "--promo-image-radius": `var(--promo-radius, ${radius})`,
    "--promo-component-radius": `var(--promo-radius, ${radius})`,
    "--promo-component-shadow": `var(--promo-shadow, ${shadow})`,
    ...tokens,
    ...(tokens["--promo-accent"] ? { "--promo-accent-token": tokens["--promo-accent"] } : {}),
  };
}

