# Wizard Content Sections 관리자 기능 보완 개발 계획서

- 작성일: 2026-07-14
- 상태: 코드 리뷰 반영 개발 계획 / 소스코드 미수정
- 기준 문서:
  - `docs/handoff-2026-07-14.md`
  - `docs/wizard-content-section-admin-management-prd-2026-07-14.md`
  - `docs/claude/review-admin-page-source-2026-07-14.md`
- 대상 코드:
  - `prototype/index.html`, `prototype/app.js`
  - `prototype/promo-wizard.js`, `prototype/promo-wizard.css`
  - `api/wizard-content-section*.js`
  - `api/_wizard-content-sections-store.js`
  - `db/migrations/016_wizard_content_sections.sql`

## 1. 목적

2026-07-14에 구현된 Wizard Content Sections 관리자 기능은 DB, API, 관리자 UI, Wizard 동적 렌더링의 기본 구조를 갖췄다. 그러나 코드 리뷰에서 운영 반영 전에 해결해야 할 데이터 유실, 버전 전환 원자성, fail-open 검증, 설정 미반영, 반복 콘텐츠 회귀 및 인증 문제가 확인되었다.

이 계획의 목적은 다음과 같다.

- 기존 Wizard 사용자 입력값을 보존한다.
- 관리자 설정의 draft/active/archive 전환을 원자적으로 처리한다.
- 설정 로드 실패나 잘못된 설정에서 LO-FI 생성을 차단한다.
- 관리자에서 제공한 필수·잠금·이미지·CTA 설정을 Wizard와 payload에 정확히 반영한다.
- 기존 Step Bar 및 Image Text Row 반복 구조를 복원한다.
- 관리자 쓰기 API를 인증된 사용자만 호출할 수 있게 한다.
- DB migration과 실제 브라우저 E2E를 거친 뒤 배포한다.

## 2. 현재 상태 평가

### 구현 완료

- 섹션/아이템 DB 초안
- draft/active/inactive/archived 상태 모델
- 관리자 섹션 및 아이템 CRUD UI
- 공개 섹션 정의 조회 API
- Wizard Step 2 동적 필드 렌더링
- 동적 sectionConfig payload 생성
- 신규 JavaScript/API 문법 검사 통과

### 운영 배포 차단 이슈

1. 기존 localStorage 키 변경에 따른 입력 데이터 유실
2. 활성화/초안 복제의 비원자적 처리
3. Active 섹션 직접 보관 가능
4. 섹션 설정 로드 실패 시 불완전한 payload로 진행 가능
5. 필수/잠금/alt/CTA/UTM 설정의 부분 미반영
6. Step Bar/Image Text Row 반복 구조 회귀
7. 관리자 API 인증·인가 없음
8. migration 및 브라우저/API E2E 미실행

위 항목이 해결되기 전에는 migration을 production DB에 적용하지 않는다.

## 3. 목표 동작

```text
Admin creates or clones draft
  → edits section/items
  → server validates complete draft
  → atomic activation
  → Wizard loads one immutable active configuration snapshot
  → existing content is migrated without loss
  → required/locked/repeatable rules are enforced
  → validated payload proceeds to Integrated Brief/LO-FI
```

## 4. P0 — 기존 데이터 보존 및 호환성

### 4.1 문제

기존 저장 구조와 신규 seed 구조의 키가 다르다.

| 기존 키 | 신규 키 |
|---|---|
| `header.logoText` | `header.logo` |
| `header.badgeText` | `header.badges` |
| `heroBanner.leaderText` | `heroBanner.leadText` |
| `heroBanner.cta` | `heroBanner.button` |
| `stepBar[]` | `stepBar` 단일 객체 |
| `contentCta.longText` | `contentCta.description` |
| `contentCta.cta` | `contentCta.button` |
| `imageTextRow[]` | `imageTextRow` 단일 객체 |

현재 `mergeSectionInputs()`는 신규 정의에 없는 키를 버리므로 기존 입력값이 사라진다.

### 4.2 권장 수정

`migrateSectionInputs(saved, fromVersion, definitions)`를 추가하고 merge 전에 실행한다.

