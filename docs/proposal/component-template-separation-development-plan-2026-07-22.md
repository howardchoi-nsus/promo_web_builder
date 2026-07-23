# 섹션 아이템 컴포넌트 조립·다중 디자인 토큰·AI 섹션 디자인 개발계획서

- 작성일: 2026-07-22
- 최종 수정일: 2026-07-22
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 재설계 완료 / 구현 전 / 소스코드·Production DB 미반영
- 대체 문서: 기존의 “섹션=컴포넌트” 설계를 본 문서로 전면 대체한다.
- 기준 자료
  - `docs/claude/design-tokens.csv`
  - `docs/claude/design-tokens.schema.json`
  - `docs/css-design-token-unification-development-plan-2026-07-21.md`
  - `docs/claude/admin-i18n-locale-management-development-plan-2026-07-22.md`

## 0. 핵심 결론

이 기능에서 **컴포넌트는 섹션이 아니라 섹션 안의 재사용 가능한 입력·출력 항목 정의**다. Hero Title, Body Text, Primary CTA, Content Image, Logo Image, Badge Image 같은 컴포넌트를 독립적으로 등록하고, 관리자는 이를 조립해 신규 섹션을 완성한다. 템플릿은 완성된 신규 섹션들을 다시 조립한다. `text`, `image`, `cta`는 컴포넌트 이름이 아니라 컴포넌트의 field kind다.

디자인 토큰은 하나의 전역 값 모음이 아니라, 동일한 토큰 계약을 따르는 N개의 버전형 디자인 토큰 세트로 관리한다. 예를 들어 `rounded-style` 세트는 큰 radius와 부드러운 shadow 값을 제공하고, `square-style` 세트는 작은 radius와 선명한 border 값을 제공한다. 템플릿은 등록된 토큰 세트 버전 중 하나를 선택하고 고정한다.

사용자가 특정 섹션에서 명시적으로 AI 디자인 생성을 요청하면 LLM은 선택된 토큰 세트와 관리자 제약 안에서 다음을 함께 계획한다.

- 섹션에 포함된 컴포넌트의 배치와 강조 순서
- 스타일 슬롯별 디자인 토큰 선택
- 섹션 BG 이미지의 필요 여부·safe area·정렬·fade 색상
- Image 컴포넌트별 AI 이미지 생성 대상·비율·표시 방식

LLM 결과는 즉시 적용하지 않고 서버 검증과 Preview를 거친 뒤 사용자가 승인할 때 현재 프로모션 스냅샷에만 반영한다.

```text
Template
  └─ Section Instance
       └─ Section Item Component Instance
            └─ Pinned Component Version
```

관리자 정보 구조는 다음 세 영역으로 분리한다.

1. **컴포넌트 관리**: Hero Title/Body Text/Primary CTA/Content Image 등 실제 섹션 아이템 컴포넌트 정의·버전 관리
2. **섹션 관리**: 컴포넌트 선택·배치·잠금·AI 디자인 정책 설정
3. **템플릿·레이아웃 관리**: 섹션 선택·순서·레이아웃·N개 디자인 토큰 세트 등록·선택

기존 계획과 현재 브랜치의 `wizard_section_components` 구현은 Header/Hero/Footer 같은 **섹션 자체를 컴포넌트로 취급**하므로 요구사항과 다르다. 해당 모델과 Preview 시드 결과는 Production에 배포하지 않는다.

## 1. 확정된 제품 원칙

### 1.1 반드시 구현할 범위(MUST)

- 섹션 아이템을 템플릿과 섹션에서 독립된 전역 컴포넌트로 관리한다.
- 동일한 컴포넌트를 한 섹션에서 두 번 이상 사용할 수 있다.
- 섹션은 컴포넌트를 복제하지 않고 컴포넌트 버전을 참조해 조립한다.
- 활성 섹션은 각 컴포넌트 버전을 고정(pin)한다.
- 컴포넌트 변경은 사용 중인 활성 섹션을 자동 변경하지 않는다.
- 컴포넌트의 새 버전을 만든 뒤 섹션 draft가 이를 채택하고 섹션을 활성화하는 순서로 배포한다.
- 템플릿은 섹션을 조립하고, 프로모션 생성 시 해석 완료된 스냅샷을 저장한다.
- 컴포넌트 관리는 관리자 페이지의 별도 최상위 탭으로 제공한다.
- 템플릿의 시각 속성은 공통 토큰 카탈로그와 N개의 버전형 디자인 토큰 세트로 관리한다.
- 디자인 토큰 세트는 CSV 단위로 등록·검증·버전 관리하고 템플릿은 하나의 active 세트 버전을 pin한다.
- AI 디자인은 자동 실행하지 않고 사용자가 섹션 단위로 요청한 경우에만 실행한다.
- LLM은 컴포넌트 배치, 토큰 선택, BG 이미지와 Item 이미지 계획에 관여할 수 있다.
- LLM은 등록된 layout variant, style slot, token, component와 관리자 허용 범위를 벗어날 수 없다.
- AI 결과는 Preview 후 사용자가 적용한 경우에만 현재 프로모션 스냅샷에 저장한다.
- Create Promo가 출력하는 사용자 입력 콘텐츠는 별도 i18n 키로 관리하지 않는다.
- 기존 템플릿·템플릿 소유 섹션·섹션 아이템과 `promo_section_design_runs` 실행 이력은 신규 전환 시 초기화한다.
- 기존 데이터를 신규 컴포넌트 구조로 변환하거나 병합하지 않고 신규 기본 데이터로 다시 구성한다.
- 기존 Promo Builder의 LO-FI·최종 디자인, 사용자 업로드 이미지와 locale 메시지는 이번 초기화 대상에서 제외한다.
- Create Promo의 기존 AI 섹션 이미지 중 저장된 프로모션 스냅샷이 참조하는 자산은 보존하고, 미적용·실패·취소 run의 미참조 임시 Blob만 정리한다.

### 1.2 이번 버전에서 제외할 범위(MUST NOT)

- 템플릿에서 컴포넌트 정의를 직접 수정하는 기능
- 활성 컴포넌트 버전의 인플레이스 수정
- 사용 중인 컴포넌트·섹션의 하드 삭제
- 임의 CSS, HTML 또는 JavaScript 입력·저장·출력
- AI가 새로운 토큰 이름이나 CSS 속성을 자유롭게 생성하는 기능
- LLM이 임의 픽셀 좌표, CSS selector, raw CSS 또는 HTML 구조를 생성하는 기능
- 관리자 앱 토큰(`--app-*`)을 생성 프로모션 CSS에 그대로 주입하는 기능
- 기존 템플릿 설정의 자동 중복 병합
- 서로 다른 디자인 토큰 세트를 한 템플릿 안에서 섹션별로 혼합하는 기능
- 관리자가 arbitrary token binding이나 CSS selector를 직접 입력하는 기능
- Create Promo 사용자 콘텐츠를 관리자 locale 메시지 테이블에 저장하는 기능

## 2. 용어와 소유권

| 용어 | 정의 | 주요 소유 속성 |
|---|---|---|
| 아이템 컴포넌트 | Hero Title/CTA Button처럼 재사용 가능한 완성된 섹션 아이템 정의 | 자동 `component_key`, 이름, field kind |
| 컴포넌트 버전 | 아이템의 특정 버전 정의 | `field_kind`, editor schema, 기본값, 이미지/CTA 설정, 디자인 capability |
| 섹션 | Header/Hero/Footer 등 의미 단위 | 이름, AI 정책, 상태, 버전 |
| 컴포넌트 인스턴스 | 특정 섹션 버전에 배치된 컴포넌트 | `item_key`, 표시명, 순서, 필수/노출/잠금, pinned version |
| 템플릿 | 섹션 조합과 템플릿 시각 설정 | 섹션 순서, 기본 여부, 레이아웃, token set |
| 디자인 토큰 정의 | 허용된 시각 속성의 타입 계약 | token key, type, unit, cardinality, 허용 CSS property |
| 디자인 토큰 세트 | Rounded/Square 등 등록 가능한 디자인 프리셋의 논리 ID | token set key, 이름, 설명 |
| 디자인 토큰 세트 버전 | 한 CSV import 결과에 해당하는 불변 값 집합 | light/dark 값, 상태, 버전, import hash |
| 스타일 슬롯 | 컴포넌트나 섹션에서 토큰을 적용할 수 있는 논리 위치 | `text.color`, `button.backgroundColor`, `section.backgroundColor` |
| 토큰 바인딩 | 스타일 슬롯과 선택된 토큰 키의 연결 | slot key, token key, source(default/AI/user) |
| Section Design Plan | LLM이 반환한 구조화된 섹션 디자인 계획 | layout, bindings, BG/Item asset requests |
| Effective Design Patch | 서버 검증을 통과해 해당 프로모션에 적용 가능한 변경분 | validated layout/style/assets, base revision |
| 해석 완료 스냅샷 | 생성 시점의 모든 참조를 값으로 고정한 데이터 | sections/items/design tokens/layout/content |

### 2.1 속성 배치 원칙

컴포넌트 버전에는 **재사용 가능한 본질적 속성**만 둔다.

- `field_kind`: `text`, `image`, `cta`
- `text_type`: `title`, `remark`, `multi` 등
- 이미지 입력 허용 소스, 기본 aspect ratio, alt text 지원 여부
- CTA 입력 구조와 허용 UTM 필드
- 편집기 입력 스키마와 기본 렌더 variant
- 적용 가능한 layout variant와 style slot 정의
- 각 style slot의 토큰 타입·semantic role·AI 선택 허용 여부
- style slot별 기본 토큰 바인딩

