# 프로모션 빌더 제품 고도화 실행 로드맵 및 Task 구성

## 0. 문서 정보

- 작성일: 2026-09-02
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 실행 백로그 초안
- 상위 계획서: `docs/계획/promo-builder-productization-and-design-reference-platform-development-plan-2026-08-31.md`
- 대표 Agenda 로드맵: `docs/계획/promo-builder-productization-agenda-roadmap-2026-09-02.md`
- 대표 Task 중심 로드맵: `docs/계획/promo-builder-productization-task-oriented-roadmap-2026-09-02.md`
- 목적: POC 이후 제품 고도화 작업을 개발 가능한 로드맵과 검증 가능한 Task로 분해한다.
- 일정 표기: 팀 규모와 담당자가 확정되지 않았으므로 달력 날짜 대신 의존성·완료 게이트·작업 크기를 사용한다.

---

## 1. 실행 원칙

### 1.1 작업 순서 원칙

```text
현행 기준선
→ 도메인·데이터·상태 계약
→ 공통 운영 기반
→ Screenshot Reference E2E
→ 관리자 검수·승인
→ 빌더 수동 적용
→ URL Capture
→ 자동 추천
→ 운영 전환·최적화
```

다음 작업은 선행 계약이 완료되기 전에 시작하지 않는다.

- DB·상태 계약 이전에 관리자 편집 UI를 구현하지 않는다.
- 분석 JSON Schema 이전에 Vision Prompt를 확정하지 않는다.
- 승인 상태와 권한 계약 이전에 빌더 검색 API를 공개하지 않는다.
- Registry Mapping 이전에 레퍼런스 기반 자유 CSS 생성을 구현하지 않는다.
- Screenshot E2E가 안정화되기 전에 URL Browser Worker를 핵심 경로에 연결하지 않는다.
- 검색 평가 데이터셋 이전에 Vector 검색을 도입하지 않는다.
- 승인·거절·수정 데이터가 축적되기 전에 파인튜닝을 추진하지 않는다.

### 1.2 Task 크기

| 크기 | 기준 |
|---|---|
| S | 단일 책임, 계약 또는 파일군이 제한적이고 독립 검증 가능 |
| M | API·DB·UI 중 두 영역이 연결되거나 다수 테스트가 필요한 작업 |
| L | 여러 계층을 연결하는 E2E 작업. 시작 전 하위 Task 분할 검토 필수 |

`L` Task는 구현 시작 전 가능한 한 `S/M` 단위 Subtask로 다시 분해한다.

### 1.3 Task 상태

```text
Backlog → Ready → In Progress → Review → Verified → Done
                         └──────────────→ Blocked
```

- `Ready`: 선행 Task와 요구사항, 테스트 방법이 확정됨
- `Review`: 코드·Migration·문서 검토가 가능한 상태
- `Verified`: 자동 테스트와 필요한 수동 검증을 통과함
- `Done`: 문서, 관측, Rollback까지 완료됨
- `Blocked`: 차단 사유와 필요한 결정 또는 외부 상태가 기록됨

### 1.4 공통 Definition of Ready

모든 Task는 다음 조건을 만족해야 시작할 수 있다.

- 목적과 비목표가 명확하다.
- 변경할 도메인과 책임 모듈이 지정됐다.
- 입력·출력·오류 계약이 정의됐다.
- 선행 Task가 완료됐다.
- 데이터 변경 시 Migration·Rollback 방향이 있다.
- 검증 방법과 완료 기준이 있다.
- 외부 서비스 비용 또는 권한이 필요하면 사전 확인됐다.

### 1.5 공통 Definition of Done

- 구현과 코드 검토 완료
- 단위·계약·통합 테스트 통과
- 오류·빈 상태·권한 거부 상태 확인
- 관련 문서와 API 계약 현행화
- Feature Flag 또는 Rollback 경로 확인
- 로그에 비밀정보·원문 개인정보가 남지 않음
- 기존 Template Mode와 AI Mode의 핵심 회귀 없음
- Desktop·Mobile 영향을 받는 경우 양쪽 검증 완료
- Git 작업 트리와 커밋 범위가 정리됨

---

## 2. 전체 로드맵

| 순서 | 로드맵 | 목표 | 주요 산출물 | 종료 게이트 |
|---|---|---|---|---|
| RM-00 | 현행 기준선·범위 확정 | POC 자산과 제품 책임 경계 확정 | AS-IS Map, 결정표, 회귀 기준선 | Gate 0 |
| RM-01 | 공통 제품 운영 기반 | 오류·상태·작업·권한·관측 계약 통합 | 공통 Contract, Job Runtime, Audit | Gate 1 |
| RM-02 | Design Reference 데이터 기반 | Source·Capture·Analysis·Review 데이터 모델 구축 | Migration, Store, API Contract | Gate 2 |
| RM-03 | Screenshot 수집·분석 | 이미지 입력에서 구조화 Draft 생성 | Upload, Vision Analyzer, Normalizer | Gate 3 |
| RM-04 | 관리자 검수·승인 | 분석 결과를 사람이 검토해 게시 | Library, Review UI, Approval API | Gate 4 |
| RM-05 | 빌더 적용·품질 게이트 | 승인 Reference를 안전하게 프로모션에 적용 | Retrieval, Mapping, Preview Gate | Gate 5 |
| RM-06 | 공개 URL Capture | 공개 웹페이지를 격리 환경에서 수집 | Safe URL, Browser Worker, DOM/CSS | Gate 6 |
| RM-07 | 자동 추천·피드백 | 적합한 Reference 자동 추천과 학습 데이터 축적 | Ranker, Feedback, Evaluation | Gate 7 |
| RM-08 | 운영 전환·지속 개선 | 배포·관측·지원·정리 체계 완성 | Rollout, Runbook, SLO, Cutover | Gate 8 |

