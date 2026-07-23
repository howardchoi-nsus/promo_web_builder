# n8n 3단계 Worker 이슈 해결 계획

Date: 2026-07-11  
Status: Proposed / Reviewed  
Scope: `integrated_brief`, `lofi_draft`, `final_design`, Admin Prompt Management, n8n Credentials

## 구현 현황 — 2026-07-11

저장소 반영 완료:

- 세 stage queue 시 active prompt/model 실행 snapshot 생성
- snapshot을 task `prompt_meta`, `model_meta`에 저장
- worker payload에 provider/model/prompt version/hash와 task detail URL 추가
- `final_design` 전용 prompt type 및 기본 model settings 추가
- DB migration `014_final_design_prompt_settings.sql` 추가
- 관리자 페이지 Final Design prompt 필터 추가
- Final API의 Confirmed LO-FI 상세 조회 확장
- Final worker payload에 LO-FI proxy, draft prompt, layout fidelity policy 추가
- Final prompt/model snapshot과 `image_edit` reference mode metadata 추가
- active prompt 저장·활성화 시 stage별 provider/model 조합 검증
- Confirmed LO-FI 이미지 또는 ready Integrated Brief가 없는 Final 생성 우회 차단
- worker prompt contract 테스트 추가

아직 미반영:

- Cloud n8n 세 workflow가 신규 `execution`, `taskDetailUrl`, `confirmedDraft` 계약을 소비하도록 수정
- Cloud workflow의 평문 API key 회전 및 n8n Credentials 이전
- Final Worker의 `/v1/images/edits` multipart 호출 전환
- Integrated Brief 길이 guard와 worker 공통 1회 retry
- Cloud workflow secret 제거 JSON export
- 운영 DB migration 적용 및 실제 Step 1~4 통합 테스트

주의:

현재 저장소 코드만 배포하고 Cloud workflow를 수정하지 않으면 기존 worker는 추가 payload를 무시할 수 있다. LO-FI reference 기반 Final 생성 효과는 Cloud Final Worker 변경 후에 발생한다.

## 1. 결론

해결 순서는 다음과 같이 확정한다.

```text
P0 보안
→ P1 Cloud workflow 기준선 및 공통 신뢰성
→ P2 Final Design LO-FI 레이아웃 fidelity
→ P3 관리자 provider/model 실제 연동
→ P4 통합 검증 및 점진 배포
```

가장 먼저 세 Cloud workflow의 평문 API key를 폐기하고 n8n Credentials로 이전한다. 이후 workflow를 secret 제거 상태로 저장소에 동기화하고 공통 실패·재시도 정책을 추가한다.

Final Design은 Confirmed LO-FI ID를 prompt 문자열로만 전달하는 현재 방식을 중단하고, LO-FI 이미지를 실제 image input으로 전달하는 Image Edit 방식으로 전환한다.

관리자 provider/model 연동은 중요하지만 현재 생성 장애나 보안 문제보다 우선하지 않는다. P2까지 안정화한 뒤 실행 snapshot 기반으로 연결한다.

## 2. 현재 상태

### Cloud workflow

| Stage | Workflow | ID | 상태 | 마지막 수정일 |
|---|---|---|---|---|
| `integrated_brief` | Promo Integrated Brief Worker | `HrxQC5q3qflZTHLa` | active | 2026-07-08 |
| `lofi_draft` | Promo Lo-Fi Draft Worker | `rjrA0K4QyNsySTkW` | active | 2026-07-11 |
| `final_design` | Promo Final Design Worker | `qGi72lZxFCipYGld` | active | 2026-07-11 |

Cloud에는 세 worker가 존재하지만 최신 JSON export는 저장소에 없다.

### 확인된 이슈

| ID | 이슈 | 영향 | 우선순위 |
|---|---|---|---|
| A | 세 workflow에 API key 평문 저장 | key 유출·무단 과금 | P0 |
| B | 공통 timeout/retry/failed callback 부족 | task 무기한 대기 | P1 |
| C | Cloud workflow JSON 미동기화 | 리뷰·복구·재현 불가 | P1 |
| D | Integrated Brief 길이 초과 및 JSON parse 실패 | 간헐적 생성 실패 | P1 |
| E | Final worker가 LO-FI 이미지를 참조하지 않음 | 최종 레이아웃 불일치 | P2 |
| F | `final_design` 전용 prompt 없음 | polish 책임 불명확 | P2 |
| G | 관리자 provider/model 미연동 | UI 설정과 실제 모델 불일치 | P3 |
| H | LO-FI `Check Image Base64` 빈 assignment | 리뷰 혼선 | P1 |

