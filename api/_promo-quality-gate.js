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
  requiredViewports = REQUIRED_VIEWPORTS,
} = {}) {
  const source = candidate && typeof candidate === "object" ? candidate : {};
  if (source.state !== "passed" || Number(source.blockingCount || 0) !== 0) {
    throw Object.assign(new Error("Preview quality gate must pass before saving"), {
      statusCode: 422,
      code: "QUALITY_GATE_NOT_PASSED",
    });
  }
  const results = Object.fromEntries(requiredViewports.map((viewport) => [
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
    warningCount: requiredViewports.reduce(
      (sum, viewport) => sum + results[viewport].warningCount,
      0,
    ),
    results,
  };
}

function assertPassedQualityGate(snapshot, documentRevision) {
  if(snapshot?.content?.pageSchema&&snapshot.generationMeta?.review?.state==='pending')throw Object.assign(new Error('페이지 구성 미리보기를 확인하고 승인해 주세요.'),{code:'PAGE_SCHEMA_APPROVAL_REQUIRED',statusCode:409});
  const library=snapshot?.content?.runtimeTheme?.designTokens||snapshot?.content?.formTemplate?.designTokens||{};
  const context=snapshot?.content?.pageContext||{tokenValues:library.values||{},tokenCatalog:library.catalog||[],usagePolicy:library.usagePolicy};
  require('../shared/layout-token-policy.cjs').assertLayoutTokens(context);
  const policy=require('../shared/token-usage-policy.cjs').validateTokenUsagePolicy(context.usagePolicy,context.tokenCatalog,{activation:true});
  const forbidden=Object.values(context.usagePolicy?.bindings||{}).some(token=>(typeof token==='string'&&token.startsWith('--app-')));
  if(!policy.ok||forbidden)throw Object.assign(new Error('등록된 출력 토큰 정책이 필요합니다.'),{code:'OUTPUT_TOKEN_POLICY_REQUIRED',statusCode:422,errors:policy.errors});
  if(!snapshot?.content?.pageSchema){
    const validation=require('../shared/registered-token-policy.cjs').enforceRegisteredDesignTokens(snapshot.designSpec,context.tokenValues,context.tokenCatalog,context.usagePolicy,snapshot.content?.sectionSnapshot||[]);
    if(validation.errors.length)throw Object.assign(new Error('등록되지 않은 출력 스타일이 포함되어 있습니다.'),{code:'OUTPUT_STYLE_POLICY_VIOLATION',statusCode:422,errors:validation.errors});
  }
  if (Number(snapshot?.contractVersion || 0) !== 3) return true;
  if(snapshot?.content?.pageSchema){
    require("../shared/page-schema/contract.cjs").assertValid(snapshot.content.pageSchema,snapshot.content.pageContext,{final:true});
    for(const view of ["desktop","tablet","mobile"])normalizedViewport(snapshot.qualityGate?.results?.[view],view);
  }
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
