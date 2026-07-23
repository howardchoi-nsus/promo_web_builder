# Create Promo Step 3 세부 단계 분리 및 Web Output 개발계획

- 작성일: 2026-07-20
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: `/prototype/create-promo.html`
- 문서 상태: 재검토 완료 · 구현 전
- 우선순위: P0 UX 구조 개선, P1 Web Output 실화면
- 관련 문서:
  - `docs/create-promo-step3-ai-content-and-layout-generation-development-plan-2026-07-19.md`
  - `docs/create-promo-admin-layout-reflection-fix-development-plan-2026-07-20.md`

## 1. 요청 사항

현재 하나의 긴 화면으로 구성된 Create Promo Step 3을 다음 세 영역으로 분리한다.

```text
1. 프로모션 개요 등록
2. 프로모션 템플릿 선택
3. 템플릿 레이아웃
```

세 번째 `템플릿 레이아웃` 영역에는 `Web Output` 버튼을 추가한다.

## 2. 재검토 결과

### 2.1 현재 Step 3이 담당하는 기능

현재 `renderContentStep()`은 한 화면에서 다음 기능을 모두 처리한다.

1. 프로모션 제목, 목적, 시장, 고객 및 캠페인 톤 입력
2. Active Form Template 선택
3. Template Section/Item별 콘텐츠 입력
4. 필수 콘텐츠 Coverage 확인
5. Admin 기본 Layout 로드 및 변경 감지
6. Visual Editor iframe 기반 Layout 미리보기·수정
7. 사용자별 콘텐츠, Section 순서 및 Layout Snapshot 저장

따라서 단순히 DOM을 세 블록으로만 나누면 기능의 소유 영역이 불분명해진다. 특히 Template Section/Item 콘텐츠 입력은 요청된 세 제목에 별도로 나타나지 않는다.

### 2.2 권장 사용자 구조

사용자가 요청한 세 제목은 유지하되, Template별 콘텐츠 입력을 세 번째 영역에 포함한다.

```text
Step 3. Template & Content

  1. 프로모션 개요 등록
     - 제목
     - 목적
     - 시장/지역
     - 대상 고객
     - 캠페인 톤

  2. 프로모션 템플릿 선택
     - Active Template 목록
     - Default 표시
     - Template Version 및 설명

  3. 템플릿 레이아웃
     - 선택 Template의 Section/Item 콘텐츠 등록
     - Coverage Checklist
     - Admin Layout 변경 감지
     - Layout Preview 및 수동 편집
     - 관리자 기본 Layout 초기화
     - Web Output
```

세 번째 영역의 화면 제목은 `템플릿 레이아웃`으로 유지하지만 내부에는 `콘텐츠 등록`과 `레이아웃 미리보기`를 명확히 구분한 두 패널을 둔다.

### 2.3 Web Output의 의미

`Web Output` 버튼은 AI 생성이나 LO-FI 작업을 즉시 시작하는 버튼으로 사용하지 않는다.

MVP 정의:

> 현재 프로모션 개요, 선택 Template, Section 콘텐츠, Section 순서, Layout 및 Step 1·2 Appearance를 하나의 검증된 Snapshot으로 확정하고 Step 4의 읽기 전용 웹 미리보기로 이동한다.

AI Integrated Brief, LO-FI Draft 및 Final Design 생성은 별도 실행 버튼을 통해 시작한다. `Web Output` 이동과 Worker 실행을 하나의 버튼에 결합하면 네트워크 실패 시 사용자가 Step 3 입력까지 실패한 것으로 오해할 수 있다.

## 3. 현재 소스에서 확인된 이슈

### 3.1 Step 4가 실제 Web Output을 렌더링하지 않음

현재 `renderStep()`은 Step 1, Step 2, Step 3만 전용 함수로 분기한다. Step 4는 `steps` 배열에 정의된 Placeholder Card만 출력한다.

