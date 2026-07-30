import { normalizeRevision } from "./composition-contract-v2.mjs";

export const COMPOSITION_PROGRESS_STAGES = Object.freeze([
  "idle",
  "analyzing_overview",
  "reviewing_overview",
  "resolving_policy",
  "queued",
  "processing",
  "review_required",
  "render_ready",
  "generating_assets",
  "ready",
  "failed",
]);

export function createAiBuilderState(overrides = {}) {
  return {
    documentId: "",
    documentRevision: 0,
    layoutRevision: 0,
    bridgeRevision: 0,
    mode: "ai",
    stage: "idle",
    naturalLanguage: "",
    overviewDraft: null,
    overviewFingerprint: "",
    confirmedFieldPaths: [],
    resolvedPolicies: [],
    selectedOptionalSectionIds: [],
    proposal: null,
    snapshot: null,
    assetJobs: {},
    error: null,
    ...overrides,
  };
}

export function acceptDocumentRevision(state, revision) {
  return normalizeRevision(revision) === normalizeRevision(state.documentRevision);
}

export function nextBridgeRevision(state) {
  state.bridgeRevision = normalizeRevision(state.bridgeRevision) + 1;
  return state.bridgeRevision;
}
