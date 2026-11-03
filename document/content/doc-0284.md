# Visual Template Editor 서비스 플로우

- 작성일: 2026-07-16
- 상태: 서비스 설계안
- 개발 기준: `visual-template-editor-development-plan-2026-07-16.md`(현재 `계획/`로 이동)
- 운영 원칙: n8n 유지, 기존 이미지 생성 파이프라인 병행

> **현행화 메모(2026-07-23)**: 07-16 서비스 설계안이다. 이후 섹션 AI 생성은 **다이렉트 LLM 기반 Section AI V2**(`promo-section-design-*`, `promo-multi-component-layout-plan`, 마이그레이션 029·031·032)로 구현됐고, n8n 경유는 축소 방향이다(정책·기획서 참조). 현행 파이프라인은 `계획/ai-section-auto-design-development-plan-2026-07-23.md`(v2)를 정본으로 본다.

서비스 구분:

- **기존 Promo Wizard**: 현재 구현된 4단계 이미지 생성 서비스. 별도로 유지한다.
- **Visual Editor**: 신규 독립 콘텐츠 편집·디자인 Variant·Web Output 서비스다.
- 이 문서의 사용자 흐름은 기존 Wizard 수정안이 아니라 신규 Visual Editor 흐름이다.

## 1. 서비스 목표

사용자가 프로모션 콘텐츠를 입력하면 실제 Vue 웹페이지에서 즉시 확인하고, AI가 생성한 디자인 Variant와 Section 이미지를 선택·적용한 뒤 동일 Renderer로 최종 웹페이지를 출력한다.

```text
스타일 설정
  -> 콘텐츠 폼 템플릿 선택
  -> 실제 웹 Preview에서 콘텐츠 입력
  -> AI 디자인 Variant 생성·선택
  -> Section 이미지 생성·확정
  -> 최종 Web Output 검증·완료
```

Preview와 최종 Web Output은 동일 Renderer와 동일 Snapshot을 사용한다.

## 2. 전체 서비스 구성

```text
[관리자]
  Form Template / Section / Item 관리
  Renderer 연결 및 Default 지정
  n8n Webhook / Model / Prompt 관리
                |
                v
[Visual Editor 사용자]
  Style & Template
  Content Editing
  AI Design Variants
  Final Web Output
                |
                v
[Application API]
  입력 검증 / Snapshot / Run 상태 / Callback 검증
                |
                v
[n8n]
  Integrated Brief / Design Spec / Section Asset 생성
                |
                v
[Vue Renderer]
  Preview와 Final Web Output 공동 렌더링
```

## 3. 관리자 사전 설정 플로우

### 3.1 콘텐츠 폼 구성

```text
관리자 로그인 또는 보호된 관리자 환경 진입
  -> 프로모션 폼관리
  -> Form Template 생성 또는 초안 수정
  -> Section 생성
  -> Section Item 생성
  -> 필수값·노출·고정·사용자 순서 변경 설정
  -> 템플릿 활성화
```

관리 결과는 어떤 콘텐츠를 입력받을지 결정하며 실제 웹 디자인을 저장하지 않는다.

### 3.2 Renderer 연결

```text
Form Template 선택
  -> 호환 Renderer 목록 조회
  -> Renderer 연결
  -> Default Renderer 지정
  -> 활성 상태 확인
  -> 공개 Wizard 설정 반영
```

규칙:

- Form Template 하나에 Renderer 여러 개를 연결할 수 있다.
- active Form Template에는 active Default Renderer 하나가 반드시 필요하다.
- 호환 Renderer가 없으면 템플릿 활성화를 차단하거나 설정 경고를 표시한다.

### 3.3 AI 실행 설정

```text
LLM 및 프롬프트 관리
  -> Integrated Brief 설정
  -> Design Spec 설정
  -> Section Asset 설정
  -> Model과 Prompt 활성화

Webhook 설정
  -> n8n stage별 URL 등록
  -> 연결 테스트
  -> active 설정 저장
```

## 4. 사용자 Visual Editor 플로우

### 4.1 Visual Editor: Style & Template

사용 목적은 콘텐츠 입력 전에 기본 시각 방향과 사용할 콘텐츠 구조를 결정하는 것이다.

```text
Visual Editor 진입
  -> 배경색 선택
  -> 글자색 선택
  -> CTA 스타일 선택
  -> 톤 또는 스타일 옵션 선택
  -> Form Template 예시 확인
  -> Form Template 선택
  -> 다음 단계
```

저장 데이터:

- Style Setup
- Form Template ID/Version
- `configRevision`
- Default Renderer ID/Version

예외 처리:

- active 템플릿 없음: 진행 차단
- Default Renderer 없음: 설정 오류 안내 후 진행 차단
- 템플릿 설정 변경: 최신 Revision 재조회 안내

### 4.2 Visual Editor: Content Editing

사용자는 실제 웹페이지 형태를 보면서 프로모션 콘텐츠를 입력한다.

### 기본 화면

```text
L: Section 목록
M: 실제 Vue Renderer Preview
R: 선택한 Item 편집 패널
```

### 입력 흐름