### 2.1 핵심 경로

```text
RM-00
  ↓
RM-01
  ↓
RM-02
  ↓
RM-03
  ↓
RM-04
  ↓
RM-05
  ↓
RM-06
  ↓
RM-07
  ↓
RM-08
```

RM-06의 보안 설계와 위협 모델링은 RM-01 이후 병렬로 시작할 수 있지만, 실제 URL Capture를 빌더에 연결하는 것은 Gate 5 이후로 제한한다.

### 2.2 병렬 작업 트랙

| 트랙 | 담당 범위 | 병렬 가능 시점 |
|---|---|---|
| Contract/Data | 도메인, Schema, Migration, Store | RM-00부터 |
| Reliability/Security | Job, Retry, Auth, Audit, SSRF | RM-01부터 |
| AI/Analysis | Prompt, Schema, Vision, Normalizer | RM-02 Schema 확정 후 |
| Admin UX | Library, Detail, Review UI | RM-02 API Contract 확정 후 |
| Builder UX | Search, Selection, Apply, Undo | RM-04 Approval Contract 확정 후 |
| QA/Observability | Fixtures, Metrics, E2E, Runbook | 모든 로드맵과 병행 |

---

## 3. RM-00 — 현행 기준선 및 제품 범위 확정

### 3.1 목표

현재 코드가 실제로 제공하는 기능과 POC 잔여물을 구분하고, 이후 모든 변경이 따를 기준선을 만든다.

### 3.2 Task

| ID | P | 크기 | Task | 선행 | 산출물·완료 기준 |
|---|---|---:|---|---|---|
| RM00-T01 | P0 | M | 화면·Route 인벤토리 작성 | 없음 | `prototype`, `admin-app`, `visual-editor`의 진입점·사용 여부·Owner가 표로 정리됨 |
| RM00-T02 | P0 | M | API·Worker 인벤토리 작성 | 없음 | 모든 `/api` Endpoint, n8n Workflow, 내부 Helper의 책임과 호출자가 연결됨 |
| RM00-T03 | P0 | M | DB Schema·Migration 현행화 감사 | 없음 | Migration 001~현재, 운영 적용 여부, 미사용·중복 테이블, Index 위험이 기록됨 |
| RM00-T04 | P0 | M | 핵심 E2E 흐름 지도 작성 | T01,T02,T03 | Template Mode, AI Mode, Asset Generation, Preview, Export의 데이터 흐름이 연결됨 |
| RM00-T05 | P0 | S | 유지·보완·교체 결정표 확정 | T04 | 각 주요 모듈에 `keep/harden/replace/retire` 판정과 근거가 있음 |
| RM00-T06 | P0 | M | 테스트 기준선 실행·분류 | T01,T02 | 기존 Test를 계약·행동·브라우저·Worker로 분류하고 실패·미검증 영역 기록 |
| RM00-T07 | P0 | S | 제품 용어 사전 확정 | T05 | Reference, Source, Capture, Analysis, Pattern, Review, Publish 용어가 기존 용어와 충돌하지 않음 |
| RM00-T08 | P0 | S | 정책 결정 목록 Owner 지정 | T05,T07 | 권리, 보존기간, 공개 URL 범위, n8n 책임 등 결정 항목마다 Owner·기한·상태가 있음 |
| RM00-T09 | P0 | S | Feature Flag와 배포 단위 초안 | T04 | 기존 흐름을 유지하며 Reference 기능을 독립 활성화할 Flag 경계가 정의됨 |
| RM00-T10 | P0 | S | 기준선 보고서 승인 | T01~T09 | 관련 담당자가 범위·우선순위·비목표를 승인하고 Gate 0 체크리스트 완료 |

### 3.3 Gate 0

- [ ] 실제 사용 중인 화면·API·DB·Worker가 식별됐다.
- [ ] 각 핵심 기능의 단일 책임 모듈 또는 정리 대상이 결정됐다.
- [ ] 유지·보완·교체·폐기 범위가 승인됐다.
- [ ] 기존 핵심 E2E 회귀 테스트 기준선이 확보됐다.
- [ ] 해결되지 않은 정책 결정에 Owner가 지정됐다.

---

## 4. RM-01 — 공통 제품 운영 기반

### 4.1 목표

외부 디자인 레퍼런스뿐 아니라 기존 AI 생성 흐름에도 재사용할 상태·오류·작업·권한·감사 기반을 통일한다.

### 4.2 Task

