const ALLOWED_TAGS = new Set([
  "div", "section", "article", "header", "footer", "nav", "main",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "strong", "small",
  "img", "picture", "a", "button", "ul", "ol", "li",
]);

const SAFE_ATTRIBUTES = new Set([
  "role", "aria-label", "aria-labelledby", "aria-describedby", "aria-hidden",
  "alt", "href", "target", "rel", "data-render-id",
]);

const TOKEN_STYLE_PROPERTIES = Object.freeze({
  color: "color",
  backgroundColor: "backgroundColor",
  borderColor: "borderColor",
  fontFamily: "fontFamily",
  fontSize: "fontSize",
  lineHeight: "lineHeight",
  letterSpacing: "letterSpacing",
  fontWeight: "fontWeight",
  padding: "padding",
  gap: "gap",
  margin: "margin",
  borderRadius: "borderRadius",
  boxShadow: "boxShadow",
  maxWidth: "maxWidth",
  minHeight: "minHeight",
});

const LAYOUT_TOKEN_STYLE_PROPERTIES = Object.freeze({
  gapToken: "gap",
  rowGapToken: "rowGap",
  columnGapToken: "columnGap",
  paddingToken: "padding",
  paddingTopToken: "paddingTop",
  paddingRightToken: "paddingRight",
  paddingBottomToken: "paddingBottom",
  paddingLeftToken: "paddingLeft",
});

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function tokenReference(value) {
  const key = String(value || "").trim();
  return /^--(?:promo|app)-[a-z0-9-]+$/.test(key) ? `var(${key})` : undefined;
}

function boundedDimension(value) {
  const text = String(value || "").trim();
  return tokenReference(text) || (/^(?:0|[1-9]\d{0,3}px|(?:100|\d{1,2})(?:\.\d+)?%)$/.test(text) ? text : undefined);
}

