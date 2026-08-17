# Composition Review·AI 텍스트 폭·필수 섹션 누락 개선 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-17
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 코드 구현 및 자동 검증 완료 / Migration 059 운영 반영 대기
- 우선순위: 필수 섹션 무결성(P0) → Composition Review UX(P1) → 텍스트 폭 다양화(P1)
- 대상 실행 경로:
  - 신규: Registry 기반 AI Composition Contract v3
  - 레거시: Template 기반 AI Composition Contract v2
- 대상 관리자 화면:
  - `설정 > Section Preset 관리`
  - `설정 > Composition Shell 관리`
  - `설정 > LLM 및 프롬프트 관리`
- 선행 문서:
  - `docs/계획/ai-registry-composition-mode-supplement-development-plan-2026-08-04.md`
  - `docs/계획/ai-layout-preset-new-legacy-remediation-development-plan-2026-08-14.md`
  - `docs/계획/composite-component-child-field-layout-control-development-plan-2026-08-17.md`

---

## 1. 목적

이번 개발은 다음 세 문제를 하나의 생성 품질·무결성 개선 범위로 처리한다.

1. `Composition Review`에서 Section이 가로 카드로 표시되어 실제 Web Page의 위→아래 흐름을 파악하기 어려운 문제를 해결한다.
2. AI가 생성한 제목과 본문 영역이 매번 약 40~60% 폭으로 반복되는 원인을 제거하고, 관리 가능한 Layout Preset 기반 다양화를 적용한다.
3. 관리자가 `필수 섹션` 또는 `항상 포함`으로 지정한 Section이 최종 출력에서 누락되는 경로를 차단한다.

핵심 원칙은 다음과 같다.

- 필수 Section 포함 여부는 LLM 판단에 맡기지 않는다.
- 필수 Section을 구성할 수 없으면 조용히 제외하지 않고 생성 전에 명시적으로 실패한다.
- Layout 수치와 폭 정책은 관리자 Layout Preset에서 관리한다.
- Prompt 추가·변경이 필요한 경우 소스에 자연어 Prompt를 하드코딩하지 않고 `LLM 및 프롬프트 관리`의 Version으로 관리한다.
- 기존 저장 문서는 일괄 재작성하지 않고 새 생성·재생성부터 적용한다.

---

## 2. 현행 구조 요약

### 2.1 Composition Review

`visual-editor/src/builder/RegistryProposalReview.vue`는 Proposal Snapshot의 다음 요약 정보만 표시한다.

- `sectionKey`
- `sectionRole`
- `layoutKey`
- `repeat`
- `componentKeys`
- `resourceKeys`

현재 `.registry-proposal-grid`는 다음 CSS를 사용한다.

```css
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
```

따라서 넓은 화면에서는 Section이 좌→우 카드 그리드로 배치된다. 데이터 배열 순서는 유지되지만 사용자가 최종 Web Page의 세로 순서로 인지하기 어렵다.

### 2.2 AI 생성 텍스트 폭

Registry v3는 AI가 개별 텍스트 폭을 직접 계산하지 않는다. AI가 선택한 Layout Preset의 `layoutSnapshot.viewports.*.items.*.widthPct`가 Compiler를 거쳐 Renderer에 적용된다.

현재 기본 Registry Hero Seed 값은 다음과 같다.

| Component | Desktop | Mobile |
|---|---:|---:|
| Title | 40% | 90% |
| Description | 40% | 90% |
| Primary CTA | 22% | 70% |

Preset에 폭이 없으면 공통 Geometry 기본값이 사용된다.

| Component 유형 | 기본 폭 |
|---|---:|
| Title / Headline | 72% |
| 일반 Text | 60% |
| CTA | 24% |
| Image | 44% |
| 복합 Component | 100% |

레거시 Section AI Planner는 배치 Region에 따라 `left/right = 46%`, `center = 70%`를 적용한다.

### 2.3 필수 Section 후보 처리