| ID | P | 크기 | Task | 선행 | 산출물·완료 기준 |
|---|---|---:|---|---|---|
| RM01-T01 | P0 | M | 공통 API Envelope·오류 코드 계약 | RM00-T10 | 성공·검증 오류·충돌·권한·재시도 가능 오류 형식과 테스트 Fixture 확정 |
| RM01-T02 | P0 | S | Request ID·Correlation ID 전파 | T01 | API→Worker→Provider→DB 로그에서 동일 요청 추적 가능 |
| RM01-T03 | P0 | M | Idempotency 계약과 저장 방식 | T01 | 동일 Key 중복 요청이 하나의 Resource/Job만 만들고 충돌 응답이 결정론적임 |
| RM01-T04 | P0 | L | 공통 Job 상태·Lease·Retry 모듈 | T01,T03 | queued/processing/ready/failed/cancelled, Lease 만료 복구, Backoff 테스트 통과 |
| RM01-T05 | P0 | M | Prompt·Model·Input·Output Snapshot 표준 | RM00-T03 | 실행마다 Provider, Model, Prompt Version, Input Hash, Contract Version 저장 |
| RM01-T06 | P0 | M | Actor·Owner·Role 권한 계약 | RM00-T07,T01 | Viewer/Editor/Reviewer/Admin의 API 권한 Matrix와 거부 테스트 완료 |
| RM01-T07 | P0 | M | Audit Event 공통 저장 계약 | T02,T06 | 생성·수정·승인·거절·Archive의 Actor와 이전/이후 상태 추적 가능 |
| RM01-T08 | P0 | M | Blob/DB 정합성 처리 | T03,T04 | 업로드 성공·DB 실패 및 반대 상황에서 고아 데이터 탐지·복구 가능 |
| RM01-T09 | P0 | S | 비밀정보·PII 로그 필터 | T02,T05 | Token, Cookie, Authorization, 원문 개인정보가 로그에 남지 않는 테스트 통과 |
| RM01-T10 | P0 | M | Feature Flag·Rollout Helper | RM00-T09,T06 | 사용자/환경/비율별 Flag와 안전한 기본값, Kill Switch 제공 |
| RM01-T11 | P0 | M | Migration Apply·Verify·Rollback 절차 | RM00-T03 | 신규 Migration에 사전 점검·적용·검증·Rollback Runbook 존재 |
| RM01-T12 | P0 | M | 운영 지표·구조화 로그 기반 | T02,T04,T05 | 작업 시간, 성공/실패, Provider 비용, Retry 횟수 측정 가능 |
| RM01-T13 | P0 | M | 공통 기반 회귀 통합 테스트 | T01~T12 | 기존 AI Asset/Composition 흐름에서 상태·오류 계약 회귀 없음 |

### 4.3 Gate 1

- [ ] 중복 요청이 중복 작업이나 중복 비용을 만들지 않는다.
- [ ] 중단된 Worker 작업이 Lease 만료 후 복구된다.
- [ ] API부터 외부 Provider까지 하나의 Request ID로 추적된다.
- [ ] 모든 AI 실행의 입력·모델·프롬프트 버전이 재현 가능하다.
- [ ] 권한과 감사 이벤트가 자동 테스트로 검증된다.

---

## 5. RM-02 — Design Reference 데이터 기반

### 5.1 목표

Design MD, Screenshot, URL을 하나의 상위 Reference 도메인으로 관리할 데이터·Store·API 계약을 구축한다.

### 5.2 Task

| ID | P | 크기 | Task | 선행 | 산출물·완료 기준 |
|---|---|---:|---|---|---|
| RM02-T01 | P0 | M | Reference Source Schema 설계 | RM01-T01,T06 | sourceType, status, rights, tags, owner, hash, archive 계약 확정 |
| RM02-T02 | P0 | M | Capture Schema 설계 | T01 | viewport, blob, MIME, size, hash, final URL, capture version 계약 확정 |
| RM02-T03 | P0 | M | Analysis Run Schema 설계 | T01,RM01-T04,T05 | 상태·Lease·Snapshot·Result·Failure Stage 저장 가능 |
| RM02-T04 | P0 | M | Evidence·Review Schema 설계 | T01,T02,T03,RM01-T07 | 분석 Entity와 원본 Region, Confidence, Review 이력이 연결됨 |
| RM02-T05 | P0 | M | Usage Event Schema 설계 | T01,RM01-T07 | 추천·선택·적용·수정·Revert·Publish 이벤트 계약 확정 |
| RM02-T06 | P0 | M | Reference Migration 작성 | T01~T05 | FK, Check Constraint, Unique, Index, Comment 포함; 빈 DB 적용 테스트 통과 |
| RM02-T07 | P0 | S | Migration 검증·Rollback Script | T06,RM01-T11 | Apply 후 구조·Index 검증, 안전한 Rollback 또는 Forward Fix 절차 존재 |
| RM02-T08 | P0 | L | Reference Store 구현 | T06 | Create/Get/List/Patch/Archive, Revision 충돌, Owner Scope 테스트 완료 |
| RM02-T09 | P0 | M | Capture·Analysis Store 구현 | T06,RM01-T04 | Version 생성, 상태 전이, Lease 획득·갱신·완료·실패 지원 |
| RM02-T10 | P0 | M | Evidence·Review Store 구현 | T06 | Append-only Review History와 승인 Snapshot 보존 |
| RM02-T11 | P0 | M | Reference CRUD API | T08,RM01-T01,T06 | 목록/상세 분리, Pagination, Filter, 권한·오류 계약 테스트 완료 |
| RM02-T12 | P0 | M | 기존 Design MD 연결 전략 구현 | T01,T06,T08 | 기존 Document를 Reference와 연결하는 Backfill 및 기존 API 호환 Adapter 제공 |
| RM02-T13 | P1 | S | Reference 응답 Contract Fixture | T11,T12 | Frontend·Worker·Test가 공유할 정상/빈값/오류 Fixture 제공 |
| RM02-T14 | P0 | M | 데이터 계층 통합 테스트 | T08~T13 | Source→Capture→Analysis→Review 전체 관계와 삭제·Archive 정책 검증 |

### 5.3 Gate 2

- [ ] Screenshot·URL·Design MD가 동일 Reference Root에 연결될 수 있다.
- [ ] 원본, 분석, Evidence, Review가 독립 Version으로 보존된다.
- [ ] 승인·거절 이력이 덮어쓰기가 아닌 감사 가능한 History로 남는다.
- [ ] 기존 Design MD 조회 흐름이 깨지지 않는다.
- [ ] 목록 API가 대형 원본 JSON이나 Blob을 불필요하게 반환하지 않는다.

---

## 6. RM-03 — Screenshot 수집 및 멀티모달 분석

### 6.1 목표

운영자가 Desktop·Mobile Screenshot을 등록하면 검수 가능한 디자인 분석 Draft가 생성되는 첫 E2E를 완성한다.

### 6.2 Task

