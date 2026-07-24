# Admin LLM 설정 → n8n 실제 실행 연동 계획

Date: 2026-07-12  
Status: Proposed  
Scope: Admin Prompt Management, `integrated_brief`, `lofi_draft`, `final_design`, n8n Provider Routing, Execution Snapshot

## 1. 목적

관리자 페이지에서 저장한 다음 값이 실제 n8n 실행의 단일 기준이 되도록 개선한다.

- Provider
- Model
- Prompt body
- Required/optional variables
- Temperature
- Max tokens
- Response format
- Model options
  - image size
  - quality
  - input fidelity
  - 기타 provider별 옵션

현재는 프롬프트 본문은 n8n에 적용되지만, Provider와 Model은 단계별 검증 및 n8n 하드코딩 때문에 일부만 적용된다. 특히 LO-FI Worker는 OpenAI endpoint, `gpt-image-1`, `1024x1536`이 직접 지정돼 있어 Admin의 model 설정과 실제 요청이 다를 수 있다.

## 2. 현재 문제

### 2.1 Admin은 저장하지만 Worker가 모두 소비하지 않음

Admin은 `/api/prompt-template`을 통해 다음 값을 DB에 저장한다.

```text
body
provider
model
temperature
maxTokens
responseFormat
modelOptions
```

Queue API는 active template을 읽어 execution snapshot을 생성하고 n8n payload에 요약을 전달한다. 그러나 n8n이 snapshot 값을 사용하지 않고 자체 고정값을 사용하는 항목이 존재한다.

### 2.2 단계별 현재 상태

| Stage | Prompt | Provider | Model | Options | 현재 문제 |
|---|---|---|---|---|---|
| Integrated Brief | 적용 | OpenAI 고정 | snapshot 기반 | 일부 적용 | Provider 분기 없음 |
| LO-FI Draft | 적용 | OpenAI 고정 | `gpt-image-1` 하드코딩 | size 하드코딩 | Admin model/options 무시 |
| Final Design | 적용 | OpenAI endpoint 고정 | snapshot 기반 | 일부 적용 | Provider 분기 없음, `inputFidelity` 명칭 불일치 |
| Image Execution | 해당 타입 호출 Workflow에만 적용 | 별도 | 별도 | 별도 | 3단계 Worker와 혼동 가능 |

### 2.3 Snapshot과 실제 Prompt 버전이 섞일 수 있음

현재 Queue 시점에 model/prompt snapshot을 생성하지만, n8n은 실행 시 `/api/prompts-render`를 다시 호출한다.

```text
Queue 시점: model A + prompt version 3 snapshot
관리자 수정: prompt version 4 활성화
n8n 실행: model A + prompt version 4
```

따라서 하나의 실행에 서로 다른 시점의 설정이 섞일 수 있다.

### 2.4 Provider 선택 UI가 실제 지원 범위보다 넓어 보임

애플리케이션 검증은 현재 세 stage에 OpenAI만 허용한다.

- `integrated_brief`: OpenAI + JSON response
- `lofi_draft`: OpenAI + GPT Image
- `final_design`: OpenAI + GPT Image edit

Admin에서 다른 Provider를 입력할 수 있어도 저장/활성화가 거절되거나, n8n이 해당 Provider endpoint를 호출하지 못한다.

### 2.5 옵션 이름 불일치

예:

```text
Admin/DB: inputFidelity
n8n:      input_fidelity
```

이 상태에서는 Admin에서 값을 변경해도 n8n 기본값으로 대체될 수 있다.

## 3. 목표 원칙

### 3.1 Admin은 설정 원본, Snapshot은 실행 원본

```text
Admin active template
→ Queue 시 immutable execution snapshot 생성
→ n8n은 snapshot만 소비
→ 실제 요청값을 callback metadata로 기록
```

Admin은 다음 실행의 설정 원본이다. 이미 Queue에 들어간 작업은 Admin 변경의 영향을 받지 않는다.

### 3.2 n8n에는 Provider/Model 하드코딩 금지

n8n에서 허용하는 고정값은 다음으로 제한한다.

- API endpoint map
- Credential reference
- 공통 timeout/retry
- callback URL
- 안전 상한

다음 값은 execution snapshot에서만 읽는다.

- provider
- model
- renderedPrompt
- responseFormat
- modelOptions

### 3.3 실제 요청과 기록값 일치

