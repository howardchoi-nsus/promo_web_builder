# 정의된 Agent의 Directus 적용 방향

- 작성일: 2026-09-04
- 기준: 현재 Promo Web Builder와 독립 Agent 5개 구성안

## 1. 기본 방향

Directus는 Agent를 직접 실행하는 시스템이 아니라, **Agent의 정의·프롬프트·모델·권한·버전을 관리하는 시스템**으로 사용한다.

실제 GPT·Gemini 호출, 작업 순서, 재시도, 결과 저장은 프로모션 서비스의 Agent Runner와 Orchestrator가 담당한다.

```text
Directus
  └─ Agent 설정·프롬프트·권한·활성 버전 관리
                    ↓
프로모션 서비스
  ├─ Agent Runner: GPT·Gemini 실행
  ├─ Orchestrator: Agent 실행 순서 관리
  └─ Quality Gate: 다음 단계 진행 여부 결정
                    ↓
최종 디자인 생성·검수·저장
```

## 2. Directus에 구성할 주요 데이터

| Directus 컬렉션 | 관리 내용 |
|---|---|
| `agent_definitions` | Agent 이름, 역할, 설명, 활성 상태 |
| `agent_versions` | Agent 설정의 Draft·검토·활성 버전 |
| `agent_prompts` | System Prompt와 작업 Prompt |
| `agent_model_configs` | OpenAI·Gemini Provider, 모델, 옵션, 제한 시간 |
| `agent_tools` | Agent가 사용할 수 있는 API와 기능 |
| `agent_tool_permissions` | Agent별 조회·수정·실행 권한 |
| `agent_workflows` | Final Design 같은 전체 작업 흐름 |
| `agent_workflow_steps` | Agent 실행 순서와 성공·실패 시 다음 단계 |
| `agent_quality_rules` | 통과 점수, 필수 검사, 재생성 조건 |
| `agent_approval_policies` | 사람의 승인이 필요한 단계 |

API Key와 Token 같은 비밀값은 Directus 컬렉션에 저장하지 않는다. 별도 Secret 저장소에 보관하고 Directus에는 Secret 이름만 기록한다.

## 3. Final Design Agent 등록 예시

Directus에 다음 5개 Agent를 등록한다.

1. Final Design Director
2. Layout Fidelity Agent
3. Image Generation Agent
4. Visual QA Agent
5. Revision Agent

```text
Final Design Director
        ↓
Layout Fidelity Agent
        ↓ 통과
Image Generation Agent
        ↓
Visual QA Agent
        ├─ 통과 → 사람 승인 → 최종 저장
        └─ 실패 → Revision Agent → 이미지 재생성
```

각 Agent는 입력 형식, 출력 형식, 사용 모델, 허용 도구, 최대 재시도 횟수를 독립적으로 가진다.

## 4. 현재 구현에서 이동할 내용

| 현재 구현 | Directus 적용 방향 |
|---|---|
| `prompt_templates` | `agent_prompts`, `agent_versions`로 이동 |
| Prompt Provider·Model 옵션 | `agent_model_configs`로 이동 |
| 관리자 Prompt 활성화 기능 | Directus Draft·Review·Active 흐름으로 변경 |
| `layoutFidelityPolicy` | `agent_quality_rules`에 등록 |
| 현재 Prompt 관리 화면 | Directus Studio 화면으로 교체 |
| 관리자 변경 이력 | Directus Activity·Revision으로 관리 |

생성 Run, Agent 실행 결과, 이미지, 오류, 비용은 기존 서비스 DB에 유지한다. 실행 데이터는 양이 많고 서비스 장애 복구와 직접 연결되므로 설정 데이터와 분리하는 것이 좋다.

## 5. 서비스에서 추가할 기능

### Directus 설정 Adapter

Directus 데이터를 현재 서비스가 사용하는 Prompt·Model 형식으로 변환한다.

### Agent Runner

Agent 정의를 읽어 GPT 또는 Gemini를 호출하고 결과를 지정된 형식으로 검증한다.

### Agent Orchestrator

Workflow Step에 따라 Agent를 순서대로 실행하고 실패·재시도·중단을 처리한다.

### 실행 Snapshot