| ID | P | 크기 | Task | 선행 | 산출물·완료 기준 |
|---|---|---:|---|---|---|
| RM03-T01 | P0 | M | Screenshot Upload Contract | RM02-T02,T11 | 허용 MIME, 크기, 픽셀, viewport, idempotency, 오류 계약 확정 |
| RM03-T02 | P0 | M | 파일 Signature·크기·해상도 Validator | T01 | 확장자 위장, 대형 픽셀, 손상 파일, 비허용 형식 차단 테스트 |
| RM03-T03 | P0 | M | EXIF 제거·정규화·Thumbnail Pipeline | T02 | 원본 정책에 따라 Metadata 제거, Preview용 Thumbnail 생성 |
| RM03-T04 | P0 | M | Blob Upload·Content Hash·중복 처리 | T02,T03,RM01-T08 | 동일 파일 중복 비용 방지, 고아 Blob 복구 가능 |
| RM03-T05 | P0 | M | Upload API와 Capture Record 연결 | T01~T04,RM02-T09 | 하나의 Source에 Desktop·Mobile Capture 등록 가능 |
| RM03-T06 | P0 | M | 분석 JSON Schema v1 | RM02-T03,T04 | Tokens, Sections, Components, Layouts, Responsive, Risks, Confidence, Evidence 정의 |
| RM03-T07 | P0 | M | Vision Prompt Template·관리자 Prompt Type | T06,RM01-T05 | 관리자 버전 관리 Prompt와 제거 불가한 서버 안전 규칙 분리 |
| RM03-T08 | P0 | L | Vision Analysis Worker | T05,T06,T07,RM01-T04 | Capture 입력, Provider 호출, Snapshot, Retry, 결과 저장 구현 |
| RM03-T09 | P0 | M | 분석 Result Schema Validator | T06,T08 | 허용 범위 밖 ID·필드·Confidence를 거부하고 Failure Stage 기록 |
| RM03-T10 | P0 | L | Reference Normalizer | T09,RM02-T10 | 분석 결과를 기존 Token·Metadata·Component/Layout Pattern·Guideline Draft로 변환 |
| RM03-T11 | P0 | M | Evidence Region Mapper | T09,T10 | 추출 항목마다 Capture와 Bounding Region 또는 Source 근거 연결 |
| RM03-T12 | P0 | M | Desktop·Mobile 교차 분석 | T08,T09 | 공통 요소와 반응형 차이를 구분하고 근거 없는 항목은 unknown 처리 |
| RM03-T13 | P1 | S | 분석 상태·재시도 API | T08,RM02-T11 | 진행 단계, 실패 원인, Retry 가능 여부, 재분석 Version 조회 가능 |
| RM03-T14 | P0 | M | 고정 분석 평가 Fixture | T06 | 대표 화면·위험 화면·손상 파일과 기대 구조의 평가 세트 구축 |
| RM03-T15 | P0 | L | Screenshot E2E 테스트 | T01~T14 | Upload→Analysis→Draft Pattern까지 정상·실패·Retry 시나리오 통과 |

### 6.3 Gate 3

- [ ] Desktop·Mobile Screenshot을 하나의 Reference로 등록할 수 있다.
- [ ] 분석 결과가 JSON Schema v1을 통과한다.
- [ ] 모든 추출 항목에 Confidence와 Evidence가 있거나 `unknown`으로 표시된다.
- [ ] Provider·Prompt·Input Hash가 Analysis Run에 저장된다.
- [ ] 실패한 분석을 원본 재업로드 없이 재시도할 수 있다.

---

## 7. RM-04 — 관리자 레퍼런스 검수 및 승인

### 7.1 목표

AI 분석 결과를 운영자가 원본과 비교하고 수정·승인하며, 승인된 데이터만 제품에 게시되도록 한다.

### 7.2 Task

| ID | P | 크기 | Task | 선행 | 산출물·완료 기준 |
|---|---|---:|---|---|---|
| RM04-T01 | P0 | S | 관리자 IA·Route 정의 | RM02-T11,RM03-T13 | Library, Create, Detail, Review, History 경로와 권한 정의 |
| RM04-T02 | P0 | M | Reference Library 목록 UI | T01,RM02-T13 | 상태·유형·태그·Owner·최근 분석 필터, Pagination, 빈 상태 구현 |
| RM04-T03 | P0 | M | 등록 UI — Screenshot | T01,RM03-T05 | Drag/Drop, Desktop/Mobile 구분, 진행·오류·중복 상태 표시 |
| RM04-T04 | P0 | M | Reference 상세·원본 Preview | T02,T03 | 원본·Thumbnail·Capture Version·출처·권리 상태 확인 가능 |
| RM04-T05 | P0 | L | 분석 결과 Inspector | T04,RM03-T10,T11 | Token·Section·Component·Layout·Guideline과 원본 Evidence 비교 가능 |
| RM04-T06 | P0 | M | 분석값 수정·제외 기능 | T05,RM02-T10 | 자동값과 운영자 수정값 분리, Revision 충돌 방지, 변경 이력 저장 |
| RM04-T07 | P0 | M | Review 상태 전이 API | T06,RM01-T06,T07 | request_review/approve/reject/revise/archive의 권한·전이 검증 |
| RM04-T08 | P0 | M | 승인·거절 UI와 Comment | T05,T06,T07 | 필수 검수 항목 미완료 시 승인 차단, 사유와 Actor 저장 |
| RM04-T09 | P0 | M | Rights·Reuse Policy 편집 UI | T04,RM02-T01 | patternReuse, assetReuse, rightsStatus, 개인정보 표시 및 필수 확인 |
| RM04-T10 | P0 | M | Registry Mapping 사전 점검 | T05,RM03-T10 | 구현 가능한 Pattern과 미등록/불가 Pattern을 승인 전에 구분 |
| RM04-T11 | P0 | S | 재분석·Version 비교 UI | T04,T05,RM03-T13 | 이전 분석과 신규 분석 Diff, 승인 데이터 유지 여부 선택 가능 |
| RM04-T12 | P1 | S | Review History UI | T07,T08 | Actor, 시각, Action, 변경 요약 조회 가능 |
| RM04-T13 | P0 | M | 접근성·다국어 상태 검증 | T02~T12 | Keyboard, Focus, 상태 비색상 표현, Locale Message 적용 |
| RM04-T14 | P0 | L | 관리자 E2E 테스트 | T01~T13 | 등록→분석→수정→승인/거절→재분석 전체 시나리오 통과 |

