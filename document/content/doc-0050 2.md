# 구형 Promo Wizard 종료 준비 감사

## 결론

구형 Promo Wizard는 현재 삭제하지 않는다. 프로모션 빌더와 공통 서비스 분리는 시작됐지만, 루트 프로토타입 화면의 진입 카드, 전용 HTML/JavaScript/CSS, 별도 저장 상태, 관련 회귀 테스트가 남아 있다. 이 상태에서 파일만 삭제하면 기존 북마크와 일부 검증 경로가 깨진다.

## 현재 잔존 범위

- `/promo-wizard.html` 리디렉션 진입점
- `/prototype/promo-wizard.html`
- `/prototype/promo-wizard.js`
- `/prototype/promo-wizard.css`
- 루트 `index.html`의 Promo Wizard 진입 카드
- `promoPrototype.wizardContent.v1`, `promoPrototype.wizardRun.v1` 저장 상태
- Promo Wizard 전용 계약·레이아웃·이미지 핸들러 테스트

`scripts/legacy-promo-wizard-audit.js`가 위 핵심 진입점과 런타임 파일을 자동 점검한다. 현재 정상 결과는 `retirement_blocked`이며, 이는 오류가 아니라 삭제 선행조건이 충족되지 않았다는 의미다.

## 삭제 승인 전 선행조건

1. 루트 진입 카드를 프로모션 빌더로 교체한다.
2. 기존 Promo Wizard URL의 리디렉션 및 보존 기간을 결정한다.
3. 필요한 생성 이력 또는 브라우저 저장 상태의 이전 정책을 확정한다.
4. Promo Wizard에만 존재하는 생성 기능이 프로모션 빌더에 모두 흡수됐는지 브라우저 검증한다.
5. 전용 테스트를 프로모션 빌더 테스트로 이전한 뒤 별도 삭제 승인을 받는다.

## 이번 단계의 처리

- 구형 파일 삭제 없음
- 공통 템플릿 조회 서비스는 Create Promo와 Promo Wizard가 함께 사용
- 자동 감사 테스트 추가
- 이후 제거 작업이 누락된 진입점 때문에 성급하게 진행되지 않도록 차단 기준 문서화
