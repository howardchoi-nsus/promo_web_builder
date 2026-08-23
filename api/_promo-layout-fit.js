function normalizedText(value) {
  return String(value || "").trim().toLowerCase();
}

function uniqueLayoutKeys(values = [], limit = 20) {
  return [...new Set((Array.isArray(values) ? values : [])
    .map((value) => String(value || "").trim())
    .filter(Boolean))].slice(0, limit);
}

function recentLayoutSelectionsFromSnapshot(snapshot = {}) {
  const stored = snapshot?.compositionMeta?.layoutSelectionHistory;
  const history = {};
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    Object.entries(stored).forEach(([sectionKey, layoutKeys]) => {
      const normalized = uniqueLayoutKeys(layoutKeys);
      if (sectionKey && normalized.length) history[sectionKey] = normalized;
    });
  }
  const sections = Array.isArray(snapshot?.content?.sectionSnapshot)
    ? snapshot.content.sectionSnapshot
    : [];
  sections.forEach((section) => {
    const sectionKey = String(section?.sourceSectionKey || section?.sectionKey || "").trim();
    const layoutKey = String(section?.selectedLayoutKey || "").trim();
    if (!sectionKey || !layoutKey) return;
    history[sectionKey] = uniqueLayoutKeys([layoutKey, ...(history[sectionKey] || [])]);
  });
  return history;
}

function recentLayoutSelectionsFromSnapshots(snapshots = []) {
  const combined = {};
  (Array.isArray(snapshots) ? snapshots : []).filter(Boolean).forEach((snapshot) => {
    const selections = recentLayoutSelectionsFromSnapshot(snapshot);
    Object.entries(selections).forEach(([sectionKey, layoutKeys]) => {
      combined[sectionKey] = uniqueLayoutKeys([...(combined[sectionKey] || []), ...layoutKeys]);
    });
  });
  return combined;
}

function visualLength(value) {
  return Array.from(String(value || "")).reduce((length, character) => {
    if (/\s/u.test(character)) return length + 0.35;
    if (/[^\u0000-\u00ff]/u.test(character)) return length + 1.8;
    return length + 1;
  }, 0);
}

function capacityFor(value, [shortLimit, mediumLimit]) {
  const length = visualLength(value);
  if (!length) return "auto";
  if (length <= shortLimit) return "short";
  if (length <= mediumLimit) return "medium";
  return "long";
}

function distanceScore(actual, expected, exactScore, adjacentScore, mismatchScore) {
  if (actual === "auto" || expected === "auto") return 0;
  const order = ["short", "medium", "long"];
  const distance = Math.abs(order.indexOf(actual) - order.indexOf(expected));
  if (distance === 0) return exactScore;
  if (distance === 1) return adjacentScore;
  return mismatchScore;
}

function widthCapacity(widthProfile) {
  if (widthProfile === "compact") return "short";
  if (widthProfile === "balanced") return "medium";
  if (["wide", "full"].includes(widthProfile)) return "long";
  return "auto";
}

function complexityFor(overview = {}) {
  const populated = ["title", "leadText", "mainOffer", "ctaLabel", "audience"]
    .filter((key) => normalizedText(overview[key])).length;
  if (populated <= 2) return "low";
  if (populated <= 4) return "medium";
  return "high";
}

function scorePurposeTags(tags, { headlineCapacity, bodyCapacity, overviewText, hasCta }) {
  let score = 0;
  const reasons = [];
  const add = (points, reason) => {
    score += points;
    reasons.push(reason);
  };
  for (const tagValue of tags) {
    const tag = normalizedText(tagValue);
    if (!tag) continue;
    if (tag === "short-copy" && headlineCapacity === "short" && bodyCapacity !== "long") add(18, "short-copy-fit");
    else if (tag === "long-headline" && headlineCapacity === "long") add(22, "long-headline-fit");
    else if (tag === "long-copy" && bodyCapacity === "long") add(22, "long-copy-fit");
    else if (tag === "general" && headlineCapacity === "medium") add(10, "general-copy-fit");
    else if (tag === "offer" && normalizedText(overviewText.mainOffer)) add(8, "offer-fit");
    else if (tag === "right-cta" && hasCta && bodyCapacity === "long") add(12, "right-cta-fit");
    else if (tag === "brand-intro" && /brand|branding|브랜드/u.test(overviewText.combined)) add(20, "brand-intro-fit");
    else if (tag.length >= 3 && overviewText.combined.includes(tag)) add(8, `purpose:${tag}`);
  }
  return { score, reasons };
}