## 3. 목표 구조

### 3.1 실행 흐름

```text
Queue API
→ active prompt/model 조회
→ task 실행 snapshot 저장
→ n8n에는 task/run ID 전달
→ worker가 snapshot과 task detail 조회
→ provider/model validation 및 분기
→ n8n Credential로 외부 API 호출
→ 결과와 실제 실행 metadata callback
```

### 3.2 실행 snapshot

각 task의 기존 `prompt_meta`, `model_meta` JSONB에 우선 저장한다.

```json
{
  "promptConfig": {
    "promptId": "...",
    "promptType": "final_design",
    "promptVersion": 1,
    "provider": "openai",
    "model": "gpt-image-1",
    "responseFormat": "image",
    "modelOptions": {
      "quality": "high",
      "size": "1024x1536",
      "inputFidelity": "high"
    },
    "renderedPromptHash": "..."
  }
}
```

구조가 안정된 후 별도 execution snapshot table 분리를 검토한다.

### 3.3 Final Design 입력 우선순위

```text
1. Confirmed LO-FI: 레이아웃 구조
2. Integrated Brief: 콘텐츠와 필수 섹션
3. Design MD/tokens: 시각 스타일
4. Final prompt: polish 수준과 허용 변경 범위
```

## 4. P0 — 긴급 보안 조치

### 목적

평문 key의 추가 사용과 재노출을 즉시 차단한다.

### 작업

1. 세 workflow의 현재 상태를 별도 복제 또는 export해 복구 기준을 확보한다.
2. 노출된 OpenAI/Gemini API key를 모두 폐기한다.
3. 새 key를 발급해 n8n Credentials에 등록한다.
4. 다음 노드에서 수동 Authorization/API key header를 제거한다.
   - Integrated Brief: `Call OpenAI LLM`
   - LO-FI: 이미지 생성 HTTP Request
   - Final Design: 이미지 생성 HTTP Request
5. HTTP Request 노드를 Predefined Credential 또는 Header Auth Credential 참조로 변경한다.
6. 복제 workflow에서 인증 테스트 후 운영 workflow에 적용한다.
7. OpenAI/Google 사용량과 과금 기록에서 이상 사용을 확인한다.
8. 저장소 `n8n/*.json`의 secret literal도 제거한다.
9. secret scanning을 commit 전 또는 CI에 추가한다.

### Git history 정리

1. 모든 branch/tag의 노출 범위를 scan한다.
2. key가 폐기됐는지 먼저 확인한다.
3. 정리가 필요하면 `git filter-repo` 또는 BFG Repo-Cleaner를 사용한다.
4. history rewrite 전에 mirror backup과 영향 branch/PR 목록을 만든다.
5. 승인된 유지보수 시간에 force push한다.
6. 협업자는 기존 clone을 폐기하고 다시 clone한다.
7. rewrite 후 모든 branch/tag를 다시 scan한다.

### 완료 기준

- Cloud와 저장소 workflow에 secret literal이 없다.
- 기존 key가 폐기됐다.
- 세 worker의 credential 인증 테스트가 성공한다.
- 로그와 callback metadata에 key가 남지 않는다.

### 롤백

Credential 연결 실패 시 workflow 구조만 백업본으로 복구한다. 폐기된 key는 복원하지 않는다.

## 5. P1 — 기준선 확보 및 Worker 신뢰성

### 5.1 Cloud workflow 저장소 동기화

1. secret 제거 상태로 다음 파일을 export한다.
   - `n8n/promo-integrated-brief-worker.workflow.json`
   - `n8n/promo-lofi-draft-worker.workflow.json`
   - `n8n/promo-final-design-worker.workflow.json`
2. workflow ID, webhook URL, active 상태, credential 이름을 매핑 문서에 기록한다.
3. Cloud 변경과 JSON export PR을 하나의 완료 단위로 운영한다.
4. LO-FI `Check Image Base64` 노드의 이름/값이 빈 assignment를 제거한다.
5. 잔재 제거 전후 동일 입력 결과가 같은지 확인한다.

### 5.2 공통 실패·재시도 정책

모든 worker에 다음 기준을 적용한다.

