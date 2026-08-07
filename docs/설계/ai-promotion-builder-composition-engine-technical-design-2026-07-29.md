# AI 프로모션 빌더 Composition Engine 개발 설계서

## 0. 문서 정보

- 작성일: 2026-07-29
- 개정일: 2026-08-06
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: Contract v3 Vertical Slice 구현 반영 / 브라우저·운영 E2E 진행 중
- 상위 계획:
  - `docs/계획/ai-page-section-composition-engine-development-plan-2026-07-29.md`
  - `docs/계획/ai-registry-composition-mode-supplement-development-plan-2026-08-04.md`
- 관련 설계·계획:
  - `docs/계획/frontend-platform-unification-and-shared-modules-development-plan-2026-07-24.md`
  - `docs/계획/create-promo-overview-first-template-recommendation-development-plan-2026-07-27.md`
  - `docs/계획/admin-llm-prompt-hardcoding-remediation-development-plan-2026-07-29.md`
- 기준 플랫폼: Vue 3 + Vite + ESM
- 현행 Builder Host: Legacy Template `prototype/create-promo.js` / Registry AI `visual-editor/src/builder/AiBuilderApp.vue`
- 기준 Renderer: `visual-editor/src/PromoPageRenderer.vue`
- 기준 Snapshot 생성기: Registry AI `api/_promo-registry-composition-compiler.js` / Legacy Template `prototype/wizard/wizard-storage.js`

> 현행 우선순위: 이 문서의 기존 Contract v2 내용은 기반 설계와 호환 설명으로 유지한다. 2026-08-06 이후 신규 AI Composition의 최우선 기준은 **25장 Contract v3 구현 현행화**이며, v2와 충돌하는 항목은 25장을 따른다.

### 0.1 이번 개정의 핵심

재검토 결과를 반영해 다음 사항을 확정했다.

1. 기존 템플릿 모드는 Legacy Host로 유지하되 신규 AI 모드는 처음부터 Vue 3 + Vite + ESM으로 구현한다.
2. 신규 프런트엔드 루트를 추가하지 않고 기존 Visual Editor Vite 환경의 멀티 엔트리로 AI Builder를 구성한다.
3. `documentRevision`, `layoutRevision`, `bridgeRevision`을 서로 다른 책임의 revision으로 분리한다.
4. 기존 Section Design Run·Asset Job을 Builder Document와 연결하는 FK와 Target 매핑을 정의한다.
5. 공용 섹션 정책 컬럼 추가 시 초안 복제·활성화·History·Admin/Public API 전체 경로를 함께 변경한다.
6. 인증 사용자가 없을 때 서버가 발급한 서명된 HttpOnly Builder Session으로 `owner_subject`를 결정한다.
7. 페이지 인스턴스 ID 전환 대상을 콘텐츠·스타일·가시성·AI Run·Asset·Editor Command 전체로 확장한다.
8. Prompt Version FK를 실제 구조인 `prompt_templates(id)`에 맞춘다.
9. Proposal의 허용 상태 전이, 취소, 재시도, supersede, 활성 작업 Unique Index를 확정한다.

### 0.2 2026-08-06 현행화 핵심

1. Template ID 없는 Registry Composition Contract v3 Vertical Slice가 구현됐다.
2. active Composition Shell과 Registry Candidate Resolver, pinned Resource, candidate/policy/resource fingerprint가 연결됐다.
3. 결정적 Compiler, 구조 Operation, document revision 충돌, HTML/Vue/React Export가 구현됐다.
4. Hero key visual은 `section-key-visual` Asset을 Hero Section background에 적용하는 계약으로 전환됐다.
5. Overview는 서버 기준 v5이며 CTA source는 `ctaLabel`, 최대 20 Unicode code point다.
6. Section Preset의 Desktop/Mobile geometry, 텍스트, 이미지 URL, 다중 필드 값 저장 경로가 구현됐다.
7. Migration 053과 Seed 004/005가 운영 DB에 적용됐지만 실제 Provider·브라우저·Export parity E2E는 남아 있다.
8. Legacy Template Host의 브라우저 Overview adapter를 v5로 전환해 `ctaLabel` 저장과 browser/server fingerprint parity를 복구했다.
9. Admin·Visual Editor 정적 bundle을 최신 source 기준으로 재생성했다. 릴리스 증거는 프로젝트 기준인 Node 22.x에서 다시 확보해야 한다.

## 1. 설계 목적

프로모션 빌더에 다음 두 제작 방식을 제공한다.

```text
프로모션 빌더
  ├─ 템플릿으로 만들기
  │    └─ 현재 기능과 데이터 흐름 유지
  │
  └─ AI로 만들기
       ├─ 자연어 입력
       ├─ 정형 Overview 확인
       ├─ 공용·필수 섹션 확인
       ├─ AI Composition 생성
       ├─ 공통 Renderer Preview
       ├─ 이미지 비동기 생성
       └─ 자연어 또는 Live Preview 수정
```

AI 모드는 HTML과 CSS를 자유 생성하지 않는다. AI는 활성 섹션·컴포넌트·필드·디자인 토큰·Motion Preset을 선택한 구조화 결과만 반환한다. 공통 Vue Renderer가 실제 HTML DOM과 CSS를 생성한다.

### 1.1 성공 기준

- 템플릿 모드에 기능 회귀가 없다.
- AI 모드는 자연어만으로 첫 편집 가능 화면을 생성한다.
- AI 결과에 Raw HTML, Raw CSS, JavaScript가 없다.
- 관리자에서 활성화한 버전과 정책만 사용한다.
- Header, Footer, T&C, Legal 정책이 강제된다.
- Builder Preview, Layout Editor, Web Output Preview가 동일 Snapshot과 Renderer를 사용한다.
- 이미지 생성 실패가 페이지 구조와 콘텐츠를 손상시키지 않는다.
- 자연어 수정은 전체 페이지 재생성이 아닌 제한된 Operation으로 처리한다.
- 서버 저장 후 새로고침·재접속·롤백이 가능하다.
- 브라우저와 서버가 동일한 Overview v5 정규화·fingerprint를 사용하고 `ctaLabel`을 유실하지 않는다.
- 커밋된 Admin·Visual Editor 정적 bundle이 같은 revision의 소스와 일치한다.
- 수동 DB 복구 사항이 idempotent Migration으로 재현 가능하다.

### 1.2 제외 범위

- 템플릿 모드 전면 재작성
- AI 자유 HTML/CSS 생성
- 새로운 React Renderer
- AI가 Vue SFC 소스코드를 작성하는 기능
- AI가 신규 컴포넌트 정의를 런타임에 생성하는 기능
- 페이지 인스턴스 ID 전환 전 동일 섹션 반복 배치
- Web Output Preview를 곧바로 운영 URL로 게시하는 기능
- 디자인 생성기 `promo_generation_runs`와 Builder Document의 결합
- 이미지 모델 실행을 Composition API 요청 안에서 동기 처리

## 2. 현행 구조와 설계 기준

### 2.1 재사용할 현행 자산

| 영역 | 현행 파일·테이블 | 설계 결정 |
|---|---|---|
| Wizard 흐름 | `prototype/wizard/wizard-flow.js` | 템플릿 모드 유지, AI 모드 Host 분기 추가 |
| 자연어 Overview | `prototype/wizard/promotion-overview.js`, `api/_promo-overview-contract.js`, `api/promo-overview-parse.js` | 서버 v5 기준. Legacy browser adapter v5 parity 복구 필요 |
| 로컬 상태 | `prototype/create-promo.js`, `prototype/wizard/wizard-storage.js` | Contract v2 캐시로 확장 |
| 템플릿 추천 | `api/promo-template-recommendations.js` | 템플릿 모드에서 유지 |
| 템플릿 Composition | `api/promo-template-composition-plan.js` | AI Base Preset Planner로 호환 확장 검토 |
| 섹션 AI | `api/promo-section-composition-plan.js` | 단일 섹션 후속 수정에 재사용 |
| 컴포넌트 Registry | `wizard_item_components`, 버전·필드·인스턴스 | 재사용 |
| 디자인 토큰 | `promo_design_token_sets`, 버전·값 | 프로모션별 선택 |
| Layout Snapshot | `createLayoutSnapshot()`, `_promo-registry-composition-compiler.js` | Legacy는 v2 호환, Registry AI는 v3 Builder Document 생성 |
| Editor Bridge | `editor-bridge.js`, `editor-snapshot-contract.js` | Contract v2 전송 |
| Renderer | `PromoPageRenderer.vue` | 범용 필드 Renderer 유지 |
| 이미지 Job | `promo_section_design_asset_jobs`, 필드 Asset Job | 재사용·문서 revision 연계 |

### 2.2 확인된 현행 제약

1. Builder 상태는 주로 `localStorage`에 저장된다.
2. Web Output Preview도 `localStorage` Snapshot을 읽는다.
3. 섹션·컴포넌트 콘텐츠 경로는 `sectionKey.itemKey`에 의존한다.
4. Renderer의 Vue key도 `sectionKey`, `itemKey`를 사용한다.
5. 동일 섹션 반복 배치 시 콘텐츠·스타일·AI 상태가 충돌한다.
6. 현재 템플릿 Composer의 `layoutCommands`는 빈 배열만 허용한다.
7. 현재 Composer는 새 컴포넌트 인스턴스를 생성하지 않는다.
8. 디자인 토큰은 템플릿이 아니라 프로모션별로 선택한다.
9. 현재 Renderer는 componentKey별 SFC가 아니라 필드 정의 기반 범용 Renderer다.

## 3. 전체 아키텍처