### 7.3 Gate 4

- [ ] 운영자가 원본과 분석 Evidence를 한 화면에서 비교할 수 있다.
- [ ] 자동 분석값과 운영자 수정값이 구분된다.
- [ ] 권한 없는 사용자는 승인·거절할 수 없다.
- [ ] 승인 필수 조건과 Rights 확인이 누락되면 Publish가 차단된다.
- [ ] 승인된 Version은 이후 재분석으로 덮어쓰이지 않는다.

---

## 8. RM-05 — 빌더 적용 및 품질 게이트

### 8.1 목표

승인된 디자인 레퍼런스를 기존 Registry·Token·Layout 계약 안에서 선택적으로 적용하고 안전하게 되돌릴 수 있게 한다.

### 8.2 Task

| ID | P | 크기 | Task | 선행 | 산출물·완료 기준 |
|---|---|---:|---|---|---|
| RM05-T01 | P0 | M | Approved Reference Query API | RM04-T07,T08 | approved 상태·권한·시장·태그 필터만 반환하고 비승인 데이터 누출 없음 |
| RM05-T02 | P0 | M | Pattern Implementability 검사 | RM04-T10 | Component Role, Field, Style Slot, Layout 지원 여부와 불가 사유 반환 |
| RM05-T03 | P0 | L | Pattern-to-Registry Adapter | T02,RM02-T12 | Reference Component Pattern을 허용된 Registry Candidate로만 변환 |
| RM05-T04 | P0 | L | Pattern-to-Token Adapter | T02 | 승인 Token을 기존 Token Slot과 Alias에 매핑하고 범위 밖 값 차단 |
| RM05-T05 | P0 | L | Pattern-to-Preset Draft Adapter | T02,RM03-T12 | 분석 Layout을 Desktop/Mobile Contract v1 Draft로 변환·검증 |
| RM05-T06 | P0 | M | Builder Reference 선택 UI | T01,T02 | 검색·미리보기·선택·제외, 구현 가능 범위와 이유 표시 |
| RM05-T07 | P0 | M | 적용 범위 선택 UI | T03~T06 | 전체 분위기/토큰/레이아웃/컴포넌트/이미지 구성 범위별 선택 |
| RM05-T08 | P0 | M | Reference Usage Snapshot | T03~T07,RM01-T05 | Source/Analysis/Pattern/Mapping/Rights Version을 Builder Revision에 저장 |
| RM05-T09 | P0 | L | Reference Apply Proposal | T08 | 기존 Composition Proposal처럼 Preview→검증→Apply의 Revision 충돌 처리 |
| RM05-T10 | P0 | M | 적용 전후 비교·Undo | T09 | Snapshot Diff 확인, 단일 Revision Undo, 사용자 수정 보존 정책 적용 |
| RM05-T11 | P0 | M | Data·Rights Quality Gate | T08,T09 | 비승인·Archive·권한 만료·Asset Reuse 금지·출처 누락 차단 |
| RM05-T12 | P0 | L | Render Quality Gate 연결 | T05,T09 | Desktop/Mobile 충돌·잘림·대비·Safe Area·필수 Section 검사 |
| RM05-T13 | P0 | M | Reference Usage Event 저장 | T06~T10,RM02-T05 | viewed/selected/applied/rejected/edited/reverted 이벤트 중복 없이 저장 |
| RM05-T14 | P1 | M | Preview·Export 일치 회귀 | T09,T12 | Reference 적용 결과가 Preview와 Export에서 동일 Token/Layout 사용 |
| RM05-T15 | P0 | L | 빌더 Reference E2E | T01~T14 | 검색→범위 선택→적용→Gate→Preview→Undo 정상·실패 시나리오 통과 |

### 8.3 Gate 5

- [ ] 승인된 Reference만 빌더에 노출된다.
- [ ] 적용 결과는 등록된 Component·Style Slot·Layout Contract만 사용한다.
- [ ] 사용한 원본과 Mapping 결정을 Builder Revision에서 추적할 수 있다.
- [ ] Desktop·Mobile 품질 실패 시 Live Preview 승격이 차단된다.
- [ ] 사용자는 적용 전 결과를 확인하고 안전하게 Undo할 수 있다.

---

## 9. RM-06 — 공개 URL Capture

### 9.1 목표

허용된 공개 HTTPS URL을 격리 브라우저에서 안전하게 렌더링하고 Screenshot·DOM·Computed Style Capture로 저장한다.

### 9.2 Task

