# 컴포넌트 관리 / 템플릿 관리 분리 개발계획서

- 작성일: 2026-07-22
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 구현 전 개발계획 / 소스코드 미반영
- 관련 문서: `docs/claude/admin-page-terminology-dictionary-2026-07-22.md`, `docs/claude/admin-i18n-locale-management-development-plan-2026-07-22.md`
- 적용 대상: 관리자 페이지(`prototype/index.html`) 템플릿·레이아웃 관리, Promo Wizard, Create Promo
- 확정 방향
  - **컴포넌트 관리**: 섹션(및 하위 항목)을 재사용 가능한 전역 컴포넌트로 CRUD 한다.
  - **템플릿 관리**: 등록된 컴포넌트를 **참조·조립**만 한다. 컴포넌트를 소유·복제하지 않는다.
  - 컴포넌트 단위는 **섹션**이며, 항목(item)은 섹션 컴포넌트의 구성요소(합성)로 둔다.

## 0. 문서 목적

관리자의 "템플릿 관리"를 두 책임으로 분리하기 위한 실행 계획이다. 다른 LLM/개발자가 이전 맥락 없이도 다음을 판단·구현할 수 있도록 작성한다.

1. 섹션/항목을 왜, 어떻게 전역 컴포넌트로 승격하는가.
2. 템플릿이 컴포넌트를 소유하지 않고 참조하도록 어떻게 바꾸는가.
3. 기존 소유(copy-on-write) 데이터를 어떻게 안전하게 공유 컴포넌트로 병합하는가.
4. 컴포넌트 편집이 여러 템플릿에 미치는 영향을 어떻게 통제·표시하는가.
5. 각 단계에서 무엇을 통과해야 완료로 판단하는가.

## 1. 최종 결정 요약

### 1.1 채택하는 방향 (MUST)

- 섹션은 특정 템플릿에 종속되지 않는 **전역 컴포넌트**로 관리한다.
- 템플릿-섹션 연결은 `wizard_form_template_sections`(참조 + 인스턴스 오버라이드)로만 표현한다.
- 컴포넌트 정의(공유)와 템플릿 인스턴스 설정(오버라이드)의 경계를 명확히 분리한다.
- 컴포넌트는 `section_key` 기준 active 버전을 **floating 참조**한다. 실제 생성 시점 버전은 run 스냅샷에 기록한다.
- 항목(item)은 섹션 컴포넌트의 하위 구성으로 두고, 독립 조립 단위로 만들지 않는다(v1).
- 기존 소유(`owner_form_template_id`) 데이터는 dedup 후 참조로 이관하며, 값 차이는 리포트하고 보존 결정을 거친다.
- 컴포넌트 편집 시 **사용 중 템플릿 수/목록**을 표시해 파급 범위를 인지시킨다.
- 거버넌스는 기존 draft→active→archived + audit 패턴을 재사용한다.

### 1.2 채택하지 않는 방향 (MUST NOT)

- 템플릿 clone 시 컴포넌트를 복제하지 않는다(참조 행만 복사).
- 컴포넌트 정의 값(name/description/항목 구성/ai_design)을 연결 테이블에 중복 저장하지 않는다.
- 항목을 템플릿에 직접 조립하는 경로를 만들지 않는다(v1).
- `owner_form_template_id`를 신규 로직의 소유 판단 근거로 사용하지 않는다(이관 후 메타/폐기).
- 사용처가 남은 컴포넌트를 하드 삭제하지 않는다(보관/참조 차단만).

## 2. 용어와 강제 수준

- **MUST / MUST NOT / SHOULD / MAY**: 기존 계획서와 동일.
- **컴포넌트(Component)**: 재사용 가능한 섹션 정의. `section_key`로 식별, 버전 관리.
- **항목(Item)**: 컴포넌트 내부 입력 요소. 컴포넌트에 종속.
- **템플릿(Template)**: 컴포넌트 참조 목록 + 인스턴스 오버라이드 + 레이아웃.
- **인스턴스 오버라이드**: 특정 템플릿에서만 적용되는 컴포넌트 배치·노출 설정.
- **floating 참조**: `section_key`의 최신 active 버전을 따라가는 참조.
- **사용처(usage)**: 특정 컴포넌트를 참조하는 템플릿 집합.

