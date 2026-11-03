# Promo Service Contract V3 구현 및 Rollout 인수인계

```yaml
status: Blocked
updated_at: 2026-11-03
repository: https://github.com/howardchoi-nsus/promo_web_builder.git
branch: codex/promo-service-v3
source_baseline: 35e97e5
blocker: PREVIEW_DATABASE_URL Neon 인증 실패
production_changed: false
audience:
  - 후속 작업을 수행하는 LLM
  - Backend
  - AI
  - CMS
  - Infra
  - QA
```

## 1. 목적과 핵심 결론

이 문서는 Promo Service Contract V3 구현과 Preview Rollout의 실제 진행 상태를 다른 LLM이나 개발자가 대화 이력 없이 이어가기 위한 실행 기준이다.

핵심 결론은 다음과 같다.

1. V3 계약, API, 저장 계층, UI 연동과 Migration 소스 구현은 완료됐다.
2. 전체 테스트 190개와 Admin, Visual Editor, Nuxt Runtime Build가 통과했다.
3. Git 브랜치와 원격은 `35e97e5`로 동기화됐고 최신 Git 연동 Preview도 `READY`다.
4. Migration `070`은 Preview와 Production DB 어디에도 적용되지 않았다.
5. Preview Migration은 Neon `neondb_owner` 비밀번호 인증 오류 `28P01`로 Transaction 시작 전에 중단됐다.
6. Preview V3 Feature Flag는 안전하게 `false`로 복구했다.
7. Production Migration과 Production 배포는 수행하지 않았다.
8. 다음 작업은 Neon Preview Branch를 만들거나 기존 Branch의 연결 문자열을 복구한 뒤 `PREVIEW_DATABASE_URL`을 교체하는 것이다.

## 2. 현재 기준점

### 2.1 Git

| 항목 | 값 |
|---|---|
| 저장소 | `howardchoi-nsus/promo_web_builder` |
| 작업 브랜치 | `codex/promo-service-v3` |
| V3 Source Baseline | `35e97e5` |
| 인수인계 문서 Commit | 이 파일을 추가한 최신 Commit, `git log -1`로 확인 |
| Remote 기준점 | 문서 작성 시작 시 `35e97e5` |
| 작업 트리 | 문서 Commit 기준 깨끗함 |
| Production Branch | `main` |

주요 커밋:

| 커밋 | 내용 | 최종 소스 포함 여부 |
|---|---|---|
| `764bf81` | Promo Service Contract V3 기반 구현 | 포함 |
| `f23deae` | Visual Editor 생성 번들 갱신 | 포함 |
| `f8a9fd4` | Rollout용 임시 Migration Runner 추가 | 이후 제거 |
| `2aea6ed` | 임시 Migration Runner 제거 | 포함 |
| `35e97e5` | Preview Rollout 결과와 DB 차단 사유 문서화 | 포함 |

`f8a9fd4`의 임시 API는 Git 이력에만 존재한다. 최종 소스에는 다음 경로가 없어야 한다.

```text
api/internal/v3/apply-migration-form.js
api/internal/v3/apply-preview-migration.js
```

### 2.2 Vercel

| 항목 | 값 |
|---|---|
| Project | `promo-web-builder` |
| Project ID | `prj_C51QagWdujtAe5QoNDM0wUcJt09r` |
| Team ID | `team_x5RiTN64hhaxHALcTkfKRxdd` |
| 최신 Preview Deployment | `dpl_7Fpjs8ozKWHiKXFZsznr9DmuNh5R` |
| 최신 Preview Commit | `35e97e5` |
| 최신 Preview 상태 | `READY` |
| 최신 Preview URL | `https://promo-web-builder-litrac0ey-howardchoi-nsus-projects.vercel.app` |
| 현재 Production Deployment | `dpl_2NiNMUFUYB5Fr3nS27ni1N3Hdskr` |
| 현재 Production Commit | `46289d9` |
| 현재 Production 상태 | `READY`, V3 미반영 |