```text
Section 선택
  -> Preview에서 Section 강조
  -> Item 선택
  -> R 패널에 입력 UI 표시
  -> 콘텐츠 입력
  -> sectionInputs 갱신
  -> Preview 즉시 반영
  -> 자동 임시 저장
```

지원 Item:

- Text
- Multi-line Text
- Image
- Image + Description
- CTA Button
- 알려지지 않은 Item은 Generic Item Renderer 적용

### 순서 변경

```text
Section 또는 Item 이동 시도
  -> userReorderAllowed 확인
  -> fixedPosition / isLocked 확인
  -> 허용: UI 즉시 이동 후 저장
  -> 불가: 원위치 유지 및 이유 표시
```

### 다음 단계 검증

```text
다음 버튼
  -> 필수 Section 확인
  -> 필수 Item 확인
  -> URL·CTA·이미지 값 검증
  -> configRevision 확인
  -> Content Snapshot 저장
  -> Generation Run 생성 또는 갱신
  -> AI Design Variants 화면 이동
```

검증 실패 시 해당 Section과 Item으로 이동시키고 누락값을 표시한다.

### 4.3 Visual Editor: AI Design Variants

기존 전체 페이지 LO-FI 이미지를 실제 DOM 기반 Design Variant로 대체하는 단계다.

### 초기 상태

```text
Design Variants 화면 진입
  -> Content Snapshot 확인
  -> 기존 Design Spec 후보 조회
  -> 후보 있음: 목록 표시
  -> 후보 없음: 생성 대기 상태 표시
```

### Integrated Brief 처리

```text
Design Variant 생성 요청
  -> Integrated Brief ready 여부 확인
  -> 없음: n8n Integrated Brief Worker 실행
  -> n8n ack 수신
  -> Wizard polling
  -> callback 검증 및 Brief 저장
  -> coverage validation
      -> 실패: 보완 또는 재생성
      -> 성공: Design Spec 생성 진행
```

병행 운영 중 Integrated Brief는 `briefContractVersion`을 포함한다. 기존 이미지 Worker용 필드와 신규 Design Spec용 필드를 구분한다.

### Design Spec 생성

```text
Application이 Design Spec attempt 생성
  -> n8n Design Spec Worker 호출
  -> n8n ack
  -> LLM Structured JSON 생성
  -> callback API 호출
  -> contractVersion / attempt / Schema 검증
      -> 실패: failed 저장, 재생성 제공
      -> 성공: ready 저장
  -> 동일 Vue Renderer에 Spec 적용
  -> Variant 카드 또는 Preview로 표시
```

재생성 규칙:

- 기존 Variant는 삭제하지 않는다.
- 새 attempt를 추가한다.
- ready 후보 여러 개를 비교할 수 있다.
- 후보 선택 전 최종 단계로 이동할 수 없다.

### Section Asset 생성

```text
Design Spec의 assetRequests 확인
  -> 필요한 Asset별 DB 레코드 생성
  -> n8n Section Asset Worker 병렬 실행
  -> 각 Asset callback
  -> MIME/크기/Run 연관 관계 검증
  -> Renderer Preview에 순차 반영
```

Asset별 상태:

- `queued`: 대기 중
- `generating`: 생성 중
- `ready`: 완료
- `failed`: 실패

Asset 재생성 시 기존 성공 결과를 유지하고 새 attempt를 추가한다.

### Variant 선택

```text
Variant Preview 비교
  -> Desktop/Mobile 확인
  -> Variant 선택
  -> 선택 Design Spec ID 저장
  -> 필수 Asset 상태 확인
  -> Final Web Output 화면 이동
```

### 4.4 Visual Editor: Final Web Output

선택한 결과를 실제 웹페이지로 확정하는 단계다.

### Final Snapshot 생성

```text
Final Web Output 화면 진입
  -> 선택 Design Spec 확인
  -> Renderer ID/Version 확인
  -> Content Snapshot 확인
  -> Asset Manifest 확인
  -> Web Output attempt 생성
  -> immutable Final Snapshot 저장
```

### 렌더링과 QA

```text
동일 Vue Renderer 실행
  -> Desktop 1440px 렌더링
  -> Tablet 768px 렌더링
  -> Mobile 375px 렌더링
  -> 콘텐츠 coverage 검사
  -> overflow/겹침 검사
  -> CTA URL/UTM 검사
  -> heading/접근성 검사
      -> 실패: failed, 원인 및 재실행 표시
      -> 성공: ready
```

### 완료 화면

- Desktop/Mobile Preview
- 생성 상태와 QA 결과
- 사용한 Form Template/Renderer/Design Spec Version
- Web Output 생성 이력
- 재생성
- 운영 정책에 따른 미리보기 URL 또는 배포 기능

## 5. 시스템 상태 플로우

### 5.1 Generation Run

```text
draft
  -> content_ready
  -> brief_queued
  -> brief_generating
  -> brief_ready
  -> design_spec_generating
  -> design_spec_ready
  -> assets_generating
  -> variant_selected
  -> web_output_validating
  -> ready
```

오류 상태는 Run 전체를 바로 폐기하지 않고 해당 하위 작업에 저장한다. 사용자는 마지막 정상 단계부터 재시도할 수 있다.

