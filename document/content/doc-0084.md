# Directus·MCP 적용 시 예상 구성

- 작성일: 2026-09-04
- 기준: 현재 Promo Web Builder 구현

## 1. 핵심 방향

현재 자체 제작된 **어드민 화면은 Directus로 교체**하고, 프로모션을 생성·편집·출력하는 **서비스는 유지**한다.

Directus MCP를 추가하면 운영자는 AI에게 자연어로 설정 조회와 콘텐츠 작업을 요청할 수 있다.

```text
현재
자체 어드민 → 기존 API·DB → 프로모션 서비스

변경 후
운영자 → Directus Studio ─────────┐
AI 도우미 → Directus MCP ────────┤→ Directus 데이터
프로모션 서비스 → REST/GraphQL ──┘
                                  ↓
                      페이지 생성·편집·출력
```

> Directus MCP는 AI가 Directus를 다루는 통로다. 실제 서비스는 MCP가 아니라 Directus REST/GraphQL API를 사용한다.

## 2. Directus가 대신할 기능

| 현재 어드민 기능 | Directus 적용 후 |
|---|---|
| AI 모델·프롬프트 관리 | Prompt 컬렉션에서 초안·검토·활성 버전 관리 |
| 웹훅 설정 | Worker 설정 컬렉션에서 주소·상태·제한 값 관리 |
| 컴포넌트 관리 | Component와 Version 컬렉션으로 관리 |
| 섹션 프리셋 관리 | Section, Field, Layout Preset 관계로 관리 |
| 템플릿·레이아웃 관리 | Template과 Section 관계 및 순서를 관리 |
| 디자인 토큰 관리 | Token Set, Version, Value 컬렉션으로 관리 |
| 다국어 관리 | Locale과 Translation 컬렉션으로 관리 |
| 변경 이력 | Directus Activity·Revision과 서비스 실행 이력으로 관리 |
| 사용자 권한 | 작성자·검토자·관리자 역할별 권한으로 관리 |
| 이미지 관리 | Directus File Library에서 업로드·분류·권한 관리 |

API 주소나 인증키 같은 비밀값은 Directus에 그대로 저장하지 않고, 별도 환경변수나 Secret 저장소에 보관한다. Directus에는 비밀값을 가리키는 이름과 사용 여부만 저장하는 것이 안전하다.

## 3. Directus MCP로 가능한 주요 기능

Directus MCP를 연결하면 AI 도우미에게 다음과 같이 요청할 수 있다.

### 조회와 검색

- “현재 활성화된 프로모션 템플릿을 보여줘.”
- “모바일 레이아웃이 없는 섹션을 찾아줘.”
- “지난주에 변경된 프롬프트를 요약해줘.”
- “한국어 번역이 비어 있는 항목을 찾아줘.”

### 등록과 수정

- 새로운 프로모션 콘텐츠 초안 등록
- 컴포넌트 설명과 태그 수정
- 다국어 번역 초안 생성 및 저장
- 이미지 URL을 Directus 파일로 가져오기
- 여러 설정값을 조건에 맞게 일괄 정리

### 검토 지원

- 초안과 현재 활성 버전 비교
- 누락된 필수값과 잘못된 연결 탐색
- 변경 내용 요약과 검토 목록 생성
- 템플릿이 사용하는 컴포넌트·섹션 관계 설명

### 운영 지원

- 설정과 콘텐츠 현황 보고서 생성
- 오래된 Draft나 미사용 자산 탐색
- 특정 지역·언어별 프로모션 목록 조회
- 실패한 작업과 관련 설정을 함께 확인

## 4. MCP 사용 시 중요한 제한

MCP가 모든 작업을 자동 결정하게 하지는 않는다.

- 처음에는 AI에 **조회와 초안 작성 권한만** 준다.
- 활성화, 승인, 공개는 운영자가 최종 확인한다.
- 삭제 기능은 기본적으로 끄거나 별도 승인을 받는다.
- AI 전용 Directus 계정을 만들고 필요한 컬렉션만 허용한다.
- AI가 변경한 내용도 Activity·Revision에 남긴다.
- AI는 API Key, Token 같은 비밀값을 조회할 수 없어야 한다.

## 5. 현재 구현에서 바뀌는 부분

### 교체되는 부분

- `prototype/index.html`의 설정 화면
- `prototype/app.js`의 어드민 관리 기능
- `admin-app/src/`의 관리자 컴포넌트와 서비스
- 설정을 등록·수정·활성화하는 다수의 관리자 API

위 기능은 Directus Studio, 컬렉션, 권한, Revision, Flow로 이동한다.

### 수정되는 부분

- 프로모션 서비스가 설정을 읽는 API
- 기존 DB 데이터를 Directus 구조로 바꾸는 변환 코드
- 활성 버전과 Draft를 구분하는 조회 방식
- 이미지 URL과 파일 ID 처리 방식
- 실행 시작 시 설정을 저장하는 Snapshot 생성 방식
- 기존 ID와 Directus Item ID의 연결 방식

