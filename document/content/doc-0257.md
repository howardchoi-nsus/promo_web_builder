# Development Plan - B Section Redesign and Dark Mode

작성일: 2026-07-03

## 목적

B섹션 프로모션 빌더를 현재 POC 목표에 맞게 단순화하고, 사용자가 프로모션 정보 입력부터 n8n 디자인 생성 요청까지 한 흐름으로 이해할 수 있도록 재구성한다.

이번 변경의 핵심은 기존 `3. 섹션 초안` 단계를 제거하고, 섹션/아이템 구성 기능을 `2. 프로모션 입력 및 섹션 구성` 안으로 통합하는 것이다. `3. 디자인 생성`은 n8n Webhook URL을 수동으로 입력하고 생성 상태를 확인하는 POC 실행 콘솔로 정리한다.

동시에 웹 상단에 Light/Dark 컬러 모드 토글을 추가하고, 다크모드는 아래 팔레트를 기준으로 적용한다.

```text
#0D0E10 : 전체 앱 배경
#0C3B2E : 깊은 패널 / 헤더 / 선택 영역
#0F7A62 : 브랜드 포인트 / active 상태
#28C39D : primary action / focus / loading motion point
#CFEEE6 : 본문 텍스트 / 보조 강조
```

## 변경 대상 범위

주요 변경 파일 후보:

```text
prototype/index.html
prototype/app.js
prototype/styles.css
docs/default-temp-b-section-schema.json
docs/template-4-b-section-default.json
docs/b-section-usage-guide.md
api/_promo-markdown-builders.js
prompts/promo-integrated-design-brief-generation.md
prompts/promo-ui-design-image-generation.md
n8n/promo-ui-design-image-generator.workflow.json
```

## 검토 후 보강 사항

계획서 검토 결과, 아래 항목은 구현 전에 반드시 명확히 해야 한다.

1. `docs/default-temp-b-section-schema.json`을 B2/B3의 canonical schema로 본다.
2. `docs/template-4-b-section-default.json`은 Template 4 설명/예시 문서로 유지하고, 실제 UI와 payload 기준은 canonical schema에 맞춘다.
3. `docs/b-section-usage-guide.md`는 사용자/운영자용 설명 문서로 유지한다.
4. n8n workflow는 프론트 payload와 같은 구조를 받도록 별도 동기화가 필요하다.
5. 이미지 저장 API는 POC라 하더라도 공개 입력을 받는 경로이므로 URL fetch 보안 검토가 필요하다.

## 목표 화면 흐름

변경 후 B섹션 단계:

```text
1. 디자인 모드 선택
2. 프로모션 입력 및 섹션 구성
3. 디자인 생성
```

기존 `3. 섹션 초안`은 삭제한다.

## Task 1. B섹션 Step 구조 재정의

### 작업 내용

- Stepper를 3단계로 재구성한다.
- 기존 `3. 섹션 초안` UI를 제거한다.
- 기존 `4. 생성` 또는 생성 관련 액션은 `3. 디자인 생성`으로 이동한다.
- `다음`, `이전`, `생성` 버튼의 이동 조건을 새 단계 기준으로 재정의한다.
- 기존 섹션 초안 관련 상태와 메서드는 바로 삭제하지 않고, B2 초기값 생성에 필요한 부분과 제거 가능한 부분을 먼저 분리한다.

### 완료 기준

- 화면에 아래 단계만 표시된다.

```text
1. 디자인 모드 선택
2. 프로모션 입력 및 섹션 구성
3. 디자인 생성
```

- 삭제된 섹션 초안 단계로 접근하는 UI/상태가 없다.
- 기존 생성 payload가 빈 `sectionInputs`로 생성되지 않는다.

## Task 2. B2 프로모션 입력 및 섹션 구성 UX

### 작업 내용

B2를 두 영역으로 나눈다.

```text
B2-1. 기본 프로모션 입력
B2-2. 섹션/아이템 구성
```

기본 프로모션 입력 항목:

```text
마켓 / 지역
프로모션 제목
프로모션 목적
기타 목적
주요 혜택
유도 행동
CTA 문구
CTA URL
대상 고객
캠페인 톤
이용약관
```

섹션 구성 대상:

```text
Header
Hero Banner
Step Bar
Contents 또는 Content CTA
Image Text Row
Title and Description
Footer
```

섹션별 속성:

```text
sectionId
label
required
visible
visibilityEditable
orderChangeAllowed
fixedPosition
items
```

