# AI Week 대표 사례 제출 보고서

> **핵심 질문에 대한 답**  
> 가장 느린 구간은 프로모션 요구사항이 기획·운영 조직에서 디자인·개발·QA 조직으로 넘어갈 때마다 문서, 이미지, 레이아웃, 코드로 반복 변환되고 재검수되는 핸드오프 구간이었다. 이를 AI Builder, n8n Workflow, 서버 Worker API, Registry 기반 결정적 Compiler, Asset Pipeline, Visual Editor, Desktop·Mobile Quality Gate로 연결해 하나의 검증 가능한 제작 흐름으로 전환했다.

## 0. 종합 요약

Promo Web Builder는 초기의 UI 디자인 이미지 생성 POC를 **요구사항 입력 → 구조 설계 → 자산 생성 → 편집 → 품질 검증 → Web Output**으로 연결된 AI 제작 플랫폼으로 확장한 사례다.

- **병목:** 조직 간 이관 때마다 요구사항을 디자인 문서, 이미지, 레이아웃, 코드로 다시 해석하면서 대기·재작업·검수 반복이 발생했다.
- **연결:** 자연어 입력을 구조화된 Builder Document로 변환하고, 이미지 생성 상태와 편집 결과를 같은 문서 계약으로 이어 품질 통과 결과만 다음 단계로 전달한다.
- **자동화:** Prompt Rendering, LLM 응답 Parsing·Validation, Composition, 이미지 Queue·Retry, Asset Readiness, Desktop·Mobile 품질 검사를 자동화했다.
- **통제:** 승인된 Component·Preset·Token·Prompt·Resource만 사용하고 Revision·Fingerprint를 기록해 생성 결과를 추적한다.
- **확인 결과:** 자동 테스트 파일은 0개에서 137개로 증가했으며, Browser E2E와 Visual Editor Production Build를 배포 판단 근거로 연결했다.
- **남은 단계:** 최신 품질 게이트 변경분 배포, Node 22.x Release CI 재검증, 운영 환경의 실제 제작시간·토큰 사용량 수집이 필요하다.

## AI Week 핵심 방향과의 연결

| 관점 | 적용 내용 | 현재 증빙 | 후속 측정 |
|---|---|---|---|
| Speed First | 단계별 수동 전달 대신 단일 Builder Document와 상태 기반 자동 전환을 사용 | Composition·Asset Readiness·Quality Gate 구현 및 테스트 | 접수부터 Web Output까지 리드타임 |
| End-to-End | 요청 조직의 자연어 입력을 제작·운영 조직이 즉시 편집·검증 가능한 문서로 전달 | Wizard→Compiler→Asset→Editor→Quality Gate→Output 연결 | 조직별 대기시간·재작업 횟수 |
| Token Optimization | Prompt Version, Provider Routing, 구조화 Contract, 결정적 Compiler로 재생성과 자유 출력을 제한 | Prompt·LLM Control Plane, Registry Contract v3 | 성공 문서당 입력·출력 Token과 재시도율 |
| Secure by Default | Allowlist, Contract Validation, Resource Version Pinning, Secret 외부 보관 원칙 적용 | 승인 자산 Registry, 변수 검증, Handoff 보안 지침 | 권한별 실행 로그·외부 전송 감사 |

---

## 1. 기존 프로세스 (As-Is)

> **핵심 내용:** 기존 병목의 본질은 AI 생성 속도가 아니라, 요청 조직의 산출물이 제작·검증·배포 조직으로 넘어갈 때마다 다른 형식으로 재해석되고 사람이 완료 여부를 전달해야 했다는 점이다.

### 기존 업무 흐름

1. 요청 조직이 프로모션 목적과 문구를 문서나 메시지로 전달한다.
2. 제작 조직이 요구사항을 Design MD, Section 입력, 화면 구조로 다시 해석한다.
3. AI 또는 n8n에서 디자인 이미지와 Markdown을 생성한 뒤 사람이 결과를 확인한다.
4. 생성 이미지를 기준으로 개발자가 Section과 Component를 다시 구현한다.
5. Builder·Admin·출력 화면별 편집 로직과 스타일 차이를 수동으로 보정한다.
6. Desktop과 Mobile에서 레이아웃·이미지·문구를 사람이 반복 점검한다.
7. 검수 완료 여부를 별도로 전달한 뒤 저장·배포를 진행한다.

