# 관리자 설정 — 디자인 지식 관리 Control Plane 1차 개발 계획서

## 0. 문서 목적

프로모션 빌더의 Screenshot 기반 디자인 분석, Component 자동 매칭·Draft 생성, Layout·Style 저장 기능을 1차로 관리자 설정에서 관리할 수 있도록 개발 범위를 정의한다.

1차 목표는 AI가 디자인을 자동 생성하는 최종 기능이 아니다. 다음 항목을 설정에서 안전하게 등록·설정·검수·추적할 수 있는 Control Plane을 먼저 구축하는 것이다.

```text
설정 진입
→ Design Reference 등록·조회
→ 분석 정책 설정
→ Component 매칭·Draft 정책 설정
→ Layout·Style Draft 관리
→ 검수·승인·게시 정책 관리
→ 작업 상태·실패·이력 확인
```

관련 문서:

- `docs/계획/promo-builder-design-intelligence-prerequisite-development-plan-2026-09-02.md`
- `docs/계획/promo-builder-productization-task-oriented-roadmap-2026-09-02.md`

---

## 1. 현행 설정 구조와 연결 원칙

현재 관리자 설정은 `prototype/index.html`의 관리자 탭 구조를 사용하고, `admin-app/src/main.js`에서 Vue 기반 관리 컴포넌트와 Service를 등록한 뒤 기존 `prototype/app.js`를 실행한다.

현재 재사용 가능한 관리 기반은 다음과 같다.

- Component Version 관리
- Section Layout Preset 관리
- Template Layout 관리
- Design Token Draft·Version 관리
- Prompt Template Draft·검증·활성·Rollback
- Webhook 설정
- Audit 조회
- 다국어 메시지 관리

1차 개발에서는 기존 관리 화면을 복제하지 않는다.

- Component Proposal이 승인되면 기존 Component 관리 화면으로 연결한다.
- Layout Draft가 승인되면 기존 Section Layout Preset 관리 화면으로 연결한다.
- Style Profile의 Token Draft는 기존 Design Token 관리 화면으로 연결한다.
- 분석 Prompt는 기존 LLM Prompt Version 관리 방식을 확장한다.
- 변경 이력은 기존 Audit 개념을 확장해 사용한다.

---

## 2. 1차 목표 사용자

### Reference Editor

- Screenshot과 Design MD Reference를 등록한다.
- Source 이름, Tag, 시장, Locale, 권리 정보를 수정한다.
- 분석을 요청하거나 실패 작업을 재시도한다.
- 승인과 게시 권한은 없다.

### Reference Reviewer

- 원본과 분석 결과를 비교한다.
- Component 매칭과 Draft 제안을 수정한다.
- Layout·Style Draft를 검토한다.
- Reference와 Draft를 승인하거나 거절한다.

### Reference Admin

- 분석·매칭·검수·게시 정책을 관리한다.
- Provider, Prompt, Timeout, Retry와 Feature Flag를 관리한다.
- 승인된 Draft를 기존 Component·Layout·Token 관리로 게시한다.
- 작업 상태, 감사 로그, 권리·보존 정책을 관리한다.

---

## 3. 1차 범위

### 포함 범위

- 설정 메뉴에 `디자인 지식 관리` 탭 추가
- 디자인 지식 관리 Overview
- Screenshot·Design MD Reference 목록과 상세
- Screenshot 등록 UI와 Capture Metadata 관리
- 분석 설정과 분석 Prompt Version 연결
- Component 자동 매칭 정책 관리
- Component Proposal·Draft 목록과 상세
- Layout Preset Draft 관리
- Design Style Profile·Token Draft 관리
- 검수·승인·게시 Workflow
- 작업 Queue·실패·Retry 상태 조회
- 권한·권리·보존 정책
- 변경 이력·Audit
- Feature Flag와 Kill Switch
- Mock Analyzer 기반 관리자 E2E

### 제외 범위

- 공개 URL Browser Capture
- 실제 Vision Provider의 운영 활성화
- Component Vue·HTML·CSS 자동 생성
- Component·Layout·Token 자동 게시
- 프로모션 빌더 자동 추천
- Vector 검색
- 파인튜닝
- 기존 POC 화면 삭제

실제 Vision Provider 연결을 위한 설정 필드는 준비하되 1차 기본값은 `disabled` 또는 `mock`으로 둔다.

---

## 4. 설정 정보 구조

```text
설정
└─ 디자인 지식 관리
   ├─ Overview
   ├─ Reference 원본
   │  ├─ 목록
   │  ├─ Screenshot 등록
   │  └─ 상세·Capture Version
   ├─ 분석 설정
   │  ├─ Provider·Model
   │  ├─ Prompt Version
   │  ├─ 분석 Schema Version
   │  ├─ Timeout·Retry
   │  └─ 파일·비용 제한
   ├─ Component 매칭 정책
   │  ├─ 매칭 가중치
   │  ├─ Confidence Threshold
   │  ├─ 재사용 우선순위
   │  └─ 자동 확정 금지 정책
   ├─ Draft 관리
   │  ├─ Component Proposal
   │  ├─ Layout Preset Draft
   │  └─ Design Style Profile
   ├─ 검수·게시 정책
   │  ├─ 역할·승인 단계
   │  ├─ 필수 검수 항목
   │  ├─ 권리·자산 재사용
   │  └─ 게시 대상 연결
   ├─ 작업 상태
   │  ├─ Queue
   │  ├─ 실패·Retry
   │  └─ 실행 Snapshot
   └─ 변경 이력
      ├─ 설정 Version
      ├─ 승인·거절
      └─ 게시·Rollback
```

모든 세부 메뉴를 상단 탭으로 나열하지 않는다. 기존 관리자 설정의 상위 탭에는 `디자인 지식 관리` 하나만 추가하고, 내부에서 좌측 Navigation 또는 하위 Route를 사용한다.

---

## 5. 1차 핵심 사용자 흐름

### 흐름 A. Screenshot Reference 등록

```text
설정 → 디자인 지식 관리 → Reference 원본
→ 새 Reference
→ Screenshot 업로드
→ Desktop/Mobile 구분
→ 출처·Tag·권리 정보 입력
→ 저장
→ 분석 대기 상태 확인
```

### 흐름 B. 분석 설정 관리

