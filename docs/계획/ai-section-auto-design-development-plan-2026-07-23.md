# 섹션 AI 자동 디자인 개발계획서 v2

- 최초 작성일: 2026-07-23
- 개정일: 2026-07-24
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 현재 구현 기준 재수립 / 후속 개발 대기
- 개발 원칙: 신규 병렬 시스템을 만들지 않고 기존 **Section AI V2 파이프라인을 확장**
- 범위 제외: RAG(검색 증강), 자유 형식 CSS·HTML·JS 생성
- 관련 정책: `docs/정책/promo-web-builder-policies-2026-07-23.md`
- 관련 용어: `docs/설계/admin-page-terminology-dictionary-2026-07-22.md`
- 현재 DB 기준선: 마이그레이션 `032_template_ai_policy_and_multi_layout.sql`

---

## 0. 개정 배경

기존 계획서는 마이그레이션 `030` 이전을 기준으로 작성되어 현재 구현 상태와 다음 부분이 달라졌다.

- 다중 요소를 소유할 수 있는 재사용 컴포넌트가 도입되었다.
- `promo_section_design_runs`에 `design_plan`, `effective_patch`, 토큰·프롬프트·컴포넌트 버전 스냅샷이 추가되었다.
- 레이아웃과 이미지 생성을 분리할 수 있는 `request_mode`가 추가되었다.
- 이미지 생성은 `promo_section_design_asset_jobs`로 분리되었고 lease·retry 관련 컬럼이 추가되었다.
- 섹션 배경과 컴포넌트 요소 이미지 프롬프트를 관리자 페이지에서 관리할 수 있다.
- 사용자가 선택한 여러 컴포넌트의 정렬·분배·스택을 LLM이 제안하는 기능이 구현되었다.
- Apply 단계에서 템플릿·레이아웃·토큰·컴포넌트·AI 정책을 다시 검증한다.
- 배경 페이드는 이미지에 굽지 않고 Renderer가 섹션 배경색을 기준으로 CSS로 처리한다.

따라서 이 문서는 별도 `section_design_specs` 시스템을 만드는 계획을 폐기하고, 기존 run 중심 파이프라인에 Style Profile과 Composition Spec을 추가하는 방식으로 재정의한다.

---

## 1. 목적

사용자가 섹션에 컴포넌트와 콘텐츠를 등록한 뒤 원할 때 AI 디자인을 실행하면, 시스템이 다음을 자동으로 구성한다.

1. 섹션 내 컴포넌트 배치
2. 컴포넌트 요소별 타이포·색·강조 역할
3. 디자인 토큰 기반 스타일 선택
4. 섹션 배경 이미지 또는 선택한 컴포넌트 이미지 생성
5. 콘텐츠 배치에 맞는 이미지 focal/safe 영역
6. 섹션 배경색 기반 CSS 페이드

LLM은 자유 CSS나 좌표를 직접 작성하지 않는다. LLM은 허용된 레이아웃 영역·스타일 슬롯·토큰·작업 명령을 선택하고, 결정론적 Executor가 이를 실제 레이아웃 값으로 변환한다.

---

## 2. 핵심 결정

### 2.1 기존 run을 단일 실행 원장으로 사용

`promo_section_design_runs`를 섹션 AI 디자인의 단일 실행 원장으로 유지한다.

- 새 `section_design_specs` 테이블을 만들지 않는다.
- 기존 `design_plan`을 `SectionDesignSpec v2` 역할로 확장한다.
- 기존 `effective_patch`를 Renderer가 적용할 최종 결정론적 결과로 유지한다.
- 기존 `promo_section_design_asset_jobs`를 배경·컴포넌트 요소 이미지 작업에 사용한다.
- 실행 당시 입력·정책·프롬프트·토큰·컴포넌트 버전을 run에 고정한다.

### 2.2 기존 API 확장

다음 기존 흐름을 유지한다.

```text
POST /api/promo-section-design-runs
POST /api/promo-section-design-plan-process
POST /api/promo-section-design-process
POST /api/promo-section-design-image-process
POST /api/promo-section-design-apply
GET  /api/promo-section-design-runs
```

별도 `/api/style-profile-*`, `/api/section-design-*` API를 병렬로 만들지 않는다. Style Profile 관리가 필요하면 기존 디자인 토큰 관리 도메인에 종속된 API로 추가한다.

