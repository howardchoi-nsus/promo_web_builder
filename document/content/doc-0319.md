# Promo Web Builder 서비스 아키텍처 구성

- 작성일: 2026-07-17
- 작성: Claude
- 상태: 아키텍처 문서 / 소스코드 미반영
- 용도: 다른 LLM/개발자가 시스템 전체 구조를 빠르게 파악하고 이어서 작업할 수 있는 기준 문서
- 기준 소스: 저장소 루트 구조, `package.json`, `api/`, `n8n/`, `visual-editor/`, `vercel.json` 직접 확인 (2026-07-17)
- 참고 문서:
  - `docs/visual-renderer-p0-baseline-and-contract-2026-07-16.md`
  - `docs/visual-renderer-development-plan-with-n8n-2026-07-16.md`
  - `docs/claude/ai-utilization-strategy-review-2026-07-17.md`
  - `docs/landing-and-folder-restructure-development-plan-2026-07-15.md`
  - `docs/handoff-2026-07-16.md`

## 1. 서비스 개요

리전 담당자가 프로모션 페이지를 AI 지원으로 생성·검수·출력하는 Human-in-the-Loop 자동화 PoC. 하나의 Vercel 프로젝트 안에 5개 사용자 화면과 1개 관리 화면이 공존한다.

| 화면 | 경로 | 기술 | 상태 |
|---|---|---|---|
| Root Landing | `/` | 정적 HTML | 운영 중 (카드 4개) |
| Promo Wizard | `/prototype/promo-wizard.html` | 정적 HTML + Vanilla JS | 운영 중 (4단계: Concept→Content→LO-FI→Final) |
| Promo Builder | `/prototype/index.html` | CDN Vue (`prototype/app.js`) | 레거시, 유지 |
| Admin | `/prototype/index.html?view=admin` | Builder와 동일 Vue SPA | 운영 중, **무인증** |
| Visual Editor | `/prototype/visual-editor.html` | Vue 3 + Vite 번들 (`visual-editor/src/`) | Phase 1 진행 중 |
| Web Output | `/prototype/visual-output.html` | Visual Editor와 동일 Renderer 번들 | Phase 1 진행 중 |

## 2. 전체 구성도 (As-Is)

```text
                        ┌─────────────────────────────────────────────┐
                        │                Vercel 프로젝트                │
                        │  (cleanUrls, Node 22, 정적 + Serverless)      │
                        │                                             │
 사용자/관리자 ──브라우저──▶  정적 프론트엔드                              │
                        │   ├ index.html (Landing)                    │
                        │   ├ prototype/promo-wizard.*  (Wizard)      │
                        │   ├ prototype/index.html+app.js (Builder/   │
                        │   │                              Admin SPA) │
                        │   └ prototype/visual-editor*.html           │
                        │      └ visual-editor-assets/*  (Vite build) │
                        │                                             │
                        │  api/*.js  Serverless Functions (~50개)      │
                        │   ├ promo-generation-*   (생성 파이프라인)     │
                        │   ├ wizard-content-section*, wizard-form-   │
                        │   │  template*             (폼 템플릿 관리)    │
                        │   ├ prompt-template*       (프롬프트 관리)     │
                        │   ├ design-*, analyze-design-md (디자인 MD)   │
                        │   └ _*.js                  (공유 store 모듈)  │
                        └───────┬─────────────────────────┬───────────┘
                                │ @neondatabase/serverless │ webhook trigger
                                ▼                          ▼
                     ┌──────────────────┐        ┌──────────────────────┐
                     │  Neon PostgreSQL  │        │        n8n           │
                     │  (Source of Truth)│        │  Worker Workflows    │
                     │  runs/tasks,      │◀──────┤  1) Integrated Brief  │
                     │  form templates,  │callback│  2) LO-FI Draft      │
                     │  sections/items,  │(HTTP)  │  3) Final Design     │
                     │  prompts, tokens, │        │     (images/edits)   │
                     │  histories/audit  │        └──────────┬───────────┘
                     └──────────────────┘                   │
                                                            ▼
                                                 ┌──────────────────────┐
                                                 │  외부 모델 API          │
                                                 │  OpenAI (LLM, images  │
                                                 │  generations/edits),  │
                                                 │  Gemini (실험)         │
                                                 └──────────────────────┘
```

보조 요소:

- `scripts/test-*-contract.js`: API·워커 페이로드 계약 테스트 (`npm run test:*`)
- `db/migrations/002~022`: 스키마 이력 (001 초기 스키마는 폴더에 없음 — 라이브 DB 대조 필요)
- `@vercel/blob`: 의존성만 존재, 실제 파일 업로드 미구현
- `docs/design-md/`: 브랜드 60여 개 DESIGN.md 코퍼스 → `design_token_sets`/`design_token_items`로 적재

## 3. 핵심 데이터 흐름

### 3.1 생성 파이프라인 (Wizard, 비동기 3단계)

