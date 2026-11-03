# 중간보고 리포트 — PRD 자동화 & AI 프로모션 페이지 빌더 PoC

보고일: 2026-07-09
보고 대상 기간: 2026-06-08 (프로젝트 시작) ~ 2026-07-09 (오늘), 총 8주 로드맵 중 약 4주차 시점
수행 체계: **1인 총괄** (기획 · 백엔드/프론트엔드 개발 · 인프라 구성 전 과정을 단독 수행)
작성 기준: 사용자 제공 작업 리포트 4건(2026.06.08-06.12, 06.17, 06.18, 06.22-26) + `docs/` 폴더 내 handoff/daily-plan/weekly-plan 문서 15건 + 소스코드(api/, db/, n8n/, prototype/) 리뷰 + git 커밋 로그(194건)

---

## 핵심 요약 (Executive Summary)

- **전체 진행률: 약 50% (8주 로드맵 기준, 오늘은 25일차/56일 시점).** 시간 경과 대비 진행 속도는 유사하거나 다소 앞서 있으며, 특히 핵심 백엔드 아키텍처와 Agent1 PRD 어시스트는 이미 실사용 가능한 수준까지 도달했다.
- **1인이 기획·개발·인프라를 모두 수행.** 약 4주 만에 서로 다른 두 개의 PoC(PRD 생성 어시스트 "Agent1", GGPoker 프로모션 페이지 자동 빌더 "PROMO")를 기획부터 배포까지 단독으로 구축했다. 백엔드 API 35개(약 7,700줄), DB 마이그레이션 11개, n8n 워크플로우 7개, 프로덕션 배포(Vercel)까지 한 사람의 결과물이다.
- **PRD 생성 어시스트(Agent1)는 실사용 가능한 상태.** 요구사항 등록 → Git 저장 → PRD 자동 생성 → Req/PRD 비교 검토까지 이어지는 흐름이 동작하며, 별도 웹 서비스(`https://howardchoi-nsus-pocax.vercel.app/`)로 배포되어 있다.
- **PROMO 프로젝트는 프로덕션급 아키텍처를 갖췄다.** runId 기반 비동기 생성 상태 모델, 워커별 webhook 관리, SSRF 방지, 단일 확정 초안(single-source-of-truth) 패턴, 프롬프트 이력 관리 등 실제 서비스에 준하는 설계 요소가 이미 반영되어 있다.
- 남은 과제는 주로 "이미 만든 구조를 실제 운영 환경에서 검증"하는 단계(n8n 워크플로우 최종 반영, E2E 브라우저 테스트, 디자인 충실도 미세 조정)에 집중되어 있으며, 아래에서 구체적으로 정리한다.

---

## 1. 프로젝트 개요

본 프로젝트는 하나의 8주 로드맵(1주차 06.15 ~ 8주차 08.07) 안에서, 3주차부터 실행 타겟이 전환되며 크게 두 단계로 나뉜다.

- **1단계 (1~2주차, 2026-06-15 ~ 06-26): AX POC 기획 및 "PRD 생성 어시스트(Agent1)" 구현.** 1주차는 프로젝트 착수 및 기술 아키텍처 수립, 2주차는 기획 산출물(PRD, Scenario) 자동화가 목표였다. Google Docs/요구사항 원문을 받아 PRD.md를 자동 생성하는 PoC로, Google Docs 기반 → Git Repository 기반 구조로 전환하며 진행됨. 별도 배포: **https://howardchoi-nsus-pocax.vercel.app/**
- **2단계 (3주차~, 2026-06-29 이후 ~ 현재): PROMO 프로젝트로 타겟 전환.** 로드맵의 주차 구조(3~4주차 Lo-Fi 생성/Annotation 분류, 5~7주차 디자인 자동 생성/프론트 퍼블리싱 코드 생성, 8주차 E2E 검증)는 그대로 유지한 채, 실행 대상을 GGPoker Promo Builder를 대체/보완하는 `promo_web_builder` 자동화 PoC로 재조준해 애자일 프로세스로 진행. git 저장소 기준 최초 커밋은 2026-06-25로, 계획상 3주차 시작일(06-29)보다 며칠 앞서 준비가 시작된 것으로 보인다. 이번 리포트 분량의 대부분은 이 2단계에 집중되어 있다.

1단계와 2단계는 **서로 다른 저장소/배포**를 사용한다. 1단계(Agent1)는 GitHub repo `poc_ax`와 Vercel 앱 `howardchoi-nsus-pocax.vercel.app`, n8n Cloud 인스턴스 `kolchohoohu.app.n8n.cloud`를 사용하며, 2단계(PROMO)는 `promo_web_builder` 저장소를 사용한다. 아래 Part A는 사용자가 제공한 작업 리포트(PDF)만을 근거로 작성했으며 소스코드로 직접 교차 검증하지는 않았다는 점을 밝혀둔다. Part B는 이전 리뷰에서 소스코드/git 로그로 교차 검증한 내용이다.

기획 원칙(promo_web_builder README 기준, 2단계 이후 적용):

- Phase 기반이 아닌 Agile E2E 방식
- Template-first가 아닌 Component-first
- Template Family 단위 디자인 관리
- 해석/초안 생성은 AI, 구조/정책/안전은 Rule Base가 담당
- 플랫폼 비종속적 설계

---

## 2. 주요 성과 및 강점

### 2.1 기획 · 개발 · 인프라 전 과정 1인 수행

