# WordPress에서 Directus로 전환

## 전환 목적

현재 WordPress에서 관리하는 콘텐츠, 이미지, 사용자 권한, 게시 상태를 Directus로 이전한다.

Directus는 콘텐츠를 관리하고 API로 제공하며, Directus MCP는 AI를 이용한 콘텐츠 검색·작성·번역·검토를 지원한다.

## 구조 변화

```text
현재
WordPress 관리자
  └─ 콘텐츠·이미지·권한·게시 관리

변경 후
Directus Studio
  └─ 콘텐츠·이미지·권한·게시 관리
             ↑
Directus MCP
  └─ AI 기반 검색·초안·번역·검토 지원
```

## 주요 변경 내용

| 구분 | 현재 WordPress | Directus 전환 후 |
|---|---|---|
| 관리자 화면 | WordPress 관리자 | Directus Studio |
| 콘텐츠 저장 | 게시글·페이지·Custom Field | Collection과 Field |
| 이미지 관리 | WordPress Media Library | Directus File Library |
| 데이터 제공 | WordPress REST API | Directus REST·GraphQL API |
| 사용자 권한 | WordPress Role | Directus Role·Policy |
| 작성·승인·게시 | WordPress 게시 상태 | Draft·Review·Published Workflow |
| 변경 이력 | 플러그인 또는 별도 관리 | Activity·Revision |
| AI 관리 | 별도 기능 필요 | Directus MCP 활용 |

## Directus MCP 활용 예시

- “게시 예정인 콘텐츠를 보여줘.”
- “영문 번역이 없는 콘텐츠를 찾아줘.”
- “기존 콘텐츠를 바탕으로 새 초안을 작성해줘.”
- “지난주 변경된 내용을 요약해줘.”
- “사용하지 않는 이미지를 찾아줘.”

AI는 검색과 초안 작성을 지원하고, 최종 승인·게시·삭제는 사람이 처리하도록 권한을 제한한다.

## MCP가 웹페이지도 만들어 주는가?

Directus MCP의 기본 역할은 **Directus 안의 콘텐츠를 찾고, 작성하고, 수정하는 것**이다.

| 작업 | Directus MCP만으로 가능 여부 |
|---|---|
| 저장된 콘텐츠 검색 | 가능 |
| 자연어로 콘텐츠 초안 작성 | 가능 |
| 제목·본문·이미지 정보 저장 | 가능 |
| 기존 웹페이지 미리보기 연결 | 가능하지만 별도 웹사이트 필요 |
| 콘텐츠를 디자인된 웹페이지로 변환 | 불가능 |
| 새로운 레이아웃 자동 생성 | 불가능 |
| 웹페이지 배포·호스팅 | 불가능 |

Directus의 Live Preview와 Visual Editing도 웹페이지를 새로 만드는 기능은 아니다. 이미 개발된 웹사이트를 Directus 안에 연결해 콘텐츠 변경 결과를 보여주는 기능이다.

## 별도 빌더 없이 웹페이지를 만들려면

별도의 빌더가 없어도 다음 구조를 미리 개발하면 웹페이지를 만들 수 있다.

```text
자연어 요청
   ↓
AI가 Directus MCP로 콘텐츠 등록
   ↓
Directus에 저장된 페이지·섹션 데이터
   ↓
미리 개발된 웹페이지 템플릿·Renderer
   ↓
웹페이지 표시·배포
```

이 방식에서는 AI가 제목, 본문, 이미지, 사용할 템플릿을 정할 수 있다. 그러나 실제 화면 디자인과 배치는 미리 개발된 템플릿과 Renderer가 담당한다.

완전히 새로운 디자인을 자연어만으로 생성하려면 다음 기능을 별도로 개발해야 한다.

- 페이지와 섹션 구조를 결정하는 AI Agent
- 사용할 Component와 Layout 규칙
- 화면을 만드는 Renderer
- Desktop·Mobile 품질검사
- Preview와 승인 기능
- 실제 웹페이지 배포 기능

따라서 **고정된 템플릿 기반 페이지는 별도 빌더 없이 구현할 수 있지만, 자유로운 디자인의 프로모션 페이지는 Directus와 MCP만으로 만들 수 없다.**

## 전환 시 필요한 작업

1. WordPress의 콘텐츠와 필드 구조 확인
2. Directus Collection과 Field 설계
3. 게시글·페이지·이미지 데이터 이전
4. 사용자 역할과 권한 재구성
5. 기존 URL과 Directus 데이터 연결
6. 데이터와 화면 결과 비교
7. MCP를 조회 기능부터 단계적으로 적용
8. 안정화 후 WordPress 관리자 사용 종료

## 핵심 정리

- WordPress의 콘텐츠 관리 기능을 Directus로 교체한다.
- 콘텐츠는 Directus에서 관리하고 REST·GraphQL API로 제공한다.
- Directus MCP는 AI 기반 콘텐츠 관리 도우미로 사용한다.
- 승인·게시·삭제는 사람이 최종 결정한다.
- 데이터 이전과 기존 URL 유지 여부를 먼저 검증해야 한다.
