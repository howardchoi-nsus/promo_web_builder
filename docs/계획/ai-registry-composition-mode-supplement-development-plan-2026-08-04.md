# Registry 기반 AI 프로모션 Composition Mode 보완 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-04
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 전 계획 / 소스코드 미반영
- 선행 계획: `docs/계획/ai-page-section-composition-engine-development-plan-2026-07-29.md`
- 목적: 기존 Template 후보 선택형 Page Composer를 Registry 기반 Section·Component Composition Mode로 단계적으로 확장한다.
- 기준 Renderer: `visual-editor/src/PromoPageRenderer.vue`
- 기준 저장 모델: Builder Document revision + Composition/Layout snapshot

이 문서는 선행 계획을 폐기하지 않는다. 2026-08-04 기준 구현 상태를 반영해 다음 보완 사항을 실행 가능한 개발 단위로 구체화한다.

1. Template을 직접 선택하는 구조에서 Blank Composition Shell 기반 구조로 전환한다.
2. AI가 HTML·CSS를 생성하지 않고 CompositionSpec만 생성하도록 책임을 고정한다.
3. Template에 종속된 Section 후보를 활성 Registry 후보로 확장한다.
4. Component 반복을 Collection 계약으로 표현한다.
5. 약관·Footer 등 공통 콘텐츠를 Versioned Resource Registry로 관리한다.
6. AI가 raw CSS 값이 아닌 semantic token binding만 선택하게 한다.
7. 정책 주입, 후보 해석, 검증, 컴파일, 렌더링을 명확히 분리한다.

---

## 1. 실행 요약

### 1.1 최종 목표

사용자가 다음과 같이 요청한다.

```text
여름 이벤트 페이지를 만들어줘.
Hero는 제목과 설명만 사용하고,
아래에는 이미지·설명·버튼 카드 3개를 배치해줘.
약관은 한국 시장 공통 약관을 사용해줘.
```

시스템은 다음 순서로 처리한다.

```text
자연어 입력
  → Intent Normalizer
  → Policy Enricher
  → Registry Candidate Resolver
  → Page Composition Planner
  → Section·Component Composer
  → Schema·Policy Validator
  → Layout Planner
  → Token·Resource Resolver
  → Composition Compiler
  → Builder Document
  → Visual Editor / Web Output Renderer
```

AI는 활성화된 Registry version과 서버가 제공한 후보 안에서만 선택한다. HTML, CSS, JavaScript, 임의 ID, 임의 토큰 값은 생성하지 않는다.

### 1.2 제품 운영 모드

기존 기능을 즉시 대체하지 않고 다음 두 모드를 병행한다.

| 모드 | 역할 | 상태 |
|---|---|---|
| Template Mode | 검증된 고정 구조를 빠르게 생성 | 기존 기능 유지 |
| AI Composition Mode | Blank Shell에서 Registry 기반으로 Section과 Component를 조합 | 신규 확장 |

AI Composition Mode 장애 시 Template Mode를 즉시 fallback으로 사용할 수 있어야 한다.

### 1.3 핵심 원칙

1. AI 출력의 Source of Truth는 HTML이 아니라 versioned CompositionSpec이다.
2. DOM은 Composition Compiler와 공통 Renderer가 결정론적으로 생성한다.
3. 규제·약관·필수 Section 결정은 LLM이 아니라 Policy Engine이 최종 권한을 가진다.
4. AI는 Registry에 없는 Section·Component·Field·Token·Resource를 생성할 수 없다.
5. AI가 새로운 Component 정의나 코드를 생성한 경우 운영 Registry에 자동 등록하지 않는다.
6. 모든 적용은 Builder Document revision과 candidate fingerprint를 검증한다.
7. Desktop과 Mobile Layout은 같은 구조를 공유하되 breakpoint별 snapshot을 분리한다.
8. Prompt 본문, runtime guard, validation 결과와 최종 합성 prompt를 추적 가능하게 저장한다.

---

## 2. 현행 구현 분석

### 2.1 재사용할 기반

| 영역 | 현행 자산 | 처리 |
|---|---|---|
| Intent 분석 | `promo_overview_parser` | 유지·입력 계약 확장 |
| Page Composer | `promo_page_composer` | Registry 후보형으로 확장 |
| Section Composer | `section_composition_planner` | 유지·Template context 제거 |
| Component Registry | `wizard_item_components` 및 version | 재사용 |
| Section Registry 기반 | `wizard_content_sections` 및 component instance | scope 확장 |
| Section 정책 | `composition_scope`, `section_role`, `composition_policy` | 재사용·정규화 |
| Layout Preset | Section layout snapshot | 재사용 |
| Design Token | versioned token set과 binding | 재사용 |
| Motion | Motion Preset 및 token | 재사용 |
| 이미지 생성 | Asset request/job | Composition과 비동기 분리 유지 |
| Builder 저장 | document revision, proposal, snapshot | 재사용 |
| Renderer | 공통 Vue Renderer | 단일 기준 유지 |
| Visual Editor | 공통 Live Preview | 적용 후 편집기로 유지 |

