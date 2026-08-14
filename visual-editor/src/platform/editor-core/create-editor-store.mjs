import { reduceEditorCommand } from "./command-reducer.mjs";
import { cloneEditorState, createEditorDocument, createEditorState } from "./editor-state.mjs";

export function createEditorStore(initialDocument = createEditorDocument(), { historyLimit = 50 } = {}) {
  let state = createEditorState(initialDocument);
  let undoStack = [];
  let redoStack = [];
  let readOnly = false;

  function readOnlyResult() {
    return {
      ok: false,
      code: "EDITOR_READ_ONLY",
      error: "Editor is read-only.",
      state: getState(),
      history: getHistoryState(),
    };
  }

  function snapshot() {
    return cloneEditorState(state);
  }

  function replaceDocument(document, { resetHistory = true, dirty } = {}) {
    const revision = resetHistory ? 0 : state.revision;
    state = {
      ...createEditorState(document),
      revision,
      dirty: dirty ?? (resetHistory ? false : state.dirty),
    };
    if (resetHistory) {
      undoStack = [];
      redoStack = [];
    }
    return getState();
  }

  function execute(command) {
    if (readOnly) return readOnlyResult();
    const before = snapshot();
    const result = reduceEditorCommand(state, command);
    if (!result.ok) return { ...result, history: getHistoryState() };
    undoStack = [...undoStack.slice(-(historyLimit - 1)), before];
    redoStack = [];
    state = result.state;
    return { ok: true, state: getState(), history: getHistoryState() };
  }

  function undo() {
    if (readOnly) return readOnlyResult();
    const previous = undoStack.at(-1);
    if (!previous) return { ok: false, state: getState(), history: getHistoryState(), error: "Nothing to undo." };
    redoStack = [...redoStack.slice(-(historyLimit - 1)), snapshot()];
    undoStack = undoStack.slice(0, -1);
    state = cloneEditorState(previous);
    return { ok: true, state: getState(), history: getHistoryState() };
  }

  function redo() {
    if (readOnly) return readOnlyResult();
    const next = redoStack.at(-1);
    if (!next) return { ok: false, state: getState(), history: getHistoryState(), error: "Nothing to redo." };
    undoStack = [...undoStack.slice(-(historyLimit - 1)), snapshot()];
    redoStack = redoStack.slice(0, -1);
    state = cloneEditorState(next);
    return { ok: true, state: getState(), history: getHistoryState() };
  }

  function markSaved() {
    state = { ...state, dirty: false };
    return getState();
  }

  function setReadOnly(value) {
    readOnly = value === true;
    return readOnly;
  }

  function getState() {
    return cloneEditorState(state);
  }

  function getHistoryState() {
    return {
      undoCount: undoStack.length,
      redoCount: redoStack.length,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
    };
  }

  return Object.freeze({
    execute,
    undo,
    redo,
    replaceDocument,
    markSaved,
    setReadOnly,
    getState,
    getHistoryState,
  });
}