### 그대로 유지되는 부분

- 프로모션 입력과 AI Builder 화면
- 페이지 구성과 레이아웃 선택 로직
- Visual Editor와 Preview
- 최종 Web Output과 Renderer
- n8n 및 외부 AI 실행
- 생성 Run, Job, Retry, 품질 검사
- 실행 당시 설정을 보관하는 Snapshot

## 6. 데이터 이동 예시

| 현재 데이터 | Directus 컬렉션 예시 |
|---|---|
| `prompt_templates` | `ai_prompts`, `ai_prompt_versions` |
| `worker_webhook_settings` | `worker_settings` |
| `wizard_item_components` | `components`, `component_versions` |
| `wizard_content_sections` | `section_presets`, `section_fields` |
| `wizard_form_templates` | `templates`, `template_sections` |
| `promo_design_token_sets` | `design_token_sets`, `design_token_versions` |
| `locales`, `locale_message_versions` | `locales`, `translations` |

`promo_generation_runs`, Builder 문서, AI 작업 상태처럼 서비스 실행에 필요한 데이터는 기존 서비스 DB에 유지하는 방안을 권장한다.

## 7. 추천 전환 순서

```text
1. Directus에 설정 컬렉션과 권한 구성
                     ↓
2. 기존 설정 데이터를 Directus로 복사
                     ↓
3. 기존 API와 Directus 결과 비교
                     ↓
4. 서비스의 설정 조회를 Directus API로 전환
                     ↓
5. Directus MCP를 조회 전용으로 연결
                     ↓
6. MCP에 초안 등록·수정 권한 추가
                     ↓
7. 안정화 후 기존 어드민 종료
```

전환 기간에는 기존 어드민과 Directus를 동시에 수정하지 않는다. 한쪽만 원본으로 정하고 다른 쪽은 읽기 전용으로 두어야 데이터 충돌을 막을 수 있다.

## 8. 최종 모습

- 운영자는 Directus Studio에서 설정과 콘텐츠를 직접 관리한다.
- AI 도우미는 Directus MCP로 검색, 초안 작성, 수정 제안, 현황 정리를 돕는다.
- 프로모션 서비스는 Directus API에서 승인된 설정을 읽는다.
- 페이지 생성·AI·미리보기·편집·출력 기능은 기존 서비스를 그대로 사용한다.
- 중요한 설정의 활성화와 공개는 사람이 최종 승인한다.

즉, **Directus는 관리자와 데이터 관리 영역을 맡고, MCP는 AI 작업 창구를 제공하며, 기존 Promo Web Builder는 페이지 제작 엔진으로 유지되는 구조**다.

## 9. GPT·Gemini를 Directus MCP만으로 사용할 수 있나?

**콘텐츠 조회·수정 용도는 가능하지만, 현재 프로모션 생성 기능 전체를 MCP만으로 대체할 수는 없다.**

Directus MCP는 GPT나 Gemini가 Directus의 설정과 콘텐츠를 읽고 수정하도록 연결해 주는 통로다. GPT·Gemini 모델을 직접 실행하거나 이미지 생성, 작업 대기열, 재시도, 결과 저장까지 대신하는 시스템은 아니다.

### MCP로 가능한 것

- GPT·Gemini가 Directus의 템플릿과 프롬프트 조회
- 프로모션 콘텐츠 초안 작성과 저장
- 번역, 누락 항목 확인, 설정 비교
- 이미지 파일 검색과 등록
- Directus Flow 실행

### 기존 기능이 필요한 것

- OpenAI·Gemini API 실제 호출
- n8n의 단계별 AI 작업 실행
- 문구·이미지·레이아웃 생성
- 작업 상태, 실패, 재시도 관리
- 실행 당시 Prompt·Model Snapshot 저장
- 생성 결과 검증과 최종 페이지 조립

### 권장 구성

```text
Directus
  └─ Prompt·Model·Template 설정 관리
                ↓
Directus MCP
  └─ GPT·Gemini를 이용한 조회·초안·운영 지원

기존 서비스 API·n8n
  └─ GPT·Gemini API 호출과 실제 생성 작업 실행
                ↓
프로모션 페이지 생성·검증·출력
```

전체를 MCP 방식으로 바꾸려면 n8n과 현재 API가 담당하는 작업 실행, 상태 저장, 재시도, 검증 기능을 별도의 AI Agent 실행기로 다시 개발해야 한다. 따라서 1차 적용에서는 **Directus MCP는 관리 보조용으로 사용하고, 실제 GPT·Gemini 생성 실행은 기존 API·n8n 구조를 유지**하는 것이 적합하다.

## 10. 기존 어드민 대체 범위 구분