### 2.2 현재 제약

1. Page Composition schema가 `templateId`를 필수로 요구한다.
2. 선택 가능한 Section ID는 후보 Template의 Section으로 한정된다.
3. Component도 해당 Template Section에 이미 등록된 instance만 선택할 수 있다.
4. Section 단위 Composition context가 `formTemplateId`를 요구한다.
5. 공통 약관·Footer는 shared Section 정책은 있으나 독립적인 Resource version reference가 없다.
6. 반복 UI는 명시적 Collection 계약이 아니라 instance 복제에 의존한다.
7. HTML·Vue·React 출력이 Composition Source of Truth와 Export Adapter로 명확히 분리되지 않았다.

### 2.3 유지해야 할 안전장치

- `allowHtml: false`
- `allowCss: false`
- JSON Schema structured output
- server-approved candidate snapshot
- document revision mismatch 차단
- overview/candidate fingerprint 검증
- active version만 Planner 후보로 제공
- Section·Component 참조 무결성 검증
- required/fixed/legal policy 검증
- Prompt execution snapshot 저장

---

## 3. 목표 도메인 모델

### 3.1 Blank Composition Shell

AI Composition Mode의 최소 페이지 계약이다.

```json
{
  "shellKey": "promo-default-shell",
  "version": 1,
  "requiredSectionRoles": ["header", "footer"],
  "policyControlledRoles": ["terms", "legal", "responsible-gaming"],
  "contentWidthPolicy": "desktop-1280",
  "responsivePolicy": "desktop-mobile-v1",
  "allowedRegistryScopes": ["shared", "registry"],
  "fallbackTemplateId": "uuid"
}
```

Shell은 스타일 Template이 아니라 페이지의 안전·정책·렌더링 경계를 제공한다.

### 3.2 Section Registry 확장

`composition_scope`에 `registry`를 추가한다.

scope의 책임은 다음과 같이 고정한다.

| scope | 책임 | Template 소유 |
|---|---|---|
| `shared` | Header, Footer, Terms, Legal처럼 정책이 통제하는 공통 Section | 금지 |
| `registry` | Hero, Benefit, Card Grid, FAQ처럼 AI가 선택·조합하는 일반 Section | 금지 |
| `template` | 특정 Template에서만 사용하는 전용 Section | 허용 |

`shared`와 `registry`는 모두 `owner_form_template_id`가 없어야 한다. 차이는 재사용 가능 여부가 아니라 Policy Engine이 강제로 관리하는 공통 영역인지, AI가 후보 중 선택하는 일반 영역인지다.

Section version에 필요한 주요 속성:

```json
{
  "sectionRole": "hero",
  "purposeTags": ["campaign-intro", "event-highlight"],
  "capabilities": ["title", "description", "image"],
  "selectionPolicy": "optional",
  "allowedMarkets": [],
  "allowedPromotionPurposes": [],
  "allowedComponentCapabilities": [],
  "allowedComponentKeys": [],
  "allowedLayoutVariants": ["left", "right", "center", "full-background"],
  "minComponentCount": 1,
  "maxComponentCount": 12,
  "duplicatePolicy": "limited",
  "maxInstances": 1,
  "responsivePolicyKey": "section-standard-v1"
}
```

`componentKey`와 capability는 후보 검색에 사용한다. Proposal과 candidate snapshot에는 선택 시점의 `componentVersionId`를 고정하고, Builder Document 적용 시 서버가 `pageComponentInstanceId`를 발급한다.

### 3.3 Component Registry 보완

Component version은 다음 계약을 제공해야 한다.

- 역할과 capability
- 허용 가능한 Section role
- 필수·선택 Field
- Field별 content source
- Layout slot 및 placement policy
- Collection 허용 여부와 min/max item
- 허용 semantic token role
- Desktop/Mobile 최소·최대 크기
- 접근성 role과 필수 label
- AI content editable 여부

### 3.4 Collection 계약

반복 Component는 다음 구조로 표현한다.

```json
{
  "componentVersionId": "uuid",
  "collection": {
    "requestedItems": 3,
    "minItems": 1,
    "maxItems": 6,
    "layout": "grid",
    "desktopColumns": 3,
    "mobileColumns": 1
  },
  "instances": [
    { "pageComponentInstanceId": "cmp_1", "content": {} },
    { "pageComponentInstanceId": "cmp_2", "content": {} },
    { "pageComponentInstanceId": "cmp_3", "content": {} }
  ]
}
```