Registry v3 후보 Resolver는 다음 Section만 조회한다.

```sql
composition_scope in ('registry', 'shared')
```

이후 다음 조건으로 후보를 제외할 수 있다.

- `shared` Section이 활성 Composition Shell의 `sharedSectionVersionIds`에 없음
- Section Role이 Shell의 `allowedSectionRoles`에 없음
- Market 또는 Promotion Purpose 조건 불일치
- `aiDesign.enabled = false`
- 활성 Component 없음
- AI 선택 가능 Layout Preset 없음

문제는 `resolvedRequired` 계산보다 후보 제외가 먼저 적용되고, Proposal Contract의 필수 누락 검증도 최종 `candidates.sections`만 대상으로 한다는 점이다. 앞 단계에서 제외된 필수 Section은 검증 대상에서도 사라진다.

---

## 3. 이슈 리스트

| ID | 우선순위 | 영역 | 현상 | 원인 | 처리 범위 |
|---|---|---|---|---|---|
| CR-01 | P1 | Composition Review | Section이 가로 카드로 표시됨 | `auto-fit` 다중 열 Grid | Frontend |
| CR-02 | P1 | Composition Review | Component 구성이 `·` 연결 문자열로 표시됨 | 구조적 목록이 아닌 단순 문자열 출력 | Frontend |
| CR-03 | P1 | Composition Review | 필수/선택, 고정 위치, 실제 Page 순서가 명확하지 않음 | Preview DTO와 UI에 상태 표현 부족 | API DTO + Frontend |
| CR-04 | P2 | Composition Review | Section이 많을 때 적용 버튼까지 긴 Scroll 발생 | Action 영역이 일반 Flow에 위치 | Frontend UX |
| TW-01 | P1 | AI Layout | Hero Title/Description 폭이 반복적으로 약 40% | 기본 Hero Layout Preset의 고정 `widthPct` | 설정 데이터 |
| TW-02 | P1 | AI Layout | Preset이 없어도 Title 72%, Text 60%로 수렴 | 공통 Geometry 고정 Fallback | 공통 코드 |
| TW-03 | P1 | AI Layout | 콘텐츠 길이·정렬 의도와 폭 후보의 관계가 없음 | Layout 선택 메타데이터에 Copy 폭 의미 부족 | 설정 + Candidate DTO |
| TW-04 | P2 | 레거시 AI | 좌/우 46%, 중앙 70%로 반복 | Region별 폭 하드코딩 | 레거시 코드 |
| RS-01 | P0 | 필수 Section | `필수 섹션`이어도 `template` Scope이면 Registry v3에서 조회되지 않음 | v3 Query는 `registry/shared`만 조회 | 설정 UX + API |
| RS-02 | P0 | 필수 Section | 필수 Section이 AI Design 비활성 등으로 조용히 제외됨 | 필수 판정보다 Candidate 적격성 제외가 우선 | Candidate Resolver |
| RS-03 | P0 | 필수 Section | 제외된 필수 Section을 Contract 검증이 발견하지 못함 | 검증 대상이 Eligible Candidate로 한정 | Contract + Service |
| RS-04 | P0 | Shared Section | 공용 필수 Section이 Shell 미연결 시 누락 | `sharedSectionVersionIds` Version whitelist 의존 | Shell 관리 + Resolver |
| RS-05 | P0 | Candidate Limit | 필수 Section 수가 후보 Limit을 넘으면 후순위 필수가 잘릴 수 있음 | Required/Optional 구분 없이 최종 `slice` | Candidate Ranking |
| RS-06 | P0 | Version 관리 | Shared Section 새 Version 활성화 후 Shell이 이전 Version ID를 참조할 수 있음 | Shell과 Section Version lifecycle 연동 없음 | 활성화 API + Shell 검증 |
| RS-07 | P1 | 설정 UX | 관리자 화면에 `registry` Scope 선택지가 없음 | UI는 `template/shared`만 제공 | 관리자 Frontend |
| RS-08 | P1 | Review UX | 필수 Section이 Proposal Review에서 구분되지 않음 | Preview DTO에 필수 상태가 없음 | Contract DTO + Frontend |
| RS-09 | P1 | 관측성 | 제외 사유를 일반 사용자가 확인하기 어려움 | `excluded.reasonCodes` 운영 노출 부족 | API + 관리자 진단 UI |

