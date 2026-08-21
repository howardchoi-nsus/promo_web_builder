function normalizedLocale(value) {
  return String(value || "").trim().replace(/_/g, "-");
}

function primaryLanguage(value) {
  return normalizedLocale(value).toLowerCase().split("-")[0];
}

export function resolveCompositionLocale(inputLocale, allowedLocales = [], fallbackLocale = "") {
  const allowed = (Array.isArray(allowedLocales) ? allowedLocales : [])
    .map(normalizedLocale)
    .filter(Boolean);
  const requested = normalizedLocale(inputLocale);
  const fallback = normalizedLocale(fallbackLocale);

  if (!allowed.length) return requested || fallback || "ko-KR";

  const exact = allowed.find((locale) => locale.toLowerCase() === requested.toLowerCase());
  if (exact) return exact;
  const requestedLanguage = primaryLanguage(requested);
  const languageMatch = requestedLanguage
    ? allowed.find((locale) => primaryLanguage(locale) === requestedLanguage)
    : null;
  if (languageMatch) return languageMatch;

  const fallbackExact = allowed.find((locale) => locale.toLowerCase() === fallback.toLowerCase());
  if (fallbackExact) return fallbackExact;
  const fallbackLanguage = primaryLanguage(fallback);
  const fallbackMatch = fallbackLanguage
    ? allowed.find((locale) => primaryLanguage(locale) === fallbackLanguage)
    : null;
  return fallbackMatch || allowed[0];
}
