# 무인 Vue 웹페이지 자동 생성 프로세스 검토 및 권고안

- 작성일: 2026-07-14
- 상태: 아키텍처 및 제품 프로세스 권고 / 소스코드 미반영
- 관련 문서: `docs/final-design-vue-webpage-generation-development-plan-2026-07-14.md`
- 대상 흐름: Concept → Content → LO-FI → HI-FI → Web Output

## 1. 검토 배경

현재 목표 프로세스는 다음과 같다.

```text
디자인 콘셉트 선택
→ 프로모션 정보 입력
→ LO-FI 디자인 생성
→ HI-FI 디자인 완료
→ 웹 출력
```

추가로 확정하고자 하는 제품 목표는 다음과 같다.

- 페이지 자동 생성 과정에서 사람의 참여를 최소화하거나 제거한다.
- HI-FI에서 선택된 디자인과 실제 웹페이지가 동일하게 구성되어야 한다.
- 배경 이미지 위에 제목, 설명, CTA 버튼이 올라오는 Hero 디자인을 지원한다.
- 프로모션 문구, URL, 약관은 이미지가 아니라 실제 웹 콘텐츠로 구현한다.
- 최종 결과는 Vue 기반의 실행 가능한 반응형 웹페이지여야 한다.
- 생성 결과는 충분한 디자인 품질을 가져야 한다.

이 목표에서는 “HI-FI 이미지를 먼저 생성한 뒤 LLM이 이미지를 다시 Vue 코드로 해석하는 방식”이 적합한지, 또는 프로세스를 변경해야 하는지가 핵심 검토 사항이다.

## 2. 결론

**사용자에게 보이는 단계 명칭은 유지할 수 있지만, 내부 생성 순서는 변경하는 것이 좋다.**

권장 원칙은 다음과 같다.

> HI-FI 이미지를 기준으로 웹을 다시 추측해 만들지 않고, Vue 웹페이지를 먼저 만든 뒤 브라우저 렌더링 결과를 HI-FI로 사용한다.

현재 방식에 가까운 흐름:

```text
LO-FI
→ 이미지 모델로 HI-FI 이미지 생성
→ HI-FI 이미지를 Vue 코드로 역변환
→ Web Output
```

권장 흐름:

```text
LO-FI 구조 확정
→ 이미지 에셋 및 Vue 코드 생성
→ 브라우저에서 Vue 페이지 렌더링
→ 자동 QA 및 자동 수정
→ 렌더링 스크린샷을 HI-FI 결과로 확정
→ 동일 build artifact를 Web Output
```

이 구조에서 HI-FI와 웹은 서로 다른 산출물이 아니다. HI-FI는 실제 Vue 웹페이지를 브라우저에서 렌더링한 결과이며, Web Output은 검증된 동일 Vue artifact를 저장·다운로드·배포하는 단계다.

## 3. 기존 프로세스를 그대로 유지할 때의 문제

### 3.1 이미지와 웹의 구조적 차이

HI-FI 이미지는 픽셀 결과물이다. 다음 정보가 명시적으로 존재하지 않는다.

- DOM 계층
- 섹션과 컴포넌트 경계
- 실제 텍스트와 이미지 속 텍스트의 구분
- CTA의 실제 URL과 클릭 동작
- 모바일 레이아웃
- 이미지의 원본 크기와 crop 정책
- hover, focus, menu 등 상호작용
- 약관의 실제 텍스트 데이터

LLM이 이미지 한 장만 보고 이를 다시 추론하면, 화면은 비슷해도 실제 구조와 콘텐츠가 달라질 수 있다.

### 3.2 HI-FI와 웹 사이의 변형

이미지-to-code 과정에서 다음 차이가 발생할 수 있다.

- 글꼴과 줄바꿈 변경
- 섹션 높이와 간격 변경
- 배경 이미지 crop 위치 변경
- CTA 위치 및 크기 변경
- 모바일에서 의도하지 않은 재배치
- 이미지에 있던 잘못된 문구를 그대로 복제
- 긴 약관 누락 또는 축약

