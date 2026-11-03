# Visual Editor 구조·AI 디자인·섹션/컴포넌트 트랜지션 개발 계획서

## 0. 문서 정보

- 작성일: 2026-07-31
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: Promo Web Builder Visual Editor / Live Preview / Web Output
- 문서 상태: 1차 개발 반영 및 로컬 디버깅 완료
- 관련 검토: `docs/qa/left-panel-audit-2026-07-31/report.md`
- 개발 원칙: 각 단계 구현 후 계약 테스트, 브라우저 디버깅, 저장·재진입 검증을 완료한 다음 다음 단계로 진행한다.

## 1. 배경

현재 Visual Editor에는 다음 문제가 있다.

1. 선택된 섹션과 펼쳐진 섹션이 같은 상태로 관리되어 현재 섹션을 직접 닫을 수 없다.
2. 컴포넌트 상·하 이동은 자동 배치에서는 위치를 변경할 수 있지만 자유 배치에서는 화면 변화가 거의 없어 의미가 일관되지 않다.
3. 현재 `AI 섹션 구성`은 실제 구조 구성이 아니라 기존 컴포넌트의 콘텐츠·배치·토큰·키비주얼을 변경한다.
4. AI 디자인 생성 전에 사용자가 디자인 요구사항을 구체적으로 입력할 수 있는 흐름이 부족하다.
5. 빈 섹션을 추가한 뒤 등록된 컴포넌트 중 적절한 조합을 AI가 제안하는 구조 구성 기능이 없다.
6. 섹션과 컴포넌트에 트랜지션을 직접 선택하고 미리보기·저장하는 편집 UI가 없다.

따라서 왼쪽 구조 패널, AI 디자인 생성, AI 섹션 구성, 트랜지션을 각각 분리된 책임으로 재정의한다.

## 2. 실행 결론

권장 기능 구조는 다음과 같다.

```text
Structure Panel
  ├─ Section Accordion
  ├─ Component Library
  └─ AI Section Composition

AI Design Generation
  ├─ Design Requirements
  ├─ Layout / Token / Key Visual Proposal
  ├─ Transition Proposal
  └─ Preview → Apply

Transition Editor
  ├─ Section Transition
  ├─ Component Transition
  ├─ Replay Preview
  └─ Reduced Motion Policy
```

핵심 결론:

1. 섹션 선택과 펼침 상태를 분리한다.
2. 컴포넌트 상·하 화살표는 기본 구조 패널에서 제거한다.
3. 화면 앞뒤 순서는 별도 레이어 기능으로 분리한다.
4. `AI 디자인 생성`은 기존 구조를 유지하며 요구사항 기반으로 디자인을 제안한다.
5. `AI 섹션 구성`은 신규 섹션의 컴포넌트 조합을 제안하는 기능으로 재정의한다.
6. 섹션·컴포넌트 트랜지션은 허용된 Motion Preset만 사용한다.
7. Editor와 Web Output은 동일한 `motionSpec`을 렌더링한다.

## 3. 범위

### 3.1 포함

- 섹션 접기·펼치기
- 선택 상태와 펼침 상태 분리
- 컴포넌트 상·하 화살표 제거
- AI 디자인 요구사항 입력
- AI 디자인 적용 전 변경 미리보기
- 빈 섹션의 AI 컴포넌트 조합 제안
- 섹션 트랜지션 프리셋 선택
- 컴포넌트 트랜지션 프리셋 선택
- 트리거, 재생 횟수, 지연, Stagger 정책
- Desktop/Mobile 공통 또는 개별 적용 정책
- Undo/Redo와 Revision 충돌 처리
- Web Output 반영
- `prefers-reduced-motion` 대응

### 3.2 초기 범위 제외

- 사용자가 직접 CSS Keyframe을 입력하는 기능
- 임의 JavaScript 실행
- 복잡한 Timeline Editor
- Scroll 위치와 프레임을 1:1로 연결하는 Scrub Animation
- 3D Transform, Parallax, Particle Effect
- 페이지 이탈 애니메이션
- 컴포넌트 간 연결선을 사용한 Motion Path
- 자동 반복되는 장식 애니메이션

## 4. 현재 구현 상태

### 4.1 구조 패널

- `selectedSection`이 섹션 선택과 하위 내용 펼침을 동시에 결정한다.
- 같은 섹션을 다시 선택해도 `selectedSectionKey`가 유지되므로 닫히지 않는다.
- 컴포넌트 상·하 이동은 `COMPONENT_INSTANCE_REORDER`로 저장 배열 순서를 변경한다.
- Renderer는 `section.items` 순서로 DOM을 출력한다.
- 자동 배치 컴포넌트는 배열 순서가 기본 위치 계산에 영향을 준다.
- 자유 배치 컴포넌트는 좌표와 기본 `z-index`가 유지되어 순서 변경의 시각 효과가 불명확하다.