아이템별 속성:

```text
itemId
label
required
visible
visibilityEditable
imageGenerationMode
description
value
```

`imageGenerationMode`는 단순 Y/N 대신 아래 값으로 정리하는 것을 권장한다.

```text
none
generate
upload_or_reference
brand_asset
```

### UX 원칙

- 필수 섹션은 기본 ON이다.
- 필수 아이템은 섹션이 ON일 때 자동 ON이다.
- 필수 아이템은 사용자가 끄지 못하게 하거나, 끄면 생성 불가 사유를 명확히 표시한다.
- 선택 섹션과 선택 아이템은 접고 펼치는 카드 UI로 제공한다.
- `Header`, `Footer`는 위치 고정 표시를 제공한다.
- `Hero Banner`, `Step Bar`, `Contents`, `Image Text Row`, `Title and Description`은 순서 변경 가능 영역으로 본다.
- B2는 최초 진입 시 자동 초깃값을 제안할 수 있지만, 사용자가 수정한 값은 자동 갱신으로 덮어쓰지 않는다.
- 내부 섹션명은 UI 편집 라벨로만 쓰고, 이미지 생성 visible copy로 전달하지 않는다.

### Header/Footer 정책

Header와 Footer는 웹페이지 신뢰도와 법적 고지에 영향을 주므로 기본 ON으로 둔다.

권장 정책:

```text
Header: fixed_top, defaultVisible=true, visibilityEditable=false
Footer: fixed_bottom, defaultVisible=true, visibilityEditable=false
```

단, POC에서 사용자가 Header/Footer를 숨겨야 하는 요구가 있으면 아래 조건을 따른다.

```text
section visible=false이면 내부 필수 item 검증을 건너뛴다.
section visible=true이면 필수 item 검증을 적용한다.
```

### 완료 기준

- B2에서 프로모션 기본 정보와 섹션/아이템 구성을 모두 확인할 수 있다.
- 사용자가 B3로 넘어가기 전 필수 누락 항목을 알 수 있다.
- 섹션/아이템 구성값이 payload에 포함된다.

## Task 3. B3 디자인 생성 POC 콘솔

### 작업 내용

B3는 편집 화면이 아니라 생성 실행 화면으로 구성한다.

필수 기능:

```text
n8n Webhook URL 수동 입력
생성 버튼 활성/비활성
생성 중 상태 표시
성공 상태 표시
실패 상태 표시
재시도
결과 열기
이미지 열기
프롬프트 MD 보기
```

생성 버튼 활성 조건:

```text
디자인 MD 선택 완료
B1 디자인 모드 선택 완료
B2 필수 프로모션 입력 완료
필수 섹션/아이템 구성 완료
n8n Webhook URL 입력 완료
현재 생성 중이 아님
```

Webhook URL 검증 기준:

```text
http 또는 https URL 형식
POC 기본값은 비워 둘 수 있음
생성 클릭 전에는 필수
운영 전환 시 allowlist 또는 서버 저장 방식 검토
```

### 상태 문구

실제 진행률을 알 수 없으므로 숫자형 progress는 쓰지 않는다. 상태 문구만 순환한다.

```text
디자인 브리프를 정리하고 있어요
프로모션 섹션을 조합하고 있어요
UI 디자인 이미지를 생성하고 있어요
결과를 저장하고 있어요
```

### 완료 기준

- Webhook URL이 없으면 생성 버튼이 비활성화되거나 명확한 오류를 보여준다.
- 생성 중 중복 클릭이 막힌다.
- 성공/실패 후 사용자가 다음 행동을 바로 선택할 수 있다.

## Task 4. 생성 중 포커 테마 애니메이션

### 작업 내용

일반 progress bar 대신 포커 테마 loading motion을 적용한다.

추천 구성:

```text
포커칩 회전
카드 3장 셔플
상태 문구 순환
```

애니메이션 원칙:

- 진행률 숫자를 표현하지 않는다.
- 생성이 멈춘 것처럼 보이지 않게 한다.
- 운영툴 안에 들어간 작은 브랜드 모션 정도로 유지한다.
- 다크모드에서는 `#28C39D`를 주요 모션 포인트로 사용한다.

상태별 모션:

```text
생성 전: 정적 아이콘 또는 생성 버튼
생성 중: 포커칩 회전 + 카드 셔플
성공: 체크 상태
실패: 오류 상태
```

### 완료 기준