소스에는 `renderLofiStep()`과 `renderFinalStep()`이 존재하지만 `renderStep()`에서 호출되지 않는다.

따라서 Step 3에 버튼만 추가하면 내용이 없는 Placeholder형 Step 4로 이동하게 된다.

### 3.2 하단 Next와 Web Output의 기능 중복

현재 전역 Footer의 `Next` 버튼은 Step 3에서 `validateContentStep()`을 실행한 뒤 Step 4로 이동한다.

템플릿 레이아웃 영역에 별도 `Web Output` 버튼을 추가하면 이동 경로가 두 개가 된다.

위험:

- 두 버튼의 Validation 조건 불일치
- 한 경로에서 Snapshot 저장 누락
- 한 경로에서 Admin 변경 확인 누락
- 중복 클릭으로 Render 또는 Run 생성이 두 번 실행됨

두 버튼은 반드시 하나의 `goToWebOutput()` 함수를 공유해야 한다.

### 3.3 검증 범위가 전체 Step 3 단위로만 구성됨

현재 `contentErrors()`는 프로모션 개요와 Template Section의 필수 Item을 한 번에 검사한다.

세부 단계로 분리하려면 검증도 다음과 같이 분리해야 한다.

- `promotionOverviewErrors()`
- `templateSelectionErrors()`
- `templateContentErrors()`
- `webOutputReadinessErrors()`

최종 `validateContentStep()`은 위 결과를 통합하여 기존 API 계약을 유지한다.

### 3.4 Template 변경 시 사용자 입력 보호 필요

두 번째 영역에서 Template을 변경하면 현재 코드가 기존 Template의 입력을 `templateInputs[templateKey]`에 저장하고 새 Template 입력을 복원한다.

세부 단계 전환 중 다음 조건을 유지해야 한다.

- 입력이 존재하면 Template 변경 확인
- Template별 콘텐츠 독립 저장
- Template별 Layout/Section 순서 독립 저장
- 로딩 중 중복 선택 방지
- 선택 성공 후에만 세 번째 영역 진입

### 3.5 Admin Layout 변경 알림 노출 범위

Admin Layout 변경 감지는 현재 Layout 영역에 Banner로 표시된다. 사용자가 첫 번째 또는 두 번째 세부 단계에 머무르면 변경 사실을 알 수 없다.

Step 3 상단 세부 단계 Navigation에 `변경 있음` 상태를 표시하거나 세 번째 단계 진입 시 강제로 재검증해야 한다.

### 3.6 Web Output Snapshot 확정 시점

현재 `buildWizardPayload()`은 API Run을 생성할 때 Snapshot을 구성한다. Web Output 이동 시점에는 별도의 확정 Snapshot이 없다.

따라서 Step 4 진입 후 Step 3의 Local Storage 상태가 변경되면 Web Output 결과와 Worker 입력이 달라질 수 있다.

Web Output 클릭 시 별도 Snapshot을 생성하고 Step 4와 이후 Worker가 같은 Snapshot을 사용해야 한다.

### 3.7 Step 3 세부 단계 복원 정책

새로고침 시 어느 세부 단계로 돌아갈지 정의가 필요하다.

권장 정책:

- `sessionStorage`에 현재 Step 3 세부 단계 저장
- 동일 탭 새로고침에서는 현재 위치 복원
- 새 Create Promo Session은 첫 번째 영역에서 시작
- Template이 비활성화되었거나 Identity가 변경되면 두 번째 영역으로 이동

## 4. 목표 UX

### 4.1 세부 단계 Navigation

Step 3 화면 상단에 다음 Navigation을 추가한다.

```text
[1 프로모션 개요] → [2 템플릿 선택] → [3 템플릿 레이아웃]
```

상태:

- `current`: 현재 표시 영역
- `complete`: 필수조건 완료
- `error`: 필수 입력 누락 또는 로딩 실패
- `update`: Admin Template/Layout 변경 감지
- `disabled`: 이전 단계 필수조건 미완료

