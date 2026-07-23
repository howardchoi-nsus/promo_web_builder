# n8n 관리자 설정 연동 수정 가이드 — 2026-07-12

## 1. 문서 목적

관리자 페이지에서 선택한 LLM provider/model, 프롬프트, 모델 옵션이 실제 이미지 생성에 적용되도록 Cloud n8n Worker를 수정한다.

애플리케이션 API는 queue 시점의 설정을 `execution snapshot`으로 확정해 Worker payload에 전달하도록 반영되어 있다. 그러나 Cloud n8n에 구형 Worker가 남아 있으면 n8n이 프롬프트를 다시 렌더링하거나 모델을 고정해서 호출하므로 관리자 설정과 실제 실행이 달라질 수 있다.

이 문서는 다음 세 Worker의 수정·검증·운영 전환 절차를 정의한다.

- Promo Integrated Brief Worker
- Promo Lo-Fi Draft Worker
- Promo Final Design Worker

## 2. 핵심 실행 계약

신규 task를 queue할 때 API가 다음 값을 확정한다.

```text
execution.snapshotVersion
execution.provider
execution.model
execution.modelOptions
execution.renderedPrompt
execution.promptVersion
execution.renderedPromptHash
```

n8n은 이 값을 실행 입력의 단일 기준으로 사용해야 한다.

- n8n에서 active prompt를 다시 조회하거나 다시 렌더링하지 않는다.
- provider/model을 HTTP Request 노드에 고정하지 않는다.
- 재시도에서도 최초 task의 snapshot을 그대로 사용한다.
- callback metadata에는 실제 호출에 사용한 prompt/model/options를 기록한다.
- 관리자 설정 변경은 이미 queue된 task가 아니라 다음 신규 task부터 적용한다.

## 3. 현재 확인된 문제

### 3.1 Cloud Lo-Fi Worker가 구형 구조임

2026-07-12 확인 당시 백업 Lo-Fi Worker에는 다음 구형 구조가 남아 있었다.

- `Render LO-FI Draft Prompt` 노드가 존재한다.
- `/api/prompts-render`를 실행 중 다시 호출한다.
- 이미지 생성 모델과 옵션이 Worker 설정에 고정될 수 있다.
- queue 시점에 확정된 `execution.renderedPrompt`가 단일 기준이 아니다.

이 상태에서는 관리자가 프롬프트나 모델을 수정해도 실행 시점에 다른 설정이 적용될 수 있다.

### 3.2 n8n의 Import from URL 동작

기존 Workflow 화면에서 `Import from URL`을 실행하면 현재 노드를 교체하지 않고 가져온 노드를 같은 canvas에 추가한다. 그 결과 Webhook과 Worker 노드가 중복된다.

따라서 기존 Workflow에 신규 JSON을 직접 import하면 안 된다. 다음 중 한 가지 방식만 사용한다.

1. 신규 Workflow를 만든 후 JSON을 import하고 기존 API key를 다시 입력한다.
2. 기존 백업 Workflow의 노드를 수동으로 수정한다.

운영 Workflow에 바로 import하지 않는다.

## 4. 공통 수정 원칙

### 4.1 API key 유지

OpenAI credential 등록 오류 때문에 현재 HTTP Request 노드의 Authorization header에 API key를 유지한다.

- 저장소 JSON의 `__RETAIN_EXISTING_N8N_KEY__`는 실제 키가 아니라 교체 표시자다.
- Cloud에 적용할 때 기존 Worker의 Authorization 값을 새 Worker에 다시 입력한다.
- API key를 Git, 문서, 실행 로그, 화면 캡처에 복사하지 않는다.
- key가 포함된 Cloud export 파일을 저장소에 커밋하지 않는다.

### 4.2 실패 처리

- timeout, 429, 일시적 5xx는 동일 snapshot으로 최소 1회 재시도한다.
- 최종 실패 시 해당 task를 `failed`로 callback한다.
- OpenAI 또는 provider의 오류 메시지를 `errorMessage`에 저장한다.
- 이미지 응답에 base64가 없으면 성공으로 처리하지 않는다.
- 재시도하면서 관리자 최신 설정을 다시 읽지 않는다.

### 4.3 실행 결과 metadata

성공과 실패 모두 가능한 범위에서 다음 정보를 저장한다.

```json
{
  "promptMeta": {
    "promptVersion": "execution.promptVersion",
    "renderedPromptHash": "execution.renderedPromptHash"
  },
  "modelMeta": {
    "provider": "execution.provider",
    "model": "execution.model",
    "modelOptions": "execution.modelOptions"
  }
}
```

## 5. Lo-Fi Draft Worker 수정

### 5.1 기준 파일

```text
n8n/Promo Lo-Fi Draft Worker.admin-driven.json
```

### 5.2 노드 구조

```text
Webhook
→ Respond to Webhook
→ Normalize Draft Payload
→ Get Generation Run State
→ Generate LO-FI Draft Image
→ Check Image Base64
→ Save LO-FI Draft Result
```

