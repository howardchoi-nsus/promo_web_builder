import { reactive } from "vue";
import { createAiBuilderState } from "../../shared/composition/composition-state.mjs";

export function createAiBuilderStore(overrides = {}) {
  return reactive(createAiBuilderState(overrides));
}

export function setBuilderError(store, error) {
  store.stage = "failed";
  store.error = {
    code: String(error?.code || "BUILDER_REQUEST_FAILED"),
    message: String(error?.message || error || "요청을 처리하지 못했습니다."),
  };
}

export function clearBuilderError(store) {
  store.error = null;
}