```text
┌──────────────────────────────────────────────────────────────┐
│ Promotion Builder Host                                      │
│  Mode Selection / Natural Brief / Overview Review / Editor  │
└───────────────┬──────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│ Builder Domain Modules                                      │
│  Mode State / Contract v2 / Policy / Operations / API Client│
└───────────────┬──────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│ Composition Backend                                         │
│  Candidate Builder → LLM Planner → Validator → Normalizer    │
│  → Proposal Store → Apply Transaction                       │
└───────────────┬──────────────────────────────┬───────────────┘
                │                              │
                ▼                              ▼
┌───────────────────────────────┐  ┌───────────────────────────┐
│ Builder Document Store        │  │ Asset Job Pipeline        │
│ Document / Version / Operation│  │ Key Visual / Field Image  │
└───────────────┬───────────────┘  └─────────────┬─────────────┘
                │                                │
                └──────────────┬─────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Shared Vue Renderer                                         │
│ Generic Field Renderer + Optional Specialized Renderer      │
└───────────────┬──────────────────────────────────────────────┘
                ├─ Builder Live Preview
                ├─ Admin Layout Editor
                └─ Web Output Preview
```

### 3.1 책임 경계

| 모듈 | 책임 | 금지 |
|---|---|---|
| Builder Host | 화면 전환, 사용자 입력, 진행 상태 | AI 정책 직접 판정 |
| Overview Normalizer | 자연어 분석 결과와 사용자 수정 병합 | 금액·기간 임의 확정 |
| Policy Resolver | 공용·필수·고정 섹션 결정 | LLM 결과 신뢰 |
| Candidate Builder | 활성 버전과 허용 후보 Snapshot 생성 | 비활성 후보 포함 |
| LLM Planner | 후보 중 선택과 콘텐츠 매핑 | Raw HTML/CSS 생성 |
| Validator | Schema·도메인·보안·revision 검증 | 자동 사실값 보정 |
| Normalizer | 기본값과 Contract v2 형태 정규화 | 정책 우회 |
| Document Store | Snapshot·revision·Operation 영속화 | 디자인 생성기 Run 재사용 |
| Renderer | Vue VNode와 DOM 생성 | 알 수 없는 필드 임의 렌더링 |
| Asset Pipeline | 이미지 생성·저장·재시도 | Composition 전체 실패 처리 |

## 4. 사용자 화면 설계

### 4.1 모드 선택 화면

### 화면 요소

```text
프로모션을 어떻게 만들까요?

┌─────────────────────┐  ┌─────────────────────┐
│ 템플릿으로 만들기   │  │ AI로 만들기         │
│ 검증된 템플릿 선택  │  │ 자연어로 자동 구성  │
│ [선택]              │  │ [선택]              │
└─────────────────────┘  └─────────────────────┘
```

### 상태

```ts
type BuilderMode = "template" | "ai";

interface BuilderModeState {
  selectedMode: BuilderMode | null;
  templateDraftAvailable: boolean;
  aiDraftAvailable: boolean;
}
```

### 규칙

- 모드 선택 전 Wizard Step을 표시하지 않는다.
- 템플릿 모드는 기존 `overview → template → layout → output` 흐름을 유지한다.
- AI 모드는 `brief → review → policies → generation → edit → output` 흐름을 사용한다.
- 다른 모드의 초안이 있으면 삭제하지 않는다.
- 현재 편집 결과를 교체해야 하는 경우 확인 Modal을 표시한다.

### 4.2 AI 자연어 입력

### 입력 항목

- 자연어 설명
- 참고자료 메모
- 선택적 마켓 힌트

### UX

- 최소 10자
- 최대 길이는 서버 실행 설정으로 제한
- 예시 문구 제공
- 분석 중 입력 잠금
- 분석 취소 또는 새 요청 시작 가능
- 응답의 `requestFingerprint`와 현재 입력을 비교

### 4.3 정형 Overview 검토

### 기본 필드

| 필드 | 필수 | AI 추론 자동 적용 |
|---|---:|---:|
| title | 예 | 가능 |
| leadText | 아니오 | 가능 |
| ctaLabel | 예 | 가능, 사용자 확인 권장 |
| promotionPurpose | 예 | 가능 |
| market | 예 | 확인 권장 |
| audience | 예 | 가능 |
| campaignTone | 아니오 | 가능 |
| mainOffer | 예 | 확인 필요 가능 |
| startAt | 정책별 | 불가 |
| endAt | 정책별 | 불가 |
| eligibility | 정책별 | 불가 |
| importantTerms | 정책별 | 불가 |

### 필드 상태

```ts
type Provenance =
  | "user-supplied"
  | "admin-locked"
  | "ai-derived"
  | "ai-inferred"
  | "system-default";

interface OverviewFieldDecision {
  field: string;
  provenance: Provenance;
  confidence: number | null;
  reason: string;
  confirmationRequired: boolean;
}
```

`confirmationRequired`인 필드가 미확인 상태면 페이지 생성 버튼을 비활성화하거나 명시적 확인 Checkbox를 요구한다.

현행 CTA 규칙:

- canonical source는 `ctaLabel` 하나다.
- 행동 중심 2~4단어를 권장하고 공백 포함 최대 20 Unicode code point다.
- `title`, `leadText`, `mainOffer`, legacy `primaryAction`을 CTA source로 사용하지 않는다.
- Legacy Template Host와 Vue AI Builder는 서버 Overview v5와 같은 정규화·fingerprint를 사용해야 한다.

### 4.4 공용·필수 섹션 확인

### 항목 표시

- 섹션 이름
- 역할
- 필수·선택 상태
- 고정 위치
- 적용 사유
- 관리자 잠금 여부
- 버전

### 정책 우선순위

```text
법적·마켓 필수 정책
  > 관리자 필수 설정
  > AI 추천
  > 사용자 선택
```

사용자는 `selectionPolicy = optional`인 섹션만 해제할 수 있다.

### 4.5 생성 진행 화면

```ts
type CompositionProgressStage =
  | "analyzing_overview"
  | "resolving_policies"
  | "composing_page"
  | "validating_composition"
  | "render_ready"
  | "generating_assets"
  | "partial_ready"
  | "ready"
  | "failed";
```

`render_ready` 상태가 되면 Live Preview를 즉시 활성화한다. 이미지 영역에는 Skeleton과 대상별 진행 상태를 표시한다.

### 4.6 생성 결과 수정

### 자연어 수정

- 입력창
- 변경 대상 자동 분석
- Operation Diff
- 적용·취소
- revision 충돌 안내

### Live Preview 수정

- 현재 공통 Visual Editor 사용
- 텍스트, 가시성, 위치, 크기, 이미지, 토큰, Motion 수정
- 자연어 Operation과 동일 Builder Document revision 갱신

## 5. 공용 섹션 정책 모델

### 5.1 섹션 역할

```ts
type SectionRole =
  | "header"
  | "footer"
  | "terms"
  | "legal"
  | "responsible-gaming"
  | "hero"
  | "benefit"
  | "content"
  | "cta"
  | "notice";
```

### 5.2 선택 정책

```ts
type SectionSelectionPolicy =
  | "required"
  | "required-by-market"
  | "required-by-purpose"
  | "recommended"
  | "optional";

interface SectionCompositionPolicy {
  scope: "shared" | "template";
  sectionRole: SectionRole;
  selectionPolicy: SectionSelectionPolicy;
  fixedPosition: "top" | "bottom" | null;
  allowedMarkets: string[];
  allowedPromotionPurposes: string[];
  aiEditable: boolean;
  contentLocked: boolean;
  layoutLocked: boolean;
  duplicatePolicy: "forbidden" | "limited";
  maxInstances: number;
  allowedLayoutVariants: string[];
  allowedMotionPresets: string[];
}
```

### 5.3 초기 정책

- Header: 필수, 상단 고정, 중복 금지
- Footer: 필수, 하단 고정, 중복 금지
- T&C: 마켓·목적별 필수, 콘텐츠 잠금
- Legal: 정책별 필수, 콘텐츠 잠금
- Content: 선택 가능, 초기 중복 금지
- CTA: 선택 가능, URL 명시 전 자동 활성화 금지

## 6. Composition Contract v2 기반 설계

> v2는 기존 Template 호환과 초기 Builder Document 기반 계약이다. 신규 Registry AI Composition의 생성·검증·Apply는 25장의 Contract v3 계약을 사용한다.

### 6.1 설계 원칙

- 기존 `createLayoutSnapshot()` 출력 구조를 확장한다.
- 기존 Contract v1 Snapshot을 읽을 수 있어야 한다.
- `content.sectionSnapshot`, `sectionInputs`, `sectionOrder`, `designSpec`, `assets`를 유지한다.
- AI 메타데이터와 provenance는 별도 영역에 둔다.
- 디자인 토큰은 `appearance`에 둔다.
- 자유 HTML/CSS 필드를 두지 않는다.
- Structured Output의 모든 Object Schema는 `additionalProperties: false`를 사용한다.

### 6.2 TypeScript 기준 인터페이스

실제 구현이 JavaScript여도 계약 문서는 TypeScript 형태로 관리한다.

```ts
interface CompositionContractV2 {
  contractVersion: 2;
  documentRevision: number;
  layoutRevision: number;
  layoutIdentity: LayoutIdentity;
  bridgeRevision?: number;
  compositionMeta: CompositionMeta;
  appearance: AppearanceSnapshot;
  content: CompositionContentSnapshot;
  provenance: Record<string, FieldProvenance>;
  designSpec: LayoutDesignSpec;
  motionSpec: MotionSpec;
  assets: CompositionAssets;
  validation: ValidationSnapshot;
}

interface CompositionMeta {
  compositionId: string;
  documentId: string;
  mode: "template" | "ai-base-preset" | "library-based";
  overviewFingerprint: string;
  candidateFingerprint: string;
  proposalId: string;
  sourceTemplateId: string;
  sourceTemplateVersion: number;
  promptTemplateVersionId: string;
  model: string;
  reasoningSummary: string;
}

interface AppearanceSnapshot {
  designTokenSetVersionId: string;
  motionEnabled: boolean;
}

interface CompositionContentSnapshot {
  formTemplate: Record<string, unknown>;
  sectionSnapshot: SectionSnapshot[];
  sectionInputs: Record<string, unknown>;
  sectionOrder: string[];
}

interface FieldProvenance {
  source: Provenance;
  sourceOverviewPath: string;
  confirmationRequired: boolean;
  confirmedAt?: string;
}

interface CompositionAssets {
  contractVersion: 1;
  items: Record<string, unknown>;
  requests: AssetRequest[];
}

interface MotionBinding {
  presetVersionId: string;
  durationToken: string;
  easingToken: string;
  delayToken: string;
}

interface MotionSpec {
  sections: Record<string, MotionBinding>;
  items: Record<string, MotionBinding>;
}
```

