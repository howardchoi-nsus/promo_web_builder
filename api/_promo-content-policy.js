const CTA_LABEL_MAX_CHARACTERS = 20;

function contentCharacters(value) {
  return Array.from(String(value ?? ""));
}

function contentCharacterLength(value) {
  return contentCharacters(value).length;
}

function normalizeCtaLabel(value, { allowEmpty = true } = {}) {
  const label = String(value ?? "").trim().replace(/\s+/g, " ");
  if (!label && !allowEmpty) {
    throw Object.assign(new Error("CTA label is required"), {
      code: "CTA_LABEL_REQUIRED",
      statusCode: 422,
    });
  }
  if (contentCharacterLength(label) > CTA_LABEL_MAX_CHARACTERS) {
    throw Object.assign(new Error(`CTA label must not exceed ${CTA_LABEL_MAX_CHARACTERS} characters`), {
      code: "CTA_LABEL_TOO_LONG",
      statusCode: 422,
      maxCharacters: CTA_LABEL_MAX_CHARACTERS,
    });
  }
  return label;
}

module.exports = {
  CTA_LABEL_MAX_CHARACTERS,
  contentCharacterLength,
  normalizeCtaLabel,
};
