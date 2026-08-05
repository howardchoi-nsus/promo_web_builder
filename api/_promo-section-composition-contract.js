const { normalizeCtaLabel } = require("./_promo-content-policy");
const { createHash } = require("node:crypto");

const ALLOWED_REGIONS = Object.freeze(["left", "center", "right"]);
const SAFE_TOKEN_PROPERTIES = new Set([
  "color", "background-color", "border-color", "border-radius", "border-width",
  "box-shadow", "font-family", "font-size", "font-weight", "line-height",
  "letter-spacing", "padding", "gap", "max-width", "min-height",
]);

function fail(message, code = "INVALID_COMPOSITION_PLAN") {
  const error = new Error(message);
  error.code = code;
  error.statusCode = 422;
  throw error;
}

function canonicalizeForFingerprint(value) {
  if (Array.isArray(value)) return value.map(canonicalizeForFingerprint);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((result, key) => {
      const nextValue = value[key];
      if (typeof nextValue !== "undefined") result[key] = canonicalizeForFingerprint(nextValue);
      return result;
    }, {});
  }
  return value;
}

function stableFingerprint(value) {
  return createHash("sha256").update(JSON.stringify(canonicalizeForFingerprint(value))).digest("hex");
}

function normalizeCompositionSection(value, expectedSectionKey = "") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail("Current section contract is invalid", "INVALID_SECTION_CONTRACT");
  }
  const sectionKey = String(value.sectionKey || "").trim();
  if (!sectionKey || sectionKey.length > 128 || (expectedSectionKey && sectionKey !== expectedSectionKey)) {
    fail("Current section key does not match the requested section", "INVALID_SECTION_CONTRACT");
  }
  const sourceItems = Array.isArray(value.items) ? value.items : [];
  if (!sourceItems.length || sourceItems.length > 200) {
    fail("Current section must contain between 1 and 200 components", "INVALID_SECTION_CONTRACT");
  }
  const itemKeys = new Set();
  const normalizeStyleSlots = (slots) => (Array.isArray(slots) ? slots : []).slice(0, 50).map((slot) => ({
    slotKey: String(slot?.slotKey || "").trim().slice(0, 128),
    semanticRole: String(slot?.semanticRole || "").trim().slice(0, 128),
    aiSelectable: slot?.aiSelectable !== false,
  })).filter((slot) => slot.slotKey && slot.semanticRole);
  const normalizeEditorSchema = (schema) => ({
    ...(Number.isFinite(Number(schema?.maxLength))
      ? { maxLength: Math.max(0, Math.min(10000, Number(schema.maxLength))) }
      : {}),
  });
  const items = sourceItems.map((item) => {
    const itemKey = String(item?.itemKey || "").trim();
    if (!itemKey || itemKey.length > 128 || itemKeys.has(itemKey)) {
      fail("Current section component keys must be present and unique", "INVALID_SECTION_CONTRACT");
    }
    itemKeys.add(itemKey);
    const fieldKind = String(item?.fieldKind || "text").trim().slice(0, 32);
    const sourceFields = Array.isArray(item?.fields) ? item.fields : [];
    if (sourceFields.length > 100) {
      fail("Current section component has too many fields", "INVALID_SECTION_CONTRACT");
    }
    const fieldKeys = new Set();
    const fields = sourceFields.map((field) => {
      const fieldKey = String(field?.fieldKey || "").trim();
      if (!fieldKey || fieldKey.length > 128 || fieldKeys.has(fieldKey)) {
        fail("Current section field keys must be present and unique", "INVALID_SECTION_CONTRACT");
      }
      fieldKeys.add(fieldKey);
      return {
        fieldKey,
        name: String(field?.name || fieldKey).trim().slice(0, 160),
        fieldKind: String(field?.fieldKind || fieldKind).trim().slice(0, 32),
        textType: String(field?.textType || "").trim().slice(0, 32) || null,
        isRequired: Boolean(field?.isRequired),
        isLocked: Boolean(field?.isLocked),
        editorSchema: normalizeEditorSchema(field?.editorSchema),
        styleSlots: normalizeStyleSlots(field?.styleSlots),
      };
    });
    return {
      itemKey,
      name: String(item?.name || itemKey).trim().slice(0, 160),
      fieldKind,
      textType: String(item?.textType || "").trim().slice(0, 32) || null,
      isVisibleInWizard: item?.isVisibleInWizard !== false,
      isLocked: Boolean(item?.isLocked),
      capabilities: {},
      editorSchema: normalizeEditorSchema(item?.editorSchema),
      styleSlots: normalizeStyleSlots(item?.styleSlots),
      fields,
    };
  });
  const sectionVersion = Number(value.sectionVersion || 1);
  return {
    sectionKey,
    sectionVersion: Number.isFinite(sectionVersion) ? Math.max(1, sectionVersion) : 1,
    name: String(value.name || sectionKey).trim().slice(0, 160),
    items,
  };
}