---

## 4. 목표 동작

### 4.1 필수 Section

1. 현재 요청에 적용되는 전체 필수 Section 집합을 AI 호출 전에 확정한다.
2. 필수 Section은 Candidate Limit과 LLM 선택 여부의 영향을 받지 않는다.
3. LLM에는 필수 Section을 변경할 수 없는 Candidate로 전달하거나 선택 대상에서 분리한다.
4. LLM 결과에 필수 Section이 없어도 서버가 결정론적으로 보강한다.
5. 필수 Section의 Layout, Component, Resource가 유효하지 않으면 Proposal 생성을 중단한다.
6. Apply 직전과 Compile 직후에도 필수 Section 포함 여부를 다시 검증한다.
7. Composition Review에서 필수 Section을 `항상 포함`으로 표시한다.

### 4.2 Composition Review

Desktop과 Mobile 모두 한 열의 세로 Page Structure로 표시한다.

```text
01  HERO                          [항상 포함]
    Hero · hero_centered
    ├─ title
    ├─ description
    └─ primaryAction

02  BENEFIT
    Benefit · card_grid_3
    └─ cards × 3

03  TERMS                         [항상 포함] [하단 고정]
    Terms · terms_default
    └─ termsContent
```

실제 콘텐츠와 Asset이 완성되기 전 단계이므로 이 화면에서 `PromoPageRenderer`를 사용하지 않는다. 이 단계는 실제 렌더링 Preview가 아니라 Page Structure Review로 유지한다.

### 4.3 텍스트 폭

단일 폭을 임의 산출하지 않고 관리자가 승인한 Layout Preset 중 하나를 선택한다.

권장 Width Profile은 다음과 같다.

| Profile | Desktop 권장 범위 | 사용 예 |
|---|---:|---|
| `compact` | 38~46% | 이미지와 분리된 짧은 Hero Copy |
| `balanced` | 52~64% | 일반 Hero와 설명 중심 Section |
| `wide` | 68~80% | 중앙 정렬 또는 긴 Headline |
| `full` | 84~92% | 공지, 약관, 긴 본문 |

실제 숫자는 Layout Snapshot에 저장하고, Candidate에는 `compact/balanced/wide/full` 같은 선택 의미만 전달한다.

---

## 5. 설정 페이지와 코드 적용 경계

### 5.1 설정에서 관리할 항목

- Section의 사용 범위: Template / Registry / Shared
- 필수 Section 여부
- Page 포함 정책: Required / Optional / Market / Purpose
- Section Role과 고정 위치
- AI Design 활성 여부
- AI 선택 가능 Layout Preset
- Layout별 Desktop/Mobile `widthPct`, 위치, 높이
- Layout 선택 메타데이터:
  - 정렬 방향
  - Copy 폭 Profile
  - 적합한 콘텐츠 길이
  - 이미지 사용 방식
- Composition Shell의 허용 Role, 필수 Role, Shared Section 연결
- `promo_page_composer` Prompt의 Layout 선택 지침

### 5.2 코드에서 보장할 항목

- 필수 Section 전체 집합 계산
- 필수 Section의 Candidate Limit 제외
- 필수 Section 자동 보강
- 구성 불가능한 필수 Section의 Fail-closed 처리
- Apply/Compile 시 필수 Section 재검증
- Section Version 활성화와 Shell 참조 정합성 검증
- Review Preview DTO의 필수/고정/제외 상태
- Composition Review 세로 구조와 접근성
- Preset 누락 시 공통 폭 Fallback
- 신규 v3와 레거시 v2의 회귀 호환