callback의 `modelMeta`에는 Admin 설정값이 아니라 실제 외부 API에 전송한 값을 기록한다.

```json
{
  "requestedProvider": "openai",
  "requestedModel": "gpt-image-1",
  "requestedOptions": {
    "size": "1024x1536",
    "quality": "high",
    "inputFidelity": "high"
  },
  "credentialAlias": "openai-image-api",
  "promptVersion": 4,
  "renderedPromptHash": "..."
}
```

API key 값은 기록하지 않는다.

## 4. 목표 아키텍처

```text
Admin Page
  ↓ save / activate
prompt_templates DB
  ↓ queue
createPromptExecutionSnapshot()
  ↓ immutable snapshot
task.prompt_meta.executionSnapshot
task.model_meta
  ↓ worker payload
n8n Normalize Execution
  ↓ provider switch
OpenAI / Google / supported provider request
  ↓ normalized result
callback with actual execution metadata
```

### 4.1 Worker Payload 계약

```json
{
  "runId": "...",
  "taskId": "...",
  "stage": "lofi_draft",
  "execution": {
    "snapshotId": "...",
    "promptType": "lofi_draft",
    "promptVersion": 4,
    "provider": "openai",
    "model": "gpt-image-1",
    "responseFormat": "image",
    "renderedPrompt": "...",
    "renderedPromptHash": "...",
    "modelOptions": {
      "size": "1024x1536",
      "quality": "high",
      "inputFidelity": "low"
    }
  }
}
```

`renderedPrompt`가 payload 크기 정책상 부담되면 n8n이 `snapshotId`로 immutable task detail을 조회한다. 현재 active template을 다시 렌더링하면 안 된다.

## 5. 지원 범위 결정

### 5.1 1차 지원 매트릭스

| Stage | Provider | Model family | 비고 |
|---|---|---|---|
| Integrated Brief | OpenAI | text/JSON 모델 | 기존 지원 유지 |
| LO-FI Draft | OpenAI | GPT Image | 먼저 Admin 연동 완성 |
| Final Design | OpenAI | GPT Image edit | 기존 image edit 유지 |

1차 목표는 Provider 추가가 아니라 Admin의 OpenAI 설정과 실제 요청을 100% 일치시키는 것이다.

### 5.2 2차 Provider 확장

Provider 확장은 stage별 adapter가 준비된 경우에만 Admin에서 선택 가능하게 한다.

예:

| Stage | OpenAI | Google |
|---|---|---|
| Integrated Brief | 지원 | adapter 개발 후 지원 |
| LO-FI Draft | 지원 | reference 없는 image generation adapter 필요 |
| Final Design | 지원 | LO-FI reference image 입력 지원 검증 필요 |

Google을 추가할 때는 단순 endpoint 변경이 아니라 request/response 변환, 이미지 binary 처리, 오류 정규화, 비용 metadata까지 구현해야 한다.

## 6. Phase 0 — 계약 및 기준선 고정

### 작업

1. Cloud 운영 Worker 3개의 최신 JSON을 secret 제거 상태로 export한다.
2. Admin/DB/n8n의 stage별 설정 매핑표를 만든다.
3. model option canonical schema를 확정한다.
4. 기존 실행 metadata와 실제 요청 불일치 사례를 수집한다.
5. 운영 Worker와 백업 Worker의 Version ID를 기록한다.

### Canonical option 이름

애플리케이션과 DB에서는 camelCase를 표준으로 사용한다.

```json
{
  "size": "1024x1536",
  "quality": "high",
  "inputFidelity": "high",
  "background": "opaque",
  "outputFormat": "png"
}
```

Provider 요청 직전에만 API 필드명으로 변환한다.

```text
inputFidelity → input_fidelity
outputFormat  → output_format
```

### 완료 기준

- Admin 필드 하나마다 DB, snapshot, n8n, 외부 API 필드가 매핑돼 있다.
- 미지원 설정은 명시적으로 표시된다.
- Cloud/저장소 기준선이 일치한다.

## 7. Phase 1 — Immutable Execution Snapshot

### 작업

1. Queue 시점에 완성된 `renderedPrompt`를 snapshot에 저장한다.
2. snapshot에 다음 필드를 필수화한다.
   - prompt ID/type/version
   - rendered prompt/hash
   - provider/model/response format
   - normalized model options
   - createdAt
