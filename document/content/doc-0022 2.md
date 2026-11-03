# AI Builder 자동 구성·자산 완료 후 Live Preview 전환 개발 계획서

## 0. 문서 정보

- 작성일: 2026-08-17
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: 프로모션 빌더 AI 모드, AI 프로모션 Live Preview
- 문서 상태: 핵심 구현 완료 / 2026-08-23 정책·서버 게이트 정합화 완료
- 우선순위: P0
- 관련 요구사항:
  - 비전문 사용자를 위한 `AI 섹션 구성 확인(Composition Review)` 단계 제거
  - 제거된 단계의 작업 상태는 전체 화면 프로그레스에서 안내
  - Live Preview 전환 직전 보이는 Web Output 화면 플래시 제거
  - 키비주얼과 컴포넌트 이미지 등 모든 AI 자산 생성 완료 후 Live Preview 활성화

---

## 1. 목적

AI 모드의 사용자 흐름을 다음과 같이 단순화한다.

```text
요청 입력
→ 프로모션 개요 분석
→ AI 분석 결과 확인
→ 프로모션 구조 자동 구성
→ 프로모션 구조 적용 및 AI 자산 생성
→ 모든 자산 준비 완료
→ Live Preview
```

사용자가 전문적인 Section, Layout, Component 계약을 직접 검토하지 않아도 서버 검증을 통과한 구성이 자동 적용되어야 한다. 동시에 실제 작업이 계속되고 있다는 사실은 전체 화면 상태 문구와 현재 사용 중인 LLM 정보로 명확하게 전달한다.

Live Preview는 편집 가능한 완성 결과를 보여주는 화면으로 정의한다. 초기 키비주얼이나 컴포넌트 이미지가 아직 생성 중인 불완전한 상태에서는 활성화하지 않는다.

---

## 2. 현재 구현 분석

### 2.1 Composition Review가 AI 흐름을 중단함

`visual-editor/src/builder/AiBuilderApp.vue`의 `compose()`는 Contract v3 Proposal이 `ready`가 되면 `review_required`로 전환하고 `RegistryProposalReview`를 표시한다.

```text
Proposal ready
→ review_required
→ 사용자가 구성 적용 버튼 클릭
→ applyCompositionProposal
```

이 화면은 Section Role, Layout, Component, Resource 같은 전문 정보를 포함하므로 일반 AI 모드 사용자가 실질적으로 판단하기 어렵다.

### 2.2 구조 적용 완료와 AI 자산 생성 완료가 동일하게 취급됨

`applyCompositionProposal()` 응답은 문서 Revision과 Snapshot을 생성한 다음 이미지 작업을 Queue에 등록한다. 응답 시점의 Asset Job은 대부분 `pending`, `queued`, `processing` 상태이며 이미지 생성 완료 상태가 아니다.

현재 클라이언트는 응답 직후 다음 작업을 수행한다.

```text
store.stage = render_ready
→ openVisualEditor()
```

따라서 Live Preview가 먼저 열리고 키비주얼과 컴포넌트 이미지는 Visual Editor 내부 Polling으로 나중에 채워진다.

### 2.3 Web Output 플래시 발생 원인

`render_ready`가 설정되면 Vue Template의 마지막 분기인 `CompositionReview`가 잠시 렌더링된다. 이 화면의 Toolbar에는 `Web Output` 버튼이 있다. 이후 `window.location.assign()`이 실행되어 Visual Editor로 이동하기 때문에 사용자는 전환 직전에 Web Output 화면이 살짝 노출되는 것으로 인식한다.

즉, Output Route가 잘못 열린 문제가 아니라 **화면 이동 전에 불필요한 결과 Review DOM이 한 Frame 이상 노출되는 상태 전환 문제**다.

### 2.4 Live Preview 내부 생성 상태가 보이지 않음

Visual Editor의 `refreshAiDocumentAssetsUntilSettled()`는 2초 간격으로 Builder Document를 조회하고 준비된 이미지를 적용한다. 하지만 이 Polling 상태를 사용자에게 표시하는 전용 UI가 없다. Hero 배경이 비어 있거나 이전 이미지인 상태에서도 편집 화면이 활성화되므로 사용자는 AI가 중단됐다고 오해할 수 있다.

