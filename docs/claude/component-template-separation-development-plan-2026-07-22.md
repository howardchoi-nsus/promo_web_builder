# 컴포넌트 관리 / 템플릿 관리 분리 개발계획서

- 작성일: 2026-07-22
- 최종 수정일: 2026-07-22
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 구현 전 개발계획 / 소스코드·DB 미반영
- 관련 문서
  - `docs/claude/admin-page-terminology-dictionary-2026-07-22.md`
  - `docs/claude/admin-i18n-locale-management-development-plan-2026-07-22.md`
- 적용 대상
  - 관리자 페이지의 템플릿·레이아웃 관리
  - Promo Wizard
  - Create Promo
  - Visual Editor의 템플릿 스냅샷 입력 경계

## 0. 변경 결정과 문서 목적

### 0.1 확정된 운영 결정

- 현재 등록된 **관리자 템플릿·섹션 설정은 모두 초기화할 수 있다.**
- 기존 설정을 중복 제거(dedup)하여 신규 구조로 병합하지 않는다.
- 신규 전역 섹션 컴포넌트와 신규 기본 템플릿을 시드 데이터로 다시 구성한다.
- 초기화 범위는 관리자 설정 데이터로 제한한다.
- 기존 생성 완료 프로모션, 생성 이력, AI 결과 이미지와 사용자가 등록한 프로모션 콘텐츠는 삭제하지 않는다.
- 단, 기존 생성 완료 프로모션이 관리자 템플릿 테이블을 실시간 참조하는지 먼저 확인한다. 완전한 스냅샷 기반임이 검증되지 않으면 초기화를 실행하지 않는다.

### 0.2 목표

관리자 기능을 다음 두 책임으로 분리한다.

1. **컴포넌트 관리**: 섹션과 하위 항목을 템플릿과 독립된 전역 컴포넌트로 관리한다.
2. **템플릿 관리**: 등록된 컴포넌트를 참조하고 순서·노출 등 템플릿별 설정만 조립한다.

이 문서는 다른 LLM 또는 개발자가 이전 대화 없이도 다음을 판단하고 구현할 수 있는 수준을 목표로 한다.

- 현재 구조의 문제와 실제 코드 동작
- 신규 데이터 모델과 속성 소유권
- 안전한 배포·초기화 순서
- API·관리자 UI 변경 범위
- 데이터 삭제 경계와 복구 조건
- 자동 테스트 및 완료 기준

## 1. 범위와 비범위

### 1.1 v1 필수 범위(MUST)

- 섹션을 특정 템플릿에 종속되지 않는 전역 컴포넌트로 관리한다.
- 항목(item)은 섹션 컴포넌트의 하위 구성요소로 관리한다.
- 템플릿은 컴포넌트를 복제하지 않고 참조한다.
- 컴포넌트 정의와 템플릿 인스턴스 설정의 저장 위치를 분리한다.
- 템플릿은 컴포넌트의 최신 active 버전을 floating 방식으로 해석한다.
- 컴포넌트 편집 화면에서 사용 중인 템플릿 수와 목록을 표시한다.
- 관리자 UI 신규 문구는 DB 기반 i18n 메시지 키로 관리한다.
- 기존 관리자 설정을 백업한 후 신규 기본 컴포넌트·템플릿으로 초기화한다.
- Wizard/Create Promo가 신규 active 템플릿과 컴포넌트만 조회하도록 전환한다.

### 1.2 v1에서 제외하는 범위(MUST NOT)

- 기존 템플릿별 섹션 사본을 비교·병합하는 dedup 기능
- 기존 템플릿 설정과 신규 설정을 장기간 함께 운영하는 이중 모델
- 템플릿 편집 중 컴포넌트 정의를 함께 수정하는 copy-on-write
- 템플릿 복제 시 컴포넌트 또는 항목을 복제하는 기능
- 항목(item)을 독립 라이브러리로 만들어 템플릿에 직접 조립하는 기능
- 컴포넌트 버전 pin UI와 `pinned_version` 도입
- 사용 중 컴포넌트의 하드 삭제 또는 강제 archive
- Create Promo 사용자가 등록하는 프로모션 콘텐츠에 대한 별도 i18n 키 관리

> 버전 pin과 항목 독립 라이브러리는 실제 요구가 발생한 뒤 별도 계획으로 검토한다. 선제 구현은 현재 범위에서 불필요한 복잡도다.

## 2. 용어

- **컴포넌트(Component)**: 재사용 가능한 전역 섹션의 논리적 실체.
- **컴포넌트 키(component_key)**: 사람이 식별 가능한 불변 논리 키. 예: `heroBanner`.
- **컴포넌트 버전(Component Version)**: draft/active/inactive/archived 상태를 갖는 섹션 정의 버전.
- **항목(Item)**: 텍스트·이미지·CTA 등 컴포넌트 버전에 속한 입력 요소.
- **템플릿(Template)**: 컴포넌트 참조 목록, 템플릿별 인스턴스 설정, 레이아웃 스펙의 집합.
- **인스턴스 설정(Instance Setting)**: 특정 템플릿에서만 적용되는 순서·노출·필수·고정 위치 설정.
- **floating 참조**: 컴포넌트의 안정 ID를 참조하고 실행 시점의 active 버전을 해석하는 방식.
- **설정 데이터(Configuration Data)**: 관리자 템플릿·컴포넌트·항목·레이아웃과 그 조립 관계.
- **프로모션 스냅샷(Promotion Snapshot)**: 프로모션 생성 시 확정된 컴포넌트 버전, 섹션 구조, 사용자 콘텐츠와 디자인 스펙의 사본.