### 4.2 AI 디자인과 섹션 구성

현재 `AI 섹션 구성`은 다음을 처리한다.

- 기존 컴포넌트 콘텐츠 변경
- 기존 컴포넌트 배치 변경
- 디자인 토큰 연결
- 선택적인 섹션 키비주얼 생성

현재 계약은 제공된 기존 컴포넌트만 허용하므로 신규 컴포넌트 추가·삭제 기능으로 사용할 수 없다.

### 4.3 Motion 기반

이미 다음 기반이 존재한다.

- `promo_motion_presets`
- `promo_motion_preset_versions`
- 기본 Preset: `none`, `fade-up`, `fade-in`, `scale-in`
- Builder Snapshot의 `motionSpec.sections`
- Builder Snapshot의 `motionSpec.items`
- Renderer의 `motionClass()`와 `motionStyle()`
- CSS Motion Keyframe
- `prefers-reduced-motion: reduce` 처리
- AI Page Composition의 Motion Preset 선택

현재 부족한 부분:

- Visual Editor에서 수동으로 선택하는 UI 없음
- Viewport 진입 시 실행하는 Trigger Runtime 없음
- Editor에서 재생·정지·다시 보기 기능 없음
- Template Layout과 Promo Override 저장 범위가 명확하지 않음
- Section Key와 Page Instance Key가 모드별로 달라 Binding 규칙 통합 필요
- Motion Class가 Renderer에 하드코딩됨
- AI 디자인 요구사항과 Motion 제안 연결 없음
- Web Output에서 JavaScript가 실패할 때 콘텐츠 노출을 보장하는 정책이 없음

## 5. 목표 UX

## 5.1 섹션 Accordion

섹션 행을 다음처럼 구성한다.

```text
[펼침 아이콘] [Section 이름] [상태] [메뉴]
```

동작:

1. 펼침 아이콘은 하위 컴포넌트와 섹션 속성만 열고 닫는다.
2. 섹션 이름은 섹션을 선택하고 Live Preview로 이동한다.
3. 열린 섹션을 다시 누르면 닫을 수 있다.
4. 초기에는 한 번에 하나의 섹션만 여는 Accordion으로 구현한다.
5. 섹션을 닫아도 Preview의 선택 상태는 유지한다.
6. `aria-expanded`, `aria-controls`, 키보드 Enter/Space를 지원한다.

권장 상태:

```js
selectedSectionKey
expandedSectionKey
```

## 5.2 컴포넌트 순서 UI

기본 목록에서 다음을 제거한다.

- 컴포넌트 위로 이동
- 컴포넌트 아래로 이동

대체 정책:

| 목적 | 권장 기능 |
|---|---|
| 화면 위치 변경 | Live Preview Drag / Section 정렬 |
| 겹침 순서 변경 | 앞으로 가져오기 / 뒤로 보내기 |
| 다른 섹션으로 이동 | 더보기 > 다른 섹션으로 이동 |
| 접근성 읽기 순서 | 고급 기능 > 읽기 순서 |

같은 섹션 안의 DOM Reorder 명령은 기존 문서 호환을 위해 Core에 유지할 수 있지만 기본 UI에서는 노출하지 않는다.

## 5.3 AI 디자인 생성

섹션 속성에 다음 진입점을 제공한다.

```text
[AI 디자인 생성]
```

버튼 선택 후 Drawer 또는 Panel:

```text
디자인 요청사항
[                                                        ]

생성 범위
[x] 레이아웃
[x] 디자인 토큰
[x] 키비주얼
[ ] 트랜지션
[x] 콘텐츠 문구 유지

[제안 생성]
```

요청 예시:

```text
타이틀을 왼쪽 중앙에 크게 배치하고 CTA를 하단에 강조한다.
어두운 분위기와 붉은 포인트 컬러를 사용하고 키비주얼은 오른쪽에 배치한다.
섹션은 아래에서 부드럽게 등장하고 CTA는 마지막에 나타나게 한다.
```

기본 정책:

- `콘텐츠 문구 유지`: ON
- `트랜지션`: 사용자가 선택하거나 요청에 Motion 의도가 있을 때만 제안
- 잠금 컴포넌트: 변경 금지
- 등록되지 않은 토큰·Preset: 사용 금지
- 적용 전 Before/After 요약 표시

## 5.4 AI 섹션 구성