| 오류 | 재시도 | 처리 |
|---|---:|---|
| timeout/네트워크 | 1회 | 같은 snapshot으로 backoff 후 재시도 |
| HTTP 429 | 1회 | `Retry-After` 우선 적용 |
| 재시도 가능한 5xx | 1회 | backoff 후 재시도 |
| 401/403 | 없음 | credential 오류로 즉시 실패 |
| validation/지원하지 않는 모델 | 없음 | 즉시 실패 |
| callback 실패 | 제한적 재시도 | 운영 경고 기록 |

최종 실패 시 stage별 PATCH callback으로 terminal 상태를 기록한다.

- Integrated Brief: `integrated_brief_failed`
- LO-FI: 해당 `draftId` failed, 이전 성공 draft 유지
- Final Design: 해당 `finalDesignId` failed

오류 metadata:

```text
stage
errorCategory
upstreamStatus
retryCount
provider
model
requestId
```

API key, Authorization header, 전체 prompt 본문은 기록하지 않는다.

### 5.3 Integrated Brief 길이 guard

`docs/handoff-2026-07-02.md`의 기존 장애 기록을 기준으로 적용한다.

```text
contentLength > 15,000: warning과 metadata 기록
contentLength > 20,000: 동일 snapshot으로 최대 1회 retry
contentLength > 30,000: 현재 응답 폐기
retry도 parse 실패 또는 30,000자 초과: failed callback
```

JSON parse 전에 길이를 측정하며 `contentLength`, `retryCount`, `finishReason`을 `modelMeta`에 남긴다. Prompt에는 compact JSON과 반복 금지 규칙을 추가한다.

### 완료 기준

- 강제 timeout/429/5xx 테스트에서 최대 1회만 재시도한다.
- 최종 실패가 queued/running 상태로 남지 않는다.
- Integrated Brief 길이 guard가 warning/retry/fail을 구분한다.
- 세 Cloud workflow의 secret 제거 export가 저장소에 존재한다.
- LO-FI 빈 assignment가 제거되고 동작 회귀가 없다.

## 6. P2 — Final Design 레이아웃 Fidelity

### 6.1 `final_design` prompt type 추가

작업 파일:

- `api/_prompt-template-store.js`
- 신규 `prompts/promo-final-design-generation.md`
- 신규 DB migration
- `prototype/index.html`
- `prototype/app.js`

Prompt 핵심 규칙:

```text
Confirmed LO-FI is the structural source of truth.
Preserve section order, relative placement, CTA position and content grouping.
Apply visual polish without inventing a new layout.
Do not add or omit promotional copy.
```

권장 초기 설정:

```text
provider: openai
model: gpt-image-1
responseFormat: image
inputFidelity: high
quality: high
size: 1024x1536
```

### 6.2 Confirmed LO-FI 상세 계약

`api/promo-generation-final-designs.js`에서 다음 필드를 조회한다.

```text
id
draft_attempt
draft_image_url
draft_prompt
prompt_meta
model_meta
confirmed_at
```

Worker가 사용할 task detail:

```json
{
  "confirmedDraft": {
    "draftId": "...",
    "draftAttempt": 2,
    "draftImageProxyUrl": "https://.../api/promo-generation-lofi-draft-image?draftId=...",
    "draftPrompt": "...",
    "confirmedAt": "..."
  },
  "layoutFidelityPolicy": {
    "sourceOfTruth": "confirmed_lofi_draft",
    "preserveSectionOrder": true,
    "preserveRelativePlacement": true,
    "preserveContentGrouping": true,
    "preserveCtaPosition": true,
    "allowPolishOnly": true
  }
}
```

Private Blob token이나 원본 storage credential은 payload에 넣지 않는다. 다른 run의 draft를 사용할 수 없도록 관계를 검증하고, proxy에는 worker 인증 또는 단기 서명 token을 적용한다.

### 6.3 Final Worker Image Edit 전환

1. Confirmed LO-FI proxy에서 이미지를 binary로 다운로드한다.
2. MIME과 파일 크기를 검증한다.
3. OpenAI `/v1/images/edits`를 multipart/form-data로 호출한다.
4. snapshot의 `model`, `prompt`, `input_fidelity`, `quality`, `size`를 사용한다.
5. 결과 base64를 기존 Final PATCH callback으로 저장한다.
6. `confirmedDraftId`, prompt hash, model, fidelity, usage를 metadata에 기록한다.

