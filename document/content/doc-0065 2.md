# 섹션 AI 이미지 적용 및 섹션별 UI 개선 개발계획서

- 작성일: 2026-07-20
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: Create Promo Step 3 콘텐츠 등록 / Visual Editor / Web Output
- 우선순위: P0 이미지 적용 오류 수정, P1 섹션별 생성 UX 및 배경 이미지 fallback
- 문서 상태: 개발 착수 전 검토안

## 1. 추진 배경

현재 섹션 AI 디자인 기능은 선택한 섹션의 콘텐츠를 분석해 레이아웃과 이미지를 생성할 수 있다. 그러나 생성 이미지를 템플릿에 적용할 때 실제 이미지 대신 이미지 생성 프롬프트 또는 설명이 텍스트로 표시되는 문제가 있다.

또한 현재 UI는 AI 디자인 생성 기능이 템플릿 레이아웃 영역의 통합 패널에 배치되어 있고, 이미지 항목이 정의된 섹션만 생성 대상으로 취급한다. 다음 운영 규칙을 만족하도록 데이터 계약과 UI를 개선한다.

1. 선택한 섹션에 등록된 콘텐츠만 이미지 생성 근거로 사용한다.
2. 이미지 항목 존재 여부와 관계없이 생성 이미지를 선택한 섹션의 배경 이미지로 적용한다.
3. 이미지 항목은 사용자가 직접 등록한 콘텐츠 이미지 전용으로 유지한다.
4. AI 디자인 생성 버튼과 실행 상태를 각 섹션 카드 내부에 배치한다.
5. 이미지 생성 프롬프트는 실행 이력으로만 보관하고 사용자 콘텐츠로 출력하지 않는다.

## 2. 현행 분석과 원인

### 2.1 이미지가 텍스트로 표시되는 직접 원인

- 생성 이미지의 프록시 URL은 `/api/promo-section-design-image?runId=...` 형태의 상대경로다.
- Visual Renderer의 이미지 URL 판정은 `http://` 또는 `https://`로 시작하는 절대경로만 허용한다.
- 상대경로가 이미지로 인정되지 않아 `<img>`가 렌더링되지 않고 placeholder가 표시된다.
- 적용 시 이미지 생성 프롬프트가 이미지 값의 `description`에 저장된다.
- Renderer가 `description`을 `figcaption`으로 출력해 이미지 대신 설명 텍스트가 적용된 것처럼 보인다.

### 2.2 이미지 없는 섹션을 처리하지 못하는 원인

- `sectionAiSupportsImage()`가 이미지 항목이 존재하는 섹션만 생성 대상으로 허용한다.
- 생성 계약의 `imageRequest`는 `itemKey`를 필수 대상으로 간주한다.
- `sectionStyles` validator는 현재 `minHeight`만 허용한다.
- 기존 `theme.backgroundImage`는 페이지 전체 배경이며 섹션별 배경으로 사용할 수 없다.

### 2.3 UI 배치 문제

- AI 디자인 생성 UI가 Step 3의 개별 섹션이 아니라 템플릿 레이아웃 통합 패널에 있다.
- 사용자가 어느 섹션 콘텐츠를 기준으로 생성하는지 직관적으로 확인하기 어렵다.
- 섹션 입력, 생성 상태, 미리보기, 적용 작업이 서로 떨어져 있다.

## 3. 목표

- 이미지 URL이 상대경로인지 절대경로인지와 관계없이 정상 렌더링한다.
- 생성 프롬프트와 사용자에게 표시할 이미지 설명을 분리한다.
- 모든 AI 허용 섹션에서 이미지 생성이 가능하도록 한다.
- AI 생성 이미지의 적용 대상을 섹션 배경으로 단일화한다.
- 각 섹션 카드에서 생성부터 적용까지 완료할 수 있도록 UX를 단순화한다.
- 관리자 잠금과 콘텐츠 변경 감지 기능을 유지한다.

## 4. 적용 정책

### 4.1 이미지 적용 대상 결정

```text
선택한 섹션
  └─ targetType=section-background, sectionKey 지정
```

우선순위는 다음과 같다.

1. 선택한 섹션의 배경 이미지

섹션 배경 속성이 관리자에 의해 잠긴 경우 생성 버튼을 비활성화하고 사유를 표시한다.

### 4.2 이미지 생성 입력

이미지 프롬프트는 선택한 섹션의 다음 데이터만 사용한다.

- 표시 가능한 텍스트 항목
- CTA label 및 의미 있는 사용자 입력
- 섹션명과 섹션 설명
- 관리자 이미지 생성 지침
- 허용 레이아웃 variant, 이미지 비율, safe area

다음 값은 이미지 프롬프트의 콘텐츠 근거에서 제외한다.