빈 섹션을 추가하면 다음 Empty State를 표시한다.

```text
이 섹션에는 컴포넌트가 없습니다.

[직접 추가] [Preset 적용] [AI로 구성]
```

`AI로 구성` 흐름:

1. 섹션 목적 입력
2. 포함해야 할 콘텐츠 또는 컴포넌트 조건 입력
3. AI가 활성 Component Library 안에서 조합 제안
4. 추가할 컴포넌트와 기본 Layout Preview
5. 사용자가 확정
6. 하나의 Command로 구조 생성

제안 결과 예시:

```text
Benefits Section
  1. Section Title
  2. Benefit Card × 3
  3. CTA Button

Layout: 3 Columns
Transition: Section Fade Up / Items Stagger 80ms
```

AI는 임의 Component Definition을 만들지 않는다. 활성 Version과 Placement Policy를 통과한 Component만 선택한다.

## 5.5 트랜지션 편집 UI

### Section 속성

```text
TRANSITION
Preset       [없음 / Fade In / Fade Up / Scale In]
Trigger      [화면 진입 / 페이지 로드]
Duration     [빠르게 / 기본 / 느리게]
Delay        [없음 / 짧게 / 보통]
Children     [동시 / 순차]
Stagger      [없음 / 60ms / 100ms / 160ms]
Play         [다시 보기]
```

### Component 속성

```text
TRANSITION
Preset       [섹션 설정 상속 / 없음 / Fade In / Fade Up / Scale In]
Duration     [상속 / 빠르게 / 기본 / 느리게]
Delay        [상속 / 없음 / 짧게 / 보통]
Play         [다시 보기]
```

초기 UI에서는 숫자 직접 입력보다 Token과 Preset을 우선한다.

## 5.6 Editor 재생 정책

편집 중 모든 변경마다 애니메이션이 다시 실행되면 위치 편집이 불편해진다.

따라서:

1. Editor 기본 상태에서는 Motion을 최종 상태로 정지해 표시한다.
2. `다시 보기`를 선택했을 때만 대상 Motion을 재생한다.
3. `전체 다시 보기`는 Preview 상단 Control에 둔다.
4. Drag/Resize 중 Motion Class를 제거한다.
5. Outline 모드에서는 Motion을 정지한다.
6. Web Output에서는 실제 Trigger 정책대로 실행한다.

## 6. 트랜지션 정책

## 6.1 용어

화면 메뉴는 사용자 요청에 맞춰 `트랜지션`을 사용한다.

내부 계약은 기존 호환을 위해 `motionSpec`, `motionPreset`을 유지한다.

## 6.2 초기 Preset

| Preset | 대상 | 효과 |
|---|---|---|
| None | Section/Component | 효과 없음 |
| Fade In | Section/Component | 투명도 0 → 1 |
| Fade Up | Section/Component | 아래에서 짧게 이동하며 등장 |
| Scale In | Component 중심 | 0.96 → 1 확대하며 등장 |

Section 초기 권장값:

- 첫 Hero: `Fade In`, Page Load, 1회
- 이후 Section: `Fade Up`, Viewport Enter, 1회
- Terms/Legal: `None`

Component 초기 권장값:

- 기본: Section 상속
- CTA 강조가 필요한 경우에만 별도 Delay
- 개별 컴포넌트가 과도하게 연속 재생되지 않도록 Section당 최대 Motion 대상 수 제한

## 6.3 Trigger

허용값:

```text
load
viewport-enter
```

초기에는 Hover, Click, Loop를 제외한다.

`viewport-enter`는 Intersection Observer를 사용한다.

권장 기준:

```text
threshold: 0.15
rootMargin: 0px 0px -10% 0px
```

## 6.4 재생 횟수

초기값은 `once`만 지원한다.

- 스크롤을 위아래로 반복해도 재생은 한 번
- Editor의 `다시 보기`는 저장 상태가 아닌 Preview 명령
- 반복 재생은 접근성과 집중도 문제로 초기 범위에서 제외

## 6.5 Children Stagger

Section에 `childrenMode: stagger`가 설정되면 Section 하위 컴포넌트에 순차 Delay를 계산한다.

규칙:

- 개별 Component Delay가 있으면 개별 값 우선
- DOM 배열 순서가 아니라 명시적인 `motionOrder` 사용 권장
- 자유 배치 화면에서 시각 순서와 DOM 순서가 다를 수 있으므로 자동 배열 순서 의존 금지
- 최대 누적 Delay 제한: 800ms

## 6.6 Reduced Motion

`prefers-reduced-motion: reduce`에서는:

- Transform 이동 제거
- Scale 제거
- Duration을 1ms 수준으로 축소하거나 Motion Class 제거
- 콘텐츠를 즉시 최종 상태로 표시

사용자 설정이 시스템 설정을 덮어쓰지 않도록 한다.

## 6.7 No-JavaScript와 실패 안전성

콘텐츠는 기본적으로 보이는 상태여야 한다.

금지:

```css
.section { opacity: 0; }
```

JavaScript가 초기화된 뒤에만 Motion 준비 Class를 적용한다.

```text
기본 HTML: 콘텐츠 표시
Motion Runtime 준비: 초기 상태 적용
Trigger 발생: 최종 상태 전환
Runtime 실패: 콘텐츠 표시 유지
```

## 7. 데이터 계약

## 7.1 권장 motionSpec

```json
{
  "contractVersion": 2,
  "sections": {
    "hero": {
      "presetVersionId": "uuid",
      "trigger": "load",
      "playMode": "once",
      "durationToken": "--promo-motion-duration-normal",
      "easingToken": "--promo-motion-easing-standard",
      "delayToken": "--promo-motion-delay-none",
      "childrenMode": "stagger",
      "staggerToken": "--promo-motion-stagger-short"
    }
  },
  "items": {
    "hero.cta": {
      "inherit": false,
      "presetVersionId": "uuid",
      "trigger": "inherit",
      "playMode": "once",
      "durationToken": "--promo-motion-duration-fast",
      "easingToken": "--promo-motion-easing-emphasis",
      "delayToken": "--promo-motion-delay-short",
      "motionOrder": 4
    }
  }
}
```

## 7.2 Key 규칙

모드별 Key 혼선을 방지한다.

| 대상 | Key |
|---|---|
| Template Section | `sectionKey` |
| Promo Page Section Instance | `pageSectionInstanceId` |
| Template Component | `${sectionKey}.${itemKey}` |
| Promo Page Component Instance | `pageComponentInstanceId` |

Renderer 앞단에서 Canonical Motion Key를 해석하고 Renderer 내부에서는 하나의 Key만 사용한다.

## 7.3 Token 정책

Output Motion은 `--app-*`가 아니라 `--promo-*` Token을 사용한다.

권장 Token:

```text
--promo-motion-duration-fast
--promo-motion-duration-normal
--promo-motion-duration-slow
--promo-motion-easing-standard
--promo-motion-easing-emphasis
--promo-motion-delay-none
--promo-motion-delay-short
--promo-motion-delay-medium
--promo-motion-stagger-short
--promo-motion-stagger-normal
```

DB Design Token Store의 허용 CSS 속성에 이미 Transition Duration, Delay, Timing Function 기반이 있으므로 기존 Token Runtime과 통합한다.

## 7.4 저장 범위

- Admin Layout: Template 기본 Motion
- Promo Builder: 현재 프로모션 Override
- AI Document: Document Revision의 `motionSpec`
- Section Preset: 선택적으로 기본 Section/Component Motion 포함
- Editor Replay 상태: 저장하지 않음

## 7.5 DB와 Migration

기존 Motion Preset 테이블을 재사용한다.

```text
promo_motion_presets
promo_motion_preset_versions
```

신규 테이블은 초기 범위에서 필요하지 않다.

필요 작업:

- Preset `config_json` Validator 확장
- Trigger, Target Scope, Reduced Motion Policy Allowlist
- 기존 Version 호환 Normalizer
- 필요 시 신규 Version Seed

Layout과 Document가 JSONB Snapshot을 사용하므로 `motionSpec` 확장은 Column 추가보다 Snapshot 계약 확장으로 처리한다.

## 8. AI 계약 분리

## 8.1 AI 디자인 제안 API

권장 요청:

```json
{
  "sectionKey": "hero",
  "baseRevision": 12,
  "instruction": "어두운 분위기, 타이틀 왼쪽, CTA 하단 강조",
  "scope": {
    "layout": true,
    "tokens": true,
    "keyVisual": true,
    "motion": true,
    "preserveContent": true
  },
  "currentContent": {},
  "currentLayout": {},
  "currentMotion": {},
  "allowedTokenKeys": [],
  "allowedMotionPresetVersionIds": []
}
```

AI는 ID나 CSS Class를 임의 생성하지 않고 서버가 제공한 후보만 선택한다.

## 8.2 AI 섹션 구조 제안 API

기존 `promo-section-composition` 계약을 구조 생성으로 무리하게 확장하지 않는다.

신규 도메인 권장:

```text
promo-section-structure-plan
promo-section-structure-validate
promo-section-structure-apply
```

