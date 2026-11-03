# AI Layout Preset 신규·레거시 적용 범위 및 보완 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-14
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 코드 구현 및 자동 검증 완료 / Migration·관리자 활성화 대기
- 기준 화면:
  - `설정 > 섹션 프리셋 관리`
  - `설정 > 컴포넌트 관리`
  - `설정 > LLM 및 프롬프트 관리`
  - `설정 > 디자인 토큰 관리`
- 기준 실행 모드:
  - 신규: Registry 기반 AI Composition Contract v3
  - 레거시: Template 기반 AI Composition Contract v2
- 선행 문서:
  - `docs/계획/ai-registry-composition-mode-supplement-development-plan-2026-08-04.md`
  - `docs/계획/source-code-llm-prompt-setting-centralization-development-plan-2026-08-07.md`
  - `docs/계획/prompt-governance-and-contextual-inspector-review-remediation-development-plan-2026-08-13.md`

---

## 1. 목적

AI가 동일한 Hero 배치와 동일한 텍스트 스타일을 반복하는 문제를 다음 원칙으로 보완한다.

1. 관리자가 `Section Preset 관리`에서 만든 좌·중·우 Layout Preset이 실제 AI 후보에 정확히 반영된다.
2. 신규 Registry v3와 레거시 Template v2의 실행 경계를 명확히 분리한다.
3. 신규 수정이 레거시 Template Mode와 기존 저장 문서를 파손하지 않는다.
4. 제목색, CTA 배경색처럼 같은 semantic token을 서로 다른 CSS 속성에 적용할 수 있게 한다.
5. Layout의 표시 이름, 기술 식별자, AI 선택 의미를 관리자 화면에서 구분한다.
6. LLM 선택 지침은 소스에 하드코딩하지 않고 `LLM 및 프롬프트 관리`의 Version으로 관리한다.

---

## 2. 용어 및 실행 모드 기준

### 2.1 관리자 화면 용어

| 실제 화면 명칭 | 이 문서의 의미 |
|---|---|
| `Section Preset` | 재사용 가능한 Section 정의와 Version |
| `Layout Preset` | 한 Section의 Desktop/Mobile 저장 배치 |
| `AI 레이아웃 변경 허용` | Section 수준의 Layout 선택 허용 정책 |
| `AI 사용 허용` | 개별 Layout Preset의 AI 후보 포함 여부 |
| `기본` | AI가 선택하지 못하거나 Layout이 잠겼을 때 사용할 기본 Layout |
| `템플릿·레이아웃 관리` | Template Mode의 폼 템플릿과 기본 페이지 레이아웃 관리 |

`레이아웃 후보`라는 표현은 앞으로 `AI 선택 가능 Layout Preset`으로 표기한다.

### 2.2 신규 Registry v3

다음 조건으로 실행되는 경로다.

- Builder capability `compositionV3` 활성
- 요청 `mode = ai-composition`
- `contractVersion = 3`
- 활성 Composition Shell 사용
- `registry` 또는 `shared` scope의 Section 후보 사용
- 후보 Resolver: `api/_promo-registry-composition-candidates.js`
- Compiler: `api/_promo-registry-composition-compiler.js`

### 2.3 레거시 Template v2

다음 조건으로 실행되는 기존 경로다.

- `contractVersion = 2`
- 활성 Form Template의 Section membership 사용
- 후보 Resolver: `api/_promo-page-composition-candidates.js`
- Template 기반 Composition Contract와 저장 Snapshot 사용
- Registry v3를 사용할 수 없을 때 안전 fallback 역할 유지

레거시라는 명칭은 제거 대상을 의미하지 않는다. 이번 개발에서는 운영 fallback과 기존 문서 호환 경로로 유지한다.

---

## 3. 적용 범위 요약