```text
설정 → 디자인 지식 관리 → 분석 설정
→ Draft 설정 생성
→ Provider·Model·Prompt·Timeout·Retry 입력
→ 설정 검증
→ 활성 Version 지정
→ 이후 생성되는 Analysis Job부터 적용
```

### 흐름 C. Component Proposal 검수

```text
Reference 상세 → 분석 결과
→ 인식된 Component 선택
→ 기존 Component 매칭 후보 확인
→ 재사용 / 설정 / Variant / 조합 / 신규 Draft 결정
→ Component Proposal 수정
→ Desktop·Mobile Preview
→ 승인 또는 거절
→ 승인 후 기존 Component 관리 Draft로 게시
```

### 흐름 D. Layout·Style Draft 검수

```text
Reference 상세 → Layout·Style 분석
→ Layout Pattern 확인
→ Layout Preset Draft Preview
→ Design Style Profile·Token Draft 확인
→ 충돌·누락 수정
→ 승인
→ 기존 Layout·Design Token 관리로 게시
```

### 흐름 E. 작업 실패 관리

```text
설정 → 디자인 지식 관리 → 작업 상태
→ 실패 작업 선택
→ 실패 단계·오류 코드·실행 Snapshot 확인
→ 재시도 가능 여부 확인
→ Retry
→ 신규 시도 상태 추적
```

---

## 6. 개발 단계

```text
ADM-DI-01 설정 IA·권한·Route
→ ADM-DI-02 설정 데이터·Version 기반
→ ADM-DI-03 Reference 원본 관리
→ ADM-DI-04 분석·매칭 정책 관리
→ ADM-DI-05 Component·Layout·Style Draft 관리
→ ADM-DI-06 검수·게시·작업 상태
→ ADM-DI-07 Mock E2E·접근성·Rollout
```

---

## 7. ADM-DI-01 — 설정 IA·권한·Route

### ADM-DI01-T01. `디자인 지식 관리` 상위 탭 추가

- 목적: 기존 설정 구조 안에 신규 기능의 단일 진입점을 만든다.
- 선행 Task: PRQ01-T01
- 기획 필요 내용:
  - 한글·영문 메뉴명을 확정한다.
  - 기존 Design MD 관리 진입과의 관계를 결정한다.
  - 관리자 권한이 없는 사용자에게 메뉴를 숨길지 결정한다.
- 개발 필요 내용:
  - `adminTab` 허용 목록에 신규 Key를 추가한다.
  - `prototype/index.html`의 관리자 탭 메뉴와 Panel Target을 추가한다.
  - Query Parameter로 직접 진입할 수 있게 한다.
  - 잘못된 하위 Route의 안전한 기본 이동을 구현한다.
- 예상 결과:
  - 설정에서 신규 디자인 지식 기능에 일관되게 진입할 수 있다.
- 완료 기준:
  - 새로고침과 직접 URL 접근 후에도 선택된 탭이 유지된다.
  - 기존 설정 탭의 동작에 회귀가 없다.

### ADM-DI01-T02. 하위 Navigation과 Route State

- 목적: 여러 관리 기능을 하나의 상위 탭 안에서 구분한다.
- 선행 Task: ADM-DI01-T01
- 기획 필요 내용:
  - Overview, Sources, Analysis, Matching, Drafts, Review, Jobs, Audit 순서를 확정한다.
  - 좁은 화면에서 Navigation을 Drawer로 전환할지 결정한다.
- 개발 필요 내용:
  - 하위 Route 또는 Query State를 구현한다.
  - 좌측 Navigation과 Page Header·Breadcrumb를 구현한다.
  - Browser Back/Forward 동작을 연결한다.
- 예상 결과:
  - 사용자가 복잡한 설정 안에서 현재 위치와 상위 관계를 이해할 수 있다.
- 완료 기준:
  - 각 하위 화면에 직접 접근하고 이전 화면으로 복귀할 수 있다.

### ADM-DI01-T03. 역할별 메뉴·Action 권한

- 목적: Editor, Reviewer, Admin별로 조회·수정·승인·게시 권한을 구분한다.
- 선행 Task: PRQ02-T03, ADM-DI01-T01
- 기획 필요 내용:
  - 메뉴 노출과 Action 비활성화 중 어떤 방식을 사용할지 결정한다.
  - 읽기 전용 상태에서 보여줄 안내를 정의한다.
- 개발 필요 내용:
  - Role Capability를 설정 Shell에 주입한다.
  - 등록, 수정, 승인, 게시, Retry Action에 권한 검사를 적용한다.
  - 서버 API 권한과 UI 권한을 동일 Contract로 연결한다.
- 예상 결과:
  - 화면 노출과 실제 API 권한이 일치한다.
- 완료 기준:
  - UI를 우회한 직접 API 호출도 서버에서 차단된다.

### ADM-DI01-T04. 공통 설정 화면 Shell

- 목적: 신규 하위 화면이 동일한 Loading·Empty·Error·Conflict UX를 사용하게 한다.
- 선행 Task: ADM-DI01-T02, PRQ04-T01
- 기획 필요 내용:
  - Page Header, Status Badge, Primary Action, Help 영역의 공통 배치를 정한다.
- 개발 필요 내용:
  - 관리 화면 Shell, Status Banner, Error Panel, Empty State를 공통 컴포넌트로 만든다.
  - Request ID와 Retry Action을 오류 Panel에 표시한다.
- 예상 결과:
  - 각 설정 화면의 상태와 오류 표현이 일관된다.
- 완료 기준:
  - 모든 하위 화면이 공통 Shell과 오류 계약을 사용한다.

### ADM-DI-01 종료 Gate

- 설정에 단일 상위 진입점이 존재한다.
- 하위 Navigation과 직접 URL 접근이 동작한다.
- 역할별 UI·API 권한이 일치한다.
- 공통 Loading·Empty·Error·Conflict 상태가 준비됐다.

---

## 8. ADM-DI-02 — 설정 데이터와 Version 기반

### ADM-DI02-T01. 디자인 지식 설정 Schema

- 목적: 분석·매칭·검수·보존 정책을 하나의 Version 가능한 설정으로 관리한다.
- 선행 Task: PRQ02 Gate, PRQ04-T05
- 기획 필요 내용:
  - 설정을 전역, 브랜드, 시장별로 분리할지 결정한다.
  - 설정 상속과 Override 우선순위를 정한다.
  - 활성 Version과 Draft Version의 관계를 정의한다.