제안 계약:

```json
{
  "sectionPurpose": "혜택 3개와 참여 CTA",
  "componentSelections": [
    { "componentVersionId": "uuid", "instanceCount": 1, "role": "title" },
    { "componentVersionId": "uuid", "instanceCount": 3, "role": "benefit" },
    { "componentVersionId": "uuid", "instanceCount": 1, "role": "cta" }
  ],
  "layoutPresetVersionId": "uuid",
  "motionPresetVersionId": "uuid",
  "rationale": ""
}
```

## 8.3 Revision 충돌

모든 AI 적용 요청은 다음을 포함한다.

- `baseDocumentRevision`
- `baseLayoutRevision`
- `proposalFingerprint`
- `idempotencyKey`

Revision 불일치 시 자동 덮어쓰지 않는다.

```text
최신본 다시 불러오기
현재 제안을 최신본에 다시 계산
취소
```

## 9. Editor Command

권장 Command:

```text
SECTION_EXPANSION_TOGGLE        Editor UI State, History 제외
SECTION_AI_DESIGN_APPLY         Document History 포함
SECTION_STRUCTURE_COMPOSE       Document History 포함
SECTION_MOTION_SET              Document History 포함
ITEM_MOTION_SET                 Document History 포함
MOTION_REMOVE                   Document History 포함
MOTION_PREVIEW_REPLAY           Editor UI State, History 제외
LAYER_ORDER_CHANGE              향후 별도 기능
```

원자성:

- AI 디자인 적용은 Layout, Token, Key Visual Request, Motion 변경을 하나의 History Entry로 기록
- AI 섹션 구성은 Section Item, Content 기본값, Layout, Visibility, Motion을 하나의 History Entry로 기록
- Motion Preset 선택 한 번은 Undo 한 번으로 복구
- Replay는 문서를 변경하지 않음

## 10. 단계별 개발 계획

## P0 — 기준선과 계약 테스트

목표:

- 현재 동작과 기존 Motion 기반을 테스트로 고정한다.

작업:

1. 섹션 재선택 시 닫히지 않는 동작 테스트
2. 자동 배치·자유 배치 Component Reorder 차이 테스트
3. 기존 `motionSpec` 역직렬화 테스트
4. 기존 Motion Preset DB/API Fixture 작성
5. Preview와 Web Output Motion 기준선 캡처
6. 기존 Builder Document Revision 회귀 테스트

완료 기준:

- 현재 문제와 호환 계약을 자동 테스트로 재현
- 기존 AI Document의 Motion이 신규 Normalizer에서 손실되지 않음

단계 종료 디버깅:

- Admin Layout, Create Promo, AI Document 세 모드 확인
- Desktop/Mobile 확인
- 저장·재진입 확인
- Console/API Validation 오류 확인

## P1 — Section Accordion과 순서 UI 정리

목표:

- 선택과 펼침을 분리하고 불명확한 컴포넌트 화살표를 제거한다.

작업:

1. `expandedSectionKey` 도입
2. Section Disclosure Button 추가
3. Section Label 선택 동작 분리
4. 컴포넌트 상·하 화살표 제거
5. Cross-section 이동 대안 검토
6. Tree ARIA와 Keyboard 동작 정리

완료 기준:

- 현재 섹션을 직접 닫을 수 있음
- 다른 섹션 선택 시 Accordion 상태가 예측 가능함
- 화살표 제거 후 Component 편집 기능 손실 없음

단계 종료 디버깅:

- 빈 Section
- 컴포넌트가 많은 Section
- 선택 Component가 있는 상태에서 Section 닫기
- 키보드 Enter/Space/Arrow 탐색

## P2 — AI 디자인 요청사항 입력

목표:

- 사용자가 AI 디자인 의도를 명시하고 적용 범위를 제어한다.

작업:

1. 디자인 요구사항 Textarea
2. Layout/Token/Key Visual/Motion Scope
3. 콘텐츠 유지 기본 정책
4. 요청 Payload와 Prompt Variable 확장
5. Before/After 제안 요약
6. Proposal Fingerprint와 Revision 검증
7. 적용·취소·다시 생성

완료 기준:

- 요구사항이 Planner까지 손실 없이 전달됨
- 콘텐츠 유지 시 문구가 변경되지 않음
- 허용되지 않은 Token/Motion을 AI가 적용하지 못함
- 적용 전 변경 범위를 확인할 수 있음

단계 종료 디버깅:

- 빈 요청
- 매우 긴 요청
- 키비주얼 제외
- Motion 제외
- Locked Component
- Revision Mismatch

## P3 — AI 섹션 구성