본 리포트가 다루는 두 PoC(Agent1, PROMO) 모두 기획, 백엔드/프론트엔드 개발, 인프라 구성을 **한 사람이 처음부터 끝까지 담당**했다. 통상 이 정도 범위(기획 문서화 → DB 스키마 설계 → API 개발 → n8n 워크플로우 자동화 → 배포/보안 설정 → 관리자 화면)는 여러 역할로 나뉘는 경우가 많다는 점을 감안하면, 약 4주 안에 아래 산출물을 혼자 만들어낸 것은 실행 속도 측면에서 분명한 강점이다.

| 산출물 | 규모 |
| --- | --- |
| 백엔드 API 파일(`api/*.js`) | 35개, 약 7,700줄 |
| DB 마이그레이션(`db/migrations/*.sql`) | 11개 |
| n8n 워크플로우(`n8n/*.json`) | 7개 |
| 기획/handoff 문서(`docs/*.md`) | 29개 |
| 별도 배포 서비스 | 2개(Agent1: `howardchoi-nsus-pocax.vercel.app`, PROMO: `promo_web_builder` 프로토타입) |

### 2.2 PRD 생성 어시스트(Agent1) — 실사용 가능한 기능

Agent1은 "요구사항 등록 → Git 저장 → PRD 자동 생성 → Req/PRD 비교 검토"까지 이어지는 흐름이 실제로 동작하는 수준까지 구축되었다. 구체적으로는 다음 기능이 사용 가능하다.

- 요구사항을 웹 화면에서 등록하면 자동으로 파일명이 생성되고(`REQ_[키워드]_YYMMDD_HHMMSS.txt`), Git 저장소에 원문이 버전 관리된다.
- 등록된 요구사항을 선택해 GPT-4o-mini 기반으로 PRD.md를 자동 생성하고, 결과가 Git에 저장된다.
- NotebookLM과 유사한 3컬럼 워크스페이스(요구사항 / PRD 작업공간 / Phase 산출물)에서 요구사항 원문과 생성된 PRD를 나란히 비교 검토할 수 있다.
- 등록일 최신순 정렬, 출처 표시(JIRA/Slack/파일업로드/직접등록) 등 실무에서 바로 쓸 수 있는 편의 기능도 포함되어 있다.
- 06-17~06-18 이틀 동안 발생한 인증/연동 오류(GitHub Rate Limit, n8n 환경변수 접근 제한, Credential 401 등) 6종을 모두 원인 분석 후 해결하며 완성도를 높였다.

### 2.3 PROMO 프로젝트 — 프로덕션급 아키텍처 요소 다수 확보

PROMO 프로젝트는 단순 프로토타입 수준을 넘어, 실제 서비스에 준하는 설계 요소를 다수 갖췄다.

- **runId 기반 비동기 생성 상태 모델**: 생성 요청 → Integrated Brief → LO-FI 초안 → 최종 디자인까지 단계별 상태를 추적.
- **워커 아키텍처**: n8n 워커를 fire-and-forget 방식(ack만 확인)으로 트리거하여 Web이 긴 이미지 생성 작업을 기다리지 않도록 설계.
- **보안**: production 환경에서 워커 webhook 호스트를 allowlist로 강제 검증하는 SSRF 방지 로직 적용.
- **데이터 무결성**: LO-FI 초안 확정 시 "reset-all-then-set-one" 패턴으로 단일 확정 초안만 존재하도록 보장.
- **운영 편의성**: 프롬프트를 코드가 아닌 DB로 관리(이력 보존, 단일 활성 강제)하고, 워커 webhook 설정도 Admin Page에서 중앙 관리하도록 전환.

### 2.4 문제 발생 시 근본 원인까지 추적하는 작업 습관

C섹션 이미지가 9바이트로 깨지는 문제, 이미지 해상도가 기대치에 못 미치는 문제, GitHub 토큰 노출 등 크고 작은 이슈가 발생할 때마다 표면적 재시도가 아니라 **근본 원인을 규명하고 문서화**한 뒤 대응한 이력이 handoff 문서 전반에서 확인된다. 이는 PoC 단계에서 자주 생략되는 부분이라, 이후 정식 개발로 전환될 때 축적된 자산으로 활용할 수 있다.

---

## 3. 전체 진행률 (헤드라인)

전체 8주 로드맵을 기준으로 이번 리뷰가 판단한 진행률은 아래와 같다(공식 트래킹 수치가 아닌 이번 리뷰의 종합 추정치이며, 산정 근거는 하단에 표기).

| 구간 | 기간 | 목표 | 추정 진행률 |
| --- | --- | --- | --- |
| 1~2주차 | 06.15~06.26 | Agent1 착수/아키텍처, PRD·Scenario 자동화 | 약 100% (실사용 가능 상태 도달) |
| 3~4주차 (현재 위치) | 06.29~07.10 | Lo-Fi 생성, 디자인 이미지 Annotation 분류 | 약 55~60% (Lo-Fi 생성은 구현 완료, Annotation 분류는 근거 불명확) |
| 5~7주차 | 07.13~07.31 | 디자인 자동 생성, 프론트 퍼블리싱 코드 생성 | 약 15~20% (핵심 인프라는 선반영, 본격 착수는 예정) |
| 8주차 | 08.03~08.07 | End-to-End 전체 워크플로우 검증 | 약 5% (일부 E2E 검증이 이미 조기 착수됨) |

**종합: 약 50% 진행.** 오늘(07-09)은 로드맵상 56일 중 25일차(약 45% 경과)에 해당하므로, 실질 진행률(약 50%)은 경과 시간과 비슷하거나 소폭 앞서 있다. 1인 체제로 두 개의 PoC를 병행하면서 이 속도를 유지한 것은 긍정적으로 평가할 수 있는 지점이다.

