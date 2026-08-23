# AI Mode Live Preview 디자인 품질 게이트 개선 개발 계획서

## 0. 문서 정보

- 작성일: 2026-08-20
- 대상 프로젝트: `promo_web_builder`
- 대상 흐름: `AI로 만들기 → Overview 확인 → AI 구성·자산 생성 → Live Preview → Web Output`
- 문서 상태: P0 서버 Revision Gate·Output/Export 차단 완료 / Layout Fit Scoring·자동 Repair 후속 개발 필요
- 우선순위: P0 품질 실패 차단 → P1 조합 품질 향상 → P2 운영 최적화
- 근거 자료:
  - `tmp/ai-live-preview-audit-2026-08-20/ai-live-preview-quality-review-ko.md`
  - `tmp/ai-live-preview-audit-2026-08-20/01-ai-live-preview-desktop.png`
  - `tmp/ai-live-preview-audit-2026-08-20/04-ai-live-preview-mobile.png`
- 관련 현행 문서:
  - `docs/설계/ai-promotion-builder-composition-engine-technical-design-2026-07-29.md`
  - `docs/계획/ai-builder-auto-composition-and-preview-readiness-development-plan-2026-08-17.md`
  - `docs/계획/composition-review-text-width-required-sections-remediation-development-plan-2026-08-17.md`
  - `docs/계획/ai-promotion-component-drag-and-overlap-remediation-development-plan-2026-08-17.md`

---

## 1. 목적

AI Mode의 Live Preview를 단순히 “구조와 이미지 생성이 끝난 화면”이 아니라 **디자인·콘텐츠·자산·반응형 품질 기준을 통과한 첫 편집 가능 결과**로 정의한다.

현재 시스템은 제한된 Registry와 Layout Preset을 조립하고 자산 상태를 기다리는 기본 구조는 갖추고 있다. 그러나 실제 운영 결과에서는 다음 문제가 동시에 발생했다.

- Hero 제목이 비정상적으로 줄바꿈되고 CTA·본문·이미지와 충돌함
- 모바일에서 제목과 키비주얼이 잘림
- 카드 이미지 3개 중 2개가 `이미지 준비 중`으로 남음
- 카드 3개의 문구와 CTA가 동일함
- 카드 이후 과도한 빈 공간과 반복된 형태가 나타남
- 영문 T&C와 한글 Shared Terms가 혼합됨
- 내장 `겹침 확인`은 1건만 감지하고 나머지 품질 실패는 통과시킴

이번 개선의 핵심은 LLM이 HTML/CSS를 자유 생성하게 만드는 것이 아니다. **관리자가 승인한 디자인 시스템 안에서 적합한 조합을 선택하고, 결정론적 품질 게이트를 통과한 결과만 Live Preview로 승격**하는 것이다.

---

## 2. 핵심 결론

현재 문제는 개별 CSS 수정만으로 해결되지 않는다. 다음 세 계약을 추가해야 한다.

1. **Content–Layout Fit Contract**  
   콘텐츠 길이, 컴포넌트 수, 이미지 비율, 화면 폭에 맞는 Layout Preset을 선택한다.

2. **Expected Asset Readiness Contract**  
   생성 요청에 포함된 자산만 기다리지 않고, 최종 문서에 필요한 필수 이미지 전체가 존재하는지 검증한다.

3. **Rendered Quality Gate Contract**  
   Desktop과 Mobile 실제 렌더 결과에서 충돌, 잘림, overflow, 비정상 공백, 중복 콘텐츠, 언어 불일치를 검사한다.

품질 게이트를 통과하지 못한 결과는 편집 가능한 완료 화면으로 보내지 않는다. 자동 보정 가능한 문제는 제한된 횟수만큼 보정하고, 해결되지 않으면 `품질 확인 필요` 상태로 중단한다.

---

## 3. 기존 계획과의 관계

### 3.1 유지하는 기존 구현

- Contract v3 Registry, 활성 Section·Component·Layout 후보 제한
- Raw HTML/CSS/JavaScript 생성 금지
- 관리자 Layout Preset과 Design Token 사용
- Builder Document Revision과 Snapshot 저장
- Asset Job의 `pending/queued/processing/ready/failed` 상태
- `겹침 확인`, `겹침 보정`, `LAYOUT_COLLISION_REFLOW`
- Desktop/Mobile Layout Snapshot
- Required Section의 서버 강제 적용

### 3.2 확장해야 하는 부분

| 기존 범위 | 현재 한계 | 이번 계획의 확장 |
|---|---|---|
| Asset Readiness | `assets.requests`가 비어 있으면 즉시 Ready | 필요한 이미지 목록과 요청 목록의 Coverage 비교 |
| 충돌 검사 | `.rendered-item--text` 중심 | 이미지·CTA·복합 필드·Section 경계까지 검사 |
| Layout 선택 | Default 우선 또는 단순 후보 선택 | 콘텐츠 적합도 점수 후 Default는 Tie-breaker로 사용 |
| Mobile Layout | Preset 존재 여부와 Geometry 적용 | 잘림·overflow·최소 글자 크기·safe area 검증 |
| Prompt 경고 | 빈 `warnings`, 빈 `summary` 허용 | 서버가 구조화된 진단과 품질 상태 생성 |
| Locale | Shell 첫 허용 Locale 또는 브라우저 Locale 사용 가능 | 자연어 입력에서 확정한 Locale을 전체 파이프라인 불변식으로 유지 |
| Preview 완료 | 구조·요청 자산 상태 중심 | 콘텐츠·자산·렌더·반응형 Gate 전체 통과 |

### 3.3 중복 개발 방지

- 기존 겹침 계산기를 제거하지 않고 범용 Geometry 진단기로 확장한다.
- 기존 Asset Polling을 유지하고 Expected Asset Coverage 검사를 앞단에 추가한다.
- 기존 Layout `selectionMetadata`를 재사용하며 별도 자유 좌표 생성기를 만들지 않는다.
- 기존 Design Token을 유지하고 품질 기준에 필요한 최소 토큰만 보완한다.

---

## 4. 문제 정의와 개선 항목

