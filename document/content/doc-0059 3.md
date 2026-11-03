# 프로모션 빌더 제품 고도화 Agenda 기반 로드맵

## 0. 문서 정보

- 작성일: 2026-09-02
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: Agenda 기반 실행 로드맵 초안
- 목적: 제품 고도화 범위를 `Agenda → 하위 Task → 기획 필요 내용 → 개발 필요 내용 → 예상 결과` 구조로 정리한다.
- 상위 계획:
  - `docs/계획/promo-builder-productization-and-design-reference-platform-development-plan-2026-08-31.md`
- 상세 실행 백로그:
  - `docs/계획/promo-builder-productization-execution-roadmap-and-task-breakdown-2026-09-02.md`
- 대표 Task 중심 로드맵:
  - `docs/계획/promo-builder-productization-task-oriented-roadmap-2026-09-02.md`

Task 단위 검토와 실행은 대표 Task 중심 로드맵을 사용한다. 이 문서는 Agenda 비교용 요약이며, 상세 실행 백로그 문서는 개별 개발 Task의 선행 조건과 완료 기준을 관리한다.

---

## 1. 로드맵 구성 원칙

### 1.1 기본 구조

각 Agenda는 다음 다섯 요소로 구성한다.

1. **Agenda**: 해결해야 할 상위 제품 과제
2. **Task**: Agenda를 완료하기 위한 하위 실행 단위
3. **기획 필요 내용**: 정책, 사용자 흐름, 데이터 의미, 승인 기준 등 구현 전에 결정할 사항
4. **개발 필요 내용**: DB, API, Worker, UI, 테스트, 운영 도구 등 실제 구현 사항
5. **예상 결과**: Task 완료 후 제품과 운영에서 확인할 수 있는 변화

### 1.2 예상 결과의 의미

예상 결과는 확정 성과 수치가 아니라 현재 구현과 설계를 바탕으로 예측한 목표 상태다. 실제 정량 목표는 Agenda 01에서 기준선을 측정한 후 확정한다.

### 1.3 우선순위

| 우선순위 | 의미 |
|---|---|
| P0 | 다음 단계 진행을 위해 반드시 먼저 완료해야 하는 기반 또는 안전성 |
| P1 | 핵심 제품 가치를 완성하는 기능 |
| P2 | 자동화·검색·운영 효율을 높이는 후속 고도화 |

---

## 2. 전체 Agenda 로드맵

| 순서 | Agenda | 우선순위 | 핵심 목적 | 선행 Agenda | 예상 최종 결과 |
|---|---|---|---|---|---|
| AG-01 | 현행 시스템 기준선과 제품 범위 확정 | P0 | POC 자산과 제품화 대상을 구분 | 없음 | 중복·누락 없이 개발 범위와 책임 확정 |
| AG-02 | 공통 운영·보안·실행 기반 고도화 | P0 | 상태·오류·권한·재시도·감사 표준화 | AG-01 | 실패 복구와 실행 추적이 가능한 기반 |
| AG-03 | 기존 프로모션 빌더 핵심 품질 고도화 | P0/P1 | Preview·Layout·Asset·Export 품질 안정화 | AG-01,02 | 기존 핵심 흐름이 제품 수준으로 안정화 |
| AG-04 | Design Reference 데이터 플랫폼 구축 | P0/P1 | Design MD·Screenshot·URL 통합 데이터 모델 | AG-01,02 | 출처와 버전이 명확한 디자인 지식 기반 |
| AG-05 | Screenshot 업로드·멀티모달 분석 | P1 | 이미지에서 디자인 구조와 패턴 추출 | AG-04 | 검수 가능한 분석 Draft 자동 생성 |
| AG-06 | 관리자 검수·승인·라이브러리 | P1 | AI 분석을 사람이 통제하고 게시 | AG-05 | 승인된 데이터만 사용하는 운영 체계 |
| AG-07 | 프로모션 빌더 디자인 활용 | P1 | 승인 Reference를 기존 빌더 계약으로 적용 | AG-03,06 | 안전하고 다양한 디자인 조합 제공 |
| AG-08 | 외부 웹 URL Capture | P2 | 공개 URL을 안전하게 수집·분석 | AG-02,05,06 | URL 기반 Desktop·Mobile 디자인 분석 |
| AG-09 | 자동 추천·검색·피드백 최적화 | P2 | 적합한 Reference 추천과 개선 데이터 축적 | AG-07,08 | 설명 가능한 추천과 지속 개선 기반 |
| AG-10 | 운영 전환·관측·레거시 정리 | P0/P1 | 단계적 배포와 운영 체계 완성 | AG-01~09 | 안정적인 제품 운영 및 POC 구조 정리 |

---

## 3. 진행 Wave

```text
Wave 1 — 기준선과 공통 기반
AG-01 → AG-02

Wave 2 — 기존 빌더 안정화와 데이터 기반
AG-03 ─┐
       ├→ 병렬 진행
AG-04 ─┘

Wave 3 — Screenshot Reference MVP
AG-05 → AG-06 → AG-07

Wave 4 — URL·자동 추천 확장
AG-08 → AG-09

Wave 5 — 제품 운영 전환
AG-10
```