## 3. 현재 상태 기준선

### 3.1 데이터 모델 현황

| 테이블 | 역할 | 비고 |
|---|---|---|
| `wizard_content_sections` | 섹션 정의 + draft/active 버전 | 016. `owner_form_template_id`(018) 로 **템플릿 소유** |
| `wizard_content_section_items` | 섹션 하위 항목 | 016. `section_id` FK cascade |
| `wizard_form_templates` | 템플릿 + draft/active 버전 | 017 |
| `wizard_form_template_sections` | 템플릿-섹션 연결(참조 + 오버라이드) | 017. `section_id`(018) + `section_key`, sort_order/is_required/is_visible/user_reorder_allowed |
| `wizard_form_template_layouts` | 템플릿 레이아웃 스펙 | 023 |

### 3.2 확인된 구조 모순

1. **소유와 참조가 공존한다.** 연결 테이블(`wizard_form_template_sections`)은 M:N 참조가 가능하나, `owner_form_template_id`(018, `on delete cascade`) 때문에 섹션은 실제로 **템플릿 1개에 종속**된다.
2. **copy-on-write 로 사본이 흩어진다.** `wizard-form-template-sections.js`(150~188행)는 편집 대상 섹션의 소유자가 현재 템플릿이 아니면 섹션을 **복제해 새로 소유**한다. 같은 `section_key`가 템플릿마다 별도 사본으로 존재한다.
3. **편집 범위가 소유로 제한된다.** 섹션 갱신은 `owner_form_template_id = form_template_id` 조건(200행)에서만 허용된다.
4. **라이브러리 UI가 이미 있으나 비활성.** `index.html` 1256행 `<div class="section-library-manager-body" v-if="false">` — "섹션 라이브러리" 화면이 만들어졌다 보류됨.
5. **clone 이 소유 사본까지 복제한다.** `clone_wizard_form_template_draft`(021)가 소유 섹션을 통째로 복제.

> 결론: 재사용 모델의 뼈대(연결 테이블·라이브러리 UI)는 존재하나 `owner_form_template_id` + copy-on-write 가 이를 1:N 소유로 되돌린다. 본 계획은 이 모순을 참조 모델로 해소한다.

## 4. 목표 아키텍처

### 4.1 책임 분리

```text
[컴포넌트 관리]                         [템플릿 관리]
전역 섹션 컴포넌트 CRUD                   등록 컴포넌트 참조·조립
- section_key / 버전 / 상태               - 컴포넌트 선택(picker)
- 항목 구성                              - 배치(sort/fixed_position)
- AI 디자인 정책                          - 노출/필수/사용자 순서변경
- 이미지 제약                            - 레이아웃 스펙
        │                                        │
        └──────── 참조(section_id/section_key) ───┘
```

### 4.2 공유 정의 vs 인스턴스 오버라이드 경계 (핵심)

| 속성 | 소속 | 저장 위치 |
|---|---|---|
| 이름, 설명 | 컴포넌트(공유) | `wizard_content_sections` |
| 항목 구성, field_kind, text_type | 컴포넌트(공유) | `wizard_content_section_items` |
| AI 디자인 정책, 이미지 제약 | 컴포넌트(공유) | `wizard_content_sections.ai_design` 등 |
| `sort_order` | 인스턴스 | `wizard_form_template_sections` |
| `is_required` | 인스턴스 | `wizard_form_template_sections` |
| `is_visible` | 인스턴스 | `wizard_form_template_sections` |
| `fixed_position` | 인스턴스 | `wizard_form_template_sections` |
| `user_reorder_allowed` | 인스턴스 | `wizard_form_template_sections` |

> 인스턴스 속성은 이미 연결 테이블에 존재하므로 매핑이 깔끔하다. 신규 스키마 변경 없이 경계만 강제하면 된다.

### 4.3 버전 전파