| ID | 우선순위 | 문제 | 확인된 원인 또는 계약 공백 | 목표 |
|---|---|---|---|---|
| QG-01 | P0 | Hero 제목·본문·CTA 충돌 | 콘텐츠 길이와 Layout 폭·글자 크기 연결 부족 | Desktop/Mobile 모두 충돌 0건 |
| QG-02 | P0 | 모바일 제목·이미지 잘림 | Mobile Geometry는 있어도 렌더 후 clipping 검사 없음 | 360px 이상에서 핵심 콘텐츠 잘림 0건 |
| QG-03 | P0 | 카드 이미지 Placeholder 노출 | 요청된 Asset만 Ready 판정, 필수 이미지 Coverage 미검증 | 필수 이미지 미완성 시 Preview 차단 |
| QG-04 | P0 | 과도한 빈 공간·Section 높이 | 실제 콘텐츠 높이와 Section minHeight 간 검증 부족 | 비정상 Dead Space 자동 탐지 |
| QG-05 | P0 | 제한적인 겹침 검사 | Text Item만 DOM Rect 검사 | 모든 Visible Item·Field 충돌 검사 |
| QG-06 | P0 | 입력 언어와 결과 언어 혼합 | Overview Locale과 Composition/Resource Locale 연결이 약함 | AI 작성 콘텐츠는 입력 언어와 일치 |
| QG-07 | P1 | 동일 카드 문구 반복 | 카드별 역할·혜택 Binding과 중복 검증 부족 | 카드별 핵심 메시지 고유성 확보 |
| QG-08 | P1 | 레이아웃이 매번 유사함 | Default-first 선택이 Metadata 의미를 압도 | Metadata 적합도 기반 Layout 선택 |
| QG-09 | P1 | 페이지 서사·시각 리듬 부족 | Required Section 나열 중심, 역할별 밀도 변화 없음 | Hero→Benefit→Trust→Terms 흐름 확보 |
| QG-10 | P1 | Planner/Runtime 계약 추적 어려움 | Planner Snapshot의 정렬·고정 위치 정보가 불완전 | Planner·Validator·Compiler 계약 일치 |
| QG-11 | P2 | 품질 실패 원인 관측 어려움 | Gate 결과·보정 횟수·Viewport별 진단 미저장 | 문서 Revision별 품질 보고서 저장 |

---

## 5. 목표 사용자 흐름

```text
자연어 요청
→ Overview 분석 + 입력 언어 확정
→ Registry 후보와 Required Section 해석
→ 콘텐츠 역할·고유성 계획
→ Layout Metadata 적합도 평가
→ 결정론적 Compile
→ Expected Asset Manifest 생성
→ 모든 필수 자산 생성 완료
→ Desktop Render QA
→ Mobile Render QA
→ 자동 보정 가능 시 최대 2회 Repair
→ 전체 Gate 통과
→ Live Preview
```

실패 흐름:

```text
Gate 실패
→ 자동 보정 가능 여부 판정
  ├─ 가능: 허용된 Preset 변경 또는 Geometry Reflow 후 재검사
  └─ 불가/재시도 초과: 품질 확인 필요 상태
→ 실패 항목과 다시 생성 버튼 표시
```

사용자에게는 내부 Section·Geometry 세부 계약을 노출하지 않는다. 다음과 같이 이해 가능한 상태만 표시한다.

- `페이지 구성을 최적화하고 있습니다.`
- `필요한 이미지를 생성하고 있습니다.`
- `데스크톱과 모바일 화면을 확인하고 있습니다.`
- `일부 요소의 배치를 보정하고 있습니다.`
- `자동으로 해결하지 못한 항목이 있습니다.`

---

## 6. 목표 아키텍처

```text
Overview + inputLocale
        │
        ▼
Candidate Resolver
        │ approved sections/layouts/components/resources
        ▼
Composition Planner
        │ semantic role + allowed layout selection
        ▼
Content/Layout Fit Scorer ──────┐
        │                       │ selectionMetadata
        ▼                       │ copy metrics / asset ratio
Deterministic Compiler          │
        │                       │
        ▼                       │
Expected Asset Manifest         │
        │ all required ready    │
        ▼                       │
Shared Renderer                 │
        │ desktop + mobile DOM  │
        ▼                       │
Rendered Quality Gate ◀────────┘
        │ pass / repair / fail
        ▼
Builder Document Quality Report
        │ pass only
        ▼
Live Preview / Web Output
```

### 책임 경계

| 계층 | 책임 | 금지 |
|---|---|---|
| LLM Planner | Section 역할, 후보 중 의미 선택, 콘텐츠 Binding | Raw CSS·좌표·임의 식별자 생성 |
| Fit Scorer | Copy·Asset·Metadata 적합도 계산 | 승인되지 않은 Layout 생성 |
| Compiler | Snapshot·Geometry·Token 결정론적 생성 | 품질 실패를 경고 없이 무시 |
| Asset Gate | 필수 자산 Coverage와 상태 판정 | 요청이 없다는 이유만으로 Ready 처리 |
| Render Gate | 실제 DOM 기반 Desktop/Mobile 품질 검사 | Text만 검사하고 전체 통과 처리 |
| Repair | 허용된 Preset 교체·Reflow·Section 높이 보정 | 무제한 반복·사용자 수동 배치 덮어쓰기 |
| Builder UI | 진행·실패·재시도 상태 표시 | 실패 결과를 완료 화면으로 표시 |

---

## 7. 품질 게이트 계약

### 7.1 상태 모델

```ts
type QualityGateState =
  | "pending"
  | "checking"
  | "repairing"
  | "passed"
  | "failed";

type QualitySeverity = "blocking" | "warning" | "info";
```

Builder Document Snapshot에 다음 구조를 추가한다.

```json
{
  "qualityGate": {
    "contractVersion": 1,
    "state": "passed",
    "attempt": 1,
    "maxAttempts": 2,
    "checkedAt": "2026-08-20T00:00:00.000Z",
    "viewports": {
      "desktop": { "width": 1440, "passed": true, "diagnostics": [] },
      "mobile": { "width": 390, "passed": true, "diagnostics": [] }
    },
    "metrics": {
      "requiredAssetCoverage": 1,
      "collisionCount": 0,
      "clippedItemCount": 0,
      "overflowItemCount": 0,
      "placeholderAssetCount": 0,
      "duplicateContentGroupCount": 0,
      "localeMismatchCount": 0
    },
    "diagnostics": []
  }
}
```

### 7.2 Blocking 진단 코드

| 코드 | 조건 | 기본 조치 |
|---|---|---|
| `REQUIRED_ASSET_MISSING` | 필수 Image Field에 URL/Ready Asset 없음 | Asset 요청 생성 또는 실패 |
| `ASSET_REQUEST_COVERAGE_MISMATCH` | Expected Asset과 Request 수·Target 불일치 | 요청 Manifest 재생성 |
| `ITEM_COLLISION` | Visible Item 또는 Field Rect가 겹침 | Reflow 또는 Layout 교체 |
| `ITEM_CLIPPED` | 콘텐츠가 Item/Section 경계에서 잘림 | Auto Height·Layout 교체 |
| `VIEWPORT_OVERFLOW` | 가로 Scroll 또는 Viewport 밖 배치 | Mobile Preset 교체 |
| `HERO_COPY_UNFIT` | 제목이 허용 줄 수·최소 크기 기준 초과 | Width Profile 변경·Copy 축약 요청 |
| `SECTION_DEAD_SPACE_EXCESS` | 콘텐츠 대비 Section 빈 영역이 기준 초과 | minHeight 재계산 |
| `REQUIRED_CONTENT_EMPTY` | 필수 Text/CTA가 비어 있음 | Binding/Content 재생성 |
| `PROMO_LOCALE_MISMATCH` | AI 작성 콘텐츠가 확정 Locale과 불일치 | 해당 Locale로 재생성 |
| `RENDER_QA_TIMEOUT` | Font/Image 안정화 또는 검사 시간 초과 | 재시도 후 실패 처리 |

