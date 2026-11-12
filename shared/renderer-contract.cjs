// Generated from packages/promo-contracts/src/renderer.mjs; run build:token-policy.
const RENDERER_KEY = "default-promo-renderer";
const RENDERER_VERSION = 1;
const SUPPORTED_PAGE_SCHEMA_RENDERER_VERSIONS = Object.freeze([1, 2]);
const SUPPORTED_RENDER_SPEC_VERSIONS = Object.freeze([1]);
const SUPPORTED_SNAPSHOT_CONTRACT_VERSIONS = Object.freeze([2, 3]);

function rendererIdentity(candidate = {}) {
  return Object.freeze({
    key: String(candidate.key || candidate.rendererKey || RENDERER_KEY),
    version: Number(candidate.version || candidate.rendererVersion || RENDERER_VERSION),
  });
}

function supportsRenderer(candidate = {}) {
  const identity = rendererIdentity(candidate);
  return identity.key === "page-schema-renderer"
    ? SUPPORTED_PAGE_SCHEMA_RENDERER_VERSIONS.includes(identity.version)
    : identity.key === RENDERER_KEY && identity.version === RENDERER_VERSION;
}

function supportsSnapshotContract(version) {
  return SUPPORTED_SNAPSHOT_CONTRACT_VERSIONS.includes(Number(version));
}

function supportsRenderSpecContract(version) {
  return SUPPORTED_RENDER_SPEC_VERSIONS.includes(Number(version));
}

module.exports={RENDERER_KEY,RENDERER_VERSION,SUPPORTED_PAGE_SCHEMA_RENDERER_VERSIONS,SUPPORTED_RENDER_SPEC_VERSIONS,SUPPORTED_SNAPSHOT_CONTRACT_VERSIONS,rendererIdentity,supportsRenderer,supportsSnapshotContract,supportsRenderSpecContract};