- 템플릿은 `section_key`의 **active 버전을 floating** 참조한다(현재 resolver 동작 유지).
- 컴포넌트 새 active 발행 시 참조 템플릿은 자동으로 최신을 사용한다.
- 안정성이 필요한 경우를 위해 `wizard_form_template_sections.pinned_version`(nullable)을 **선택적으로** 추가한다. null 이면 floating, 값이 있으면 고정. (SHOULD, v1 기본은 floating)
- 실제 프로모션 생성 시 사용된 컴포넌트 버전은 run 스냅샷에 기록한다(기존 구조 활용).

## 5. DB 마이그레이션 계획 (028 제안)

> i18n 계획이 027 을 사용하므로 본 작업은 **028** 로 배정한다.

### 5.1 스키마 변경

```sql
-- db/migrations/028_shared_section_components.sql

-- 1) 인스턴스 버전 고정(선택) 컬럼
alter table wizard_form_template_sections
  add column if not exists pinned_version integer;   -- null = active floating

-- 2) 소유 컬럼을 '출처' 메타로 격하 (즉시 삭제하지 않음: 전환기 안전)
comment on column wizard_content_sections.owner_form_template_id is
  'DEPRECATED. Origin template reference only. Not used for ownership/edit-scope after 028.';

-- 3) 컴포넌트 사용처 조회 뷰
create or replace view wizard_section_component_usage as
select
  s.section_key,
  count(distinct ts.form_template_id) as template_count,
  array_agg(distinct ts.form_template_id) as template_ids
from wizard_content_sections s
left join wizard_form_template_sections ts
  on ts.section_id = s.id or (ts.section_id is null and ts.section_key = s.section_key)
where s.status = 'active'
group by s.section_key;
```

### 5.2 데이터 이관(dedup) — 별도 마이그레이션/스크립트

핵심 난제. 같은 `section_key`의 템플릿별 사본을 하나의 공유 컴포넌트로 병합한다.

1. `section_key`별로 사본들의 값 차이(name/description/ai_design/항목 구성)를 **리포트**한다.
2. **차이 없음**: 대표 1건을 공유 컴포넌트로 남기고 나머지 사본 참조를 대표로 재연결, 잔여 사본 archived.
3. **차이 있음**: 두 가지 처리 정책 중 택1(운영 결정 필요)
   - (a) 대표 컴포넌트 + 차이를 인스턴스 오버라이드로 흡수(가능한 속성만).
   - (b) 서로 다른 컴포넌트로 분리(`section_key` 재명명).
4. 이관 후 `wizard_form_template_sections.section_id` 무결성 검증(021 이 과거 링크 유실을 복구한 이력 참고).

> 이관은 **읽기 전용 리포트 → 승인 → 실제 병합** 순으로 진행하며, 되돌릴 수 있도록 별도 커밋으로 분리한다.

## 6. 서비스 계층 (serverless)

### 6.1 컴포넌트 관리 API (신규)

```text
GET    /api/section-components                 컴포넌트 목록(버전/상태/사용처 수)
GET    /api/section-component?key=             단일 컴포넌트 + 항목 + 버전 이력
POST   /api/section-component                  컴포넌트 생성(draft)
POST   /api/section-component-draft            기존 active 로부터 draft 생성(clone)
PATCH  /api/section-component                  draft 수정(정의/항목)
POST   /api/section-component-activate         draft→active
POST   /api/section-component-archive          보관(사용처 있으면 차단/경고)
GET    /api/section-component-usage?key=       사용 중 템플릿 목록
```

### 6.2 템플릿 조립 API (기존 재구성)

```text
GET    /api/form-template-sections?template=   참조 목록 + 인스턴스 설정
POST   /api/form-template-section              컴포넌트 참조 추가(section_id/key)
PATCH  /api/form-template-section              인스턴스 오버라이드만 수정
DELETE /api/form-template-section              참조 제거(컴포넌트는 보존)
POST   /api/form-template-sections-reorder     참조 순서 변경
```

### 6.3 계약 규칙 (MUST)