### 7.3 Warning 진단 코드

| 코드 | 조건 | 처리 |
|---|---|---|
| `DUPLICATE_BENEFIT_CONTENT` | 복수 카드의 정규화 문구가 동일 | 1회 콘텐츠 Repair 후 남으면 Warning/정책에 따라 차단 |
| `CTA_LABEL_REPEATED` | 동일 CTA가 과도하게 반복 | Secondary CTA 또는 링크 역할 조정 |
| `LAYOUT_DIVERSITY_LOW` | 균형 테스트 코퍼스에서 특정 Preset 쏠림 | 운영 지표로 추적, 단일 페이지 차단 안 함 |
| `TERMS_VISUAL_WEIGHT_HIGH` | 약관이 본문보다 과도하게 긴 비율 | 접힘·요약 패턴 권고 |

### 7.4 Live Preview 승격 조건

다음을 모두 만족해야 한다.

1. Contract/Required Section 검증 통과
2. Expected Asset Coverage 100%
3. 모든 필수 Asset `ready`
4. Desktop Blocking 진단 0건
5. Mobile Blocking 진단 0건
6. 입력 Locale 불일치 0건
7. 자동 Repair 횟수 2회 이하
8. 최신 Document Revision과 Quality Report Revision 일치

Web Output도 같은 `qualityGate.state === "passed"`를 요구한다. Preview에서 사용자가 이후 편집해 품질 상태가 무효화되면 저장 시 다시 검사한다.

---

## 8. 상세 개발 계획

## 8.1 Phase 0 — 재현 Fixture와 관측성 기준선 (P0)

### 작업

1. 이번 운영 실패 결과를 익명화된 Test Fixture로 저장한다.
2. 짧은/긴 Hero, 1·3·6개 카드, 한글/영문, 이미지 성공/누락 조합을 만든다.
3. 현재 `겹침 확인` 결과와 실제 DOM 진단 차이를 기록한다.
4. Builder Document Revision별 품질 검사 Event를 정의한다.
5. 기존 계획 문서와 코드 구현 상태를 표로 관리한다.

### 대상

- `scripts/fixtures/ai-quality-gate/`
- `scripts/test-ai-live-preview-quality-gate.mjs` 신규
- `api/promo-builder-events.js`
- `api/_promo-builder-document-store.js`

### 완료 조건

- 운영에서 확인한 Hero 충돌, Placeholder 2개, Mobile 잘림이 자동 Test에서 실패로 재현된다.
- 현재 Text Collision 검사만으로는 통과되는 사례가 Fixture에서 증명된다.
- 이후 Phase의 모든 수정은 같은 Fixture로 회귀 검증할 수 있다.

## 8.2 Phase 1 — Expected Asset Readiness 강화 (P0)

### 현행 문제

`evaluateAssetReadiness([])`는 Ready를 반환한다. 이 규칙 자체는 자산이 필요 없는 페이지에는 맞지만, 빈 URL을 가진 필수 Image Field가 Asset Request에 포함되지 않은 경우까지 Ready로 처리할 수 있다.

### 작업

1. Compiler가 Section Background와 Component Image를 순회해 `expectedAssets` Manifest를 생성한다.
2. 다음 Image는 Required Asset으로 판정한다.
   - `fieldKind=image`이며 Component/Field가 Required
   - Layout에서 Visible이고 Placeholder가 허용되지 않음
   - Section AI Policy가 Key Visual을 Required로 지정
3. Existing URL, Resource Reference, Generated Asset 중 어떤 방식으로 충족됐는지 기록한다.
4. `expectedAssets`와 `assets.requests`를 Target Key로 대조한다.
5. 요청이 누락됐으면 Job을 자동 생성하고, 생성할 수 없으면 `REQUIRED_ASSET_MISSING`으로 실패한다.
6. Renderer의 `이미지 준비 중`은 편집 중 상태에서만 허용하고, Preview 승격 조건에서는 0건이어야 한다.
7. Asset Retry는 Expected Manifest Identity를 사용해 멱등성을 유지한다.

### 대상

- `api/_promo-registry-composition-compiler.js`
- `api/_promo-builder-assets.js`
- `api/_promo-builder-document-store.js`
- `visual-editor/src/shared/composition/asset-readiness.mjs`
- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/platform/adapters/ai-document-adapter.mjs`

### 완료 조건

- 필수 카드 이미지가 하나라도 비어 있으면 Live Preview가 열리지 않는다.
- 자산이 필요 없는 Text-only Section은 기존처럼 즉시 Ready가 가능하다.
- Expected 3개/Request 1개 같은 불일치를 자동으로 탐지한다.
- 실패·재시도 후 중복 Asset Job이 생성되지 않는다.

## 8.3 Phase 2 — 범용 Render Quality Gate (P0)

### 작업

1. `.rendered-item--text` 한정 검사를 모든 Visible `.rendered-item[data-style-key]`로 확장한다.
2. 복합 Component의 Image, Text, CTA Field Rect를 수집한다.
3. 다음 항목을 Desktop/Mobile 독립적으로 검사한다.
   - Item–Item Collision
   - Field–Field Collision
   - Section 경계 Clipping
   - Viewport 가로 Overflow
   - Text `scrollHeight > clientHeight`
   - Image Frame과 실제 이미지의 비정상 Crop
   - Section 콘텐츠 하단과 minHeight 불일치
   - 연속 Section 사이의 과도한 공백
4. Font Ready, Image Decode, ResizeObserver 안정화 후 검사한다.
5. `겹침 확인` UI 문구를 `레이아웃 품질 확인`으로 확장하고 진단 유형별 개수를 표시한다.
6. 검사 결과는 문서에 저장하되 수동 검사 버튼은 Read-only로 유지한다.

### 대상

- `visual-editor/src/PromoPageRenderer.vue`
- `visual-editor/src/platform/editor-ui/PreviewPanel.vue`
- `visual-editor/src/App.vue`
- `visual-editor/src/multi-layout.mjs`
- `api/_promo-layout-text-collision.js` 또는 범용 모듈로 승격
- `api/_promo-render-quality-contract.js` 신규

### 완료 조건

- 이번 운영 Hero 문제와 Mobile 잘림이 Blocking 진단으로 잡힌다.
- Image·CTA·Composite Card 충돌도 검출된다.
- Text 충돌이 없어도 Clipping이나 Dead Space가 있으면 통과하지 않는다.
- 같은 Snapshot의 Desktop/Mobile 결과가 각각 저장된다.

## 8.4 Phase 3 — Content–Layout Fit Scoring과 자동 Repair (P0/P1)

### Layout 선택 점수

관리자 `selectionMetadata`를 다음 입력과 매칭한다.

| 입력 | 사용하는 Metadata |
|---|---|
| 제목·본문 길이와 예상 줄 수 | `widthProfile`, `density` |
| CTA 수와 길이 | `contentRegion`, `density` |
| 키비주얼 위치와 비율 | `visualBalance`, `contentRegion` |
| Section 역할 | `purposeTags` |
| 정렬 의도 | `alignment` |
| 운영 선호도 | `selectionWeight` |
| 연속 Section 반복 방지 | `avoidImmediateRepeat` |

### 결정 규칙

```text
정책으로 잠긴 Layout
→ 잠긴 Layout 사용 후 Fit Gate 실패 시 설정 오류로 Fail

