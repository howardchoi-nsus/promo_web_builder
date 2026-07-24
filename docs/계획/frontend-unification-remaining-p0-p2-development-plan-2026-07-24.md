# 프런트엔드 단일화 잔여 P0~P2 개발계획서

## 0. 문서 정보

- 작성일: 2026-07-24
- 대상 저장소: `promo_web_builder`
- 기준 브랜치: `main`
- 문서 목적: 프런트엔드 플랫폼 단일화 기반 반영 이후 남은 P0~P2 작업을 실제 개발 가능한 단위로 정의
- 선행 문서:
  - `docs/handoff/frontend-platform-unification-foundation-handoff-2026-07-24.md`
  - `docs/계획/frontend-platform-unification-and-shared-modules-development-plan-2026-07-24.md`
  - `docs/계획/common-editor-platform-and-layout-engine-development-plan-2026-07-24.md`
  - `docs/계획/section-image-prompt-governance-draft-2026-07-24.md`
- 제외 범위:
  - Neon 운영 DB 중복·미사용 객체 정리
  - 최종 번들 최적화 및 Lazy Loading
  - TypeScript 전면 도입
  - UI 전면 재디자인
- 단계 번호 주의:
  - 본 문서의 P0~P2는 완료된 기반 작업 이후의 **잔여 실행 순서를 새로 분류한 번호**다.
  - 기존 Handoff에 기록된 완료 P0~P6을 취소하거나 다시 구현한다는 의미가 아니다.

## 1. 현재 기준선

### 1.1 완료된 기반

다음 기반 작업은 완료된 것으로 간주하며 이번 계획에서 다시 구현하지 않는다.

- 1280px 기준 공통 Geometry·Resize 엔진
- Editor Core, Command Reducer, History Store, Undo/Redo
- Admin, Promo Builder, Output Host Adapter
- 공통 Snapshot 계약과 Editor Bridge
- 공통 Preview Controls
- 관리자 Vue CDN 제거와 Vite 진입점
- Admin·Visual Editor 동시 Build
- 기존 API, URL, DB Schema 호환

### 1.2 현재 잔여 구조

- `visual-editor/src/App.vue`
  - 약 72KB의 단일 파일에 Section Rail, Preview, Property, AI Layout, Host별 화면 분기가 함께 존재한다.
- `visual-editor/src/PromoPageRenderer.vue`
  - 렌더링과 편집 이벤트 책임이 아직 크며 Host UI와의 경계를 추가로 명확히 해야 한다.
- `prototype/create-promo.js`
  - API, 저장소, 단계 제어, DOM 렌더링, iframe 통신 책임이 혼재한다.
- `admin-app/src/main.js`
  - Vite 진입점은 기존 `prototype/app.js`를 전환 레이어로 유지한다.
  - Template Layout Manager는 `admin-app/src/components/TemplateLayoutManager.vue`와 Service를 직접 import하며 구형 모듈은 제거됐다.
- `prototype/promo-wizard.html/js`
  - Create Promo와 기능이 중복되지만 실제 사용처 감사 전에는 제거할 수 없다.
- 이미지 프롬프트
  - 즉시 오류 복구와 변수 계약·활성화 검증·쓰기 이력 트랜잭션은 완료됐다.
  - 활성본 직접 수정 제거, 새 Draft Version, 시험 생성, 승인 비교, 즉시 롤백 운영 구조는 미완료다.

## 2. 목표

### 2.1 P0 목표

- Visual Editor의 공통 UI 영역을 기능 단위 Vue 컴포넌트로 분리한다.
- 관리자 레이아웃 편집기와 프로모션 빌더가 동일한 Editor Core와 UI 이벤트 경로를 사용하도록 검증한다.
- 화면 모드 문자열이 핵심 편집 로직에 직접 영향을 주는 경로를 Capability로 축소한다.

### 2.2 P1 목표

- Create Promo를 기능 단위로 Vue에 점진 전환한다.
- 관리자 대형 Vue 인스턴스를 기능 단위 SFC와 Service로 분리하기 시작한다.
- 전환 중에도 기존 URL, API, localStorage, iframe 메시지 계약을 유지한다.

### 2.3 P2 목표

- 구형 Promo Wizard의 참조와 독립 기능을 감사하고 Create Promo 통합 경로를 확정한다.
- 중복 레거시 HTML·JS·CSS를 안전하게 제거할 수 있는 상태를 만든다.
- 이미지 프롬프트를 버전·검증·롤백이 가능한 운영 설정으로 전환한다.