| 개선 항목 | 신규 Registry v3 | 레거시 Template v2 | 관리자 공통 | 처리 원칙 |
|---|---:|---:|---:|---|
| `AI 사용 허용` Layout 필터 | 수정 필요 | 이미 구현됨 | 저장 UI 유지 | v3 Resolver 수정, v2 회귀 보호 |
| `AI 레이아웃 변경 허용` | 수정 필요 | 이미 구현됨 | 라벨 보완 | v3에서 `layoutLocked` 강제 적용 |
| 좌·중·우 Layout 생성 | 적용 | 적용 가능 | 설정에서 수행 | 코드·Migration에 좌표 하드코딩 금지 |
| Layout 의미 메타데이터 | 신규 적용 | 선택 적용 | UI 추가 | v3 우선, v2는 호환 필드만 소비 |
| 최근 Layout 반복 방지 | 신규 적용 | 선택 적용 | 정책 UI 추가 가능 | v3 우선 출시, v2는 Feature Flag |
| 제목색/CTA 배경 스타일 슬롯 | 적용 | 적용 | 컴포넌트 UI 보완 | 공통 Mapper 수정 |
| 기존 Component Version 보정 | 적용 | 적용 대상 조사 | Version lifecycle 사용 | 기존 Version 직접 수정 금지 |
| `promo_page_composer` Prompt | 동일 활성 Version 사용 | 동일 활성 Version 사용 | 설정에서 관리 | 자연어 지침 하드코딩 금지 |
| Prompt 관리 그룹·설명 | 적용 | 적용 | 코드 메타데이터 | 관리자 Catalog 수정 |
| 기존 저장 문서 재작성 | 금지 | 금지 | 해당 없음 | 새 생성·재생성부터 적용 |

---

## 4. 현행 결함과 모드별 판단

## 4.1 신규 v3: AI 허용 Layout 필터 누락

### 현상

관리자 화면의 `AI 사용 허용/해제`는 Section의 `aiDesign.allowedLayoutVariants`에 Layout Key를 저장한다.

신규 Registry 후보 Resolver는 Section에 저장된 Layout 전체를 조회한 뒤 `layoutPresets: layouts`로 전달한다. `aiDesign.allowedLayoutVariants`와 교집합을 만들지 않으므로 AI 허용을 해제한 Layout도 v3 후보에 포함될 수 있다.

### 신규 적용

다음 공통 Resolver 함수를 추가한다.

```text
resolveAllowedLayoutPresets(section, savedLayouts)
  1. saved layoutKey 집합 생성
  2. aiDesign.allowedLayoutVariants와 교집합 생성
  3. layoutLocked이면 default 하나만 반환
  4. unlocked이면 허용 목록만 반환
  5. AI Design이 켜져 있는데 허용 결과가 없으면 fail-closed
```

v3 후보 Snapshot에는 다음 값을 명시적으로 기록한다.

- `layoutPresets`: AI가 실제 선택할 수 있는 Layout만 포함
- `defaultLayoutKey`
- `allowedLayoutKeys`
- `layoutSelectionLocked`

허용 Layout이 없으면 Section을 조용히 제외하지 않고 `AI_LAYOUT_PRESET_REQUIRED` 사유를 반환한다. 필수 Hero Section이면 전체 Proposal을 `COMPOSITION_CANDIDATES_EMPTY` 또는 구체적인 정책 오류로 중단한다.

### 레거시 적용

레거시 v2는 이미 다음 처리를 수행한다.

- 저장 Layout과 `aiDesign.allowedLayoutVariants` 교집합
- 허용 목록이 비었을 때 default fallback
- `layoutLocked`이면 default 하나로 제한

따라서 v2 Resolver를 신규 로직으로 전면 교체하지 않는다. 공통 함수로 추출할 경우 기존 v2 결과가 byte-equivalent인지 테스트한 뒤 적용한다.

### 완료 조건

- v3 후보 API에서 `AI 허용 해제` Layout이 사라진다.
- v3 Proposal과 Apply 재검증에서 동일 후보 집합과 fingerprint를 사용한다.
- v2 후보 Snapshot과 기존 테스트 결과가 유지된다.

---

## 4.2 신규 v3: Section 수준 Layout Lock 적용

### 현상

`AI 레이아웃 변경 허용`은 내부적으로 `compositionPolicy.layoutLocked`의 반대 의미다. v2는 잠긴 경우 default Layout 하나만 후보로 제공한다. v3는 현재 Layout 전체를 전달하므로 Section 정책과 후보가 불일치할 수 있다.

### 신규 적용

- `layoutLocked = true`이면 `defaultLayoutKey`만 후보에 포함한다.
- default가 없으면 활성화 검증 단계에서 `DEFAULT_LAYOUT_REQUIRED`로 차단한다.
- Proposal Contract와 Apply 단계 모두 같은 Resolver 결과를 검증한다.
- 자연어 수정의 `change-layout-variant`도 같은 allowed set을 사용한다.