- 개발 필요 내용:
  - 다음 설정 그룹을 포함한 Schema를 정의한다.
    - analysisPolicy
    - uploadPolicy
    - matchingPolicy
    - componentProposalPolicy
    - layoutDraftPolicy
    - styleProfilePolicy
    - reviewPolicy
    - rightsPolicy
    - retentionPolicy
    - featurePolicy
  - JSON Schema와 Runtime Validator를 구현한다.
- 예상 결과:
  - 배포 없이 관리자가 정책 Version을 변경할 기반이 마련된다.
- 완료 기준:
  - 잘못된 설정은 저장 전에 필드별 오류로 차단된다.

### ADM-DI02-T02. 설정 저장·조회 API

- 목적: 설정 UI가 안정적인 Version API를 사용하게 한다.
- 선행 Task: ADM-DI02-T01, PRQ04-T01, PRQ04-T06
- 기획 필요 내용:
  - Draft 생성, 저장, Validate, Activate, Rollback, Archive Action을 확정한다.
  - 동시에 두 사용자가 편집할 때의 충돌 정책을 정한다.
- 개발 필요 내용:
  - 설정 목록·상세·Draft·Validate·Activate·Rollback API를 구현한다.
  - Revision 또는 ETag 기반 충돌 검사를 추가한다.
  - 변경 Note와 Actor를 Audit Event로 저장한다.
- 예상 결과:
  - 운영 설정 변경과 롤백을 안전하게 관리한다.
- 완료 기준:
  - 활성 설정은 직접 수정할 수 없고 Draft를 통해서만 변경된다.

### ADM-DI02-T03. 설정 Service와 Frontend Store

- 목적: 기존 `admin-app` 패턴으로 API 호출과 화면 상태를 분리한다.
- 선행 Task: ADM-DI02-T02
- 기획 필요 내용:
  - 화면별 개별 요청과 공통 Cache 범위를 정한다.
- 개발 필요 내용:
  - `design-intelligence-settings-service.mjs`를 추가한다.
  - 설정 목록·상세·Save·Validate·Activate·Rollback 메서드를 구현한다.
  - Loading, Error, Dirty, Conflict State를 Store에 제공한다.
- 예상 결과:
  - Vue 화면이 Fetch 세부 구현과 분리된다.
- 완료 기준:
  - Service 단위 Contract Test와 오류 Mapping Test가 통과한다.

### ADM-DI02-T04. 설정 Version 관리 UI

- 목적: 기존 Prompt 관리와 유사한 Draft·검증·활성·Rollback 흐름을 제공한다.
- 선행 Task: ADM-DI02-T03
- 기획 필요 내용:
  - Version 목록, Active 표시, 변경 요약, Diff 표현 방식을 정한다.
- 개발 필요 내용:
  - Version 목록과 상태 Badge를 구현한다.
  - 새 Draft, Validate, Activate, Rollback, Archive Action을 구현한다.
  - 이전 Version과 설정 Diff를 제공한다.
- 예상 결과:
  - 정책 변경 이력과 현재 적용 설정을 한 화면에서 확인한다.
- 완료 기준:
  - Rollback 후 신규 Job이 복구된 설정 Snapshot을 사용한다.

### ADM-DI02-T05. 안전한 기본 설정 Seed

- 목적: 기능이 활성화되지 않은 초기 환경에서도 안전한 설정을 제공한다.
- 선행 Task: ADM-DI02-T01
- 기획 필요 내용:
  - Provider `disabled` 또는 `mock` 기본값을 결정한다.
  - 모든 자동 Publish를 기본 금지로 설정한다.
- 개발 필요 내용:
  - 다음 안전 기본값을 Seed한다.
    - analysisEnabled: false
    - provider: mock 또는 disabled
    - autoPublishComponent: false
    - autoPublishLayout: false
    - autoPublishToken: false
    - requireHumanReview: true
    - assetReuseAllowedByDefault: false
  - Seed 검증 Test를 추가한다.
- 예상 결과:
  - 설정 Migration만 적용해도 외부 AI 호출이나 자동 게시가 시작되지 않는다.
- 완료 기준:
  - Feature Flag와 Active 설정이 모두 허용돼야 실제 분석 Job을 생성한다.

### ADM-DI-02 종료 Gate

- 디자인 지식 설정 Schema와 Version API가 존재한다.
- Draft·검증·활성·Rollback UI가 동작한다.
- 안전한 기본값에서 AI 호출과 자동 게시가 비활성화된다.

---

## 9. ADM-DI-03 — Reference 원본 관리

### ADM-DI03-T01. Reference 목록 화면

- 목적: 등록된 Screenshot·Design MD Reference와 처리 상태를 관리한다.
- 선행 Task: ADM-DI01 Gate, PRQ05-T01
- 기획 필요 내용:
  - 목록에 표시할 Source Type, 상태, Tag, Owner, 권리, 최근 분석 정보를 정한다.
  - 기본 정렬과 Filter를 결정한다.
- 개발 필요 내용:
  - Pagination 목록과 상태·유형·Tag·Owner Filter를 구현한다.
  - 분석 중, 검수 필요, 승인, 실패, Archive 상태를 구분한다.
  - 대형 분석 JSON과 원본 Blob을 목록 응답에서 제외한다.
- 예상 결과:
  - 운영자가 전체 Reference 현황과 처리 대상을 빠르게 파악한다.
- 완료 기준:
  - 목록 Loading·Empty·Error와 Pagination이 동작한다.

### ADM-DI03-T02. Screenshot Reference 등록

- 목적: 설정에서 Desktop·Mobile Screenshot과 출처 정보를 등록한다.
- 선행 Task: ADM-DI03-T01, PRQ06-T01
- 기획 필요 내용:
  - 필수 Source 이름, 출처, 시장, Locale, Tag, 권리 정보를 확정한다.
  - Desktop·Mobile 중 하나만 있는 경우의 정책을 정한다.
- 개발 필요 내용:
  - Drag & Drop과 파일 선택 UI를 구현한다.
  - viewport 유형, 크기, MIME, Hash, Thumbnail을 표시한다.
  - 파일 검증 오류와 중복 Reference 경고를 제공한다.
  - Source 저장과 Capture Version 생성을 연결한다.
- 예상 결과:
  - 운영자가 기술 도구 없이 디자인 Screenshot을 등록할 수 있다.