잠기지 않은 Layout
→ Metadata Fit Score 내림차순
→ isDefault
→ selectionWeight
→ layoutKey Stable Sort
```

### 자동 Repair 순서

1. 같은 Section의 더 적합한 Width Profile로 교체
2. Auto Height와 Section minHeight 재계산
3. Collision Reflow 적용
4. Mobile 전용 Layout Override 적용
5. 여전히 실패하면 Content Repair 요청
6. 최대 2회 후 실패 상태

### 금지

- LLM이 Raw 좌표나 CSS를 생성하지 않는다.
- 글자 크기를 무제한 축소하지 않는다.
- 이미지 크롭으로 주요 피사체를 임의 제거하지 않는다.
- 잠긴 관리자 Layout을 조용히 다른 Layout으로 교체하지 않는다.

### 대상

- `api/_wizard-content-section-layouts-store.js`
- `api/_promo-registry-composition-candidates.js`
- `api/_promo-layout-preset-policy.js`
- `api/_promo-registry-composition-contract.js`
- `api/_promo-registry-composition-compiler.js`
- `api/_promo-layout-fit-score.js` 신규
- 다음 번호 Migration의 `promo_page_composer` Draft Prompt Version

### 완료 조건

- Default Layout은 무조건 선택되는 값이 아니라 동점 처리 기준이 된다.
- 긴 한글 Hero와 짧은 영문 Hero가 서로 다른 적합 Preset을 선택할 수 있다.
- Repair가 같은 입력에서 동일한 결과를 내며 2회를 초과하지 않는다.
- Layout Metadata가 없는 Legacy 후보는 명시된 안전 Fallback만 사용한다.

## 8.5 Phase 4 — 입력 언어 불변식과 콘텐츠 고유성 (P0/P1)

### 입력 언어

1. 자연어 요청에서 감지한 Locale을 `overview.inputLocale` 또는 동등한 Canonical Field로 저장한다.
2. 다음 우선순위를 고정한다.

```text
사용자가 명시한 출력 Locale
> 자연어 입력에서 감지한 Locale
> Overview에 저장된 Locale
> Shell 허용 Locale 중 일치값
> 서비스 기본 Locale
```

3. `allowedLocales[0]`를 그대로 Composition Locale로 사용하는 경로를 제거한다.
4. Composer, Content Resource Resolver, Section/Component Image Prompt에 같은 Locale을 전달한다.
5. Legal 원문이 특정 언어로 고정돼야 하면 AI 콘텐츠와 구분하고, 해당 Locale의 요약 또는 라벨을 제공한다.
6. 필요한 Locale Resource가 없으면 다른 언어를 조용히 혼합하지 않고 `PROMO_LOCALE_RESOURCE_MISSING`으로 실패한다.

### 콘텐츠 고유성

1. 반복 카드마다 `contentRole`을 부여한다. 예: Welcome Bonus, Fast Start, Trust/Security.
2. 정규화된 제목·설명·CTA의 Exact Duplicate를 검사한다.
3. 카드별 숫자·혜택을 임의로 발명하지 않고 Overview의 확정 데이터만 사용한다.
4. 확정 데이터가 부족하면 카드 수를 줄이거나 Generic Feature 역할로 전환한다.
5. Hero·Benefit·Trust·Terms가 같은 설명을 반복하지 않도록 Section Role별 Binding 규칙을 둔다.

### 대상

- `api/_promo-overview-contract.js`
- `api/promo-overview-parse.js`
- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/builder/services/composition-client.mjs`
- `api/_promo-registry-composition-candidates.js`
- `api/_promo-registry-composition-contract.js`
- Content Resource Resolver 관련 모듈
- Prompt Version과 Locale Seed/Migration

### 완료 조건

- 한글 입력은 AI 작성 Hero·Card·CTA·약관 요약이 한글로 생성된다.
- 영어 입력은 동일 경로에서 영어 결과를 만든다.
- 법정 원문 고정 언어는 별도 라벨과 구조로 구분된다.
- 동일 카드 설명 3회 반복이 품질 Gate에서 발견된다.

## 8.6 Phase 5 — Section·Preset 디자인 시스템 보강 (P1)

### Hero Preset 최소 세트

- `media-right / compact-copy`
- `media-right / balanced-copy`
- `center / wide-copy`
- 각 Preset에 Desktop/Mobile Geometry, 이미지 Crop, 안전 영역을 저장한다.

### Benefit Preset 최소 세트

- 3열 카드 / Desktop → 1열 Stack / Mobile
- 이미지형 카드와 아이콘/텍스트형 카드 구분
- 카드 내부 Title·Description·CTA의 최소/최대 영역 정의
- 카드 개수 1·2·3·4·6에 대한 허용 Layout 정의

### Terms Preset

- 요약 + 전문 링크
- Accordion 또는 접힘 영역을 사용할 경우 키보드·스크린리더 상태 제공
- 법정 원문과 프로모션 요약의 시각적 위계 분리

### Token 보완

- Section 최대 콘텐츠 폭
- Desktop/Mobile Section vertical spacing
- Heading size/line-height 최소·최대
- Body/Legal text 최소 크기
- Card gap, radius, border/elevation
- Image frame aspect ratio와 object-position
- Primary/Secondary CTA 스타일

### 완료 조건

- 동일한 어두운 배경과 빨간 CTA만 반복되는 단조로움이 줄어든다.
- Section 역할에 따라 밀도와 시각적 무게가 달라진다.
- 모든 신규 Preset은 1440/1024/390/360 Viewport Test를 통과한다.

## 8.7 Phase 6 — 운영 Rollout과 품질 지표 (P1/P2)

### Feature Flag

- `aiRenderQualityGate`
- `aiExpectedAssetCoverage`
- `aiLayoutFitScoring`
- `aiLocaleInvariant`

### 배포 순서

