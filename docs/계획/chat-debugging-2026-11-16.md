# 채팅 디버깅 결과

작성일: 2026-11-16 (Asia/Seoul)

## 재현과 수정

1. 개별 대화 조회에서 테스트 fixture가 세션 상세 대신 대화 목록을 반환했다. HTTP 200이므로 성공으로 처리한 뒤 `resolved.session.id`에서 TypeError가 발생했다. 목록 조회와 상세 조회 fixture를 분리했다.
2. 서비스 클라이언트에 workspace 응답 검증을 추가했다. 누락되거나 비어 있는 session ID, 목록 응답 등은 `CHAT_WORKSPACE_RESPONSE_INVALID`로 처리한다. 기존 입력을 보존하고 재시도 가능한 오류로 안내한다. 정상 데이터를 임의 대체하거나 다른 세션을 생성하지 않는다.
3. 실제 브라우저와 서버의 overview fingerprint 계산이 불일치했다. 서버는 `_review.missingCriticalInputs`를 정규화에 포함하지만 브라우저는 제외했다. 브라우저 정규화를 서버와 맞추고, 확인 메타데이터 없음·빈 배열·허용/비허용 필드 혼합에 대한 양쪽 fingerprint 일치 검사를 추가했다.
4. 구형 테스트가 과거 CTA의 존재만 기다려 새 분석 응답 전에 검증을 시작했다. 자연어 후속 요청의 실제 분석 응답을 기다리도록 수정했다.
5. 삭제된 별도 요약/와이어프레임 편집 폼을 기대하던 시나리오를 단일 채팅 입력과 읽기 전용 미리보기 검증으로 변경했다. 상단 서술형 요약도 검사한다.
6. 구형 최종 디자인 fixture에는 등록 토큰·그리드가 없고 자유 좌표·96px 폰트만 있었다. 이 fixture에서 임의 CSS 최종 출력을 기대하던 검사는 현재 정책에 위배된다. 구성 승인·미디어 준비 후 `PREVIEW_QUALITY_BLOCKED`로 중단하고 품질 통과를 저장하지 않는 음성 사례로 변경했다. 등록 토큰 기반 정상 최종 출력 검사는 기존 PageSchema/Hallmark/디자인 미리보기 브라우저 검사를 유지한다.

## 검증

- Visual editor 빌드 통과.
- 잘못된 workspace 응답 계약 검사 통과.
- 브라우저/서버 overview fingerprint 일치 검사 통과.
- 기존 실패 `test-ai-builder-browser.mjs` 재실행 통과: provider 재시도, 상세 조회, 자연어 수정, canonical fingerprint, 구성 승인, 등록 토큰 없는 출력 차단.
- Hallmark 및 PageSchema 핵심 여정 브라우저 회귀 각각 통과.
- 최종 전체 `qa:design-preview` 36개 계약·브라우저·PGlite 검사 통과. 기존 실패 테스트 및 신규 응답·fingerprint 회귀를 필수 목록에 포함했다.

실제 LLM·Neon·Blob·Vercel Preview 통합 및 Production 배포는 이번 디버깅에서 수행하지 않았다. 이 수정으로 운영 토큰 설정이나 실제 이미지 생성 문제가 해결됐다고 주장하지 않는다.
