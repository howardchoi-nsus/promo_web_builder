# 관리자 언어 키파일(i18n) 관리 기능 개발계획서

- 작성일: 2026-07-22
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: Phase 0~4 및 공통 셸 1차 반영 / DB 마이그레이션 적용·전면 라벨 전환 대기
- 선행 문서: `docs/claude/admin-page-terminology-dictionary-2026-07-22.md`
- 적용 대상: 관리자 페이지(`prototype/index.html`), Create Promo, Promo Wizard, Generated/Web Output
- 확정 결정
  - 저장·배포: **DB 기반**(Neon Postgres). repo의 `locales/*.json`은 복구 기준선(baseline).
  - 거버넌스: **풀 거버넌스** — 버전별 `draft/active/inactive/archived` 상태 + audit log + 신규 draft 방식 롤백.
  - 언어 코드: **ISO 639-1**(`ko`, `en`), 지역 확장 시 **BCP 47**(`ko-KR`, `en-US`).
  - 런타임: Vue에 종속되지 않는 공통 `i18n-runtime.js`를 기준으로 하고 Vue/Vanilla 화면별 어댑터를 둔다.
  - 콘텐츠 경계: 관리자 i18n은 제작 도구 UI에만 적용한다. Create Promo가 생성하는 최종 페이지에는 사용자가 등록한 콘텐츠만 출력하며 별도 locale key를 만들지 않는다.

## 0. 문서 목적

관리자가 코드 배포 없이 UI 라벨(다국어 메시지)을 조회·편집·승인·롤백할 수 있는 기능을 설계한다. 다른 LLM이나 개발자가 이전 맥락 없이도 다음을 판단·구현할 수 있도록 작성한다.

1. 언어 메시지를 어떤 스키마로 저장하는가.
2. 관리자에서 어떤 화면·동작으로 편집하는가.
3. 기존 프롬프트 템플릿 거버넌스 패턴을 어떻게 재사용하는가.
4. 런타임(각 페이지)이 메시지를 어떻게 로드·폴백하는가.
5. 하드코딩 라벨을 어떤 순서로 키로 전환하는가.
6. 각 단계에서 무엇을 통과해야 완료로 판단하는가.

## 1. 최종 결정 요약

### 1.1 채택하는 방향 (MUST)

- 메시지는 `(locale, key)` 단위로 DB에 저장하고, 관리자에서 CRUD 한다.
- 기존 `prompt_templates` / `prompt_template_histories` / `wizard_section_audit_logs` 패턴을 참고하되, 메시지는 active와 신규 draft가 공존할 수 있는 version row 구조로 구현한다.
- repo의 `locales/ko.json`, `locales/en.json`을 **복구 기준선**으로 유지하고, 신규 환경/테이블 리셋 시 seed 로 사용한다.
- 런타임은 활성(active) 스냅샷을 API로 받아 렌더링하며, 실패 시 번들 baseline 으로 폴백한다.
- 언어 코드는 canonical BCP 47 형식으로 정규화하고 DB의 활성 언어 목록으로 검증한다. 기본 지원 언어는 `ko`, `en`이다.
- 사용자 화면의 식별자 필드는 한국어 `식별자`, 영문 `ID`로 표시한다. 내부 데이터의 `message_key`와 템플릿 key 값은 변경하지 않는다.

### 1.2 채택하지 않는 방향 (MUST NOT)

- locale JSON 을 관리자에서 자유 텍스트 통짜 편집으로 저장하지 않는다(키 단위 관리).
- 저장 값(코드)과 표시 라벨을 뒤섞지 않는다. 드롭다운 저장 값은 메시지 키로 대체하지 않는다.
- 활성 스냅샷을 클라이언트에서 직접 수정해 렌더링하지 않는다.
- 코드 배포 없이는 새 언어(locale)를 추가하지 못하는 구조로 만들지 않는다(언어 추가도 데이터로 처리).
- 미검증 HTML/스크립트를 메시지 값으로 허용하지 않는다.
- 사용자가 입력하거나 AI가 생성한 프로모션 제목·본문·CTA·이미지 설명을 관리자 locale message로 변환하지 않는다.
- Web Output의 최종 프로모션 콘텐츠에 관리자 baseline 문구나 번역 fallback을 삽입하지 않는다.