### 2.3 토큰과 숫자 레이아웃 값 분리

- 색상·폰트·간격·모서리·그림자: 등록된 디자인 토큰만 사용
- 레이아웃 variant·region·정렬·스택: Decision Catalog만 사용
- `xPct`, `yPx`, `widthPct`, `heightPx`: Validator 범위 내 숫자 허용
- LLM의 임의 좌표·임의 CSS: 금지
- 숫자 좌표는 결정론적 Executor 또는 사용자의 드래그 편집으로만 생성

### 2.4 이미지와 페이드 분리

- AI 이미지 자체에는 페이드·그라데이션·비네트·마스크 효과를 굽지 않는다.
- 이미지 가장자리는 선택된 섹션 배경색과 자연스럽게 이어지도록 생성한다.
- 왼쪽·오른쪽·양끝 페이드는 Renderer가 CSS로 처리한다.
- 사용자가 배경색·페이드 방향을 변경해도 이미지를 다시 생성하지 않고 반영할 수 있어야 한다.

### 2.5 재현성 정의

LLM 재호출로 동일 결과를 보장하지 않는다. 이 문서에서 재현성은 다음을 의미한다.

> 저장된 Style Profile·SectionDesignSpec·CompositionSpec·effective patch·이미지 에셋을 다시 적용했을 때 동일한 출력이 렌더링된다.

---

## 3. 표준 용어와 구성 계층

```text
템플릿
└─ 섹션
   └─ 컴포넌트 인스턴스
      └─ 컴포넌트 요소
```

- **템플릿**: 프로모션 페이지에서 사용할 섹션과 순서를 구성한다.
- **섹션**: 페이지의 구조적 영역이다.
- **컴포넌트**: 섹션에서 재사용하는 버전 관리 콘텐츠 블록이다.
- **컴포넌트 인스턴스**: 특정 섹션에 배치된 컴포넌트이다.
- **컴포넌트 요소**: 컴포넌트 내부의 텍스트·이미지·CTA 입력 단위이다.
- **StyleProfile**: 선택된 디자인 토큰 세트 버전에서 컴파일한 이미지·타이포·재질·조명 룩 지침이다.
- **SectionDesignSpec**: LLM이 선택한 섹션 구성 결정이다.
- **CompositionSpec**: 콘텐츠와 이미지의 focal/safe 영역 및 Renderer 페이드 규칙이다.
- **Decision Catalog**: LLM이 선택할 수 있는 허용 값 목록이다.
- **Validator**: 정책·버전·잠금·토큰·배치 규칙을 검증하는 결정론적 게이트이다.
- **Executor**: 검증된 Spec을 실제 좌표와 Renderer patch로 변환한다.

내부 DB/API의 `item`, `itemKey`, `fieldKey`는 호환을 위해 유지할 수 있다. 사용자 화면에서는 `컴포넌트`, `컴포넌트 식별자`, `컴포넌트 요소`로 표시한다.

---

## 4. 현재 구현 기준선

### 4.1 재사용 대상

| 영역 | 현재 구현 | 후속 계획 |
|---|---|---|
| 실행 원장 | `promo_section_design_runs` | 유지·확장 |
| 구조화 계획 | `design_plan` | SectionDesignSpec v2로 확장 |
| 적용 결과 | `effective_patch`, `layout_result` | 유지 |
| 이미지 작업 | `promo_section_design_asset_jobs` | 유지·요소 주소 강화 |
| 토큰 | `promo_design_token_set_versions`, `promo_design_token_values` | StyleProfile 연결 |
| 프롬프트 | `prompt_templates`, prompt snapshot | 유지 |
| 레이아웃 계획 | `section_layout_planner` | v2 계약으로 통합 |
| 다중 선택 정렬 | `multi_component_layout_planner` | 유지 |
| 배경 이미지 | `section_background_image` | Composition 변수 추가 |
| 요소 이미지 | `component_image` | 요소 단위 주소 강화 |
| 적용 검증 | `promo-section-design-apply.js` | 유지·Spec v2 검증 추가 |

### 4.2 현재 허용 레이아웃

현재 계약은 다음 3종을 지원한다.

```json
["split-left", "split-right", "centered-hero"]
```