각 item은 고유 ID를 가져야 하며 Visual Editor에서 개별 편집·삭제·재정렬할 수 있어야 한다.

### 3.5 Versioned Resource Registry

신규 테이블 후보:

```text
promo_common_resources
promo_common_resource_versions
promo_common_resource_market_rules
promo_common_resource_histories
```

Resource 유형:

- terms
- privacy-policy
- responsible-gaming
- legal-disclaimer
- footer-content
- customer-center
- brand-logo
- common-cta-content

Resource는 콘텐츠·링크·Asset reference만 담당한다. UI 구조와 Layout 책임은 다음과 같이 분리한다.

- Footer Layout: `shared` Footer Section
- Footer 문구·링크·법적 고지: `footer-content` Resource
- Common CTA UI: Component
- Common CTA 기본 문구·URL 정책: `common-cta-content` Resource 또는 승인된 preset content
- Brand Logo: Asset Resource를 참조하는 Logo Component

페이지에는 파일 경로 대신 다음 reference를 저장한다.

```json
{
  "resourceKey": "common-terms",
  "resourceVersionId": "uuid",
  "market": "KR",
  "locale": "ko-KR",
  "resolutionPolicy": "pinned",
  "contentHash": "sha256"
}
```

법적 콘텐츠는 기본적으로 `pinned`로 저장한다. 최신 버전 자동 추종이 필요한 리소스만 `latest-compatible`을 허용한다.

Resource 저장·렌더링 보안 규칙:

- Markdown과 제한된 rich text는 저장 및 출력 전에 allowlist sanitizer를 통과한다.
- 임의 HTML, inline script, event handler와 `javascript:` URL을 차단한다.
- 외부 링크는 허용 protocol과 필요 시 domain allowlist를 검증한다.
- Asset은 MIME, 크기, 접근 권한과 hash를 검증한다.
- 법적 콘텐츠는 임의 `v-html`로 출력하지 않고 승인된 Renderer를 사용한다.
- Resource 본문 원문은 일반 실행 로그에 기록하지 않는다.

### 3.6 Composition Contract v3

```json
{
  "schemaVersion": 3,
  "mode": "ai-composition",
  "documentId": "uuid",
  "documentRevision": 12,
  "shellVersionId": "uuid",
  "intentSnapshot": {},
  "policySnapshot": {},
  "designTokenSetVersionId": "uuid",
  "sections": [
    {
      "pageSectionInstanceId": "sec_xxx",
      "sectionVersionId": "uuid",
      "sectionRole": "hero",
      "layoutVariant": "center",
      "components": [],
      "resourceReferences": [],
      "desktopLayout": {},
      "mobileLayout": {},
      "motion": {}
    }
  ],
  "provenance": {},
  "promptExecutionSnapshot": {},
  "validationSnapshot": {}
}
```

기존 Template Mode 문서는 그대로 읽을 수 있어야 하며, Contract v3 도입 시 일괄 변환하지 않는다.

---

## 4. 서비스 책임 분리

### 4.1 Intent Normalizer

- 자연어를 프로모션 목적, 시장, 언어, 기간, 콘텐츠 요구, Section 힌트로 정규화한다.
- 사용자에게 확인이 필요한 금액·기간·URL·법적 조건을 표시한다.
- Registry ID나 Layout 좌표를 결정하지 않는다.

### 4.2 Policy Enricher

- market/locale/purpose에 따른 필수 Section과 Resource를 결정한다.
- Header, Footer, Terms, Legal, Responsible Gaming을 강제 주입하거나 잠근다.
- LLM 결과보다 우선한다.

### 4.3 Registry Candidate Resolver

- 활성 version만 조회한다.
- Section role, capability, market, promotion purpose, Shell 정책으로 후보를 축소한다.
- Component와 token의 허용 관계를 candidate snapshot으로 고정한다.
- 후보가 너무 많으면 deterministic ranking으로 LLM 입력 크기를 제한한다.

### 4.4 Composition Planner

선택 항목:

- Section version
- Section 순서와 반복 수
- Component version과 반복 수
- Field content binding
- Layout Variant
- semantic token binding
- Motion Preset
- Asset request 의도

금지 항목:

- HTML/CSS/JavaScript
- Registry에 없는 ID
- raw CSS token value
- 법적 콘텐츠 본문 생성
- 임의 URL·금액·기간 확정

### 4.5 Validator와 Repair

검증 실패 시 자유 재생성이 아니라 오류 코드와 허용 후보를 포함한 제한된 repair 요청을 한 번 수행한다.

Repair 이후에도 실패하면 사용자에게 안전한 fallback과 구체적인 오류를 제공한다.

### 4.6 Layout Planner

- Composition이 확정된 후 실행한다.
- Desktop과 Mobile Layout을 각각 생성한다.
- Registry의 min/max size, allowed region, aspect ratio를 지킨다.
- 자유 CSS가 아닌 layout command와 snapshot만 반환한다.

