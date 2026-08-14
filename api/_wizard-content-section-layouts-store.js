const LAYOUT_CONTRACT_VERSION = 1;
const LAYOUT_MODE = "free";
const VIEWPORTS = Object.freeze(["desktop", "mobile"]);
const LAYOUT_ALIGNMENT_VALUES = Object.freeze(["auto", "left", "center", "right", "stretch"]);
const LAYOUT_CONTENT_REGION_VALUES = Object.freeze([
  "auto", "top-left", "top-center", "top-right", "center-left", "center", "center-right", "bottom-left", "bottom-center", "bottom-right",
]);
const LAYOUT_VISUAL_BALANCE_VALUES = Object.freeze(["auto", "media-left", "media-center", "media-right", "full-background"]);
const LAYOUT_DENSITY_VALUES = Object.freeze(["auto", "compact", "standard", "spacious"]);

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeLayoutSelectionMetadata(value) {
  const source = plainObject(value);
  const errors = [];
  const enumValue = (key, allowed) => {
    const candidate = String(source[key] || "auto").trim().toLowerCase();
    if (!allowed.includes(candidate)) {
      errors.push({
        path: `selectionMetadata.${key}`,
        code: "INVALID_LAYOUT_SELECTION_METADATA",
        message: `${key} must be one of: ${allowed.join(", ")}.`,
      });
      return "auto";
    }
    return candidate;
  };
  const purposeTags = [...new Set((Array.isArray(source.purposeTags) ? source.purposeTags : [])
    .map((tag) => String(tag || "").trim().toLowerCase())
    .filter(Boolean))].slice(0, 20);
  if (purposeTags.some((tag) => tag.length > 40)) {
    errors.push({
      path: "selectionMetadata.purposeTags",
      code: "INVALID_LAYOUT_SELECTION_METADATA",
      message: "purposeTags values cannot exceed 40 characters.",
    });
  }
  const selectionWeight = source.selectionWeight == null || source.selectionWeight === ""
    ? 1
    : Number(source.selectionWeight);
  if (!Number.isFinite(selectionWeight) || selectionWeight < 0.1 || selectionWeight > 10) {
    errors.push({
      path: "selectionMetadata.selectionWeight",
      code: "INVALID_LAYOUT_SELECTION_METADATA",
      message: "selectionWeight must be between 0.1 and 10.",
    });
  }
  return {
    metadata: {
      alignment: enumValue("alignment", LAYOUT_ALIGNMENT_VALUES),
      contentRegion: enumValue("contentRegion", LAYOUT_CONTENT_REGION_VALUES),
      visualBalance: enumValue("visualBalance", LAYOUT_VISUAL_BALANCE_VALUES),
      density: enumValue("density", LAYOUT_DENSITY_VALUES),
      purposeTags,
      selectionWeight: Number.isFinite(selectionWeight) ? selectionWeight : 1,
      avoidImmediateRepeat: source.avoidImmediateRepeat === true,
    },
    errors,
  };
}

function normalizeSectionStyle(value, errors) {
  const source = plainObject(value);
  const style = {};
  if (Object.prototype.hasOwnProperty.call(source, "minHeight")) {
    const minHeight = finiteNumber(source.minHeight);
    if (minHeight === null || minHeight < 1 || minHeight > 1200) {
      errors.push({ path: "sectionStyle.minHeight", code: "INVALID_MIN_HEIGHT", message: "minHeight must be between 1 and 1200." });
    } else {
      style.minHeight = minHeight;
    }
  }
  if (Object.prototype.hasOwnProperty.call(source, "backgroundColorToken")) {
    const tokenKey = String(source.backgroundColorToken || "").trim();
    if (tokenKey && !/^--(?:promo|app)-[a-z0-9-]+$/.test(tokenKey)) {
      errors.push({ path: "sectionStyle.backgroundColorToken", code: "INVALID_BACKGROUND_COLOR_TOKEN", message: "backgroundColorToken must use a managed promo or app token key." });
    } else if (tokenKey) {
      style.backgroundColorToken = tokenKey;
    }
  }
  if (Object.prototype.hasOwnProperty.call(source, "backgroundColor")) {
    const color = String(source.backgroundColor || "").trim();
    if (color && !/^#[0-9a-fA-F]{6}$/.test(color)) {
      errors.push({ path: "sectionStyle.backgroundColor", code: "INVALID_BACKGROUND_COLOR", message: "backgroundColor must be a six-digit hex color." });
    } else if (color) {
      style.backgroundColor = color.toUpperCase();
    }
  }
  return style;
}