- 완료 기준:
  - 잘못된 파일은 저장 전에 차단되고 정상 파일은 Capture와 연결된다.

### ADM-DI03-T03. Reference 상세·Capture Version

- 목적: 원본, Metadata, 권리, 분석·검수 이력을 한곳에서 확인한다.
- 선행 Task: ADM-DI03-T02
- 기획 필요 내용:
  - Source 정보와 Version 정보의 편집 범위를 정한다.
  - 재업로드와 신규 Capture Version의 차이를 정의한다.
- 개발 필요 내용:
  - Desktop·Mobile 원본 Preview와 Metadata를 구현한다.
  - Capture Version 목록과 선택을 제공한다.
  - Source Tag, Market, Locale, Rights 편집을 구현한다.
- 예상 결과:
  - 분석 결과가 어떤 원본 Version에 기반했는지 명확히 확인한다.
- 완료 기준:
  - 과거 Capture Version을 선택해도 당시 분석·검수 이력이 유지된다.

### ADM-DI03-T04. 분석 요청·재분석 Action

- 목적: 설정에서 선택한 Capture Version의 분석 작업을 생성한다.
- 선행 Task: ADM-DI03-T03, PRQ04-T03, PRQ04-T04
- 기획 필요 내용:
  - 최초 분석과 재분석의 상태·Version 차이를 정한다.
  - Feature Flag Off와 Provider Disabled 상태의 안내를 정의한다.
- 개발 필요 내용:
  - 분석 요청 Button과 확인 Dialog를 구현한다.
  - 활성 설정 Version을 요청 Snapshot에 포함한다.
  - 중복 요청과 기존 실행 중 Job을 차단한다.
- 예상 결과:
  - 운영자가 어떤 설정과 원본으로 분석하는지 확인한 뒤 작업을 시작한다.
- 완료 기준:
  - 1차에서는 Mock Analysis Job만 생성되고 실제 Provider는 호출되지 않는다.

### ADM-DI03-T05. Archive와 사용 중 보호

- 목적: 사용 이력이 있는 Reference를 안전하게 보관 처리한다.
- 선행 Task: ADM-DI03-T03, PRQ02-T04
- 기획 필요 내용:
  - Archive와 삭제를 구분한다.
  - Builder 또는 Published Draft에서 사용 중일 때의 차단·경고 정책을 정한다.
- 개발 필요 내용:
  - 사용처 조회와 Archive 확인 Dialog를 구현한다.
  - Archive Reference를 신규 분석·추천에서 제외한다.
  - Audit Event를 저장한다.
- 예상 결과:
  - 사용 중인 디자인 지식이 실수로 삭제되거나 신규 사용되는 것을 방지한다.
- 완료 기준:
  - Archive 후 기존 Snapshot은 유지되고 신규 작업 대상에서는 제외된다.

### ADM-DI-03 종료 Gate

- 설정에서 Screenshot Reference를 등록하고 Version으로 조회할 수 있다.
- 출처·Tag·권리 정보를 관리할 수 있다.
- Mock 분석 요청과 Archive가 상태·권한 계약을 따른다.

---

## 10. ADM-DI-04 — 분석·매칭 정책 관리

### ADM-DI04-T01. 분석 실행 설정

- 목적: Provider, Model, Schema, Timeout, Retry, 비용 제한을 설정에서 관리한다.
- 선행 Task: ADM-DI02 Gate
- 기획 필요 내용:
  - 지원 Provider와 Model Allowlist를 정한다.
  - 최대 이미지 크기, Token, Timeout, Retry, 동시 실행 수를 결정한다.
- 개발 필요 내용:
  - 구조화된 설정 Form을 구현한다.
  - Provider·Model 조합과 수치 범위를 검증한다.
  - Secret 값은 입력·응답·로그에서 직접 노출하지 않는다.
  - 활성 설정이 신규 Job Snapshot에만 적용되게 한다.
- 예상 결과:
  - 코드 배포 없이 분석 실행 정책을 변경한다.
- 완료 기준:
  - 이미 대기·실행 중인 Job의 Snapshot은 변경되지 않는다.

### ADM-DI04-T02. 분석 Prompt Version 연결

- 목적: Screenshot 분석 Prompt를 기존 Prompt 관리 방식으로 Version 관리한다.
- 선행 Task: ADM-DI04-T01, PRQ04-T05
- 기획 필요 내용:
  - `design_reference_analysis`, `component_structure_analysis`, `design_style_analysis` Prompt Type을 확정한다.
  - 서버 고정 안전 규칙과 관리자 편집 본문을 구분한다.
- 개발 필요 내용:
  - 신규 Prompt Type과 Required Variable을 등록한다.
  - Prompt 관리 화면에서 Draft·Validate·Activate·Rollback을 지원한다.
  - 분석 설정에서 활성 Prompt Version을 선택하거나 현재 활성 Version을 참조한다.
- 예상 결과:
  - 분석 Prompt 변경과 결과 품질을 Version별로 추적한다.
- 완료 기준:
  - 잘못된 변수 또는 Schema를 가진 Prompt는 활성화할 수 없다.

### ADM-DI04-T03. Component 매칭 가중치

- 목적: 기존 Component 후보를 어떤 기준으로 비교할지 설정한다.
- 선행 Task: PRQ03-T03, ADM-DI02-T04
- 기획 필요 내용:
  - Role, Field, Style Slot, Policy, Layout Support 가중치의 허용 범위를 정한다.
  - 필수 일치 항목과 점수화 항목을 구분한다.
- 개발 필요 내용:
  - 매칭 가중치 Form과 합계 검증을 구현한다.
  - 설정 변경 전 대표 Fixture의 예상 매칭 변화를 Preview한다.
  - 변경된 가중치를 설정 Version에 저장한다.
- 예상 결과:
  - 자동 매칭 기준을 코드 수정 없이 조정한다.
- 완료 기준:
  - 가중치 변경으로 발생하는 후보 순위 변화를 저장 전 확인할 수 있다.

### ADM-DI04-T04. Confidence와 자동 판단 Threshold

- 목적: 자동 Match와 관리자 확인이 필요한 결과를 구분한다.
- 선행 Task: ADM-DI04-T03
- 기획 필요 내용:
  - Exact, Configurable, Variant, Composition, No Match별 Threshold를 정한다.
  - 낮은 Confidence 결과의 저장·승인 제한을 결정한다.