기존 어드민 화면은 Directus Studio로 대체할 수 있다. 다만 현재 어드민에 연결된 전문 설정 로직과 서비스 실행 기능까지 Directus 기본 기능만으로 모두 처리할 수 있는 것은 아니다.

### A. Directus 기본 기능으로 대체

별도 관리자 화면을 다시 만들지 않고 Directus에서 관리할 수 있는 영역이다.

| 관리 영역 | Directus 적용 방식 |
|---|---|
| Prompt·Model 정보 | Collection과 관계로 관리 |
| Component·Section·Template | 관계형 Collection으로 관리 |
| Design Token | Set·Version·Value Collection으로 관리 |
| 다국어 문구 | Locale·Translation Collection으로 관리 |
| 이미지와 파일 | Directus File Library 사용 |
| 사용자 권한 | Role·Policy로 작성·검토·관리 권한 분리 |
| 변경 기록 | Activity·Revision으로 확인 |
| 작성·검토·공개 상태 | Draft·Review·Published Workflow 구성 |

### B. Directus 설정 영역에서 추가 개발

Directus에서 관리하지만 현재 프로젝트 전용 규칙과 화면이 필요하여 Extension, Hook 또는 Custom Endpoint를 개발해야 하는 영역이다.

| 설정 기능 | 필요한 추가 작업 |
|---|---|
| Prompt 검증 | 필수 변수, 길이, 출력 형식 검사 |
| Model 설정 검증 | OpenAI·Gemini와 작업 유형의 호환성 검사 |
| 활성 버전 관리 | 같은 유형에 Active 버전이 하나만 있도록 제한 |
| Template 관리 | 복사, 활성화, Rollback, 사용 관계 검사 |
| Section·Component 관리 | 삭제 전 사용 여부와 필수 구성 검사 |
| Layout 관리 | 기존 Visual Editor 연결 또는 Directus 전용 Extension 개발 |
| Design Token 관리 | 값 검증과 실제 화면 미리보기 연결 |
| Agent 설정 | 입력·출력 Schema, Tool, Workflow, Quality Rule 관리 |

### C. 기존 프로모션 서비스에 유지

사용자가 보는 관리자 기능이 아니라 실제 프로모션 제작과 안정적인 실행을 담당하는 영역이다.

| 실행 영역 | 유지 이유 |
|---|---|
| GPT·Gemini 호출 | 모델 실행과 Provider 오류 처리가 필요 |
| Agent Runner·Orchestrator | Agent 순서, 분기, 재시도 관리 |
| 생성 Run·Job 상태 | 장애 복구와 작업 추적에 필요 |
| 실행 Snapshot | 설정 변경이 진행 중 작업에 영향을 주지 않도록 보호 |
| 품질검사 | 콘텐츠·레이아웃·이미지 결과 검증 |
| Preview·Visual Editor | 실제 페이지 구성과 사용자 편집 담당 |
| Renderer·Export | 최종 웹페이지 출력 담당 |

### D. Secret 저장소로 분리

다음 값은 Directus의 일반 Collection에 저장하지 않는다.

- OpenAI·Gemini API Key
- Directus Access Token
- 외부 Worker 인증정보
- Blob·Database 접속정보
- 외부 서비스 Authorization Header

Directus에는 Secret 자체가 아니라 `secret_reference`와 사용 여부만 저장하고, 실제 값은 배포 환경변수 또는 별도 Secret Manager에서 가져온다.

### E. Directus MCP의 역할

MCP는 Directus에 저장된 설정과 콘텐츠를 AI가 다룰 수 있게 하는 관리 통로다.

- 설정과 콘텐츠 검색
- Draft 작성과 수정 제안
- 번역과 누락 항목 확인
- 변경 전후 비교와 요약
- 파일 검색과 메타데이터 관리

MCP가 설정 활성화, 공개, 삭제, Secret 조회를 자동 수행하지 않도록 권한을 제한한다.

### 최종 구분

```text
Directus
  └─ 일반 설정·콘텐츠·권한·버전·파일 관리

Directus Extension
  └─ Prompt 검증·Layout 편집·전용 활성화 규칙

기존 프로모션 서비스
  └─ Agent·AI 실행·작업 상태·품질검사·페이지 출력

Directus MCP
  └─ AI를 이용한 설정 조회·초안·번역·검토 지원

Secret Manager
  └─ API Key·Token·접속정보 보관
```

따라서 **기존 어드민 화면은 Directus로 완전히 교체할 수 있지만, 전문 설정 기능은 Directus Extension으로 옮기고 실제 생성·실행 기능은 기존 프로모션 서비스에 유지**해야 한다.

## 참고

- [Directus MCP](https://github.com/directus/mcp)
- [Directus API](https://docs.directus.io/reference/introduction)
- [Directus Collections](https://docs.directus.io/app/data-model/collections)
- [Directus Permissions](https://docs.directus.io/user-guide/user-management/permissions)
- [Directus Files](https://docs.directus.io/reference/files)