섹션 컴포넌트 인스턴스에는 **배치마다 달라지는 속성**을 둔다.

- `item_key`: 섹션 안에서 유일한 런타임 식별자
- 표시 이름, 정렬 순서
- Wizard 노출, 필수 여부, 사용자 재정렬 허용
- 잠금 여부와 잠금 값
- 컴포넌트 버전 고정값
- 허용된 범위 안의 인스턴스 override
- AI 배치 허용 영역과 고정 영역

`component_key`와 `item_key`는 서로 다른 책임을 가진다. 예를 들어 동일한 Content Image 컴포넌트 버전을 같은 섹션에 여러 번 배치하면서 인스턴스 역할 키를 `heroImage`, `partnerVisual`, `badgeVisual`처럼 별도로 지정할 수 있다.

디자인 토큰, 배치, 이미지 자산과 사용자 콘텐츠의 책임은 혼합하지 않는다.

| 구분 | 예시 | 저장 위치 |
|---|---|---|
| 디자인 토큰 | 색상, 폰트, radius, spacing, shadow | token set version |
| 레이아웃 | split-left/right, region assignment, 정렬 | section layout/effective patch |
| 이미지 자산 | BG/Item Blob URL, aspect ratio, safe area | promo asset result/snapshot |
| 사용자 콘텐츠 | 제목, 설명, CTA 문구 | promo content snapshot |

### 2.2 컴포넌트 도메인 모델과 조립 예시

`text`, `image`, `cta`는 입력·렌더링 계약을 구분하는 field kind이고, 관리자가 실제로 선택하는 컴포넌트는 field kind 위에 구성된 버전형 정의다.

```text
field_kind=text
  ├─ Hero Title Component
  ├─ Body Text Component
  └─ Remark Text Component

field_kind=image
  ├─ Content Image Component
  ├─ Logo Image Component
  └─ Badge Image Component

field_kind=cta
  └─ Primary CTA Component
```

컴포넌트는 다음 계약을 소유한다.

- 관리자 표시명과 설명
- 자동 생성된 불변 `component_key`
- field kind와 renderer key
- 콘텐츠 입력 schema와 기본값
- 이미지/CTA 등 종류별 제약
- style slot과 기본 token binding
- 허용 layout region과 AI design capability
- draft/active/inactive/archive 버전

섹션에서는 새로운 Item 정의를 직접 만들지 않고 active 컴포넌트 버전을 선택해 인스턴스를 생성한다.

```text
신규 Hero Section v1
├─ itemKey=leadText
│  └─ Remark Text Component v1
├─ itemKey=title
│  └─ Hero Title Component v2
├─ itemKey=sublineText
│  └─ Body Text Component v1
├─ itemKey=button
│  └─ Primary CTA Component v2
└─ itemKey=heroImage
   └─ Content Image Component v1
```

동일한 컴포넌트 버전을 여러 섹션에서 재사용할 수 있고, 같은 섹션 안에서도 서로 다른 `item_key`로 반복 배치할 수 있다. 컴포넌트 정의 변경은 새 component version으로 수행하며 이를 사용하는 section draft가 명시적으로 새 버전을 채택한다.

## 3. 현재 구현과 정정 사항

### 3.1 현재 올바른 기준선

- 기존 `wizard_content_sections`는 섹션 버전을 관리한다.
- 기존 `wizard_content_section_items`는 섹션별 아이템을 직접 저장한다.
- `wizard_form_template_sections`는 템플릿과 섹션의 연결을 저장한다.
- 공개 템플릿 API와 Create Promo는 최종적으로 `sections[].items[]` 구조를 사용한다.
- `promo_section_design_runs`에는 템플릿·섹션·입력 스냅샷과 AI 실행 이력이 존재한다.
- 콘텐츠 렌더러는 앱 UI 토큰과 분리된 `--promo-*` 토큰 경계를 이미 사용한다.

### 3.2 폐기할 잘못된 구현

다음 파일은 “섹션=컴포넌트” 모델을 구현했으므로 새 설계 기준으로 유지할 수 없다.

- `db/migrations/028_section_component_registry.sql`
- `db/seeds/003_seed_section_components_and_default_template.sql`
- `api/section-components.js`
- `api/section-component.js`
- `api/section-component-draft.js`
- `api/section-component-activate.js`
- `api/section-component-archive.js`
- `api/section-component-usage.js`
- `scripts/test-section-component-separation-contract.js`
- `scripts/test-admin-section-component-browser.mjs`
- `scripts/inspect-section-component-cutover.js`

이 목록은 삭제 명령이 아니라 구현 착수 시 재작성·대체 여부를 판단하기 위한 영향 목록이다.

### 3.3 현재 배포 상태에 대한 안전 규칙

- Production은 잘못된 컴포넌트 모델 이전의 정상 배포로 롤백된 상태를 유지한다.
- 원격 `main`에 잘못된 모델 커밋이 남아 있으므로, 설계 정정 전 Production 재배포를 금지한다.
- Preview DB의 7개 섹션 수준 컴포넌트는 잘못된 테스트 데이터이며 운영 데이터로 승격하지 않는다.
- `028`이 Production에 적용되지 않았다는 사실을 DB 마이그레이션 이력으로 확인한 후에만 교체 또는 후속 마이그레이션 전략을 확정한다.

## 4. 목표 데이터 모델

### 4.1 관계 구조

```text
wizard_item_components
  1 ── N wizard_item_component_versions
              ▲
              │ pinned component_version_id
              │
wizard_content_sections
  1 ── N wizard_content_section_component_instances

wizard_form_templates
  1 ── N wizard_form_template_sections ── 1 wizard_content_sections

design_token_definitions
  1 ── N template_design_token_values
              N ── 1 template_design_token_set_versions
                              N ── 1 template_design_token_sets
                              1 ── N wizard_form_templates

promo_section_design_runs
  1 ── N promo_section_design_asset_jobs
  1 ── 1 Section Design Plan / Effective Design Patch
```

### 4.2 `wizard_item_components`

논리적으로 안정된 컴포넌트 ID를 저장한다.

| 컬럼 | 제약/설명 |
|---|---|
| `id` | UUID PK |
| `component_key` | 서버/DB 자동 생성, UNIQUE, 불변, `cmp_` + UUID hex |
| `name` | 관리자 표시명 |
| `description` | 용도 설명 |
| `system_seed_code` | 시스템 기본 seed의 멱등성 보장용 nullable UNIQUE 내부 코드 |
| `archived_at` | 논리 컴포넌트 사용 종료 시각, null이면 사용 가능 |
| `created_at`, `updated_at` | 감사 필드 |

논리 컴포넌트는 버전 내용이 아니라 안정된 사용처 식별자다. 별도 active/inactive 상태를 중복 관리하지 않고, 실제 사용 가능 여부는 active 컴포넌트 버전 존재 여부로 판단한다. 하드 삭제 대신 `archived_at`을 사용한다.

`component_key` 생성 규칙:

```sql
component_key text not null unique
  default ('cmp_' || replace(gen_random_uuid()::text, '-', ''))
```

- 관리자는 key를 입력하지 않는다.
- 생성 API는 요청 body의 `componentKey`를 허용하지 않고 DB가 생성한 값을 반환한다.
- 이름 변경과 locale 변경은 key에 영향을 주지 않는다.
- 새 component version은 동일 key를 유지한다.
- 컴포넌트 복제는 신규 논리 컴포넌트와 신규 key를 생성한다.
- 관리자 상세 화면은 key를 읽기 전용으로 표시하고 복사 기능만 제공한다.
- `system_seed_code`는 seed 재실행의 중복 생성을 막는 내부 값일 뿐 runtime key나 사용자 입력값으로 사용하지 않는다.

### 4.3 `wizard_item_component_versions`

| 컬럼 | 제약/설명 |
|---|---|
| `id` | UUID PK |
| `component_id` | FK, `ON DELETE RESTRICT` |
| `version` | 컴포넌트별 증가 정수, UNIQUE(`component_id`, `version`) |
| `status` | `draft`, `active`, `inactive`, `archived` |
| `field_kind` | `text`, `image`, `cta` |
| `editor_schema` | 타입이 검증된 입력 UI 정의 JSONB |
| `default_value` | 타입별 검증을 통과한 기본값 JSONB |
| `content_config` | text/image/cta 세부 설정 JSONB |
| `style_slot_schema` | 슬롯 키, 속성 타입, semantic role, AI 선택 가능 여부 JSONB |
| `default_token_bindings` | style slot별 기본 semantic token key JSONB |
| `design_capabilities` | 허용 layout variant와 instance override 범위 JSONB |
| `change_note` | 버전 변경 사유 |
| `created_at`, `updated_at`, `activated_at` | 감사 필드 |

필수 DB 제약:

- 컴포넌트별 active 버전은 최대 1개다.
- 컴포넌트별 draft 버전은 최대 1개다.
- `field_kind`와 `content_config` 구조가 맞지 않으면 저장을 거부한다.
- active 버전은 수정하지 않고 새 draft를 생성한다.
- `style_slot_schema`는 서버에 등록된 slot/property allowlist만 허용한다.
- `default_token_bindings`는 slot 타입과 token 타입이 일치해야 한다.

### 4.4 `wizard_content_section_component_instances`

기존 `wizard_content_section_items`의 역할을 대체하는 섹션 조립 테이블이다.