### 6.3 Revision 계약

세 revision은 서로 다른 대상을 나타내며 대체해서 사용하지 않는다.

| 필드 | 책임 | 변경 시점 | 비교 위치 |
|---|---|---|---|
| `documentRevision` | 사용자 Builder Document 저장 버전 | AI·수동 Operation Apply, rollback | Document API·Operation |
| `layoutRevision` | 관리자 템플릿 기본 Layout 버전 | 관리자 Layout 저장·활성화 | Template Layout API |
| `bridgeRevision` | Host와 iframe 메시지 순서 | Snapshot·Change postMessage | Editor Bridge |

규칙:

- 현재 Visual Editor가 사용하는 top-level `layoutRevision`, `layoutIdentity`를 유지한다.
- `documentRevision`이 증가해도 관리자 `layoutRevision`은 자동 증가하지 않는다.
- 관리자 Layout이 바뀌어 `layoutRevision`이 증가해도 사용자 Document를 자동 덮어쓰지 않는다.
- `bridgeRevision`은 영속 버전이 아니며 브라우저 메시지 순서 검증에만 사용한다.
- Apply는 `documentRevision`, `overviewFingerprint`, 후보가 참조한 `layoutRevision`을 각각 검증한다.

```ts
interface LayoutIdentity {
  contractVersion: number;
  templateId: string;
  templateKey: string;
  templateVersion: number;
  layoutId: string;
  layoutRevision: number;
  configRevision: string;
  rendererKey: string;
  rendererVersion: number;
}
```

### 6.4 초기 ID와 경로

P2까지 기존 경로를 유지한다.

```text
section content: sectionKey.itemKey
field content:   sectionKey.itemKey.fields.fieldKey
item style:      sectionKey.itemKey
field style:     sectionKey.itemKey.fieldKey
```

따라서 다음을 금지한다.

- 동일 `sectionKey` 반복
- 동일 섹션 내 동일 `itemKey` 반복

P3 이후 페이지 인스턴스 ID로 전환한다.

```ts
interface PageSectionInstance {
  pageSectionInstanceId: string;
  sourceSectionId: string;
  sourceSectionVersion: number;
  instanceKey: string;
}

interface PageComponentInstance {
  pageComponentInstanceId: string;
  sourceDefinitionInstanceId: string;
  componentVersionId: string;
  instanceKey: string;
}
```

전환 대상:

- `content.sectionInputs`
- `content.sectionOrder`
- `designSpec.sectionStyles`
- `designSpec.itemStyles`
- `designSpec.visibility`
- `sectionDesignRuns`
- Asset Request와 Asset Result Target
- Vue `:key`, `data-section-key`, `data-item-key`
- Editor 선택 상태
- Drag·Resize·Align Command Target
- 자연어 Operation Target
- Usage Event의 `target_key`

전환은 위 항목을 하나의 Contract Version 변경으로 처리한다. 일부만 인스턴스 ID로 바꾸는 혼합 저장은 금지한다.

### 6.5 Contract v1 호환

```text
Contract v1 Snapshot
  → detect version
  → V1 Compatibility Adapter
  → Contract v2 default metadata
  → current Renderer
```

호환 Adapter는 저장 시 자동으로 v2로 덮어쓰지 않는다. 사용자가 명시적으로 저장하거나 Migration할 때 새로운 revision을 만든다.

## 7. Composition Proposal 계약

### 7.1 Planner 입력

```json
{
  "requestId": "uuid",
  "documentId": "uuid",
  "baseDocumentRevision": 0,
  "overview": {},
  "overviewFingerprint": "sha256",
  "candidateFingerprint": "sha256",
  "aiBasePreset": {},
  "resolvedSectionPolicies": [],
  "candidateSections": [],
  "candidateComponents": [],
  "candidateTokenSets": [],
  "candidateMotionPresets": [],
  "constraints": {
    "allowDuplicateSections": false,
    "allowNewComponentInstances": false,
    "allowFreeLayoutCommands": false
  }
}
```

LLM에 전달하는 후보는 최대 개수를 제한하고, 설명보다 ID·역할·필수 필드·허용값 중심으로 압축한다.

### 7.2 Planner 출력

```json
{
  "designTokenSetVersionId": "uuid",
  "sections": [
    {
      "sectionId": "uuid",
      "sectionKey": "promotionIntro",
      "visible": true,
      "sortOrder": 20,
      "layoutVariant": "text-left-visual-right",
      "motionPreset": "fade-up",
      "components": [
        {
          "definitionInstanceId": "uuid",
          "componentVersionId": "uuid",
          "visible": true,
          "sortOrder": 10,
          "contentMappings": [
            {
              "fieldKey": "title",
              "sourceOverviewPath": "title"
            }
          ],
          "tokenBindings": {
            "title.typography": "--app-font-size-title"
          }
        }
      ],
      "assetRequests": [
        {
          "targetType": "section-key-visual",
          "targetKey": "promotionIntro",
          "purpose": "key-visual"
        }
      ]
    }
  ],
  "missingInputs": [],
  "warnings": [],
  "reasoningSummary": "..."
}
```

### 7.3 자동 적용 기준

```ts
function canAutoApply(proposal): boolean {
  return proposal.validation.ok
    && proposal.missingInputs.length === 0
    && proposal.warnings.every(isNonBlockingWarning)
    && proposal.confirmationRequiredFields.length === 0
    && proposal.policyOverrides.length === 0;
}
```

자동 적용 불가 조건:

- AI 추론 사실값 미확인
- 필수 입력 누락
- CTA URL 누락
- Legal/T&C 정책 변경
- 잠금 정책 충돌
- stale fingerprint 또는 revision
- library-based 자유 조합

### 7.4 Fingerprint

```text
overviewFingerprint
  = SHA-256(stableJson(normalizedOverview))

candidateFingerprint
  = SHA-256(stableJson({
      contractVersion,
      basePresetId/version,
      sectionIds/versions/policies,
      componentDefinitionInstanceIds/componentVersionIds,
      tokenSetVersionIds,
      motionPresetVersionIds,
      promptTemplateVersionId
    }))
```

표시 이름이나 설명 문구만 변경된 경우까지 무조건 stale 처리할지 여부는 P0 Fixture로 결정한다. 최소한 ID, 활성 버전, 잠금, 필수 정책, 허용 Slot 변경은 fingerprint에 포함한다.

### 7.5 초기 안전 한계

서버 상수로 시작하고 운영 지표에 따라 조정한다.

- 후보 템플릿: 최대 5개
- Composition 섹션: 최대 30개
- 섹션별 컴포넌트: 최대 50개
- 전체 콘텐츠 매핑: 최대 100개
- 한 번의 자연어 수정 Operation: 최대 20개
- LLM 자동 복구: 최대 1회
- Provider 재시도: 일시 오류에 한해 최대 2회

관리자 Prompt에서 이 값을 늘릴 수 없으며 운영 안전 설정에서만 변경한다.

## 8. Validator 설계

### 8.1 검증 순서

```text
1. JSON Schema
2. Candidate Membership
3. Active Version
4. Section Policy
5. Component Policy
6. Content Provenance
7. Token Binding
8. Layout Variant
9. Motion Preset
10. Asset Target
11. Security
12. Revision/Fingerprint
13. Renderer Normalization
```

### 8.2 오류 구조

```ts
interface CompositionValidationError {
  code: string;
  path: string;
  message: string;
  severity: "error" | "warning";
  allowedValues?: unknown[];
}
```

주요 오류 코드:

- `CONTRACT_VERSION_UNSUPPORTED`
- `UNKNOWN_SECTION`
- `DUPLICATE_SECTION_KEY`
- `INACTIVE_SECTION_VERSION`
- `REQUIRED_SECTION_MISSING`
- `FIXED_SECTION_POSITION_CHANGED`
- `UNKNOWN_COMPONENT_INSTANCE`
- `LOCKED_COMPONENT_CHANGED`
- `REQUIRED_COMPONENT_MISSING`
- `INVALID_CONTENT_MAPPING`
- `UNCONFIRMED_FACTUAL_CONTENT`
- `INVALID_TOKEN_BINDING`
- `INVALID_LAYOUT_VARIANT`
- `INVALID_MOTION_PRESET`
- `INVALID_ASSET_TARGET`
- `OVERVIEW_FINGERPRINT_MISMATCH`
- `CANDIDATE_FINGERPRINT_MISMATCH`
- `DOCUMENT_REVISION_MISMATCH`

### 8.3 자동 보정

허용:

- sortOrder 간격 정규화
- 선택값이 없는 안전한 기본 Motion `none`
- 선택적 필드 빈 값 정규화
- Renderer용 기본 가시성

금지:

- 금액·기간·조건 생성
- CTA URL 생성
- 잠긴 콘텐츠 변경
- 필수 섹션 임의 대체
- 알 수 없는 토큰을 유사 토큰으로 변경

## 9. Renderer 설계

### 9.1 기본 구조