### 4.2 이동 정책

```text
1 → 2
  프로모션 개요 필수 입력 검증

2 → 3
  Template 선택 여부
  Section 구성 로딩 완료 여부
  Layout Identity 유효성 검증

3 → Web Output
  전체 필수 콘텐츠 검증
  Admin 변경 적용/유지 결정 확인
  Layout Snapshot 준비 확인
  Web Output Snapshot 생성
```

이전 영역 이동은 입력 검증 없이 허용한다. 사용자가 입력을 수정하기 위해 뒤로 이동하는 것을 막지 않는다.

### 4.3 세 번째 영역 Layout

Desktop:

```text
┌──────────────────────────────────────────────────────────┐
│ Template 정보 / version / layout revision / 변경 상태    │
├───────────────────────┬──────────────────────────────────┤
│ Section 콘텐츠 등록   │ 실제 Vue Renderer Preview       │
│ Coverage Checklist    │ Layout 편집                      │
│                       │ Desktop / Mobile                 │
├───────────────────────┴──────────────────────────────────┤
│ 관리자 변경 확인 · 기본값 초기화              Web Output │
└──────────────────────────────────────────────────────────┘
```

Mobile:

```text
Template 정보
→ Section 콘텐츠 등록
→ Coverage
→ Renderer Preview
→ Layout Actions
→ Sticky Web Output
```

## 5. 상태 설계

### 5.1 신규 상태

```js
const CONTENT_SUBSTEPS = {
  OVERVIEW: "overview",
  TEMPLATE: "template",
  LAYOUT: "layout",
};

let contentSubstep = CONTENT_SUBSTEPS.OVERVIEW;
let webOutputSnapshot = null;
let webOutputSnapshotCreatedAt = "";
```

### 5.2 Snapshot 구조

```json
{
  "contractVersion": 1,
  "createdAt": "2026-07-20T00:00:00.000Z",
  "templateIdentity": {},
  "promotionOverview": {},
  "appearance": {},
  "sectionSnapshot": [],
  "sectionInputs": {},
  "sectionOrder": [],
  "layoutSnapshot": {
    "baseLayout": {},
    "resolvedLayout": {}
  }
}
```

Snapshot에는 Worker 설정, Prompt 설정 또는 실행 상태를 포함하지 않는다. 이 값들은 실제 Run 생성 시 서버에서 별도 Snapshot으로 고정한다.

### 5.3 Snapshot 무효화

Step 4 진입 후 다음 값이 바뀌면 기존 Web Output Snapshot을 무효화한다.

- 프로모션 개요
- Template Identity
- Section 콘텐츠
- Section 순서
- Layout
- Step 1 Background
- Step 2 CTA Style

사용자가 Step 3으로 돌아와 변경한 후 다시 Web Output을 누르면 새 Snapshot을 생성한다.

## 6. 함수 분리 계획

### 6.1 Render 함수

현재 `renderContentStep()`을 다음과 같이 분리한다.

```text
renderContentStepShell()
renderContentSubstepNavigation()
renderPromotionOverviewSubstep()
renderTemplateSelectionSubstep()
renderTemplateLayoutSubstep()
renderTemplateContentPanel()
renderLayoutPreviewPanel()
renderWebOutputAction()
```

기존 Field 생성 함수와 Template/Section 렌더링 함수는 가능한 한 그대로 재사용한다.

### 6.2 Validation 함수

```text
promotionOverviewErrors()
templateSelectionErrors()
templateContentErrors()
layoutReadinessErrors()
webOutputReadinessErrors()
validateContentSubstep(target)
validateContentStep()
```

오류는 현재 `validationErrors` 구조를 유지하되 `scope` 정보를 추가한다.

### 6.3 Navigation 함수

```text
setContentSubstep(nextSubstep)
goToNextContentSubstep()
goToPreviousContentSubstep()
goToWebOutput()
returnToContentFromWebOutput()
```