function visibleItems(section) {
  return (section?.items || []).filter((item) => item.isVisibleInWizard !== false);
}

function componentFields(item) {
  const fields = Array.isArray(item?.fields) ? item.fields : [];
  return fields.length ? fields : [item];
}

function currentFieldValue(sectionInputs, item, field) {
  const value = sectionInputs?.[item.itemKey];
  if (componentFields(item).length <= 1) return value;
  return value?.fields?.[field.fieldKey];
}

function styleSlotsFor(item, field) {
  return [...new Map(
    [...(item.styleSlots || []), ...(field.styleSlots || [])]
      .map((slot) => [slot.slotKey, slot]),
  ).values()];
}

function publicSectionContract(section) {
  return {
    sectionKey: section.sectionKey,
    name: section.name || section.sectionKey,
    items: visibleItems(section).map((item) => ({
      itemKey: item.itemKey,
      name: item.name,
      fieldKind: item.fieldKind,
      textType: item.textType || null,
      isLocked: Boolean(item.isLocked),
      capabilities: item.capabilities || {},
      styleSlots: item.styleSlots || [],
      fields: componentFields(item).map((field) => ({
        fieldKey: componentFields(item).length > 1 ? field.fieldKey : null,
        name: field.name || item.name,
        fieldKind: field.fieldKind,
        textType: field.textType || null,
        isRequired: Boolean(field.isRequired),
        isLocked: Boolean(field.isLocked),
        editorSchema: field.editorSchema || {},
        styleSlots: field.styleSlots || [],
      })),
    })),
  };
}

function selectableTokens(tokenSet) {
  return (tokenSet?.values || []).filter((token) => (
    token.aiSelectable && SAFE_TOKEN_PROPERTIES.has(token.cssProperty)
  )).map((token) => ({
    tokenKey: token.tokenKey,
    value: token.value,
    semanticRole: token.semanticRole,
    cssProperty: token.cssProperty,
  }));
}

function allowedTokenBindings(section, tokenSet) {
  const tokens = selectableTokens(tokenSet);
  return visibleItems(section).flatMap((item) => componentFields(item).flatMap((field) => {
    const isMulti = componentFields(item).length > 1;
    const slots = styleSlotsFor(item, field);
    return slots.filter((slot) => slot.aiSelectable !== false).map((slot) => ({
      itemKey: item.itemKey,
      fieldKey: isMulti ? field.fieldKey : null,
      slotKey: slot.slotKey,
      semanticRole: slot.semanticRole,
      allowedTokenKeys: tokens
        .filter((token) => token.semanticRole === slot.semanticRole)
        .map((token) => token.tokenKey),
    }));
  }));
}

function compositionFingerprint({ template, section, tokenSet }) {
  return stableFingerprint({
    contractVersion: 1,
    templateId: template.id,
    templateVersion: Number(template.version || 1),
    sectionKey: section.sectionKey,
    sectionVersion: Number(section.sectionVersion || 1),
    tokenSetVersionId: tokenSet.id,
    items: publicSectionContract(section).items,
    tokens: selectableTokens(tokenSet),
  });
}