## 3. 공통 개발 원칙

1. 각 단계는 실패 재현 테스트 또는 기준 fixture 작성부터 시작한다.
2. 한 단계의 전체 테스트와 Build가 통과해야 다음 단계로 진행한다.
3. 기존 사용자 변경과 관련 없는 파일을 수정하지 않는다.
4. 생성된 `prototype/*-assets` 파일을 직접 수정하지 않는다.
5. 공통 편집 기능에 Host 이름 기반 조건문을 추가하지 않는다.
6. Host 차이는 Adapter, Capability, Slot으로만 표현한다.
7. Layout 변경은 Editor Command를 통과한다.
8. Renderer는 API, localStorage, postMessage를 직접 처리하지 않는다.
9. 구조 변경과 시각 디자인 변경을 같은 커밋에 혼합하지 않는다.
10. 제거 작업은 사용처 감사와 호환 기간 정의 후 별도 커밋으로 진행한다.

## 4. P0 — 공통 Editor UI 분리 및 기능 동등성 완성

### 4.1 P0-1 기능 동등성 기준선 보강

#### 작업

- Admin Layout과 Create Promo가 같은 Editor Document fixture를 로드하는 테스트를 추가한다.
- 다음 Command의 결과를 Host별로 비교한다.
  - Section 선택
  - Component 단일·다중 선택
  - Move
  - 정비율·자유 Resize
  - Text Box Resize와 Font Scale
  - Section Style 변경
  - Component Style 변경
  - Undo/Redo
  - AI Layout Patch 적용
- 같은 입력에서 geometry, style, fontSize, zIndex, section order 결과가 일치하는지 검증한다.

#### 완료 기준

- Admin과 Create Promo에서 동일 Command 결과가 구조적으로 동일하다.
- Preview 크기와 콘텐츠 문구 길이가 저장 geometry를 변경하지 않는다.
- 기능 불일치가 있으면 UI 분리 전에 실패 테스트로 고정된다.

### 4.2 P0-2 `App.vue` UI 분리

#### 목표 구조

```text
visual-editor/src/platform/editor-ui/
  EditorWorkspace.vue
  SectionPanel.vue
  PreviewPanel.vue
  PropertyPanel.vue
  ComponentAccordion.vue
  SectionStyleControls.vue
  AiLayoutControls.vue
  EditorPreviewControls.vue
```

#### 책임

- `EditorWorkspace.vue`
  - 3단 Editor Layout 조립
  - Panel Slot과 Capability 전달
- `SectionPanel.vue`
  - Section 목록, 선택, 활성 상태, 선택 Section 자동 스크롤
- `PreviewPanel.vue`
  - Renderer와 Preview Toolbar 조립
  - Preview stage 스크롤 경계
- `PropertyPanel.vue`
  - Section 속성, Component Accordion, 선택 상태별 빈 화면 처리
- `ComponentAccordion.vue`
  - 선택 Component 자동 열림
  - Content와 Design 속성 그룹 표시
- `SectionStyleControls.vue`
  - 배경색, 배경 이미지 위치·크기·페이드, 이미지 제거
- `AiLayoutControls.vue`
  - 선택 대상, 실행 상태, 실패·재시도, 결과 상태 표시

#### `App.vue` 최종 책임

- Editor Context 생성
- Host Adapter 선택
- Editor Store 생성
- Editor Workspace 조립
- 전역 오류 Boundary

#### 완료 기준

- `App.vue`에서 Panel 내부 마크업과 상세 이벤트 처리 로직이 제거된다.
- 분리된 UI는 Editor Store와 Command API만 사용한다.
- Admin/Create Promo별 UI 차이는 Capability 또는 Slot으로 제한된다.

### 4.3 P0-3 Renderer 경계 정리

#### 작업

- `PromoPageRenderer.vue`의 편집 이벤트를 표준 Editor Command payload로 변환한다.
- Renderer 내부에서 직접 상태를 영구 변경하는 경로가 없는지 확인한다.
- Preview와 Web Output이 동일한 출력용 Style 계산을 사용하도록 검증한다.
- Web Output에는 Editor 선택선, Resize Handle, 진행 상태 UI가 포함되지 않도록 한다.

#### 완료 기준

- Renderer는 전달된 Editor Document를 렌더링하고 표준 Interaction Event만 반환한다.
- Web Output과 Preview의 콘텐츠·배경·배치 결과가 동일하다.

