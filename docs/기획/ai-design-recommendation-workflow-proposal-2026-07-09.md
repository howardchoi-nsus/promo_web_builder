# AI 디자인 추천 기반 프로모션 페이지 생성 워크플로우 제안 (2026-07-09, v3)

> v2: 초안(v1) 리뷰에서 나온 8가지 구현 이슈/솔루션을 반영해 데이터 모델, 검증 단계, 개발 범위를 구체화했습니다.
> v3: 개발 착수 전 확정 필요 항목 4가지(콘셉트 선택 저장 방식, sectionInputLogMarkdown 정책, Rule Validation 판정표, designConceptContext 변수 단계)를 확정해 반영했습니다.

## 0. 개발 착수 확정 사항 (2026-07-09)

| 항목 | 확정 내용 |
|---|---|
| 콘셉트 선택 저장 방식 | `promo_generation_design_concepts.isSelected` 단일 컬럼을 유일한 기준으로 사용. run 테이블에 별도 참조 컬럼(`selectedDesignConceptId`)을 두지 않는다 |
| `sectionInputLogMarkdown` 정책 | run 테이블에 저장, `contentInputHash` 비교로 재생성 여부 결정, 1차 범위는 버전 이력 없이 덮어쓰기만 지원 (4절 상세) |
| Rule Validation 판정표 | fatal/warning 초안 표 확정 (Stage 1.5 상세) — 법무/브랜드팀 최종 확인 전제 |
| `designConceptContext` | integrated brief의 **optional 변수로 시작**, 안정화 후 required 전환 검토 |

## 1. 배경

현재 GGPoker 프로모션 페이지는 각 리전/에이전트 담당자가 고정 템플릿에 텍스트·이미지만 바꿔 넣어 직접 운영한다. 새 디자인이 필요할 때마다 중앙 디자인팀/개발팀이 대응하기 어려운 구조이기 때문에, 실제로는 소수의 템플릿이 계속 재사용되고 있고 그 결과 "디자인이 단조롭다", "자유도가 없다"는 불만이 누적되어 왔다.

이 문제를 풀기 위해 AI로 디자인 생성을 자동화해서, 담당자가 디자인 전문성 없이도 매번 다른 결과물을 만들 수 있게 하는 것이 이 프로젝트(AI Promo Page Builder)의 목표다.

## 2. 핵심 문제의식 — 왜 "디자인 선택 UI"만으로는 부족한가

디자인 선택 단계를 단순히 "목록에서 골라주세요"로 구성하면, 담당자들은 결국 익숙하고 무난한 스타일 한두 개로 선택이 수렴할 가능성이 높다. 그러면 템플릿 개수만 늘어났을 뿐 실제 결과물의 다양성은 지금과 크게 다르지 않게 된다. 즉 **지금 문제의 원인은 "선택지가 부족해서"가 아니라 "각 담당자가 스스로 다양한 디자인을 판단·선택할 유인과 역량이 부족해서"**이므로, 해법도 선택 UI 확장이 아니라 **AI가 다양성을 만들어 제안하는 주체가 되는 것**이어야 한다.

## 3. 설계 원칙

- 담당자는 디자인 지식 없이 "이번 프로모션이 무엇인지"만 설명하면 된다.
- 디자인 다양성을 만드는 주체는 AI 추천이다. 담당자의 선택은 "여러 안 중 하나를 고르는 것"으로 축소해, 매번 다른 결과가 나오도록 유도한다.
- 최종 결과물의 텍스트/혜택 내용은 반드시 담당자가 입력한 실제 프로모션 내용을 반영해야 한다.
- 브랜드 최소 가드레일(로고, 필수 색상 규정, 법적 고지 문구 등)은 AI 추천 다양성과 별개로 항상 강제되어야 한다.
- 기존 runId 기반 비동기 워커 아키텍처(Integrated Brief Worker / LO-FI Draft Worker / Final Design Worker)를 재사용하되, **run 테이블 자체의 상태는 최소한만 확장**하고 디자인 콘셉트 관련 데이터는 별도 테이블로 분리한다 (근거는 5절 참고).
- **1차 개발 범위는 Stage 0~2(또는 0~3)까지로 한정**하고, Code 생성/퍼블리싱은 Final Design 단계가 안정화된 뒤 별도 phase로 진행한다.

