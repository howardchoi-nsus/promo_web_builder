# Webflow형 공통 컴포넌트 아이콘 Library 및 Drag & Drop 개발 계획서

- 작성일: 2026-07-31
- 대상: Promo Web Builder Visual Editor
- 상태: 개발 전 검토 완료
- 개발 원칙: 기존 Component Registry, Version, Editor Command, Layout Snapshot 계약을 유지하면서 점진적으로 확장

## 1. 목적

Visual Editor 사용자가 Webflow의 Add Panel처럼 공통 컴포넌트를 아이콘으로 탐색하고, 원하는 Section 또는 정확한 삽입 위치에 Drag & Drop으로 추가할 수 있도록 한다.

핵심 목표:

1. 컴포넌트를 이름과 Key 중심의 목록이 아닌 아이콘 기반 Library로 제공한다.
2. Drag 중 실제 삽입 위치와 배치 가능 여부를 명확히 표시한다.
3. Drop 결과를 Editor Command로 처리해 Undo/Redo와 저장 계약을 유지한다.
4. Component Definition, Instance, Section Pattern을 명확히 분리한다.
5. Desktop/Mobile 기본 Geometry와 Section Layout Preset을 연동한다.
6. AI Composition과 수동 편집이 동일한 Component/Placement 정책을 사용하도록 한다.

## 2. 결론 및 권고

기능 도입을 권장한다.

현재 코드에는 다음 기반이 이미 존재한다.

- 활성 Component Definition 조회
- Component Library 검색
- Component Definition → Instance 변환
- 전용 Drag MIME Payload
- Page Tree 및 Live Preview Drop
- `COMPONENT_INSTANCE_CREATE` Command
- Undo/Redo
- Section Layout Preset과 Desktop/Mobile Geometry

따라서 전체 Editor를 다시 만들 필요는 없다. Library 표현 방식과 Drop Proposal 계층을 추가하는 방식이 적합하다.

단, Webflow처럼 임의 HTML Tag, CSS, 중첩 구조를 무제한 허용하는 방식은 적용하지 않는다.

이 프로젝트에서는 다음을 유지해야 한다.

- Registry에 등록된 Component만 사용
- 활성 Component Version만 신규 Instance 생성 가능
- Section Role과 Placement Policy 검증
- 저장 가능한 Layout 계약 준수
- AI와 사용자가 동일한 허용 범위 사용
- 필수·잠금·고정 정책 유지

## 3. 현재 구현 상태

## 3.1 Component Library

현재 파일:

```text
visual-editor/src/platform/editor-ui/ComponentLibraryPanel.vue
```

현재 기능:

- Component 이름, Key, 설명, Field Kind 검색
- 텍스트 기반 카드 목록
- Drag 시작
- 선택된 Section에 `추가` 버튼으로 삽입

현재 Drag Payload:

```text
application/x-promo-component-definition
```

Payload는 `componentKey`를 전달한다.

## 3.2 Drop Target

현재 파일:

```text
visual-editor/src/platform/editor-ui/PageTree.vue
visual-editor/src/platform/editor-ui/PreviewPanel.vue
```

현재 동작:

- Page Tree의 Section에 Drop 가능
- Live Preview의 Section에 Drop 가능
- Drop 대상 Section Key를 찾아 Component 추가 Event 발생

## 3.3 Instance 생성

현재 파일:

```text
visual-editor/src/platform/editor-core/composition-structure.mjs
visual-editor/src/App.vue
```

현재 동작:

- 활성 Component Version에서 새 Instance 생성
- 신규 `itemKey` 생성
- Definition의 Field, Image, CTA, Style Slot 계약 복제
- 선택된 Section에 추가

## 3.4 Editor Command

현재 파일:

```text
visual-editor/src/platform/editor-core/command-reducer.mjs
```

현재 기능:

- `COMPONENT_INSTANCE_CREATE`
- Component 제거
- Component 순서 변경
- Section 간 Component 이동
- Layout Style 저장
- Undo/Redo