## 3. 현재 코드 기준선과 정정 사항

### 3.1 현재 데이터 모델

| 테이블 | 현재 역할 | 확인된 문제 |
|---|---|---|
| `wizard_content_sections` | 버전별 섹션 정의 | `owner_form_template_id`가 템플릿 소유를 표현하며 `on delete cascade`임 |
| `wizard_content_section_items` | 섹션 버전의 하위 항목 | `section_id` 삭제 시 cascade 됨 |
| `wizard_form_templates` | 버전별 템플릿 정의 | 템플릿 설정 초기화 대상 |
| `wizard_form_template_sections` | 템플릿-섹션 연결과 인스턴스 설정 | `section_id`가 특정 버전 행을 고정 참조하여 floating 동작을 막음 |
| `wizard_form_template_layouts` | 템플릿 레이아웃 스펙 | 템플릿 설정 초기화 대상 |
| `promo_section_design_runs` | 섹션 AI 디자인 실행 이력·스냅샷 | `form_template_id NOT NULL ... ON DELETE CASCADE`이므로 템플릿 삭제 시 실행 이력도 삭제됨 |

### 3.2 현재 동작에서 반드시 고칠 부분

1. `api/wizard-form-template-sections.js`는 다른 템플릿 소유 섹션을 편집할 때 섹션과 항목을 복제하는 copy-on-write를 수행한다.
2. `_wizard-form-templates-store.js`는 `section_id`가 있으면 해당 행을 우선한다. 따라서 같은 `section_key`의 새 active 버전을 발행해도 템플릿에 자동 반영되지 않는다.
3. `owner_form_template_id` FK가 `on delete cascade`이므로, 컬럼을 주석으로만 격하하면 템플릿 삭제 시 공유 컴포넌트가 함께 삭제될 수 있다.
4. 템플릿 조립 API가 컴포넌트 정의와 인스턴스 설정을 동시에 수정한다. 두 책임을 API 수준에서 분리해야 한다.
5. 비활성 상태인 기존 `section-library-manager` UI는 그대로 활성화할 수 있는 완성 구조가 아니다. 현재 데이터 계약과 용어를 제거하고 신규 컴포넌트 API에 맞춰 재검토해야 한다.
6. `promo_section_design_runs.form_template_id`가 `ON DELETE CASCADE`이므로 현재 상태에서 템플릿을 초기화하면 보존해야 할 AI 디자인 run도 함께 삭제된다. 설정 초기화 전에 이 FK를 반드시 분리해야 한다.

### 3.3 이전 계획서의 사실관계 정정

- 마이그레이션 `021_fix_form_template_section_clone_links.sql`의 현재 `clone_wizard_form_template_draft()`는 템플릿-섹션 **참조 행만 복사**한다.
- 따라서 “현재 clone이 소유 섹션 전체를 복제한다”는 설명은 잘못된 내용이므로 삭제한다.
- 실제 컴포넌트 복제 문제는 템플릿 clone 함수가 아니라 `api/wizard-form-template-sections.js`의 편집 시 copy-on-write 경로다.

## 4. 목표 아키텍처

### 4.1 책임 분리

```text
[컴포넌트 관리]
  안정 ID / 키 / 버전 / 상태
  이름 / 설명 / 항목 구성
  AI 디자인 정책 / 이미지 제약
              │
              │ component_id 참조
              ▼
[템플릿 관리]
  컴포넌트 선택 / 순서 / 노출 / 필수
  고정 위치 / 사용자 순서 변경 / 레이아웃
              │
              │ 생성 시 active 버전 해석 및 스냅샷
              ▼
[Wizard / Create Promo / Visual Editor]
```

### 4.2 안정적인 컴포넌트 식별자

`wizard_content_sections`는 버전별 행이므로 그 `id`를 템플릿이 직접 참조하면 floating 버전 전파가 불가능하다. 반대로 `section_key` 문자열만 참조하면 DB 외래키로 존재 여부를 강제하기 어렵다.

따라서 v1부터 논리 컴포넌트용 안정 ID를 도입한다.

```text
wizard_section_components (논리 컴포넌트)
  id                 uuid PK
  component_key      text UNIQUE NOT NULL
  created_at
  updated_at

wizard_content_sections (컴포넌트 버전)
  id                 uuid PK
  component_id       uuid FK -> wizard_section_components(id) ON DELETE RESTRICT
  version            integer
  status             draft|active|inactive|archived
  ...공유 정의...
  UNIQUE(component_id, version)
  active partial unique(component_id)

wizard_form_template_sections (템플릿 인스턴스)
  id
  form_template_id
  component_id       uuid FK -> wizard_section_components(id) ON DELETE RESTRICT
  ...인스턴스 설정...
  UNIQUE(form_template_id, component_id)
```

`component_key`는 API 응답과 관리자 화면의 식별자로 계속 제공한다. 내부 조인과 참조 무결성은 `component_id`를 기준으로 한다.