- 기존 이미지 URL 또는 data URL
- 이전 AI 생성 이미지 프록시 URL
- 내부 `runId`, asset key, provider metadata
- CTA 추적 파라미터
- 이미지 생성 프롬프트 자체

기존 이미지 설명이 관리자가 입력한 생성 지침이라면 별도의 `adminImagePrompt`로 명확히 구분해 사용할 수 있다.

### 4.3 프롬프트와 표시용 설명 분리

- `prompt`: AI 요청과 실행 이력에만 저장한다.
- `description`: 관리자가 설명 표시를 활성화하고 실제 표시용 문구가 있을 때만 저장한다.
- `alt`: 섹션 콘텐츠를 바탕으로 짧게 생성하거나 기존 관리자 값을 유지한다.
- 생성 이미지 적용 시 `description`에 `prompt`를 복사하지 않는다.

## 5. 데이터 계약 변경

### 5.1 이미지 요청 결과

```json
{
  "target": {
    "type": "item",
    "sectionKey": "heroBanner",
    "itemKey": "heroImage"
  },
  "prompt": "provider에 전달한 생성 프롬프트",
  "aspectRatio": "16:9",
  "safeArea": "left-copy"
}
```

이미지 항목이 없는 경우:

```json
{
  "target": {
    "type": "section-background",
    "sectionKey": "benefits"
  },
  "prompt": "provider에 전달한 생성 프롬프트",
  "aspectRatio": "16:9",
  "safeArea": "center"
}
```

기존 `imageRequest.itemKey`와 `imageResult.itemKey`는 하위 호환을 위해 읽기는 지원하되 신규 결과는 `target` 구조를 기준으로 저장한다.

### 5.2 섹션 스타일 확장

`sectionStyles[sectionKey]`에 다음 속성을 추가한다.

```json
{
  "backgroundImage": "/api/promo-section-design-image?runId=...",
  "backgroundImageAssetId": "asset-id",
  "backgroundSize": "contain",
  "backgroundPosition": "right center",
  "backgroundRepeat": "no-repeat"
}
```

최종 snapshot에는 관리되는 asset 참조 또는 프록시 URL을 저장한다. 임시 provider URL이나 base64 원문은 저장하지 않는다.

### 5.3 Validator 확장

- `sectionStyles` 허용 목록에 배경 이미지 관련 속성을 추가한다.
- `target.type`은 `item`, `section-background`만 허용한다.
- `item` 대상은 실제 섹션에 존재하고 잠금되지 않은 이미지 항목인지 검증한다.
- `section-background` 대상은 현재 선택된 섹션과 일치하는지 검증한다.
- 관리자 레이아웃 잠금 위반 시 전체 적용을 거부한다.
- 외부 URL 직접 주입을 방지하고 서비스 내부 프록시 또는 관리 asset만 허용한다.

## 6. 프론트엔드 변경

### 6.1 Step 3 섹션별 UI

각 콘텐츠 섹션 카드 하단에 다음 UI를 추가한다.

- `AI 디자인 생성` 또는 `재생성` 버튼
- 생성 기준: 현재 섹션명 표시
- 대상 표시: `섹션 배경에 적용`
- 진행 상태: 분석 중 / 레이아웃 생성 중 / 이미지 생성 중 / 적용 준비
- 생성 이미지 미리보기
- `레이아웃 및 이미지 적용` 버튼
- 오류와 재시도 안내
- 콘텐츠 변경 시 `재생성 필요` 표시

기존 템플릿 레이아웃 통합 AI 패널은 제거한다. Visual Editor는 결과 미리보기와 레이아웃 편집 역할만 유지한다.

### 6.2 버튼 활성화 조건

- 선택된 활성 템플릿이 있다.
- 해당 섹션에 분석 가능한 텍스트 또는 CTA 콘텐츠가 있다.
- 해당 섹션의 AI 디자인 기능이 허용되어 있다.
- 적용할 섹션 배경이 잠겨 있지 않다.
- 동일 섹션에서 진행 중인 작업이 없다.

이미지 항목 존재 여부는 버튼 노출 조건으로 사용하지 않는다.

### 6.3 렌더러 URL 처리

다음 URL을 유효한 이미지 소스로 처리한다.

- `https://...`
- `http://...` — 로컬 개발 환경에 한함
- `/api/...` 서비스 내부 상대경로
- 필요 시 검증된 `blob:` URL — 로컬 미리보기 한정

`javascript:`, 임의 data URL 및 허용되지 않은 scheme은 거부한다.

### 6.4 렌더링 규칙

- 콘텐츠 이미지 항목: 사용자가 등록한 이미지 URL과 alt를 `<img>`에 적용
- 섹션 배경: 해당 섹션 container에 CSS background 적용
- 이미지 생성 프롬프트: DOM에 출력하지 않음
- 표시용 설명: `descriptionEnabled=true`이고 description이 있을 때만 출력
- Web Output과 Visual Editor에서 동일한 렌더링 규칙 사용

