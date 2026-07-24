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

구형 Promo Wizard는 아직 삭제하지 않았다. 사용 경로와 저장 데이터 호환성을 확인하기 전 제거하면 회귀 위험이 있으므로 현재는 공통 Snapshot·Bridge를 사용하도록만 정리했다.

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