### 4.3 속성 소유권

| 속성 | 소유 주체 | 최종 저장 위치 |
|---|---|---|
| `component_key` | 논리 컴포넌트 | `wizard_section_components` |
| 이름, 설명 | 컴포넌트 버전 | `wizard_content_sections` |
| 항목 구성, `field_kind`, `text_type` | 컴포넌트 버전 | `wizard_content_section_items` |
| 항목 노출·필수·잠금·AI 이미지 제약 | 컴포넌트 버전 | `wizard_content_section_items` |
| AI 디자인 활성화, 허용 레이아웃, 이미지 대상 | 컴포넌트 버전 | `wizard_content_sections.ai_design` |
| `sort_order` | 템플릿 인스턴스 | `wizard_form_template_sections` |
| `is_required` | 템플릿 인스턴스 | `wizard_form_template_sections` |
| `is_visible` | 템플릿 인스턴스 | `wizard_form_template_sections` |
| `fixed_position` | 템플릿 인스턴스 | `wizard_form_template_sections` |
| `user_reorder_allowed` | 템플릿 인스턴스 | `wizard_form_template_sections` |
| 색상·간격·레이아웃 스펙 | 템플릿 | `wizard_form_template_layouts` |

기존 `wizard_content_sections`에도 `is_required`, `fixed_position`, `sort_order`, `is_visible_in_wizard`, `order_change_allowed`가 존재한다. 신규 구조에서는 템플릿 인스턴스 속성과 중복되므로 다음과 같이 처리한다.

- 템플릿에서 결정할 값은 `wizard_form_template_sections`만 source of truth로 사용한다.
- 섹션 테이블의 중복 컬럼은 신규 API에서 읽거나 쓰지 않는다.
- 전환 안정화 후 실제 사용처가 0건임을 검증한 다음 별도 cleanup 마이그레이션에서 제거한다.

### 4.4 버전 해석 계약

- 템플릿 연결은 `component_id`만 저장한다.
- resolver는 해당 `component_id`의 active 버전을 정확히 1건 조회한다.
- active 버전이 없거나 2건 이상이면 템플릿을 정상으로 간주하지 않고 명시적 오류를 반환한다.
- draft 컴포넌트 버전은 템플릿에 노출하지 않는다.
- 신규 active 버전 발행 시 floating 참조 템플릿은 자동으로 새 버전을 사용한다.
- 실제 프로모션 생성 시 `componentId`, `componentKey`, `componentVersion`, 항목 정의, 사용자 콘텐츠, 레이아웃 revision을 스냅샷으로 저장한다.
- 기존 생성 완료 프로모션은 스냅샷만으로 렌더링되어야 하며 관리자 active 설정을 재조회하면 안 된다.

## 5. 삭제·보존 경계

### 5.1 초기화 대상

다음은 **관리자 설정 데이터**이며 백업 후 초기화할 수 있다.

- `wizard_form_template_layouts`의 기존 레이아웃 설정
- `wizard_form_template_sections`의 기존 조립 참조
- `wizard_form_templates`의 기존 템플릿 버전
- `wizard_content_section_items`의 기존 항목 설정
- `wizard_content_sections`의 기존 섹션 버전
- 기존 설정에만 종속된 운영 이력·감사 로그는 보존 정책 확인 후 초기화하거나 별도 archive로 내보낸다.

### 5.2 삭제 금지 대상

- 생성 완료 프로모션과 프로모션 목록 데이터
- 사용자가 Create Promo에 등록한 콘텐츠
- Promo Wizard/Create Promo 저장 초안 중 보존 대상으로 정한 데이터
- AI 디자인 run, 입력/결과 스냅샷과 생성 이미지 메타데이터
- Vercel Blob의 최종 이미지·섹션 이미지
- 배포·인증·i18n·공통 CSS 관련 설정
- 템플릿/컴포넌트와 무관한 관리자 설정

### 5.3 초기화 사전 게이트(MUST)

다음 조건이 모두 충족되지 않으면 삭제 SQL을 실행하지 않는다.

1. 대상 DB 환경(Preview 또는 Production)이 명확히 확인된다.
2. 삭제 대상 테이블과 연관 FK를 읽기 전용으로 조사해 행 수를 기록한다.
3. 기존 설정 데이터를 JSON 또는 SQL로 내보내 복구 파일을 확보한다.
4. 기존 생성 완료 프로모션 표본이 관리자 템플릿 테이블 없이 스냅샷만으로 렌더링되는지 검증한다.
5. `promo_section_design_runs`를 포함해 템플릿 삭제로 cascade 되는 모든 FK를 제거하거나 보존형 FK로 변경한다.
6. 처리 중인 섹션 AI run이 0건인지 확인한다. 처리 중 run이 있으면 완료 또는 안전한 취소 전까지 초기화하지 않는다.
7. 새 resolver·API가 먼저 배포되어 신규 모델을 읽을 수 있다.
8. 신규 기본 컴포넌트·템플릿 시드가 같은 트랜잭션에서 정상 생성됨을 Preview DB에서 검증한다.
9. 롤백 SQL 또는 백업 복원 절차가 리허설되어 있다.

## 6. DB 변경 계획

### 6.1 마이그레이션 번호 확인

