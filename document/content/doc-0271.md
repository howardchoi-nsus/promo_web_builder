# Visual Template Editor / Vue Renderer 전환 개발계획서

- 작성일: 2026-07-16
- 상태: 개발 전 계획, 1차 검토 의견 반영 완료
- 참조 문서: `docs/visual-template-editor-and-llm-vue-generation-proposal-2026-07-16.md`
- 참조 검토: `docs/claude/review-admin-page-source-2026-07-15.md`, `docs/claude/review-api-folder-source-2026-07-12.md`, `docs/claude/review-n8n-workflows-2026-07-12.md`, `docs/claude/comprehensive-review-report-2026-07-12.md`, `docs/claude/review-promo-wizard-frontend-source-2026-07-14.md`
- 대상: 신규 Visual Editor, Admin Form Template, 신규 Web Output, 생성 파이프라인, Renderer Registry
- 비대상: 현재 구현된 `prototype/promo-wizard.html/js/css` 내부 UI 개편

진행 현황:

| Phase | 상태 | 결과 |
|---|---|---|
| Phase 0 | 완료 | `visual-renderer-p0-baseline-and-contract-2026-07-16.md` |
| Phase 1 | 진행 중 | Slice 1 Default Renderer Preview/Output 구현 및 검수 완료 |
| Phase 2 이후 | 미착수 | Phase 1 잔여 범위 완료 후 진행 |

## 0. 검토자 안내

이 문서는 원 제안서를 실행 단계로 좁힌 계획이다. 현재 구현된 Promo Wizard와 신규 Visual Editor를 서로 다른 서비스 화면으로 구분한다.

검토 시 우선 확인할 관점:

1. Phase 0~1이 실제 최소 증명 범위로 유지되는가.
2. Visual Editor 전용 Vite bundle이 기존 정적 Wizard와 충돌하지 않는가.
3. 신규 n8n trigger/callback 계약이 기존 비동기 실행 패턴과 호환되는가.
4. Phase 7의 LLM 코드 생성과 Sandbox가 충분히 분리되어 있는가.
5. 일정 추정치가 실제 build 및 QA 환경 구성을 반영하는가.

## 1. 목표

전체 페이지 이미지와 실제 Vue Web Output이 서로 다른 산출물이라 발생하는 불일치를 해소하기 위해, 신규 Visual Editor Preview와 최종 Web Output이 동일 Vue Renderer를 공유하는 별도 서비스 흐름을 구축한다.

기존 Promo Wizard는 레거시 생성 경로로 유지하며 Phase 0~1에서 수정하지 않는다. 향후 Visual Editor와 연결하거나 대체할지는 Phase 6 운영 평가 이후 별도 결정한다.

이번 로드맵의 1차 목표는 제안서 26장이 제시한 다음 명제를 **최소 범위로 증명**하는 것이다.

> 관리자 콘텐츠 스키마로 입력한 모든 값이 Visual Editor와 최종 Web Output의 동일 Vue Renderer에 빠짐없이 동일하게 표시된다.

LLM Vue 코드 생성과 Sandbox Build는 이 명제가 증명된 이후 별도 의사결정 대상으로 미룬다. 자동 QA는 고정 Renderer 기반 Web Output 단계에서 먼저 도입하고 LLM 생성 코드 검증으로 확장한다. 전체 로드맵을 한 번에 승인하지 않고, Phase 0~1 완료 후 계속 진행 여부를 재검토한다.

## 2. 선행 조건

제안서 원문에는 없으나, 현재 소스코드/DB 상태를 직접 확인한 결과 아래 조건을 먼저 충족해야 한다.