### 레거시 적용

- 현행 동작 유지
- default fallback과 lock 회귀 테스트 추가
- 기존 `split-left`, `split-right`, `centered-hero` Key를 변경하지 않는다.

---

## 4.3 공통: semantic role과 실제 스타일 속성 분리

### 현상

현재 `accent-color`는 공통 Mapper에서 `backgroundColorToken`으로 변환된다.

- Hero Title의 `titleColor`도 `accent-color`
- Primary CTA의 `ctaBackground`도 `accent-color`

semantic role만으로는 제목 글자색과 CTA 배경색을 구분할 수 없다. 이 Mapper는 v2와 v3 Compiler가 함께 사용하므로 두 모드 모두 영향을 받는다.

### 목표 계약

Style Slot을 다음 두 축으로 분리한다.

```json
{
  "slotKey": "titleColor",
  "semanticRole": "accent-color",
  "targetProperty": "colorToken",
  "aiSelectable": true
}
```

```json
{
  "slotKey": "ctaBackground",
  "semanticRole": "accent-color",
  "targetProperty": "backgroundColorToken",
  "aiSelectable": true
}
```

- `semanticRole`: 어떤 Token을 선택할 수 있는가
- `targetProperty`: Renderer의 어떤 스타일 속성에 적용하는가

### 공통 코드 적용

1. 허용 `targetProperty` allowlist를 정의한다.
2. `styleSlotTokenStyle()`이 `targetProperty`를 우선 사용한다.
3. 기존 Slot에 `targetProperty`가 없으면 기존 매핑을 사용하는 호환 모드를 둔다.
4. 저장·검증 단계에서 임의 CSS property와 raw value를 거부한다.
5. Renderer는 기존 `colorToken`, `backgroundColorToken`, `textBackgroundToken` 계약을 유지한다.

### 신규 v3 적용

- Registry Compiler의 기본 Item Style 생성에 새 Slot 계약 적용
- 새 Registry Section/Component Version은 `targetProperty` 필수
- v3 활성화 검증은 누락 Slot을 경고 또는 오류로 처리

### 레거시 v2 적용

- 기존 Component Version은 즉시 파손하지 않도록 호환 Mapper 사용
- 보정된 Component Version을 참조하는 Template/Section부터 새 계약 적용
- 이미 저장된 Builder Document Snapshot은 자동 재작성하지 않음

### 데이터 보정

기존 Version row를 직접 수정하지 않는다.

1. `Hero Title` 활성 Version을 기준으로 새 Draft Version 생성
2. `titleColor.targetProperty = colorToken` 추가
3. `Primary CTA` 활성 Version을 기준으로 새 Draft Version 생성
4. `ctaBackground.targetProperty = backgroundColorToken` 추가
5. 검증 후 새 Component Version 활성화
6. 영향을 받는 Registry Section과 Template Section을 새 Draft로 생성
7. Component Version reference를 새 Version으로 교체
8. Section Draft 검증 후 순차 활성화

이 데이터 보정이 자동화되어야 하면 기존 Migration을 수정하지 않고 신규 `058_*` Migration 또는 관리 Script로 작성한다. 운영 Version의 immutable row를 `update`하지 않는다.

---

## 4.4 신규 우선: Layout 의미 메타데이터

### 현상

현재 Layout은 `name`, `description`, 자동 생성 `layoutKey`, Snapshot만 가진다. `hero_centered`처럼 이름과 실제 좌표가 불일치해도 서버가 이를 검증하지 못한다. 새 Layout의 Key도 `layout_<random>`으로 생성되어 AI 판단 근거가 약하다.

### 목표

Layout Preset에 선택용 메타데이터를 추가한다.

```json
{
  "alignment": "left",
  "contentRegion": "top-left",
  "visualBalance": "media-right",
  "density": "compact",
  "purposeTags": ["event", "brand-intro"],
  "selectionWeight": 1,
  "avoidImmediateRepeat": true
}
```

### 신규 적용

- Registry 후보 Snapshot에 메타데이터 포함
- v3 Contract Schema에서 enum 값만 허용
- `promo_page_composer`가 이름이 아니라 메타데이터를 근거로 선택
- 실제 Snapshot geometry와 `alignment`가 현저히 다르면 활성화 검증 경고

### 레거시 적용

