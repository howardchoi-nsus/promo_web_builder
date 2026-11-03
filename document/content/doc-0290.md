# n8n 3단계 Worker와 관리자 LLM 설정 연동 논의

Date: 2026-07-11  
Status: Discussion  
Scope: `integrated_brief`, `lofi_draft`, `final_design`

## 1. 논의 목적

Promo Wizard는 Integrated Brief, LO-FI Draft, Final Design을 각각 별도 n8n worker로 호출하도록 애플리케이션 API와 관리자 설정을 갖추고 있다.

Cloud n8n에는 세 단계 전용 workflow가 모두 존재하고 active 상태지만, 현재 저장소의 `n8n` 폴더에는 해당 workflow JSON export가 없다. 또한 실제 Cloud workflow를 검토한 결과 관리자 페이지에서 변경하는 provider/model 설정이 실행에 반영되지 않고, 각 workflow의 모델과 인증이 별도로 고정되어 있다.

이 문서는 다음 사항을 논의하기 위해 작성한다.

- 3단계 애플리케이션 API와 n8n workflow 구현 상태
- 기존 promo workflow를 3단계 worker로 사용할 수 있는지
- Cloud n8n workflow와 로컬 저장소의 동기화 상태
- 관리자 페이지 LLM 설정의 현재 실효성
- n8n API key 관리 문제
- 향후 구현 및 운영 기준

## 2. 검토 범위

이번 검토는 다음 세 stage만 대상으로 한다.

```text
integrated_brief
lofi_draft
final_design
```

관련 애플리케이션 파일:

- `api/promo-generation-integrated-brief.js`
- `api/promo-generation-lofi-drafts.js`
- `api/promo-generation-final-designs.js`
- `api/_promo-generation-worker-trigger.js`
- `api/_worker-webhook-settings-store.js`
- `api/_prompt-template-store.js`
- `api/prompts-render.js`
- `prototype/promo-wizard.js`

검토한 n8n promo workflow:

- `n8n/promo-ui-design-image-generator.workflow.json`
- `n8n/Promo UI Design Image Generator_test (2).gemini-fixed.json`
- `n8n/Promo UI Design Image Generator_testing.gemini-http.json`
- `n8n/promo-ai-page-generator.workflow.json`
- `n8n/Promo AI Desktop Page Generator.external-prompt.fixed.json`
- `n8n/promo-desktop-page-generator.workflow.json`

Cloud n8n 확인 결과:

| Stage | Workflow | Workflow ID | 상태 | 마지막 수정일 |
|---|---|---|---|---|
| `integrated_brief` | Promo Integrated Brief Worker | `HrxQC5q3qflZTHLa` | active | 2026-07-08 |
| `lofi_draft` | Promo Lo-Fi Draft Worker | `rjrA0K4QyNsySTkW` | active | 2026-07-11 |
| `final_design` | Promo Final Design Worker | `qGi72lZxFCipYGld` | active | 2026-07-11 |

Lo-Fi Draft Worker와 Final Design Worker는 2026-07-11에 수정됐고, Integrated Brief Worker의 마지막 수정일은 2026-07-08이다. 2026-07-11 수정 시각은 `Available in MCP` 설정 변경으로 갱신됐을 가능성이 있으므로 기능 변경 시각과 동일하다고 단정하지 않는다.

정확한 현재 상태:

```text
Cloud n8n: 3단계 workflow 존재 및 active
로컬 저장소: 해당 3단계 workflow JSON export 없음
```

## 3. 현재 애플리케이션 구조

관리자 페이지에는 stage별 webhook URL을 관리하는 항목이 있다.

| Stage | 환경변수 fallback |
|---|---|
| `integrated_brief` | `N8N_INTEGRATED_BRIEF_WORKER_URL` |
| `lofi_draft` | `N8N_LOFI_DRAFT_WORKER_URL` |
| `final_design` | `N8N_FINAL_DESIGN_WORKER_URL` |

호출 URL 우선순위:

1. Admin/DB `worker_webhook_settings`의 active URL
2. stage별 환경변수 URL
3. request body override URL

관리자 페이지는 worker URL을 저장하고 활성화하는 역할을 한다. n8n workflow를 생성하거나 배포하지는 않는다.

## 4. Stage별 Worker 계약