### 4.4 P0 테스트

- Editor Core 단위 테스트
- Geometry·Resize 단위 테스트
- Vue UI 이벤트 계약 테스트
- Admin/Create Promo 동등성 브라우저 테스트
- Web Output 비교 테스트
- 전체 테스트, `pnpm run build`, `git diff --check`

### 4.5 P0 롤백

- UI 추출은 컴포넌트 단위 커밋으로 분리한다.
- 데이터 계약과 API는 변경하지 않는다.
- 문제 발생 시 기존 `App.vue` 조립 구조로 커밋 단위 복원할 수 있어야 한다.

## 5. P1 — Create Promo·관리자 점진 Vue 전환

### 5.1 P1-1 Wizard Domain과 Service 분리

#### 목표 구조

```text
frontend-domain/wizard/
  wizard-state.mjs
  wizard-steps.mjs
  template-selection.mjs
  content-normalizer.mjs
  validation.mjs

frontend-services/
  template-service.mjs
  section-service.mjs
  component-service.mjs
  prompt-service.mjs
  locale-service.mjs
```

#### 작업

- Create Promo와 Promo Wizard에 복제된 순수 함수를 먼저 추출한다.
- API 응답을 화면에서 직접 변형하지 않고 Domain Normalizer를 거치게 한다.
- fetch 오류를 공통 오류 형식으로 변환한다.
- Storage와 Snapshot 복구를 공통 모듈에서 처리한다.
- Service는 DOM과 Vue에 의존하지 않게 한다.

#### 완료 기준

- Wizard 단계·검증·템플릿 선택 로직을 브라우저 없이 테스트할 수 있다.
- 같은 API를 호출하는 화면별 fetch 복제가 제거되기 시작한다.

### 5.2 P1-2 Create Promo 점진 전환

#### 전환 순서

1. Step Navigation
2. 템플릿 선택
3. Editor Host
4. Content Form
5. 저장·복원 상태 표시

#### 작업 원칙

- 전체 페이지를 한 번에 재작성하지 않는다.
- 전환한 영역만 Vue가 소유하고 기존 DOM 함수는 해당 영역에서 제거한다.
- Vue와 기존 Vanilla 코드가 같은 DOM을 동시에 수정하지 않게 한다.
- 기존 5단계 흐름, URL, localStorage key, Snapshot revision을 유지한다.

#### 완료 기준

- 전환 영역에서 `innerHTML` 기반 재조립이 제거된다.
- 새로고침·뒤로가기·단계 이동·템플릿 재선택이 기존과 동일하게 동작한다.
- Editor iframe과의 메시지는 공통 Editor Bridge만 사용한다.

### 5.3 P1-3 관리자 기능 단위 SFC 전환

#### 1차 대상

1. Template Layout Manager
2. Component Manager
3. Section Manager

#### 2차 대상

1. Prompt Manager
2. Locale Manager
3. Audit Log

#### 작업

- `prototype/app.js`의 기능별 상태와 메서드를 SFC·Composable·Service로 이동한다.
- Admin Vite Entry에서 전환 완료 모듈을 직접 import한다.
- `globalThis.Vue`는 레거시 호환 영역에서만 유지한다.
- 공통 App Shell과 Navigation 정의를 Vue 컴포넌트로 이동한다.
- 관리자 문구는 기존 DB i18n Runtime과 key 정책을 유지한다.

#### 완료 기준

- 신규·전환 관리 기능은 `prototype/app.js`에 코드를 추가하지 않는다.
- 전환 완료 영역은 Vue SFC와 Service만 수정하면 유지보수할 수 있다.
- 템플릿 저장·활성화 결과가 Create Promo에 즉시 반영된다.

### 5.4 P1 CSS 경계

- App Shell, 공통 UI Component, 화면 전용 CSS의 책임을 분리한다.
- 디자인 값은 공통 Token을 참조한다.
- Promo Renderer와 생성 템플릿 CSS는 Admin UI CSS와 분리한다.
- Web Output에 App Shell·Editor UI CSS가 포함되지 않게 한다.
- 기존 selector 제거 전 HTML·JS 참조를 검사한다.

### 5.5 P1 테스트

- Wizard Domain 단위 테스트
- Service API 계약 테스트
- Create Promo 5단계 브라우저 Smoke Test
- 관리자 템플릿 생성·수정·활성화 테스트
- 관리자 Layout 저장 → Create Promo 반영 통합 테스트
- 관리자 Component·Section CRUD 테스트
- i18n Runtime 회귀 테스트
- 전체 테스트, Admin·Visual Editor Build

