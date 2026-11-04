# AI Builder 대화형 워크스페이스 및 Wireframe 승인 흐름 개발계획서

## 0. 문서 정보

- 작성일: 2026-11-04
- 대상 프로젝트: Promo Web Builder
- 대상 화면: `/prototype/create-promo?mode=ai`
- 문서 상태: Phase 0~1 핵심 Vertical Slice 구현 완료 / Preview 전환 대기
- 기준 구현:
  - `prototype/create-promo.html`
  - `prototype/builder-bootstrap.js`
  - `visual-editor/src/builder/AiBuilderApp.vue`
  - `visual-editor/src/builder/state/ai-builder-store.mjs`
  - `visual-editor/src/builder/services/composition-client.mjs`
  - `visual-editor/src/PromoPageRenderer.vue`
- 관련 계약:
  - Builder Document 및 revision
  - Composition Contract v3
  - 자연어 Composition Operation
  - 비동기 이미지 Asset Job

### 0.1 2026-11-04 구현 현황

완료:

- Migration `077_ai_builder_chat_workspace.sql` 작성
- Builder Document 소유권에 연결된 서버 Chat Session 저장·복원
- 메시지와 서버 발급 CTA Action 저장
- 요구사항 revision 및 서버 계산 fingerprint 저장
- V3 `compositionSpec`과 최종 Compile Snapshot을 동일 구조로 정규화하는 Wireframe fingerprint 계약
- Wireframe revision 저장, 승인, 중복 실행 방지와 재시도 처리
- 최종 Composition 적용 전 승인 증명 및 Compile 후 구조 fingerprint 재검증
- Proposal `preview.sections` 기반 B/W Wireframe 표시
- Chat Workspace API client와 Vue 화면 연결
- 기능 플래그 `PROMO_BUILDER_CHAT_WORKSPACE_V1_ENABLED` 추가
- 계약·Handler·Compiler·브라우저 및 전체 회귀 테스트 갱신

배포 전 남은 작업:

1. Preview Neon DB에 Migration 077 적용
2. Preview 환경에서 `PROMO_BUILDER_CHAT_WORKSPACE_V1_ENABLED=true` 설정
3. Preview 실데이터로 재접속 복원, CTA 재시도, Wireframe 승인과 최종 적용 확인
4. Production Migration 적용 후 단계적 기능 플래그 전환

후속 Phase 범위:

- 전용 OCR 결과와 좌표 근거 저장
- URL 수집·SSRF 방어 계층
- 메시지 cursor pagination
- 장기 실행 operation의 polling/SSE 상태 복원

## 1. 목적과 결론

현재 AI Builder는 자연어 설명을 분석한 뒤 정형 Overview를 확인하고, Composition과 이미지 생성을 연속 실행해 결과 Preview로 전환한다. 이 구조는 빠른 자동 생성에는 적합하지만 사용자가 요구사항과 페이지 구조를 단계별로 확인하고 승인하기 어렵다.

이번 개발의 목적은 AI Builder를 다음 세 단계가 명확히 분리된 대화형 생성 워크스페이스로 전환하는 것이다.

1. 채팅을 통한 요구사항 수집과 확정
2. 디자인이 배제된 B/W Wireframe 생성과 승인
3. 승인된 Wireframe 구조를 고정한 최종 디자인 생성

핵심 결론은 다음과 같다.

> 왼쪽 채팅은 모든 입력과 승인의 단일 제어면으로 사용하고, 오른쪽은 진행 상태·요구사항 Tree·Wireframe·최종 디자인을 보여주는 결과면으로 사용한다. 최종 디자인은 승인된 Wireframe 구조를 변경하지 않으며 색상, 타이포그래피, 이미지와 시각 스타일만 적용한다.

## 2. 확정 요구사항

### 2.1 화면 구조

1. AI 모드에서 기존 SNB를 제거한다.
2. 화면을 왼쪽 채팅 영역과 오른쪽 결과 영역으로 나눈다.
3. 중앙 구분선을 마우스 또는 포인터로 좌우 드래그해 영역 너비를 조절할 수 있게 한다.
4. 왼쪽은 자연어 입력, 대화 이력, LLM 답변과 CTA를 표시한다.
5. 오른쪽은 현재 단계, 진행 상태, 요구사항 Tree, B/W Wireframe과 최종 디자인을 표시한다.
6. 기존 단계별 Wizard UI와 Visual Editor는 이 생성 흐름의 기본 편집기로 사용하지 않는다.

### 2.2 상호작용 원칙

1. 요구사항과 Wireframe 수정은 Tree 직접 편집이 아니라 채팅 요청을 우선한다.
2. Tree는 현재 확정 상태를 읽고 검토하기 위한 조회 전용 표현으로 사용한다.
3. 다음 단계 진행은 사용자가 `다음`을 직접 입력하는 방식보다 LLM 답변에 표시되는 CTA 버튼을 기본으로 한다.
4. CTA 클릭은 사용자 승인 이벤트이자 채팅 이력으로 저장한다.
5. 생성 처리 중에는 자연어 입력과 CTA를 모두 비활성화한다.
6. 처리 중인 단계와 `대기`, `진행 중`, `완료`, `실패` 상태를 왼쪽 채팅 타임라인과 오른쪽 진행 상태에 동시에 표시한다.
7. 브라우저를 닫고 다시 열어도 채팅과 작업 상태를 복원한다.
8. 사용자는 채팅 입력 시 프로모션 화면 이미지를 붙여넣거나 파일로 첨부할 수 있고, 시스템은 OCR과 화면 구조 분석 결과를 요구사항 후보로 활용한다.
9. 참고자료 입력 우선순위는 `이미지 붙여넣기 → 이미지와 URL 병행 → URL 단독`으로 한다.
10. 이미지 또는 URL에서 추출한 금액·기간·법적 조건은 사용자가 승인하기 전까지 확정값으로 사용하지 않는다.

### 2.3 결과 보존과 구조 고정

1. 이전 단계로 돌아가도 기존 Wireframe과 최종 디자인을 삭제하지 않는다.
2. 이전 단계에서 요구사항을 변경하면 기존 결과를 보존하되 `재생성 필요` 상태로 표시한다.
3. Wireframe 승인 시 구조 revision을 고정한다.
4. 최종 디자인 생성에서는 Wireframe의 섹션, 컴포넌트, 순서와 콘텐츠 계층을 변경할 수 없다.
5. 구조 변경 요청은 Wireframe 단계로 되돌려 새 Wireframe revision으로 처리한다.

## 3. 범위와 비범위

### 3.1 개발 범위

- AI 모드 전용 SNB 없는 전체 화면 Shell
- 좌우 분할 및 크기 조절 가능한 Split Pane
- 대화형 메시지 목록과 입력 Composer
- 클립보드 이미지 붙여넣기, 드래그 앤 드롭과 파일 첨부
- 다중 이미지의 순서·viewport·중복 영역 관리
- OCR, 화면 구조, 콘텐츠 계층과 디자인 참고 정보 분석
- 채팅 Composer의 참고 URL 첨부와 분석
- 외부 프로모션 페이지의 안전한 수집·본문 추출·출처 보존
- LLM 답변 기반 CTA 렌더링
- 요구사항 질의·보완·확정 흐름
- 조회 전용 요구사항 Tree
- B/W HTML Wireframe 생성 및 Preview
- Wireframe 수정 요청과 revision 관리
- Wireframe 승인 및 구조 잠금
- 최종 디자인 생성 및 상태 표시
- 채팅·단계·결과·승인 이력 서버 저장과 복원
- 생성 중 입력 잠금, 실패, 재시도, 취소 불가 상태 안내
- 모바일·태블릿 대응
- 접근성, 계약, 브라우저 및 회귀 테스트

### 3.2 이번 개발의 비범위