## 2. 용어와 강제 수준

- **MUST / MUST NOT / SHOULD / MAY**: 기존 계획서와 동일한 강제 수준.
- **locale**: ISO 639-1(또는 BCP 47) 언어 식별자. 예: `ko`, `en`, `ko-KR`.
- **message key**: 네임스페이스 계층 키. 예: `entity.section.name`.
- **message**: 특정 locale 에서 key 에 대응하는 표시 문자열.
- **baseline**: repo 에 커밋된 `locales/*.json` 기준값. 복구/seed 용.
- **snapshot**: 특정 locale 의 활성 메시지 전체를 런타임에 제공하는 응답.

## 3. 현재 상태 기준선

| 영역 | 현황 |
|---|---|
| i18n 인프라 | 없음(`t()`, locale 파일 0건). 라벨은 HTML·JavaScript·관리자 모듈·공통 셸에 하드코딩 |
| 프레임워크 | 관리자 전역 CDN Vue, Visual Editor Vite Vue, Create Promo/Wizard/공통 셸 Vanilla JavaScript, 서버리스 `api/*.js`, Neon Postgres |
| 거버넌스 선례 | `prompt_templates`(마이그레이션 010): status(draft/active/inactive/archived)+version, `prompt_template_histories` 이력, 타입당 active 1건 unique 인덱스 |
| 감사 선례 | `wizard_section_audit_logs`(022): 트리거 기반 read-only 감사 추적 |
| 관리자 탭 | `adminTab` 상태로 `webhook` / `llm`(LLM·프롬프트) / `promo-form`(템플릿·레이아웃) 전환 |
| 라벨 규모 | 기존 1차 추출값은 참고만 유지한다. Phase 0에서 `index.html`, `app.js`, 관리자 모듈, 공통 셸 및 사용자 노출 오류를 다시 추출해 기준 커밋과 건수를 실행 로그에 기록한다. |

### 3.1 확인된 문제

1. 동일 문자열의 한글판·영문판이 소스에 동시 존재(`이 섹션에서 AI 디자인 생성 허용` / `이 Section에서...`).
2. `타입`/`유형`, `아이템`/`항목` 등 동의어가 섞여 그대로 키화하면 중복 번역이 발생. `수정`/`편집`처럼 의미가 다른 용어는 용도별 키로 분리해야 한다.
3. i18n 인프라가 없어 라벨 변경마다 코드 수정·배포가 필요.
4. 캠페인 톤·목적 등 열거형 값이 라벨과 저장 값 구분 없이 하드코딩.

## 4. 목표 아키텍처

### 4.1 데이터 계층

```text
locale_message_keys       (message key 메타데이터)
        +
locale_message_versions   (locale별 value, version, status)
        +
locale_message_audit_logs (활성화·보관·롤백 작업 이력)
        +
locales                   (지원 언어, 기본 언어, snapshot revision)
```

### 4.2 서비스 계층 (serverless)

```text
GET  /api/locales                      지원 언어 목록
POST /api/locale                       지원 언어 추가
PATCH /api/locale                      언어 이름/활성 상태 수정
POST /api/locale-default               기본 언어 지정
GET  /api/locale-messages?locale=ko    관리용 키 목록(status 포함)
GET  /api/locale-snapshot?locale=ko    런타임용 active 스냅샷(key→value)
POST /api/locale-message               생성/수정(draft)
POST /api/locale-message-activate      draft→active 승격
POST /api/locale-messages-activate     선택 키/locale draft 일괄 활성화
POST /api/locale-message-archive       archived 처리
POST /api/locale-message-rollback      과거 값을 신규 draft로 복원
GET  /api/locale-message-history?key=  키별 변경 이력
```

### 4.3 런타임 계층

```text
페이지 로드
  → GET /api/locale-snapshot?locale={현재 언어}
  → 성공: 메시지 맵 주입, t(key) 렌더링
  → 실패/누락 키: 요청 언어 baseline(존재 시)
                  → 기본 언어 DB active
                  → 기본 언어 baseline
                  → key 문자열 순 폴백
```

### 4.4 관리자 UI 계층

- 관리자 새 탭 `i18n`(사용자 라벨: "언어 및 문구 관리")을 `adminTab`에 추가.
- 좌: 언어 선택 + 문구 분류, 우: 메시지 식별자·번역 문구 목록/편집 + 상태·이력.