`stacked`는 Renderer·Validator·관리자 허용 정책·반응형 규칙을 함께 구현한 후에만 추가한다. 문서에 먼저 허용값으로 넣지 않는다.

---

## 5. 목표 아키텍처

```text
[사용자 실행 요청]
  섹션 콘텐츠
  + 템플릿/섹션/컴포넌트 버전
  + 디자인 토큰 세트 버전
  + 관리자 AI 정책
        │
        ▼
[StyleProfile Compiler]
  토큰·디자인 지침 → 버전 고정 룩 스펙
        │
        ▼
[Section Design Planner]
  region/slot/token/asset 결정만 반환
        │
        ▼
[Validator]
  스키마·허용값·잠금·버전·토큰·주소 검증
        │
        ▼
[Composition Calculator]
  컴포넌트 배치 → focal/safe 영역 + CSS fade 규칙
        │
        ▼
[Deterministic Executor]
  Spec → xPct/yPx/widthPct/heightPx + --promo-* 바인딩
        │
        ├─ 이미지 필요 없음 ───────────────┐
        ▼                                  │
[Asset Jobs]                              │
  배경/컴포넌트 요소 이미지 생성           │
        │                                  │
        ▼                                  ▼
[Apply 재검증] → [Visual Editor] → [Web Output]
```

---

## 6. 데이터 모델

### 6.1 StyleProfile 저장 원칙

StyleProfile은 독립적인 브랜드 원장이 아니라 디자인 토큰 세트 버전의 컴파일 산출물이다.

- 하나의 디자인 토큰 세트 버전은 하나 이상의 StyleProfile 버전을 가질 수 있다.
- run은 실행 당시 활성 StyleProfile 버전을 참조하고 전체 spec도 스냅샷으로 보존한다.
- 원본 디자인 문서가 DB 버전을 제공하면 FK로 참조한다.
- 원본이 파일 기반이면 파일 경로만 믿지 않고 `source_hash`를 함께 저장한다.

### 6.2 제안 마이그레이션

현재 최신 `032` 다음 번호인 `033`을 사용한다. 실제 개발 시작 전 최신 번호를 다시 확인한다.

```sql
-- 033_section_ai_style_profile_and_composition.sql
create table if not exists promo_style_profiles (
  id uuid primary key default gen_random_uuid(),
  token_set_version_id uuid not null
    references promo_design_token_set_versions(id) on delete restrict,
  profile_key text not null,
  version integer not null check (version > 0),
  status text not null default 'draft'
    check (status in ('draft', 'active', 'inactive', 'archived')),
  source_name text not null default '',
  source_hash text not null default '',
  spec jsonb not null,
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (token_set_version_id, profile_key, version)
);

create unique index if not exists promo_style_profiles_one_active_uidx
  on promo_style_profiles(token_set_version_id, profile_key)
  where status = 'active';

alter table promo_section_design_runs
  add column if not exists style_profile_version_id uuid
    references promo_style_profiles(id) on delete restrict,
  add column if not exists style_profile_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists composition_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists validation_snapshot jsonb not null default '{}'::jsonb;
```

별도 `section_design_specs` 테이블은 만들지 않는다. 장기적으로 승인된 Spec을 템플릿 프리셋으로 재사용해야 하는 요구가 생길 때만 run과 분리된 프리셋 테이블을 검토한다.

### 6.3 이미지 작업 대상 주소

```json
{
  "targetType": "component-field",
  "sectionKey": "heroBanner",
  "componentInstanceId": "uuid",
  "itemKey": "compatibility-key",
  "fieldKey": "fld_..."
}
```

- 섹션 배경: `targetType=section-background`
- 컴포넌트 요소 이미지: `targetType=component-field`
- `itemKey`는 이전 데이터 호환용
- 신규 작업의 실제 식별은 `componentInstanceId + fieldKey`

기존 DB의 `target_type='item'`은 호환 기간 동안 읽을 수 있어야 한다. 신규 값 추가 시 CHECK 제약·인덱스·API serializer를 한 마이그레이션에서 함께 변경한다.

---

## 7. 계약

### 7.1 Decision Catalog