- 개발 필요 내용:
  - Threshold Form과 범위·순서 검증을 구현한다.
  - Threshold 구간별 결과 수와 Fixture 영향을 표시한다.
  - 자동 판단이어도 자동 Publish는 불가능하게 고정한다.
- 예상 결과:
  - 신뢰도가 낮은 매칭이 기존 Component로 잘못 확정되는 위험이 줄어든다.
- 완료 기준:
  - Threshold가 역전되거나 범위를 벗어나면 Validate 단계에서 실패한다.

### ADM-DI04-T05. 재사용·Variant·조합·신규 Draft 정책

- 목적: 신규 Component를 만들기 전에 기존 자산을 우선 사용하는 규칙을 관리한다.
- 선행 Task: PRQ02-T02, ADM-DI04-T04
- 기획 필요 내용:
  - 다음 판단 순서를 확정한다.
    1. reuse
    2. configure
    3. add_variant
    4. compose
    5. create_draft
    6. reject
  - Component별 확장 가능 Field와 Style Slot을 정한다.
- 개발 필요 내용:
  - 판단 순서와 허용 Action 설정 UI를 구현한다.
  - 신규 Draft 생성 제한과 중복 경고 강도를 설정한다.
  - Policy Preview에 대표 Component Case를 표시한다.
- 예상 결과:
  - Screenshot이 늘어나도 Component 수가 무분별하게 증가하지 않는다.
- 완료 기준:
  - `create_draft`는 앞선 재사용 옵션이 불가능한 근거가 있을 때만 제안된다.

### ADM-DI04-T06. Upload·비용·동시성 제한

- 목적: 잘못된 입력과 과도한 분석 비용을 설정에서 통제한다.
- 선행 Task: ADM-DI04-T01
- 기획 필요 내용:
  - 허용 MIME, 최대 Byte·Pixel, 최대 Capture 수를 결정한다.
  - 사용자·조직별 Rate Limit과 일일 비용 상한을 정한다.
- 개발 필요 내용:
  - Upload Policy와 Runtime Limit Form을 구현한다.
  - 서버 Validator와 설정값을 연결한다.
  - 비용 상한 도달 상태와 재개 조건을 표시한다.
- 예상 결과:
  - 대형 파일, 반복 요청, 비용 폭증을 사전에 차단한다.
- 완료 기준:
  - UI와 서버가 동일한 제한값을 사용한다.

### ADM-DI-04 종료 Gate

- 분석 실행과 Prompt Version을 설정에서 관리할 수 있다.
- Component 매칭 가중치·Threshold·재사용 정책을 Version 관리한다.
- Upload·비용·동시성 제한이 서버 Validator와 연결된다.
- 모든 자동 Publish는 계속 비활성화된다.

---

## 11. ADM-DI-05 — Component·Layout·Style Draft 관리

### ADM-DI05-T01. Component Proposal 목록

- 목적: 분석에서 생성된 매칭과 신규 Draft 제안을 상태별로 관리한다.
- 선행 Task: PRQ05-T04, ADM-DI03-T04
- 기획 필요 내용:
  - 목록에 표시할 Source, Match Type, Confidence, Status, 중복 경고를 정한다.
- 개발 필요 내용:
  - Proposal 목록과 상태·Action·Source Filter를 구현한다.
  - 기존 Component Match와 신규 Component Draft를 구분한다.
  - Review Required와 Blocking Warning을 우선 표시한다.
- 예상 결과:
  - 운영자가 어떤 Component 제안을 먼저 검토해야 하는지 확인한다.
- 완료 기준:
  - Proposal 목록에서 원본 Reference와 기존 후보로 이동할 수 있다.

### ADM-DI05-T02. Component Matching Inspector

- 목적: 인식된 Component와 기존 Registry 후보를 근거 중심으로 비교한다.
- 선행 Task: ADM-DI05-T01, PRQ06-T04
- 기획 필요 내용:
  - 구조, Field, Style Slot, Policy, Layout 차이의 표현 방식을 정한다.
- 개발 필요 내용:
  - 원본 Evidence와 Component Tree를 표시한다.
  - 후보별 점수 Breakdown과 차이를 표시한다.
  - reuse, configure, add_variant, compose, create_draft, reject를 선택하게 한다.
- 예상 결과:
  - 운영자가 AI 매칭 결과를 이해하고 수정할 수 있다.
- 완료 기준:
  - 최종 Decision과 원래 AI Decision이 모두 History에 저장된다.

### ADM-DI05-T03. Component Draft Editor

- 목적: 신규 Component Proposal을 기존 Component 계약에 맞게 수정한다.
- 선행 Task: ADM-DI05-T02, PRQ06-T05
- 기획 필요 내용:
  - 편집 가능한 Field, Policy, Style Slot, Default Value를 정한다.
  - 기존 Component로 재매핑하거나 Variant로 전환하는 절차를 정한다.
- 개발 필요 내용:
  - Component Role, Field 목록, Image·CTA Policy, Style Slot Editor를 구현한다.
  - 기존 Component Draft Form의 Field·Policy Editor를 재사용한다.
  - Raw JSON은 고급 Inspector로 제공하고 기본 편집은 구조화 Form을 사용한다.
- 예상 결과:
  - AI가 제안한 구조를 운영자가 코드 없이 수정한다.
- 완료 기준:
  - Draft가 Registry Component Schema Validator를 통과해야 저장된다.

### ADM-DI05-T04. Component Desktop·Mobile Preview

- 목적: Component Draft의 반응형·편집 가능성을 게시 전에 확인한다.
- 선행 Task: ADM-DI05-T03
- 기획 필요 내용:
  - Desktop·Mobile Fixture 콘텐츠와 합격 기준을 정한다.
- 개발 필요 내용:
  - 기존 Visual Editor Dialog Host를 활용해 Preview를 연다.
  - 긴 제목, 빈 값, 이미지 실패, CTA 유무 Fixture를 제공한다.
  - Overflow·접근성·필수 Field 검사를 실행한다.
- 예상 결과:
  - 특정 Screenshot에서만 정상인 Component가 게시되는 문제를 줄인다.
- 완료 기준:
  - Desktop·Mobile Blocking 오류가 있으면 승인·게시할 수 없다.

### ADM-DI05-T05. Layout Preset Draft 관리