### 5.3 제거 대상

- `Render LO-FI Draft Prompt`
- `Check Image Base64`의 이름과 값이 모두 빈 assignment
- 구형 Render 노드를 참조하는 모든 expression

### 5.4 Normalize Draft Payload

다음 값을 request body의 `execution`에서 추출한다.

```text
provider       = body.execution.provider
model          = body.execution.model
modelOptions   = body.execution.modelOptions
renderedPrompt = body.execution.renderedPrompt
promptVersion  = body.execution.promptVersion
renderedPromptHash = body.execution.renderedPromptHash
```

OpenAI 이미지 API 호출 전 `provider === openai` 및 허용된 이미지 모델인지 검증한다. 현재 지원하지 않는 provider/model 조합은 OpenAI로 조용히 대체하지 말고 `failed` 처리한다.

### 5.5 Generate LO-FI Draft Image

Endpoint:

```text
POST https://api.openai.com/v1/images/generations
```

요청값:

```text
model   = Normalize Draft Payload.model
prompt  = Normalize Draft Payload.renderedPrompt
size    = Normalize Draft Payload.modelOptions.size
quality = Normalize Draft Payload.modelOptions.quality
n       = 1
```

방어적으로 prompt는 최대 30,000자로 제한한다. API에서 이미 압축한 `renderedPrompt`가 전달되므로 정상 실행에서는 추가 절단이 발생하지 않아야 한다.

### 5.6 Check Image Base64

다음 값을 안전하게 계산한다.

```text
hasBase64       = Boolean(response.data?.[0]?.b64_json)
draftImageBase64 = response.data?.[0]?.b64_json || ''
generationError = response.error?.message || response.message || no-image 오류
```

### 5.7 Save LO-FI Draft Result

- base64가 있으면 `ready`
- base64가 없으면 `failed`
- `draftPrompt`에는 snapshot의 `renderedPrompt` 저장
- `promptMeta`, `modelMeta`에는 실제 snapshot 값 저장

## 6. Final Design Worker 수정

### 6.1 기준 파일

```text
n8n/Promo Final Design Worker.image-edit.json
```

### 6.2 필수 구조

```text
Webhook
→ Respond to Webhook
→ Normalize Final Design Payload
→ Get Generation Run State
→ Download Confirmed LO-FI Image
→ Generate Final Design Image
→ Check Final Image Base64
→ Save Final Design Result
```

### 6.3 필수 변경값

- `execution.renderedPrompt`, provider, model, modelOptions를 Normalize 단계에서 보존한다.
- Final prompt를 n8n에서 다시 렌더링하지 않는다.
- Confirmed Lo-Fi proxy URL에서 실제 이미지를 binary `data`로 다운로드한다.
- `/v1/images/edits`에 multipart/form-data로 이미지와 prompt를 전송한다.
- `input_fidelity=high`를 사용한다.
- LO-FI 다운로드 실패와 image edit 실패 모두 1회 재시도 후 `failed` callback한다.
- callback에 `referenceMode=image_edit`와 실제 model metadata를 저장한다.

`input_fidelity=high`는 low보다 이미지 입력 토큰을 약 10배 사용할 수 있으므로 실행량과 비용을 별도로 모니터링한다.

### 6.4 프롬프트 길이

OpenAI 이미지 요청 prompt는 32,000자 이하여야 한다. 애플리케이션 API의 목표 상한은 30,000자다.

운영 API 검증 결과:

```text
원본 길이: 43,936
압축 후 길이: 29,904
결과: 정상
```

Worker도 최종 방어선으로 30,000자 제한을 유지한다.

## 7. Integrated Brief Worker 수정·확인

Integrated Brief도 Lo-Fi/Final과 동일하게 queue 시점의 execution snapshot을 사용해야 한다.

- provider/model에 따라 승인된 text API 분기를 사용한다.
- snapshot의 `renderedPrompt`를 사용하고 n8n에서 prompt를 다시 조회하지 않는다.
- timeout/429/일시적 5xx는 동일 snapshot으로 1회 재시도한다.
- 최종 오류 시 run 상태를 `failed`로 갱신한다.
- response length guard를 적용한다.

길이 기준:

| 응답 길이 | 처리 |
|---:|---|
| 15,000자 초과 | warning 기록 |
| 20,000자 초과 | 동일 snapshot으로 1회 재시도 |
| 30,000자 초과 | parse 시도 없이 failed 처리 |

Integrated Brief의 provider 분기 및 운영 게시 상태는 Version History에서 확인한 뒤 변경한다.

## 8. 안전한 적용 순서

### Phase 1. Cloud 백업 보존

1. 현재 운영 Workflow와 백업 Workflow의 ID, 활성 상태, Published version을 기록한다.
2. 기존 Workflow를 Cloud 내부에서 Duplicate한다.
3. Duplicate 이름에 적용 날짜와 `admin-driven-test`를 포함한다.
4. 운영 Webhook과 충돌하지 않는 테스트 Webhook 경로를 사용한다.
5. 기존 API key는 Cloud 안에서만 새 노드에 옮긴다.

