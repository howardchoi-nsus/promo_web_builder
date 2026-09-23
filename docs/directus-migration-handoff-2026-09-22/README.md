# Promo Web Builder 내부 연동·Directus·DB Migration 문서 패키지

```yaml
status: Draft
owner: Promo Web Builder 개발팀
reviewers: [Backend, Data, DevOps, Security, Product]
source_commit: 3e1386a
baseline_date: 2026-09-22
target_environments: [development, preview, production]
```

## 목적

이 폴더는 Promo Web Builder를 내부 시스템 또는 Directus와 연결하고, 필요한 데이터베이스 마이그레이션을 설계·실행·검증하기 위한 독립 문서 세트다. 진행 보고보다 실행 책임, 데이터 소유권, 변환 규칙, 승인 조건과 복구 절차를 명확히 하는 데 목적이 있다.

현재 구현은 Directus 설정과 연결 검사까지만 제공한다. Directus Collection 생성, 데이터 이전, Runtime Read/Write 전환은 아직 승인·구현되지 않았다. 따라서 관련 문서는 `Draft`와 `결정 필요` 상태를 유지한다.

## 현재 기준선

- 운영 데이터의 Source of Truth: PostgreSQL
- 편집 데이터: Builder Document와 고정 Revision
- 공개 출력: Publication API와 Nuxt SSR Runtime
- Directus: Versioned Config, Secret Reference, Health·인증 연결 검사만 구현
- Directus 데이터 조회·쓰기: 미구현
- Directus 데이터 마이그레이션: 미실행
- 기준 DB Migration: `066`~`070`
- 자동 검증 기준: 163개 테스트 파일, Admin·Visual Editor·Nuxt Build, Nuxt HTTP E2E

## 문서 읽는 순서

| 순서 | 문서 | 목적 | 승인 주체 |
|---:|---|---|---|
| 1 | [01-overview-and-current-baseline.md](./01-overview-and-current-baseline.md) | 현행 시스템과 연동 목표 확정 | 개발 리드 |
| 2 | [02-target-integration-architecture.md](./02-target-integration-architecture.md) | 목표 구조와 시스템 경계 확정 | 아키텍처·DevOps |
| 3 | [03-data-domain-inventory-and-ownership.md](./03-data-domain-inventory-and-ownership.md) | 데이터 소유권과 이전 후보 확정 | Data Owner |
| 4 | [04-directus-schema-mapping-draft.md](./04-directus-schema-mapping-draft.md) | Collection·Field·Relation 매핑 협의 | Backend·Directus 담당 |
| 5 | [05-api-config-and-security-contract.md](./05-api-config-and-security-contract.md) | API·Config·Secret 계약 확정 | Backend·Security |
| 6 | [06-database-migration-runbook.md](./06-database-migration-runbook.md) | Dry Run과 Migration 실행 | DBA·DevOps |
| 7 | [07-validation-and-reconciliation-plan.md](./07-validation-and-reconciliation-plan.md) | 데이터 대사와 합격 기준 | QA·Data Owner |
| 8 | [08-cutover-and-rollback-runbook.md](./08-cutover-and-rollback-runbook.md) | 운영 전환·복구 절차 | 서비스 Owner |
| 9 | [09-operations-monitoring-and-incident-response.md](./09-operations-monitoring-and-incident-response.md) | 운영 지표와 장애 대응 | SRE·운영 |
| 10 | [10-decisions-risks-and-execution-roadmap.md](./10-decisions-risks-and-execution-roadmap.md) | 미결정 사항과 실행 Gate 관리 | 전체 승인자 |

## 문서 관리 규칙

1. 확정되지 않은 값은 추정해서 채우지 않고 `결정 필요`로 표시한다.
2. Collection·Field 변경은 Schema Mapping 문서와 Migration Script를 동시에 변경한다.
3. Production 실행 전 Source Commit, DB Migration 번호, Directus Schema Version을 고정한다.
4. Secret 원문은 문서, DB, API 응답, 로그에 기록하지 않는다.
5. 각 실행 단계는 담당자와 승인자가 다른 사람이어야 한다.
6. Runtime Cutover와 데이터 Migration은 하나의 버튼이나 자동 단계로 묶지 않는다.
7. Rollback 절차를 검증하지 않은 Migration은 Production에서 실행하지 않는다.

## 상태 정의

| 상태 | 의미 |
|---|---|
| Draft | 작성 중이며 실행 근거로 사용 불가 |
| Review | 담당자 검토 중 |
| Approved | 지정 환경에서 실행 가능 |
| Executed | 실행과 결과 기록 완료 |
| Deprecated | 더 이상 사용하지 않음 |