1. **Shadow Mode**: 기존 결과를 차단하지 않고 진단만 저장
2. **Warning Mode**: 운영자에게 실패 항목 표시, Web Output 경고
3. **Blocking 10%**: 신규 AI 문서 일부에 P0 Gate 적용
4. **Blocking 50%**: 오류율·생성시간·재시도율 확인
5. **Blocking 100%**: Live Preview와 Web Output 모두 적용

### 운영 지표

- 첫 시도 Quality Gate 통과율
- 자동 Repair 후 통과율
- 평균 Repair 횟수
- Asset Coverage 실패율
- Desktop/Mobile Collision·Clipping 발생률
- Placeholder 노출률
- 입력 Locale 불일치율
- AI 생성 시작부터 Preview까지 P50/P95 시간
- 사용자가 Preview 진입 후 5분 내 수정한 Layout 항목 수
- Web Output 전 수동 `겹침 보정` 사용률

### 완료 조건

- P0 Blocking 진단이 있는 Revision은 Live Preview/Web Output으로 승격되지 않는다.
- Gate 추가 전후 생성 시간과 실패율을 Dashboard에서 비교할 수 있다.
- Rollback 시 문서 Snapshot과 기존 편집 기능이 손상되지 않는다.

---

## 9. Planner·Runtime 계약 정합성 개선

`plannerRegistryCandidateSnapshot()`과 Compiler가 사용하는 Section 정보를 동일한 DTO 계약으로 정리한다.

Planner에 필요한 최소 필드:

- `sectionVersionId`
- `sectionKey`
- `sectionRole`
- `resolvedRequired`
- `fixedPosition`
- `sortOrder`
- `compositionPolicy`
- `defaultLayoutKey`
- `allowedLayoutKeys`
- `layoutSelectionLocked`
- `layoutPresets[].selectionMetadata`
- `components[].capabilities`
- `components[].fields`
- `resourceReferences`

원칙:

- Planner가 보존하라고 요구받는 값은 Snapshot에 반드시 존재해야 한다.
- Planner가 결정하지 않는 `sortOrder`라면 Prompt에서 보존 지시를 제거하고 서버가 단독 소유한다.
- Required·Fixed·Shared Section의 최종 순서는 서버 불변식으로 검증한다.
- LLM 응답의 `warnings/summary`를 품질 판정 Source of Truth로 사용하지 않는다. 품질 진단은 서버·Renderer가 생성한다.

---

## 10. Prompt 변경 원칙

Prompt 변경은 소스에 하드코딩하지 않고 `설정 > LLM 및 프롬프트 관리`의 새 Draft Version으로 관리한다.

### Composer Prompt 변경

기존의 안정성 원칙은 유지한다.

- 승인된 후보만 사용
- Raw HTML/CSS/좌표 금지
- Required Section 강제
- 잠긴 Layout·Content 존중

다음 규칙은 변경한다.

- `defaultLayoutKey` 무조건 우선 → Metadata Fit Score 결과를 따름
- 시각 품질 판단 전면 금지 → 의미 선택에 필요한 승인된 Metadata 사용 허용
- `warnings=[]`, `summary=""` 강제 → LLM 진단은 참고용으로 허용하되 서버 품질 Gate와 분리
- 입력 Locale을 AI 작성 콘텐츠의 출력 Locale로 강제
- 반복 Component에는 서로 다른 `contentRole` 또는 Binding Source 요구

Prompt 활성화 절차:

```text
Draft 생성
→ Schema Validation
→ Golden Input Test
→ Contract v2/v3 분리 검증
→ Shadow 실행 비교
→ 관리자 승인
→ Active 전환
```

---

## 11. 테스트 계획

## 11.1 Unit Test

- Expected Asset Manifest 생성
- Empty Requests와 No-required-assets 구분
- Asset Coverage mismatch
- Locale 우선순위와 Script 감지
- Copy length/line estimate
- Layout Fit Score Stable Sort
- Duplicate Content Normalization
- Collision·Clipping·Dead Space 계산
- Repair Attempt Limit

## 11.2 Contract Test

- Planner Snapshot과 Prompt 요구 필드 일치
- Quality Gate Snapshot Schema
- Builder Document Revision과 Quality Revision 일치
- Required Section/Fixed Position 불변식 유지
- Prompt v2/v3 Output Schema 호환
- Web Output의 `qualityGate=passed` 요구

## 11.3 Integration Test

| 사례 | 기대 결과 |
|---|---|
| 짧은 한글 Hero + 이미지 1개 | 첫 시도 통과 |
| 긴 한글 Hero + compact preset | balanced/wide preset으로 Repair |
| 카드 이미지 Expected 3 / Request 1 | Preview 차단 후 누락 Request 생성 |
| 이미지 1개 failed | 실패 UI와 Retry 제공 |
| 동일 카드 문구 3개 | Duplicate 진단 및 Content Repair |
| 영문 T&C + 한글 입력 | Locale Resource 실패 또는 한글 요약 적용 |
| Mobile x overflow | Mobile Layout Repair 후 재검사 |
| 잠긴 Layout이 계속 실패 | 설정 오류로 Fail-closed |

## 11.4 Browser E2E

Viewport:

- Desktop: 1440×1000, 1024×900
- Mobile: 390×844, 360×800

검증:

1. AI 자연어 입력부터 Live Preview까지 전체 흐름
2. 생성 중 Placeholder가 Preview에 노출되지 않음
3. Hero 제목·본문·CTA·이미지 충돌 없음
4. 가로 Scroll 없음
5. Terms까지 Page Scroll 흐름 정상
6. 입력 언어와 결과 언어 일치
7. Quality Gate 실패 시 Preview 이동 차단
8. Retry 성공 후 자동 이동
9. 저장 후 새로고침에도 `passed` 상태 유지
10. 편집 후 Layout 변경 시 품질 상태 무효화와 재검사

## 11.5 접근성 Test

- Progress 상태의 `aria-live`, `aria-busy`
- 실패 목록과 Retry 버튼의 키보드 접근
- Mobile 최소 본문/약관 글자 크기
- Design Token 조합의 WCAG AA 대비
- Accordion Terms의 이름·상태·키보드 동작
- DOM 읽기 순서와 시각적 Section 순서 일치
- `prefers-reduced-motion`에서 Repair/Progress Motion 축소

## 11.6 Golden Corpus

최소 100개 입력을 운영 전 자동 생성 검증에 사용한다.

- Locale: ko 40, en 30, ja/zh/기타 30
- Copy: short/medium/long 균등
- Section: Hero only, Hero+Cards, Hero+Cards+Trust+Terms
- Asset: all ready, delayed, missing, failed
- Card count: 1, 2, 3, 4, 6
- Market/Legal Resource 조합 포함

---

## 12. 정량 완료 기준

### P0 Release Gate