```json
{
  "layoutVariant": ["centered-hero", "split-left", "split-right"],
  "region": [
    "brand",
    "copy-primary",
    "copy-secondary",
    "center",
    "media-primary",
    "media-secondary",
    "trust"
  ],
  "alignOperation": [
    "align-left",
    "align-center",
    "align-right",
    "align-top",
    "align-middle",
    "align-bottom",
    "distribute-horizontal",
    "distribute-vertical",
    "equal-width",
    "equal-height",
    "set-gap",
    "group-stack-horizontal",
    "group-stack-vertical"
  ],
  "gapToken": ["space-2", "space-3", "space-4", "space-6", "space-8"],
  "fadeMode": ["none", "left", "right", "both"],
  "backgroundSize": ["contain", "cover"],
  "imageShape": ["square", "rounded", "circle"]
}
```

타입 크기·색상·모서리·그림자는 고정 이름 목록으로 중복 관리하지 않고 선택된 디자인 토큰 세트의 `ai_selectable=true` 값에서 동적으로 카탈로그를 만든다.

### 7.2 SectionDesignSpec v2

```json
{
  "contractVersion": 2,
  "sectionKey": "heroBanner",
  "layoutVariant": "split-left",
  "componentPlacements": [
    {
      "componentInstanceId": "uuid",
      "itemKey": "titleBlock",
      "region": "copy-primary",
      "order": 10
    },
    {
      "componentInstanceId": "uuid",
      "itemKey": "heroMedia",
      "region": "media-primary",
      "order": 20
    }
  ],
  "fieldStyleSelections": [
    {
      "componentInstanceId": "uuid",
      "itemKey": "titleBlock",
      "fieldKey": "fld_title",
      "slotKey": "title-size",
      "tokenKey": "--promo-font-size-display"
    },
    {
      "componentInstanceId": "uuid",
      "itemKey": "titleBlock",
      "fieldKey": "fld_title",
      "slotKey": "text-color",
      "tokenKey": "--promo-ink"
    }
  ],
  "assetRequests": [
    {
      "targetType": "section-background",
      "sectionKey": "heroBanner"
    }
  ],
  "rationale": "등록 콘텐츠의 제목을 1순위 위계로 두고 우측에 배경 주제를 배치"
}
```

### 7.3 CompositionSpec

```json
{
  "contractVersion": 1,
  "sectionKey": "heroBanner",
  "contentAnchor": "left",
  "focalZone": "right",
  "safeZone": {
    "x": [0.0, 0.52],
    "y": [0.0, 1.0]
  },
  "focalBox": {
    "x": [0.52, 1.0],
    "y": [0.08, 0.95]
  },
  "fade": {
    "mode": "left",
    "strength": "medium",
    "rendererApplied": true,
    "colorSource": "section-background"
  },
  "aspectRatio": "16:9",
  "backgroundSize": "contain"
}
```

### 7.4 주소 및 잠금 검증

- `componentInstanceId`가 현재 섹션에 속해야 한다.
- `itemKey`는 해당 인스턴스의 호환 식별자와 일치해야 한다.
- `fieldKey`는 고정된 컴포넌트 버전에 존재해야 한다.
- 이미지 요소는 `allowedSources`에 `ai`가 있어야 한다.
- 잠긴 컴포넌트 또는 요소는 콘텐츠 값을 변경할 수 없다.
- 스타일 잠금 기능이 필요하면 콘텐츠 잠금과 분리된 `styleLock` 계약을 먼저 추가한다.
- `is_locked` 하나를 콘텐츠 잠금과 스타일 잠금에 동시에 해석하지 않는다.

---

## 8. StyleProfile

### 8.1 입력

- `promo_design_token_set_versions`
- `promo_design_token_values`
- 토큰 definition의 `semantic_role`, `ai_selectable`
- 선택된 디자인 문서의 룩 지침
- 관리자 dos/donts
- 선택적 레퍼런스 이미지 식별자

### 8.2 출력

```json
{
  "contractVersion": 1,
  "brandName": "Example Brand",
  "paletteRoles": {
    "background": "--promo-bg",
    "text": "--promo-ink",
    "accent": "--promo-accent"
  },
  "materialGuidance": ["soft metallic", "matte surface"],
  "lightingGuidance": ["soft rim light", "low contrast"],
  "typographyGuidance": {
    "displaySlot": "title-size",
    "bodySlot": "body-size"
  },
  "dos": ["keep foreground copy legible"],
  "donts": ["do not render text inside images"],
  "referenceImageIds": []
}
```

