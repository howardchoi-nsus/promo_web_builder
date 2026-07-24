# 관리자·프로모션 빌더 레이아웃 편집기 통합 개발계획서

## 0. 문서 정보

- 작성일: 2026-07-24
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 검토 완료 · 구현 전
- 개발 범위: P0~P3
- 대상 화면:
  - 설정의 템플릿 레이아웃 편집기
  - 프로모션 빌더의 Live Preview 편집기
- 관련 문서:
  - `docs/계획/create-promo-admin-layout-reflection-fix-development-plan-2026-07-20.md`
  - `docs/계획/promo-builder-ai-design-and-component-development-plan-2026-07-23.md`
  - `docs/설계/admin-page-terminology-dictionary-2026-07-22.md`

### 구현 상태 — 2026-07-24

- P0: Layout Identity 응답, 활성 템플릿 선택, Snapshot revision 보호, 초안 저장 및 저장 후 활성화 흐름 반영
- P1: Editor Context/Capability 기반 공통 3단 Workspace 반영
- P2: 섹션 속성을 왼쪽 섹션 아코디언으로 이동하고 오른쪽 중복 제거
- P3: Unit·계약·브라우저 통합 테스트 보강 및 Visual Editor 프로덕션 빌드 완료
- 로컬 검증:
  - 전체 테스트 스위트 48개 통과
  - 관리자 레이아웃 → 프로모션 빌더 브라우저 통합 테스트 통과
  - Visual Editor 프로덕션 빌드 통과
- 남은 검증: 배포 환경에서 실제 Draft 저장·활성화·프로모션 빌더 반영 Smoke Test

## 1. 작성 배경

현재 설정의 `레이아웃 편집 열기`와 프로모션 빌더의 Live Preview는 같은 Visual Editor 애플리케이션을 사용하지만 서로 다른 실행 모드로 열린다.

```text
설정 레이아웃 편집기
  → mode=admin-layout

프로모션 빌더 Live Preview
  → mode=wizard-layout&source=create-promo
```

`visual-editor/src/App.vue`는 위 실행 모드에 따라 화면 구조, 헤더, 3단 편집 UI, AI 기능 및 속성 패널을 다르게 출력한다. 그 결과 사용자는 같은 템플릿을 편집하면서도 서로 다른 편집기를 사용하는 것으로 인식하게 된다.

또한 설정 편집기에서 기본 레이아웃을 저장해도 프로모션 빌더에서 변경 사항이 보이지 않는 현상이 있다. 현재 저장 구조에는 다음 요소가 함께 작용한다.

1. 설정 편집기의 저장 대상은 활성 템플릿이 아니라 초안 템플릿이다.
2. 초안 저장 후 템플릿을 활성화해야 Public API에 반영된다.
3. 프로모션 빌더는 관리자 기본 레이아웃 위에 프로모션별 저장 레이아웃을 복원한다.
4. 프로모션 빌더의 배경 및 버튼 스타일 선택값이 관리자 테마 일부를 덮어쓴다.
5. 이미 열린 프로모션 빌더는 관리자 변경을 감지하더라도 사용자 수정값이 있으면 자동 적용하지 않는다.
6. 템플릿 ID, 버전 또는 Layout revision이 변경됐는데 이전 캐시가 복원되면 표시된 버전과 실제 화면이 달라질 수 있다.

이번 계획은 저장·반영 계약을 먼저 안정화한 뒤 두 편집기의 UI를 공통화하고, 섹션 속성을 왼쪽 아코디언으로 이동하며, 마지막으로 자동화된 회귀 안전망과 운영 관측성을 확보하는 것을 목표로 한다.

## 2. 문제 정의

### 2.1 편집기 UI 불일치

- 설정 편집기와 프로모션 빌더 편집기의 헤더와 패널 구성이 다르다.
- 프로모션 빌더에만 적용된 3단 UI와 선택 연동 기능이 설정 편집기에는 동일하게 적용되지 않는다.
- 실행 모드 조건문이 템플릿 전체에 분산돼 있어 기능을 추가할 때 한쪽에만 반영될 가능성이 높다.

### 2.2 관리자 기본 레이아웃 반영 불일치

- 설정에서 저장한 값이 초안인지 활성 버전인지 화면에서 즉시 구분하기 어렵다.
- 프로모션 빌더가 어느 템플릿 ID, 버전 및 Layout revision을 사용 중인지 사용자가 확인하기 어렵다.
- 관리자 기본 레이아웃과 프로모션별 수정 레이아웃의 우선순위가 UI에 드러나지 않는다.
- 기존 프로모션 작업에 관리자 변경을 자동 적용할 것인지, 사용자 작업을 유지할 것인지 정책이 분산돼 있다.

### 2.3 섹션 속성의 정보 구조 불일치

- 왼쪽은 섹션 선택만 담당하고, 섹션 속성은 오른쪽 컴포넌트 속성 영역에 섞여 있다.
- 오른쪽 패널에 섹션 속성과 컴포넌트 속성이 함께 있어 선택 대상과 편집 대상의 관계가 모호하다.
- 섹션이 여러 개일 때 현재 선택한 섹션의 설정을 찾기 위해 오른쪽 패널을 반복적으로 스크롤해야 한다.

### 2.4 회귀 검증 부족