function normalizeGeometry(value, path, errors) {
  const source = plainObject(value);
  const positionMode = source.positionMode === "anchored" ? "anchored" : "free";
  const geometry = { positionMode };
  if (source.positionMode !== undefined && !["free", "anchored"].includes(source.positionMode)) {
    errors.push({ path: `${path}.positionMode`, code: "UNSUPPORTED_POSITION_MODE", message: "positionMode must be free or anchored." });
  }
  const fields = [
    ["xPct", 0, 100],
    ["yPx", 0, 1200],
    ["widthPct", 0.01, 100],
    ["heightPx", 1, 900],
  ];
  fields.forEach(([key, min, max]) => {
    const number = finiteNumber(source[key]);
    const required = positionMode === "free";
    if (!required && source[key] === undefined) return;
    if (number === null || number < min || number > max) {
      errors.push({ path: `${path}.${key}`, code: "INVALID_GEOMETRY", message: `${key} must be between ${min} and ${max}.` });
    } else {
      geometry[key] = number;
    }
  });
  if (geometry.xPct !== undefined && geometry.widthPct !== undefined && geometry.xPct + geometry.widthPct > 100) {
    errors.push({ path, code: "GEOMETRY_OVERFLOW", message: "xPct + widthPct cannot exceed 100." });
  }
  if (Object.prototype.hasOwnProperty.call(source, "zIndex")) {
    const zIndex = finiteNumber(source.zIndex);
    if (zIndex === null || !Number.isInteger(zIndex) || zIndex < 0 || zIndex > 100) {
      errors.push({ path: `${path}.zIndex`, code: "INVALID_Z_INDEX", message: "zIndex must be an integer between 0 and 100." });
    } else {
      geometry.zIndex = zIndex;
    }
  }
  if (positionMode === "anchored") {
    const horizontalAnchor = String(source.horizontalAnchor || "center");
    const verticalAnchor = String(source.verticalAnchor || "middle");
    if (!["left", "center", "right"].includes(horizontalAnchor)) {
      errors.push({ path: `${path}.horizontalAnchor`, code: "INVALID_HORIZONTAL_ANCHOR", message: "horizontalAnchor must be left, center, or right." });
    } else {
      geometry.horizontalAnchor = horizontalAnchor;
    }
    if (!["top", "middle", "bottom"].includes(verticalAnchor)) {
      errors.push({ path: `${path}.verticalAnchor`, code: "INVALID_VERTICAL_ANCHOR", message: "verticalAnchor must be top, middle, or bottom." });
    } else {
      geometry.verticalAnchor = verticalAnchor;
    }
    for (const offsetProperty of ["offsetX", "offsetY"]) {
      if (source[offsetProperty] === undefined) continue;
      const offset = finiteNumber(source[offsetProperty]);
      if (offset === null || offset < -1200 || offset > 1200) {
        errors.push({ path: `${path}.${offsetProperty}`, code: "INVALID_ANCHOR_OFFSET", message: `${offsetProperty} must be between -1200 and 1200.` });
      } else {
        geometry[offsetProperty] = offset;
      }
    }
    const optionalEnums = [
      ["widthMode", ["fit-content", "fixed", "fill"]],
      ["heightMode", ["auto", "fixed"]],
      ["textAlign", ["left", "center", "right"]],
    ];
    optionalEnums.forEach(([property, allowed]) => {
      if (source[property] === undefined) return;
      if (!allowed.includes(source[property])) {
        errors.push({ path: `${path}.${property}`, code: "INVALID_ANCHOR_STYLE", message: `Unsupported ${property}.` });
      } else {
        geometry[property] = source[property];
      }
    });
  }
  return geometry;
}