```text
load localStorage
→ detect legacy schema
→ copy values to new keys
→ preserve repeatable arrays
→ merge active definitions
→ save migrated schemaVersion
```

localStorage에 다음 값을 추가한다.

```json
{
  "sectionInputSchemaVersion": 2
}
```

마이그레이션은 idempotent해야 하며 기존 값과 신규 값이 모두 있으면 신규 값을 우선한다. 마이그레이션 완료 전에는 원본 snapshot을 별도 backup key에 1회 보관한다.

### 4.3 서버 payload 호환

백엔드가 현재 참조하는 legacy key를 조사하고 전환 기간에는 canonical accessor를 사용한다.

```text
hero.button ?? hero.cta
content.description ?? content.longText
```

새 run은 canonical schema로 저장하되 기존 run 조회/재생성은 legacy schema도 읽을 수 있어야 한다.

### 4.4 완료 조건

- 기존 localStorage fixture가 신규 구조로 손실 없이 변환됨
- 신규 구조에 이미 입력한 값은 덮어쓰지 않음
- 새로고침을 반복해도 중복 마이그레이션되지 않음
- 기존 run resume가 동작함
- Step 2 → Integrated Brief payload의 콘텐츠가 변경 전과 동등함

## 5. P0 — 원자적 버전 lifecycle

### 5.1 활성화

다음 작업을 하나의 DB transaction으로 묶는다.

1. target row를 lock하고 존재/상태 확인
2. 동일 `section_key`의 current active row lock
3. target draft 완전성 검증
4. current active를 inactive로 변경
5. target을 active로 변경
6. history 2건 기록
7. commit

어느 단계든 실패하면 전체 rollback하여 기존 active를 유지한다.

동시 활성화 요청은 DB unique index와 row lock으로 직렬화한다. unique violation은 500이 아니라 409로 반환한다.

### 5.2 초안 복제

다음 작업도 transaction으로 묶는다.

1. source와 동일 key의 모든 버전 lock
2. `max(version) + 1`로 새 version 산정
3. draft row 생성
4. item 전체 bulk copy
5. history 기록
6. commit

`source.version + 1` 방식은 이전 버전을 다시 활성화한 경우 기존 version과 충돌할 수 있으므로 사용하지 않는다.

### 5.3 보관 정책

- active 버전 직접 보관 금지
- active 보관 요청은 409 반환
- UI에서 active의 `보관` 버튼 비활성화
- draft/inactive만 보관 가능
- active 섹션 자체를 Wizard에서 제거하려면 새 draft에서 `isVisibleInWizard=false`로 설정 후 활성화

이 방식은 설정 변경 이력을 보존하고 Wizard가 갑자기 active definition을 잃는 것을 방지한다.

### 5.4 완료 조건

- 활성화 중 의도적 오류가 발생해도 기존 active 유지
- 동일 key에 active가 0개 또는 2개가 되지 않음
- 동시 활성화 요청 중 하나만 성공
- item 복사 실패 시 불완전한 draft가 남지 않음
- 과거 버전에서 clone해도 version 충돌 없음

## 6. P0 — 설정 로드 fail-closed

### 6.1 문제

Wizard 공개 설정 조회 실패 시 `wizardSectionDefinitions=[]` 상태로 남지만 기본 프로모션 필드만 통과하면 다음 단계로 진행할 수 있다.

### 6.2 수정 방향

Step 2 진행 조건에 configuration gate를 추가한다.

```text
definitionsLoading = true  → Next disabled
definitionsError exists    → Next disabled + 다시 불러오기
definitions.length = 0     → Next disabled + fatal message
active config invalid      → Next disabled + config error
```

`buildWizardPayload()`와 LO-FI 시작 함수에서도 UI와 별개로 동일 검증을 다시 실행한다.

공개 설정 응답에는 `configRevision` 또는 hash를 포함한다. run 생성 시 이를 snapshot에 저장해 진행 중인 run이 관리자 설정 변경으로 흔들리지 않게 한다.

### 6.3 fallback 정책