Preview는 Vercel Deployment Protection이 적용돼 있다. 자동 검증에는 Vercel 인증 세션, 임시 공유 링크 또는 정식 CI Bypass/OIDC 경로가 필요하다. Deployment Protection을 끄지 않는다.

### 2.3 환경 변수

| 변수 | 환경 | 현재 상태 |
|---|---|---|
| `PREVIEW_DATABASE_URL` | Preview | 존재하지만 Neon 비밀번호 인증 실패 |
| `PROMO_SERVICE_V3_TOKEN` | Preview | Sensitive 값으로 설정 완료 |
| `PROMO_SERVICE_CONTRACT_V3_ENABLED` | Preview | `false` |
| `PROMO_SERVICE_V3_TOKEN` | Production | 설정하지 않음 |
| `PROMO_SERVICE_CONTRACT_V3_ENABLED` | Production | V3 Rollout용 값 설정하지 않음 |

Secret 값은 문서, 로그, 채팅 또는 Git에 기록하지 않는다. Production Token은 Preview Token과 다른 값으로 생성해야 한다.

## 3. 구현된 V3 범위

### 3.1 공용 계약

주요 파일:

- `packages/promo-contracts/src/service-v3.mjs`
- `packages/promo-contracts/src/index.mjs`

포함 계약:

- Promo Request
- Generation Job
- Generation Context
- Approval
- Publication Command
- Version 3 Domain Event
- Feedback와 Cancel Event

### 3.2 사용자 서비스 API

| Method | API | 기능 |
|---|---|---|
| POST | `/api/v3/promo-requests` | 사용자 요청 생성 |
| GET | `/api/v3/promo-requests?requestId={id}` | Request, Job, Document, Approval 상태 조회 |
| POST | `/api/v3/promo-requests/{id}/feedback` | 사용자 수정 의견 저장 |
| POST | `/api/v3/promo-requests/{id}/regenerate` | 피드백 기반 재생성 |
| POST | `/api/v3/promo-requests/{id}/review` | 승인 또는 반려 |
| POST | `/api/v3/promo-requests/{id}/cancel` | Request와 활성 Job 취소 |
| POST | `/api/v3/publications` | 승인 Snapshot 발행 |

### 3.3 내부 LLM 및 Context API

| Method | API | 기능 |
|---|---|---|
| POST | `/api/internal/v3/generation-jobs` | Generation Job 생성 |
| GET | `/api/internal/v3/generation-jobs?jobId={id}` | Job 상태와 결과 조회 |
| GET | `/api/internal/v3/generation-context` | CMS 생성 Context 조회 |
| POST | `/api/internal/v3/outbox-dispatch` | Domain Event Projection과 재처리 |

내부 API는 `PROMO_SERVICE_V3_TOKEN` Bearer 인증을 요구한다. Hosted 환경에서 Token이 없거나 32자 미만이면 접근을 허용하지 않는다.

### 3.4 기존 시스템 Adapter

- 기존 Integrated Brief와 n8n Worker 실행 경로를 Generation Job Adapter로 재사용한다.
- 기존 `promo_generation_runs`를 Legacy Run Reference로 연결한다.
- 기존 Builder Document와 Revision을 Draft 결과로 사용한다.
- 기존 Publication 경로는 V3 활성 시 승인 Snapshot 기반 Publication API를 사용하도록 차단 경계를 추가했다.
- AI Builder는 V3 Capability가 켜졌을 때 Request V3를 생성한다.
- Publication Manager는 승인과 발행 동작을 분리한다.

### 3.5 데이터 경계

Migration 파일:

```text
db/migrations/070_promo_service_contract_v3_foundation.sql
```

생성 대상 Schema:

```text
user_service
llm_runtime
cms
web_output
```

주요 테이블:

```text
user_service.promo_requests
user_service.promo_request_feedback
llm_runtime.generation_jobs
cms.promotion_approvals
web_output.publication_snapshots
<각 schema>.domain_outbox
```