function normalizeViewport(value, viewport, allowedItemKeys, errors) {
  const source = plainObject(value);
  const sourceItems = plainObject(source.items);
  const items = {};
  Object.entries(sourceItems).forEach(([itemKey, geometry]) => {
    if (!allowedItemKeys.has(itemKey)) {
      errors.push({ path: `viewports.${viewport}.items.${itemKey}`, code: "UNKNOWN_ITEM_KEY", message: `Unknown section itemKey: ${itemKey}.` });
      return;
    }
    items[itemKey] = normalizeGeometry(geometry, `viewports.${viewport}.items.${itemKey}`, errors);
  });

  const sourceVisibility = plainObject(plainObject(source.visibility).items);
  const visibilityItems = {};
  Object.entries(sourceVisibility).forEach(([itemKey, visible]) => {
    if (!allowedItemKeys.has(itemKey)) {
      errors.push({ path: `viewports.${viewport}.visibility.items.${itemKey}`, code: "UNKNOWN_ITEM_KEY", message: `Unknown section itemKey: ${itemKey}.` });
      return;
    }
    if (typeof visible !== "boolean") {
      errors.push({ path: `viewports.${viewport}.visibility.items.${itemKey}`, code: "INVALID_VISIBILITY", message: "Item visibility must be boolean." });
      return;
    }
    visibilityItems[itemKey] = visible;
  });
  return { items, visibility: { items: visibilityItems } };
}

function normalizeContentValue(value, path, errors, depth = 0) {
  if (depth > 8) {
    errors.push({ path, code: "CONTENT_DEPTH_EXCEEDED", message: "Preset content cannot exceed eight nested levels." });
    return null;
  }
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.length > 20000) {
      errors.push({ path, code: "CONTENT_VALUE_TOO_LONG", message: "Preset content strings cannot exceed 20,000 characters." });
      return value.slice(0, 20000);
    }
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      errors.push({ path, code: "INVALID_CONTENT_VALUE", message: "Preset content numbers must be finite." });
      return null;
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > 100) {
      errors.push({ path, code: "CONTENT_COLLECTION_TOO_LARGE", message: "Preset content arrays cannot exceed 100 entries." });
    }
    return value.slice(0, 100).map((entry, index) => (
      normalizeContentValue(entry, `${path}.${index}`, errors, depth + 1)
    ));
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length > 100) {
      errors.push({ path, code: "CONTENT_COLLECTION_TOO_LARGE", message: "Preset content objects cannot exceed 100 properties." });
    }
    return Object.fromEntries(entries.slice(0, 100).flatMap(([key, entry]) => {
      if (["__proto__", "prototype", "constructor"].includes(key) || key.length > 120) {
        errors.push({ path: `${path}.${key}`, code: "INVALID_CONTENT_KEY", message: "Preset content contains an invalid property key." });
        return [];
      }
      return [[key, normalizeContentValue(entry, `${path}.${key}`, errors, depth + 1)]];
    }));
  }
  errors.push({ path, code: "INVALID_CONTENT_VALUE", message: "Preset content must contain JSON values only." });
  return null;
}

function normalizePresetContent(value, allowedItemKeys, errors) {
  if (value === undefined) return {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push({ path: "content", code: "INVALID_PRESET_CONTENT", message: "Preset content must be an object keyed by itemKey." });
    return {};
  }
  let serialized = "";
  try {
    serialized = JSON.stringify(value);
  } catch {
    errors.push({ path: "content", code: "INVALID_PRESET_CONTENT", message: "Preset content must be JSON serializable." });
    return {};
  }
  if (serialized.length > 262144) {
    errors.push({ path: "content", code: "PRESET_CONTENT_TOO_LARGE", message: "Preset content cannot exceed 256 KB." });
  }
  return Object.fromEntries(Object.entries(value).flatMap(([itemKey, itemValue]) => {
    if (!allowedItemKeys.has(itemKey)) {
      errors.push({ path: `content.${itemKey}`, code: "UNKNOWN_ITEM_KEY", message: `Unknown section itemKey: ${itemKey}.` });
      return [];
    }
    return [[itemKey, normalizeContentValue(itemValue, `content.${itemKey}`, errors)]];
  }));
}