DB 장애 시 임의로 빈 설정을 사용하지 않는다. 필요하면 코드 내 read-only emergency fallback을 둘 수 있지만 다음 조건을 만족해야 한다.

- fallback 사용 사실을 UI와 payload metadata에 기록
- seed와 동일한 canonical schema
- 관리자가 명시적으로 허용한 경우에만 사용

기본 정책은 fail-closed다.

## 7. P1 — 관리자 설정 검증 계약 완성

### 7.1 Section 필수 규칙

`section.isRequired=true` 의미를 다음처럼 확정한다.

- visible item이 최소 1개 있어야 함
- visible item 중 최소 1개는 `isRequired=true`여야 함
- required item이 모두 채워져야 section 완료

활성화 전에 서버가 이 규칙을 검증한다.

### 7.2 Item별 검증

#### Text

- required: trim 후 비어 있지 않아야 함
- locked: lockedValue가 문자열이며 비어 있지 않아야 함

#### CTA

- required: label과 URL 모두 필수
- URL: `https`, `http`, 허용된 상대 경로 또는 정책상 허용 scheme만 지원
- UTM: 관리자 설정을 실제 URL에 병합
- 기존 query parameter 보존
- 중복 UTM key 처리 규칙 정의

#### Image

- allowedSources가 최소 1개 이상
- 선택된 source가 allowlist에 포함
- `file`: 실제 업로드 완료 asset ID 필요
- `url`: 허용 protocol 및 URL 검증
- `ai`: AI prompt text 필수
- `altTextRequired=true`: alt 필수
- maxSizeKb 및 aspectRatio 검증

### 7.3 잠금값

`isLocked=true`이면 `lockedValue`를 반드시 요구한다. fieldKind별 schema를 검증한다.

```text
text  → string
cta   → { label, link }
image → { source, value, alt }
```

`false`, `0`, `""`를 truthy 검사로 null 처리하지 않고 `value !== null && value !== undefined`로 직렬화한다. 단, 필수 locked text의 빈 문자열은 validation error로 처리한다.

Wizard의 `contentErrors()`는 locked item을 무조건 건너뛰지 않고 서버에서 검증된 lockedValue가 실제로 적용됐는지 확인한다.

### 7.4 활성화 전 validation endpoint

활성화 API 내부에 검증을 포함하고, 선택적으로 관리자 UI에서 사전 확인할 수 있는 endpoint를 둔다.

```http
POST /api/wizard-content-section-validate
```

응답 예:

```json
{
  "ok": false,
  "errors": [
    { "path": "heroBanner.button.link", "code": "REQUIRED_URL", "message": "CTA URL이 필요합니다." }
  ]
}
```

## 8. P1 — 반복 콘텐츠 모델 복원

### 8.1 대상

- Step Bar: 기본 3개, N개 가능
- Image Text Row: N개 가능
- 향후 반복 가능한 card/benefit/step section

### 8.2 데이터 모델

section 또는 item에 반복 메타데이터를 추가한다.

```text
repeat_mode: none | group
min_items: integer
max_items: integer | null
default_items: integer
item_group_key: text
```

권장 모델은 “아이템 하나를 반복”하기보다 “필드 그룹을 반복”하는 것이다.

```json
{
  "sectionKey": "stepBar",
  "repeatableGroup": {
    "min": 1,
    "default": 3,
    "max": 6,
    "fields": ["title", "description", "ctaButton"]
  }
}
```

Wizard 값:

```json
{
  "stepBar": [
    { "title": "Step 1", "description": "...", "ctaButton": { "label": "", "link": "" } }
  ]
}
```

### 8.3 UI

- 관리자: 반복 가능 여부, min/default/max 설정
- Wizard: `항목 추가`, `삭제`, 순서 이동
- min 이하 삭제 차단, max 이상 추가 차단
- locked field는 모든 반복 row에 적용하거나 row별 고정 정책을 명시

### 8.4 하위 호환

기존 `stepBar[]`, `imageTextRow[]` 값을 그대로 canonical 반복 구조로 채택하면 migration 비용이 줄어든다. 단일 객체로 축소된 현재 seed는 migration 적용 전에 수정한다.