AG-03과 AG-04는 AG-02의 공통 계약이 확정된 이후 병렬 진행할 수 있다. AG-08의 보안 설계는 조기에 시작할 수 있지만 URL 기능의 제품 연결은 Screenshot 기반 검수 흐름이 안정화된 이후 진행한다.

---

## 4. AG-01 — 현행 시스템 기준선과 제품 범위 확정

### 4.1 Agenda 목적

현재 POC에서 구현된 화면·API·DB·Worker·테스트를 실제 사용 여부와 책임 기준으로 정리하고, 유지·보완·교체·폐기 범위를 확정한다.

### 4.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG01-T01 | 화면·사용자 흐름 인벤토리 | 실제 사용자, 관리자, 진입 경로, 중복 화면, 유지할 사용자 흐름 정의 | `prototype`, `admin-app`, `visual-editor` Route와 Entry 분석 도구·문서화 | 사용 중인 화면과 POC 잔여 화면이 명확히 구분됨 |
| AG01-T02 | API·Worker 책임 지도 | API와 n8n·애플리케이션 Worker의 장기 책임 원칙 | Endpoint 호출 관계, 내부 Helper, Webhook, 환경변수 의존성 조사 | 중복 구현과 책임 공백을 식별하고 변경 영향 예측 가능 |
| AG01-T03 | DB·Migration 현행 감사 | 운영 데이터 보존 범위, 레거시 테이블 처리 원칙 | Migration 적용 순서, FK·Index·중복 Schema·운영 불일치 검사 | 신규 Migration을 안전하게 설계할 기준선 확보 |
| AG01-T04 | 핵심 E2E 흐름 확정 | Template Mode, AI Mode, Preview, Export 중 제품 핵심 경로 결정 | 현재 데이터 흐름과 상태 전이를 다이어그램·Fixture로 정리 | 신규 기능이 연결될 공식 제품 경로 확정 |
| AG01-T05 | 유지·보완·교체·폐기 결정 | 판단 기준, 폐기 승인자, 호환 기간, 사용자 영향 | 각 모듈별 참조와 대체 구현 확인 | 불필요한 전면 재구축과 중복 개발 방지 |
| AG01-T06 | 테스트 기준선 확보 | 배포 차단 기준과 필수 사용자 시나리오 | 기존 Test 분류·실행, 실패·미검증 영역 기록, 핵심 Smoke 보완 | 변경 전후 품질을 비교할 회귀 기준선 확보 |
| AG01-T07 | 용어·범위·정책 Owner 확정 | Reference, Capture, Analysis, Review, Publish 정의와 정책 결정 담당 | 용어 사전·결정 로그·Task Owner 문서화 | 기획·개발·운영 간 같은 의미와 책임 사용 |

### 4.3 Agenda 예상 결과

- 실제 운영 대상과 POC 잔여물이 구분된다.
- 기능별 Owner와 책임 모듈이 명확해진다.
- 후속 개발의 범위 변경과 재작업 가능성이 줄어든다.
- 모든 고도화 작업이 동일한 회귀 기준선을 사용한다.

---

## 5. AG-02 — 공통 운영·보안·실행 기반 고도화

### 5.1 Agenda 목적

기존 AI 구성과 신규 Reference 기능이 공통으로 사용할 API, 상태, 작업, 권한, 감사, 관측 계약을 제품 수준으로 고도화한다.

### 5.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG02-T01 | 공통 API·오류 계약 | 오류 유형, 사용자 메시지, 재시도 가능 여부, 충돌 처리 원칙 | 응답 Envelope, 오류 코드, Validation Helper, Contract Test | UI와 Worker가 오류를 일관되게 처리하고 원인 식별 가능 |
| AG02-T02 | Request·Execution 추적 | 추적 단위, 로그 보존, 개인정보 마스킹 원칙 | Request ID, Correlation ID, Structured Log 전파 | API부터 외부 AI Provider까지 한 요청으로 추적 가능 |
| AG02-T03 | Idempotency·중복 방지 | 중복 판단 범위, Key 만료, 재요청 UX | Idempotency Store, Unique Constraint, 충돌 응답 | 중복 클릭·재시도로 데이터와 AI 비용이 중복 생성되지 않음 |
| AG02-T04 | Job 상태·Lease·Retry | 상태 전이, 최대 재시도, Backoff, 취소·수동 Retry 정책 | 공통 Job Runtime, Lease, Heartbeat, stale 복구 | Worker 중단과 Timeout 후에도 영구 정체 없이 복구 가능 |
| AG02-T05 | 실행 Snapshot 표준 | 저장할 입력·모델·프롬프트·토큰·계약 버전과 보존기간 | Prompt/Model/Input/Output Snapshot과 Hash 저장 | 동일 실행의 원인과 결과를 사후 재현·비교 가능 |
| AG02-T06 | 인증·역할·소유권 | Viewer/Editor/Reviewer/Admin 역할과 등록자·승인자 분리 여부 | API Middleware, Owner Scope, Role Matrix Test | 권한 없는 조회·수정·승인 차단 |
| AG02-T07 | 감사 로그 | 감사 대상 Action, 이전/이후 상태, Actor 보존 정책 | Append-only Audit Event Store와 조회 API | 누가 무엇을 변경·승인했는지 추적 가능 |
| AG02-T08 | Blob·DB 정합성 | 원본 삭제·보존·고아 파일 처리 원칙 | Transaction 보완, 고아 Blob 탐지·복구 Job | 저장 실패와 부분 실패로 인한 데이터 유실·비용 누수 감소 |
| AG02-T09 | Feature Flag·Rollback | 활성화 대상, 단계별 Rollout, Kill Switch 조건 | 사용자·환경별 Flag와 안전한 기본값 | 신규 기능을 기존 흐름에 영향 없이 점진 배포 가능 |
| AG02-T10 | 공통 관측 지표 | 성공률·지연·비용·정체 작업의 초기 측정 기준 | Metrics, Dashboard용 Event, Alert Hook | 장애와 비용 이상을 사용자 제보 전에 확인 가능 |