### 5.3 Prompt 관리 원칙

Prompt에는 다음 의미만 추가할 수 있다.

- 콘텐츠 길이와 시각적 의도에 맞는 Layout Preset을 선택한다.
- `widthProfile`, 정렬, 이미지 관계 메타데이터를 선택 근거로 사용한다.
- 필수 Section은 숨기거나 제거하지 않는다.

이 문구는 `api` 소스 또는 Vue 소스에 하드코딩하지 않는다. `설정 > LLM 및 프롬프트 관리 > promo_page_composer`의 새 Draft Version을 생성하고 검증 후 활성화한다.

---

## 6. 단계별 개발 계획

## 6.1 1단계 — P0 필수 Section 후보 무결성

### Backend

1. `fetchRegistryCompositionCandidates`에서 `requiredUniverse`를 별도로 만든다.
2. `resolvedRequired`를 Candidate 제외 사유 계산 전에 확정한다.
3. Required와 Optional의 제외 정책을 분리한다.
4. 필수 Section이 아래 조건을 충족하지 못하면 `excluded`에만 넣지 않고 오류를 발생시킨다.
   - 활성 Component
   - 활성 Desktop/Mobile Layout Preset
   - 허용된 Section Role
   - Shared Shell 연결
   - 필수 Resource Version
5. 오류 계약을 추가한다.

```text
REQUIRED_SECTION_INELIGIBLE
REQUIRED_SECTION_LAYOUT_MISSING
REQUIRED_SECTION_COMPONENT_MISSING
REQUIRED_SHARED_SECTION_NOT_REFERENCED
REQUIRED_SECTION_ROLE_NOT_ALLOWED
```

6. `aiDesign.enabled = false`는 Section 제외 조건에서 분리한다.
   - Section과 고정 콘텐츠는 포함한다.
   - 이미지 생성 및 AI 디자인 변경 Capability만 비활성화한다.
7. Candidate Ranking은 Required 전체를 먼저 유지하고 남은 Limit에 Optional을 채운다.
8. Candidate Snapshot에 다음 진단 정보를 추가한다.
   - `requiredSectionVersionIds`
   - `requiredSectionCount`
   - `excludedRequired`
   - `excludedOptional`

### 대상 파일

- `api/_promo-registry-composition-candidates.js`
- `api/_promo-resource-policy.js`
- `api/promo-registry-composition-candidates.js`
- `api/promo-page-composition-proposals.js`

### 완료 조건

- 구성 불가능한 필수 Section이 하나라도 있으면 LLM 호출 전에 명확한 오류가 반환된다.
- Required 수가 Candidate Limit보다 많아도 Required가 잘리지 않는다.
- `aiDesign.enabled = false`인 고정 Legal/Footer가 Candidate에 포함된다.

## 6.2 2단계 — P0 필수 Section 결정론적 보강과 다중 검증

### Proposal Service

1. LLM 결과를 검증하기 전에 `materializeRequiredSections`를 실행한다.
2. 누락된 필수 Section은 Candidate의 다음 기본값으로 보강한다.
   - `defaultLayoutKey`
   - `repeat = 1`
   - 필수 Component 전체
   - Component `minItems`
   - 고정 Resource Reference
   - 관리자 `sortOrder` 및 `fixedPosition`
3. 필수 Section에 대한 LLM의 `visible = false` 또는 부적합 Layout 요청은 거부한다.

### Contract / Compiler

1. Contract 검증은 Eligible Candidate뿐 아니라 `requiredUniverse`와 결과를 비교한다.
2. Apply 단계에서 Candidate Fingerprint와 Required Fingerprint를 함께 확인한다.
3. Compiler 완료 후 다음 불변식을 검증한다.

```text
required section version count
  == compiled required source section version count
```

4. `fixedPosition = top/bottom` Section의 최종 `sectionOrder`도 검증한다.

### 대상 파일