### 8.3 선택 정책

- 템플릿은 디자인 토큰 세트 버전을 선택한다.
- 해당 토큰 세트 버전에 연결된 활성 StyleProfile을 기본값으로 사용한다.
- 프로모션 단위 오버라이드는 명시적인 사용자 선택이 있을 때만 허용한다.
- run 생성 시 StyleProfile ID·버전·spec·source hash를 모두 스냅샷으로 고정한다.

---

## 9. Planner·Validator·Executor

### 9.1 Planner가 할 일

- 허용된 layout variant 선택
- 모든 노출 컴포넌트를 허용 region에 한 번씩 배치
- AI 선택이 허용된 style slot과 token을 연결
- 필요한 이미지 대상 선택
- 선택 이유를 짧게 반환

### 9.2 Planner가 하지 않을 일

- CSS·HTML·JS·selector 생성
- 사용자 콘텐츠 생성 또는 수정
- 임의 토큰·컴포넌트·요소 식별자 생성
- `xPct`, `yPx`, `widthPct`, `heightPx` 직접 결정
- 이미지에 표시할 텍스트 생성

### 9.3 Validator P0

- JSON Schema와 `contractVersion`
- layout variant·region·operation allowlist
- 컴포넌트 인스턴스 및 요소 주소
- 컴포넌트 버전
- style slot의 `aiSelectable`
- token의 `aiSelectable`과 semantic role 일치
- 콘텐츠·스타일 잠금
- 이미지 대상 정책
- 템플릿·레이아웃·토큰·프롬프트 revision

### 9.4 Validator P1

- DOM 렌더 후 텍스트 오버플로
- 텍스트 대비
- 컴포넌트 충돌
- 섹션 경계 이탈
- 모바일 스택 변환 후 충돌

### 9.5 Validator P2

- 이미지 safe-zone의 saliency 침범
- 영역별 밝기 대비
- StyleProfile 팔레트와 결과 이미지의 색상 거리

P2는 별도의 이미지 분석 구현·임계값·비용 한도가 필요하다. 분석기를 만들기 전에는 MUST 완료 조건으로 간주하지 않는다.

### 9.6 Executor

Executor는 region과 token binding을 실제 patch로 변환한다.

- region → 기본 `xPct/yPx`
- 컴포넌트 유형 → 기본 `widthPct/heightPx`
- token → `--promo-*` 또는 허용 style property
- 모바일 breakpoint → 스택 순서
- 사용자가 수정한 좌표 → LLM 재실행 전까지 보존

모든 숫자 값은 유한값·최소·최대·섹션 경계 검증을 통과해야 한다.

---

## 10. Composition과 배경 이미지

### 10.1 기본 매핑

| layoutVariant | 콘텐츠 앵커 | focalZone | safeZone | 기본 fade |
|---|---|---|---|---|
| `split-left` | left | right | left | left |
| `split-right` | right | left | right | right |
| `centered-hero` | center | outer | center | both |

사용자가 페이드 방향을 명시한 경우 사용자 값이 기본 매핑보다 우선한다.

### 10.2 배경 이미지 생성 조건

- 이미지 tag는 섹션 배경 레이어로 사용한다.
- 섹션의 전체 배경은 `background-color`만 담당한다.
- 배경 이미지는 섹션 너비 100% 영역에서 렌더링한다.
- 기본 `background-size`는 `contain`, 사용자가 `cover`로 변경할 수 있다.
- 이미지 자체에 페이드·그라데이션·마스크를 굽지 않는다.
- 이미지 가장자리 색은 섹션 배경색과 자연스럽게 연결한다.
- 주요 시각 주제는 **focal 영역 내부의 약 60~70%**를 사용한다.
- safe 영역에는 텍스트 가독성을 해치는 강한 디테일을 두지 않는다.

### 10.3 컴포넌트 요소 이미지

- 특정 이미지 요소를 사용자가 선택한 경우에만 생성한다.
- 생성 결과는 `<img>`가 아니라 크기·모양을 편집할 수 있는 배경 이미지 레이어로 적용한다.
- `contain`, `cover`, 사각형, 둥근 모서리, 원형을 지원한다.
- 사용자 크기 조절은 정비율·자유 비율을 모두 지원한다.
- 컴포넌트 요소 이미지에는 section safe-zone과 fade 규칙을 적용하지 않는다.

