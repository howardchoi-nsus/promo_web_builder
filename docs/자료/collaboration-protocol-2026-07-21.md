# FE/BE 멀티 에이전트 협업 프로토콜

- 작성일: 2026-07-21
- 대상 프로젝트: `promo_web_builder`
- 대상: FE = Codex, BE = Claude (또는 동일 모델의 서로 다른 세션)
- 상태: 협업 규칙 제안 / 소스코드 미반영
- 핵심 원칙: 두 LLM을 직접 대화시키지 않는다. 저장소의 공유 산출물로 비동기 소통하고, 계약 변경 승인만 사람이 쥔다.

## 1. 배경과 전제

FE와 BE를 서로 다른 LLM 에이전트가 담당할 때, 흔히 "두 에이전트를 어떻게 대화시키나"를 고민한다. 그러나 사람 FE/BE 팀도 실시간 대화가 아니라 공유 산출물(인터페이스 명세, 커밋, 인수인계 문서)로 협업한다. LLM 에이전트도 동일하게 두는 것이 안정적이다.

전제:

- 단일 저장소(monorepo)를 유지한다. FE/BE를 별도 프로젝트로 쪼개지 않는다.
- 조율은 모델 기반이 아니라 산출물 기반이다. 따라서 FE=Codex / BE=Claude처럼 서로 다른 모델을 써도 성립한다. 두 모델은 서로를 이해할 필요가 없고 공유 계약만 이해하면 된다.

### 1.1 단일 저장소를 유지하는 이유

FE/BE를 별도 저장소·별도 배포로 분리하면 환경변수·DB·배포가 이중 관리되고(앞선 Vercel 신규 프로젝트 검토와 동일 논점), 정작 조율 문제는 그대로 남는다. 단일 저장소에서 디렉터리 소유권으로 나누면 충돌 없이 병렬 작업하면서 계약 한 곳으로 통합된다.

## 2. 소통 채널 — 4가지 공유 산출물

두 에이전트는 서로에게 말을 걸지 않는다. 아래 산출물을 읽고 쓴다.

### 2.1 계약 파일 — 인터페이스의 단일 진실

- `visual-editor/src/contracts.js` (스냅샷 / designSpec 구조)
- `api/_promo-section-design-contract.js`, `api/_worker-execution-contract.js`
- 대응 계약 테스트 (`scripts/test-*-contract.js`)

FE가 필요한 응답 형태를 계약에 적으면 BE가 그 계약을 읽고 구현한다. 반대도 같다. 이것이 비동기·영속적 소통의 원본이다.

### 2.2 handoff 문서 — 세션 간 인수인계

- 위치: `docs/handoff-YYYY-MM-DD.md` (이미 사용 중인 패턴)
- 각 에이전트가 세션 종료 시 "변경한 것 / 남은 것 / 상대가 알아야 할 것"을 기록
- 다음 세션(같은 모델이든 다른 모델이든)이 그대로 이어받음

### 2.3 Git 브랜치 + PR — 메시지 버스

- FE: `codex/*` 브랜치 / BE: `claude/*` 브랜치
- PR 설명과 diff가 "메시지"
- 계약 테스트가 CI 게이트로 어긋남을 자동 차단

### 2.4 소유권 태그 태스크 목록

- `docs/TASKS.md` 또는 이슈에 `[FE]` / `[BE]` 태그와 `blockedBy` 의존성 명시

## 3. 역할별 모델 배정

핵심 원칙은 모델 선택보다 **역할 분리**다. 구현자와 검증자가 같으면 자기 코드의 맹점을 못 보고, PM이 구현자면 자기 편한 쪽으로 스코프를 잡는다. 아래 배정은 역할 적합성 + 이미 시작한 셋업 + 분리 원칙에 근거하며, 모델 성능은 시간이 지나면 바뀌므로 주기적으로 재검토한다. 두 모델 모두 FE/BE 양쪽에 충분히 능숙하다는 것을 전제로 한다.

| 역할 | 추천 모델 | 핵심 이유 | 분리 원칙 |
|---|---|---|---|
| FE | Codex | 빠른 시각 반복, 기존 툴체인(Node 번들 이력) 궁합 | — |
| BE | Claude | allowlist·잠금 검증, LLM 출력 검증, DB, 보안(무인증 갭) 등 안전성 민감 작업 | — |
| PM | Claude (전용 세션) | 저장소 전체를 가로지르는 계획·명세·문서화 | 구현 세션과 분리, 코드 미작성, 계약 최종 승인은 사람 |
| QA | 구현자와 다른 세션 | 맹점·편향 방지 | FE(Codex)→Claude 검증, BE(Claude 구현)→fresh Claude 또는 Codex 교차검증 |

