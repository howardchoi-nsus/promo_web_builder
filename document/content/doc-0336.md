# 프런트엔드 플랫폼 단일화 기반 개발 Handoff

## 1. 작업 개요

- 작업일: 2026-07-24
- 대상 브랜치: `main`
- 기준 계획:
  - `docs/계획/frontend-platform-unification-and-shared-modules-development-plan-2026-07-24.md`
  - `docs/계획/common-editor-platform-and-layout-engine-development-plan-2026-07-24.md`
- 적용 원칙:
  - 각 단계 구현 후 전체 테스트와 빌드를 통과한 경우에만 다음 단계 진행
  - 관리자·프로모션 빌더·Web Output의 기존 URL과 API 계약 유지
  - DB Schema 및 Neon Migration 변경 없음

## 2. 완료된 작업

### 2.1 P0 — 공통 Geometry·Resize 엔진

- 기준 디자인 폭을 `1280px`로 통일했다.
- 컴포넌트 geometry 정규화와 layout style 변환을 순수 함수로 분리했다.
- 포인터 드래그와 키보드 리사이즈가 같은 계산 엔진을 사용하도록 변경했다.
- 텍스트 박스 크기에 따른 font scaling에서 DOM 측정값 의존을 제거했다.
- 관련 커밋: `248f3f1`

### 2.2 P1 — Editor Core·Command Store·Undo/Redo

- 콘텐츠, Item Style, Section Style, Theme, Layout 변경을 Command로 처리하는 reducer를 추가했다.
- Editor Document와 History Store를 추가했다.
- 공통 미리보기 툴바에 실행 취소·다시 실행 기능을 추가했다.
- 관리자 저장 완료 시 history를 유지하면서 dirty 상태만 정리하도록 구성했다.
- 관련 커밋: `52908fa`

### 2.3 P2 — Host Adapter

- 관리자 템플릿 API 접근을 `admin-template-adapter`로 분리했다.
- Create Promo iframe 통신을 `promo-builder-adapter`로 분리했다.
- Web Output 저장·조회·새 창 열기를 `output-adapter`로 분리했다.
- App 내부의 직접 fetch, postMessage, localStorage 책임을 줄였다.
- 관련 커밋: `c355907`

### 2.4 P3 — 공통 Editor UI

- 편집 기록, Guide, Desktop/Mobile viewport 조작을 `EditorPreviewControls.vue`로 추출했다.
- Admin Layout과 Promo Builder 편집 모드가 동일 UI 컴포넌트를 사용한다.
- 관련 커밋: `2ff4fa8`

### 2.5 P4 — 공유 Snapshot 계약

- Create Promo와 Promo Wizard가 공통으로 사용하는 Snapshot 계약을 추가했다.
- deep clone, snapshot revision 정규화, 이전 revision 차단, editor change 정규화를 공통화했다.
- 관련 커밋: `f99d04a`

### 2.6 P5 — 공통 Editor Bridge

- Create Promo와 Promo Wizard의 iframe 메시지 전송을 공통 Bridge로 분리했다.
- 수신 메시지는 동일 origin뿐 아니라 실제 연결된 iframe의 `event.source`까지 확인한다.
- Snapshot 전송과 자동등록 결과 전송도 동일 Bridge를 사용한다.
- 관련 커밋: `56a0be0`

### 2.7 P6 — 관리자 Vite 진입 기반

- 관리자 페이지의 외부 Vue CDN 의존성을 제거했다.
- Vue compiler를 포함한 Admin Vite 번들을 추가했다.
- 기존 `prototype/app.js`와 `template-layout-manager.js`는 Vite 엔트리에서 순서대로 로드한다.
- `#app[data-shell-frame]`을 Admin App Shell mount 계약으로 검증한다.
- `pnpm run build`가 Admin과 Visual Editor를 함께 빌드한다.
- 관련 커밋: `71fb969`

## 3. 디버깅 및 검증 결과

최종 Source 기준 다음 검증을 통과했다.

- 전체 테스트: 55개 파일 통과
- 관리자 언어·문구 관리 브라우저 테스트 통과
- 관리자 컴포넌트·섹션 구성 브라우저 테스트 통과
- 관리자 Layout 저장 → Create Promo 반영 브라우저 통합 테스트 통과
- Create Promo 브라우저 Smoke Test 통과
- Visual Editor 및 Wizard Layout 동작 테스트 통과
- Admin Vite Build 통과
- Visual Editor Vite Build 통과
- JavaScript 구문 검사 통과
- `git diff --check` 통과