### 5.3 Agenda 예상 결과

- 비동기 AI 작업의 중복·정체·재시도 문제가 공통 방식으로 관리된다.
- 모든 주요 실행을 입력·모델·프롬프트·사용자 기준으로 추적할 수 있다.
- 신규 기능을 제한적으로 배포하고 즉시 비활성화할 수 있다.
- 이후 Agenda가 개별 상태·권한·오류 시스템을 반복 구현하지 않는다.

---

## 6. AG-03 — 기존 프로모션 빌더 핵심 품질 고도화

### 6.1 Agenda 목적

신규 디자인 레퍼런스 기능을 추가하기 전에 현재 프로모션 구성, 자산 생성, Layout, Preview, Export의 품질과 안정성을 제품 수준으로 높인다.

### 6.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG03-T01 | 핵심 생성 계약 정리 | AI와 Rule Base의 책임, 필수 Section, 변경 허용 범위 | Overview→Candidate→Proposal→Compiler 계약 통합·검증 | 임의 구조 생성과 정책 누락 감소 |
| AG03-T02 | Asset Readiness 고도화 | 필수·선택 자산, 부분 실패, 재생성·대체 정책 | Expected Asset Manifest, Coverage 검사, Retry 상태 | 이미지 준비 중인 결과가 완료 Preview로 노출되지 않음 |
| AG03-T03 | Layout Fit 고도화 | 콘텐츠 길이·이미지 비율·컴포넌트 수별 선택 규칙 | Layout Metadata 점수, Preset 선택기, Fallback | 매번 같은 Layout 또는 콘텐츠와 맞지 않는 배치 감소 |
| AG03-T04 | Desktop·Mobile Render Gate | Blocking·Warning 기준, 자동 보정 횟수, 수동 확인 조건 | 실제 DOM 충돌·잘림·Overflow·대비·공백 검사 | 모바일과 데스크톱에서 편집 가능한 첫 결과 품질 향상 |
| AG03-T05 | Preview·Export 일치 | Preview와 최종 산출물의 동일성 기준 | Shared Renderer·Token·Layout Snapshot 검증 | Preview와 Web Output의 시각적 차이 감소 |
| AG03-T06 | Revision·Undo·Rollback | 자동 생성과 사용자 수정의 우선순위, 복구 범위 | Proposal Apply, Revision Conflict, Undo 테스트 | AI 적용 실패 또는 불만족 시 안전하게 이전 상태 복구 |
| AG03-T07 | 기존 UI 상태·오류 개선 | 사용자가 이해할 진행 단계와 복구 행동 | 진행·실패·재시도·품질 확인 필요 UI | 운영자가 내부 기술 지식 없이 문제 상태를 판단 가능 |
| AG03-T08 | 핵심 E2E 회귀 자동화 | 반드시 통과해야 할 Template/AI Mode 시나리오 | Browser E2E, API·DB Fixture, Preview Screenshot 비교 | 후속 기능 추가 시 기존 핵심 기능 회귀 조기 탐지 |

### 6.3 Agenda 예상 결과

- 기존 프로모션 빌더 자체가 신규 기능을 수용할 안정적인 기반이 된다.
- 자산 미완성, 레이아웃 충돌, 모바일 잘림이 완료 결과로 노출되는 비율이 줄어든다.
- Preview와 Export의 일관성이 높아진다.
- AI 적용과 사용자 수정 사이의 Revision 충돌을 안전하게 처리한다.

---

## 7. AG-04 — Design Reference 데이터 플랫폼 구축

### 7.1 Agenda 목적

기존 Design MD와 신규 Screenshot·URL을 하나의 Reference 체계에서 출처·버전·권리·분석·승인 상태로 관리한다.