### 핵심 병목

- **반복 변환:** 같은 요구사항이 문서, Prompt, 이미지, 레이아웃, 코드로 여러 번 재작성됐다.
- **이관 대기:** 앞 단계의 결과 확인과 설명이 끝나야 다음 조직이 작업을 시작할 수 있었다.
- **재작업:** AI 결과가 승인된 Component·Token 계약과 맞지 않거나 이미지가 미완성인 경우 다시 생성·수정해야 했다.
- **분산 검수:** Desktop·Mobile 품질, 자산 완료 여부, Prompt·Model 설정이 서로 다른 화면과 Workflow에서 확인됐다.
- **운영 추적 부족:** 어떤 Prompt·Resource·Revision으로 결과가 만들어졌는지 재현하기 어려웠다.

> 초기 POC는 UI 디자인 이미지 생성과 결과 확인에는 성공했지만, 해당 산출물이 다음 조직의 편집·검증·배포 입력으로 자동 연결되는 구조는 아니었다.

## 2. 개선 프로세스 (To-Be)

> **핵심 내용:** 자연어 요구사항을 하나의 Builder Document로 전환하고 자산 준비와 품질 검증을 같은 문서 흐름에 연결해, 다음 조직이 별도 재작성 없이 즉시 사용할 수 있도록 했다.

### 개선된 End-to-End 흐름

1. 요청 조직이 Promo Wizard 또는 AI Builder에 자연어 요구사항을 한 번 입력한다.
2. Worker API가 Prompt를 렌더링하고 LLM 응답을 Parsing·Validation한다.
3. Registry Contract v3와 결정적 Compiler가 승인된 Component·Preset·Token으로 Builder Document를 생성한다.
4. Asset Pipeline이 필요한 이미지를 Queue에 등록하고 Retry·Lease·상태 Polling을 처리한다.
5. Asset Readiness가 필수 이미지와 Expected Coverage를 확인한 뒤 완성 문서만 Visual Editor로 전달한다.
6. 제작·운영 조직은 공통 Visual Editor에서 동일한 Snapshot·Layout Engine으로 수정한다.
7. Desktop·Mobile Quality Gate가 충돌, 영역 잘림, Overflow, 필수 이미지 누락을 자동 검사한다.
8. Blocking 문제가 없는 결과만 저장·Web Output·배포 단계로 전달한다.

### 개선 효과

- 요청 조직의 **자연어 산출물**이 제작 조직의 **편집 가능한 Builder Document**로 자동 변환된다.
- 중간 조직은 파일 재작성보다 승인·예외 처리·콘텐츠 판단에 집중한다.
- 미완성 이미지와 Blocking 레이아웃이 다음 단계로 넘어가지 않는 Fail-closed 흐름이 적용됐다.
- Prompt, Model, Template, Component, Preset, Token을 운영 화면과 API에서 관리한다.
- Snapshot, Revision, Fingerprint, Resource Version으로 결과 생성 근거를 추적한다.

### As-Is → To-Be 전환 다이어그램

| As-Is 병목 | AI·자동화 연결 | To-Be 결과 |
|---|---|---|
| 문서·메시지 요구사항을 단계마다 재해석 | AI Builder·Prompt Rendering | 검증된 구조 요구사항으로 변환 |
| 디자인 이미지 기준으로 Section·Component 재구현 | Registry Contract·결정적 Compiler | 편집 가능한 Builder Document 생성 |
| 이미지 완료 여부를 사람이 확인·전달 | Queue·Retry·Asset Readiness | 완성 자산만 Visual Editor로 전달 |
| Desktop·Mobile을 사람이 반복 검수 | DOM Quality Gate·Browser E2E | Blocking 없는 Revision만 저장·출력 |
| 검수 완료 여부를 별도 전달 | 통과 상태·Revision·Fingerprint 기록 | 운영·배포 조직이 즉시 사용하는 Web Output |

## 3. AI 적용 기술 및 자동화 구간

