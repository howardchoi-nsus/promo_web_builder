# Codex Project Transfer Environment Guide

Date: 2026-07-11
Purpose: 다른 PC / 다른 Codex 세션에서 `promo_web_builder` 프로젝트를 이어서 진행하기 위한 환경 변수와 외부 설정 가이드

## Summary

이 프로젝트는 소스 코드만 복사해도 정적 파일 수정은 가능하지만, DB 조회, 관리자 페이지 Prompt 설정, n8n worker 연동, 이미지 저장/조회 테스트를 하려면 외부 설정이 필요하다.

다른 PC에서 이어서 진행할 때 필요한 것은 크게 4가지다.

1. Git repository 또는 프로젝트 폴더
2. Codex handoff 문서
3. 환경 변수
4. 외부 서비스 설정: Vercel, Neon/Postgres, Vercel Blob, n8n

민감한 secret 값은 이 문서에 기록하지 않는다. 실제 값은 password manager, Vercel dashboard, Neon dashboard, n8n credentials 등 안전한 위치에서 복원해야 한다.

## Recommended Transfer Method

가장 안전한 방식:

1. 현재 PC에서 변경분을 commit한다.
2. GitHub remote에 push한다.
3. 다른 PC에서 repository를 clone한다.
4. 이 문서와 최신 handoff 문서를 읽는다.
5. 필요한 환경 변수를 세팅한다.
6. Admin Page에서 worker webhook과 prompt 설정을 확인한다.

폴더 zip 복사도 가능하지만, `.git` 포함 여부, uncommitted 변경분, 누락된 env 때문에 추적이 어려워질 수 있다. 장기적으로는 Git 기반 이동을 권장한다.

## Important Handoff Documents

다른 Codex가 먼저 읽어야 할 문서:

- `docs/handoff-2026-07-10.md`
- `docs/final-design-lofi-layout-fidelity-issue-2026-07-10.md`
- `docs/standalone-promo-wizard-development-plan-2026-07-10.md`
- `docs/interim-status-report-2026-07-09.md`

읽는 순서:

1. `handoff-2026-07-10.md`
2. `final-design-lofi-layout-fidelity-issue-2026-07-10.md`
3. `standalone-promo-wizard-development-plan-2026-07-10.md`
4. 필요 시 과거 handoff 문서

## Environment Variable Groups

### 1. Database

DB가 없으면 다음 기능이 제한된다.

- Design MD 조회
- Admin Prompt Management
- Worker webhook settings
- promo generation runs
- LO-FI/final design result 조회
- migration 실행

코드에서 허용하는 DB env 우선순위:

1. `NEON_DATABASE_URL`
2. `DATABASE_URL`
3. `POSTGRES_URL`
4. `POSTGRES_URL_NON_POOLING`
5. 개별 Postgres env 조합

개별 Postgres env:

```text
PGHOST
PGDATABASE
PGUSER
PGPASSWORD
PGPORT
```

또는:

```text
POSTGRES_HOST
POSTGRES_DATABASE
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_PORT
```

권장:

```text
NEON_DATABASE_URL=postgresql://...
```

또는:

```text
DATABASE_URL=postgresql://...
```

확인 위치:

- `api/_db.js`
- `api/_prompt-template-store.js`
- `api/_promo-generation-run-store.js`

### 2. Blob / Image Storage

이미지 저장 또는 private Blob proxy 조회에 필요하다.

```text
BLOB_READ_WRITE_TOKEN
BLOB_ACCESS
```

역할:

- `BLOB_READ_WRITE_TOKEN`: Vercel Blob read/write 인증에 사용
- `BLOB_ACCESS`: public/private storage 정책 확인용. 현재 일부 문서에서는 `public`만으로 해결되지 않는 제한이 기록되어 있다.

관련 API:

- `api/promo-design-assets.js`
- `api/promo-design-image.js`
- `api/promo-design-markdown.js`
- `api/promo-generation-lofi-draft-image.js`
- `api/promo-generation-final-design-image.js`

주의:

- Blob URL이 private이면 proxy endpoint가 token으로 읽어와야 한다.
- 다른 PC에서 final/LO-FI image proxy 테스트를 하려면 token이 필요할 수 있다.

### 3. n8n Worker URLs

현재 worker stage:

```text
integrated_brief
lofi_draft
final_design
promo_ui_design
```

환경 변수 fallback:

```text
N8N_INTEGRATED_BRIEF_WORKER_URL
N8N_LOFI_DRAFT_WORKER_URL
N8N_FINAL_DESIGN_WORKER_URL
N8N_PROMO_UI_DESIGN_WEBHOOK_URL
```