```text
PromoPageRenderer
  → Section Renderer
    → Component Frame
      → Generic Field Renderer
        ├─ Text
        ├─ Image Frame
        └─ CTA
```

관리자가 생성한 일반 컴포넌트는 전용 SFC 없이 필드 정의로 출력한다.

### 9.2 필드 Renderer Registry

```js
const fieldRenderers = {
  text: TextFieldRenderer,
  image: ImageFieldRenderer,
  cta: CtaFieldRenderer
};
```

특수 UI만 선택적 `rendererKey`를 사용한다.

```js
const specializedRenderers = {
  carousel: CarouselRenderer,
  rankingTable: RankingTableRenderer
};
```

알 수 없는 `fieldKind` 또는 `rendererKey`는 임의 HTML로 Fallback하지 않는다. 편집 모드에서는 오류 Placeholder, 출력 모드에서는 안전한 비노출 또는 명시적 렌더 오류를 사용한다.

### 9.3 시맨틱 HTML

```ts
type SemanticRole =
  | "page-title"
  | "section-title"
  | "subheading"
  | "paragraph"
  | "navigation-link"
  | "action";
```

매핑:

- `page-title` → `h1`
- `section-title` → `h2`
- `subheading` → `h3`
- `paragraph` → `p`
- `navigation-link` → `a`
- `action` → `button` 또는 안전한 `a`

AI는 HTML 태그를 직접 반환하지 않는다.

### 9.4 Motion 적용

Renderer는 Motion Preset을 CSS class와 Token variable로 변환한다.

```text
fade-up
  → class: motion-fade-up
  → --motion-duration
  → --motion-easing
  → --motion-delay
```

`prefers-reduced-motion: reduce`에서는 transform과 transition을 제거하거나 최소화한다.

## 10. 자연어 수정 Operation

### 10.1 허용 Operation

```ts
type CompositionOperation =
  | UpdateFieldOperation
  | SetVisibilityOperation
  | MoveSectionOperation
  | MoveComponentOperation
  | ChangeLayoutVariantOperation
  | ChangeTokenBindingOperation
  | ChangeMotionPresetOperation
  | RequestAssetRegenerationOperation;
```

### 10.2 공통 계약

```ts
interface BaseOperation {
  operationId: string;
  type: string;
  baseDocumentRevision: number;
  targetInstanceId: string;
  reason: string;
}
```

### 10.3 적용 순서

```text
자연어 수정 입력
  → 대상 후보와 현재 Snapshot 구성
  → promo_composition_editor 실행
  → Operation Schema 검증
  → 정책·revision 검증
  → Diff Preview
  → 자동 적용 또는 사용자 승인
  → Transaction 저장
  → Renderer 갱신
```

### 10.4 이미지 재생성

`request-asset-regeneration`은 기존 이미지를 즉시 삭제하지 않는다.

```text
현재 이미지 유지
  → 새 Asset Job 생성
  → 생성 성공
  → 새 revision에 교체 적용
  → 이전 Asset 참조 보존
```

## 11. API 설계

### 11.1 공통 규칙

- JSON 요청·응답
- `Cache-Control: no-store`
- 모든 변경 요청은 인증·문서 소유권 검사
- `Idempotency-Key` 또는 body `idempotencyKey` 필수
- Apply와 Operation 요청은 `baseDocumentRevision` 필수
- 오류 응답은 `error`, `code`, `message`, `details` 사용
- 서버가 후보 Snapshot을 다시 조회하고 클라이언트 후보를 신뢰하지 않음

### 11.2 Builder Document

#### `POST /api/promo-builder-session`

- 인증 사용자가 없을 때 서명된 HttpOnly 익명 Builder Session을 발급한다.
- 이미 유효한 Session이 있으면 재사용한다.
- 응답에 원본 Session Secret이나 `owner_subject`를 노출하지 않는다.

응답:

```json
{
  "ok": true,
  "session": {
    "authenticated": false,
    "expiresAt": "2026-08-05T00:00:00.000Z"
  }
}
```

#### `POST /api/promo-builder-documents`

요청:

```json
{
  "mode": "ai",
  "idempotencyKey": "uuid"
}
```

응답 `201`:

```json
{
  "ok": true,
  "document": {
    "id": "uuid",
    "mode": "ai",
    "status": "draft",
    "currentDocumentRevision": 0
  }
}
```

#### `GET /api/promo-builder-documents?documentId=...`

현재 문서와 current revision Snapshot을 반환한다.

### 11.3 Composition Proposal

#### `POST /api/promo-page-composition-proposals`

요청:

```json
{
  "documentId": "uuid",
  "baseDocumentRevision": 0,
  "overview": {},
  "overviewFingerprint": "sha256",
  "selectedOptionalSectionIds": [],
  "confirmedFieldPaths": [],
  "idempotencyKey": "uuid"
}
```

응답 `202`:

```json
{
  "ok": true,
  "proposal": {
    "id": "uuid",
    "status": "queued",
    "baseDocumentRevision": 0,
    "pollAfterMs": 1500
  }
}
```

#### `GET /api/promo-page-composition-proposals?proposalId=...`

상태 Polling 응답:

```json
{
  "ok": true,
  "proposal": {
    "id": "uuid",
    "status": "ready",
    "baseDocumentRevision": 0,
    "autoApplicable": true,
    "snapshot": {},
    "validation": {},
    "missingInputs": [],
    "warnings": []
  }
}
```

#### `DELETE /api/promo-page-composition-proposals?proposalId=...`

- `queued`, `processing`, `ready` Proposal을 `cancelled`로 전환한다.
- `processing` Worker가 이후 결과를 저장하지 못하도록 상태와 lease를 무효화한다.
- `applied`, `superseded`, 기존 `cancelled` Proposal은 멱등 응답하거나 정책에 맞는 409를 반환한다.

#### `POST /api/promo-page-composition-process`

- 사용자 브라우저가 직접 호출하지 않는 내부 작업 Endpoint다.
- 서명된 내부 Worker Token을 검증한다.
- `queued`, 재시도 가능한 `failed` 상태만 점유한다.
- lease를 획득한 Worker만 결과를 저장한다.
- 동일 Proposal에 대한 동시 LLM 실행을 차단한다.

### 11.4 Apply

#### `POST /api/promo-page-composition-apply`

요청:

```json
{
  "documentId": "uuid",
  "proposalId": "uuid",
  "baseDocumentRevision": 0,
  "idempotencyKey": "uuid"
}
```

응답:

```json
{
  "ok": true,
  "documentId": "uuid",
  "revision": 1,
  "snapshot": {},
  "assetJobs": []
}
```

### 11.5 Operation

#### `POST /api/promo-page-composition-operations`

- 자연어 Operation 제안 생성과 적용을 별도 action으로 구분한다.
- `action = propose`는 Diff를 반환한다.
- `action = apply`는 revision을 증가시킨다.

### 11.6 Rollback

#### `POST /api/promo-page-composition-rollback`

이전 Snapshot을 복사해 새로운 revision을 생성한다. 과거 Version row를 수정하지 않는다.

### 11.7 상태 코드

| 상태 | 의미 |
|---:|---|
| 200 | 조회·동기 처리 성공 |
| 201 | 문서 생성 |
| 202 | 비동기 작업 접수 |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 문서 접근 권한 없음 |
| 404 | 문서·Proposal 없음 |
| 409 | fingerprint·revision·idempotency 충돌 |
| 422 | Schema·정책 검증 실패 |
| 429 | 실행 제한 |
| 500 | 서버 오류 |
| 503 | Provider 또는 작업 실행기 일시 오류 |

### 11.8 서버리스 실행 정책

```text
Browser
  → POST Proposal
  → DB queued 저장
  → signed Worker trigger
  → 202 반환

Worker
  → lease 획득
  → Candidate Snapshot 확인
  → LLM Planner
  → Validate / Normalize
  → ready 또는 failed 저장

Browser
  → GET Proposal Polling
```

- Proposal 생성 요청에서 LLM 완료를 기다리지 않는다.
- Worker URL은 서버 설정의 same-origin 또는 명시적 allowlist만 허용한다.
- Worker Trigger 요청 Body에는 Proposal ID만 전달한다.
- Provider timeout과 Function `maxDuration`은 별도로 설정한다.
- 네트워크·429·5xx는 제한된 횟수로 재시도한다.
- Schema·정책 422는 같은 입력으로 자동 재시도하지 않는다.
- lease 만료 작업은 `next_retry_at` 이후 다른 Worker가 인계할 수 있다.

## 12. DB 설계

정확한 Migration 번호는 구현 시작 시 최신 번호를 재확인한다. 현재 기준 후보는 044 이후다.

### 12.1 공용 섹션 정책

```sql
alter table wizard_content_sections
  add column if not exists composition_scope text not null default 'template',
  add column if not exists section_role text not null default 'content',
  add column if not exists composition_policy jsonb not null default '{}'::jsonb;

alter table wizard_content_sections
  drop constraint if exists wizard_content_sections_composition_scope_chk;

alter table wizard_content_sections
  add constraint wizard_content_sections_composition_scope_chk
    check (composition_scope in ('shared', 'template'));

alter table wizard_content_sections
  drop constraint if exists wizard_content_sections_section_role_chk;

alter table wizard_content_sections
  add constraint wizard_content_sections_section_role_chk
    check (section_role in (
      'header', 'footer', 'terms', 'legal', 'responsible-gaming',
      'hero', 'benefit', 'content', 'cta', 'notice'
    ));
```

CHECK와 JSON 검증은 API와 DB 양쪽에서 적용한다.

컬럼 추가만으로 Migration을 완료하지 않는다. 현재 초안 Clone 함수가 INSERT 컬럼을 명시하므로 다음 경로를 같은 Migration에서 갱신한다.