### 4.7 Token·Resource Resolver

- semantic role을 실제 token key와 version value로 해석한다.
- Resource reference를 market/locale/effective date 기준으로 고정한다.
- 결과 hash와 version을 Composition snapshot에 기록한다.

### 4.8 Composition Compiler

- 검증된 CompositionSpec을 Builder Document로 변환한다.
- 새로운 Section·Component instance ID를 발급한다.
- preset content, visibility, layout, motion, resource reference, provenance를 함께 저장한다.
- 같은 검증 완료 CompositionSpec과 같은 Registry·Resource·Token version을 입력하면 의미적으로 동일한 Builder Document를 생성해야 한다.
- Planner의 자연어 생성 결과 자체는 결정론 대상으로 보지 않는다. Compiler와 Resolver만 결정론·idempotency 대상으로 관리한다.

---

## 5. API 계획

### 5.1 기존 API 확장 원칙

```text
POST /api/promo-overview-parse
     + mode: "ai-composition"

POST /api/promo-page-composition-proposals
GET  /api/promo-page-composition-proposals?id=...
     + mode: "ai-composition"
     + contractVersion: 3
     + shellVersionId

POST /api/promo-page-composition-apply
     + Contract v3 proposal apply 지원

POST /api/promo-page-composition-operations
     + 적용 이후 Contract v3 부분 수정 operation 지원
```

Intent, Proposal, Apply, 적용 이후 Operation은 기존 API를 versioned contract로 확장한다. 이름만 다른 병렬 API를 만들지 않는다.

### 5.2 신규 도메인 API

```text
GET  /api/promo-composition-shells
GET  /api/promo-registry-candidates
POST /api/promo-composition-layout-plan
GET  /api/promo-common-resources
POST /api/promo-common-resource-resolve
```

신규 API는 기존 endpoint가 담당하지 않는 Shell, Registry candidate, Resource resolution에만 추가한다.

### 5.3 Proposal 상태와 Stage

기존 Proposal `status` 계약을 유지한다.

```text
queued
processing
ready
failed
applied
superseded
cancelled
```

세부 진행은 신규 `stage`로 분리한다.

```text
planning
validating
repairing
applying
```

예: `status=processing`, `stage=validating`. Candidate나 document revision이 오래된 결과는 신규 `stale` status를 추가하지 않고 기존 `superseded` 또는 명시적 오류 코드로 처리한다.

### 5.4 동시성 계약

적용 시 다음을 모두 재검증한다.

- `baseDocumentRevision`
- `overviewFingerprint`
- `candidateFingerprint`
- `policyFingerprint`
- `resourceFingerprint`
- Shell version status
- Registry version status
- Resource version availability
- Design Token version status

하나라도 변경되면 자동 덮어쓰지 않고 새 proposal 생성을 요구한다.

---

## 6. Prompt 관리 및 관측성

### 6.1 Prompt 유형

```text
promo_intent_normalizer
promo_registry_page_composer
promo_registry_composition_repair
promo_registry_layout_planner
promo_composition_editor
```

모든 제품 prompt는 관리자 Prompt 설정에서 versioned 관리한다.

Runtime guard는 다음 조건으로 분리한다.

- 안전·스키마·법규 강제 규칙만 허용
- 관리 Prompt와 구분된 이름과 version을 가진다.
- 최종 합성 Prompt 미리보기에서 확인할 수 있어야 한다.
- 실행 snapshot에 body hash와 guard hash를 각각 저장한다.

### 6.2 로그와 메트릭

필수 로그:

- document/proposal/request ID
- prompt template/version/hash
- candidate/policy fingerprint
- 후보 Section·Component 개수
- 선택된 ID와 제외 사유
- validation error code
- repair 여부
- latency와 token usage
- apply revision 결과

필수 메트릭:

- proposal 성공률
- repair 비율
- validation 실패 유형
- Template fallback 비율
- 평균 생성 시간
- 사용자 수동 수정량
- Resource/Token resolution 실패율

로그에 전체 약관 본문, 개인정보, API key를 기록하지 않는다.

---

## 7. 검증 Gate

### 7.1 구조 검증

- JSON Schema version
- 허용되지 않은 속성 차단
- 모든 Section·Component instance ID 유일성
- Registry version 참조 무결성
- collection min/max/repeat 검증
- 중복 Section 정책

### 7.2 정책 검증

- 필수 Header/Footer
- market별 Terms/Legal/Responsible Gaming
- locked content 수정 차단
- fixed position 규칙
- CTA URL 확인 상태
- 금액·기간의 사용자 확인 여부

### 7.3 Token 검증

- semantic role과 token category 호환
- active token version
- 필수 token 존재
- raw CSS 값과 안전하지 않은 CSS 차단