- v2 Contract를 깨지 않도록 optional field로만 전달
- 기존 Layout은 metadata가 없어도 정상 동작
- 레거시 Template Mode의 선택 결과를 바꾸는 것은 별도 Feature Flag 이후 적용

### 관리자 적용

- `Preset 이름`과 별도로 `콘텐츠 정렬`, `권장 용도`, `연속 사용 방지` 필드 추가
- 기술 식별자는 읽기 전용 `Layout ID`로 표시
- `Hero Key Visual` 같은 모호한 표시 이름은 `히어로 · 왼쪽 카피`처럼 변경 권장

---

## 4.5 신규 우선: 반복 Layout 선택 방지

### 원칙

단순히 Temperature를 높이는 방식만 사용하지 않는다. 운영 재현성과 정책 준수를 위해 서버가 허용 후보와 선택 힌트를 결정한다.

### 신규 v3 적용

1차는 다음 중 결정적 방식을 사용한다.

```text
document/campaign fingerprint
+ sectionRole
+ eligible layout keys
+ recent layout usage
→ preferredLayoutKeys / excludedRecentLayoutKeys
```

- 한 Section에 허용 Layout이 하나뿐이면 그대로 사용
- 두 개 이상이면 직전 사용 Layout을 낮은 우선순위로 전달
- 강제 random 좌표 생성 금지
- 서버가 승인한 Layout Preset 밖의 선택 금지

### 레거시 v2 적용

- 기본 출시는 미적용
- 기존 생성 결과 안정성을 우선한다.
- 필요 시 별도 Feature Flag로 동일 selection hint만 전달한다.
- 기존 Template의 default Layout 의미를 변경하지 않는다.

---

## 4.6 공통: `promo_page_composer` Prompt 거버넌스

### 코드에 유지할 항목

- Contract Version
- 허용 ID와 enum 검증
- Layout allowlist
- `layoutLocked`와 default 강제
- fingerprint
- 반복 선택 hint 계산
- JSON Schema
- 오류 Code

### 설정에서 관리할 항목

- 프로모션 성격에 따른 좌·중·우 선택 기준
- 카피 길이에 따른 Layout 선호
- 이미지의 피사체 위치와 카피 영역 관계
- 같은 Layout 반복을 피하라는 자연어 지침
- 동점 후보 선택 설명

Prompt 변경 절차:

1. `LLM 및 프롬프트 관리 > promo_page_composer`
2. `새 초안 만들기`
3. 기존 `overviewJson`, `candidateSnapshotJson`, `constraintsJson` placeholder 유지
4. Layout 선택 기준 추가
5. 초안 검증
6. Contract v2와 v3 예제 모두 Preview
7. 활성화

신규 Prompt 문장을 JavaScript, Vue, API fallback 또는 SQL Runtime 문자열로 추가하지 않는다.

### 관리자 Catalog 보완

`promo_page_composer`와 `promo_composition_editor`를 `기타`에서 실제 Workflow 그룹으로 이동한다.

권장 표시:

- 그룹: `AI 페이지 구성`
- `promo_page_composer`: `AI 페이지 구성 계획` / `사용자 요청`
- `promo_composition_editor`: `AI 페이지 구성 수정` / `사용자 요청`

Prompt Type 자체는 실행 계약이므로 변경하지 않는다.

---

## 5. 파일별 개발 범위

### 5.1 신규 Registry v3

| 파일 | 작업 |
|---|---|
| `api/_promo-registry-composition-candidates.js` | 허용 Layout 교집합, lock/default 처리, 명시적 allowed keys 반환 |
| `api/_promo-section-composition-contract.js` | v3 Layout 선택 allowlist 검증 강화 |
| `api/_promo-registry-composition-compiler.js` | 선택 Layout 재검증, 새 Style Slot 계약 적용 |
| `api/promo-page-composition-proposals.js` | v3 constraints에 Layout selection hint와 정책 정보 전달 |
| `api/promo-page-composition-apply.js` | Apply 시 동일 후보·정책·fingerprint 재검증 |
| `api/_promo-page-composition-operations.js` | 자연어 Layout 변경도 동일 allowed set 사용 |
| `scripts/test-promo-registry-composition-candidates.js` | AI 비허용·lock·default·empty 테스트 추가 |
| `scripts/test-promo-registry-composition-contract-v3.js` | 비허용 Layout 선택 거부 테스트 추가 |
| `scripts/test-promo-registry-composition-compiler.js` | 제목색/CTA 배경과 Layout 메타데이터 테스트 |