## 4. 제안 워크플로우 (전체 8단계)

```text
0. Simple Brief 입력
1. AI 디자인 스타일 추천 (Design Concept Worker)
1.5. Rule Validation (브랜드/법무 가드레일 검증)
2. 담당자 디자인 선택/확정 (Design Selection)
3. 상세 컨텐츠 입력 (Structured Content Input)
4. Integrated Brief 생성 (기존 구조 재사용)
5. LO-FI Draft 생성 및 확인/재시도
6. Hi-FI 디자인 생성 및 확정
7. Code(HTML) 생성 및 퍼블리싱 — 1차 범위 제외, 별도 phase
```

### Stage 0. Simple Brief 입력

**입력 항목**: 프로모션 제목/카피 한 줄, 핵심 혜택(1~3개), 대상 고객, 톤 힌트(선택), 리전/마켓.

**처리**: Web/API가 `runId`를 생성하고 `inputSnapshot`에 브리프 원문을 저장한 뒤 즉시 accepted 응답.

**산출물**: `runId`, `run.status = brief_submitted`

### Stage 1. AI 디자인 스타일 추천 (신규 워커: Design Concept Worker)

**목적**: 브리프 내용을 분석해 서로 다른 성격의 디자인 콘셉트 후보를 AI가 스스로 제시하는, 다양성 확보의 핵심 엔진.

**동작 방식**:
```text
Design Concept Worker:
  브리프 텍스트 로드
  design-md 라이브러리(참고 스타일 콘셉트 40여종)에서 후보 추출/임베딩 유사도 매칭
  브리프 톤/내용과 어울리는 콘셉트 3~4개 선정
  최근 recommendationAttempt 이력을 로드해 반복 노출된 콘셉트/레퍼런스에 가중치 패널티 적용
  각 후보에 대해 아래 필드를 채워 저장
```

**후보(candidate) 데이터 스키마** (이슈 2, 3 반영):

```text
conceptId
conceptName                 예: "미니멀/신뢰형", "다이나믹/임팩트형"
referenceDesignIds[]         design-md 중 가장 가까운 레퍼런스 (예: stripe, nike)
rationale                    왜 이 콘셉트를 추천했는지 근거 텍스트
noveltyScore                 최근 선택 이력 대비 새로움 점수 (0~1)
riskLevel                    low / medium / high — 실험적일수록 높음
requiredContentSlots[]       이 콘셉트가 반드시 필요로 하는 컨텐츠 슬롯 (예: stepBar)
optionalContentSlots[]       있으면 쓰고 없으면 생략 가능한 슬롯
layoutPhilosophy             레이아웃 철학 한 줄 요약
colorTypeDirection           대표 컬러/타이포 방향
previewLevel                 thumbnail / lofi-sketch (선택)
```

**다양성 확보 장치**:
- `noveltyScore` 기준으로 최근 N개 run에서 실제 선택된 콘셉트/레퍼런스는 재노출 가중치를 낮춘다.
- 최소 1개는 `riskLevel: low`(안전/기본), 1~2개는 `riskLevel: medium~high`(실험적) 콘셉트를 섞어 제시한다.

**저장 위치**: 이슈 1에 따라 `run` 테이블 상태를 세분화하지 않고, 후보 데이터는 별도 테이블 `promo_generation_design_concepts`에 저장한다 (5절 참고).

**산출물**: `promo_generation_design_concepts` row 3~4개, `run.status = design_concept_ready`

### Stage 1.5. Rule Validation (신규)