### 5.6 P1 롤백

- 화면 영역별 Feature Flag 또는 명확한 Entry 경계를 유지한다.
- SFC 전환 단위로 독립 커밋한다.
- 기존 API와 저장 데이터 계약은 P1에서 변경하지 않는다.

## 6. P2 — Legacy 통합 및 이미지 프롬프트 운영 안정화

### 6.1 P2-A Promo Wizard 참조 감사

#### 감사 대상

- 메뉴와 링크
- HTML·JS import
- 문서와 테스트
- Vercel route
- localStorage key
- iframe source 값
- 운영 접근 로그 또는 사용 경로

#### 분류

- Create Promo와 완전히 중복
- Create Promo로 이전할 독립 기능
- 호환을 위해 일정 기간 유지
- 즉시 제거 가능

#### 완료 기준

- 모든 기능과 경로가 분류표에 기록된다.
- 제거 전 redirect 또는 호환 안내 방식이 정의된다.
- 사용 여부가 불명확한 파일은 삭제하지 않는다.

### 6.2 P2-B 독립 기능 이전과 Legacy 제거

#### 작업

- 필요한 기능을 Wizard Domain 또는 Create Promo로 이전한다.
- 기존 Promo Wizard URL에 redirect 또는 종료 안내를 적용한다.
- 중복 저장소·Snapshot·Content 렌더링 로직을 제거한다.
- 사용되지 않는 HTML·JS·CSS는 별도 승인과 별도 커밋으로 제거한다.

#### 완료 기준

- 기존 사용자 데이터가 Create Promo에서 복원된다.
- 운영 URL에서 404 또는 무한 redirect가 발생하지 않는다.
- 삭제 대상에 대한 참조 검색 결과가 0건이다.

### 6.3 P2-C 이미지 프롬프트 변수 계약

#### 작업

- 프롬프트 유형별 허용 변수 스키마를 정의한다.
- 필수·선택 변수, 기본값, 허용 enum을 정의한다.
- Section Background와 Component Image 계약을 분리한다.
- 미등록 변수와 미치환 변수의 저장·활성화를 차단한다.
- provider, model, response format 조합을 검증한다.
- 최종 렌더링 프롬프트 미리보기를 제공한다.

#### 필수 공통 값

- Section 또는 Component 콘텐츠
- 배경색
- Fade: `none | left | right | both`
- Safe Area와 Focal Position
- 이미지 출력 크기
- 생성 대상 식별자

#### 완료 기준

- 관리자 프롬프트 수정으로 미치환 변수 HTTP 409가 다시 발생하지 않는다.
- 서버 공급 변수와 관리자 사용 가능 변수가 하나의 계약에서 관리된다.

### 6.4 P2-D 프롬프트 버전·검증·롤백

#### 생명주기

```text
draft → validated → active → archived
```

#### 작업

- 활성 프롬프트 직접 수정 대신 새 Draft Version을 만든다.
- 유형별 Active Version을 하나로 제한한다.
- 활성화 전에 변수·모델·응답 형식·길이·안전 정책을 검증한다.
- 이전 Active Version으로 즉시 롤백할 수 있게 한다.
- 실행 이력에 Prompt ID·Version과 변수 Snapshot 또는 Hash를 남긴다.

#### DB 정책

- 기존 `prompt_templates`와 History 구조를 우선 재사용한다.
- P2 착수 시 Schema Gap Analysis를 수행한다.
- 기존 구조로 충족되지 않는 경우에만 별도 Migration 계획과 롤백 SQL을 작성한다.
- Migration이 필요하면 기능 코드와 같은 커밋에 혼합하지 않는다.

### 6.5 P2-E 프롬프트 블록과 시험 생성

#### 권장 블록

1. 공통 이미지 원칙
2. 디자인 토큰·브랜드 지침
3. Section 또는 Component 콘텐츠
4. 배치와 Safe Area
5. 배경색과 Fade
6. 관리자 추가 지침
7. Negative Prompt
8. 출력 규격

#### 작업

- 필수 시스템 블록은 삭제·순서 변경을 제한한다.
- 관리자 변경 가능 블록을 명확히 표시한다.
- 고정 테스트 콘텐츠로 Active와 Draft 결과를 비교한다.
- 생성 성공률, 가독성, 배경색 일치, 피사체 위치, 채택률을 기록한다.
- 실패율 기준 초과 시 활성화를 중단하거나 이전 버전으로 롤백한다.