테스트 환경은 Node.js 24였으며 저장소 권장 버전은 Node.js 22라 engine 경고가 출력됐다. 기능·빌드 실패는 아니지만 CI와 운영 빌드는 Node.js 22 사용을 유지한다.

## 4. 디버깅 중 발견·수정한 이슈

### 4.1 기존 정적 테스트의 책임 위치 가정

Host Adapter로 책임을 이동한 뒤 기존 테스트가 URL과 메시지 문자열이 반드시 `App.vue`에 있어야 한다고 가정해 실패했다. 테스트가 실제 새 책임 모듈을 검증하도록 수정했다.

### 4.2 Admin Vite 첫 빌드의 Vue compiler 누락

기본 Vue bundler runtime만 사용했을 때 기존 in-DOM template을 컴파일하지 못해 관리자 앱이 mount되지 않았다. `vue/dist/vue.esm-bundler.js`를 사용해 compiler 포함 빌드로 수정했고 관리자 브라우저 테스트로 확인했다.

### 4.3 iframe source 검증 누락

기존 Create Promo 메시지 중 일부는 origin만 확인하고 iframe source를 확인하지 않았다. 공통 Editor Bridge에서 origin과 source를 함께 검증하도록 통일했다.

## 5. 현재 구조에서 남은 작업

이번 반영은 “플랫폼 단일화 기반”까지 완료한 상태다. 다음 항목은 아직 완료되지 않았다.

1. `visual-editor/src/App.vue`의 Section Rail, Property Panel, AI Multi Layout UI 추가 분리
2. Create Promo 전체 화면의 Vue 컴포넌트 점진 전환
3. `prototype/create-promo.js`의 API·저장소·화면 렌더링 책임 추가 분리
4. 구형 `promo-wizard.html/js` 사용처 확인 후 Create Promo로 통합 또는 제거
5. 관리자 `prototype/app.js`를 기능 단위 Vue SFC로 점진 분리
6. Admin과 Visual Editor가 동일 App Shell Vue 컴포넌트를 직접 사용하는 최종 구조
7. 레거시 전역 객체와 중복 CSS 제거
8. 최종 번들 크기·lazy loading 최적화
9. Neon 운영 DB 중복·미사용 객체 정리

구형 Promo Wizard는 아직 삭제하지 않았다. 사용 경로와 저장 데이터 호환성을 확인하기 전 제거하면 회귀 위험이 있으므로 현재는 공통 Snapshot·Bridge를 사용하도록만 정리했다.

### 5.1 To-Be — Neon 운영 DB 정리

- 상태: 후속 작업으로 보류
- 목적:
  - 중복 데이터와 중복·무효 인덱스 확인
  - 사용되지 않는 View·Table·Column 후보 확인
  - 외래키 고아 데이터와 비정상 상태 데이터 확인
  - 운영 이력·감사 로그의 보존 기간 및 정리 정책 수립
- 현재 확인 사항:
  - 소스 기준 구형 View `wizard_section_component_usage`는 Migration 029에서 삭제 대상으로 정의돼 있다.
  - 소스 기준 구형 Table `wizard_section_components`도 Migration 029에서 삭제 대상으로 정의돼 있다.
  - 실제 운영 DB에 Migration 029의 정리 구문이 반영됐는지는 후속 점검이 필요하다.
  - Vercel Production의 `DATABASE_URL`이 Sensitive 환경변수로 보호돼 있어 이번 작업에서는 CLI를 통한 운영 DB 직접 감사를 수행하지 않았다.
- 진행 조건:
  1. Neon 운영 DB 백업 또는 복구용 Branch 생성
  2. 읽기 전용 SQL로 Schema·Index·Constraint·중복·고아 데이터 감사
  3. 코드와 API에서 참조하지 않는 객체인지 교차 검증
  4. 삭제 대상, 영향 범위, 복구 SQL을 사전 보고
  5. 승인된 대상만 Transaction 단위로 정리
  6. API·관리자 페이지·프로모션 빌더 회귀 테스트 후 결과 기록
- 안전 원칙:
  - 이름이나 데이터 건수만으로 미사용 객체를 판단하지 않는다.
  - AI 실행 이력, 감사 로그, 활성 템플릿과 연결된 데이터는 보존 정책 확정 전 삭제하지 않는다.
  - 운영 DB에서 즉시 `DROP` 또는 대량 `DELETE`하지 않고 백업·검증·승인 절차를 선행한다.