### 5.2 Design Spec

```text
queued -> generating -> validating -> ready
                    \-> failed
```

### 5.3 Web Output

```text
queued -> rendering -> validating -> ready
                  \-> failed
```

## 6. n8n 호출 및 Callback 플로우

```text
Application
  -> 대상 레코드 queued 생성
  -> n8n Webhook 호출
       payload: runId, targetId, attempt, contractVersion
  <- 짧은 ack

n8n
  -> 관리자 Model/Prompt 설정 조회
  -> LLM 또는 이미지 모델 실행
  -> 결과 구성
  -> Application callback

Application callback
  -> targetId와 runId 관계 확인
  -> attempt와 contractVersion 확인
  -> 허용 상태 전이 확인
  -> 중복 callback 확인
  -> 결과 Schema 검증
  -> Snapshot/metadata 저장
  -> ready 또는 failed 처리
```

Callback은 동일 요청이 여러 번 와도 결과가 중복되지 않는 idempotent 방식이어야 한다.

## 7. 실패 및 재시도 플로우

### n8n ack 실패

```text
Webhook 호출 실패
  -> 대상 상태 failed
  -> 오류 메시지 저장
  -> 재시도 버튼 제공
```

### n8n 실행 중 timeout

```text
마지막 updatedAt이 stage stale 기준 초과
  -> stale 표시
  -> 실행 상태 재확인
  -> 사용자가 새 attempt로 재시도
```

### 잘못된 LLM 응답

```text
JSON parse 또는 Schema validation 실패
  -> 원본 응답 metadata 보관
  -> failed 처리
  -> 수정 Prompt로 새 attempt 생성
```

### Asset 부분 실패

```text
일부 Asset 실패
  -> 성공 Asset 유지
  -> 실패 Asset만 재생성
  -> 필수 Asset 준비 전 Final 확정 차단
```

### Web Output QA 실패

```text
coverage/overflow/accessibility 실패
  -> Web Output failed
  -> 실패 항목 표시
  -> Content 또는 Variant 수정
  -> 새 Web Output attempt 생성
```

## 8. 기존 이미지 파이프라인 병행 플로우

Feature Flag에 따라 실행 경로를 선택한다.

```text
Generation Run 시작
  -> renderer_pipeline_enabled 확인
      -> false: 기존 Integrated Brief -> LO-FI -> Confirm -> Final Image
      -> true:  Integrated Brief -> Design Spec -> Section Asset -> Web Output
```

운영 원칙:

- 기존 LO-FI/Final Workflow와 데이터는 즉시 삭제하지 않는다.
- 신규 Renderer Pipeline 장애 시 기존 경로로 복귀할 수 있어야 한다.
- 기존 Run은 계속 조회 가능하게 유지한다.
- 신규 트래픽 100% 전환과 운영 승인 이후에만 전체 페이지 이미지 Worker 비활성화를 검토한다.
- n8n 자체는 이후에도 Design Spec과 Section Asset 실행기로 유지한다.

## 9. 사용자에게 보이는 진행 상태

기술 stage 이름을 그대로 노출하지 않고 사용자 중심으로 표시한다.

| 내부 상태 | 사용자 표시 |
|---|---|
| `queued` | 대기 중 |
| `generating` | 생성 중 |
| `validating` | 결과 확인 중 |
| `ready` | 완료 |
| `failed` | 생성 실패 |
| `stale` | 응답 지연 |

상태 색상:

- 대기 중: 중립색
- 생성 중/확인 중: 진행색
- 완료: 성공색
- 실패/응답 지연: 오류 또는 경고색

## 10. 핵심 Source of Truth

| 데이터 | Source of Truth |
|---|---|
| 콘텐츠 입력 | `sectionInputs` 및 Content Snapshot |
| 콘텐츠 구조 | Form Template/Section/Item Snapshot |
| 웹 레이아웃 | Renderer ID/Version |
| 시각 Variant | 선택된 Design Spec Snapshot |
| 이미지 | Asset Manifest Snapshot |
| 실행 상태 | Application DB Generation Run |
| LLM 실행 | n8n Execution 및 Application callback metadata |
| 최종 출력 | Web Output immutable Snapshot |

n8n 실행 데이터나 Integrated Brief가 사용자 원문을 대신하는 유일한 Source of Truth가 되어서는 안 된다.

## 11. 서비스 완료 조건

1. 관리자가 구성한 모든 Wizard-visible 콘텐츠가 Visual Editor에 표시된다.
2. 사용자 입력이 실제 Vue Preview에 즉시 반영된다.
3. Design Spec은 콘텐츠 원문을 변경하지 않는다.
4. 재생성한 Variant와 Asset은 기존 결과를 유지한다.
5. 선택한 Variant와 Final Web Output이 동일 Renderer로 출력된다.
6. 필수 콘텐츠 coverage와 반응형 QA를 통과한 결과만 완료된다.
7. n8n 실패, timeout, callback 오류를 사용자가 재시도할 수 있다.
8. 기존 LO-FI/Final 이미지 경로가 Feature Flag로 유지된다.