### 6.6 P2 테스트

- Legacy 참조 검사
- Redirect와 데이터 복원 테스트
- Prompt 변수 계약 단위 테스트
- 미등록·미치환 변수 차단 테스트
- Active Version 단일성 테스트
- Prompt 활성화·롤백 API 테스트
- Section Background·Component Image 생성 테스트
- 실패 후 재시도 테스트
- 관리자 시험 생성 비교 UI 테스트
- 전체 테스트와 Build

### 6.7 P2 롤백

- Legacy 파일 제거 전 마지막 유지 커밋을 태그 또는 기록한다.
- Redirect는 독립 커밋으로 분리한다.
- 프롬프트 활성화 실패 시 이전 Active Version으로 원자적 복구한다.
- DB Migration이 있으면 Down SQL 또는 복구 절차를 사전에 검증한다.

## 7. 단계별 커밋 전략

### P0

1. 기능 동등성 실패 재현 테스트
2. Section Panel 분리
3. Preview Panel 분리
4. Property Panel·Accordion 분리
5. AI Controls 분리
6. Renderer 이벤트 경계 정리

### P1

1. Wizard Domain
2. 공통 Service
3. Create Promo Step Navigation
4. Template Selection
5. Editor Host
6. Content Form
7. Admin Template Layout Manager
8. Admin Component·Section Manager
9. App Shell·CSS 경계

### P2

1. Legacy 참조 감사 문서와 테스트
2. 독립 기능 이전
3. Redirect
4. 승인된 Legacy 제거
5. Prompt 변수 계약
6. Prompt 버전·검증
7. Prompt 롤백
8. Prompt 블록 조립
9. 시험 생성·비교

## 8. 단계별 승인 게이트

| Gate | 필수 확인 |
| --- | --- |
| P0 시작 | 기준 fixture, 현재 회귀 테스트 통과 |
| P0 완료 | Admin/Create Promo Command 결과 동등, Build 통과 |
| P1 시작 | P0 구조와 UI 책임 경계 확정 |
| P1 완료 | Create Promo 5단계 및 관리자 저장→반영 통합 테스트 통과 |
| P2 Legacy 제거 | 참조 감사, redirect, 사용자 데이터 호환 확인 및 별도 승인 |
| P2 DB 변경 | Schema Gap Analysis, Migration·Rollback 검토 및 별도 승인 |
| P2 완료 | Prompt 활성화·롤백·시험 생성 및 전체 회귀 테스트 통과 |

## 9. 위험 요소

### 9.1 Vue와 Vanilla의 DOM 이중 소유

- 위험: 이벤트 중복, 선택 상태 초기화, 화면 깜박임
- 대응: 전환 영역별 DOM 소유권을 명확히 하고 완료 영역의 기존 렌더링 함수를 제거한다.

### 9.2 Snapshot 호환 손상

- 위험: 기존 작성 중 데이터 또는 활성 Layout 복원 실패
- 대응: Snapshot Revision과 Migration 테스트를 유지하고 저장 계약 변경을 P0~P1에서 금지한다.

### 9.3 관리자 저장값의 Create Promo 반영 지연

- 위험: 캐시 또는 활성 버전 선택 오류
- 대응: 저장·활성화·공개 조회를 하나의 브라우저 통합 테스트로 고정한다.

### 9.4 Legacy 조기 삭제

- 위험: 숨은 URL·메뉴·사용자 저장 데이터 손실
- 대응: 참조 감사, redirect, 호환 기간, 별도 승인 후 제거한다.

### 9.5 프롬프트 변경에 의한 운영 생성 중단

- 위험: 미등록 변수, 잘못된 모델 옵션, 단일 Active 손상
- 대응: Draft/Validate/Activate 단계와 이전 버전 원자적 롤백을 적용한다.

### 9.6 계획 범위 과대화

- 위험: P1과 P2를 동시에 진행해 회귀 원인 추적이 어려워짐
- 대응: P0 → P1 → P2 순서를 유지하고 각 Gate 통과 전 다음 단계의 대규모 구현을 시작하지 않는다.

## 10. 최종 Definition of Done

### P0

- [ ] Admin과 Create Promo가 같은 Editor Core·Command·UI 이벤트 경로를 사용한다.
- [ ] `App.vue`의 Section·Preview·Property·AI UI가 기능 단위로 분리됐다.
- [ ] Preview와 Web Output이 같은 Renderer 결과를 제공한다.