**목적**: AI가 다양성을 추구하는 과정에서 GGPoker 로고 규정, 필수 컬러 대비, Responsible Gaming 문구, 지역별 고지 문구와 충돌하는 콘셉트가 나올 수 있으므로, 노출 전에 반드시 검증한다.

**동작 방식**:
```text
각 candidate에 대해 Rule Base 검증 실행
  fatalErrors[]   존재 시 해당 candidate는 후보 목록에서 자동 제외
  warnings[]      존재 시 후보는 그대로 노출하되 카드에 경고 배지 표시
```

**저장 필드**: `candidate.fatalErrors[]`, `candidate.warnings[]`

**중요**: 이 단계는 디자인 다양성 확보(Stage 1)와 운영 안전성 확보(Rule Base)를 명확히 분리한다. Rule Base는 콘셉트 다양성과 무관하게 항상 강제된다.

**fatal/warning 판정표 (확정, 법무/브랜드팀 최종 확인 전제)**:

| 구분 | 항목 | 사유 |
|---|---|---|
| fatal | GGPoker 로고 누락/변형 | 브랜드 가이드 필수 요소 |
| fatal | 브랜드 프라이머리 컬러 완전 미사용 | 최소 브랜드 아이덴티티 유지 |
| fatal | Terms/Footer 슬롯 자체가 없는 콘셉트 | 법적 고지 공간 확보 불가 |
| fatal | 연령 고지(18+/21+) 표시 공간 없음 | 규제 요건 |
| fatal | 텍스트 대비 WCAG AA 미달 | 가독성/접근성 |
| fatal | 금지 지역 표현/도박 규제 위반 소지 문구 | 컴플라이언스 |
| warning | 브랜드 컬러 사용 비중 낮음 | 변형은 크지만 위반은 아님 |
| warning | `riskLevel: high` (실험적 레이아웃) | 검토 필요, 배제 사유는 아님 |
| warning | 해당 리전 사용 이력 없는 스타일 | 최초 시도, 참고용 표시 |
| warning | Footer 약관 영역이 짧아 긴 약관엔 비좁음 | 컨텐츠 길이에 따라 조정 필요 |
| warning | 컬러 대비 AA는 통과, AAA는 미달 | 권장 수준 미달, 차단 사유 아님 |

이 표는 개발 착수 기준으로 확정하되, 실제 로고 사용 규정과 리전별 법적 고지 요건은 브랜드/법무팀 확인 후 세부 항목을 조정할 수 있다.

### Stage 2. 담당자 디자인 선택/확정

**UI 동작**:
- fatalErrors가 없는 콘셉트만 카드로 노출 (3~4개), warnings가 있으면 카드에 경고 배지 표시
- "다른 스타일로 다시 추천" 버튼 (재실행 정책은 7절 참고)
- 상급 사용자는 design-md 라이브러리에서 직접 다른 콘셉트를 지정 가능 (Advanced 옵션)

**산출물** (확정): 선택 여부는 `promo_generation_design_concepts.isSelected` 단일 컬럼으로만 판단한다. run 테이블에 별도 참조 컬럼(`selectedDesignConceptId`)을 두지 않는다. 같은 `runId` 내에서 `isSelected = true`인 행은 항상 최대 1개만 존재하도록 애플리케이션 레벨에서 보장한다 (재선택 시 기존 true row를 false로 되돌리고 신규 row를 true로 설정). `run.status = design_concept_confirmed`

### Stage 3. 상세 컨텐츠 입력 (선택된 콘셉트 기준)

**목적**: 선택된 콘셉트의 `requiredContentSlots`/`optionalContentSlots`에 맞춰 실제 프로모션 내용을 입력.

**동작 방식** (이슈 3 반영):
```text
requiredContentSlots 기준으로 입력 폼 필수 항목 구성
optionalContentSlots 중 담당자가 값을 채우지 않으면 해당 섹션은 자동 숨김 또는 대체 레이아웃으로 전환
예: stepBar가 optional인데 값이 없으면 Step Bar 섹션 없이 렌더링되는 대체 레이아웃 사용
```

