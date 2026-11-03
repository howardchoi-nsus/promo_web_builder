# Promo Web Builder AS-IS / TO-BE 비교

- 작성일: 2026-09-04
- 비교 대상: 현재 관리자·프로모션 서비스와 Directus·Directus MCP 적용안
- 기준: 현재 저장소의 관리자 탭, API, 데이터 구조, AI 실행 계약, Visual Editor

## 1. 결론 요약

```text
AS-IS
자체 관리자 화면 → 자체 설정 API·Neon DB → 프로모션 서비스 → AI 생성·편집·출력

TO-BE
운영자 → Directus Studio ─────────────┐
AI 관리 도우미 → Directus MCP ───────┤→ Directus 설정·콘텐츠
프로모션 서비스 → Directus REST API ─┘
                         ↓ 활성 설정 Snapshot
            기존 생성·Agent·편집·출력 서비스
```

핵심 변경은 **자체 관리자 화면과 일반 설정 API를 Directus로 교체**하는 것이다. 프로모션 생성, Agent 실행, 품질검사, Visual Editor, 최종 출력은 기존 서비스에 유지한다.

Directus MCP는 사용자 서비스의 실행 API가 아니라, AI가 Directus의 설정과 콘텐츠를 조회·작성·검토하도록 돕는 관리 통로로 사용한다.

## 2. 전체 구조 비교

| 영역 | AS-IS: 현재 | TO-BE: Directus·MCP | 변경 구분 |
|---|---|---|---|
| 관리자 화면 | `prototype/index.html`과 `admin-app/src/`의 자체 화면 | Directus Studio | 교체 |
| 설정 저장 | 자체 API와 Neon PostgreSQL 테이블 | Directus Collection과 관계 | 이전 |
| 설정 조회 | 서비스가 자체 Public·Builder API 호출 | 서비스가 Directus REST/GraphQL API 호출 | 수정 |
| AI 관리 지원 | 관리자 화면에서 직접 검색·수정 | Directus Studio + MCP 관리 Agent | 추가 |
| 사용자 서비스 | Create Promo, AI Builder, Visual Editor | 기존 사용자 흐름 유지 | 유지 |
| AI 실행 | Prompt Snapshot과 외부 AI 실행 구조 | Agent Runner가 Directus 활성 설정 Snapshot으로 실행 | 유지·확장 |
| 작업 상태 | 생성 Run, Job, Proposal 상태를 자체 DB에 저장 | 기존 서비스 DB 유지 | 유지 |
| 결과 출력 | 공통 Renderer와 Export | 기존 Renderer와 Export 유지 | 유지 |
| 권한 | Builder 익명 세션 중심, 관리자 역할 권한은 제한적 | Directus Role·Policy + 서비스 권한 연계 | 강화 |
| 변경 이력 | 기능별 History·Audit 테이블 | Directus Activity·Revision + 서비스 실행 Audit | 통합 |
| 파일 | Vercel Blob과 개별 이미지 API | Directus File Library 또는 기존 Blob 병행 | 선택·이전 |
| 비밀정보 | 환경변수 및 일부 운영 설정 | Secret Manager 유지, Directus에는 참조값만 저장 | 분리 |

## 3. 관리자·설정 기능 비교

| 현재 관리자 기능 | AS-IS | TO-BE | 구현 방식 |
|---|---|---|---|
| 웹훅 설정 | URL, 활성 상태, Timeout, 변경 이유 관리 | Directus의 Worker Setting 관리 | Collection + Custom Validation |
| LLM·Prompt | Provider, Model, Prompt, 옵션, 버전 관리 | Agent·Prompt·Model 설정 관리 | Collection + Version Workflow |
| Prompt 검증 | 필수 변수, 모델, 출력 형식 검사 | Directus 저장 전·활성화 전 동일 검사 | Hook 또는 Custom Endpoint 필요 |
| Prompt 활성화·Rollback | Draft·Validated·Active·Archived | Draft·Review·Active·Archived | Directus Workflow + 전용 활성화 로직 |
| 컴포넌트 | Component·Version·Field·AI 정책 관리 | 관계형 Component 컬렉션 | Directus Collection |
| 섹션 프리셋 | Section·Field·Component·Layout 관리 | Section Preset 컬렉션 | Collection + 관계 + Extension |
| 템플릿 | Template·Section 순서·기본값 관리 | Template과 Template Section 관계 | Collection + 정렬 필드 |
| 레이아웃 편집 | 자체 Live Preview와 Visual Editor 연결 | Directus 안에서 기존 Editor 호출 | Custom Module/Interface 필요 |
| 디자인 토큰 | Token Set·Version·Value·활성화 | 동일 구조를 Directus에서 관리 | Collection + Preview Extension |
| 다국어 | Locale·Message Version·활성화 | Locale·Translation 관리 | Directus Translation Collection |
| 변경 이력 | 영역별 History·Audit 화면 | Directus Activity·Revision | 기본 기능 + 서비스 Audit 연결 |
| 사용자 권한 | 관리자 세부 역할 분리가 충분하지 않음 | 작성자·검토자·관리자·MCP 역할 분리 | Directus Role·Policy |
| 이미지 | 개별 API와 Blob URL 관리 | 파일 업로드·폴더·메타데이터·권한 관리 | Directus File Library |