> **핵심 내용:** AI는 자유롭게 결과를 생성하는 역할이 아니라, 승인된 계약 안에서 구조를 제안하고 자동화 모듈이 검증·저장·전달하는 제한형 Agent로 배치했다. 사람은 목적 입력, 승인, 예외 판단, 브랜드 최종 편집에 집중한다.

| 구간 | 적용 기술 | 자동화 내용 | 사람의 역할 |
|---|---|---|---|
| 요구사항 해석 | AI Builder·LLM Provider Routing | 자연어 Overview 분석, Prompt Rendering, 응답 정규화 | 목적·필수 문구 입력 |
| 페이지 구성 | Registry Contract v3·결정적 Compiler | 허용된 Section·Component·Preset 조합, Revision 생성 | 제안 결과 승인·예외 판단 |
| Workflow 연결 | n8n Webhook·Worker API | 단계 실행, 상태 전달, 서버 Parsing·Validation·저장 호출 | 실패 원인 확인 |
| 이미지 자산 | AI Image Provider·Queue·Retry·Lease | 이미지 요청, 상태 Polling, 재시도, Blob 저장 | 실패 자산 재시도 승인 |
| 편집 | Visual Editor Core·Layout Engine | Snapshot 저장·복원, 반응형 배치, 충돌 진단 | 콘텐츠·브랜드 최종 편집 |
| 품질 검증 | Desktop·Mobile DOM Quality Gate·Browser E2E | 충돌·잘림·Overflow·필수 이미지 검사, 저장·출력 차단 | Blocking 항목 수정·재검사 |
| 운영 통제 | Prompt Version·Design Token·Registry Admin | Active/Draft, 변수 검증, 승인 자산·Version 관리 | 정책 승인·배포 결정 |

### MCP 적용 범위

현재 저장소에서 확인되는 연결 수단은 n8n Webhook과 서버 API다. 따라서 본 제출안은 MCP를 이미 적용했다고 표현하지 않는다. AI Week 발표에서 MCP를 포함하려면 향후 외부 조직 시스템과의 권한 기반 산출물 전달 구간을 MCP Server·Tool로 확장하고 실행 로그와 권한 범위를 추가 증빙해야 한다.

## 4. 연결 구조 ★

> **핵심 내용:** 요청 조직의 자연어 Brief가 AI·자동화 노드를 통과해 제작 조직의 편집 문서가 되고, 품질 통과 Revision이 운영·배포 조직의 인풋으로 이어지는 7개 노드 연결 구조다.

### 조직·Agent 노드 흐름

| 흐름 | 노드 | 수행 역할 | 다음 노드로 전달되는 인풋 |
|---|---|---|---|
| 01 | 요청 조직 — 기획·운영 | 자연어 목적·대상·혜택·문구 입력 | 프로모션 Brief |
| 02 | AI Builder·Worker Agent | Overview 분석, Prompt Rendering, LLM 응답 Parsing·Validation | 검증된 구조 제안 |
| 03 | Registry Composition Agent | 승인 Component·Preset·Token 선택, Revision·Fingerprint 생성 | Builder Document |
| 04 | Asset Automation | 이미지 Queue·Retry·저장, Readiness·Expected Coverage 확인 | 자산 완성 문서 |
| 05 | 제작 조직 — 디자인·콘텐츠·프론트엔드 | 공통 Visual Editor 편집, Snapshot 저장 | 편집 완료 Revision |
| 06 | Quality Gate Agent | Desktop·Mobile DOM 검사, Blocking 차단, Browser E2E | 품질 통과 Revision |
| 07 | 운영·배포 조직 | 통과 결과를 Web Output·배포 인풋으로 사용 | 배포 가능한 산출물 |

> 이번 사례의 핵심은 “AI로 이미지를 빨리 생성했다”가 아니라, **요청 조직의 자연어 산출물이 제작 조직의 편집 문서로 자동 변환되고, 품질 통과 결과가 운영·배포 조직의 인풋으로 이어진 것**이다.

## 5. 정량적 효율화 수준

> **핵심 내용:** 현재 확정 가능한 성과는 자동 테스트 137개와 Desktop·Mobile 자동 품질 검사 도입이다. 핸드오프 6→1과 83.3% 감소는 운영 실측 전 프로세스 기준 예측치로 분리한다.

### 핵심 KPI 인포그래픽