---

## Part A. 1단계 — AX POC / PRD 생성 어시스트 (Agent1), 2026-06-08 ~ 06-19경

### A.1 원래 기획 — AX POC 8주 로드맵 (수정본)

프로젝트 시작 시점에 아래와 같은 로드맵이 수립되어 있었다(사용자 확인 기준으로 정정).

| 주차 | 기간 | 핵심 목표 |
| --- | --- | --- |
| 1주차 | 06.15~06.19 | 프로젝트 착수 및 기술 아키텍처 수립 |
| 2주차 | 06.22~06.26 | 기획 산출물(PRD, Scenario) 자동화 |
| 3~4주차 | 06.29~07.10 | Lo-Fi 생성 및 디자인 이미지 데이터 Annotation 분류 |
| 5~7주차 | 07.13~07.31 | 디자인 자동 생성, 프론트 퍼블리싱 코드 생성 |
| 8주차 | 08.03~08.07 | End-to-End 전체 워크플로우 동작 검증 |

**중요 — 3주차부터 타겟 전환:** 1~2주차는 Agent1(PRD 생성 어시스트) 기준으로 진행되었으나, **3주차(06.29)부터는 실행 타겟이 GGPoker Promo Builder(PROMO 웹 빌더)로 전환되어 애자일 프로세스가 적용**되었다. 다만 3~4주차 → Lo-Fi 생성/Annotation 분류, 5~7주차 → 디자인 자동 생성/프론트 퍼블리싱 코드 생성, 8주차 → E2E 검증이라는 **주차별 로드맵 구조 자체는 그대로 유지**된 채로, 대상만 PROMO 웹 빌더로 재조준되었다. 즉 아래 A.2~A.4는 1~2주차(Agent1 트랙)에서 실제로 벌어진 일이고, 3주차 이후는 Part B(PROMO 프로젝트)로 이어진다.

**계획 대비 현재 위치(2026-07-09 기준):** 오늘은 계획상 3~4주차 구간(06.29~07.10) 안에 있다. 실제로 이번 주(07-08~07-09)에 LO-FI Draft 생성/확정 플로우가 구현된 것은 "Lo-Fi 생성" 목표와 시기적으로 일치한다. 다만 "디자인 이미지 데이터 Annotation 분류" 목표에 정확히 대응하는 작업 근거는 이번 리뷰에서 명확히 확인되지 않았다(06-22~26주차의 Design Style Concept 그룹핑·태그·confidence·미분류 상태 표시 기능이 이와 관련된 작업일 가능성은 있으나 "Annotation 분류"로 명시적으로 연결되는 기록은 없음). 5~7주차(디자인 자동 생성, 프론트 퍼블리싱 코드 생성)와 8주차(E2E 검증)는 계획상 아직 도래하지 않은 구간이며, 07-08~07-09 handoff에서 이미 "3-워커 E2E 검증"을 언급하고 있어 실제 진행 속도가 원래 계획보다 다소 앞서 있을 가능성도 있다.

### A.2 개발 스펙 — Agent1 아키텍처

```
Vercel Web (howardchoi-nsus-pocax.vercel.app)
  -> n8n Harness (kolchohoohu.app.n8n.cloud)
  -> GitHub Repository (poc_ax)
     -> /source   (요구사항 원본)
     -> /req      (표준화된 요구사항 Markdown)
     -> /prompts  (PRD 생성 프롬프트, 예: prd-template-v1.md)
     -> /prd      (생성된 PRD Markdown)
     -> /maps     (Req-PRD 연결 정보)
     -> /logs     (실행 로그)
  -> 2Column/3Column Viewer로 비교 검토
```

- n8n 워크플로우명: `AGENT1_PRD생성_Vercel_poc`. 웹훅 2종: `agent1-requirement-save`, `agent1-prd-generate`.
- LLM: OpenAI gpt-4o-mini (Chat Completions API 직접 호출).
- 저장은 Vercel 서버리스 함수(`/api/blob-save`)를 통해 GitHub에 파일을 커밋하는 방식.
- 웹 UI는 최초 단순 PRD Markdown Viewer에서 시작해, 06-17에는 REQ/PRD/Maps/Logs 조회 + 요구사항 등록 + PRD 생성 실행 + 2Column 비교 구조로, 06-18에는 **NotebookLM과 유사한 3컬럼 워크스페이스**(1컬럼: Requirement Source, 2컬럼: PRD Workspace, 3컬럼: Phase Output)로 빠르게 확장됨.
- 06-18에 ID/Class 네이밍 규칙을 `header_*`/`section1_*`/`section2_*`/`section3_*`/`common_*`/`modal_*`/`toast_*`/`is_*` 기준으로 통일.

### A.3 일자별 진행 및 이슈 해결