### 4.5 프로모션 콘텐츠 경계 (MUST)

- Create Promo의 단계명, 버튼, 입력 라벨, 도움말, 오류 등 **제작 도구 UI**는 i18n 대상이다.
- 사용자가 등록한 프로모션 제목, 본문, CTA 문구, 이미지·이미지 설명은 i18n 대상이 아니다.
- AI가 생성한 문구도 프로모션 콘텐츠 값으로 저장하며 locale message key를 만들지 않는다.
- 최종 생성 페이지와 Web Output의 프로모션 본문에는 사용자가 등록한 값만 출력한다.
- 입력값이 없는 항목은 최종 페이지에서 출력하지 않는다. 편집기 placeholder나 관리자 baseline 문구를 대신 출력하지 않는다.
- Web Output에서 i18n 대상은 제작 도구용 host UI가 존재하는 경우의 버튼·툴바에 한정한다.
- 최종 프로모션 콘텐츠의 다국어화가 필요해지면 관리자 UI i18n과 분리된 별도 콘텐츠 번역 기능으로 설계한다.

## 5. DB 스키마 설계 (마이그레이션 027 제안)

기존 `prompt_templates`의 pgcrypto, status check, active partial unique, updated_at 규약을 참고한다. 메시지 값 이력은 별도 history snapshot을 중복 저장하지 않고 version row 자체로 보존한다.

```sql
-- db/migrations/027_locale_messages.sql
create extension if not exists pgcrypto;

create table if not exists locales (
  code text primary key,                       -- ISO 639-1 / BCP 47
  label text not null,
  is_default boolean not null default false,
  enabled boolean not null default true,
  snapshot_revision bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists locales_one_default_uidx
  on locales (is_default) where is_default = true;

create table if not exists locale_message_keys (
  message_key text primary key,
  namespace text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists locale_message_keys_namespace_idx
  on locale_message_keys (namespace, message_key);

create table if not exists locale_message_versions (
  id uuid primary key default gen_random_uuid(),
  locale text not null references locales(code) on delete restrict,
  message_key text not null references locale_message_keys(message_key) on delete restrict,
  value text not null default '',
  status text not null default 'draft',
  version integer not null default 1,
  change_note text not null default '',
  changed_by text not null default 'system',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locale_message_versions_status_chk
    check (status in ('draft', 'active', 'inactive', 'archived')),
  constraint locale_message_versions_uidx unique (locale, message_key, version)
);

create unique index if not exists locale_message_versions_one_active_uidx
  on locale_message_versions (locale, message_key) where status = 'active';

create unique index if not exists locale_message_versions_one_draft_uidx
  on locale_message_versions (locale, message_key) where status = 'draft';

create index if not exists locale_message_versions_locale_status_idx
  on locale_message_versions (locale, status, message_key);

create table if not exists locale_message_audit_logs (
  id uuid primary key default gen_random_uuid(),
  locale_message_version_id uuid references locale_message_versions(id) on delete restrict,
  locale text not null,
  message_key text not null,
  action text not null,
  from_version integer,
  to_version integer,
  actor text not null default 'system',
  change_note text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint locale_message_audit_action_chk
    check (action in ('create_draft', 'update_draft', 'activate', 'archive', 'rollback'))
);

create index if not exists locale_message_audit_logs_key_idx
  on locale_message_audit_logs (locale, message_key, created_at desc);
```

`locale_message_versions` 자체가 값의 버전 이력을 보존한다. `locale_message_audit_logs`는 사용자가 수행한 활성화·보관·롤백 작업과 작업자를 기록한다. 애플리케이션 사용자 인증이 없는 환경에서는 actor를 `system` 또는 배포 인증에서 확인 가능한 식별자로 기록하고, 정식 사용자 인증 도입 시 actor 규약을 교체한다.

상태 전이는 반드시 DB 트랜잭션으로 처리한다. 동일 `(locale, message_key)`의 기존 active를 inactive로 변경하고 대상 draft를 active로 승격한 뒤 `locales.snapshot_revision`을 증가시킨다. active 버전은 대체 active 없이 직접 보관할 수 없다.

