const MANAGED_TOKEN_KEY = /^--(?:promo|app)-[a-z0-9-]+$/;

export function normalizePromoTokenValues(input) {
  if (Array.isArray(input)) {
    const grouped = new Map();
    input.forEach((entry) => {
      const key = String(entry?.tokenKey || entry?.token_key || "").trim();
      const value = String(entry?.value ?? entry?.tokenValue ?? entry?.token_value ?? "").trim();
      if (!MANAGED_TOKEN_KEY.test(key) || !value) return;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push({
        value,
        valueIndex: Math.max(0, Number.parseInt(entry?.valueIndex ?? entry?.value_index ?? 0, 10) || 0),
      });
    });
    return Object.fromEntries([...grouped.entries()].map(([key, entries]) => [
      key,
      entries.sort((left, right) => left.valueIndex - right.valueIndex)
        .map((entry) => entry.value).join(", "),
    ]));
  }
  if (!input || typeof input !== "object") return {};
  return Object.fromEntries(Object.entries(input)
    .map(([key, value]) => [String(key).trim(), String(value ?? "").trim()])
    .filter(([key, value]) => MANAGED_TOKEN_KEY.test(key) && value));
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
  const backgroundToken = tokens["--promo-bg"] || tokens["--app-bg"]
    || tokens["--promo-surface"] || tokens["--app-surface"];
  const textToken = tokens["--promo-text"] || tokens["--app-ink"];
  const mutedToken = tokens["--promo-muted"] || tokens["--app-muted"];
  const accentToken = tokens["--promo-accent"] || tokens["--app-accent"];
  const radiusToken = tokens["--promo-radius"] || tokens["--app-radius"];
  const shadowToken = tokens["--promo-shadow"] || tokens["--app-shadow"];

  return {
    "--promo-bg": backgroundToken || background,
    "--promo-ink": textToken || text,
    "--promo-muted-ink": mutedToken || muted,
    "--promo-accent": accentToken || accent,
    "--promo-cta": `var(--promo-accent, ${cta})`,
    "--promo-cta-bg": fallbacks.ctaTransparent === true ? "transparent" : `var(--promo-accent, ${cta})`,
    "--promo-cta-ink": fallbacks.ctaTransparent === true ? `var(--promo-accent, ${cta})` : ctaInk,
    "--promo-cta-radius": radiusToken || radius,
    "--promo-image-radius": radiusToken || radius,
    "--promo-component-radius": radiusToken || radius,
    "--promo-component-shadow": shadowToken || shadow,
    "--promo-font": tokens["--app-font-body"] || tokens["--app-font-family"]
      || tokens["--promo-font"] || fallbacks.font || "",
    "--promo-radius": radiusToken || radius,
    "--promo-shadow": shadowToken || shadow,
    "--promo-hero-bg-image": tokens["--app-hero-bg-image"] || "none",
    "--promo-button-height": tokens["--app-button-height"] || "44px",
    "--promo-space-4": tokens["--app-space-4"] || "18px",
    "--promo-border-width": tokens["--app-border-width"] || "2px",
    "--promo-font-size-body": tokens["--app-font-size-body"] || "16px",
    "--promo-title-size": tokens["--promo-font-size-main-title"]
      || tokens["--promo-title-size"] || fallbacks.titleSize || "clamp(28px, 5vw, 72px)",
    "--promo-font-weight-strong": tokens["--app-font-weight-strong"] || "800",
    "--promo-transition-duration": tokens["--app-transition-duration-normal"] || "200ms",
    "--promo-transition-delay": tokens["--app-transition-delay"] || "0ms",
    "--promo-transition-ease": tokens["--app-ease"] || "ease",
    ...tokens,
  };
}