| ID | P | 크기 | Task | 선행 | 산출물·완료 기준 |
|---|---|---:|---|---|---|
| RM06-T01 | P0 | M | URL Capture 위협 모델 | RM01-T06,RM00-T08 | SSRF, DNS Rebinding, Redirect, Download, Popup, Resource Exhaustion 대응 결정 |
| RM06-T02 | P0 | M | Safe Remote Page Validator | T01 | HTTPS·Port·Credential·Public IP·Redirect 재검증과 우회 테스트 통과 |
| RM06-T03 | P0 | M | Browser Worker 실행 환경 | T01,RM01-T04 | 애플리케이션 Runtime과 격리, Resource/Timeout 제한, Kill 가능 |
| RM06-T04 | P0 | L | Browser Request Interception | T02,T03 | 모든 Subresource에 네트워크 정책 적용, 사설망·비허용 Protocol 차단 |
| RM06-T05 | P0 | M | Page Load·동적 콘텐츠 정책 | T03 | wait 조건, 최대 Scroll, Lazy Load, Cookie Banner, Animation 정지 규칙 확정 |
| RM06-T06 | P0 | M | Multi-viewport Capture Manifest | T03,T05,RM02-T02 | Desktop·Tablet·Mobile viewport와 Full/Viewport Screenshot Version 저장 |
| RM06-T07 | P0 | M | DOM Snapshot Sanitizer | T04,T05 | Script·Event Handler·민감 입력 제거, 정적 분석 데이터로 저장 |
| RM06-T08 | P0 | L | Computed Style·Geometry Extractor | T04,T05 | 주요 DOM의 Rect, Typography, Color, Layout, Visibility 요약 생성 |
| RM06-T09 | P0 | M | URL Capture API·Queue 연결 | T02~T08,RM02-T09 | URL 등록→queued→capture→ready/failed 상태와 idempotency 구현 |
| RM06-T10 | P0 | M | URL 정규화·중복·재캡처 Version | T09 | Fragment·Tracking Parameter 정책, 동일 URL/Hash 처리, 재캡처 이력 보존 |
| RM06-T11 | P0 | M | DOM/CSS+Vision 분석 병합 | T06,T07,T08,RM03-T09,T10 | 위치·Style은 Browser 근거 우선, 의미는 Vision/LLM, 충돌은 Evidence로 기록 |
| RM06-T12 | P0 | M | URL Capture 관리자 UI | T09,T10,RM04-T01 | URL 등록, 진행 단계, 최종 URL, 실패·Retry, Capture Version 표시 |
| RM06-T13 | P0 | L | 보안 공격 Fixture·테스트 | T02~T09 | localhost, IPv4/IPv6 private, Redirect, DNS, 대용량, 무한 로딩 차단 검증 |
| RM06-T14 | P0 | L | URL Capture E2E | T09~T13 | URL→multi-capture→analysis→review의 정상·실패·재캡처 흐름 통과 |

### 9.3 Gate 6

- [ ] 공개 HTTPS URL만 허용되고 사설망·Metadata 접근이 차단된다.
- [ ] 하위 Resource와 Redirect에도 같은 네트워크 정책이 적용된다.
- [ ] Browser Worker가 Timeout·메모리 초과 시 종료·복구된다.
- [ ] Desktop·Mobile Capture와 DOM/CSS 근거가 같은 Version에 연결된다.
- [ ] 저장된 HTML·Script가 서비스 Origin에서 실행되지 않는다.

---

## 10. RM-07 — 자동 추천 및 피드백 기반 개선

### 10.1 목표

프로모션 Overview와 구현 가능성을 기준으로 적합한 승인 Reference를 추천하고, 실제 사용 피드백으로 순위를 개선할 수 있는 기반을 만든다.

### 10.2 Task

| ID | P | 크기 | Task | 선행 | 산출물·완료 기준 |
|---|---|---:|---|---|---|
| RM07-T01 | P0 | M | Retrieval Candidate Contract | RM05-T01,T02 | 후보 필드, Filter, Score Breakdown, Exclusion Reason 계약 확정 |
| RM07-T02 | P0 | M | Rule·Metadata Filter | T01 | status, rights, market, locale, promotionType, tags, component 지원 필터 |
| RM07-T03 | P0 | M | Implementability Score | T01,RM05-T02 | 매핑 가능 Component/Layout/Token 비율과 Blocking 사유 점수화 |
| RM07-T04 | P1 | M | Content·Layout Fit Score | T01,RM05-T05 | 콘텐츠 길이·카드 수·이미지 비율·viewport 적합도 점수화 |
| RM07-T05 | P1 | M | Diversity·Similarity 정책 | T02~T04 | 상위 후보가 동일 스타일로 편중되지 않으며 과도한 단일 출처 모방 방지 |
| RM07-T06 | P0 | L | Deterministic Reference Ranker | T02~T05 | 동일 Snapshot에서 동일 순위, 점수 Breakdown·제외 이유 반환 |
| RM07-T07 | P1 | M | LLM Semantic Rerank | T06,RM01-T05 | 서버 필터 후보만 재정렬, 후보 누락·임의 ID 생성 시 Rule 결과로 Fallback |
| RM07-T08 | P0 | M | Template Recommender 연결 | T06,T07 | 기존 템플릿 추천에 Reference·Pattern 후보와 이유 Snapshot 추가 |
| RM07-T09 | P0 | M | 추천 UI·근거 표시 | T08,RM05-T06 | 상위 3~5개, 적용 범위, 이유, 경고, 구현 불가 항목 표시 |
| RM07-T10 | P0 | M | Feedback Aggregation Job | RM05-T13 | 추천→선택→적용→수정→Publish Funnel과 Edit Distance 집계 |
| RM07-T11 | P0 | M | Offline Retrieval 평가셋 | T01,RM03-T14 | Overview별 적합/부적합 Reference Label과 평가 지표 정의 |
| RM07-T12 | P0 | M | Ranker 회귀 평가 | T06,T11 | Precision, Coverage, Diversity, Implementability, Gate Pass 비교 자동화 |
| RM07-T13 | P2 | M | Embedding 저장·검색 PoC | T11,T12 | 규칙 Ranker 대비 개선 여부와 비용 측정; 운영 연결은 별도 승인 |
| RM07-T14 | P2 | M | Hybrid Ranking 결정 | T13 | Rule+Semantic 가중치, Fallback, Version, Rollout 여부 문서화 |
| RM07-T15 | P1 | M | 추천 Version A/B Rollout | T10,T12,T14,RM01-T10 | 소규모 Flag, 품질 악화 시 즉시 Rollback, 버전별 지표 비교 |