세부 규칙:

- **FE = Codex, BE = Claude.** BE는 실수가 보안·데이터로 직결되는 신중한 검증 작업이라 Claude, FE는 작은 편집을 빠르게 반복하는 시각 작업이라 Codex.
- **배정 유지.** handoff·맥락이 세션에 누적되므로 중간에 FE/BE 모델을 바꾸지 않는다.
- **PM은 구현 세션과 반드시 분리.** 같은 Claude라도 구현 권한 없는 orchestration 전용 세션으로 둔다. PM은 계약·태스크·문서 초안만 만들고, 최종 계약 승인은 사람(Howard).
- **QA는 구현자 ≠ 검증자.** 구현한 세션이 자기 결과를 단독 검증하지 않는다. Claude가 BE를 구현했다면 그 검증은 fresh Claude 세션이나 Codex가 맡는다. 계약 테스트·Playwright 스모크는 자동화 절반이고, QA 에이전트는 그 위에 behavior/browser 테스트를 늘리고 적대적 리뷰(특히 무인증 갭, 섹션 AI 안전 검증)를 수행한다.

정리: Codex=FE, Claude=BE로 두되, PM과 QA는 "구현하지 않는 별도 세션"으로 떼고 계약 승인은 사람이 쥐면 4개 역할이 서로를 견제하며 돌아간다.

## 4. 소유권 경계

| 영역 | 소유 | 디렉터리/파일 |
|---|---|---|
| Frontend | Codex | `prototype/*`, `visual-editor/src/*`, `*.css` |
| Backend | Claude | `api/*`, `db/*` |
| 공유 계약 | 양쪽 합의 | `visual-editor/src/contracts.js`, `api/_*-contract.js`, 계약 테스트 |
| 인프라/설정 | 사람 승인 | `vercel.json`, 환경변수, `package.json` scripts |

규칙:

- 공유 계약은 누구도 단독 수정하지 않는다. "계약 변경 PR"로만 바꾼다(6장).
- 계약 머지 전에는 구현을 시작하지 않는다.
- 계약 머지 후 FE/BE는 각자 브랜치에서 상대 디렉터리를 건드리지 않는다.

## 5. PM → 구현 에이전트 작업 위임 절차

PM(Claude)은 구현 에이전트(Codex/FE 또는 Claude/BE 구현 세션)에게 실시간으로 말을 걸지 않는다. 저장소에 "작업 지시서(work order)" 파일을 남기고, 그 파일을 구현 세션의 입력으로 전달한다. PM과 구현 세션 사이에 자동 연결은 없으므로, 지시서를 나르는 전송(transport)은 사람 또는 얇은 러너가 맡는다.

### 5.1 위임 흐름

```text
1. PM(Claude)   작업 지시서 작성  docs/tasks/FE-012-<slug>.md
2. 커밋·푸시     지시서가 저장소에 남음 = "업무 요청"
3. 사람(Howard) 구현 세션을 열고 지시서를 가리킴
                "docs/tasks/FE-012.md 읽고 구현해줘"
4. 구현 에이전트 지시서 + 계약 + 저장소를 읽고 작업 → 브랜치/PR + handoff
5. PM(Claude)   PR·handoff를 읽고 검증·다음 태스크 계획
```

"요청"은 채팅 메시지가 아니라 저장소에 남는 파일이다. 그래서 Claude와 Codex가 서로를 몰라도, 서로 다른 벤더여도 협업이 성립한다.

### 5.2 전송(transport) 방식

- **사람 중계 (권장, 즉시 가능):** PM이 만든 지시서 경로를 사람이 구현 세션에 전달. 계약 승인 권한도 사람에게 있어 자연스럽다.
- **공유 큐 + 러너 (반자동):** `docs/TASKS.md` 또는 이슈에 `[FE]`/`[BE]` 태스크를 쌓고, 스크립트가 다음 태스크를 해당 CLI에 투입.
- **에이전트 직결 (비권장):** 구현 에이전트를 서브에이전트로 물리면 강결합되어 벤더 분리의 장점이 사라진다.

### 5.3 작업 지시서 템플릿

구현 에이전트가 사람 개입 없이 착수할 수 있을 만큼 자기완결적이어야 한다.