| 자동 테스트 | 품질 검사 범위 | 중간 핸드오프 |
|---|---|---|
| **0 → 137개** | **0 → 2 Viewport** | **6 → 1 예측** |
| 회귀 검증 체계 신규 확보 | Desktop·Mobile 자동 검사 | 최대 83.3% 감소 모델 |

### 증거로 확인된 수치

| 지표 | Before | After | 변화 | 증빙 기준 |
|---|---:|---:|---:|---|
| 자동 테스트 파일 | 0개 | 137개 | 137개 신규 확보 | 2026-08-21 전체 테스트 결과 |
| 자동 품질 검사 Viewport | 0개 | 2개 | Desktop·Mobile 자동 검사 도입 | Preview Quality Gate·Browser E2E |
| 테스트 체계 성장 | 7월 초 기준 미구축 | 7/24 55개 → 7/27 66개 → 8/6 117개 → 8/21 137개 | 단계별 확대 | Git·Handoff·진행 보고서 |
| 개발 이력 | 최초 확인 커밋 2026-06-25 | 2026-08-21 기준 전체 599개, Merge 제외 593개 | 활동일 51일 | Git 이력 집계 |
| 품질 게이트 결과 | 생성 성공 여부 중심 | 자산 완료+Desktop·Mobile DOM 통과 필요 | Fail-closed 조건 추가 | Quality Gate 구현·테스트 |

### 제출용 예측치 — 운영 실측 후 확정

기존 흐름의 사람 중심 전달·확인 지점을 6개로 보고, 개선 흐름의 필수 개입을 **최초 입력과 최종 승인 중심**으로 축소하면 중간 핸드오프는 6개에서 1개 수준으로 줄어드는 구조다. 이는 **프로세스 기준 최대 83.3% 감소 예측치**이며, 실제 제출 수치로 사용하기 전에 운영 Run Log로 다음 항목을 측정해야 한다.

1. 프로모션 요청 접수부터 Preview Ready까지의 P50·P95 리드타임
2. 조직 간 대기시간과 수동 전달 횟수
3. 1차 Quality Gate 통과율과 평균 Repair 횟수
4. 성공 문서 1건당 LLM·이미지 Token 또는 비용
5. 재생성·재시도율과 Provider별 생성시간 P95

> **정량 표현 원칙:** 137개 테스트와 Desktop·Mobile 자동 검사는 구현·검증된 수치다. 83.3%는 운영 전 프로세스 모델 기준 예측치이므로 발표 자료에는 반드시 “예측”으로 표시하고, 실제 Run Log 확보 후 교체한다.

## 6. 증빙 자료 링크

> **핵심 내용:** 주장의 근거는 기간별 진행 보고서, 단계별 Handoff, 개발계획서, 실제 Contract·Compiler·Editor 코드와 137개 테스트 결과로 추적할 수 있다.

### 대표 근거

- `docs/자료/promo-web-builder-progress-report-2026-06-08-to-2026-08-21.md` — 기간별 개발·테스트·배포 현황
- `docs/handoff/handoff-2026-06-27.md` — UI 디자인 이미지 생성 POC와 초기 흐름
- `docs/handoff/handoff-2026-06-30.md` — Design MD·Section Log·Integrated Brief 연결 및 Production 확인
- `docs/handoff/handoff-2026-07-08.md` — n8n Harness와 Worker API 책임 분리
- `docs/handoff/frontend-platform-unification-foundation-handoff-2026-07-24.md` — 공통 Editor·Layout·Prompt 기반
- `docs/handoff/handoff-2026-08-06.md` — Registry Composition·Revision·Fingerprint·운영 상태
- `docs/계획/ai-builder-auto-composition-and-preview-readiness-development-plan-2026-08-17.md` — 자동 Composition과 Asset Readiness
- `docs/계획/ai-promotion-component-drag-and-overlap-remediation-development-plan-2026-08-17.md` — Drag·Overlap 진단·보정
- `docs/계획/ai-live-preview-design-quality-gate-development-plan-2026-08-20.md` — Desktop·Mobile 품질 게이트

### 코드·테스트 증빙