### 10.3 Gate 7

- [ ] 비승인·권한 불일치·구현 불가 Reference가 추천에서 제외된다.
- [ ] 추천 이유와 점수 Breakdown을 설명할 수 있다.
- [ ] LLM 오류 시 규칙 기반 추천으로 안전하게 Fallback한다.
- [ ] 추천 품질을 고정 평가셋으로 버전별 비교할 수 있다.
- [ ] Vector 검색은 측정 가능한 개선이 확인될 때만 운영에 도입한다.

---

## 11. RM-08 — 운영 전환 및 지속 개선

### 11.1 목표

신규 기능을 제한된 사용자부터 안전하게 배포하고, 장애 대응·비용·데이터 보존·레거시 정리까지 제품 운영 체계로 전환한다.

### 11.2 Task

| ID | P | 크기 | Task | 선행 | 산출물·완료 기준 |
|---|---|---:|---|---|---|
| RM08-T01 | P0 | M | 운영 SLI·SLO 확정 | RM01-T12,RM07-T10 | Capture/Analysis/Review/Apply 성공률·지연·정체·비용 목표와 Alert 정의 |
| RM08-T02 | P0 | M | Dashboard·Alert | T01 | 실패 단계, Queue 정체, Lease 만료, Provider 비용, 승인 대기 확인 가능 |
| RM08-T03 | P0 | M | 운영 Runbook | T01,T02 | Capture 실패, Provider 장애, 고아 Blob, stuck Job, 권리 제한 대응 절차 |
| RM08-T04 | P0 | M | Backup·Restore·보존 정책 검증 | RM02-T06,RM06-T07 | Source·Review·Usage·Blob 보존과 삭제 요청 처리 테스트 |
| RM08-T05 | P0 | M | 보안·권리 최종 검토 | RM06-T13,RM05-T11 | 위협 모델 잔여 위험, 자산 사용, 개인정보, 감사 요건 승인 |
| RM08-T06 | P0 | M | 성능·비용 부하 테스트 | RM06-T14,RM07-T12 | 동시 Upload/Capture/Analysis, DB 목록·검색, 비용 상한 검증 |
| RM08-T07 | P0 | M | 제한 사용자 Pilot | T01~T06,RM01-T10 | 내부 Reviewer 그룹에서 End-to-End 사용, Blocker와 만족도 기록 |
| RM08-T08 | P0 | M | 단계적 Rollout | T07 | 0→내부→일부 사용자→전체 단계와 각 단계 Stop 조건 적용 |
| RM08-T09 | P1 | M | 기존 Design MD UI Cutover | T08,RM02-T12 | 신규 Library로 진입 통합, 기존 URL 호환·Redirect, 데이터 손실 없음 |
| RM08-T10 | P1 | M | POC·중복 코드 Retirement 감사 | RM00-T05,T09 | 실제 참조 0, 대체 경로·Rollback 확인 후 별도 삭제 승인 |
| RM08-T11 | P1 | S | 문서·운영 교육 자료 | T03,T08 | 관리자 등록·검수·승인·오류 대응 가이드 제공 |
| RM08-T12 | P0 | M | 제품 전환 최종 승인 | T01~T11 | Gate 8, 미해결 위험, 후속 백로그, Owner가 승인됨 |

### 11.3 Gate 8

- [ ] 핵심 SLO와 Alert가 운영에서 확인된다.
- [ ] 장애·보안·권리·삭제 요청 Runbook이 준비됐다.
- [ ] 제한 Pilot에서 P0 Blocker가 없다.
- [ ] Rollout Stop·Rollback 조건이 실제로 동작한다.
- [ ] 기존 기능 호환성과 신규 Reference 출처 추적이 검증됐다.

---

## 12. Cross-cutting QA Task

각 로드맵에서 반복 적용할 공통 QA 작업이다.

| ID | 적용 시점 | Task | 완료 기준 |
|---|---|---|---|
| QA-T01 | 모든 API 변경 | Contract Test 추가 | 정상·400·401/403·404·409·429·500/502 응답 검증 |
| QA-T02 | 모든 Migration | 빈 DB·기존 Snapshot 적용 | 신규 설치와 기존 데이터 Upgrade 모두 통과 |
| QA-T03 | 모든 Worker | Retry·Timeout·Cancel·Lease 테스트 | 중복 비용과 영구 processing 상태 없음 |
| QA-T04 | 모든 관리자 UI | Loading·Empty·Error·Conflict 상태 | 운영자가 다음 행동을 이해할 수 있음 |
| QA-T05 | Builder 변경 | Template/AI Mode 회귀 | 기존 생성·편집·Preview·Export 핵심 흐름 통과 |
| QA-T06 | Layout 변경 | Desktop 1440·Mobile 390 검증 | 충돌·잘림·Overflow·비정상 공백 없음 |
| QA-T07 | 외부 입력 | 보안·크기·형식 Fuzz | 입력 우회와 Resource 고갈이 차단됨 |
| QA-T08 | Prompt/Model 변경 | 고정 평가셋 회귀 | Schema Pass, 품질, 비용, 지연이 기준선 이내 |
| QA-T09 | 권한 변경 | Role Matrix 테스트 | 읽기·쓰기·승인·Archive 권한 누출 없음 |
| QA-T10 | 배포 전 | Git·Migration·환경변수 점검 | 작업 트리, Build, Test, Migration, Config가 일치 |

---