### 7.4 Layout 검증

- Desktop/Mobile overflow
- Component overlap
- 최소 터치 영역
- 이미지 aspect ratio
- Section 최소 높이
- hidden component와 resize handle 일치

### 7.5 접근성 검증

- 제목 계층
- 이미지 alt 또는 decorative 정책
- CTA accessible name
- 색상 대비
- 키보드 순서
- `prefers-reduced-motion`

### 7.6 렌더링 검증

- Visual Editor와 Web Output 구조 일치
- reload 후 snapshot 복원
- Output HTML에 editor 전용 UI 미포함
- 직접 편집 후 revision 증가
- 기존 화면으로 돌아가기 상태 유지

---

## 8. 단계별 개발 계획

## P0. 계약·Feature Flag·기준 테스트

### 작업

1. `AI_COMPOSITION_MODE_V3` Feature Flag를 추가한다.
2. 기존 Contract v2와 신규 v3의 호환 규칙을 문서화한다.
3. Template Mode baseline snapshot과 브라우저 테스트를 고정한다.
4. 기존 Prompt hardcoding과 runtime guard를 inventory로 확정한다.
5. 대표 입력 10종과 기대 Composition fixture를 작성한다.

### 완료 기준

- Flag가 꺼지면 기존 동작과 결과가 동일하다.
- 기존 Template Mode 핵심 테스트가 모두 통과한다.
- 신규 contract fixture가 schema validation을 통과한다.

### 디버깅 Gate

- build
- contract test
- Template Mode browser smoke
- `git diff --check`

## P1. Blank Composition Shell과 Registry scope

### 작업

1. Shell/version 저장 모델과 Admin 관리 기능을 추가한다.
2. `composition_scope='registry'` migration을 추가한다.
3. Section role/capability/purpose 필드를 정규화한다.
4. 기존 shared Section을 Shell에서 참조하도록 연결한다.
5. fallback Template을 Shell에 지정한다.

### 완료 기준

- Template ID 없이 Shell과 Registry 후보를 조회할 수 있다.
- Header/Footer/Legal 정책을 Shell에서 검증한다.
- 기존 shared/template Section은 변경 없이 동작한다.

### 디버깅 Gate

- migration up 검증
- 기존 데이터 read compatibility
- Registry CRUD/activation contract
- Shell Admin browser test

## P2. Registry Candidate Resolver

### 작업

1. market, locale, purpose, capability 입력으로 Section 후보를 조회한다.
2. Section 후보별 허용 Component version을 구성한다.
3. Token, Motion, Resource 후보를 함께 snapshot에 포함한다.
4. deterministic ranking과 후보 개수 제한을 적용한다.
5. candidate fingerprint와 제외 사유를 저장한다.

### 완료 기준

- 후보가 특정 Template에 종속되지 않는다.
- inactive/archived version은 포함되지 않는다.
- 동일 입력과 Registry 상태에서 fingerprint가 동일하다.

### 디버깅 Gate

- candidate unit/contract test
- 대량 Registry 성능 테스트
- market/purpose 필터 회귀 테스트

## P3. Resource Registry와 Policy Enricher

### 작업

1. Resource/version/market rule/history 테이블을 추가한다.
2. Resource Admin CRUD와 활성화·보관 정책을 구현한다.
3. market/locale/effective date resolver를 구현한다.
4. Policy Enricher가 필수 Resource Section을 강제 주입하게 한다.
5. page snapshot에 pinned reference와 hash를 저장한다.

### 완료 기준

- AI가 약관 본문을 생성하지 않는다.
- 시장과 언어에 맞는 활성 version을 선택한다.
- 기존 페이지는 pinned resource를 계속 재현한다.

### 디버깅 Gate

- 유효기간 경계 테스트
- locale fallback 테스트
- inactive/archived resource 차단
- legal content 변경 이력 테스트

## P4. Composition Contract v3 Proposal Slice

대표 시나리오:

```text
Hero: Title + Description
Card Grid: Image + Description + Button × 3
Terms: Common Resource Reference
```

### 작업

1. v3 JSON Schema와 validator를 추가한다.
2. Template ID 없는 Registry Page Composer Prompt를 추가한다.
3. Section·Component·Collection·Resource reference 선택을 검증한다.
4. repair 1회와 fallback 정책을 추가한다.
5. 기존 Proposal·Apply API에 `mode`, `contractVersion`, `shellVersionId`를 연결한다.
6. proposal preview와 사용자 승인 흐름을 연결한다.

### 완료 기준

- 대표 입력이 Registry version ID와 pinned Resource reference로 구성된 proposal을 생성한다.
- `repeat=3` 요청이 Collection cardinality 3으로 검증된다.
- 허용되지 않은 ID와 Resource는 apply 전에 차단된다.
- 이 단계의 범위는 proposal 생성·검증·preview까지이며 Builder Document 적용은 P5에서 완료한다.

