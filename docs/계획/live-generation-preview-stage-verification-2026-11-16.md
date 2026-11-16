# 실시간 생성 미리보기 단계별 검증 기록

작성일: 2026-11-16 (Asia/Seoul)  
검증 대상 구현: `d5f6ccc`  
진행 규칙: 각 단계 검증이 통과한 뒤 다음 단계로 진행. 미검증 항목을 통과로 취급하지 않는다.

| 단계 | 수행한 검증 | 결과 |
| --- | --- | --- |
| 1. 기존 렌더링·미디어 완료 흐름 | `test-design-preview-enhancements.mjs`: 등록 스타일·아이콘·미디어 저장/재시도·이전 응답 방어·순차 실행 | 통과 |
| 2. 영역별 표시 상태 | `test-live-generation-preview.mjs`: 승인 전 미표시, 실제 진행/실패 대상, 바인딩 후 로딩, 안전 URL·입력 불변성 | 통과 |
| 3. 로딩·Reveal 표시 계층 | `test-live-generation-preview-browser.mjs`: load/decode 이후 표시, 영역 비율 유지, 1회 Reveal, reduced motion, 검사 중 효과 제거, 완료 영역 보존·문서 전환·지연 로딩·재마운트·해제 | 통과 |
| 4. 로딩·재개·재시도 연결 | `test-design-preview-enhancements-browser.mjs`: 구성 승인→공급자 실패→영역 실패 표시→새로고침→채팅 재시도→생성 표시→완료 에셋→세 화면 검사 | 통과 |
| 5. 채팅·검사·출력 연결 | `test-page-schema-builder-browser.mjs`, `test-nuxt-runtime-contract.mjs`, `test-output-isolation-ssr.mjs`, `check-hallmark-postgres.mjs`: 자연어 수정·승인·자동 검사, 출력 DOM/SSR 격리, PGlite 실제 SQL 저장·재조회·원자적 변경·재시도 | 통과 |
| 6. 실제 Preview 통합검증·Production 배포 | 환경 연결 상태·실제 서비스 네트워크·원격 브랜치 확인 | 준비 상태 차단. 실제 통합검증·Production 배포 미수행 |

## 6단계 차단 근거

- Cloud 상태 재조회: 현재 관측값이며 네트워크 정책이 enforced, 제한 모드다. 구성된 secrets·runtime variables·outbound identities는 모두 없다. Vercel/Neon/LLM 관련 목적지는 적용 allowlist에서 확인되지 않는다.
- 실제 서비스 HEAD 연결은 Cloud proxy의 CONNECT 403으로 실패했다. 사이트 애플리케이션이 반환한 오류나 서비스 장애라고 단정하지 않는다.
- 현재 사용할 실제 Preview URL, 테스트 DB·LLM·Blob 연결 및 Vercel 배포 상태 조회 권한을 확인할 수 없다. 프롬프트 활성 상태와 운영 DB 준비도 원격에서 확인하지 못했다.
- 원격 구현 브랜치에는 `d5f6ccc`, main에는 `5daffab`이 확인된다. 이번 기능을 main으로 승격하거나 배포 완료로 보고하지 않았다.

## 재개 조건과 다음 순서

1. 실제 Preview URL과 필요한 목적지에 대한 Cloud 네트워크 접근을 제공한다.
2. 테스트 DB·LLM·Blob 연결을 해당 환경 또는 접근 가능한 Preview 서비스에 설정한다. 비밀 값은 채팅이 아니라 환경 비밀 설정에 등록한다.
3. Preview에서 실제 생성→미디어 완료→부분 실패/재시도→저장·재조회→자동 검사→출력 여정을 확인하고 사용 버전을 기록한다.
4. 통과 후 main 반영 및 Vercel Production 배포를 진행하고 실제 배포 커밋·상태를 확인한다.

기존 전체 로컬 회귀 39개 통과 결과와 이번 단계별 재검증 결과를 실제 LLM·Neon·Blob 통합 결과로 대체하지 않는다. 이번 사용자 요청은 ‘이상 없으면 다음 단계’이므로 6단계 차단을 임의로 생략하지 않는다. 과거 커밋에 대한 배포 예외는 이번 구현에 적용하지 않는다.