- Tree 노드의 인라인 직접 편집
- Wireframe 단계의 디자인 토큰 적용
- Wireframe 단계의 실제 이미지 생성
- 최종 디자인 단계에서 섹션 추가·삭제·순서 변경
- AI가 생성한 자유 JavaScript 실행
- 외부 페이지의 JavaScript, 추적 코드, 쿠키 또는 로그인 세션 실행·공유
- 로그인·유료 구독·CAPTCHA 등 접근 제한 우회
- 외부 페이지의 문구·이미지·HTML을 검증 없이 그대로 복제
- 첨부 이미지에서 원본 Key visual, 로고, 캐릭터 또는 브랜드 자산을 자동 추출해 최종 결과에 재사용
- 첨부 이미지에 없는 약관·날짜·금액·참가 조건을 LLM이 추측해 확정
- AI가 출력한 임의 HTML을 검증 없이 저장하거나 실행하는 기능
- 기존 Template Mode와 Wireframe Mode의 전면 개편
- 최종 디자인 생성 중 동시 채팅 입력
- 실시간 다중 사용자 공동 편집

## 4. 목표 사용자 흐름

```text
AI Builder 진입
  → 저장된 세션 확인
  ├─ 진행 중 세션 있음 → 최신 서버 상태 복원
  └─ 신규 세션 → 시작 안내 메시지 출력

요구사항 수집
  → 사용자 자연어 입력
  → 프로모션 화면 이미지 붙여넣기 또는 파일 첨부
  → 필요하면 원문 URL 병행 첨부
  → 이미지 OCR·화면 구조 분석
  → URL이 있으면 원문·조건 보완 분석
  → 이미지와 URL의 분석 결과 비교
  → LLM 분석
  → 누락 정보 질문 + 선택 CTA
  → 사용자 답변 또는 CTA 선택
  → 오른쪽 요구사항 Tree 갱신
  → LLM이 [요구사항 확정] CTA 출력

요구사항 승인
  → 요구사항 revision 고정
  → [Wireframe 생성] 실행
  → B/W Wireframe 생성
  → 오른쪽 HTML Preview 출력

Wireframe 검토
  ├─ 수정 필요 → 채팅으로 수정 요청 → 신규 Wireframe revision
  └─ 이상 없음 → LLM이 [Wireframe 승인] CTA 출력

Wireframe 승인
  → 구조 fingerprint 및 revision 잠금
  → [최종 디자인 생성] CTA 출력

최종 디자인 생성
  → 승인 Wireframe 구조를 그대로 사용
  → 디자인 톤앤매너·색상·타이포그래피 적용
  → Key visual·카드 이미지 Asset Job 실행
  → 최종 Preview 출력
```

## 5. 화면 및 UX 설계

### 5.1 AI 모드 전용 Shell

`mode=ai`일 때 기존 `.shell-sidebar`를 렌더링하지 않는다. 숨김 CSS만 적용하는 방식보다 AI 모드 전용 Shell 분기를 두어 키보드 포커스와 접근성 Tree에서도 SNB가 제외되도록 한다.

상단에는 최소한의 작업 정보만 유지한다.

- 프로젝트 또는 생성 세션명
- 현재 단계
- 저장 상태
- 오류 또는 연결 상태
- 홈 또는 생성 종료 동선

Template Mode와 기존 Wireframe Mode는 현재 App Shell을 유지한다.

### 5.2 좌우 Split Pane

Desktop 기본 비율은 왼쪽 38%, 오른쪽 62%로 시작한다.

| 항목 | 정책 |
|---|---|
| 왼쪽 최소 너비 | 320px |
| 오른쪽 최소 너비 | 600px |
| 구분선 | 포인터 드래그 및 키보드 조절 지원 |
| 키보드 | 좌우 화살표 16px, Shift 조합 64px 단위 |
| 저장 | 세션 또는 사용자 단위로 마지막 비율 저장 |
| 드래그 중 | 텍스트 선택 방지, 포인터 캡처 적용 |
| 작은 화면 | 좌우 분할 대신 `채팅 / 결과` 탭 전환 |

구분선에는 `role="separator"`, 현재 값과 최소·최대 값을 제공한다.

### 5.3 왼쪽 채팅 영역

채팅 영역은 다음으로 구성한다.

1. 대화 Header
2. 스크롤 가능한 메시지 목록
3. LLM 처리 중 상태 메시지
4. LLM 메시지 하단 CTA 그룹
5. 하단 고정 입력 Composer

왼쪽 채팅에는 사용자·LLM 대화뿐 아니라 각 작업의 진행 상태를 타임라인 항목으로 출력한다. 상태 항목은 임시 로딩 문구로만 표시하지 않고 작업 ID와 연결해 동일 항목이 다음 순서로 갱신되게 한다.

```text
요구사항을 분석하고 있습니다. · 진행 중
→ 요구사항 분석을 완료했습니다. · 완료

Wireframe을 생성하고 있습니다. · 진행 중
→ Wireframe 생성을 완료했습니다. · 완료

최종 디자인과 이미지를 생성하고 있습니다. · 진행 중
→ 최종 디자인 생성을 완료했습니다. · 완료
```

진행 상태 유형:

| 상태 | 채팅 표시 | 입력 정책 |
|---|---|---|
| `queued` | 작업을 준비하고 있습니다 | 입력 및 CTA 잠금 |
| `in_progress` | 현재 수행 중인 작업과 세부 단계 표시 | 입력 및 CTA 잠금 |
| `completed` | 완료 결과와 다음 확인 항목 표시 | 다음 LLM 응답 후 입력 또는 CTA 활성화 |
| `failed` | 실패 원인과 재시도 가능 여부 표시 | 서버 작업 종료 확인 후 재시도 CTA 활성화 |

긴 작업은 동일 상태 항목의 보조 문구를 갱신한다. 예를 들어 최종 디자인 생성은 `디자인 구성 중`, `Key visual 생성 중`, `카드 이미지 생성 중`, `결과 검증 중`으로 진행 내용을 바꿀 수 있다. 완료된 상태 항목은 채팅 이력에 남기며 자동 삭제하지 않는다.

메시지 유형은 최소 다음을 지원한다.

| 유형 | 설명 |
|---|---|
| `user_text` | 사용자가 입력한 자연어 |
| `assistant_text` | LLM 설명, 질문, 결과 요약 |
| `assistant_cta` | LLM이 현재 상태에 맞춰 제공한 CTA |
| `user_action` | 사용자가 선택한 CTA의 채팅 이력 표현 |
| `system_status` | 분석·생성·저장·복원의 대기·진행 중·완료 상태 |
| `error` | 실패 원인과 재시도 동작 |

입력 Composer 정책:

- Enter 전송, Shift+Enter 줄바꿈
- 빈 메시지 전송 금지
- 처리 중 textarea와 전송 버튼 비활성화
- 처리 중 입력값 변경 금지
- 최대 길이는 서버 계약과 동일하게 적용
- 재접속 복원 중에는 skeleton 또는 복원 상태 표시
- 클립보드의 이미지 MIME을 감지해 붙여넣기 즉시 첨부 목록에 추가
- 이미지와 자연어를 한 메시지로 함께 전송 가능
- 업로드 전 이미지 미리보기, 순서 변경과 삭제 지원
- 이미지 분석 중에는 추가 메시지와 CTA 실행 잠금

### 5.4 참고 이미지 붙여넣기와 분석

프로모션 참고자료의 기본 입력 방식은 이미지 붙여넣기로 한다. 사용자는 브라우저에서 캡처한 프로모션 화면을 채팅 Composer에 `Ctrl+V`로 붙여넣거나, 이미지 파일을 드래그 앤 드롭하거나, 파일 선택 버튼으로 첨부할 수 있다.

지원 입력:

- 클립보드 이미지 붙여넣기
- PNG, JPEG, WebP 이미지 파일
- 여러 장 동시 첨부
- 이미지와 자연어 설명 동시 입력
- Desktop 및 Mobile 화면 캡처

초기 운영 제한값은 설정으로 관리한다. 기본 제안값은 메시지당 이미지 10장, 이미지당 10MB, 메시지 전체 50MB이며 실제 값은 인프라와 모델 입력 제한을 기준으로 Phase 0에서 확정한다.

이미지 첨부 UI:

- thumbnail, 파일명, 크기와 업로드 상태 표시
- 드래그로 이미지 순서 변경
- 전송 전 개별 이미지 삭제
- `상단`, `중간`, `하단`, `전체`, `모바일` 등 화면 역할 지정
- OCR 대상에서 제외할 이미지 선택
- 민감정보 감지 경고와 전송 취소

이미지 처리 상태는 왼쪽 채팅의 동일 작업 상태 항목에서 갱신한다.

```text
이미지 3장을 업로드하고 있습니다. · 진행 중
→ 이미지의 텍스트와 화면 구조를 분석하고 있습니다. · 진행 중
→ 중복 영역과 페이지 순서를 확인하고 있습니다. · 진행 중
→ 프로모션 정보 분석을 완료했습니다. · 완료
```

분석 결과는 다음 네 영역으로 분리한다.

| 영역 | 추출 대상 | 적용 방식 |
|---|---|---|
| 사실 정보 | 프로모션명, 금액, 기간, 참여 조건, CTA, 법적 고지 | 신뢰도와 이미지 출처를 표시하고 사용자 승인 후 반영 |
| 콘텐츠 구조 | Hero, 혜택 카드, 참여 방법, 일정, FAQ, 약관 | 요구사항 Tree와 Wireframe 구성 후보로 사용 |
| 디자인 참고 | 색상 경향, 타이포그래피 계층, 이미지 역할, 카드 스타일 | 최종 디자인 방향의 참고값으로 사용 |
| 확인 필요 | 잘린 문구, 작은 글자, 화면 밖 조건, 모호한 숫자 | 확정하지 않고 채팅 질문과 CTA로 확인 |

여러 장의 이미지가 긴 페이지를 나누어 캡처한 경우 다음 규칙을 적용한다.

1. 사용자가 지정한 첨부 순서를 우선한다.
2. 이미지의 겹치는 영역을 감지해 중복 OCR 문구를 제거한다.
3. viewport 너비와 화면 비율을 분석해 Desktop과 Mobile을 구분한다.
4. 서로 다른 viewport의 구조 차이는 하나로 임의 병합하지 않고 사용자에게 기준 화면을 확인한다.
5. 순서를 확정할 수 없으면 Wireframe 생성 전에 사용자 확인을 요청한다.

OCR 결과는 원문 이미지와 좌표 근거를 연결한다. 금액, 날짜, 참가 조건과 법적 고지는 신뢰도가 높더라도 자동 확정하지 않는다. 이미지에 보이지 않는 정보는 추정하지 않고 `확인 필요`로 남긴다.

예상 LLM 응답:

```text
확인된 내용
- 프로모션명: November Giveaway
- 총상금 표기: $14M
- 주요 구성: Hero, 혜택 안내, 참여 방법

확인 필요
- 정확한 시작·종료 시각
- 참가 가능 국가와 연령
- 전체 이용 약관
```

분석 후 LLM은 `이 내용으로 반영`, `일부 수정`, `참고만 하기`, `이미지 다시 첨부` CTA를 제공한다. 사용자가 승인한 사실과 구조만 요구사항 revision에 반영한다.

#### 이미지 보안·개인정보·권리 정책

- 업로드 전에 MIME signature와 실제 파일 형식을 검증한다.
- 이미지 크기, pixel 수, 장수와 총 용량을 제한한다.
- 악성 metadata와 불필요한 EXIF를 제거한다.
- 이메일, 전화번호, 계정명, 잔액 등 민감정보 후보를 감지해 경고한다.
- 이미지는 공개 URL로 직접 노출하지 않고 권한이 적용된 저장소와 단기 접근 URL을 사용한다.
- 원본과 OCR 결과의 보존 기간 및 사용자 삭제 기능을 제공한다.
- 이미지 안의 문구를 시스템 명령으로 취급하지 않고 비신뢰 참고자료로 격리한다.
- 원본 Key visual, 로고, 캐릭터와 브랜드 이미지는 사용 권한 확인 없이 최종 디자인 자산으로 재사용하지 않는다.
- 기본값은 화면 구조와 디자인 방향만 참고하고, 최종 이미지는 별도로 생성한다.

### 5.5 참고 URL 첨부와 분석

사용자는 자연어 메시지와 함께 외부 프로모션 페이지 URL을 첨부할 수 있다. 예를 들어 GGpoker의 특정 프로모션 URL을 입력하면 시스템은 접근 가능한 공개 페이지의 내용을 분석해 프로모션 목적, 혜택, 참여 조건, 기간, CTA, 콘텐츠 섹션과 디자인 참고 정보를 구조화한다.

권장 입력 방식:

- Composer의 `URL 첨부` 버튼
- 메시지 본문에 포함된 `http://` 또는 `https://` URL 자동 감지
- 첨부 URL chip에서 주소 확인 및 전송 전 삭제
- 초기에는 메시지당 최대 3개 URL로 제한

URL 처리 상태는 왼쪽 채팅 타임라인에 표시한다.

```text
참고 페이지를 불러오고 있습니다. · 진행 중
→ 프로모션 정보를 분석하고 있습니다. · 진행 중
→ 참고 페이지 분석을 완료했습니다. · 완료
```

분석 결과는 다음 범주로 구분한다.

| 범주 | 예시 | 처리 |
|---|---|---|
| 사실 정보 | 프로모션명, 기간, 혜택, 참여 조건, CTA | 출처 URL과 함께 요구사항 후보로 반영 |
| 콘텐츠 구조 | Hero, 혜택 카드, 참여 방법, FAQ, 약관 | 요구사항 Tree와 Wireframe 구성 참고 |
| 디자인 참고 | 색상 경향, 이미지 역할, 분위기 | 최종 디자인 방향의 참고값으로 사용 |
| 불확실 정보 | 동적 가격, 로그인 후 조건, 지역별 차이 | 확정하지 않고 사용자 확인 요청 |

LLM은 URL 분석 결과를 곧바로 확정값으로 저장하지 않는다. 추출된 중요 조건을 채팅으로 요약하고 `이 내용으로 반영`, `일부 수정`, `참고만 하기` CTA를 제공한다. 사용자가 승인한 항목만 요구사항 revision에 반영한다.

오른쪽 요구사항 Tree의 URL 기반 값에는 출처 표시를 제공한다.

- 원본 페이지 제목
- 원본 URL
- 수집 시각
- 값을 추출한 문맥 또는 항목
- 사용자 승인 여부

외부 페이지를 그대로 복제하지 않고 정보 구조와 디자인 방향의 참고자료로 사용한다. 문구, 이미지와 브랜드 자산은 권리와 사용 허가를 확인하지 않은 상태에서 최종 결과에 그대로 재사용하지 않는다.

#### URL 수집 보안 정책

URL 수집은 브라우저가 아니라 서버의 전용 Fetch·Extraction 계층에서 수행한다.

- `http`와 `https`만 허용하고 기본값은 `https`를 권장한다.
- localhost, loopback, 사설 IP, link-local, cloud metadata 주소를 차단한다.
- DNS 확인 후 실제 연결 대상 IP를 다시 검증해 SSRF와 DNS rebinding을 방지한다.
- redirect 횟수와 각 redirect 목적지를 제한·검증한다.
- 응답 크기, 연결 시간과 전체 처리 시간을 제한한다.
- 허용 Content-Type을 HTML과 텍스트 중심으로 제한한다.
- 외부 JavaScript를 실행하지 않고 정적 응답에서 본문을 추출한다.
- Cookie와 사용자 인증 정보를 전달하지 않는다.
- 수집한 HTML은 사용자 화면에 직접 삽입하지 않고 sanitize 및 구조화한다.
- 악성 페이지의 prompt injection 문구를 시스템 명령으로 취급하지 않는다.

접근할 수 없는 페이지는 원인을 채팅에 표시하고 사용자가 페이지 내용을 직접 붙여넣거나 다른 공개 URL을 제공하도록 안내한다.

이미지와 URL을 함께 첨부한 경우 이미지는 사용자가 실제로 본 화면의 구조와 디자인 분석에 우선 사용하고, URL은 원문 제목·날짜·약관·출처 확인에 사용한다. 두 결과가 다르면 자동 병합하지 않고 차이를 채팅에 표시해 사용자 확인을 받는다.