## 4. 프로모션 사용자 서비스 비교

| 사용자 기능 | AS-IS | TO-BE | 사용자 체감 |
|---|---|---|---|
| 프로모션 입력 | 현재 입력 화면 사용 | 동일 | 변화 없음 |
| 템플릿 조회 | 자체 Public API에서 활성 Template 조회 | Directus의 Published Template 조회 | 거의 없음 |
| 템플릿 추천 | 현재 AI 추천 API | Directus 설정을 Snapshot으로 읽어 기존 추천 실행 | 변화 없음 |
| 페이지 구성 | 자체 Composition API | 기존 구성 엔진 유지 | 변화 없음 |
| LO-FI·최종 디자인 | 현재 AI 생성 흐름 | Agent Runner 기반으로 유지·세분화 | 품질·추적 개선 가능 |
| 이미지 생성 | GPT Image·Gemini 설정 사용 | Directus에서 모델 설정, 서비스가 실제 호출 | 화면 변화 없음 |
| 미리보기 | Visual Editor·공통 Renderer | 동일 | 변화 없음 |
| 사용자 편집 | 텍스트·이미지·레이아웃 편집 | 동일 | 변화 없음 |
| 최종 출력 | 기존 Export·Web Output | 동일 | 변화 없음 |
| 다국어 콘텐츠 | 자체 Locale API | Directus Published Translation 사용 | 최신 번역 반영이 쉬워짐 |
| 장애 대응 | API별 오류 처리 | 마지막 활성 Snapshot·Cache 사용 | 안정성 개선 가능 |

사용자 서비스는 화면을 다시 만드는 것이 아니라 **설정을 가져오는 데이터 경로만 Directus로 변경**하는 것이 핵심이다.

## 5. AI·Agent 비교

| 구분 | AS-IS | TO-BE |
|---|---|---|
| Agent 형태 | 독립 Agent Framework 없이 16개 Prompt 실행 역할 | 관리 Agent 1개 + 서비스 Agent 7개로 역할 통합 |
| 설정 | `prompt_templates`와 관리자 화면 | Directus Agent·Prompt·Model Collection |
| 실행 | 역할별 API와 외부 실행 흐름 | 공통 Agent Runner |
| 순서 관리 | API별 연결과 상태 전이 | Agent Orchestrator |
| 입력·출력 | 역할별 계약이 분산 | Agent별 JSON Schema 표준화 |
| 설정 고정 | 실행 시 Prompt Snapshot | Directus Active Agent Version 전체 Snapshot |
| 품질검사 | 일부 결정적 검사 | Visual QA Agent + Quality Gate |
| 실패 처리 | API·작업별 재시도 | Agent 단계별 독립 재실행 |
| 모델 | 대부분 OpenAI, 일부 이미지 역할에서 Gemini | Agent별 OpenAI·Gemini 정책 관리 |

### TO-BE 권장 Agent 8개

1. Directus MCP Management Agent
2. Brief Agent
3. Composition Agent
4. LO-FI Agent
5. Final Design Director
6. Image Generation Agent
7. Visual QA Agent
8. Revision Agent

설정 저장, 승인, 삭제, 결과 저장, 작업 상태 변경은 Agent가 아니라 Directus 권한과 일반 서비스 코드가 담당한다.

## 6. Directus MCP 활용 케이스

| 활용 케이스 | 예시 | 권장 권한 |
|---|---|---|
| 설정 검색 | “현재 활성 Final Design 모델을 보여줘.” | 읽기 |
| 관계 확인 | “이 템플릿이 사용하는 섹션과 컴포넌트를 알려줘.” | 읽기 |
| 누락 검사 | “모바일 레이아웃이나 번역이 없는 항목을 찾아줘.” | 읽기 |
| Draft 작성 | “기존 Prompt를 복사해 새 초안을 만들어줘.” | 생성 |
| 콘텐츠 수정 | 설명·태그·번역 초안 수정 | 제한된 수정 |
| 변경 비교 | Draft와 Active Version 차이 요약 | 읽기 |
| 파일 관리 | 이미지 검색, URL Import, 메타데이터 작성 | 제한된 파일 권한 |
| Flow 실행 | 검토 요청 또는 승인 요청 Flow 시작 | 특정 Flow만 실행 |
| 현황 보고 | 변경 내역, 미사용 자산, 실패 설정 요약 | 읽기 |

### MCP에 허용하지 않을 기능

- Agent·Prompt의 자동 활성화
- 운영 콘텐츠의 자동 공개
- Collection·Field의 운영 중 무단 변경
- 데이터와 파일의 자동 영구 삭제
- API Key·Token·Authorization Header 조회
- 제한 없는 Flow 실행

## 7. 기능별 최종 담당 구분