현재 문서 기준 다음 후보는 `028`이지만, 구현 착수 직전에 `db/migrations`의 최신 번호를 다시 확인한다. 이미 사용 중이면 다음 번호를 배정한다. 문서에 적힌 번호를 무조건 사용하지 않는다.

### 6.2 Expand 마이그레이션(비파괴)

첫 마이그레이션은 기존 데이터 삭제나 컬럼 삭제 없이 신규 모델을 추가한다.

1. `wizard_section_components` 생성.
2. `wizard_content_sections.component_id` nullable FK 추가.
3. `wizard_form_template_sections.component_id` nullable FK 추가.
4. `component_id + version`, active partial unique 인덱스 추가 준비.
5. `owner_form_template_id`의 신규 쓰기를 중단하되 아직 삭제하지 않는다.
6. 사용처 조회는 `component_id` 기준으로 구현한다.
7. `promo_section_design_runs`에 `template_key_snapshot`을 추가하고 기존 값을 backfill한다.
8. `promo_section_design_runs.form_template_id`의 NOT NULL을 제거하고 FK를 `ON DELETE SET NULL`로 교체한다.

AI 실행 이력 보존 계약:

- 신규 run 생성 시 `form_template_id`, `template_key_snapshot`, `template_version`, `layout_revision`, 입력/제약 스냅샷을 함께 저장한다.
- 처리 중 상태(`queued`부터 `ready`까지)는 유효한 `form_template_id`를 반드시 가져야 한다.
- 완료·적용·실패·취소된 과거 run은 템플릿 삭제 후 `form_template_id = null`이어도 스냅샷으로 조회할 수 있어야 한다.
- 템플릿 초기화 전 처리 중 run은 0건이어야 하며, DB CHECK만으로 표현하기 어려운 상태 규칙은 서비스 계층과 reset preflight에서 모두 검증한다.
- 기존 active-run unique index는 nullable FK 전환 후의 동작을 재검토한다. 처리 중 run에는 FK가 필수이므로 중복 방지 의미가 유지되어야 한다.

사용처 조회 규칙:

- 템플릿 상태 범위를 API 파라미터로 명확히 한다. 기본값은 active + draft이며 archived는 제외한다.
- `count(distinct form_template_id)`와 템플릿 목록을 같은 필터로 계산한다.
- 빈 배열에서 null 값이 섞이지 않도록 필터링한다.
- 특정 섹션 버전 ID가 아니라 논리 `component_id`로 집계한다.

### 6.3 Config reset + seed 마이그레이션(파괴적, 별도 승인)

기존 dedup 마이그레이션은 만들지 않는다. 대신 다음을 하나의 DB 트랜잭션으로 수행하는 reset/seed 스크립트를 만든다.

1. 예상 행 수와 실제 행 수가 다르면 중단한다.
2. 기존 관리자 설정 테이블을 FK 의존 순서에 맞춰 초기화한다.
3. `wizard_section_components`에 신규 논리 컴포넌트를 생성한다.
4. 각 컴포넌트의 active 버전과 항목을 생성한다.
5. 신규 기본 템플릿과 레이아웃을 생성한다.
6. 템플릿-컴포넌트 연결과 인스턴스 설정을 생성한다.
7. active 컴포넌트·기본 active 템플릿 불변 조건을 검증한다.
8. 검증 실패 시 트랜잭션 전체를 롤백한다.

reset/seed 스크립트는 다음 안전 조건을 갖는다.

- 환경명 또는 DB 식별값을 명시적으로 요구한다.
- 예상 대상 행 수를 인자로 받거나 스크립트 내부 검증값으로 고정한다.
- 무조건적인 `truncate ... cascade`를 사용하지 않는다.
- 실행 전 dry-run 조회를 제공한다.
- 같은 데이터에 반복 실행해 중복을 만들지 않는다.
- 삭제·시드 결과 행 수를 출력한다.

### 6.4 Contract 마이그레이션(안정화 후)

신규 모델 전환과 회귀 검증이 끝난 다음 별도 릴리스에서 수행한다.

1. 모든 신규 행의 `component_id`가 채워졌는지 검증한다.
2. `component_id`를 NOT NULL로 변경한다.
3. `owner_form_template_id` FK를 제거한 뒤 컬럼을 제거한다.
4. `wizard_form_template_sections.section_id` FK와 컬럼을 제거한다.
5. 템플릿 연결의 legacy `section_key` 중복 컬럼을 제거한다.
6. `wizard_content_sections.section_key` 중복 컬럼을 제거하고 API에서는 registry의 `component_key`를 반환한다.
7. 섹션 버전 테이블의 중복 인스턴스 속성은 사용처 0건 확인 후 제거한다.
8. legacy 인덱스, 함수, 트리거, audit의 소유 기반 분기를 제거한다.

> `owner_form_template_id`는 절대로 “주석만 deprecated” 상태로 남기지 않는다. `on delete cascade`가 유지되는 동안 공유 컴포넌트 모델은 안전하지 않다.

## 7. 서비스/API 계획

### 7.1 컴포넌트 관리 API

```text
GET    /api/section-components
GET    /api/section-component?componentId=
POST   /api/section-component
POST   /api/section-component-draft
PATCH  /api/section-component
POST   /api/section-component-activate
POST   /api/section-component-archive
GET    /api/section-component-usage?componentId=
```