- Blocking Collision: 0건
- Clipped Required Item: 0건
- Viewport 가로 Overflow: 0건
- Required Asset Coverage: 100%
- Placeholder Asset: 0건
- Input Locale mismatch: 0건
- 자동 Repair: 최대 2회
- Quality Report와 Document Revision 불일치: 0건
- 1440/1024/390/360 E2E 통과율: 100%

### P1 품질 목표

- 동일 카드 설명 Exact Duplicate: 0건
- Hero 제목 권장 줄 수:
  - Desktop: 최대 3줄
  - Mobile: 최대 4줄
- 본문 최소 크기: Mobile 16px 권장, Legal 14px 미만 금지
- 긴 콘텐츠 때문에 최소 글자 크기 아래로 축소하지 않음
- 균형 Golden Corpus에서 잠기지 않은 Hero가 하나의 Preset에 70% 이상 몰리지 않음
- 첫 시도 Gate 통과율과 Repair 후 통과율을 각각 추적

성능 수치는 Shadow Mode에서 기준선을 확보한 뒤 확정한다. 품질 때문에 필요한 검사를 생략하는 대신, 검사 병렬화와 Snapshot 재사용으로 P95를 최적화한다.

---

## 13. 예상 변경 파일

### Frontend

- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/builder/CompositionProgress.vue`
- `visual-editor/src/shared/composition/asset-readiness.mjs`
- `visual-editor/src/PromoPageRenderer.vue`
- `visual-editor/src/App.vue`
- `visual-editor/src/platform/editor-ui/PreviewPanel.vue`
- `visual-editor/src/platform/adapters/ai-document-adapter.mjs`
- `visual-editor/src/multi-layout.mjs`
- Locale message JSON/seed

### API·Domain

- `api/_promo-registry-composition-candidates.js`
- `api/_promo-registry-composition-contract.js`
- `api/_promo-registry-composition-compiler.js`
- `api/_promo-layout-preset-policy.js`
- `api/_promo-layout-text-collision.js`
- `api/_promo-builder-assets.js`
- `api/_promo-builder-document-store.js`
- `api/_promo-overview-contract.js`
- `api/promo-overview-parse.js`
- `api/promo-builder-documents.js`
- `api/promo-builder-events.js`
- `api/_promo-render-quality-contract.js` 신규
- `api/_promo-layout-fit-score.js` 신규
- `api/_promo-composition-quality-gate.js` 신규

### DB·Prompt

- 다음 번호 Migration: Quality Gate Snapshot/Event/Prompt Version/필요 Metadata
- `promo_page_composer` Draft Prompt Version
- Layout Preset Metadata 보정
- Locale Resource Audit·보정 Migration

### Test

- `scripts/test-ai-live-preview-quality-gate.mjs` 신규
- `scripts/test-ai-builder-asset-readiness.mjs`
- `scripts/test-ai-builder-browser.mjs`
- `scripts/test-promo-registry-composition-compiler.js`
- `scripts/test-promo-registry-composition-contract-v3.js`
- `scripts/test-promo-layout-text-collision.js`
- `scripts/test-registry-hero-layout-metadata-migration.js`
- Golden Corpus Runner 신규

---

## 14. 개발 순서와 예상 일정

일정은 1개 개발 스트림 기준의 상대 추정이며, 운영 DB Migration 승인과 Provider 실행 시간은 제외한다.

| 순서 | 범위 | 예상 | 배포 조건 |
|---|---|---:|---|
| 1 | Phase 0 재현 Fixture·진단 계약 | 1–2일 | 현재 실패 자동 재현 |
| 2 | Phase 1 Expected Asset Coverage | 3–4일 | Placeholder P0 Test 통과 |
| 3 | Phase 2 범용 Render Gate | 4–6일 | Desktop/Mobile P0 Test 통과 |
| 4 | Phase 3 Fit Scoring·Repair | 4–6일 | Stable·Bounded Repair 검증 |
| 5 | Phase 4 Locale·Content 고유성 | 3–5일 | ko/en E2E와 중복 Test 통과 |
| 6 | Phase 5 Preset·Token 보강 | 5–8일 | 전체 Viewport QA 통과 |
| 7 | Phase 6 Shadow→Blocking Rollout | 5–10일 | 운영 지표와 Rollback 검증 |

권장 총 범위: 약 4–6주.  
P0 최소 출시 범위는 Phase 0–4이며, Phase 5의 최소 Hero/Card/Mobile Preset 보강도 P0 결과가 계속 실패한다면 같은 Release에 포함한다.

---

## 15. 위험과 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| Gate가 너무 엄격해 생성 실패 증가 | Preview 도달률 하락 | Shadow Mode로 임계값 수집 후 Blocking 전환 |
| 자동 Repair 무한 반복 | 비용·시간 증가 | 최대 2회, Revision+Input Hash로 멱등성 보장 |
| 이미지 Provider 지연 | 생성 시간 증가 | Asset 단계와 Render Gate 분리, 실패 원인 명확화 |
| DOM 측정 결과가 환경마다 다름 | 비결정적 Test | Font/Viewport/Token 고정, 허용 오차 정의 |
| 관리자 잠금 Layout이 품질 실패 | 자동 해결 불가 | 설정 오류로 Fail-closed, 관리자 진단 제공 |
| Locale Resource 부족 | 다른 언어 혼합 | Fallback 금지, Resource Missing으로 명시적 실패 |
| 기존 문서 회귀 | 편집 결과 변경 | 신규 AI Revision부터 Gate 적용, 기존 문서는 수동 검사 |
| 품질 검사로 P95 증가 | UX 저하 | Desktop/Mobile 검사 병렬화, 동일 Snapshot 캐시 |

---

## 16. 제외 범위

- AI의 자유 HTML/CSS 생성
- 런타임에서 신규 Component 정의 생성
- 전체 Visual Editor 재설계
- Template Mode의 전면 재작성
- 기존 저장 문서 일괄 자동 보정
- 운영 게시/배포 기능 자체의 변경
- 법무 승인 없이 T&C 원문을 AI가 번역·변경하는 기능
- Vision Model을 유일한 Blocking 판정기로 사용하는 방식

Vision Model 기반 시각 평가는 P2 Advisory 기능으로 검토할 수 있지만, P0 Gate는 재현 가능한 DOM·Contract·Asset 검사로 구성한다.

---

## 17. 최종 완료 정의

다음 조건을 모두 만족하면 본 계획을 완료로 본다.

1. AI Mode가 필수 이미지 Placeholder를 포함한 결과를 Live Preview로 열지 않는다.
2. Hero·Card·CTA·Image의 충돌과 잘림을 Desktop/Mobile에서 자동 검출한다.
3. 입력 언어가 Composer와 Content Resource까지 일관되게 전달된다.
4. Layout Preset은 Default-first가 아니라 콘텐츠 적합도 중심으로 선택된다.
5. 자동 Repair는 허용된 Preset·Geometry 범위에서 최대 2회만 실행된다.
6. P0 실패 결과는 `품질 확인 필요` 상태로 중단되고 이해 가능한 원인을 제공한다.
7. 같은 품질 상태가 Live Preview와 Web Output 모두에 적용된다.
8. Golden Corpus와 실제 Browser E2E가 정량 완료 기준을 통과한다.
9. Document Revision별 품질 보고서와 운영 지표가 저장된다.
10. 기존 Contract v3의 보안·정책·관리자 승인 경계를 유지한다.

이 계획의 최우선 목표는 “더 화려한 결과”가 아니라 **깨진 결과가 성공으로 보이지 않게 만드는 것**이다. 그 기반이 확보된 뒤 Layout 다양성과 시각 시스템을 확장해야 품질 향상이 안정적으로 누적된다.

---

## 18. 2026-08-21 P0 1차 구현 결과

### 18.1 완료

- 반복 Collection 이미지가 `card#2`, `card#3`처럼 생성된 키 때문에 AI 대상에서 누락되던 문제를 수정했다.
- Compiler가 생성해야 하는 이미지 목록을 `assets.expected`에 저장한다.
- Builder Asset Readiness가 `assets.expected`와 `assets.requests` Coverage를 비교하고 누락 요청을 실패로 처리한다.
- 자연어 입력에서 감지한 `inputLocale`을 Overview 응답에서 Builder로 전달한다.
- Shell의 첫 Locale을 무조건 선택하지 않고 입력 언어와 같은 Primary Language의 허용 Locale을 선택한다.
- 기존 Text-only 겹침 검사를 모든 Visible Item으로 확대했다.
- `품질 확인`에서 겹침, 잘림, 내용 넘침, 미완성 이미지, 과도한 Section 공백을 구분해 표시한다.
- Visual Editor Production Bundle을 재생성했다.

