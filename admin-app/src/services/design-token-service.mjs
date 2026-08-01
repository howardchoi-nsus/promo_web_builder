async function requestJson(url, options = {}, fetchImpl = globalThis.fetch) {
  const response = await fetchImpl(url, {
    cache: "no-store",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.message || result.error || `Request failed (${response.status})`);
    error.status = response.status;
    error.details = result;
    throw error;
  }
  return result;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const designTokenService = Object.freeze({
  list: () => requestJson("/api/design-token-sets"),
  catalog: () => requestJson("/api/design-token-catalog-import"),
  registerDefinitions: (body) => requestJson("/api/design-token-catalog-import", json("POST", body)),
  detail: (versionId) => requestJson(`/api/design-token-set?versionId=${encodeURIComponent(versionId)}`),
  usage: (tokenSetId) => requestJson(`/api/design-token-set-usage?tokenSetId=${encodeURIComponent(tokenSetId)}`),
  createSet: (body) => requestJson("/api/design-token-sets", json("POST", body)),
  cloneSet: (body) => requestJson("/api/design-token-set-clone", json("POST", body)),
  updateMetadata: (body) => requestJson("/api/design-token-set-metadata", json("PATCH", body)),
  createDraft: (body) => requestJson("/api/design-token-set-draft", json("POST", body)),
  saveVersion: (body) => requestJson("/api/design-token-set-version", json("PUT", body)),
  importCsv: (body) => requestJson("/api/design-token-set-import", json("POST", body)),
  validate: (body) => requestJson("/api/design-token-set-validate", json("POST", body)),
  activate: (body) => requestJson("/api/design-token-set-activate", json("POST", body)),
  publish: (body) => requestJson("/api/design-token-set-publish", json("POST", body)),
  updateStatus: (body) => requestJson("/api/design-token-set-status", json("POST", body)),
  deleteSet: (body) => requestJson("/api/design-token-set-delete", json("POST", body)),
  archive: (body) => requestJson("/api/design-token-set-archive", json("POST", body)),
});