실행을 시작할 때 Directus의 활성 Agent 버전을 복사해 저장한다. 실행 도중 Directus 설정이 변경되어도 진행 중인 결과는 바뀌지 않게 한다.

### Quality Gate

각 Agent의 결과가 기준을 통과했는지 확인하고 다음 Agent 실행 여부를 결정한다.

## 6. Directus MCP의 역할

Directus MCP는 운영자가 자연어로 Agent 설정을 관리할 때 사용한다.

- “현재 활성화된 Final Design Agent를 보여줘.”
- “Gemini를 사용하는 이미지 Agent를 찾아줘.”
- “Visual QA Agent의 검사 항목을 요약해줘.”
- “새 Prompt 초안을 만들고 기존 버전과 비교해줘.”
- “사용하지 않는 Agent 설정을 찾아줘.”

초기에는 MCP에 조회와 Draft 생성 권한만 부여한다. Agent 활성화, Workflow 변경, 모델 교체, 공개는 사람이 승인한다.

## 7. 단계별 진행 방향

### 1단계 — Agent 계약 정의

- 5개 Agent의 역할과 책임 확정
- Agent별 입력·출력 JSON Schema 작성
- 성공, 실패, 재시도 조건 정의

### 2단계 — Directus Control Plane 구성

- Agent 관련 컬렉션과 관계 생성
- 작성자·검토자·관리자 권한 구성
- Draft → Review → Active 상태 구성

### 3단계 — 기존 설정 이관

- 현재 Prompt와 Model 설정을 Directus로 복사
- 기존 설정과 Directus 설정의 결과 비교
- 전환 중에는 한쪽만 수정 가능하도록 제한

### 4단계 — Agent 실행 기반 개발

- Directus Adapter 개발
- Agent Runner와 Orchestrator 개발
- 실행 Snapshot, Retry, Idempotency 적용

### 5단계 — Agent 1개로 시험 운영

- 먼저 Visual QA Agent를 적용
- 기존 최종 디자인 생성 결과는 유지
- QA 결과만 비교하여 정확도와 비용 확인

### 6단계 — Final Design 5개 Agent 적용

- Director → Layout → Generation → QA → Revision 순서 적용
- 사람 승인 단계 연결
- 실패율, 재생성 횟수, 비용, 처리 시간 측정

### 7단계 — Directus MCP 연결

- 조회 전용으로 시작
- 안정화 후 Prompt Draft와 설명 수정 허용
- 삭제·활성화·모델 변경은 승인 필수

### 8단계 — 기존 어드민 종료

- Directus와 기존 설정 결과가 같은지 검증
- Rollback 경로 확보
- 기존 관리자 설정 화면과 쓰기 API 종료

## 8. 권장 첫 적용 범위

전체 5개 Agent를 한 번에 적용하지 않고 다음 순서로 진행한다.

```text
Visual QA Agent 시험 적용
        ↓
Image Generation + QA + Revision
        ↓
Final Design Director 추가
        ↓
Layout Fidelity Agent 추가
        ↓
전체 5개 Agent Workflow 활성화
```

Visual QA Agent는 기존 생성 결과를 변경하지 않고 검사만 수행하므로 가장 안전하게 Agent 실행 기반을 검증할 수 있다.

## 9. 완료 기준

- Directus에서 Agent Draft·검토·활성 버전을 관리할 수 있다.
- 각 Agent가 독립적인 입력·출력과 실행 기록을 가진다.
- 실행 중 설정 변경이 기존 작업에 영향을 주지 않는다.
- Agent 실패 시 해당 단계만 재실행할 수 있다.
- 모델과 Prompt 변경 이력을 확인할 수 있다.
- MCP가 승인 없이 Agent를 활성화하거나 삭제할 수 없다.
- 기존 최종 디자인 생성 흐름으로 되돌릴 수 있다.

핵심은 **Directus는 Agent를 관리하고, 프로모션 서비스는 Agent를 실행하며, MCP는 운영자의 Agent 관리 작업을 돕는 구조**로 역할을 분리하는 것이다.

## 10. Directus·MCP 적용 후 Agent 정리

### 별도 Agent가 필요 없는 기능

