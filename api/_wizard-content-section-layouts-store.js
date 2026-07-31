const LAYOUT_CONTRACT_VERSION = 1;
const LAYOUT_MODE = "free";
const VIEWPORTS = Object.freeze(["desktop", "mobile"]);

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
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
  const logo = items.find((item) => (
    item.isVisibleInWizard !== false
    && /logo/i.test(String(item.itemKey || ""))
  ));
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
      layout_snapshot, change_note, created_at, updated_at
    from wizard_content_section_layouts
    where section_id = ${sectionId}::uuid
    order by is_default desc, created_at asc, layout_key asc
  `;
}

async function fetchLayoutsForSection(sql, sectionId, options = {}) {
  return (await fetchLayoutRows(sql, sectionId)).map((row) => toLayout(row, options));
}

async function fetchLayoutRow(sql, id, sectionId = "") {
  const rows = sectionId
    ? await sql`
      select id::text, section_id::text, layout_key, name, description, is_default,
        layout_snapshot, change_note, created_at, updated_at
      from wizard_content_section_layouts
      where id = ${id}::uuid and section_id = ${sectionId}::uuid
      limit 1
    `
    : await sql`
      select id::text, section_id::text, layout_key, name, description, is_default,
        layout_snapshot, change_note, created_at, updated_at
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
  normalizeLayoutSnapshot,
  validateHeaderLayoutPolicy,
  toLayout,
  fetchLayoutRows,
  fetchLayoutsForSection,
  fetchLayoutRow,
  recordLayoutHistory,
};