function compositionOptionsFromBody(body = {}) {
  const requestedScope = body.scope && typeof body.scope === "object" && !Array.isArray(body.scope)
    ? body.scope : {};
  return {
    generateBackgroundImage: Boolean(body.generateBackgroundImage),
    imageGuidance: String(body.imageGuidance || "").trim().slice(0, 1200),
    fadeMode: ["none", "left", "right", "both"].includes(body.fadeMode) ? body.fadeMode : "none",
    scope: {
      layout: requestedScope.layout !== false,
      tokens: requestedScope.tokens !== false,
      keyVisual: requestedScope.keyVisual !== false,
      motion: requestedScope.motion === true,
      preserveContent: requestedScope.preserveContent === true,
    },
  };
}

function textWithLimit(value, schema = {}) {
  const text = String(value ?? "");
  const maxLength = Number(schema.maxLength || 0);
  return maxLength > 0 ? text.slice(0, maxLength) : text;
}

function urlExplicitlyAllowed(url, instruction) {
  const candidate = String(url || "").trim();
  if (!candidate) return true;
  const relative = candidate.startsWith("#")
    || candidate.startsWith("./")
    || candidate.startsWith("../")
    || /^\/(?!\/)/.test(candidate);
  let safe = relative;
  if (!safe) {
    try {
      safe = ["http:", "https:"].includes(new URL(candidate).protocol.toLowerCase());
    } catch {
      safe = false;
    }
  }
  return safe && String(instruction || "").includes(candidate);
}

function tokenStyle(token) {
  if (!SAFE_TOKEN_PROPERTIES.has(token.cssProperty)) fail(`Token ${token.tokenKey} uses an unsupported CSS property`);
  const value = String(token.value || "").trim();
  if (token.cssProperty === "font-size") {
    const px = value.match(/^(\d+(?:\.\d+)?)px$/i);
    if (!px) fail(`Font-size token ${token.tokenKey} must use px`);
    return { fontSize: Number(px[1]) };
  }
  const propertyMap = {
    "background-color": "backgroundColor",
    "border-color": "borderColor",
    "border-radius": "borderRadius",
    "border-width": "borderWidth",
    "box-shadow": "boxShadow",
    "font-family": "fontFamily",
    "font-weight": "fontWeight",
    "line-height": "lineHeight",
    "letter-spacing": "letterSpacing",
    "max-width": "maxWidth",
    "min-height": "minHeight",
  };
  return { [propertyMap[token.cssProperty] || token.cssProperty]: value };
}

function requestedMotionPreset(instruction) {
  const request = String(instruction || "").toLowerCase();
  if (/(scale|확대|zoom)/.test(request)) return { presetVersionId: "motion-scale-in", className: "motion-scale-in" };
  if (/(fade[ -]?in|페이드 ?인|투명)/.test(request) && !/(up|위로|아래에서)/.test(request)) {
    return { presetVersionId: "motion-fade-in", className: "motion-fade-in" };
  }
  return { presetVersionId: "motion-fade-up", className: "motion-fade-up" };
}