필수 계약:

- 생성 시 안정 `component_id`와 불변 `component_key`를 발급한다.
- active 직접 수정은 금지하고 active→draft clone→수정→activate 순서를 사용한다.
- 항목 CRUD는 draft 버전에만 허용한다.
- active 발행은 컴포넌트별 트랜잭션/락으로 active 1건을 보장한다.
- 사용 중 컴포넌트는 archive와 하드 삭제를 차단한다.
- `ai_design`의 enabled, 허용 레이아웃, 이미지 대상 항목 키를 서버에서 검증한다.

### 7.2 템플릿 조립 API

```text
GET    /api/form-template-sections?templateId=
POST   /api/form-template-section
PATCH  /api/form-template-section
DELETE /api/form-template-section
POST   /api/form-template-sections-reorder
```

필수 계약:

- 참조 추가 입력은 `componentId`를 사용한다.
- active 버전이 존재하는 컴포넌트만 추가한다.
- PATCH는 템플릿 인스턴스 속성만 허용한다.
- name, description, items, aiDesign 등 컴포넌트 정의 입력이 포함되면 400을 반환한다.
- 참조 제거는 연결 행만 삭제하며 컴포넌트와 항목을 삭제하지 않는다.
- 템플릿 clone은 연결 행과 인스턴스 설정만 복사한다.
- copy-on-write 분기와 소유권 검사를 제거한다.

### 7.3 Resolver

`api/_wizard-form-templates-store.js`의 resolver를 다음 계약으로 바꾼다.

```text
template section.component_id
  -> wizard_content_sections.component_id
  -> status = active
  -> 정확히 1개 버전
  -> 해당 version의 items 조회
```

- `section_id` 우선 조회를 제거한다.
- legacy `section_key` fallback은 Expand 배포부터 reset 완료 전까지만 허용한다.
- reset 완료 후 fallback 호출 횟수가 0인지 로그/테스트로 확인하고 Contract 단계에서 제거한다.
- active 버전 미존재 시 조용히 빈 섹션으로 처리하지 말고 오류 코드와 `componentKey`를 반환한다.

## 8. 관리자 UI 계획

### 8.1 정보 구조

관리자 `템플릿·레이아웃 관리` 안에서 다음 두 하위 화면을 명확히 분리한다.

#### 컴포넌트 관리

- 목록: `컴포넌트 식별자 | 이름 | 버전 | 상태 | 사용 중 템플릿 | 최종 수정`
- 상세: 이름, 설명, 항목 구성, 잠금, AI 디자인 정책, 이미지 제약
- 버전 작업: 초안 생성, 저장, 활성화, 보관
- 사용처 패널: 템플릿 이름·버전·상태 목록

#### 템플릿 관리

- 신규 템플릿 생성과 기본 템플릿 지정
- active 컴포넌트 선택기
- 조립 목록: 순서, 필수, 노출, 고정 위치, 사용자 순서 변경
- 템플릿 레이아웃 편집
- 컴포넌트 정의는 읽기 전용 요약으로만 표시

### 8.2 UX 안전장치

- 사용처가 있는 컴포넌트의 새 버전 활성화 전에 영향 템플릿 수를 표시한다.
- “템플릿에서 제거”와 “컴포넌트 보관”을 별도 버튼·문구로 구분한다.
- active 컴포넌트 직접 편집 대신 “새 초안 만들기”를 제공한다.
- 저장 성공·실패를 명시적인 메시지로 표시한다.
- 관리자 입력 문구와 시스템 메시지를 구분한다.

### 8.3 CSS와 i18n

- 공통 UI는 `app-shell.css`, `app-components.css`와 공통 디자인 토큰을 사용한다.
- 페이지 CSS는 공통 `:root` 토큰을 참조하며 신규 색상·간격 값을 하드코딩하지 않는다.
- Visual Editor가 생성하는 프로모션 템플릿 CSS는 관리자 App UI CSS와 분리한다.
- 모든 신규 관리자 노출 문구는 locale DB 메시지 키로 등록한다.
- 한국어/영어 활성 메시지와 JSON fallback을 함께 갱신한다.
- Create Promo 사용자가 입력한 프로모션 콘텐츠는 번역 키로 변환하지 않고 입력값 그대로 렌더링한다.

## 9. 신규 기본 데이터 설계

reset 전에 다음 시드 명세를 코드 리뷰 가능한 JSON 또는 JS 상수로 먼저 작성한다.

### 9.1 컴포넌트 시드 필수 항목

- `componentKey`
- 이름·설명 메시지 또는 관리자 표시값
- active 버전과 변경 사유
- 항목 목록과 안정적인 `itemKey`
- 항목 종류, 필수·노출·잠금 정책
- 이미지 입력 허용 source와 이미지 제약
- `aiDesign.enabled`
- `allowedLayoutVariants`
- `imageTargetItemKeys`

### 9.2 템플릿 시드 필수 항목

- `templateKey`, 이름, 설명
- 기본 템플릿 여부
- 참조할 `componentKey` 목록
- 각 참조의 순서·필수·노출·고정 위치·사용자 순서 변경
- 레이아웃 revision과 레이아웃 스펙