### 18.2 추가된 회귀 검증

- 반복 Component 3개 × 반복 Section 2개에서 이미지 요청 6개 생성
- Expected Asset 2개/Request 1개 Coverage 실패
- `ko` 입력과 `en-US, ko-KR` Shell에서 `ko-KR` 선택
- 범용 Render Quality 진단 코드와 Renderer 공개 계약
- AI Builder 전체 Browser Flow에서 입력 Locale과 Asset Ready 전환 검증

검증 결과:

```text
Visual Editor build: passed
AI Builder browser test: passed
전체 자동 테스트: 136 files passed
```

테스트 실행 환경은 번들 Runtime의 Node 24.19.0이었으며 프로젝트 선언은 Node 22.x다. Build와 전체 테스트는 통과했지만 Release CI에서는 Node 22.x 기준 검증을 한 번 더 수행한다.

### 18.3 후속 범위

다음 항목은 이번 1차 구현에 포함되지 않았다.

- Render Quality 결과를 문서 Revision에 저장하고 Live Preview 진입을 자동 차단하는 서버 Gate
- Desktop 1440/1024와 Mobile 390/360을 생성 과정에서 자동으로 모두 렌더하는 Harness
- Layout `selectionMetadata` 기반 Fit Scoring과 최대 2회 자동 Repair
- 카드 콘텐츠 역할 분리와 중복 문구 Repair
- Terms Locale Resource 부족 시 Fail-closed 처리
- Shadow Mode부터 Blocking 100%까지의 운영 Rollout

후속 개발은 Phase 2의 자동 승격 Gate를 먼저 완성한 뒤 Phase 3 Layout Fit Scoring으로 진행한다.

---

## 19. 2026-08-21 P0 2차 구현 결과

### 19.1 완료

- AI 문서의 Content·Asset 로딩이 끝나고 실제 Preview DOM이 렌더된 직후 자동 품질 검사를 실행한다.
- Desktop과 Mobile Viewport를 순차 렌더하고 Font·Image Decode·Layout Frame 안정화 이후 동일한 품질 계약으로 검사한다.
- 겹침, 컴포넌트 잘림, 내용 넘침, 필수 이미지 Placeholder를 `Blocking`으로 분류한다.
- 과도한 Section 공백은 현재 오탐 가능성을 고려해 `Warning`으로 분리했다.
- `assets.expected`가 있는 문서는 모든 빈 이미지 슬롯이 아니라 필수 생성 대상으로 선언된 이미지 Placeholder만 차단한다.
- Blocking 상태에서는 Preview 직접 편집, AI 문서 저장, Web Output 열기를 비활성화한다.
- 차단 카드에서 Desktop/Mobile 문제 건수와 해결 안내를 표시하고 `다시 검사`를 제공한다.
- 저장 시점에도 품질 검사를 다시 실행해 초기 검사 후 변경으로 생긴 문제를 저장하지 않는다.
- 검사 통과 후 사용자가 보고 있던 원래 Viewport로 복원한다.

### 19.2 Browser E2E

`scripts/test-ai-document-quality-gate-browser.mjs`를 추가했다.

- 필수 Component Image 요청은 `ready`지만 실제 Content 값이 비어 있는 손상 Snapshot을 로드한다.
- Desktop과 Mobile 모두 Blocking 결과가 생성되는지 확인한다.
- `PREVIEW QUALITY BLOCKED` 안내와 `다시 검사`가 표시되는지 확인한다.
- AI 문서 저장과 Web Output 버튼이 비활성화되는지 확인한다.
- 재검사 후에도 문제가 남아 있으면 차단 상태가 유지되는지 확인한다.
- 차단 중 Document PATCH 요청이 한 번도 발생하지 않는지 확인한다.
- 빈 화면, Vite Error Overlay, Page Error가 없는지 확인한다.

검증 결과:

```text
AI document quality gate browser test: passed
Visual Editor production build: passed
전체 자동 테스트: 137 files passed
```

테스트 실행 환경은 번들 Runtime의 Node 24.19.0이며 프로젝트 선언은 Node 22.x다. Release CI에서는 Node 22.x 기준 검증을 추가 수행한다.

### 19.3 남은 후속 범위

- 품질 결과와 Diagnostic을 서버 Document Revision에 저장하는 Gate Snapshot
- 1440/1024/390/360 고정 폭별 Render Harness와 Golden Corpus
- 문제 Component로 이동하는 Diagnostic 상세 UI
- 허용된 Geometry 범위 안에서 최대 2회 수행하는 자동 Repair
- Layout Fit Scoring과 Preset 재선택
- Locale Resource Fail-closed와 중복 문구 Repair
- Shadow Mode 운영 지표와 단계별 Blocking Rollout

현재 단계에서 깨진 AI 결과는 Live Preview에 성공 상태로 노출되거나 저장·Web Output으로 진행되지 않는다. 다음 개발 우선순위는 서버 Revision 품질 보고서 저장과 제한된 자동 Repair다.

### 19.4 2026-08-21 디버깅 보정

