# PRD: Wizard Content Section 관리자 설정 기능

- 문서 유형: PRD (기획 단계, 소스코드 미수정)
- 작성: Claude
- 작성일: 2026-07-14
- 관련 선행 자료: `docs/default-temp-b-section-schema.json`, `docs/b-section-usage-guide.md`, `prototype/promo-wizard.js`, `docs/claude/review-promo-wizard-frontend-source-2026-07-14.md`

## 1. 배경

현재 Promo Wizard(Step 2: Promo Content Input)의 입력 섹션은 `prototype/promo-wizard.js`의 `defaultSectionInputs()`에 `header / heroBanner / stepBar / contentCta / imageTextRow / titleDescription / footer` 7개로 하드코딩되어 있다. 섹션 구성과 필드 구성을 바꾸려면 코드를 직접 수정해야 하고, 마케팅/운영 담당자가 직접 조정할 수 없다.

`docs/default-temp-b-section-schema.json`은 이미 섹션/아이템 단위의 유사한 데이터 모델(섹션 노출여부, 순서변경 가능 여부, 아이템 필수여부, 아이템별 이미지 프롬프트 반영 여부 등)을 정의해두었지만, 이는 정적 참고 문서일 뿐 DB·API·관리자 UI로 구현되어 있지 않다.

이 PRD는 사용자가 요청한 "관리자 페이지에서 Wizard Step 2의 섹션/섹션 아이템을 직접 생성·수정·삭제하고, 그 결과가 Wizard 화면에 그대로 반영되는 기능"을 정의한다.

## 2. 목표

- 관리자가 코드 수정 없이 Wizard Step 2에 노출되는 섹션과 섹션 내 입력 항목을 구성할 수 있게 한다.
- 섹션/아이템 단위로 필수 여부, 노출 여부, 순서를 관리자가 직접 통제할 수 있게 한다.
- 특정 텍스트/이미지 값을 관리자가 미리 고정(lock)해서, 최종 사용자가 수정하지 못하지만 화면에는 노출되게 할 수 있다.
- 기존 7개 섹션(Template 4 기준)을 초기 데이터로 이관하여 마이그레이션 시 기능 단절이 없게 한다.

## 3. 범위

### In Scope
- 관리자 페이지: 섹션 CRUD, 섹션 아이템 CRUD.
- Wizard Step 2: 하드코딩된 섹션 렌더링을 관리자 설정 기반 동적 렌더링으로 전환.
- 콘텐츠 커버리지 체크리스트(현재 `content-coverage-panel`)를 동적 필수 항목 기준으로 재계산.
- `buildWizardPayload()`가 생성하는 payload를 동적 섹션 구조에 맞게 재구성.

### Out of Scope (이번 PRD에서 다루지 않음)
- Step 1(Design Concept), Step 3(LO-FI), Step 4(Final Design)의 UI/로직 변경.
- 레거시 `prototype/index.html`/`app.js` 기반 Promo Builder(Vue)의 B섹션 입력 UI 변경. 단, 관리자 CRUD 화면은 이 Vue 앱(관리자 페이지, `currentView === 'prompts'`) 안에 추가하는 것을 전제로 한다.
- n8n 워크플로우 자체의 노드 구조 변경(연동 API 계약은 유지, 실제 워크플로우 반영은 별도 논의 필요).
- 다국어(i18n) 지원.

## 4. 사용자 정의

- **관리자(Admin)**: 관리자 페이지에서 섹션/섹션 아이템을 구성하는 운영자.
- **Wizard 사용자(End user)**: Promo Wizard에서 프로모션 콘텐츠를 입력하는 사용자(현재 promo-wizard.js 사용자와 동일).

## 5. 기능 요구사항

### 5.1 섹션(Section) 관리 — 관리자 페이지

