# AI 활용 전략 검토: 효율과 품질을 위한 적용 지점 정리

- 작성일: 2026-07-17
- 작성: Claude
- 상태: 전략 검토 / 소스코드 미반영
- 용도: 다른 LLM/개발자가 배경 설명 없이 이어받아 세부 설계·구현 검토를 진행할 수 있도록 AI 적용 지점과 근거를 정리
- 참고 문서:
  - `docs/visual-template-editor-and-llm-vue-generation-proposal-2026-07-16.md` (아키텍처 제안 원문)
  - `docs/visual-renderer-p0-baseline-and-contract-2026-07-16.md` (Renderer Props/Snapshot 계약)
  - `docs/visual-renderer-development-plan-with-n8n-2026-07-16.md` (n8n 병행 전환 계획)
  - `docs/automated-vue-web-generation-process-recommendation-2026-07-14.md` (내부 생성 순서 변경 권고)
  - `docs/claude/zero-click-ax-concept-2026-07-14.md` (Zero-Click 지향점)
  - `docs/handoff-2026-07-16.md` (Visual Editor 현재 구현 상태)

## 0. 전제가 되는 프로젝트 현재 상태

이 문서를 읽는 LLM은 다음을 전제로 삼는다.

1. 기존 파이프라인은 `Content → Integrated Brief → LO-FI 이미지 → Final Design 이미지 → 별도 Web Output` 순서다. LO-FI/Final은 이미지 생성 모델 산출물이라 실제 웹페이지와 Source of Truth가 다르고, 이 불일치가 품질 문제의 근원으로 확인되었다.
2. 2026-07-16 방향 전환으로 신규 **Visual Editor**(Vue 3 + Vite, `visual-editor/src/`)와 **동일 Renderer를 공유하는 Web Output**이 구현 중이다(Phase 1 진행 중). Renderer는 `content / designSpec / assets` 세 Props만 받는 계약 기반이다.
3. LLM의 역할은 "자유 Vue 코드 생성"이 아니라 "구조화된 Design Spec 생성"으로 제한하는 원칙이 이미 문서로 확정되어 있다(단, 아직 미구현).
4. n8n은 LLM·이미지 모델 실행을 담당하고, 애플리케이션이 검증과 상태의 Source of Truth라는 역할 분담이 확정되어 있다.
5. Admin에 prompt/model 관리와 실행 snapshot(프롬프트 버전·해시 기록) 인프라가 이미 구축되어 있다.

## 1. 핵심 원칙

**AI는 발산과 해석에, 결정적 코드는 정합성과 검증에 사용한다.**

| 구분 | 담당 | 예 |
|---|---|---|
| AI에 맡길 것 | 콘텐츠 의도 해석, 디자인 방향 발산, 카피, 에셋 생성, 레이아웃 제안 | Design Spec 생성, Variant 발산, 모바일 재배치 제안 |
| 코드에 맡길 것 | 계약 준수, 좌표 계산, 접근성/오버플로 검사, UTM 조립, 마이그레이션 | JSON Schema validator, WCAG 대비 검사, Renderer |

AI 출력이 시스템에 들어오는 모든 경계에는 결정적 검증(validator)을 두고, 검증 실패 시 fail-closed로 차단한다. 이 패턴은 Wizard Step 2 설정 로드 실패 처리에 이미 적용된 관례다.

## 2. 적용 지점별 권고

### 2.1 Design Spec 생성 (최우선 활용처)

- LLM 출력을 자유 CSS/코드가 아니라 **스키마가 강제된 JSON**으로 제한한다.
- 구체 제약:
  - 색상: `visual-editor/src/contracts.js`의 `DESIGN_COLOR_TOKENS` 팔레트 enum에서만 선택
  - fontSize: 10~80 범위 제한 (현재 CONTENT 패널 range와 동일)
  - 출력 전체: `PageDesignSpec` 계약(contractVersion 포함) 기준 JSON Schema 검증
- n8n LLM 노드에서 structured output(JSON mode/function calling)을 사용해 파싱 실패 재시도 비용을 줄인다.
- 검증 실패 시 사용자에게 기본 Spec을 제공하고 실패를 로그로 남긴다. LLM 출력이 이상해도 렌더링은 절대 깨지지 않는 구조를 유지한다.

주의: 현재 `DEFAULT_DESIGN_SPEC` 구현이 P0 계약 문서보다 확장되어 있으나(`backgroundImage`, `itemStyles`, `sectionStyles` 등) contractVersion이 1로 유지된 계약 드리프트가 있다. Design Spec 생성 구현 전에 계약 문서를 먼저 갱신해야 한다.

### 2.2 design-md 코퍼스 RAG 주입 (가장 저비용·고효과)

- `docs/design-md/` 아래 60여 개 브랜드 DESIGN.md(airbnb, apple, stripe, linear 등)가 이미 존재하며, DB 정규화 테이블(`design_token_sets`/`design_token_items`)로도 적재되어 있다.
- 사용자가 Step 1에서 디자인 컨셉을 선택하면, 유사 브랜드 2~3개의 토큰(색·타이포·간격 체계)을 Design Spec 생성 프롬프트의 컨텍스트로 주입한다.
- 근거: 제로부터 발명하는 LLM보다 실존 디자인 시스템을 앵커로 삼은 LLM이 더 일관되고 완성도 높은 Spec을 생성한다.
- 신규 인프라 없이 n8n 프롬프트 파이프라인 수정만으로 가능하므로 **우선순위 1순위**로 권고한다.