`goToWebOutput()`은 전역 Footer Next와 세 번째 영역의 Web Output 버튼이 함께 사용한다.

## 7. Step 4 Web Output 계획

### 7.1 P0 — 읽기 전용 Snapshot Preview

Step 4에서 다음 정보를 표시한다.

- 선택 Template 이름·버전·Layout Revision
- Snapshot 생성 시각
- Desktop/Mobile 전환
- 실제 `PromoPageRenderer` 결과
- 콘텐츠 Coverage 요약
- `Step 3으로 돌아가 수정` 버튼
- `Generation 준비` 또는 후속 작업 진입 버튼

Step 4 Preview는 편집할 수 없다. 수정은 반드시 Step 3으로 돌아가 수행한다.

### 7.2 Renderer 재사용

권장안:

- Visual Editor에 `mode=web-output` 읽기 전용 모드 추가
- 부모 Create Promo가 `promo-web-output-snapshot` 메시지 전송
- iframe은 `PromoPageRenderer`만 렌더링
- Layout 편집 Controls와 Auto Register UI는 숨김

대안으로 Create Promo에서 별도 Renderer를 복제하지 않는다. Renderer를 복제하면 Admin Preview, Step 3 Preview 및 Web Output 결과가 서로 달라질 위험이 있다.

### 7.3 LO-FI/Final 코드 처리

현재 연결되지 않은 `renderLofiStep()`과 `renderFinalStep()`은 이번 작업에서 임의로 Step 4에 연결하지 않는다.

권장 후속 구조:

```text
Step 4 Web Output Snapshot
  → Generation 준비
  → LO-FI Generation Run
  → Confirm Draft
  → Final Design
```

해당 화면을 Step 4 내부 탭으로 구성할지 후속 Step으로 분리할지는 별도 결정한다.

## 8. 구현 단계

### Phase 1 — Step 3 세부 단계 상태와 Shell (P0)

대상 파일:

- `prototype/create-promo.js`
- `prototype/create-promo.css`
- `prototype/create-promo.html`

작업:

1. `contentSubstep` 상태와 상수 추가
2. Step 3 세부 단계 Navigation 추가
3. 기존 `renderContentStep()`을 세 Render 함수로 분리
4. 현재 사용자 입력과 Local Storage 계약 유지
5. 반응형 및 Keyboard Navigation 적용

### Phase 2 — 단계별 Validation (P0)

대상 파일:

- `prototype/create-promo.js`
- 관련 Contract/Behavior Test

작업:

1. 프로모션 개요 Validation 분리
2. Template 선택 및 로딩 Validation 추가
3. Template 콘텐츠와 Layout 준비 Validation 분리
4. 오류 발생 시 해당 세부 단계로 자동 이동
5. 기존 `validateContentStep()` 하위 호환 유지

### Phase 3 — Web Output 단일 진입점 (P0)

대상 파일:

- `prototype/create-promo.js`
- `prototype/create-promo.html`
- `prototype/create-promo.css`

작업:

1. 세 번째 영역에 `Web Output` 버튼 추가
2. 전역 Footer Next와 `goToWebOutput()` 공유
3. 중복 클릭 방지 상태 추가
4. 검증 성공 후 Snapshot 생성·저장
5. Step 4로 이동
6. Step 3에서는 Footer Next를 숨기거나 Web Output과 동일한 문구로 변경

### Phase 4 — Step 4 실제 Preview (P1)

대상 파일:

- `prototype/create-promo.js`
- `prototype/create-promo.css`
- `visual-editor/src/App.vue`
- `visual-editor/src/PromoPageRenderer.vue`
- Visual Editor Production Bundle

작업:

1. `renderWebOutputStep()` 추가
2. `mode=web-output` 읽기 전용 Renderer 추가
3. Snapshot postMessage 계약 추가
4. Desktop/Mobile Preview 추가
5. Snapshot 정보와 Coverage 표시
6. Step 3 복귀 및 Snapshot 무효화 처리