- Registry Contract·Compiler: `api/_promo-registry-composition-contract.js`, `api/_promo-registry-composition-compiler.js`
- Composition API: `api/promo-page-composition-*.js`
- Visual Editor·Renderer: `visual-editor/src/App.vue`, `visual-editor/src/PromoPageRenderer.vue`
- Editor Core·Layout Engine: `visual-editor/src/platform/editor-core/`, `visual-editor/src/platform/layout-engine/`
- Token Runtime: `shared/promo-token-runtime.mjs`
- 자동 테스트·Browser E2E: `scripts/test-*.js`, `scripts/test-*.mjs`

## 7. 실현 단계

> **핵심 내용:** 핵심 기능과 로컬 통합 검증은 완료됐고, 제출 단계는 ‘구축 중’이다. Production 배포·Node 22.x CI·운영 리드타임 및 Token 비용 실측이 완료되면 운영 사례로 전환할 수 있다.

### 실현 단계 인포그래픽

| 구축 완료 | 로컬 검증 완료 | 운영 측정 필요 | 확장 후보 |
|---|---|---|---|
| Composition·Asset·Editor | 137개 Test·Browser E2E | Lead Time·Token·비용 | 권한 기반 MCP 연결 |
| 핵심 기능 구현 | 최신 품질 게이트 통과 | Production Run 데이터 | 조직 시스템 간 Tool화 |

| 영역 | 단계 | 현재 상태 | 다음 완료 조건 |
|---|---|---|---|
| 자연어→Composition | 구축 완료 | Contract v3·Compiler·Revision 구현 | 운영 실제 문서 품질 지표 저장 |
| Asset Pipeline | 구축·테스트 완료 | Queue·Retry·Readiness·Coverage 구현 | Provider별 운영 지표 수집 |
| Visual Editor | 핵심 구축 완료 | 공통 Editor Core·Layout Engine 연결 | Golden Scenario 확대 |
| Quality Gate | 로컬 검증 완료 | Desktop·Mobile 검사·Browser E2E 통과 | 최신분 Production 배포 |
| 자동 테스트 | 로컬 통과 | 137개 전체 통과 | Node 22.x Release CI 재검증 |
| Token Optimization | 측정 설계 필요 | Prompt Version·Provider Routing 기반 확보 | 성공 문서당 Token·비용 Dashboard |
| MCP 조직 연결 | 확장 후보 | 현재 n8n Webhook·서버 API 기반 | 권한 기반 MCP Tool·감사 로그 설계 |

**제출 단계 표기:** 구축 중  
**세부 표기:** 핵심 기능 개발과 로컬 통합 검증 완료 / 최신 품질 게이트 변경분 Production 배포 및 운영 효율 실측 예정

---

## 발표용 핵심 스토리

### 한 문장

프로모션 요구사항을 조직마다 다시 해석하던 흐름을, 자연어 입력이 검증된 편집 문서와 Web Output으로 이어지는 AI Agent·자동화 파이프라인으로 연결했다.

### 30초 설명

기존에는 프로모션 기획이 디자인 문서, 이미지, 레이아웃, 코드로 넘어갈 때마다 사람이 다시 해석하고 검수해야 했다. Promo Web Builder는 자연어 요구사항을 승인된 Registry 안에서 Builder Document로 변환하고, 이미지 준비와 Desktop·Mobile 품질을 자동 검사해 통과 결과만 다음 조직에 전달한다. 현재 137개 자동 테스트와 Browser E2E를 확보했으며, 운영 단계에서는 리드타임·재작업·Token 비용을 Run 단위로 측정할 예정이다.

## 제출 전 보완 체크리스트

1. “요청 조직·제작 조직·운영 조직”을 실제 조직명으로 교체한다.
2. 동일 유형 프로모션 10건 이상을 대상으로 As-Is·To-Be 리드타임을 측정한다.
3. 83.3% 예측치를 실제 대기시간·수동 이관 횟수 감소율로 교체한다.
4. 성공 문서당 Token·이미지 비용과 재시도율을 Dashboard로 캡처한다.
5. Production 배포 Commit, Node 22.x CI, 실제 Desktop·Mobile Smoke Test 링크를 추가한다.
6. 민감정보, 권한, 외부 Provider 전송 범위와 Secret 관리 방식을 보안 검토 결과로 첨부한다.
7. 연결 구조를 발표 자료에서는 노드 다이어그램으로 시각화한다.