- `api/_promo-page-composition-service.js`
- `api/_promo-registry-composition-contract.js`
- `api/_promo-registry-composition-compiler.js`
- `api/promo-page-composition-apply.js`
- `api/_promo-composition-fingerprint.js`

### 완료 조건

- LLM이 필수 Section을 반환하지 않아도 최종 Proposal에는 포함된다.
- Proposal, Apply, Compile 어느 단계에서도 필수 Section을 제거할 수 없다.
- Header는 최상단, Footer/Terms는 정책에 따라 최하단에 유지된다.

## 6.3 3단계 — 관리자 Scope·Shell Version 정합성

### 관리자 UI

사용 범위를 다음 세 항목으로 명확히 분리한다.

| 값 | 화면 명칭 | 적용 경로 |
|---|---|---|
| `template` | 현재 템플릿 전용 | Template v2 |
| `registry` | AI Registry 후보 | Registry v3 |
| `shared` | 공용 Section | Shell에 연결된 v3 및 연결된 Template |

`필수 섹션`을 선택했지만 현재 AI 모드에서 사용할 수 없는 Scope이면 경고를 표시한다.

### Shell 정합성

1. Shared Section 새 Version 활성화 시 해당 Section을 참조하는 활성 Shell Version을 탐지한다.
2. 자동으로 활성 Shell을 직접 수정하지 않는다.
3. 다음 중 한 정책을 구현한다.
   - Shell Draft Version 자동 생성 후 관리자 활성화
   - 활성화 차단 후 Shell Version 갱신 요청
4. Shell 관리 화면에 누락·구버전 Shared Section을 표시한다.
5. 필수 Role만 있고 실제 Section 연결이 없으면 Shell 활성화를 차단한다.

### 대상 파일

- `prototype/index.html`
- `prototype/app.js`
- `api/wizard-content-section.js`
- `api/wizard-content-section-activate.js`
- `api/_promo-composition-shells-store.js`
- Composition Shell 관리자 API/UI

### 데이터 보정

- 기존 `template` 필수 Section을 일괄 `registry`로 변경하지 않는다.
- 운영 데이터를 다음 기준으로 Audit한다.
  - AI 모드에서 사용해야 하는 필수 Section
  - Template 전용으로 유지할 필수 Section
  - Shared로 전환할 필수 Section
- 선택 결과에 따라 새 Section Draft Version과 새 Shell Draft Version을 생성한다.

## 6.4 4단계 — Composition Review 세로 Page Structure

### Preview DTO

Section별 다음 값을 추가한다.

```json
{
  "sequence": 1,
  "required": true,
  "fixedPosition": "top",
  "componentRepeats": {},
  "warnings": []
}
```

### Frontend

1. `.registry-proposal-grid`를 세로 한 열 구조로 변경한다.
2. 의미 있는 순서이므로 `ol > li`를 사용한다.
3. Section 번호, 역할, Layout, 필수 상태, 반복 수를 Header 영역에 표시한다.
4. Component는 `ul > li`로 표시하고 반복 수를 각각 표시한다.
5. Resource는 Section 내부 보조 정보로 표시하고 전체 고정 Resource 요약도 유지한다.
6. 필수 Section에는 `항상 포함`, 고정 Section에는 `상단 고정/하단 고정` Badge를 표시한다.
7. Section 수가 많을 때 Action 영역을 Card 하단 Sticky Footer로 적용하되 콘텐츠를 가리지 않도록 Padding을 확보한다.
8. Mobile에서도 다중 열로 전환하지 않는다.

### 대상 파일

- `visual-editor/src/builder/RegistryProposalReview.vue`
- `visual-editor/src/builder/ai-builder.css`
- `api/_promo-registry-composition-contract.js`

### 접근성

- DOM 순서와 시각 순서를 동일하게 유지한다.
- 순서를 색상이나 연결선에만 의존하지 않는다.
- 필수 Badge에 텍스트를 포함한다.
- Apply/Back Button의 Keyboard Focus와 Sticky 상태를 검증한다.