### 9.3 시드 검증 규칙

- `componentKey`, `itemKey`, `templateKey`는 실행마다 동일해야 한다.
- 템플릿이 참조하는 모든 컴포넌트에 active 버전이 있어야 한다.
- `imageTargetItemKeys`는 해당 컴포넌트의 image 항목에만 연결할 수 있다.
- 기본 active 템플릿은 정확히 1개여야 한다.
- 최소 1개 이상의 visible 섹션이 있어야 한다.
- 레이아웃의 section/item key가 컴포넌트 정의와 일치해야 한다.

## 10. 단계별 구현·배포 계획

### Phase 0 — 기준선, 영향 조사, 백업 설계

1. 현재 전체 검사·테스트 결과를 기록한다.
2. 관련 테이블의 FK, trigger, function, view와 행 수를 읽기 전용으로 조사한다.
3. `promo_section_design_runs` 등 템플릿 삭제 cascade 대상과 처리 중 run 수를 조사한다.
4. 기존 생성 완료 프로모션과 섹션 AI run의 스냅샷 완결성을 검증한다.
5. 관리자 설정 export/restore 스크립트를 작성하고 Preview DB에서 복원한다.
6. 관리자, Wizard, Create Promo, Visual Editor 기준 화면을 확보한다.

완료 기준:

- 삭제 대상/보존 대상 테이블이 확정됨
- 스냅샷만으로 기존 프로모션 렌더 가능
- 템플릿을 삭제해도 과거 섹션 AI run이 보존되는 FK 전환안 확정
- 백업 복원 리허설 성공
- 현재 전체 테스트 통과

### Phase 1 — 테스트 안전망과 신규 시드 명세

1. 템플릿 resolver HTTP/계약 테스트를 추가한다.
2. 컴포넌트 버전 전환, clone, 조립 API 테스트를 추가한다.
3. Wizard/Create Promo 브라우저 smoke test를 추가한다.
4. 신규 기본 컴포넌트·템플릿 시드 명세를 작성한다.
5. 기존 결과 프로모션 회귀 표본을 고정한다.

완료 기준:

- resolver의 floating 전파 테스트 존재
- 템플릿 clone 비복제 테스트 존재
- 신규 시드 정적 무결성 검사 통과
- 최소 핵심 브라우저 흐름 자동 검증 가능

### Phase 2 — Expand 스키마와 신규 서비스 계층

1. 안정 컴포넌트 테이블과 nullable `component_id`를 추가한다.
2. 섹션 AI run에 템플릿 키 스냅샷을 추가하고 템플릿 FK를 `ON DELETE SET NULL`로 전환한다.
3. 컴포넌트 관리 API를 구현한다.
4. 템플릿 조립 API에서 정의 수정과 copy-on-write를 제거한다.
5. resolver를 `component_id + active version` 우선으로 변경한다.
6. legacy 데이터는 reset 전까지만 fallback으로 읽는다.

완료 기준:

- 기존 설정을 삭제하지 않은 상태에서 배포 가능
- 신규 컴포넌트 CRUD와 버전 활성화 정상
- floating 참조 정상
- 기존 템플릿 삭제 시 완료된 섹션 AI run과 결과 스냅샷 보존
- legacy 경로 회귀 없음

### Phase 3 — 관리자 UI 분리

1. 컴포넌트 관리 화면을 신규 API에 연결한다.
2. 템플릿 화면을 참조·조립 전용으로 변경한다.
3. 사용처와 영향 범위 경고를 구현한다.
4. 공통 CSS와 DB i18n을 적용한다.

완료 기준:

- 컴포넌트 정의 편집과 템플릿 인스턴스 편집 경계가 UI/API 모두에서 일치
- 관리자 노출 신규 하드코딩 문구 0건
- 저장 성공·실패 상태 확인 가능

### Phase 4 — Preview 설정 초기화와 신규 시드

1. Preview DB 백업을 생성한다.
2. dry-run으로 삭제 예상 행 수와 FK 영향을 확인한다.
3. reset + seed 트랜잭션을 실행한다.
4. 관리자 CRUD, 기본 템플릿, Wizard, Create Promo, AI 디자인을 검증한다.
5. 기존 생성 완료 프로모션 표본을 재검증한다.
6. rollback을 실제 수행하고 다시 reset + seed하여 반복 가능성을 검증한다.

완료 기준:

- Preview에서 신규 설정만 존재
- rollback/재실행 성공
- 전체 자동 테스트와 브라우저 smoke 통과
- 기존 결과 프로모션 손상 없음

### Phase 5 — Production 초기화와 전환

1. 배포 버전과 DB 대상 환경을 재확인한다.
2. Production 설정 데이터를 백업한다.
3. 유지보수 시간에 reset + seed 트랜잭션을 실행한다.
4. 기본 템플릿 public API와 관리자 화면을 즉시 확인한다.
5. Wizard/Create Promo 생성 및 AI 디자인 대표 흐름을 확인한다.
6. 오류 발생 시 신규 쓰기를 중단하고 백업으로 복구한다.

완료 기준:

- Production 신규 기본 템플릿 정상 노출
- 관리자 수정값이 Create Promo에 반영
- 기존 결과 프로모션 정상 렌더
- 치명 오류와 orphan 참조 0건