### 4.1 Integrated Brief

애플리케이션이 n8n에 전달하는 payload:

```json
{
  "runId": "...",
  "runKey": "...",
  "stage": "integrated_brief",
  "taskId": "...",
  "integratedBriefId": "..."
}
```

필요한 worker 동작:

1. `runId` 또는 `integratedBriefId`로 준비된 입력을 조회한다.
2. active `integrated_brief` prompt와 model settings를 조회한다.
3. Integrated Brief를 생성하고 검증한다.
4. `/api/promo-generation-integrated-brief` 또는 complete callback API에 결과를 기록한다.
5. 실제 사용 provider/model/prompt version을 `modelMeta`, `promptMeta`에 남긴다.

Cloud 및 저장소 확인 결과:

- 기존 promo image workflow 내부에 Integrated Brief 생성 단계는 있다.
- 그러나 전체 promo/MD/template payload를 직접 받는 일괄 workflow다.
- 신규 worker payload의 `runId`, `integratedBriefId`만으로 입력을 다시 조회하는 구조가 아니다.
- Cloud n8n에는 `Promo Integrated Brief Worker`가 존재하고 active 상태다.
- 해당 Cloud workflow는 OpenAI `gpt-4o-mini`를 하드코딩해 사용하며 `/api/prompts-render`가 반환하는 provider/model을 실행 설정으로 사용하지 않는다.
- `Call OpenAI LLM` HTTP Request 노드에 OpenAI API key가 평문으로 하드코딩되어 있다.
- Cloud workflow의 최신 JSON은 로컬 저장소에 export되어 있지 않다.

판단:

Cloud의 전용 worker가 이미 실행 기준이다. 기존 로컬 promo workflow를 대체재로 사용할 필요는 없으며, Cloud workflow의 관리자 설정 연동과 credential 보강이 필요하다.

### 4.2 LO-FI Draft

애플리케이션이 n8n에 전달하는 payload:

```json
{
  "runId": "...",
  "runKey": "...",
  "stage": "lofi_draft",
  "taskId": "...",
  "draftId": "...",
  "draftAttempt": 1
}
```

필요한 worker 동작:

1. `runId`로 완료된 Integrated Brief를 조회한다.
2. active `lofi_draft` prompt와 model settings를 조회한다.
3. wireframe 목적의 LO-FI 이미지를 생성한다.
4. `draftId` 기준 PATCH callback으로 이미지와 metadata를 저장한다.
5. 동일 run에서 여러 draft attempt를 독립적으로 처리한다.

Cloud 및 저장소 확인 결과:

- Cloud n8n에는 `Promo Lo-Fi Draft Worker`가 존재하고 active 상태다.
- Cloud workflow는 실행 모델을 하드코딩하며 관리자 provider/model 설정을 사용하지 않는다.
- API key가 HTTP Request 노드에 평문으로 포함된 상태다.
- Cloud workflow JSON은 로컬 저장소에 export되어 있지 않다.

판단:

실제 생성 worker는 Cloud n8n에 존재한다. 문제는 worker 부재가 아니라 로컬 소스와의 동기화 부재, 관리자 설정 미연동, 평문 credential 관리다.

### 4.3 Final Design

애플리케이션이 n8n에 전달하는 payload:

```json
{
  "runId": "...",
  "runKey": "...",
  "stage": "final_design",
  "taskId": "...",
  "finalDesignId": "...",
  "confirmedDraftId": "..."
}
```

필요한 worker 동작:

1. `confirmedDraftId`로 Confirm된 LO-FI 상세를 조회한다.
2. LO-FI 이미지를 reference/input image로 가져온다.
3. active final prompt와 model settings를 조회한다.
4. LO-FI 레이아웃을 유지하며 시각적 완성도를 높인다.
5. `finalDesignId` 기준 PATCH callback으로 결과를 저장한다.

Cloud 및 저장소 확인 결과:

- Cloud n8n에는 `Promo Final Design Worker`가 존재하고 active 상태다.
- Cloud workflow는 OpenAI `gpt-image-1`을 하드코딩해 사용한다.
- `confirmedDraftId`는 프롬프트 변수 문자열로만 전달되며 Confirm된 LO-FI 이미지를 조회하지 않는다.
- Confirm된 LO-FI를 reference/input image로 모델에 전달하지 않는다.
- `/api/prompts-render`가 반환하는 provider/model을 실제 실행 설정으로 사용하지 않는다.
- API key가 HTTP Request 노드에 평문으로 포함된 상태다.
- 현재 prompt type에도 `final_design` 전용 항목이 없다.
- Cloud workflow JSON은 로컬 저장소에 export되어 있지 않다.

판단:

Final Design worker는 Cloud에 존재하지만 현재 구현은 LO-FI layout-preserving polish가 아니라 텍스트 prompt 기반의 새로운 이미지 생성에 가깝다.

## 5. 기존 Promo Workflow와 3단계 Worker의 차이

기존 `promo-ui-design-image-generator.workflow.json`의 흐름:

```text
전체 promo/MD/template payload
→ Integrated Brief prompt 조회
→ OpenAI Integrated Brief 생성
→ 이미지 prompt 구성
→ Gemini 최종 이미지 생성
→ asset 저장
→ 응답
```

신규 Promo Wizard가 요구하는 흐름:

```text
runId 기반 Integrated Brief worker
→ 결과 DB 저장

runId 기반 LO-FI worker
→ 여러 draft 결과 DB 저장

사용자 Confirm

confirmedDraftId 기반 Final Design worker
→ reference LO-FI를 사용한 최종 결과 DB 저장
```

주요 차이:

| 항목 | 기존 promo workflow | 신규 3단계 worker |
|---|---|---|
| 입력 | 전체 payload | `runId`, `taskId` 중심 |
| 실행 방식 | 한 번에 전체 생성 | stage별 비동기 실행 |
| 중간 결과 | workflow 내부 전달 | DB에 영속화 |
| LO-FI 비교 | 없음 | 여러 attempt 지원 |
| 사용자 Confirm | 없음 | 필수 |
| Final reference | 없음 | Confirmed LO-FI 필요 |
| callback | 최종 asset 저장 | stage별 PATCH callback |

따라서 기존 로컬 promo workflow의 이름이나 일부 노드가 유사하더라도 Cloud의 신규 3단계 worker를 대체하지 못한다. Cloud workflow를 secret 제거 상태로 export해 별도 기준 파일로 관리해야 한다.

## 6. 관리자 LLM 설정의 현재 실효성

관리자 페이지의 Prompt Management는 DB `prompt_templates`에 다음 값을 저장한다.

- prompt body
- provider
- model
- temperature
- max tokens
- response format
- model options

### 6.1 현재 의미가 있는 부분

`api/prompts-render.js`와 Integrated Brief prompt endpoint는 active prompt를 DB에서 읽어 렌더링할 수 있다.

n8n workflow가 이 API를 호출하면 prompt 본문 변경과 prompt version은 반영될 수 있다.

### 6.2 현재 의미가 제한적인 부분

LO-FI 및 Final worker payload에는 관리자 페이지의 provider/model/model options가 포함되지 않는다. Cloud workflow 역시 `/api/prompts-render`가 반환하는 provider/model 값을 실행 설정으로 사용하지 않는다.

기존 promo workflow는 다음 값을 자체적으로 결정한다.

- OpenAI 또는 Gemini endpoint
- 기본 모델
- temperature
- 인증 방식
- 이미지 모델 정규화

따라서 관리자 페이지에서 provider/model을 바꾸더라도 n8n workflow가 해당 설정을 조회하거나 payload로 받지 않으면 실제 실행 모델은 바뀌지 않는다.

Cloud workflow까지 확인한 현재 판단:

- Prompt 본문 변경: 일부 workflow에서 의미 있음
- Provider/model 변경: 세 Cloud worker의 하드코딩 모델 때문에 실제 실행에는 반영되지 않음
- API key 변경: 관리자 페이지의 책임이 아니며 n8n Credentials에서 관리해야 함

## 7. n8n API Key 보안 문제

promo 관련 workflow JSON 일부에 LLM API key가 평문 literal로 포함된 흔적이 확인됐다.

영향:

- 저장소 접근자가 키를 확인할 수 있다.
- Git history에 과거 키가 남을 수 있다.
- workflow export/import 과정에서 키가 재노출될 수 있다.
- 키 유출 시 외부 호출 및 과금 위험이 있다.

필수 조치:

1. 노출된 모든 API key를 폐기하고 재발급한다.
2. OpenAI/Gemini 인증을 n8n Credentials로 이동한다.
3. workflow JSON에서 Authorization 및 API key literal을 제거한다.
4. 테스트/백업 workflow도 동일하게 정리한다.
5. Git history의 secret 노출 범위를 확인한다.
6. 기존 키 사용 기록과 과금 내역을 점검한다.

원칙:

- 관리자 페이지에는 API key를 저장하지 않는다.
- worker payload에도 API key를 포함하지 않는다.
- API key는 n8n Credentials 또는 별도 secret store에서 관리한다.

## 8. 권장 목표 구조

### 8.1 애플리케이션 책임

- active prompt type과 version 관리
- provider/model/model options 관리
- stage 실행 요청 및 상태 저장
- worker 입력용 task/run 데이터 제공
- callback 결과 및 실제 실행 metadata 저장

### 8.2 n8n 책임

- stage payload 수신
- task/run 상세 조회
- 관리자 active prompt와 model settings 조회
- provider별 실행 분기
- n8n Credentials로 인증
- 결과 검증
- stage callback 실행

### 8.3 권장 worker 실행 설정

worker는 관리자 설정을 직접 조회하거나, 서버가 렌더링한 실행 설정을 payload로 전달받아야 한다.

예시:

```json
{
  "promptConfig": {
    "promptId": "...",
    "promptType": "lofi_draft",
    "promptVersion": 3,
    "provider": "google",
    "model": "gemini-3.1-flash-image",
    "temperature": 0.4,
    "maxTokens": null,
    "responseFormat": "image",
    "renderedPrompt": "...",
    "renderedPromptHash": "..."
  }
}
```

주의:

- payload에 API key는 포함하지 않는다.
- provider/model 변경은 n8n의 provider 분기와 지원 목록 검증을 통과해야 한다.
- 실제 사용 설정은 callback `modelMeta`에 기록한다.

## 9. 구현 선택지

### 선택지 A. n8n이 관리자 API를 직접 조회

각 worker가 `runId`를 받은 뒤 prompt render API와 run detail API를 호출한다.

장점:

- trigger payload가 작다.
- worker 실행 시점의 active 설정을 사용할 수 있다.

단점:

- 재시도 시 active prompt가 변경되면 같은 task의 결과가 달라질 수 있다.
- API 호출과 인증 의존성이 늘어난다.

### 선택지 B. 서버가 실행 snapshot을 payload로 전달

queue 시점에 active prompt/model 설정을 확정하고 worker payload에 넣는다.

장점:

- task별 실행 설정이 재현 가능하다.
- n8n workflow가 단순해진다.
- prompt/model version 추적이 쉽다.

단점:

- payload가 커진다.
- 긴 prompt가 trigger log에 남을 수 있다.

### 선택지 C. 실행 snapshot은 DB에 저장하고 worker는 ID로 조회

queue 시점에 prompt/model snapshot을 task row 또는 별도 execution table에 저장하고 worker는 task ID로 조회한다.

장점:

- trigger payload가 작다.
- 실행 재현성과 audit가 좋다.
- 긴 prompt가 webhook payload에 직접 노출되지 않는다.

단점:

- execution snapshot schema와 조회 API가 필요하다.

권장:

선택지 C를 기본으로 하고, 초기 구현에서는 선택지 A 또는 B로 계약을 먼저 검증한다.

## 10. 제안 구현 순서

### Phase 0. 운영 상태 확인 — 완료

확인 완료:

1. Cloud n8n에 세 stage workflow가 모두 존재하고 active 상태임을 확인했다.
2. 각 workflow의 이름, ID, 상태와 마지막 수정일을 확인했다.
3. provider/model 미연동, LO-FI reference 미사용, 평문 API key 문제를 확인했다.

남은 운영 정리:

1. 관리자 DB의 각 webhook URL과 확인된 workflow ID의 정확한 매핑을 기록한다.
2. 세 Cloud workflow를 secret 제거 상태로 export해 저장소와 동기화한다.

### Phase 1. 보안 조치

1. 평문 API key를 모두 회전한다.
2. n8n Credentials로 인증을 통일한다.
3. 저장소 workflow에서 secret literal을 제거한다.
4. secret scanning을 CI 또는 commit 전 검사에 추가한다.