| 컬럼 | 제약/설명 |
|---|---|
| `id` | UUID PK |
| `section_id` | 특정 섹션 버전 FK, `ON DELETE CASCADE` |
| `component_id` | 논리 컴포넌트 FK, composite FK 구성용 |
| `component_version_id` | 고정된 컴포넌트 버전 FK, `ON DELETE RESTRICT` |
| `item_key` | 섹션 안에서 유일한 런타임 키 |
| `display_name` | 해당 배치의 표시명 |
| `sort_order` | 섹션 내 순서 |
| `is_visible_in_wizard` | 사용자 입력 UI 노출 |
| `is_required` | 필수 입력 여부 |
| `user_reorder_allowed` | 사용자 순서 변경 허용 |
| `is_locked`, `locked_value` | 관리자 잠금 정책 |
| `instance_config` | 허용된 per-instance override JSONB |
| `created_at`, `updated_at` | 감사 필드 |

필수 제약:

- UNIQUE(`section_id`, `item_key`)
- 같은 `component_id`의 반복 배치는 허용한다.
- `wizard_item_component_versions`에 UNIQUE(`component_id`, `id`)를 두고 인스턴스의 (`component_id`, `component_version_id`)를 composite FK로 강제한다.
- 활성 또는 archived 컴포넌트 버전 참조를 임의로 삭제할 수 없다.
- `instance_config` 키는 해당 컴포넌트 버전의 capability allowlist 안에 있어야 한다.
- 기존 활성 섹션은 inactive 컴포넌트 버전을 계속 렌더링할 수 있지만, 신규 section draft에는 active 컴포넌트 버전만 추가할 수 있다.

### 4.5 섹션·템플릿 버전 정책

- 섹션 draft 생성 시 현재 컴포넌트 인스턴스와 pinned version을 복제한다.
- 관리자는 섹션 draft에서만 컴포넌트 추가·삭제·버전 교체·순서 변경을 한다.
- 섹션 활성화 시 모든 참조 컴포넌트 버전과 잠금 정책을 서버에서 재검증한다.
- 템플릿은 섹션 버전을 고정 참조한다. 섹션의 새 버전은 템플릿 draft에서 명시적으로 채택한다.
- Create Promo 시작 시 템플릿, 섹션, 컴포넌트 버전, 디자인 토큰 세트 버전을 하나의 스냅샷으로 고정한다.

### 4.6 구형 템플릿 소유 섹션 구조 제거

기존 템플릿·섹션 설정은 사용하지 않기로 확정했으므로 데이터 변환이나 copy-on-write 호환은 구현하지 않는다. 신규 시드 전에 다음 구조를 제거하거나 신규 쓰기 경로에서 완전히 차단한다.

- `wizard_content_sections.owner_form_template_id` 기반 템플릿 소유권
- 템플릿 삭제 시 소유 섹션을 cascade 삭제하는 FK
- 템플릿 편집 과정에서 섹션과 Item을 복제하는 copy-on-write 경로
- `wizard_content_section_items`에 Item을 직접 생성·수정하는 관리자 쓰기 경로
- 템플릿 clone 시 구형 section/item 구조를 전파하는 함수

초기화 이후 섹션은 템플릿과 독립된 버전형 정의가 되고 템플릿은 section version을 참조만 한다. 기존 공개 응답 호환을 위한 `sections[].items[]` 변환은 신규 resolver가 담당한다.

### 4.7 신규 Section Design Planner 실행 모델

구형 run row를 신규 구조로 변환하지 않고 초기화한 뒤 다음 계약으로 재구성한다.

#### `promo_section_design_runs`

- `id`, `promo_run_id`, `section_key`, `status`, `mode`
- `base_snapshot`, `constraints_snapshot`, `candidate_snapshot`
- `content_hash`, `base_revision`, `idempotency_key`
- `template_version`, `section_version`, `component_versions_snapshot`
- `token_set_version_id`, `token_values_snapshot`
- `design_plan`, `validation_result`, `effective_patch`
- `provider_snapshot`, `usage_snapshot`, `error_code`, `error_message`
- `created_at`, `updated_at`, `completed_at`, `applied_at`, `cancelled_at`

동일 `idempotency_key`의 active run은 하나만 허용한다. 상태 전이는 원자적 조건부 update로 처리한다.

#### `promo_section_design_asset_jobs`

- `id`, `run_id`, `target_type` (`section-background` 또는 `item`)
- `item_key` (`target_type=item`일 때 필수)
- `status`, `current_attempt`, `next_retry_at`
- `prompt_spec`, `constraints_snapshot`, `result`
- `storage_key`, `asset_url`, `mime_type`, `width`, `height`
- `error_code`, `error_message`, `created_at`, `updated_at`, `completed_at`

UNIQUE(`run_id`, `target_type`, `item_key`)를 기본으로 하되 다시 생성 시 `generation_index` 또는 새 run을 사용한다. Background와 각 Item job은 서로 독립적으로 재시도할 수 있다.

## 5. 디자인 토큰 관리 계약

### 5.1 공통 카탈로그와 N개 디자인 토큰 세트

디자인 토큰은 다음 두 계층으로 분리한다.

```text
공통 Promo Token Catalog v1
  ├─ rounded-style v1/v2/...
  ├─ square-style v1/v2/...
  ├─ minimal-style v1/v2/...
  └─ bold-style v1/v2/...
```

- **Token Catalog**: 모든 세트가 지켜야 하는 token key, 타입, 단위, semantic role과 검증 규칙
- **Token Set**: Rounded/Square 등 논리 디자인 프리셋의 안정 ID
- **Token Set Version**: 한 CSV import 결과에 해당하는 불변 값 집합

Rounded와 Square 세트는 같은 semantic token key를 제공하고 값만 다르게 구성하는 것을 기본 원칙으로 한다.

| token key | Rounded 예시 | Square 예시 |
|---|---:|---:|
| `--promo-card-radius` | `24px` | `0px` |
| `--promo-button-radius` | `999px` | `2px` |
| `--promo-card-shadow` | soft shadow | `none` |
| `--promo-border-width` | `0px` | `2px` |
| `--promo-heading-weight` | `800` | `900` |

한 템플릿 버전은 하나의 active token set version만 pin한다. v1에서는 섹션별 token set 혼합과 여러 세트의 runtime merge를 허용하지 않는다.

### 5.2 CSV에서 채택할 관리 형식

`docs/claude/design-tokens.csv`의 다음 구조를 토큰 카탈로그 입력 형식의 기준으로 사용한다.

| CSV 열 | 용도 |
|---|---|
| `category`, `category_label` | 관리자 그룹 및 표시명 |
| `token`, `label` | CSS 변수 키와 표시명 |
| `type` | `color`, `length`, `duration`, `easing`, `number`, `fontFamily`, `shadow`, `gradient` |
| `unit` | `px`, `ms` 등 허용 단위 |
| `themeable` | dark 값 별도 관리 여부 |
| `cardinality` | `single` 또는 `list` |
| `value_index` | 다중 레이어 순서 |
| `css_properties` | 이 토큰이 적용될 수 있는 CSS 속성 allowlist |
| `value_light`, `value_dark` | 기본 테마 값 |

`cardinality=list`는 동일 token의 여러 행을 `value_index` 순서로 결합한다. `background-image`와 `box-shadow`처럼 여러 레이어가 가능한 속성만 list를 허용한다. `background-color`는 단일 fallback 값으로 유지한다.

CSV 파일 하나를 token set version 하나로 import한다. 세트의 `token_set_key`, 이름, 설명과 change note는 import 화면에서 입력하고, 서버는 CSV SHA-256 hash를 저장해 동일 파일 중복 import를 식별한다. 파일명만 논리 키로 신뢰하지 않는다.

### 5.3 현재 CSV를 그대로 템플릿에 쓰지 않는 이유

현재 CSV는 `--app-*` 네임스페이스이며 `sidebar`, `utility bar`, `nav item`, `app shell z-index` 등 관리자·편집기 UI 전용 항목을 포함한다. 이는 템플릿 생성 디자인 토큰의 **관리 형식 예시**로는 적합하지만 생성 프로모션에 그대로 적용하면 다음 문제가 생긴다.

- 관리자 테마 변경이 프로모션 결과물에 누출될 수 있다.
- Visual Editor 크롬과 `.promo-renderer`의 토큰 격리 원칙이 깨진다.
- `--app-hero-bg-image`가 섹션 배경 이미지 및 AI 생성 자산과 충돌할 수 있다.
- sidebar/nav/z-index 같은 비콘텐츠 속성이 Web Output에 불필요하게 포함된다.

따라서 카탈로그를 두 scope로 분리한다.

| scope | namespace | 대상 | 저장·배포 |
|---|---|---|---|
| `app-ui` | `--app-*` | Admin/Create Promo/Visual Editor의 도구 UI | 공통 앱 CSS |
| `promo-template` | `--promo-*` | 생성 프로모션 콘텐츠와 템플릿 | 템플릿 token set 및 스냅샷 |

템플릿용 CSV는 같은 행 구조를 사용하되 `promo-template` 전용 파일로 분리하고 DB의 `scope` 컬럼으로 이중 방어한다.

현재 `design-tokens.schema.json`은 `$schema` URI와 표준 `type/properties/required` 구조를 갖춘 실제 JSON Schema가 아니라 토큰 manifest 성격이다. 구현 단계에서 다음과 같이 역할을 분리한다.

- `design-tokens.manifest.json`: app UI 토큰 설명과 기본값
- `promo-template-design-token-catalog.schema.json`: CSV 정규화 결과를 검증하는 실제 JSON Schema Draft 2020-12
- N개의 token set CSV: Rounded/Square 등 실제 값 세트

### 5.4 LLM 선택을 위한 토큰 메타데이터

CSV/DB import 시 다음 메타데이터가 추가로 필요하다.