| 일자 | 주요 작업 | 발견/해결된 이슈 |
| --- | --- | --- |
| 06-17 | n8n을 Google Drive 기반에서 Git Repository 기반으로 전면 수정. Vercel Web에 REQ/PRD/Maps/Logs 조회, 요구사항 등록, PRD 생성 실행, 2Column Viewer 추가. CSS를 `index.html`에서 `styles.css`로 분리. Requirement ID를 전체 수동 입력 방식에서 키워드 입력 후 자동 파일명 생성(`REQ_[키워드]_YYMMDD_HHMMSS.txt`) 방식으로 변경. 요구사항 등록을 모달화. | `Source_Git_Download` 노드 404 오류(원본 파일 저장 전에 읽기를 시도한 순서 문제) 해결. GitHub API를 브라우저가 직접 호출하면서 Rate Limit 발생 → Vercel API Proxy(`/api/github-list.js`, `/api/github-file.js`) 경유 방식으로 변경. |
| 06-18 | Web 구조를 3컬럼 워크스페이스로 재정리. ID/Class 네이밍 규칙 통일. Web↔GitHub 연동 방식을 재검토하여 **읽기는 Web→GitHub API 직접 호출, 쓰기(PRD 생성)는 Web→n8n Webhook→GitHub 저장/OpenAI 호출**로 이원화. 요구사항 목록에 최신 등록일 기준 정렬 로직 추가. | GitHub API 403 Rate Limit(비인증 직접 호출) → GitHub Token을 sessionStorage에 임시 저장하는 방식으로 완화. n8n Code 노드에서 `$env.AGENT1_WEBHOOK_SECRET` 접근 시 `access to env vars denied` 오류(n8n Cloud Code 노드의 환경변수 접근 제한) → POC 단계에서는 `$env` 기반 secret 검증 제거로 우회. GitHub 저장 단계에서 `401 Bad credentials`/`401 Requires authentication` 발생 → 원인은 Header Auth Credential의 토큰 값/형식/권한 문제로 확인, Fine-grained PAT(`Repository: poc_ax`, `Contents: Read and write`)를 재발급하고 `Authorization: Bearer` 형식으로 재설정. Webhook URL이 `/webhook-test/...`(테스트 전용, n8n에서 "Listen for test event" 상태일 때만 동작)로 설정되어 있던 것을 확인, 운영 시 `/webhook/...` 형식과 Workflow Active 상태가 필요함을 정리. repo 기본값이 실제 `poc_ax2`가 아니라 `poc_ax`였던 설정 오류 수정. |

### A.4 보안 관련 특기사항

06-18 작업 중 **GitHub Personal Access Token 값이 대화(채팅) 중 노출되는 사고가 있었고, 해당 토큰은 즉시 폐기하고 새로 발급**하는 것으로 정리되었다. 사소해 보일 수 있으나, Fine-grained PAT라도 노출 시 즉시 폐기·재발급하는 대응이 적절히 이루어진 사례로 기록해 둔다. 다만 이런 유형의 사고가 재발하지 않도록 토큰류는 코드/채팅에 직접 붙여넣지 않고 환경변수 또는 Credential 매니저를 통해서만 다루는 절차를 향후에도 유지할 필요가 있다.

### A.5 1~2주차(Agent1 트랙) 종료 시점 상태 및 타겟 전환

06-18 리포트 기준으로는 GitHub 쓰기 인증(Save Source to GitHub 노드) 성공 확인과 PRD Generate의 End-to-End 완결이 **잔여 작업**으로 남아 있었으나, 이후 해당 이슈들이 해결되어 **Agent1은 현재 요구사항 등록 → PRD 자동 생성 → 비교 검토까지 실사용 가능한 상태로 동작**한다(2.2절 참고). 즉 1~2주차 목표(프로젝트 착수·아키텍처 수립, 기획 산출물 자동화)는 실질적으로 달성된 것으로 볼 수 있다.

A.1에서 정리한 대로 3주차(06.29)부터는 로드맵상의 주차 구조를 유지한 채로 실행 타겟이 GGPoker Promo Builder로 전환되었다. Agent1 PRD 어시스트는 "중단"된 것이 아니라 **동작 가능한 상태로 완성된 채, 이후 로드맵의 대상(subject)만 PROMO로 재조준된 것**으로 이해하는 것이 정확하다. `https://howardchoi-nsus-pocax.vercel.app/`는 별도 서비스로 계속 배포되어 있다.

---

## Part B. 2단계 — PROMO 프로젝트 (AI Promo Page Builder), 3주차(2026-06-29) 이후 ~ 현재

### B.1 개발 스펙

#### B.1.1 기술 스택

| 영역 | 내용 |
| --- | --- |
| 런타임 | Node.js 22.x, Vercel Serverless Functions |
| DB | Neon Postgres (`@neondatabase/serverless`) |
| 파일 저장 | Vercel Blob (`@vercel/blob` ^2.5.0), private store |
| 워크플로우 오케스트레이션 | n8n |
| LLM | OpenAI gpt-4o-mini (integrated_brief, image_execution 프롬프트), Gemini gemini-3.1-flash-image (이미지 생성) |
| 프론트엔드(프로토타입) | Vanilla JS (`prototype/app.js`, `index.html`) — Vue3/Nuxt3/TS/Pinia/Tailwind 전환은 추후 목표 |

#### B.1.2 핵심 아키텍처 — runId 기반 비동기 생성 상태 모델

```
promo_generation_runs
  -> promo_generation_integrated_briefs   (통합 디자인 브리프)
  -> promo_generation_lofi_drafts         (LO-FI 초안, draft_attempt 단위로 누적)
  -> promo_generation_final_designs       (최종 디자인)
```