---

## 3. 목표 사용자 흐름

| 순서 | 사용자 화면 | 내부 상태 | 중앙 안내 문구 |
|---|---|---|---|
| 1 | AI 요청 입력 | `idle` | 없음 |
| 2 | 전체 화면 프로그레스 | `analyzing_overview` | `프로모션 개요를 분석하고 있습니다.` |
| 3 | AI 분석 결과 확인 | `reviewing_overview` | 없음 |
| 4 | 전체 화면 프로그레스 | `resolving_policy`, `queued`, `processing` | `프로모션 구조를 구성하고 있습니다.` |
| 5 | 전체 화면 프로그레스 | `applying`, `generating_assets` | `프로모션 구조를 생성하고 있습니다.` |
| 6 | 전체 화면 프로그레스 | `navigating_preview` | `Live Preview를 준비하고 있습니다.` |
| 7 | Live Preview | `preview_ready` | 없음 |

### UX 원칙

- 실제 백엔드 진행률을 알 수 없으므로 백분율 Progress Bar는 사용하지 않는다.
- 중앙 상태 문구는 기존 Pulse 효과를 유지한다.
- 현재 실행 중인 Provider Icon, Provider 이름, Model 정보는 계속 표시한다.
- `aria-live="polite"`, `aria-busy="true"`를 유지해 보조기기에도 단계 변경을 전달한다.
- `prefers-reduced-motion: reduce`에서는 깜빡임을 제거하고 고정 문구로 표시한다.
- Composition Review를 제거해도 Contract 검증, Required Section 검증, Content Binding 검증은 서버에서 그대로 수행한다.

---

## 4. 상태 모델 변경

### 4.1 신규·정리 상태

`visual-editor/src/shared/composition/composition-state.mjs`의 상태 계약을 다음과 같이 정리한다.

```text
idle
analyzing_overview
reviewing_overview
resolving_policy
queued
processing
applying
generating_assets
preview_ready
navigating_preview
failed
```

- 초기 AI 생성 흐름에서는 `review_required`, `render_ready`를 사용하지 않는다.
- `review_required`가 후속 자연어 편집이나 관리자 도구에 필요하면 별도 문맥으로 유지하되 초기 AI 생성 화면에서는 도달하지 않도록 한다.
- `busy`와 `fullScreenProgress`에 `generating_assets`, `navigating_preview`를 포함한다.
- Error 발생 시 이전 단계가 아니라 `failed`로 전환하고 재시도 가능한 작업을 명시한다.

### 4.2 단계별 메시지 결정

`CompositionProgress`에 한 문구를 직접 전달하는 방식 대신 상태별 UI 메시지를 결정하는 Computed Mapping을 추가한다.

```text
analyzing_overview              → 프로모션 개요를 분석하고 있습니다.
resolving_policy/queued/processing → 프로모션 구조를 구성하고 있습니다.
applying/generating_assets      → 프로모션 구조를 생성하고 있습니다.
navigating_preview              → Live Preview를 준비하고 있습니다.
```

이 문구는 LLM 실행 Prompt가 아니라 사용자 Interface Copy이므로 `설정 > LLM 및 프롬프트 관리` 대상이 아니다. 다국어 메시지는 `locales/ko.json`, `locales/en.json`과 Locale Seed에서 관리한다.

---

## 5. 상세 개발 범위

### 5.1 AI 섹션 구성 확인 단계 제거

대상:

- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/builder/RegistryProposalReview.vue`
- 관련 Browser·Contract Test

작업:

1. `pollProposal()`이 검증 완료된 Proposal을 반환하면 Contract v3도 `applyReadyProposal(proposal)`로 바로 연결한다.
2. 초기 AI 생성 흐름에서 `store.stage = "review_required"` 전환을 제거한다.
3. `RegistryProposalReview` 렌더 분기를 제거하거나 관리자·진단 전용 기능으로 격리한다.
4. 자동 적용 전 서버 Validation 결과를 다시 확인한다.
5. `autoApplicable` 또는 필수 Validation 조건을 만족하지 않는 Proposal은 사용자 확인 화면으로 보내지 않고 명확한 오류로 중단한다.
6. Required Section, Section Role, Content Binding, Layout Contract 검증을 우회하지 않는다.

완료 조건:

- AI 분석 결과 확인에서 `생성`을 누른 후 Composition Review가 나타나지 않는다.
- 유효한 Proposal은 자동으로 적용된다.
- 유효하지 않은 Proposal은 자동 적용되지 않고 오류 Code와 이해 가능한 안내가 표시된다.

### 5.2 Builder 단계별 전체 화면 프로그레스 적용

대상:

- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/builder/CompositionProgress.vue`
- `visual-editor/src/builder/AiExecutionIndicator.vue`
- `visual-editor/src/builder/ai-builder.css`
- `locales/ko.json`
- `locales/en.json`
- `db/seeds/002_seed_locale_messages.sql`

작업:

1. 상태별 메시지 Mapping을 추가한다.
2. `resolving_policy`, `queued`, `processing`, `applying`, `generating_assets`, `navigating_preview`에서 동일한 Full Screen Progress Surface를 유지한다.
3. 상태가 바뀌어도 Lottie Component가 불필요하게 Unmount·Mount되지 않도록 하나의 `CompositionProgress` Instance를 유지한다.
4. 실행 유형에 따라 `promo_overview_parser`, `promo_page_composer`, 이미지 생성 Prompt의 Execution Display를 연결한다.
5. 이미지 단계의 실제 Provider·Model을 확인할 수 있으면 해당 Execution Display로 교체하고, 여러 Provider가 동시에 실행되면 현재 단계의 대표 실행 정보 또는 `AI 이미지 생성` 상태를 표시한다.
6. 상태 문구와 Model 정보는 화면 중앙 정렬과 기존 Pulse 효과를 유지한다.

완료 조건:

- 화면이 카드·Review·빈 화면으로 튀지 않고 하나의 Progress Surface 안에서 문구만 자연스럽게 바뀐다.
- 사용자는 구조 구성과 구조 생성이 서로 다른 작업 단계임을 알 수 있다.
- LLM Provider와 Model 정보가 각 LLM 실행 단계에서 표시된다.

### 5.3 AI 자산 완료 Readiness Gate 추가

대상:

- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/builder/services/composition-client.mjs`
- `api/promo-builder-documents.js`
- `api/_promo-builder-document-store.js`
- `api/_promo-builder-assets.js`

작업:

1. Composition 적용 후 `applied.assetJobs` 또는 `snapshot.assets.requests`를 기준으로 자산 생성 필요 여부를 판단한다.
2. 자산 요청이 없으면 바로 `preview_ready`로 전환한다.
3. 자산 요청이 있으면 `generating_assets`로 전환하고 Builder Document GET API를 일정 간격으로 Polling한다.
4. GET API가 Hydrate한 `snapshot.assets.requests[].status`를 단일 Source of Truth로 사용한다.
5. 모든 요청이 `ready`가 된 경우에만 `preview_ready`로 전환한다.
6. `failed` 요청이 하나라도 있으면 자동 전환하지 않고 실패한 자산을 식별해 재시도 UI를 표시한다.
7. 무한 대기를 방지하기 위해 최대 대기 시간과 Polling 취소 처리를 추가한다.
8. Revision이 변경됐거나 문서가 없는 경우 일반 실패와 구분해 처리한다.
9. Component Unmount 또는 페이지 이동 시 Polling을 중단한다.

Readiness 판정:

```text
requests.length === 0
→ Ready

requests.length > 0 AND every(status === ready)
→ Ready

some(status === failed)
→ Failed / Retry Required

some(status IN pending, queued, processing)
→ Keep Waiting
```

완료 조건:

- Hero Key Visual, Section Background, Component Image가 모두 준비되기 전에는 Live Preview가 열리지 않는다.
- 실패한 이미지가 있을 때 영구 Loading에 빠지지 않는다.
- 재시도 성공 후 모든 자산이 `ready`가 되면 Live Preview가 자동으로 열린다.

### 5.4 Live Preview 전환과 Web Output 플래시 제거

대상:

- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/builder/CompositionReview.vue`
- `visual-editor/src/platform/visual-editor-entry.mjs`