| 필드 | 이유 |
|---|---|
| `scope` | app UI와 promo template 경계 강제 |
| `target_level` | `template`, `section`, `component` 적용 범위 |
| `editable` | 관리자 UI에서 값 변경 가능 여부 |
| `required` | token set 활성화 전 필수값 검증 |
| `min_value`, `max_value` | 길이·시간·숫자 범위 제한 |
| `allowed_values` | enum/variant 허용값 제한 |
| `semantic_role` | `accent-primary`, `text-secondary`, `heading-primary` 등 의미 |
| `tone_tags` | `bold;energetic`, `calm;premium` 등 콘텐츠 분위기 후보 |
| `emphasis_level` | LLM이 사용할 강조 강도 |
| `ai_selectable` | LLM 선택 가능 여부 |
| `compatible_slots` | 적용 가능한 style slot allowlist |
| `usage_hint` | LLM에 제공할 짧은 사용 목적 설명 |
| `contrast_group` | 접근성 후보 그룹, 최종 대비는 서버가 계산 |
| `deprecated_at`, `replaced_by` | 토큰 키 변경과 호환성 관리 |

기존 열은 유지한다. semantic/AI 메타데이터는 공통 카탈로그 manifest에 두고 각 token set CSV는 실제 값에 집중하는 방식을 권장한다. 동일한 메타데이터를 모든 세트 CSV에 반복 저장하지 않는다.

모든 active token set version은 카탈로그의 필수 token key를 빠짐없이 제공해야 한다. 추가 토큰은 허용할 수 있지만 해당 catalog version에 먼저 등록되어야 하며, 알 수 없는 token key는 import 단계에서 거부한다.

### 5.5 토큰 DB 모델

#### `design_token_definitions`

- `id`, `scope`, `token_key`, `category`, `label`
- `value_type`, `unit`, `themeable`, `cardinality`
- `css_properties`, `target_level`, `validation_rule`
- `is_editable`, `status`, `catalog_version`
- UNIQUE(`scope`, `token_key`)

#### `template_design_token_sets`

- `id`, `token_set_key`, `name`, `description`, `archived_at`
- Rounded/Square 등 논리 세트의 안정 ID

#### `template_design_token_set_versions`

- `id`, `token_set_id`, `version`, `status`
- `catalog_version`, `source_filename`, `source_hash`, `change_note`
- draft/active/inactive/archive lifecycle
- token set별 active와 draft 버전 각각 최대 1개
- active 버전은 수정하지 않고 새 CSV를 draft 버전으로 import

#### `template_design_token_values`

- `token_set_version_id`, `token_definition_id`, `theme`, `value_index`, `value`
- UNIQUE(`token_set_version_id`, `token_definition_id`, `theme`, `value_index`)
- 값은 문자열로 저장하더라도 API 저장 전에 타입별 parser로 검증한다.

템플릿 버전에는 `design_token_set_version_id`를 고정 참조한다. 세트의 새 버전 활성화는 기존 템플릿에 자동 반영하지 않으며, 템플릿 draft에서 명시적으로 새 버전을 선택한다.

### 5.6 스타일 슬롯과 토큰 바인딩

스타일 슬롯은 CSS selector가 아니라 컴포넌트가 외부에 공개하는 논리 디자인 지점이다.

```text
Text:  text.color, text.fontSize, text.fontWeight, text.lineHeight
Image: imageFrame.borderRadius, imageFrame.borderColor, caption.color
CTA:   button.backgroundColor, button.textColor, button.borderRadius, button.height
Section: section.backgroundColor, section.contentMaxWidth, section.itemGap
```

컴포넌트 버전은 slot 타입과 기본 semantic token binding을 제공한다.

```json
{
  "styleSlots": {
    "text.color": {
      "tokenType": "color",
      "aiSelectable": true,
      "allowedSemanticRoles": ["text-primary", "accent-primary", "accent-secondary"]
    }
  },
  "defaultBindings": {
    "text.color": "--promo-text-primary"
  }
}
```

실제 selector와 CSS property 매핑은 renderer 코드가 소유한다. DB, CSV, 관리자 또는 LLM은 arbitrary selector를 입력할 수 없다. v1 관리자 UI는 token set 값과 세트 선택만 제공하고 arbitrary slot binding 편집 UI는 제공하지 않는다. LLM은 `aiSelectable=true`인 slot에서 선택된 token set에 존재하는 허용 token key만 프로모션별 patch로 선택할 수 있다.

### 5.7 CSS 생성과 렌더링 규칙

- 서버는 카탈로그에 존재하는 `promo-template` 토큰만 CSS 변수로 직렬화한다.
- CSS 속성명은 코드의 allowlist에서 결정하며 사용자가 직접 입력하지 않는다.
- `list` 값은 `value_index` 순으로 `, ` 결합한다.
- dark 값이 없으면 light 값을 상속한다.
- 결과 CSS는 `.promo-renderer` 또는 프로모션 root scope 아래에만 주입한다.
- 템플릿 토큰은 앱의 `:root`에 쓰지 않는다.
- Web Output에는 `--promo-*`와 렌더러 CSS만 포함하고 관리자 앱 CSS는 포함하지 않는다.
- 배경색은 템플릿 토큰으로 관리할 수 있지만 AI 생성 배경 이미지는 별도 asset 속성으로 유지한다.
- AI 배경 이미지의 페이드 아웃 생성 시 해석된 섹션 배경색 토큰 값을 provider 입력에 포함한다.
- 임의 `url()`, `expression`, `@import`, `javascript:` 및 허용되지 않은 함수는 거부한다.
- token 값과 binding은 서로 분리해 snapshot하고 Preview와 Web Output이 동일한 effective binding 결과를 사용한다.
- 반응형 배치는 token value가 아니라 layout variant/responsive layout spec이 담당한다. v1 token value 차원은 `theme + value_index`로 제한한다.

## 6. 공개 Resolver와 스냅샷 계약

내부 저장 구조가 바뀌더라도 Create Promo의 초기 전환 위험을 줄이기 위해 공개 응답은 기존 형태를 유지한다.

```json
{
  "templateKey": "default",
  "templateVersion": 12,
  "designTokenSet": {
    "key": "rounded-style",
    "version": 2,
    "catalogVersion": 1,
    "values": { "--promo-bg": "#ffffff" }
  },
  "sections": [
    {
      "sectionKey": "heroBanner",
      "sectionVersion": 3,
      "items": [
        {
          "itemKey": "title",
          "componentKey": "text",
          "componentVersion": 2,
          "fieldKind": "text",
          "textType": "title",
          "isRequired": true,
          "isLocked": false
        }
      ]
    }
  ]
}
```

Resolver 순서:

1. active 템플릿 버전 조회
2. 템플릿이 참조한 섹션 버전 조회
3. 섹션의 컴포넌트 인스턴스와 pinned component version 조회
4. 컴포넌트 정의와 인스턴스 설정 병합
5. 잠금·노출·필수·AI 정책 검증
6. pinned token set version의 값, 컴포넌트 기본 binding과 허용 AI 후보 해석
7. 해석된 응답의 안정적인 hash 생성
8. Create Promo 시작 시 동일 데이터를 프로모션 스냅샷으로 저장

공개 API는 내부 draft, DB ID, 편집기 schema의 불필요한 관리 필드를 노출하지 않는다.

## 7. 섹션 AI 디자인 연계

### 7.1 실행 원칙

AI는 콘텐츠 입력만으로 자동 실행하지 않는다. 사용자가 Create Promo의 해당 섹션에서 `AI 디자인 생성`을 명시적으로 실행한 경우에만 동작한다.

```text
사용자 요청
  → Section Design Plan 생성
  → 서버 검증
  → BG/Item 이미지 작업
  → 최종 Preview
  → 사용자 적용/다시 생성/취소
```

관리자가 AI 디자인을 비활성화하면 버튼을 숨기지 않고 비활성 상태와 사유를 표시한다. 취소한 결과는 현재 프로모션에 반영하지 않는다.

### 7.2 사용자 선택 범위

1차 UI는 다음 세 모드를 제공한다.

| mode | LLM 관여 범위 |
|---|---|
| `full` | 컴포넌트 배치 + token binding + BG + 선택 가능한 Item 이미지 |
| `layout-style` | 컴포넌트 배치 + token binding, 이미지 생성 제외 |
| `assets` | 현재 배치와 binding 유지, BG 또는 선택 Item 이미지만 생성 |

추가 옵션:

- 사용자가 직접 수정한 값 유지
- 현재 등록된 이미지 유지
- BG 이미지 새로 생성
- 선택한 Item 이미지 새로 생성
- 사용자 변경까지 초기화하고 다시 생성

### 7.3 LLM Section Design Plan 계약

LLM은 HTML/CSS, 픽셀 좌표 또는 실제 이미지 URL을 반환하지 않는다. 서버가 제공한 후보 ID만 사용하는 구조화 JSON을 반환한다.

```json
{
  "sectionKey": "heroBanner",
  "layout": {
    "variant": "split-right",
    "regions": [
      { "region": "copy", "itemKeys": ["leadText", "title", "sublineText", "button"] },
      { "region": "media", "itemKeys": ["heroImage"] }
    ]
  },
  "styleBindings": [
    {
      "itemKey": "title",
      "slot": "text.color",
      "tokenKey": "--promo-accent-strong",
      "reasonCode": "primary_promotion_message"
    },
    {
      "itemKey": "button",
      "slot": "button.backgroundColor",
      "tokenKey": "--promo-accent-primary",
      "reasonCode": "primary_action"
    }
  ],
  "assets": [
    {
      "targetType": "section-background",
      "safeArea": "left-copy",
      "visualFocus": "right",
      "fadeToToken": "--promo-section-background",
      "aspectRatio": "16:9"
    },
    {
      "targetType": "item",
      "itemKey": "heroImage",
      "aspectRatio": "4:5",
      "objectFit": "contain"
    }
  ]
}
```