### Phase 5 — 유휴 Generation UI 정리 (P2)

작업:

1. `renderLofiStep()`과 `renderFinalStep()`의 제품 흐름 결정
2. 연결할 경우 명시적인 Navigation 추가
3. 사용하지 않을 경우 별도 모듈로 분리하거나 제거 계획 수립
4. Web Output 이동과 Worker 실행을 분리

## 9. 예상 변경 파일

| 파일 | 변경 내용 |
|---|---|
| `prototype/create-promo.js` | 세부 단계 상태·렌더링·Validation·Web Output Snapshot |
| `prototype/create-promo.css` | 세부 단계 Navigation, 2열 Layout, Sticky Web Output, 반응형 |
| `prototype/create-promo.html` | 접근 가능한 Step 3 Shell 및 Asset Version 갱신 |
| `visual-editor/src/App.vue` | Web Output 읽기 전용 모드와 Snapshot 수신 |
| `visual-editor/src/PromoPageRenderer.vue` | 기존 Renderer 재사용, 필요 시 Preview Mode 보강 |
| `prototype/visual-editor-assets/*` | Production Bundle 재생성 |
| `scripts/test-create-promo-clone-contract.js` | Step 3 Subflow 및 Web Output 계약 검증 |
| 신규 Behavior Test | 단계 전환·검증·Snapshot·중복 클릭 검증 |

## 10. 테스트 계획

### 10.1 Unit/Behavior

1. 프로모션 개요가 비어 있으면 두 번째 영역으로 이동할 수 없다.
2. 개요 입력 완료 후 Template 선택 영역으로 이동한다.
3. Template이 선택되지 않으면 세 번째 영역으로 이동할 수 없다.
4. Template API 로딩 실패 시 오류를 표시하고 재시도할 수 있다.
5. Template 변경 시 기존 Template 콘텐츠를 보존한다.
6. 필수 Section Item이 비어 있으면 Web Output이 비활성화된다.
7. Layout Identity가 없으면 Web Output으로 이동하지 않는다.
8. Admin 변경 적용 또는 유지 결정 전에는 Web Output 이동을 막는다.
9. Footer Next와 Web Output 버튼이 동일한 함수를 호출한다.
10. 빠른 중복 클릭으로 Snapshot 또는 Run이 중복 생성되지 않는다.
11. Step 3 변경 후 기존 Web Output Snapshot이 무효화된다.

### 10.2 Browser E2E

1. Step 3 진입 후 첫 번째 영역 표시
2. 필수 개요 누락 오류 확인
3. 개요 완료 후 Template 선택
4. Default 및 비기본 Active Template 전환
5. Section 콘텐츠 입력
6. Admin Layout 변경 감지 Banner 처리
7. Desktop/Mobile Layout Preview 확인
8. Web Output 버튼 활성화 조건 확인
9. Web Output 클릭 후 Step 4 읽기 전용 Preview 확인
10. Step 3과 Step 4 Renderer 결과 일치 확인
11. Step 3 복귀·수정 후 Snapshot 갱신 확인
12. 새로고침 후 세부 단계 복원 확인
13. Keyboard Navigation 및 Focus 이동 확인
14. Mobile Sticky Web Output 확인
15. Console Error 및 Network 4xx/5xx 0건 확인

## 11. 접근성 요구사항

- 세부 단계 Navigation은 `nav`와 순서형 목록 사용
- 현재 단계에 `aria-current="step"` 적용
- 비활성 단계에 실제 `disabled` 적용
- Validation 실패 시 첫 오류 Field로 Focus 이동
- Template/Layout 로딩 상태에 `aria-live` 적용
- Web Output 이동 후 Step 4 제목으로 Focus 이동
- iframe에 구체적인 `title` 제공
- 모바일 Sticky 버튼이 콘텐츠를 가리지 않도록 하단 여백 확보

