# 07. 데이터 검증·대사 계획

```yaml
status: Draft
source_commit: 3e1386a
decision_required: true
```

## 1. 목적

Migration이 기술적으로 종료됐다는 사실과 데이터가 정확히 이전됐다는 사실을 구분한다. Count, Field, Relation, Hash와 Runtime 결과를 모두 검증하고 Blocking Diff가 남아 있으면 Cutover를 승인하지 않는다.

## 2. 검증 계층

| 계층 | 검증 내용 | Blocking |
|---|---|---:|
| Schema | Collection·Field·Type·Required·Unique | Y |
| Count | 전체·상태별·Locale별 건수 | Y |
| Identity | UUID·Stable Key 일치 | Y |
| Field | 필수값·Enum·Timestamp·Null | Y |
| Relation | Parent·Child·Active Version | Y |
| Payload | JSON·RenderSpec·Token Hash | Y |
| Asset | URL·File ID·Checksum | 대상일 경우 Y |
| Runtime | Normalized Adapter 결과 비교 | Y |
| Visual | 대표 Promotion Desktop·Mobile | Y |
| Performance | Latency·Timeout·Payload Size | 임계치에 따라 Y |

## 3. Count 대사표

| Domain | Source Total | Target Total | Excluded | Missing | Duplicate | 결과 |
|---|---:|---:|---:|---:|---:|---|
| Component |  |  |  |  |  | 미실행 |
| Component Version |  |  |  |  |  | 미실행 |
| Design Token Set |  |  |  |  |  | 미실행 |
| Design Token Version |  |  |  |  |  | 미실행 |
| Resource·Locale |  |  |  |  |  | 미실행 |
| Asset |  |  |  |  |  | 미실행 |
| Publication |  |  |  |  |  | 미실행 |

## 4. Field Diff 형식

```json
{
  "domain": "component_version",
  "sourceId": "uuid",
  "targetId": "uuid",
  "path": "render_tree.root.children[0].tag",
  "sourceValueHash": "sha256",
  "targetValueHash": "sha256",
  "severity": "blocking|warning",
  "reason": "value_mismatch"
}
```

Secret, 사용자 식별정보, 전체 Prompt 원문은 Diff에 저장하지 않는다.

## 5. Relation 검증

- 모든 Component Version은 존재하는 Component를 참조한다.
- Component의 Active Version은 같은 Component 소속이다.
- Publication의 Source Document와 Revision 조합이 존재한다.
- Token Version은 존재하는 Token Set 소속이다.
- Resource Locale은 승인된 Locale 형식이다.
- Asset Relation은 존재하는 Metadata 또는 File을 참조한다.
- Soft Deleted Parent를 활성 Child가 참조하지 않는다.

## 6. Contract 검증

### RenderSpec

- Contract Version은 지원 범위다.
- Root는 단일 선언형 DOM Tree다.
- Field Reference가 Version Field Schema와 일치한다.
- Script, Event Handler, Raw HTML, 임의 CSS를 포함하지 않는다.
- Token Binding은 등록된 Token만 사용한다.
- 활성 Version은 Validation `ok=true`다.

### Publication

- Slug·Locale 조합이 Unique다.
- Published 상태에는 고정 Revision이 있다.
- Snapshot Contract와 Renderer Version이 Runtime과 호환된다.
- SEO와 Canonical URL이 정책에 맞는다.

## 7. Shadow Read 비교

```text
동일 Query
  ├→ PostgreSQL Adapter → Normalize → A
  └→ Directus Adapter   → Normalize → B
                                  ↓
                            Stable JSON Diff
```

비교 결과는 사용자 응답에 영향을 주지 않고 별도 Metric과 제한된 Diff Store에 저장한다.

## 8. 합격 기준 초안

| 항목 | 합격 기준 |
|---|---|
| 필수 레코드 누락 | 0건 |
| 중복 Stable Key | 0건 |
| 필수 Relation 누락 | 0건 |
| Contract Validation 실패 | 0건 |
| Secret 노출 | 0건 |
| 공개 Runtime 핵심 Field Diff | 0건 |
| 비필수 설명 Field Diff | 승인된 목록만 허용 |
| Directus P95 Latency | 기준선 확정 필요 |
| Fallback 비율 | 기준선 확정 필요 |

## 9. 대표 시나리오

- Component Definition과 활성 Version 조회
- RenderSpec 기반 Component 렌더링
- Design Token 적용
- Locale별 Resource 조회
- Published Promotion SSR
- Unpublished Promotion 410 처리
- Asset URL과 이미지 표시
- Directus 장애 시 Internal Fallback
- Source Revision 변경 후 Cache 갱신

## 10. Evidence 저장

각 검증 실행은 다음을 보존한다.

- Source·Target 환경
- Source Commit
- Directus Schema Version
- Migration Batch ID
- Query·Domain
- Count Summary
- Blocking·Warning Diff 수
- 실행 시각과 담당자
- Screenshot 또는 HTTP 결과 위치
- 최종 승인자