### 5.2 레거시 Template v2

| 파일 | 작업 |
|---|---|
| `api/_promo-page-composition-candidates.js` | 현행 필터 동작 유지, 필요 시 공통 Resolver 사용 |
| `api/_promo-page-composition-contract.js` | `targetProperty` 기반 Style Slot Mapper, 구형 Slot 호환 |
| `api/_promo-page-composition-service.js` | 기존 Prompt 계약과 v2 실행 유지 확인 |
| `scripts/test-promo-page-composition-contract.js` | 기존 Layout 필터와 스타일 매핑 회귀 테스트 |
| `scripts/test-section-layout-preset-runtime.mjs` | 기존 Layout Snapshot 호환 테스트 |

### 5.3 관리자 공통

| 파일 | 작업 |
|---|---|
| `admin-app/src/components/SectionLayoutPresetManager.vue` | Layout 의미 메타데이터, 명확한 `AI 선택 후보` 라벨 |
| `admin-app/src/services/section-layout-preset-service.mjs` | metadata 저장 계약과 allowed set 저장 결과 반영 |
| `prototype/index.html` | Section/Layout 용어 통일, 결합된 AI 정책 라벨 개선 |
| `prototype/app.js` | Prompt 상세 전환 loading/revision 보호, 정책 editor 보완 |
| `admin-app/src/services/prompt-template-group-service.mjs` | Composer/Editor Type Catalog 등록 |
| 컴포넌트 관리 UI | Style Slot의 semanticRole과 targetProperty 편집·검증 UI 추가 |
| `locales/ko.json` 및 Locale seed | 사용자용 한글 명칭 통일 |

### 5.4 데이터·Migration

| 대상 | 작업 |
|---|---|
| 신규 `058_*` | 필요 시 Layout metadata 저장 구조 및 Style Slot targetProperty 보정 기반 추가 |
| Component Version | Hero Title·Primary CTA 새 Draft Version 생성 및 활성화 |
| Section Version | Registry와 레거시 참조 Section을 새 Draft로 생성 후 새 Component Version으로 repin |
| Layout Preset | 좌·중·우 Layout은 관리자 설정에서 작성하며 좌표 SQL seed 추가 금지 |
| Prompt Version | 관리자에서 새 Draft·검증·활성화, Migration으로 active 본문 직접 수정 금지 |

---

## 6. 구현 순서

### Phase 0. 기준선 고정

1. 활성 Composition Shell과 `compositionV3` 환경 상태 기록
2. 활성 Registry Hero/Template Section/Component Version ID 기록
3. 현재 v2·v3 후보 Snapshot fixture 저장
4. 현재 Builder 문서와 Layout Snapshot은 수정하지 않음

### Phase 1. 안전 결함 수정

1. 공통 allowed Layout Resolver 작성
2. v3 후보 Resolver에 허용 교집합 적용
3. `layoutLocked`와 default fail-closed 적용
4. Proposal/Apply/Operation에서 동일 Resolver 사용
5. 신규 테스트 통과

이 Phase는 Layout 다양성을 늘리기 전에 먼저 배포한다. 설정의 `AI 사용 허용`이 신뢰할 수 있어야 다음 단계가 안전하다.

### Phase 2. Style Slot 계약 보완

1. `targetProperty` allowlist 및 Validator 추가
2. 공통 Mapper에서 새 계약 우선 적용
3. 구형 Slot 호환 경로 유지
4. Component 관리 UI 추가
5. 새 Component Draft Version 생성·검증·활성화
6. Registry Section부터 repin 후 레거시 Section 순차 repin

### Phase 3. Layout 다양성 설정

관리자가 `Registry Hero` Draft에서 다음 Layout을 만든다.

- 히어로 · 왼쪽 카피
- 히어로 · 중앙 카피
- 히어로 · 오른쪽 카피

각 Layout은 Desktop과 Mobile을 모두 확인하고 `AI 선택 후보`를 켠다. 하나만 기본으로 지정한다.

### Phase 4. 선택 메타데이터 및 반복 방지

1. Layout metadata 계약 추가
2. 관리자 UI와 API 저장 지원
3. v3 candidate snapshot에 metadata와 selection hint 추가
4. 최근 선택 방지 정책 적용
5. 레거시는 Feature Flag 기본 off