3. n8n payload에 snapshot 전체 또는 `snapshotId`를 전달한다.
4. n8n의 `/api/prompts-render` 재호출을 제거한다.
5. 재시도는 최초 snapshot을 그대로 사용한다.
6. Admin 변경은 새 Queue 작업에만 반영한다.

### Prompt 길이 정책

- Integrated Brief 응답 guard와 Final prompt input guard를 분리한다.
- Final prompt는 외부 API 제한보다 낮은 30,000자 안전 한도를 사용한다.
- 압축 여부, 원본 길이, 최종 길이, 압축 필드를 snapshot에 기록한다.

### 완료 기준

- Queue 후 Admin을 수정해도 기존 작업의 prompt hash가 변하지 않는다.
- 동일 task 재시도에서 prompt hash와 model options가 동일하다.
- 32,000자 초과 오류가 재발하지 않는다.

## 8. Phase 2 — LO-FI Worker 하드코딩 제거

### 현재 제거 대상

```text
endpoint: /v1/images/generations
model: gpt-image-1
size: 1024x1536
n: 1
```

Endpoint와 `n=1` 정책은 stage adapter에 둘 수 있지만 model/size/quality는 snapshot에서 읽는다.

### 변경 후 n8n 표현식

```text
model  = execution.model
prompt = execution.renderedPrompt
size   = execution.modelOptions.size
quality = execution.modelOptions.quality
```

### 작업

1. `Normalize LO-FI Payload`에 execution 필드를 추가한다.
2. model 하드코딩을 `execution.model`로 교체한다.
3. size/quality/background를 normalized options에서 읽는다.
4. Provider Switch 노드를 추가한다.
5. 1차에서는 OpenAI route만 활성화한다.
6. 미지원 Provider는 외부 API 호출 전에 `failed` callback한다.
7. callback `modelMeta`를 실제 요청값으로 생성한다.

### 완료 기준

- Admin에서 LO-FI model/size/quality 변경 후 실제 n8n request가 동일하다.
- DB model metadata와 실제 요청값이 일치한다.
- 하드코딩된 `gpt-image-1`, `1024x1536`가 Worker body에 없다.

## 9. Phase 3 — Final Design 옵션 정규화

### 작업

1. Final Worker endpoint는 Provider adapter가 선택한다.
2. `execution.model`을 사용한다.
3. `inputFidelity`를 OpenAI 요청 시 `input_fidelity`로 변환한다.
4. quality/size/background/outputFormat을 snapshot에서 읽는다.
5. Confirmed LO-FI binary input 구조는 유지한다.
6. layout fidelity policy를 snapshot에 포함한다.
7. prompt 30,000자 안전 제한을 서버와 n8n 양쪽에 유지한다.
8. 실제 요청 options를 callback metadata로 기록한다.

### 완료 기준

- Admin에서 `inputFidelity=low` 지정 시 실제 요청이 `input_fidelity=low`다.
- Admin에서 model을 지원되는 다른 GPT Image 모델로 변경하면 n8n 요청이 변경된다.
- 미지원 model은 Queue 전에 4xx로 차단된다.
- LO-FI reference image가 항상 binary input으로 전달된다.

## 10. Phase 4 — Integrated Brief 연동 정리

### 작업

1. model, temperature, maxTokens, responseFormat을 snapshot에서 사용한다.
2. n8n OpenAI body의 하드코딩을 제거한다.
3. JSON mode/structured output 정책을 명확히 한다.
4. timeout과 retry 정책을 model option과 분리한다.
5. 길이 guard 결과를 callback metadata에 저장한다.
6. 향후 Google text adapter 추가 지점을 Provider Switch로 분리한다.

### 완료 기준

- Admin model/temperature/maxTokens 변경이 실제 요청과 일치한다.
- 15,000 warning / 20,000 retry / 30,000 fail 정책이 유지된다.
- JSON parse 실패가 일반 실패 callback으로 기록된다.

## 11. Phase 5 — Admin UI 제약 및 안내

### 작업

1. 자유 입력 Provider를 지원 매트릭스 기반 select로 변경한다.
2. Stage 선택에 따라 지원 Provider/Model만 표시한다.
3. 미지원 조합은 저장 전에 비활성화하고 사유를 표시한다.
4. Prompt status를 명확히 표시한다.
   - Active: 다음 실행부터 적용
   - Draft: 활성화 전 미적용
   - Archived: 수정/활성화 불가