- 저장 → 활성화 → Public API → 프로모션 빌더 적용을 연결한 브라우저 테스트가 부족하다.
- 문자열 기반 계약 테스트만으로는 iframe 메시지, 캐시 복원, 선택 연동 및 실제 렌더링 문제를 발견하기 어렵다.
- 두 실행 모드의 화면이 다시 갈라져도 자동으로 검출할 기준이 없다.

## 3. 목표

### 3.1 기능 목표

1. 설정과 프로모션 빌더가 동일한 3단 레이아웃 편집 UI를 사용한다.
2. 실행 모드에 따른 차이는 UI 복제가 아니라 권한과 저장 어댑터로 제한한다.
3. 설정에서 저장한 기본 레이아웃이 활성화 절차 이후 프로모션 빌더에 정확하게 반영된다.
4. 신규 프로모션과 기존 프로모션의 관리자 레이아웃 적용 정책을 구분한다.
5. 선택한 섹션의 속성을 왼쪽 섹션 아코디언에서 편집한다.
6. 오른쪽 패널은 선택한 컴포넌트의 콘텐츠·디자인·위치 속성에 집중한다.
7. 관리자 기본 레이아웃, 프로모션 스타일, 사용자 수정 및 AI 결과의 우선순위를 코드 계약으로 고정한다.

### 3.2 비기능 목표

- 같은 템플릿 Identity에서는 같은 관리자 기본 레이아웃을 재현할 수 있어야 한다.
- 저장과 활성화 상태를 사용자가 오해하지 않게 한다.
- iframe 메시지 순서가 바뀌어도 이전 Snapshot이 최신 상태를 덮어쓰지 않아야 한다.
- 편집기 모드가 추가돼도 템플릿 마크업을 복제하지 않아야 한다.
- 접근성, 키보드 조작 및 독립 스크롤을 유지한다.
- 기존 프로모션 콘텐츠와 명시적인 사용자 수정값을 자동으로 삭제하지 않는다.

## 4. 제외 범위

이번 P0~P3에는 다음을 포함하지 않는다.

- Visual Editor 전체를 별도 프로젝트로 분리
- 설정에서 초안 저장 시 무조건 자동 활성화
- 기존 프로모션의 사용자 수정값을 관리자 값으로 강제 덮어쓰기
- AI가 자유 형식 CSS 또는 HTML을 생성해 편집기에 직접 적용
- 컴포넌트 데이터 모델 또는 디자인 토큰 스키마의 전면 재설계
- 프로모션 빌더 외 다른 레거시 편집 화면의 즉시 삭제
- 관리자 레이아웃 저장만으로 운영 템플릿을 무승인 변경

## 5. 핵심 정책 결정

### 5.1 하나의 편집 UI, 서로 다른 실행 권한

두 화면은 동일한 편집기 Shell과 패널 컴포넌트를 사용한다. 차이는 `mode` 자체가 아니라 명시적인 Capability로 표현한다.

권장 Capability:

| Capability | 설정 편집기 | 프로모션 빌더 |
|---|---:|---:|
| `canEditTemplateDefaults` | O | X |
| `canEditPromoContent` | X | O |
| `canRunSectionAi` | 정책에 따라 선택 | O |
| `canRunComponentImageAi` | X | O |
| `canSaveTemplateLayout` | O | X |
| `canSavePromoOverrides` | X | O |
| `canOpenWebOutput` | 선택 | O |
| `isEmbedded` | X | O |
| `showsTemplateStatus` | O | O |

관리자 편집기에 AI 기능이 필요한 경우 별도 정책 승인을 거쳐 Capability만 활성화한다. 프로모션용 AI 실행 상태와 관리자 기본 레이아웃 저장 상태를 같은 저장 경로로 혼합하지 않는다.

### 5.2 레이아웃 적용 우선순위

최종 렌더링 레이아웃은 다음 순서로 계산한다.

```text
1. 관리자 활성 템플릿의 기본 레이아웃
2. 프로모션 빌더의 배경 및 버튼 스타일 선택값
3. 해당 프로모션의 사용자 레이아웃 수정값
4. 사용자가 적용한 AI 레이아웃 결과
```

뒤 단계의 값이 앞 단계의 허용된 속성만 덮어쓴다. 전체 객체를 교체하지 않는다.

권장 표현:

```text
effectiveLayout =
  mergeAdminBaseLayout(
    activeTemplate.defaultLayout,
    promoAppearanceOverrides,
    promoUserOverrides,
    approvedAiPatch
  )
```

각 레이어는 별도로 저장하며 `effectiveLayout`만 저장하지 않는다. 그래야 관리자 기본값이 변경됐을 때 사용자 수정 여부를 정확히 판정할 수 있다.

### 5.3 저장과 활성화

설정 편집기의 기본 동작은 안전한 초안 저장을 유지한다.

- `초안 저장`: 현재 초안의 Layout revision만 증가
- `저장 후 활성화`: 저장 성공 후 명시적 확인을 거쳐 해당 템플릿 활성화
- `활성 버전`: 프로모션 빌더 Public API가 읽는 버전

초안 저장을 자동 활성화로 바꾸지 않는다. 대신 저장 결과에 다음 정보를 명확하게 표시한다.

```text
초안 v3 · layout r12 저장 완료
현재 프로모션 빌더 사용 버전: 활성 v2 · layout r9
```

### 5.4 신규 프로모션과 기존 프로모션

신규 프로모션:

- 최신 활성 템플릿의 기본 레이아웃으로 시작한다.
- 이전 템플릿 ID 또는 Layout revision의 캐시를 복원하지 않는다.