**입력 항목** (기존 B섹션 구조 재사용): Hero Banner, Step Bar(있는 경우), Content CTA, Image Text Row, Terms/Footer.

**산출물**: `run.status = content_input_ready`, `sectionInputLogMarkdown`

**`sectionInputLogMarkdown` 저장/재생성 정책 (확정)**:
```text
저장 위치: run 테이블 (run.sectionInputLogMarkdown, run.contentInputHash)
생성 시점: Stage 3 제출 시 1회 생성

재생성 조건:
  담당자가 Stage 3 값을 다시 제출하면 contentInputHash를 재계산해 비교
  - 해시 동일 -> 재생성하지 않고 기존 값 재사용
  - 해시 다름 -> sectionInputLogMarkdown을 덮어쓰고 재생성

Integrated Brief와의 정합성:
  이미 Integrated Brief가 생성된 이후 콘텐츠가 바뀌면(hash mismatch),
  기존 Integrated Brief는 stale로 표시하고 재생성을 요구한다
  (next-development-plan-worker-integration 문서의 inputHash 비교 정책 재사용)

버전 이력:
  1차 범위에서는 최신 1건만 유지한다 (덮어쓰기, 과거 버전 미보관)
  버전 이력이 필요해지면 별도 content_input_versions 테이블로 확장한다
```

### Stage 4~6. 기존 아키텍처 재사용 + 연결 지점 명시

```text
4. Integrated Brief Worker
   - promo-generation-prepare 응답에 selectedDesignConceptMarkdown (또는 designConceptContext) 필드를 추가
   - integrated_brief 프롬프트의 variables에 designConceptContext를 optional 변수로 시작 (확정 — 안정화 후 required 전환 검토)
   - 선택된 디자인 콘셉트 + 상세 컨텐츠 입력을 병합해 프롬프트 렌더 → LLM 호출 → 검증/저장

5. LO-FI Draft Worker (기존)
   - integrated brief 기반 LO-FI 이미지 생성, Retry / Confirm

6. Final Design Worker (기존)
   - 확정된 draft 기준 Hi-FI 최종 디자인 생성
```

**이슈 5 해결**: `selectedDesignConcept`가 integrated brief에 반영되는 구체적 경로는 `POST /api/promo-generation-prepare` 응답에 `designConceptContext` 필드(콘셉트명, rationale, layoutPhilosophy, colorTypeDirection 요약)를 추가하고, `integrated_brief` 프롬프트 템플릿의 변수 목록에 **optional 변수로 시작**해 추가하는 것이다 (확정 — 기존 프롬프트/워커가 이 필드 없이도 동작해야 하므로 required로 강제하지 않는다. 안정화 후 required 전환 검토).

### Stage 7. Code 생성 및 퍼블리싱 — 1차 범위 제외

이슈 8에 따라 이번 phase의 범위에서 제외한다. Final Design Worker가 안정화된 뒤 별도 phase로 진행하며, `product-direction-and-gap-review.md`에 이미 정리된 `promo-code-generate`, `promo-publish` 워크플로우 분리안을 그대로 따른다.

## 5. 데이터 모델 및 runId 상태 모델 (이슈 1 반영 — 최소 확장 원칙)

기존 `run.status` 흐름을 무겁게 확장하는 대신, 아래처럼 최소한의 상태만 추가하고 상세 데이터는 별도 테이블로 분리한다.

```text
run.status 확장 (최소):
  brief_submitted
  design_concept_ready
  design_concept_confirmed
  content_input_ready
  integrated_brief_pending / ready   (기존)
  lofi_draft_pending / ready         (기존)
  final_design_pending / ready       (기존)
```

**신규 테이블: `promo_generation_design_concepts`**