1. **관리자 API 접근 제한(최소 조치)**: 관리자 신규 CRUD는 Phase 2부터 추가한다. 현재 관리자 쓰기 API 전체에 인증/인가가 없는 상태에서 기능 표면을 넓히지 않도록 최소한 배포 환경 접근 제한을 Phase 2 착수 전에 적용한다. 정식 인증/인가는 별도 트랙으로 진행한다.
2. **레거시/신규 파이프라인 표기**: `promo_design_runs`/`promo_design_assets`(구 Builder) vs `promo_generation_runs` 계열(신규 Wizard) vs 이번에 추가되는 Renderer Run까지 세 계열이 공존하게 된다. README 또는 handoff에 "현재 라이브 vs 단계적 폐기 예정"을 명확히 표기해 신규 합류자 혼란을 방지한다.
3. **기준 상태 고정**: 현재 진행 중인 Wizard Step2 아코디언/템플릿 연동 작업(핸드오프 2026-07-15)을 먼저 안정화하고 별도 기준 커밋으로 고정한 뒤 이 로드맵을 시작한다.
4. **Renderer 실행 방식 확정**: 신규 **Visual Editor 페이지 + Renderer 전용 Vue 3/Vite bundle**을 추가한다. 기존 Wizard 전체 Vue 전환과 Wizard 내부 mount는 범위에서 제외한다.
5. **서비스 명칭 분리**: `Promo Wizard`는 기존 4단계 화면, `Visual Editor`는 신규 웹 편집 화면, `Web Output`은 신규 결과 화면을 의미한다.

## 3. 목표 구조 (데이터 모델)

```text
Form Template          (재사용) 콘텐츠 입력 스키마 — 기존 그대로 유지
  └─ Section/Item

Renderer Registry       (신규) Form Template 1개당 Renderer N개 연결
  ├─ rendererKey / rendererVersion
  ├─ status: draft|validating|active|failed|archived
  └─ sourceStorageKey / buildStorageKey / qaReport

Page Design Spec        (신규) LLM 또는 고정 Variant 출력
  ├─ theme / designAxes / sections / responsive
  └─ assetRequests / coverageMap

Template Snapshot       (신규) Run 시작 시점 스냅샷
  ├─ Form Template ID/Version, Renderer Key/Version
  ├─ Template Contract Version, Page Design Spec
  └─ Promo Content, Asset Manifest
```

`formTemplate`, `sectionInputs`, `sectionSnapshot`, `configRevision`, `userReorderAllowed`, `fixedPosition`, Item `isLocked`/`isRequired`, CTA UTM 처리는 변경 없이 재사용한다. 변경 대상은 **표시 계층(Renderer)과 디자인 생성 파이프라인**뿐이다.

초기 관계 규칙:

- Form Template 하나는 Renderer 여러 개를 가질 수 있다.
- 각 Form Template에는 active Default Renderer 하나가 반드시 존재한다.
- Renderer는 초기에는 하나의 Form Template Contract에 종속된다.
- N:M 공유는 Renderer Contract와 호환성 검증이 안정화된 이후 검토한다.

## 4. 핵심 설계 원칙

1. **Renderer는 유일한 진실 소스**: Preview 전용 복제 컴포넌트를 만들지 않는다. Visual Editor Preview와 Web Output은 반드시 동일 Renderer 빌드를 사용한다.
2. **동적 Section 대응**: 관리자가 새 Section/Item을 계속 추가할 수 있으므로, Renderer는 알려진 Section 전용 컴포넌트 + `GenericSection`/`GenericTextItem`/`GenericImageItem`/`GenericCtaItem` 기본 계약을 함께 제공한다. 특정 Section Key를 하드코딩하지 않는다.
3. **LLM 코드 생성과 실행 분리**: Phase 7 이전까지 LLM은 구조화된 Design Spec만 생성하고 Vue 코드를 직접 생성하지 않는다. 코드 생성이 필요한 시점에도 즉시 실행하지 않고 Sandbox Build → 자동 QA → Registry 등록 절차를 거친다.
4. **레거시 병행 운영**: 기존 LO-FI/Final Design Run API는 즉시 삭제하지 않는다. 신규 Renderer Run과 명시적으로 구분하고, Feature Flag로 전환 비율을 조절한다.
5. **기존 서비스 격리**: Visual Editor와 Renderer bundle을 별도 entry/page로 추가하고 기존 Wizard 소스는 Phase 0~1에서 수정하지 않는다.
6. **콘텐츠 불변성**: Design Spec은 레이아웃과 디자인 Token만 결정한다. 사용자 콘텐츠 원문은 `sectionInputs`에서만 공급한다.

## 5. 단계별 개발 계획

### Phase 0. Renderer Runtime 및 기술 검증

