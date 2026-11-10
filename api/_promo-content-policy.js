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

function safePromotionCtaLink(value) {
  const link = String(value || "").trim();
  if (!link || /[\s\\\u0000-\u001f\u007f]/u.test(link) || link.startsWith("//")) return "";
  if (/^(?:\/(?!\/)|#)/u.test(link)) return link;
  try {
    const url = new URL(link);
    return ["http:", "https:"].includes(url.protocol) ? link : "";
  } catch { return ""; }
}

function resolveOverviewCtaLink(overview, section, component, label) {
  const sections = (overview.contentSections || []).filter(source =>
    source.sectionKey === section.sectionKey || source.sectionType === section.sectionRole);
  const exactSection = sections.find(source => source.sectionKey === section.sectionKey);
  const scope = exactSection ? [exactSection] : sections;
  const matches = [];
  for (const source of scope) {
    for (const item of source.items || []) {
      if (item.confirmationRequired || item.ctaLabel !== label) continue;
      const link = safePromotionCtaLink(item.ctaUrl);
      if (link) matches.push({link, exact: item.itemKey === component.itemKey || item.itemKey === component.componentKey});
    }
    if (source.cta?.confirmationRequired !== true && source.cta?.label === label) {
      const link = safePromotionCtaLink(source.cta.url);
      if (link) matches.push({link, exact:false});
    }
  }
  const exact = matches.filter(match => match.exact);
  const links = [...new Set((exact.length ? exact : matches).map(match => match.link))];
  // Ambiguous targets must not silently send a customer to an arbitrary URL.
  return links.length === 1 ? links[0] : "";
}

module.exports.safePromotionCtaLink = safePromotionCtaLink;
module.exports.resolveOverviewCtaLink = resolveOverviewCtaLink;