### 5.6 LLM CTA

CTA는 LLM이 임의 문자열과 동작을 직접 생성하는 구조로 만들지 않는다. LLM은 허용된 action key를 제안하고 서버가 현재 상태와 권한을 검증한 뒤 표시 가능한 CTA로 정규화한다.

초기 허용 CTA:

| Action key | 표시 예시 | 허용 단계 |
|---|---|---|
| `answer_option` | 선택지 응답 | 요구사항 수집 |
| `accept_reference_findings` | 분석 내용 반영 | 이미지·URL 분석 완료 |
| `revise_reference_findings` | 일부 수정 | 이미지·URL 분석 완료 |
| `use_reference_only` | 참고만 하기 | 이미지·URL 분석 완료 |
| `discard_reference` | 첨부 제외 | 이미지·URL 분석 완료 |
| `confirm_requirements` | 요구사항 확정 | 요구사항 확인 완료 |
| `generate_wireframe` | Wireframe 생성 | 요구사항 승인 완료 |
| `approve_wireframe` | Wireframe 승인 | Wireframe 준비 완료 |
| `regenerate_wireframe` | Wireframe 다시 생성 | Wireframe 검토 |
| `generate_final_design` | 최종 디자인 생성 | Wireframe 승인 완료 |
| `retry` | 다시 시도 | 재시도 가능한 실패 |
| `return_to_requirements` | 요구사항으로 돌아가기 | Wireframe 이후 |
| `return_to_wireframe` | Wireframe으로 돌아가기 | 최종 디자인 이후 |

CTA는 한 번 클릭하면 즉시 비활성화하고 idempotency key를 사용해 중복 요청을 차단한다.

### 5.7 오른쪽 결과 영역

오른쪽 상단에는 전체 프로세스를 다음과 같이 표시한다.

```text
요구사항 수집 → 요구사항 확정 → Wireframe → Wireframe 승인 → 최종 디자인
```

각 단계는 `대기`, `진행 중`, `확인 필요`, `완료`, `재생성 필요`, `실패` 상태를 가진다.

콘텐츠 영역은 현재 단계에 따라 자동 전환하되, 사용자가 이전 결과를 확인할 수 있도록 다음 탭을 제공한다.

- 요구사항
- Wireframe
- 최종 디자인

이전 결과는 삭제하지 않고 revision과 생성 시각을 표시한다. 현재 요구사항 또는 승인된 구조와 일치하지 않는 결과에는 `이전 버전` 또는 `재생성 필요` 배지를 표시한다.

### 5.8 요구사항 Tree

Tree는 조회 전용이며 채팅 대화에서 확정된 구조화 요구사항을 표시한다.

권장 최상위 노드:

- 프로모션 기본 정보
- 대상 고객과 시장
- 혜택과 참여 조건
- 기간과 법적 고지
- CTA
- 콘텐츠 섹션
- 디자인 방향
- 확인되지 않은 항목

Tree 노드에는 값의 출처를 표시할 수 있어야 한다.

- 사용자 직접 입력
- CTA 선택
- LLM 제안 후 사용자 승인
- 시스템 기본값
- 첨부 URL에서 추출 후 사용자 승인
- 첨부 이미지에서 추출 후 사용자 승인

Tree의 직접 편집 컨트롤은 제공하지 않는다. 각 그룹에는 선택적으로 `채팅으로 수정 요청` 단축 동작만 제공할 수 있으며, 실행하면 왼쪽 입력창에 대상 문맥을 설정한다.

### 5.9 B/W Wireframe

Wireframe은 실제 HTML DOM으로 렌더링하되 다음 정책을 강제한다.

1. 흰색, 검정색과 회색 계열만 사용한다.
2. 디자인 토큰과 브랜드 테마를 적용하지 않는다.
3. 실제 이미지를 생성하거나 불러오지 않는다.
4. 이미지 슬롯은 비율과 용도를 표시한 회색 박스로 렌더링한다.
5. 제목은 의미에 따라 `h1`, `h2`, `h3` 계층을 사용한다.
6. 본문, 리스트, CTA와 고지 영역을 구별한다.
7. Desktop과 Mobile viewport를 전환할 수 있게 한다.
8. 각 섹션과 주요 컴포넌트에는 식별 가능한 label을 표시한다.
9. 자유 HTML 문자열을 직접 실행하지 않고 구조화 Wireframe Contract를 Renderer가 DOM으로 변환한다.

Wireframe 구조 예시:

```json
{
  "wireframeRevision": 3,
  "requirementsRevision": 5,
  "sections": [
    {
      "instanceId": "hero-01",
      "semanticType": "hero",
      "headingLevel": 1,
      "items": [
        { "type": "heading", "contentRef": "overview.title" },
        { "type": "text", "contentRef": "overview.leadText" },
        { "type": "imagePlaceholder", "aspectRatio": "16:9", "purpose": "key_visual" },
        { "type": "cta", "contentRef": "overview.ctaLabel" }
      ]
    }
  ]
}
```

### 5.10 최종 디자인

최종 디자인은 승인된 `wireframeRevision`과 `structureFingerprint`를 필수 입력으로 사용한다.

허용되는 변경:

- 디자인 토큰 선택 및 바인딩
- 색상과 배경
- 폰트 family, 크기, 굵기와 line-height
- 간격, 테두리, radius, shadow
- Key visual 및 카드 이미지 생성·배치
- 허용된 Motion Preset
- 반응형 스타일 값

금지되는 변경:

- 섹션 추가·삭제
- 섹션 순서 변경
- 컴포넌트 추가·삭제
- 제목 계층 변경
- 이미지 placeholder 용도 변경
- 콘텐츠 필드의 구조적 재매핑
- 승인된 CTA 위치 변경

최종 생성 결과의 구조 fingerprint가 승인 Wireframe과 다르면 적용을 거부한다.

## 6. 상태 모델

### 6.1 상위 단계

```text
collecting_requirements
reviewing_requirements
requirements_confirmed
generating_wireframe
reviewing_wireframe
wireframe_confirmed
generating_final_design
final_design_ready
failed
```

`failed`는 독립적인 영구 단계라기보다 직전 단계와 오류 정보를 함께 보존하는 상태로 구현하는 것이 좋다.

### 6.2 처리 잠금

다음 상태에서는 새 메시지와 CTA 실행을 막는다.

- `analyzing_requirements`
- `uploading_reference_images`
- `analyzing_reference_images`
- `fetching_reference_url`
- `analyzing_reference_content`
- `saving_requirements`
- `generating_wireframe`
- `applying_wireframe_revision`
- `generating_final_design`
- `generating_assets`
- `restoring_session`

잠금은 프런트 UI만이 아니라 서버에서도 세션의 active operation을 확인해 중복 실행을 거부해야 한다.

active operation은 채팅의 `system_status` 메시지와 연결한다. Worker 상태가 변경되면 새 상태 메시지를 계속 추가하지 않고 해당 작업의 상태 항목을 `queued → in_progress → completed` 또는 `failed`로 갱신한다. 단계가 완료되면 완료 상태를 먼저 저장한 후 후속 LLM 안내와 CTA를 출력한다.

### 6.3 이전 단계 이동과 결과 유효성

이전 단계 이동은 결과 삭제가 아니다. 각 결과는 자신이 생성된 기준 revision을 가진다.

| 변경 | 기존 Wireframe | 기존 최종 디자인 |
|---|---|---|
| 요구사항 조회만 수행 | 유효 유지 | 유효 유지 |
| 비구조적 문구 수정 | 재생성 권장 | 재생성 필요 |
| 섹션·콘텐츠 구조 변경 | 재생성 필요 | 재생성 필요 |
| Wireframe 수정 | 신규 revision 생성 | 재생성 필요 |
| 이전 결과 탭 열람 | 보존 | 보존 |

오래된 결과는 `stale`로 표시하되 사용자가 비교할 수 있도록 계속 조회할 수 있게 한다.

## 7. 저장 및 복원 설계

