(function registerEditorSnapshotContract(global) {
  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function normalizeRevision(value) {
    const revision = Number(value || 0);
    return Number.isFinite(revision) && revision > 0 ? Math.floor(revision) : 0;
  }

  function shouldAcceptRevision(incomingRevision, currentRevision) {
    const incoming = normalizeRevision(incomingRevision);
    const current = normalizeRevision(currentRevision);
    return !incoming || !current || incoming >= current;
  }

  function createBridgeSnapshot(snapshot, snapshotRevision = 0) {
    if (!snapshot || typeof snapshot !== "object") return null;
    return {
      ...clone(snapshot),
      snapshotRevision: normalizeRevision(snapshotRevision),
    };
  }

  function normalizeEditorChange(message = {}) {
    if (!message?.designSpec || typeof message.designSpec !== "object") return null;
    return {
      snapshotRevision: normalizeRevision(message.snapshotRevision),
      designSpec: clone(message.designSpec),
      sectionInputs: message.sectionInputs && typeof message.sectionInputs === "object"
        ? clone(message.sectionInputs)
        : null,
    };
  }

  global.PromoEditorSnapshotContract = Object.freeze({
    clone,
    normalizeRevision,
    shouldAcceptRevision,
    createBridgeSnapshot,
    normalizeEditorChange,
  });
})(globalThis);