목표:

- 빈 섹션의 Component 조합을 AI가 제안한다.

작업:

1. 빈 Section Empty State
2. 직접 추가/Preset/AI 구성 선택
3. Structure Plan API
4. 활성 Component Candidate와 Placement Policy 전달
5. Component 조합 Preview
6. Layout/Motion 기본값 제안
7. Validate 후 Atomic Apply
8. Undo/Redo

완료 기준:

- AI가 등록된 Component Version만 사용
- 금지된 Section Role 조합 차단
- 적용 전 Component 목록 확인 가능
- 한 번의 Undo로 전체 구조 복구

단계 종료 디버깅:

- 후보 Component 없음
- 최대 Instance 수 초과
- Required/Locked 정책
- Layout Preset 없음
- AI 응답 중복 Component
- Apply 중 Revision 변경

## P4 — Motion 계약과 Preset Registry

목표:

- Section/Component가 공유하는 안전한 Motion 계약을 확정한다.

작업:

1. `motionSpec` Version 2 Normalizer
2. Target Key Resolver
3. Motion Preset Registry
4. Trigger/Duration/Easing/Delay/Stagger Allowlist
5. `--promo-motion-*` Token 연결
6. 기존 Version 호환
7. API/Store Validator

완료 기준:

- 임의 Class, Keyframe, CSS 값 저장 차단
- 기존 fade/scale Preset 정상 렌더링
- Template/Instance Key가 올바르게 해석됨

단계 종료 디버깅:

- 존재하지 않는 Preset Version
- 비활성 Preset
- 삭제된 Token 참조
- Legacy Motion Snapshot
- Admin/Promo/AI Document 저장 차이

## P5 — Section 트랜지션 편집

목표:

- Section 단위 Transition을 선택·미리보기·저장한다.

작업:

1. Section Transition Property UI
2. Preset, Trigger, Duration, Delay
3. Children Mode와 Stagger
4. Section Replay
5. Intersection Observer Runtime
6. Outline/Drag/Resize 중 Motion 정지
7. Web Output 반영

완료 기준:

- Section이 설정된 Trigger에서 한 번 실행
- Editor Replay가 저장 상태를 변경하지 않음
- Web Output과 Preview 결과가 동일함
- JavaScript 실패 시 콘텐츠가 보임

단계 종료 디버깅:

- 첫 화면 Hero
- 긴 페이지 하단 Section
- 빠른 스크롤
- 뒤로 가기와 BFCache
- Reduced Motion
- Mobile viewport

## P6 — Component 트랜지션 편집

목표:

- Component가 Section Motion을 상속하거나 개별 Motion을 사용한다.

작업:

1. Component Transition Property UI
2. Inherit/None/Preset 상태
3. 개별 Delay와 `motionOrder`
4. Component Replay
5. Section Stagger와 Override 우선순위
6. Hidden/Locked Component 정책
7. Multi-field Component 적용 범위

완료 기준:

- 개별 Override가 Section 상속보다 우선
- Hidden Component는 출력 Motion 대상에서 제외
- Stagger 누적 Delay가 제한 범위를 넘지 않음
- Selection Box와 Drag 좌표가 Motion Transform의 영향을 받지 않음

단계 종료 디버깅:

- Component 1개/다수
- 자유 배치·Anchor 배치
- 겹친 Component
- 동일 Delay
- Hidden/Locked
- Desktop/Mobile Override

## P7 — AI와 Motion 통합

목표:

- AI 디자인과 AI 섹션 구성이 허용된 Motion Preset을 제안한다.

작업:

1. AI Candidate에 활성 Motion Preset 전달
2. 디자인 요구사항에서 Motion 의도 추출
3. Motion 변경 요약
4. 적용 전 Replay Preview
5. 과도한 Motion 제한 정책
6. Terms/Legal 기본 None 정책

완료 기준:

- AI가 허용된 Preset ID만 반환
- 사용자가 Motion Scope를 끄면 Motion이 변경되지 않음
- AI 적용 후 수동 Motion 편집 가능

단계 종료 디버깅:

- Motion 언급이 없는 요청
- 모호한 `동적으로` 요청
- 모든 Component 애니메이션 요청
- Reduced Motion 환경
- Proposal 재생성

## P8 — 통합 QA와 배포

목표:

- 세 편집 모드와 Web Output의 저장·렌더링 일치를 보장한다.

작업:

1. Contract Test 전체 실행
2. Production Build
3. Browser Smoke Test
4. Admin Layout 저장·활성화
5. Create Promo 저장·재진입
6. AI Document Revision/Undo/Redo
7. Web Output 비교
8. Feature Flag 단계 배포