- 목적: 분석된 Layout Pattern을 기존 Layout Preset 관리와 연결한다.
- 선행 Task: PRQ05-T05, PRQ06-T06
- 기획 필요 내용:
  - Section·Component Mapping 수정 범위와 Layout 게시 기준을 정한다.
- 개발 필요 내용:
  - Layout Draft 목록과 Pattern Evidence를 표시한다.
  - 기존 Section Layout Preset Editor를 재사용해 Desktop·Mobile Geometry를 수정한다.
  - 지원 불가 Geometry와 누락 Component를 경고한다.
- 예상 결과:
  - Screenshot Layout을 검수 가능한 실제 Preset Draft로 관리한다.
- 완료 기준:
  - Layout Contract를 통과한 Draft만 기존 Preset 관리로 게시 가능하다.

### ADM-DI05-T06. Design Style Profile 관리

- 목적: Token, Component Pattern, Layout Pattern, Image Treatment를 하나의 스타일로 관리한다.
- 선행 Task: PRQ05-T05, PRQ06-T06
- 기획 필요 내용:
  - Profile 이름, Tag, 적용 범위, Token 충돌 처리, Version 기준을 정한다.
- 개발 필요 내용:
  - Style Profile 목록·상세·Draft Editor를 구현한다.
  - Color, Typography, Spacing, Radius, Border, Elevation Token을 표시한다.
  - Component·Layout Pattern, Image Treatment, Guideline을 연결한다.
  - 기존 Design Token Manager의 Draft·Preview를 재사용한다.
- 예상 결과:
  - Screenshot의 시각적 특성을 재사용 가능한 스타일 자산으로 관리한다.
- 완료 기준:
  - Profile의 모든 Token과 Pattern이 Source Evidence 또는 관리자 입력 근거를 가진다.

### ADM-DI05-T07. 중복·병합·Archive 관리

- 목적: Component·Layout·Style Draft가 반복 축적되는 것을 방지한다.
- 선행 Task: ADM-DI05-T02, ADM-DI05-T05, ADM-DI05-T06
- 기획 필요 내용:
  - 중복 판정과 Merge, Supersede, Archive의 의미를 정의한다.
- 개발 필요 내용:
  - 유사 Proposal·Preset·Profile 경고를 제공한다.
  - 기존 항목에 Evidence를 추가하거나 Variant로 병합하는 Action을 구현한다.
  - 사용 중 항목 Archive 시 영향 범위를 표시한다.
- 예상 결과:
  - Library가 동일·유사 데이터로 과도하게 증가하지 않는다.
- 완료 기준:
  - 병합 후 Source Evidence와 이전 Decision History가 유실되지 않는다.

### ADM-DI-05 종료 Gate

- Component Proposal을 비교·수정·Preview할 수 있다.
- Layout Preset Draft와 Style Profile을 기존 관리 기능에 연결할 수 있다.
- 중복·Variant·병합·Archive를 관리할 수 있다.
- Draft는 아직 자동 Publish되지 않는다.

---

## 12. ADM-DI-06 — 검수·게시·작업 상태

### ADM-DI06-T01. 검수 Queue

- 목적: 분석·Component·Layout·Style별 검수 대상을 한곳에서 관리한다.
- 선행 Task: ADM-DI05 Gate, PRQ07-T01
- 기획 필요 내용:
  - 긴급도, Confidence, Blocking Warning, 등록일 기준의 우선순위를 정한다.
- 개발 필요 내용:
  - Review Required 목록과 담당자 Filter를 구현한다.
  - 분석 검수, Component Draft, Layout Draft, Style Profile을 유형별로 구분한다.
  - 내 작업과 미배정 작업을 구분한다.
- 예상 결과:
  - 검수 누락과 장기 대기 항목을 줄인다.
- 완료 기준:
  - 검수자는 다음 Action과 Blocking 사유를 목록에서 확인할 수 있다.

### ADM-DI06-T02. 승인·거절 Workflow

- 목적: 필수 검수를 완료한 데이터만 승인한다.
- 선행 Task: ADM-DI06-T01, PRQ07-T01
- 기획 필요 내용:
  - 유형별 필수 확인 항목과 승인·거절 Comment를 정한다.
- 개발 필요 내용:
  - 승인·거절·수정 요청 Action을 구현한다.
  - 필수 Checklist 미완료 시 승인을 차단한다.
  - Actor, Comment, 이전·이후 상태를 Audit에 저장한다.
- 예상 결과:
  - 승인 품질과 책임이 명확해진다.
- 완료 기준:
  - 권한과 Revision이 맞지 않는 승인 요청은 403 또는 409로 차단된다.

### ADM-DI06-T03. 기존 Registry 게시 연결

- 목적: 승인된 Draft를 기존 Component·Layout·Token 관리의 Draft Version으로 게시한다.
- 선행 Task: ADM-DI06-T02, PRQ07-T03, PRQ07-T04
- 기획 필요 내용:
  - 승인과 게시를 같은 역할이 수행할지 결정한다.
  - 게시 대상이 이미 변경된 경우의 충돌 정책을 정한다.
- 개발 필요 내용:
  - Component Draft→Component Version Draft Adapter를 구현한다.
  - Layout Draft→Section Layout Preset Draft Adapter를 구현한다.
  - Style Profile Token→Design Token Set Draft Adapter를 구현한다.
  - 게시 후 기존 관리 화면으로 이동하는 Link를 제공한다.
- 예상 결과:
  - 신규 관리 기능이 기존 Registry를 대체하지 않고 안전하게 확장한다.
- 완료 기준:
  - 게시 결과는 기존 관리 화면에서 추가 검증·활성화할 수 있다.
  - 1차에서는 기존 Registry의 Active 상태를 자동 변경하지 않는다.

### ADM-DI06-T04. 작업 상태·실패·Retry

- 목적: 분석과 게시 작업의 진행·실패·복구 상태를 설정에서 관리한다.
- 선행 Task: PRQ04-T04, ADM-DI03-T04
- 기획 필요 내용:
  - 운영자가 Retry·Cancel할 수 있는 상태와 최대 횟수를 정한다.
- 개발 필요 내용:
  - Queue, Processing, Failed, Review Required, Completed 목록을 구현한다.
  - 실패 단계, 오류 코드, Attempts, Lease, nextRetryAt을 표시한다.
  - Retry와 Cancel Action을 구현한다.