기존 프로모션:

- 사용자 수정이 없으면 최신 관리자 기본 레이아웃을 자동 적용한다.
- 사용자 수정이 있으면 `새 관리자 레이아웃 적용`과 `현재 작업 유지`를 제공한다.
- 관리자 기본값 적용 시 콘텐츠와 프로모션 스타일 선택값은 유지한다.
- `관리자 기본값으로 초기화`는 레이아웃 및 섹션 순서를 최신 활성 기본값으로 복원한다.

### 5.5 섹션과 컴포넌트 속성의 위치

- 왼쪽 패널: 섹션 목록, 선택한 섹션의 섹션 속성
- 중앙 패널: Live Preview
- 오른쪽 패널: 선택한 컴포넌트의 콘텐츠·디자인·위치 속성

섹션 속성은 오른쪽과 왼쪽에 중복 출력하지 않는다. 기존 오른쪽 섹션 속성을 왼쪽으로 이동한다.

## 6. 목표 아키텍처

### 6.1 편집기 구성

```text
VisualEditorApp
├─ EditorContext
│  ├─ mode
│  ├─ source
│  ├─ capabilities
│  └─ persistenceAdapter
├─ TemplateStatusBar
├─ ThreePanelWorkspace
│  ├─ SectionPanel
│  │  ├─ SectionList
│  │  └─ SectionPropertyAccordion
│  ├─ PreviewPanel
│  │  └─ PromoPageRenderer
│  └─ ComponentPropertyPanel
│     ├─ ComponentContentAccordion
│     ├─ ComponentDesignAccordion
│     └─ ComponentPositionAccordion
└─ ModeActions
   ├─ AdminLayoutActions
   └─ PromoLayoutActions
```

### 6.2 저장 어댑터

```text
AdminLayoutAdapter
  load  → GET /api/wizard-form-template-layout
  save  → PATCH /api/wizard-form-template-layout
  state → templateId + templateVersion + layoutRevision

PromoLayoutAdapter
  load  → parent iframe snapshot
  save  → parent postMessage
  state → layoutIdentity + baseLayout + promoOverrides
```

공통 편집 UI는 저장 대상이 DB인지 부모 페이지 상태인지 알 필요가 없어야 한다.

### 6.3 Template Identity

관리자 기본값과 프로모션별 캐시는 최소한 다음 Identity를 사용한다.

```json
{
  "templateId": "uuid",
  "templateKey": "default",
  "templateVersion": 3,
  "layoutId": "uuid",
  "layoutRevision": 12,
  "configRevision": "revision"
}
```

Template Key만 같다는 이유로 이전 버전의 캐시를 복원하지 않는다.

### 6.4 메시지 동기화

iframe 메시지에는 순서 판정을 위한 `snapshotRevision` 또는 `requestToken`을 포함한다.

```json
{
  "type": "promo-wizard-layout-snapshot",
  "snapshotRevision": 18,
  "layoutIdentity": {},
  "designSpec": {}
}
```

편집기는 현재 값보다 낮은 revision의 Snapshot을 무시한다. 부모도 이전 편집기 응답이 최신 상태를 덮어쓰지 않게 한다.

## 7. P0 — 관리자 기본 레이아웃 반영 안정화

### 7.1 목표

UI 통합 전에 설정 저장값이 어떤 활성 템플릿과 Layout revision을 통해 프로모션 빌더에 전달되는지 확정하고, 캐시와 사용자 Override 때문에 최신 기본값이 사라지는 문제를 제거한다.

### 7.2 작업 1: 저장·활성화 상태 가시화

설정 편집기와 프로모션 빌더에 다음 정보를 표시한다.

- Template ID 또는 진단용 축약 ID
- Template Key
- Template Version
- Template Status
- Layout Revision
- 현재 상태가 초안인지 활성 버전인지
- 프로모션 빌더에 반영된 관리자 기본 레이아웃의 Identity

일반 화면에는 축약 정보를 표시하고 전체 값은 개발 진단 영역 또는 로그에서 확인한다.

### 7.3 작업 2: 초안 저장과 활성화 UX 분리

설정 편집기 액션:

1. `초안 저장`
2. `저장 후 활성화`
3. `저장하지 않고 닫기`

`저장 후 활성화`는 다음 순서를 보장한다.

```text
Layout PATCH 성공
  → 반환된 layoutRevision 확인
  → 템플릿 활성화 요청
  → 활성 템플릿 재조회
  → Public API의 Identity와 저장 결과 비교
  → 성공 상태 표시
```

저장 성공과 활성화 실패를 하나의 성공 메시지로 처리하지 않는다.

### 7.4 작업 3: Public API와 활성 템플릿 선택 검증

- 요청한 Template ID와 응답한 Template ID가 일치하는지 검증한다.
- 저장된 이전 Template ID가 현재 목록에 없으면 같은 Template Key의 최신 활성 버전을 선택한다.
- 동일 Template Key도 없을 때만 기본 활성 템플릿으로 대체한다.
- Public API가 `defaultLayout`, `layoutIdentity`, `layoutRevision`을 일관되게 반환하게 한다.
- 활성화 직후 이전 응답이 남지 않도록 `no-store` 또는 적절한 재검증 정책을 확인한다.

### 7.5 작업 4: Layout Cache 계약 통합

관리자 기본 레이아웃과 사용자 수정값을 분리한다.

권장 저장 구조:

```json
{
  "layoutIdentity": {},
  "baseLayout": {},
  "resolvedLayout": {},
  "baseSectionOrder": [],
  "resolvedSectionOrder": [],
  "overrideRevision": 4
}
```

복원 규칙:

```text
현재 Identity와 저장 Identity가 동일
  → 사용자 resolved 값 복원

Identity가 다르고 사용자 수정 없음
  → 최신 관리자 기본값 자동 적용

Identity가 다르고 사용자 수정 있음
  → 적용/유지 선택 표시

Legacy 또는 손상된 캐시
  → 콘텐츠 보존
  → 레이아웃만 최신 관리자 기본값으로 초기화
```

### 7.6 작업 5: Appearance Override 범위 고정

`applyCreatePromoAppearance()`가 덮어쓸 수 있는 속성을 allowlist로 제한한다.

예:

- 프로모션 배경색
- 기본 텍스트색
- 강조색
- CTA 색상
- CTA 형태

Item geometry, Section 순서, Section 높이 및 관리자 잠금값은 Appearance 단계에서 변경하지 않는다.

관리자 기본 테마와 프로모션 사용자의 선택이 다르면 사용자 선택을 우선하되, 화면에 “프로모션 설정으로 덮어쓴 값”임을 진단 가능하게 한다.

### 7.7 작업 6: 관리자 업데이트 적용 정책

- 사용자 수정 없음: 최신 관리자 레이아웃 자동 적용
- 사용자 수정 있음: 업데이트 안내 Banner
- `새 관리자 레이아웃 적용`: 관리자 기본값과 섹션 순서를 최신 값으로 교체
- `현재 작업 유지`: 현재 프로모션 Override 유지 및 보류 Identity 기록
- `관리자 기본값으로 초기화`: 최신 활성 기본값 기준으로 다시 계산

### 7.8 P0 예상 영향 파일

- `prototype/create-promo.js`
- `prototype/create-promo-layout-cache.js`
- `prototype/wizard/wizard-core.js`
- `admin-app/src/components/TemplateLayoutManager.vue`
- `admin-app/src/services/template-layout-service.mjs`
- `visual-editor/src/App.vue`
- `api/wizard-form-template-layout.js`
- `api/wizard-form-template-activate.js`
- `api/wizard-form-template-public.js`
- `api/_wizard-form-template-layout-store.js`
- 관련 Layout Cache 및 Template API 테스트

실제 착수 전 현재 작업 트리의 미커밋 변경과 겹치는 파일을 먼저 확인한다.

### 7.9 P0 테스트

단위 테스트:

- 같은 Identity에서만 사용자 레이아웃 복원
- Template ID 변경 시 이전 캐시 무효화
- Template Version 변경 시 이전 캐시 무효화
- Layout revision 변경 시 관리자 업데이트 감지
- Layout과 Section 순서를 함께 Override로 판정
- Appearance가 geometry를 변경하지 않음

API 테스트:

- 초안 Layout 저장 성공
- revision 충돌 시 409
- 활성화 후 Public API Identity 일치
- 잘못된 Template ID 요청 거부
- 활성 템플릿이 없을 때 명확한 오류

브라우저 시나리오:

```text
설정에서 초안 레이아웃 수정
  → 초안 저장
  → 프로모션 빌더에는 아직 기존 활성 버전 유지
  → 저장 후 활성화
  → 신규 프로모션은 최신 기본값으로 시작
  → 기존 프로모션은 사용자 수정 여부에 따라 자동 적용 또는 Banner 표시
```

### 7.10 P0 완료 기준

- [ ] 설정 저장값과 프로모션 빌더 사용 Identity를 화면 또는 진단 로그로 비교할 수 있다.
- [ ] 초안 저장만으로 활성 버전이 변경되지 않는다.
- [ ] 저장 후 활성화하면 Public API가 같은 Layout revision을 반환한다.
- [ ] 신규 프로모션에 최신 활성 레이아웃이 적용된다.
- [ ] 기존 프로모션의 사용자 수정값을 무단으로 덮어쓰지 않는다.
- [ ] 관리자 기본값 초기화 시 Layout과 Section 순서가 함께 복원된다.
- [ ] 프로모션 Appearance가 허용된 테마 속성만 변경한다.

## 8. P1 — 설정·프로모션 빌더 편집기 UI 공통화

### 8.1 목표

설정 편집기와 프로모션 빌더 편집기가 동일한 3단 Workspace, Preview Renderer 및 속성 컴포넌트를 사용하게 한다. 실행 모드별 차이는 Capability와 저장 어댑터에만 남긴다.

### 8.2 작업 1: 모드 분기 감사

`App.vue`의 다음 조건을 전수 조사한다.

- `isAdminLayoutMode`
- `isWizardLayoutMode`
- `isCreatePromoWizardMode`
- `v-if`로 분기된 헤더, 메뉴, AI 기능 및 속성 패널

각 조건을 다음 중 하나로 분류한다.

1. Shell 표시 차이
2. 편집 권한 차이
3. 데이터 입력 차이
4. 저장 방식 차이
5. 제거 가능한 레거시 차이

### 8.3 작업 2: Editor Context와 Capability 도입

권장 구조:

```js
const editorContext = {
  surface: "template-default" | "promo-instance",
  embedded: true | false,
  capabilities: {},
  persistenceAdapter: {}
};
```

템플릿 마크업에서는 가능한 한 `isCreatePromoWizardMode` 대신 의미 기반 Capability를 사용한다.