완료 기준:

- Console Error 0
- API Validation Error 0
- Preview/Web Output Motion 일치
- Reduced Motion 통과
- 기존 Motion 없는 문서 회귀 없음

## 11. 테스트 계획

### Unit

- Motion Key Resolver
- Preset Allowlist
- Token Resolver
- Trigger Normalizer
- Delay/Stagger Clamp
- Accordion State
- AI Scope Normalizer
- Component Candidate Policy

### Command

- Section Motion Set/Remove
- Item Motion Set/Remove
- AI Design Atomic Apply
- Section Structure Atomic Apply
- Undo/Redo
- Revision Rebase

### API

- Motion Preset 목록
- 잘못된 Preset 차단
- AI Design Scope
- Structure Plan/Validate/Apply
- Revision Mismatch
- Idempotency

### Browser

1. Section 열기·닫기
2. 빈 Section 추가
3. AI Component 조합 생성
4. 디자인 요구사항 입력
5. Motion 포함 AI 디자인 제안
6. Section Fade Up 선택
7. Component Delay 적용
8. Replay
9. 저장
10. 재진입
11. Mobile 확인
12. Web Output 확인

### 접근성

- Disclosure Button Label
- Keyboard Accordion
- Motion Control Focus
- Motion 없이 동일 정보 제공
- Reduced Motion
- Screen Reader 읽기 순서
- 애니메이션 중 Focus Target 이동 금지

## 12. 주요 위험과 대응

| 위험 | 대응 |
|---|---|
| 순서 화살표 제거로 DOM 순서 편집 손실 | 읽기 순서를 별도 고급 기능으로 분리 |
| 자유 배치와 DOM 순서 불일치 | Motion Stagger는 `motionOrder` 사용 |
| AI가 임의 Motion 생성 | 활성 Preset ID Allowlist |
| Motion이 편집 좌표에 영향 | Editor 기본 정지, 측정 시 Transform 제외 |
| 페이지 로드 시 콘텐츠 깜빡임 | 기본 콘텐츠 표시, Runtime 준비 후 초기 상태 적용 |
| 과도한 애니메이션 | Preset 제한, 최대 대상 수와 누적 Delay 제한 |
| Reduced Motion 미준수 | CSS와 Runtime 양쪽에서 강제 |
| Preview와 Output 불일치 | 공통 Renderer와 공통 Motion Runtime 사용 |
| 기존 Snapshot 손실 | Versioned Normalizer와 Legacy Fixture |
| Revision 충돌 | Base Revision, Fingerprint, Recompute 흐름 |
| `--app-*` Token의 Output 누출 | `--promo-motion-*`로 통일 |
| Motion Preset Class 변조 | Registry 기반 Class 매핑 |

## 13. 예상 변경 파일

신규 후보:

```text
visual-editor/src/platform/editor-ui/SectionTransitionControls.vue
visual-editor/src/platform/editor-ui/ComponentTransitionControls.vue
visual-editor/src/platform/editor-ui/AiDesignRequestPanel.vue
visual-editor/src/platform/editor-ui/AiSectionCompositionPanel.vue
visual-editor/src/platform/editor-core/motion-spec.mjs
visual-editor/src/platform/editor-core/motion-key-resolver.mjs
visual-editor/src/platform/editor-core/motion-preset-registry.mjs
visual-editor/src/platform/editor-runtime/motion-runtime.mjs
api/promo-section-structure-plan.js
api/promo-section-structure-validate.js
api/promo-section-structure-apply.js
scripts/test-visual-editor-motion-contract.mjs
scripts/test-section-structure-composition.mjs
scripts/test-visual-editor-motion-browser.mjs
```

수정 후보:

```text
visual-editor/src/App.vue
visual-editor/src/PromoPageRenderer.vue
visual-editor/src/promo-renderer.css
visual-editor/src/platform/editor-ui/PageTree.vue
visual-editor/src/platform/editor-ui/StructurePanel.vue
visual-editor/src/SectionProperties.vue
visual-editor/src/platform/editor-ui/PropertyPanel.vue
visual-editor/src/platform/editor-core/editor-commands.mjs
visual-editor/src/platform/editor-core/command-reducer.mjs
visual-editor/src/editor-context.mjs
api/_promo-section-composition-contract.js
api/_promo-section-design-contract.js
api/_promo-page-composition-contract.js
api/_promo-page-composition-operations.js
api/_promo-page-composition-candidates.js
api/_wizard-form-template-layout-store.js
api/promo-builder-documents.js
scripts/test-visual-editor-contract.js
scripts/test-create-promo-browser-smoke.mjs
```