| 담당 | 주요 기능 |
|---|---|
| Directus 기본 기능 | 설정·콘텐츠 CRUD, 관계, 권한, 버전, 파일, 변경 이력 |
| Directus Extension | Prompt 검증, 모델 호환성, 레이아웃 편집, 디자인 토큰 미리보기 |
| Directus MCP | AI 기반 검색, Draft, 번역, 누락 확인, 비교, 보고 |
| 프로모션 서비스 | Agent 실행, AI 호출, 작업 상태, Snapshot, 품질검사, Preview, Export |
| Secret Manager | OpenAI·Gemini Key, Directus Token, DB·Blob·외부 서비스 인증정보 |

## 8. 적용 케이스 비교

| 케이스 | 구성 | 장점 | 한계 | 판단 |
|---|---|---|---|---|
| A. Directus만 관리자에 적용 | 자체 어드민을 Directus Studio로 교체 | 빠르게 관리 화면과 권한 확보 | 전문 검증과 기존 서비스 연결 필요 | 1차 도입 |
| B. Directus + MCP 관리 | A + MCP 조회·Draft 지원 | 운영 검색·번역·정리 효율 향상 | 승인·삭제 권한 통제 필요 | 권장 |
| C. Directus + Agent Control Plane | B + Agent 정의·Workflow·Model 관리 | Agent 교체·버전·추적 용이 | Runner·Orchestrator 개발 필요 | 최종 목표 |
| D. 사용자 서비스가 MCP 직접 사용 | 사용자 요청마다 MCP로 설정 조회 | 구조가 단순해 보임 | 지연·안정성·권한·재현성 문제 | 비권장 |
| E. 모든 실행을 Directus Flow로 이동 | Directus가 AI 실행까지 담당 | 관리 지점 통합 | 복잡한 생성·재시도·QA 구현 부담 | 제한적 사용 |

권장 경로는 **A → B → C**다. 사용자 서비스가 MCP를 직접 호출하는 D 방식은 사용하지 않는다.

## 9. 데이터 배치 방향

### Directus로 이동

- Prompt·Model·Agent 정의와 Version
- Component·Section·Template·Layout 설정
- Design Token과 Translation
- 운영 콘텐츠와 파일 메타데이터
- 작성·검토·활성·공개 상태
- 관리자 Activity·Revision

### 기존 서비스 DB에 유지

- 프로모션 생성 Run
- Agent Run과 단계별 상태
- 실행 Snapshot
- Proposal·Revision·Rollback 정보
- 생성 결과와 품질검사 결과
- Retry·Idempotency·비용·오류 정보

### Secret Manager에 유지

- OpenAI·Gemini API Key
- Directus 서비스 Token
- Database·Blob Credential
- 외부 시스템 인증정보

## 10. 권장 전환 순서

```text
1. 현재 설정 데이터와 사용 API 고정
              ↓
2. Directus Collection·관계·권한 구성
              ↓
3. 기존 설정을 Directus로 복사
              ↓
4. Prompt 검증·Layout Editor Extension 연결
              ↓
5. 기존 API와 Directus 결과 병렬 비교
              ↓
6. 사용자 서비스의 설정 조회를 Directus API로 전환
              ↓
7. MCP를 읽기 전용으로 연결
              ↓
8. MCP Draft 작성 권한 추가
              ↓
9. Agent Runner·Orchestrator 단계적 적용
              ↓
10. 복구 검증 후 기존 어드민 종료
```

전환 기간에는 기존 어드민과 Directus 양쪽에서 동시에 설정을 수정하지 않는다. 원본 시스템을 하나만 지정하고 다른 쪽은 읽기 전용으로 운영한다.

## 11. 최종 판단

| 질문 | 답변 |
|---|---|
| 기존 어드민 화면을 완전히 없앨 수 있는가? | 가능. Directus Studio와 필요한 Extension이 준비된 이후 가능하다. |
| 모든 관리자 로직을 Directus 기본 기능으로 대체할 수 있는가? | 불가능. Prompt 검증과 Layout Editor 등은 Extension 또는 기존 API가 필요하다. |
| 사용자 서비스를 다시 만들어야 하는가? | 아니다. 설정 조회 Adapter를 변경하고 기존 생성·편집·출력을 유지한다. |
| GPT·Gemini를 MCP만으로 실행할 수 있는가? | 아니다. MCP는 관리 데이터 접근 통로이며 실제 모델 실행기는 별도로 필요하다. |
| MCP가 설정을 자동 공개해도 되는가? | 권장하지 않는다. 활성화·공개·삭제는 사람 승인을 유지한다. |
| 가장 현실적인 목표는 무엇인가? | Directus가 관리자·설정 Control Plane을 맡고 기존 서비스가 생성 Runtime을 맡는 구조다. |

## 참고

- [Directus MCP](https://github.com/directus/mcp)
- [Directus API](https://docs.directus.io/reference/introduction)
- [Directus Collections](https://docs.directus.io/app/data-model/collections)
- [Directus Permissions](https://docs.directus.io/user-guide/user-management/permissions)
- [Directus Files](https://docs.directus.io/reference/files)