Migration은 Additive이며 `begin`과 `commit`으로 감싸져 있다. 현재 Preview와 Production 어느 DB에도 적용됐다고 가정하면 안 된다.

## 4. 검증 결과

### 4.1 로컬 검증

완료된 검증:

- V3 계약 테스트
- V3 인증 테스트
- V3 Handler 테스트
- Migration Contract 테스트
- 전체 190개 테스트 파일
- Admin Build
- Visual Editor Build
- Nuxt Runtime Build
- `git diff --check`

전체 회귀 테스트의 최종 결과:

```text
All 190 test files passed
```

검증 Runtime은 번들 Node.js `24.22.1`이었고 저장소 Engine은 Node.js `22.x`다. 테스트와 Build는 통과했지만 정식 CI에서는 Node.js 22로 다시 실행하는 것이 좋다.

한 차례 Browser Smoke Test에서 `14 !== 32`가 발생했으나 단독 재실행과 이후 전체 회귀 테스트는 통과했다. 재현되지 않은 일시적 실패로 기록한다.

### 4.2 Preview 배포 검증

확인된 내용:

- V3 소스 Preview Build 성공
- V3 활성 시 Capability가 `serviceContractV3: true`, `contractVersion: 3` 반환
- 정리 배포 후 Capability가 `serviceContractV3: false`, `contractVersion: 2` 반환
- 임시 Migration 경로 제거 후 `404` 확인
- 최신 Git 연동 Preview가 `35e97e5`로 `READY`

초기 직접 업로드 Preview에서 `shared/promo-token-runtime.mjs` 누락으로 Build가 한 차례 실패했다. 이후 `shared/`를 포함한 배포와 Git 연동 배포는 성공했다. 소스 오류가 아니라 직접 업로드 파일 목록 누락이었다.

### 4.3 Migration 실패 증거

Preview Migration 응답:

```json
{
  "error": "password authentication failed for user 'neondb_owner'",
  "code": "28P01"
}
```

실패 위치는 DB 연결 단계다. Migration SQL 실행과 Transaction 시작 전이므로 다음 상태다.

- Preview DB Schema 변경 없음
- Production DB Schema 변경 없음
- Production 배포 없음

## 5. 현재 차단 이슈

### P0. Neon Preview DB 연결 복구

`PREVIEW_DATABASE_URL`은 Neon Preview 전용 Branch의 Pooled Connection String이어야 한다. 현재 값은 Endpoint에 도달하지만 `neondb_owner` 비밀번호가 유효하지 않다.

권장 구성:

```text
Neon Production Project
└── Production Branch
    └── preview/promo-service-v3 Branch
```

연결 문자열의 개념적 형태:

```text
postgresql://neondb_owner:<password>@<preview-endpoint>-pooler.<region>.aws.neon.tech/neondb?sslmode=require
```

사용자가 수행할 작업:

1. Neon Console에서 기존 Production 프로젝트를 연다.
2. Production Branch를 부모로 `preview/promo-service-v3` Branch를 만든다.
3. 해당 Branch의 Pooled Connection String을 발급한다.
4. Vercel Project의 `PREVIEW_DATABASE_URL`을 Preview 환경에만 Secret으로 저장한다.
5. 가능하면 Git Branch Scope를 `codex/promo-service-v3`로 제한한다.
6. 새 Preview Deployment를 생성한다. 환경 변수 변경은 기존 Deployment에 반영되지 않는다.

Secret을 LLM 채팅에 붙여넣지 않는다.

### P1. Production 환경 준비

Preview Release Gate 통과 전에는 실행하지 않는다.

- Preview와 다른 Production 전용 `PROMO_SERVICE_V3_TOKEN` 생성
- Production 환경에 Sensitive 값으로 저장
- `PROMO_SERVICE_CONTRACT_V3_ENABLED=false`로 사전 배포
- Production DB Backup 또는 Restore Point 생성
- Production Migration 적용과 검증
- 스모크 테스트 후 Feature Flag 활성화