예:

```text
기존: v-if="isCreatePromoWizardMode"
변경: v-if="capabilities.canRunSectionAi"
```

### 8.4 작업 3: 공통 3단 Workspace

두 모드 모두 다음 구조를 사용한다.

```text
왼쪽 Section Panel
중앙 Preview Stage
오른쪽 Component Property Panel
```

프로모션 빌더에서 안정화된 다음 동작을 설정 편집기에도 적용한다.

- 좌·중·우 독립 스크롤
- Preview Stage만 중앙 세로 스크롤
- 외곽 Shell `overflow: hidden`
- 선택한 섹션으로 중앙 Preview 스크롤
- Preview 컴포넌트 클릭 시 오른쪽 아코디언 열기

### 8.5 작업 4: 공통 헤더와 모드 액션

전체 Workspace 구조는 동일하게 유지하되 상단 액션만 다르게 제공한다.

설정 편집기:

- 초안 저장
- 저장 후 활성화
- Template Version 및 Layout Revision
- 설정 화면으로 돌아가기

프로모션 빌더:

- Web Output
- 관리자 기본값으로 초기화
- 관리자 업데이트 적용 안내
- 프로모션 저장 상태

프로모션 빌더에서 이미 제거한 중복 `editor-header editor-toolbar`를 설정 편집기 통합 과정에서 다시 도입하지 않는다.

### 8.6 작업 5: 데이터 공급 방식 분리

설정 편집기:

- Template API에서 기본 콘텐츠 또는 Preview용 값을 로드
- 관리자 기본 레이아웃을 직접 편집
- 저장 시 Layout API 사용

프로모션 빌더:

- 부모 페이지가 콘텐츠, 디자인, 자산 Snapshot 제공
- 편집 변경을 `postMessage`로 부모에 전달
- 프로모션별 Override로 저장

공통 Renderer는 데이터 출처와 무관하게 같은 Snapshot 계약을 받는다.

### 8.7 작업 6: CSS 공통화

- `is-create-promo-wizard`에 종속된 3단 레이아웃 CSS를 의미 기반 공통 클래스명으로 변경한다.
- 설정과 프로모션 빌더가 동일한 패널 폭, gap 및 overflow 규칙을 사용한다.
- 모드별 차이는 최소 Modifier로 제한한다.
- Web Output 또는 실제 프로모션 Renderer CSS가 편집기 Shell CSS의 영향을 받지 않게 한다.

권장 클래스 예:

```text
.editor-workspace--three-panel
.editor-workspace--embedded
.editor-workspace--template-default
.editor-workspace--promo-instance
```

### 8.8 P1 예상 영향 파일

- `visual-editor/src/App.vue`
- `visual-editor/src/styles.css`
- 신규 Editor Context 또는 Capability 모듈
- 신규 Persistence Adapter 모듈
- `prototype/create-promo.js`
- `admin-app/src/components/TemplateLayoutManager.vue`
- `admin-app/src/services/template-layout-service.mjs`
- `prototype/visual-editor.html`
- Visual Editor build 산출물

### 8.9 P1 테스트

- 두 모드에서 동일한 3단 DOM 구조 사용
- 설정 모드에서 프로모션 전용 콘텐츠 저장 호출 없음
- 프로모션 모드에서 관리자 Layout PATCH 호출 없음
- 설정 저장은 Admin Adapter만 호출
- 프로모션 편집은 부모 `postMessage`만 호출
- 각 모드의 허용되지 않은 액션이 숨김 또는 비활성
- 1440px, 1280px, 1024px 및 breakpoint 경계에서 레이아웃 검증
- 좌·중·우 독립 스크롤 검증

### 8.10 P1 완료 기준

- [ ] 설정과 프로모션 빌더가 같은 3단 편집 UI를 사용한다.
- [ ] 모드별 대규모 템플릿 분기가 제거되거나 Capability로 대체된다.
- [ ] 설정과 프로모션 빌더의 저장 대상이 섞이지 않는다.
- [ ] Preview Renderer 결과가 두 모드에서 동일하다.
- [ ] 중복 헤더와 중복 속성 패널이 없다.
- [ ] Web Output Renderer에 편집기 CSS가 유입되지 않는다.

## 9. P2 — 왼쪽 섹션 속성 아코디언

### 9.1 목표

왼쪽 섹션 목록에서 섹션을 선택하면 해당 섹션 항목 아래에 섹션 속성 아코디언을 표시한다. 오른쪽 패널은 선택한 컴포넌트의 속성만 표시한다.

### 9.2 정보 구조

왼쪽 섹션 아코디언:

- 섹션 이름 및 상태
- 활성/숨김 상태 표시
- 섹션 배경색
- 섹션 배경 이미지 AI 생성
- 배경 이미지 삭제
- 배경 이미지 정렬
- 배경 이미지 크기 방식
- 배경 이미지 페이드 방향
- 섹션 높이 또는 최소 높이
- 섹션 수준 AI 진행·실패·재시도 상태

오른쪽 컴포넌트 패널:

- 컴포넌트 콘텐츠
- 컴포넌트 이미지 생성·삭제
- 컴포넌트 디자인
- 컴포넌트 위치 및 크기
- 잠금 및 편집 제한 상태

### 9.3 선택 동작