신규 version 번호는 동일 `(locale, message_key)` 행을 잠근 트랜잭션 안에서 계산해 동시 draft 생성 경합을 방지한다. 일괄 활성화는 대상 전체가 검증을 통과한 경우에만 한 트랜잭션으로 반영하고 locale revision은 한 번 증가시킨다.

### 5.1 baseline / seed 규약

- `locales/ko.json`, `locales/en.json` 을 repo 에 커밋(용어 사전 기준으로 생성).
- 마이그레이션은 스키마만 담는다.
- `scripts/seed-locale-baseline.js`가 baseline을 idempotent upsert하고 최초 active 버전을 생성한다.
- 읽기 API와 store cold start는 seed를 실행하거나 DB를 변경하지 않는다.
- 신규 언어 추가 시 기본 언어의 message key 집합을 기준으로 빈 draft를 생성해 번역 진행률을 계산한다.

## 6. 서버 계약 (contract)

### 6.1 검증 규칙 (MUST)

- `locale` 코드는 canonical BCP 47 형식으로 정규화하고 `locales.enabled = true`인 데이터만 허용한다. 신규 언어를 코드 배포 없이 추가해야 하므로 하드코딩 allowlist는 사용하지 않는다.
- `message_key` 는 `^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$`를 사용해 용어 사전의 lower camelCase segment를 허용한다.
- `value` 는 최대 길이와 제어문자를 검증하고 텍스트로만 렌더링한다. `v-html`, `innerHTML`, URL·style 속성 주입에 사용하지 않는다.
- 플레이스홀더는 key별 baseline placeholder 집합과 이름이 일치해야 한다. 신규 locale에서 필수 placeholder를 누락하거나 임의 placeholder를 추가하면 저장을 거부한다.
- 동일 `(locale, message_key)` active 는 1건만 존재(unique 인덱스로 강제).
- 동일 `(locale, message_key)`의 편집 가능한 draft도 1건만 허용한다.

### 6.2 상태 전이

```text
new version --> draft
draft --activate--> active   (기존 active 는 같은 트랜잭션에서 inactive 로 강등)
draft/inactive --archive--> archived
active --archive--> 금지      (대체 버전을 먼저 활성화)
inactive/archived --rollback--> 과거 값으로 신규 draft 생성
```

프롬프트 템플릿의 "활성·비활성 버전은 읽기 전용, 수정하려면 새 초안" 규칙을 동일 적용한다. 롤백은 과거 행의 status를 직접 변경하지 않고 과거 값을 다음 version의 draft로 복사한다.

## 7. 런타임 통합

### 7.1 공통 런타임과 화면 어댑터

- 공통 기준은 프레임워크 독립적인 `prototype/i18n-runtime.js`로 한다(MUST).
- 공통 런타임은 `init()`, `t()`, `setLocale()`, `getLocale()`, `reloadSnapshot()`, `subscribe()`를 제공한다.
- 관리자 전역 Vue와 Visual Editor Vite Vue는 각각 reactive adapter를 사용한다.
- Create Promo, Promo Wizard, Shared Shell은 공통 런타임을 직접 사용한다.
- `vue-i18n`은 Vue 화면 내부의 선택적 어댑터로 사용할 수 있지만 스냅샷 로딩·fallback·locale 저장 정책의 단일 출처가 되어서는 안 된다.
- 외부 CDN에 의존하지 않도록 런타임과 선택적 Vue 어댑터는 로컬 정적 자산 또는 기존 빌드 산출물로 제공한다.

### 7.2 로딩 순서

```text
1. 현재 locale 결정: 사용자 저장값 → 브라우저 언어 → 기본 언어 `ko`
2. 동기 baseline으로 초기 메시지를 준비해 빈 라벨과 raw template 노출 방지
3. GET /api/locale-snapshot?locale=ko → `{ locale, revision, updatedAt, messages }`
4. 공통 런타임에 스냅샷을 병합하고 구독 화면에 변경 통지
5. Vue 컴포넌트와 Vanilla 화면은 동일한 `t('entity.section.name')` 계약으로 렌더링
6. 누락 시: 요청 locale baseline → 기본 locale DB active → 기본 locale baseline → key 문자열 순 폴백
7. 언어 변경 시 `<html lang>`, localStorage, 화면 구독자 상태를 함께 갱신
```