LLM이 선택할 수 있는 후보는 현재 section snapshot, component capabilities, layout variants와 선택된 token set version에서 서버가 계산해 제공한다. LLM이 알 수 없는 key를 만들어도 검증 단계에서 거부한다.

### 7.4 컴포넌트 배치

v1에서는 임의 grid 좌표 대신 등록된 layout variant와 named region을 사용한다.

```text
split-left:   media | copy
split-right:  copy | media
centered-hero: headline / media / actions
stacked:       headline / content / media / actions
```

LLM은 `itemKey → region`을 배정하고 허용된 범위에서 순서를 결정한다. 서버는 다음을 검증한다.

- 모든 item key가 현재 section instance에 존재하는가
- 하나의 item이 충돌하는 여러 region에 배정되지 않았는가
- layout variant가 관리자 allowlist에 있는가
- 고정/잠금 Item을 이동하지 않았는가
- `userReorderAllowed=false` Item의 순서를 변경하지 않았는가
- 필수 Item이 누락되지 않았는가
- 각 region의 허용 component kind와 최대 개수를 지키는가
- mobile fallback variant가 정의되어 있는가

자유 12-column grid는 별도 v2 범위로 두며, 도입 시 desktop/tablet/mobile placement와 collision validator를 함께 구현한다.

### 7.5 LLM 디자인 토큰 결정

LLM은 선택된 token set version 안에서 `aiSelectable=true`이고 해당 slot과 타입이 호환되는 token만 선택한다. LLM은 hex, px, shadow 문자열을 직접 생성하지 않는다.

```text
Rule Base = 후보, 잠금, 타입, 접근성, 최대 강조 수 통제
LLM       = 콘텐츠 의미와 우선순위에 맞는 후보 조합 선택
Renderer  = 검증된 slot/token binding을 실제 CSS로 변환
```

서버는 최종 색상 값을 해석해 WCAG 대비를 계산한다. LLM의 대비 판단은 참고 정보일 뿐 최종 통과 기준이 아니다. 대비 실패, 과도한 강조, 잠금 위반은 기본 binding으로 fallback한다.

### 7.6 BG와 Item 이미지 계획

`imageTargetItemKeys`와 Item asset request는 논리 `component_key`가 아니라 section instance의 `item_key`를 참조한다.

- `targetType=section-background`는 section/article의 `background-image`에만 적용한다.
- `targetType=item`은 지정된 Image 컴포넌트의 `src`에만 적용한다.
- 잘못된 Item target을 BG로 자동 fallback하지 않는다.
- Item target은 `field_kind=image`, AI source 허용, 잠금 해제 상태를 모두 만족해야 한다.
- BG 생성은 관리자가 section background AI 생성을 허용한 경우에만 가능하다.

BG 이미지 provider 입력에는 검증 완료된 effective design 값을 전달한다.

```json
{
  "backgroundColor": "#f6f8fc",
  "accentColor": "#4768d8",
  "visualFocus": "right",
  "safeArea": "left-copy",
  "fadeDirection": "right-to-left",
  "fadeTargetColor": "#f6f8fc",
  "aspectRatio": "16:9"
}
```

`safeArea`는 배경 정렬과 텍스트 영역 계산에 실제 사용한다. 이미지 중심을 오른쪽으로 지정하면 왼쪽 copy region을 비우고 설정된 section 배경색으로 fade-out하도록 prompt를 구성한다. 이미지 안에 프로모션 문구나 로고를 직접 생성하지 않는 것을 기본 정책으로 한다.

Item 이미지에는 해당 instance의 aspect ratio, `contain/cover`, 투명 배경 허용 여부와 콘텐츠 문맥을 전달한다. 생성된 BG와 Item 이미지는 각각 삭제·교체할 수 있어야 한다.

### 7.7 비동기 작업과 상태

LLM 계획과 이미지 생성을 하나의 장시간 HTTP 요청에 묶지 않는다.

```text
Section Design Plan Job
  ├─ Background Image Job (선택)
  ├─ Item Image Job 1 (선택)
  └─ Item Image Job N (선택)
```

권장 상태:

```text
queued
→ analyzing_content
→ planning_design
→ validating_plan
→ generating_assets
→ validating_assets
→ preview_ready
→ applied | cancelled | failed
```

각 asset job은 독립 status, attempt, error와 결과 URL을 가진다. 하나의 Item 이미지 실패가 전체 layout/style plan을 폐기하거나 LLM 호출을 다시 실행하게 하지 않는다. 실패한 asset job만 재시도할 수 있어야 한다.

### 7.8 Preview·적용·우선순위

Preview에는 layout, 변경 token binding, BG/Item 이미지와 변경 대상 목록을 표시한다. 사용자는 `적용`, `다시 생성`, `취소`를 선택한다.

적용 우선순위:

```text
1. 관리자 잠금
2. 사용자가 보존하도록 지정한 수동 변경
3. 사용자가 AI 적용 후 직접 변경한 값
4. 검증된 LLM Effective Design Patch
5. 컴포넌트 기본 binding
6. 선택된 token set 기본값
```

Apply 단계에서 템플릿 버전, 섹션 버전, component version, token set version, content hash, layout revision과 lock 정책을 다시 검증한다. 기준 revision이 바뀌면 409 conflict를 반환하고 임의 병합하지 않는다.

적용된 patch는 원본 컴포넌트·섹션·템플릿·token set을 수정하지 않고 현재 프로모션 snapshot에만 저장한다. LLM 원본 응답을 직접 렌더링하지 않고 서버 검증을 통과한 effective patch만 렌더링한다.

### 7.9 실행 이력과 이미지 자산 초기화 경계

구형 `promo_section_design_runs` 실행 이력은 신규 구조로 변환하지 않고 초기화한다. 신규 이력은 다음 정보를 저장한다.

- 사용자 실행 mode와 보존 옵션
- 템플릿·섹션·컴포넌트·token set version snapshot
- 콘텐츠 hash와 base revision
- LLM에 제공한 허용 후보
- LLM 원본 plan과 서버 validation 결과
- 최종 effective patch
- BG/Item asset job과 Blob 위치
- provider/model/prompt version, usage, error
- applied/cancelled 상태와 시각

초기화 대상 이미지 자산은 Create Promo의 구형 섹션 AI 디자인 이미지로 한정한다. Promo Builder의 LO-FI/최종 디자인, `promo_design_assets`, 사용자 업로드와 관리자 정적 이미지는 범위 밖이다.

- 저장된 프로모션 snapshot이 참조하는 적용 이미지: 보존
- 미적용·실패·취소 run의 미참조 임시 Blob: 삭제
- 참조 여부를 판별할 수 없는 Blob: 삭제하지 않고 정리 보류 목록으로 기록

## 8. 관리자 UI 설계

### 8.1 최상위 탭

```text
[컴포넌트 관리] [섹션 관리] [템플릿·레이아웃 관리] [언어 및 문구 관리]
```

#### 컴포넌트 관리

- 목록: 이름, 키, 종류, active 버전, 상태, 사용 섹션 수, 최종 수정
- 필터: 종류, 상태, 사용 여부
- 생성: 이름·설명·field kind와 설정만 입력하며 component key 입력란은 제공하지 않음
- 상세: 자동 key 읽기 전용/복사, 기본 정보, 입력 스키마, 콘텐츠 설정, style slot, 기본 token binding, 디자인 capability
- 작업: 신규, draft 생성, 검증, 활성화, archive
- 사용처: 섹션명, 섹션 버전, 인스턴스 `item_key`

#### 섹션 관리

- 섹션 기본 설정
- **컴포넌트 조립**: 검색·추가·반복 배치·순서 변경·삭제
- 인스턴스 설정: item key, 표시명, 필수/노출/잠금, component version
- AI 디자인 정책: 활성화, layout variants, AI 선택 가능 style slots, BG 허용, image target item keys, aspect ratio, 최대 강조 Item 수
- draft 미리보기, 검증, 활성화

#### 템플릿·레이아웃 관리

- 템플릿 기본 설정
- 템플릿 섹션 구성
- 템플릿 레이아웃
- N개 디자인 토큰 세트 목록·CSV dry-run/import·버전·활성화
- 템플릿별 active token set version 선택
- 토큰 값 diff, 누락 필수 token, 타입·단위·호환 component 검사
- light/dark 미리보기
- Rounded/Square 등 동일 콘텐츠 비교 미리보기
- Create Promo/Web Output 계약 미리보기

### 8.2 UX 안전장치

- active 정의는 읽기 전용으로 표시하고 “새 버전 만들기”로만 변경한다.
- 사용 중인 컴포넌트 archive 전에 사용처를 표시한다.
- 컴포넌트 버전 변경 시 영향받는 draft 섹션만 표시한다.
- 같은 섹션 내 `item_key` 중복을 입력 단계와 서버 양쪽에서 차단한다.
- 필수 컴포넌트 누락, 잘못된 token set, 미해결 참조가 있으면 활성화를 차단한다.
- token set CSV import 전에 dry-run diff와 오류를 표시하고 오류가 있으면 저장하지 않는다.
- active token set version은 직접 수정하지 않고 새 draft CSV import로만 변경한다.
- 저장 성공·실패 문구를 명시적으로 표시한다.
- 관리자 UI 문구는 DB i18n 메시지로 관리하되 프로모션 사용자 콘텐츠에는 적용하지 않는다.

