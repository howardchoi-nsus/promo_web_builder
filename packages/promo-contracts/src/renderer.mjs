export const RENDERER_KEY = "default-promo-renderer";
export const RENDERER_VERSION = 1;
export const SUPPORTED_RENDER_SPEC_VERSIONS = Object.freeze([1]);
export const SUPPORTED_SNAPSHOT_CONTRACT_VERSIONS = Object.freeze([2, 3]);

export function rendererIdentity(candidate = {}) {
  return Object.freeze({
    key: String(candidate.key || candidate.rendererKey || RENDERER_KEY),
    version: Number(candidate.version || candidate.rendererVersion || RENDERER_VERSION),
  });
}

export function supportsRenderer(candidate = {}) {
  const identity = rendererIdentity(candidate);
  return identity.key === RENDERER_KEY && identity.version === RENDERER_VERSION;
}

export function supportsSnapshotContract(version) {
  return SUPPORTED_SNAPSHOT_CONTRACT_VERSIONS.includes(Number(version));
}

export function supportsRenderSpecContract(version) {
  return SUPPORTED_RENDER_SPEC_VERSIONS.includes(Number(version));
}