스냅샷 API는 revision 기반 `ETag` 재검증을 지원한다. 활성화 후 관리 화면은 새 revision을 다시 로드하며, 장기 캐시로 인해 "즉시 반영"이 지연되지 않도록 `no-cache` 재검증 정책을 사용한다.

### 7.3 플레이스홀더/복수형

- 동적 문자열은 `t('builder.sectionCount', { count })` 형태로 처리.
- baseline JSON 값에 `{count}` 플레이스홀더 포함(예: `"sectionCount": "{count}개 섹션"`).

## 8. 관리자 UI 설계

### 8.1 탭 추가

`index.html` 의 `admin-tab-menu` 에 버튼 추가, `adminTab === 'i18n'` 분기.

```html
<button class="admin-tab" :class="{ active: adminTab === 'i18n' }"
        type="button" role="tab" :aria-selected="adminTab === 'i18n'"
        @click="selectAdminTab('i18n')">{{ t('admin.i18n.title') }}</button>
```

### 8.2 화면 구성

- **언어 선택 바**: 지원 언어 드롭다운 + "언어 추가"(권한자) + 기본 언어 지정 + 활성/비활성 상태.
- **문구 분류**: `common / entity / admin / builder` 네임스페이스 계층 필터. 화면에서는 `문구 분류`로 표시한다.
- **문구 목록 테이블**: `메시지 식별자 | 번역 문구 | 상태 | 버전 | 최종 수정`. 상태 pill 재사용(`app-components.css`의 status).
- **편집 패널**: 값 입력, 변경 사유(change note), draft 저장/활성화/보관/과거 버전으로 새 초안 만들기.
- **미번역 문구 보기**: baseline 대비 특정 언어에서 번역 문구가 없는 메시지 식별자 목록과 번역 진행률.
- **릴리스 동작**: 선택 키 일괄 활성화 및 locale 전체 draft 활성화. 실행 전 누락 키와 placeholder 정합성을 검사한다.

### 8.3 재사용 컴포넌트

현재 `app-components.css`에 있는 `.app-panel / .app-field / .app-button / .app-status`를 사용한다. 공통 `.app-table`은 아직 없으므로 실제 키 목록 요구사항을 기준으로 공통 컴포넌트에 먼저 추가하고 페이지 CSS에 중복 정의하지 않는다. i18n 관리 화면 자체도 하드코딩 라벨을 만들지 말고 `admin.i18n.*` 키로 관리한다.

## 9. 단계별 구현 계획

### Phase 0 — 기준선과 안전망
1. 최신 용어 사전을 기준으로 `index.html`, `app.js`, 관리자 모듈, 공통 셸, 사용자 노출 오류를 재추출하고 기준 커밋·건수를 실행 로그에 기록한다.
2. `식별자`, `항목`, `수정/편집`, `변경 이력/작업 이력`, `보관/삭제` 매핑을 확정한다.
3. `locales/ko.json`, `locales/en.json` baseline 생성.
4. 현재 전체 테스트/`npm run check` 결과 기록.
5. 관리자 주요 화면 스크린샷(라벨 전환 전) 확보.

완료 기준: baseline JSON 파싱 유효, 기존 테스트 통과, 기준 스크린샷 확보.

### Phase 1 — 데이터 계층
1. 마이그레이션 `027_locale_messages.sql` 작성·적용.
2. `api/_locale-message-store.js` 작성. 읽기 경로에서는 seed를 실행하지 않는다.
3. `scripts/seed-locale-baseline.js` 작성 및 idempotent seed 검증.
4. store 단위 테스트(버전 draft 생성/활성/롤백/일괄 활성/감사 기록) 추가.

완료 기준: 마이그레이션 idempotent, active/draft partial unique, 동시 version 생성, 명시적 seed, 롤백 draft 동작 확인.

### Phase 2 — 서비스 계층
1. 언어 조회/추가/수정/기본 언어 지정 API와 기본 언어 보호 규칙 구현.
2. `GET /api/locale-messages`, `GET /api/locale-snapshot` 구현.
3. draft, 단건·일괄 활성화, 보관, 롤백, 이력 API 구현.
4. locale canonicalization, camelCase key, placeholder 정합성 및 텍스트 전용 계약 테스트.
5. 스냅샷 revision, ETag, fallback 응답 계약 구현.