- 생성 중 사용자가 기다리는 상태를 명확히 인지한다.
- 애니메이션이 레이아웃을 밀거나 버튼 위치를 흔들지 않는다.
- light/dark 양쪽에서 시인성이 유지된다.

## Task 5. 컬러 모드 토글

### 작업 내용

- 웹 상단에 Light/Dark 모드 토글을 추가한다.
- 현재 라이트 톤앤매너는 유지한다.
- 다크모드 선택값은 `localStorage`에 저장한다.
- 초기 로딩 시 저장된 테마를 복원한다.

추천 상태값:

```text
themeMode: "light" | "dark"
```

### 완료 기준

- 새로고침 후에도 선택한 모드가 유지된다.
- 라이트모드 기존 색감이 크게 변하지 않는다.
- 다크모드에서 주요 UI 요소가 모두 읽힌다.

## Task 6. 다크모드 CSS 변수화

### 작업 내용

CSS 변수 기반으로 라이트/다크 테마를 분리한다.

다크모드 권장 변수:

```css
[data-theme="dark"] {
  --bg: #0D0E10;
  --surface: #121416;
  --surface-soft: #151A18;
  --surface-strong: #0C3B2E;
  --accent: #0F7A62;
  --accent-strong: #28C39D;
  --text: #CFEEE6;
  --muted: rgba(207, 238, 230, 0.68);
  --border: rgba(207, 238, 230, 0.14);
}
```

적용 대상:

```text
body
상단 헤더
A/B/C 패널
모달
버튼
input / select / textarea
카드
테이블
상태 배지
생성 중 애니메이션
```

### 완료 기준

- 주요 화면에서 흰 배경/검은 텍스트가 다크모드에 남지 않는다.
- input, select, textarea의 placeholder와 focus 상태가 읽힌다.
- 버튼 active/disabled 상태가 구분된다.

## Task 7. Payload / Markdown / n8n 연동 정리

### 작업 내용

새 B2 구조를 생성 payload에 반영한다.

payload 권장 구조:

```json
{
  "sectionConfig": {
    "orderedSections": [],
    "sectionVisibility": {},
    "itemVisibility": {},
    "fixedSections": {
      "header": "top",
      "footer": "bottom"
    },
    "imageGenerationTargets": []
  }
}
```

기존 `sectionInputs`, `templateRuntime`, `imageGenerationTargets`와 중복되지 않도록 역할을 정리한다.

권장 역할:

```text
sectionInputs: 실제 visible copy와 입력값
sectionConfig: 섹션/아이템 노출, 순서, 이미지 생성 요청 정책
templateRuntime: canonical schema에서 계산된 템플릿 런타임 정보
imageGenerationTargets: 이미지 생성 요청이 필요한 item 목록
```

필수 연동:

- `api/_promo-markdown-builders.js`가 새 섹션 구성값을 Section Input Log MD에 기록한다.
- `prompts/promo-integrated-design-brief-generation.md`가 새 섹션/아이템 구성 정책을 반영한다.
- `prompts/promo-ui-design-image-generation.md`가 visible item과 image generation target만 이미지 프롬프트에 반영하도록 지시한다.
- `n8n/promo-ui-design-image-generator.workflow.json`의 Normalize Payload가 새 필드를 누락하지 않는다.
- canonical n8n JSON이 최신 생성 방식과 맞는지 확인한다.

### 완료 기준

- 프론트 payload와 n8n normalized payload가 같은 구조를 유지한다.
- `marketVisualGuidance`가 n8n에서 누락되지 않는다.
- 섹션명은 내부 구조명으로 유지되고 visible UI copy로 렌더링되지 않는다.
- `sectionConfig`, `templateRuntime`, `imageGenerationTargets`가 Section Input Log MD에 기록된다.
- canonical n8n workflow가 실제 운영/import 대상과 일치한다.

## 리스크 점검

### R1. B2가 과밀해질 리스크

위험도: 높음

원인:

- 기본 프로모션 입력과 섹션/아이템 제어가 한 단계에 합쳐진다.
- 특히 `Contents`, `Title and Description`은 입력 자유도가 높다.

대응:

- 섹션 카드를 접고 펼치는 구조로 만든다.
- 필수 섹션만 기본 펼침 처리한다.
- 선택 섹션은 요약 상태로 둔다.
- B2 내부를 `기본 입력`과 `섹션 구성`으로 시각적으로 분리한다.

### R2. 기존 `sectionInputs` 로직과 충돌할 리스크

