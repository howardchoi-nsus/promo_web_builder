const { createHash } = require("node:crypto");

const CONTRACT_VERSION = 1;
const MAX_DEPTH = 8;
const MAX_NODES = 80;
const MAX_FIELDS = 20;
const MAX_CTA_NODES = 5;

const ALLOWED_NODE_TYPES = new Set(["element", "field"]);
const ALLOWED_TAGS = new Set([
  "div", "section", "article", "header", "footer", "nav", "main",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "strong", "small",
  "img", "picture", "a", "button", "ul", "ol", "li",
]);
const TEXT_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "strong", "small", "li"]);
const IMAGE_TAGS = new Set(["img", "picture"]);
const CTA_TAGS = new Set(["a", "button"]);
const INTERACTIVE_TAGS = new Set(["a", "button"]);
const TOKEN_KEY_PATTERN = /^--(?:promo|app)-[a-z0-9-]+$/;
const SAFE_ATTRIBUTE_NAMES = new Set([
  "role", "aria-label", "aria-labelledby", "aria-describedby", "aria-hidden",
  "alt", "href", "target", "rel",
]);
const SAFE_INTERNAL_DATA_ATTRIBUTES = new Set(["data-render-id"]);
const DANGEROUS_KEYS = new Set(["__proto__", "prototype", "constructor"]);
const LAYOUT_PROPERTIES = new Set([
  "display", "direction", "wrap", "alignItems", "justifyContent", "columns",
  "gapToken", "rowGapToken", "columnGapToken", "paddingToken", "paddingTopToken",
  "paddingRightToken", "paddingBottomToken", "paddingLeftToken", "width", "minHeight",
  "maxWidth", "aspectRatio", "positionMode", "overflow",
]);
const TOKEN_BINDING_PROPERTIES = Object.freeze({
  color: ["color"],
  backgroundColor: ["background-color"],
  borderColor: ["border-color"],
  fontFamily: ["font-family"],
  fontSize: ["font-size"],
  lineHeight: ["line-height"],
  letterSpacing: ["letter-spacing"],
  fontWeight: ["font-weight"],
  padding: ["padding"],
  gap: ["gap"],
  margin: ["margin"],
  borderRadius: ["border-radius"],
  boxShadow: ["box-shadow"],
  maxWidth: ["max-width"],
  minHeight: ["min-height"],
});
const LAYOUT_TOKEN_PROPERTIES = Object.freeze({
  gapToken: ["gap"], rowGapToken: ["row-gap", "gap"], columnGapToken: ["column-gap", "gap"],
  paddingToken: ["padding"], paddingTopToken: ["padding-top", "padding"],
  paddingRightToken: ["padding-right", "padding"], paddingBottomToken: ["padding-bottom", "padding"],
  paddingLeftToken: ["padding-left", "padding"],
});

class RenderSpecValidationError extends Error {
  constructor(validation) {
    super("Component RenderSpec validation failed");
    this.name = "RenderSpecValidationError";
    this.code = "INVALID_COMPONENT_RENDER_SPEC";
    this.statusCode = 422;
    this.validation = validation;
  }
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isPlainObject(value)) return value;
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = canonicalize(value[key]);
    return result;
  }, {});
}

function stableRenderSpecJson(value) {
  return JSON.stringify(canonicalize(value));
}

function renderSpecHash(value) {
  return createHash("sha256").update(stableRenderSpecJson(value)).digest("hex");
}

function copySortedObject(value) {
  if (!isPlainObject(value)) return {};
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = value[key];
    return result;
  }, {});
}

function normalizeNode(node) {
  if (!isPlainObject(node)) return node;
  const normalized = {
    nodeType: String(node.nodeType || "").trim().toLowerCase(),
    tag: String(node.tag || "").trim().toLowerCase(),
  };
  if (node.semanticRole != null && String(node.semanticRole).trim()) normalized.semanticRole = String(node.semanticRole).trim().slice(0, 80);
  if (node.fieldKey != null && String(node.fieldKey).trim()) normalized.fieldKey = String(node.fieldKey).trim().slice(0, 120);
  if (node.attributes != null) normalized.attributes = copySortedObject(node.attributes);
  if (node.layout != null) normalized.layout = copySortedObject(node.layout);
  if (node.tokenBindings != null) normalized.tokenBindings = copySortedObject(node.tokenBindings);
  if (node.children != null) normalized.children = Array.isArray(node.children) ? node.children.map(normalizeNode) : node.children;
  return normalized;
}