- `worker_webhook_settings` 테이블이 n8n 워커별(Integrated Brief / LO-FI Draft / Final Design / Promo UI Design) webhook URL을 관리하며, Admin/DB 설정 > 환경변수 > 요청 바디 순으로 우선순위를 가진다.
- Web/API는 워커 트리거 시 결과를 기다리지 않고 **ack(수신 확인)만** 기다리는 fire-and-forget 패턴을 사용한다(기본 타임아웃 2000ms, 500~5000ms 범위로 clamp, `N8N_WORKER_TRIGGER_ACK_TIMEOUT_MS`로 조정 가능).
- 단계별 stale 처리 기준: integrated_brief 6분, lofi_draft 4분, final_design 6분.
- SSRF 방지: production 환경에서 워커 webhook 호스트를 allowlist로 강제 검증(`N8N_WORKER_WEBHOOK_ALLOWLIST`, `N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST`).
- LO-FI 초안 확정: "reset-all-then-set-one" 패턴으로 `confirmed_at`을 run 내 유일한 활성 초안 판단 기준으로 사용(단일 소스 오브 트루스). 다만 두 UPDATE가 하나의 트랜잭션이 아니라서, 동시 확정 요청 시 이론상 작은 race window가 존재함(현재 단일 운영자 구조라 리스크 낮음, 다중 사용자 확장 시 트랜잭션화 권장).
- 프롬프트 관리: 2026-07-07부터 n8n 내부 조립 방식에서 Web App/DB 중심(`prompt_templates`, `prompt_template_histories`)으로 전환. 타입별 단일 활성(active) 강제, 삭제 대신 archive, 재생성 대신 이력 저장.

#### B.1.3 최근 확정된 설계 결정 (AI Design Recommendation Workflow 제안, 07-09)

개발 착수 전 사용자 확정 사항 4가지:

1. 콘셉트 선택 여부는 `isSelected` 단일 컬럼을 기준으로 판단(별도 `selectedDesignConceptId` 컬럼 없음).
2. `sectionInputLogMarkdown`은 run 테이블에 저장하고 `contentInputHash` 기준으로만 재생성(overwrite, 버전관리 없음). 오래된 값은 Integrated Brief까지 stale 전파.
3. Rule Validation fatal/warning 판정표 확정 — 로고 누락/변형, 주 브랜드 컬러 미사용, Terms/Footer 슬롯 누락, 연령 고지 공간 누락, WCAG AA 실패, 금지 지역/도박 문구는 **fatal**; 브랜드 컬러 낮은 사용률, 높은 riskLevel, 지역 사용 이력 없음, 짧은 footer terms 영역, AA는 통과했지만 AAA는 미달인 대비는 **warning**.
4. `designConceptContext`는 `integrated_brief` 프롬프트의 **선택적(optional)** 변수로 시작.

### B.2 환경(Environment)

주요 환경 변수(코드 grep 기준):

| 구분 | 변수 |
| --- | --- |
| DB 연결 | `DATABASE_URL`, `NEON_DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING` |
| Blob 저장소 | `BLOB_READ_WRITE_TOKEN`, `BLOB_ACCESS` |
| 배포/런타임 | `VERCEL_ENV`, `NODE_ENV` |
| 워커 URL | `N8N_INTEGRATED_BRIEF_WORKER_URL`, `N8N_LOFI_DRAFT_WORKER_URL`, `N8N_FINAL_DESIGN_WORKER_URL`, `N8N_PROMO_UI_DESIGN_WEBHOOK_URL` |
| 보안 allowlist | `N8N_WORKER_WEBHOOK_ALLOWLIST`, `N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST` |
| 기타 | `PROMO_DESIGN_RESULTS_RESET_AT` |

**미해결 환경 리스크 (2026-07-09 handoff 명시)**:

- `db/migrations/012_worker_webhook_settings.sql`이 대상 환경(운영 DB)에 아직 적용되지 않았을 가능성 — 미적용 시 Admin Page의 Worker Webhook 설정 기능이 비어있거나 오류가 날 수 있음.
- 로컬 `main` 브랜치가 `origin/main` 대비 1커밋 앞선 상태(push 필요).
- 4개 워커 stage(integrated_brief/lofi_draft/final_design/promo_ui_design)에 실제 n8n webhook URL이 아직 등록되지 않았을 수 있음.
- production allowlist에 실제 n8n 호스트가 등록되어 있는지 별도 확인 필요.

### B.3 기획(Planning) — 기간별 요약

| 기간 | 주요 기획/작업 내용 |
| --- | --- |
| 06-22~06-26 | (전환 주간) 기존 단순 페이지 생성 흐름을 UI 디자인 이미지 생성 흐름으로 전환, B섹션 Temp.4 기준 재정리, A섹션 Design Style Concept 그룹핑, A/B/C 3단 패널 레이아웃, Admin/Web Builder 톤앤매너 정립, `handoff-2026-06-27.md` 최초 작성 |
| 06-29 | 생성 이미지 영속 저장 구조를 Blob+DB로 전환, `promo-design-assets`/`promo-design-view`/`promo-design-image` API 추가 |
| 06-30 | **Integrated Design Brief MD** 개념 확정 — "다른 문서를 참조하지 않는 완전 자기완결적 문서"로 정의, 1440px 폭/auto height/no-crop 정책 확립 |
| 07-01 | E2E 검증(`promo-031`), 문서 품질 평가, `api/_design-md-data.js`의 Design Token 매핑 버그 발견 및 부분 수정 |
| 07-02 | C섹션 이미지 깨짐(9바이트 파일) 원인을 n8n 바이너리 참조 오류로 규명, 서버측 이미지 시그니처 검증 추가, Gemini 모델 응답속도 비교(gemini-3-pro-image 느림 vs gemini-3.1-flash ~1분27초) |
| 07-03 | B1 재설계(AI 모드/Advanced 모드), 필수 입력 검증 UX 개선 |
| 07-04 | B섹션 입력 단순화, **Design MD 토큰 충실도 손실 문제 심층 진단**(선택한 스타일의 디자인 DNA가 최종 이미지까지 유지되지 않는 핵심 품질 이슈) |
| 07-05 | 경미한 문구 수정(1커밋) |
| 07-06 | Integrated Brief 검증 오류 구조적 원인 진단(LLM에 Markdown+JSON 동시 생성 요구 시 파싱 실패) → JSON 구조화 데이터 + Code 노드가 Markdown 조립하는 방식으로 재설계 제안 |
| 07-07 | 프롬프트 관리를 Web App/DB 중심으로 전환(`prompt_templates` 테이블, 관련 API 4종, 프론트 관리 화면 추가) |
| 07-08 | Integrated Brief/LO-FI Draft/Final Design **3개 워커 분리** 설계, fire-and-forget ack 트리거 패턴, SSRF allowlist, stale timeout 도입(대규모 리팩터) |
| 07-09(오늘) | Private Blob 이미지 프록시, LO-FI Draft 프리뷰/확정 플로우, Final Design 생성 지원, Worker Webhook 설정 Admin Page 이전, "프롬프트 관리" → "관리자 페이지" 개편(A/B 섹션 레이아웃), 백엔드 실제 주석 반영, AI Design Recommendation Workflow 제안서 작성 |