### 7.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG04-T01 | Reference Source 모델 | Source 유형, 소유권, 상태, Tag, Archive 의미 | `design_reference_sources` Migration·Store | 모든 디자인 입력의 공통 Root 확보 |
| AG04-T02 | Capture·원본 모델 | viewport, 원본·썸네일, Version, 보존·삭제 정책 | `design_reference_captures`와 Blob 연결 | 동일 Source의 Desktop·Mobile·재캡처 이력 관리 |
| AG04-T03 | Analysis Run 모델 | 분석 상태, 실패 단계, Provider, Prompt, 재분석 정책 | `design_reference_analysis_runs`와 Job 연결 | 분석 실행과 결과를 덮어쓰지 않고 재현 가능 |
| AG04-T04 | Evidence 모델 | 원본 영역, 신뢰도, 추정·사실 구분 기준 | `design_pattern_evidence`와 기존 Pattern FK | 추출 결과가 어떤 원본 근거에서 나왔는지 확인 가능 |
| AG04-T05 | Review·승인 모델 | 검수 상태, 승인 권한, 수정값과 자동값 분리 | Review History와 승인 Snapshot | AI 분석이 운영 데이터로 자동 승격되지 않음 |
| AG04-T06 | Usage·Feedback 모델 | 추천·선택·적용·수정·취소 Event 정의 | `design_reference_usage_events`와 중복 방지 | 향후 추천 개선에 사용할 실제 행동 데이터 축적 |
| AG04-T07 | 기존 Design MD 연결 | 기존 데이터의 초기 승인·권리 상태, 호환 기간 | Backfill Migration, Store Adapter, 기존 API 호환 | 기존 디자인 데이터 손실 없이 상위 Reference로 통합 |
| AG04-T08 | Reference CRUD API | 목록·상세·수정·Archive 권한과 Pagination | API, Filter, Revision Conflict, Contract Test | 관리자 UI와 Worker가 안정적인 공통 API 사용 |

### 7.3 Agenda 예상 결과

- Design MD, Screenshot, URL을 동일한 도메인과 상태로 관리한다.
- 원본·분석·검수·승인·사용 이력이 독립 Version으로 보존된다.
- 기존 디자인 토큰·컴포넌트·레이아웃 패턴 자산을 재사용한다.
- 출처가 불명확하거나 승인되지 않은 데이터가 제품에서 분리된다.

---

## 8. AG-05 — Screenshot 업로드 및 멀티모달 분석

### 8.1 Agenda 목적

Desktop·Mobile Screenshot을 등록하면 디자인 토큰·섹션·컴포넌트·레이아웃·가이드라인 Draft를 자동 생성한다.

### 8.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG05-T01 | 업로드 정책 | 허용 파일, 최대 크기·해상도, 중복·원본 보존 기준 | MIME Signature, 픽셀·크기 Validator | 손상·위장·과대 파일과 불필요한 비용 차단 |
| AG05-T02 | Screenshot 저장 Pipeline | Desktop·Mobile 구분, EXIF, Thumbnail 정책 | Direct Upload, Hash, Metadata 제거, Thumbnail | 빠른 Preview와 중복 방지, 안전한 원본 저장 |
| AG05-T03 | 분석 Schema v1 | 추출 대상, unknown, Confidence, Evidence 필수 조건 | JSON Schema와 Validator | 모델이 바뀌어도 동일한 구조로 결과 처리 |
| AG05-T04 | Vision Prompt·Provider | 기본 모델, 비용 상한, 안전 규칙, 관리자 Prompt 범위 | Prompt Template, Snapshot, Provider Adapter | Prompt 변경을 추적하고 Provider 교체 가능 |
| AG05-T05 | 분석 Worker | 처리 단계, Timeout, Retry, 부분 실패 기준 | Queue/Lease Worker, Provider 호출, 결과 저장 | 사용자 요청과 분리된 안정적인 비동기 분석 |
| AG05-T06 | Normalization | 기존 토큰·패턴과 신규 분석 필드 Mapping 원칙 | Token/Metadata/Component/Layout/Guideline 변환기 | 현재 DB와 빌더에서 사용할 수 있는 Draft 생성 |
| AG05-T07 | Desktop·Mobile 비교 | 공통 요소와 반응형 차이, 추정 허용 범위 | Cross-capture Merger와 Evidence 연결 | 모바일 구조를 Desktop 추측이 아닌 실제 근거로 저장 |
| AG05-T08 | 분석 평가셋 | 대표 프로모션 유형, 위험 사례, 기대 결과 정의 | 고정 Fixture, Schema·Confidence·비용 평가 자동화 | Prompt·Model 변경 전후 품질을 비교할 기준 확보 |

### 8.3 Agenda 예상 결과

- 운영자가 코드나 Design MD 작성 없이 Screenshot으로 디자인 레퍼런스를 등록할 수 있다.
- 분석 결과가 기존 디자인 데이터 구조에 Draft로 저장된다.
- 추정값과 확인된 값이 Confidence·Evidence로 구분된다.
- 분석 실패 후 원본 재업로드 없이 재시도할 수 있다.

---

## 9. AG-06 — 관리자 검수·승인 및 레퍼런스 라이브러리

### 9.1 Agenda 목적

자동 분석 결과를 원본과 비교해 수정·승인하고, 승인된 Version만 빌더에서 사용할 수 있는 운영 흐름을 제공한다.