위험도: 높음

원인:

- 기존 `refreshSectionDraft`, `sectionInputsForPayload`, `buildTemp4Draft`가 섹션 초안 흐름을 전제로 한다.
- 3단계를 삭제해도 내부 로직이 자동 초안을 다시 만들 수 있다.

대응:

- `sectionInputs`는 유지하되, B2 입력/섹션 구성값에서 생성되는 canonical payload로 재정의한다.
- 초안 자동 갱신은 초기값 생성 용도로만 제한한다.
- 사용자가 수정한 섹션/아이템 구성값을 자동 갱신으로 덮어쓰지 않는다.

### R3. n8n payload 누락 리스크

위험도: 높음

원인:

- 최근 코드 리뷰에서 canonical n8n workflow가 `marketVisualGuidance`를 누락하는 문제가 확인됐다.
- 새 필드가 프론트에는 있지만 n8n Normalize Payload에서 빠질 수 있다.
- canonical n8n workflow가 문서상 최신 이미지 생성 방식과 다를 수 있다.

대응:

- 프론트 payload와 n8n normalized payload를 비교하는 QA 샘플을 만든다.
- Normalize Payload 노드에 `marketVisualGuidance`, `sectionConfig`, `imageGenerationTargets`, `designMode`, `selectedTemplateId`를 명시적으로 포함한다.
- n8n workflow는 "현재 운영 import 대상"과 "실험용 JSON"을 구분해서 관리한다.
- Gemini 2K HTTP 방식으로 갈지, OpenAI image API 방식을 유지할지 구현 전에 확정한다.

### R4. 생성 상태가 실제 진행률처럼 오해될 리스크

위험도: 중간

원인:

- n8n 실행 진행률을 실시간으로 알 수 없다.
- progress bar나 퍼센트를 표시하면 실제 상태처럼 오해될 수 있다.

대응:

- 숫자 progress를 쓰지 않는다.
- 포커칩/카드 애니메이션은 작업 중 상태 표시로만 사용한다.
- 문구에 `보통 1~2분 정도 걸릴 수 있어요`처럼 대기 안내를 제공한다.

### R5. 다크모드 범위 누락 리스크

위험도: 중간

원인:

- 기존 CSS가 변수 기반이 아니면 하드코딩 색상이 많이 남을 수 있다.
- 모달, 테이블, input, 배지, 스크롤 영역에서 대비 문제가 생길 수 있다.

대응:

- CSS 변수를 먼저 정의한 뒤 큰 영역부터 적용한다.
- light/dark 모두 같은 컴포넌트 구조를 사용한다.
- 최종 QA에서 주요 화면, 모달, 생성 중 상태, 결과 카드까지 확인한다.

### R6. Header/Footer 노출 정책 혼란

위험도: 중간

원인:

- 표에서는 Header/Footer의 섹션 노출 여부가 선택으로 보이지만, 내부 item은 필수값이다.
- 사용자가 Header를 끄면 Logo/Badges 필수 정책과 충돌할 수 있다.

대응:

- Header/Footer는 기본 ON, 위치 고정으로 둔다.
- 섹션 자체를 끌 수 있게 할지 여부는 별도 정책으로 확정한다.
- 끌 수 있다면 내부 필수 item 검증은 section ON 상태에서만 적용한다.

### R7. 기존 문서와 스키마 불일치

위험도: 중간

원인:

- `docs/b-section-usage-guide.md`, `docs/template-4-b-section-default.json`, `docs/default-temp-b-section-schema.json`에 유사하지만 다른 표현이 공존한다.

대응:

- 구현 전 canonical schema를 하나로 정한다.
- 추천 canonical: `docs/default-temp-b-section-schema.json`
- 사용 가이드와 template json은 canonical schema를 설명하거나 예시화하는 역할로 정리한다.

### R8. 작업 범위 확장 리스크

위험도: 중간

원인:

- B섹션 구조 변경, 생성 UX, 다크모드, n8n 연동이 동시에 포함된다.

대응:

단계별로 나누어 적용한다.

```text
Phase 1: B섹션 step 구조와 B2/B3 UI 정리
Phase 2: payload/markdown/n8n 필드 정렬
Phase 3: 생성 중 포커 테마 애니메이션
Phase 4: 다크모드 적용
Phase 5: QA 및 문서 업데이트
```

### R9. 이미지 저장 API 보안 리스크

위험도: 중간

원인:

- `/api/promo-design-assets`는 `imageUrl`을 받아 서버에서 fetch할 수 있다.
- POC에서는 n8n이 호출하는 경로지만, 공개 API라면 임의 URL 요청 위험이 있다.

대응:

- 가능하면 n8n에서 `imageDataUrl` 또는 base64 image만 전달한다.
- `imageUrl`을 유지해야 하면 허용 도메인 allowlist를 둔다.
- 내부 IP, localhost, metadata endpoint, file URL, redirect를 차단한다.
- 운영 전환 전 API 인증 또는 shared secret을 검토한다.

### R10. 테마 적용 중 라이트모드 회귀 리스크

위험도: 중간

원인:

- 다크모드 변수화를 진행하면서 기존 라이트모드 색상까지 바뀔 수 있다.
- 기존 Admin/Web Builder 톤앤매너 유지가 요구사항이다.

대응:

- 라이트모드 변수를 먼저 현재 색상 기준으로 정의한다.
- 다크모드는 `[data-theme="dark"]` override로만 적용한다.
- 변경 후 라이트모드 스크린샷을 기준으로 회귀 확인한다.

## 권장 구현 순서

1. `docs/default-temp-b-section-schema.json`을 기준으로 canonical B2 schema 확정
2. B섹션 stepper를 3단계로 변경
3. 기존 `3. 섹션 초안` UI 제거
4. B2에 기본 입력 + 섹션/아이템 카드 UI 추가
5. B3에 n8n Webhook URL, 생성 버튼, 생성 상태 영역 추가
6. payload에 새 section config 반영
7. markdown builder와 prompt 문서 반영
8. n8n Normalize Payload와 Persist 흐름 반영
9. 생성 중 포커칩/카드 애니메이션 추가
10. Light/Dark 토글 추가
11. 다크모드 CSS 변수 적용
12. QA 실행

## QA 체크리스트

기능 QA:

- B섹션 step이 3개로 보이는가?
- 기존 섹션 초안 단계가 사라졌는가?
- B2 필수값 누락 시 B3로 넘어가지 않는가?
- 필수 섹션/아이템 누락 시 생성이 막히는가?
- n8n Webhook URL이 없으면 생성이 막히는가?
- 생성 중 버튼 중복 클릭이 막히는가?
- 성공 후 결과 열기/이미지 열기/프롬프트 MD 보기가 가능한가?
- 실패 후 재시도가 가능한가?

Payload QA:

- `designMode`가 포함되는가?
- `selectedTemplateId`가 고급 모드에서 포함되는가?
- `marketVisualGuidance`가 n8n까지 전달되는가?
- `sectionConfig` 또는 동등 구조가 포함되는가?
- `sectionInputs`가 사용자가 수정한 B2 값을 반영하는가?
- 자동 초깃값 생성이 사용자 수정값을 덮어쓰지 않는가?
- `imageGenerationTargets`가 포함되는가?
- 내부 섹션명이 visible UI copy로 전달되지 않는가?
- n8n normalized payload와 프론트 payload가 같은 핵심 필드를 갖는가?

Visual QA:

- 라이트모드 기존 톤이 유지되는가?
- 다크모드에서 텍스트 대비가 충분한가?
- input/select/textarea가 다크모드에서 읽히는가?
- 모달과 sticky footer가 다크모드에서 자연스러운가?
- 포커칩/카드 애니메이션이 과하게 산만하지 않은가?
- 모바일/좁은 화면에서 B2 섹션 카드가 깨지지 않는가?

## 결론

이번 변경은 단순 UI 수정이 아니라 B섹션의 정보 구조와 생성 payload를 함께 바꾸는 작업이다. 가장 큰 리스크는 `프론트에서는 새 구조가 보이지만 n8n에는 예전 구조로 전달되는 상태`다. 따라서 UI 구현과 동시에 payload 샘플, markdown output, n8n normalized payload를 함께 검증해야 한다.

다크모드는 팔레트 자체가 운영툴에 적합하므로 적용 가능성이 높다. 단, 전체 CSS 변수화 범위가 넓기 때문에 B섹션 기능 변경과 별도 phase로 나누어 적용하는 것이 안전하다.

추가 검토 결과, 구현 전에는 canonical schema와 canonical n8n workflow를 먼저 확정하는 것이 가장 중요하다. 이 두 기준이 흔들리면 UI, markdown, prompt, n8n 결과가 서로 다른 구조를 바라볼 수 있다.