따라서 “선택한 HI-FI와 실제 웹이 동일해야 한다”는 요구와 이미지 역변환 방식은 구조적으로 충돌한다.

### 3.3 무인 생성에서는 오류를 승인할 사람이 없음

사람이 HI-FI를 확인하지 않는다면 잘못된 디자인, 누락된 문구, 겹친 요소를 발견하고 되돌릴 주체가 없다. 이 경우 수동 승인 단계를 제거하는 대신 자동 검증과 자동 수정 과정이 반드시 필요하다.

## 4. 권장 최종 프로세스

### 4.1 사용자 관점

사용자에게는 다음 4단계 또는 5단계로 보이게 할 수 있다.

```text
1. Concept
2. Content
3. LO-FI
4. 웹페이지 생성
5. Web Output
```

HI-FI 확인 화면을 유지하려면 4단계를 `HI-FI Web Preview`로 표시한다.

```text
1. Concept
2. Content
3. LO-FI
4. HI-FI Web Preview
5. Web Output
```

사람이 확인하지 않는 완전 자동 모드에서는 4단계를 별도 승인 화면으로 보여줄 필요가 없다. 다만 내부 파이프라인에는 반드시 존재해야 한다.

### 4.2 시스템 내부

```text
Concept + Content + Confirmed LO-FI
  → Web Generation Specification 생성
  → 이미지 에셋 계획 생성
  → 이미지 원본 매칭 또는 AI 이미지 생성
  → Vue 코드 생성
  → 격리 환경에서 production build
  → desktop/mobile 브라우저 렌더링
  → 규칙 기반 QA
  → Vision 기반 시각 QA
  → 실패 원인에 따라 자동 수정
  → 재빌드 및 재검증
  → 품질 기준 통과 artifact 확정
  → Web Output
```

## 5. HI-FI의 새로운 정의

기존 HI-FI:

```text
이미지 모델이 생성한 독립 디자인 이미지
```

권장 HI-FI:

```text
Vue 코드 + 실제 이미지 에셋 + 실제 콘텐츠를 브라우저가 렌더링한 고해상도 스크린샷
```

이 정의에서는 다음이 보장된다.

- HI-FI의 문구와 실제 웹 문구가 동일하다.
- HI-FI의 CTA와 실제 웹 CTA가 동일한 DOM 요소다.
- HI-FI의 배경 이미지와 실제 웹 에셋이 동일하다.
- HI-FI에서 보이는 레이아웃이 실제 CSS 결과다.
- desktop/mobile HI-FI를 각각 생성할 수 있다.
- Web Output에서 LLM이 디자인을 다시 해석할 필요가 없다.

## 6. 이미지 처리 권고

### 6.1 기본 원칙

Final 또는 HI-FI 전체 이미지를 웹페이지의 배경으로 사용하는 방식은 피한다. 전체 이미지를 사용하면 버튼과 텍스트가 픽셀에 포함되어 접근성, 반응형, 링크 동작 및 문구 정확성을 보장할 수 없다.

페이지 이미지는 다음 두 종류로 분리한다.

1. 실제 이미지 에셋: Hero 배경, 상품 이미지, 인물, 장식 이미지, 아이콘
2. 실제 DOM 콘텐츠: 제목, 설명, CTA, 혜택, 약관, 로고 텍스트

### 6.2 첨부 예시와 같은 Hero 처리

배경 이미지 위에 텍스트와 버튼이 배치되는 Hero는 다음 레이어로 만든다.

```text
Hero section
  ├─ background image or <picture>
  ├─ optional contrast overlay
  └─ content layer
       ├─ heading
       ├─ description
       └─ CTA link/button
```

예시 구조:

```vue
<section class="promo-hero">
  <picture class="promo-hero__media" aria-hidden="true">
    <source media="(max-width: 640px)" srcset="/assets/hero-mobile.webp" />
    <img src="/assets/hero-desktop.webp" alt="" />
  </picture>

  <div class="promo-hero__content">
    <h1>{{ content.title }}</h1>
    <p>{{ content.description }}</p>
    <a :href="content.ctaUrl">{{ content.ctaLabel }}</a>
  </div>
</section>
```

### 6.3 이미지 생성 시 텍스트 안전 영역

이미지 모델에는 단순히 “카지노 이미지 생성”처럼 요청하지 않는다. 레이아웃에 필요한 구도를 구조화해 전달한다.

```json
{
  "role": "hero-background",
  "subjectPosition": "right",
  "textSafeArea": "left",
  "desktopAspectRatio": "16:7",
  "mobileAspectRatio": "4:5",
  "exclude": ["text", "letters", "buttons", "logos", "UI labels"]
}
```

이미지 모델은 시각 요소만 생성하고, 제목과 CTA는 Vue가 실제 DOM으로 올린다.

### 6.4 이미지 소스 우선순위

1. Step 2에서 사용자가 제공한 원본 이미지
2. 관리자가 고정한 브랜드 에셋 또는 승인 URL
3. 기존 asset library의 재사용 가능한 이미지
4. 생성 과정에서 별도로 만든 AI 이미지
5. Final 이미지에서 clean plate를 복원하는 inpainting
6. Final 이미지를 잘라 사용하는 방식은 최후의 fallback

Final 디자인에서 영역을 잘라 쓰면 기존 텍스트나 장식이 포함될 수 있으므로 기본 전략으로 사용하지 않는다.

### 6.5 반응형 이미지

Hero처럼 crop 영향이 큰 영역은 다음 중 하나를 사용한다.

- desktop/mobile 에셋 별도 생성
- 동일 에셋에 안전 영역과 `object-position` 지정
- `<picture>`의 viewport별 source 사용

자동 QA는 주요 피사체가 잘리지 않았는지, 텍스트와 겹치지 않는지를 desktop/mobile에서 각각 검사해야 한다.

## 7. LLM의 역할

### 7.1 LLM이 필요한 단계

LLM 또는 멀티모달 모델은 다음 작업에 관여한다.

- LO-FI를 Vue 컴포넌트 구조로 변환
- 이미지 영역과 콘텐츠 영역 분석
- 이미지 에셋 프롬프트 생성
- Vue/CSS 초안 생성
- 브랜드 및 Design Concept 적용
- Vision QA 결과를 기반으로 코드 또는 에셋 수정

### 7.2 LLM이 필요 없는 단계

다음 작업은 결정적이고 재현 가능한 일반 코드로 처리한다.

- production build
- 파일 해시 생성
- ZIP 생성
- 정적 파일 저장
- 환경별 URL과 UTM 값 주입
- 배포
- 결과 URL 반환
- 이미 검증된 artifact 다운로드

### 7.3 Web Output에서 LLM을 다시 호출하면 안 되는 이유

Web Output 시점에 LLM을 다시 호출하면 승인 또는 검증된 결과가 변경될 수 있다.

- 레이아웃 재해석
- 문구 축약
- 이미지 교체
- CTA 위치 변경
- 랜덤 생성 결과 차이

따라서 LLM은 품질 기준을 통과한 artifact가 확정되기 전까지만 관여한다. Web Output은 확정된 artifact를 그대로 내보내야 한다.

## 8. HI-FI 수동 확인을 제거할 수 있는가

가능하다. 다만 단순히 확인 화면만 제거해서는 안 된다. 사람이 수행하던 검수 역할을 자동 QA가 대신해야 한다.

수동 확인 없는 자동 모드의 완료 조건:

- Vue production build 성공
- desktop/mobile 브라우저 렌더링 성공
- 필수 콘텐츠 coverage 100%
- CTA label과 URL 일치
- 약관 및 필수 고지 포함
- 요소 overlap/overflow 없음
- 텍스트 대비 기준 충족
- LO-FI 섹션 순서 유지
- 디자인 콘셉트 핵심 토큰 반영
- 외부 스크립트 및 위험 코드 없음
- 자동 QA 점수가 기준 이상

하나라도 fatal 조건을 실패하면 Web Output으로 넘어가지 않고 자동 수정 또는 실패 상태로 종료한다.

## 9. 자동 QA 설계

### 9.1 규칙 기반 QA

- Vue/Vite production build
- JavaScript/SFC 구문 검사
- 필수 DOM 텍스트 존재 확인
- CTA href 확인
- heading hierarchy 확인
- 이미지 alt 또는 decorative 처리 확인
- viewport overflow 검사
- 요소 bounding box overlap 검사
- console error 및 failed network request 검사
- 허용 dependency 및 외부 도메인 검사

### 9.2 시각 QA

- LO-FI와 렌더링 결과의 섹션 순서 비교
- 주요 block 개수 비교
- CTA 위치 quadrant 비교
- Hero 피사체와 텍스트 영역 충돌 확인
- Final design style reference와 색상·간격·위계 비교
- 모바일 crop 및 텍스트 가독성 확인

### 9.3 콘텐츠 QA

Step 2 원문을 source of truth로 사용한다.

- 제목
- 핵심 혜택
- 보조 메시지
- CTA 문구
- CTA URL
- Alpha/보조 고지
- 약관 및 Responsible Gaming 문구
- 관리자 설정 기반 필수 섹션/아이템

이미지 OCR 결과는 콘텐츠 source of truth로 사용하지 않는다.

## 10. 자동 수정 반복 정책

무한 재생성을 막기 위해 실패 유형별 수정 정책과 최대 횟수를 둔다.

```text
Attempt 1: Vue + assets 생성
→ Build/QA

Attempt 2: 실패 항목만 수정
→ Build/QA

Attempt 3: 레이아웃 또는 해당 asset 재생성
→ Build/QA

기준 미달: failed + 원인 기록
```

수정 범위는 실패 원인에 따라 제한한다.

- 텍스트 누락: 데이터 binding 및 컴포넌트 수정
- overlap: CSS layout 수정
- 낮은 대비: overlay/text treatment 수정
- 이미지 crop 실패: object-position 또는 mobile asset 수정
- LO-FI 구조 불일치: section component 순서 수정
- build 실패: 코드 구문 및 dependency 수정

매 시도마다 소스, screenshot, QA 결과 및 모델 메타데이터를 저장한다.

## 11. 권장 데이터 및 상태 모델

기존 Final Design 결과와 별도로 `webPageId` 단위의 생성 이력을 둔다.

```text
queued
→ planning
→ generating_assets
→ generating_code
→ building
→ validating
→ ready

실패 시: failed
```

저장 대상:

- runId
- Confirmed LO-FI ID
- Final Design ID 또는 style reference ID
- Step 2 콘텐츠 snapshot/hash
- 생성 specification
- asset manifest
- Vue source archive
- production build artifact
- desktop/mobile screenshots
- QA 결과
- 생성 attempt와 수정 이력
- 모델 및 prompt snapshot

## 12. Final Design 단계와의 관계

현재 Final Design 이미지 생성 기능을 즉시 삭제할 필요는 없다. 전환 단계에서는 두 모드를 운영할 수 있다.

### 기존 모드

```text
LO-FI → Image HI-FI → 결과 확인
```

디자인 탐색 및 레퍼런스 생성에 사용한다.

### 권장 Web 모드

```text
LO-FI → Vue + Assets → Browser-rendered HI-FI → Web Output
```

실제 웹페이지 출력에 사용한다.