실제 개발 시작 전 파일명을 다시 확인한다.

## 14. Feature Flag

권장:

```text
visualEditorSectionAccordion
visualEditorAiDesignRequest
visualEditorAiSectionStructure
visualEditorSectionMotion
visualEditorComponentMotion
```

배포 순서:

```text
계약/Normalizer
→ Accordion 및 순서 UI
→ AI 디자인 요구사항
→ AI 섹션 구조 구성
→ Section Motion
→ Component Motion
→ AI Motion 제안
→ 전체 활성화
```

## 15. 관측 지표

Event:

```text
section_accordion_toggled
ai_design_requested
ai_design_proposal_applied
ai_section_structure_requested
ai_section_structure_applied
section_motion_selected
component_motion_selected
motion_preview_replayed
motion_removed
motion_reduced_by_system
```

주요 지표:

- AI 디자인 제안 적용률
- AI 디자인 재생성률
- AI 섹션 구성 적용률
- 구성 적용 직후 Undo 비율
- Motion 선택 후 제거 비율
- Motion Replay 사용률
- Motion 포함 페이지의 Web Output 오류율
- Reduced Motion 환경 비율

## 16. 완료 정의

- [x] 선택된 섹션을 직접 접고 펼칠 수 있다.
- [x] 섹션 선택과 Accordion 상태가 독립적이다.
- [x] 컴포넌트 상·하 화살표가 기본 구조 패널에서 제거됐다.
- [x] AI 디자인 생성 전에 요구사항을 입력할 수 있다.
- [x] 콘텐츠 유지가 기본값이다.
- [x] AI 디자인 제안을 적용 전에 확인할 수 있다.
- [x] 빈 섹션을 AI가 등록된 Component로 구성할 수 있다.
- [x] AI가 임의 Component나 Motion을 생성하지 않는다.
- [x] Section Transition을 선택·재생·저장할 수 있다.
- [x] Component Transition을 선택·상속·재생·저장할 수 있다.
- [x] Transition이 Undo/Redo에 포함된다.
- [ ] Desktop/Mobile 저장 정책이 일관된다.
- [x] Preview와 Web Output이 공통 Renderer와 motionSpec을 사용한다.
- [x] Reduced Motion에서 콘텐츠가 즉시 표시된다.
- [x] JavaScript 실패 시 콘텐츠가 숨지 않는다.
- [x] 기존 Motion 없는 문서가 정상 동작한다.
- [x] 기존 AI Document Motion이 보존된다.
- [x] Revision 충돌 시 덮어쓰지 않는다.
- [x] Production Build와 Browser Smoke Test가 통과한다.

### 16.1 1차 반영 결과 및 잔여 확인

- 반영: Accordion 상태 분리, 컴포넌트 화살표 제거, AI 디자인 Scope, 빈 섹션 구조 제안/검증, Motion V2 Normalizer, Section/Component 트랜지션 UI, Replay, Viewport Enter, Stagger, Reduced Motion.
- 검증: Visual Editor Production Build 통과, 관련 계약 테스트 통과, 로컬 브라우저에서 Accordion·빈 섹션 Empty State·트랜지션 적용·Undo·콘솔 오류 확인 완료.
- 환경 이슈: 현재 `127.0.0.1:4176` 정적 Preview 서버는 `/api/*` 라우트를 실행하지 않아 AI 구조 제안 UI 호출은 404가 발생한다. API Handler와 계약은 자동 테스트로 검증했으며, Vercel Dev 또는 배포 환경에서 통합 호출 재확인이 필요하다.
- 후속 확인: Desktop/Mobile별 Motion Override 정책은 현재 공통 적용이다. 별도 적용이 필요하면 `motionSpec.responsive` 계약을 추가한다.

## 17. 최종 권고

가장 안전한 실행 순서는 다음과 같다.

```text
현재 계약 테스트
→ Section Accordion
→ 불명확한 순서 UI 제거
→ AI 디자인 요구사항
→ AI 섹션 구조 구성
→ Motion 계약 통합
→ Section Transition
→ Component Transition
→ AI Motion 연동
→ 통합 QA
```

트랜지션 UI부터 먼저 만들면 Admin Layout, Promo Override, AI Document의 Key와 저장 범위가 달라 회귀 가능성이 높다.

따라서 기존 `motionSpec`을 Versioned Contract로 먼저 통합하고, 이후 Section과 Component UI를 순서대로 연결한다. AI는 마지막에 동일 Motion Candidate와 Validator를 사용하게 해야 수동 편집과 AI 생성 결과가 일치한다.