이전/레거시 API에서 사용하는 값:

```text
N8N_PROMO_WEBHOOK_URL
N8N_DESIGN_MD_ANALYZE_WEBHOOK_URL
N8N_ANALYZE_WEBHOOK_URL
```

Admin Page DB 설정:

- `worker_webhook_settings` table
- Admin Page에서 stage별 webhook URL, active 여부, timeout 설정 가능

중요한 우선순위:

1. Admin/DB `worker_webhook_settings` active URL
2. env URL
3. request body URL

즉 Admin Page에 active webhook URL이 등록되어 있으면 env보다 우선한다.

관련 코드:

- `api/_promo-generation-worker-trigger.js`
- `api/_worker-webhook-settings-store.js`
- `api/generate-ui-design.js`

### 4. Worker Security / Allowlist

production 환경에서 request body로 전달된 worker URL을 사용할 경우 host allowlist 검증이 걸릴 수 있다.

```text
N8N_WORKER_WEBHOOK_ALLOWLIST
N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST
```

형식:

```text
N8N_WORKER_WEBHOOK_ALLOWLIST=example.app.n8n.cloud,n8n.company.com
```

관련 runtime env:

```text
VERCEL_ENV
NODE_ENV
```

production 판정:

```text
VERCEL_ENV=production
```

또는:

```text
NODE_ENV=production
```

주의:

- Admin/DB에 등록된 webhook URL은 env URL처럼 운영 설정으로 취급된다.
- request body override는 production에서 allowlist가 없으면 막힐 수 있다.

### 5. Worker Ack Timeout

worker trigger는 n8n 전체 생성을 기다리지 않고 ack만 기다린다.

```text
N8N_WORKER_TRIGGER_ACK_TIMEOUT_MS
```

기본:

```text
2000
```

허용 범위:

```text
500 ~ 5000
```

역할:

- n8n webhook이 요청을 수신했다는 응답을 얼마나 기다릴지 결정
- 실제 생성 결과는 n8n이 나중에 PATCH callback으로 기록

관련 코드:

- `api/_promo-generation-worker-trigger.js`

### 6. Prompt / Model Settings

Prompt model 설정은 환경 변수가 아니라 DB `prompt_templates`에 저장된다.

Admin Page:

```text
Prompt Management -> Image Execution Prompt
```

현재 목표 설정:

```text
provider = google
model = gemini-3.1-flash-image
temperature = 0.4
maxTokens = empty/null
responseFormat = image
```

중요:

- `api/_prompt-template-store.js` 기본값 변경은 새 seed에만 바로 영향이 있다.
- 이미 DB에 있는 active prompt row는 자동으로 덮어쓰지 않는다.
- 기존 DB에는 migration을 적용하거나 Admin Page에서 직접 수정해야 한다.

관련 migration:

```text
db/migrations/013_image_execution_image_model_settings.sql
```

### 7. n8n Credentials / External Model Keys

이 repo에는 실제 OpenAI/Gemini API key가 없어야 한다.

n8n workflow 내부 또는 n8n credentials에서 관리할 가능성이 높은 값:

```text
OPENAI_API_KEY
GEMINI_API_KEY
GOOGLE_API_KEY
```

주의:

- n8n Cloud에서는 `$env.GEMINI_API_KEY` 접근이 제한될 수 있다는 과거 기록이 있다.
- 가능하면 n8n credentials 또는 workflow credential node를 사용한다.
- 다른 PC로 이동해도 n8n Cloud credential은 PC에 복사할 필요가 없지만, 새로운 n8n instance를 쓰면 credential을 다시 설정해야 한다.

## Admin Page Checks After Transfer

다른 PC에서 프로젝트를 열고 가장 먼저 확인할 것:

### Worker Webhook Settings

Admin Page에서 다음 stage가 보이는지 확인:

```text
Integrated Brief
LO-FI Draft
Final Design
Promo UI Design
```

각 stage 확인:

- webhook URL이 등록되어 있는가?
- active가 켜져 있는가?
- timeout이 적절한가?
- final_design URL이 실제 final worker를 가리키는가?

### Prompt Settings

`Image Execution Prompt` 확인:

```text
provider: google
model: gemini-3.1-flash-image
responseFormat: image
temperature: 0.4
maxTokens: empty/null
```

`LO-FI Draft Prompt` 확인:

```text
provider: google
model: gemini-3.1-flash-image
responseFormat: image
```

`Integrated Brief Generation` 확인:

```text
provider: openai
model: gpt-4o-mini
responseFormat: json_object
```

## Local Setup Checklist

다른 PC에서 clone 후:

```powershell
git clone <repo-url>
cd promo_web_builder
npm install
```

이 프로젝트는 bundled Codex Node로 syntax check를 돌릴 수 있지만, 일반 개발 PC에서는 Node 22 계열을 권장한다.

필수 확인:

```powershell
npm run check
```

현재 `check`는 다음을 검사해야 한다.

```text
prototype/app.js
prototype/generated.js
prototype/promo-wizard.js
```

만약 `npm run check`가 `promo-wizard.js`를 포함하지 않으면 `package.json`의 script를 확인한다.

## Migration Checklist

운영 DB 또는 새 DB에 필요한 migration:

```text
db/migrations/010_prompt_templates.sql
db/migrations/011_generation_runs_and_prompt_model_settings.sql
db/migrations/012_worker_webhook_settings.sql
db/migrations/013_image_execution_image_model_settings.sql
```

특히 이번 이슈와 직접 관련된 migration:

```text
013_image_execution_image_model_settings.sql
```

이 migration은 기존 `image_execution` prompt가 `openai/gpt-4o-mini/text`인 경우 `google/gemini-3.1-flash-image/image`로 보정한다.

## Quick Verification Queries

DB 접속 권한이 있을 때 확인할 쿼리:

```sql
select
  type,
  name,
  status,
  provider,
  model,
  temperature,
  max_tokens,
  response_format,
  model_options
from prompt_templates
where type in ('integrated_brief', 'lofi_draft', 'image_execution')
order by type, status;
```

`image_execution` active row가 아래와 같아야 한다.

```text
provider = google
model = gemini-3.1-flash-image
response_format = image
```

Worker webhook 확인:

```sql
select
  stage,
  is_active,
  webhook_url <> '' as has_url,
  timeout_ms,
  metadata
from worker_webhook_settings
order by stage;
```

## Current Known Limitation

Final Design이 Confirmed LO-FI layout을 안정적으로 따르지 않는 이슈가 남아 있다.

원인:

- `final_design` worker payload가 현재 `confirmedDraftId` 중심으로 얇다.
- Confirmed LO-FI의 `draft_image_url`, `draft_prompt`, layout policy가 worker에 충분히 전달되지 않는다.
- n8n final worker가 DB/API를 다시 조회하지 않으면 LO-FI layout을 알 수 없다.

다음 개발 권장:

- `promo-generation-final-designs.js`에서 confirmed draft detail 조회
- worker payload에 `confirmedDraft` 객체 추가
- final worker가 LO-FI image를 reference image로 사용
- 필요 시 `final_design` prompt type 분리

자세한 내용:

```text
docs/final-design-lofi-layout-fidelity-issue-2026-07-10.md
```

## What Not To Commit

다음은 repo에 commit하지 않는다.

```text
.env
.env.local
DATABASE_URL
NEON_DATABASE_URL
BLOB_READ_WRITE_TOKEN
N8N_* webhook secret URL
OPENAI_API_KEY
GEMINI_API_KEY
GOOGLE_API_KEY
```

필요하면 `.env.example`을 만들되 실제 secret 값은 넣지 않는다.

## Minimum Env Template

새 PC에서 `.env.local` 또는 shell env로 구성할 최소 예시:

```text
# Database
NEON_DATABASE_URL=
# or DATABASE_URL=

# Blob
BLOB_READ_WRITE_TOKEN=
BLOB_ACCESS=

# Worker URLs, if not managed through Admin Page DB settings
N8N_INTEGRATED_BRIEF_WORKER_URL=
N8N_LOFI_DRAFT_WORKER_URL=
N8N_FINAL_DESIGN_WORKER_URL=
N8N_PROMO_UI_DESIGN_WEBHOOK_URL=

# Worker security
N8N_WORKER_WEBHOOK_ALLOWLIST=
N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST=
N8N_WORKER_TRIGGER_ACK_TIMEOUT_MS=2000

# Runtime
NODE_ENV=development
```

## First Task For A New Codex Session

새 Codex에서 이어받으면 다음 순서로 진행한다.

1. `docs/handoff-2026-07-10.md` 읽기
2. `git status --short` 확인
3. `npm run check` 또는 bundled Node syntax check 실행
4. Admin Page의 `Image Execution Prompt` 설정 확인
5. DB migration `013_image_execution_image_model_settings.sql` 적용 여부 확인
6. Wizard Step 1~4 smoke test
7. Final Design layout fidelity issue 작업 재개
