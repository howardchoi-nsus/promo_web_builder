const KEY_VISUAL_TEXT_MODES = Object.freeze(["none", "explicit"]);
const MAX_KEY_VISUAL_TEXT_LENGTH = 40;
const MAX_KEY_VISUAL_TEXT_WORDS = 4;

function normalizeKeyVisualTextPolicy(input = {}, registeredContent = {}, targetType = "section-background") {
  if (targetType !== "section-background") return { mode: "none", text: "" };
  const rawMode = String(input.keyVisualTextMode || input.mode || "none").trim().toLowerCase();
  if (!KEY_VISUAL_TEXT_MODES.includes(rawMode)) {
    throw contractError("keyVisualTextMode must be one of: none, explicit");
  }

  const text = String(input.keyVisualText || input.text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (rawMode === "none") return { mode: "none", text: "" };
  if (!text) throw contractError("Explicit key visual text is required");
  if (text.length > MAX_KEY_VISUAL_TEXT_LENGTH) {
    throw contractError(`Key visual text must be ${MAX_KEY_VISUAL_TEXT_LENGTH} characters or fewer`);
  }
  if (text.split(/\s+/).filter(Boolean).length > MAX_KEY_VISUAL_TEXT_WORDS) {
    throw contractError(`Key visual text must be ${MAX_KEY_VISUAL_TEXT_WORDS} words or fewer`);
  }

  const normalizedText = comparableText(text);
  const conflicts = collectRegisteredStrings(registeredContent)
    .filter((value) => {
      const normalizedValue = comparableText(value);
      if (!normalizedValue || !normalizedText) return false;
      if (normalizedValue === normalizedText) return true;
      return normalizedValue.length >= 3
        && normalizedText.length >= 3
        && (normalizedValue.includes(normalizedText) || normalizedText.includes(normalizedValue));
    });
  if (conflicts.length) {
    throw contractError("Key visual text must not reproduce registered title, lead, description, or CTA content");
  }
  return { mode: "explicit", text };
}

function collectRegisteredStrings(value, result = []) {
  if (typeof value === "string") {
    if (value.trim()) result.push(value.trim());
    return result;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectRegisteredStrings(item, result));
    return result;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectRegisteredStrings(item, result));
  }
  return result;
}

function comparableText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}\s]+/gu, "");
}

function contractError(message) {
  const error = new Error(message);
  error.statusCode = 422;
  error.code = "KEY_VISUAL_TEXT_POLICY_INVALID";
  return error;
}

module.exports = {
  KEY_VISUAL_TEXT_MODES,
  MAX_KEY_VISUAL_TEXT_LENGTH,
  MAX_KEY_VISUAL_TEXT_WORDS,
  normalizeKeyVisualTextPolicy,
};