---

## 11. 이미지 프롬프트 계약

### 11.1 공통 조립 순서

```text
[StyleProfile]
+ [이미지 유형: 섹션 배경 또는 컴포넌트 요소]
+ [CompositionSpec]
+ [등록 콘텐츠에서 도출한 무드]
+ [관리자 지침]
+ [공통 금지 사항]
+ [Provider 지원 기능에 따른 지시]
```

브랜드명·HEX·재질을 시스템 프롬프트에 하드코딩하지 않는다.

### 11.2 섹션 배경 이미지 템플릿

```text
Create a polished supporting background image for a promotional web section.

Style profile:
{{styleProfileJson}}

Use only the registered section content to derive the visual mood.
Do not render the registered wording inside the image.

Section:
{{sectionName}}

Registered content:
{{contentJson}}

Composition:
- Place the main visual subject inside the {{focalZone}} region.
- Keep the {{safeZone}} region calm and low-detail for DOM text and CTA.
- Let the main visual subject occupy about 60–70% of the focal region.
- Use edge colors compatible with the section background color {{backgroundColor}}.
- Do not bake a fade, gradient, vignette, transparency, border or mask into the image.
- The web renderer applies fade mode {{fadeMode}} with CSS.

Aspect ratio:
{{aspectRatio}}

Administrator guidance:
{{adminGuidance}}

Avoid text, letters, numbers, watermarks, UI, other brand logos,
recognizable real people, celebrities, minors and clutter over the safe region.
```

### 11.3 컴포넌트 요소 이미지 템플릿

```text
Create a polished promotional image for one component field.

Style profile:
{{styleProfileJson}}

Section:
{{sectionName}}

Component:
{{componentName}}

Component field:
{{fieldName}}

Registered content:
{{contentJson}}

Keep the subject clear and isolated with consistent crop and spacing.
Do not apply section background fade or copy-safe-zone effects.
Do not render text, letters, numbers, watermarks, UI or logos.

Administrator guidance:
{{adminGuidance}}
```

---

## 12. Provider 기능 매트릭스

이미지 기능은 Provider·model별 지원 여부를 설정으로 관리한다.

| 기능 | 설정 키 예시 | 미지원 폴백 |
|---|---|---|
| seed | `supportsSeed` | 결과 에셋 스냅샷 보존 |
| 레퍼런스 이미지 | `supportsReferenceImage` | StyleProfile 텍스트 지침 |
| 마스크/인페인팅 | `supportsMask` | 프롬프트 safe-zone |
| 투명 배경 | `supportsTransparency` | 단색 배경 또는 Renderer 처리 |
| 요청 취소 | `supportsCancellation` | lease 만료 후 결과 폐기 |

- 지원 여부가 확인되지 않은 기능을 공통 MUST 요구사항으로 두지 않는다.
- provider request ID·model·model options·프롬프트 hash를 asset job에 저장한다.
- 동일 요청 재시도 시 이미 완료된 레이아웃 plan은 재생성하지 않는다.

---

## 13. 상태·재시도·적용

### 13.1 실행 상태

기존 상태를 유지한다.

```text
queued
→ analyzing_content
→ generating_layout
→ validating_layout
→ generating_assets
→ validating_assets
→ ready
→ applying
→ applied
```

종료 상태:

```text
failed | cancelled
```

### 13.2 재시도

- Planner 실패: Planner 단계부터 재시도
- 특정 이미지 실패: 해당 asset job만 재시도
- 완료된 레이아웃 plan과 다른 성공 이미지 작업은 유지
- lease 만료 작업만 다른 worker가 회수
- 최대 시도 횟수 이후 `failed`

### 13.3 Apply 재검증

적용 직전에 다음을 다시 비교한다.

- 입력 콘텐츠 hash
- 배경색
- 템플릿 버전
- 레이아웃 revision
- 디자인 토큰 세트 버전
- StyleProfile 버전 및 source hash
- 컴포넌트 버전
- 요소 식별자
- 섹션 AI 정책
- 이미지 작업 완료 상태