1. 왼쪽 섹션 클릭
2. 기존 선택 섹션 아코디언 닫기
3. 새 섹션 아코디언 열기
4. 중앙 Preview의 해당 섹션으로 스크롤
5. 이전 선택 컴포넌트가 새 섹션에 속하지 않으면 선택 해제
6. 새 섹션의 기본 컴포넌트를 자동 선택하지 않음

Preview에서 섹션 또는 컴포넌트를 선택한 경우:

- 해당 왼쪽 섹션 아코디언 열기
- 컴포넌트 선택이면 오른쪽 해당 컴포넌트 아코디언도 열기

### 9.4 상태 모델

권장 상태:

```js
{
  selectedSectionKey: null,
  expandedSectionKey: null,
  selectedItemKey: null,
  expandedComponentKey: null
}
```

선택 상태와 아코디언 확장 상태를 분리하되 기본적으로 함께 이동한다. 사용자가 속성 입력 중일 때 불필요하게 아코디언이 닫히지 않게 한다.

### 9.5 레이아웃과 스크롤

- 왼쪽 패널 권장 폭: 280~320px
- `section-list` 영역만 필요할 때 `overflow-y: auto`
- 아코디언이 열려도 전체 페이지가 스크롤되지 않게 한다.
- 중앙 Preview와 오른쪽 Property Form의 스크롤 위치를 변경하지 않는다.
- 섹션 이동 시 중앙만 `scrollIntoView` 또는 계산된 컨테이너 스크롤을 수행한다.

### 9.6 접근성

- 섹션 버튼에 `aria-expanded` 제공
- 아코디언 패널에 `aria-labelledby` 연결
- Enter/Space로 열기
- 방향키 이동을 적용할 경우 Section List 전체에 일관되게 적용
- 삭제되거나 숨겨진 섹션 선택 시 안전하게 다음 유효 섹션으로 Focus 이동
- AI 진행 상태는 `aria-live="polite"`, 실패는 적절한 Alert 사용

### 9.7 중복 제거

기존 오른쪽의 `.section-properties`를 그대로 복사하지 않는다.

권장 방법:

1. 섹션 속성 UI를 독립 컴포넌트로 추출
2. 왼쪽 아코디언에서 한 번만 렌더링
3. 기존 오른쪽 섹션 속성 마크업 제거
4. 이벤트 핸들러와 상태는 기존 단일 Source of Truth 유지

### 9.8 P2 예상 영향 파일

- `visual-editor/src/App.vue`
- 신규 `SectionPropertyAccordion` 컴포넌트
- 신규 또는 기존 `ComponentPropertyAccordion` 컴포넌트
- `visual-editor/src/styles.css`
- 선택 및 Preview 스크롤 관련 모듈
- Visual Editor 관련 DOM/Browser 테스트

### 9.9 P2 테스트

- 섹션 클릭 시 해당 아코디언만 열림
- 다른 섹션 선택 시 이전 아코디언 닫힘
- 섹션 클릭 시 중앙 해당 섹션으로 이동
- Preview 컴포넌트 클릭 시 왼쪽 섹션과 오른쪽 컴포넌트가 함께 활성화
- 오른쪽에 섹션 속성이 중복 출력되지 않음
- 배경 이미지 생성 상태가 해당 섹션 아코디언에만 표시
- 섹션 삭제·숨김·순서 변경 후 Selection이 유효함
- 각 패널의 스크롤이 독립적임
- 키보드와 스크린리더 속성 검증

### 9.10 P2 완료 기준

- [ ] 선택한 섹션의 속성이 왼쪽 아코디언에 표시된다.
- [ ] 오른쪽에는 선택한 컴포넌트 속성만 표시된다.
- [ ] 섹션 속성 UI가 중복 렌더링되지 않는다.
- [ ] 왼쪽 선택과 중앙 Preview 스크롤이 동기화된다.
- [ ] Preview 선택과 좌·우 아코디언이 동기화된다.
- [ ] 좌·중·우 독립 스크롤과 접근성이 유지된다.

## 10. P3 — 회귀 안전망, 관측성 및 배포 안정화

### 10.1 목표

P0~P2의 데이터 계약과 UI 동작이 이후 변경에서 다시 분리되지 않도록 Unit, API, Browser E2E 및 운영 Smoke Test를 구성한다.

### 10.2 테스트 계층

#### Unit

- Layout Identity 비교
- Cache 복원 및 무효화
- Override 레이어 병합
- Capability 계산
- Selection 및 Accordion reducer
- 오래된 Snapshot revision 거부

#### API Handler

- Layout GET/PATCH
- Template 활성화
- Public Template 조회
- revision 충돌
- 잘못된 템플릿 접근
- 저장 성공 후 활성화 실패의 분리 응답

#### Integration

```text
Draft 수정
  → Layout 저장
  → Template 활성화
  → Public API 조회
  → Create Promo 로드
  → effectiveLayout 계산
  → Visual Editor Snapshot 전달
```

각 단계에서 Identity가 동일한지 검증한다.

#### Browser E2E

필수 시나리오 A — 신규 프로모션:

1. 설정에서 초안 레이아웃 수정
2. 초안 저장
3. 저장 후 활성화
4. 새 프로모션 빌더 접속
5. Template Version과 Layout Revision 확인
6. 섹션 위치, Item 위치 및 Section 순서 확인

필수 시나리오 B — 기존 프로모션, 사용자 수정 없음:

1. 기존 활성 레이아웃으로 프로모션 열기
2. 설정에서 새 버전 활성화
3. 프로모션 갱신
4. 최신 관리자 레이아웃 자동 적용 확인