### 8.3 Create Promo의 섹션 AI 디자인 UI

각 섹션에 `AI 디자인 생성` 버튼을 둔다. 버튼은 global toolbar가 아니라 실행 대상 section card에 위치한다.

실행 dialog:

- 범위: 전체 / 배치와 스타일 / 이미지만
- BG 생성 여부
- AI 허용 Image Item 목록과 선택
- 수동 수정값 유지 여부
- 현재 이미지 유지 여부

진행 중에는 plan과 asset job 상태를 표시하고 중복 실행을 차단한다. 완료 후 Preview에는 다음을 표시한다.

- 선택한 layout variant와 Item region 변경
- 변경된 style slot/token binding
- 생성된 BG와 Item 이미지
- 유지·덮어쓰기 대상
- 검증 fallback과 경고

작업 버튼은 `적용`, `다시 생성`, `취소`로 구성한다. BG와 각 Item 이미지는 적용 후에도 개별 삭제·교체가 가능해야 한다.

## 9. API 계획

### 9.1 컴포넌트 관리 API

| 기능 | 권장 경로 | 주요 검증 |
|---|---|---|
| 목록/생성 | `GET/POST /api/item-components` | 관리자 인증, 요청 key 금지, DB 자동 key 반환 |
| 상세/수정 | `GET/PATCH /api/item-component` | draft만 수정 |
| draft 생성 | `POST /api/item-component-draft` | active/draft 상태, 원자적 복제 |
| 활성화 | `POST /api/item-component-activate` | schema·capability 완전성 |
| archive | `POST /api/item-component-archive` | active 사용처 차단 |
| 사용처 | `GET /api/item-component-usage` | 섹션/인스턴스 목록 |

### 9.2 섹션 조립 API

- 섹션 draft에서만 컴포넌트 인스턴스 추가·수정·삭제·재정렬을 허용한다.
- 요청은 `componentVersionId`, `itemKey`, 인스턴스 설정만 받는다.
- 서버가 논리 `componentId` 일치와 capability를 재검증한다.
- 여러 인스턴스 변경은 revision 또는 ETag 기반 optimistic concurrency를 적용한다.
- `item_key`는 자동 `component_key`와 별개인 section instance 역할 키이며 UNIQUE(`section_id`, `item_key`)를 유지한다.

### 9.3 토큰 API

- `GET /api/design-token-catalog?scope=promo-template`
- `GET/POST /api/template-design-token-sets`
- `GET /api/template-design-token-set`
- `POST /api/template-design-token-set-import` (`dryRun=true` 필수 선행)
- `POST /api/template-design-token-set-activate`
- `POST /api/template-design-token-set-archive`
- `GET /api/template-design-token-set-usage`
- `POST /api/design-token-catalog-import`는 카탈로그 관리자 전용으로 제한한다.

CSV import 결과에는 추가·변경·폐기·오류 행, 누락 필수 token, 중복 token/index, 타입·단위·namespace 오류, source hash와 호환 component를 표시한다. 오류가 하나라도 있으면 전체 transaction을 rollback한다.

### 9.4 Section Design Planner API

| 기능 | 권장 경로 | 설명 |
|---|---|---|
| 실행 생성 | `POST /api/promo-section-design-runs` | mode/options/base snapshot 저장, 중복 hash 방지 |
| Plan 처리 | `POST /api/promo-section-design-plan-process` | 콘텐츠 분석·LLM plan·서버 검증 |
| Asset 작업 | `POST /api/promo-section-design-asset-process` | BG 또는 단일 Item 이미지 생성·재시도 |
| 상태 조회 | `GET /api/promo-section-design-runs?runId=` | plan, asset jobs, Preview 상태 반환 |
| 이미지 proxy | `GET /api/promo-section-design-image?runId=&assetJobId=` | private Blob 인증 proxy |
| 적용 | `POST /api/promo-section-design-apply` | revision·lock·version 재검증 후 snapshot patch |
| 취소 | `POST /api/promo-section-design-cancel` | 미적용 결과 취소, 자산 정리 대상 표시 |

Plan API와 asset API는 분리한다. Item 이미지 하나가 실패해도 검증된 layout/style plan과 다른 asset 결과는 유지한다.

## 10. 신규 기본 데이터

### 10.1 기본 아이템 컴포넌트

`text`, `image`, `cta`를 논리 컴포넌트로 seed하지 않는다. 이 값들은 다음 실제 컴포넌트의 field kind로만 사용한다.

| 초기 컴포넌트 후보 | field kind | 주요 계약 |
|---|---|---|
| Hero Title | `text` | 핵심 제목, 줄바꿈, 제목 style slots |
| Body Text | `text` | 본문·상세 설명, multi-line |
| Remark Text | `text` | 보조·주의 문구, 낮은 강조 역할 |
| Primary CTA | `cta` | label, URL, UTM, CTA style slots |
| Content Image | `image` | AI/file/url, 일반 콘텐츠 비율 |
| Logo Image | `image` | `contain`, logo 제약, alt text |
| Badge Image | `image` | `contain`, 작은 비율, 반복 배치 |

여러 컴포넌트가 같은 `renderer_key`를 공유할 수 있다. 예를 들어 Content Image, Logo Image와 Badge Image는 같은 Image renderer를 사용하되 입력 schema, 기본값, style slot, AI 허용 범위와 aspect ratio가 다르므로 별도의 재사용 컴포넌트로 등록할 수 있다.

각 컴포넌트의 `component_key`는 seed에서도 직접 입력하지 않고 DB가 자동 생성한다. `system_seed_code`로 seed 멱등성만 보장한다.

### 10.2 기본 섹션과 템플릿

- 기존 Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, Footer row는 모두 초기화하고 재사용하지 않는다.
- 기존 section ID, section key, Item, version, owner와 template 연결을 신규 seed에 승계하지 않는다.
- 신규 기본 섹션 목록과 조립 명세는 초기 컴포넌트 라이브러리가 확정된 뒤 별도 신규 요구사항으로 정의한다.
- 신규 섹션은 Item을 직접 생성하지 않고 active component version을 조립해 구성한다.
- 신규 기본 템플릿은 신규 section version과 선택된 token set version만 조립한다.
- 기존 명칭은 업무 참고 후보일 뿐 신규 섹션 생성을 강제하지 않는다.
- 공개 `sections[].items[]` 호환은 신규 resolver가 처리하며, 구형 DB row 재사용을 의미하지 않는다.

최소 두 개의 promo token set을 준비해 동일 콘텐츠 비교를 검증한다.

- `rounded-style`: 큰 radius, soft shadow, 부드러운 spacing
- `square-style`: 작은 radius, 명확한 border, 조밀한 spacing

두 세트는 동일한 필수 semantic token key를 모두 제공해야 한다.

### 10.3 기존 설정 초기화 경계

사용자 결정에 따라 다음 구형 설정·이력은 신규 구조로 변환하지 않고 초기화한다.

- `wizard_form_templates` 및 템플릿 section/layout 연결
- 템플릿 소유 `wizard_content_sections`
- `wizard_content_section_items`
- 잘못 생성된 `wizard_section_components`와 관련 seed 데이터
- 구형 `promo_section_design_runs` 실행 이력

다음은 이번 초기화 대상이 아니다.

- 생성 완료 프로모션과 저장된 스냅샷
- 사용자가 입력한 콘텐츠
- Promo Builder의 `promo_generation_lofi_drafts`, `promo_generation_final_designs`
- 기존 `promo_design_assets`
- 사용자 업로드 이미지와 관리자 정적 이미지
- 생성 결과 목록 중 섹션 AI 이외 파이프라인 데이터
- locale 메시지 데이터

구형 section AI 이미지 Blob은 다음 기준으로 처리한다.

- 생성 완료 프로모션 snapshot이 참조하는 적용 이미지: 보존
- 미적용·실패·취소 run의 미참조 이미지: 삭제
- 참조 판별 불가: 삭제 보류 목록으로 기록

초기화 전에 FK, snapshot 독립성, Blob 참조를 점검하고 dry-run count와 백업 dump를 생성한다. 초기화 SQL은 delete 대상과 보존 대상 count를 출력한 뒤 명시적 transaction에서 실행한다.

## 11. 마이그레이션 및 배포 전략

### Phase 0 — 기준선 복구와 금지선 설정

1. Production 배포 커밋과 원격 `main` 차이를 기록한다.
2. Production DB에 `028` 적용 여부를 마이그레이션 이력과 테이블 존재 여부로 확인한다.
3. 잘못된 section-as-component 구현 커밋을 `main`에서 revert하는 신규 커밋을 만든다. force reset으로 공유 이력을 다시 쓰지 않는다.
4. 잘못된 `028`이 적용된 Preview DB branch는 보존하지 않고 재생성한다.
5. Production의 `028` 미적용이 확인되기 전까지 Production 재배포를 금지한다.
6. 현재 전체 테스트 스위트와 주요 화면의 기준선을 기록한다.
7. 기존 프로모션이 관리자 테이블을 실시간 참조하지 않고 스냅샷으로 렌더링되는지 확인한다.
8. section AI 이미지 Blob이 저장된 프로모션 snapshot에서 어떻게 참조되는지 검사한다.

완료 게이트: 잘못된 구현 제거/대체 전략과 DB 복원점이 문서화되어야 한다.

### Phase 1 — 계약 테스트 우선 작성