function normalizeRenderSpec(spec) {
  if (!isPlainObject(spec)) return spec;
  const normalized = {
    contractVersion: Number(spec.contractVersion),
    root: normalizeNode(spec.root),
    responsive: {},
    accessibility: {},
  };
  if (spec.responsive != null) {
    normalized.responsive = Object.keys(isPlainObject(spec.responsive) ? spec.responsive : {}).sort().reduce((result, breakpoint) => {
      result[breakpoint] = copySortedObject(spec.responsive[breakpoint]);
      return result;
    }, {});
  }
  if (spec.accessibility != null) normalized.accessibility = canonicalize(spec.accessibility);
  return normalized;
}

function tokenCatalogMap(tokenCatalog) {
  const entries = Array.isArray(tokenCatalog)
    ? tokenCatalog
    : isPlainObject(tokenCatalog)
      ? Object.entries(tokenCatalog).map(([tokenKey, value]) => ({ tokenKey, ...(isPlainObject(value) ? value : {}) }))
      : [];
  return new Map(entries.map((token) => [String(token?.tokenKey || token?.token_key || "").trim(), token]));
}

function fieldMap(fields) {
  return new Map((Array.isArray(fields) ? fields : []).map((field) => [
    String(field?.fieldKey || field?.field_key || field?.itemKey || "").trim(),
    field,
  ]).filter(([key]) => key));
}

function fieldKind(field) {
  return String(field?.fieldKind || field?.field_kind || "text").trim().toLowerCase();
}

function tokenCssProperties(token) {
  const values = token?.cssProperties || token?.css_properties || [token?.cssProperty || token?.css_property];
  return new Set((Array.isArray(values) ? values : [values]).map((value) => String(value || "").trim().toLowerCase()).filter(Boolean));
}

