async function request() {
  const response = await fetch("/api/prompt-variables", { cache: "no-store" });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.error || `프롬프트 변수 요청 오류(${response.status})`);
  return result;
}

export const promptVariableService = Object.freeze({ list: request });
