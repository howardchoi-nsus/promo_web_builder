# 랜딩 페이지 및 서비스 폴더 분리 개발계획서

- 작성일: 2026-07-15
- 상태: 개발 전 계획
- 참조 문서: `docs/claude/review-landing-and-folder-restructure-2026-07-15.md`
- 대상: Root Landing, Promo Wizard, Promo Builder, Admin, Generated Output

## 1. 목표

현재 `prototype/` 아래 혼재된 Wizard, Builder, Admin, Generated 화면을 서비스 역할별 URL과 폴더로 분리한다.

- `/`: 서비스 진입 랜딩
- `/wizard`: 프로모션 생성 Wizard
- `/builder`: 기존 Promo Builder
- `/builder/generated`: 생성 결과 화면
- `/admin`: 관리자 기능

이번 작업은 화면 진입 구조를 정리하고 기존 기능을 유지하는 것이 우선이다. Builder와 Admin의 내부 코드 완전 분리는 2차 작업으로 진행하며, URL 분리 자체를 관리자 보안으로 간주하지 않는다.

## 2. 선행 조건

1. 현재 진행 중인 Wizard 변경사항을 기능 테스트한다.
2. 테스트가 통과한 기준 상태를 별도 커밋으로 고정한다.
3. 폴더 구조 변경은 별도 브랜치 또는 별도 커밋 묶음으로 진행한다.
4. 배포 환경의 관리자 인증 방식과 적용 범위를 확정한다.

현재 미커밋 작업과 구조 개편을 한 커밋에 섞지 않는다. 문제 발생 시 기능 변경과 경로 변경을 독립적으로 롤백할 수 있어야 한다.

## 3. 목표 구조

```text
/index.html
/wizard/
  index.html
  wizard.js
  wizard.css
  assets/concept-thumbnails/
/builder/
  index.html
  builder.js
  generated.html
  generated.js
/admin/
  index.html
  admin.js
/shared/
  styles.css
  common.js
/api/
/scripts/
/docs/
```

Phase 1에서는 Builder와 Admin이 기존 로직 일부를 공유할 수 있다. 다만 각 페이지는 Vue 마운트 전에 자신의 진입 모드를 확정하고, 다른 서비스의 메뉴와 화면을 노출하지 않아야 한다.

## 4. 핵심 설계 원칙

### 4.1 진입 모드

각 HTML에 `data-entry-view` 또는 동일 역할의 명시적인 설정을 둔다.

```html
<body data-entry-view="builder">
```

- `/builder`는 Builder만 초기화한다.
- `/admin`은 Admin만 초기화한다.
- 마운트 이후 `currentView`를 변경하는 방식은 사용하지 않는다.
- 초기 화면 깜빡임과 다른 서비스 UI의 일시 노출을 방지한다.

### 4.2 경로

- 내부 페이지 링크는 `/wizard`, `/builder`, `/admin`, `/builder/generated` 절대 경로를 사용한다.
- API는 기존 `/api/*` 절대 경로를 유지한다.
- Wizard 썸네일과 정적 자산은 이동 후 실제 위치에 맞춰 갱신한다.
- 쿼리 파라미터를 사용하는 진입 흐름은 리다이렉트 이후에도 유지되는지 테스트한다.

### 4.3 관리자 보호

- `/admin` URL 분리는 접근 제어가 아니다.
- 관리자 화면 인증과 관리자 API 권한 검증을 함께 적용한다.
- 배포 전체 보호 기능만으로 `/admin` 경로 보호를 대체하지 않는다.
- 인증 도입 전까지 Admin 링크를 숨기는 것은 임시 UX 조치로만 취급한다.

### 4.4 하위 호환

- 기존 URL은 초기 안정화 기간에 임시 리다이렉트로 유지한다.
- Preview 배포 검증 후 영구 리다이렉트 전환 여부를 결정한다.
- `localStorage`는 동일 origin을 사용하므로 기존 키와 데이터 구조를 유지한다.

## 5. 단계별 개발 계획

### Phase 0. 기준 상태 고정

- 현재 Wizard 및 관리자 변경사항 테스트
- `git status`와 변경 파일 확인
- 기준 커밋 생성
- 핵심 화면/API 테스트 결과 기록

완료 기준:

- 구조 개편 전 기능 테스트가 통과한다.
- 구조 개편 변경분만 별도로 비교할 수 있다.

### Phase 1. 랜딩 및 URL 분리

#### Task 1. 루트 랜딩

- 기존 Root JavaScript redirect 제거
- Wizard를 주 진입 버튼으로 구성
- Builder와 Admin을 내부 도구 영역으로 구분
- 모바일과 데스크톱 레이아웃 검증

#### Task 2. Wizard 이동

- `promo-wizard.html/js/css`를 `/wizard`로 이동
- 컨셉 썸네일 자산 이동
- 헤더, Builder, Generated 링크 갱신
- 직접 접속과 새로고침 검증

#### Task 3. Builder와 Generated 이동

- Builder 진입점을 `/builder`에 구성
- Generated 화면을 `/builder/generated`에 구성
- Builder 전용 진입 모드 적용
- Admin 전환 UI와 Admin 전용 요소 제거

#### Task 4. Admin 진입점 구성

- Admin 진입점을 `/admin`에 구성
- Admin 전용 진입 모드 적용
- Builder 화면과 Wizard 사용자 기능 미노출
- handoff picker 등 관리자 전용 기능은 Admin에만 유지

#### Task 5. 공통 자산 정리