### 9.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG06-T01 | Library 정보 구조 | 목록 필드, 필터, 상태, 권한별 Action, Empty State | Reference 목록·검색·Pagination UI | 운영자가 Reference 상태와 작업 대상을 빠르게 파악 |
| AG06-T02 | 등록·상세 화면 | 업로드 단계, Capture Version, 원본·권리 정보 배치 | Screenshot 등록, Detail, Thumbnail Preview | 등록부터 분석 상태 확인까지 단일 흐름 제공 |
| AG06-T03 | 분석 Inspector | 원본과 추출 결과의 비교 방식, 우선 검수 항목 | Split View, Evidence Highlight, Token·Pattern Inspector | 잘못된 분석을 원본 근거와 함께 식별 가능 |
| AG06-T04 | 분석값 수정·제외 | 자동값·수정값·제외값 의미와 충돌 정책 | Draft Editor, Revision Conflict, Change History | AI 오류를 수정하되 원본 분석 결과를 보존 |
| AG06-T05 | 승인·거절 Workflow | 필수 확인 항목, 승인자, 거절 사유, 재검수 조건 | State Transition API·UI, Comment, Audit | 승인되지 않은 데이터의 제품 사용 원천 차단 |
| AG06-T06 | 권리·재사용 설정 | Pattern 참고와 원본 Asset 재사용 분리 | Rights Status, Pattern/Asset Reuse Controls | 외부 로고·이미지·카피의 부적절한 재사용 위험 감소 |
| AG06-T07 | Registry Mapping 사전 검사 | 구현 가능·부분 가능·불가 판정 기준 | Component/Token/Layout Mapping Preview | 승인 전에 실제 빌더 적용 가능 범위 확인 |
| AG06-T08 | 재분석·Version 비교 | 재분석 시 기존 승인 유지·대체 정책 | Version Diff와 승인 Snapshot 선택 | 모델 개선 후에도 기존 운영 데이터가 예기치 않게 변경되지 않음 |
| AG06-T09 | 관리자 E2E·접근성 | 핵심 검수 시나리오와 Keyboard·Locale 기준 | Browser E2E, Focus·Error·Loading 검증 | 반복적인 운영 검수가 안정적이고 이해하기 쉬워짐 |

### 9.3 Agenda 예상 결과

- AI가 분석하고 사람이 승인하는 명확한 통제 구조가 완성된다.
- 승인되지 않은 데이터와 권리 미확인 데이터는 빌더에 노출되지 않는다.
- 자동 분석과 운영자 수정, 승인 Version을 모두 추적할 수 있다.
- 디자인 레퍼런스가 단순 파일 목록이 아니라 관리 가능한 지식 자산이 된다.

---

## 10. AG-07 — 프로모션 빌더 디자인 레퍼런스 활용

### 10.1 Agenda 목적

승인된 Reference를 프로모션 제작 과정에서 선택하고, 기존 컴포넌트·디자인 토큰·레이아웃 프리셋 계약으로 안전하게 변환한다.

### 10.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG07-T01 | 승인 Reference 검색 | 검색 필터, 시장·Locale·브랜드 범위, 노출 권한 | Approved-only Query API | 적합하고 사용 가능한 Reference만 빌더에 노출 |
| AG07-T02 | 적용 가능성 판정 | Component·Field·Style Slot·Layout 지원 기준 | Implementability Validator와 제외 사유 | 시각적으로 좋아도 구현 불가능한 후보를 사전 제외 |
| AG07-T03 | Pattern-to-Registry Mapping | 기존 컴포넌트 우선, 신규 Draft 제안 여부 | Component Candidate Adapter | 외부 디자인이 임의 HTML이 아닌 재사용 컴포넌트로 표현됨 |
| AG07-T04 | Token·Layout Mapping | Token 충돌, Alias, Desktop·Mobile 변환, 허용 범위 | Token Adapter, Layout Draft Adapter, Contract Validator | 기존 디자인 시스템을 유지하면서 스타일 다양성 확보 |
| AG07-T05 | Reference 선택 UI | 수동 선택, 추천 이유, 미리보기, 적용 범위 | Reference Card, 검색, Preview, 선택 상태 | 사용자가 디자인 방향을 이해하고 통제 가능 |
| AG07-T06 | 적용 범위 선택 | 전체/토큰/레이아웃/컴포넌트/이미지 구성 구분 | Scope별 Apply Request와 UI | 원하지 않는 전체 디자인 변경 없이 부분 참고 가능 |
| AG07-T07 | Apply Proposal·Snapshot | 적용 전 검토, Revision 충돌, 출처 표시 기준 | Proposal, Mapping Snapshot, Rights Snapshot | 적용 근거와 사용 Version을 사후 추적 가능 |
| AG07-T08 | 적용 전후 비교·Undo | 사용자 수정 보존과 Undo 범위 | Snapshot Diff, Apply, Revert | 만족하지 않는 결과를 안전하게 되돌릴 수 있음 |
| AG07-T09 | 데이터·권리·렌더 Gate | Blocking 기준과 수동 확인 기준 | 승인·권리·Layout·Desktop/Mobile Render 검사 | 위험하거나 깨진 결과가 완료 Preview로 승격되지 않음 |
| AG07-T10 | Usage Event | 추천·선택·적용·수정·취소 의미와 중복 정책 | Usage Event API·Store | 실제 활용 데이터를 후속 추천 개선에 사용 가능 |

### 10.3 Agenda 예상 결과