function normalizeLayoutSnapshot(value, itemKeys = []) {
  const source = plainObject(value);
  const errors = [];
  const allowedItemKeys = new Set(itemKeys.map((key) => String(key || "").trim()).filter(Boolean));
  if (Number(source.contractVersion) !== LAYOUT_CONTRACT_VERSION) {
    errors.push({ path: "contractVersion", code: "UNSUPPORTED_CONTRACT_VERSION", message: "contractVersion must be 1." });
  }
  if (source.layoutMode !== LAYOUT_MODE) {
    errors.push({ path: "layoutMode", code: "UNSUPPORTED_LAYOUT_MODE", message: "layoutMode must be free." });
  }
  const viewports = plainObject(source.viewports);
  VIEWPORTS.forEach((viewport) => {
    if (!viewports[viewport] || typeof viewports[viewport] !== "object" || Array.isArray(viewports[viewport])) {
      errors.push({ path: `viewports.${viewport}`, code: "VIEWPORT_REQUIRED", message: `${viewport} viewport is required.` });
    }
  });
  const snapshot = {
    contractVersion: LAYOUT_CONTRACT_VERSION,
    layoutMode: LAYOUT_MODE,
    sectionStyle: normalizeSectionStyle(source.sectionStyle, errors),
    content: normalizePresetContent(source.content, allowedItemKeys, errors),
    viewports: Object.fromEntries(
      VIEWPORTS.map((viewport) => [
        viewport,
        normalizeViewport(viewports[viewport], viewport, allowedItemKeys, errors),
      ]),
    ),
  };
  return { snapshot, errors };
}

function validateHeaderLayoutPolicy(sectionRow, items = [], layoutRows = []) {
  if (String(sectionRow?.section_role || sectionRow?.sectionRole || "") !== "header") return [];
  const sectionKey = String(sectionRow?.section_key || sectionRow?.sectionKey || "header");
  const errors = [];
  if ((sectionRow?.fixed_position ?? sectionRow?.fixedPosition) !== "top") {
    errors.push({
      path: `${sectionKey}.fixedPosition`,
      code: "HEADER_TOP_POSITION_REQUIRED",
      message: "Header sections must use the fixed top position.",
    });
  }
  const logo = items.find((item) => {
    if (item.isVisibleInWizard === false) return false;
    const iconKey = String(item.libraryPresentation?.iconKey || "").trim().toLowerCase();
    const semanticRole = String(
      item.capabilities?.semanticRole
      || item.capabilities?.componentRole
      || item.editorSchema?.semanticRole
      || "",
    ).trim().toLowerCase();
    const identifiers = [item.itemKey, item.componentKey, item.name]
      .map((value) => String(value || ""))
      .join(" ");
    return iconKey === "logo"
      || semanticRole === "logo"
      || /(^|[^a-z])logo([^a-z]|$)|로고/i.test(identifiers);
  });
  if (!logo) {
    errors.push({
      path: `${sectionKey}.items`,
      code: "HEADER_LOGO_REQUIRED",
      message: "Header sections need a visible Logo component.",
    });
    return errors;
  }
  const defaultLayout = layoutRows.find((layout) => layout.is_default);
  if (!defaultLayout) {
    errors.push({
      path: `${sectionKey}.layouts`,
      code: "HEADER_DEFAULT_LAYOUT_REQUIRED",
      message: "Header sections need a default Layout Preset.",
    });
    return errors;
  }
  VIEWPORTS.forEach((viewport) => {
    const snapshot = defaultLayout.layout_snapshot || defaultLayout.layoutSnapshot || {};
    if (!snapshot.viewports?.[viewport]?.items?.[logo.itemKey]) {
      errors.push({
        path: `${sectionKey}.layouts.${defaultLayout.layout_key || defaultLayout.layoutKey}.${viewport}.${logo.itemKey}`,
        code: "HEADER_LOGO_GEOMETRY_REQUIRED",
        message: `Header Logo geometry is required for ${viewport}.`,
      });
    }
    if (snapshot.viewports?.[viewport]?.visibility?.items?.[logo.itemKey] === false) {
      errors.push({
        path: `${sectionKey}.layouts.${defaultLayout.layout_key || defaultLayout.layoutKey}.${viewport}.${logo.itemKey}`,
        code: "HEADER_LOGO_VISIBILITY_REQUIRED",
        message: `Header Logo cannot be hidden on ${viewport}.`,
      });
    }
  });
  return errors;
}