### 디버깅 Gate

- schema fuzz test
- invalid ID/duplicate/limit test
- proposal retry/repair test
- Resource reference validation test
- browser proposal preview test

## P5. Layout·Token Resolver·Composition Compiler E2E Vertical Slice

### 작업

1. Section variant와 Component placement를 분리한다.
2. Desktop/Mobile layout command schema를 추가한다.
3. semantic token binding resolver를 구현한다.
4. CompositionSpec을 기존 Builder Document snapshot으로 컴파일한다.
5. preset content, image URL, visibility, motion, provenance를 보존한다.
6. 검증된 Proposal을 apply하고 공통 Visual Editor와 Web Output까지 연결한다.
7. 실패 시 Shell의 fallback Template으로 전환하는 조건과 사용자 안내를 구현한다.

### 완료 기준

- AI가 raw CSS 없이 두 breakpoint Layout을 생성한다.
- 컴파일 후 공통 Renderer가 즉시 페이지를 표시한다.
- 저장·reload 후 동일한 구성과 콘텐츠가 복원된다.
- Hero + Card 3개 + 공통 Terms가 Visual Editor 저장·재편집·Web Output까지 동작한다.
- fallback은 `COMPOSITION_CANDIDATES_EMPTY`, repair 실패, 필수 Resource 해석 실패처럼 명시된 오류 코드에서만 수행한다.

### 디버깅 Gate

- layout geometry contract
- token compatibility test
- Visual Editor browser E2E
- Web Output renderer parity test

## P6. 자연어 수정·Undo/Redo·동시성

### 작업

1. Section 추가·삭제·교체·순서 변경 operation을 추가한다.
2. Component collection item add/remove/reorder를 지원한다.
3. 구조 변경을 Undo/Redo command stack에 포함한다.
4. Composition revision과 Layout revision을 원자적으로 저장한다.
5. revision mismatch UI와 재적용 흐름을 구현한다.

### 완료 기준

- 자연어와 수동 편집을 번갈아 수행해도 상태가 유실되지 않는다.
- 충돌 시 자동 덮어쓰기 없이 사용자에게 비교·재시도 경로를 제공한다.

### 디버깅 Gate

- concurrent apply test
- undo/redo browser test
- reload/re-entry persistence
- stale proposal rejection

## P7. Export Adapter·운영 배포

### 작업

1. Builder Document를 HTML로 출력하는 Adapter를 확정한다.
2. Vue/React 출력은 동일 CompositionSpec 기반 별도 Adapter로 구현한다.
3. Export 결과의 asset/resource/token dependency manifest를 생성한다.
4. Feature Flag와 사용자 그룹으로 점진 배포한다.
5. Template fallback과 rollback 절차를 자동화한다.

### 완료 기준

- Visual Editor와 Export 결과의 콘텐츠·순서·토큰이 일치한다.
- 출력 코드에 editor state와 내부 관리 UI가 포함되지 않는다.
- Flag 비활성화만으로 신규 생성 진입을 차단할 수 있다.

---

## 9. 테스트 전략

### 9.1 Contract

- Shell schema
- Registry candidate schema
- Composition Contract v3
- Collection cardinality
- Resource reference
- semantic token binding
- Desktop/Mobile layout command
- operation/undo command

### 9.2 API

- 정상 proposal/apply
- idempotency
- 기존 API의 `mode=template`, Contract v2 호환
- 동일 API의 `mode=ai-composition`, Contract v3 분기
- revision mismatch
- stale candidate/policy fingerprint
- inactive version
- required Resource 누락
- repair 성공/실패
- fallback Template 전환

### 9.3 Browser E2E

1. AI Composition Mode 진입
2. 자연어 입력
3. 분석 결과 확인
4. proposal 생성
5. Hero + Card 3개 + Terms 확인
6. 적용 후 Live Preview 렌더링
7. Desktop/Mobile 전환
8. 텍스트·이미지·버튼 수정
9. collection 재정렬
10. 저장·재진입
11. Web Output 확인
12. 기존 Live Preview로 복귀

### 9.4 비기능 테스트

- Registry 후보 1,000건에서 resolver 응답 시간
- LLM candidate payload 크기
- Proposal timeout/retry
- 악성 자연어 입력
- HTML/CSS/script injection 차단
- Resource Markdown/rich text sanitizer와 위험 URL 차단
- Asset MIME·크기·hash 검증
- Resource 본문 개인정보 로그 미노출
- Node 22.x build/test

---

## 10. Migration과 호환성