## 7. Backend 변경

### 7.1 Run 생성

- 서버가 전달받은 `sectionKey`로 템플릿의 최신 섹션 정의를 다시 조회한다.
- 입력 snapshot을 이미지 URL과 내부 metadata가 제거된 분석용 콘텐츠로 정규화한다.
- 이미지 적용 대상을 서버에서 결정해 constraints snapshot에 저장한다.

### 7.2 Layout 및 이미지 생성

- Layout LLM에 적용 대상 유형을 전달한다.
- 섹션 배경 위 텍스트 가독성을 고려한 safe area와 overlay 권고를 생성한다.
- Gemini 생성 이미지는 Blob에 저장하고 내부 프록시 URL을 결과로 반환한다.

### 7.3 Apply API

- 현재 콘텐츠 hash, template version, layout revision을 재검증한다.
- `target.type=section-background`이면 해당 섹션의 background 속성만 갱신한다.
- 이미지 프롬프트를 `description`에 저장하지 않는다.
- 콘텐츠와 layout patch 적용이 모두 성공할 때만 run을 `applied`로 전환한다.

## 8. 구현 단계

### Phase 1. P0 이미지 적용 오류 수정

1. Renderer가 내부 상대 이미지 URL을 허용하도록 URL 정규화 함수를 개선한다.
2. 적용 로직에서 생성 프롬프트의 `description` 복사를 제거한다.
3. 이미지 URL, alt, description 저장 규칙을 함수로 분리한다.
4. Visual Editor와 Web Output에서 실제 이미지가 표시되는지 회귀 테스트한다.

### Phase 2. 이미지 대상 계약 확장

1. `target.type` 기반 결과 계약을 추가한다.
2. 기존 `itemKey` 결과의 하위 호환 변환기를 추가한다.
3. 모든 AI 생성 이미지에 `section-background`를 선택한다.
4. 섹션 background style allowlist와 validator를 확장한다.
5. 관리자 잠금 정책을 적용한다.

### Phase 3. 섹션별 UI 이동

1. Step 3 각 섹션 카드에 AI 액션 영역을 추가한다.
2. 통합 AI 패널을 제거한다.
3. 실행 상태, 미리보기, 적용, 재생성 UI를 섹션별 상태와 연결한다.
4. 섹션 입력이 바뀌면 해당 섹션 결과만 stale 처리한다.
5. 키보드 접근성과 `aria-live` 상태 안내를 추가한다.

### Phase 4. 배경 이미지 렌더링

1. Visual Renderer에 섹션 background style을 적용한다.
2. Web Output serialization에 배경 image asset을 포함한다.
3. desktop/mobile에서 contain, position, safe area를 검증한다.
4. 텍스트 가독성을 위한 기존 overlay 또는 theme 규칙과 충돌 여부를 확인한다.

### Phase 5. 통합 검증 및 배포

1. 단위 및 계약 테스트를 실행한다.
2. Preview 환경에서 실제 Gemini 이미지 생성 E2E를 수행한다.
3. 이미지 항목 섹션과 이미지 없는 섹션을 각각 검증한다.
4. Vercel Function 오류 로그와 Blob 저장 결과를 확인한다.
5. Preview 검증 완료 후 Production에 반영한다.

## 9. 파일별 예상 변경 범위

- `prototype/create-promo.js`
  - 섹션별 AI UI 배치
  - 입력 정규화 및 적용 대상 분기
  - 이미지 prompt/description 분리
- `prototype/create-promo.css`
  - 섹션별 AI action, 상태, 미리보기 스타일
- `visual-editor/src/PromoPageRenderer.vue`
  - 상대 이미지 URL 처리
  - 섹션 배경 렌더링
  - 설명 표시 조건 강화
- `visual-editor/src/contracts.js`
  - 이미지 값 및 section background 기본 계약
- `visual-editor/src/styles.css`
  - 섹션 background, overlay 및 반응형 스타일
- `api/_promo-section-design-contract.js`
  - target 계약, background patch, allowlist 검증
- `api/promo-section-design-runs.js`
  - 선택 섹션 입력 정규화와 대상 결정
- `api/promo-section-design-process.js`
  - 대상 유형별 이미지 생성 결과 저장
- `api/promo-section-design-apply.js`
  - 콘텐츠 hash 검증 후 item/background 적용 계약 검증
- `scripts/test-section-ai-design-contract.js`
  - target 및 background fallback 테스트
- `scripts/test-create-promo-clone-contract.js`
  - 섹션별 UI와 통합 패널 제거 계약
- `scripts/test-visual-editor-contract.js`
  - 상대 URL, 실제 이미지, background 렌더링 계약

## 10. 테스트 계획