```text
Wizard Step 2 입력
  → POST /api/promo-generation-prepare (run 생성, 입력 snapshot 저장)
  → /api/promo-generation-integrated-brief
      → n8n webhook trigger (prompt/model 실행 snapshot 포함)
      → n8n이 LLM 실행 후 callback API로 결과 반환 → DB 상태 갱신
  → LO-FI Draft Worker (동일 패턴, 이미지 생성)
  → 사용자 Confirm (/api/promo-generation-lofi-draft-confirm)
  → Final Design Worker
      → Confirmed LO-FI binary 다운로드
      → OpenAI /v1/images/edits (multipart, input_fidelity=high)
      → callback → final_design_ready
```

원칙: 애플리케이션(DB)이 상태의 Source of Truth, n8n은 모델 실행만 담당. 각 단계 queue 시 active prompt/model snapshot을 task에 기록.

### 3.2 폼 템플릿 설정 (Admin → Wizard)

```text
Admin (L/M/R UI)
  → wizard-form-template* / wizard-content-section* API (draft/active 버전 관리)
  → Wizard Step 2: GET /api/wizard-form-templates-public → 활성 템플릿 선택
  → Section/Item 동적 렌더링, configRevision을 생성 payload에 포함 (fail-closed)
```

### 3.3 Visual Editor → Web Output (신규, Phase 1)

```text
Visual Editor
  → GET /api/wizard-form-templates-public (isDefault=true만 허용)
  → 편집: sectionInputs + designSpec(itemStyles/sectionStyles) 로컬 상태
  → "Web Output 열기": Snapshot(JSON) → localStorage → 새 탭
  → Web Output: 동일 Renderer 번들 + 동일 Snapshot으로 렌더링
```

Renderer 계약: `content / designSpec / assets` 세 Props만 수용. Renderer는 API·localStorage 직접 접근 금지 (host가 담당). 상세는 P0 계약 문서 참조.

## 4. 목표 아키텍처 (To-Be, 2026-07-16 방향)

```text
콘텐츠 입력 (Visual Editor)
  → Integrated Brief (기존 유지)
  → [신규] Design Spec 생성 Workflow (n8n)
      · design-md 토큰 RAG 주입 → LLM structured output(JSON)
      · JSON Schema 검증, 실패 시 fail-closed
  → Vue Renderer Preview (Variant N개 → 자동 필터링 → 사용자 선택)
  → [신규] Section Asset 생성 Workflow (에셋 단위 이미지만)
  → 자동 시각 QA (결정적 검사 + vision 모델)
  → Web Output (동일 Renderer, 동일 Snapshot)
  → [장기] Publish Contract → CMS (Directus 우선 검토)
```

전환 규칙:

1. 기존 LO-FI/Final 이미지 Workflow는 Feature Flag로 병행, 검증 전 삭제 금지.
2. 전체 페이지 이미지 생성은 단계적으로 내부 프로세스에서 제거.
3. LLM Vue 코드 생성은 최후 단계(컴포넌트 단위 + Sandbox Build + 시각 QA 게이트).
4. AI 적용 우선순위와 근거는 `ai-utilization-strategy-review-2026-07-17.md` 기준.

## 5. 알려진 구조적 리스크 (작업 시 유의)

1. **Admin/쓰기 API 전체 무인증** — URL 분리는 보안이 아님. 운영 공개 전 서버측 인증 필수 (여러 handoff에서 반복 이연 중).
2. **계약 드리프트** — 구현 `DEFAULT_DESIGN_SPEC`이 P0 계약 문서보다 확장됐으나 contractVersion 미변경. Design Spec 자동 생성 착수 전 계약 문서 갱신 필요.
3. **localStorage Snapshot 한계** — 배경 이미지 Data URL(≤3MB) 포함 시 쿼터 초과 위험. Vercel Blob 전환 예정(의존성은 이미 존재).
4. **폴더 구조 미분리** — `/wizard`, `/builder`, `/admin` 분리 계획 수립됨(Phase 0~3), 현재는 `prototype/` 혼재. 계약 테스트가 `prototype/` 경로를 직접 참조하므로 이동 시 동반 수정.
5. **마이그레이션 001 부재** — 라이브 Neon DB에 마이그레이션 외 수동 테이블 존재 가능. 테이블 정리는 `review-db-tables-cleanup-2026-07-15.md`의 검증 절차 선행.
6. **모바일 좌표 미대응** — Visual Editor 자유 배치가 데스크톱 픽셀 Y좌표 기준. breakpoint별 override 미구현.

## 6. 이어받는 LLM을 위한 진입점

- 생성 파이프라인 수정: `api/_promo-generation-worker-trigger.js`, `api/_worker-execution-contract.js`, `n8n/*.json`
- 폼 템플릿/섹션: `api/_wizard-form-templates-store.js`, `api/_wizard-content-sections-store.js`, `db/migrations/016~018`
- Visual Editor/Renderer: `visual-editor/src/` (App.vue = host, PromoPageRenderer.vue = Renderer, contracts.js = 계약)
- 검증: `npm run check` + `npm run test:*-contract` (Node 22, Windows 환경은 Codex 번들 Node 사용 이력 있음)