1. 모든 DB 변경은 additive migration으로 작성한다.
2. `wizard_content_sections_composition_scope_chk`에 `registry`를 추가하되 기존 `shared|template` 값과 관계를 변경하지 않는다.
3. `shared|registry` Section은 `owner_form_template_id is null`이어야 한다는 activation 검증을 추가한다.
4. Shell은 `promo_composition_shells`, `promo_composition_shell_versions`로 versioned 관리하고 active version을 명시한다.
5. Resource는 resource/version/market rule/history 테이블을 additive하게 추가한다.
6. `promo_builder_composition_proposals`에 `stage`, `shell_version_id`, `policy_fingerprint`, `resource_fingerprint`를 추가한다.
7. 기존 Proposal 생성·적용 함수는 Contract v2 전용으로 유지하고, Contract v3는 별도 `create_promo_builder_composition_proposal_v3`, `apply_promo_builder_composition_proposal_v3` 함수로 추가한다. 서버 저장소는 명시적인 `contractVersion=3`일 때만 신규 함수를 호출한다.
8. `source_template_id`는 기존 nullable 계약을 유지하고 AI Composition Mode에서는 `null`을 허용한다.
9. 기존 `status` check와 Worker 전이는 유지하고 세부 진행 상태만 `stage`에 저장한다.
10. 기존 문서는 Contract v2로 계속 읽고 v3 저장은 AI Composition Mode에서만 시작한다.
11. 기존 Template을 일괄 Registry Section으로 전환하지 않고 관리자 승인된 Section부터 `registry` scope를 부여한다.
12. Resource 도입 전 기존 locked legal Section은 계속 지원한다.
13. rollback 시 신규 데이터는 보존하고 신규 진입만 Flag로 차단한다.

### 10.1 1단계 구현 현황 (2026-08-04)

- Migration `049_registry_composition_v3_foundation.sql` 추가
- Shell 및 Shell version 저장 구조와 Shell별 단일 active version 제약 추가
- Proposal에 `stage`, `shell_version_id`, `policy_fingerprint`, `resource_fingerprint` 추가
- AI 문서, 활성 Shell, JSON object snapshot, fingerprint, idempotency를 검증하는 v3 Proposal 생성 함수 추가
- 문서 revision, Proposal fingerprint, Shell 활성 상태를 원자적으로 재검증하는 v3 Apply 함수 추가
- 기존 v2 함수와 호출 경로는 변경하지 않고 저장소에 명시적 v3 분기만 추가
- Worker의 기존 coarse status는 유지하고 v3 lease에서만 `stage=planning`을 기록
- DB 실적용과 v3 API 연결은 후속 단계에서 진행

### 10.2 2단계 구현 현황 (2026-08-04)

- `AI_COMPOSITION_MODE_V3` Feature Flag를 기본 비활성 상태로 추가
- Migration `050_registry_scope_and_composition_shell_management.sql` 추가
- Section `composition_scope`에 `registry`를 additive하게 추가하고 Template 소유 금지 제약 적용
- Shell version에 활성 fallback Template version 참조 추가
- Shell 생성, version draft 복제, draft 수정, 활성화 API 추가
- Shell version 활성화 시 Shell 상태, config JSON, fallback Template 활성 상태를 검증
- 기존 Section 및 Template 응답이 `registry` scope를 손실하지 않도록 mapper 보완
- v3 Proposal API 직접 연결은 Registry Candidate Resolver와 v3 Worker가 준비된 이후로 제한

### 10.3 3단계 구현 현황 (2026-08-04)

- Migration `051_registry_candidate_resolver_indexes.sql` 추가
- 활성 Shell version을 기준으로 `registry` Section과 Shell이 참조한 `shared` Section만 후보화
- inactive Component version, AI 비활성 Section, Layout preset 미등록 Section 제외
- market, locale, promotion purpose, capability 필터 및 제외 사유 제공
- capability는 서로 다른 역할의 Section 조합을 보존하기 위해 Section별 하나 이상 매칭으로 평가하고 Shell 필수 역할은 항상 유지
- deterministic score, 정렬 tie-breaker, 후보 수 제한 적용
- Component·Layout은 Section별 순차 조회 대신 Section ID 배열 일괄 조회로 구성해 N+1 쿼리 제거
- 10,000개 후보 정렬·상위 제한 계약 테스트 추가
- 활성 Design Token set과 Motion preset을 Shell 허용 목록으로 제한해 snapshot에 포함
- Resource Registry 도입 전까지 `resources=[]`와 결정적 `resourceFingerprint`를 저장
- candidate, policy, resource fingerprint와 제외 목록을 반환하는 Flag 보호 API 추가

### 10.4 4단계 구현 현황 (2026-08-04)