완료 기준: 스냅샷이 active만 반환, 검증 위반 400, 단건·일괄 활성화 원자성, revision/ETag, 감사 기록 확인.

### Phase 3 — 런타임 통합
1. 프레임워크 독립 `i18n-runtime.js`와 Vue/Vanilla 어댑터 구현.
2. baseline 초기 렌더링 후 DB 스냅샷 병합, locale 저장, `<html lang>` 동기화 구현.
3. 관리자 1개 도메인(예: 공통 액션 `common.action.*`)을 `t()`로 전환한다.
4. fallback·플레이스홀더·언어 전환·스냅샷 revision 동작을 검증한다.

완료 기준: 파일럿 라벨이 DB 값으로 렌더링, 누락 시 baseline 폴백, 회귀 없음.

### Phase 4 — 관리자 관리 UI
1. `i18n` 탭 및 언어/네임스페이스/키 목록/편집 UI 구현.
2. 상태 전이, 과거 버전 기반 신규 draft 롤백, 단건·일괄 활성화 연결.
3. 번역 진행률(누락 키) 뷰.

완료 기준: 관리자에서 편집→활성화→즉시 반영, 이력·롤백 정상.

### Phase 5 — 라벨 전면 전환
1. 용어 사전 매핑대로 도메인 단위 커밋으로 하드코딩 라벨을 키로 치환.
2. 영문 하드코딩 라벨(`Section 이름` 등) 제거, 한/영 동시존재 문자열 통합.
3. 용어 사전 기준으로 `타입`→`유형`, `아이템`→`항목`, `Key` 라벨→`식별자`를 적용한다.
4. 데이터·설정 변경은 `수정`, 문서·콘텐츠·레이아웃 작업은 `편집`으로 구분한다.

완료 기준: 관리자 하드코딩 라벨 0건(검사 스크립트), 화면 회귀 없음.

### Phase 6 — 확장 및 정리
1. 열거형 저장 값과 표시 라벨 분리 확정(마이그레이션 필요 여부 확인).
2. 애플리케이션 감사 기록 외에 DB 트리거 기반 감사 보강이 필요한지 결정한다.
3. Create Promo / Wizard / Web Output의 **제작 도구 UI**로 전환을 확대한다.
4. 생성 페이지에서 사용자 등록 콘텐츠만 출력되고 locale key·baseline placeholder가 삽입되지 않는지 검증한다.

완료 기준: 저장 데이터 마이그레이션 영향 문서화, 전체 페이지의 제작 도구 UI 라벨 i18n 적용, 생성 콘텐츠 비대상 경계 유지.

## 10. 파일별 변경 매트릭스

| 파일 | 변경 유형 | 지침 |
|---|---|---|
| `db/migrations/027_locale_messages.sql` | 신규 | 스키마만, 010 규약 준수 |
| `locales/ko.json`, `locales/en.json` | 신규 | 용어 사전 기준 baseline |
| `scripts/seed-locale-baseline.js` | 신규 | 명시적·idempotent baseline seed |
| `api/_locale-message-store.js` | 신규 | version 상태 전이·스냅샷 조회, 읽기 시 seed 금지 |
| `api/locales.js` | 신규 | 지원 언어 목록/추가/수정 |
| `api/locale-default.js` | 신규 | 기본 언어 지정 및 보호 |
| `api/locale-messages.js` | 신규 | 관리용 키 목록 |
| `api/locale-snapshot.js` | 신규 | revision/ETag 포함 런타임 active 스냅샷 |
| `api/locale-message.js` | 신규 | 생성/수정(draft) |
| `api/locale-message-activate.js` | 신규 | 활성화 |
| `api/locale-messages-activate.js` | 신규 | 선택 키/locale draft 일괄 활성화 |
| `api/locale-message-archive.js` | 신규 | 보관 |
| `api/locale-message-rollback.js` | 신규 | 과거 값을 신규 draft로 복원 |
| `api/locale-message-history.js` | 신규 | 이력 조회 |
| `prototype/i18n-runtime.js` | 신규 | 공통 locale, snapshot, fallback, `t()`, subscribe |
| `prototype/shared-shell.js` | 수정 | 공통 런타임 사용 및 언어 선택 UI 연동 |
| `prototype/app-components.css` | 수정 | 공통 `.app-table`이 필요한 경우 토큰 기반으로 추가 |
| `prototype/index.html` | 수정 | `i18n` 탭 + 관리 UI + 라벨 키 치환 |
| `visual-editor/src/` | 수정 | 필요 시 공통 런타임 Vue 어댑터 연결 |
| `package.json` | 조건부 수정 | Vue 어댑터에 `vue-i18n`을 선택할 경우에만 의존성 추가 |
| `scripts/` | 신규 | baseline 유효성·하드코딩 라벨 검사 |