장기적으로 웹 출력이 핵심 제품 목표라면 `Browser-rendered HI-FI`를 기본 모드로 승격하고, 독립 이미지 HI-FI는 콘셉트 탐색용 선택 기능으로 축소하는 것이 좋다.

## 13. 기대 효과

- HI-FI와 실제 웹의 차이를 구조적으로 제거
- 프로모션 문구와 약관의 정확성 향상
- 배경 이미지와 실제 DOM 콘텐츠의 올바른 분리
- 모바일/데스크톱 결과 동시 보장
- 사람 없는 자동 생성에 필요한 품질 gate 확보
- 동일 artifact를 다운로드 및 배포하므로 결과 재현 가능
- 생성 이력과 실패 원인 추적 가능

## 14. 주요 리스크

### 생성 코드 실행 위험

AI 생성 코드는 격리된 build 환경과 sandbox preview에서만 실행해야 한다. 운영 Promo Builder와 같은 origin 또는 권한 컨텍스트에서 직접 실행하지 않는다.

### 이미지 비용 및 지연

desktop/mobile 에셋을 반복 생성하면 비용과 시간이 증가한다. 원본 에셋 재사용, asset hash 캐시, 실패 asset만 부분 재생성하는 방식이 필요하다.

### 시각 동일성의 정의

픽셀 단위 동일성보다 다음 우선순위를 명시해야 한다.

1. 콘텐츠 정확성
2. LO-FI 구조와 섹션 순서
3. CTA와 약관의 기능성
4. 반응형 안정성
5. 시각적 스타일 유사성

웹은 viewport에 따라 변하므로 단일 HI-FI 이미지와 모든 해상도에서 픽셀 단위로 같을 수는 없다. 대신 기준 viewport의 screenshot을 공식 HI-FI로 정의한다.

### 자동 QA 오판

Vision 점수만으로 통과 여부를 판단하지 않는다. build, content coverage, DOM, overlap 같은 결정적 검사를 fatal gate로 두고 Vision 평가는 보조 점수로 사용한다.

## 15. 단계별 추진 권고

### Phase 1. Web Generation Specification

- LO-FI를 section/component tree로 변환
- 콘텐츠와 asset slot을 명확히 분리
- Hero overlay, card grid, image-text row 등 지원 패턴 정의

### Phase 2. Vue 및 Asset 생성

- Vue 3 + Vite 고정 템플릿 구성
- 이미지 asset manifest와 safe-area 규칙 적용
- Step 2 콘텐츠 binding 강제

### Phase 3. 자동 Build 및 QA

- 격리 build
- desktop/mobile screenshot
- content, layout, visual QA
- 실패 유형별 자동 수정

### Phase 4. HI-FI/Web Output 통합

- 렌더링 screenshot을 HI-FI 결과로 저장
- ready artifact를 Web Output 대상으로 고정
- LLM 호출 없이 다운로드/배포

### Phase 5. 운영 안정화

- 관리자 인증·인가
- 생성 비용 및 retry 제한
- asset/source version 관리
- publish 승인 정책

## 16. 최종 권고안

최종 제품 흐름은 다음과 같이 정의하는 것이 가장 적합하다.

```text
Concept
→ Content
→ LO-FI
→ Automated Web Generation
     ├─ Vue code
     ├─ image assets
     ├─ browser render
     ├─ automated QA
     └─ automated correction
→ Browser-rendered HI-FI
→ Web Output
```

사람의 참여를 완전히 제거하려면 HI-FI 확인 화면 자체는 선택적으로 숨길 수 있다. 그러나 Vue 생성, 브라우저 렌더링, 자동 QA와 수정으로 구성된 내부 HI-FI 단계는 제거하면 안 된다.

Web Output에는 LLM이 관여하지 않는다. LLM은 검증된 artifact가 확정되기 전의 생성 및 수정 과정에서만 사용한다. 이 원칙이 HI-FI와 실제 웹의 일치, 결과 재현성 및 운영 안정성을 가장 잘 보장한다.