### Phase 5. Prompt와 명칭 정리

1. Prompt Type Catalog 등록
2. `promo_page_composer` 새 Draft 작성
3. v2/v3 예제 변수로 검증
4. 활성화
5. Section/Layout/AI 후보 관련 Locale 명칭 통일

### Phase 6. 통합 검증과 배포

1. v3 생성 반복 테스트
2. v2 Template fallback 테스트
3. 기존 저장 문서 열기·편집·출력 테스트
4. Feature Flag 단계적 활성화
5. 로그와 오류 Code 확인 후 전체 활성화

---

## 7. 테스트 계획

### 7.1 단위 테스트

- 저장 Layout 3개, AI 허용 2개이면 v3 후보는 정확히 2개
- `layoutLocked = true`이면 default 1개만 반환
- default가 없고 lock 상태이면 검증 실패
- AI 허용 목록에 존재하지 않는 Key가 있어도 후보에 포함되지 않음
- 허용 Layout이 0개인 필수 Section은 fail-closed
- v2 현행 후보 결과 유지
- `titleColor + accent-color + colorToken`은 글자색으로 컴파일
- `ctaBackground + accent-color + backgroundColorToken`은 배경색으로 컴파일
- 미허용 targetProperty 저장 거부

### 7.2 Contract 테스트

- v3 Proposal이 비허용 Layout Key 반환 시 거부
- v3 Apply 전 allowed set 변경 시 fingerprint mismatch
- 자연어 수정에서 비허용 Layout 변경 거부
- v2 Contract가 기존 `split-*` 값을 계속 허용
- v2/v3 모두 HTML, CSS, raw 좌표 생성 금지 유지

### 7.3 관리자 브라우저 테스트

- Active Section은 읽기 전용
- 새 초안에서 Layout 생성·편집·기본 지정·AI 후보 전환 가능
- `AI 사용 허용` 해제 후 후보 API에서 즉시 제외
- Component Style Slot targetProperty 편집 및 오류 표시
- Prompt 선택 중 이전 Prompt 상세를 표시하지 않고 loading 상태 표시
- `promo_page_composer`가 `기타`가 아닌 올바른 그룹에 표시
- 좁은 화면에서 설정 탭 접근 가능

### 7.4 End-to-End 시나리오

1. 같은 요청을 최소 10회 생성한다.
2. 허용한 좌·중·우 Layout만 사용되는지 확인한다.
3. 동일 Layout만 강제 반복되지 않는지 확인한다.
4. Layout 선택과 Preview의 실제 정렬이 일치하는지 확인한다.
5. 제목 강조색은 글자색, CTA 강조색은 배경색인지 확인한다.
6. v3 Flag를 끄고 v2 Template Mode 생성이 정상인지 확인한다.
7. 기존 v2/v3 저장 문서를 열고 Renderer 오류가 없는지 확인한다.

---

## 8. 배포·Migration·롤백

### 8.1 배포 순서

1. Migration 058 적용(`selection_metadata` 컬럼 및 Component Draft 보정)
2. 코드 배포와 호환 Validator 활성화
3. 생성되었거나 보정된 Component Draft 검토·활성화
4. Registry Section Draft를 새 Component Version으로 repin 후 우선 활성화
5. 레거시 Template Section을 순차 repin·활성화
6. 관리자에서 좌·중·우 Layout Preset 작성 및 AI 선택 후보 지정
7. 관리자 Prompt Draft 검증·활성화
8. 반복 방지 정책은 최근 선택 이력을 정의한 후 별도 Feature Flag로 단계적 활성화

### 8.2 Migration 원칙

- Migration 056·057을 다시 수정하지 않는다.
- 운영 active/inactive Version row를 직접 업데이트하지 않는다.
- 새 Version과 History를 생성한다.
- Migration은 멱등적으로 작성한다.
- 좌·중·우 Layout 좌표는 운영자가 Live Preview에서 관리하며 SQL에 고정하지 않는다.
- Prompt 본문과 선택 지침은 SQL Migration에 넣지 않는다.

Migration 058보다 현재 코드를 먼저 배포하면 Layout 조회가 존재하지 않는 `selection_metadata` 컬럼을 참조할 수 있다. 따라서 무중단 배포에서는 Migration을 먼저 적용한다.

