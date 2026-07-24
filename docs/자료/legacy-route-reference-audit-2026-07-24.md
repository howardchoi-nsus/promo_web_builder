# 구형 화면 및 경로 참조 감사 — 2026-07-24

## 결론

Promo Wizard, Generated UI, Visual Editor를 현재 시점에 파일 단위로 삭제하면 회귀가 발생한다. 기본 내비게이션에서는 이미 숨겨져 있지만 일부 경로는 호환 또는 내부 기능으로 계속 사용 중이다. 따라서 이번 P2에서는 참조 감사와 분류까지만 완료하고, 삭제는 신규 경로 전환과 redirect 계약이 별도로 확정된 이후로 보류한다.

## 런타임 참조

| 경로 | 현재 참조 | 판단 |
|---|---|---|
| `prototype/promo-wizard.html` | 독립 Wizard 스크립트와 호환 테스트 | 기본 메뉴에서는 숨김. 외부 북마크와 구형 실행 호환을 위해 유지 |
| `prototype/visual-editor.html` | Create Promo Step 4 iframe, 관리자 기본 레이아웃 편집기 | 독립 메뉴는 숨겼지만 내부 편집 엔진으로 필수 |
| `prototype/generated.html` | 디자인 생성기 결과 열기 기능 | 기능 통합 전까지 유지 |
| `prototype/visual-output.html` | Create Promo Step 5 Web Output | 현행 출력 화면이므로 유지 |

## 주요 직접 참조

- `prototype/create-promo.js`
  - Create Promo의 템플릿 레이아웃 편집 iframe으로 Visual Editor 사용
- `prototype/admin/template-layout-manager.js`
  - 관리자 기본 레이아웃 편집기로 Visual Editor 사용
- `prototype/app.js`
  - 생성 결과 확인 시 Generated UI 사용
- `prototype/promo-wizard.js`
  - 구형 Wizard 내부 편집기로 Visual Editor 사용
- `scripts/test-*`
  - 구형 경로의 redirect, CSS, 호환 계약을 검증

## 제거 전 완료 조건

1. Promo Wizard 외부 접근량과 북마크 사용 여부 확인
2. `generated.html` 기능을 디자인 생성기 또는 Web Output으로 완전히 이전
3. Visual Editor를 독립 화면이 아닌 내부 엔진 경로로 명확히 재명명
4. 구경로에서 신경로로의 308 redirect 정책 확정
5. 런타임 코드 직접 참조 0건
6. 구경로 호환 테스트를 redirect 테스트로 교체
7. 운영 배포 후 1회 이상 회귀 관찰 기간 확보

## 이번 작업에서 삭제하지 않은 이유

Visual Editor는 이름과 달리 현재 Create Promo와 관리자 레이아웃 편집기의 실제 렌더링 엔진이다. Generated UI도 디자인 생성기의 결과 열기 동작에서 사용 중이다. 파일을 바로 삭제하면 사용자 경로가 끊기므로, 메뉴 비노출과 파일 제거를 구분해 관리한다.