| 항목 | 요구사항 |
|---|---|
| 생성/삭제/수정 | 섹션 CRUD 제공. 삭제 시 하위 섹션 아이템도 함께 제거되거나(하드 삭제), 비활성화 처리(소프트 삭제) 중 정책 결정 필요(§8 참고). |
| ID 부여 | 섹션 생성 시 시스템이 고유 ID(`section_id`, UUID)를 자동 부여. 별도로 화면/코드에서 참조할 `key`(예: `heroBanner`)는 관리자가 입력하거나 이름 기반 slug로 자동 생성. |
| 필수 값 설정 (Y/N) | 섹션 자체가 Wizard에서 필수 섹션인지 여부. Y인 경우 콘텐츠 커버리지 체크리스트에 반영되고, 하위 아이템 중 하나 이상 필수값이 채워지지 않으면 "Required content missing" 처리. |
| 섹션 이름 | 관리자가 보는 이름(예: "Hero Banner"). 기존 정책대로 이 이름은 최종 이미지 프롬프트에 노출되지 않는 내부 라벨로 유지. |
| 섹션 설명 | 관리자 화면에서만 보이는 간략 설명(예: "프로모션 메인 배너 영역"). |
| 순서변경 가능 여부 (Y/N) | 이 섹션의 표시 순서를 관리자가 드래그 등으로 바꿀 수 있는지 여부. 기존 스키마의 `orderChangeAllowed`와 동일 개념. N인 섹션(예: Header/Footer)은 `fixedPosition`(top/bottom)으로 고정. |
| 실제 순서 값 | 순서변경 가능 섹션들 사이의 상대 순서(정수 `sort_order`)를 저장. |
| Wizard 노출 여부 (Y/N) | Y면 Wizard Step 2에 섹션이 표시되고, N이면 관리자 화면에는 남아있지만 Wizard에는 표시되지 않음(완전 삭제와 구분). |

### 5.2 섹션 아이템(Section Item) 관리 — 관리자 페이지

| 항목 | 요구사항 |
|---|---|
| 소속 섹션 | 섹션 아이템은 반드시 기존 섹션에 속함. 섹션이 먼저 생성되어 있어야 하위 아이템 생성 가능. |
| 생성/삭제/수정 | 아이템 CRUD 제공. |
| 아이템 이름 | 관리자가 보는 아이템 라벨(예: "Title", "Button"). |
| 아이템 노출 여부 (Y/N) | Y면 해당 아이템이 Wizard의 섹션 안에 입력 필드로 표시, N이면 미표시. |
| 텍스트 타입 | 텍스트 계열 아이템은 3종 중 하나를 선택: `Title`(한 줄 제목), `remark`(짧은 참고/보조 문구), `Multi`(여러 줄 설명, textarea). 타입에 따라 Wizard에서 input/textarea 렌더링이 결정됨. |
| 이미지 여부 (Y/N) | Y로 설정 시, 이미지 소스를 `파일첨부` / `URL첨부` / `AI 생성` 중 관리자가 허용할 항목을 하나 이상 선택. Wizard 사용자는 관리자가 허용한 소스 중에서만 선택 가능(허용 소스가 1개면 선택 UI 없이 해당 방식 고정). |
| 이미지 보조 필드 | 이미지 아이템은 AI 생성/설명 텍스트(이미지 프롬프트용 문구, 기존 `imageText`/`Image Prompt Text`에 대응)를 추가로 입력받을 수 있어야 함(§8 결정 필요 항목). |
| 내용 고정 기능 | 관리자가 텍스트 또는 이미지 값을 직접 입력하고 "고정(locked)" 처리 가능. 고정된 아이템은 Wizard에 노출은 되지만 최종 사용자가 값을 수정할 수 없음(읽기 전용 표시). |
| CTA(버튼) | 아이템 타입을 `cta`로 지정 시: 버튼 이름(label), 버튼 URL, GA UTM 파라미터(source/medium/campaign/content/term 또는 raw UTM 문자열)를 입력받는 하위 필드 세트 제공. |
| 필수 값 (Y/N) | 아이템 단위 필수 여부(기존 `required`와 동일). Step 2 콘텐츠 커버리지 체크리스트 판정에 사용. |
| 순서 | 같은 섹션 내 아이템 표시 순서(정수 `sort_order`). |