## 11. 자동 테스트 계획

- **스키마**: 마이그레이션 idempotent, `(locale,key,version)` unique, active/draft partial unique, 상태 check 제약.
- **store**: active 유지 상태에서 신규 draft 생성 → activate 시 기존 active 강등 → revision·audit 기록 → 과거 값으로 신규 draft 롤백.
- **API 계약**: 미지원 locale 400, 비표준 locale 정규화, 잘못된 key/placeholder 400, active-only 스냅샷과 ETag.
- **baseline 정합**: `ko.json`/`en.json` 키 집합 동일성 검사(누락 키 리포트).
- **하드코딩 검사**: 전환 완료 도메인의 사용자 UI 속성·HTML·JS 라벨을 검사하되 사용자 콘텐츠·fixture·허용된 개발 로그는 allowlist로 분리.
- **브라우저 회귀**: 언어 전환, baseline 초기 렌더링, 활성 즉시 재검증, fallback, `<html lang>` 동기화.
- **콘텐츠 경계**: 생성 페이지에는 사용자 등록값만 출력하고 미입력 항목·관리자 locale key·baseline placeholder를 출력하지 않음.

## 12. 리스크와 완화책

| 리스크 | 완화 |
|---|---|
| 저장 값과 표시 라벨 혼동으로 데이터 마이그레이션 유발 | 열거형은 코드 값 유지, 표시만 i18n. Phase 6 에서 별도 확인 |
| 스냅샷 API 실패 시 라벨 공백 | 번들 baseline + 키 문자열 폴백 필수 |
| 미검증 value 로 XSS | 서버 sanitize + 허용 플레이스홀더 allowlist + 텍스트 렌더링(HTML 비허용) |
| active 중복 | DB partial unique 인덱스로 강제 |
| 대량 라벨 치환 회귀 | 도메인 단위 커밋 + 화면별 스크린샷 비교 |
| 신규 언어 추가 시 누락 키 | 번역 진행률 뷰 + baseline 대비 누락 키 검사 |
| 신규 언어에 repo baseline 없음 | 요청 locale DB → 기본 locale DB/baseline → key 순 fallback |
| 서버리스 cold start seed 경합 | 읽기 경로 seed 금지, 명시적 idempotent seed 스크립트 사용 |
| 키별 활성화로 번역 버전 혼합 | 선택 키/locale 전체 일괄 활성화 + snapshot revision 증가 |
| 프레임워크별 번역 로직 중복 | 프레임워크 독립 런타임 + Vue/Vanilla 얇은 어댑터 |
| 프로모션 콘텐츠가 관리자 번역으로 오염 | Layer A 제작 도구 UI만 i18n 적용, 최종 콘텐츠 경계 테스트 |

## 13. Definition of Done

1. `locale_message_keys`/`locale_message_versions`/`locale_message_audit_logs` 스키마와 명시적 baseline seed가 동작한다.
2. 관리자 `i18n` 탭에서 언어별 키를 조회·편집·활성·보관·롤백할 수 있다.
3. 런타임이 active 스냅샷으로 렌더링하고, 실패 시 baseline 으로 폴백한다.
4. 관리자 하드코딩 라벨이 키로 전환되고 한/영 동시존재·동의어가 제거된다.
5. 저장 값(코드)과 표시 라벨이 분리되어 데이터 마이그레이션 영향이 문서화된다.
6. locale 코드는 canonical BCP 47 형식과 DB의 활성 언어 목록으로 검증되며 기본 언어는 항상 활성 상태로 유지된다.
7. 전체 자동 테스트·문법 검사·브라우저 회귀가 통과한다.
8. Create Promo 생성 페이지에는 사용자 등록 콘텐츠만 출력되고 관리자 locale key, baseline 문구, 편집기 placeholder가 포함되지 않는다.