function toLayout(row, { includeSnapshot = true } = {}) {
  const layout = {
    id: row.id,
    sectionId: row.section_id,
    layoutKey: row.layout_key,
    name: row.name,
    description: row.description || "",
    isDefault: Boolean(row.is_default),
    selectionMetadata: row.selection_metadata || {},
    changeNote: row.change_note || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
  if (includeSnapshot) layout.layoutSnapshot = row.layout_snapshot || null;
  return layout;
}

async function fetchLayoutRows(sql, sectionId) {
  return sql`
    select id::text, section_id::text, layout_key, name, description, is_default,
      selection_metadata, layout_snapshot, change_note, created_at, updated_at
    from wizard_content_section_layouts
    where section_id = ${sectionId}::uuid
    order by is_default desc, created_at asc, layout_key asc
  `;
}

async function fetchLayoutsForSection(sql, sectionId, options = {}) {
  return (await fetchLayoutRows(sql, sectionId)).map((row) => toLayout(row, options));
}

async function fetchLayoutsForSections(sql, sectionIds = [], options = {}) {
  const ids = Array.from(new Set(sectionIds.map(String).filter(Boolean)));
  if (!ids.length) return new Map();
  const rows = await sql`
    select id::text, section_id::text, layout_key, name, description, is_default,
      selection_metadata, layout_snapshot, change_note, created_at, updated_at
    from wizard_content_section_layouts
    where section_id = any(${ids}::uuid[])
    order by section_id, is_default desc, created_at asc, layout_key asc
  `;
  const bySection = new Map(ids.map((id) => [id, []]));
  rows.forEach((row) => {
    if (!bySection.has(row.section_id)) bySection.set(row.section_id, []);
    bySection.get(row.section_id).push(toLayout(row, options));
  });
  return bySection;
}

async function fetchLayoutRow(sql, id, sectionId = "") {
  const rows = sectionId
    ? await sql`
      select id::text, section_id::text, layout_key, name, description, is_default,
        selection_metadata, layout_snapshot, change_note, created_at, updated_at
      from wizard_content_section_layouts
      where id = ${id}::uuid and section_id = ${sectionId}::uuid
      limit 1
    `
    : await sql`
      select id::text, section_id::text, layout_key, name, description, is_default,
        selection_metadata, layout_snapshot, change_note, created_at, updated_at
      from wizard_content_section_layouts
      where id = ${id}::uuid
      limit 1
    `;
  return rows[0] || null;
}

async function recordLayoutHistory(sql, {
  layoutId = null,
  sectionId,
  layoutKey,
  action,
  changeNote = "",
  previousSnapshot = null,
  newSnapshot = null,
}) {
  await sql`
    insert into wizard_content_section_layout_histories (
      layout_id, section_id, layout_key, action, change_note,
      previous_snapshot, new_snapshot
    ) values (
      ${layoutId}::uuid, ${sectionId}::uuid, ${layoutKey}, ${action}, ${changeNote},
      ${previousSnapshot ? JSON.stringify(previousSnapshot) : null}::jsonb,
      ${newSnapshot ? JSON.stringify(newSnapshot) : null}::jsonb
    )
  `;
}

module.exports = {
  LAYOUT_CONTRACT_VERSION,
  LAYOUT_MODE,
  VIEWPORTS,
  LAYOUT_ALIGNMENT_VALUES,
  LAYOUT_CONTENT_REGION_VALUES,
  LAYOUT_VISUAL_BALANCE_VALUES,
  LAYOUT_DENSITY_VALUES,
  normalizeLayoutSelectionMetadata,
  normalizeLayoutSnapshot,
  validateHeaderLayoutPolicy,
  toLayout,
  fetchLayoutRows,
  fetchLayoutsForSection,
  fetchLayoutsForSections,
  fetchLayoutRow,
  recordLayoutHistory,
};