- 템플릿 조립 API 는 컴포넌트 정의(name/항목/ai_design)를 **수정할 수 없다**. 인스턴스 속성만 허용.
- 컴포넌트 정의 수정은 컴포넌트 API 에서만, draft→active 거버넌스를 거친다.
- 참조 추가 시 컴포넌트가 active 상태여야 한다(draft 참조 금지).
- 컴포넌트 archive 는 `template_count = 0` 이거나 관리자 강제 확인이 있을 때만.
- clone 은 참조 행만 복사하고 컴포넌트를 복제하지 않는다.

## 7. 관리자 UI 설계

### 7.1 탭/화면 구성

`템플릿·레이아웃 관리`(promo-form) 안을 두 하위 영역으로 분리하거나, 별도 탭으로 승격한다.

- **컴포넌트 관리** (비활성 `section-library-manager` 활성화 + 확장)
  - 컴포넌트 목록: `식별자 | 이름 | 버전 | 상태 | 사용처 수`
  - 편집: 이름/설명/항목 구성/AI 디자인 정책, draft→active, 버전 이력
  - **사용처 패널**: "이 컴포넌트는 N개 템플릿에서 사용 중" + 템플릿 목록
- **템플릿 관리** (조립 전용)
  - 컴포넌트 picker(등록된 active 컴포넌트에서 선택)
  - 참조 목록 배치: 순서/필수/노출/고정 위치/사용자 순서변경
  - 레이아웃 스펙 편집(기존)

### 7.2 재사용 컴포넌트

CSS 아키텍처 계획의 `app-components.css`(`.app-panel/.app-table/.app-status/.app-button`)를 사용한다. 신규 라벨은 i18n 계획의 메시지 키(`admin.component.*`, `admin.template.*`)로 등록한다.

### 7.3 UX 안전장치

- 컴포넌트 편집 저장 전, 사용처가 2개 이상이면 "N개 템플릿에 반영됩니다" 확인.
- 참조 제거와 컴포넌트 삭제를 시각적으로 명확히 구분(참조 제거 ≠ 컴포넌트 삭제).

## 8. 단계별 구현 계획

### Phase 0 — 기준선과 안전망
1. 현재 테스트/`npm run check` 결과 기록.
2. `section_key`별 템플릿 사본 값 차이 리포트 스크립트 작성(읽기 전용).
3. 템플릿/섹션/조립 화면 기준 스크린샷 확보.

완료 기준: 사본 차이 리포트 산출, 기존 테스트 통과, 기준 스크린샷 확보.

### Phase 1 — 스키마·뷰
1. 마이그레이션 `028`(pinned_version, owner 격하 주석, usage 뷰) 적용.
2. usage 뷰/조회 정확성 테스트.

완료 기준: 마이그레이션 idempotent, 사용처 집계 정확.

### Phase 2 — 데이터 이관(dedup)
1. 차이 없음 사본 병합 + 참조 재연결.
2. 차이 있음 사본은 운영 정책(오버라이드 흡수 / 분리)대로 처리.
3. `section_id` 무결성·조립 결과 동등성 검증.

완료 기준: 사본 0건(또는 의도적 분리만 잔존), 조립 결과 이관 전후 동등.

### Phase 3 — 컴포넌트 관리 API·UI
1. 컴포넌트 CRUD/버전/사용처 API.
2. `section-library-manager` 활성화 + 컴포넌트 관리 화면 구현.
3. 컴포넌트 편집→active→참조 템플릿 반영 회귀.

완료 기준: 컴포넌트 독립 CRUD 동작, 사용처 표시, 거버넌스 정상.

### Phase 4 — 템플릿 조립 API·UI 재구성
1. 조립 API 를 인스턴스 오버라이드 전용으로 제한(정의 수정 차단).
2. 컴포넌트 picker + 참조 배치 UI.
3. clone 로직을 참조 복사로 단순화(컴포넌트 비복제).

완료 기준: 템플릿이 컴포넌트를 참조만, clone 이 컴포넌트를 복제하지 않음, Wizard 렌더 동등.

### Phase 5 — 정리·확장
1. `owner_form_template_id` 참조 코드 제거(격하 완료 후).
2. copy-on-write 잔여 로직 제거.
3. 필요 시 버전 pin 옵션 노출, 항목 라이브러리 확장 검토.