### 2.3 Variant N개 생성 + 자동 필터링

- Variant를 1개씩 만들지 않고 한 실행에서 3~5개 생성한다.
- 결정적 검사로 탈락시킨 뒤 통과본만 사용자에게 노출한다:
  - WCAG 텍스트 대비 검사
  - 텍스트 overflow / 콘텐츠 폭(1140~1440px) 초과 검사
  - 필수 Item coverage 100% 검사 (P0 계약 9절 동등성 기준 재사용)
- LLM-as-judge는 보조 수단으로만 사용하고 통과/차단 판정은 결정적 검사가 담당한다.
- 사용자는 "고르기만" 하면 되므로 Zero-Click 단계 승급 방향과 일치한다.

### 2.4 이미지 AI는 섹션 에셋 전용으로 축소

- 전체 페이지 이미지 생성(LO-FI/HI-FI)은 2026-07-14 권고안대로 내부 프로세스에서 단계적으로 제거한다.
- AI 이미지 생성은 히어로 배경, 섹션 일러스트 등 **에셋 단위**로만 사용한다.
- 프로모션 문구·CTA·약관은 절대 이미지에 굽지 않는다(실제 DOM 텍스트로 유지).
- 기존 `/v1/images/edits` + `input_fidelity=high` 노하우(handoff-2026-07-12)는 에셋 리터치 용도로 유효하다.
- 기존 LO-FI/Final Workflow는 Feature Flag로 병행 유지하고, 신규 파이프라인 검증 전에는 삭제하지 않는다(기존 확정 원칙).

### 2.5 시각 QA에 vision 모델 (Zero-Click 승급의 열쇠)

- Renderer 스크린샷을 vision 모델에 입력해 겹침·잘림·대비 문제를 검사하는 자동 시각 QA를 추가한다.
- Visual Editor의 자유 배치(absolute positioning)는 사용자가 품질 낮은 레이아웃을 만들 수 있는 구조이므로, **AI 정돈 제안**(정렬·간격 스냅 제안을 Design Spec patch 형태로 반환) 기능을 편집기에 추가한다. 제안 결과도 2.1과 동일한 스키마 검증을 거친다.
- 모바일 breakpoint 좌표 미대응 문제(handoff-2026-07-16 §7.4)는 사람이 재배치하는 대신 "데스크톱 레이아웃 → 모바일 배치 제안"을 LLM에 맡기고, 결과를 동일 스키마로 검증하는 방식을 권고한다.

### 2.6 평가(Eval) 체계 추가

- 이미 구축된 prompt/model snapshot 인프라 위에 다음만 추가한다:
  - 골든 입력 세트: 대표 프로모션 콘텐츠 5~10개
  - 각 입력에 대한 기대 특성 정의(예: 대비 통과, 폭 준수, 토큰 팔레트 준수율)
  - 프롬프트/모델 변경 시 골든 세트 회귀 평가 자동 실행
- 모델 티어링:
  - 고성능 모델: Design Spec 생성, 모바일 재배치 제안
  - 경량 모델: alt 텍스트, 카피 다듬기, 리전별 번역/톤 로컬라이제이션

## 3. AI를 쓰지 말아야 할 곳

다음 결정적 로직에 LLM을 넣으면 비용이 늘고 품질이 떨어진다.

- 좌표 계산, 섹션 높이 산정
- UTM 파라미터 조립
- DB 스키마 마이그레이션
- 계약(contract) 준수 판정

LLM Vue 코드 생성(원 계획 Phase 7)은 마지막까지 미룬다. 진행하더라도 컴포넌트 단위로 제한하고, Sandbox Build + 자동 시각 QA를 통과한 결과만 Template Registry에 등록하는 게이트를 유지한다(제안서 원칙과 동일).

## 4. 우선순위 요약

| 순위 | 항목 | 근거 |
|---|---|---|
| 1 | design-md 코퍼스 RAG 주입 (2.2) | 신규 인프라 불필요, 품질 개선이 사용자에게 즉시 보임 |
| 2 | Design Spec 스키마 강제 생성 (2.1) | 방향 확정済, 계약 드리프트 해소 후 착수 |
| 3 | Variant N개 + 자동 필터링 (2.3) | 기존 동등성 기준 재사용 가능 |
| 4 | 시각 QA vision 모델 (2.5) | Zero-Click 승급 및 자유 배치 품질 보완 |
| 5 | Eval 체계 (2.6) | 운영 안정화 단계에서 필수 |

## 5. 이어받는 LLM을 위한 착수 가이드

1. 2.2를 구현하려면: `docs/design-md/` 구조와 `api/_design-md-data.js`, `design_token_sets` 테이블을 먼저 확인하고, n8n의 Design Spec 생성 Workflow(신규)에 토큰 컨텍스트 주입 노드를 설계한다.
2. 2.1을 구현하려면: `visual-editor/src/contracts.js`의 `DEFAULT_DESIGN_SPEC`과 P0 계약 문서의 `PageDesignSpec` 차이를 먼저 해소하고(contractVersion 갱신 포함), JSON Schema 파일을 계약 문서 옆에 버전 관리한다.
3. 모든 신규 AI 출력 경로는 기존 관례를 따른다: 실행 snapshot에 prompt/model 버전·해시 기록, 실패 시 fail-closed, 기존 Workflow는 Feature Flag 병행.
