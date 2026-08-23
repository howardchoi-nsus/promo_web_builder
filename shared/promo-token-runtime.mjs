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
  const first = (...values) => values.map((value) => String(value || "").trim()).find(Boolean) || "";
  const background = first(tokens["--promo-bg"], tokens["--app-bg"], tokens["--promo-surface"], tokens["--app-surface"], fallbacks.background);
  const text = first(tokens["--promo-text"], tokens["--app-ink"], tokens["--app-text"], fallbacks.text);
  const muted = first(tokens["--promo-muted"], tokens["--app-muted"], tokens["--app-ink-soft"], fallbacks.muted);
  const accent = first(tokens["--promo-accent"], tokens["--app-accent"], fallbacks.accent, fallbacks.cta);
  const ctaInk = first(tokens["--app-on-accent"], fallbacks.ctaInk, text);
  const radius = first(tokens["--promo-radius"], tokens["--app-radius"], fallbacks.radius);
  const shadow = first(tokens["--promo-shadow"], tokens["--app-shadow"], fallbacks.shadow);
  const font = first(tokens["--app-font-body"], tokens["--app-font-family"], tokens["--promo-font"], fallbacks.font);
  const style = { ...tokens };
  const set = (key, value) => { if (value) style[key] = value; };

  set("--promo-bg", background);
  set("--promo-ink", text);
  set("--promo-muted-ink", muted);
  set("--promo-accent", accent);
  set("--promo-cta", accent ? "var(--promo-accent)" : "");
  set("--promo-cta-bg", fallbacks.ctaTransparent === true ? "transparent" : (accent ? "var(--promo-accent)" : ""));
  set("--promo-cta-ink", fallbacks.ctaTransparent === true && accent ? "var(--promo-accent)" : ctaInk);
  set("--promo-cta-radius", radius);
  set("--promo-image-radius", radius);
  set("--promo-component-radius", radius);
  set("--promo-component-shadow", shadow);
  set("--promo-font", font);
  set("--promo-radius", radius);
  set("--promo-shadow", shadow);
  set("--promo-hero-bg-image", tokens["--app-hero-bg-image"]);
  set("--promo-button-height", tokens["--app-button-height"]);
  set("--promo-space-4", tokens["--app-space-4"]);
  set("--promo-border-width", tokens["--app-border-width"]);
  set("--promo-font-size-body", first(tokens["--promo-font-size-body"], tokens["--app-font-size-body"], "1rem"));
  set("--promo-title-size", first(tokens["--promo-font-size-main-title"], tokens["--promo-title-size"], fallbacks.titleSize));
  set("--promo-font-weight-strong", tokens["--app-font-weight-strong"]);
  set("--promo-transition-duration", tokens["--app-transition-duration-normal"]);
  set("--promo-transition-delay", tokens["--app-transition-delay"]);
  set("--promo-transition-ease", tokens["--app-ease"]);
  return style;
}