## 3.5 현재 한계

- 아이콘과 Category가 없다.
- Library가 긴 텍스트 목록 형태다.
- 정확한 삽입 위치보다 대상 Section 중심으로 동작한다.
- Live Preview에 삽입선과 Drop 상태가 없다.
- Drop 불가 사유가 화면에 표시되지 않는다.
- Component별 기본 Geometry가 없다.
- Section Role별 배치 가능 정책이 없다.
- Component와 복합 Pattern이 같은 개념으로 보일 가능성이 있다.
- Drag 외 키보드 추가 흐름은 있으나 위치 지정 기능은 제한적이다.

## 4. 제품 개념 구분

Library 항목을 세 계층으로 구분한다.

## 4.1 Primitive Component

하나의 독립적인 편집 단위다.

예:

- Heading
- Text
- Image
- Button
- Logo
- Badge
- Divider
- Spacer

저장 단위:

```text
wizard_item_components
wizard_item_component_versions
```

## 4.2 Layout Component

자식 Component의 배치를 보조하는 구조 단위다.

초기 권장 범위:

- Stack
- Columns
- Grid
- Container

주의:

현재 Section → Component의 단일 계층 구조에서는 완전한 중첩 Container를 바로 지원하기 어렵다.

따라서 초기에는 다음 중 하나로 제한한다.

1. Layout 명령으로 여러 Component Geometry를 정렬
2. 정해진 Field를 가진 복합 Component로 제공
3. Section Pattern으로 제공

임의 중첩 Node Tree는 별도 Contract Version에서 검토한다.

## 4.3 Section Pattern

여러 Component와 Layout Preset을 묶은 재사용 단위다.

예:

- Hero
- Benefit Cards
- Participation Steps
- Image + Text
- Notice
- Terms

기존 Section Preset 기능을 사용한다.

Pattern을 Primitive Component Library에 혼합하지 않는다.

## 5. 권장 정보 구조

왼쪽 Structure Panel:

```text
ADD
├─ Elements
│  ├─ Basic
│  ├─ Media
│  ├─ CTA
│  └─ Decoration
├─ Patterns
│  ├─ Hero
│  ├─ Benefits
│  ├─ Steps
│  └─ Notice
└─ Saved
   ├─ Recent
   └─ Favorites

LAYERS
└─ Page Tree
```

초기 버전에서는 다음 두 Tab으로 시작한다.

```text
페이지 구조
컴포넌트
```

`컴포넌트` Tab 내부에 Category와 아이콘 Grid를 추가한다.

## 6. Component Library UX

## 6.1 아이콘 Grid

권장 Card 구성:

```text
┌─────────────┐
│    ICON     │
│   Heading   │
└─────────────┘
```

표시 정보:

- 아이콘
- 표시 이름
- 짧은 Tooltip
- 활성 Version
- 사용 제한 Badge

기본 Grid:

- Desktop Panel: 2~3열
- 좁은 Panel: 2열
- 최소 Target 크기: 44px 이상

## 6.2 Category

초기 Category:

| Category | 예시 |
|---|---|
| `layout` | Container, Stack, Grid, Divider, Spacer |
| `text` | Heading, Text, List |
| `media` | Image, Logo, Badge |
| `action` | Button, CTA Group |
| `promo` | Benefit, Step, Notice |

Category는 DB Key와 화면 Label을 분리한다.

## 6.3 검색

검색 대상:

- 이름
- Component Key
- 설명
- Category
- Keyword
- Field Kind

검색 결과가 없을 때:

- 입력한 Keyword 표시
- Category 초기화 버튼
- Admin Component 등록 화면 링크는 권한이 있을 때만 제공

## 6.4 최근 사용 및 즐겨찾기

P1 필수 범위에서는 제외한다.

P3 이후 Local Preference 또는 사용자 Profile 저장 방식으로 추가한다.

## 6.5 접근성

아이콘만 표시하지 않는다.