## 6. 데이터 및 배포 주의사항

- DB Migration 없음
- Neon 작업 없음
- API Request/Response Schema 변경 없음
- localStorage key 변경 없음
- 기존 URL 변경 없음
- 배포 전에 `pnpm run build` 실행 필요
- 생성 산출물:
  - `prototype/admin-assets/admin-app.js`
  - `prototype/visual-editor-assets/visual-editor.js`
  - Visual Editor 관련 CSS asset

## 7. 롤백 기준

단계별 커밋이 분리되어 있어 역순으로 되돌릴 수 있다.

1. Admin Vite 진입 문제: `71fb969`
2. 공통 Editor Bridge 문제: `56a0be0`
3. 공유 Snapshot 문제: `f99d04a`
4. 공통 Preview Controls 문제: `2ff4fa8`
5. Host Adapter 문제: `c355907`
6. Editor Command/History 문제: `52908fa`
7. Geometry/Resize 문제: `248f3f1`

운영 롤백 시 데이터 롤백이나 DB Migration rollback은 필요하지 않다.

## 8. 2026-07-24 후속 P0~P2 반영 현황

### 8.1 공통 Editor UI

- `visual-editor/src/platform/editor-ui/`에 Section, Preview, Property, AI Layout 패널을 분리했다.
- `App.vue`는 편집 상태와 명령 조합을 유지하고 패널 마크업 책임을 SFC로 넘겼다.
- Admin Layout과 Promo Builder는 기존 Editor Core, Adapter, Snapshot 계약을 공유하므로 동작 경로는 변경하지 않았다.
- Web Output 모드에서 `PromoPageRenderer` import가 빠진 문제를 검증 중 발견해 복구했다.

### 8.2 Create Promo와 관리자 점진 전환

- Create Promo의 5단계 전환 규칙을 `prototype/wizard/wizard-flow.js`로 분리했다.
- 공개 템플릿 목록·상세 조회와 활성 템플릿 선택을 `prototype/wizard/wizard-template-service.js`로 통합했다.
- Create Promo와 구형 Promo Wizard가 위 템플릿 서비스를 함께 사용한다.
- 관리자 Template Layout Manager를 `admin-app/src/components/TemplateLayoutManager.vue`와 `admin-app/src/services/template-layout-service.mjs`로 분리했다.
- Admin Vite에 Vue SFC compiler 플러그인을 추가했다.
- 나머지 Create Promo DOM 렌더링과 관리자 Component·Section·Prompt·Locale 기능 SFC 전환은 후속 작업이다.

### 8.3 Prompt Governance

- 저장 및 활성화 시 Prompt Type별 허용 변수 계약을 검증한다.
- 다음 오류는 LLM 호출 전에 차단한다.
  - 허용되지 않은 변수 또는 Placeholder
  - 선언되지 않은 Placeholder
  - 필수 변수 선언 또는 필수 Placeholder 누락
  - Required와 Optional 중복 선언
  - 잘못된 Background Fade 값
  - 6자리 HEX가 아닌 Section Background Color
  - `W:H` 형식이 아닌 Aspect Ratio
- 기존 Prompt Version, Status, History 테이블을 그대로 사용하며 DB Migration은 없다.
- 별도 수정 중인 `docs/계획/section-image-prompt-governance-draft-2026-07-24.md`는 이번 변경에서 건드리지 않았다.

### 8.4 구형 Promo Wizard

- 현재 삭제하지 않았다.
- `scripts/legacy-promo-wizard-audit.js` 결과는 정상적으로 `retirement_blocked`다.
- 차단 이유는 루트 진입 카드, 전용 HTML·JavaScript·CSS, 별도 브라우저 저장 상태와 전용 회귀 테스트가 남아 있기 때문이다.
- 삭제 전환 기준은 `docs/계획/legacy-promo-wizard-retirement-audit-2026-07-24.md`에 기록했다.

### 8.5 최종 검증과 알려진 사항

- 전체 테스트 58개 파일 통과
- Admin/Create Promo 브라우저 통합 테스트 통과
- Create Promo 브라우저 Smoke Test 통과
- Admin 및 Visual Editor Production Build 통과
- JavaScript 정적 검사와 `git diff --check` 통과
- Node.js 24에서 실행해 저장소 권장 Node.js 22 engine 경고가 출력되지만 실패는 아니다.
- Neon Migration과 운영 DB 변경은 없다.
- API URL, localStorage Key, iframe Message Type은 변경하지 않았다.