- 예상 결과:
  - 실패 작업이 방치되지 않고 운영자가 원인과 복구 방법을 확인한다.
- 완료 기준:
  - 중복 Retry는 동일 Idempotency 계약으로 차단된다.

### ADM-DI06-T05. 실행 Snapshot Inspector

- 목적: 작업의 원본, 설정, Prompt, 모델 Version을 재현 가능하게 확인한다.
- 선행 Task: ADM-DI06-T04, PRQ04-T05
- 기획 필요 내용:
  - 기본 화면에 표시할 정보와 관리자 전용 원본 정보를 구분한다.
- 개발 필요 내용:
  - Source·Capture·설정·Prompt·Model·Input Hash를 표시한다.
  - 민감정보를 제거한 JSON Snapshot Inspector를 제공한다.
  - 이전 시도와 결과를 비교한다.
- 예상 결과:
  - 설정 변경과 분석 실패의 연관성을 조사할 수 있다.
- 완료 기준:
  - Secret, Cookie, Authorization은 Snapshot 화면과 다운로드에 포함되지 않는다.

### ADM-DI06-T06. Audit·Version History

- 목적: 설정·분석·검수·게시 변경을 하나의 감사 흐름으로 조회한다.
- 선행 Task: ADM-DI02-T04, ADM-DI06-T02, ADM-DI06-T03
- 기획 필요 내용:
  - Audit Filter와 보존기간, 다운로드 권한을 정한다.
- 개발 필요 내용:
  - Actor, Action, Entity, Version, 이전·이후 상태 Filter를 구현한다.
  - Reference 상세과 설정 Version에서 관련 Audit로 이동하게 한다.
- 예상 결과:
  - 설정과 디자인 자산이 언제 어떻게 변경됐는지 추적한다.
- 완료 기준:
  - 승인·거절·게시·Rollback Event가 누락 없이 표시된다.

### ADM-DI06-T07. Feature Flag와 Kill Switch 화면

- 목적: 분석·게시 기능을 독립적으로 활성화하거나 중단한다.
- 선행 Task: PRQ04-T07, ADM-DI02-T05
- 기획 필요 내용:
  - Flag 변경 권한과 이중 확인이 필요한 위험 Action을 정한다.
- 개발 필요 내용:
  - Screenshot 등록, Mock 분석, 실제 분석, Draft 게시, 빌더 사용 Flag를 분리해 표시한다.
  - Kill Switch에 영향받는 작업과 사용자 범위를 미리 표시한다.
  - 변경 Note와 Audit를 필수로 저장한다.
- 예상 결과:
  - 장애나 비용 이상 시 필요한 기능만 즉시 중단한다.
- 완료 기준:
  - 실제 분석 Flag는 1차 배포에서 Off로 고정되며 별도 승인 없이 활성화할 수 없다.

### ADM-DI-06 종료 Gate

- 검수 Queue와 승인·거절이 권한·Revision 계약을 따른다.
- 승인된 Draft를 기존 Registry의 Draft로 게시할 수 있다.
- 작업 실패·Retry·Snapshot·Audit를 설정에서 확인한다.
- 실제 분석과 자동 Publish는 비활성화 상태를 유지한다.

---

## 13. ADM-DI-07 — 검증·접근성·배포

### ADM-DI07-T01. Mock Analyzer 설정 E2E

- 목적: 실제 AI 비용 없이 설정의 전체 관리 흐름을 검증한다.
- 선행 Task: ADM-DI03~ADM-DI06 Gate, PRQ06-T07
- 기획 필요 내용:
  - 첫 E2E의 정상·오류·권한 시나리오를 확정한다.
- 개발 필요 내용:
  - 다음 Browser E2E를 구현한다.
    1. 설정 탭 진입
    2. Screenshot Reference 등록
    3. Mock 분석 요청
    4. Component 매칭 확인
    5. Component·Layout·Style Draft 수정
    6. Reviewer 승인
    7. 기존 Registry Draft 게시
    8. 작업·Audit 확인
  - 실패, Retry, Revision Conflict, 권한 거부를 포함한다.
- 예상 결과:
  - 실제 Vision Provider 없이 설정 Control Plane이 끝까지 검증된다.
- 완료 기준:
  - P0 E2E가 반복 실행에서 안정적으로 통과한다.

### ADM-DI07-T02. 접근성·반응형 검증

- 목적: 설정의 복잡한 관리 흐름을 Keyboard와 좁은 화면에서도 사용할 수 있게 한다.
- 선행 Task: ADM-DI07-T01
- 기획 필요 내용:
  - 지원할 최소 관리자 화면 폭을 결정한다.
- 개발 필요 내용:
  - Tab, Focus, Dialog, Error 연결, 상태 비색상 표현을 검증한다.
  - 좁은 화면에서 좌측 Navigation을 Drawer 또는 접힘 상태로 전환한다.
  - 원본 Preview와 Editor의 독립 Scroll을 검증한다.
- 예상 결과:
  - 긴 설정과 검수 화면의 사용성과 접근성이 향상된다.
- 완료 기준:
  - Keyboard만으로 등록·검수·승인·게시 흐름을 완료할 수 있다.

### ADM-DI07-T03. 다국어 메시지 등록

- 목적: 신규 설정의 메뉴·상태·오류를 Locale Message로 관리한다.
- 선행 Task: ADM-DI01~ADM-DI06 Gate
- 기획 필요 내용:
  - 한국어와 영어 용어를 확정한다.
- 개발 필요 내용:
  - 메뉴, 상태, Action, 도움말, 오류 코드를 Locale Store에 등록한다.
  - 코드에 새 사용자 노출 문자열이 하드코딩되지 않게 검사한다.
- 예상 결과:
  - 관리자 설정의 용어와 오류 메시지가 일관된다.
- 완료 기준:
  - 한국어·영어 전환 시 누락 Key가 없다.

### ADM-DI07-T04. 성능·대형 데이터 검증

- 목적: Reference와 Proposal이 증가해도 설정 목록과 Inspector가 안정적으로 동작하게 한다.
- 선행 Task: ADM-DI07-T01
- 기획 필요 내용:
  - 예상 Reference·Capture·Proposal 수와 초기 응답 목표를 정한다.
- 개발 필요 내용:
  - 목록 Pagination과 Filter Query를 부하 테스트한다.
  - 대형 분석 JSON을 상세 요청과 Lazy Load로 분리한다.
  - Thumbnail과 원본 Blob 로딩을 분리한다.