필수:

- 아이콘 아래 이름
- Tooltip
- `aria-label`
- 키보드 Focus
- Enter/Space로 추가
- 선택된 Section에 추가하는 Button 유지
- Drag를 사용할 수 없는 환경에서도 동일 기능 제공

## 7. 아이콘 관리 정책

## 7.1 권장 방식

DB에는 SVG 원문이 아니라 `iconKey`를 저장한다.

예:

```json
{
  "iconKey": "heading",
  "category": "text"
}
```

Frontend에는 검증된 Icon Registry를 둔다.

```js
const COMPONENT_ICON_MAP = {
  heading: HeadingIcon,
  text: TextIcon,
  image: ImageIcon,
  button: ButtonIcon,
  logo: BadgeIcon
};
```

## 7.2 이유

- 임의 SVG Script 삽입 방지
- 아이콘 크기와 Stroke 통일
- Dark/Light Theme 대응
- 번들 안정성
- 존재하지 않는 Key의 Fallback 처리 가능

## 7.3 Fallback

알 수 없는 `iconKey`:

```text
component-generic
```

Field Kind 기반 2차 Fallback:

- `text` → Text Icon
- `image` → Image Icon
- `cta` → Button Icon
- Multi Field → Component Icon

## 8. 데이터 모델

## 8.1 Component 표시 메타데이터

권장 저장 위치:

```text
wizard_item_components.library_presentation jsonb
```

권장 계약:

```json
{
  "category": "media",
  "iconKey": "image",
  "keywords": ["photo", "visual", "banner"],
  "displayOrder": 30,
  "isFeatured": false
}
```

Component 이름과 Category는 Definition 수명주기를 따른다.

## 8.2 Placement Policy

권장 저장 위치:

```text
wizard_item_component_versions.placement_policy jsonb
```

권장 계약:

```json
{
  "allowedSectionRoles": ["hero", "content"],
  "deniedSectionRoles": ["legal"],
  "maxInstancesPerSection": 3,
  "requiresParentCapabilities": [],
  "defaultGeometry": {
    "desktop": {
      "widthPct": 32,
      "heightPx": 180
    },
    "mobile": {
      "widthPct": 90,
      "heightPx": 160
    }
  }
}
```

Version별로 배치 계약이 달라질 수 있으므로 Placement Policy는 Component Version에 둔다.

## 8.3 Migration

예정:

```text
db/migrations/048_component_library_presentation_and_placement_policy.sql
```

추가 Column:

```text
wizard_item_components.library_presentation jsonb
wizard_item_component_versions.placement_policy jsonb
```

기본값:

```json
{}
```

기존 Component는 Field Kind 기반 Fallback을 사용하므로 Migration 직후에도 정상 노출된다.

## 9. API 변경

## 9.1 Component 목록

대상:

```text
GET /api/item-components
```

추가 응답:

```json
{
  "libraryPresentation": {
    "category": "media",
    "iconKey": "image",
    "keywords": ["photo"]
  },
  "activeVersion": {
    "placementPolicy": {
      "allowedSectionRoles": ["hero", "content"],
      "maxInstancesPerSection": 3,
      "defaultGeometry": {
        "desktop": {},
        "mobile": {}
      }
    }
  }
}
```

## 9.2 Admin 저장

기존 Component Definition/Version API에 다음을 추가한다.

- Library Category
- Icon Key
- Keyword
- Display Order
- Section Role 제한
- 최대 Instance 수
- Desktop/Mobile 기본 크기

모든 입력은 Allowlist와 범위 검증을 수행한다.

## 9.3 Drop 검증

초기에는 Client와 Command Reducer에서 동일 Policy를 검증한다.

향후 문서 저장 API에서도 다음을 재검증한다.

- Component Version 존재 여부
- 활성 Version 여부
- Section Role 허용 여부
- 최대 Instance 수
- 필수 Parent Capability
- Layout Geometry 범위

## 10. Drag & Drop 계약

