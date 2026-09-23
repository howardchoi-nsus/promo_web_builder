# 06. Database·Directus Migration 실행 Runbook

```yaml
status: Draft
source_commit: 3e1386a
execution_allowed: false
decision_required: true
```

## 1. 실행 원칙

- Production 원본 DB Backup 없이는 실행하지 않는다.
- Migration은 멱등성을 가져야 하며 동일 Batch 재실행이 가능해야 한다.
- Schema 적용과 데이터 Migration을 분리한다.
- Full Migration과 Incremental Migration을 분리한다.
- Source의 ID, Revision, Hash와 Timestamp를 보존한다.
- 실패 레코드를 건너뛰고 성공 처리하지 않는다.
- Runtime Cutover는 Migration 완료와 별도 승인으로 실행한다.

## 2. 사전 조건

- [ ] Source Commit 고정
- [ ] Source DB 환경과 Branch 확인
- [ ] Migration `066`~`070` 적용 여부 확인
- [ ] Source DB Backup 또는 Neon Branch 생성
- [ ] Directus Project와 Schema Version 고정
- [ ] Schema Mapping 문서 Approved
- [ ] Reader·Writer·Schema Admin Secret 분리
- [ ] Preview 환경 Dry Run 승인
- [ ] Maintenance Window 결정
- [ ] Rollback 담당자 대기

## 3. 실행 단계

### M0 — Inventory Snapshot

다음 정보를 JSON 또는 CSV로 저장한다.

- 테이블별 전체 건수
- 상태별 건수
- 최소·최대 생성/수정 시각
- Null·중복·고아 Relation 수
- UUID 목록 Hash
- JSON Payload Hash
- Asset Metadata와 Binary Checksum

### M1 — Directus Schema 적용

1. 승인된 Schema Snapshot 확인
2. Development 적용
3. Sample CRUD와 Permission 확인
4. Preview 적용
5. Production 적용 전 Schema Diff가 0인지 확인

### M2 — 변환 Dry Run

Source를 읽고 Directus에 쓰지 않은 상태에서 다음을 생성한다.

- 변환 대상 수
- 제외 대상과 이유
- 필드 변환 결과
- Relation 연결 계획
- 예상 충돌
- 예상 Payload 크기

### M3 — Reference Domain Migration

권장 순서:

```text
Component Definition
→ Component Version
→ Active Version Relation
→ Design Token Set
→ Design Token Version
→ Resource·Locale
→ Asset Metadata
→ Publication
```

### M4 — Relation Linking

Parent·Child를 모두 Upsert한 후 Relation을 연결한다. Relation 누락이 있으면 Batch를 성공 처리하지 않는다.

### M5 — Incremental Catch-up

Full Migration 시작 이후 변경된 Source 레코드를 `updated_at`과 Hash로 다시 추출한다. Clock Skew를 고려해 기준 시각보다 일정 구간 앞에서 재조회하고 ID·Hash로 중복 제거한다.

### M6 — Reconciliation

[07-validation-and-reconciliation-plan.md](./07-validation-and-reconciliation-plan.md)의 모든 Blocking 항목을 통과해야 한다.

## 4. Batch 실행 계약

각 실행은 다음 Metadata를 남긴다.

```json
{
  "migrationId": "directus-component-v1",
  "batchId": "uuid",
  "sourceCommit": "3e1386a",
  "sourceEnvironment": "preview",
  "targetEnvironment": "preview",
  "schemaVersion": "decision-required",
  "startedAt": "ISO-8601",
  "completedAt": "ISO-8601",
  "status": "running|passed|failed|rolled_back",
  "readCount": 0,
  "writeCount": 0,
  "skipCount": 0,
  "failureCount": 0
}
```

## 5. Idempotency 규칙

- Upsert Key는 Source UUID 또는 승인된 Stable Key를 사용한다.
- 같은 Source Revision과 Content Hash면 Write를 생략한다.
- Target에 더 새로운 Revision이 있으면 덮어쓰지 않고 Conflict로 기록한다.
- Relation 연결은 Set 기반으로 비교한다.
- 실행 재시도 시 새 ID를 만들지 않는다.

## 6. 데이터 변환 규칙

| 유형 | 규칙 |
|---|---|
| Timestamp | UTC ISO-8601로 정규화 |
| Empty String | Field 정책에 따라 Null 또는 빈 문자열 고정 |
| JSONB | Stable Key 정렬 후 Hash 생성 |
| Enum | 승인된 Mapping 외 값은 실패 |
| UUID | 형식 검증 후 유지 |
| Locale | 승인된 BCP 47 형식 사용 |
| URL | 허용 Scheme·Host 검증 |
| Asset | Content Hash와 Public URL 검증 |
| RenderSpec | Contract Version과 Validator 통과 필수 |

## 7. 실행 기록표

| 단계 | 환경 | 담당 | 시작 | 종료 | 결과 | Evidence |
|---|---|---|---|---|---|---|
| Inventory | Development | 미정 |  |  | 미실행 |  |
| Schema | Development | 미정 |  |  | 미실행 |  |
| Dry Run | Development | 미정 |  |  | 미실행 |  |
| Full Migration | Preview | 미정 |  |  | 미실행 |  |
| Reconciliation | Preview | 미정 |  |  | 미실행 |  |
| Production | Production | 미정 |  |  | 승인 전 |  |

## 8. 즉시 중단 조건

- Source 또는 Target 환경 식별 불일치
- Backup 확인 실패
- 예상보다 많은 삭제·갱신 발생
- 필수 Relation 누락
- 중복 Key 증가
- RenderSpec·Token Contract 오류
- 401·403 또는 권한 범위 이상
- 실패율이 승인 임계치 초과
- Source 데이터가 Migration 중 변경 금지 정책을 위반

## 9. 완료 조건

- [ ] Read Count와 Target Count 대사 완료
- [ ] 모든 Blocking Diff 0건
- [ ] Relation 무결성 통과
- [ ] Sample Runtime Render 통과
- [ ] Migration Batch와 Evidence 보존
- [ ] Rollback 실행 가능 상태 확인
- [ ] Runtime Source는 아직 변경되지 않았음을 확인