## 13. 의사결정 Task

구현보다 먼저 Owner가 결정해야 할 항목이다.

| ID | 우선 | 결정 항목 | 필요한 시점 | 결정 산출물 |
|---|---|---|---|---|
| DEC-T01 | P0 | 등록자와 승인자 분리 여부 | RM-01 | Role Matrix |
| DEC-T02 | P0 | 기존 Design MD의 초기 Reference 상태 | RM-02 | Backfill Policy |
| DEC-T03 | P0 | 외부 자산·로고·카피 재사용 기준 | RM-02 | Rights Policy |
| DEC-T04 | P0 | Screenshot 원본·파생 데이터 보존기간 | RM-02 | Retention Policy |
| DEC-T05 | P0 | Vision Provider·Model 기본값과 비용 상한 | RM-03 | Provider Policy |
| DEC-T06 | P0 | 분석 승인 필수 항목과 최소 Confidence | RM-04 | Review Policy |
| DEC-T07 | P0 | Pattern을 신규 Registry Draft로 제안할지 여부 | RM-05 | Mapping Policy |
| DEC-T08 | P0 | 공개 URL Host 정책과 내부 URL 지원 여부 | RM-06 | Capture Policy |
| DEC-T09 | P1 | n8n과 애플리케이션 Worker의 장기 경계 | RM-06 | Runtime Decision |
| DEC-T10 | P1 | Vector 검색 운영 도입 기준 | RM-07 | Evaluation Gate |
| DEC-T11 | P1 | 삭제 요청 시 기존 Builder Snapshot 처리 | RM-08 | Deletion Policy |

---

## 14. 첫 번째 착수 묶음

첫 개발 묶음은 기능 UI가 아니라 기준선과 계약을 확정하는 작업이다.

### Batch A — 현행 기준선

```text
RM00-T01 화면·Route 인벤토리
RM00-T02 API·Worker 인벤토리
RM00-T03 DB·Migration 감사
RM00-T06 테스트 기준선
```

위 네 Task는 병렬 진행 가능하다.

### Batch B — 범위·용어·배포 경계

```text
RM00-T04 핵심 E2E 지도
RM00-T05 유지·보완·교체 결정표
RM00-T07 제품 용어 사전
RM00-T08 정책 결정 Owner
RM00-T09 Feature Flag 초안
```

### Batch C — 공통 계약

```text
RM01-T01 API 오류 계약
RM01-T02 Request ID
RM01-T03 Idempotency
RM01-T05 실행 Snapshot
RM01-T06 권한 계약
```

### 첫 번째 개발 게이트

Batch A~C 완료 전에는 다음 기능 구현을 시작하지 않는다.

- 신규 Reference 관리자 화면
- Screenshot Vision Provider 실제 호출
- URL Capture Browser Worker
- 자동 추천 또는 Vector 검색

---

## 15. Task 관리 규칙

### 15.1 Task 본문 템플릿

```markdown
## [RMxx-Txx] Task 제목

- Roadmap:
- Priority:
- Size:
- Owner:
- Status:
- Dependencies:

### 목적

### 범위

### 비범위

### 변경 대상

### 데이터·API 계약

### 오류·권한·보안

### 테스트 시나리오

### 완료 기준

### Rollback

### 관련 문서
```

### 15.2 커밋·PR 규칙

- 하나의 PR은 하나의 주요 Task ID를 중심으로 한다.
- Migration과 Store가 너무 크면 Schema/Store/API로 분리한다.
- 커밋 메시지 또는 PR 제목에 Task ID를 포함한다.
- 생성 산출물, `.DS_Store`, 로컬 Render 파일은 커밋하지 않는다.
- 기존 사용자 변경과 무관한 Format 수정은 같은 PR에 섞지 않는다.
- Task 완료 시 관련 문서와 테스트를 같은 PR에서 현행화한다.

### 15.3 차단 관리

Blocked Task에는 다음을 반드시 기록한다.

- 차단 시작 시각
- 차단 원인
- 필요한 결정·권한·외부 상태
- 영향받는 후속 Task
- 가능한 우회 작업
- 해제 Owner

---

## 16. 완료 정의

전체 로드맵은 다음 조건을 모두 만족할 때 완료한다.

1. 기존 프로모션 빌더 핵심 흐름이 제품 수준의 상태·오류·권한·감사 계약을 사용한다.
2. Design MD, Screenshot, URL이 하나의 Reference 도메인에서 버전 관리된다.
3. 모든 분석 결과는 원본 Evidence와 Confidence를 갖고 운영자 승인을 거친다.
4. 승인되지 않은 데이터는 추천·적용·생성에 사용되지 않는다.
5. Reference는 기존 Registry·Token·Layout Contract 안에서만 적용된다.
6. Desktop·Mobile 품질 Gate를 통과한 결과만 Preview와 Export로 승격된다.
7. 외부 URL Capture가 격리되고 SSRF·Resource 고갈 방어를 통과한다.
8. 추천 결과는 이유·점수·제외 사유를 설명할 수 있다.
9. 사용·수정·거절 피드백이 Version별 개선 평가 데이터로 축적된다.
10. 배포·Rollback·장애 대응·보존·삭제·권리 정책이 운영 Runbook으로 준비된다.

---

## 17. 다음 실행

다음 작업은 `RM00-T01`, `RM00-T02`, `RM00-T03`, `RM00-T06`이다. 네 작업의 결과를 합쳐 `RM00-T04 핵심 E2E 흐름 지도`와 `RM00-T05 유지·보완·교체 결정표`를 확정한다.

이 단계에서는 기능 코드를 변경하지 않는다. 현재 구현을 충분히 측정하고 책임 경계를 확정한 뒤 RM-01 공통 운영 기반부터 작은 단위로 구현한다.