- 예상 결과:
  - 데이터 증가로 설정 전체가 느려지는 문제를 줄인다.
- 완료 기준:
  - 목록 API가 원본 Blob과 전체 분석 JSON을 반환하지 않는다.

### ADM-DI07-T05. 제한 배포와 운영 문서

- 목적: Reference Admin과 Reviewer에게만 1차 설정 기능을 안전하게 공개한다.
- 선행 Task: ADM-DI07-T01~ADM-DI07-T04
- 기획 필요 내용:
  - Pilot 사용자, 피드백 방식, 중단 조건을 정한다.
- 개발 필요 내용:
  - 역할·사용자 기반 Feature Flag를 적용한다.
  - 등록·설정·검수·게시·Retry 운영 가이드를 작성한다.
  - 오류와 권리 이슈 대응 Runbook을 작성한다.
- 예상 결과:
  - 실제 운영 피드백을 전체 사용자 공개 전에 확보한다.
- 완료 기준:
  - Pilot 중 실제 AI 호출과 자동 Publish는 계속 비활성화된다.

### ADM-DI-07 최종 Gate

- 설정에서 Reference 등록부터 기존 Registry Draft 게시까지 Mock E2E가 통과한다.
- 역할·권한·Revision·Audit가 검증된다.
- Desktop·Mobile Component Preview와 설정 접근성이 검증된다.
- 실제 Vision Provider와 자동 Publish는 Off 상태다.
- 운영 문서와 Feature Flag가 준비됐다.

---

## 14. 1차 완료 화면

1차 완료 시 관리자는 설정에서 다음을 수행할 수 있다.

### Overview

- 전체 Reference 수
- 분석 대기·실패·검수 필요 수
- Component Proposal·Layout Draft·Style Profile 상태
- 활성 설정 Version
- Mock/Disabled Provider 상태
- 최근 실패와 Audit

### Reference 원본

- Screenshot Reference 등록
- Desktop·Mobile Capture 확인
- Source Metadata와 권리 정보 수정
- Mock 분석 요청
- Archive와 사용처 확인

### 분석·매칭 설정

- Provider·Model·Prompt Version 설정
- Timeout·Retry·Upload·비용 제한 설정
- Component 매칭 가중치와 Threshold 설정
- 재사용·Variant·조합·신규 Draft 판단 정책 설정
- 설정 Draft·검증·활성·Rollback

### Draft 관리

- Component 매칭 후보 비교
- Component Proposal 수정
- Desktop·Mobile Preview
- Layout Preset Draft 수정
- Design Style Profile·Token Draft 수정
- 중복·Variant·병합·Archive 처리

### 검수·게시

- Review Queue
- 승인·거절·수정 요청
- 권리·자산 재사용 확인
- 기존 Component·Layout·Token 관리의 Draft로 게시

### 작업·이력

- Mock 분석 Job 상태
- 실패 단계·Retry
- 실행 Snapshot
- 설정·검수·게시 Audit
- Feature Flag와 Kill Switch 상태

---

## 15. 1차 완료 기준

다음 조건을 모두 만족하면 관리자 설정 1차 개발을 완료한 것으로 본다.

1. 설정에 `디자인 지식 관리` 단일 진입점이 있다.
2. Editor, Reviewer, Admin 권한이 UI와 API에서 동일하게 적용된다.
3. Screenshot Reference를 등록하고 Capture Version을 관리한다.
4. 분석·매칭·검수 정책을 Draft·Validate·Activate·Rollback Version으로 관리한다.
5. Component 매칭 가중치와 재사용 우선순위를 설정할 수 있다.
6. Component Proposal을 수정하고 Desktop·Mobile Preview할 수 있다.
7. Layout Preset Draft와 Design Style Profile을 관리할 수 있다.
8. 승인된 Draft를 기존 Component·Layout·Token 관리의 Draft로 게시할 수 있다.
9. 작업 실패·Retry·실행 Snapshot·Audit를 조회할 수 있다.
10. Mock Analyzer E2E가 통과한다.
11. 실제 Vision Provider 호출은 기본 비활성화된다.
12. Component·Layout·Token 자동 Publish는 불가능하다.
13. Feature Flag Off에서 기존 설정과 빌더 기능에 회귀가 없다.

---

## 16. 우선 구현 순서

### 첫 번째 묶음 — 설정 Shell

- ADM-DI01-T01 상위 탭
- ADM-DI01-T02 하위 Navigation
- ADM-DI01-T03 역할별 권한
- ADM-DI01-T04 공통 Shell

### 두 번째 묶음 — 설정 Version 기반

- ADM-DI02-T01 설정 Schema
- ADM-DI02-T02 Version API
- ADM-DI02-T03 Frontend Service
- ADM-DI02-T04 Version UI
- ADM-DI02-T05 안전 기본 Seed

### 세 번째 묶음 — Reference 관리

- ADM-DI03-T01 목록
- ADM-DI03-T02 Screenshot 등록
- ADM-DI03-T03 상세·Capture Version
- ADM-DI03-T04 Mock 분석 요청
- ADM-DI03-T05 Archive

### 네 번째 묶음 — 분석·매칭 정책

- ADM-DI04-T01~ADM-DI04-T06

### 다섯 번째 묶음 — Draft 관리

- ADM-DI05-T01~ADM-DI05-T07

### 여섯 번째 묶음 — 검수·작업·게시

- ADM-DI06-T01~ADM-DI06-T07

### 일곱 번째 묶음 — 검증·Pilot

- ADM-DI07-T01~ADM-DI07-T05

---

## 17. 1차 이후 후속 개발

설정 Control Plane 1차가 완료된 후 다음 순서로 실제 기능을 활성화한다.

1. 실제 Vision Provider 연결과 고정 평가셋 검증
2. Section·Component 구조 분석 품질 개선
3. 기존 Component Matching Engine 운영 적용
4. Component·Layout·Style Draft 생성 Worker 활성화
5. 관리자 Pilot 검수와 Threshold 조정
6. 승인 Library를 프로모션 빌더 수동 선택에 연결
7. 품질 Gate·Undo·Usage Event 연결
8. 공개 URL Capture
9. 자동 추천·Semantic Retrieval

후속 단계에서도 자동 Component 코드 생성과 자동 Publish는 허용하지 않는다.