### B.4 마일스톤

| 마일스톤 | 상태 | 근거 |
| --- | --- | --- |
| M0. AX POC 1~2주차(Agent1 PRD 자동화) 구현 | **완료(실사용 가능)**, 3주차부터 타겟이 PROMO로 전환 | Part A 참고 |
| M1. 기본 페이지 생성 흐름 → UI 디자인 이미지 생성 흐름 전환 | 완료 | handoff-06-27, weekly-report-06-28 |
| M2. 생성 결과 영속 저장(Blob+DB) | 완료 | handoff-06-29 |
| M3. Integrated Design Brief MD 자기완결형 정의 확정 | 완료(개념) | handoff-06-30, daily-plan-07-01 |
| M4. E2E 검증 1차(promo-031) | 완료 | handoff-07-01 |
| M5. 이미지 생성 결함 원인 규명 및 서버 검증 추가 | 완료 | handoff-07-02 |
| M6. B섹션 UX 재설계(AI/Advanced 모드) | 완료 | handoff-07-03 |
| M7. Design MD 토큰 충실도 손실 — 원인 진단만 완료, **수정 미완료** | 진행 중 | handoff-07-04 |
| M8. Integrated Brief 생성 아키텍처 재설계(JSON 우선) — 설계만 완료, **구현 미확인** | 설계 완료 / 구현 미확인 | handoff-07-06 |
| M9. 프롬프트 관리 DB 이관 | 완료 | handoff-07-07 |
| M10. 3-워커(Integrated Brief/LO-FI/Final Design) 분리 — API/DB 계층 | 완료 | handoff-07-08, 07-09 |
| M11. 3-워커 분리 — **n8n 워크플로우 JSON 자체** | **미완료(확인됨)** | 아래 B.4.1 참고 |
| M12. LO-FI 확정 → Final Design 생성 E2E 프로토타입 배선 | 완료(코드 레벨) | handoff-07-09 |
| M13. Worker Webhook 설정 Admin Page 이전 | 완료(코드 레벨), **DB 마이그레이션 적용 여부 미확인** | handoff-07-09 |
| M14. 배포 환경 전체 E2E QA(브라우저 기준) | 미완료 | handoff-07-09에서 "still recommended"로 명시 |

#### B.4.1 확인된 격차 — n8n 워크플로우 분리 미반영

`n8n/` 폴더의 실제 파일을 직접 확인한 결과, 워크플로우 파일 7개의 최종 수정일은 모두 **7/6 이전**이며, `integrated_brief_worker`, `lofi_draft_worker`, `final_design_worker` 같은 이름의 별도 워크플로우 파일이 로컬 저장소에 존재하지 않는다. 07-08/07-09 handoff는 Web/API/Admin 계층의 워커 분리가 완료되었다고 기술하지만, 이를 실제로 수행하는 **n8n 워크플로우 자체의 분리 작업은 로컬 파일 기준으로 아직 반영되지 않았다**(Cloud n8n에만 반영되어 있을 가능성도 배제할 수 없으나 이 리포트 작성 시점에는 검증 불가). API가 준비되어 있어도 실제 워커가 이를 소비할 형태로 분리되지 않았다면 E2E 흐름은 실제로 동작하지 않을 수 있다.

### B.5 진행률(Progress)

#### B.5.1 문서에 기록된 공식 수치 (원문 그대로 인용)

| 시점 | 수치 | 출처 |
| --- | --- | --- |
| 2026-07-01 | 금일 목표 대비 약 85% 완료 / 전체 목표 대비 약 65~70% 진행 | handoff-2026-07-01.md |
| 2026-07-03 | 전체 진행률 추정 약 65% (영역별: 문제 원인 분석 100%, Default Temp JSON 90%, B1 UX 85%, B2 UX 75%, B3 섹션 제어 35%, 생성 payload 70%, 프롬프트/n8n 연동 65%, QA 45%) | handoff-2026-07-03.md |

`daily-plan-2026-06-29-to-2026-07-03.md`의 일별 진행률 표는 06-29만 100%로 기록되고 06-30~07-03은 모두 "0% / 예정" 상태로 남아 있다. 이는 실제로 작업이 없었다는 뜻이 아니라 — 해당 daily-plan 문서 자체가 이후 업데이트되지 않았고, 실제 진행 기록은 같은 날짜의 handoff-*.md 문서 쪽에 남아있기 때문이다(문서 관리 방식의 불일치이며, 실제 진행 상황 판단은 handoff 문서를 신뢰해야 한다).