- 품질 검사 중 Preview 편집을 잠그면 Renderer에서 `is-editor-preview`가 빠지고 출력용 `min-width` 규칙이 활성화됐다.
- 이 규칙이 Mobile Preview의 375px 폭보다 우선해 Mobile 반응형 데이터가 약 840px Desktop 캔버스에서 검사되는 문제를 수정했다.
- Mobile Preview selector의 우선순위를 높이고 `min-width: 0`을 적용해 실제 375px 프레임에서 검사되도록 고정했다.
- 좁은 Preview 툴바에서 비활성 디자인 토큰 Select가 AI 문서 저장 버튼 위에 겹쳐 포인터 이벤트를 가로채는 문제를 수정했다.
- Preview Controls를 가변 폭·Wrap 레이아웃으로 변경해 저장, Web Output, Guide, Viewport Control이 서로 겹치지 않도록 했다.
- Browser E2E에 손상 문서 차단 경로와 정상 이미지 문서의 Desktop/Mobile 통과·Revision 저장 경로를 모두 포함했다.

검증 결과는 Visual Editor Production Build 및 전체 137개 Test File 통과다.

---

## 20. 2026-08-23 서버 Revision Gate 구현 결과

### 20.1 완료

- Visual Editor가 Desktop·Mobile Blocking 0건인 품질 결과를 저장 요청에 포함한다.
- 서버는 두 Viewport 결과와 Blocking 0건을 다시 검증하고 다음 `documentRevision`에 결합된 `qualityGate.state=passed` 보고서로 정규화한다.
- Composition Apply, 자연어 Operation, Rollback은 기존 품질 보고서를 재사용하지 않고 새 Revision의 `pending` 상태로 무효화한다.
- AI Web Output은 `requireQualityGate=1`과 요청 Revision을 사용해 현재 Revision의 통과 상태를 서버에서 확인한다.
- HTML/Vue/React Export API는 Contract v3 문서의 현재 Revision 품질 게이트가 없거나 실패한 경우 `QUALITY_GATE_REQUIRED`로 차단한다.
- 필수 Asset 실패 시 제공하던 `이미지 없이 편집 계속` 버튼을 제거해 Asset Readiness 정책과 실제 Preview 동작을 일치시켰다.
- Contract v3 최초 생성 자동 Apply는 서버의 `autoApplicable=true`를 프런트에서 명시적으로 확인한다.

### 20.2 남은 후속 범위

- 1440/1024/390/360 고정 폭 Render Harness와 Golden Corpus
- 허용 Geometry 범위 내 최대 2회 자동 Repair
- Layout Fit Scoring과 Preset 자동 재선택
- Locale Resource Fail-closed와 중복 문구 Repair
- Node 22.x Release CI 증거 확보

---

## 21. 2026-08-23 Hero Layout 후보 반영 보정

### 21.1 구현

- 활성 `registryHero`의 Version 번호와 무관하게 세 가지 시스템 Layout 후보를 보장하는 Migration을 추가했다.
- 기존 관리자 Layout Geometry는 덮어쓰지 않고, 누락된 Layout과 Selection Metadata 및 AI Allowlist만 보정한다.
- 제목·본문의 시각 길이, 콘텐츠 복잡도, 목적 Tag, Mobile 전략, CTA 강조도와 관리자 선택 가중치를 이용하는 Layout Fit Scoring을 추가했다.
- Candidate Snapshot에 `recommendedLayoutKey`, Layout별 `fitScore`, `fitReasons`를 포함한다.
- `layoutLocked=false`인 Section에서 Planner가 Default Layout에 고착되고 추천 후보의 점수가 유의미하게 높은 경우에만 제한적으로 Layout을 재선택한다.
- `layoutLocked=true`인 Section과 Metadata 정보가 부족한 Layout에는 자동 재선택을 적용하지 않는다.
- 자동 재선택의 Section Version, 변경 전·후 Layout Key와 점수 차이를 `compositionMeta.layoutFitRepairs`에 저장하고 최종 문서까지 전달한다.
- Live Preview 상단에 현재 선택 Layout을 표시하고, 현재 Layout이 자동 보정 결과와 일치할 때만 변경 전·후 Key와 점수 차이를 표시한다.

### 21.2 선택 안전장치

- 저장된 Layout 전체를 자동 허용하지 않고 `aiDesign.allowedLayoutVariants`를 계속 권위 Allowlist로 유지한다.
- 시스템 Hero의 알려진 세 후보만 Migration에서 Allowlist에 추가한다.
- 기존 사용자 Geometry와 `layoutLocked` 정책은 보존한다.
- 일반 AI 선택은 유지하고, Default 고착 또는 큰 점수 차이가 확인될 때만 서버 Repair를 적용한다.

### 21.3 검증 기준

- 짧은 카피 → Compact/short-copy 후보
- 일반 프로모션 카피 → Balanced 후보
- 긴 브랜드 헤드라인 → Center Wide 후보
- 긴 설명과 CTA → Right 후보
- Layout 잠금 시 자동 변경 없음
- 활성 Hero Version 2 이상에도 세 후보 및 Allowlist 동기화
- 세 Hero 후보를 Desktop·Mobile 실제 Renderer에서 열어 위치·폭·정렬 차이를 검증하는 브라우저 회귀 테스트

---

## 22. 2026-08-23 Typography Role Scale 현대화

### 22.1 앱 UI

- 앱 UI의 읽을 수 있는 최소 크기를 12px로 통일하고 `xs`, `small`, `control`, `body`, `heading`, `title`, `page-title` 역할을 명시한다.
- 9–11px 직접 지정값을 `--app-font-size-*` 토큰으로 전환한다.
- Caption, Control, Body, Heading, Title에 대응하는 Line Height 토큰을 추가한다.

### 22.2 프로모션 출력

- `main-title`, `lead-title`, `subtitle`의 고정 px 값을 `clamp()` 기반 반응형 값으로 전환한다.
- `eyebrow`, `body`, `caption`, `micro`, `button` 역할 토큰을 추가한다.
- `eyebrow/kicker/overline`, `lead/intro`, `subtitle`, `description/body/copy`, `cta`를 각각 다른 Typography 역할로 매핑한다.
- 기존 Builder Document Snapshot은 유지하고 신규 Composition부터 현대화된 기본 Token Set 값을 사용한다.

### 22.3 검증 기준

- 제품 UI CSS의 반복 Font Size는 앱 토큰을 사용한다.
- 일반 본문과 Description은 16px 프로모션 본문 역할을 사용한다.
- Eyebrow가 40px Lead Title로 확대되지 않는다.
- Hero Display가 Mobile과 Desktop 사이에서 40–68px 범위로 유동 조절된다.
- 생성 화면 Browser Smoke, Typography 역할 Unit Test, 전체 회귀 Test를 통과한다.