## 6.5 5단계 — 텍스트 폭 Profile 및 Layout 다양화

### Registry v3

1. 기존 Hero Layout 하나를 직접 덮어쓰지 않고 새 Layout Preset Version을 구성한다.
2. 최소 다음 후보를 제공한다.
   - `hero_left_compact`
   - `hero_left_wide`
   - `hero_center_wide`
   - `hero_right_balanced`
3. 각 Layout에 Desktop/Mobile 전체 Geometry와 선택 메타데이터를 저장한다.
4. Candidate DTO에 Layout 선택 메타데이터를 전달한다.
5. Layout 이름과 Key를 Prompt 본문에 하드코딩하지 않고 Candidate 데이터로 제공한다.

### 공통 Fallback

1. `defaultComponentWidthPct`의 전역 수치를 바로 제거하지 않는다.
2. Layout Geometry 누락은 정상 생성 경로가 아니라 진단 대상이 되도록 한다.
3. 신규 문서에서는 Required Component의 Geometry 누락을 Warning 또는 Error로 승격한다.
4. Fallback 폭 변경은 기존 저장 문서에 적용하지 않고 새 Snapshot에만 적용한다.

### 레거시 v2

1. `left/right = 46`, `center = 70`을 즉시 제거하지 않는다.
2. Layout Preset이 있는 Section은 Preset을 우선한다.
3. Preset이 없는 기존 Section에만 현행 Region Fallback을 유지한다.
4. 레거시 폭 정책 변경은 별도 Feature Flag 또는 Contract Version으로 격리한다.

### Prompt

`promo_page_composer`의 새 Draft Version에 Layout 선택 메타데이터 활용 규칙을 추가하고 다음 절차로 활성화한다.

```text
Draft 생성 → Validation → Test 실행 → Ready 전환 → Active 전환
```

---

## 7. Migration 및 데이터 Audit 계획

### 7.1 Schema Migration

기존 JSON 계약으로 다음 정보를 저장할 수 있으면 신규 Column을 만들지 않는다.

- Layout `selectionMetadata`
- Shell `sharedSectionVersionIds`
- Section `compositionPolicy`
- Layout `layoutSnapshot`

필요 시 다음 Migration만 추가한다.

- Required Candidate 진단 및 Fingerprint 저장 필드
- Shell과 Shared Section Version 참조 무결성 지원
- 새 Layout Preset Version/Metadata Seed

Migration 번호는 적용 시점의 다음 사용 가능 번호로 확정한다.

### 7.2 운영 데이터 Audit 항목

각 활성 Section에 대해 다음을 확인한다.

```text
section_key
version
status
composition_scope
is_required
fixed_position
selectionPolicy
section_role
is_visible_in_wizard
aiDesign.enabled
active component count
active layout count
shared shell reference count
```

### 7.3 보정 원칙

- 기존 Active Version을 직접 덮어쓰지 않는다.
- Section은 새 Draft Version에서 수정하고 활성화한다.
- Shared Section Version 변경 시 Shell도 새 Draft Version으로 갱신한다.
- 기존 Builder Document Snapshot은 그대로 유지한다.
- 재생성 시점부터 새 정책과 Layout을 사용한다.

---

## 8. 테스트 계획

### 8.1 Unit Test

- Required Registry Section이 항상 `requiredUniverse`에 포함된다.
- Required Shared Section이 Shell 미연결이면 명시적 오류가 발생한다.
- `aiDesign.enabled = false`인 필수 Section도 콘텐츠 Candidate에는 포함된다.
- Required Section에 활성 Component가 없으면 생성이 차단된다.
- Required Section에 Layout Preset이 없으면 생성이 차단된다.
- Candidate Limit보다 Required 수가 많아도 Required가 잘리지 않는다.
- LLM 결과에서 Required가 누락되면 서버가 기본 구성으로 보강한다.
- LLM이 Required를 숨기려 하면 거부한다.
- Compile 결과의 Required source version 집합이 입력과 동일하다.
- Header/Footer 고정 순서가 유지된다.
- Layout Profile 메타데이터가 Planner Snapshot에 전달된다.