#### B.5.2 종합 판단 (2026-07-09 기준, 이번 리뷰의 추정치)

07-03 이후 커밋 194건 중 상당수가 07-04~07-09 사이에 집중되었고(07-04 23건, 07-08 9건, 07-09 11건), 이 기간에 워커 분리·Admin Page·Final Design 플로우 등 굵직한 기능이 추가됐다. 다만 다음 이유로 "전체 진행률"을 하나의 숫자로 단정하기는 어렵다.

- 핵심 품질 문제(Design MD 토큰 충실도 손실, 07-04)가 원인 진단만 되어 있고 수정 여부가 이후 handoff에서 재확인되지 않았다.
- n8n 워크플로우 분리(M11)가 API 대비 확인되지 않아, "기능 구현 완료"와 "E2E로 실제 동작"은 별개다.
- 배포 환경 DB 마이그레이션(012) 적용 여부, 실 webhook URL 등록 여부가 미확인 상태다.

이를 감안해 참고용으로 영역별 추정치를 제시한다(공식 수치가 아니라 이번 리뷰의 판단이며, 반드시 그렇게 라벨링해서 봐야 한다):

| 영역 | 추정 진행률 | 근거/제약 |
| --- | --- | --- |
| 코어 데이터 모델/API(runs/briefs/drafts/final designs) | 약 85% | 07-08/07-09 핸드오프, 소스코드 리뷰로 확인 |
| Admin Page(워커 webhook/프롬프트 관리) | 약 75% | 코드 완료, DB 마이그레이션·실 URL 등록 미확인 |
| n8n 워크플로우 분리(3 워커) | 약 20~30% | 설계 문서만 확인, 실제 워크플로우 파일 분리 미확인 |
| Design MD 토큰 충실도 문제 해결 | 약 30% | 원인 진단 완료, 수정 완료 여부 미확인 |
| 배포/E2E QA | 약 40% | 정적 검사(node --check)만 확인, 브라우저 E2E 미실시로 명시됨 |

---

## 종합 OKR (제안 — 공식 트래킹 없음, 이번 리뷰에서 문서 내용을 근거로 구성한 초안)

> docs 폴더 및 제공된 작업 리포트 어디에도 형식화된 OKR 문서가 없다. 아래는 반복적으로 등장하는 목표를 근거로 이번 리뷰에서 구성한 **제안 초안**이며, 실제 확정된 OKR이 아니다.

**Objective 1 (1단계 — Agent1): Google Docs/요구사항 원문만으로 신뢰 가능한 PRD 초안을 자동 생성**

| Key Result(제안) | 현재 추정 상태 |
| --- | --- |
| KR1-1. 요구사항 등록 → Git 저장 → PRD 생성 → Req/PRD 비교 검토 흐름이 코드 레벨로 구성 | 달성(06-17~06-18 기준 구조 구현 완료) |
| KR1-2. 위 흐름이 실제 배포 환경에서 오류 없이 1회 이상 End-to-End 성공 | **달성** — 06-18 시점 잔여 작업이었던 GitHub 쓰기 인증 이슈가 해결되어 현재 실사용 가능 |

**Objective 2 (2단계 — PROMO): 선택한 Design MD의 디자인 정체성을 잃지 않는 신뢰 가능한 자동 초안 생성 파이프라인 완성**

| Key Result(제안) | 현재 추정 상태 |
| --- | --- |
| KR2-1. Integrated Brief → LO-FI Draft → Final Design 3단계가 각각 독립 워커로 분리되어 운영 환경에서 동작 | API/DB 완료, n8n 워크플로우 분리 미확인 → 부분 달성 |
| KR2-2. 선택된 Design MD의 색상/레이아웃/컴포넌트 스타일이 최종 이미지에서 재현율 상위 기준 통과(예: 회귀 없이 "일반 GGPoker 다크 카지노"로 되돌아가지 않음) | 미달성(07-04 진단된 이슈, 해결 여부 미확인) |
| KR2-3. 운영자 승인 없이 다음 단계로 진행 불가(LO-FI 확정 게이팅) | 달성(코드 레벨, `promo-generation-lofi-draft-confirm.js`) |
| KR2-4. 신규 runKey 기준 3종 마크다운(design_prompt/promo_input/integrated_design_brief) 및 이미지 자산이 100% 저장/조회 가능 | 07-01 기준 부분 검증됨, 최신 재검증 기록 없음 |

---

## 종합 KPI 달성률

> 마찬가지로 공식 KPI 체계는 문서에 없다. 아래는 문서/리포트에 등장하는 정량 지표를 정리한 것이며, "달성률"이 아니라 "관측된 수치"로 이해해야 한다.

| 지표 | 관측값 | 출처/비고 |
| --- | --- | --- |
| (1단계) 인증/연동 오류 발생 건수 | 최소 6종(404, 403 Rate Limit, env 접근 차단, 401×2, repo 설정 오류) | 2026.06.17~06.18 작업 리포트 |
| (1단계) 보안 인시던트 | GitHub PAT 노출 1건(즉시 폐기·재발급 조치됨) | 2026.06.18 작업 리포트 |
| (2단계) 이미지 생성 응답 속도 | gemini-3.1-flash-image ~1분 27초 (gemini-3-pro-image는 이보다 느려 실사용 부적합 판단) | handoff-2026-07-02.md |
| (2단계) 이미지 해상도 이슈 | 실제 848×1264 vs 기대 ≥1024px 폭 — n8n Gemini 노드의 `options:{}` 누락이 원인으로 특정 | handoff-2026-07-02.md |
| (2단계) Integrated Brief 검증 최소 길이 기준 | 마크다운 6000자 이상 (코드 `validateIntegratedBrief` 확인) | 소스코드 리뷰 |
| (2단계) 워커 트리거 ACK 타임아웃 | 기본 2000ms, 500~5000ms 범위 | 소스코드 리뷰 |
| (2단계) 전체 진행률(문서상 마지막 공식치) | 약 65% (2026-07-03 기준) | handoff-2026-07-03.md |
| (2단계) 누적 커밋 수 | 194건 (06-25~07-09, 15일간) | git log |
| (2단계) 일별 커밋 밀도 최고 | 07-04 23건, 07-01 20건, 07-03 20건, 07-08 9건, 07-09 11건 | git log |