### 5.3 Wizard 렌더링(동적 적용)

- Wizard Step 2는 페이지 로드 시 관리자 설정을 API로 조회하여, `Wizard 노출 여부 = Y`인 섹션을 `sort_order` 순서(Header/Footer는 고정 위치)로 렌더링한다.
- 각 섹션 내부는 `Wizard 노출 여부 = Y`인 아이템만, 아이템 `sort_order` 순서로 렌더링한다.
- 아이템 타입(`Title`/`remark`/`Multi`/이미지/CTA)에 따라 기존 `createSectionField()`에 대응하는 동적 입력 컴포넌트를 생성한다.
- `내용 고정` 아이템은 값이 채워진 상태로 표시되고 입력 요소는 비활성화(disabled/readonly) 처리한다.
- 콘텐츠 커버리지 패널(`content-coverage-panel`)은 하드코딩된 11개 항목 대신, 필수(Y)로 설정된 섹션/아이템 목록을 순회하며 동적으로 구성한다.
- `buildWizardPayload()`는 고정된 `heroBanner.title` 같은 키 참조 대신, 동적 섹션/아이템 구조를 순회하여 payload를 구성하도록 재작성한다.

## 6. 데이터 모델 (제안)

기존 `worker_webhook_settings`/`worker_webhook_setting_histories`(설정 테이블 + 변경이력 테이블) 패턴을 따른다. 아래는 방향성 제안이며, 실제 컬럼/제약조건은 구현 설계 단계에서 확정한다.

```sql
-- 제안 초안, 실제 적용 아님
create table wizard_content_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,       -- 예: heroBanner (코드/payload 참조용)
  name text not null,                     -- 관리자 표시 이름
  description text not null default '',
  is_required boolean not null default false,
  order_change_allowed boolean not null default true,
  fixed_position text,                    -- 'top' | 'bottom' | null
  sort_order integer not null default 0,
  is_visible_in_wizard boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table wizard_content_section_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references wizard_content_sections(id) on delete cascade,
  item_key text not null,                 -- 섹션 내 고유 키
  name text not null,
  is_visible_in_wizard boolean not null default true,
  is_required boolean not null default false,
  sort_order integer not null default 0,
  field_kind text not null,               -- 'text' | 'image' | 'cta'
  text_type text,                         -- 'title' | 'remark' | 'multi' (field_kind='text'일 때)
  image_allowed_sources text[],           -- ('file','url','ai') 중 허용 값 (field_kind='image'일 때)
  cta_utm jsonb,                          -- {source, medium, campaign, content, term} (field_kind='cta'일 때)
  is_locked boolean not null default false,
  locked_value jsonb,                     -- 고정된 텍스트/이미지 값
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, item_key)
);

create table wizard_content_section_histories (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,              -- 'section' | 'item'
  entity_id uuid not null,
  change_note text not null default '',
  previous_state jsonb,
  new_state jsonb,
  changed_at timestamptz not null default now()
);
```

## 7. API 설계 (제안)

기존 `api/prompt-template*.js`, `api/promo-generation-worker-settings.js` 패턴을 따른다.

- `GET /api/wizard-content-sections` — 전체 섹션+아이템 조회(관리자 화면용, 비노출 섹션 포함).
- `POST /api/wizard-content-sections` — 섹션 생성/수정(하나의 엔드포인트에서 id 유무로 분기, 기존 `prompt-template.js` 패턴 참고).
- `DELETE /api/wizard-content-sections?id=` — 섹션 삭제(또는 `is_visible_in_wizard=false` 소프트 삭제, §8 결정 필요).
- `POST /api/wizard-content-section-items` — 아이템 생성/수정.
- `DELETE /api/wizard-content-section-items?id=` — 아이템 삭제.
- `GET /api/wizard-content-sections/public` — Wizard 화면용 조회. `is_visible_in_wizard=true`인 섹션/아이템만 반환(내부 관리 필드는 최소화하여 응답).