## 9. P1 — 이미지 업로드 기능 정합성

현재 `file` source를 설정할 수 있지만 Wizard에는 실제 file picker/upload가 없다.

선택지는 두 가지다.

### 권장

- 1차 production 범위에서는 `file` source를 관리자 UI에서 비활성화
- URL/AI source만 활성화
- 별도 upload API, Blob 저장, MIME/크기 검증 완성 후 file source 활성화

### 향후 업로드 계약

```text
Select file
→ validate MIME/size/dimension
→ upload to Blob
→ store assetId/url/hash
→ include in sectionInputs
→ persist in run snapshot
```

단순 브라우저 임시 URL이나 base64를 run payload에 직접 저장하지 않는다.

## 10. P0/P1 — 관리자 인증·인가

### 단기 PoC 보호

- Vercel Deployment Protection 또는 사내 접근 제한 활성화
- public deployment에서는 관리자 쓰기 API를 노출하지 않음

### 운영 권장

- 서버 검증 가능한 로그인/session 적용
- 관리자 role을 가진 사용자만 쓰기 가능
- `GET scope=public`만 인증 없이 허용
- admin list/detail/history와 모든 POST/PATCH/DELETE/activate/archive는 관리자 권한 필요
- 변경 history에 actor ID/email 기록
- CSRF 방어와 rate limit 적용

정적 프론트 코드에 `x-admin-token` 값을 하드코딩하는 방식은 비밀이 노출되므로 사용하지 않는다.

## 11. API 오류 및 동시성 표준화

다음 오류 코드를 일관되게 반환한다.

| 상황 | HTTP |
|---|---:|
| 입력 형식 오류 | 400 |
| 인증 없음 | 401 |
| 관리자 권한 없음 | 403 |
| 대상 없음 | 404 |
| draft/version/active 충돌 | 409 |
| validation 실패 | 422 |
| DB/서버 오류 | 500 |

DB constraint violation을 그대로 500으로 노출하지 않고 unique/check/FK 오류를 도메인 오류로 매핑한다. 응답에는 내부 SQL 또는 credential 정보를 포함하지 않는다.

## 12. DB migration 보완

기존 `016`이 아직 적용되지 않았으므로 새 migration을 추가하기보다 적용 전 `016`을 수정할 수 있다. 이미 일부 환경에 적용됐다면 `017` 보완 migration으로 분리한다.

보완 항목:

- repeatable group 컬럼/테이블
- image source JSON 유효성 또는 애플리케이션 validation
- `image_max_size_kb > 0` check
- section/item key 정규식 check 검토
- history actor 컬럼
- version 생성 동시성 보장
- seed key를 기존 canonical payload와 호환되도록 재설계
- active 직접 archive 방지는 API와 transaction 함수에서 적용

seed는 “화면이 비슷함”이 아니라 기존 payload fixture와 deep equality에 가까운 수준으로 검증한다.

## 13. 테스트 계획

### 13.1 Unit/contract

- legacy → canonical migration fixture
- lockedValue의 `false`, `0`, 빈 값 처리
- CTA UTM 병합
- required text/CTA/image/alt 검증
- public response schema
- sectionConfig 및 buildWizardPayload snapshot
- repeatable group serialization

### 13.2 DB integration

- create → clone draft → edit → activate → archive
- activation rollback
- clone rollback
- concurrent activation
- max(version)+1
- active archive 거부
- history actor/state 기록

테스트 전용 Neon branch 또는 transaction rollback DB를 사용한다.

### 13.3 Browser E2E

관리자:

- 새 섹션/아이템 생성
- draft 저장 및 validation 오류 표시
- 활성화 후 Wizard 반영
- active 보관 버튼 차단
- 잠금값 표시
- 반복 group 설정

Wizard:

- 설정 로딩/실패/retry
- 기존 localStorage migration
- 필수 항목 validation
- 반복 항목 추가/삭제/순서
- URL/AI 이미지 입력
- 새로고침 복원
- LO-FI payload 확인

### 13.4 Generation regression