## 10.1 Drag Payload

현재 `componentKey`만 전달하는 방식은 유지할 수 있다.

권장 Payload:

```json
{
  "contractVersion": 1,
  "sourceType": "component-definition",
  "componentKey": "cmp_image",
  "componentVersionId": "uuid",
  "dragSessionId": "uuid"
}
```

보안 원칙:

- Payload의 이름, Policy, Geometry를 신뢰하지 않는다.
- 실제 Definition은 현재 Component Library State에서 다시 조회한다.
- 저장 시 서버가 Version과 Policy를 재검증한다.

## 10.2 Drop Proposal

Drag 중 실제 문서를 바로 변경하지 않는다.

먼저 Proposal을 계산한다.

```json
{
  "targetSectionKey": "hero",
  "targetIndex": 2,
  "placementMode": "flow",
  "geometry": {
    "desktop": {},
    "mobile": {}
  },
  "allowed": true,
  "reason": ""
}
```

## 10.3 Drop 상태

상태:

```text
idle
dragging
allowed
blocked
committing
failed
```

표현:

- 허용: 파란 삽입선과 Highlight
- 제한: 붉은 경계와 사유 Tooltip
- 저장 중: 짧은 Progress 상태
- 실패: 원래 상태 유지 및 오류 안내

## 10.4 정확한 삽입 위치

Page Tree:

- Component 위쪽
- Component 아래쪽
- 빈 Section

Live Preview:

- 대상 Component Bounding Box의 상·하 절반
- Section 빈 영역
- Free Layout에서는 Pointer 좌표 기반 초기 Geometry

결과 Command:

```json
{
  "type": "COMPONENT_INSTANCE_CREATE",
  "payload": {
    "sectionKey": "hero",
    "index": 2,
    "item": {},
    "value": {},
    "style": {}
  }
}
```

## 11. 배치 방식

## 11.1 Flow Drop

Page Tree 또는 자동 배치 Section:

- `targetIndex` 기준 삽입
- 기존 자동 Layout 사용
- 필요 시 Default Geometry 적용

## 11.2 Canvas Drop

Live Preview의 Free Layout Section:

- Pointer 위치를 `xPct`, `yPx`로 변환
- Component 기본 Width/Height 적용
- Section 경계 안으로 Clamp
- Mobile Geometry는 Placement Policy 기본값 사용

## 11.3 Layout Preset 연동

Section Layout Preset이 있는 경우:

1. Preset에 동일 Source Item Key가 있으면 해당 Geometry 사용
2. 없으면 Component Placement Policy의 기본 Geometry 사용
3. 둘 다 없으면 기존 Legacy Auto Layout 사용

## 12. Placement Policy

## 12.1 허용 예시

| Component | 허용 Section Role |
|---|---|
| Logo | header, footer |
| Hero Image | hero |
| CTA Button | hero, benefit, content, cta |
| Terms Text | terms, legal |
| Badge | header, footer, benefit |

## 12.2 차단 예시

- Legal Section에 임의 CTA 추가
- Header에 Terms Component 추가
- 같은 Section에 Logo 2개 이상
- Locked Section에 Component 추가
- 최대 Instance 수 초과
- 활성 Version이 없는 Component 추가

## 12.3 오류 문구

좋은 예:

```text
Logo는 Header 또는 Footer에만 추가할 수 있습니다.
이 Section에는 CTA를 최대 2개까지 추가할 수 있습니다.
활성 Component Version이 없어 추가할 수 없습니다.
```

내부 Key나 DB 오류를 사용자에게 직접 표시하지 않는다.

## 13. Admin UX

Component 관리 화면에 `Library 표시` 영역을 추가한다.

입력 항목:

- Category
- Icon
- Keyword
- 표시 순서
- Featured 여부

Component Version 화면에 `배치 정책` 영역을 추가한다.

입력 항목:

- 허용 Section Role
- 금지 Section Role
- Section당 최대 수량
- Desktop 기본 Width/Height
- Mobile 기본 Width/Height

