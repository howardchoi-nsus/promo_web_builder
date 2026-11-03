# 현재 AI Agent 구성 확인

- 확인일: 2026-09-04
- 기준: 현재 저장소의 API, Prompt 실행 계약, n8n Workflow

## 결론

| 확인 기준 | 개수 | 설명 |
|---|---:|---|
| 독립 Agent 프로그램 | **0개** | 별도의 Agent 객체나 멀티 Agent 프레임워크는 구현되어 있지 않다. |
| 핵심 n8n 생성 Worker | **3개** | 통합 브리프, LO-FI, 최종 디자인 단계가 각각 외부 Worker로 분리되어 있다. |
| AI 실행 역할 | **16개** | 관리자에서 개별 Prompt·Model 설정을 가질 수 있는 논리적 AI 역할이다. |
| 저장소의 n8n Workflow JSON | **10개** | 운영 후보, 테스트, 백업 파일이 섞여 있으므로 Agent 개수로 보면 안 된다. |

따라서 현재 구조를 쉽게 설명할 때는 **“3개의 핵심 생성 Agent와 13개의 보조 AI 역할”**로 표현할 수 있다. 다만 기술적으로는 독립 Agent 16개가 아니라, 하나의 서비스가 16가지 Prompt 역할을 실행하는 구조다.

## 1. 핵심 생성 Agent 3개

| 번호 | 역할 | 하는 일 |
|---:|---|---|
| 1 | Integrated Brief Worker | 사용자 입력과 디자인 정보를 통합 브리프로 정리한다. |
| 2 | LO-FI Draft Worker | 통합 브리프로 초기 디자인 이미지를 만든다. |
| 3 | Final Design Worker | 확인된 LO-FI를 기준으로 최종 디자인을 만든다. |

이 3개만 `worker_webhook_settings`와 외부 n8n Worker URL을 사용하는 공식 비동기 생성 단계로 구성되어 있다.

## 2. 보조 AI 역할 13개

### 페이지 기획·구성 5개

1. 프로모션 개요 분석
2. 템플릿 추천
3. 템플릿 구성 계획
4. 전체 페이지 구성
5. 자연어 페이지 수정

### 섹션·레이아웃 3개

6. 섹션 레이아웃 계획
7. 여러 컴포넌트 배치 계획
8. 자연어 섹션 구성

### 이미지 3개

9. 일반 이미지 생성
10. 섹션 배경 이미지 생성
11. 컴포넌트 이미지 생성

### 관리·출력 지원 2개

12. 관리자 프롬프트 번역
13. 프로모션 페이지 데이터 생성

## 3. 모델 구성

- GPT와 Gemini는 Agent 개수가 아니라 AI Provider·Model이다.
- 대부분의 텍스트·구성 역할은 현재 OpenAI만 허용한다.
- Gemini는 최종 디자인, 일반 이미지, 섹션 배경, 컴포넌트 이미지처럼 일부 이미지 역할에서 사용할 수 있다.
- 어떤 모델을 사용할지는 활성 Prompt 설정과 실행 Snapshot으로 결정된다.

## 4. Directus MCP 적용 시 권장 Agent 구성

Directus MCP를 도입한다고 기존 16개 역할마다 MCP Agent를 새로 만들 필요는 없다.

```text
Directus 관리 Agent 1개
  └─ 설정 조회, 초안 등록, 번역, 누락 검사

기존 핵심 생성 Worker 3개
  ├─ 통합 브리프
  ├─ LO-FI
  └─ 최종 디자인

기존 서비스 내부 보조 AI 역할 13개
  └─ 기획, 추천, 구성, 레이아웃, 이미지, 번역
```

초기 권장안은 **Directus MCP 관리 Agent 1개를 추가하고, 현재 3개 핵심 Worker와 13개 보조 역할은 유지**하는 것이다.

이 경우 운영 관점에서는 총 4개 영역으로 이해할 수 있다.

1. Directus 관리 Agent
2. 통합 브리프 Agent
3. LO-FI Agent
4. 최종 디자인 Agent

보조 AI 역할은 별도 Agent로 분리하지 않고 기존 서비스 기능으로 유지한다.

## 5. Final Design Agent 세분화

현재 Final Design Worker는 12개의 n8n 처리 노드로 구성되어 있지만, 실제 AI 호출은 OpenAI 또는 Gemini 중 하나를 선택해 이미지를 생성하는 1회다.

독립적으로 판단하는 역할을 기준으로 세분화하면 **5개 Agent**가 적절하다.

| Agent | 역할 | 현재 기능과의 관계 |
|---:|---|---|
| 1. Final Design Director | 통합 브리프, 디자인 토큰, 확정된 LO-FI를 읽고 최종 디자인 지침을 만든다. | 현재 Final Design Prompt 조립을 고도화 |
| 2. Layout Fidelity Agent | 섹션 순서, 상대 위치, 콘텐츠 그룹, CTA 위치가 LO-FI와 같은지 검사한다. | 현재 `layoutFidelityPolicy`를 독립 검수 역할로 분리 |
| 3. Image Generation Agent | 승인된 지침과 LO-FI 이미지를 GPT Image 또는 Gemini에 전달한다. | 현재 Provider 분기와 이미지 생성 호출 |
| 4. Visual QA Agent | 생성 이미지의 내용 누락, 배치 오류, 브랜드·가독성 문제를 검사한다. | 현재 Base64 존재 여부 검사보다 강화된 품질 검수 |
| 5. Revision Agent | QA 실패 원인을 교정 지침으로 바꾸고 제한된 횟수만큼 다시 생성한다. | 현재 단순 재시도를 원인 기반 재생성으로 확장 |

```text
Final Design Director
        ↓
Layout Fidelity Agent
        ↓
Image Generation Agent
        ↓
Visual QA Agent
        ↓ 실패
Revision Agent ──→ Image Generation Agent 재실행
        ↓ 통과
결과 저장·상태 변경
```

결과 저장, 작업 상태 변경, 이미지 용량 확인, Provider 선택 같은 결정적인 처리는 Agent가 아니라 기존 API·n8n 시스템 기능으로 유지한다.

더 세밀한 품질 관리가 필요하면 Visual QA를 `콘텐츠 정확성`, `레이아웃`, `브랜드·접근성`의 3개 Agent로 분리하여 총 **7개 Agent**까지 확장할 수 있다. 초기 구현은 비용과 처리 시간을 고려해 5개 구성이 적절하다.