필수 시나리오 C — 기존 프로모션, 사용자 수정 있음:

1. 프로모션별 위치 변경
2. 설정에서 새 버전 활성화
3. 관리자 업데이트 Banner 확인
4. `현재 작업 유지` 확인
5. 다시 `새 관리자 레이아웃 적용` 확인
6. 콘텐츠 보존 확인

필수 시나리오 D — 공통 편집 UI:

1. 설정 편집기 열기
2. 프로모션 빌더 편집기 열기
3. 동일한 3단 Workspace 구조 확인
4. 각 모드에서 허용된 액션만 표시되는지 확인
5. 섹션 아코디언과 Preview 선택 연동 확인

### 10.3 시각 회귀 기준

- 좌측 패널 폭과 아코디언 레이아웃
- 중앙 Preview 최소 폭
- 오른쪽 컴포넌트 패널
- 독립 스크롤
- 좁은 화면 Drawer 또는 패널 접기
- 섹션 배경색과 배경 이미지
- 선택 표시, Focus 표시, AI 진행 상태

권장 Viewport:

- 1440px
- 1280px
- 1024px
- 실제 breakpoint 경계값
- 모바일 또는 Drawer 전환 최소 지원 폭

### 10.4 운영 관측성

기록 권장 Event:

- `admin_layout_draft_saved`
- `admin_layout_activation_requested`
- `admin_layout_activated`
- `admin_layout_activation_failed`
- `admin_layout_update_detected`
- `admin_layout_update_applied`
- `admin_layout_update_deferred`
- `admin_layout_reset`
- `layout_cache_identity_mismatch`
- `stale_layout_snapshot_ignored`

로그 포함 정보:

- 배포 Commit SHA
- Template ID/Key/Version
- Layout ID/Revision
- 프로모션 식별자
- 이벤트 결과
- 이전/다음 Identity 요약

사용자 콘텐츠 전문과 인증정보는 로그에 기록하지 않는다.

신규 Event를 DB Check Constraint로 제한하는 경우 API 허용 목록과 DB Migration을 같은 배포 단위로 처리한다.

### 10.5 배포 전략

권장 순서:

1. P0 Unit/API 테스트와 진단 정보 추가
2. P0 저장·활성화·캐시 수정 배포
3. 운영 또는 Preview에서 신규/기존 프로모션 Smoke Test
4. P1 공통 편집 Shell을 Feature Flag 뒤에 배포
5. 설정 편집기부터 제한 활성화
6. 프로모션 빌더까지 공통 Shell 활성화
7. P2 왼쪽 섹션 아코디언 활성화
8. 안정화 후 기존 모드별 마크업과 CSS 제거
9. P3 전체 Browser E2E를 배포 Gate로 적용

현재 운영 배포를 직접 사용한다면 각 단계의 변경량을 작게 유지하고 P0, P1, P2를 한 번에 활성화하지 않는다.

### 10.6 롤백

P0:

- 새 Cache contract 사용 중지
- 손상된 캐시는 Layout 항목만 무효화하고 콘텐츠 유지
- DB 스키마 변경이 additive라면 컬럼은 유지

P1:

- 공통 Editor Shell Feature Flag 비활성화
- 기존 persistence adapter는 유지하여 저장 데이터 손실 방지
- 이전 UI로 돌아가더라도 P0 데이터 계약은 유지

P2:

- 섹션 속성 위치만 오른쪽 패널로 되돌릴 수 있게 컴포넌트를 독립 유지
- 상태 모델과 저장 계약은 롤백하지 않음

### 10.7 P3 완료 기준

- [ ] Unit, API, Integration 및 Browser E2E가 실행 가능한 명령으로 제공된다.
- [ ] 저장 → 활성화 → Public API → 프로모션 빌더 반영 시나리오가 자동 검증된다.
- [ ] 두 편집기 UI가 다시 분리되면 테스트가 실패한다.
- [ ] 섹션·Preview·컴포넌트 선택 연동이 자동 검증된다.
- [ ] 배포 후 실제 활성 템플릿을 사용한 Smoke Test가 통과한다.
- [ ] 관련 Console Error와 예상하지 않은 Network 4xx/5xx가 없다.
- [ ] 문제 발생 시 Template/Layout Identity로 원인을 추적할 수 있다.

## 11. 전체 예상 변경 파일

실제 개발 착수 시 현재 저장소 상태를 기준으로 다시 확정한다.

### Frontend

- `visual-editor/src/App.vue`
- `visual-editor/src/styles.css`
- 신규 Editor Context/Capability 모듈
- 신규 Admin/Promo Persistence Adapter
- 신규 Section Property Accordion
- 신규 Component Property Accordion 또는 기존 코드 추출
- `prototype/create-promo.js`
- `prototype/create-promo-layout-cache.js`
- `admin-app/src/components/TemplateLayoutManager.vue`
- `admin-app/src/services/template-layout-service.mjs`
- `prototype/visual-editor.html`

### Backend

- `api/wizard-form-template-layout.js`
- `api/wizard-form-template-activate.js`
- `api/wizard-form-template-public.js`
- `api/_wizard-form-template-layout-store.js`
- Layout Usage Event 관련 API

### Database