Icon Picker:

- 등록된 Icon Grid
- 검색
- 선택 Preview
- Generic Fallback 확인

임의 SVG Upload는 초기 범위에서 제외한다.

## 14. Editor UX 상세

## 14.1 Library Panel

구성:

```text
[검색]
[전체] [Layout] [Text] [Media] [Action]

┌──────┐ ┌──────┐
│ ICON │ │ ICON │
│ Text │ │Image │
└──────┘ └──────┘
```

Card Hover:

- 설명 Tooltip
- Drag 가능 Cursor
- `추가` Quick Action

## 14.2 Drag 시작

- 선택 Card의 Drag Ghost 표시
- Component 이름 표시
- Drop 가능한 Section을 약하게 Highlight
- Locked/Denied Section은 비활성화

## 14.3 Drop 위치

- Component 사이 삽입선
- 빈 Section 중앙 Drop Zone
- Canvas Drop 시 Component 크기 Preview
- Escape로 취소

## 14.4 Drop 완료

- 신규 Component 선택
- Property Panel 자동 표시
- 짧은 추가 완료 메시지
- Undo 가능

## 15. Command 및 State 변경

## 15.1 신규 도메인 함수

권장:

```text
resolveComponentDropProposal()
validateComponentPlacement()
defaultComponentGeometry()
componentLibraryIcon()
```

## 15.2 Command 확장

`COMPONENT_INSTANCE_CREATE`에 다음 Payload를 정식 지원한다.

- `index`
- `style`
- `responsiveStyle`
- `visibility`
- `source`

예:

```json
{
  "source": "library-drag",
  "index": 2,
  "style": {
    "positionMode": "free",
    "xPct": 20,
    "yPx": 120,
    "widthPct": 32,
    "heightPx": 180
  },
  "responsiveStyle": {
    "positionMode": "free",
    "xPct": 5,
    "yPx": 120,
    "widthPct": 90,
    "heightPx": 160
  }
}
```

## 15.3 Undo/Redo

하나의 Drop은 하나의 History Entry여야 한다.

다음 변경을 한 번에 복원한다.

- Section Item 추가
- Content 기본값 추가
- Desktop Style 추가
- Mobile Style 추가
- Visibility 추가
- 선택 상태 변경

## 16. 단계별 개발 계획

## P0 — 계약 및 데이터 모델

구현:

- `libraryPresentation` 계약
- `placementPolicy` 계약
- Category/Icon Allowlist
- Migration 048
- Store/API Normalizer 및 Validator
- 기존 Component Fallback

완료 조건:

- 기존 Component가 Migration 후 그대로 노출된다.
- 잘못된 Icon Key와 Geometry가 저장되지 않는다.
- 활성 Version의 Placement Policy가 Public Library에 제공된다.

디버깅:

- Migration Contract Test
- API Contract Test
- 기존 Component Registry 전체 회귀

## P1 — 아이콘 Component Library

구현:

- Icon Registry
- Category Filter
- Icon Grid Card
- Tooltip
- Search Keyword
- Generic Fallback
- 기존 `추가` 버튼 유지

완료 조건:

- Text, Image, CTA, Multi Field가 올바른 아이콘으로 표시된다.
- 알 수 없는 Icon Key가 Generic Icon으로 표시된다.
- 키보드만으로 Component를 추가할 수 있다.

디버깅:

- Component Library Contract Test
- Keyboard Interaction Test
- Admin/Editor Production Build
- Browser Screenshot 및 접근성 확인

## P2 — Drop Proposal 및 삽입선

구현:

- Drag Session State
- `resolveComponentDropProposal`
- Page Tree 정확한 `targetIndex`
- Drop Indicator
- 허용/차단 상태
- 오류 사유

완료 조건:

- Component 사이 원하는 위치에 추가된다.
- 빈 Section에 추가된다.
- Locked/Denied Section Drop이 차단된다.
- Drop 취소 시 문서가 변경되지 않는다.

