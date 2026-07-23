# Promo Web Builder 통합 정책서

- 작성일: 2026-07-23
- 대상 프로젝트: `promo_web_builder`
- 문서 성격: 정책(가드레일·규칙·거버넌스·소유권·경계)을 한 곳으로 취합
- 강제 수준: **MUST**(반드시) / **MUST NOT**(절대 금지) / **SHOULD**(특별 사유 없으면 준수) / **MAY**(선택)
- 취합 출처(각 계획서·문서에 흩어져 있던 정책 섹션을 통합):
  - `정책/source/collaboration-protocol-2026-07-21.md` (협업·소유권)
  - `계획/css-component-architecture-*`, `계획/css-design-token-unification-*` (디자인 토큰·하드코딩)
  - `계획/component-template-separation-*` (컴포넌트·템플릿, AI patch)
  - `계획/admin-i18n-locale-management-*`, `설계/admin-page-terminology-dictionary-*` (i18n·콘텐츠 경계)
  - `자료/기획-source/ai-design-recommendation-workflow-proposal-*`, `기획/promo-web-builder-product-plan-2026-07-23.md` (브랜드·법무 가드레일, Rule Base)

---

## 1. 협업·소유권 정책

- **MUST** 두 LLM 에이전트를 직접 대화시키지 않는다. 저장소의 공유 산출물(계약 파일, handoff, PR, 태스크)로 비동기 소통한다.
- **MUST** 단일 저장소(monorepo)를 유지하고, 디렉터리 소유권으로 병렬 작업한다.
- 소유권 경계:
  - Frontend(Codex): `prototype/*`, `visual-editor/src/*`, `*.css`
  - Backend(Claude): `api/*`, `db/*`
  - 공유 계약(양쪽 합의): `visual-editor/src/contracts.js`, `api/_*-contract.js`, 계약 테스트
  - 인프라/설정(사람 승인): `vercel.json`, 환경변수, `package.json` scripts
- **MUST** 구현자 ≠ 검증자. 구현한 세션이 자기 결과를 단독 검증하지 않는다.
- **MUST** 계약(인터페이스) 최종 승인은 사람(Howard)이 쥔다. PM 세션은 계약·문서 초안만 만들고 코드를 작성하지 않는다.
- **MUST** 세션 종료 시 handoff에 "변경한 것 / 남은 것 / 상대가 알아야 할 것"을 기록한다.

## 2. 디자인 토큰·하드코딩 정책

### 2.1 토큰 2계층 경계 (Layer A / Layer B)

- **MUST** 앱 UI(제작 도구) 디자인 값의 단일 출처는 `design-tokens.css`의 `--app-*`이다.
- **MUST** 프로모션 콘텐츠 값은 `--promo-*` / `--item-*` 네임스페이스로 격리한다.
- **MUST NOT** `.promo-renderer` 하위에서 `--app-*`를 참조한다.
- **MUST NOT** 앱 Sidebar/Panel/Modal 등이 `--promo-*`를 참조한다.
- **MUST NOT** 페이지별 CSS에서 자체 `:root` 색상·간격 alias를 새로 만든다(전환기 compatibility 제외).

### 2.2 하드코딩 금지 (Layer A CSS)

- **MUST NOT** 다음 리터럴을 직접 작성: hex 색상, `rgb()/rgba()/hsl()`, 반복 spacing, 반복 font-size/weight, 반복 border-radius, 반복 shadow, 공통 컨트롤 높이, 공통 transition duration, 공통 z-index.
- **MAY** 구조 값은 직접 작성: `0`, `100%`, `auto`, `1fr`, `minmax(0,1fr)`, `display/position/overflow/object-fit/text-overflow` 등.
- 예외는 코드 주석 + 하드코딩 검사 allowlist에 목적을 명시한다.

### 2.3 Breakpoint

- 표준 breakpoint(리터럴 허용, 문서상 고정): Desktop compact `1080`, Drawer `1023`, Tablet `980`, Mobile `680`.
- 기타 breakpoint는 기능적 이유 확인 후 표준으로 합칠 수 있는지 화면별 검토(기계적 변경 금지).

## 3. AI 생성 CSS / patch 정책

- **MUST NOT** AI가 자유 형식 CSS/HTML/JS를 최종 결과로 직접 반환한다. 서버는 **구조화된 layout/design patch만** 받는다.
- **MUST** 클라이언트/렌더러는 검증된 값만 CSS 변수·allowlisted style property로 변환한다.
- **MUST NOT** 다음을 허용: `@import`, `javascript:` URL, 임의 외부 URL, 앱 Shell 선택자, `html/body/:root` 수정, 무제한 `position: fixed`, 과도한 z-index, 관리자 잠금 속성 우회, `.promo-renderer` 범위를 벗어나는 선택자.
- **MUST** Layer B 정적 CSS의 최상위 선택자는 `.promo-renderer` 또는 그 하위(`.rendered-*`, `[data-section-key]`, `[data-item-key]`)로 시작한다.
- 런타임 인스턴스 값(`--promo-bg`, `--promo-accent` 등)은 계약·allowlist를 거쳐야 하며 하드코딩 검사 대상에서 제외한다.

