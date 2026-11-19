# 공통 디자인 방향 계약 — 정책·스킬·프롬프트 구분

2026-11-19 · 설계 v2 · 등록용 초안 / 런타임 코드 구현 / 운영 활성화 전

## 1. 책임 분리

| 개선점 | 정책: 반드시 지킬 기준 | 스킬: AI의 판단 방법 | 프롬프트: 실행 시 요구 | 개발 책임 |
|---|---|---|---|---|
| 디자인 의도 단절 | 공통 브리프를 전 단계에 보존 | 동일 방향·명시 요청 우선 | 브리프 확인 후 허용 결과 생성 | 저장·버전·단계별 주입 |
| 최초 구조의 영향 | 핵심 구도는 구성 승인 전에 결정 | 내용에 맞는 구도·반응형 설계 | 고정 hero-card 순서 금지 | 요청/구도 기록·구조 검증 |
| 좁은 토큰 후보 | 등록·호환 후보만, 브리프 적합성 반영 | 받은 후보를 목적에 맞게 조합 | 없는 토큰·값 생성 금지 | 후보 랭킹·다양성·누락 진단 |
| 표현 계약 한계 | 미지원 표현 기록, 검증 우회 금지 | 가능한 대안과 한계 인식 | 스키마 밖 속성 금지 | 스키마/렌더러/저장 호환 확장 |
| 이미지 방향 분리 | 텍스트와 키비주얼의 구도 일치 | 조명·소재·초점·여백 계획 | 공통 이미지 방향·비율·텍스트 안전 영역 준수 | 두 이미지 경로의 브리프 주입 |
| 반복 결과 | 명시 요청 충족과 반복을 구분 | 목적 없는 랜덤 변화 금지 | 근거 있는 차이·계층 판단 | 실제 결과와 요구 비교·평가 기록 |