다음 기능은 Directus Studio, MCP Tool, 권한, Flow 또는 일반 서비스 코드로 처리한다. 기능은 유지하지만 각각을 독립 Agent로 만들 필요는 없다.

| 기능 | 처리 방법 |
|---|---|
| 설정 조회·등록·수정 | Directus Studio와 MCP CRUD Tool |
| Prompt·Model 설정 관리 | Directus 컬렉션과 버전 상태 |
| Component·Template·Preset 관리 | Directus 관계형 컬렉션 |
| 관리자 Prompt 번역 | Directus 번역 기능 또는 MCP 관리 Agent에 통합 |
| 이미지 검색·등록·메타데이터 수정 | Directus File Library와 MCP File Tool |
| 변경 이력 조회와 요약 | Directus Activity·Revision과 MCP 조회 |
| 승인·공개 상태 변경 | Directus 권한과 Workflow, 사람 승인 |
| 설정 Snapshot 생성 | 프로모션 서비스의 결정적 코드 |
| 결과 저장·상태 변경·재시도 | Agent Runner와 작업 관리 코드 |

특히 승인, 공개, 삭제, 비밀정보 관리는 AI Agent가 자율 결정하지 않도록 한다.

### 하나로 통합할 수 있는 기존 AI 역할

| 현재 역할 | 통합 대상 |
|---|---|
| `promo_overview_parser`, `integrated_brief` | Brief Agent |
| `promo_template_recommender`, `promo_template_composer`, `promo_page_composer`, `promo_composition_editor` | Composition Agent |
| `section_layout_planner`, `multi_component_layout_planner`, `section_composition_planner` | Composition Agent |
| `image_execution`, `section_background_image`, `component_image` | Image Generation Agent |
| `admin_prompt_translation` | Directus MCP Management Agent |
| `promo_page_generation` | 가능한 범위는 Renderer·Export 코드로 처리 |

### 별도로 구성해야 할 Agent

권장 최소 구성은 다음 **8개 Agent**다.

| 구분 | Agent | 역할 |
|---|---|---|
| 관리 | 1. Directus MCP Management Agent | 설정 검색, Draft 작성, 번역, 누락 확인을 지원한다. |
| 생성 | 2. Brief Agent | 사용자 요구사항과 운영 정보를 구조화한다. |
| 생성 | 3. Composition Agent | 템플릿, 섹션, 컴포넌트, 레이아웃을 결정한다. |
| 생성 | 4. LO-FI Agent | 검토 가능한 초기 디자인을 만든다. |
| 생성 | 5. Final Design Director | 확정된 LO-FI와 디자인 기준으로 최종 제작 지침을 만든다. |
| 생성 | 6. Image Generation Agent | GPT Image 또는 Gemini로 이미지를 생성한다. |
| 검수 | 7. Visual QA Agent | 콘텐츠, 레이아웃, 브랜드, 가독성을 검사한다. |
| 보정 | 8. Revision Agent | QA 실패 원인을 반영해 제한된 횟수만큼 다시 생성한다. |

```text
Directus MCP Management Agent
  └─ 설정·콘텐츠 관리 지원

Brief Agent
  ↓
Composition Agent
  ↓
LO-FI Agent
  ↓ 사람 확인
Final Design Director
  ↓
Image Generation Agent
  ↓
Visual QA Agent
  ├─ 통과 → 사람 승인 → 최종 저장
  └─ 실패 → Revision Agent → 이미지 재생성
```

### Agent가 아닌 필수 기반

- Directus Adapter
- Agent Runner
- Agent Orchestrator
- 작업 Queue와 상태 저장
- 실행 Snapshot
- Secret 관리
- 권한과 승인 Gate
- 로그·비용·오류 추적

이 기능들은 판단하는 Agent가 아니라 모든 Agent가 안정적으로 동작하도록 지원하는 공통 시스템이다.

결론적으로 현재 16개 Prompt 역할을 그대로 16개 Agent로 만들지 않는다. Directus·MCP가 관리 기능을 흡수하고 유사 역할을 합치면 **관리 Agent 1개와 서비스 Agent 7개, 총 8개**가 이해하기 쉽고 운영하기 좋은 초기 구성이다.