5. 저장 시 적용 범위를 표시한다.
   - 신규 Queue 작업에만 적용
   - 기존 Queue/Running 작업은 snapshot 유지
6. model options를 JSON textarea에서 구조화된 필드로 전환한다.
7. 저장 전에 Preview/Validate 기능을 추가한다.
8. 현재 실제 운영 Worker가 소비하는 필드 목록을 표시한다.

### Admin 안내 문구 예시

```text
이 설정은 저장 후 새로 생성되는 LO-FI 작업부터 적용됩니다.
이미 대기 또는 실행 중인 작업은 기존 실행 snapshot을 사용합니다.
```

### 완료 기준

- 적용되지 않는 Provider/Model을 선택할 수 없다.
- Admin에서 보이는 값과 실제 Worker 지원 범위가 일치한다.
- 사용자가 `image_execution`과 `lofi_draft`/`final_design`을 혼동하지 않는다.

## 12. Phase 6 — Provider Adapter 확장

### Adapter 인터페이스

```text
validate(stage, model, options)
buildRequest(snapshot, binaryInputs)
execute(credential, request)
normalizeSuccess(response)
normalizeError(error)
extractUsage(response)
```

### n8n 분기

```text
Normalize Execution
→ Switch(provider)
   ├─ openai → OpenAI request
   ├─ google → Google request
   └─ unsupported → failed callback
→ Normalize Provider Response
→ Save Result
```

### Provider 추가 조건

- 해당 stage 기능 지원 확인
- reference image/binary 형식 검증
- Credential 준비
- 오류 코드 정규화
- usage/cost metadata 확보
- 성공/실패 E2E 테스트
- 롤백 경로 확보

## 13. Credential 및 보안 계획

현재 OpenAI Credential 등록 오류 때문에 n8n HTTP Request 노드에 기존 키를 유지한다는 사용자 결정이 있다.

이 제약 아래의 계획:

1. Provider routing과 설정 연동을 먼저 구현한다.
2. API 키 값은 payload, DB, callback, Git export에 포함하지 않는다.
3. n8n 내부에서 Provider별 credential alias만 사용하도록 인터페이스를 설계한다.
4. Credential 등록 문제가 해결되면 Header literal을 Credential 참조로 교체한다.
5. 그 전까지 workflow export는 secret 제거 후 저장소에 반영한다.
6. 로그와 실행 output에서 Authorization 값을 표시하지 않는다.

Credential 상태는 Admin LLM 설정과 분리한다. Admin은 사용할 Provider/Model을 선택하고, 운영자는 해당 Provider Credential 준비 여부를 별도 관리한다.

## 14. 데이터 및 API 변경

### 최소 변경안

기존 `prompt_meta.executionSnapshot`과 `model_meta`를 유지한다.

추가 권장 필드:

```json
{
  "executionSnapshot": {
    "snapshotVersion": 2,
    "renderedPrompt": "...",
    "renderedPromptHash": "...",
    "provider": "openai",
    "model": "gpt-image-1",
    "responseFormat": "image",
    "modelOptions": {},
    "createdAt": "..."
  },
  "actualExecution": {
    "provider": "openai",
    "model": "gpt-image-1",
    "options": {},
    "startedAt": "...",
    "completedAt": "...",
    "usage": {}
  }
}
```

### 장기 변경안

`prompt_execution_snapshots` 테이블을 별도로 만든다.

장점:

- immutable constraint 적용 가능
- stage별 실행 비교 용이
- 비용/성능 분석 가능
- 재시도와 원본 실행 연결 가능

## 15. 테스트 계획

### 15.1 Contract Test

- Admin save payload → DB row
- DB row → execution snapshot
- snapshot → worker payload
- worker payload → n8n request body
- n8n actual request → callback model metadata

### 15.2 Stage별 E2E

각 stage에서 다음 조합을 테스트한다.

1. Prompt 본문 변경
2. Model 변경
3. 옵션 변경
4. Draft 저장 후 미활성 상태
5. Active 전환 후 적용
6. Queue 후 Admin 재변경
7. 실패 후 재시도
8. 미지원 Provider/Model

### 15.3 검증 Assertions

```text
snapshot.promptVersion == Admin active version at queue time
snapshot.renderedPromptHash == n8n requested prompt hash
snapshot.model == n8n requested model
snapshot.modelOptions == normalized n8n request options
callback.actualExecution == n8n requested values
```