- Phase 1에서 실제 공유되는 CSS와 JavaScript만 `/shared`로 이동
- 단순 중복 제거를 위한 과도한 리팩터링은 제외
- 캐시 버전 문자열과 로드 경로 갱신

### Phase 1.5. 리다이렉트 및 테스트 보완

- `vercel.json`에 이전 URL 임시 리다이렉트 추가
- Root redirect stub 제거
- `prototype` 경로를 직접 읽는 테스트 스크립트 갱신
- 문서에 기록된 주요 경로 매핑 갱신
- Preview 배포에서 리다이렉트와 정적 자산 검증

대상 테스트:

- `test-wizard-content-sections-contract.js`
- `test-wizard-form-templates-contract.js`
- `test-wizard-public-form-template-contract.js`
- 그 밖의 `prototype/` 직접 참조 검색 결과

### Phase 2. Builder/Admin 코드 분리

- 기존 `app.js`에서 Builder와 Admin 상태 및 메서드 분리
- `builder.js`, `admin.js`, `shared/common.js`로 책임 분리
- 각 페이지가 사용하지 않는 DOM과 로직을 로드하지 않도록 정리
- 비활성 레거시 마크업과 사용하지 않는 전환 로직 제거
- 공통 API 호출 및 상태 메시지 유틸리티만 공유

완료 기준:

- Builder 실행에 Admin 상태와 관리 기능이 필요하지 않다.
- Admin 실행에 Builder 화면 DOM이 포함되지 않는다.
- 두 페이지의 기능 테스트가 독립적으로 통과한다.

### Phase 3. Admin 인증 및 권한 검증

- 인증 방식 결정
- `/admin` 접근 시 인증 확인
- 관리자 API에서 서버 측 권한 검증
- 미인증, 세션 만료, 권한 부족 상태 처리
- 직접 API 호출과 URL 직접 접근 차단 테스트

인증 공급자 도입, 사용자 테이블 및 역할 모델 추가 여부에 따라 Phase 3 일정은 별도 확정한다.

## 6. 테스트 계획

### 6.1 경로 테스트

- `/`
- `/wizard`
- `/builder`
- `/admin`
- `/builder/generated`
- 기존 `/prototype/index.html`
- 기존 `/prototype/promo-wizard.html`
- 기존 `/prototype/generated.html`
- 기존 `/promo-wizard.html`
- 기존 `/generated.html`

각 경로에서 직접 접속, 새로고침, 뒤로 가기 및 내부 링크를 검증한다.

### 6.2 데이터 및 기능 회귀

- Wizard 기존 입력 복원
- 템플릿 선택 및 동적 콘텐츠 입력
- Integrated Brief와 LO-FI 실행
- Builder 기존 기능
- Generated 페이지 데이터 표시
- Admin 탭 및 CRUD
- `localStorage` 기존 키 호환
- API 요청 URL과 payload 변화 없음

### 6.3 배포 검증

- 모든 HTML, CSS, JS, 이미지 요청이 200 응답인지 확인
- 리다이렉트 상태와 최종 목적지 확인
- 쿼리 파라미터 유지 확인
- 브라우저 콘솔 오류 확인
- 데스크톱과 모바일 화면 확인
- Admin 미인증 접근과 관리자 API 호출 확인

## 7. 롤백 전략

- Phase 0 기준 커밋을 구조 개편 전 복귀점으로 사용한다.
- 초기 리다이렉트는 임시 설정으로 적용한다.
- Preview 검증 전 기존 `prototype` 파일을 즉시 삭제하지 않는다.
- 새 경로 안정화 후 별도 커밋에서 레거시 파일을 제거한다.
- 인증 문제 발생 시 관리자 기능을 공개 상태로 되돌리지 않고 접근을 차단한다.

## 8. 예상 일정

1명의 개발자가 현재 코드 구조를 기준으로 작업하는 예상치다.

| 범위 | 예상 시간 |
| --- | ---: |
| Phase 0 기준 상태 테스트 및 커밋 | 2~4시간 |
| Phase 1 랜딩 및 페이지/자산 이동 | 8~12시간 |
| Phase 1.5 리다이렉트·테스트·Preview 디버깅 | 5~8시간 |
| Phase 2 Builder/Admin 코드 완전 분리 | 12~20시간 |
| Phase 3 기존 인증 체계 연동 | 8~16시간 |
| Phase 3 신규 인증 체계 설계·도입 | 16~32시간 |

### 일정 요약

- **URL 분리와 랜딩까지:** 약 2~3 개발일
- **Builder/Admin 코드 분리까지:** 누적 약 4~6 개발일
- **기존 인증 체계 연동까지:** 누적 약 5~8 개발일
- **신규 인증 체계까지 포함:** 누적 약 7~10 개발일

예상 시간에는 개발, 로컬 테스트, Preview 배포 검증과 1차 디버깅을 포함한다. DB 마이그레이션, 인증 공급자 계약, 대규모 UI 변경 또는 기존 기능 결함 수정은 별도 일정으로 산정한다.

## 9. 권장 실행 범위

우선 Phase 0부터 Phase 1.5까지만 한 작업 단위로 진행한다. 이 범위에서 사용자 URL과 폴더 구조를 안정화한 후, Phase 2 코드 분리와 Phase 3 인증을 별도 변경으로 진행한다.

Phase 1 완료를 단순 파일 이동으로 판단하지 않는다. 새 URL 직접 접속, 기존 URL 호환, Wizard 생성 흐름, Admin CRUD 및 관련 계약 테스트가 모두 통과해야 완료로 처리한다.