function safeLink(value) {
  const link = String(value || "").trim();
  return /^(?:https?:|mailto:|tel:|\/|#)/i.test(link) && !/^(?:javascript|data|vbscript):/i.test(link)
    ? link
    : "#";
}

function safeImageUrl(value) {
  const url = String(value || "").trim();
  return /^(?:https?:\/\/|\/api\/)/i.test(url) ? url : "";
}

export function resolveRenderSpecBreakpoint({
  viewport = "",
  viewportWidth = 1280,
  mobileBreakpoint = 720,
  tabletBreakpoint = 1024,
} = {}) {
  if (["desktop", "tablet", "mobile"].includes(viewport)) return viewport;
  const width = Number(viewportWidth) || 1280;
  if (width <= Number(mobileBreakpoint || 720)) return "mobile";
  if (width <= Number(tabletBreakpoint || 1024)) return "tablet";
  return "desktop";
}

function responsiveTarget(root, path) {
  const parts = String(path || "").split(".");
  if (parts.shift() !== "root") return null;
  let target = root;
  while (parts[0] === "children") {
    parts.shift();
    const index = Number(parts.shift());
    if (!Number.isInteger(index) || !Array.isArray(target?.children) || !target.children[index]) return null;
    target = target.children[index];
  }
  const group = parts.shift();
  const property = parts.shift();
  if (parts.length || !["layout", "tokenBindings"].includes(group) || !property) return null;
  return { target, group, property };
}

export function resolveResponsiveRenderSpec(renderSpec, breakpoint = "desktop") {
  const resolved = clone(renderSpec);
  if (!resolved?.root || !["desktop", "tablet", "mobile"].includes(breakpoint)) return resolved;
  const overrides = object(resolved.responsive?.[breakpoint]);
  Object.entries(overrides).forEach(([path, value]) => {
    const destination = responsiveTarget(resolved.root, path);
    if (!destination) return;
    destination.target[destination.group] = {
      ...object(destination.target[destination.group]),
      [destination.property]: clone(value),
    };
  });
  return resolved;
}

export function resolveRenderSpecFieldValue(componentValue, fields, fieldKey) {
  const entries = Array.isArray(fields) ? fields : [];
  if (componentValue?.fields && Object.prototype.hasOwnProperty.call(componentValue.fields, fieldKey)) {
    return componentValue.fields[fieldKey];
  }
  if (entries.length <= 1 && String(entries[0]?.fieldKey || "") === String(fieldKey || "")) return componentValue;
  return undefined;
}

function layoutStyle(layout) {
  const source = object(layout);
  const style = {};
  if (["block", "flex", "grid"].includes(source.display)) style.display = source.display;
  if (["row", "column"].includes(source.direction)) style.flexDirection = source.direction;
  if (["nowrap", "wrap"].includes(source.wrap)) style.flexWrap = source.wrap;
  if (["start", "center", "end", "stretch"].includes(source.alignItems)) style.alignItems = source.alignItems;
  if (["start", "center", "end", "space-between", "space-around", "space-evenly"].includes(source.justifyContent)) {
    style.justifyContent = source.justifyContent;
  }
  if (Number.isInteger(source.columns) && source.columns >= 1 && source.columns <= 12) {
    style.gridTemplateColumns = `repeat(${source.columns}, minmax(0, 1fr))`;
  }
  Object.entries(LAYOUT_TOKEN_STYLE_PROPERTIES).forEach(([property, cssProperty]) => {
    const reference = tokenReference(source[property]);
    if (reference) style[cssProperty] = reference;
  });
  if (source.width === "auto" || /^(?:100|\d{1,2})(?:\.\d+)?%$/.test(String(source.width || ""))) style.width = source.width;
  const minHeight = boundedDimension(source.minHeight);
  const maxWidth = boundedDimension(source.maxWidth);
  if (minHeight) style.minHeight = minHeight;
  if (maxWidth) style.maxWidth = maxWidth;
  if (/^(?:[1-9]\d?(?:\.\d+)?)\/(?:[1-9]\d?(?:\.\d+)?)$/.test(String(source.aspectRatio || ""))) {
    style.aspectRatio = String(source.aspectRatio).replace("/", " / ");
  }
  if (["visible", "hidden", "clip"].includes(source.overflow)) style.overflow = source.overflow;
  return style;
}

function tokenStyle(bindings) {
  return Object.entries(object(bindings)).reduce((style, [property, tokenKey]) => {
    const cssProperty = TOKEN_STYLE_PROPERTIES[property];
    const reference = tokenReference(tokenKey);
    if (cssProperty && reference) style[cssProperty] = reference;
    return style;
  }, {});
}

function safeAttributes(attributes) {
  const result = {};
  Object.entries(object(attributes)).forEach(([name, value]) => {
    if (!SAFE_ATTRIBUTES.has(name) || /^on/i.test(name) || !["string", "number", "boolean"].includes(typeof value)) return;
    if (name === "href") result.href = safeLink(value);
    else if (name === "target" && ["_self", "_blank"].includes(String(value))) result.target = String(value);
    else result[name] = value;
  });
  if (result.target === "_blank") result.rel = "noopener noreferrer";
  return result;
}

function fieldText(value, field) {
  if (value && typeof value === "object") return String(value.label ?? value.value ?? value.description ?? "");
  return String(value ?? field?.defaultValue ?? "");
}

function fieldAttributes(tag, attributes, value, field) {
  const result = { ...attributes };
  if (tag === "a") {
    result.href = safeLink(value?.link || result.href);
    const target = ["_self", "_blank"].includes(String(value?.target || "")) ? value.target : result.target;
    if (target) result.target = target;
    if (result.target === "_blank") result.rel = "noopener noreferrer";
  }
  if (tag === "img") {
    const src = safeImageUrl(value?.value);
    if (src) result.src = src;
    else delete result.src;
    result.alt = String(value?.alt || value?.description || result.alt || field?.name || "").trim();
  }
  return result;
}

export function createResolvedRenderSpecTree({
  renderSpec,
  fields = [],
  componentValue,
  breakpoint = "desktop",
} = {}) {
  if (Number(renderSpec?.contractVersion) !== 1 || !renderSpec?.root) return null;
  const resolvedSpec = resolveResponsiveRenderSpec(renderSpec, breakpoint);
  const fieldLookup = new Map((Array.isArray(fields) ? fields : []).map((field) => [String(field?.fieldKey || ""), field]));

  function resolveNode(node, path) {
    if (!node || typeof node !== "object" || Array.isArray(node)) return null;
    const tag = ALLOWED_TAGS.has(String(node.tag || "").toLowerCase()) ? String(node.tag).toLowerCase() : "div";
    const isField = node.nodeType === "field";
    const fieldKey = isField ? String(node.fieldKey || "") : "";
    const field = isField ? fieldLookup.get(fieldKey) || null : null;
    const value = isField ? resolveRenderSpecFieldValue(componentValue, fields, fieldKey) : undefined;
    const attributes = fieldAttributes(tag, safeAttributes(node.attributes), value, field);
    const imageSrc = isField && (tag === "img" || tag === "picture") ? safeImageUrl(value?.value) : "";
    const imageAlt = isField && (tag === "img" || tag === "picture")
      ? String(value?.alt || value?.description || attributes.alt || field?.name || "").trim()
      : "";
    return {
      path,
      nodeType: isField ? "field" : "element",
      tag,
      semanticRole: String(node.semanticRole || ""),
      fieldKey,
      field,
      fieldKind: String(field?.fieldKind || ""),
      value,
      text: isField ? fieldText(value, field) : "",
      imageSrc,
      imageAlt,
      attributes,
      style: { ...layoutStyle(node.layout), ...tokenStyle(node.tokenBindings) },
      children: (Array.isArray(node.children) ? node.children : [])
        .map((child, index) => resolveNode(child, `${path}.children.${index}`))
        .filter(Boolean),
    };
  }

  return resolveNode(resolvedSpec.root, "root");
}

export function renderSpecStructureSignature(node) {
  if (!node) return "";
  return `${node.tag}${node.fieldKey ? `[${node.fieldKey}]` : ""}(${(node.children || []).map(renderSpecStructureSignature).join("")})`;
}