function scoreLayoutPreset(layout = {}, overview = {}, sectionRole = "") {
  const metadata = layout.selectionMetadata || {};
  const headlineCapacity = capacityFor(overview.title, [30, 60]);
  const bodyCapacity = capacityFor(overview.leadText || overview.mainOffer, [90, 210]);
  const contentComplexity = complexityFor(overview);
  const overviewText = {
    mainOffer: normalizedText(overview.mainOffer),
    combined: [
      overview.promotionPurpose, overview.promotionPurposeOther, overview.campaignTone,
      overview.audience, overview.mainOffer,
    ].map(normalizedText).filter(Boolean).join(" "),
  };
  const hasSignal = [
    metadata.headlineCapacity, metadata.bodyCapacity, metadata.widthProfile,
    metadata.contentComplexity, metadata.mobileStrategy, metadata.visualEmphasis,
  ].some((value) => value && value !== "auto") || (metadata.purposeTags || []).length;
  if (!hasSignal) return { layoutKey: layout.layoutKey, score: 0, reasons: ["metadata-insufficient"] };

  let score = 0;
  const reasons = [];
  const add = (points, reason) => {
    score += points;
    if (points > 0) reasons.push(reason);
  };
  add(distanceScore(headlineCapacity, metadata.headlineCapacity || "auto", 32, 8, -24), "headline-capacity");
  add(distanceScore(bodyCapacity, metadata.bodyCapacity || "auto", 24, 6, -18), "body-capacity");
  add(distanceScore(headlineCapacity, widthCapacity(metadata.widthProfile), 22, 6, -16), "width-profile");
  add(distanceScore(contentComplexity, metadata.contentComplexity || "auto", 16, 4, -12), "content-complexity");

  const purpose = scorePurposeTags(metadata.purposeTags || [], {
    headlineCapacity, bodyCapacity, overviewText, hasCta: Boolean(normalizedText(overview.ctaLabel)),
  });
  score += purpose.score;
  reasons.push(...purpose.reasons);

  if (headlineCapacity === "long" && ["copy-first", "media-after-copy", "stack"].includes(metadata.mobileStrategy)) {
    add(10, "mobile-long-copy");
  }
  if (sectionRole === "hero" && metadata.ctaProminence === "high" && normalizedText(overview.ctaLabel)) {
    add(8, "hero-cta-prominence");
  }
  const weight = Number(metadata.selectionWeight || 1);
  score += Number.isFinite(weight) ? Math.round((weight - 1) * 5) : 0;
  if (layout.isDefault) score += 1;
  return { layoutKey: layout.layoutKey, score, reasons: [...new Set(reasons)].slice(0, 8) };
}

function evaluateLayoutFit({
  layouts = [], overview = {}, sectionRole = "", defaultLayoutKey = "", recentLayoutKeys = [],
} = {}) {
  const scores = layouts.map((layout) => scoreLayoutPreset(layout, overview, sectionRole));
  const informative = scores.some((entry) => !entry.reasons.includes("metadata-insufficient"));
  const sorted = [...scores].sort((left, right) => (
    right.score - left.score
    || Number(right.layoutKey === defaultLayoutKey) - Number(left.layoutKey === defaultLayoutKey)
    || String(left.layoutKey).localeCompare(String(right.layoutKey))
  ));
  const layoutsByKey = new Map(layouts.map((layout) => [layout.layoutKey, layout]));
  const recentWindow = uniqueLayoutKeys(recentLayoutKeys)
    .filter((layoutKey) => layoutsByKey.has(layoutKey))
    .slice(0, Math.max(1, layouts.length - 1));
  const recentSet = new Set(recentWindow);
  const diversified = sorted.filter((entry) => (
    !recentSet.has(entry.layoutKey)
    || layoutsByKey.get(entry.layoutKey)?.selectionMetadata?.avoidImmediateRepeat !== true
  ));
  const recommended = diversified[0] || sorted[0];
  return {
    recommendedLayoutKey: informative ? (recommended?.layoutKey || defaultLayoutKey) : defaultLayoutKey,
    fitRecommendedLayoutKey: informative ? (sorted[0]?.layoutKey || defaultLayoutKey) : defaultLayoutKey,
    recentLayoutKeys: recentWindow,
    repeatAvoided: Boolean(recommended?.layoutKey && recommended.layoutKey !== sorted[0]?.layoutKey),
    scores,
  };
}

function applyLayoutFitRecommendations(result = {}, candidates = {}, {
  defaultOverrideThreshold = 8,
  strongOverrideThreshold = 30,
} = {}) {
  const sectionsById = new Map((candidates.sections || []).map((section) => [section.sectionVersionId, section]));
  const repairs = [];
  const sections = (Array.isArray(result.sections) ? result.sections : []).map((planned) => {
    const section = sectionsById.get(planned.sectionVersionId);
    const fit = section?.layoutFit;
    if (!section || section.layoutSelectionLocked || !fit?.recommendedLayoutKey) return planned;
    if (planned.layoutKey === fit.recommendedLayoutKey) return planned;
    const byKey = new Map((fit.scores || []).map((entry) => [entry.layoutKey, entry]));
    const selectedScore = Number(byKey.get(planned.layoutKey)?.score || 0);
    const recommendedScore = Number(byKey.get(fit.recommendedLayoutKey)?.score || 0);
    const delta = recommendedScore - selectedScore;
    const selectedDefault = planned.layoutKey === section.defaultLayoutKey;
    const selectedLayout = (section.layoutPresets || []).find((layout) => layout.layoutKey === planned.layoutKey);
    const repeatedLayout = (fit.recentLayoutKeys || []).includes(planned.layoutKey)
      && selectedLayout?.selectionMetadata?.avoidImmediateRepeat === true;
    if (!repeatedLayout
      && (!selectedDefault || delta < defaultOverrideThreshold)
      && delta < strongOverrideThreshold) return planned;
    repairs.push({
      sectionVersionId: planned.sectionVersionId,
      fromLayoutKey: planned.layoutKey,
      toLayoutKey: fit.recommendedLayoutKey,
      scoreDelta: delta,
    });
    return { ...planned, layoutKey: fit.recommendedLayoutKey };
  });
  if (!repairs.length) return { result, repairs };
  const warnings = Array.isArray(result.warnings) ? [...result.warnings] : [];
  repairs.forEach((repair) => warnings.push(
    `Layout fit repair: ${repair.fromLayoutKey} -> ${repair.toLayoutKey} (${repair.scoreDelta >= 0 ? "+" : ""}${repair.scoreDelta})`,
  ));
  return { result: { ...result, sections, warnings: warnings.slice(0, 30) }, repairs };
}

module.exports = {
  applyLayoutFitRecommendations,
  capacityFor,
  evaluateLayoutFit,
  recentLayoutSelectionsFromSnapshot,
  recentLayoutSelectionsFromSnapshots,
  scoreLayoutPreset,
  uniqueLayoutKeys,
  visualLength,
};
