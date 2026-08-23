const REQUIRED_VIEWPORTS = Object.freeze(["desktop", "mobile"]);

function pendingQualityGate(documentRevision, reason = "document_changed") {
  return {
    contractVersion: 1,
    state: "pending",
    documentRevision: Number(documentRevision || 0),
    reason: String(reason || "document_changed").slice(0, 80),
  };
}

function normalizedViewport(candidate, viewport) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw Object.assign(new Error(`${viewport} quality gate result is required`), {
      statusCode: 422,
      code: "QUALITY_GATE_VIEWPORT_MISSING",
    });
  }
  const source = candidate;
  const blockingCount = Number(source.blockingCount || 0);
  if (!Number.isFinite(blockingCount) || blockingCount !== 0) {
    throw Object.assign(new Error(`${viewport} quality gate has blocking diagnostics`), {
      statusCode: 422,
      code: "QUALITY_GATE_NOT_PASSED",
    });
  }
  const warningCount = Number(source.warningCount || 0);
  return {
    passed: true,
    blockingCount: 0,
    warningCount: Number.isFinite(warningCount) ? Math.max(0, warningCount) : 0,
    diagnostics: Array.isArray(source.diagnostics)
      ? source.diagnostics.slice(0, 200).map((entry) => ({
        code: String(entry?.code || "QUALITY_WARNING").slice(0, 100),
        level: String(entry?.level || "warning").slice(0, 20),
        path: String(entry?.path || "").slice(0, 300),
        message: String(entry?.message || "").slice(0, 1000),
      }))
      : [],
  };
}

function normalizePassedQualityGate(candidate, {
  sourceDocumentRevision,
  documentRevision,
} = {}) {
  const source = candidate && typeof candidate === "object" ? candidate : {};
  if (source.state !== "passed" || Number(source.blockingCount || 0) !== 0) {
    throw Object.assign(new Error("Preview quality gate must pass before saving"), {
      statusCode: 422,
      code: "QUALITY_GATE_NOT_PASSED",
    });
  }
  const results = Object.fromEntries(REQUIRED_VIEWPORTS.map((viewport) => [
    viewport,
    normalizedViewport(source.results?.[viewport], viewport),
  ]));
  return {
    contractVersion: 1,
    state: "passed",
    sourceDocumentRevision: Number(sourceDocumentRevision || 0),
    documentRevision: Number(documentRevision || 0),
    checkedAt: new Date().toISOString(),
    blockingCount: 0,
    warningCount: REQUIRED_VIEWPORTS.reduce(
      (sum, viewport) => sum + results[viewport].warningCount,
      0,
    ),
    results,
  };
}

function assertPassedQualityGate(snapshot, documentRevision) {
  if (Number(snapshot?.contractVersion || 0) !== 3) return true;
  const gate = snapshot?.qualityGate;
  const revision = Number(documentRevision || snapshot?.documentRevision || 0);
  if (gate?.state !== "passed" || Number(gate.documentRevision || 0) !== revision
    || Number(gate.blockingCount || 0) !== 0) {
    throw Object.assign(new Error("Builder document quality gate has not passed for the current revision"), {
      statusCode: 409,
      code: "QUALITY_GATE_REQUIRED",
      currentDocumentRevision: revision,
      qualityGateState: gate?.state || "missing",
    });
  }
  return true;
}

module.exports = {
  REQUIRED_VIEWPORTS,
  pendingQualityGate,
  normalizePassedQualityGate,
  assertPassedQualityGate,
};
