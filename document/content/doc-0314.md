# 검토 의견: n8n 3단계 Worker 워크플로우 (재검토)

Reviewer: Claude
Date: 2026-07-12
검토 대상: Cloud n8n의 Promo Integrated Brief Worker(`HrxQC5q3qflZTHLa`), Promo Lo-Fi Draft Worker(`rjrA0K4QyNsySTkW`), Promo Final Design Worker(`qGi72lZxFCipYGld`)

## 결론

**Promo Final Design Worker가 오늘(07-12) 대폭 업데이트되어, 지난번 제가 남긴 수정 계획(`n8n-worker-remediation-plan-2026-07-11.md`)의 P1(LO-FI reference 반영)과 P2(provider/model 실제 연동), 그리고 에러 핸들링/재시도까지 거의 전부 반영됐습니다.** 다만 API 키 하드코딩(P0)은 세 워크플로우 모두 여전히 미해결이고, 새로 반영된 로직에서 `input_fidelity` 설정값을 관리자 페이지에서 바꿔도 조용히 무시되는 구체적인 버그 하나를 발견했습니다.

## 이슈사항

### 1. (해결됨) Final Design Worker가 이제 Confirmed LO-FI를 실제 reference image로 사용함

- 신규 노드 `Download Confirmed LO-FI Image`가 `confirmedDraftImageProxyUrl`에서 이미지를 바이너리로 다운로드합니다 (`retryOnFail: true, maxTries: 2`).
- `Generate Final Design Image` 노드가 `https://api.openai.com/v1/images/generations`(text-to-image)에서 `https://api.openai.com/v1/images/edits`로 교체되었고, 다운로드한 LO-FI 이미지를 multipart form의 `image` 필드로 전달합니다.
- `Render Final Design Prompt`도 `type: image_execution`에서 `type: final_design`으로 바뀌어 `_prompt-template-store.js`의 `final_design` prompt type과 정확히 일치합니다.
- 이것으로 지난 `lofi-final-design-fidelity-discussion` 문서의 근본 원인(원인 1, 2, 3)이 구조적으로 해소됐습니다.

### 2. (해결됨) Provider/model이 이제 하드코딩이 아니라 실제 실행 설정을 따라감

`Normalize Final Design Payload` 노드가 `execution.provider`, `execution.model`, `execution.modelOptions`를 payload에서 읽어오고, `Generate Final Design Image`가 이 값을 사용합니다. `Save Final Design Result`도 실제 사용한 provider/model/inputFidelity를 `modelMeta`에 정확히 기록합니다. 다만 아래 3번 항목의 키 이름 불일치 때문에 `input_fidelity`만 예외입니다.

### 3. (신규 발견, 실사용 버그) `input_fidelity` 설정이 관리자 페이지에서 바뀌어도 반영되지 않음

- `api/_prompt-template-store.js`의 `DEFAULT_MODEL_SETTINGS.final_design`은 `inputFidelity: "high"`(camelCase)로 저장됩니다.
- n8n의 `Generate Final Design Image` 노드는 `modelOptions.input_fidelity`(snake_case)를 읽습니다.
- 두 키 이름이 다르기 때문에 n8n은 항상 `|| 'high'` 폴백값을 사용하게 됩니다. 지금은 기본값도 "high"라 겉으로는 문제가 안 보이지만, 나중에 Admin Page에서 이 값을 "low"나 다른 값으로 바꿔도 **조용히 무시되고 계속 "high"로 호출됩니다.**
- 확인: OpenAI 공식 API의 실제 파라미터명은 `input_fidelity`(snake_case)가 맞으므로, n8n → OpenAI 호출부는 올바릅니다. 수정은 저장 쪽(`DEFAULT_MODEL_SETTINGS`와 관리자 페이지가 다루는 키)을 `input_fidelity`로 통일하거나, n8n에서 `modelOptions.inputFidelity`를 읽도록 바꾸는 두 가지 중 하나로 하면 됩니다.

### 4. (여전히 미해결, P0) API 키가 세 워크플로우 모두 평문으로 남아있음

Final Design Worker는 오늘 크게 개선됐지만 `Generate Final Design Image` 노드의 Authorization 헤더에는 여전히 동일한 OpenAI 키가 평문으로 박혀 있습니다. Integrated Brief Worker와 Lo-Fi Draft Worker는 지난 검토 이후 아예 손대지 않은 상태(각각 07-08, 07-11 그대로)라 동일하게 평문 키가 남아있습니다. 이건 지난 계획서의 P0로, 가장 먼저 처리해야 할 항목입니다.

### 5. (일관성 문제) 에러 핸들링/재시도가 Final Design Worker에만 추가됨

Final Design Worker는 이번 업데이트로 `retryOnFail`, `maxTries`, `onError: continueRegularOutput`, 그리고 `generationError` 추출 로직까지 갖췄지만, Integrated Brief Worker의 "Call OpenAI LLM"과 Lo-Fi Draft Worker의 "Generate LO-FI Draft Image" 노드에는 이런 재시도/실패 처리가 없습니다. 두 워크플로우 모두 OpenAI 호출이 실패하면 그대로 워크플로우가 중단되어, run이 영구히 "queued/generating" 상태로 멈출 수 있습니다. Final Design Worker에 적용된 것과 동일한 패턴(retryOnFail + 명시적 실패 callback)을 나머지 두 워크플로우에도 적용하는 것을 권장합니다.

### 6. (사소함, 이전부터 존재) Lo-Fi Draft Worker의 빈 assignment 잔재

`Check Image Base64` 노드에 이름/값이 빈 assignment 항목이 여전히 남아있습니다. Final Design Worker의 동일 계열 노드는 이번에 깔끔하게 정리(타입도 number/boolean으로 명확화)됐으니, Lo-Fi Draft Worker도 같은 방식으로 정리하면 좋겠습니다.

### 7. (참고) LO-FI 이미지 프록시는 여전히 무인증

`Download Confirmed LO-FI Image`가 호출하는 `confirmedDraftImageProxyUrl`은 지난 api/ 폴더 검토에서 지적한 대로 인증 없이 누구나 접근 가능한 프록시입니다. n8n Cloud가 이 URL을 그대로 호출/보관하므로, 프록시 접근 제어(서명 URL 등) 개선은 여전히 유효한 다음 과제입니다.

## 간략한 내용

- Promo Final Design Worker: `updatedAt: 2026-07-12T05:35:20Z`로 오늘 업데이트됨. 레이아웃 fidelity 관련 구조적 문제 대부분 해결.
- Promo Lo-Fi Draft Worker: `updatedAt: 2026-07-11T12:05:32Z` (MCP 접근 활성화 시점 갱신으로 추정, 로직 변경 없음). 여전히 OpenAI `images/generations`(정상 — LO-FI는 참조 이미지가 없는 최초 생성 단계라 문제 없음), 하드코딩 키·모델, 재시도 없음.
- Promo Integrated Brief Worker: `updatedAt: 2026-07-08T08:47:20Z`로 변경 없음. 하드코딩 키·모델, 재시도 없음.

다음 우선순위 제안: P0(API 키 로테이션, 3개 전체) → 3번 `input_fidelity` 키 불일치 수정 → Integrated Brief/Lo-Fi Draft Worker에 재시도·실패 처리 추가 → 이미지 프록시 접근 제어.