## 12. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| Template 콘텐츠 입력 위치가 불명확 | 필수 콘텐츠 누락 | 세 번째 영역에 콘텐츠와 Layout을 함께 배치 |
| Footer Next와 Web Output 중복 | Validation 우회·중복 실행 | 단일 `goToWebOutput()` 사용 |
| Step 4 Placeholder 유지 | 버튼 클릭 후 빈 결과 | P1 읽기 전용 Renderer를 같은 배포에 포함 |
| iframe Snapshot Race | 이전 Layout 표시 | Snapshot ID와 최신 Request Token 비교 |
| Admin 변경 미확인 | 구버전 Layout으로 Output 생성 | Pending Update가 있으면 Web Output 차단 |
| Local Storage 상태 증가 | 마이그레이션 오류 | Substep은 Session Storage, Output Snapshot은 Versioned Entry 사용 |
| LO-FI/Final과 Web Output 혼동 | 사용자 흐름 불명확 | Preview 이동과 Worker 실행 분리 |
| 모바일 화면 과밀 | 입력·Preview 사용성 저하 | 세로 Stack과 Sticky Primary Action 적용 |

## 13. 완료 정의

- [ ] Step 3이 세 개의 명확한 세부 영역으로 분리된다.
- [ ] 사용자 요청 명칭인 프로모션 개요, 프로모션 템플릿, 템플릿 레이아웃이 표시된다.
- [ ] Template Section/Item 콘텐츠 입력이 세 번째 영역에서 누락 없이 제공된다.
- [ ] 각 세부 단계의 필수조건과 오류 상태가 표시된다.
- [ ] Template별 콘텐츠·Layout·Section 순서 저장 계약이 유지된다.
- [ ] 템플릿 레이아웃 영역에 Web Output 버튼이 제공된다.
- [ ] Footer Next와 Web Output이 동일한 검증·이동 함수를 사용한다.
- [ ] Web Output 클릭 시 Versioned Snapshot이 생성된다.
- [ ] Step 4에서 실제 읽기 전용 Renderer Preview가 표시된다.
- [ ] Step 3 Preview와 Step 4 Preview 결과가 일치한다.
- [ ] Admin 변경 Pending 상태에서는 Web Output 생성이 차단된다.
- [ ] 사용자 콘텐츠와 Step 1·2 Appearance가 보존된다.
- [ ] Unit, Contract, Behavior 및 Browser E2E가 통과한다.
- [ ] Visual Editor Production Bundle이 재생성된다.
- [ ] Console Error와 관련 Network 4xx/5xx가 없다.

## 14. 권장 개발 순서

```text
1. 세부 단계 상태와 Navigation 계약
2. renderContentStep 함수 분리
3. 단계별 Validation 분리
4. Template 전환과 상태 보존 회귀 테스트
5. Web Output Snapshot 계약
6. Web Output 단일 이동 함수
7. Step 4 읽기 전용 Renderer
8. 반응형·접근성 보강
9. Contract/Behavior Test
10. Visual Editor Production Build
11. Browser E2E
12. 배포 환경 Smoke Test
```

## 15. 최종 판단

Step 3을 세 영역으로 나누는 요청은 현재 과도하게 긴 화면과 기능 혼합 문제를 해결하는 올바른 방향이다.

다만 `템플릿 레이아웃`에는 현재 필수 기능인 Template Section 콘텐츠 입력을 함께 배치해야 한다. 또한 Web Output 버튼은 단순 Step 이동 버튼이 아니라 검증된 Snapshot을 확정하는 단일 진입점이어야 한다.

가장 중요한 구현 원칙은 다음과 같다.

> Step 3의 세부 단계는 입력 UX만 분리하고 데이터 계약은 하나로 유지한다. Web Output은 동일한 Renderer와 동일한 Snapshot을 사용하며, Worker 실행과 분리한다.