### 15.4 회귀 테스트

- LO-FI 이미지 생성
- Confirm Draft
- Final image edit
- 32,000자 prompt 초과 방지
- 이미지 binary 검증
- 실패 callback
- retry 1회
- 기존 run 조회와 UI polling

## 16. 배포 순서

```text
Phase A: API snapshot v2 배포
→ Phase B: 백업 n8n Worker 3개 반영
→ Phase C: Admin UI 제약/Preview 배포
→ Phase D: 백업 Worker E2E
→ Phase E: LO-FI 운영 전환
→ Phase F: Final 운영 전환
→ Phase G: Integrated Brief 운영 전환
→ Phase H: Provider 추가
```

### 점진 배포

1. 백업 Worker에서 snapshot v2를 검증한다.
2. LO-FI부터 운영 전환한다.
3. Final은 Confirmed LO-FI reference와 prompt length를 함께 검증한다.
4. Integrated Brief는 JSON parse/length guard를 검증한다.
5. Provider 확장은 OpenAI 연동 완료 후 별도 release로 진행한다.

## 17. 롤백 계획

### API 롤백

- snapshot v1 payload를 일정 기간 함께 지원한다.
- n8n은 `snapshotVersion`이 없으면 기존 field mapping을 사용한다.

### Worker 롤백

- 각 운영 Worker의 이전 Published Version ID를 기록한다.
- 단계별로 독립 롤백한다.
- callback API 계약은 이전/신규 모두 수용한다.

### Admin 롤백

- 구조화 UI가 실패하면 JSON model options 편집기로 돌아갈 수 있다.
- DB schema는 additive change만 사용한다.

## 18. 모니터링

필수 지표:

- stage/provider/model별 성공률
- 평균/최대 처리 시간
- retry 비율
- prompt length와 압축 비율
- 이미지 입력/출력 token 또는 provider usage
- callback 실패율
- snapshot과 실제 요청 불일치 수
- unsupported provider/model 차단 횟수

경보:

- snapshot/actual model 불일치 1건 이상
- prompt 30,000자 초과
- task가 stale limit 초과
- 동일 provider 오류율 급증
- 비용 임계치 초과

## 19. 완료 기준

다음 조건을 모두 충족해야 완료로 판단한다.

1. Admin의 Active Prompt 본문이 새 실행에 적용된다.
2. Admin의 model이 실제 n8n request와 일치한다.
3. Admin의 model options가 실제 provider 필드로 변환된다.
4. Queue 후 Admin 변경이 기존 작업에 영향을 주지 않는다.
5. 재시도에서 동일 snapshot을 사용한다.
6. callback metadata가 실제 요청값과 일치한다.
7. LO-FI/Final Worker에 model/size/quality 하드코딩이 없다.
8. 미지원 Provider/Model은 외부 호출 전에 차단된다.
9. Prompt 길이 제한 오류가 재발하지 않는다.
10. API key가 DB, payload, callback, Git export에 포함되지 않는다.
11. 운영 Worker 3개와 저장소 export가 동기화된다.
12. stage별 E2E와 롤백 테스트가 통과한다.

## 20. 권장 우선순위

### P0

- Immutable snapshot 사용
- LO-FI model/size 하드코딩 제거
- Final `inputFidelity` naming 정규화
- Admin 지원 범위 표시

### P1

- Integrated Brief option 연동
- 실제 요청 metadata callback
- snapshot/actual 일치 E2E
- 백업 Worker 검증과 운영 전환

### P2

- Google Provider adapter
- 구조화 model options UI
- 별도 execution snapshot table
- 비용/usage dashboard

## 21. 다음 작업자가 바로 시작할 작업

1. `executionSnapshot` v2 schema를 코드로 정의한다.
2. `workerExecutionSummary()`에 `renderedPrompt` 또는 `snapshotId`를 추가한다.
3. LO-FI Worker backup에서 model/size 하드코딩을 제거한다.
4. Final Worker backup에서 `inputFidelity` 변환을 수정한다.
5. 두 backup Worker에서 Admin 변경 E2E를 실행한다.
6. Admin UI에 stage별 지원 매트릭스를 표시한다.
7. Queue 후 Admin 변경 테스트로 snapshot 불변성을 확인한다.
8. 검증 통과 후 LO-FI → Final → Integrated Brief 순으로 운영 전환한다.
