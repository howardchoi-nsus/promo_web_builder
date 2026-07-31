const { randomUUID } = require("node:crypto");
const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const {
  getSql,
  createDocument,
  createDocumentRevision,
  fetchDocument,
} = require("./_promo-builder-document-store");
const {
  fetchTokenVersion,
  toRuntimeTokenMap,
} = require("./_design-token-store");
const {
  normalizeDefaultContent,
  validateLayoutSpec,
} = require("./_wizard-form-template-layout-store");
const { buildDefaultItemStyles } = require("./_promo-page-composition-contract");

function normalizedSectionOrder(candidate, sections) {
  const allowed = sections.map((section) => section.sectionKey);
  const requested = Array.isArray(candidate) ? candidate.map(String) : [];
  return requested.length === allowed.length
    && requested.every((sectionKey) => allowed.includes(sectionKey))
    && new Set(requested).size === allowed.length
    ? requested
    : allowed;
}

function normalizeSectionSnapshot(candidate, fallback = []) {
  const source = Array.isArray(candidate) ? candidate : fallback;
  if (!Array.isArray(source) || source.length > 100) {
    throw Object.assign(new Error("Builder document section snapshot is invalid"), {
      statusCode: 422,
      code: "INVALID_SECTION_SNAPSHOT",
    });
  }
  const sections = JSON.parse(JSON.stringify(source));
  const sectionKeys = new Set();
  sections.forEach((section) => {
    const sectionKey = String(section?.sectionKey || "").trim();
    if (!sectionKey || sectionKey.length > 128 || sectionKeys.has(sectionKey)) {
      throw Object.assign(new Error("Builder document section keys must be unique"), {
        statusCode: 422,
        code: "INVALID_SECTION_SNAPSHOT",
      });
    }
    sectionKeys.add(sectionKey);
    section.sectionKey = sectionKey;
    const items = Array.isArray(section.items) ? section.items : [];
    if (items.length > 200) {
      throw Object.assign(new Error("Builder document section has too many components"), {
        statusCode: 422,
        code: "INVALID_SECTION_SNAPSHOT",
      });
    }
    const itemKeys = new Set();
    items.forEach((item) => {
      const itemKey = String(item?.itemKey || "").trim();
      if (!itemKey || itemKey.length > 128 || itemKeys.has(itemKey)) {
        throw Object.assign(new Error("Builder document component keys must be unique in a section"), {
          statusCode: 422,
          code: "INVALID_SECTION_SNAPSHOT",
        });
      }
      itemKeys.add(itemKey);
      item.itemKey = itemKey;
      item.fields = Array.isArray(item.fields) ? item.fields.slice(0, 100) : [];
    });
    section.items = items;
  });
  return sections;
}

async function normalizeEditorSnapshot(sql, currentSnapshot, incomingSnapshot, designTokenSetVersionId) {
  if (!currentSnapshot?.content || !currentSnapshot?.designSpec) {
    throw Object.assign(new Error("Builder document does not have an editable snapshot"), {
      statusCode: 409,
      code: "BUILDER_SNAPSHOT_NOT_READY",
    });
  }
  const sections = normalizeSectionSnapshot(
    incomingSnapshot?.content?.sectionSnapshot,
    currentSnapshot.content.sectionSnapshot || [],
  );
  const incomingDesignSpec = {
    ...(incomingSnapshot?.designSpec || currentSnapshot.designSpec),
    contractVersion: 1,
  };
  const layoutValidation = validateLayoutSpec(incomingDesignSpec, sections);
  if (!layoutValidation.ok) {
    throw Object.assign(new Error("Visual Editor layout validation failed"), {
      statusCode: 422,
      code: "INVALID_EDITOR_LAYOUT",
      validation: layoutValidation,
    });
  }

  const requestedVersionId = String(
    designTokenSetVersionId
      || currentSnapshot.appearance?.designTokenSetVersionId
      || currentSnapshot.content.formTemplate?.designTokenSetVersionId
      || "",
  ).trim();
  let designTokens = currentSnapshot.content.formTemplate?.designTokens || { values: {} };
  let appearance = currentSnapshot.appearance || {};
  if (requestedVersionId) {
    const tokenVersion = await fetchTokenVersion(sql, requestedVersionId);
    if (!tokenVersion || tokenVersion.status !== "active") {
      throw Object.assign(new Error("Selected design token set version is not active"), {
        statusCode: 422,
        code: "INVALID_DESIGN_TOKEN_SET",
      });
    }
    designTokens = {
      setKey: tokenVersion.setKey,
      name: tokenVersion.name,
      version: tokenVersion.version,
      versionId: tokenVersion.id,
      values: toRuntimeTokenMap(tokenVersion.values),
    };
    appearance = {
      ...appearance,
      designTokenSetVersionId: tokenVersion.id,
    };
  }
  const tokenValues = designTokens.values || {};
  const tokenKeys = new Set(Object.keys(tokenValues));
  const incomingItemStyles = Object.fromEntries(Object.entries(
    layoutValidation.spec.itemStyles || {},
  ).map(([styleKey, style]) => {
    const nextStyle = { ...(style || {}) };
    [
      "colorToken", "fontFamilyToken", "fontSizeToken", "fontWeightToken",
      "lineHeightToken", "letterSpacingToken", "maxWidthToken", "textStyleToken",
      "textGradientToken", "textBackgroundToken",
    ].forEach((property) => {
      if (nextStyle[property] && !tokenKeys.has(nextStyle[property])) delete nextStyle[property];
    });
    return [styleKey, nextStyle];
  }));
  const defaultItemStyles = buildDefaultItemStyles(sections, tokenValues);
  const mergedItemStyles = Object.fromEntries(Array.from(new Set([
    ...Object.keys(defaultItemStyles),
    ...Object.keys(incomingItemStyles),
  ])).map((styleKey) => [
    styleKey,
    {
      ...(defaultItemStyles[styleKey] || {}),
      ...(incomingItemStyles[styleKey] || {}),
    },
  ]));
  const designSpec = {
    ...layoutValidation.spec,
    contractVersion: Number(currentSnapshot.designSpec.contractVersion || 2),
    itemStyles: mergedItemStyles,
  };
  return {
    ...currentSnapshot,
    appearance,
    layoutRevision: Number(currentSnapshot.layoutRevision || 0) + 1,
    content: {
      ...currentSnapshot.content,
      formTemplate: {
        ...currentSnapshot.content.formTemplate,
        designTokenSetVersionId: requestedVersionId,
        designTokens,
      },
      sectionInputs: normalizeDefaultContent(
        incomingSnapshot?.content?.sectionInputs || currentSnapshot.content.sectionInputs,
        sections,
      ),
      sectionSnapshot: sections,
      sectionOrder: normalizedSectionOrder(
        incomingSnapshot?.content?.sectionOrder,
        sections,
      ),
    },
    designSpec,
    assets: currentSnapshot.assets,
    motionSpec: currentSnapshot.motionSpec,
  };
}