검증 실패 시 기존 결과를 강제 적용하지 않고 재생성을 안내한다.

---

## 14. 반응형 규칙

CompositionSpec은 데스크톱 결과 하나로 끝내지 않는다.

- 데스크톱: 선택된 variant 적용
- 태블릿: 가용 너비에 따라 split 비율 축소
- 모바일: 기본 세로 스택
- 모바일에서 safe 영역이 유지되지 않으면 배경 이미지를 약화하거나 숨길 수 있다.
- breakpoint별 실제 좌표는 Executor가 결정한다.
- Preview와 Web Output이 동일한 breakpoint 규칙을 공유한다.

반응형 결과도 `effective_patch.responsive`에 고정해 재현 가능하게 한다.

---

## 15. 사용자 UX

AI 자동 디자인은 사용자가 요청할 때만 실행한다.

### 15.1 섹션 단위

- `AI 디자인 생성`
- `섹션 배경 이미지 생성`
- 진행 중 상태와 대상 표시
- 실패 시 동일 대상 재시도
- 생성 완료 후 자동 적용
- 배경 이미지 삭제

### 15.2 컴포넌트 요소 단위

- AI 생성이 허용된 이미지 요소에만 버튼 표시
- 선택한 컴포넌트와 요소명을 진행 상태에 표시
- 생성 완료 후 자동 적용
- 생성 이미지 삭제 및 재생성

### 15.3 다중 컴포넌트

- 2~12개 선택
- LLM은 허용 작업만 제안
- 결정론적 충돌 보정 후 미리보기
- 사용자가 승인하거나 되돌릴 수 있음

---

## 16. 단계별 구현

### Phase 0 — 기준선 확정과 문서 계약

- 기존 run/API/DB/Renderer 재사용 범위 고정
- SectionDesignSpec v2 JSON Schema 작성
- CompositionSpec JSON Schema 작성
- 컴포넌트 인스턴스·요소 주소 계약 확정
- Provider 기능 매트릭스 작성
- 구형 `layout_result` 호환 정책 정의

완료 조건:

- 신규 병렬 API·중복 테이블이 계획에서 제거됨
- 현재 `032` 기준 데이터 흐름과 문서가 일치함

### Phase 1 — 계약·Validator·Executor

- 기존 `design_plan`을 v2로 확장
- 다중 요소 주소 검증
- token/slot/semantic role 검증
- region → 좌표 변환
- 기존 Spec v1 읽기 호환

완료 조건:

- LLM 없이 규칙 기반 Spec으로 유효한 patch 생성
- 임의 CSS·토큰·식별자 거부

### Phase 2 — StyleProfile

- `033` 마이그레이션
- 디자인 토큰 세트 버전에서 StyleProfile 컴파일
- draft/active/inactive/archived 관리
- run snapshot 고정
- 관리자 편집·미리보기

완료 조건:

- 서로 다른 디자인 토큰 세트가 서로 다른 룩으로 컴파일됨
- 기존 활성 프로파일 변경이 과거 run을 바꾸지 않음

### Phase 3 — Planner v2

- StyleProfile·컴포넌트 요소·토큰 catalog를 입력
- SectionDesignSpec v2 구조화 출력
- Validator 실패 시 규칙 기반 폴백
- 프롬프트 snapshot 고정

완료 조건:

- 모든 노출 컴포넌트가 정확히 한 번 배치됨
- 잠긴 콘텐츠와 허용 범위를 침범하지 않음

### Phase 4 — Composition과 이미지

- Composition Calculator
- 배경·요소 이미지 프롬프트 변수 확장
- 이미지에 페이드를 굽지 않는 계약 적용
- Provider 기능별 폴백
- 특정 asset job만 재시도

완료 조건:

- 이미지 가장자리가 섹션 배경색과 자연스럽게 연결됨
- CSS 페이드 변경 시 이미지 재생성 불필요

### Phase 5 — Renderer·반응형·편집 UX

- SectionDesignSpec v2 → effective patch
- breakpoint별 patch
- Visual Editor 진행 상태·재시도·삭제
- 자동 적용과 되돌리기
- Preview/Web Output 동일성 검증

### Phase 6 — 고급 이미지 QA

- safe-zone 밝기·saliency
- 팔레트 색상 거리
- 비용·재시도 임계값