### 10.1 단위 및 계약 테스트

- 이미지 항목 존재 여부와 관계없이 `target.type=section-background`가 된다.
- 잠긴 section background에는 적용하지 않는다.
- 상대 프록시 URL을 이미지로 인식한다.
- 생성 prompt가 `description`으로 복사되지 않는다.
- 표시용 설명이 비활성화되면 figcaption을 렌더링하지 않는다.
- 허용되지 않은 URL scheme을 거부한다.
- 다른 섹션의 콘텐츠가 이미지 프롬프트에 포함되지 않는다.

### 10.2 브라우저 E2E

#### 시나리오 A: 이미지 항목이 있는 Hero

1. Hero 콘텐츠를 입력한다.
2. Hero 카드의 AI 디자인 생성 버튼을 실행한다.
3. 생성 미리보기에서 실제 이미지를 확인한다.
4. 적용 후 Hero 섹션 배경에 이미지가 표시되는지 확인한다.
5. 생성 프롬프트가 텍스트로 노출되지 않는지 확인한다.

#### 시나리오 B: 이미지 항목이 없는 텍스트 섹션

1. 텍스트 콘텐츠를 입력한다.
2. 해당 섹션 카드에서 AI 디자인을 생성한다.
3. 적용 대상 안내가 `섹션 배경`인지 확인한다.
4. 적용 후 해당 섹션에만 배경 이미지가 표시되는지 확인한다.
5. 다른 섹션과 페이지 전체 배경이 변경되지 않는지 확인한다.

#### 시나리오 C: stale 및 잠금

1. AI 디자인을 생성한 뒤 섹션 콘텐츠를 수정한다.
2. 기존 결과 적용이 차단되고 재생성 안내가 표시되는지 확인한다.
3. 관리자 잠금 항목과 레이아웃 속성이 변경되지 않는지 확인한다.

### 10.3 회귀 테스트

- 관리자 기본 레이아웃 및 revision 반영
- Create Promo Step 3 저장/복원
- Visual Editor postMessage snapshot 동기화
- Web Output 생성 결과
- 기존 사용자 업로드 이미지와 URL 이미지
- 모바일/데스크톱 레이아웃
- Gemini Provider 계약 및 Blob 이미지 프록시

## 11. 완료 조건

- 생성된 이미지가 설명 텍스트가 아닌 실제 이미지로 표시된다.
- 생성 프롬프트가 사용자 콘텐츠 또는 Web Output DOM에 노출되지 않는다.
- AI 생성 요청은 선택한 섹션 콘텐츠만 사용한다.
- 이미지 항목 존재 여부와 관계없이 AI 이미지는 해당 섹션 배경에 적용된다.
- 생성 버튼, 상태, 미리보기, 적용 기능이 각 섹션 카드에 있다.
- 관리자 잠금 및 stale 검증을 우회할 수 없다.
- Visual Editor와 Web Output 결과가 일치한다.
- 단위, 계약, 브라우저 E2E 테스트를 모두 통과한다.
- Preview에서 실제 Gemini 생성 검증 후 Production 배포가 완료된다.

## 12. 주요 위험과 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| 상대 URL을 과도하게 허용 | 악성 URL 또는 XSS 가능성 | `/api/` 등 내부 경로 allowlist와 scheme 검증 |
| 배경 이미지 위 텍스트 가독성 저하 | 프로모션 정보 전달 실패 | safe area, background position, overlay 규칙 검증 |
| 이미지와 layout 적용 중 일부만 성공 | snapshot 불일치 | 적용 전 전체 검증 후 원자적 상태 전환 |
| 기존 run 결과와 신규 target 계약 충돌 | 과거 결과 적용 실패 | legacy `itemKey` 변환기 제공 |
| 이미지 생성 비용 증가 | 섹션별 반복 생성 비용 증가 | 중복 요청 방지, input hash 재사용, 진행 중 버튼 잠금 |
| Blob 프록시 URL 만료 또는 접근 실패 | Web Output 이미지 깨짐 | 관리 Blob 영구 저장과 서비스 프록시 사용 |

## 13. 개발 착수 권장 순서

P0 오류 수정과 P1 구조 변경을 한 번에 섞지 않고 다음 순서로 진행한다.

1. 상대 URL 및 prompt/description 오류 수정
2. 기존 콘텐츠 이미지 항목이 AI 적용으로 변경되지 않는지 회귀 검증
3. target 계약과 섹션 배경 fallback 추가
4. 섹션별 UI 이동
5. Web Output 및 반응형 통합 검증
6. Preview 실제 생성 테스트 후 Production 반영

이 순서를 사용하면 현재 운영 오류를 먼저 차단하고, 이후 배경 이미지와 UI 구조 변경에서 발생하는 문제를 분리해 추적할 수 있다.