- Visual Editor 전용 Vue 3 + Vite bundle과 공통 Renderer entry를 구성한다. 기존 Wizard build 전환은 하지 않는다.
- Default Template 1개를 Vue Renderer(SFC)로 구현한다. 공통 Props 계약은 `content`, `designSpec`, `assets`다.
- 기존 `sectionInputs` 데이터를 그대로 연결(신규 스키마 변환 없이)
- Desktop/Mobile 렌더링 확인
- 독립 Visual Editor Preview와 Web Output route에서 **완전히 동일한 빌드 산출물**을 사용해 렌더링 결과를 비교

완료 기준:
- 동일 Renderer entry, Props Snapshot, CSS/font 환경을 사용한다.
- Renderer DOM과 콘텐츠 coverage가 동일하고 Renderer root 스크린숏이 허용 오차 내에서 일치함을 증명한다. Phase 0에서는 수동 비교 기록도 허용하되 Phase 5 이전에 자동화한다.
- Renderer가 `sectionInputs`의 필수 Section/Item을 누락 없이 반영한다.

### Phase 1. 독립 Visual Editor MVP

- 데스크톱 3분할 레이아웃: Section 목록 / 실제 Vue Preview / 선택 Item 편집 패널
- 입력값을 Preview에 즉시 반영 (blur 시점 리렌더가 아니라 입력 중 반영 — 단, 기존 `promo-wizard.js`의 `createField()` 포커스 손실 버그(`review-promo-wizard-frontend-source-2026-07-14.md` 이슈 #1)와 동일한 실수를 반복하지 않도록 렌더링 범위를 편집 대상 Item으로 한정)
- 기존 아코디언의 필수값 검증, `userReorderAllowed`, `fixedPosition`, `isLocked` 로직을 신규 UI로 이식(재구현이 아니라 표시 계층 교체)
- Desktop/Tablet/Mobile Preview 전환

완료 기준:
- 기존 계약 테스트(`test-wizard-content-sections-contract.js`, `test-wizard-form-templates-contract.js`, `test-wizard-public-form-template-contract.js`)가 그대로 통과한다.
- 신규 Visual Editor가 기존 공개 API의 `sectionInputs`/`configRevision` 데이터 구조를 사용한다.
- 기존 Promo Wizard 소스와 사용자 흐름에 변경이 없다.

### Phase 2. Renderer Registry 및 관리자 연결

- `wizard_renderers`, `wizard_form_template_renderers` migration과 CRUD API 구성
- Form Template 1:N Renderer 연결 및 Default Renderer 제약 적용
- 관리자 `프로모션 폼관리`에서 Renderer 연결·기본값·활성 상태 관리
- Visual Editor용 공개 Form Template 응답에 Renderer ID/Key/Version metadata 추가. 기존 API 확장 시 하위 호환을 유지한다.
- Renderer source/build artifact는 DB 본문이 아니라 storage key와 version으로 관리

완료 기준:
- Form Template별 active Default Renderer가 항상 하나로 결정된다.
- Visual Editor가 선택한 Form Template의 Renderer metadata를 조회해 Preview에 적용한다.
- 관리자 접근 제한이 적용된 환경에서만 쓰기 API가 노출된다.

### Phase 3. Design Spec Variant (이미지 없는 LO-FI 대체)

- Page Design Spec 스키마 확정 (제안서 4.4 예시 기반: designAxes/theme/sections)
- `promo_generation_design_specs`에 run별 attempt, 상태, 선택 여부, prompt/model/workflow snapshot과 검증 결과 저장
- 우선 고정 Renderer Variant 3종으로 시작하고 후반에 LLM Design Spec 생성과 신규 n8n Workflow 추가
- callback에서 contract version, attempt, 중복 완료와 JSON Schema 검증
- 실제 Vue Preview로 Variant 비교 UI 구성
- 다양성 기준(Hero Variant/Section Grid/이미지 위치 등 중 3개 이상 상이)을 수동 체크리스트로 우선 적용, 자동 diversityScore는 후순위

완료 기준:
- 사용자가 이미지가 아닌 실제 DOM 기반 Variant 2~3개를 비교해 선택할 수 있다.
- 재생성 시 기존 후보가 유지되고 새 attempt가 추가된다.
- 선택된 Variant가 Phase 5 Web Output에서 동일하게 재현된다.
- invalid JSON/Schema, timeout, 중복 callback이 명확하게 기록된다.

### Phase 4. Section Asset Generation 연동

- 기존 전체 페이지 이미지 Worker를 개조하지 않고 별도 n8n Section Asset Workflow를 구성한다. 기존 모델 설정과 이미지 호출 패턴만 재사용한다.
- Asset별 `sectionKey`, `itemKey`, role, ratio, focal point, safe area, attempt와 상태 저장
- Focal Point/Text Safe Area를 Renderer의 `object-fit`/overlay 처리로 반영
- 기존 이미지 프록시 재사용 — 인증 도입 전에는 최소한 요청한 Asset과 Run의 연관 관계를 검증하고, 사용자 인증 도입 후 실제 소유권 검증으로 확장

완료 기준:
- Renderer가 AI 생성/URL 입력/파일 첨부 이미지를 모두 동일한 방식으로 표시한다.
- 이미지 생성 실패/재생성/이전 Asset 유지 상태가 UI에 반영된다.

### Phase 5. Web Output Snapshot 및 자동 QA

- 선택된 Content, Renderer, Design Spec, Asset Manifest를 immutable Snapshot으로 저장
- Visual Editor 확정 화면과 별도 Web Output route에서 동일 Renderer bundle 사용
- Desktop 1440px, Tablet 768px, Mobile 375px 렌더링 검증
- 콘텐츠 coverage, overflow, CTA URL/UTM, heading/accessibility 검증
- Preview 편집 장식은 제외하고 Renderer root만 DOM/스크린숏 비교
- QA 실패 시 완료 차단과 원인·재실행 기능 제공

완료 기준:
- 선택 Variant와 Web Output이 동일 Renderer ID/Version 및 Snapshot으로 재현된다.
- 필수 콘텐츠 coverage와 반응형 QA를 통과한 결과만 `ready` 처리된다.
- Web Output attempt와 이전 성공 결과가 보존된다.

### Phase 6. 병행 운영 및 전환 평가

- 기존 Image Pipeline과 신규 Renderer Pipeline을 Feature Flag로 병행
- 실패율, 생성 시간, 비용, 콘텐츠 충실도, 반응형 품질 비교
- 진행 중 Run과 기존 이력의 조회·재생성 호환성 검증
- 신규 Renderer 트래픽 비율을 단계적으로 확대

완료 기준:
- 운영 지표와 회귀 테스트를 기준으로 확대 여부가 승인된다.
- 문제 발생 시 기존 n8n Image Pipeline으로 즉시 복귀할 수 있다.

### Phase 7. LLM Vue Template 생성 (신규 인프라 스파이크 선행 필요)

- Template Generation Contract 확정 (허용 Component, allowedLayouts, constraints)
- 공통 Component Library 확정
- **별도 기술 스파이크**: Sandbox Build 환경 결정. Phase 0의 신뢰된 Renderer build와 달리 LLM 생성 코드는 반드시 격리 환경에서 실행한다.
- 자동 코드/Coverage/시각/접근성 QA 파이프라인 구성
- 자동 수정 Loop, 반복 실패 템플릿 자동 보관
- n8n은 이 단계에서 빌드 자체를 실행하지 않는다("6. n8n 역할 조정" 6.4절 참고)

완료 기준:
- 격리 환경에서 LLM 생성 코드가 빌드 → QA → Registry 등록까지 자동 파이프라인으로 통과한다.
- 금지 영역(외부 API 호출, `eval`, 임의 패키지 설치 등) 위반 시 자동 차단된다.

### Phase 8. 기존 이미지 파이프라인 정리

- LO-FI/HI-FI 전체 이미지 생성을 Feature Flag로 우선 비활성화 (즉시 삭제 금지)
- 기존 Run 데이터는 Read-only로 계속 조회 가능하도록 유지
- n8n 자체는 유지하고 Workflow 구성을 Design Spec/Asset 생성 중심으로 정리

완료 기준:
- 신규 트래픽 100%가 Renderer 파이프라인을 경유한다.
- 기존 LO-FI/Final Design 이력은 조회만 가능하고 신규 생성은 차단된다.
- n8n LO-FI Draft Worker와 Final Design Worker(전체 페이지 이미지 생성 역할)가 비활성화되고, 신규 워크플로우가 6장의 완료 기준을 충족한다.

## 6. n8n 역할 조정

이 로드맵은 n8n의 역할을 "전체 페이지를 이미지로 생성"에서 "구조화된 스펙 생성 + 섹션 단위 이미지 생성"으로 바꾼다. 트리거/콜백 인프라 자체는 재사용하고, 워크플로우의 목적과 개수만 조정한다.

### 6.1 현재 역할 (전제)

- **Integrated Brief Worker**: 텍스트/JSON 브리프를 생성해 이후 이미지 생성 단계의 프롬프트 입력으로 사용.
- **LO-FI Draft Worker**: OpenAI `images/generations`로 전체 페이지 이미지를 생성(참조 이미지 없음).
- **Final Design Worker**: OpenAI `images/edits`로 confirmed LO-FI 이미지를 참조해 전체 페이지를 재생성(2026-07-12에 레이아웃 fidelity 구조 개선 완료, `review-n8n-workflows-2026-07-12.md` 참고).
- **트리거 패턴**: `api/_promo-generation-worker-trigger.js`가 stage별 webhook URL로 짧은 ack만 확인하고 실제 생성은 n8n에서 비동기로 진행한다. 이 비동기 trigger/ack/callback 패턴은 유지하되, Design Spec과 Section Asset에는 별도의 payload Schema, callback API와 상태 전이를 추가한다.

### 6.2 없어지는 역할 (Phase 8, Feature Flag 병행 후 최종 폐기)

- LO-FI Draft Worker, Final Design Worker(전체 페이지 이미지 생성 역할) — 새 구조에서는 페이지 레이아웃을 이미지로 재현할 필요 자체가 없어지므로 전체 폐기 대상이다. Final Design Worker가 2026-07-12에 겨우 해결한 "LO-FI 레이아웃을 Final에 유지"라는 문제는, 이미지가 아니라 실제 Renderer가 레이아웃을 담당하는 새 구조에서는 애초에 발생하지 않는다.

### 6.3 용도가 바뀌는 역할

- **Integrated Brief Worker** → 병행 운영 중에는 기존 이미지 생성용 필드를 유지하고, Design Spec용 구조와 coverage map을 추가한다. `briefContractVersion`으로 소비자 계약을 구분해 레거시 이미지 품질이 조용히 달라지지 않게 한다.
- **이미지 생성 설정/호출 패턴** → 기존 전체 페이지 Worker 자체를 Section Asset용으로 개조하지 않는다. 이미지 모델 설정, Credential, 저장 패턴만 신규 Section Asset Workflow에서 재사용한다.

### 6.4 신규 역할

- **Design Spec 생성 워커(Phase 3 후반)**: LLM이 JSON(`theme`/`designAxes`/`sections`)을 반환한다. prompt `type`과 model settings에 `design_spec`을 추가한다.
- **Section Asset 생성 워커(Phase 4)**: Asset 단위 ID, role, ratio, focal point, safe area와 attempt를 입력받아 개별 결과를 callback한다.
- **LLM Vue 코드 생성 오케스트레이션(Phase 7)**: n8n은 Sandbox 작업을 요청하고 결과를 기록하지만 실제 빌드·정적 분석·스크린숏 QA는 외부 격리 서비스에 위임한다.

### 6.5 코드/DB 반영이 필요한 구체 지점

- `api/_promo-generation-run-store.js`의 `STAGE_STALE_LIMITS_MS`에 신규 stage 키(예: `design_spec_variant`, `section_asset`) 추가.
- `api/_prompt-template-store.js`의 prompt `type` enum 및 `DEFAULT_MODEL_SETTINGS`에 `design_spec` 타입 추가.
- `api/_promo-generation-worker-trigger.js`의 `WORKER_URL_ENV`에 신규 워커 환경변수 키 추가. 기존 LO-FI/Final 환경변수는 Phase 8 승인 전 제거하지 않는다.
- Admin 워커 웹훅 설정(`worker_webhook_settings` 테이블, `promo-generation-worker-settings.js`)에 신규 stage 항목 추가.
- 모든 신규 trigger payload에 `runId`, 대상 ID, `attempt`, `contractVersion`을 포함하고 callback은 idempotent하게 구현한다.
- n8n Workflow ID/version과 prompt/model snapshot을 대상 실행 레코드에 저장한다.

### 6.6 이 기회에 함께 정리할 기존 n8n 기술부채

`review-n8n-workflows-2026-07-12.md`와 `comprehensive-review-report-2026-07-12.md`가 지적한 미해결 항목을, 새 워크플로우를 만드는 이번 기회에 함께 반영할 것을 권장한다. 워크플로우를 다시 여는 김에 처리하는 것이 나중에 별도로 다시 여는 것보다 비용이 낮다.

- **(P0, 기존 미해결)** 3개 워크플로우 모두 OpenAI API 키가 평문으로 저장되어 있다 → 신규 워크플로우부터는 n8n Credential로 전환한다. 기존에 "Credential 등록 오류로 임시 보류"를 결정했던 사안이므로, 그 오류가 아직 유효한지 재확인이 필요하다.
- **(기존 미해결)** Integrated Brief Worker와 LO-FI Draft Worker에는 재시도(`retryOnFail`)와 명시적 실패 콜백이 없어 실패 시 run이 "queued/generating"에 영구히 멈출 수 있다 → Final Design Worker에 이미 적용된 패턴(`retryOnFail`, `maxTries`, `onError: continueRegularOutput`)을 신규 워크플로우 전체에 기본값으로 적용한다.
- **(기존 미해결)** `input_fidelity` 설정이 camelCase(저장)와 snake_case(n8n 소비) 불일치로 조용히 무시된다 → 신규 Asset 생성 워커를 설계할 때 키 네이밍을 한 쪽으로 통일한다.

완료 기준(신규):
- 신규 워크플로우는 기존 비동기 trigger/ack/callback 패턴을 따르되 각 stage의 신규 Schema와 상태 계약을 적용한다.
- 신규 워크플로우의 API 키는 평문이 아닌 n8n Credential로 등록되어 있다(최소한 신규 워크플로우부터 관행을 개선한다).
- 각 신규 워크플로우에 최소 1회 재시도와 명시적 실패 콜백이 있다.

## 7. 테스트 계획

### 7.1 동등성 테스트 (신규, 이 로드맵 고유)
- 동일 Renderer ID/Version + 동일 Design Spec/Content/Asset Snapshot으로 Preview와 Web Output을 렌더링
- Renderer root의 DOM 구조와 콘텐츠 coverage 비교
- 동일 viewport, font loading, CSS 환경에서 허용 오차 기반 pixel diff
- Section 순서 변경 후 Preview/Output 동시 반영 확인
- 관리자가 새 Section/Item을 추가했을 때 `GenericSection` fallback이 정상 동작하는지 확인

### 7.2 기존 회귀 테스트
- `test-wizard-content-sections-contract.js`
- `test-wizard-form-templates-contract.js`
- `test-wizard-public-form-template-contract.js`
- `test-wizard-section-audit-log-contract.js`
- `test-integrated-brief-completion-contract.js`, `test-lofi-worker-contract.js`, `test-final-worker-contract.js` (Feature Flag 병행 기간 동안 레거시 경로가 계속 동작하는지)

### 7.3 콘텐츠 Coverage
- Wizard 입력 필수 Section/Item 전량 반영 확인
- 텍스트 원문 보존, CTA URL/UTM 보존
- 숨김 Section 미출력, Section Snapshot/Revision 일치

### 7.4 n8n 워크플로우 검증 (신규)
- 신규 Design Spec/Section Asset 워크플로우가 ack 타임아웃 내 정상 응답하는지
- 의도적 실패(잘못된 payload 등) 주입 시 재시도 후 명시적 실패 콜백이 오는지
- 동일 callback 반복 호출 시 결과가 중복 생성되지 않는지
- 지원하지 않는 `contractVersion`과 오래된 attempt가 거부되는지
- API 키가 워크플로우 export/조회 시 평문으로 노출되지 않는지

### 7.5 보안/접근 제어 (Phase 7 진입 전 필수)
- Sandbox에서 외부 fetch/XHR, `eval`, 임의 import 차단 확인
- 관리자 API 접근 제한 적용 여부 확인(선행 조건 1항)
- 이미지 프록시의 Asset-Run 연관 관계 검증 확인(Phase 4 선행 조건)

## 8. 롤백 전략

- Phase 0~1은 신규 bundle/route/component 추가 위주로 구성하고 기존 Accordion을 fallback으로 유지한다.
- Phase 2 이후 신규 Renderer Run과 기존 Image Run을 DB/API에서 구분해 Feature Flag로 레거시 경로로 복귀할 수 있게 한다.
- Phase 7은 별도 스파이크이므로 실패해도 Phase 0~6의 고정 Renderer + Design Spec 구조는 유지된다.
- 레거시 이미지 파이프라인은 Phase 8 승인 전까지 삭제하지 않는다.
- n8n 신규 워크플로우는 기존 워크플로우와 별도 webhook URL/이름으로 생성해, 문제 발생 시 Admin 워커 설정에서 기존 워크플로우로 즉시 되돌릴 수 있게 한다.

## 9. 예상 일정 (스케일 감각 위주, 인원/숙련도에 따라 변동)

| 범위 | 예상 규모 |
| --- | ---: |
| 선행 조건(관리자 접근 제한 등) | 별도 트랙, 이 로드맵과 병행 |
| Phase 0 Renderer bundle/동등성 기술 검증 | 5~8 개발일 |
| Phase 1 Visual Content Editor MVP | 10~15 개발일 |
| Phase 2 Renderer Registry/관리자 연결 | 5~8 개발일 |
| Phase 3 고정 Design Variant | 5~8 개발일 |
| Phase 3 LLM Design Spec + n8n 신규 Worker | 5~10 개발일 |
| Phase 4 Section Asset Workflow/연동 | 6~10 개발일 |
| Phase 5 Web Output Snapshot/자동 QA | 7~12 개발일 |
| Phase 6 병행 운영/전환 평가 | 운영 관찰 기간 별도 |
| n8n 기존 Workflow 기술부채 정리 | 2~4 개발일, Phase 2~4와 병행 가능 |
| Phase 7 Sandbox 기술 스파이크 | 별도 산정 필요 |
| Phase 7 LLM Vue 코드 생성 + QA | 20~35 개발일, 스파이크 이후 재산정 |
| Phase 8 레거시 Image Worker 비활성화 | 3~5 개발일 |

Phase 7은 이 저장소에 전례가 없는 Sandbox 인프라가 필요해 불확실성이 가장 크다. Phase 0~1 실측과 Phase 5 QA 경험을 바탕으로 재산정한다.

## 10. 소규모 수직 완성 전략

관리자 전체를 먼저 개발하거나 Visual Editor 전체를 먼저 개발하지 않는다. 사용자에게 확인 가능한 기능 하나를 기준으로 필요한 관리자 설정, API, 저장, 화면, 실패 처리와 테스트를 세로로 연결해 완료한다.

```text
관리자 또는 코드 설정
  -> 공개 API/데이터 계약
  -> Visual Editor 사용자 화면
  -> 상태 저장
  -> Preview/Web Output
  -> 실패 처리와 회귀 테스트
  -> 사용자 검수
```

각 단위는 다음 조건을 모두 만족해야 완료로 처리한다.

- 사용자 UI가 실제로 동작한다.
- 필요한 API와 상태 저장이 연결된다.
- 실패와 재시도 경로가 있다.
- 기존 Promo Wizard와 n8n 경로의 회귀 테스트를 통과한다.
- 사용자가 검수할 수 있는 화면 또는 결과물이 있다.
- 미완성 관리자 설정이나 하드코딩이 남으면 다음 단위의 명시적 작업으로 기록한다.

### Slice 1. Default Renderer Preview/Output

가장 먼저 완성할 단위다. 신규 관리자 CRUD와 DB migration 없이 코드 Registry에 Default Renderer 하나를 등록한다.

```text
기존 Form Template
  -> 기존 공개 API
  -> Visual Editor content state
  -> Default Vue Renderer
  -> Visual Editor Preview
  -> 별도 Web Output route
```

완료 기준:

- 기준 Form Template의 Wizard-visible Section/Item이 Visual Editor에 모두 출력된다.
- 입력값이 Preview에 즉시 반영된다.
- Preview와 Web Output이 동일 Renderer bundle과 Snapshot을 사용한다.
- Desktop/Mobile에서 콘텐츠 누락과 overflow가 없다.
- 기존 Promo Wizard와 n8n 생성 기능이 변경 없이 유지된다.

이 단계에서는 Renderer를 관리자가 선택할 수 없어도 된다. 핵심 가설이 증명되기 전에 관리자 설정과 DB 범위를 넓히지 않는다.

### Slice 2. 관리자 Renderer 연결

- Renderer Registry migration/API
- Form Template별 Renderer 연결
- Default Renderer 지정
- 공개 API에 Renderer metadata 포함
- Visual Editor에서 관리자 설정 결과 적용

완료 기준:

- 관리자가 지정한 Default Renderer가 Visual Editor Preview와 Web Output에 반영된다.
- 비활성/누락 Renderer에 대한 설정 오류가 표시된다.

### Slice 3. 고정 Design Variant

- LLM과 n8n 없이 검증된 Design Spec 2~3개 제공
- 실제 Vue Preview에서 후보 비교
- 선택 결과 저장
- 선택 Variant를 Web Output에 동일하게 반영

이 단위에서 Design Spec 데이터 계약과 사용자 UX를 먼저 검증한다.

### Slice 4. n8n Design Spec 생성

- 관리자 Model/Prompt/Webhook 설정
- Design Spec attempt DB/API
- n8n trigger/ack/callback
- Schema validation, 실패, 재시도, 이력
- 기존 후보 유지와 신규 후보 추가

### Slice 5. Section Asset 생성

- Section Asset 요청과 상태 저장
- URL/파일/AI 이미지 표시 계약 통합
- n8n Section Asset Workflow
- 부분 실패, 개별 재생성, 기존 Asset 유지

### Slice 6. Web Output 자동 QA

- immutable Final Snapshot
- coverage, overflow, CTA, 접근성 검사
- Desktop/Tablet/Mobile 검증
- 실패 차단과 새 attempt 생성

### Slice 7. 선택적 LLM Vue 코드 생성

- Sandbox 기술 스파이크
- 허용 Component/import 계약
- 자동 build와 QA
- 검증된 Renderer만 Registry 등록

이 단위는 고정 Renderer와 Design Spec 방식이 운영 검증된 이후에만 진행한다.

### 관리자와 사용자 작업 순서

첫 시작점은 사용자 영역의 Renderer 기술 검증이다. 현재 관리자에는 Form Template, Section, Item 관리가 이미 있으므로 신규 관리자 화면을 먼저 만들 필요가 없다.

```text
사용자 Default Renderer
  -> 사용자 Preview/Web Output
  -> 관리자 Renderer 연결
  -> 사용자 고정 Variant 선택
  -> 관리자 LLM/Prompt 설정 확장
  -> 사용자 AI Variant/Asset 생성
```

이 순서는 작동하는 사용자 결과를 기준으로 관리자 설정의 필요성과 데이터 구조를 확인할 수 있어 불필요한 CRUD와 migration을 줄인다.

## 11. 권장 실행 범위

1차로 **Phase 0~1만** 승인한다. 이 범위에서 동일 Renderer로 Preview=Output 가설을 증명한 뒤 Phase 2 이후를 재검토한다. Phase 7~8은 지금 승인하지 않는다. n8n 기존 Workflow 기술부채 정리는 Phase 0~1과 독립적인 별도 트랙으로 진행할 수 있다.

## 12. 착수 전 결정이 필요한 항목 (제안서 20장 기반, 우선순위 재정렬)

Phase 0~1 착수 전 결정 필요:
1. Renderer 전용 Vite bundle의 build/배포 경로와 Web Output route
2. Phase 0 Default Renderer가 지원할 기준 Form Template

Phase 2~4 착수 전 결정 필요:
3. 관리자가 Renderer를 직접 선택할지, Default Renderer를 자동 적용할지
4. 생성된 Design Spec을 사용자 Run 전용으로 둘지 재사용 후보로 승격할지
5. 이미지 Asset 저장소와 보관·버전 정책
6. 기존 Image Run과 신규 Renderer Run의 DB 연결 방식
7. n8n Credential 등록 오류를 이번에 해결할지 여부

Phase 7 착수 전 결정 필요:
8. Sandbox 실행 환경
9. 생성 코드의 허용 import 목록과 Component Library 범위
10. 자동 시각 QA에 사용할 Browser/Viewport와 Visual LLM
11. 자동 생성 실패 시 기존 Registry Template fallback 정책
12. 디자인 다양성 점수 산정 방식
13. 생성 템플릿 보관 기간과 비용 제한