```text
conceptId (PK)
runId (FK)
conceptName
referenceDesignIds[]
rationale
noveltyScore
riskLevel
requiredContentSlots[]
optionalContentSlots[]
layoutPhilosophy
colorTypeDirection
fatalErrors[]
warnings[]
recommendationAttempt        몇 번째 추천 실행에서 나온 후보인지
isSelected                   담당자가 최종 선택했는지 — 선택 여부 판단의 유일한 기준 (확정)
createdAt
```

**확정**: 콘셉트 선택 여부는 `isSelected` 컬럼 하나로만 판단한다. run 테이블에 `selectedDesignConceptId` 같은 별도 참조 컬럼을 두지 않아, 두 값이 어긋나는 정합성 문제를 원천 차단한다. 동일 `runId`에서 `isSelected = true`는 항상 최대 1개다.

이 테이블 분리로 얻는 이점:
- `run` 테이블과 상태 머신은 단순하게 유지된다 (기존 Integrated Brief/LO-FI/Final Design 로직에 영향 없음).
- 콘셉트 후보 이력이 run 1개당 여러 행으로 쌓여 재추천 이력/노출 이력 추적이 자연스럽다.
- `recommendationAttempt`, `isSelected` 필드로 최근 선택 이력 기반 가중치 계산(노벨티 스코어)이 쉬워진다.

**신규 워커**:
```text
Worker D: Design Concept Worker (신규)
  input: { runId, runKey, stage: "design_concept" }
  output: promo_generation_design_concepts row 3~4개 (Rule Validation 결과 포함)
```

기존 3개 워커와 동일한 계약 방식(payload: runId/runKey/stage/taskId, PATCH로 결과 반영, Web/API는 트리거만 하고 완료를 기다리지 않음)을 그대로 따른다.

## 6. 화면 흐름 요약

```text
[담당자 진입]
   -> Simple Brief 입력 화면 (1개 폼)
   -> "디자인 추천받기" 버튼
   -> 로딩 (Design Concept Worker + Rule Validation 실행)
   -> 콘셉트 카드 3~4개 노출 (fatal 제외, warning 배지 표시, "다시 추천" 옵션)
   -> 콘셉트 선택
   -> 상세 컨텐츠 입력 화면 (required/optional 슬롯 기준, 선택적 섹션 자동 숨김)
   -> "디자인 생성" 버튼
   -> LO-FI Draft 확인 화면 (Retry / Confirm)
   -> Hi-FI 결과 확인 화면 (수정 요청 / 승인)
   [1차 범위 종료 — 이후 Code 생성/퍼블리싱은 별도 phase]
```

## 7. 예상 이슈와 솔루션

**1. 상태 모델이 커짐**
이슈: `design_concept_pending/ready/confirmed`, `content_input_ready`가 추가되면 기존 `integrated_brief -> lofi -> final` 상태 흐름과 UI 조건이 복잡해진다.
솔루션: 새 상태를 run 테이블에 한 번에 다 넣지 않고 `promo_generation_design_concepts` 별도 테이블로 분리하고, run status는 5절처럼 최소한만 확장한다.

**2. AI 추천 다양성이 반복될 수 있음**
이슈: 같은 brief에서 매번 비슷한 콘셉트가 나올 가능성이 크다.
솔루션: 추천 결과에 `noveltyScore`, `riskLevel`, `referenceDesignIds`, `rationale`을 저장하고, 최근 선택된 콘셉트/디자인 MD에 가중치 패널티를 준다.

**3. 추천 콘셉트와 실제 입력 구조가 안 맞을 수 있음**
이슈: 예를 들어 Step Bar 중심 콘셉트를 추천했는데 실제 프로모션에는 단계형 참여 방식이 없을 수 있다.
솔루션: 후보마다 `requiredContentSlots`/`optionalContentSlots`를 함께 만들고, Stage 3 입력 화면에서 부족한 슬롯은 자동으로 숨기거나 대체 레이아웃으로 전환한다.