공식 KPI(예: "생성 성공률", "운영자 승인까지 걸린 시간", "재시도율")를 추적할 지표/로그가 현재 코드에는 존재하지 않는다. 필요하다면 `promo_generation_runs`/`promo_generation_lofi_drafts`/`promo_generation_final_designs`의 `status`, `created_at`, `updated_at`, `error_message` 컬럼을 활용해 다음 지표를 산출하는 쿼리를 추가하는 것을 제안한다: 단계별 성공/실패율, 평균 소요 시간, 재시도(`draft_attempt`) 횟수 분포.

---

## 종합 남은 과제

지금까지의 진행 상황은 긍정적이지만, 다음 항목들은 이미 만들어진 구조를 실제 운영 환경에서 검증하고 다듬는 단계로 남아 있어 다음 우선순위로 다룰 필요가 있다.

1. **Design MD 토큰 충실도 개선**(07-04 진단) — 선택된 스타일의 디자인 DNA가 Integrated Brief 생성 과정에서 희석되어 최종 이미지가 일반적인 GGPoker 다크 카지노 톤으로 회귀하는 현상. 원인은 상세히 진단되어 있으며, 07-06에 제안된 JSON 우선 아키텍처 적용이 다음 단계다.
2. **n8n 워크플로우의 3-워커 분리 마무리** — Web/API/Admin은 이미 3-워커 체계로 준비됐지만, 로컬 `n8n/*.json` 파일은 아직 예전 단일 구조로 보인다(최종 수정 7/6). Cloud n8n에 이미 반영되어 있을 가능성도 있어 우선 확인이 필요하다.
3. **DB 마이그레이션 적용 확인** — `012_worker_webhook_settings.sql`이 대상 환경(운영 DB)에 적용되었는지 확인 필요.
4. **로컬-원격 브랜치 동기화** — local main이 origin 대비 1커밋 앞선 상태이므로 push 필요(07-09 handoff 명시).
5. **네이밍 정리** — 기존 `design_documents.design_concept_json`(레퍼런스 MD 라이브러리 분석용)과 신규 제안된 `promo_generation_design_concepts`(추천 후보용)의 이름이 유사해 혼동 가능성이 있어 정리가 필요.
6. **배포 환경 E2E 브라우저 테스트** — 정적 문법 검사(`node --check`)는 통과했으나, 실제 브라우저 기준 전체 플로우(Admin webhook 등록 → 브리프 생성 → LO-FI 생성 → 확정 → Final Design 생성 → 프리뷰) 검증이 다음 단계로 남아 있음(07-09 handoff 명시).
7. **보안 절차 재확인** — 1단계(Agent1) 진행 중 채팅에서 GitHub 토큰이 노출된 사고가 있었고, 즉시 폐기·재발급으로 잘 대응했다. 유사 사고 재발 방지를 위해 토큰/시크릿을 코드·채팅에 직접 붙여넣지 않는 절차를 프로젝트 전반에 계속 유지할 필요가 있다.

---

## 종합 다음 단계 제안

1. 로컬 커밋 push 및 `012_worker_webhook_settings.sql` 대상 환경 적용 여부 확인.
2. Admin Page에 4개 워커 stage(integrated_brief/lofi_draft/final_design/promo_ui_design)의 실제 n8n webhook URL 등록.
3. n8n 워크플로우 자체의 3-워커 분리 여부를 Cloud n8n에서 직접 확인하고, 미반영이면 반영 작업을 우선순위 최상단으로 배치.
4. 실제 프로모션 입력값으로 전체 E2E(브리프→LO-FI→확정→Final Design) 브라우저 테스트 1회 이상 수행.
5. Design MD 토큰 충실도 손실 문제에 대한 수정(07-06 제안된 JSON 우선 아키텍처 적용 등) 착수 및 결과 검증.
6. 위 KPI 섹션에서 제안한 상태/시간 기반 로그 쿼리를 추가해 다음 중간보고부터는 관측 가능한 정량 지표로 진행률을 보고.

---

*본 리포트는 사용자가 제공한 1단계(Agent1) 작업 리포트 4건과, docs 폴더의 handoff/daily-plan/weekly-plan 문서 및 소스코드/git 로그(2단계, PROMO)를 근거로 작성되었다. Part A(1단계)는 제공된 PDF 리포트 및 사용자 확인 사항을 근거로 했으며, Part B(2단계)는 소스코드/git 로그로 교차 검증했다. OKR/KPI 섹션은 두 단계 모두 공식 트래킹 자료가 없어 이번 리뷰에서 구성한 제안 초안임을 다시 한 번 명시한다. 1인이 기획·개발·인프라를 모두 수행한 점을 감안하면, 현재까지의 진행 속도와 완성도는 전반적으로 긍정적으로 평가할 수 있다.*