### Phase 2. 백업 Worker 수정

1. 기준 JSON과 노드별 설정을 대조한다.
2. 구형 Render 노드를 제거한다.
3. Normalize, Generate, Check, Save expression을 신규 계약으로 변경한다.
4. 연결선이 신규 처리 순서와 일치하는지 확인한다.
5. placeholder Authorization 값이 실제 기존 key로 교체됐는지 마스킹 상태에서 확인한다.
6. 테스트 Webhook으로 Publish한다.

### Phase 3. 백업 E2E 테스트

다음 케이스를 각각 실행한다.

1. 기본 설정 성공
2. 관리자 prompt 변경 후 신규 task에 변경 내용 반영
3. 관리자 model option 변경 후 신규 task에 반영
4. 이미 queue된 task에는 이후 관리자 변경이 영향을 주지 않음
5. 잘못된 provider/model 조합이 명시적으로 failed 처리됨
6. 30,000자에 가까운 prompt 성공
7. timeout/429/5xx 재시도 후 성공 또는 failed callback
8. 이미지 base64 누락 시 failed 처리
9. Final에서 confirmed Lo-Fi 이미지가 실제 image edit 입력으로 사용됨

### Phase 4. 운영 전환

1. 백업 E2E 성공 결과와 DB metadata를 확인한다.
2. 운영 Worker의 Version History 복구 지점을 기록한다.
3. 운영 Workflow를 동일 구조로 수동 수정한다.
4. 기존 운영 Webhook 경로를 유지한다.
5. Publish 후 제한된 운영 task 1건을 실행한다.
6. 성공 확인 후 일반 사용을 재개한다.

## 9. 검증 체크리스트

### n8n 실행 화면

- [ ] payload의 `execution.snapshotVersion`이 신규 버전이다.
- [ ] Normalize 결과에 provider/model/modelOptions/renderedPrompt가 있다.
- [ ] Lo-Fi와 Final에 구형 Render Prompt 노드가 없다.
- [ ] Generate 요청 모델과 옵션이 snapshot 값과 같다.
- [ ] prompt가 30,000자 이하이다.
- [ ] 재시도 횟수는 최대 1회이다.
- [ ] 실패 후에도 callback 노드가 실행된다.

### DB/API 결과

- [ ] 성공 task 상태가 `ready`다.
- [ ] 실패 task 상태가 `failed`다.
- [ ] 오류 메시지가 저장된다.
- [ ] `promptMeta.promptVersion`이 queue snapshot과 같다.
- [ ] `promptMeta.renderedPromptHash`가 queue snapshot과 같다.
- [ ] `modelMeta.provider/model/modelOptions`가 실제 API 요청과 같다.
- [ ] Final에 `referenceMode=image_edit`가 저장된다.

### 관리자 페이지

- [ ] prompt 변경이 다음 신규 task부터 적용된다.
- [ ] model/option 변경이 다음 신규 task부터 적용된다.
- [ ] 지원하지 않는 provider/model은 선택 또는 실행 단계에서 차단된다.
- [ ] 이미 queue된 task의 snapshot은 변경되지 않는다.

## 10. 롤백

다음 중 하나라도 발생하면 운영 게시를 중단하고 직전 Published version으로 복구한다.

- Webhook이 정상 응답하지 않음
- API key/Authorization 오류
- callback이 실행되지 않아 task가 무기한 processing 상태로 남음
- model metadata와 실제 요청이 불일치
- Final image edit 대신 text-only generation이 실행됨
- 비용 또는 실패율이 기준을 크게 초과함

롤백 후 실패 task ID, n8n execution ID, callback 응답, provider 오류 코드만 기록한다. API key와 전체 Authorization header는 기록하지 않는다.

## 11. 완료 기준

다음 조건을 모두 만족하면 n8n 수정 완료로 판단한다.

1. 세 Worker가 queue 시점 execution snapshot을 사용한다.
2. 관리자 prompt/model/options 변경이 다음 신규 task에 반영된다.
3. n8n 내부 재렌더링과 하드코딩 모델 의존이 제거된다.
4. 성공·실패 callback과 최소 1회 재시도가 검증된다.
5. callback metadata와 실제 API 호출값이 일치한다.
6. Final Design이 confirmed Lo-Fi 이미지를 image edit 입력으로 사용한다.
7. prompt 32,000자 초과 오류가 재발하지 않는다.

## 12. 범위 경계

이 수정은 관리자 설정 실행 연동과 Lo-Fi → Final 레이아웃 fidelity를 대상으로 한다.

선택한 Design MD의 브랜드 스타일 DNA가 Integrated Brief 단계에서 일반화되는 문제는 별도 style fidelity 트랙이다. 본 작업을 완료해도 색상, 질감, 컴포넌트 스타일의 브랜드 충실도 문제는 남을 수 있다.