완료 기준: 소유 기반 편집 경로 0건, dead 로직 제거, 전체 회귀 통과.

## 9. 파일별 변경 매트릭스

| 파일 | 변경 유형 | 지침 |
|---|---|---|
| `db/migrations/028_shared_section_components.sql` | 신규 | pinned_version, owner 격하, usage 뷰 |
| `db/migrations/029_component_dedup.sql` 또는 스크립트 | 신규 | 사본 병합·재연결(승인 후) |
| `api/_wizard-content-sections-store.js` | 수정 | 소유 제한 제거, 전역 컴포넌트 CRUD |
| `api/section-component*.js` | 신규 | 컴포넌트 관리 엔드포인트 |
| `api/wizard-form-template-sections.js` | 수정 | copy-on-write 제거, 오버라이드 전용 |
| `api/_wizard-form-templates-store.js` | 수정 | clone 을 참조 복사로 |
| `prototype/index.html` | 수정 | 라이브러리 활성화, 컴포넌트/템플릿 UI 분리 |
| `scripts/` | 신규 | 사본 차이 리포트, 조립 동등성 검증 |

## 10. 자동 테스트 계획

- **스키마**: 028 idempotent, usage 뷰 집계, pinned_version null=floating.
- **컴포넌트 API**: draft→active 시 기존 active 강등, archive 사용처 차단, 항목 CRUD.
- **조립 API**: 정의 수정 거부(오버라이드만 허용), draft 참조 금지, 참조 제거 시 컴포넌트 보존.
- **clone**: 템플릿 clone 이 컴포넌트를 복제하지 않고 참조만 복사.
- **이관 검증**: dedup 전후 각 템플릿의 조립 결과(섹션 순서/항목/설정) 동등.
- **브라우저 회귀**: 컴포넌트 편집 파급, Wizard Step 2 렌더, Create Promo 흐름.

## 11. 리스크와 완화책

| 리스크 | 완화 |
|---|---|
| 사본 병합 시 템플릿별 커스터마이즈 유실 | 병합 전 값 차이 리포트 → 승인, 차이는 오버라이드/분리로 보존 |
| 공유 편집이 의도치 않게 여러 템플릿에 반영 | 사용처 표시 + 저장 전 파급 확인 + 버전 거버넌스 |
| `section_id` 링크 유실(021 재발) | 이관 후 무결성 검증 필수, 별도 커밋·롤백 |
| copy-on-write 제거로 기존 편집 UX 변화 | 문서화 + 컴포넌트/참조 개념을 UI 로 명확히 구분 |
| floating 버전으로 예기치 않은 문구 변화 | 필요 컴포넌트만 pin, run 스냅샷에 사용 버전 기록 |
| 컴포넌트 하드 삭제로 참조 깨짐 | 사용처 있으면 archive/차단만, cascade 삭제 금지 |

## 12. Definition of Done

1. 섹션이 템플릿에 종속되지 않는 전역 컴포넌트로 CRUD 된다.
2. 템플릿은 컴포넌트를 참조·조립만 하며 정의를 수정하지 않는다.
3. 컴포넌트 정의(공유)와 인스턴스 오버라이드 경계가 API 로 강제된다.
4. 템플릿 clone 이 컴포넌트를 복제하지 않는다.
5. 기존 소유 사본이 dedup 되고 이관 전후 조립 결과가 동등하다.
6. 컴포넌트 편집 시 사용처가 표시되고 파급이 통제된다.
7. `owner_form_template_id` 기반 편집·소유 로직이 제거된다.
8. 전체 자동 테스트·문법 검사·브라우저 회귀가 통과한다.

## 13. 착수 전 확인 필요 사항

- 사본 값 차이가 있는 `section_key` 의 처리 정책: **오버라이드 흡수 vs 컴포넌트 분리**(운영 결정).
- 버전 참조 기본값: floating 유지 확정 여부(pin 은 선택 기능).
- 컴포넌트/템플릿을 하위 영역으로 둘지, 관리자 별도 탭으로 승격할지.
- 항목(item) 라이브러리 확장은 v1 범위 제외 확정 여부.