### 7.1 저장 원칙

서버의 Builder Document를 기준 데이터로 사용하고 브라우저 저장소는 UI 편의 상태만 보조한다.

서버 저장 대상:

- 생성 세션 ID와 Builder Document ID
- 현재 단계와 active operation
- 전체 채팅 메시지
- 첨부 이미지의 저장 reference, 순서, viewport, 분석 상태와 OCR·구조 분석 결과
- 첨부 URL, 페이지 제목, 수집 시각, 분석 상태와 추출 결과
- CTA 제안 및 선택 이력
- 구조화 요구사항과 revision
- Wireframe 결과와 revision
- Wireframe 승인 revision 및 fingerprint
- 최종 디자인 결과와 revision
- 생성 작업과 Asset Job 상태
- 채팅에 표시되는 작업별 진행 상태와 완료 시각
- 오류와 재시도 가능 여부
- 생성 시 사용한 Prompt, Model 및 Contract version 메타데이터

브라우저 저장 대상:

- 마지막 활성 세션 ID
- 좌우 분할 비율
- 오른쪽 활성 탭
- 모바일 활성 화면
- 전송 전인 임시 입력 문구

### 7.2 복원 흐름

```text
페이지 진입
  → 마지막 sessionId 확인
  → 서버에서 최신 session + document revision 조회
  → 메시지와 결과 revision 복원
  → active operation 상태 조회
  ├─ 작업 진행 중 → 입력 잠금 + polling 또는 event 구독 재개
  ├─ 작업 완료 → 최신 결과 반영
  ├─ 작업 실패 → 오류 및 재시도 CTA 표시
  └─ 세션 없음 → 신규 세션 시작
```

브라우저가 닫혀 있는 동안 Worker가 완료한 결과도 서버 최신 상태를 기준으로 복원해야 한다.

### 7.3 동시성 및 중복 방지

- 모든 mutation에 `baseDocumentRevision`을 전달한다.
- CTA 실행에는 idempotency key를 사용한다.
- 서버는 세션별 active operation을 하나만 허용한다.
- revision 충돌 시 자동 덮어쓰기하지 않고 최신 상태를 다시 불러온다.
- 이미 처리된 CTA 재전송은 기존 결과를 반환한다.

## 8. API 및 계약 변경 계획

기존 Composition API와 Asset Job은 재사용하되 단계별 승인을 지원하는 API 계층을 추가한다.

### 8.1 권장 API

| API | 역할 |
|---|---|
| `POST /api/promo-builder-chat-sessions` | 신규 대화 세션 생성 |
| `GET /api/promo-builder-chat-sessions?sessionId=` | 세션, 메시지, 단계와 결과 복원 |
| `POST /api/promo-builder-chat-messages` | 사용자 메시지 저장 및 다음 LLM 응답 생성 |
| `POST /api/promo-builder-reference-images` | 이미지 업로드 reference 발급 및 분석 작업 시작 |
| `GET /api/promo-builder-reference-images?referenceId=` | 이미지 OCR·구조 분석 상태와 결과 조회 |
| `DELETE /api/promo-builder-reference-images?referenceId=` | 첨부 이미지와 분석 결과 삭제 |
| `POST /api/promo-builder-reference-urls` | 참고 URL 등록, 검증 및 분석 작업 시작 |
| `GET /api/promo-builder-reference-urls?referenceId=` | URL 수집·분석 상태와 출처 메타데이터 조회 |
| `POST /api/promo-builder-chat-actions` | 허용된 CTA 실행 |
| `POST /api/promo-builder-requirements-confirm` | 요구사항 revision 승인 |
| `POST /api/promo-builder-wireframes` | B/W Wireframe proposal 생성 |
| `POST /api/promo-builder-wireframes-confirm` | Wireframe revision과 fingerprint 승인 |
| `POST /api/promo-builder-final-designs` | 승인 Wireframe 기반 최종 디자인 생성 |
| `GET /api/promo-builder-operations?sessionId=` | 진행 중 작업 상태 조회 |

실제 구현에서는 기존 Builder Document API에 action을 확장할 수 있다. 중요한 기준은 URL 개수가 아니라 메시지, 승인, 생성 단계가 서로 다른 검증 규칙과 revision을 갖는 것이다.

### 8.2 채팅 응답 계약

```json
{
  "sessionId": "...",
  "documentId": "...",
  "documentRevision": 12,
  "stage": "reviewing_requirements",
  "messages": [
    {
      "id": "...",
      "role": "assistant",
      "type": "assistant_text",
      "text": "프로모션 기간을 확인해 주세요."
    }
  ],
  "references": [
    {
      "referenceId": "...",
      "type": "image",
      "status": "analyzed",
      "viewport": "desktop",
      "sequence": 1
    },
    {
      "referenceId": "...",
      "type": "url",
      "url": "https://example.com/promotion",
      "title": "Promotion title",
      "status": "analyzed",
      "fetchedAt": "2026-11-04T00:00:00.000Z"
    }
  ],
  "actions": [
    {
      "actionId": "...",
      "actionKey": "answer_option",
      "label": "상시 프로모션",
      "payload": { "field": "campaignPeriod", "value": "always_on" }
    }
  ],
  "requirements": {
    "revision": 4,
    "status": "draft",
    "data": {}
  }
}
```

서버는 `actionKey`, 단계, payload schema와 만료 여부를 검증한다.

### 8.3 Wireframe 계약 분리

기존 Composition Contract에서 시각 스타일과 Asset Request를 제거한 구조 전용 계약을 정의한다.

- semantic section type
- section instance ID
- component instance ID
- heading hierarchy
- content reference
- image placeholder와 aspect ratio
- CTA 위치
- responsive ordering
- required/legal section policy

Wireframe 생성 시 Asset Job을 enqueue하지 않는다.

### 8.4 최종 디자인 구조 검증

최종 디자인 요청에는 다음이 필수다.

- `confirmedWireframeRevision`
- `structureFingerprint`
- `baseDocumentRevision`
- 디자인 방향
- 이미지 생성 요청

최종 결과 적용 전 서버에서 구조 fingerprint를 다시 계산해 승인 값과 비교한다. 불일치는 `WIREFRAME_STRUCTURE_MISMATCH`로 거부한다.

## 9. 프런트엔드 구성 계획

### 9.1 권장 컴포넌트

```text
visual-editor/src/builder/chat-workspace/
  AiChatWorkspace.vue
  AiChatHeader.vue
  ChatMessageList.vue
  ChatMessage.vue
  ChatActionGroup.vue
  ChatComposer.vue
  ReferenceImageTray.vue
  ReferenceAnalysisStatus.vue
  BuilderSplitPane.vue
  BuilderProcessStatus.vue
  BuilderResultTabs.vue
  RequirementsTree.vue
  WireframeReview.vue
  WireframeRenderer.vue
  FinalDesignReview.vue
  SessionRestoreState.vue
```

기존 `AiBuilderApp.vue`는 Shell과 상태 라우팅을 담당하고, 메시지·결과 UI는 위 컴포넌트로 분리한다.

### 9.2 Store 분리

단일 Store에 모든 책임을 추가하지 않고 다음 영역을 분리한다.

- session state
- conversation state
- reference image and URL state
- requirements state
- wireframe state
- final design state
- active operation state
- UI layout state

각 mutation은 서버 응답의 `documentRevision`을 반영한 후 UI를 갱신한다.

### 9.3 기존 컴포넌트 처리

| 기존 컴포넌트 | 처리 방향 |
|---|---|
| `AiBriefPanel.vue` | 채팅 Composer의 초기 메시지 흐름으로 대체 |
| `OverviewReviewForm.vue` | 요구사항 Tree와 채팅 수정 흐름으로 대체 |
| `CompositionProgress.vue` | 오른쪽 상태와 채팅 system message로 역할 분리 |
| `CompositionReview.vue` | 최종 디자인 결과 탭으로 통합 |
| `NaturalLanguageEditor.vue` | 상시 채팅 Composer로 대체 |
| `OperationProposalReview.vue` | 채팅 CTA 승인 패턴으로 통합 |
| `PromoPageRenderer.vue` | 최종 디자인 렌더링에 재사용 |