## 6. 다음 LLM 실행 Runbook

### 6.1 시작 상태 확인

```bash
git switch codex/promo-service-v3
git status --short --branch
git rev-parse --short HEAD
git rev-parse --short origin/codex/promo-service-v3
```

기대값:

```text
V3 source baseline = 35e97e5
handoff document commit = git log -1로 확인
working tree clean
```

원격에 새 커밋이 있다면 먼저 내용을 검토하고 이 문서의 기준점을 갱신한다.

### 6.2 Neon Preview 연결 확인

사용자가 Vercel에서 `PREVIEW_DATABASE_URL`을 교체했다는 사실을 확인한다. Secret 값을 요청하거나 출력하지 않는다.

새 Preview를 배포한 뒤 DB 연결을 확인한다. Preview와 Production DB의 정규화된 Host와 Database Identity가 달라야 한다. 같으면 즉시 중단한다.

### 6.3 Preview Migration

권장 방식은 Neon SQL Editor에서 Preview Branch를 명시적으로 선택하고 다음 파일을 실행하는 것이다.

```text
db/migrations/070_promo_service_contract_v3_foundation.sql
```

적용 후 확인 SQL:

```sql
select
  to_regclass('user_service.promo_requests') as promo_requests,
  to_regclass('llm_runtime.generation_jobs') as generation_jobs,
  to_regclass('cms.promotion_approvals') as promotion_approvals,
  to_regclass('web_output.publication_snapshots') as publication_snapshots;
```

네 값이 모두 `null`이 아니어야 한다.

Migration Runner API를 다시 만들 경우 다음 조건을 모두 지킨다.

- Preview Deployment에서만 실행
- Bearer Token 인증 유지
- Preview와 Production DB Identity 비교
- 정확한 확인문 요구
- Transaction, Lock Timeout, Statement Timeout 사용
- 성공 또는 실패 후 Runner를 최종 소스와 배포에서 제거

### 6.4 Preview 활성화와 E2E

1. `PROMO_SERVICE_CONTRACT_V3_ENABLED=true`를 Preview에 설정한다.
2. 새 Preview를 배포한다.
3. Capability가 Contract Version 3을 반환하는지 확인한다.
4. 사용자 Request를 생성한다.
5. Generation Job과 Legacy Run Mapping을 확인한다.
6. CMS Context 조회와 Draft 저장을 확인한다.
7. Feedback과 Regenerate를 확인한다.
8. Review 승인 후 Approval Snapshot을 확인한다.
9. Publication과 Nuxt/Vercel 출력 URL을 확인한다.
10. Outbox 실패와 재처리를 확인한다.

실패하면 가장 먼저 Preview Feature Flag를 `false`로 복구하고 새 배포를 만든다.

### 6.5 Production Migration과 배포

Preview E2E와 Rollback Drill 통과 후에만 진행한다.

1. Production DB Backup 또는 Restore Point를 만든다.
2. Production DB Target Identity를 기록하고 Preview DB와 다른지 확인한다.
3. Production 전용 `PROMO_SERVICE_V3_TOKEN`을 생성해 Sensitive 값으로 저장한다.
4. `PROMO_SERVICE_CONTRACT_V3_ENABLED=false` 상태로 Production 소스를 배포한다.
5. Production DB에 Migration `070`을 적용한다.
6. Schema와 Table을 검증한다.
7. 기존 V2 사용자 흐름이 정상인지 스모크 테스트한다.
8. V3 내부 인증과 읽기 API를 검증한다.
9. Feature Flag를 `true`로 변경하고 새 Production Deployment를 만든다.
10. Request, Generation, CMS, Approval, Publication, Nuxt 출력과 Runtime Error를 확인한다.

Production Rollback 우선순위:

```text
1. PROMO_SERVICE_CONTRACT_V3_ENABLED=false
2. 새 Production Deployment로 환경 변수 반영
3. 기존 V2 흐름과 Publication 확인
4. 필요할 때만 이전 Deployment Rollback
```

Migration `070`은 Additive이므로 Feature Flag Rollback 시 즉시 Schema를 삭제하지 않는다.

## 7. 금지 사항과 보안 원칙

- Preview와 Production에서 같은 Service Token을 사용하지 않는다.
- Preview DB에 Production `DATABASE_URL`을 복사하지 않는다.
- Secret 값을 문서, Git, 채팅, Screenshot 또는 Build Log에 남기지 않는다.
- Migration 검증 전에 Production Feature Flag를 켜지 않는다.
- LLM Worker가 CMS Table을 직접 조회하는 신규 경로를 만들지 않는다.
- Builder Document Revision과 Approval Snapshot 계약을 우회하지 않는다.
- Migration Runner를 최종 Source 또는 Production Deployment에 남기지 않는다.
- Deployment Protection을 자동 테스트 편의를 위해 비활성화하지 않는다.
- Directus Runtime Read와 Write를 V3 Rollout에 묶어서 활성화하지 않는다.

## 8. 주요 소스 파일

| 영역 | 파일 |
|---|---|
| Feature Flag | `api/_promo-builder-flags.js` |
| Capability | `api/promo-builder-capabilities.js` |
| V3 Auth | `api/_promo-service-v3-auth.js` |
| V3 Store와 Outbox | `api/_promo-service-v3-store.js` |
| 사용자 Action | `api/_promo-service-v3-actions.js` |
| Generation Adapter | `api/_promo-generation-v3-adapter.js` |
| Generation Context | `api/_promo-generation-context-v3.js` |
| Request API | `api/v3/promo-requests.js` |
| Publication API | `api/v3/publications.js` |
| Internal API | `api/internal/v3/` |
| 공용 계약 | `packages/promo-contracts/src/service-v3.mjs` |
| Migration | `db/migrations/070_promo_service_contract_v3_foundation.sql` |
| AI Builder | `visual-editor/src/builder/AiBuilderApp.vue` |
| Client Adapter | `visual-editor/src/builder/services/composition-client.mjs` |
| 승인·발행 UI | `visual-editor/src/platform/editor-ui/PublicationManagerDialog.vue` |
| Composition State | `visual-editor/src/shared/composition/composition-state.mjs` |

## 9. 관련 문서

- `docs/계획/promo-web-builder-api-service-boundary-refactoring-development-plan-2026-11-03.md`
- `docs/설계/promo-web-builder-user-cms-web-output-domain-separation-review-2026-11-03.md`
- `docs/설계/promo-web-builder-service-flow-source-review-and-llm-handoff-2026-11-03.md`
- `packages/promo-contracts/src/publication.mjs`
- `vercel.json`

## 10. 후속 LLM에 전달할 시작 Prompt

```text
promo_web_builder 저장소의 Promo Service Contract V3 Rollout을 이어서 진행한다.

먼저 docs/handoff/promo-service-contract-v3-rollout-handoff-2026-11-03.md를 읽고,
codex/promo-service-v3 브랜치와 원격 HEAD가 35e97e5 또는 그 후속 커밋으로 동기화됐는지 확인한다.

현재 핵심 차단 조건은 PREVIEW_DATABASE_URL의 Neon 인증 오류 28P01이다.
Secret 값을 요청하거나 출력하지 말고, 사용자가 Neon Preview Branch 연결을 교체했는지 확인한다.
교체가 확인되면 새 Preview Deployment에서 DB Target 분리, Migration 070, Schema 검증,
Feature Flag 활성화, Request부터 Publication과 Nuxt 출력까지 E2E 순서로 진행한다.

Preview Release Gate를 통과하기 전에는 Production Migration 또는 Production Feature Flag 활성화를 하지 않는다.
임시 Migration Runner를 만들면 작업 후 Source와 Deployment에서 반드시 제거한다.
```