### P1

- [ ] Create Promo 핵심 5단계가 Vue 컴포넌트와 공통 Domain을 사용한다.
- [ ] 관리자 핵심 Template·Component·Section 관리가 기능 단위 SFC를 사용한다.
- [x] 관리자 저장·활성화 결과가 Create Promo에 정상 반영된다.
- [x] 기존 URL, API, localStorage, Snapshot 호환이 유지된다.

### P2

- [x] Promo Wizard의 유지·통합·제거 대상이 감사 문서로 분류됐다.
- [ ] 승인된 Legacy만 제거되고 기존 URL 호환이 보장된다.
- [x] 이미지 프롬프트 변수 계약과 활성화 검증이 적용됐다.
- [ ] Draft·Active·Archived와 롤백이 동작한다.
- [ ] Section Background와 Component Image 시험 생성이 통과한다.
- [x] 전체 테스트, 브라우저 테스트, Admin·Visual Editor Build가 통과한다.

## 11. P2 이후 To-Be

- Neon 운영 DB 중복·미사용 객체 정리
- 최종 Vite Entry와 디렉터리 구조 확정
- 번들 크기와 Lazy Loading 최적화
- 운영 관측성 Dashboard와 배포·롤백 Runbook 완성
- TypeScript 점진 도입 여부 결정

## 12. 2026-07-24 개발 반영 결과

### P0 완료

- `SectionPanel`, `PreviewPanel`, `PropertyPanel`, `AiLayoutControls`를 공통 Vue SFC로 분리했다.
- 관리자 레이아웃 편집기와 프로모션 빌더가 기존 Editor Core, Host Adapter, Snapshot 계약을 계속 사용하도록 유지했다.
- Web Output Renderer 의존성 누락과 이동된 UI를 예전 파일에서 찾던 정적 테스트를 디버깅했다.

### P1 1차 완료

- Create Promo 5단계 흐름을 `wizard-flow.js`로 분리했다.
- Create Promo와 구형 Promo Wizard의 공개 템플릿 조회를 `wizard-template-service.js`로 통합했다.
- 관리자 Template Layout Manager를 첫 Vue SFC와 API Service로 분리하고 Vue Vite 플러그인을 적용했다.
- 전체 화면 Vue 전환과 나머지 관리자 기능 SFC 분리는 후속 점진 전환 대상으로 유지한다.

### P2 안전 통제선 완료

- 구형 Promo Wizard는 즉시 삭제하지 않고 자동 감사 대상으로 등록했다.
- 루트 진입 카드, 전용 런타임, 저장 상태와 전용 테스트가 남아 있어 현재 종료 상태는 `retirement_blocked`다.
- 프롬프트 저장·활성화 시 허용 변수, 필수 변수, 선언과 Placeholder 정합성을 검증한다.
- 섹션 배경 이미지 실행 시 `fadeMode`, 6자리 배경색, `W:H` 비율 형식을 검증한다.
- 기존 Draft·Active·Archived·History DB 구조는 유지했으며 DB Migration은 추가하지 않았다.

### 2026-07-25 소스 감사 보완

- 관리자 Template Layout Manager의 구형 중복 구현을 제거하고 SFC를 단일 정본으로 확정했다.
- 템플릿 전환 중 이전 Layout API 응답이 최신 revision을 덮지 않도록 요청 revision 검증을 추가했다.
- 신규 관리자 SFC 문구를 `locales/ko.json`, `locales/en.json` 키로 이동했다.
- Prompt PATCH에서 생략된 변수 선언을 기존 값으로 보존하도록 수정했다.
- Prompt 수정·활성화·보관과 History 기록을 각각 단일 Neon HTTP Transaction으로 묶었다.
- Prompt Rollback API와 시험 생성 비교 화면은 아직 구현되지 않았으므로 완료 처리하지 않는다.

### 최종 검증

- 전체 테스트 58개 파일 통과
- Admin/Create Promo 브라우저 통합 테스트 통과
- Create Promo 브라우저 Smoke Test 통과
- Admin Vite Build 통과
- Visual Editor Vite Build 통과
- JavaScript 정적 검사 통과
- `git diff --check` 통과

테스트 실행 환경은 Node.js 24였고 저장소 권장 버전은 Node.js 22이므로 engine 경고만 출력됐다. 기능 및 빌드 실패는 아니다.
