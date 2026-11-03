# Admin 템플릿 기본 레이아웃 및 Wizard 실행별 편집 개발계획서

- 작성일: 2026-07-17
- 대상 프로젝트: promo_web_builder
- 상태: 개발 착수 전 계획 확정
- 기준 브랜치: main
- 기준 화면:
  - Admin: /prototype/index.html?view=admin
  - Wizard: /prototype/promo-wizard.html
  - Visual Editor: /prototype/visual-editor.html
- 핵심 목표: 관리자가 템플릿별 기본 레이아웃을 설정하고, Wizard 사용자는 해당 기본 레이아웃에서 프로모션별 콘텐츠와 레이아웃을 변경할 수 있게 한다.

## 1. 배경

현재 Admin의 폼 템플릿 관리는 Wizard Step 2에서 입력받을 Section과 Item의 구성에 집중돼 있다.

관리자가 설정할 수 있는 항목:

- 템플릿 이름, 설명, 버전, 기본 템플릿 여부
- Draft, Active, Inactive, Archived 상태
- Section 추가, 삭제, 순서, 노출, 필수 여부와 고정 위치
- Item 종류, 이름, 순서, 노출, 필수, 잠금과 이미지·CTA 정책

현재 설정할 수 없는 항목:

- Section 기본 높이
- Item의 기본 X/Y 위치
- 글자 크기, 굵기, 색상과 정렬
- 이미지 및 CTA의 기본 위치
- 페이지 배경색, 배경 이미지와 Accent 색상
- 콘텐츠 기본 폭
- Desktop과 Mobile 기본 배치

이 때문에 Wizard에서 템플릿을 선택해도 템플릿별 시각 형식이 없이 일반 입력 항목이 나열된다. 템플릿 간 차이가 Section과 Item 구성에만 존재하고 실제 프로모션 페이지의 시작 레이아웃에는 반영되지 않는다.

Visual Editor에는 Section 높이, Item 자유 배치와 기본 디자인 편집 기능이 이미 있으나 결과가 브라우저 localStorage Snapshot에만 저장된다. Admin 템플릿과 Wizard 실행에는 연결돼 있지 않다.

## 2. 목표

목표 데이터 흐름은 다음과 같다.

~~~text
Admin
  └─ Form Template Draft 생성
       ├─ Section/Item 구성
       └─ 기본 Layout 편집
             ↓
       검증 후 Template 활성화
             ↓
Wizard
  └─ 활성 Template + 기본 Layout 로드
       ├─ 콘텐츠 입력
       ├─ 위치·스타일 변경
       └─ 관리자 기본값으로 초기화
             ↓
       실행별 Layout Override 저장
             ↓
       Generation Run Snapshot 고정
             ↓
       동일 Renderer로 Preview/Web Output
~~~

핵심 원칙:

1. Admin은 재사용 가능한 기본 레이아웃의 Source of Truth다.
2. Wizard는 기본 레이아웃을 시작점으로 사용하고 실행별로 변경할 수 있다.
3. Wizard 변경값은 Admin 템플릿에 역반영하지 않는다.
4. 실행 시작 시 Template, Layout과 Renderer 버전을 Snapshot으로 고정한다.
5. Admin, Wizard Preview와 Web Output은 동일 Renderer를 사용한다.

## 3. 제외 범위

이번 범위에서는 다음 기능을 구현하지 않는다.

- 여러 Renderer를 관리하는 완전한 Renderer Registry
- 템플릿당 여러 기본 Layout Variant
- LLM Vue 코드 생성
- AI Layout 자동 생성
- Sandbox Build
- CMS Publish
- 사용자별 Layout 공유와 Template 승격
- 실시간 공동 편집

초기 구현은 다음으로 제한한다.

~~~text
Default Renderer 1개
+ Form Template 버전별 기본 Layout 1개
+ Wizard Run별 Layout Override 1개
~~~

## 4. 용어와 데이터 소유권

### 4.1 Form Template

어떤 콘텐츠를 입력받을지 정의한다.

- Section
- Item
- Field Kind
- 필수·표시·잠금
- 입력 순서와 고정 정책

### 4.2 Default Template Layout

Admin이 템플릿 Draft에 설정하는 재사용 가능한 기본 레이아웃이다.

- Theme
- Responsive 기준
- Section 기본 높이
- Item 기본 좌표와 스타일

Form Template 버전과 함께 활성화된다.

### 4.3 Wizard Layout Override

Wizard 사용자가 특정 프로모션 실행에서 변경한 값이다.