- 기존 컴포넌트 중심 원칙을 유지하면서 디자인 조합이 다양해진다.
- 사용자가 어떤 레퍼런스의 어떤 특성을 사용할지 선택할 수 있다.
- 적용 결과의 출처·권리·Mapping Version이 명확해진다.
- 불만족 결과를 Undo할 수 있어 AI 적용 위험이 낮아진다.

---

## 11. AG-08 — 외부 웹 URL Capture

### 11.1 Agenda 목적

공개 웹 URL을 격리된 Browser Worker에서 안전하게 캡처하고 Desktop·Mobile Screenshot, DOM, Computed Style을 디자인 분석 근거로 저장한다.

### 11.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG08-T01 | URL 지원·보안 정책 | 공개 URL 범위, Host Allow/Deny, 로그인·내부 사이트 지원 여부 | Threat Model과 Capture Policy | 구현 범위와 허용되지 않는 사용 사례 명확화 |
| AG08-T02 | Safe URL 검증 | HTTPS, Port, Redirect, DNS, 사설 IP 차단 기준 | URL Validator, DNS/IP 검사, Redirect 재검증 | SSRF와 Cloud Metadata 접근 방지 |
| AG08-T03 | 격리 Browser Worker | 실행 위치, CPU·Memory·시간 제한, 동시성 | 격리 Runtime, Queue, Timeout, Kill | 위험한 페이지가 애플리케이션 Runtime에 직접 영향 주지 않음 |
| AG08-T04 | 네트워크 요청 차단 | Subresource, Popup, Download, Protocol 정책 | Browser Request Interception | 최초 URL뿐 아니라 모든 하위 요청에 보안 정책 적용 |
| AG08-T05 | Page Load 정책 | Lazy Load, Cookie Banner, Scroll, Animation, 실패 조건 | Wait/Scroll/Capture Controller | 동적 페이지를 반복 가능한 상태로 캡처 |
| AG08-T06 | Multi-viewport Capture | Desktop·Tablet·Mobile 크기와 Full-page 기준 | Screenshot Manifest와 Capture Version | 반응형 차이를 실제 화면 기준으로 분석 가능 |
| AG08-T07 | DOM·Computed Style 추출 | 저장할 DOM 범위, 개인정보·Script 제거, 주요 Style 정의 | Sanitizer, Geometry·Typography·Color Extractor | Vision 추정 외에 실제 구조·크기·Style 근거 확보 |
| AG08-T08 | URL 분석 병합 | DOM/CSS와 Vision 결과가 충돌할 때의 우선순위 | Multi-source Normalizer와 Evidence 병합 | 위치·Style은 측정값, 의미는 AI로 보완한 고품질 분석 |
| AG08-T09 | URL 등록·재캡처 UI | 진행 단계, 실패·Retry, URL 변경·재캡처 Version | URL Create, Progress, Error, Recapture UI | 운영자가 기술 로그 없이 Capture 상태를 관리 가능 |
| AG08-T10 | 보안·장애 E2E | 공격·대형 페이지·무한 로딩·Redirect Fixture | 보안 테스트와 Worker 복구 테스트 | URL 기능을 운영에 노출하기 전 주요 위협 검증 |

### 11.3 Agenda 예상 결과

- URL 입력만으로 Desktop·Mobile 디자인 정보를 수집할 수 있다.
- Screenshot 단독 분석보다 실제 Layout·Typography·Responsive 근거가 향상된다.
- 외부 페이지의 Script를 서비스에서 직접 실행하지 않는다.
- 캡처 실패 원인과 재시도 가능 여부를 운영자가 확인할 수 있다.

---

## 12. AG-09 — 자동 추천·검색 및 피드백 최적화

### 12.1 Agenda 목적

프로모션 요구사항과 구현 가능성을 기준으로 승인 Reference를 자동 추천하고, 실제 선택·수정 결과를 이용해 추천 품질을 개선한다.

