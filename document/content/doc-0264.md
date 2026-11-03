# n8n / Web Harness Refactor Plan - 2026-07-08

## 목적

PROMO WEB BUILDER의 LLM 기반 디자인 생성 구조를 아래 방향으로 재정리한다.

```text
Web = 관리 / 판단 / 검증 / 프롬프트 렌더 / 추적
n8n = Agent Harness / 실행 순서 / 모델 호출 / 결과 연결
LLM = GPT, Gemini 1차 지원
```

핵심 목표는 n8n 내부의 로직 처리를 줄이고, n8n은 고품질, 고성능, 빠른 실행을 위한 Agent Harness 역할에 집중하도록 만드는 것이다.

## 배경

현재 n8n workflow는 단순 실행 흐름만 담당하지 않고 아래 로직까지 많이 처리하고 있다.

```text
입력값 정규화
프롬프트 변수 치환
LLM 요청 payload 생성
통합 브리프 파싱/검증
이미지 생성 프롬프트 조립
이미지 응답 파싱
결과 URL 생성
```

이 구조는 다음 문제를 만든다.

- n8n workflow 수정 빈도가 높다.
- 프롬프트 변경/검증/추적이 어렵다.
- B섹션 프로모션 입력값 반영 약화 이슈를 추적하기 어렵다.
- GPT/Gemini 등 다중 LLM 비교 실험이 어렵다.
- workflow JSON과 n8n Cloud 상태가 달라질 가능성이 높다.

따라서 n8n은 workflow 실행과 모델 호출에 집중하고, 판단과 검증은 Web API로 이동한다.

## Web 기준 수정 및 보완 사항

### 1. 프롬프트 관리 기능 보완

현재 반영된 프롬프트 관리 페이지를 유지하고 확장한다.

관리 대상:

```text
integrated_brief
image_execution
향후 추가 LLM 프롬프트
```

운영 정책:

```text
프롬프트는 DB 저장
수정은 update 방식
업데이트 시 history 생성
삭제는 archive 처리
type별 active 프롬프트 1개만 허용
```

### 2. 모델 설정 관리 추가

GPT / Gemini 모델 선택 기능을 Web에서 관리한다.

관리 대상:

```text
integratedBriefModel
imageExecutionModel
imageGenerationModel
```

1차 지원:

```text
Text / Reasoning LLM:
- GPT
- Gemini

Image Generation:
- Gemini Image
```

초기값 제안:

```text
integrated_brief: GPT
image_execution: GPT 또는 Gemini
image_generation: Gemini Image
```

### 3. 프롬프트 렌더 API 확장

현재 추가된 `/api/prompts-render`를 유지하고 확장한다.

역할:

```text
active prompt 조회
required variables 검증
변수 치환
renderedPrompt 생성
promptId / promptVersion / promptHash 반환
provider / model 정보 포함
```

### 4. Generation Prepare API 추가

n8n에서 LLM 호출 전에 사용할 실행 준비 API를 추가한다.

예상 API:

```text
POST /api/promo-design-generation-prepare
```

역할:

```text
payload 정규화
design prompt markdown 생성
section input log 생성
integrated_brief prompt render
LLM request payload 생성
model 설정 포함
stage metadata 생성
```

### 5. Integrated Brief Validate API 추가

LLM 응답 파싱과 통합 브리프 검증을 n8n Code 노드에서 Web API로 이동한다.

예상 API:

```text
POST /api/promo-integrated-brief-validate
```

역할:

```text
GPT/Gemini 응답 파싱
JSON parse
통합 브리프 필수 구조 검증
fatal / warning 분리
visibleCopy / sectionContentMapping 검증
B섹션 필수값 검증 준비
promptMeta 유지
```

### 6. Image Execution Prompt API 추가

이미지 생성 모델에 전달할 최종 imagePrompt를 Web API에서 만든다.

예상 API:

```text
POST /api/promo-image-prompt-render
```

역할:

```text
image_execution active prompt render
통합 브리프 삽입
Required Exact Visible Copy 삽입
Section Content Mapping 삽입
CTA / Legal / Footer Copy 강제 포함
최종 imagePrompt 생성
promptMeta / promptHash 반환
```

### 7. Result Persist API 보완

현재 `/api/promo-design-assets`를 확장하거나 별도 persist API를 둔다.

추가 저장 후보:

```text
promptId
promptType
promptVersion
promptHash
modelProvider
modelName
stageDuration
requestHash
variableHash
```

목적:

```text
어떤 프롬프트와 모델로 생성됐는지 추적
동일 요청 비교
품질 회귀 원인 분석
```

### 8. B섹션 디자인 토큰 표시 보완

현재 일부 보완 완료:

```text
dimension.radius 지원
dimension.spacing 지원
shadow를 elevation으로 표시
$description 표시
$extensions 표시
$extends 상속 정보 표시
raw token 기반 layout/guideline fallback 표시
```

추가 검토:

```text
default token + selected token 병합
$extends 실제 해석
typography 상속값 표시
```

## n8n 기준 수정 및 보완 사항

### 1. n8n 역할 재정의

n8n은 로직 처리기가 아니라 Agent Harness 역할을 담당한다.

목표:

```text
고퀄리티:
- 검증된 단계만 다음 단계로 진행
- 실패 시 즉시 중단

하이퍼포먼스:
- 모델 / 프롬프트 / 입력 / 결과 추적
- stage별 duration 기록

하이스피드:
- 불필요한 Code 노드 제거
- 외부 API에서 빠른 실패 처리
- LLM/이미지 호출 전 검증
```

### 2. 현재 Code 노드 축소 대상

외부 API로 이동할 대상:

```text
Normalize Payload
Build Integrated Design Brief Request
Parse Validate Integrated Design Brief
Build Image Prompt From Integrated Brief
Store UI Design Result
```

### 3. 권장 n8n 최종 구조

```text
1. Webhook Receive
2. Prepare Generation Request API
3. LLM Generate Integrated Brief
4. Validate Integrated Brief API
5. Render Image Execution Prompt API
6. Generate UI Design Image
7. Persist Result API
8. Return Result
```

### 4. GPT / Gemini 텍스트 LLM 분기

1차 지원 모델:

```text
GPT
Gemini
```

n8n에서는 provider에 따라 HTTP Request 노드를 분기한다.

예시:

```text
IF provider = openai
-> OpenAI Chat Completions HTTP Request

IF provider = google
-> Gemini Generate Content HTTP Request
```

### 5. 이미지 생성 모델

1차는 Gemini Image를 유지한다.

추후 다른 이미지 모델을 붙일 수 있도록 model config 구조는 확장 가능하게 둔다.

### 6. Stage Gate 추가

각 단계는 `ok: true`를 확인한 뒤 다음 단계로 진행한다.

예시:

```text
Prepare 실패 -> LLM 호출 안 함
Validate 실패 -> 이미지 생성 안 함
Image Prompt 검증 실패 -> 이미지 생성 안 함
Persist 실패 -> 저장 오류 반환
```

### 7. Stage Timing 기록

각 단계별 시작/종료 시간을 기록한다.

저장 후보:

```text
stage
startedAt
endedAt
durationMs
status
errorMessage
```

## 예상 이슈사항

### 1. 외부 API 호출 증가로 인한 지연

외부 API 호출이 늘어나면 호출당 수십 ms ~ 수백 ms 정도의 지연이 생길 수 있다.

다만 전체 병목은 보통 아래 단계다.

```text
1차 LLM 호출
2차 이미지 생성 호출
이미지 저장
```

따라서 전체 생성 시간에는 큰 영향이 없을 가능성이 높다.

### 2. n8n workflow 변경 폭이 큼

전면 수정 시 한 번에 디버깅하기 어렵다.

권장 전환 순서:

```text
1. image_execution 프롬프트 외부화
2. Integrated Brief Validate API 외부화
3. Prepare API 외부화
4. GPT/Gemini 모델 분기 적용
5. Persist/Trace 보완
```

### 3. GPT / Gemini 응답 포맷 차이

같은 prompt라도 provider별 응답 구조가 다르다.

대응:

```text
Validate API에서 provider별 response parser 제공
최종 내부 형식은 normalizedBriefResult로 통일
```

### 4. B섹션 반영률 검증 기준 필요

어떤 B섹션 값이 반드시 포함되어야 하는지 기준을 정해야 한다.

우선 검증 대상:

```text
promo title
hero title / subline
CTA label
step title / description
content CTA text
legal / terms text
footer text
visible section order
```

### 5. default token 상속 처리

선택 token이 `$extends`로 default token을 상속하는 경우가 있다.

예:

```text
Dark-Monochrome-SingleAccent-Design-System.tokens.json
-> $extends: ./default.tokens.en.json
```

현재는 상속 정보 표시까지 반영했고, 실제 병합은 추가 검토가 필요하다.

### 6. Active 프롬프트 변경 영향

active 프롬프트가 변경되면 생성 결과가 달라질 수 있다.

대응:

```text
promptId
promptVersion
promptHash
renderedPromptHash
```

를 생성 결과에 반드시 저장한다.

### 7. n8n Cloud와 repo workflow 동기화

n8n Cloud에서 직접 수정한 workflow와 repo의 JSON이 달라질 수 있다.

운영 기준 필요:

```text
repo JSON을 source of truth로 둘지
n8n Cloud export를 source of truth로 둘지
변경 후 export/import 절차를 어떻게 둘지
```

## 결정 사항

### 1. n8n 전면 수정 가능

현재 n8n 노드가 비효율적이라면 전부 수정 가능하다.

### 2. n8n 역할

n8n은 Agent Harness로 강화한다.

```text
n8n = 실행 순서 / 모델 호출 / stage gate / 결과 연결
```

### 3. Web 역할

Web/API는 판단과 검증을 담당한다.

```text
Web/API = prompt 관리 / 변수 치환 / 입력 검증 / B섹션 검증 / trace 생성
```

### 4. LLM 1차 지원

1차 LLM은 아래 두 provider를 지원한다.

```text
GPT
Gemini
```

이미지 생성은 1차로 Gemini Image를 유지한다.

### 5. 프롬프트 관리 방식

```text
DB 저장
업데이트 방식
변경 이력 생성
삭제는 archive
type별 active 1개
```

## 우선순위

```text
1. n8n image_execution 프롬프트 외부화
2. Integrated Brief Validate API 외부화
3. Prepare Generation Request API 외부화
4. GPT/Gemini 모델 분기
5. 결과 추적 정보 확장
6. default token 병합 검토
```

## 권장 진행 순서

```text
1. Web API 설계 확정
2. n8n 새 Harness 구조 설계
3. image_execution 프롬프트 외부화부터 적용
4. Validate API 적용
5. Prepare API 적용
6. GPT/Gemini 분기 적용
7. 실제 생성 테스트
8. B섹션 반영률 비교
```

## 1차 완료 기준

```text
n8n에서 image_execution 프롬프트를 DB active prompt로 사용
B섹션 필수값이 최종 imagePrompt에 포함됨
promptId / promptVersion / promptHash가 결과에 남음
GPT / Gemini 중 하나를 선택해 통합 브리프 생성 가능
n8n workflow에서 Code 노드 의존도가 줄어듦
```