## 4. 컴포넌트·템플릿 정책

- **MUST** 컴포넌트(섹션 아이템: Text/Image/CTA 등)는 전역으로 관리하고, 템플릿·섹션은 **참조·조립만** 한다.
- **MUST** 컴포넌트 정의(공유: 이름·항목·field_kind·AI 정책)와 템플릿 인스턴스 설정(오버라이드: 순서·필수·노출·고정위치·잠금)의 저장 위치를 분리한다.
- **MUST NOT** 템플릿 조립 API에서 컴포넌트 정의를 수정한다(인스턴스 오버라이드만 허용).
- **MUST NOT** 템플릿 clone 시 컴포넌트/항목을 복제한다(참조 행만 복사).
- **MUST NOT** 사용 중인 컴포넌트·섹션을 하드 삭제한다(archive/참조 차단만).
- **MUST** 컴포넌트·섹션·템플릿·프롬프트·메시지 등 관리 대상은 draft→active→archived 버전과 감사 이력을 따른다.
- **MUST** 상태별 active는 1건만 유지한다(DB partial unique).

## 5. i18n·콘텐츠 경계 정책

- **MUST** 관리자 i18n은 **제작 도구 UI 문구**(단계명·버튼·라벨·도움말·오류)에만 적용한다.
- **MUST NOT** 사용자가 등록/AI가 생성한 프로모션 제목·본문·CTA·이미지 설명을 관리자 locale 메시지로 변환한다.
- **MUST NOT** 최종 생성 페이지·Web Output에 관리자 baseline 문구나 번역 fallback을 삽입한다. 입력 없는 항목은 출력하지 않는다.
- **MUST** 저장 값(코드)과 표시 라벨을 분리한다. 드롭다운 저장 값을 메시지 키로 대체하지 않는다.
- **MUST** 메시지 value를 서버에서 sanitize한다: `<script`, `javascript:`, `on*=` 등 위험 패턴 금지, 허용 placeholder(`{count}` 등)만 통과.
- **MUST NOT** locale JSON을 관리자에서 자유 텍스트 통짜로 저장한다(키 단위 관리).
- 언어 코드는 ISO 639-1(필요 시 BCP 47)로 검증한다.

## 6. 거버넌스 정책 (버전·감사·롤백)

- 상태: `draft / active / inactive / archived`.
- **MUST** active 버전은 인플레이스 수정하지 않고 새 draft를 만들어 승격한다.
- **MUST** 변경은 감사 로그(트리거/이력 테이블)로 기록한다.
- 롤백은 과거 값을 신규 draft로 복원하는 방식으로 한다.

## 7. 데이터 삭제·보존 경계

- **MAY** 관리자 **설정 데이터**(템플릿·섹션·아이템·레이아웃·조립 관계)는 백업 후 초기화한다.
- **MUST NOT** 다음을 삭제한다: 생성 완료 프로모션·프로모션 목록, 사용자가 등록한 콘텐츠, 보존 대상 저장 초안, AI 디자인 run·입력/결과 스냅샷·생성 이미지 메타, Blob의 최종/섹션 이미지.
- **MUST** 초기화 전, 생성 완료 프로모션이 관리자 설정을 실시간 참조하지 않고 완전 스냅샷 기반임을 검증한다(아니면 초기화 금지).

## 8. 운영 정책 Rule Base (컴플라이언스) — 요구사항(미구현)

프로모션 페이지는 디자인뿐 아니라 운영 안전성이 중요하다. **MUST** AI 생성과 별개의 Rule Base가 아래를 통제한다(현재 최우선 미완 격차).

- 리전별 필수 약관, Responsible Gaming 문구
- 연령 고지(만 18세/21세), 국가별 금지 표현
- Bonus Code, Affiliate, Q-TAG
- CTA 링크 정책, 기간·조건 필수 입력
- 법무/컴플라이언스 체크
- **MUST** 판정은 fatal(차단)/warning(경고)로 구분하고, 정책 검증은 AI prompt가 아니라 Rule Base로 처리한다.

## 9. 브랜드·법무 가드레일 + 이미지 생성 정책

- **MUST** 브랜드 최소 가드레일(로고, 필수 색 규정, 법적 고지 문구)은 AI 추천 다양성과 별개로 항상 강제한다.
- **MUST** 최종 결과물의 텍스트·혜택은 담당자가 입력한 실제 값으로 채운다(이미지 문구가 아님).
- 이미지 생성:
  - **MUST** 서버에서 `[공통 스타일 토큰] + 유형 템플릿 + 검증된 변수 + 네거티브`로만 프롬프트를 조립한다(자유 프롬프트 그대로 전달 금지).
  - **MUST NOT** 실존 인물(예: 앰배서더 실명·실인물)·타사 로고·미성년 묘사를 생성한다.

## 부록. 강제 수준 표기·출처

각 정책의 상세 배경·구현 지침은 취합 출처 문서에 있다. 본 정책서는 흩어진 규칙을 한 곳에서 참조·강제하기 위한 단일 기준이며, 개별 계획서가 갱신되면 해당 정책 항목도 함께 갱신한다.
