import { reactive } from "vue";
import { createAiBuilderState } from "../../shared/composition/composition-state.mjs";

export function createAiBuilderStore(overrides = {}) {
  return reactive(createAiBuilderState(overrides));
}

export function setBuilderError(store, error) {
  const details = Array.isArray(error?.details)
    ? error.details.slice(0, 5).map((detail) => ({
        code: String(detail?.code || "VALIDATION_ERROR"),
        path: String(detail?.path || "unknown"),
        message: detail?.message ? String(detail.message) : "",
      }))
    : [];
  store.stage = "failed";
  store.error = {
    code: String(error?.code || "BUILDER_REQUEST_FAILED"),
    message: String(error?.message || error || "요청을 처리하지 못했습니다."),
    details,
  };
}

export function clearBuilderError(store) {
  store.error = null;
}