- Item 이동
- Section 높이
- Text Style
- 배경과 이미지

Admin 기본 Layout을 변경하지 않는다.

### 4.4 Resolved Layout

실제 Renderer에 전달되는 최종 Layout이다.

~~~text
Renderer Default
  → Admin Default Template Layout
  → Wizard Layout Override
  → Resolved Layout Snapshot
~~~

### 4.5 Layout Revision

Admin 기본 Layout 변경을 식별하는 불변 Revision이다. Wizard Run에는 Template Version, configRevision과 함께 저장한다.

## 5. 핵심 설계 결정

### 5.1 Form Template과 Layout 저장 분리

Layout은 같은 Admin 화면에서 관리하지만 wizard_form_templates의 단일 JSON 컬럼으로 직접 섞지 않는다.

분리 이유:

- 콘텐츠 정의와 시각 정의의 변경 주기가 다르다.
- Layout 검증과 History가 별도로 필요하다.
- 향후 여러 Layout Variant와 Renderer로 확장할 수 있다.
- 템플릿 복제와 활성화 시 Layout Snapshot을 명확하게 처리할 수 있다.

### 5.2 템플릿 버전별 기본 Layout 하나

wizard_form_templates는 버전마다 별도 Row를 사용한다. 기본 Layout도 해당 form_template_id에 1:1로 연결한다.

Active Template의 Layout은 읽기 전용이다. 변경하려면 새 Template Draft를 만든 뒤 Layout을 편집하고 함께 활성화한다.

### 5.3 Wizard는 Override만 편집

Wizard가 기본 Layout 전체를 직접 수정하는 방식 대신 실행별 Override를 관리한다.

장점:

- 관리자 기본값으로 초기화하기 쉽다.
- 변경 항목만 로그에 남길 수 있다.
- Admin Layout이 변경돼도 기존 Run Snapshot을 재현할 수 있다.
- 기본 Layout과 사용자 변경을 비교할 수 있다.

### 5.4 동일 Renderer 재사용

Admin Layout Editor, Wizard Preview와 Web Output에서 PromoPageRenderer를 공유한다.

복제 Renderer나 별도 CSS 구현을 만들지 않는다.

## 6. 안정적인 Layout 식별자

### 6.1 현재 문제

현재 Visual Editor Item Style Key는 다음 형식이다.

~~~text
sectionKey.itemKey
~~~

Admin에서 활성 Section을 Draft로 복제할 때 Section Key와 Section ID가 변경될 수 있다. Item 편집·복제 과정에서도 Item ID가 변경된다. 기존 Key나 DB ID를 그대로 Layout 식별자로 사용하면 저장된 좌표가 끊길 수 있다.

### 6.2 권장 해결

콘텐츠 경로와 Layout 경로를 분리한다.

- sectionKey/itemKey: Wizard 콘텐츠 입력 경로
- layoutKey: Layout Style 연결용 불변 Key

권장 필드:

- wizard_form_template_sections.layout_key
- wizard_content_section_items.layout_key

규칙:

1. 최초 생성 시 기존 sectionKey/itemKey를 기본 layoutKey로 사용한다.
2. Draft 복제 시 layoutKey는 유지한다.
3. Section/Item 이름이나 콘텐츠 Key가 변경돼도 layoutKey는 변경하지 않는다.
4. 같은 Template 안에서 Section layoutKey는 유일해야 한다.
5. 같은 Section 안에서 Item layoutKey는 유일해야 한다.

Layout Style Key:

~~~text
section:{sectionLayoutKey}
item:{sectionLayoutKey}.{itemLayoutKey}
~~~

Renderer Snapshot에는 콘텐츠 Key와 Layout Key를 모두 포함한다.

## 7. 데이터 모델

### 7.1 Migration 023: 기본 Layout

예상 파일:

- db/migrations/023_wizard_form_template_layouts.sql

권장 테이블:

~~~sql
create table wizard_form_template_layouts (
  id uuid primary key default gen_random_uuid(),
  form_template_id uuid not null
    references wizard_form_templates(id) on delete cascade,
  renderer_key text not null default 'default-promo-renderer',
  renderer_version integer not null default 1,
  contract_version integer not null default 1,
  layout_revision integer not null default 1,
  layout_spec jsonb not null default '{}'::jsonb,
  validation_result jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wizard_form_template_layouts_template_uidx
    unique(form_template_id)
);
~~~

추가 Index:

- form_template_id
- renderer_key, renderer_version
- updated_at desc

### 7.2 Admin Layout History

예상 테이블:

~~~sql
create table wizard_form_template_layout_histories (
  id uuid primary key default gen_random_uuid(),
  form_template_id uuid references wizard_form_templates(id) on delete set null,
  template_key text not null default '',
  template_version integer,
  layout_id uuid,
  previous_revision integer,
  new_revision integer,
  action text not null,
  previous_spec jsonb,
  new_spec jsonb,
  validation_result jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  created_at timestamptz not null default now()
);
~~~

Admin Layout History는 Wizard 사용 로그와 분리한다.

### 7.3 Migration 024: Run Layout Snapshot

예상 파일:

- db/migrations/024_promo_generation_layout_snapshots.sql

권장 테이블:

~~~sql
create table promo_generation_layout_snapshots (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null
    references promo_generation_runs(id) on delete cascade,
  form_template_id uuid
    references wizard_form_templates(id) on delete set null,
  template_key text not null default '',
  template_version integer,
  config_revision text not null default '',
  layout_id uuid,
  layout_revision integer,
  renderer_key text not null default 'default-promo-renderer',
  renderer_version integer not null default 1,
  contract_version integer not null default 1,
  base_layout_spec jsonb not null default '{}'::jsonb,
  user_overrides jsonb not null default '{}'::jsonb,
  resolved_layout_spec jsonb not null default '{}'::jsonb,
  resolved_layout_hash text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promo_generation_layout_snapshots_run_uidx unique(run_id)
);
~~~

### 7.4 Wizard Layout Event Log

권장 테이블:

~~~sql
create table wizard_layout_usage_events (
  id uuid primary key default gen_random_uuid(),
  client_event_id text,
  event_name text not null,
  session_id text not null,
  run_id uuid references promo_generation_runs(id) on delete set null,
  form_template_id uuid references wizard_form_templates(id) on delete set null,
  template_key text not null default '',
  template_version integer,
  config_revision text not null default '',
  layout_revision integer,
  target_key text not null default '',
  change_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
~~~

허용 이벤트:

- layout_loaded
- layout_load_failed
- layout_edit_started
- item_moved
- item_style_changed
- section_resized
- item_reset
- layout_reset
- layout_completed
- run_snapshot_created

드래그 중 매 Pointer Move마다 저장하지 않는다. 드래그 종료 후 최종값만 기록한다.

## 8. Layout 계약

### 8.1 Admin 기본 Layout

현재 DEFAULT_DESIGN_SPEC을 기준으로 계약을 확장한다.

~~~json
{
  "contractVersion": 1,
  "specKey": "admin-default",
  "theme": {
    "backgroundColor": "#f5f7fb",
    "backgroundImage": "",
    "backgroundImageName": "",
    "textColor": "#172033",
    "accentColor": "#156b5b",
    "fontFamily": "Inter, Pretendard, sans-serif"
  },
  "responsive": {
    "contentMaxWidth": 1440,
    "contentMinWidth": 1140,
    "mobileBreakpoint": 720
  },
  "sectionStyles": {
    "heroBanner": {
      "minHeight": 480
    }
  },
  "itemStyles": {
    "heroBanner.title": {
      "positionMode": "free",
      "xPct": 8,
      "yPx": 120,
      "fontSize": 48,
      "fontWeight": 700,
      "textAlign": "left"
    }
  }
}
~~~

구현 전 P0 계약 문서와 현재 DEFAULT_DESIGN_SPEC의 차이를 정리한다. 필요하면 contractVersion을 2로 올린다.

### 8.2 Wizard Override

Wizard는 변경된 속성만 저장한다.

~~~json
{
  "baseLayoutRevision": 3,
  "theme": {},
  "sectionStyles": {
    "heroBanner": {
      "minHeight": 560
    }
  },
  "itemStyles": {
    "heroBanner.title": {
      "positionMode": "free",
      "xPct": 12,
      "yPx": 146,
      "fontSize": 56
    }
  }
}
~~~

### 8.3 병합 규칙

순수 함수로 구현한다.

예상 파일:

- visual-editor/src/layout-utils.mjs

필수 함수:

- normalizeLayoutSpec
- validateLayoutSpec
- mergeLayoutSpec
- createLayoutOverrides
- removeLayoutOverride
- resetLayoutOverrides
- hashResolvedLayout

병합 순서:

1. Renderer Default
2. Admin Base Layout
3. Wizard User Override

Object는 깊은 병합한다. undefined는 무시하고 null 허용 여부는 Schema에서 명시한다.

## 9. Admin UX

### 9.1 템플릿 관리 진입점

Admin 폼 템플릿 상세 Header에 다음 버튼을 추가한다.

- 기본 레이아웃 설정
- 레이아웃 미리보기
- 레이아웃 검증 결과

상태별 동작:

- Draft: 편집 가능
- Active/Inactive/Archived: 읽기 전용
- Active 수정: 새 초안 만들기 후 편집

### 9.2 Layout Editor 화면

기존 Visual Editor를 Admin Layout Mode로 재사용한다.

예상 진입:

~~~text
/prototype/visual-editor.html?mode=admin-layout&templateId={id}
~~~

Admin 화면 내 새 탭 또는 같은 Origin Dialog로 열 수 있다. 초기 구현은 독립 Editor Route를 사용해 기존 CDN Vue Admin과 Vite Vue Editor의 결합 복잡도를 줄인다.

화면 구성:

~~~text
SECTIONS | DESIGN/CONTENT PLACEHOLDER | LIVE PREVIEW
~~~

관리자 편집 기능:

- Section 선택과 순서 확인
- Section 높이 변경
- Item 드래그
- Text Style 변경
- 배경색과 배경 이미지
- Item 자동 배치 복원
- 전체 기본 Layout 초기화
- Desktop/Mobile Preview
- 저장 전 검증
- 변경 사유 입력

Admin Layout Editor에서는 실제 프로모션 콘텐츠 대신 다음 순서로 Placeholder를 사용한다.

1. Item lockedValue
2. Item defaultValue
3. Item Name
4. Field Kind별 기본 Placeholder

### 9.3 저장

Draft Layout만 PATCH 가능하다.

저장 성공 시:

- layout_revision 증가
- History 저장
- validation_result 반환
- Admin 템플릿 상세의 Layout 상태 갱신

저장 실패 시:

- Editor 상태 유지
- 필드/Item별 오류 표시
- Active Layout에 영향 없음

## 10. Wizard UX

### 10.1 Step 2 화면

Wizard Step 2를 입력 패널과 Live Preview 구조로 확장한다.

~~~text
┌──────────────────┬────────────────────────────┐
│ CONTENT INPUT    │ TEMPLATE LIVE PREVIEW      │
│                  │                            │
│ Section/Item     │ Admin 기본 Layout 적용      │
│ 입력             │ 입력값 즉시 반영             │
│                  │ Item 드래그                 │
│ 디자인 설정       │ Section 높이 조절            │
└──────────────────┴────────────────────────────┘
~~~

모바일에서는 입력 패널 다음에 Preview가 표시된다.

### 10.2 Wizard 변경 가능 범위

- Section 순서
- Section 높이
- Item X/Y 위치
- Text 내용
- Text 크기, 굵기, 색상과 정렬
- CTA 내용과 URL
- 이미지 입력·교체
- 배경색과 배경 이미지
- Item 자동 배치 복원
- 전체 Admin 기본 Layout 복원

### 10.3 Admin 정책 우선

Wizard가 변경할 수 없는 항목:

- isLocked Item의 콘텐츠와 Layout
- fixedPosition Section의 순서
- userReorderAllowed가 false인 Section/Item 순서
- 필수 Section/Item 삭제 또는 숨김
- Template/Renderer Contract

초기 구현에서 Item 삭제 기능은 제공하지 않는다.

### 10.4 초기화

두 가지 초기화를 제공한다.

1. 선택 요소 초기화
   - 해당 Item 또는 Section Override만 제거
   - Admin 기본 Layout으로 복원
2. 전체 레이아웃 초기화
   - 모든 User Override 제거
   - Run 시작 시 Snapshot된 Admin Layout으로 복원

현재 Admin의 최신 Layout을 다시 조회해 적용하지 않는다.

## 11. Wizard와 Vue Renderer 통합

현재 Wizard는 Vanilla JavaScript이고 Renderer는 Vue SFC다. Renderer 코드를 Wizard에 복사하지 않는다.

권장 방식:

1. PromoPageRenderer를 공유하는 별도 Wizard Preview Entry를 추가한다.
2. Vite Multi Entry로 Preview Bundle을 생성한다.
3. Wizard의 Preview Container에 Vue App을 Mount한다.
4. Wizard 콘텐츠와 Layout 변경을 명시적 update API 또는 Custom Event로 전달한다.

예상 파일:

- visual-editor/src/WizardLayoutPreview.vue
- visual-editor/src/wizard-preview.js
- visual-editor/src/layout-utils.mjs
- visual-editor/vite.config.js
- prototype/visual-editor-assets/wizard-layout-preview.js

금지:

- prototype/promo-wizard.js에서 Renderer DOM을 별도로 구현
- Preview 전용 CSS 복제
- iframe 내부 localStorage를 Source of Truth로 사용

Wizard의 contentState와 layoutOverrideState가 Host Source of Truth다. Vue Preview는 Props를 렌더링하고 편집 Event만 Host에 전달한다.

## 12. API 계획

### 12.1 Admin Layout API

신규:

- GET /api/wizard-form-template-layout?templateId={id}
- PATCH /api/wizard-form-template-layout
- POST /api/wizard-form-template-layout-reset

PATCH 요청:

~~~json
{
  "templateId": "uuid",
  "expectedRevision": 3,
  "contractVersion": 1,
  "rendererKey": "default-promo-renderer",
  "rendererVersion": 1,
  "layoutSpec": {},
  "changeNote": "Hero 영역 기본 배치 조정"
}
~~~

expectedRevision으로 동시 수정 충돌을 감지한다.

### 12.2 공개 Template API

GET /api/wizard-form-template-public 응답에 다음을 추가한다.

~~~json
{
  "template": {},
  "configRevision": "...",
  "layoutRevision": 3,
  "renderer": {
    "key": "default-promo-renderer",
    "version": 1
  },
  "defaultLayout": {},
  "sections": [],
  "configurationWarnings": []
}
~~~

공개 응답은 Active Template의 Layout만 반환한다.

Layout이 없는 기존 Active Template은 migration backfill로 DEFAULT_DESIGN_SPEC을 사용한다.

### 12.3 Run Layout API

신규 또는 기존 Run API 확장:

- PUT /api/promo-generation-layout-snapshot
- GET /api/promo-generation-layout-snapshot?runId={id}

Run 생성 시 최초 Snapshot을 저장하고 Wizard 편집 완료 시 Override와 Resolved Layout을 갱신한다.

### 12.4 Wizard Event API

신규:

- POST /api/wizard-layout-usage-events

요구사항:

- 허용 Event Name 검증
- Payload 크기 제한
- clientEventId 중복 방지
- 원문 콘텐츠와 개인정보 저장 금지
- 로그 실패가 Wizard 진행을 차단하지 않음

## 13. Template Lifecycle

### 13.1 신규 Template

1. Template Draft 생성
2. Section/Item 구성
3. 기본 Layout 자동 생성
4. Admin Layout Editor에서 조정
5. 통합 검증
6. 활성화

### 13.2 새 Draft 생성

Active Template에서 새 Draft를 만들 때 다음을 함께 복제한다.

- Section Membership
- Template Owned Section/Item
- layoutKey
- Default Layout
- Renderer Metadata

복제된 Layout Revision은 새 Draft 기준 1로 시작하거나 원본 Revision을 provenance로 별도 기록한다.

권장:

- layout_revision: 1
- source_layout_id: 원본 Layout ID
- History에 clone 기록

### 13.3 Template 복제

새 Template Key로 복제할 때도 Layout을 복제한다. layoutKey는 유지하되 새 Template 범위 안에서만 유일성을 검사한다.

### 13.4 활성화

Form Template과 Layout을 하나의 Transaction으로 검증·활성화한다.

활성화 실패 시 둘 다 변경하지 않는다.

## 14. 검증 규칙

### 14.1 Schema

- 지원 contractVersion
- 허용된 최상위 Key
- 허용된 Theme/Responsive/Style 속성
- 값 Type과 범위
- 알 수 없는 CSS 속성 거부

### 14.2 참조 무결성

- 모든 sectionStyles Key가 Template Section에 존재
- 모든 itemStyles Key가 Template Item에 존재
- 숨김 또는 삭제된 Item Style은 Warning 또는 정리
- layoutKey 중복 금지

### 14.3 Layout 범위

- xPct: 0~100
- yPx: 0 이상
- Section Height: 50~1200
- fontSize: 10~80
- fontWeight: 허용 목록
- textAlign: left, center, right
- Item이 Section 하단을 초과하지 않음

### 14.4 반응형

P0:

- Desktop 기본 Layout
- Mobile은 자동 Stack Fallback

P1:

- breakpoint별 Item/Section Override
- Mobile Touch Target과 Overflow 검증

초기부터 Desktop 좌표를 Mobile에 그대로 적용하지 않는다.

### 14.5 정책

- Locked Item Style 변경 금지
- Fixed Section 순서 변경 금지
- 필수 Item Coverage 100%
- 위험 CTA URL 차단

## 15. 예상 변경 파일

### DB

- db/migrations/023_wizard_form_template_layouts.sql
- db/migrations/024_promo_generation_layout_snapshots.sql

### API

- api/_wizard-form-template-layout-store.js
- api/wizard-form-template-layout.js
- api/wizard-form-template-layout-reset.js
- api/_promo-generation-layout-store.js
- api/promo-generation-layout-snapshot.js
- api/_wizard-layout-usage-log.js
- api/wizard-layout-usage-events.js
- api/wizard-form-template-public.js
- api/wizard-form-template-activate.js
- api/wizard-form-templates.js
- api/_wizard-form-templates-store.js

### Admin

- prototype/index.html
- prototype/app.js
- prototype/style.css

### Wizard

- prototype/promo-wizard.html
- prototype/promo-wizard.js
- prototype/promo-wizard.css

### Visual Editor/Renderer

- visual-editor/src/App.vue
- visual-editor/src/PromoPageRenderer.vue
- visual-editor/src/contracts.js
- visual-editor/src/layout-utils.mjs
- visual-editor/src/WizardLayoutPreview.vue
- visual-editor/src/wizard-preview.js
- visual-editor/vite.config.js
- prototype/visual-editor-assets/*

### Test

- scripts/test-wizard-form-template-layout-contract.js
- scripts/test-wizard-layout-behavior.mjs
- scripts/test-wizard-layout-usage-log-contract.js
- scripts/test-wizard-public-form-template-contract.js
- scripts/test-visual-editor-contract.js
- package.json

## 16. 구현 순서

### Phase 0: 계약과 식별자

1. Layout Contract 확정
2. contractVersion 결정
3. Section/Item layoutKey 추가 및 Backfill
4. Layout Merge/Reset Pure Function 구현
5. 단위 테스트

완료 기준:

- Draft 복제 후에도 Layout 연결 유지
- 잘못된 Layout이 Validator에서 차단
- 기본값, Admin Layout과 Wizard Override 병합 결과가 결정적

### Phase 1: Admin 기본 Layout 저장

1. Migration 023
2. Layout Store/API
3. Template 생성·복제·Draft 생성 시 Layout 처리
4. Template 활성화 통합 검증
5. Admin Layout 상태 표시

완료 기준:

- Template 버전별 Layout 저장
- Active 버전 읽기 전용
- 새 Draft에 Layout 복제
- 활성화 시 Template과 Layout이 함께 고정

### Phase 2: Admin Layout Editor

1. Visual Editor Admin Mode
2. Placeholder Content
3. 저장·초기화·검증
4. Desktop/Mobile Preview
5. Admin 진입 버튼

완료 기준:

- 관리자가 Drag와 Style 편집 가능
- 새로고침 후 Layout 유지
- 동일 Renderer에서 저장 전후 결과 일치

### Phase 3: 공개 API와 Wizard Preview

1. 공개 API에 Layout/Renderer Metadata 추가
2. Wizard Template 선택 시 Layout 저장
3. Wizard Preview Vue Entry
4. Step 2 입력과 Preview 실시간 연결
5. Admin 정책 적용

완료 기준:

- 템플릿별 다른 기본 Layout 표시
- 입력 내용이 Preview에 즉시 반영
- Locked/Fixed 정책 우회 불가

### Phase 4: Wizard 실행별 편집

1. Wizard Override State
2. Drag/Resize/Style Event 연결
3. Item/전체 초기화
4. localStorage 임시 복원
5. Event Log

완료 기준:

- Wizard 변경이 Admin Layout을 수정하지 않음
- 새로고침 후 현재 Wizard Session 복원
- 초기화 시 Run 시작 시점 Admin Layout으로 복원

### Phase 5: Run Snapshot과 Web Output

1. Migration 024
2. Run Layout Snapshot API
3. Resolved Layout Hash
4. Generation Run 연결
5. Web Output 동일 Snapshot 사용

완료 기준:

- Admin이 이후 Layout을 변경해도 기존 Run 재현
- Preview와 Web Output의 Content/Layout Hash 일치
- Run별 Template/Layout/Renderer Revision 조회 가능

## 17. 테스트 계획

### 17.1 Pure Function

- 빈 Layout 정규화
- Admin Layout 병합
- Wizard Override 병합
- Item Override 제거
- 전체 Override 제거
- Unknown Property 차단
- 숫자 범위 검증
- Stable Hash

### 17.2 API Contract

- Draft Layout GET/PATCH
- Active Layout PATCH 409
- Revision 충돌 409
- Invalid Layout 422
- 공개 API Active Layout 포함
- 비활성 Layout 비공개
- Template 복제 시 Layout 복제
- 활성화 실패 Atomicity

### 17.3 Admin Browser

- Draft Layout Editor 진입
- Item Drag
- Section Resize
- Style 변경
- 저장 후 Reload
- Active 읽기 전용
- 새 Draft 생성 후 편집
- Mobile Preview

### 17.4 Wizard Browser

- Default Template Layout 표시
- 다른 Template 선택 시 다른 Layout 표시
- Content 입력 Preview 반영
- Item Drag와 Style 변경
- Locked Item 변경 차단
- Item 초기화
- 전체 Layout 초기화
- 새로고침 Session 복원
- 다음 Step 이동 후 Run Snapshot 확인

### 17.5 동등성

- Admin Preview와 동일 Base Layout
- Wizard Preview와 동일 Resolved Layout
- Web Output과 동일 Snapshot
- Desktop/Mobile 치명적 Overflow 없음

## 18. Definition of Done

다음 조건을 모두 충족해야 완료다.

1. Admin에서 Form Template Draft의 기본 Layout을 편집하고 저장할 수 있다.
2. Template 활성화 시 Section/Item과 Layout이 함께 검증된다.
3. Wizard Step 2에서 선택 Template의 기본 Layout이 실제 Renderer로 표시된다.
4. Wizard 사용자가 허용 범위에서 Layout을 변경할 수 있다.
5. Wizard 변경은 Admin 기본 Layout에 역반영되지 않는다.
6. 선택 요소와 전체 Layout을 Admin 기본값으로 초기화할 수 있다.
7. Template Version, configRevision, layoutRevision과 Renderer Version이 Run에 고정된다.
8. Admin 변경 후에도 기존 Run 결과를 재현할 수 있다.
9. Preview와 Web Output이 동일 Renderer와 Snapshot을 사용한다.
10. Admin 감사 로그, Wizard Layout Event와 Run Snapshot이 목적별로 분리된다.
11. Contract, Behavior, Browser와 Migration Test를 통과한다.
12. 기존 Wizard LO-FI/Final Flow에 회귀가 없다.

## 19. 위험과 대응

### Section/Item Key 변경

위험:

- 저장된 Layout Style 연결 유실

대응:

- 별도 불변 layoutKey
- Draft/Template 복제 Test

### Admin과 Wizard Renderer 불일치

위험:

- 같은 Layout인데 화면 결과가 다름

대응:

- 동일 PromoPageRenderer Bundle
- Preview/Output Hash 및 Screenshot 비교

### Desktop 좌표의 Mobile Overflow

위험:

- Desktop 자유 배치가 Mobile에서 겹침

대응:

- 초기 Mobile Auto Stack Fallback
- breakpoint Override는 후속 단계

### 과도한 Event Log

위험:

- Pointer Move마다 로그가 생성됨

대응:

- Drag End, Resize End와 Commit Event만 기록

### localStorage 용량

위험:

- 배경 이미지 Data URL과 Snapshot으로 저장 실패

대응:

- Wizard Session에는 작은 Override만 저장
- Binary Asset은 URL 참조
- Run Snapshot은 서버 저장

### 기존 Active Template에 Layout 없음

위험:

- 공개 API 또는 Wizard 로드 실패

대응:

- Migration Backfill
- DEFAULT_DESIGN_SPEC Fallback
- 배포 후 Active Template Validation Report

## 20. 배포 순서

1. Migration 023 적용
2. 기존 Template Layout Backfill 검증
3. Admin Layout API 배포
4. Admin Layout Editor Feature Flag 배포
5. 공개 API에 Optional Layout 필드 배포
6. Wizard Preview Read-only Feature Flag 배포
7. Wizard Layout Editing Feature Flag 배포
8. Migration 024 및 Run Snapshot 활성화
9. 운영 Smoke Test
10. Feature Flag 단계적 확대

Feature Flag 예:

- ADMIN_TEMPLATE_LAYOUT_ENABLED
- WIZARD_TEMPLATE_PREVIEW_ENABLED
- WIZARD_LAYOUT_EDITING_ENABLED
- RUN_LAYOUT_SNAPSHOT_ENABLED

## 21. 롤백

1. Wizard Layout Editing Flag를 끈다.
2. Wizard Preview는 기존 입력 Accordion으로 복귀한다.
3. 공개 API의 Layout 필드는 Optional이므로 기존 Client가 계속 동작한다.
4. Admin Layout 데이터는 삭제하지 않고 읽기 전용으로 유지한다.
5. 기존 LO-FI/Final Generation Flow는 변경하지 않는다.
6. DB Migration은 Drop하지 않고 신규 API 사용만 중단한다.

## 22. 오늘 착수 가능한 작업

우선 구현 단위:

1. Layout Contract와 layoutKey 결정
2. layout-utils.mjs와 단위 테스트
3. Migration 023
4. Admin Layout GET/PATCH API
5. 공개 API Optional defaultLayout
6. Admin의 기본 레이아웃 설정 진입 버튼

첫 번째 기술 목표:

> Admin에서 저장한 Default Template Layout을 새로고침 후 다시 불러오고, 동일 PromoPageRenderer에서 완전히 동일하게 표시한다.

두 번째 기술 목표:

> Wizard가 Admin Base Layout을 로드하고, 사용자 Override를 적용한 뒤 전체 초기화로 Run 시작 시점 Base Layout에 정확히 복원한다.

## 23. 구현 완료 결과 (2026-07-17)

### 완료 범위

- Admin Template 관리 화면에서 Draft Template의 `기본 레이아웃 설정` 진입점을 제공한다.
- Admin Layout Editor가 Template Section과 Default Layout을 조회하고 Revision 기반으로 저장한다.
- Active Template 공개 API가 `defaultLayout`, `layoutRevision`, Renderer 정보를 Wizard에 전달한다.
- Wizard Step 2가 Admin Base Layout을 동일 Visual Editor/Renderer로 표시한다.
- Wizard 사용자는 콘텐츠와 레이아웃을 변경할 수 있고, `관리자 기본값으로 복원`으로 Run 시작 시점 Base Layout에 되돌릴 수 있다.
- Wizard 변경값은 Admin Template에 역반영하지 않고 Wizard Session과 Generation Run Snapshot에만 저장한다.
- Layout Load/Edit/Reset Event는 별도 Usage Event API로 수집한다.
- Template Section Copy-on-write 과정에서 Section Key가 바뀌어도 Layout의 Section 참조가 함께 변경된다.

### 주요 구현 파일

- Layout Contract/병합/검증: `visual-editor/src/layout-utils.mjs`
- Layout 저장소 공통 로직: `api/_wizard-form-template-layout-store.js`
- Admin Layout API: `api/wizard-form-template-layout.js`
- Wizard Usage Event API: `api/wizard-layout-usage-events.js`
- Public Template Layout 전달: `api/wizard-form-template-public.js`
- DB Schema/Backfill: `db/migrations/023_wizard_form_template_layouts.sql`
- Admin 진입 UI: `prototype/index.html`, `prototype/app.js`
- Admin/Wizard 공용 Editor: `visual-editor/src/App.vue`
- Wizard Step 2 연동 및 Run Snapshot: `prototype/promo-wizard.js`

### 디버깅 및 검증 결과

- JavaScript Syntax Check: 통과
- Layout Behavior Test: 통과
- Layout API Contract Test: 통과
- 기존 Public Template/Form Template/Content Section/Audit Contract Test: 통과
- Visual Editor Behavior/Contract Test: 통과
- `git diff --check`: 통과
- Vite Production Build: 통과
- Browser E2E: Admin 저장 `52px` → Wizard 변경 `60px` → Admin 기본값 복원 `52px` 확인
- Browser Console/Page Error: 0건

브라우저 검증 중 Wizard Editor가 Snapshot 수신 전에 빈 Template을 렌더링하는 초기화 오류를 발견했고, 비동기 Snapshot 로딩이 끝날 때까지 Loading 상태를 유지하도록 수정했다.

### 배포 전 필수 작업

로컬 구현과 Fixture 기반 디버깅은 완료됐지만 운영 반영 완료를 의미하지는 않는다. 배포 전에 다음 작업이 필요하다.

1. ~~운영/검증 DB에 Migration 023을 적용한다.~~ — 2026-07-17 적용 완료(사용자 확인)
2. 기존 Template의 Layout Backfill 건수와 Section Key 참조 무결성을 확인한다.
3. API와 정적 Visual Editor Bundle을 같은 Release로 배포한다.
4. Draft 저장, Active 조회, Wizard 변경/복원, Generation Run Snapshot을 운영 환경에서 Smoke Test한다.
5. `wizard_layout_usage_events` 적재량과 실패율을 모니터링한다.

현재 Codex 로컬 실행 환경에는 DB 연결 환경 변수가 제공되지 않아 Migration 적용 및 Backfill 건수를 직접 재조회하지 못했다. 2번 검증은 배포 환경의 읽기 전용 점검 또는 Smoke Test에서 수행한다.