실패 시 fallback으로 text-only 이미지를 자동 생성하지 않는다. 명시적으로 실패시키거나 feature flag로 승인된 기존 경로만 사용한다.

### 6.4 비용 기준

`input_fidelity=high`는 `low` 대비 이미지 입력 토큰을 약 10배 사용할 수 있다는 운영 가정으로 예산을 잡는다. 고정 배율은 공개 API 계약이 아니므로 실제 응답의 `usage.input_tokens_details.image_tokens`로 검증한다.

- 동일 LO-FI/size/model에서 low/high 각각 최소 3회 실행
- 중앙값을 비용 기준선으로 사용
- high/low 배율 8배 초과: 경고
- 12배 초과: 기본값 전환 전 재검토
- text input/image input/image output 비용 분리 기록

### 완료 기준

- Final API가 Confirmed LO-FI 상세를 제공한다.
- Final worker가 동일 LO-FI 이미지를 실제 image input으로 사용한다.
- 섹션 순서, CTA 영역, 콘텐츠 그룹이 유지된다.
- final row에 confirmed draft와 실제 model metadata가 남는다.
- 실패 결과가 새 text-only 이미지로 조용히 대체되지 않는다.

### 롤백

`reference_edit`와 기존 `text_generation`을 feature flag로 분리하고 초기에는 내부 테스트 run에만 적용한다.

## 7. P3 — 관리자 Provider/Model 실제 연동

### 작업

1. active prompt 조회·렌더링 helper를 공통화한다.
2. queue 시점에 prompt/model snapshot을 task JSONB에 저장한다.
3. worker용 task detail API를 추가한다.
4. 서버에서 stage별 허용 provider/model/response format을 검증한다.
5. n8n은 hardcoded model 대신 snapshot을 읽는다.
6. provider별 Switch 분기를 추가한다.
7. 실제 사용 설정을 callback `promptMeta`, `modelMeta`에 기록한다.
8. 같은 task 재시도는 최초 snapshot을 재사용한다.

### 초기 허용 범위

| Stage | 초기 provider/model 정책 |
|---|---|
| Integrated Brief | JSON 출력이 가능한 승인된 text 모델 |
| LO-FI | 승인된 image 생성 모델 |
| Final Design | input image/edit를 지원하는 승인 모델만 허용 |

지원하지 않는 조합은 저장 또는 활성화 단계에서 차단한다.

### 완료 기준

- Admin에서 변경한 모델이 다음 신규 task에 실제 반영된다.
- n8n 실행 설정과 callback metadata가 일치한다.
- 재시도는 설정 변경과 관계없이 최초 snapshot을 사용한다.
- 관리자 UI에 “다음 신규 실행부터 적용” 범위를 표시한다.

## 8. P4 — 통합 검증 및 점진 배포

### 테스트 세트

- 섹션 수가 다른 Integrated Brief 3건 이상
- CTA가 상단/중단/하단에 있는 LO-FI
- 긴 legal/footer content
- 이미지 중심 및 텍스트 중심 LO-FI
- Integrated Brief 길이 초과·JSON 잘림 fixture
- timeout/429/401/5xx 강제 오류 fixture

### 레이아웃 합격 기준

- 섹션 순서 100% 유지
- 주요 CTA가 동일한 상/중/하 영역에 위치
- 필수 콘텐츠 그룹 누락 0건
- header/footer 누락 0건
- major layout 재구성 없음

### 보안·운영 검증

- workflow export secret scan
- callback/image proxy 접근 제어
- 로그의 key/token/private Blob URL 노출 확인
- 다른 run draft 접근 차단
- task별 시간, 실패율, 재시도율, 비용 기록

### 배포 순서

1. Cloud workflow 복제본
2. 내부 test run
3. 제한된 운영 run
4. 비용·품질 검토
5. 기본 경로 전환
6. 기존 text-only Final 경로 비활성화
7. 최종 workflow JSON export 및 PR

## 9. 범위 경계

이 계획은 다음을 완료 범위로 한다.

- 3단계 worker 보안
- 공통 실패·재시도 처리
- 관리자 prompt/model 실행 연동
- Confirmed LO-FI → Final Design 레이아웃 fidelity

다음 문제는 별도 트랙이다.

```text
Design MD의 브랜드 스타일 DNA가 Integrated Brief에서 일반화되는 문제
```

Phase P2까지 끝나도 LO-FI와 Final의 배치는 유사하지만 브랜드 색상·질감·컴포넌트 스타일이 약할 수 있다. 이 문제는 deterministic token carryover와 별도 style fidelity guard로 해결해야 한다.

