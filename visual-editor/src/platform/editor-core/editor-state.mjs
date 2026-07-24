function clone(value) {
  return JSON.parse(JSON.stringify(value ?? null));
}

export function createEditorDocument({ layout = {}, content = {}, metadata = {} } = {}) {
  return {
    contractVersion: 1,
    layout: clone(layout) || {},
    content: clone(content) || {},
    metadata: clone(metadata) || {},
  };
}

export function createEditorState(document = createEditorDocument()) {
  return {
    document: createEditorDocument(document),
    revision: 0,
    lastCommand: null,
    dirty: false,
  };
}

export function cloneEditorState(state) {
  return {
    ...state,
    document: createEditorDocument(state.document),
    lastCommand: state.lastCommand ? clone(state.lastCommand) : null,
  };
}