### 8.2 Contract Test

수정 또는 추가 대상:

- `scripts/test-promo-registry-composition-candidates.js`
- `scripts/test-promo-registry-composition-contract-v3.js`
- `scripts/test-promo-registry-composition-compiler.js`
- `scripts/test-registry-composition-vertical-slice-seed.js`
- `scripts/test-promo-builder-platform-contract.js`
- 신규 `scripts/test-registry-required-section-integrity.js`
- 신규 `scripts/test-registry-proposal-review-layout.mjs`

### 8.3 Integration Test

1. Required Hero + Optional Benefit + Required Terms 구성
2. LLM Mock이 Hero와 Terms를 누락한 응답 반환
3. Proposal Service가 Hero와 Terms를 보강
4. Composition Review에 세 Section이 위→아래 순서로 표시
5. Apply 후 Renderer에 세 Section이 모두 출력
6. Terms가 최하단에 고정
7. 새 Hero Layout 후보를 바꿔 생성했을 때 Title 폭이 서로 다르게 출력

### 8.4 관리자 UI Test

- Scope에 Template / Registry / Shared가 구분된다.
- 필수 Section과 Scope가 충돌하면 경고가 표시된다.
- Shared Section이 Shell에 연결되지 않으면 상태가 표시된다.
- Layout Live Preview와 JSON에서 Desktop/Mobile `widthPct`가 일치한다.
- Prompt Draft/Ready/Active lifecycle이 유지된다.

### 8.5 회귀 Test

- Template Mode v2 생성 유지
- 기존 Contract v2 Snapshot 렌더링 유지
- 기존 Contract v3 Snapshot 렌더링 유지
- Visual Editor 위치 이동·크기 조절 유지
- 복합 Component 하위 Field 속성 편집 유지
- Web Output과 HTML Export Section 순서 동일

---

## 9. 단계별 배포 순서

| 단계 | 내용 | 배포 조건 |
|---|---|---|
| 1 | Required Candidate Fail-closed 및 진단 | P0 Unit/Contract 통과 |
| 2 | Required 자동 보강·Apply/Compile 재검증 | Integration 통과 |
| 3 | 관리자 Scope·Shell Version 정합성 | 운영 데이터 Audit 완료 |
| 4 | Composition Review 세로 UX | UI/접근성 통과 |
| 5 | Layout 폭 Profile 및 Prompt Version | 관리자 Preview 승인 |
| 6 | 전체 E2E·회귀 검증 | v2/v3/Web Output 통과 |

P0 수정은 UI 변경보다 먼저 배포한다. 필수 Section 무결성이 확보되기 전에는 Layout 다양화만 단독 배포하지 않는다.

---

## 10. 완료 기준

다음 조건을 모두 만족하면 개발 완료로 판단한다.

1. 필수 Section이 LLM 응답과 무관하게 Proposal과 출력에 포함된다.
2. 구성 불가능한 필수 Section은 사용자에게 Section Key와 원인을 포함한 오류로 안내된다.
3. Candidate Limit, Scope, AI Design 상태 때문에 필수 Section이 조용히 누락되지 않는다.
4. Shared Section Version과 Composition Shell 참조가 활성화 단계에서 검증된다.
5. Composition Review가 Web Page와 같은 위→아래 순서로 표시된다.
6. Review에서 필수/선택, 고정 위치, Layout, Component 반복 수를 확인할 수 있다.
7. Hero 텍스트 폭이 승인된 여러 Layout Preset에 따라 40% 한 가지 값으로 반복되지 않는다.
8. 텍스트 폭과 Layout 수치는 설정 페이지 JSON에서 확인·관리할 수 있다.
9. Prompt 변경은 `LLM 및 프롬프트 관리`의 활성 Version으로만 적용된다.
10. 신규 v3, 레거시 v2, Visual Editor, Web Output, HTML Export 회귀 테스트가 모두 통과한다.