Phase 6은 Provider와 이미지 분석 가능성을 검증한 후 별도 승인으로 진행한다.

---

## 17. 테스트 계획

### 17.1 계약 테스트

- SectionDesignSpec v2 schema
- CompositionSpec schema
- StyleProfile schema
- v1 run 읽기 호환
- componentInstanceId + fieldKey 검증
- token/slot semantic role 검증

### 17.2 API 테스트

- run 생성 시 모든 버전 snapshot 고정
- Planner 결과 검증 실패
- 이미지 요소 권한 거부
- 특정 asset job만 재시도
- Apply 시 revision 불일치 거부
- 적용 lease 경합

### 17.3 브라우저 테스트

- 섹션 AI 디자인 진행 상태
- 배경·컴포넌트 요소 이미지 자동 적용
- 실패 후 재생성
- 생성 이미지 삭제
- 다중 컴포넌트 정렬
- 모바일 스택
- Visual Editor와 Web Output 동등성

### 17.4 이미지 검증

P0/P1에서는 결정론적으로 검증 가능한 항목만 필수로 한다.

- 파일 형식·크기
- Blob proxy 접근
- aspect ratio
- 섹션 배경색 snapshot
- CSS fade 적용
- 이미지 대상 주소

saliency·ΔE는 Phase 6 전까지 필수 테스트에서 제외한다.

---

## 18. Definition of Done

1. 사용자가 요청하면 섹션 콘텐츠를 기반으로 SectionDesignSpec v2가 생성된다.
2. LLM은 허용된 region·slot·token·asset target만 선택한다.
3. 다중 요소 컴포넌트의 특정 요소를 정확히 주소화한다.
4. 콘텐츠·스타일 잠금 정책을 위반하지 않는다.
5. 결정론적 Executor만 실제 좌표와 CSS patch를 만든다.
6. StyleProfile이 선택된 디자인 토큰 세트 버전에 연결된다.
7. 배경 이미지에는 페이드가 구워지지 않고 Renderer가 배경색 기준으로 처리한다.
8. 특정 이미지 실패 시 해당 asset job만 재시도한다.
9. Apply 단계에서 모든 revision과 정책을 다시 검증한다.
10. 저장된 snapshot과 asset을 재적용하면 동일 결과가 렌더링된다.
11. Preview와 Web Output이 같은 Renderer·반응형 규칙을 사용한다.
12. 기존 Spec·run·생성 결과가 계속 조회되고 렌더링된다.
13. 전체 계약·API·브라우저 회귀 테스트가 통과한다.

---

## 19. 구현 작업 지침

1. 작업 전 `git status`와 최신 마이그레이션 번호를 확인한다.
2. 사용자 변경과 무관한 파일을 수정하지 않는다.
3. Phase 0·1 계약을 먼저 완료하고 LLM 호출을 연결한다.
4. 기존 run·asset job·apply API를 재사용한다.
5. LLM 출력은 Validator를 통과하기 전 저장·적용하지 않는다.
6. 이미지 프롬프트는 서버에서 조립하고 최종 렌더링 콘텐츠로 사용하지 않는다.
7. 브랜드 값과 HEX를 시스템 프롬프트에 하드코딩하지 않는다.
8. Provider가 지원하지 않는 기능을 추정해 요청하지 않는다.
9. DB 변경은 백업 브랜치와 롤백 SQL을 준비한 뒤 적용한다.
10. 각 Phase 완료 후 변경 파일·테스트·잔여 이슈를 handoff 문서에 기록한다.

---

## 20. 개발 전 최종 확인 항목

- [ ] 최신 마이그레이션 번호가 `032` 이후인지 재확인
- [ ] StyleProfile과 디자인 토큰 세트 버전 관계 승인
- [ ] 신규 `targetType=component-field` 전환 방식 승인
- [ ] 기존 `targetType=item` 호환 기간 결정
- [ ] 콘텐츠 잠금과 스타일 잠금 분리 방식 결정
- [ ] focal 영역 60~70% 기준의 정확한 의미 승인
- [ ] 모바일 배경 이미지 약화·숨김 정책 승인
- [ ] Gemini 모델 기능 매트릭스 확인
- [ ] Phase 6 이미지 QA의 비용 한도 승인