module.exports = async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "POST") {
      const owner = resolveBuilderOwner(req, res);
      const body = parseBody(req.body);
      const mode = body.mode === "template" ? "template" : "ai";
      const idempotencyKey = String(body.idempotencyKey || "").trim() || randomUUID();
      const document = await createDocument(getSql(), {
        ownerSubject: owner.ownerSubject,
        mode,
        idempotencyKey,
      });
      return res.status(201).json({ ok: true, document });
    }
    if (req.method === "GET") {
      const owner = resolveBuilderOwner(req, res);
      const documentId = String(req.query.documentId || "").trim();
      if (!documentId) return res.status(400).json({ error: "documentId is required" });
      const result = await fetchDocument(getSql(), documentId, owner.ownerSubject);
      if (!result) return res.status(404).json({ error: "Builder document not found" });
      return res.status(200).json({ ok: true, ...result });
    }
    if (req.method === "PATCH") {
      const owner = resolveBuilderOwner(req, res);
      const body = parseBody(req.body);
      const documentId = String(body.documentId || "").trim();
      const baseDocumentRevision = Number(body.baseDocumentRevision || 0);
      if (!documentId || !body.snapshot) {
        return res.status(400).json({ error: "documentId and snapshot are required" });
      }
      const sql = getSql();
      const current = await fetchDocument(sql, documentId, owner.ownerSubject);
      if (!current) return res.status(404).json({ error: "Builder document not found" });
      if (current.document.currentDocumentRevision !== baseDocumentRevision) {
        return res.status(409).json({
          error: "Builder document revision changed",
          code: "DOCUMENT_REVISION_MISMATCH",
          currentDocumentRevision: current.document.currentDocumentRevision,
        });
      }
      const snapshot = await normalizeEditorSnapshot(
        sql,
        current.snapshot,
        body.snapshot,
        body.designTokenSetVersionId,
      );
      const saved = await createDocumentRevision(sql, {
        documentId,
        ownerSubject: owner.ownerSubject,
        baseDocumentRevision,
        snapshot,
        source: "manual",
        changeNote: String(body.changeNote || "Visual Editor changes saved.").slice(0, 500),
      });
      return res.status(200).json({
        ok: true,
        documentId,
        revision: saved.revision,
        snapshot: saved.snapshot,
      });
    }
    res.setHeader("Allow", "GET, POST, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    const status = /access denied/i.test(error.message) ? 403
      : /revision conflict/i.test(error.message) ? 409
        : error.statusCode || 500;
    return res.status(status).json({
      error: "Builder document API failed",
      code: error.code || null,
      message: error.message,
      ...(error.validation ? { validation: error.validation } : {}),
    });
  }
};

module.exports.normalizeEditorSnapshot = normalizeEditorSnapshot;
module.exports.normalizeSectionSnapshot = normalizeSectionSnapshot;