```text
Concept
→ Content
→ Integrated Brief
→ LO-FI
→ Confirm Draft
→ Final Design
```

실제 production-like run에서 전체 흐름과 content coverage를 확인한다.

## 14. 단계별 구현 순서

### Phase 1 — 배포 차단 이슈 수정

1. 기존 localStorage/payload migration
2. 설정 로드 fail-closed
3. active archive 차단
4. activate/clone transaction
5. max(version)+1 및 동시성 처리

### Phase 2 — 설정 계약 완성

1. section/item validation schema
2. lockedValue 타입 검증
3. CTA URL/UTM 적용
4. image source/alt validation
5. 활성화 전 validation UI

### Phase 3 — 반복 구조 복원

1. repeatable group DB 모델
2. 기존 seed 및 migration 수정
3. 관리자 반복 설정 UI
4. Wizard 반복 입력 UI
5. payload/backend compatibility

### Phase 4 — 인증 및 감사

1. 관리자 session/role 검사
2. API 공통 authorization helper
3. history actor 기록
4. CSRF/rate limit

### Phase 5 — QA 및 배포

1. 문법/contract/unit 테스트
2. migration dry run
3. DB integration
4. desktop/mobile browser E2E
5. 생성 pipeline 회귀 테스트
6. staging 적용
7. production migration 및 배포

## 15. 파일별 예상 변경

### Frontend

- `prototype/app.js`: validation 결과, lifecycle 제한, repeatable 설정, 인증 오류 처리
- `prototype/index.html`: active archive 차단, validation UI, 반복 설정 UI
- `prototype/promo-wizard.js`: legacy migration, fail-closed, 동적 validation, repeatable fields, UTM/image 적용
- `prototype/promo-wizard.css`: 오류/반복 group/upload 상태

### API

- `_wizard-content-sections-store.js`: transaction, max version, validation helpers
- `wizard-content-sections.js`: clone/create 충돌 처리, auth
- `wizard-content-section.js`: validation, auth
- `wizard-content-section-items.js`: typed lockedValue 및 field validation
- `wizard-content-section-activate.js`: atomic activation + validation
- `wizard-content-section-archive.js`: active archive 거부
- 신규 공통 admin authorization helper
- 선택적으로 `wizard-content-section-validate.js`

### DB/Tests

- `016` 수정 또는 `017` 보완 migration
- Wizard section contract/unit/integration test 추가
- Browser E2E 시나리오 추가

## 16. Definition of Done

- 기존 Step 2 저장값이 손실 없이 신규 schema로 이전된다.
- 설정 API가 실패하면 불완전한 payload로 다음 단계에 갈 수 없다.
- 한 sectionKey에는 항상 active가 정확히 하나 존재한다. 의도적으로 비노출하려면 active row의 visible=false를 사용한다.
- 활성화와 초안 복제는 실패 시 완전히 rollback된다.
- active 버전은 직접 보관할 수 없다.
- section/item 필수 규칙, CTA URL/UTM, image alt/source, lockedValue가 실제 Wizard와 payload에 반영된다.
- Step Bar와 Image Text Row의 N개 반복 입력이 복원된다.
- 관리자 쓰기 API는 인증·권한 없이 호출할 수 없다.
- migration dry run, API integration, browser E2E, generation regression이 통과한다.
- Handoff 문서에 적용 migration, 테스트 run, 미해결 이슈 및 rollback 방법이 기록된다.

## 17. 최종 권고

현재 구현을 바로 migration/배포하기보다 P0 항목을 먼저 해결해야 한다. 특히 기존 데이터 migration과 active lifecycle transaction은 사후 복구보다 사전 수정 비용이 훨씬 낮다.

권장 우선순위는 다음과 같다.

```text
데이터 보존
→ lifecycle 원자성
→ fail-closed
→ 설정 validation 완성
→ 반복 구조 복원
→ 인증·인가
→ DB/브라우저/생성 E2E
→ 배포
```

이 순서로 진행하면 관리자 설정 기능을 추가하면서도 기존 Wizard 생성 흐름과 사용자 입력을 안전하게 유지할 수 있다.