function validateRenderSpec(spec, context = {}) {
  const errors = [];
  const warnings = [];
  const addError = (code, path, message) => errors.push({ code, path, message });
  const tokens = tokenCatalogMap(context.tokenCatalog);
  const fields = fieldMap(context.fields);
  const referencedFields = new Set();
  let tokenReferenceCount = 0;
  const metrics = { nodeCount: 0, fieldNodeCount: 0, ctaNodeCount: 0, maxDepth: 0 };

  function scanDangerousKeys(value, path = "renderSpec") {
    const pending = [{ value, path }];
    const visited = new WeakSet();
    let inspected = 0;
    while (pending.length && inspected < 1000) {
      const current = pending.pop();
      if (!current.value || typeof current.value !== "object" || visited.has(current.value)) continue;
      visited.add(current.value);
      inspected += 1;
      if (!Array.isArray(current.value) && !isPlainObject(current.value)) {
        addError("OBJECT_TYPE_NOT_ALLOWED", current.path, "Only plain JSON objects are allowed.");
        continue;
      }
      const entries = Array.isArray(current.value)
        ? current.value.map((entry, index) => [String(index), entry])
        : Object.entries(current.value);
      for (const [key, entry] of entries) {
        const entryPath = Array.isArray(current.value) ? `${current.path}[${key}]` : `${current.path}.${key}`;
        if (DANGEROUS_KEYS.has(key)) addError("DANGEROUS_OBJECT_KEY", entryPath, "Prototype-related keys are not allowed.");
        if (entry && typeof entry === "object") pending.push({ value: entry, path: entryPath });
      }
    }
    if (pending.length) addError("OBJECT_SCAN_LIMIT_EXCEEDED", path, "RenderSpec object complexity exceeds the safe inspection limit.");
  }

  function validateToken(tokenKey, allowedProperties, path) {
    tokenReferenceCount += 1;
    if (typeof tokenKey !== "string" || !TOKEN_KEY_PATTERN.test(tokenKey)) {
      addError("INVALID_TOKEN_KEY", path, "Token keys must use the --promo-* or --app-* namespace.");
      return;
    }
    const token = tokens.get(tokenKey);
    if (!token) {
      addError("UNKNOWN_TOKEN", path, `Token is not registered in the supplied catalog: ${tokenKey}`);
      return;
    }
    const cssProperties = tokenCssProperties(token);
    if (!allowedProperties.some((property) => cssProperties.has(property))) {
      addError("TOKEN_TYPE_MISMATCH", path, `Token ${tokenKey} cannot be used for this property.`);
    }
  }

  function validateAttributes(attributes, path) {
    if (attributes == null) return;
    if (!isPlainObject(attributes)) {
      addError("INVALID_ATTRIBUTES", path, "Attributes must be an object.");
      return;
    }
    for (const [name, value] of Object.entries(attributes)) {
      const attributePath = `${path}.${name}`;
      if (/^on/i.test(name) || name === "style" || name === "class") {
        addError("UNSAFE_ATTRIBUTE", attributePath, `Attribute ${name} is not allowed.`);
        continue;
      }
      if (!SAFE_ATTRIBUTE_NAMES.has(name) && !SAFE_INTERNAL_DATA_ATTRIBUTES.has(name)) {
        addError("ATTRIBUTE_NOT_ALLOWED", attributePath, `Attribute ${name} is not allowlisted.`);
        continue;
      }
      if (!["string", "boolean", "number"].includes(typeof value) || String(value).length > 500) {
        addError("INVALID_ATTRIBUTE_VALUE", attributePath, "Attribute values must be short scalar values.");
      }
      if (["href", "src", "srcset"].includes(name)) {
        const text = String(value || "").trim();
        if (/^(?:javascript|data|vbscript):/i.test(text) || (name === "href" && !/^(?:https?:|mailto:|tel:|\/|#)/i.test(text))) {
          addError("UNSAFE_URL", attributePath, "Only safe HTTP, mail, telephone, root-relative, or fragment links are allowed.");
        }
      }
      if (name === "target" && !["_self", "_blank"].includes(String(value))) addError("INVALID_LINK_TARGET", attributePath, "Only _self and _blank targets are allowed.");
    }
  }

  function validateLayout(layout, path) {
    if (layout == null) return;
    if (!isPlainObject(layout)) {
      addError("INVALID_LAYOUT", path, "Layout must be an object.");
      return;
    }
    for (const [property, value] of Object.entries(layout)) {
      const propertyPath = `${path}.${property}`;
      if (!LAYOUT_PROPERTIES.has(property)) {
        addError("LAYOUT_PROPERTY_NOT_ALLOWED", propertyPath, `Layout property ${property} is not allowed.`);
        continue;
      }
      if (LAYOUT_TOKEN_PROPERTIES[property]) validateToken(value, LAYOUT_TOKEN_PROPERTIES[property], propertyPath);
      else if (property === "display" && !["block", "flex", "grid"].includes(value)) addError("INVALID_LAYOUT_VALUE", propertyPath, "display must be block, flex, or grid.");
      else if (property === "direction" && !["row", "column"].includes(value)) addError("INVALID_LAYOUT_VALUE", propertyPath, "direction must be row or column.");
      else if (property === "wrap" && !["nowrap", "wrap"].includes(value)) addError("INVALID_LAYOUT_VALUE", propertyPath, "wrap must be nowrap or wrap.");
      else if (property === "alignItems" && !["start", "center", "end", "stretch"].includes(value)) addError("INVALID_LAYOUT_VALUE", propertyPath, "alignItems uses a restricted enum.");
      else if (property === "justifyContent" && !["start", "center", "end", "space-between", "space-around", "space-evenly"].includes(value)) addError("INVALID_LAYOUT_VALUE", propertyPath, "justifyContent uses a restricted enum.");
      else if (property === "columns" && (!Number.isInteger(value) || value < 1 || value > 12)) addError("INVALID_LAYOUT_VALUE", propertyPath, "columns must be an integer from 1 to 12.");
      else if (property === "width" && value !== "auto" && !/^(?:100|\d{1,2})(?:\.\d+)?%$/.test(String(value))) addError("INVALID_LAYOUT_VALUE", propertyPath, "width must be auto or a percentage from 0% to 100%.");
      else if (["minHeight", "maxWidth"].includes(property) && !TOKEN_KEY_PATTERN.test(String(value)) && !/^(?:0|[1-9]\d{0,3}px|(?:100|\d{1,2})(?:\.\d+)?%)$/.test(String(value))) addError("INVALID_LAYOUT_VALUE", propertyPath, `${property} must be a registered token or bounded px/% value.`);
      else if (["minHeight", "maxWidth"].includes(property) && TOKEN_KEY_PATTERN.test(String(value))) validateToken(value, [property === "minHeight" ? "min-height" : "max-width"], propertyPath);
      else if (property === "aspectRatio" && !/^(?:[1-9]\d?(?:\.\d+)?)\/(?:[1-9]\d?(?:\.\d+)?)$/.test(String(value))) addError("INVALID_LAYOUT_VALUE", propertyPath, "aspectRatio must be a positive numeric ratio such as 16/9.");
      else if (property === "positionMode" && value !== "flow") addError("INVALID_LAYOUT_VALUE", propertyPath, "Only flow positioning is supported in v1.");
      else if (property === "overflow" && !["visible", "hidden", "clip"].includes(value)) addError("INVALID_LAYOUT_VALUE", propertyPath, "overflow uses a restricted enum.");
    }
  }

  function validateTokenBindings(bindings, path) {
    if (bindings == null) return;
    if (!isPlainObject(bindings)) {
      addError("INVALID_TOKEN_BINDINGS", path, "Token bindings must be an object.");
      return;
    }
    for (const [property, tokenKey] of Object.entries(bindings)) {
      if (!TOKEN_BINDING_PROPERTIES[property]) addError("TOKEN_PROPERTY_NOT_ALLOWED", `${path}.${property}`, `Token property ${property} is not allowed.`);
      else validateToken(tokenKey, TOKEN_BINDING_PROPERTIES[property], `${path}.${property}`);
    }
  }

  function validateNode(node, path, depth, insideInteractive = false, root = false) {
    if (!isPlainObject(node)) {
      addError("INVALID_NODE", path, "Every render node must be an object.");
      return;
    }
    metrics.nodeCount += 1;
    metrics.maxDepth = Math.max(metrics.maxDepth, depth);
    if (metrics.nodeCount > MAX_NODES) {
      addError("NODE_LIMIT_EXCEEDED", path, `RenderSpec supports at most ${MAX_NODES} nodes.`);
      return;
    }
    if (depth > MAX_DEPTH) {
      addError("DEPTH_LIMIT_EXCEEDED", path, `RenderSpec depth cannot exceed ${MAX_DEPTH}.`);
      return;
    }
    const nodeType = String(node.nodeType || "");
    const tag = String(node.tag || "").toLowerCase();
    const nodeKeys = new Set(["nodeType", "tag", "semanticRole", "fieldKey", "attributes", "layout", "tokenBindings", "children"]);
    Object.keys(node).filter((key) => !nodeKeys.has(key)).forEach((key) => {
      addError("NODE_PROPERTY_NOT_ALLOWED", `${path}.${key}`, `Node property ${key} is not allowed.`);
    });
    if (!ALLOWED_NODE_TYPES.has(nodeType)) addError("NODE_TYPE_NOT_ALLOWED", `${path}.nodeType`, `Node type ${nodeType || "(empty)"} is not allowed.`);
    if (!ALLOWED_TAGS.has(tag)) addError("TAG_NOT_ALLOWED", `${path}.tag`, `Tag ${tag || "(empty)"} is not allowed.`);
    if (root && nodeType !== "element") addError("INVALID_ROOT_NODE", path, "The single root node must be an element node.");
    if (insideInteractive && INTERACTIVE_TAGS.has(tag)) addError("NESTED_INTERACTIVE", path, "Interactive elements cannot be nested.");
    if (INTERACTIVE_TAGS.has(tag)) metrics.ctaNodeCount += 1;
    if (metrics.ctaNodeCount > MAX_CTA_NODES) addError("CTA_LIMIT_EXCEEDED", path, `RenderSpec supports at most ${MAX_CTA_NODES} CTA nodes.`);
    validateAttributes(node.attributes, `${path}.attributes`);
    validateLayout(node.layout, `${path}.layout`);
    validateTokenBindings(node.tokenBindings, `${path}.tokenBindings`);

    if (nodeType === "field") {
      metrics.fieldNodeCount += 1;
      if (metrics.fieldNodeCount > MAX_FIELDS) addError("FIELD_LIMIT_EXCEEDED", path, `RenderSpec supports at most ${MAX_FIELDS} field nodes.`);
      const key = String(node.fieldKey || "").trim();
      if (!key) addError("FIELD_KEY_REQUIRED", `${path}.fieldKey`, "Field nodes require a fieldKey.");
      else if (!fields.has(key)) addError("UNKNOWN_FIELD", `${path}.fieldKey`, `Field is not declared by the component version: ${key}`);
      else {
        referencedFields.add(key);
        const kind = fieldKind(fields.get(key));
        const compatible = kind === "image" ? IMAGE_TAGS.has(tag) : kind === "cta" ? CTA_TAGS.has(tag) : TEXT_TAGS.has(tag);
        if (!compatible) addError("FIELD_TAG_MISMATCH", `${path}.tag`, `Field ${key} (${kind}) cannot render as ${tag}.`);
      }
    } else if (node.fieldKey != null) addError("FIELD_KEY_NOT_ALLOWED", `${path}.fieldKey`, "Only field nodes may reference fieldKey.");

    if (tag === "img" && Array.isArray(node.children) && node.children.length) addError("VOID_ELEMENT_CHILDREN", `${path}.children`, "img nodes cannot contain child nodes.");
    if (node.children != null && !Array.isArray(node.children)) addError("INVALID_CHILDREN", `${path}.children`, "children must be an array.");
    else (node.children || []).forEach((child, index) => validateNode(
      child,
      `${path}.children[${index}]`,
      depth + 1,
      insideInteractive || INTERACTIVE_TAGS.has(tag),
    ));
  }

  function resolveResponsiveTarget(root, path) {
    const parts = path.split(".");
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

  scanDangerousKeys(spec);
  if (!isPlainObject(spec)) addError("INVALID_RENDER_SPEC", "renderSpec", "RenderSpec must be an object.");
  else {
    const topLevelKeys = new Set(["contractVersion", "root", "responsive", "accessibility"]);
    Object.keys(spec).filter((key) => !topLevelKeys.has(key)).forEach((key) => addError("TOP_LEVEL_PROPERTY_NOT_ALLOWED", `renderSpec.${key}`, `Top-level property ${key} is not allowed.`));
    if (spec.contractVersion !== CONTRACT_VERSION) addError("UNSUPPORTED_CONTRACT_VERSION", "renderSpec.contractVersion", `Only numeric contract version ${CONTRACT_VERSION} is supported.`);
    validateNode(spec.root, "renderSpec.root", 1, false, true);
    if (spec.responsive != null && !isPlainObject(spec.responsive)) addError("INVALID_RESPONSIVE", "renderSpec.responsive", "responsive must be an object.");
    else for (const [breakpoint, overrides] of Object.entries(spec.responsive || {})) {
      if (!["desktop", "tablet", "mobile"].includes(breakpoint)) addError("BREAKPOINT_NOT_ALLOWED", `renderSpec.responsive.${breakpoint}`, `Breakpoint ${breakpoint} is not allowed.`);
      if (!isPlainObject(overrides)) {
        addError("INVALID_RESPONSIVE_OVERRIDE", `renderSpec.responsive.${breakpoint}`, "Breakpoint overrides must be an object.");
        continue;
      }
      for (const [overridePath, value] of Object.entries(overrides)) {
        const resolved = resolveResponsiveTarget(spec.root, overridePath);
        const path = `renderSpec.responsive.${breakpoint}.${overridePath}`;
        if (!resolved) addError("INVALID_RESPONSIVE_PATH", path, "Responsive overrides must point to an existing layout or token binding property.");
        else if (resolved.group === "layout") validateLayout({ [resolved.property]: value }, path.replace(/\.[^.]+$/, ""));
        else validateTokenBindings({ [resolved.property]: value }, path.replace(/\.[^.]+$/, ""));
      }
    }
  }

  if (fields.size > MAX_FIELDS) addError("FIELD_DEFINITION_LIMIT_EXCEEDED", "fields", `Component versions support at most ${MAX_FIELDS} fields.`);
  for (const [key, field] of fields) {
    if ((field?.isRequired === true || field?.is_required === true) && !referencedFields.has(key)) {
      addError("REQUIRED_FIELD_NOT_RENDERED", `fields.${key}`, `Required field is not referenced by RenderSpec: ${key}`);
    }
  }
  if (!tokens.size && tokenReferenceCount > 0) warnings.push({ code: "EMPTY_TOKEN_CATALOG", path: "tokenCatalog", message: "No design tokens were supplied; every token binding will be rejected." });

  const ok = errors.length === 0;
  const normalizedSpec = ok ? normalizeRenderSpec(spec) : null;
  return {
    ok,
    errors,
    warnings,
    metrics,
    normalizedSpec,
    hash: ok ? renderSpecHash(normalizedSpec) : null,
  };
}

function assertValidRenderSpec(spec, context = {}) {
  const validation = validateRenderSpec(spec, context);
  if (!validation.ok) throw new RenderSpecValidationError(validation);
  return validation;
}

module.exports = {
  CONTRACT_VERSION,
  MAX_DEPTH,
  MAX_NODES,
  MAX_FIELDS,
  MAX_CTA_NODES,
  ALLOWED_NODE_TYPES,
  ALLOWED_TAGS,
  TOKEN_BINDING_PROPERTIES,
  RenderSpecValidationError,
  stableRenderSpecJson,
  renderSpecHash,
  normalizeRenderSpec,
  validateRenderSpec,
  assertValidRenderSpec,
};