### Phase 6 — Contract 강화와 레거시 제거

1. `component_id` NOT NULL과 FK 제약을 강화한다.
2. `owner_form_template_id`, 연결 테이블의 `section_id`/legacy `section_key`를 제거한다.
3. 소유 기반 함수·트리거·인덱스·audit 분기를 제거한다.
4. legacy resolver fallback과 비활성 구형 라이브러리 코드를 제거한다.
5. 중복 인스턴스 컬럼 사용처가 0이면 제거한다.

완료 기준:

- 소유/copy-on-write/legacy fallback 코드 검색 결과 0건
- 삭제된 컬럼을 참조하는 SQL·테스트 0건
- 전체 검사·테스트·브라우저 회귀 통과

## 11. 파일별 예상 변경 범위

| 파일/영역 | 변경 | 핵심 내용 |
|---|---|---|
| `db/migrations/<next>_section_component_registry.sql` | 신규 | 안정 컴포넌트 ID, nullable 참조, 인덱스 |
| `db/migrations/<next>_section_component_contract.sql` | 신규 | NOT NULL, legacy FK/컬럼 제거 |
| `db/seeds/<next>_seed_section_components.sql` 또는 생성 스크립트 | 신규 | 신규 컴포넌트·템플릿·레이아웃 시드 |
| `scripts/` backup/reset 도구 | 신규 | dry-run, export, restore, reset 검증 |
| `api/_wizard-content-sections-store.js` | 수정 | 전역 컴포넌트 버전 저장소 |
| `api/section-component*.js` | 신규 | 컴포넌트 관리 API |
| `api/wizard-form-template-sections.js` | 수정 | copy-on-write 제거, 인스턴스 설정 전용 |
| `api/_wizard-form-templates-store.js` | 수정 | component_id 기반 active resolver |
| `api/_promo-section-design-store.js` | 수정 | nullable template FK와 template key snapshot 처리 |
| 관련 audit 함수·API | 수정 | 소유 템플릿 대신 component_id 기록 |
| `prototype/index.html`, `prototype/app.js` | 수정 | 컴포넌트 관리/템플릿 조립 UI 분리 |
| `locales/ko.json`, `locales/en.json`, locale seed | 수정 | 신규 관리자 문구 |
| 계약·HTTP·브라우저 테스트 | 신규/수정 | 경계, 전환, 회귀 검증 |

실제 구현 전 `rg`로 사용처를 다시 조사해 이 목록을 확정한다. 번들 산출물은 소스 수정 후 빌드 단계에서만 갱신한다.

## 12. 테스트 계획

### 12.1 DB·마이그레이션

- Expand/Contract 마이그레이션 idempotency
- component key 유일성
- 컴포넌트별 active 버전 1건
- 템플릿별 동일 컴포넌트 중복 참조 차단
- 참조 중 컴포넌트 삭제 차단(`ON DELETE RESTRICT`)
- 템플릿 삭제 후 완료된 `promo_section_design_runs` 행 수와 스냅샷 불변
- 처리 중 섹션 AI run 존재 시 reset 중단
- reset 예상 행 수 불일치 시 중단
- reset + seed 실패 시 전체 rollback
- export→reset→restore 데이터 동등성

### 12.2 API·계약

- 컴포넌트 draft 생성·수정·활성화·보관
- active 직접 수정 차단
- 사용처가 있는 컴포넌트 archive 차단
- 템플릿 API의 컴포넌트 정의 수정 필드 거부
- 템플릿 참조 제거 시 컴포넌트 보존
- 템플릿 clone 시 컴포넌트 행/버전/항목 수 불변
- 새 active 버전 발행 후 resolver 결과 전파
- active 미존재/복수 상태의 명시적 오류

### 12.3 브라우저·통합

- 관리자 컴포넌트 생성→항목 등록→활성화
- 템플릿 생성→컴포넌트 조립→레이아웃 저장→활성화
- 관리자 변경값의 Create Promo 반영
- Wizard 콘텐츠 입력과 줄바꿈 유지
- 섹션 AI 디자인 활성/비활성 버튼 상태
- 배경 이미지와 item 이미지 target 적용
- Visual Editor/Web Output의 스냅샷 렌더 동등성
- 기존 생성 완료 프로모션 이미지와 결과 화면 유지
- 한국어/영어 관리자 메시지 로딩과 fallback

## 13. 리스크와 대응

| 우선순위 | 리스크 | 대응 |
|---|---|---|
| P0 | 설정 초기화가 기존 생성 프로모션을 손상 | 스냅샷 완결성 게이트 통과 전 삭제 금지, 표본 회귀와 복구 리허설 |
| P0 | 템플릿 삭제 cascade로 섹션 AI run 삭제 | run FK를 사전에 `ON DELETE SET NULL`로 변경하고 템플릿 키·버전 스냅샷 보존 |
| P0 | `owner_form_template_id` cascade로 공유 컴포넌트 삭제 | 신규 데이터에는 owner를 쓰지 않고 Contract 단계에서 FK/컬럼 제거 |
| P0 | DB 초기화 중 일부만 반영 | 단일 트랜잭션, 불변 조건 검사, 실패 시 전체 rollback |
| P0 | 신규 코드보다 DB 초기화가 먼저 실행 | Expand 코드 선배포를 강제하고 실행 체크리스트에 배포 commit 기록 |
| P1 | 특정 `section_id` 고정으로 새 active 미반영 | component_id 기반 resolver와 전파 테스트 |
| P1 | 생성 완료 프로모션이 live config를 재조회 | 생성 시 완전한 스냅샷 저장, 결과 렌더에서 live 조회 금지 |
| P1 | 컴포넌트 수정이 여러 템플릿에 예기치 않게 반영 | 사용처 목록, 활성화 전 영향 확인, audit |
| P1 | 관리자 문구 하드코딩 재발 | locale 키 계약 테스트와 브라우저 fallback 테스트 |
| P2 | 구형 라이브러리와 신규 UI 중복 | 신규 UI 전환 후 사용처 확인, Phase 6에서 제거 |