디버깅:

- Pointer 좌표 경계값
- 첫 번째/마지막 위치
- 빠른 Drag Enter/Leave
- 연속 Drop
- Undo/Redo

## P3 — Live Preview Canvas Drop

구현:

- Pointer → `xPct`, `yPx` 변환
- 기본 Desktop/Mobile Geometry
- Section 경계 Clamp
- Drop Preview Ghost
- Responsive Style 저장

완료 조건:

- Drop한 위치에 Component가 생성된다.
- Desktop/Mobile 기본 크기가 저장된다.
- Preview와 Web Output 결과가 동일하다.
- 저장·재진입 후 위치가 유지된다.

디버깅:

- Desktop/Mobile Browser Test
- 확대/축소된 Preview
- 스크롤된 Section
- Section 높이 경계
- 폭 Overflow

## P4 — Placement Policy

구현:

- Section Role 제한
- 최대 Instance 수
- Locked Section 제한
- Component Capability 제한
- Client와 Server 검증 일치

완료 조건:

- 잘못된 Drop은 Command 전에 차단된다.
- 조작된 Snapshot은 서버 저장에서 차단된다.
- 사용자에게 구체적인 차단 사유가 표시된다.

디버깅:

- Role 조합 Matrix Test
- 최대 수량 경계
- 활성 Version 변경
- Locked/Required 정책 회귀

## P5 — Pattern 및 운영 편의

구현 후보:

- Section Pattern 아이콘 Library
- 최근 사용
- 즐겨찾기
- Featured Component
- 사용량 Event

완료 조건:

- Primitive와 Pattern이 명확히 구분된다.
- 사용자는 자주 쓰는 항목에 빠르게 접근한다.

P5는 사용 데이터 확인 후 범위를 확정한다.

## 17. 테스트 계획

## 17.1 Unit Test

- Icon Fallback
- Category Normalization
- Keyword Search
- Placement Policy
- Default Geometry
- Drop Index
- Pointer 좌표 변환
- Section 경계 Clamp

## 17.2 Command Test

- Component 생성
- 정확한 Index 삽입
- Desktop Style
- Mobile Style
- Visibility
- Undo
- Redo
- Section 제거 후 Style 정리

## 17.3 API Test

- Presentation 저장
- Placement Policy 저장
- Allowlist
- Geometry 범위
- Active Version 응답
- 조작된 Payload 거부

## 17.4 Browser Test

필수 시나리오:

1. Component Tab 진입
2. Category 선택
3. Image Icon Drag
4. Hero의 두 Component 사이 Drop
5. 삽입선 확인
6. 신규 Component 자동 선택
7. Desktop 위치 확인
8. Mobile 위치 확인
9. 저장
10. 재진입
11. Undo/Redo
12. Web Output 확인

## 17.5 접근성 Test

- Tab 순서
- Focus 표시
- Screen Reader Label
- Enter/Space 추가
- Drag 없이 동일 작업 가능
- 색상 외 Drop 상태 표현

## 18. 주요 위험과 대응

| 위험 | 대응 |
|---|---|
| Component와 Pattern 혼합 | Library Tab과 데이터 유형 분리 |
| 임의 SVG 보안 | `iconKey` Allowlist |
| Drag Payload 변조 | Registry에서 Definition 재조회 |
| Drop 위치 오판 | Proposal 단계와 Indicator 도입 |
| Desktop/Mobile 불일치 | 동일 Command에서 두 Geometry 저장 |
| Undo 단위 분리 | 하나의 Create Command로 원자화 |
| 기존 Component 메타데이터 없음 | Field Kind Fallback |
| Section Role 오설정 | Client/Server 동일 Validator |
| 지나친 Webflow 복제 | Registry 기반 허용 모델 유지 |
| 모바일 Drag 어려움 | Click Add와 위치 선택 대안 유지 |

## 19. 배포 순서