기존 파일은 신규 Vertical Slice가 안정화되기 전까지 즉시 삭제하지 않는다.

## 10. 백엔드 및 Worker 변경 계획

### 10.1 요구사항 대화 처리

LLM은 매 턴마다 자유 대화문만 반환하지 않고 다음 구조를 반환해야 한다.

- 사용자에게 보여줄 답변
- 변경된 요구사항 patch
- 아직 필요한 필드
- 확인이 필요한 추론
- 허용 CTA 후보
- 다음 권장 단계

서버가 patch와 CTA를 검증한 뒤 저장한다. 금액, 기간, 법적 조건과 URL은 사용자 확인 없이 확정하지 않는다.

### 10.2 참고 이미지 업로드 및 분석

이미지 분석 작업은 다음 순서로 처리한다.

1. MIME signature, 파일 크기, pixel 수와 장수 검증
2. 악성 metadata 및 불필요한 EXIF 제거
3. 권한이 적용된 저장소에 원본 또는 정규화 이미지 저장
4. OCR과 텍스트 좌표 추출
5. viewport, 화면 유형과 페이지 순서 분석
6. 중복 캡처 영역과 반복 텍스트 제거
7. 프로모션 사실·조건·콘텐츠 구조·디자인 참고 정보 추출
8. 각 값에 image reference, 좌표, confidence와 확인 필요 여부 부여
9. 민감정보와 사용 권한 확인이 필요한 브랜드 자산 표시
10. 채팅에 분석 요약과 승인 CTA 출력
11. 사용자 승인 후 요구사항 patch 적용

동일 이미지 fingerprint가 이미 분석되었다면 기존 결과를 재사용한다. 이미지가 삭제되면 연결된 분석 결과와 요구사항 출처 상태를 함께 갱신한다. 이미 승인된 요구사항은 자동 삭제하지 않고 출처가 제거되었음을 표시해 사용자에게 재확인을 요청한다.

### 10.3 참고 URL 수집 및 분석

URL 분석 작업은 다음 순서로 처리한다.

1. URL 형식, protocol, host와 연결 대상 검증
2. 공개 페이지 Fetch 및 redirect 재검증
3. Content-Type과 응답 크기 검증
4. navigation, footer, script와 광고성 노이즈를 제외한 본문 추출
5. title, canonical URL, language와 수집 시각 저장
6. 프로모션 사실·조건·콘텐츠 구조·디자인 참고 정보 추출
7. 각 값에 source reference와 confidence 부여
8. 채팅에 분석 요약과 승인 CTA 출력
9. 사용자 승인 후 요구사항 patch 적용

동일 canonical URL과 동일 콘텐츠 fingerprint가 이미 분석되었다면 기존 결과를 재사용한다. 페이지 내용이 변경되면 새 reference revision을 생성한다.

### 10.4 이미지와 URL 분석 결과 병합

이미지와 URL을 함께 제공한 경우 분석 결과를 다음 우선순위로 처리한다.

1. 사용자가 직접 입력하거나 승인한 값
2. 사용자가 실제로 본 첨부 이미지의 명시적 문구
3. 동일 시점·지역의 URL 원문에서 확인된 조건
4. LLM이 추론한 디자인 또는 구조 참고 정보

금액, 날짜, 국가, 참가 조건처럼 두 출처가 충돌하면 자동 선택하지 않는다. 충돌 항목과 각 출처를 채팅에 나란히 표시하고 사용자 선택 CTA를 제공한다.

### 10.5 Wireframe 생성 Worker

Wireframe Worker는 요구사항 revision을 입력으로 받아 구조 전용 proposal을 생성한다.

1. 요구사항 completeness 검증
2. 필수·법적 섹션 정책 적용
3. 섹션과 컴포넌트 구조 생성
4. heading 및 콘텐츠 reference 검증
5. 이미지 placeholder 생성
6. structure fingerprint 계산
7. Wireframe revision 저장

이 단계에서는 이미지 Provider와 디자인 토큰 Registry를 호출하지 않는다.

### 10.6 최종 디자인 Worker

최종 디자인 Worker는 승인된 Wireframe을 immutable input으로 사용한다.

1. 승인 revision과 fingerprint 검증
2. 디자인 톤앤매너 해석
3. 디자인 토큰 선택 또는 생성 가능한 값 결정
4. 구조를 변경하지 않는 스타일 binding 생성
5. 이미지 Asset Request 생성
6. Asset Job enqueue 및 상태 저장
7. 완료된 자산을 동일 placeholder instance에 binding
8. 최종 구조 fingerprint 재검증
9. 최종 Snapshot 저장

## 11. 오류 및 복구 정책

| 상황 | 사용자 표시 | 복구 동작 |
|---|---|---|
| 요구사항 분석 실패 | 채팅 오류 메시지 | `다시 시도` CTA |
| 이미지 형식·용량 검증 실패 | 업로드 불가 사유 표시 | 이미지 변환·축소 또는 제거 |
| 이미지 OCR 신뢰도 부족 | 읽지 못한 영역과 확인 필요 표시 | 확대 캡처 또는 자연어 입력 |
| 이미지 순서·viewport 불명확 | 병합 전 확인 요청 | 순서 변경 또는 기준 화면 선택 |
| 이미지에서 민감정보 감지 | 전송·분석 전 경고 | 삭제, 마스킹 또는 사용자 확인 |
| 이미지와 URL 내용 충돌 | 출처별 차이 표시 | 사용자 선택 CTA |
| URL 형식 또는 보안 검증 실패 | 사용할 수 없는 URL 안내 | URL 수정 또는 제거 |
| URL 접근·본문 추출 실패 | 접근 불가 원인 안내 | 다른 공개 URL 또는 텍스트 입력 |
| URL 내용 불확실 | 확인 필요 항목 표시 | 사용자 확인 CTA |
| 세션 복원 실패 | 오른쪽 복원 실패 상태 | 재조회 또는 신규 세션 선택 |
| Wireframe 생성 실패 | 기존 결과 유지 | 동일 revision으로 재시도 |
| 최종 디자인 실패 | 승인 Wireframe 유지 | 최종 디자인만 재시도 |
| 이미지 일부 실패 | 구조와 성공 자산 유지 | 실패 이미지 재생성 |
| revision 충돌 | 최신 상태 안내 | 최신본 불러오기 |
| 구조 fingerprint 불일치 | 최종 적용 차단 | Wireframe 기준으로 다시 생성 |
| 네트워크 중단 | 전송 여부 확인 중 표시 | idempotency key로 결과 재조회 |

실패 시 입력을 무조건 활성화하지 않는다. 서버 active operation이 종료되었는지 확인한 후 재시도 가능한 상태에서만 활성화한다.

## 12. 접근성 및 반응형 요구사항

- 메시지 영역은 신규 LLM 메시지만 적절히 알리도록 `aria-live`를 제한한다.
- 생성 진행 문구는 `role="status"`, 치명적 오류는 `role="alert"`를 사용한다.
- CTA는 키보드 접근과 명확한 focus style을 제공한다.
- Split Pane separator는 키보드 조작을 지원한다.
- 처리 중 비활성 상태는 색상뿐 아니라 텍스트와 disabled 속성으로 표현한다.
- 요구사항 Tree는 `tree`, `treeitem`, `aria-expanded` 관계를 올바르게 제공한다.
- Wireframe heading 계층은 실제 DOM heading과 일치시킨다.
- 모바일에서는 채팅과 결과를 한 화면에 억지로 병렬 배치하지 않는다.
- `prefers-reduced-motion`에서 진행 애니메이션을 축소한다.

## 13. 개발 단계

### Phase 0. 계약 및 Vertical Slice 확정

- 채팅 메시지 계약 정의
- CTA allowlist와 상태별 허용표 정의
- 요구사항, Wireframe, 최종 디자인 revision 관계 정의
- Wireframe Contract와 structure fingerprint 정의
- 기존 Composition 및 Asset API 재사용 경계 결정
- 한 개 Hero 중심 Vertical Slice fixture 준비