---

## 11. 구현 권장 순서 요약

```text
P0-1  필수 Section 전체 집합과 제외 사유 확정
P0-2  필수 Section Fail-closed 및 Candidate Limit 보호
P0-3  필수 Section 서버 자동 보강
P0-4  Apply/Compile 최종 불변식 검증
P0-5  Scope·Shared Shell Version 정합성
P1-1  Composition Review 세로 Page Structure
P1-2  필수/고정/반복 상태 표시
P1-3  Layout 폭 Profile과 신규 Preset
P1-4  관리자 Prompt Version 반영
P2    Sticky Action 및 레거시 폭 Fallback 개선
```

---

## 12. 2026-08-17 구현 결과

### 12.1 반영 완료

- 필수 Section을 Candidate Limit 및 `aiDesign.enabled` 선택 조건보다 우선하도록 변경했다.
- 구성 불가능한 필수 Section은 제외하지 않고 Section Key, Version ID, Reason Code를 포함한 오류로 중단한다.
- LLM 응답에 빠진 필수 Section과 필수 Component를 서버가 결정론적으로 보강한다.
- Compile 직전에도 모든 필수 Section Version ID를 다시 검사한다.
- 필수 Shared Section 활성화 시 Active Composition Shell의 Version 참조를 검증한다.
- Section Preset 관리에서 `template`, `registry`, `shared` Scope를 선택하고 확인할 수 있게 했다.
- Composition Review를 세로 Page Structure로 변경하고 순번, 필수 여부, 고정 위치, Layout, 반복 수를 표시한다.
- Registry Hero에 `compact`, `balanced`, `wide` 폭 Profile 기반 Layout 후보를 추가했다.
- Layout Preset의 `selectionMetadata.widthProfile`을 설정 화면과 JSON에서 관리할 수 있게 했다.
- Layout 선택 지침은 런타임 소스 Prompt가 아니라 Migration 059가 생성하는 관리자 검토용 Prompt Draft에 추가했다.

### 12.2 검증 결과

- 관리자 앱 및 Visual Editor Production Build 통과
- 관련 Contract/Seed/Layout/UI 집중 테스트 통과
- 전체 자동 테스트 `131/131` 통과
- `git diff --check` 통과

### 12.3 운영 반영 순서

1. `db/migrations/059_registry_required_sections_and_hero_width_profiles.sql`을 적용한다.
2. `db/migrations/060_reconcile_required_shared_sections_with_composition_shells.sql`을 적용한다. 기존 활성 필수 Shared Section의 Version ID와 Role이 새 Composition Shell Version에 자동 반영된다.
3. 이후 필수 Shared Section 활성화는 Section과 Composition Shell Version을 단일 DB 트랜잭션으로 함께 활성화한다.
4. `설정 > LLM 및 프롬프트 관리`에서 Migration 059 Prompt Draft를 검토·검증·활성화한다.
5. AI Mode에서 Proposal 생성 → Composition Review → Apply → Web Output 순서로 Smoke Test를 수행한다.

Migration 059 실행 시 같은 Lineage에 이미 Draft 또는 Validated Prompt가 있으면 새 Prompt Draft를 중복 생성하지 않는다. 이 경우 기존 Draft의 `promptLayers.additionalInstructions`에 폭 Profile 선택 지침이 포함되어 있는지 관리 화면에서 확인한 후 활성화한다.

Migration 060은 Active Composition Shell의 JSON을 직접 수정하지 않고 새 Version을 생성해 활성화한다. 작업 중인 Composition Shell Draft가 있으면 관리자 변경을 덮어쓰지 않고 Migration 전체를 중단한다. 이 경우 Draft를 먼저 활성화하거나 정리한 후 Migration 060을 다시 실행한다.