### 12.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG09-T01 | 추천 후보 계약 | 후보 필드, 제외 조건, 점수 구성, 추천 개수 | Candidate Contract와 Fixture | 추천 로직과 UI가 동일한 후보 의미 사용 |
| AG09-T02 | Rule·Metadata 검색 | Promotion Type, Market, Locale, Tone, Tag 우선순위 | PostgreSQL Filter와 Index | Vector 없이도 설명 가능한 초기 검색 제공 |
| AG09-T03 | Implementability·Fit 점수 | 구현 가능성, 콘텐츠 길이, 이미지 비율, Layout 적합도 | Score Calculator와 Breakdown | 적용 후 실패 가능성이 낮은 후보를 우선 추천 |
| AG09-T04 | 다양성·모방 방지 | 후보 간 다양성, 단일 출처 의존, 유사성 제한 기준 | Diversity Reranker와 Source Cap | 비슷한 디자인만 반복되거나 특정 사이트를 과도하게 모방하는 현상 감소 |
| AG09-T05 | LLM Semantic 재정렬 | LLM 허용 범위, Fallback, 추천 설명 형식 | 승인 후보만 재정렬하는 Planner와 Rule Fallback | 의미 적합도를 보완하면서 임의 후보 생성 방지 |
| AG09-T06 | 기존 Template 추천 연결 | Template와 Reference 추천의 결합 순서 | Recommender Context·Snapshot 확장 | 템플릿·토큰·레이아웃·Reference가 하나의 추천 결과로 연결 |
| AG09-T07 | 추천 UI·근거 | 사용자에게 보여줄 이유·경고·불가 요소 | 상위 후보, Score 이유, Preview UI | 사용자가 추천 결과를 신뢰하고 비교 가능 |
| AG09-T08 | 피드백 집계 | 선택률, 적용률, 수정량, 취소, Publish의 의미 | Event Aggregation과 Funnel | 실제 사용 행동을 제품 개선 데이터로 전환 |
| AG09-T09 | Offline 평가 | 정답 Reference, 품질 지표, 평가셋 관리 방식 | Retrieval Dataset과 Regression Runner | 검색·Prompt 변경의 개선 여부를 배포 전 검증 |
| AG09-T10 | Vector·Hybrid 검색 판단 | 도입 기준, 비용, 개인정보, 재색인 정책 | Embedding PoC와 Rule 대비 실험 | 측정 가능한 개선이 있을 때만 복잡도 추가 |
| AG09-T11 | 추천 Version Rollout | A/B 대상, 중단 조건, 성공 기준 | Versioned Ranker와 Feature Flag | 품질 악화 시 즉시 이전 추천으로 복구 가능 |

### 12.3 Agenda 예상 결과

- 프로모션 목적에 맞는 디자인 후보를 자동으로 제안한다.
- 추천 이유와 제외 이유를 운영자와 사용자에게 설명할 수 있다.
- 규칙 검색만으로 시작하고 필요성이 입증될 때 Semantic 검색을 추가한다.
- 선택·수정·거절 데이터가 향후 추천 개선과 모델 학습 판단 근거가 된다.

---

## 13. AG-10 — 운영 전환·관측 및 레거시 정리

### 13.1 Agenda 목적

고도화 기능을 제한된 사용자부터 단계적으로 배포하고 장애·비용·보안·데이터 보존을 운영 가능한 상태로 만든다.

### 13.2 하위 Task

| Task ID | Task | 기획 필요 내용 | 개발 필요 내용 | 예상 결과 |
|---|---|---|---|---|
| AG10-T01 | SLI·SLO·비용 기준 | 성공률·지연·정체·승인 대기·비용 목표 | Metrics Query, Dashboard, Alert | 장애와 비용 이상을 정량적으로 판단 가능 |
| AG10-T02 | 운영 Runbook | 장애별 Owner, 사용자 공지, Retry·복구·Rollback 절차 | 상태 점검 Script와 운영 문서 | 특정 개발자 지식에 의존하지 않고 장애 대응 가능 |
| AG10-T03 | 데이터 보존·삭제 | 원본·DOM·분석·승인·Usage 보존기간과 삭제 요청 | Archive/Purge/Reindex Job, Restore Test | 권리·개인정보 요청에 일관되게 대응 가능 |
| AG10-T04 | 성능·비용 부하 검증 | 동시 사용자, Queue 상한, 비용 예산 | Upload/Capture/Analysis/Search 부하 테스트 | 운영 규모에서 병목과 비용 상한 사전 확인 |
| AG10-T05 | 보안·권리 최종 점검 | 잔여 위험 수용자와 출시 차단 기준 | SSRF·권한·Blob·Script·Rights 테스트 | 외부 입력 기능의 출시 위험을 명시적으로 승인 |
| AG10-T06 | 제한 사용자 Pilot | Pilot 사용자, 기간, 수집 피드백, 중단 조건 | Feature Flag, Pilot Dashboard, Feedback Form | 실제 운영 환경의 Blocker와 UX 문제 조기 발견 |
| AG10-T07 | 단계적 Rollout | 내부→일부→전체 전환 조건과 Rollback 기준 | 비율·그룹 Rollout, Kill Switch 검증 | 전체 사용자에게 한 번에 위험을 노출하지 않음 |
| AG10-T08 | Design MD UI Cutover | 기존 URL·북마크·업무 절차 호환 | Redirect, Adapter, 신규 Library 진입 통합 | 이중 관리 없이 신규 Reference 체계로 전환 |
| AG10-T09 | POC·중복 코드 정리 | 실제 참조 0 확인, 삭제 승인, 보존 Archive | Usage Audit 후 별도 Retirement PR | 유지보수 대상과 중복 코드 감소 |
| AG10-T10 | 운영·사용자 교육 | 역할별 사용 범위와 장애 문의 절차 | 등록·검수·승인·빌더 적용 가이드 | 신규 기능의 잘못된 사용과 운영 문의 감소 |

### 13.3 Agenda 예상 결과

- 제품 성공률·지연·비용·품질을 운영 지표로 확인한다.
- 장애 시 복구와 Rollback 절차가 준비된다.
- 제한 Pilot을 거쳐 안전하게 전체 사용자로 확대한다.
- 기존 Design MD와 POC 화면의 이중 운영을 종료한다.

---

## 14. Agenda별 핵심 산출물