완료 기준:

- 동일 입력으로 요구사항 → Wireframe → 최종 디자인 계약 테스트가 통과한다.
- 최종 디자인 구조 변경이 서버에서 거부된다.

### Phase 1. AI 모드 Shell과 Split Pane

- AI 모드 SNB 제거
- 전용 Header와 Workspace Shell 구현
- 드래그·키보드 Split Pane 구현
- Desktop 최소 너비와 모바일 탭 구현
- 분할 비율 저장 및 복원

완료 기준:

- Template/Wireframe Mode의 기존 SNB 동작에 회귀가 없다.
- AI Mode에서 SNB가 DOM과 접근성 Tree에 존재하지 않는다.

### Phase 2. 채팅 UI와 서버 저장

- 메시지 목록과 Composer 구현
- CTA 렌더링 및 중복 클릭 방지
- 메시지, action, 단계 서버 저장
- 생성 중 입력 잠금
- 재접속 세션 복원
- 클립보드 붙여넣기, 드래그 앤 드롭과 파일 첨부 구현
- 다중 이미지 thumbnail, 순서 변경, 삭제와 viewport 표시
- 이미지 업로드·OCR·분석 상태 UI 구현
- URL 첨부 chip과 분석 상태 UI 구현

완료 기준:

- 새로고침과 브라우저 재실행 후 동일 채팅 이력이 복원된다.
- 처리 중 메시지 전송과 CTA 실행이 프런트·서버 모두에서 차단된다.

### Phase 3. 요구사항 Tree와 대화형 보완

- 요구사항 분석 응답 계약 적용
- 누락 질문과 선택 CTA 구현
- 요구사항 Tree 렌더링
- 채팅 수정에 따른 Tree patch 반영
- 요구사항 승인 revision 구현
- 이미지 OCR·화면 구조·디자인 참고 분석 및 출처 표시
- 다중 이미지 중복·순서·viewport 처리
- 이미지와 URL 분석 결과 충돌 확인
- 공개 URL Fetch·본문 추출·분석 및 출처 표시

완료 기준:

- Tree 직접 편집 없이 채팅 요청만으로 값이 변경된다.
- 확인되지 않은 중요 항목이 있으면 승인 CTA가 제공되지 않는다.

### Phase 4. B/W Wireframe 생성과 승인

- Wireframe Worker와 API 구현
- 구조 전용 Contract 및 Validator 구현
- B/W Renderer와 viewport 전환 구현
- 수정 요청과 신규 revision 구현
- 승인 및 structure fingerprint 잠금 구현

완료 기준:

- Wireframe에서 디자인 토큰과 실제 이미지 요청이 발생하지 않는다.
- 이전 Wireframe revision을 계속 조회할 수 있다.

### Phase 5. 구조 고정 최종 디자인

- 승인 Wireframe 기반 스타일 binding 생성
- Key visual 및 카드 이미지 Asset Job 연결
- 최종 디자인 진행 상태와 Preview 구현
- 구조 fingerprint 사전·사후 검증
- 실패 자산 재시도 구현

완료 기준:

- 최종 결과의 구조가 승인 Wireframe과 동일하다.
- 최종 생성 실패 시 Wireframe과 채팅 이력이 유지된다.

### Phase 6. 복구·회귀·운영 검증

- Worker 진행 중 브라우저 종료 및 재접속 검증
- 네트워크 중단과 중복 CTA 검증
- revision 충돌 검증
- 모바일, 키보드, 접근성 검증
- 기존 Template/Wireframe Mode 회귀 테스트
- 관측 지표와 오류 코드 정리

## 14. 테스트 계획

### 14.1 계약 테스트

- 메시지 role/type schema
- 이미지 MIME, 파일 크기, pixel 수와 업로드 권한 검증
- OCR 결과, 좌표, viewport와 source reference schema
- 이미지·URL 충돌 결과 schema
- URL validation, SSRF 차단과 redirect 재검증
- URL 분석 결과의 source reference schema
- 단계별 CTA allowlist
- 요구사항 patch 허용 경로
- 중요 필드 미확정 시 승인 금지
- Wireframe Contract schema
- Wireframe Asset Request 금지
- 구조 fingerprint 결정성
- 최종 디자인 구조 변경 거부
- idempotency와 document revision 충돌

### 14.2 컴포넌트 테스트

- 메시지 유형별 렌더링
- 클립보드 이미지 붙여넣기와 drag-and-drop
- 다중 이미지 미리보기, 순서 변경과 삭제
- 이미지 업로드·OCR·분석 중·완료·실패 표시
- 민감정보 경고와 사용자 확인
- URL 첨부, 삭제, 분석 중·완료·실패 표시
- 작업 상태의 `대기 → 진행 중 → 완료` 갱신
- CTA disabled 및 1회 실행
- 처리 중 Composer 잠금
- Split Pane 최소 너비
- Tree read-only 보장
- 이전 revision 배지
- 모바일 탭 전환
- 오류와 재시도 상태

### 14.3 브라우저 E2E

1. 신규 AI 세션 생성
2. 자유 입력 후 LLM 추가 질문 확인
3. CTA 선택이 채팅 이력과 Tree에 반영되는지 확인
4. 클립보드 이미지 붙여넣기와 여러 장 첨부 확인
5. 이미지 순서 변경·삭제·viewport 표시 확인
6. OCR·화면 구조 분석 요약과 이미지 출처 표시 확인
7. 금액·날짜·법적 조건이 사용자 승인 전 확정되지 않는지 확인
8. 이미지와 URL을 함께 첨부했을 때 충돌 항목 확인 CTA 출력
9. 공개 프로모션 URL 첨부 후 분석 요약과 출처 표시 확인
10. URL 분석 결과가 사용자 승인 전 요구사항 확정값으로 반영되지 않는지 확인
11. 차단 대상 URL, redirect와 과대 응답 거부 확인
12. 요구사항 승인 후 Wireframe 생성 확인
13. Wireframe에 실제 이미지와 디자인 토큰이 없는지 확인
14. 채팅 수정 후 신규 Wireframe revision 확인
15. Wireframe 승인 후 최종 디자인 생성
16. 최종 디자인의 구조가 Wireframe과 동일한지 확인
17. 생성 중 새 메시지 입력 불가 확인
18. 왼쪽 채팅의 진행 중 상태가 작업 완료 후 동일 항목에서 완료 상태로 변경되는지 확인
19. 생성 중 브라우저 종료 후 재접속 시 채팅의 현재 진행 상태 복원 확인
20. 이전 단계 이동 후 기존 결과 보존 확인
21. Template/Wireframe Mode 회귀 확인

### 14.4 시각 QA

- Desktop 1440px, 1280px, 1024px
- Tablet 768px
- Mobile 390px, 360px
- 긴 한국어 및 영문 메시지
- 이미지 1장, 여러 장, 긴 페이지 분할 캡처
- Desktop과 Mobile 캡처 혼합
- 작은 글자, 장식 글꼴과 이미지 위 텍스트
- 민감정보가 포함된 로그인 화면
- CTA 1개, 여러 개, 긴 label
- 긴 요구사항 Tree
- Wireframe Desktop/Mobile 전환
- 최종 디자인 이미지 로딩·실패 상태

## 15. 수용 기준

다음 조건을 모두 만족해야 개발 완료로 판단한다.