1. 아이템 컴포넌트 정의·버전·인스턴스 JSON schema를 작성한다.
2. 기존 공개 `sections[].items[]` 응답 fixture를 보존한다.
3. 실제 Draft 2020-12 promo token catalog schema를 작성한다.
4. 디자인 토큰 CSV parser와 namespace/type/cardinality/semantic metadata 검증 테스트를 작성한다.
5. Section Design Plan과 Effective Design Patch JSON schema를 작성한다.
6. 반복 컴포넌트 배치, pinned version, item key 유일성 테스트를 작성한다.

완료 게이트: 신규 DB 없이도 resolver 입력/출력 계약이 테스트로 고정되어야 한다.

### Phase 2 — 컴포넌트 조립 Expand 마이그레이션

1. item component, component version, section component instance 테이블을 추가한다.
2. composite FK, active/draft unique index와 delete restrict를 적용한다.
3. 독립 section version과 component instance clone/activate 함수를 작성한다.
4. 구형 template-owned section 쓰기는 아직 제거하지 않되 신규 경로와 혼합되지 않도록 feature flag로 격리한다.
5. 기본 item component와 section seed를 transaction으로 검증한다.

`028` 처리 원칙:

- Production 미적용을 확인하고 Preview DB를 재생성한 뒤 잘못된 `028` 파일을 revert한다.
- 신규 설계는 저장소의 다음 사용 가능한 migration 번호로 작성한다.
- Production에 적용된 사실이 발견되면 위 절차를 중단하고 별도 corrective migration 계획을 먼저 작성한다.
- “구형 028만 적용된 상태”가 배포 경로에 들어가지 않도록 schema guard를 둔다.

### Phase 3 — N개 디자인 토큰 세트

1. token definition/set/set version/value 테이블을 추가한다.
2. promo token catalog schema와 manifest를 추가한다.
3. CSV dry-run/import/version activate API를 구현한다.
4. `rounded-style`, `square-style` CSV를 각각 검증·import한다.
5. 필수 token 누락, source hash 중복, slot/token 호환 검사를 구현한다.
6. 템플릿에 `design_token_set_version_id` pin을 추가한다.

완료 게이트: 두 token set이 동일 component/section 구조를 서로 다른 스타일로 렌더링하고 Web Output까지 동일하게 전달되어야 한다.

### Phase 4 — Resolver와 관리자 쓰기 전환

1. 신규 구조를 기존 공개 `sections[].items[]` 응답으로 해석하는 resolver를 구현한다.
2. 컴포넌트 관리 탭을 추가한다.
3. 섹션 관리에서 직접 item 생성 UI를 제거하고 컴포넌트 조립 UI로 전환한다.
4. 템플릿 관리에 N개 token set 등록·버전·선택 UI를 추가한다.
5. 저장·버전 생성·활성화·사용처 UX를 검증한다.
6. 관리자 신규 문구 seed와 locale fallback을 반영한다.

완료 게이트: 관리자가 Component → Section → Template 순서로 신규 구성을 완성할 수 있어야 한다.

### Phase 5 — 사용자 요청형 Section Design Planner

1. Section Design Plan/Effective Patch validator를 구현한다.
2. component region 배치와 slot/token 후보 생성기를 구현한다.
3. LLM design plan process와 asset job을 분리한다.
4. Create Promo section별 실행 dialog, polling, Preview, 적용/취소를 구현한다.
5. BG와 Item target을 명시적으로 분리하고 실패 asset 단독 재시도를 구현한다.
6. Apply의 version/revision/lock 재검증을 구현한다.

완료 게이트: 사용자 요청 없이 실행되지 않고, 허용 범위 밖 LLM 결과가 모두 거부되며, 승인된 patch만 현재 프로모션에 반영되어야 한다.

### Phase 6 — Preview 초기화와 전체 E2E

1. 잘못된 Preview DB branch를 폐기하고 신규 branch에 전체 migration을 적용한다.
2. 구형 템플릿·섹션·Item·section AI run 초기화 SQL을 dry-run한다.
3. 신규 component, section, template, Rounded/Square token set을 seed한다.
4. Create Promo와 Section Design Planner 전체 경로를 검증한다.
5. BG/Item 이미지 적용·삭제와 미참조 임시 Blob 정리를 검증한다.
6. Visual Editor Preview와 Web Output을 비교한다.
7. rollback SQL과 feature flag 복구를 리허설한다.

완료 게이트: Preview 브라우저/API/DB/Blob 검증 결과와 롤백 로그가 모두 기록되어야 한다.

### Phase 7 — Production 초기화와 전환

1. DB와 보존 대상 Blob 참조 목록을 백업한다.
2. Expand migration을 먼저 배포하고 기존 동작을 재확인한다.
3. dry-run count 승인 후 구형 관리자 설정과 section AI run을 초기화한다.
4. 미참조 임시 section AI Blob만 삭제한다.
5. 신규 기본 데이터와 N개 token set을 transaction으로 적용한다.
6. 공개 resolver와 관리자 쓰기를 신규 경로로 전환한다.
7. 생성 프로모션, 사용자 콘텐츠, LO-FI/최종 디자인 이미지와 locale 메시지 보존을 확인한다.
8. 이상 시 신규 쓰기를 중단하고 DB/feature flag를 복구한다.

### Phase 8 — 레거시 제거

안정화 기간 후에만 다음을 수행한다.

- 기존 `wizard_content_section_items` 쓰기 경로 제거
- `owner_form_template_id` 및 template-owned section clone 경로 제거
- 섹션 수준 component API와 UI 제거
- 구형 section AI process/apply 경로 제거
- 전환용 feature flag와 fallback 제거
- 사용되지 않는 migration/seed 설명 정리
- 레거시 item 직접 생성 UI와 dead CSS/문구 제거

## 12. 테스트 계획

### 12.1 DB·마이그레이션

- 빈 DB 전체 migration 적용
- 기존 스키마에서 Expand 적용
- 같은 컴포넌트 반복 배치 허용
- 같은 섹션의 item key 중복 차단
- 컴포넌트 생성 요청에 key가 없어도 `cmp_` key 자동 생성
- 클라이언트가 보낸 component key 거부
- 새 component version은 기존 key 유지, 컴포넌트 복제는 신규 key 생성
- `system_seed_code` 기반 seed 재실행 시 중복 컴포넌트 미생성
- component/version 불일치 차단
- 사용 중 버전 삭제 차단
- active/draft unique index 경합
- section draft clone 시 pinned version 유지
- 구형 `owner_form_template_id` 및 template-owned clone 경로 제거
- logical component/version composite FK 불일치 차단
- token list의 value index 중복 차단
- Rounded/Square token set의 필수 key 완전성
- token set별 active/draft unique index와 template version pin
- 동일 CSV source hash 중복 import 정책
- CSV 오류 시 전체 rollback
- 구형 템플릿·섹션·Item·section AI run 초기화 count
- 초기화 전후 생성 프로모션·사용자 콘텐츠·LO-FI/최종 디자인·locale row count 동일성
- snapshot 참조 Blob 보존과 미참조 임시 Blob 삭제 목록 검증

### 12.2 API·계약

- 컴포넌트 CRUD와 lifecycle 권한·상태 검증
- 섹션 조립 revision 충돌
- 공개 resolver가 해석된 `items[]`만 반환
- draft/archived 정의 비노출
- token namespace와 CSS property allowlist 검증
- 실제 JSON Schema 기반 token catalog/CSV 정규화 검증
- light/dark 상속과 list 결합
- style slot/token type·semantic role 호환성
- 선택한 token set 밖의 LLM token key 거부
- 임의 selector, CSS, hex, px를 포함한 LLM plan 거부
- 잠금 값이 사용자 입력보다 우선
- AI `imageTargetItemKeys`가 image 인스턴스만 허용
- layout region 중복·필수 Item 누락·고정 Item 이동 차단
- 잘못된 Item target을 BG로 자동 fallback하지 않음
- 접근성 대비 실패 binding의 결정적 fallback
- Apply 시 버전·잠금·token set·content hash·layout revision 재검증
- asset job 단독 재시도 시 layout/style plan 유지

### 12.3 브라우저·통합

- 별도 컴포넌트 탭에서 Hero Title/Body Text/Primary CTA/Content Image 같은 실제 컴포넌트 생성
- 컴포넌트 생성 화면에 key 입력란이 없고 상세에서 자동 key 읽기 전용/복사 제공
- 동일 Image 컴포넌트를 한 섹션에 두 번 배치
- 섹션 활성화 후 템플릿에 배치
- Rounded/Square CSV 각각 등록·활성화·템플릿 선택
- 동일 콘텐츠의 Rounded/Square Preview 차이와 구조 동일성
- Create Promo에 관리자 설정 반영
- AI 비활성 버튼 상태와 사유 표시
- 사용자 요청 전 AI run이 생성되지 않음
- 전체 / 배치와 스타일 / 이미지만 실행 모드
- LLM component region 배치 Preview·적용·취소
- LLM token binding 변경과 관리자 잠금 유지
- Item AI 이미지 생성·적용·삭제
- 섹션 배경 이미지 생성·정렬·삭제
- BG 오른쪽 visual focus, 왼쪽 safe area와 section 배경색 fade 반영
- BG와 Item 이미지 target DOM 분리
- 다시 생성 시 수동 변경/기존 이미지 보존 옵션
- 긴 텍스트의 줄바꿈 유지
- Visual Editor Preview와 Web Output 동등성
- 관리자 앱 테마 변경이 프로모션 콘텐츠 토큰에 영향 없음
- 1023/1024, 980/981, 680/681 등 breakpoint 경계 회귀

### 12.4 실행 기준

- 현재 전체 테스트 스위트 통과
- 문법 검사 통과
- Visual Editor 소스를 변경한 단계에서만 빌드 및 산출물 검증
- Preview 배포 smoke test 통과
- Production 전환 전 read-only DB 사전 점검 통과