완료 보고에는 다음을 명시한다.

```text
본 계획은 LO-FI → Final 레이아웃 fidelity를 대상으로 한다.
Design MD → Integrated Brief 브랜드 스타일 fidelity는 별도 트랙이다.
```

## 10. 작업 착수 전 필요한 결정과 권한

### 외부 권한

- Cloud n8n workflow 편집 권한
- API key 폐기·발급 권한
- n8n Credential 생성 권한
- 운영 DB migration 권한

### 결정 사항

1. Final 초기 모델을 `gpt-image-1`로 유지할지
2. `input_fidelity=high`를 기본으로 사용할지
3. LO-FI proxy 인증 방식
4. Admin에서 허용할 provider/model 목록
5. 실행 snapshot을 기존 JSONB에 우선 저장할지
6. Cloud 변경과 repo export PR을 하나의 완료 단위로 강제할지
7. Git history rewrite를 수행할지

## 11. 예상 변경 파일

애플리케이션:

- `api/_prompt-template-store.js`
- `api/prompts-render.js`
- `api/promo-generation-integrated-brief.js`
- `api/promo-generation-lofi-drafts.js`
- `api/promo-generation-final-designs.js`
- `api/promo-generation-lofi-draft-image.js`
- 신규 task detail/snapshot helper 또는 API
- `prototype/index.html`
- `prototype/app.js`

DB:

- `final_design` prompt migration
- 필요 시 execution snapshot migration

n8n:

- `n8n/promo-integrated-brief-worker.workflow.json`
- `n8n/promo-lofi-draft-worker.workflow.json`
- `n8n/promo-final-design-worker.workflow.json`

검증:

- provider/model validation
- worker snapshot contract
- Final reference image contract
- retry/failed callback
- Integrated Brief length guard
- secret literal scan

## 12. 공식 참고 자료

- n8n HTTP Request credential: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- OpenAI Images API: https://platform.openai.com/docs/api-reference/images
- GPT Image 1 모델 및 가격: https://developers.openai.com/api/docs/models/gpt-image-1

## 13. 2026-07-12 구현 및 디버깅 결과

### 완료

- Integrated Brief와 Lo-Fi Draft 백업 워커의 provider/model snapshot 및 일반 실패 처리를 반영했다.
- Final Design 백업 워커를 텍스트 기반 `images/generations`에서 LO-FI binary 입력 기반 `images/edits` multipart 호출로 전환했다.
- Confirmed LO-FI proxy 다운로드, 다운로드/편집 각 1회 재시도, `input_fidelity=high`, 실패 callback과 오류 메시지 저장을 반영했다.
- Final 백업 워크플로를 별도 Webhook 경로로 게시하고 실제 호출했다.
- n8n 실행 `1179`는 9개 노드를 약 18초에 모두 통과했으며, OpenAI 오류도 후속 callback까지 전달됐다.
- DB에서 `provider=openai`, `model=gpt-image-1`, `inputFidelity=high`, `referenceMode=image_edit`와 `final_design_failed` 상태를 확인했다.

### 외부 차단 사항 해소

최초 검증에서는 OpenAI가 `billing_hard_limit_reached`를 반환했으나, 2026-07-12 크레딧 충전 후 재실행하여 해소를 확인했다. 백업 실행 `1180`은 약 65초에 성공했고, 운영 실행 `1181`은 약 56초에 성공했다.

DB에서 `ready`, 비어 있지 않은 `final_image_url`, `inputFidelity=high`, `referenceMode=image_edit`, `final_design_ready`, 빈 오류 메시지를 확인했다. 생성 결과를 Confirmed LO-FI와 직접 비교한 결과 헤더, 제목, 히어로, 3개 카드, CTA, 하단 문구, 푸터의 순서와 상대 위치가 유지되고 색상·이미지·버튼 스타일만 고도화됐다.

### 배포 판단

실패 경로와 성공 이미지 경로를 모두 검증한 뒤 운영 `Promo Final Design Worker`에 이미지 편집 구조를 게시했다. 기존 운영 Webhook 경로는 유지했으며 운영 실행 `1181`로 최종 검증했다. 별도 백업 Webhook도 회귀 검증용으로 유지한다. 이 계획의 완료 범위는 레이아웃 fidelity이며 브랜드 스타일 fidelity는 별도 트랙이다.