```text
clone_wizard_content_section_draft()
  - composition_scope 복사
  - section_role 복사
  - composition_policy 복사

activate_wizard_content_section()
  - 정책 Schema 검증
  - 필수 fixedPosition 검증
  - shared section의 owner 정책 검증

wizard_content_section_histories / audit
  - 변경 전후 정책 Snapshot 기록

Admin Section API
  - 초안 저장·조회·복제에 정책 포함

Public Section API
  - 활성 버전의 공개 가능한 정책만 반환
```

초안 복제, 활성화, 비활성화, Archive 이후에도 정책이 유실되지 않는 계약 테스트를 Migration 완료 조건으로 둔다.

### 12.2 Builder Document

```sql
create table promo_builder_documents (
  id uuid primary key default gen_random_uuid(),
  document_key text not null unique,
  mode text not null check (mode in ('template', 'ai')),
  status text not null check (status in ('draft', 'ready', 'published', 'archived')),
  owner_subject text not null,
  current_document_revision integer not null default 0 check (current_document_revision >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

`owner_subject`는 클라이언트가 임의 지정하지 않는다. 인증 주체 또는 서버가 발급한 Builder session 주체에서 결정한다.

### 12.3 Proposal

```sql
create table promo_builder_composition_proposals (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references promo_builder_documents(id) on delete cascade,
  request_id text not null,
  base_document_revision integer not null,
  overview_fingerprint text not null,
  candidate_fingerprint text not null,
  source_template_id uuid references wizard_form_templates(id) on delete set null,
  source_template_version integer,
  contract_version integer not null,
  request_snapshot jsonb not null,
  candidate_snapshot jsonb not null,
  proposal_snapshot jsonb,
  validation_json jsonb not null default '{}'::jsonb,
  status text not null check (status in (
    'queued', 'processing', 'ready', 'failed',
    'applied', 'superseded', 'cancelled'
  )),
  prompt_template_id uuid references prompt_templates(id) on delete set null,
  idempotency_key text not null,
  current_attempt integer not null default 0,
  max_attempts integer not null default 3,
  lease_token text,
  lease_expires_at timestamptz,
  next_retry_at timestamptz,
  error_code text not null default '',
  error_message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status not in ('ready', 'applied') or proposal_snapshot is not null),
  unique(document_id, idempotency_key)
);
```

동일 문서에는 동시에 하나의 활성 Worker Proposal만 허용한다.

```sql
create unique index promo_builder_composition_proposals_active_uidx
  on promo_builder_composition_proposals(document_id)
  where status in ('queued', 'processing');
```

Overview가 변경된 새 요청을 생성할 때 기존 `queued` Proposal은 `cancelled`, 기존 `ready` Proposal은 `superseded`로 전환한다. `processing` Proposal은 즉시 삭제하지 않고 취소 요청을 기록하며 Worker 완료 저장 시 현재 요청과 일치하는지 다시 확인한다.

새 Proposal 생성 Transaction은 기존 활성 Proposal을 `cancelled`로 전환한 뒤 신규 `queued` Row를 Insert해 Partial Unique Index 충돌을 방지한다.

현재 Prompt Version은 별도 Version 테이블이 아니라 `prompt_templates`의 immutable version row이므로 DB FK는 `prompt_template_id`로 정의한다. API와 Snapshot의 `promptTemplateVersionId`는 이 Row ID를 의미한다.

`request_snapshot`, `candidate_snapshot`, `prompt_template_id`는 queued 저장 시 고정한다. Worker는 실행 시점의 관리자 설정을 다시 조립하지 않는다. Apply 단계에서는 현재 활성 정책과 비교해 stale Proposal을 거부한다.

작업 조회용 Index:

```sql
create index promo_builder_composition_proposals_work_idx
  on promo_builder_composition_proposals(status, next_retry_at, lease_expires_at);
```

허용 상태 전이:

```text
queued      → processing
queued      → cancelled
processing  → ready
processing  → failed
processing  → cancelled
failed      → queued
ready       → applied
ready       → superseded
ready       → cancelled
```

금지:

- `applied`에서 다른 상태로 변경
- `superseded` Proposal 재적용
- `cancelled` Proposal 재실행
- `max_attempts` 초과 후 `failed → queued`

상태 변경은 다음과 같은 조건부 원자 갱신으로 처리한다.

```sql
update promo_builder_composition_proposals
set status = 'processing',
    current_attempt = current_attempt + 1,
    lease_token = gen_random_uuid(),
    lease_expires_at = now() + interval '2 minutes'
where id = $1
  and status in ('queued', 'failed')
  and current_attempt < max_attempts
  and (next_retry_at is null or next_retry_at <= now())
  and (lease_expires_at is null or lease_expires_at < now())