작업:

1. 초기 AI 생성 성공 시 `render_ready`를 설정하지 않는다.
2. 자산 준비 완료 후 `navigating_preview` 상태를 유지한 채 `openVisualEditor()`를 호출한다.
3. 화면 이동 전 `CompositionReview`가 렌더되는 `v-else` 구조를 명시적인 상태 분기로 변경한다.
4. 알 수 없는 상태에서 결과 화면이 노출되지 않도록 안전한 Fallback Progress 또는 오류 화면을 둔다.
5. Live Preview URL은 계속 `mode=ai-document`를 사용하고 `mode=output`으로 전환되지 않는지 Browser Test로 검증한다.

완료 조건:

- Live Preview 이동 직전에 Composition Review와 Web Output Toolbar가 한 Frame도 노출되지 않는다.
- 최종 URL의 Mode가 항상 `ai-document`다.
- 브라우저 뒤로가기를 사용해도 불완전한 결과 Review 화면이 나타나지 않는다.

### 5.5 Live Preview의 방어적 자산 상태 처리

대상:

- `visual-editor/src/App.vue`
- `visual-editor/src/platform/adapters/ai-document-adapter.mjs`
- `visual-editor/src/platform/editor-ui/PreviewPanel.vue`

작업:

1. 초기 AI 생성은 Builder Readiness Gate에서 완료시키되 Live Preview 진입 시 Snapshot을 다시 조회해 최종 상태를 검증한다.
2. 초기 진입 Snapshot에 `pending`, `queued`, `processing` 자산이 남아 있으면 편집 Workspace를 바로 활성화하지 않고 `AI 자산을 확인하고 있습니다.` 상태를 표시한다.
3. 이 방어 로직은 직접 URL 접근, 새로고침, 오래된 탭 복원 상황을 처리한다.
4. Live Preview에서 사용자가 개별 이미지를 다시 생성하는 기존 Polling은 유지한다.
5. 초기 Readiness Gate와 편집 중 재생성 상태를 구분해 전체 화면 Loading이 편집 작업을 불필요하게 막지 않도록 한다.

완료 조건:

- 정상 AI 생성 진입에서는 완성된 Hero가 처음부터 표시된다.
- 직접 URL 접근에서도 불완전한 Snapshot이 편집 가능한 상태로 노출되지 않는다.
- 편집 중 개별 AI 이미지 재생성 기능은 기존처럼 동작한다.

---

## 6. 오류·재시도 정책

| 상황 | 처리 |
|---|---|
| Overview 분석 실패 | 입력 화면으로 돌아갈 수 있는 오류 표시 |
| Composition Proposal 실패 | 구조 구성 단계에서 오류 Code 표시 및 다시 시도 |
| Proposal 검증 실패 | 자동 적용 금지, 검증 Detail 표시 |
| Composition Apply 실패 | 적용 단계에서 오류 표시 및 중복 적용 방지 |
| Asset Queue 등록 실패 | 재시도 버튼 표시, Live Preview 진입 금지 |
| 일부 Asset 생성 실패 | 실패 자산 재시도, 모든 자산 `ready` 후 자동 진입 |
| Asset Polling 시간 초과 | `ASSET_GENERATION_TIMEOUT`과 다시 확인·재시도 제공 |
| Document Revision 변경 | 최신 Revision 재조회 후 Readiness 재판정 |
| 페이지 이탈 | Polling 취소 및 후속 상태 업데이트 방지 |

재시도는 기존 Document와 Asset Request Identity를 사용해 멱등적으로 처리하며 중복 이미지 작업이 생성되지 않도록 한다.

---

## 7. LLM Prompt 관리 원칙

이번 변경의 기본 범위에서는 LLM Prompt Body를 추가하거나 수정할 필요가 없다. 변경되는 문구는 사용자 진행 상태를 설명하는 UI Copy다.

개발 중 다음 항목의 Prompt 변경이 필요해질 경우 소스코드에 하드코딩하지 않는다.

- Composition 자동 적용을 위한 Planner 지시문
- 필수 Section 또는 Layout 선택 보정 지시문
- 실패 Proposal Repair Prompt
- 이미지 생성 Prompt 또는 Negative Prompt