```markdown
# FE-012 · CSS 토큰 2계층 분리

## 목표
편집기 UI 토큰을 design-tokens.css로 통일, --promo-* 격리 유지

## 대상 파일 (이 밖은 건드리지 말 것)
- prototype/styles.css, create-promo.css, promo-wizard.css
- 신규: prototype/design-tokens.css
- 금지: api/*, db/* (BE 소유)

## 계약 참조
- 변경 없음 (순수 CSS, 계약 무관)

## 완료 기준
- Layer A 토큰이 design-tokens.css 한 곳에서 정의
- .rendered-*, .promo-renderer 가 --app-* 참조 0건 (grep 검증)
- npm test 통과

## 검증 명령
npm test && npm run build:visual-editor
```

목표·경계·계약·완료기준·검증을 못 박으면 구현 에이전트가 상대 영역을 침범하거나 계약을 임의 변경하는 것을 막는다. 계약 변경이 필요한 태스크라면 PM은 "먼저 계약 변경 PR을 사람에게 올려라"를 지시서에 명시한다(6장).

## 6. 계약 변경 절차 — 사람이 승인

LLM끼리 계약을 협상하게 두면 서로 추측·양보하다 어긋나기 쉽다. 계약 변경만큼은 사람이 승인한다.

```text
1. 변경 제안   FE 또는 BE가 계약 변경 PR 생성
               (변경 이유 + 요청/응답 스키마 diff + 영향 범위)
2. 검토        사람(Howard)이 승인, 필요 시 반대편 에이전트 의견 요청
3. 머지        계약 파일 + 계약 테스트 동시 갱신되어 머지
4. 구현 착수   FE/BE가 각자 브랜치에서 병렬 구현
5. 통합        각 PR은 npm test(계약 테스트) 통과가 게이트
```

계약 외 구현 세부는 각 에이전트가 계약 안에서 자율 진행한다(사람 개입 불필요).

## 7. 병렬 작업 환경

- FE는 `npm run dev:visual-editor`로 Vite dev 서버 실행. `/api`는 프록시로 배포 백엔드에 연결(현재 `vite.config.js` 설정).
- 여러 명 동시 작업 시 프록시 타깃을 공용 prod가 아니라 **브랜치 Preview 배포**로 돌려 격리.
- BE는 `vercel dev`로 serverless 함수만 로컬 실행해 독립 개발·테스트.
- 아직 없는 신규 API는 FE가 목업(MSW 등)으로 먼저 구현해 BE 완성을 기다리지 않음.

## 8. handoff 문서 템플릿

```markdown
# Handoff YYYY-MM-DD (작성: FE/Codex 또는 BE/Claude)

## 변경한 것
- (파일/기능 단위로 무엇을 바꿨는지)

## 계약 영향
- 계약 변경 여부 / 변경 PR 링크 / 반대편이 맞춰야 할 스키마

## 남은 것
- 미완료 항목, 알려진 이슈, TODO

## 상대 트랙에 요청
- [FE→BE] 또는 [BE→FE] 필요한 것

## 검증
- 실행한 테스트, 통과/실패, 확인한 브라우저/경로
```

## 9. 작업 사이클 (요약)

```text
계약 확정(사람 승인)
   → FE 트랙(Codex)                   → BE 트랙(Claude)
      prototype/visual-editor/css         api/db
      dev 프록시 or 목업                   vercel dev + 계약 테스트
   → 각자 PR (npm test 게이트)
   → 머지 통합
   → handoff 문서 기록
   → 다음 사이클
```

## 10. 권장 사항 요약

1. 두 LLM을 직접 대화시키지 않는다. 계약 + handoff + Git PR로 소통.
2. 단일 저장소 유지, 디렉터리 소유권으로 FE/BE 분리.
3. 공유 계약은 사람 승인 하에서만 변경.
4. 계약 우선 — 구현은 계약 머지 후 병렬.
5. 모든 PR은 계약 테스트 통과 게이트.
6. 서로 다른 모델(Codex/Claude) 조합 그대로 성립.

## 11. 이 문서와 연계되는 계획

- `docs/source-code-cleanup-and-consolidation-development-plan-2026-07-21.md` (FE/BE 작업 분해)
- `docs/css-design-token-unification-development-plan-2026-07-21.md` (FE 단독 트랙)
- `docs/information-architecture-to-be-2026-07-21.md` (통합 방향)