### 8.3 롤백

- `compositionV3` Flag 비활성화로 v2 fallback 가능
- 새 Component/Section Version 문제 시 이전 Version 재활성화
- Prompt 문제 시 이전 `promo_page_composer` Version으로 롤백
- Layout metadata는 optional이므로 코드 롤백 후에도 기존 Snapshot 파싱 가능
- 기존 Builder Document Snapshot은 변경하지 않았으므로 별도 데이터 복구 불필요

---

## 9. 완료 조건

1. 신규 v3에서 관리자 `AI 사용 허용`과 실제 후보가 일치한다.
2. 신규 v3에서 `AI 레이아웃 변경 허용`을 끄면 default Layout만 사용한다.
3. 레거시 v2의 기존 Template 생성과 fallback이 회귀하지 않는다.
4. 좌·중·우 Layout은 설정 페이지에서 생성·수정·비활성화할 수 있다.
5. 제목 강조색과 CTA 배경색이 의도한 속성에 적용된다.
6. 새 Prompt 자연어가 소스코드에 하드코딩되지 않는다.
7. `promo_page_composer`가 올바른 관리 그룹과 설명으로 표시된다.
8. 기존 저장 문서와 Version History가 유지된다.
9. 단위·Contract·브라우저 테스트와 프로덕션 빌드가 통과하고, 운영 DB E2E는 Migration·설정 활성화 후 통과한다.

---

## 10. 개발 범위 결론

### 신규 Registry v3에서 반드시 개발

- AI 허용 Layout 필터
- Section Layout Lock/default 강제
- 후보·Apply·자연어 수정의 동일 정책 검증
- Layout 의미 메타데이터
- 반복 선택 방지 정책

### 신규·레거시 공통으로 개발

- Style Slot `targetProperty`
- 제목색/CTA 배경색 구분
- Component/Section 새 Version 보정
- Prompt Catalog와 관리자 명칭 정리
- Prompt 상세 비동기 loading 보호

### 레거시에서 유지·검증

- 기존 Layout 허용 필터
- Template 기반 후보와 default 동작
- v2 Contract와 저장 Snapshot
- Registry v3 장애 시 fallback

레거시 코드를 신규 구조로 즉시 통합하거나 삭제하지 않는다. 공통 계약만 안전하게 공유하고, 레거시 결과를 바꾸는 다양성 정책은 별도 Feature Flag와 회귀 검증 이후 적용한다.

---

## 11. 2026-08-14 구현 결과

### 코드 반영 완료

- Registry v3의 관리자 승인 Layout Preset 교집합과 `layoutLocked`/default 강제
- v2 후보 및 자연어 Layout 변경 경로의 공통 허용 정책 사용과 기존 fallback 유지
- Layout 선택 메타데이터 저장 컬럼·API·관리자 편집 UI·Planner Snapshot 전달
- Style Slot `targetProperty` 검증, 신규 계약 우선 적용, 구형 Slot 호환
- Hero Title·Primary CTA 기존 Draft 보정 또는 신규 Draft 생성 Migration
- `promo_page_composer`·`promo_composition_editor` 관리 그룹 등록
- Prompt 상세 전환 중 loading/revision 보호
- 설정 화면의 섹션·레이아웃 프리셋·AI 선택 후보 명칭 통일
- 전체 124개 테스트 파일 및 Admin/Visual Editor 프로덕션 빌드 통과

### 운영 설정 후 완료

- Migration 058 실제 DB 적용
- 보정된 Component Draft 검토·활성화 및 사용 Section Draft repin
- 좌·중·우 Layout Preset을 Live Preview에서 작성하고 AI 선택 후보로 지정
- `promo_page_composer`의 선택 기준 자연어를 설정 페이지에서 Draft로 작성·검증·활성화
- 실제 운영 LLM과 DB를 사용하는 반복 생성 E2E

### 후속 범위

`avoidImmediateRepeat`와 `selectionWeight`는 이번 변경에서 관리·전달 가능한 메타데이터로 구현했다. 사용자별 또는 캠페인별 "최근 선택"의 보존 범위가 아직 정의되지 않았으므로 서버가 과거 선택을 강제로 제외하는 기능은 활성화하지 않는다. 이 기능은 저장 기준과 Feature Flag를 확정한 뒤 별도 배포한다.