위 항목은 반드시 `설정 > LLM 및 프롬프트 관리`의 Versioned Prompt로 관리하고 Draft → Validate → Activate 절차를 따른다. Runtime은 활성 Version의 Snapshot과 Hash를 저장한다.

---

## 8. 테스트 계획

### 8.1 Unit·Contract Test

1. 상태별 Progress Message Mapping 검증
2. Contract v3 Proposal의 자동 적용 경로 검증
3. 초기 AI 흐름에서 `review_required`가 사용되지 않는지 검증
4. Asset Readiness 판정 함수 검증
5. 빈 Asset Request 즉시 Ready 처리 검증
6. `pending`, `queued`, `processing` 상태 대기 검증
7. 전체 `ready` 상태 전환 검증
8. 일부 `failed` 상태에서 전환 차단 검증
9. Timeout과 Polling 취소 검증
10. 기존 관리자 Prompt와 Runtime Prompt 하드코딩 방지 Test 유지

### 8.2 API Test

1. Builder Document GET이 최신 Asset Job 상태를 Snapshot에 Hydrate하는지 검증
2. Key Visual 결과가 `sectionStyles.backgroundImage`에 적용되는지 검증
3. Component Image 결과가 올바른 Field에 적용되는지 검증
4. 실패 Code와 Message가 Asset Request에 전달되는지 검증
5. Retry가 기존 Request Identity를 유지하는지 검증

### 8.3 Browser Test

Mock API의 Asset 상태를 시간순으로 변경해 다음 전체 흐름을 자동 검증한다.

```text
AI 요청 입력
→ 개요 분석 Progress
→ 분석 결과 확인
→ 구조 구성 Progress
→ 구조 생성 Progress
→ Asset pending 상태에서 URL 이동 없음
→ Asset ready 상태
→ ai-document Live Preview로 이동
```

추가 검증:

- `RegistryProposalReview`가 한 번도 표시되지 않는다.
- `CompositionReview`와 `Web Output` Toolbar가 전환 전에 표시되지 않는다.
- Pending 상태에서는 Live Preview URL로 이동하지 않는다.
- 모든 Asset이 `ready`가 된 뒤에만 한 번 이동한다.
- Asset 실패 시 오류와 재시도 버튼이 표시된다.
- 재시도 성공 후 자동 이동한다.
- `aria-live`, `aria-busy`, Reduced Motion 동작을 확인한다.

### 8.4 Regression Test

- 전체 `scripts/run-tests.js`
- Visual Editor Production Build
- AI Builder Browser Test
- Promo Builder Asset Retry Contract Test
- AI Document Visual Editor Contract Test
- Contract v3 Composition·Compiler Test
- Header, Required Shared Section, Content Binding 관련 기존 Test

---

## 9. 개발 단계

### Phase 1. 상태 계약 및 Composition 자동 적용

- 상태 Enum과 Message Mapping 정리
- Contract v3 Review 단계 제거
- 검증 완료 Proposal 자동 Apply
- 예상 소요: 0.5~1일

### Phase 2. Asset Readiness Gate

- Builder Document Polling 추가
- Ready·Failed·Timeout 판정
- Retry와 Polling 취소 처리
- 예상 소요: 1~1.5일

### Phase 3. 화면 전환 및 Live Preview 방어 처리

- `render_ready` Flash 제거
- `navigating_preview` 상태 도입
- Direct URL·새로고침 시 Pending Asset 방어
- 예상 소요: 0.5~1일

### Phase 4. UI·다국어·접근성 보완

- 단계별 중앙 문구
- LLM 실행 정보 연결
- Locale 메시지 등록
- Reduced Motion·Screen Reader 확인
- 예상 소요: 0.5일

### Phase 5. 자동화 테스트 및 회귀 검증

- Unit·Contract·API·Browser Test 추가
- Build와 전체 Test 수행
- 예상 소요: 0.5~1일

총 예상 소요: 3~5 개발일

---

## 10. 예상 변경 파일

### Frontend

- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/builder/CompositionProgress.vue`
- `visual-editor/src/builder/AiExecutionIndicator.vue`
- `visual-editor/src/builder/RegistryProposalReview.vue`
- `visual-editor/src/builder/CompositionReview.vue`
- `visual-editor/src/builder/ai-builder.css`
- `visual-editor/src/builder/state/ai-builder-store.mjs`
- `visual-editor/src/builder/services/composition-client.mjs`
- `visual-editor/src/shared/composition/composition-state.mjs`
- `visual-editor/src/App.vue`
- `visual-editor/src/platform/adapters/ai-document-adapter.mjs`
- `visual-editor/src/platform/editor-ui/PreviewPanel.vue`

### API

- `api/promo-builder-documents.js`
- `api/_promo-builder-document-store.js`
- `api/_promo-builder-assets.js`
- `api/promo-builder-assets-retry.js`

### Locale·Test

- `locales/ko.json`
- `locales/en.json`
- `db/seeds/002_seed_locale_messages.sql`
- `scripts/test-ai-builder-browser.mjs`
- `scripts/test-ai-builder-entry-contract.js`
- `scripts/test-ai-execution-indicator-contract.js`
- `scripts/test-promo-builder-assets-retry-contract.js`
- 신규 Asset Readiness Contract Test

---

## 11. 제외 범위

- 템플릿 모드의 Step 구성 변경
- Visual Editor에서 사용자가 요청하는 개별 Section AI 생성 흐름 제거
- 이미지 Provider 자체의 생성 속도 개선
- 실제 완료율을 추정하는 Percentage Progress Bar
- Web Output 생성·다운로드 기능 제거
- 서버 Contract Validation 완화

---

## 12. 완료 기준

다음 조건을 모두 만족하면 개발 완료로 판단한다.

1. AI 모드 초기 생성 과정에서 Composition Review가 표시되지 않는다.
2. 개요 분석, 구조 구성, 구조 생성 단계가 전체 화면 중앙 문구로 구분된다.
3. 각 LLM 단계에서 Provider Icon과 Model 정보가 표시된다.
4. Hero Key Visual과 모든 요청 이미지가 준비되기 전에는 Live Preview가 활성화되지 않는다.
5. 모든 Asset이 `ready`가 되면 Live Preview가 자동으로 한 번만 열린다.
6. Asset 실패·Timeout 시 영구 Loading 없이 재시도할 수 있다.
7. Live Preview 전환 직전 Composition Review 또는 Web Output 화면이 노출되지 않는다.
8. Live Preview 첫 렌더에 완성된 Hero와 AI 이미지가 표시된다.
9. 직접 URL 접근과 새로고침에서도 Pending Asset 상태가 안전하게 처리된다.
10. LLM Prompt 변경이 발생할 경우 관리자 Prompt Version으로 관리되며 소스코드에 자연어 Prompt가 추가되지 않는다.
11. Production Build와 전체 자동화 Test가 통과한다.

---

## 13. 2026-08-23 현행 구현 결과

- 초기 Contract v3 생성은 서버가 `validation.ok=true`, `autoApplicable=true`로 판정한 Proposal만 자동 적용한다.
- Apply 직전 candidate·policy·resource fingerprint 재검증과 Required Section·Content Binding·Layout 검증은 유지한다.
- `assets.expected`와 `assets.requests` Coverage 및 모든 필수 Asset의 `ready` 상태를 확인한 뒤 Live Preview로 이동한다.
- Asset 실패·Billing 필요 상태에서 `이미지 없이 편집 계속` 우회 버튼을 제거하고 재시도 기반 Fail-closed 흐름으로 통일했다.
- Live Preview의 Desktop·Mobile 품질 통과 결과는 저장 시 Builder Document의 다음 Revision에 결합된다.
- Composition Apply·Operation·Rollback은 기존 품질 보고서를 `pending`으로 무효화한다.
- 현재 Revision의 품질 보고서가 `passed`가 아니면 Web Output과 Export를 서버에서 거부한다.
- Visual Editor Production Build를 최신 소스로 재생성했다.
- Node 24.19.0 기준 전체 자동 테스트를 실행하며, 최종 Release evidence는 정책에 따라 Node 22.x에서 재확인한다.