테스트 파일 개수는 문서에 고정하지 않고 실행 로그에 기록한다.

## 13. 보안·검증 원칙

- 관리자 쓰기 API는 인증과 권한을 강제한다.
- 공개 API는 active 데이터와 필요한 렌더 필드만 반환한다.
- JSONB는 schema 검증 없이 저장하지 않는다.
- token 값은 타입별 parser와 범위 검증을 통과해야 한다.
- CSS 변수 이름, CSS property, renderer variant는 allowlist 기반이다.
- HTML/JS/raw CSS를 데이터로 저장하거나 실행하지 않는다.
- 이미지 URL은 기존 Blob proxy와 asset 접근 정책을 유지한다.
- AI 결과는 컴포넌트·토큰·잠금 정책을 우회할 수 없다.
- 사용자 콘텐츠는 prompt instruction이 아닌 untrusted data로 구분하고 prompt injection을 차단한다.
- LLM 원본 응답은 렌더링하지 않고 검증된 Effective Design Patch만 사용한다.
- 색상 대비, slot 타입, region collision은 LLM이 아니라 서버 코드가 최종 판단한다.
- Plan job과 asset job은 idempotency key와 제한된 retry를 사용한다.
- audit log에는 변경 주체, 이전/새 버전, change note를 기록한다.

## 14. 주요 리스크와 대응

| 우선순위 | 리스크 | 대응 |
|---|---|---|
| P0 | 잘못된 섹션 컴포넌트 모델이 Production에 재배포됨 | main/Production 기준선 정리 전 배포 금지, migration guard |
| P0 | 구형 설정·AI run 초기화가 생성 프로모션이나 다른 생성 파이프라인까지 삭제 | 대상 테이블 명시, dry-run count, snapshot/FK 조사, transaction과 backup |
| P0 | 구형 section AI Blob 삭제로 적용된 프로모션 이미지 손실 | snapshot 참조 목록 생성, 참조 자산 보존, 미참조 Blob만 삭제 |
| P0 | 컴포넌트 최신 버전 자동 반영으로 라이브 섹션 변경 | active section의 version pin 강제 |
| P1 | `--app-*`와 `--promo-*` 혼용 | scope/namespace 검증과 renderer 정적 테스트 |
| P1 | N개 token set 간 필수 token 누락·타입 차이 | 공통 catalog version, import validation, active 차단 |
| P1 | token set 새 버전이 운영 템플릿에 자동 전파 | template이 immutable token set version pin |
| P1 | 자유 JSON/CSS로 보안·렌더 회귀 | schema + property/function allowlist |
| P1 | LLM이 허용되지 않은 배치·토큰·Item target 선택 | 후보 ID만 제공, plan schema, server validator, default fallback |
| P1 | LLM 색상 조합의 접근성 실패 | 실제 token 값으로 서버 대비 계산 후 거부/fallback |
| P1 | 장시간 단일 요청과 이미지 일부 실패 | plan/asset job 분리, 개별 retry, 상태·lease 관리 |
| P1 | Create Promo가 신규 관리자 설정을 못 읽음 | 공개 resolver 단일화, 구/신 출력 비교 |
| P1 | AI image target이 다시 background로 fallback | instance item key 검증과 API/브라우저 테스트 |
| P2 | 지나치게 세분화된 컴포넌트 증가 | 의미·검증·렌더 계약이 같은 항목은 variant로 재사용 |
| P2 | CSV와 DB 카탈로그 drift | catalog version, import hash, dry-run diff |

## 15. 파일별 예상 변경 범위

구현 시 실제 의존성을 다시 검색한 뒤 확정한다.

- DB: `db/migrations/`, `db/seeds/`
- Store/Resolver: `api/_wizard-form-templates-store.js` 및 신규 item component store
- Admin API: 신규 `api/item-component*.js`, section composition, token set API
- Public API: `api/wizard-form-templates-public.js` 계열
- Section AI: `_promo-section-design-contract.js`, provider/process/apply 경로
- Admin UI: `prototype/app.js`, 관리자 HTML/CSS, i18n 메시지 seed
- Create Promo: `prototype/create-promo.js`, `prototype/create-promo.css`
- Visual Editor: `visual-editor/src/`, renderer CSS 및 build 산출물
- Tests: DB/API/contract/browser/token import 테스트
- Docs: 본 문서, 운영 runbook, handoff

빌드 산출물은 직접 수정하지 않고 원본 소스를 변경한 뒤 공식 빌드 명령으로 생성한다.

## 16. Definition of Done

다음 조건을 모두 만족해야 완료다.

1. 관리자에 독립된 컴포넌트 관리 탭이 존재한다.
2. 컴포넌트는 섹션 아이템 단위이며 섹션 자체와 구분된다.
3. `text`, `image`, `cta`는 field kind이며 실제 컴포넌트는 Hero Title/Primary CTA/Content Image 같은 버전형 정의로 관리된다.
4. `component_key`는 서버/DB가 자동 생성하고 UI에서 입력·수정할 수 없다.
5. 관리자는 컴포넌트를 조립해 신규 섹션을 만들고 신규 섹션을 조립해 템플릿을 만든다.
6. 같은 컴포넌트를 한 섹션에 여러 `item_key`로 배치할 수 있다.
7. 활성 섹션은 컴포넌트 버전을 pin하며 컴포넌트 변경이 자동 전파되지 않는다.
8. Create Promo는 신규 active 설정을 기존 호환 `sections[].items[]` 형태로 받는다.
9. AI Item 이미지는 선택한 image 인스턴스에 적용되고 background fallback은 정책대로만 동작한다.
10. N개의 디자인 토큰 세트를 CSV로 등록·버전 관리하고 템플릿이 하나의 세트 버전을 pin한다.
11. Rounded/Square 세트가 동일 component 구조에 서로 다른 디자인을 제공한다.
12. 앱 UI 토큰과 프로모션 템플릿 토큰의 namespace/scope가 분리된다.
13. style slot과 token binding이 타입·semantic role로 검증된다.
14. AI는 사용자 요청 시에만 layout·token·BG·Item image plan을 생성한다.
15. LLM 결과는 서버 검증과 Preview 승인 후 현재 프로모션에만 적용된다.
16. Plan과 asset job이 분리되고 실패한 이미지 작업만 재시도할 수 있다.
17. Preview와 Web Output이 같은 effective token/layout/asset snapshot을 사용한다.
18. 구형 템플릿·섹션·Item·section AI run은 초기화되고 신규 구조로 변환되지 않는다.
19. 생성 프로모션, 사용자 콘텐츠, LO-FI/최종 디자인, 사용자 이미지와 locale 메시지는 보존된다.
20. 적용된 section AI 이미지는 보존되고 미참조 임시 Blob만 정리된다.
21. 전체 테스트, Preview E2E, DB/Blob 초기화·롤백 검증이 통과한다.
22. 잘못된 섹션 수준 component 모델과 dead path가 제거된다.

## 17. 구현 착수 전 확인 체크리스트

- [ ] Production에 migration `028`이 미적용인지 확인
- [ ] 원격 main과 Production 롤백 커밋 차이 처리 방법 확정
- [ ] Preview DB 자격 증명 회전 및 환경변수 재설정
- [ ] 생성 완료 프로모션의 snapshot 독립성 확인
- [ ] 구형 초기화 대상과 보존 대상 테이블/FK cascade 목록 확정
- [ ] 적용된 section AI Blob과 미참조 임시 Blob 판별 쿼리 확정
- [ ] 실제 Draft 2020-12 promo token catalog schema 확정
- [ ] `rounded-style`, `square-style` CSV와 semantic metadata 확정
- [ ] Hero Title/Body Text/Primary CTA/Content Image 등 초기 실제 컴포넌트 목록 확정
- [ ] 자동 component key와 seed idempotency 계약 확정
- [ ] 신규 섹션 조립 명세와 호환 `item_key` 목록 확정
- [ ] component style slot과 default token binding 목록 확정
- [ ] layout variant별 region/mobile fallback 계약 확정
- [ ] Section Design Plan과 Effective Patch schema 확정
- [ ] 공개 resolver 호환 fixture 준비
- [ ] Preview reset SQL과 rollback SQL 사전 검토
- [ ] Production 재배포 금지선 해제 조건 합의

## 18. 실행 금지 조건

다음 중 하나라도 해당하면 설정 초기화 또는 Production 전환을 진행하지 않는다.

- migration `028`의 실제 적용 상태를 모름
- 백업 또는 복구 SQL이 없음
- 생성 프로모션이 삭제 대상 관리자 테이블을 실시간 참조함
- 구형 초기화가 LO-FI/최종 디자인·사용자 콘텐츠·locale 메시지까지 영향을 줌
- 적용된 section AI 이미지와 미참조 임시 Blob을 구분할 수 없음
- 신규 resolver가 기존 공개 계약 회귀 테스트를 통과하지 못함
- Rounded/Square token set이 공통 필수 catalog 계약을 통과하지 못함
- LLM plan server validator와 Apply revision 재검증이 없음
- `--app-*` 토큰이 Web Output 또는 `.promo-renderer`에 유입됨
- Preview에서 Component → Section → Template/Token Set → Create Promo/AI Planner 전체 경로를 검증하지 못함

---

본 계획의 우선순위는 대규모 UI 리라이트가 아니라 **데이터 소유권, N개 token set 계약과 사용자 요청형 LLM harness를 먼저 바로잡는 것**이다. LLM의 자율성은 선택된 token set·component slot·layout region·image target 안에서만 허용하고, 모든 결과는 서버 검증과 사용자 승인 뒤 적용한다.