모든 쓰기 API는 기존 패턴대로 변경 이력을 `wizard_content_section_histories`에 기록한다.

## 8. 결정이 필요한 사항 (Open Questions)

1. **섹션/아이템 삭제 정책**: 하드 삭제 허용 여부, 아니면 소프트 삭제(비노출 처리)만 허용할지. 이미 Wizard 진행 중인 run이 참조하는 섹션 구조가 삭제되면 과거 payload 재현이 어려워질 수 있음.
2. **이미지 아이템의 "필드 추가" 의미**: 사용자 요청의 "필드 추가" 항목이 구체적으로 어떤 부가 필드를 의미하는지 확인 필요(예: alt 텍스트, AI 생성용 프롬프트 문구, 이미지 크기/비율 제약 등). 본 PRD는 임시로 "AI 생성/설명 텍스트" 필드로 가정함.
3. **GA UTM 입력 형태**: 구조화된 5개 필드(source/medium/campaign/content/term)로 받을지, 완성된 URL 쿼리스트링 하나로 받을지.
4. **버전/이력 관리 범위**: `prompt_templates`처럼 활성/비활성 버전 관리까지 필요한지, 아니면 단순 현재값 CRUD로 충분한지.
5. **레거시 Promo Builder(app.js) 반영 여부**: 이번 PRD는 Standalone Promo Wizard(`promo-wizard.js`) 기준이다. 레거시 `index.html`/`app.js`의 B섹션 입력 UI에도 동일 기능을 적용할지 여부는 별도 결정 필요.

## 9. 리스크 및 의존성

- **`api/_promo-markdown-builders.js` 하드코딩**: 303~361줄 부근에 섹션 키/라벨/내부 카테고리(`primary_offer`, `participation_steps` 등)가 고정 lookup table로 존재한다. 관리자가 완전히 새로운 섹션(Template 4의 7개 외 섹션)을 만들 경우, 이 파일도 DB 기반 동적 조회로 바꾸지 않으면 Wizard 화면에는 보이되 LLM 프롬프트/브리프에는 반영되지 않는 불일치가 발생한다.
- **Wizard 렌더링 버그 재발 방지**: `docs/claude/review-promo-wizard-frontend-source-2026-07-14.md`에서 지적한 대로, 현재 `createField()`는 입력 시마다 `renderStep()` 전체를 재실행해 포커스를 잃는 버그가 있다. 새로 만드는 동적 렌더러는 이 패턴(매 keystroke마다 전체 DOM 재생성)을 피해야 한다.
- **기존 하드코딩 구조와의 하위 호환**: 기존 7개 섹션을 초기 시드 데이터로 그대로 이관해야, 기존 진행 중인 run/localStorage에 저장된 `sectionInputs` 구조와 충돌하지 않는다.

## 10. 단계별 진행 제안

1. **Phase A — 데이터 모델 확정 및 마이그레이션**: §8 open question 확정 후 DB 스키마 확정, 기존 7개 섹션을 시드 데이터로 이관.
2. **Phase B — 관리자 CRUD API + UI**: 섹션/아이템 CRUD API 구현, 관리자 페이지(Vue, `currentView === 'prompts'`)에 "C. Wizard Content Sections 관리" 서브섹션 추가.
3. **Phase C — Wizard 동적 렌더링 전환**: `promo-wizard.js`의 `renderContentStep()`/`buildWizardPayload()`를 동적 구조 기반으로 재작성, 콘텐츠 커버리지 체크리스트 동적화.
4. **Phase D — 백엔드 프롬프트 빌더 연동**: `api/_promo-markdown-builders.js`를 DB 기반 섹션 조회로 전환하여 신규 섹션도 LLM 브리프/프롬프트에 반영.
5. **Phase E — QA**: 기존 7개 섹션 마이그레이션 후 기존 시나리오(LO-FI/Final Design 생성) 회귀 검증, 신규 섹션 추가 시나리오 검증.
