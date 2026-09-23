# 04. Directus Schema·Field·Relation Mapping 초안

```yaml
status: Draft
source_commit: 3e1386a
directus_schema_version: unassigned
decision_required: true
execution_allowed: false
```

## 1. 사용 방법

이 문서는 Directus Schema를 생성하기 전 작성하는 Mapping Workbook이다. 아래 Collection 이름은 제안이며 승인 전 생성해서는 안 된다. 각 Collection은 Business Owner, PostgreSQL Owner, Directus 담당자의 공동 승인이 필요하다.

## 2. Collection 후보

| 제안 Collection | Source Domain | 목적 | 1차 범위 | 상태 |
|---|---|---|---:|---|
| `promo_components` | Component Definition | 재사용 Component 식별·상태 | 후보 | 결정 필요 |
| `promo_component_versions` | Component Version | 불변 Version과 RenderSpec | 후보 | 결정 필요 |
| `promo_design_token_sets` | Token Set | Token Set Metadata | 후보 | 결정 필요 |
| `promo_design_token_versions` | Token Version | 활성 Token 값 Snapshot | 후보 | 결정 필요 |
| `promo_content_resources` | Content Resource | Locale별 운영 콘텐츠 | 후보 | 결정 필요 |
| `promo_assets` | Asset Metadata | 공개 Asset 정보 | 후속 | 결정 필요 |
| `promo_publications` | Publication | Slug·Locale·SEO·Revision 참조 | 후보 | 결정 필요 |

다음 데이터는 초기 Directus Collection 대상이 아니다.

- Builder Document와 편집 Revision
- Component Generation Source·Run·Proposal
- Job·Retry·Lease·Queue
- Session·Secret
- 브라우저 Workspace 상태

## 3. 공통 Field 규칙

| Field | 타입 | 규칙 |
|---|---|---|
| `id` | UUID | 가능하면 Source UUID 유지 |
| `status` | String/Dropdown | Source 상태 Enum과 명시적 매핑 |
| `source_revision` | Integer | Source Version 또는 Revision |
| `source_updated_at` | DateTime | Source 변경 시각, UTC |
| `date_created` | DateTime | Directus System Field 사용 여부 결정 |
| `date_updated` | DateTime | Directus System Field 사용 여부 결정 |
| `migration_batch_id` | UUID/String | Migration 실행 추적 |
| `content_hash` | String | 정규화 Payload SHA-256 |

## 4. Component Mapping

### `promo_components`

| PostgreSQL 개념 | Directus Field 제안 | 타입 | 필수 | 변환 | 결정 |
|---|---|---|---:|---|---|
| Component UUID | `id` | UUID | Y | 그대로 | UUID 유지 승인 필요 |
| Component Key | `component_key` | String | Y | 변경 없음 | Unique 필요 |
| 이름 | `name` | String | Y | Trim | 최대 길이 결정 |
| 설명 | `description` | Text | N | 변경 없음 |  |
| 상태 | `status` | Dropdown | Y | 상태 Map | Enum 확정 필요 |
| 배치 정책 | `placement_policy` | JSON | N | 정규화 | JSON 유지 여부 결정 |
| 활성 Version | `active_version` | M2O | N | Relation | Relation 연결은 Version 이후 |

### `promo_component_versions`

| PostgreSQL 개념 | Directus Field 제안 | 타입 | 필수 | 변환 | 결정 |
|---|---|---|---:|---|---|
| Version UUID | `id` | UUID | Y | 그대로 |  |
| Component | `component` | M2O | Y | UUID Relation |  |
| Version 번호 | `version` | Integer | Y | 변경 없음 | Component 내 Unique |
| 상태 | `status` | Dropdown | Y | 상태 Map |  |
| Field Schema | `fields` | JSON/O2M | Y | 정규화 | JSON 또는 Relation 결정 |
| Render Contract | `render_contract_version` | Integer | N | `1` 또는 Null | Legacy 호환 |
| Render Tree | `render_tree` | JSON | N | 검증된 객체 | Raw HTML 금지 |
| Responsive | `render_responsive` | JSON | N | 검증된 객체 |  |
| Accessibility | `render_accessibility` | JSON | N | 검증된 객체 |  |
| Validation | `render_validation` | JSON | N | Hash·Metric 포함 | 내부 오류 원문 제외 검토 |

## 5. Publication Mapping

| Source Field | Directus Field 제안 | 타입 | 필수 | 규칙 |
|---|---|---|---:|---|
| `id` | `id` | UUID | Y | 유지 |
| `slug` | `slug` | String | Y | 소문자, 숫자, 하이픈 |
| `locale` | `locale` | String | Y | `ko-KR` 형식 |
| `status` | `status` | Dropdown | Y | draft/published/unpublished/archived |
| `document_id` | `source_document_id` | UUID | Y | Internal 참조로 유지할지 결정 |
| `document_revision` | `source_revision` | Integer | Y | 고정 Revision |
| `seo_json` | `seo` | JSON/Fields | Y | 구조화 여부 결정 |
| `manifest_json` | `manifest` | JSON | Y | Runtime 호환성 정보 |
| `revalidate_seconds` | `revalidate_seconds` | Integer | Y | 0~86400 |
| `published_at` | `published_at` | DateTime | N | UTC |

Publication Snapshot 자체를 Directus에 복제할지, Internal Revision을 조회할지는 별도 결정이 필요하다. Snapshot을 복제하지 않으면 Directus 단독 Runtime Read가 불가능하다.

## 6. Relation 생성 순서

```text
1. Component Collection
2. Component Version Collection
3. Version → Component M2O
4. Component → Active Version M2O
5. Token Set
6. Token Version
7. Resource·Asset
8. Publication
```

순환 참조가 있는 경우 첫 Migration에서는 `active_version`을 비워 두고 Version 이전 후 연결한다.

## 7. 상태값 Mapping 양식

| Source Status | Directus Status | Runtime 허용 | Migration 대상 | 비고 |
|---|---|---:|---:|---|
| draft | draft | N | 결정 필요 |  |
| active | published/active | Y | Y | 도메인별 명칭 통일 필요 |
| inactive | inactive | N | 결정 필요 |  |
| archived | archived | N | 기본 제외 제안 |  |

## 8. 미결정 사항

- [ ] Directus Collection 실제 이름
- [ ] UUID 보존 또는 신규 ID 발급
- [ ] Field Schema의 JSON 유지 또는 O2M 분리
- [ ] Publication Snapshot 저장 위치
- [ ] Locale을 String으로 유지할지 Locale Collection으로 분리할지
- [ ] Asset URL만 유지할지 Directus Files로 이전할지
- [ ] Archived 데이터의 초기 Migration 포함 여부
- [ ] Directus System Field와 Source Timestamp 우선순위
- [ ] 삭제 시 Restrict, Set Null, Soft Delete 정책

## 9. 승인 조건

- [ ] 모든 Collection에 Business Owner 지정
- [ ] Field Type과 Null 정책 확정
- [ ] Unique·Index 요구사항 확정
- [ ] Relation과 삭제 정책 확정
- [ ] Permission Matrix 승인
- [ ] Sample Payload 10건 이상 변환 검증
- [ ] Schema Snapshot Export와 Version ID 기록