| Agenda | 기획 산출물 | 개발 산출물 | 검증 산출물 |
|---|---|---|---|
| AG-01 | AS-IS Map, 범위·용어·결정표 | 인벤토리·분석 Script | 회귀 기준선 보고서 |
| AG-02 | 상태·오류·권한·감사 정책 | 공통 API·Job·Audit·Flag 모듈 | 계약·Retry·권한 테스트 |
| AG-03 | 품질 Gate·Layout·Asset 정책 | Compiler·Asset·Render·Undo 보완 | Builder E2E·Screenshot QA |
| AG-04 | Reference 데이터·보존·권리 정책 | Migration·Store·CRUD API | Migration·호환성 테스트 |
| AG-05 | 분석 Schema·Prompt·Provider 정책 | Upload·Vision Worker·Normalizer | 고정 분석 평가셋 |
| AG-06 | 검수·승인·권리 Workflow | Library·Inspector·Review UI/API | 관리자 E2E·접근성 테스트 |
| AG-07 | 적용 범위·Mapping·Undo 정책 | Adapter·Apply Proposal·Quality Gate | Builder Reference E2E |
| AG-08 | URL Capture·보안 정책 | Safe URL·Browser Worker·DOM/CSS | 공격 Fixture·Capture E2E |
| AG-09 | 추천 점수·다양성·평가 정책 | Ranker·Feedback·추천 UI | Offline Retrieval 평가 |
| AG-10 | SLO·Rollout·보존·교육 계획 | Dashboard·Alert·Purge·Cutover | Pilot·부하·보안 보고서 |

---

## 15. 주요 의존성 및 시작 제한

| 시작하려는 작업 | 반드시 먼저 완료할 내용 |
|---|---|
| 관리자 Reference UI | AG-04 데이터·상태·API 계약 |
| Vision 분석 Worker | AG-05 분석 Schema·Prompt Snapshot 정책 |
| Reference 승인 | AG-06 역할·필수 검수·권리 정책 |
| 빌더 Reference 적용 | AG-03 Revision·Quality Gate와 AG-06 승인 계약 |
| URL Browser Worker 제품 연결 | Screenshot 분석·검수 E2E와 URL 보안 검증 |
| 자동 추천 | 승인 Reference 조회와 Implementability 검사 |
| Vector 검색 | Offline 평가셋과 Rule 검색 기준선 |
| 파인튜닝 검토 | 충분한 승인·거절·수정·성과 데이터와 권리 검토 |
| POC 코드 삭제 | 신규 경로 Cutover, 참조 0, Rollback 경로 확인 |

---

## 16. 예측되는 전체 결과

### 16.1 제품 결과

- 프로모션 빌더가 기능 검증용 POC에서 반복 운영 가능한 제품 구조로 전환된다.
- AI가 자유롭게 화면을 생성하는 방식이 아니라 승인된 디자인 시스템 안에서 다양한 조합을 제안한다.
- Desktop·Mobile·Preview·Export의 일관성과 품질이 향상된다.
- 외부 디자인 Reference를 활용하면서도 출처·권리·정책을 통제한다.

### 16.2 운영 결과

- 작업 실패 단계와 복구 방법을 운영자가 확인할 수 있다.
- 승인되지 않은 분석 데이터가 제품에 사용되지 않는다.
- 모델·Prompt·Token·Component·Layout·Reference Version을 추적할 수 있다.
- 장애, 비용, Queue 정체, 검수 대기를 Dashboard로 확인할 수 있다.

### 16.3 사용자 결과

- 사용자는 프로모션 요구사항에 적합한 다양한 디자인 후보를 확인할 수 있다.
- 전체 디자인뿐 아니라 토큰·레이아웃·컴포넌트 등 원하는 범위만 참고할 수 있다.
- 적용 전후를 비교하고 불만족 결과를 Undo할 수 있다.
- 깨진 화면이나 미완성 이미지가 완료 결과로 표시되는 경우가 줄어든다.

### 16.4 데이터·AI 결과

- Screenshot·URL·Design MD가 구조화된 디자인 지식으로 축적된다.
- 운영자 승인·수정·거절 데이터가 추천 품질 개선에 사용된다.
- Vector 검색이나 파인튜닝은 기준선 대비 효과가 검증된 경우에만 도입한다.
- 장기적으로 시장·프로모션 유형·콘텐츠 조건별 디자인 적합도를 학습할 기반이 마련된다.

---

## 17. 우선 착수 Agenda

첫 착수 대상은 `AG-01 현행 시스템 기준선과 제품 범위 확정`이다.

병렬 시작 Task:

1. `AG01-T01` 화면·사용자 흐름 인벤토리
2. `AG01-T02` API·Worker 책임 지도
3. `AG01-T03` DB·Migration 현행 감사
4. `AG01-T06` 테스트 기준선 확보

네 결과를 합친 뒤 `AG01-T04 핵심 E2E 흐름`, `AG01-T05 유지·보완·교체·폐기 결정`, `AG01-T07 용어·정책 Owner`를 확정한다.

AG-01이 완료되기 전에는 신규 UI나 URL Capture를 먼저 구현하지 않는다. AG-01의 결과를 기준으로 AG-02 공통 운영 기반과 AG-03/AG-04의 실제 개발 범위를 확정한다.