- Migration `052_content_resource_registry.sql` 추가
- Resource, locale별 version, market/locale/purpose rule, 변경 history 저장 구조 추가
- Resource version의 시작·종료 유효기간과 활성 구간 중복 검증 추가
- 신규 version 활성화 시 이전 open-ended version을 신규 시작 시점에 자동 종료
- exact locale → language locale → wildcard 순서의 locale fallback 적용
- market, locale, promotion purpose, priority 기반 결정적 Rule 선택 적용
- Candidate에는 본문을 전달하지 않고 pinned `resourceVersionId`, `contentHash`, `marketRuleId`만 포함
- 필수 Resource에 대응하는 Section을 `resolvedRequired`로 승격하고 누락 시 `RESOURCE_POLICY_UNRESOLVED` 차단
- Resource 관리 API에 Resource 생성, version 생성·활성화, market rule 생성을 추가
- content hash는 JSON key 순서와 무관하게 동일하도록 canonical fingerprint 적용

Migration 검증에는 up migration뿐 아니라 다음 호환 테스트를 포함한다.

- 기존 Contract v2 proposal 생성·조회·apply
- Contract v3 proposal의 nullable `source_template_id`
- 기존 status를 사용하는 Worker lease/retry/cancel
- Registry scope activation과 Template 소유 차단
- Resource/Shell version 활성화 및 참조 무결성

---

## 11. 위험 요소와 대응

| 위험 | 대응 |
|---|---|
| 후보가 많아 Prompt가 비대해짐 | deterministic filtering/ranking, capability index |
| AI가 규제 Section을 제거 | Policy Enricher와 apply validator가 강제 |
| 자유 Layout으로 overlap 증가 | bounded layout command, geometry validation |
| Registry version 변경으로 결과 불일치 | proposal fingerprint와 pinned version |
| 약관 최신화가 기존 페이지를 변경 | pinned resource version/hash |
| AI가 임의 CSS를 생성 | raw CSS field 자체를 schema에서 제외 |
| Component 반복으로 ID 충돌 | 서버가 instance ID 발급 |
| Template Mode 회귀 | Feature Flag와 별도 baseline suite |
| 자연어 수정과 수동 편집 충돌 | revision 기반 operation apply |
| Prompt 설정과 runtime guard 불일치 | 최종 합성 Prompt 표시 및 분리 hash |
| 생성 지연 | 구조 proposal 우선 렌더링, Asset Job 비동기 |
| Resource 본문 또는 링크를 통한 injection | allowlist sanitizer, URL protocol/domain 검증, 승인 Renderer |
| 기존 API와 신규 API가 분기되어 중복 유지됨 | 기존 Overview/Proposal/Operation API의 versioned 확장 |
| Proposal 상태 확장으로 기존 Worker가 중단됨 | coarse status 유지, 세부 진행은 stage로 분리 |

---

## 12. 완료 정의

다음을 모두 만족해야 Registry 기반 AI Composition Mode를 완료로 본다.

1. 사용자가 Template을 선택하지 않고 자연어로 페이지를 생성할 수 있다.
2. Page Composer가 Template ID가 아니라 Shell과 Registry 후보로 동작한다.
3. Section과 Component는 활성 version과 허용 정책 안에서만 선택된다.
4. 반복 Component가 Collection 계약과 고유 instance ID로 저장된다.
5. 약관과 공통 콘텐츠는 versioned Resource reference로 연결된다.
6. Design Token은 semantic binding으로만 선택된다.
7. AI가 HTML, CSS, JavaScript를 생성하지 않는다.
8. Composition Compiler가 Builder Document를 생성한다.
9. Visual Editor와 Web Output이 동일 Renderer 결과를 사용한다.
10. Desktop/Mobile Layout이 저장·재진입 후 복원된다.
11. document revision과 candidate/policy/resource fingerprint 및 Shell version 충돌이 차단된다.
12. Prompt와 runtime guard의 최종 합성 결과를 추적할 수 있다.
13. Template Mode 회귀 테스트가 계속 통과한다.
14. Node 22.x 기준 build, contract, API, browser E2E가 통과한다.
15. Feature Flag 비활성화와 Template fallback으로 안전하게 롤백할 수 있다.

---

## 13. 권장 착수 순서

```text
P0 계약·Flag
  → P1 Blank Shell·Registry scope
  → P2 Candidate Resolver
  → P3 Resource Registry·Policy Enricher
  → P4 Contract v3 Proposal Slice
  → P5 Layout·Token·Compiler E2E Vertical Slice
  → P6 수정·Undo·동시성
  → P7 Export·운영 배포
```

첫 개발 목표는 전체 기능이 아니라 다음 Vertical Slice다.

> Template 선택 없이 Hero(Title+Description), Image Description Button Card 3개, 공통 Terms Resource로 구성된 페이지를 생성하고, 공통 Visual Editor에서 저장·재편집·Web Output까지 완료한다.

이 Vertical Slice가 안정적으로 통과한 뒤 FAQ, Countdown, Video, 다중 브랜드, RAG, A/B Layout으로 확장한다.