**4. 브랜드/법무 규칙과 충돌 가능**
이슈: AI가 다양한 스타일을 추천하다 보면 GGPoker 로고, 필수 색상, RG 문구, 지역별 고지 문구와 충돌할 수 있다.
솔루션: Design Concept Worker 뒤에 Rule Validation 단계(Stage 1.5)를 두고 `fatalErrors`/`warnings`로 분리한다. fatal이면 후보에서 제외, warning이면 카드에 표시한다.

**5. Integrated Brief와 연결 지점이 불명확**
이슈: `selectedDesignConcept`가 integrated brief prompt 변수에 어떻게 들어가는지가 핵심이다.
솔루션: `promo-generation-prepare` 응답에 `selectedDesignConceptMarkdown` 또는 `designConceptContext`를 추가하고, `integrated_brief` prompt required/optional variable에 반영한다.

**6. Worker/Webhook 설정 확장 필요**
이슈: 새 Design Concept Worker가 추가되면 기존 Webhook 설정에도 stage가 추가되어야 한다.
솔루션: `design_concept` stage를 `worker_webhook_settings`, worker trigger helper, `N8N_DESIGN_CONCEPT_WORKER_URL` 환경변수, Prompt Management UI, allowlist 정책에 모두 추가한다.

**7. 비용/재추천 제어**
이슈: "다시 추천"이 반복되면 LLM 호출 비용과 UX 피로가 늘어난다.
솔루션: run당 추천 횟수 제한, 캐시, "기존 후보에서 변주" 옵션을 둔다. 추천 시마다 `recommendationAttempt`를 저장해 카운트/이력을 추적한다.

**8. Code 생성 단계는 아직 뒤로 미루는 게 안전**
이슈: Stage 7 HTML 생성까지 지금 같이 넣으면 범위가 너무 커진다.
솔루션: 1차 개발 범위는 Stage 0~2 또는 0~3까지만 잡고, Code 생성은 Final Design 안정화 후 별도 phase로 둔다.

## 8. 다음 액션 아이템 (1차 개발 범위: Stage 0~3)

**확정 완료 (0절 참고)**: 콘셉트 선택 저장 방식(`isSelected` 단일 기준), `sectionInputLogMarkdown` 저장/재생성 정책, Rule Validation fatal/warning 판정표(초안), `designConceptContext` optional 변수 시작 — 4건 모두 확정. 아래는 남은 실행 항목.

1. `promo_generation_design_concepts` 테이블 스키마 확정 (5절 필드 기준, `isSelected` 유일 선택 기준 반영)
2. Design Concept Worker 추천 로직 정의 (design-md 라이브러리 임베딩/매칭 방식, noveltyScore 계산식)
3. Rule Validation fatal/warning 판정표(초안, Stage 1.5 참고)를 브랜드/법무팀에 최종 확인 요청
4. `worker_webhook_settings` / trigger helper / `N8N_DESIGN_CONCEPT_WORKER_URL` / Prompt Management UI / allowlist에 `design_concept` stage 추가
5. `promo-generation-prepare` 응답에 `designConceptContext` 필드 추가 (optional 변수로 시작), `integrated_brief` 프롬프트 변수 목록 갱신
6. `run.sectionInputLogMarkdown` / `run.contentInputHash` 컬럼 추가 및 해시 비교 재생성 로직 구현
7. Stage 0~3 UI 와이어프레임 작성 (Simple Brief → 콘셉트 카드(warning 배지 포함) → 슬롯 기반 상세 입력)
8. "다시 추천" 재실행 정책(횟수 제한, `recommendationAttempt` 기반 캐시/변주 옵션) 설계
9. Stage 4 이후(Integrated Brief~Final Design)는 기존 워커 그대로 재사용 — 이번 phase에서 별도 수정 불필요
10. Code 생성/퍼블리싱(Stage 7)은 이번 phase 범위에서 제외하고 별도 phase 문서로 분리