## 14. 제거하거나 후속으로 미룰 요소

추가 검토 결과 다음 요소는 현재 결정에서 불필요하거나 v1 범위를 과도하게 만든다.

| 요소 | 판단 | 사유 |
|---|---|---|
| 기존 사본 차이 리포트·dedup·재연결 | 제거 | 기존 설정 전체 초기화가 허용되어 병합 가치가 없음 |
| `029_component_dedup.sql` | 제거 | reset + seed 스크립트로 대체 |
| `pinned_version` | 후속 | floating 단일 계약으로 먼저 안정화하며 현재 고정 요구가 없음 |
| 항목 독립 라이브러리 | 후속 | 섹션 합성 경계를 복잡하게 하고 현재 요구 범위를 넘음 |
| 장기 legacy resolver fallback | 제거 | reset 직전의 짧은 전환 기간에만 사용 후 삭제 |
| `owner_form_template_id` 출처 메타 유지 | 제거 | cascade 위험과 모델 혼선을 남기므로 최종 삭제 |
| 기존 비활성 UI의 무조건 재사용 | 재검토 | 소유 모델에 결합된 상태일 수 있어 신규 계약에 맞는 부분만 사용 |
| 사용 중 컴포넌트 강제 archive | 제거 | 대체 active가 없는 상태에서 참조를 깨뜨릴 수 있음 |
| clone 로직 전면 재작성 | 축소 | 현재 DB clone은 이미 참조 행만 복사하므로 신규 컬럼 대응과 회귀 검증만 필요 |

## 15. Definition of Done

다음 조건을 모두 만족해야 완료다.

1. 컴포넌트가 템플릿과 독립된 안정 ID를 갖는다.
2. 컴포넌트 정의와 템플릿 인스턴스 설정의 source of truth가 명확하다.
3. 템플릿은 `component_id`를 참조하고 resolver는 active 버전을 floating 방식으로 해석한다.
4. 템플릿 편집 API는 컴포넌트 정의를 수정하거나 복제하지 않는다.
5. 템플릿 clone 전후 컴포넌트·버전·항목 행 수가 증가하지 않는다.
6. 신규 기본 컴포넌트·템플릿·레이아웃 시드가 반복 가능하고 검증 가능하다.
7. 기존 관리자 설정 초기화 전에 백업·복구와 스냅샷 독립성이 검증된다.
8. 기존 생성 완료 프로모션, 콘텐츠, AI 이미지와 결과 화면이 유지된다.
9. 기존 완료·적용·실패·취소된 섹션 AI run과 스냅샷이 템플릿 초기화 후에도 유지된다.
10. 관리자 수정값이 Wizard/Create Promo에 반영된다.
11. `owner_form_template_id`, 특정 버전 `section_id`, copy-on-write 기반 경로가 제거된다.
12. 신규 관리자 노출 하드코딩 문구가 0건이다.
13. 전체 정적 검사, 자동 테스트, 핵심 브라우저 회귀가 통과한다.

## 16. 착수 전 최종 확인 사항

다음은 구현 전에 코드와 데이터로 확정하되, 별도 제품 의사결정이 필요한 항목은 아니다.

- 실제 다음 마이그레이션 번호
- 초기화 대상 테이블의 Production 행 수와 FK 영향
- 기존 생성 완료 프로모션 스냅샷의 완결성
- `promo_section_design_runs`의 처리 중 상태 0건 확인과 과거 run 조회 계약
- 신규 기본 컴포넌트와 기본 템플릿의 구체적인 시드 명세
- 운영 이력·감사 로그의 보존 기간과 export 위치
- Production 초기화 유지보수 시간과 롤백 담당자

## 17. 실행 금지 조건

이 문서는 개발계획서이며 데이터 삭제를 승인하는 실행 명령이 아니다. 다음 중 하나라도 해당하면 Production 초기화를 중단한다.

- 백업 파일이 없거나 복원 검증을 하지 않음
- 기존 프로모션이 live 템플릿/섹션 데이터를 참조함
- `promo_section_design_runs.form_template_id`가 여전히 `ON DELETE CASCADE`이거나 처리 중 run이 존재함
- 신규 코드가 아직 배포되지 않음
- Preview reset + seed 및 rollback 검증이 실패함
- 삭제 예상 행 수와 실제 행 수가 다름
- 신규 기본 active 템플릿 또는 active 컴포넌트 검증이 실패함
- 전체 테스트 또는 핵심 브라우저 회귀가 실패함