returning *;
```

Worker의 `ready` 또는 `failed` 저장도 `where status = 'processing' and lease_token = $token` 조건을 사용한다. 취소되거나 lease를 잃은 Worker 결과는 현재 Proposal에 저장하지 않는다.

### 12.4 Version

```sql
create table promo_builder_document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references promo_builder_documents(id) on delete cascade,
  proposal_id uuid references promo_builder_composition_proposals(id) on delete set null,
  revision integer not null check (revision > 0),
  contract_version integer not null,
  snapshot_json jsonb not null,
  snapshot_hash text not null,
  change_note text not null default '',
  source text not null check (source in ('template', 'ai', 'manual', 'rollback')),
  applied_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(document_id, revision)
);
```

### 12.5 Operation

```sql
create table promo_builder_document_operations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references promo_builder_documents(id) on delete cascade,
  operation_id text not null,
  base_document_revision integer not null,
  applied_revision integer,
  operation_type text not null,
  target_instance_id text not null,
  operation_json jsonb not null,
  source text not null check (source in ('ai', 'manual', 'system')),
  created_at timestamptz not null default now(),
  unique(document_id, operation_id)
);
```

### 12.6 Motion Preset

```sql
create table promo_motion_presets (
  id uuid primary key default gen_random_uuid(),
  preset_key text not null unique,
  name text not null,
  status text not null check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table promo_motion_preset_versions (
  id uuid primary key default gen_random_uuid(),
  preset_id uuid not null references promo_motion_presets(id) on delete restrict,
  version integer not null,
  status text not null check (status in ('draft', 'active', 'inactive', 'archived')),
  config_json jsonb not null,
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(preset_id, version)
);
```

Preset별 활성 버전은 Partial Unique Index로 1개만 허용한다.

### 12.7 Transaction

Apply Transaction:

```text
BEGIN
  → document FOR UPDATE
  → owner 검사
  → base_document_revision 비교
  → proposal status/revision/fingerprint 비교
  → 활성 버전·잠금·정책 재검증
  → new revision 계산
  → document_versions insert
  → document current_document_revision update
  → proposal applied update
  → operations 기록
COMMIT
```

Asset Job 생성은 Transaction 이후 수행하되, 생성 요청을 Outbox 또는 재시도 가능한 상태로 기록한다.

## 13. 백엔드 모듈 설계

### 13.1 신규 모듈 후보

```text
api/
  _promo-page-composition-contract.js
  _promo-page-composition-policy.js
  _promo-page-composition-candidates.js
  _promo-page-composition-normalizer.js
  _promo-page-composition-validator.js
  _promo-page-composition-operations.js
  _promo-builder-auth.js
  _promo-builder-document-store.js
  promo-builder-session.js
  promo-builder-documents.js
  promo-page-composition-proposals.js
  promo-page-composition-process.js
  promo-page-composition-apply.js
  promo-page-composition-operations.js
  promo-page-composition-rollback.js
```

### 13.2 기존 모듈 수정 후보

```text
api/_promo-overview-contract.js
  - 기간·조건 등 확인 필요 필드 확장

api/_prompt-execution-snapshot.js
  - promo_page_composer
  - promo_composition_editor

api/_wizard-content-sections-store.js
  - composition policy 조회·정규화

api/_wizard-form-templates-store.js
  - AI Base Preset Snapshot

api/_promo-template-composition-contract.js
  - 기존 템플릿 모드 호환 유지
  - 공통 후보·검증 Helper 분리

api/_promo-section-design-store.js
  - Builder Document·revision·asset request 참조

api/promo-section-design-runs.js
api/promo-section-design-asset-process.js
  - Builder Target 재검증과 늦은 결과 적용 차단
```

### 13.3 의존 방향

```text
Handler
  → Store / Candidate Builder
  → Contract / Policy / Validator
  → Provider
```

Contract와 Validator가 Handler 또는 DB Store를 import하지 않도록 순수 모듈로 유지한다.

## 14. 프런트엔드 모듈 설계

### 14.1 플랫폼 적용 결정

```text
create-promo.html
  → builder-bootstrap.js
      ├─ mode 미선택 → Vue BuilderModeSelector
      ├─ mode=template → 기존 create-promo.js Legacy Host
      └─ mode=ai → Vue 3 AiBuilderApp
```

- 신규 AI 모드는 첫 구현부터 Vue 3 + Vite + ESM을 사용한다.
- 기존 템플릿 모드는 현재 Vanilla JavaScript 구현을 유지한다.
- 신규 `frontend/` 루트를 만들지 않고 기존 Visual Editor Vite 환경을 멀티 엔트리로 확장한다.
- Vue AI Builder와 기존 Visual Editor는 동일 Composition ESM과 Renderer를 import한다.
- Legacy Template Host는 Compatibility Adapter를 통해 같은 Contract를 사용하도록 점진 전환한다.

### 14.2 Vite 멀티 엔트리 구조

```text
visual-editor/
  src/
    main.js                         # 기존 Visual Editor entry
    builder/
      main.js                       # 신규 AI Builder entry
      AiBuilderApp.vue
      BuilderModeSelector.vue
      AiBriefPanel.vue
      OverviewReviewForm.vue
      SharedSectionSelector.vue
      CompositionProgress.vue
      CompositionReview.vue
      NaturalLanguageEditor.vue
      OperationDiffDialog.vue
      state/
        ai-builder-store.mjs
      services/
        composition-client.mjs
    shared/
      composition/
        composition-contract-v2.mjs
        composition-state.mjs
        composition-operations.mjs
        composition-progress.mjs
        shared-section-policy.mjs
      PromoPageRenderer.vue
```

Vite Build는 기존 Visual Editor와 AI Builder 두 Entry를 생성한다. 공통 Chunk에는 Renderer와 Composition 모듈을 포함한다.

```text
prototype/visual-editor-assets/*
prototype/ai-builder-assets/*
```

`prototype/wizard/`에는 기존 템플릿 모드가 사용하는 Compatibility Adapter만 유지한다. 신규 AI 기능의 원본 구현을 `prototype/wizard/`와 Vue Source에 중복 작성하지 않는다.

### 14.3 Bootstrap 규칙

- URL mode를 기준으로 한 모드만 초기화한다.
- `mode=template`에서 AI Bundle을 로드하지 않는다.
- `mode=ai`에서 Legacy `create-promo.js`의 자동 초기화를 실행하지 않는다.
- 모드 미선택 화면은 Vue Mode Selector만 로드한다.
- 기존 저장 Key와 AI Builder 저장 Key를 분리한다.
- CSP와 배포 Asset 경로는 현재 Vite Bundle 정책을 따른다.

### 14.4 상태 구조

```ts
interface AiBuilderState {
  documentId: string;
  documentRevision: number;
  layoutRevision: number;
  bridgeRevision: number;
  mode: "ai";
  stage: CompositionProgressStage;
  naturalLanguage: string;
  overviewDraft: Record<string, unknown> | null;
  overviewFingerprint: string;
  confirmedFieldPaths: string[];
  resolvedPolicies: unknown[];
  selectedOptionalSectionIds: string[];
  proposal: unknown | null;
  snapshot: CompositionContractV2 | null;
  assetJobs: Record<string, unknown>;
  error: null | {
    code: string;
    message: string;
  };
}
```

### 14.5 Editor Bridge

Contract v2를 iframe에 전달할 때 다음을 포함한다.

```json
{
  "type": "promo-editor-snapshot",
  "bridgeRevision": 12,
  "documentId": "uuid",
  "documentRevision": 3,
  "layoutRevision": 7,
  "snapshot": {}
}
```

Editor 변경 이벤트:

```json
{
  "type": "promo-editor-change",
  "baseDocumentRevision": 3,
  "baseBridgeRevision": 12,
  "operationId": "uuid",
  "operations": []
}
```

Host는 Document와 Bridge revision이 모두 일치할 때만 반영한다. 관리자 Layout revision이 바뀐 경우 자동 병합하지 않고 새 기본 Layout 적용 또는 현재 사용자 Layout 유지 여부를 별도 처리한다.

## 15. 이미지 Asset Job 설계

### 15.1 대상

```ts
type AssetTargetType =
  | "section-key-visual"
  | "component-field-image";
```

위 값은 Composition Domain 용어다. 기존 Asset Job DB Target과 다음처럼 매핑한다.

| Composition Target | 기존 Run·Job 생성 | 기존 DB Target |
|---|---|---|
| `section-key-visual` | 대상 섹션의 `promo_section_design_runs` 생성 또는 재사용 | `section-background` |
| `component-field-image` | 대상 섹션 Run 생성 또는 재사용 | `item` + `component_instance_id` + `target_field_key` |

AI 모드가 별도 이미지 Job Pipeline을 중복 구축하지 않는다. 기존 Run의 request mode, Prompt Snapshot, lease, retry, Blob 저장, 결과 검증을 재사용한다.

### 15.2 기존 Run의 Builder 연결

`promo_section_design_asset_jobs.run_id`는 필수 FK이므로 Builder Document를 Job에 직접 연결하는 것만으로는 충분하지 않다. `promo_section_design_runs`에 Builder 문서 참조를 추가한다.

```sql
alter table promo_section_design_runs
  add column if not exists builder_document_id uuid
    references promo_builder_documents(id) on delete set null,
  add column if not exists builder_document_revision integer,
  add column if not exists page_section_instance_id text,
  add column if not exists page_component_instance_id text,
  add column if not exists builder_asset_request_id text;
```

초기 Contract v2 호환 기간에는 `page_section_instance_id` 대신 `section_key_snapshot`, `page_component_instance_id` 대신 기존 Item·Component Target을 함께 기록할 수 있다.

제약:

- `builder_document_id`가 있으면 `builder_document_revision`과 `builder_asset_request_id`가 필수다.
- 동일 Builder Asset Request의 중복 Run을 Unique Index로 방지한다.
- 디자인 생성기·기존 섹션 AI Run은 `builder_document_id`가 null인 상태로 계속 동작한다.
- Asset 결과 적용 시 Run의 Builder 참조와 현재 Document를 비교한다.

```sql
create unique index promo_section_design_runs_builder_asset_uidx
  on promo_section_design_runs(builder_document_id, builder_asset_request_id)
  where builder_document_id is not null
    and builder_asset_request_id is not null;
```

### 15.3 문서 연계

Asset Job Snapshot에 다음 값을 고정한다.

- `documentId`
- `documentRevision`
- `pageSectionInstanceId` 또는 초기 `sectionKey`
- `pageComponentInstanceId` 또는 초기 `itemKey`
- `fieldKey`
- `designTokenSetVersionId`
- `promptTemplateVersionId`
- `backgroundColor`
- `fadeMode`
- `imageSize`

### 15.4 늦게 도착한 결과

이미지 결과 적용 전에 다음을 확인한다.

```text
document exists
AND target exists
AND target still allows AI image
AND current revision is compatible
AND current asset request id matches
```

대상이 삭제·교체됐으면 결과를 Blob에는 보존하되 현재 Snapshot에 적용하지 않는다.

### 15.5 실패 처리

- 구조와 콘텐츠 Snapshot은 유지
- 실패한 Job만 `failed`
- 재시도 시 동일 입력 Hash면 기존 작업 정책에 따라 재사용 또는 새 Attempt
- Provider 크레딧 부족은 `PROVIDER_CREDIT_DEPLETED`로 구분
- 사용자에게 설정·결제 문제와 프롬프트 문제를 구분해 표시

## 16. Prompt와 LLM Harness

### 16.1 관리자 관리

관리자 `LLM 및 프롬프트 관리`:

- `promo_page_composer`
- `promo_composition_editor`
- 기존 이미지 Prompt
- Provider·Model·Temperature·Max Tokens
- 입력 변수 설명
- 활성 버전
- 변경 이력

### 16.2 코드 강제

소스코드에 남겨야 하는 항목:

- JSON Schema
- Enum 후보
- 보안 정책
- 최대 섹션·컴포넌트·Operation 개수
- URL allowlist
- 잠금·필수 정책
- revision·fingerprint 검증
- 실패 안전 기본값

관리자에서 변경 가능한 항목:

- 구성 우선순위 지침
- 브랜드 카피 방향
- 섹션 선택 선호
- 레이아웃 분위기
- 키비주얼 스타일 지침
- Motion 강도 선호

### 16.3 Structured Output

- 모든 Object에 `additionalProperties: false`
- `required`에 모든 필드 선언
- 선택값도 nullable 또는 빈 배열로 명시
- 후보 ID는 Enum
- 자유 CSS 문자열 필드 없음
- 자유 HTML 문자열 필드 없음

## 17. 보안 설계

### 17.1 인증·권한

- 관리자 공용 섹션·Prompt·Motion API는 관리자 권한 필요
- Builder Document 변경은 소유권 검사
- 공개 Preview와 편집 API 분리
- 클라이언트가 전달한 `ownerSubject` 신뢰 금지

현재 Builder에 인증 사용자가 없는 배포를 위해 서버 발급 익명 Builder Session을 제공한다.

```text
인증 사용자 있음
  → owner_subject = "user:{authenticated-subject}"

인증 사용자 없음
  → 서버가 cryptographically random session id 생성
  → 서명된 HttpOnly Cookie 발급
  → owner_subject = "anon:{server-derived-subject}"
```

Cookie 권장 속성:

- `HttpOnly`
- `Secure`
- `SameSite=Lax`
- 제한된 `Path`
- 만료 정책
- HMAC 또는 서버측 Session Store로 위변조 검증

브라우저 `sessionStorage`의 `wizardSessionId`는 UI 상관관계와 Usage Event 용도로만 사용한다. Document 소유권의 보안 주체로 사용하지 않는다.

API 처리 순서:

```text
resolve authenticated user
  → 없으면 signed anonymous session 확인·발급
  → owner_subject 서버 계산
  → document.owner_subject 비교
  → 불일치 시 403
```

공개 Web Output Preview Token을 도입할 경우 편집 권한 Token과 분리하고 읽기 전용·만료·revision 고정 정책을 사용한다.

### 17.2 입력 보안

- 자연어·필드 길이 제한
- 사용자 HTML escape
- CTA URL scheme allowlist
- 외부 이미지 URL은 기존 Safe Remote Image 정책 사용
- 임의 event handler 금지
- JSON 전체 크기 제한

### 17.3 AI 출력 보안

- 후보 외 ID 거부
- Raw HTML/CSS/JS 속성 자체를 Schema에서 제외
- Provider 응답을 DB·Renderer에 직접 전달하지 않음
- Validator와 Normalizer를 통과한 결과만 저장

## 18. 관측성

### 18.1 이벤트

- `builder_mode_selected`
- `ai_overview_requested`
- `ai_overview_reviewed`
- `shared_sections_confirmed`
- `composition_requested`
- `composition_validated`
- `composition_auto_applied`
- `composition_review_required`
- `composition_applied`
- `composition_apply_failed`
- `composition_operation_proposed`
- `composition_operation_applied`
- `composition_revision_conflict`
- `asset_job_started`
- `asset_job_ready`
- `asset_job_failed`
- `web_output_opened`

### 18.2 성능

- 자연어 분석 완료 시간
- Composition Proposal 생성 시간
- `render_ready`까지 시간
- 첫 편집 가능 시간
- 전체 Asset 준비 시간
- 자연어 Operation 적용 시간

### 18.3 로그 보안

- 자연어 원문과 사용자 콘텐츠를 일반 로그에 그대로 남기지 않는다.
- Hash, 길이, requestId, documentId, revision 중심으로 기록한다.
- Prompt 실행 Snapshot은 현재 Prompt 관리 정책에 따라 저장한다.

## 19. Migration·호환·롤백

### 19.1 배포 순서

1. Contract v2 Adapter와 테스트 배포
2. Vue AI Builder 멀티 엔트리 Build 검증
3. 공용 섹션 정책·Clone·Activate Migration
4. Builder Session·Document Migration
5. Section Design Run Builder FK Migration
6. API를 Feature Flag 비활성 상태로 배포
7. AI 모드 Vue UI 배포
8. 내부 사용자 Flag 활성화
9. Motion·자연어 수정 Flag 순차 활성화

### 19.2 Feature Flag

- `PROMO_BUILDER_AI_MODE_ENABLED`
- `PROMO_PAGE_COMPOSITION_PROPOSAL_ENABLED`
- `PROMO_PAGE_COMPOSITION_APPLY_ENABLED`
- `PROMO_PAGE_COMPOSITION_MOTION_ENABLED`
- `PROMO_PAGE_COMPOSITION_NL_EDIT_ENABLED`
- `PROMO_PAGE_COMPOSITION_LIBRARY_MODE_ENABLED`

### 19.3 롤백

- AI 모드 Flag 비활성화 시 템플릿 모드만 표시
- AI Builder Vite Entry 실패 시 Bootstrap이 템플릿 모드만 제공
- 신규 DB 테이블을 즉시 삭제하지 않음
- 기존 localStorage Snapshot과 템플릿 모드 유지
- 적용된 Builder Document는 revision rollback
- 이미지 결과는 Snapshot 참조만 되돌리고 Blob 즉시 삭제 금지

## 20. 테스트 설계

### 20.1 순수 계약 테스트

- Contract v1 → v2 호환
- Contract v2 Schema
- Candidate fingerprint
- 필수·고정 섹션
- 중복 sectionKey 거부
- 컴포넌트 잠금
- provenance와 확인 필요
- Token Binding
- Motion Preset
- Operation Schema

### 20.2 Store·DB 테스트

- Document 생성
- Proposal idempotency
- Active Proposal 중복 방지
- Proposal 상태 전이와 lease token
- queued/processing 취소
- ready supersede
- Apply transaction
- Document·Layout·Bridge revision 구분
- rollback revision 생성
- 소유권 거부
- 서명된 익명 Builder Session 위변조 거부
- 공용 섹션 정책 Clone·Activate 보존
- Section Design Run Builder FK와 중복 Asset Request
- Migration rollback

### 20.3 API 테스트

- 정상 Proposal
- 잘못된 Overview fingerprint
- 후보 변경
- LLM Schema 오류
- Provider 오류
- Validation 422
- stale Apply 409
- Unauthorized 401/403
- 중복 요청
- Worker lease 상실 후 결과 저장 거부
- cancelled·superseded Proposal 적용 거부

### 20.4 Renderer 테스트

- 텍스트·이미지·CTA 단일 필드
- 다중 필드 컴포넌트
- 선택 필드 비노출
- 시맨틱 제목
- Token 적용
- Motion과 Reduced Motion
- 알 수 없는 fieldKind·rendererKey
- Contract v1·v2 동일 시각 결과
- page instance ID 전환 대상 전체 일관성

### 20.5 브라우저 E2E

```text
Builder 진입
  → AI 모드
  → 자연어 분석
  → Overview 수정
  → 공용 섹션 확인
  → 생성
  → render_ready
  → 이미지 완료
  → 자연어 수정
  → 수동 편집
  → 저장·새로고침
  → Web Output Preview
  → rollback
```

템플릿 모드는 별도 회귀 시나리오로 동일하게 유지한다.

## 21. 구현 파일 매핑

| 단계 | 신규·수정 파일 후보 |
|---|---|
| P0 | `wizard-storage.js`, `editor-snapshot-contract.js`, Contract v2, 세 revision 계약·테스트 |
| P1 | Visual Editor Vite 멀티 엔트리, Vue AI Builder, Overview Review UI, 섹션 정책 Clone·Activate Migration·API·Admin UI |
| P2 | Composition Contract·Candidate·Validator·Proposal API, Builder Preview 연결 |
| P3 | Builder Session·Document Migration·Store·Apply·Rollback·페이지 인스턴스 |
| P4 | Section Design Run Builder FK, Asset 연계, Motion 관리, 자연어 Operation API·UI |
| P5 | 접근성·시각 검증·게시 기능 검토 |

## 22. 단계별 완료 Gate

### P0 Gate

- Contract v1 회귀 테스트 통과
- Contract v2 Fixture 통과
- Document·Layout·Bridge revision 구분
- Source of Truth 중복 없음

### P1 Gate

- 템플릿 모드 회귀 없음
- AI 모드가 Vue 3 + Vite Entry로 동작
- AI Overview와 공용 섹션 정책 정상
- 공용 섹션 Clone·Activate 시 정책 보존
- 필수 Legal 정책 우회 불가

### P2 Gate

- AI Composition이 기존 Renderer에서 정상 출력
- 안전 결과 자동 적용
- 확인 필요 결과 승인 분기
- 이미지 없이 `render_ready`

### P3 Gate

- 서버 저장·새로고침·롤백
- revision·fingerprint·소유권 검증
- 인증 또는 서명된 익명 Builder Session 검증
- 페이지 컴포넌트 인스턴스 조립

### P4 Gate

- Asset 개별 재시도
- Asset Run과 Builder Document revision 연결
- Motion Reduced Motion
- 자연어 부분 수정과 Diff
- 수동 편집 동시성

## 23. 미확정 사항과 권장 기본값

| 항목 | 권장 기본값 |
|---|---|
| AI Planner Prompt | 기존 Composer Helper를 재사용하되 `promo_page_composer` 타입 분리 |
| AI 프런트엔드 | 기존 Visual Editor Vite 멀티 엔트리의 Vue 3 App |
| 템플릿 프런트엔드 | 현재 Vanilla Host 유지 |
| AI 모드 골격 | AI Base Preset 사용 |
| 자동 적용 | 경고·확인 필요 없음에만 허용 |
| 이미지 생성 | 구조 렌더 후 자동 비동기 시작 |
| 동일 섹션 반복 | 페이지 인스턴스 ID 전환 전 금지 |
| Renderer | 범용 필드 Renderer 기본 |
| Motion | 기본 `none`, AI 선택 허용 |
| 저장 | Builder Document 별도 엔티티 |
| 익명 소유권 | 서버 발급 서명 HttpOnly Builder Session |
| Web Output | Preview로 정의 |
| 운영 게시 | 후속 P5 결정 |

## 24. 최종 설계 결론

AI 모드는 자유로운 코드 생성기가 아니라 기존 시스템 자산을 조합하는 통제형 Composition Engine으로 구현한다.

```text
Natural Language
  → Structured Overview
  → Policy-resolved Candidates
  → Composition Proposal
  → Validation
  → Composition Contract v3 (Template 호환 경로는 v2)
  → Shared Vue Renderer
  → DOM/CSS
  → Async Assets
  → Natural-language or Manual Operations
```

기존 Layout Snapshot을 Contract v2로 승격하므로 Preview, Editor, Web Output의 계약을 새로 분리하지 않는다. 관리자가 만든 일반 컴포넌트는 범용 필드 Renderer로 출력하고, 특수 UI만 별도 Renderer를 구현한다.

신규 AI 화면은 기존 Visual Editor Vite 환경의 멀티 엔트리 Vue 3 App으로 구현한다. 템플릿 모드는 현재 Legacy Host를 유지하고 Compatibility Adapter를 통해 Contract v2로 점진 수렴한다.

페이지 구조를 먼저 렌더링하고 키비주얼과 컴포넌트 이미지를 별도 Job으로 생성함으로써 이미지 처리 시간과 관계없이 빠르게 첫 편집 가능 화면을 제공한다.

## 25. Contract v3 구현 현행화 — 2026-08-06

### 25.1 현행 실행 흐름

```text
Natural Language
  → Overview v5 구조화·사용자 검토
  → active Composition Shell 조회
  → Registry Section/Component/Layout/Token/Motion/Resource 후보 고정
  → Contract v3 CompositionSpec 생성·검증
  → allowlist 기반 repair 최대 1회
  → Proposal 저장·사용자 승인
  → fingerprint와 pinned version 재검증
  → 결정적 Compiler
  → Builder Document revision 생성
  → 공통 Visual Editor/Renderer
  → HTML/Vue/React Export
```

Feature Flag 비활성 또는 active Shell 부재 시 기존 Template Mode로 fallback한다. fallback은 정상 v3 성공과 구분해 기록한다.

### 25.2 Contract v3 핵심 데이터

Contract v3는 Template ID를 요구하지 않는다. 최소 재현성 데이터는 다음과 같다.

```ts
interface RegistryCompositionV3Meta {
  contractVersion: 3;
  shellVersionId: string;
  overviewFingerprint: string;
  candidateFingerprint: string;
  policyFingerprint: string;
  resourceFingerprint: string;
  promptTemplateVersionId: string;
  model: string;
}

interface PinnedResourceReference {
  resourceVersionId: string;
  resourceKey: string;
  locale: string;
  contentHash: string;
}
```

Apply는 위 fingerprint와 `shellVersionId`, `baseDocumentRevision`을 모두 확인한다. 하나라도 비거나 현재 값과 다르면 새 revision을 만들지 않는다.

핵심 구현:

- `api/_promo-registry-composition-contract.js`
- `api/_promo-registry-composition-candidates.js`
- `api/_promo-registry-composition-compiler.js`
- `api/promo-page-composition-proposals.js`
- `api/promo-page-composition-process.js`
- `api/promo-page-composition-apply.js`
- `api/_promo-builder-document-store.js`
- `db/migrations/049_registry_composition_v3_foundation.sql`
- `db/migrations/050_registry_scope_and_composition_shell_management.sql`
- `db/migrations/051_registry_candidate_resolver_indexes.sql`
- `db/migrations/052_content_resource_registry.sql`
- `db/migrations/053_builder_operations_contract_v3.sql`

### 25.3 결정적 Compiler와 저장 순서

Compiler의 콘텐츠 해석 순서는 고정한다.

```text
Component field default
  → Layout Preset content
  → Overview binding
  → pinned Resource content
```

Section/Component/repeat index와 Proposal ID를 기반으로 안정적인 instance ID를 생성한다. 같은 pinned 입력을 다시 컴파일하면 의미적으로 동일한 Builder Document를 생성해야 한다.

Desktop/Mobile geometry, visibility, token reference, motion binding, Resource version/hash, Asset request target을 Snapshot에 함께 저장한다. Section Preset 콘텐츠는 텍스트·이미지 URL·다중 필드 `fields`를 보존한다.

### 25.4 Overview v5와 CTA

서버 기준 canonical contract는 `api/_promo-overview-contract.js`의 v5다.

```ts
interface OverviewV5 {
  schemaVersion: 5;
  title: string;
  leadText: string;
  ctaLabel: string;
  promotionPurpose: string;
  promotionPurposeOther: string;
  market: string;
  audience: string;
  campaignTone: string;
  mainOffer: string;
}
```

- CTA Component는 `ctaLabel`만 바인딩한다.
- 최대 길이는 공백 포함 20 Unicode code point다.
- Prompt, JSON Schema, Composition v2/v3 Validator, Section Composer, Visual Editor, Template Layout 저장, Builder Document 저장에서 같은 제한을 사용한다.
- 초과 오류 코드는 `CTA_LABEL_TOO_LONG`이다.

2026-08-06 구현 상태:

- `prototype/wizard/promotion-overview.js`를 v5로 전환했다.
- `ctaLabel`의 공백 정규화, 20 Unicode code point 검증, canonical Overview와 `content.promo.ctaLabel` 양방향 동기화를 적용했다.
- 브라우저 adapter와 서버의 Overview fingerprint parity test가 통과한다.

### 25.5 Hero key visual과 Asset Job

Hero visual의 기본 Registry 계약:

```json
{
  "enabled": true,
  "allowSectionBackground": true,
  "imageTarget": "section-background",
  "imageTargetItemKeys": [],
  "imageAspectRatio": "4:3"
}
```

Compiler는 이 정책에서 `section-key-visual` 요청만 생성하고 `component-field-image` 요청을 만들지 않는다. 결과 이미지는 Hero Section의 `backgroundImage`에 적용한다. 이미지 안에 제목·설명·CTA·버튼·배지·로고·UI text를 생성하지 않는다. 컴포넌트 이미지 생성은 `imageTarget: item`과 허용 item key가 모두 명시된 별도 Section 정책에서만 가능하다.

### 25.6 Operation·revision·rollback

- Section 추가·삭제·교체와 Collection item 추가·삭제·재정렬을 구조 Operation으로 처리한다.
- 필수·고정 Section 삭제와 role/fixed-position 비호환 교체를 거부한다.
- 하나의 승인된 구조 변경은 하나의 document revision을 만든다.
- `DOCUMENT_REVISION_MISMATCH` 시 자동 merge·강제 저장하지 않는다.
- rollback은 과거 Snapshot을 복사한 새 revision이며 과거 row를 수정하지 않는다.
- Undo/Redo는 v3 Snapshot과 동일 Command Stack 경계를 사용한다.

### 25.7 Export runtime

`api/promo-builder-export.js`는 소유권, 현재 revision, `PROMO_BUILDER_EXPORT_ENABLED`, `PROMO_BUILDER_EXPORT_ROLLOUT_PERCENT`를 확인한다.

공개 Snapshot은 다음을 제거한다.

- 관리 metadata
- provenance와 validation
- 미완료 Asset request
- Editor selection·outline·toolbar 상태

HTML/Vue/React Adapter는 같은 공개 Snapshot을 사용한다. HTML JSON injection 방지를 위해 `<`, `>`, `&`, U+2028, U+2029를 escape한다. Production Asset/Resource 접근성과 Visual Editor screenshot parity는 E2E 완료 전까지 미검증으로 표시한다.

### 25.8 Design Token과 정적 bundle

Compiler와 Renderer는 `shared/promo-token-runtime.mjs`를 기준으로 semantic token을 해석한다. v3 Compiler, Renderer, Seed에는 raw color, font, radius, shadow를 추가하지 않는다.

저장소가 직접 제공하는 `prototype/admin-assets/*`, `prototype/visual-editor-assets/*`는 source와 같은 revision에서 다시 빌드해야 한다. 2026-08-06 현행화에서 Admin·Visual Editor bundle을 최신 source 기준으로 재생성해 Admin의 이전 token runtime과 Visual Editor의 자동 높이 툴바 판정 불일치를 제거했다.

완료 조건:

1. Node 22.x에서 Admin·Visual Editor를 재빌드한다.
2. 생성 bundle diff를 검토하고 source 변경과 함께 커밋한다.
3. CI에서 source 변경 후 build artifact drift를 검출한다.

### 25.9 Migration·Seed 재현성

운영 적용 기준:

- Migration 053 적용 완료
- Seed 004 실행 완료
- Seed 005 실행 완료

Seed 004의 Design Token conflict target은 `(token_set_version_id, token_key, value_index)`다. `--app-hero-bg-image`의 `value_index=0,1`은 정상 list-valued gradient layer다.

Schema-drift 복구 상태:

- 기존 `wizard_item_components` 테이블에 `system_seed_code` Unique index가 없으면 Seed 004의 `ON CONFLICT (system_seed_code)`가 실패한다.
- 운영 DB의 수동 보완을 `054_repair_item_component_seed_identity_unique_index.sql`로 코드화했다.
- Migration 054는 index 생성 전 중복 seed code를 검출해 `23505`로 중단하고, 중복이 없으면 `CREATE UNIQUE INDEX IF NOT EXISTS`로 복구한다.
- Migration contract test가 중복 방어, index 정의, Seed 004 conflict target의 일치를 검증한다.
- 저장소 Migration 추가와 운영 DB 적용은 별개다. 대상 환경의 Migration 054 적용 여부를 배포 절차에서 확인해야 한다.
- Migration 055는 기존 `registryHero`의 item target과 `visual` Component instance를 제거하고 Section key visual 정책·Layout으로 복구한다.

### 25.10 검증 상태와 완료 Gate

2026-08-06 현행화 검증 결과:

- Legacy browser Overview v5·CTA 저장·browser/server fingerprint parity 통과
- Migration 054 contract test 추가 및 통과
- Admin build 성공(26 modules), Visual Editor build 성공(67 modules)
- Admin 생성·Design Token·i18n·Section Component 브라우저 통합 테스트 통과
- Create Promo 전체 browser smoke test 통과
- Migration 055의 Hero Section key visual 복구 테스트를 포함해 전체 Suite 119개가 최종 재실행에서 모두 통과했다. 중간 실행에서 확인된 `admin-prompt-grouping-browser`의 상세 선택·번역 응답 경쟁은 번역 반영 완료를 동기화 조건으로 추가해 안정화했다.
- 실행 환경은 bundled Node 24.14.0이었으며 최종 릴리스 기준 Node 22.x 재검증이 필요하다.

이번 현행화에서 분류·처리한 항목:

| 분류 | 확인 내용 | 처리 |
|---|---|---|
| 실제 계약 결함 | Legacy browser Overview v4와 server v5 불일치 | adapter v5, CTA 동기화, parity test 복구 |
| 실제 UI 결함 | 생략된 text `heightMode`를 Renderer는 자동으로, Toolbar는 고정으로 판정 | 공통 `usesAutomaticComponentHeight` 사용 |
| Schema drift | 기존 DB의 `system_seed_code` Unique index 누락 | idempotent Migration 054와 contract test 추가 |
| 오래된 assertion·selector | 이동된 AI UI, 접힌 색상 메뉴, 자동 높이 handle, 24px/4% 최소 폭 | 현행 소유 컴포넌트와 사용자 흐름 기준 갱신 |
| fixture·timing | 빈 locale snapshot, 초기 locale, `networkidle` polling 영향 | 실제 locale fixture, 초기 locale 고정, DOM ready 기준 적용 |

최종 Vertical Slice 완료 Gate:

1. 자연어 → Overview v5 → Contract v3 Proposal → 승인 → Apply가 실제 Provider에서 성공한다.
2. Hero가 실제 이미지 결과에서 Section background 키비주얼로 보이고 별도 이미지 Component Job이나 내부 UI 문구가 없다.
3. 한국어·영어 CTA가 생성·편집·저장 후 20자 이내로 보존된다.
4. Component geometry와 Preset 콘텐츠가 저장·새로고침 후 동일하다.
5. 두 창의 동시 수정에서 한 요청만 성공하고 다른 요청은 revision mismatch 안내를 표시한다.
6. Visual Editor와 HTML Export의 Desktop/Mobile screenshot이 일치한다.
7. Export rollout 0%, 부분 %, 100%와 Flag off를 검증한다.
8. Node 22.x에서 전체 build와 테스트가 통과하고 미분류 실패가 없다.