```text
Migration 048
→ API/Store 배포
→ Admin Presentation/Policy 편집
→ Icon Library Feature Flag
→ Drop Proposal Feature Flag
→ Canvas Drop
→ Placement Policy 강제
→ 운영 지표 확인
```

Feature Flag 권장:

```text
componentIconLibrary
componentPreciseDrop
componentPlacementPolicy
```

## 20. 관측 지표

Event:

- `component_library_opened`
- `component_library_searched`
- `component_drag_started`
- `component_drop_allowed`
- `component_drop_blocked`
- `component_drop_completed`
- `component_add_button_used`
- `component_drop_undone`

주요 지표:

- Component 추가 성공률
- Drag 시작 대비 Drop 완료율
- 차단 사유별 횟수
- Drag와 Button 사용 비율
- 추가 직후 Undo 비율
- 검색 후 결과 없음 비율

높은 추가 직후 Undo 비율은 잘못된 Drop 위치 또는 불명확한 아이콘을 의미할 수 있다.

## 21. 예상 변경 파일

신규 후보:

```text
db/migrations/048_component_library_presentation_and_placement_policy.sql
visual-editor/src/platform/editor-ui/ComponentIcon.vue
visual-editor/src/platform/editor-ui/ComponentLibraryGrid.vue
visual-editor/src/platform/editor-core/component-drop-proposal.mjs
visual-editor/src/platform/editor-core/component-placement-policy.mjs
visual-editor/src/platform/layout-engine/component-default-geometry.mjs
scripts/test-component-library-icon-contract.mjs
scripts/test-component-drop-proposal.mjs
scripts/test-component-library-browser.mjs
```

수정 후보:

```text
api/_item-components-store.js
api/item-components.js
api/item-component.js
admin-app/src/*
visual-editor/src/platform/editor-ui/ComponentLibraryPanel.vue
visual-editor/src/platform/editor-ui/PageTree.vue
visual-editor/src/platform/editor-ui/PreviewPanel.vue
visual-editor/src/platform/editor-core/command-reducer.mjs
visual-editor/src/platform/editor-core/composition-structure.mjs
visual-editor/src/App.vue
```

실제 개발 전 현재 파일명을 다시 확인한다.

## 22. 완료 정의

- [ ] 공통 Component가 아이콘 Grid로 표시된다.
- [ ] Category와 검색으로 Component를 찾을 수 있다.
- [ ] 아이콘만으로 의미를 전달하지 않고 이름과 Label을 제공한다.
- [ ] Page Tree에서 정확한 위치에 Drop할 수 있다.
- [ ] Live Preview에서 정확한 위치에 Drop할 수 있다.
- [ ] 허용·차단 상태와 사유가 표시된다.
- [ ] Desktop/Mobile 기본 Geometry가 함께 저장된다.
- [ ] Undo/Redo가 한 번의 작업으로 동작한다.
- [ ] Section Role과 최대 Instance 정책이 적용된다.
- [ ] 조작된 저장 요청을 서버가 차단한다.
- [ ] 기존 Component와 기존 문서가 정상 동작한다.
- [ ] Preview와 Web Output 결과가 동일하다.
- [ ] Keyboard만으로 동일 기능을 사용할 수 있다.
- [ ] Production Build와 전체 회귀 Test가 통과한다.

## 23. 최종 권고

가장 안전한 구현 순서는 다음이다.

```text
표시 메타데이터
→ 아이콘 Grid
→ Drop Proposal
→ 정확한 삽입선
→ Canvas Geometry
→ Placement Policy 강제
→ Pattern/즐겨찾기 확장
```

첫 개발 단계에서는 데이터 구조와 기존 Drag Engine을 동시에 크게 변경하지 않는다.

먼저 기존 `componentKey` 기반 Drag를 유지한 채 아이콘 Library를 완성하고, 다음 단계에서 Drop Proposal과 정확한 삽입 위치를 도입한다. 이 순서가 회귀 범위를 가장 작게 유지하면서 사용자 가치도 빠르게 제공한다.