1. AI Mode에서 SNB가 제거되고 Template/Wireframe Mode에는 영향이 없다.
2. 좌우 영역을 드래그와 키보드로 조절할 수 있다.
3. 모든 요구사항 입력과 수정은 채팅에서 수행할 수 있다.
4. LLM이 현재 단계에 유효한 CTA만 출력한다.
5. 요구사항 Tree는 조회 전용이며 채팅 결과와 동기화된다.
6. 채팅 Composer에 이미지를 붙여넣거나 여러 파일을 첨부할 수 있다.
7. 이미지의 OCR·화면 구조·디자인 참고 분석 결과와 출처를 확인할 수 있다.
8. 이미지에서 추출한 금액·기간·법적 조건은 사용자 승인 후에만 확정된다.
9. 이미지와 URL 결과가 충돌하면 자동 병합하지 않고 사용자 확인을 받는다.
10. 채팅에서 공개 프로모션 URL을 첨부하고 분석 결과와 출처를 확인할 수 있다.
11. URL 분석 정보는 사용자가 승인한 후에만 요구사항 확정값으로 반영된다.
12. 생성 중 자연어 입력과 CTA 실행이 차단된다.
13. 왼쪽 채팅에서 각 작업의 대기·진행 중·완료·실패 상태를 확인할 수 있다.
14. 완료된 작업 상태는 채팅 이력에 남고 재접속 후에도 복원된다.
15. 브라우저 종료와 재접속 후 채팅·단계·결과가 복원된다.
16. 이전 단계로 이동해도 Wireframe과 최종 디자인이 보존된다.
17. B/W Wireframe에는 디자인 토큰과 실제 이미지가 적용되지 않는다.
18. 최종 디자인은 승인된 Wireframe 구조를 변경하지 않는다.
19. 구조 변경이 감지되면 최종 결과 적용이 서버에서 거부된다.
20. 실패 후에도 마지막 정상 revision과 승인 이력이 보존된다.

## 16. 예상 변경 파일

### 16.1 프런트엔드

- `prototype/create-promo.html`
- `prototype/builder-bootstrap.js`
- `visual-editor/src/builder/AiBuilderApp.vue`
- `visual-editor/src/builder/ai-builder.css`
- `visual-editor/src/builder/state/ai-builder-store.mjs`
- `visual-editor/src/builder/services/composition-client.mjs`
- `visual-editor/src/builder/chat-workspace/*` 신규
- Wireframe 전용 Renderer 및 계약 모듈 신규

### 16.2 API와 계약

- Builder chat session/message/action API 신규 또는 기존 API 확장
- 이미지 업로드·분석·삭제 API와 저장소 신규
- OCR·viewport·다중 이미지 병합 계약 신규
- Wireframe proposal/confirm API 신규
- Final design 요청 API 확장
- 요구사항 및 Wireframe contract/validator 신규
- Composition compiler 구조 잠금 검증 추가
- Builder Document 저장소 및 migration 확장
- Worker trigger와 run 상태 확장

### 16.3 테스트

- 채팅 계약 테스트 신규
- 이미지 업로드·OCR·출처·민감정보 계약 테스트 신규
- Wireframe 계약 및 fingerprint 테스트 신규
- 최종 디자인 구조 고정 테스트 신규
- AI Builder 채팅 흐름 브라우저 테스트 신규
- 기존 AI Builder, Template Mode, Wireframe Mode 회귀 테스트 보완

## 17. 위험 요소와 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| LLM이 잘못된 CTA 제안 | 허용되지 않은 단계 진행 | 서버 allowlist와 상태 검증 |
| 채팅과 Tree 불일치 | 사용자 혼란 | 요구사항 revision을 단일 기준으로 렌더링 |
| 이전 결과가 현재 요구사항과 혼동 | 잘못된 결과 승인 | stale 배지와 생성 기준 revision 표시 |
| 최종 디자인이 구조 변경 | 승인 의미 훼손 | fingerprint 사전·사후 검증 및 적용 거부 |
| 생성 중 브라우저 종료 | 진행 상태 유실 | 서버 operation 저장과 재접속 polling |
| CTA 중복 실행 | 중복 revision과 Asset Job | 즉시 disabled, idempotency key, 서버 active lock |
| 채팅 이력 증가 | 조회 성능 저하 | cursor pagination과 요약 context 분리 |
| OCR 오인식 | 금액·날짜·조건 오류 | confidence, 좌표 근거와 사용자 승인 필수화 |
| 화면 밖 조건 누락 | 불완전한 요구사항 | 확인 필요 항목과 추가 캡처 요청 |
| 다중 이미지 순서 오류 | 잘못된 페이지 구조 | 사용자 순서 우선, 중복 감지, 불명확 시 확인 |
| 이미지 개인정보 노출 | 보안·개인정보 위험 | 민감정보 감지, EXIF 제거, 권한 저장소, 삭제·보존 정책 |
| 원본 브랜드 자산 재사용 | 저작권·상표 위험 | 구조·톤 참고만 허용하고 자산 재사용은 권한 확인 |
| 외부 URL의 SSRF·악성 콘텐츠 | 내부 시스템 접근 또는 LLM 오염 | 전용 Fetch 계층, IP 재검증, 크기 제한, prompt injection 격리 |
| 외부 콘텐츠 무단 복제 | 저작권·브랜드 위험 | 사실·구조 참고 중심, 출처 보존, 원문·이미지 자동 복제 금지 |
| 동적·로그인 페이지 분석 실패 | 불완전한 요구사항 | 접근 불가 안내와 사용자 직접 입력 대안 |
| 좌우 분할의 작은 화면 문제 | 사용성 저하 | 모바일 탭 전환과 최소 너비 정책 |
| 기존 AI Builder 회귀 | 운영 장애 | feature flag와 Vertical Slice 단계적 전환 |

## 18. 배포 및 전환 전략

1. 신규 흐름을 feature flag 뒤에 추가한다.
2. 내부 테스트 세션에만 채팅형 Workspace를 노출한다.
3. 기존 AI Builder와 동일 입력을 사용해 결과를 비교한다.
4. 요구사항 분석과 Wireframe까지만 먼저 운영 검증한다.
5. 구조 고정 검증이 안정화된 후 최종 디자인과 Asset Job을 연결한다.
6. 재접속 복원과 중복 실행 지표를 확인한 후 기본 AI Mode로 전환한다.
7. 안정화 기간 동안 기존 AI Builder 진입 경로를 rollback 수단으로 유지한다.

관측 지표:

- 요구사항 확정까지의 평균 대화 턴 수
- CTA 노출 대비 실행률
- 이미지 업로드·분석 성공률
- OCR 확인 필요 항목 비율
- 이미지·URL 충돌 발생률
- Wireframe 수정 revision 수
- Wireframe 승인까지 걸린 시간
- 최종 디자인 성공률
- 구조 fingerprint 불일치율
- 브라우저 재접속 복원 성공률
- 중복 요청 차단 건수
- 단계별 이탈률

## 19. 개발 착수 전 결정 사항

다음 항목은 Phase 0에서 확정한다.

1. 기존 Builder Document 테이블 확장과 별도 chat session 테이블 중 어느 저장 모델을 사용할지
2. 메시지 전체 원문 보존 기간과 pagination 정책
3. 원본 이미지, 정규화 이미지, OCR 결과의 보존 기간과 삭제 정책
4. 이미지 장수·파일 크기·pixel 수의 초기 제한값
5. OCR 및 Vision 모델과 실패 시 fallback 정책
6. 진행 상태 전달을 polling으로 유지할지 SSE 등 이벤트 방식으로 확장할지
7. 요구사항 수정 중 구조 영향 여부를 판정하는 규칙
8. Wireframe Renderer를 기존 `PromoPageRenderer.vue`의 모드로 둘지 별도 Renderer로 분리할지
9. 최종 디자인에서 허용할 responsive style 변화의 범위
10. 기존 AI Builder를 제거할 시점과 rollback 유지 기간

## 20. 권장 착수 순서

첫 구현은 전체 기능을 동시에 연결하지 않고 다음 Vertical Slice로 시작한다.

```text
신규 세션
→ 사용자 메시지 1건
→ 프로모션 화면 이미지 2장 붙여넣기
→ OCR·화면 구조 분석
→ LLM 추가 질문 1건
→ CTA 선택 1건
→ 요구사항 Tree 갱신
→ Hero 단일 섹션 Wireframe 생성
→ Wireframe 승인
→ 동일 Hero 구조에 색상과 Key visual 적용
→ 브라우저 재접속 복원
```

이 Vertical Slice에서 메시지 저장, CTA 검증, revision, Wireframe 구조 잠금, 최종 디자인과 복원까지 한 번에 검증한 뒤 다중 섹션과 다양한 이미지 유형으로 확장한다.