- 기본적으로 P0~P2는 기존 Layout 저장 구조를 우선 사용한다.
- Event 이름 Check Constraint 또는 추가 진단 컬럼이 필요할 때만 additive migration을 추가한다.
- UI 통합을 이유로 기존 Template/Layout 데이터를 초기화하지 않는다.

### Tests

- Layout Cache Unit Test
- Template Layout API Handler Test
- Template 활성화/Public API Integration Test
- Visual Editor Capability Test
- Selection/Accordion Behavior Test
- Admin → Promo 반영 Browser E2E
- 공통 3단 UI Visual Regression Test

## 12. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 초안 저장을 활성화로 오인 | 변경 미반영으로 인식 | 초안/활성 상태와 실제 사용 revision 동시 표시 |
| 자동 활성화로 운영 템플릿 즉시 변경 | 운영 화면 회귀 | 초안 저장과 활성화 분리, 명시적 확인 |
| 기존 프로모션 Override 손실 | 사용자 작업 손실 | 사용자 수정 감지, 적용/유지 선택, 콘텐츠 보존 |
| Template Key만으로 캐시 복원 | 잘못된 버전 레이아웃 적용 | 전체 Layout Identity 비교 |
| Appearance가 관리자 geometry 변경 | 레이아웃 불일치 | 허용 테마 속성 allowlist |
| iframe 메시지 순서 역전 | 이전 Layout으로 되돌아감 | snapshot revision/request token |
| UI 공통화 중 저장 경로 혼합 | 관리자 값 또는 프로모션 값 오염 | Persistence Adapter 분리와 금지 호출 테스트 |
| 섹션 속성 양쪽 중복 | 값 동기화 오류 | UI 추출 후 왼쪽에서 한 번만 렌더링 |
| 왼쪽 패널 폭 부족 | 컨트롤 사용성 저하 | 280~320px, 반응형 Drawer |
| Visual Editor CSS가 Web Output에 영향 | 최종 출력 회귀 | Editor Shell과 Renderer CSS 경계 테스트 |
| P0~P2 동시 배포 | 원인 분리 어려움 | 단계별 Feature Flag 및 Smoke Test |

## 13. 개발 및 검증 순서

```text
1. 현재 Active/Draft Template과 Layout Identity 기준선 기록
2. P0 Unit/API 테스트 추가
3. 저장·활성화 상태 가시화
4. 활성 템플릿 선택 및 Public API 검증
5. Layout/Section Order Cache Identity 통합
6. Appearance allowlist와 관리자 업데이트 정책 적용
7. P0 Browser Smoke Test
8. Editor Context, Capability, Persistence Adapter 도입
9. 공통 3단 Workspace로 전환
10. 설정/프로모션 모드별 액션 검증
11. Section Property Accordion 추출
12. 왼쪽 섹션 아코디언 배치 및 오른쪽 중복 제거
13. Preview 선택·스크롤·아코디언 연동
14. 전체 Browser E2E와 시각 회귀
15. 단계별 배포 및 운영 Smoke Test
16. 안정화 후 레거시 조건문·CSS 제거
```

## 14. 전체 완료 정의

- [ ] 설정과 프로모션 빌더가 동일한 3단 편집기 UI를 사용한다.
- [ ] 두 화면의 차이는 Capability와 Persistence Adapter로 관리된다.
- [ ] 초안 저장, 활성화 및 프로모션 빌더 반영 상태가 명확하게 구분된다.
- [ ] 신규 프로모션은 최신 활성 관리자 기본 레이아웃을 사용한다.
- [ ] 기존 프로모션은 사용자 수정 여부에 따라 관리자 업데이트를 안전하게 처리한다.
- [ ] 관리자 기본값, 프로모션 Appearance, 사용자 수정 및 AI 결과의 우선순위가 고정돼 있다.
- [ ] 섹션 속성은 왼쪽 섹션 아코디언에서만 편집한다.
- [ ] 오른쪽 패널은 컴포넌트 콘텐츠·디자인·위치 속성만 표시한다.
- [ ] 좌측 선택, 중앙 Preview 및 우측 컴포넌트 선택이 동기화된다.
- [ ] 좌·중·우 독립 스크롤과 접근성이 유지된다.
- [ ] 저장 → 활성화 → Public API → 프로모션 빌더 반영 자동화 테스트가 통과한다.
- [ ] Web Output과 실제 프로모션 Renderer에 편집기 전용 CSS가 유입되지 않는다.
- [ ] 배포 후 실제 활성 템플릿을 사용한 Smoke Test가 통과한다.

## 15. 최종 권고

P1 편집기 UI 공통화나 P2 아코디언 이동부터 시작하지 않는다. 현재의 핵심 오류는 관리자 기본 레이아웃의 저장·활성화·캐시·Override 계약이 사용자에게 보이지 않고 일부 경로에서 서로 다른 기준을 사용한다는 점이다.

먼저 P0에서 다음을 확정해야 한다.

```text
어떤 관리자 레이아웃을 읽었는가
어떤 프로모션 Override가 그 값을 덮어썼는가
현재 화면이 어느 Template/Layout Identity를 표시하는가
관리자 변경을 기존 사용자 작업에 어떻게 적용하는가
```

이 계약이 안정화된 이후 P1에서 같은 편집 UI를 사용하고, P2에서 섹션 속성을 왼쪽 아코디언으로 이동해야 한다. P3는 마지막에 한 번 수행하는 테스트 단계가 아니라 P0부터 테스트를 누적하고 최종 배포 Gate로 완성하는 단계로 운영한다.