### Phase 2. Integrated Brief worker

1. run/task 조회 API를 확정한다.
2. active `integrated_brief` prompt와 model 설정을 사용한다.
3. provider별 LLM 분기를 구현한다.
4. 결과와 prompt/model metadata를 callback으로 저장한다.

### Phase 3. LO-FI worker

1. 완료된 Integrated Brief를 조회한다.
2. active `lofi_draft` prompt와 model 설정을 사용한다.
3. LO-FI 이미지를 생성하고 `draftId`로 callback한다.
4. 여러 attempt와 재시도 동작을 검증한다.

### Phase 4. Final Design worker

1. `final_design` prompt type을 추가한다.
2. Confirmed LO-FI 상세와 image input을 전달한다.
3. reference image를 지원하는 모델 호출을 구현한다.
4. layout-preserving polish 정책을 적용한다.
5. `finalDesignId`로 결과를 callback한다.

### Phase 5. 통합 검증

1. 관리자에서 prompt/model을 변경한다.
2. 실제 n8n 실행 기록에서 변경 반영 여부를 확인한다.
3. callback `promptMeta`, `modelMeta`를 확인한다.
4. 동일 task 재시도 시 설정 재현성을 확인한다.
5. LO-FI와 최종 디자인 레이아웃 일관성을 검증한다.

## 11. 완료 기준

- 세 Cloud stage workflow의 secret 제거 JSON export가 저장소에 존재한다.
- 각 workflow와 Admin webhook URL의 매핑이 문서화되어 있다.
- workflow JSON에 평문 API key가 없다.
- 모든 외부 LLM 인증은 n8n Credentials를 사용한다.
- 관리자에서 변경한 active prompt가 실제 실행에 반영된다.
- 관리자에서 변경한 provider/model이 지원 범위 내에서 실제 실행에 반영된다.
- callback에 실제 사용한 prompt version과 model metadata가 기록된다.
- LO-FI worker는 여러 attempt를 독립적으로 처리한다.
- Final worker는 Confirmed LO-FI를 reference input으로 사용한다.
- LO-FI와 최종 디자인 사이의 합의된 레이아웃 보존 기준을 충족한다.

## 12. 논의 및 결정 필요 사항

1. 관리자 DB의 webhook URL은 확인된 세 Cloud workflow ID와 정확히 매핑되어 있는가?
2. 세 Cloud workflow를 어떤 파일명과 절차로 저장소에 동기화할 것인가?
3. 관리자 설정을 n8n이 직접 조회할 것인가, queue 시 snapshot을 확정할 것인가?
4. 지원할 provider/model 조합을 어디에서 검증할 것인가?
5. `final_design` prompt type을 별도로 추가할 것인가?
6. task 실행 snapshot을 어느 DB 구조에 저장할 것인가?
7. n8n callback 인증을 어떻게 구성할 것인가?
8. 평문 key가 포함된 Git history를 정리할 것인가?
9. LO-FI reference image를 지원하지 않는 모델을 선택했을 때 어떻게 처리할 것인가?

## 13. 제안 결론

Cloud n8n에는 `integrated_brief`, `lofi_draft`, `final_design` 전용 workflow가 모두 존재하고 active 상태다. 다만 해당 workflow JSON이 로컬 저장소에 export되어 있지 않아 코드 리뷰, 버전 관리, 재현이 불가능한 상태다. 기존 로컬 promo image workflow는 전체 payload를 한 번에 처리하는 과거 구조이므로 Cloud의 신규 3단계 worker와 별도로 취급해야 한다.

관리자 페이지의 prompt 본문 관리는 일부 기존 workflow에서 의미가 있지만, provider/model 변경은 실제 n8n 실행 경로와 연결되지 않아 현재 상태에서는 실효성이 제한적이다.

workflow 존재 여부 확인은 완료됐다. 다음 우선순위는 노출된 API key를 즉시 회전하고 n8n Credentials로 이전하는 것이다. 이후 Cloud workflow를 secret 제거 상태로 저장소에 동기화하고, 관리자 webhook URL 매핑을 기록하며, 세 stage worker가 관리자 active prompt와 model 설정을 사용하도록 실행 계약을 통일해야 한다.