정책은 AGENTS.md, AI용 스킬은 skills/*.md, 등록용 프롬프트는 prompts/*.md, 전달·저장·후보 선정은 서버/프런트엔드 코드다. 프롬프트가 후보를 더 달라고 적는 것으로 실제 후보가 늘어나지 않는다. 프런트엔드 효과 지침을 생성 모델에 전역 연결하지 않는다.

## 2. 공통 브리프 확장안

기존 api/_page-schema-design.js의 goal/audience/primaryAction/material/recentStructures/recentCompositions/principles를 보존하고 artDirection을 추가한다. 아래는 **저장 계약 제안**이며 모델 출력 필드나 이미 구현된 JSON Schema가 아니다.

```json
{
  "briefVersion": 2,
  "artDirection": {
    "brandMood": ["bold", "cinematic", "premium"],
    "composition": {"hero": "split", "contentRhythm": "asymmetric", "mobileIntent": "image above readable copy"},
    "typographyDirection": {"headline": "strong hierarchy", "body": "readable supporting copy"},
    "keyVisualDirection": {"subject": "poker cards and chips", "lighting": "dramatic", "copySafeArea": "left", "textInImage": false},
    "referenceIds": [],
    "explicitRequirements": [],
    "inferredPreferences": [],
    "unsupportedRequests": []
  }
}
```

이는 한 요청의 예시다. 모든 페이지에 블랙/레드/골드·split·포커를 기본값으로 지정하지 않는다. 미지정 값은 null/빈 배열을 허용하며 추가 입력을 필수로 만들지 않는다. layout A/B는 샘플의 비교 예시로만 취급하고 Production을 두 개 템플릿으로 제한하지 않는다.

referenceIds는 권한이 있는 등록 레퍼런스만 참조한다. URL만 있는 경우 실제 내용을 보았다고 주장하지 않는다. 과거 GGPoker 분석 문서는 현재 사이트 화면의 증거가 아니다. 브랜드/미감은 사실적 혜택·인물·인증·상금·법적 약속을 새로 생성할 권한이 아니다.

요청 원문, 출처, 고객 지정 조건과 AI 추론, 요구사항 Revision, 토큰/정책 버전, 브리프 버전·해시를 연결한다. 기존 캐시 키에 브리프·후보 해시를 반영해 다른 방향의 과거 결과가 재사용되지 않도록 한다. 문구 수정이 필요하면 소스·근거 계약을 따르며, 디자인 브리프에 잠긴 사실 문구를 대체 저장하지 않는다.

## 3. 단계별 전달 위치 — 기존 필수 변수 유지

| 타입 | 디자인 브리프 주입 위치 | 구현 상태 |
|---|---|---|
| promo_page_schema_planner | constraintsJson.designBrief 확장 | 공통 artDirection 추출·저장·주입 구현 |
| promo_page_section_designer | constraintsJson.designBrief | 저장된 공통 브리프 주입 구현 |
| section_background_image | contentJson.designBrief | 공통 브리프 주입 구현, 기존 backgroundColor/brandPalette 유지 |
| component_image | contentJson.designBrief | 공통 브리프·이미지 타깃·텍스트 안전 영역 전달 구현 |
| promo_page_quality_reviewer | constraintsJson.designBrief | 공통 브리프 주입 구현, 측정과 시각 판단 구분 |
| 에디터 선택 영역 AI | 후속 편집 계약의 서버 컨텍스트 | 선택 영역 계약·서버 범위 검증 및 저장 브리프 전달 구현 |

새 템플릿 변수 designBriefJson을 임의 추가하지 않는다. 이미지의 기존 adminGuidance도 그대로 유지하며 브리프 전달 실패를 숨기는 용도로 사용하지 않는다.

새 브리프가 없는 과거 문서는 저장된 개요·페이지·토큰을 근거로 보수적 파생값을 사용할 수 있으나 추정값임을 기록한다. 설정 누락 때문에 새 고객 확인 조건을 만들지 않는다. 서버는 브리프 없는 구버전 요청과 새 버전의 무결성 오류를 구분한다.

## 4. 토큰 후보 선정 구현

기존 pageGenerationStyleRoles의 호환성·안전 필터를 유지한다. 그 뒤 명시 요구 적합성 → 역할/크기 계층 → 색·값·계열 다양성 순서로 후보를 고른다. 기존 저장 역할은 pinned 후보로 해석 가능하게 유지한다. 요청을 반영하려고 수백 개 토큰을 무제한 전송하지 않는다.

선정/제외 이유·토큰 버전·후보 해시·브리프 버전을 실행 기록에 남긴다. 명시한 크기·색상·오버레이가 등록돼 있지만 후보에서 빠진 경우와 라이브러리 자체에 없는 경우를 구분한다. 동률 후보는 재현 가능한 순서를 사용한다. 이미지 팔레트는 브랜드 방향 지침이며 사진의 모든 픽셀을 CSS 토큰으로 제한하는 의미가 아니다. 실제 DOM 스타일의 등록 토큰 정책은 유지한다.

## 5. 구조 승인과 표현 확장

split/center, 배경 이미지와 콘텐츠 관계, 타이포 계층·간격 리듬·모바일 재배치는 구조 생성 시 결정한다. 영역 디자이너는 승인된 틀 안에서 스타일만 다듬는다. 불가능한 요청은 스키마 제한/등록 토큰 부족/후보 누락으로 분류한다.

min-height, image crop/focal point, 글자 정렬·행간·자간 등은 각각 현재 지원 여부를 점검해 필요한 항목만 등록 토큰 또는 bounded enum 계약으로 확장한다. 임의 CSS 주입이나 절대 좌표 허용을 일괄 해제하지 않는다. 변경마다 server schema → validation → renderer/SSR → save/reload → export → 구버전 문서 호환을 확인한다.

## 6. 검토와 출시 기준

명시된 구도·브랜드 대비·타이포 계층·키비주얼 구도가 실제 허용 결과에서 반영되는지 확인한다. 현재 모델이 PageSchema·측정값만 보았다면 ‘시각 검사 완료’라고 기록하지 않는다. 구조 반복은 적합성을 판단할 신호이지 무조건 실패 사유가 아니다.

이미지/영역 결과가 명시 요구와 다르면 허용 범위에서 자동 보정한다. 승인 구조를 바꿔야 하면 채팅의 재승인을 따른다. 토큰 또는 계약상 표현 불가는 구체적 제한으로 안내한다. 신규 디자인 취향 평가는 안전·사실·품질 게이트를 대체하지 않는다.