function normalizeCompositionPlan({
  plan, instruction, section, sectionInputs, tokenSet, generateBackgroundImage = false,
  imageGuidance = "", fadeMode = "none", scope = {},
}) {
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) fail("Planner returned an invalid plan");
  const items = visibleItems(section);
  const itemByKey = new Map(items.map((item) => [item.itemKey, item]));
  const selections = Array.isArray(plan.componentSelections) ? plan.componentSelections : [];
  const seenSelections = new Set();
  const nextInputs = JSON.parse(JSON.stringify(sectionInputs || {}));
  const contentChanges = [];

  for (const selection of selections) {
    const itemKey = String(selection?.itemKey || "");
    const item = itemByKey.get(itemKey);
    if (!item || seenSelections.has(itemKey)) fail("Planner returned an unknown or duplicate component");
    seenSelections.add(itemKey);
    if (item.isLocked) {
      if ((selection.fields || []).some((field) => field.textValue !== null || field.ctaLabel !== null || field.ctaUrl !== null)) {
        fail(`Locked component ${itemKey} cannot be changed`);
      }
      continue;
    }
    const fields = componentFields(item);
    const isMulti = fields.length > 1;
    const nextComponent = isMulti
      ? { ...(nextInputs[itemKey] || {}), fields: { ...(nextInputs[itemKey]?.fields || {}) } }
      : null;
    for (const patch of Array.isArray(selection.fields) ? selection.fields : []) {
      const field = isMulti
        ? fields.find((candidate) => candidate.fieldKey === patch.fieldKey)
        : (patch.fieldKey === null ? fields[0] : null);
      if (!field) fail(`Planner returned an unknown field for ${itemKey}`);
      const before = currentFieldValue(sectionInputs, item, field);
      if (item.isLocked || field.isLocked) {
        if (patch.textValue !== null || patch.ctaLabel !== null || patch.ctaUrl !== null) {
          fail(`Locked field ${itemKey}.${field.fieldKey || itemKey} cannot be changed`);
        }
        continue;
      }
      let after = before;
      if (scope.preserveContent === true) {
        after = before;
      } else if (field.fieldKind === "text" && patch.textValue !== null) {
        after = textWithLimit(patch.textValue, field.editorSchema);
      } else if (field.fieldKind === "cta") {
        const current = before && typeof before === "object" ? before : {};
        const currentUrl = String(current.link || "").trim();
        const proposedUrl = String(patch.ctaUrl || "").trim();
        if (proposedUrl && proposedUrl !== currentUrl && !urlExplicitlyAllowed(proposedUrl, instruction)) {
          fail(`CTA URL for ${itemKey} was not explicitly supplied`);
        }
        after = {
          ...current,
          label: patch.ctaLabel === null ? current.label || "" : normalizeCtaLabel(patch.ctaLabel, { allowEmpty: false }),
          link: proposedUrl || currentUrl,
        };
      } else if (field.fieldKind !== "image"
        && (patch.textValue !== null || patch.ctaLabel !== null || patch.ctaUrl !== null)) {
        fail(`Planner returned incompatible content for ${itemKey}`);
      }
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        contentChanges.push({
          itemKey,
          fieldKey: isMulti ? field.fieldKey : null,
          name: field.name || item.name,
          before,
          after,
        });
      }
      if (isMulti) nextComponent.fields[field.fieldKey] = after;
      else nextInputs[itemKey] = after;
    }
    if (isMulti) nextInputs[itemKey] = nextComponent;
  }

  const placements = scope.layout === false
    ? [] : (Array.isArray(plan.itemPlacements) ? plan.itemPlacements : []);
  const placementKeys = placements.map((placement) => String(placement?.itemKey || ""));
  if (new Set(placementKeys).size !== placementKeys.length) {
    fail("Planner returned a duplicate component placement");
  }
  const regionConfig = {
    left: { xPct: 0, widthPct: 46 },
    center: { xPct: 15, widthPct: 70 },
    right: { xPct: 54, widthPct: 46 },
  };
  const itemStyles = {};
  const regionCounts = { left: 0, center: 0, right: 0 };
  placements.slice().sort((a, b) => Number(a.order) - Number(b.order)).forEach((placement) => {
    const item = itemByKey.get(String(placement.itemKey || ""));
    const region = String(placement.region || "");
    if (!item || !ALLOWED_REGIONS.includes(region)) fail("Planner returned an unsupported placement");
    if (item.isLocked) return;
    const offset = regionCounts[region]++;
    itemStyles[`${section.sectionKey}.${item.itemKey}`] = {
      ...regionConfig[region],
      yPx: offset * 150,
    };
  });

  const tokenByKey = new Map(selectableTokens(tokenSet).map((token) => [token.tokenKey, token]));
  const tokenBindings = [];
  const seenTokenBindings = new Set();
  const normalizationAdjustments = [];
  const requestedTokenBindings = scope.tokens === false
    ? [] : (Array.isArray(plan.tokenBindings) ? plan.tokenBindings : []);
  for (const binding of requestedTokenBindings) {
    const item = itemByKey.get(String(binding?.itemKey || ""));
    if (!item || item.isLocked) fail("Token binding targets an unknown or locked component");
    const fields = componentFields(item);
    const field = binding.fieldKey === null
      ? (fields.length === 1 ? fields[0] : null)
      : fields.find((candidate) => candidate.fieldKey === binding.fieldKey);
    if (!field || field.isLocked) fail("Token binding targets an unknown or locked field");
    const slots = styleSlotsFor(item, field);
    const slot = slots.find((candidate) => candidate.slotKey === binding.slotKey && candidate.aiSelectable !== false);
    if (!slot) {
      normalizationAdjustments.push(
        `${item.itemKey}.${binding.slotKey} 스타일 슬롯은 허용되지 않아 적용하지 않았습니다.`,
      );
      continue;
    }
    let token = tokenByKey.get(binding.tokenKey);
    if (!token || slot.semanticRole !== token.semanticRole) {
      const fallbackToken = [...tokenByKey.values()].find((candidate) => (
        candidate.semanticRole === slot.semanticRole
      ));
      if (!fallbackToken) {
        normalizationAdjustments.push(
          `${item.itemKey}.${slot.slotKey}에 적용할 수 있는 ${slot.semanticRole} 토큰이 없어 스타일을 유지했습니다.`,
        );
        continue;
      }
      normalizationAdjustments.push(
        `${binding.tokenKey || "선택된 토큰"}은 ${slot.slotKey}과 호환되지 않아 ${fallbackToken.tokenKey}으로 보정했습니다.`,
      );
      token = fallbackToken;
    }
    const bindingKey = `${item.itemKey}.${fields.length === 1 ? "" : field.fieldKey}.${slot.slotKey}`;
    if (seenTokenBindings.has(bindingKey)) fail("Planner returned a duplicate style-slot binding");
    seenTokenBindings.add(bindingKey);
    const styleKey = field === item || fields.length === 1
      ? `${section.sectionKey}.${item.itemKey}`
      : `${section.sectionKey}.${item.itemKey}.${field.fieldKey}`;
    itemStyles[styleKey] = { ...(itemStyles[styleKey] || {}), ...tokenStyle(token) };
    tokenBindings.push({
      itemKey: item.itemKey,
      fieldKey: fields.length === 1 ? null : field.fieldKey,
      slotKey: slot.slotKey,
      tokenKey: token.tokenKey,
      value: token.value,
    });
  }

  const requested = Boolean(scope.keyVisual !== false && generateBackgroundImage && plan.backgroundImage?.requested);
  const normalizedFade = ["none", "left", "right", "both"].includes(fadeMode) ? fadeMode : "none";
  return {
    sectionKey: section.sectionKey,
    content: nextInputs,
    contentChanges,
    layoutPatch: { itemStyles, sectionStyles: {} },
    tokenBindings,
    backgroundImage: {
      requested,
      concept: requested ? String(plan.backgroundImage?.concept || "").trim().slice(0, 1200) : "",
      safeArea: requested && ["left-copy", "right-copy", "center-copy", "none"].includes(plan.backgroundImage?.safeArea)
        ? plan.backgroundImage.safeArea : "none",
      fadeMode: requested ? normalizedFade : "none",
      guidance: requested
        ? [String(imageGuidance || "").trim(), String(plan.backgroundImage?.concept || "").trim()].filter(Boolean).join("\n").slice(0, 1800)
        : "",
    },
    motionPatch: scope.motion === true ? {
      sections: {
        [section.sectionKey]: {
          ...requestedMotionPreset(instruction),
          trigger: "viewport-enter",
          playMode: "once",
          durationToken: "360ms",
          easingToken: "ease-out",
          delayToken: "0ms",
          childrenMode: "together",
          staggerToken: "0ms",
        },
      },
      items: {},
    } : null,
    missingInputs: Array.isArray(plan.missingInputs) ? plan.missingInputs.slice(0, 20) : [],
    adjustments: [
      ...(Array.isArray(plan.adjustments) ? plan.adjustments : []),
      ...normalizationAdjustments,
    ].slice(0, 30),
    rationale: String(plan.rationale || "").trim().slice(0, 1200),
    appliedScope: {
      layout: scope.layout !== false,
      tokens: scope.tokens !== false,
      keyVisual: scope.keyVisual !== false && Boolean(generateBackgroundImage),
      motion: scope.motion === true,
      preserveContent: scope.preserveContent === true,
    },
  };
}

module.exports = {
  ALLOWED_REGIONS,
  SAFE_TOKEN_PROPERTIES,
  canonicalizeForFingerprint,
  normalizeCompositionSection,
  publicSectionContract,
  selectableTokens,
  allowedTokenBindings,
  compositionFingerprint,
  compositionOptionsFromBody,
  stableFingerprint,
  normalizeCompositionPlan,
};