## 14. 구현 시 LLM 작업 지침

1. 작업 전 `git status --short`·브랜치 확인, 미커밋 변경 보존.
2. 선택 Phase 의 관련 파일·마이그레이션·store 를 먼저 읽는다.
3. 기존 프롬프트 템플릿/감사 로그 패턴을 그대로 미러링한다(새 규약 임의 도입 금지).
4. 라벨 치환은 도메인 단위 커밋, 치환 전후 화면 회귀 확인.
5. 열거형 저장 값은 건드리지 않는다. 표시 라벨만 키화한다.
6. 사용자·AI가 만든 프로모션 콘텐츠를 locale message로 변환하거나 fallback 문구로 대체하지 않는다.
7. 각 Phase 완료 후 테스트 결과·잔여 이슈·변경 파일을 handoff 에 기록한다.
8. 한 Phase 완료 전 다음 Phase 를 시작하지 않는다.

## 15. 2026-07-22 개발 반영 기록

### 15.1 반영 완료

- Phase 0: `ko`/`en` baseline 107개 키, 키·placeholder·용어 계약 테스트, 관리자 라벨 추출 스크립트 작성.
- Phase 1 코드: 마이그레이션 027, locale store, 명시적·idempotent baseline seed 작성. active/draft partial unique, revision, audit, 신규 draft 롤백 계약 반영.
- Phase 2: 언어 CRUD·기본 언어·관리 메시지·snapshot·초안·단건/일괄 활성화·보관·롤백·이력 API 작성.
- Phase 3: 프레임워크 독립 `prototype/i18n-runtime.js` 작성. baseline→요청 locale active→기본 locale active/baseline→key 폴백, placeholder, locale 저장, `<html lang>`, ETag 재검증, 구독 반영.
- Phase 4: 관리자 `언어 및 문구 관리` 탭 작성. 언어 추가/활성 상태/기본 언어, 분류 필터, 번역 진행률, 초안 저장, 단건·선택 활성화, 보관, 이력, 과거 버전 기반 신규 초안 기능 연결.
- 공통 셸 1차: 관리자·Create Promo·Promo Wizard·Visual Editor·Generated host가 공통 런타임을 로드하고 셸 탐색 문구를 locale 메시지로 렌더링.
- 콘텐츠 경계: 생성 프로모션 렌더러와 사용자·AI 입력 데이터 구조는 수정하지 않았고, 생성 소스에 관리자 i18n 의존성이 없음을 계약 테스트로 고정.

### 15.2 검증 결과

- `pnpm run check`: 통과.
- 전체 자동 테스트: 39개 테스트 파일 통과.
- 추가 테스트: baseline/store/API, 런타임 동작, 관리자 UI 계약, 생성 콘텐츠 비대상 경계.
- 참고: 로컬 번들 Node 24에서 실행되어 프로젝트 지정 Node 22와 engine 경고가 발생했으나 테스트 실패는 없었다.
- 디버깅 보완: 관리 대상 언어 변경 시 이전 언어의 선택 키·편집 값·이력이 남아 다른 언어 초안에 잘못 적용될 수 있던 상태 오염을 수정했다. 전환 시 편집 상태 초기화, `<html lang>` 및 공통 셸 갱신을 브라우저 테스트로 고정했다.

### 15.3 배포 전 잔여 작업

1. 로컬 환경에 `DATABASE_URL`이 없어 마이그레이션 027과 baseline seed를 실제 Neon DB에 적용·검증하지 못했다.
2. 저장소에 공통 migration runner가 없으므로 Neon SQL Editor 또는 팀 표준 DB 배포 절차로 `db/migrations/027_locale_messages.sql`을 적용한 뒤 `node scripts/seed-locale-baseline.js`를 한 번 실행해야 한다.
3. Phase 5의 관리자 전체 하드코딩 문구 전환은 별도 도메인 단위 작업으로 남아 있다. 이번 반영은 공통 액션 파일럿과 신규 관리 화면·공통 셸 범위다.
4. Phase 6의 Create Promo/Wizard 제작 도구 본문 라벨 전환과 실제 배포 브라우저 회귀는 DB 적용 후 진행한다. 최종 프로모션 콘텐츠는 계속 비대상으로 유지한다.
