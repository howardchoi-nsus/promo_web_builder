# Directus Integration Config 및 데이터 마이그레이션 설정 기능 개발 계획서

## 0. 문서 정보

- 작성일: 2026-09-08
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 구현 계획 초안
- 목표: 현재 서비스의 설정·관리 데이터를 Directus로 안전하게 이관하고, 검증 후 조회 원본을 전환할 수 있는 관리자 설정 기능 제공
- 기본 방향: 기존 DB → Directus 단방향 마이그레이션

## 1. 목표와 범위

관리자가 설정 화면에서 Directus 연결부터 데이터 이전, 검증, 전환과 복구까지 수행할 수 있게 한다.

```text
연결 설정
→ 권한·스키마 검사
→ 이관 범위 선택
→ 매핑 확인
→ Dry Run
→ 승인
→ Batch 이관
→ 무결성 검증
→ 증분 이관
→ Shadow Read
→ 조회 원본 전환
```

단순히 Directus 접속 정보를 저장하는 기능에 그치지 않는다. 기존 DB의 설정과 관리 데이터를 실제 Directus Collection으로 옮기고, 원본과 대상 레코드를 추적하며, 실패 후 재개하고, 문제가 생기면 기존 DB 조회로 되돌릴 수 있어야 한다.

### 1.1 포함 범위

- Directus 연결·인증·권한 검사
- 대상 Collection 스키마 준비 및 호환성 검사
- 데이터 그룹별 이전 범위 선택
- 필드·관계 매핑 관리
- Dry Run과 충돌 사전 탐지
- 재실행 가능한 Batch 마이그레이션
- 원본/대상 건수·Hash·관계 검증
- 전체 이관 후 변경분을 옮기는 증분 마이그레이션
- Shadow Read, 조회 원본 전환, 즉시 Rollback
- 실행 이력, 항목별 결과, 충돌 및 감사 로그

### 1.2 제외 범위

- Directus와 기존 DB의 양방향 실시간 동기화
- 생성 Job, Lease, Heartbeat 같은 실행 중 상태의 이전
- Access Token, Webhook Secret 등 비밀값 원문 이전
- 1차 릴리스의 파일 바이너리 이전
- 자동 스키마 삭제, 자동 타입 변경, 운영 Collection 자동 Rename

## 2. 설정 화면 구조

기존 관리자 설정에 `외부 연동` 상위 탭을 추가한다.

```text
설정
└─ 외부 연동
   └─ Directus
      ├─ 연결 설정
      ├─ 스키마 준비
      ├─ 데이터 범위
      ├─ 필드·관계 매핑
      ├─ Dry Run
      ├─ 마이그레이션 실행
      ├─ 충돌·실패 항목
      ├─ 검증·전환
      └─ 실행 이력·감사 로그
```

### 2.1 연결 설정

- Directus Base URL
- Project/환경 구분: 개발, 스테이징, 운영
- Schema Admin Credential 참조
- Migration Writer Credential 참조
- Runtime Reader Credential 참조
- 요청 Timeout, Batch 크기, 동시성, Retry 정책
- 연결 상태, Directus 버전, 최근 검사 시각

Token 원문은 브라우저와 애플리케이션 DB에 저장하지 않는다. 화면에는 `secretRef`와 마스킹된 상태만 표시하고, 서버가 Secret 저장소에서 값을 해석한다.

### 2.2 데이터 범위

관리자는 도메인 그룹 단위로 전체 선택하거나 세부 데이터를 제외할 수 있다. 각 그룹에는 예상 건수, 의존 그룹, 마지막 변경 시각, 이전 상태를 표시한다.

### 2.3 Dry Run

실제 쓰기 없이 다음을 계산한다.

- 원본 건수와 대상 예상 건수
- 생성·갱신·건너뜀·충돌 예상치
- 누락된 Collection/Field/Relation
- 변환 실패와 필수값 누락
- 참조할 수 없는 관계
- 비밀정보·민감정보 포함 여부
- 예상 Batch 수, API 호출 수, 처리 시간
- 설정·범위·매핑으로 계산한 `planHash`

승인 이후 설정이나 원본 스냅샷이 달라져 `planHash`가 바뀌면 기존 승인을 무효화하고 Dry Run부터 다시 진행한다.

## 3. 이전 대상 데이터

### 3.1 1차 필수 대상

| 그룹 | 현재 데이터 | Directus 대상 예시 | 비고 |
|---|---|---|---|
| Prompt | `prompt_templates`, `prompt_template_histories` | `prompt_templates`, `prompt_template_versions` | 활성 Version은 마지막 단계에서 적용 |
| Worker 설정 | `worker_webhook_settings`, histories | `worker_settings`, `worker_setting_versions` | Secret 원문 제외, `secret_ref`만 이전 |
| Component | `wizard_item_components`, versions, fields | `item_components`, `item_component_versions`, `item_component_fields` | Definition → Version → Field 순서 |
| Section | `wizard_content_sections`, instances, layouts, histories | `content_sections`, `section_components`, `section_layouts` | Component 선행 필요 |
| Form Template | `wizard_form_templates`, sections, layouts, histories | `form_templates`, `form_template_sections`, `form_template_layouts` | Section 관계 후 연결 |
| Design Token | definitions, sets, versions, values, histories | `design_token_definitions`, `design_token_sets`, `design_token_versions`, `design_token_values` | Set/Version/Value 순서 |
| 다국어 | `locales`, `locale_message_keys`, versions | `locales`, `locale_message_keys`, `locale_message_versions` | Locale과 Key 선행 |
| Content Resource | resources, versions, market rules | `content_resources`, `content_resource_versions`, `content_resource_market_rules` | 시장 규칙 관계 검증 |
| Composition Shell | shells, versions | `composition_shells`, `composition_shell_versions` | 활성 Version 후처리 |
| Motion Preset | presets, versions | `motion_presets`, `motion_preset_versions` | 활성 Version 후처리 |

### 3.2 선택 대상

- `promo_design_assets` 메타데이터
- 디자인 문서 및 정규화된 분석 데이터
- 과거 Audit/History Collection
- 레거시 상태 데이터 중 운영 추적에 필요한 항목

파일 바이너리는 메타데이터 이전이 안정화된 다음 별도 단계로 처리한다. 파일의 원본 URL, Checksum, MIME Type, 크기, Directus File ID를 추적한다.

### 3.3 기본 제외 대상

- `promo_generation_runs` 및 생성 중간·최종 결과
- `promo_section_design_runs`, `promo_section_design_asset_jobs`
- Builder 문서의 작업 이벤트, 임시 Proposal, 편집 중 Revision
- Queue, Lease, Heartbeat, Retry Counter 등 실행 상태
- Webhook Secret, API Key, Directus Token 원문
- 일시적 Cache와 파생 가능 데이터

제외 대상은 무조건 폐기하는 의미가 아니다. 운영 이력 보존이 필요하면 별도 Archive Export 계획으로 분리한다.

## 4. 핵심 설계 원칙

### 4.1 기존 DB를 전환 전까지 원본으로 유지

- 전체 이관과 검증이 끝날 때까지 기존 DB가 Source of Truth다.
- 이전 도중 서비스 쓰기는 기존 DB에만 수행한다.
- 조회 전환은 별도 Cutover 승인 전에는 발생하지 않는다.
- Directus 장애가 현재 사용자 흐름을 중단시키지 않게 한다.

### 4.2 단방향·Single Writer

- 1차는 기존 DB → Directus 단방향만 지원한다.
- 전환 전에는 기존 DB만 쓰기 원본이다.
- 전환 후 쓰기 원본 변경은 별도 후속 계획으로 다룬다.
- 같은 레코드를 두 시스템에서 동시에 편집하는 모드는 제공하지 않는다.

### 4.3 멱등성과 원본 추적

각 Directus 대상 레코드에 다음 Migration Metadata를 둔다.

```text
source_system
source_collection
source_key
source_version
source_hash
migration_run_id
migrated_at
migration_status
```

- `source_key`는 원본 PK를 안정적인 문자열로 직렬화한 값이다.
- 대상 Collection에는 `(source_system, source_collection, source_key)`에 해당하는 유일성 정책을 둔다.
- 같은 `source_key`와 `source_hash`가 있으면 `skip`한다.
- 같은 `source_key`이고 Hash가 다르면 충돌 정책에 따라 갱신하거나 수동 검토한다.
- Directus의 단일 PK 제약을 고려해 복합 원본 키는 `source_key` 문자열로 보존한다.

### 4.4 비밀정보 분리

- 비밀값 원문은 Export, Dry Run 결과, Migration Item, 로그에 포함하지 않는다.
- `secretRef`만 이관하며 대상 환경에 동일한 참조가 준비됐는지 별도로 검사한다.
- 연결용 자격 증명은 Schema Admin, Migration Writer, Runtime Reader로 분리한다.
- 인증정보는 URL Query가 아닌 `Authorization: Bearer` Header로 전달한다.

### 4.5 스키마 변경 보호

- Schema 준비는 데이터 이전과 별도 승인 단계다.
- 기본 모드는 누락 Collection/Field/Relation의 `create-only`다.
- 삭제, Rename, 타입 축소, Nullability 강화는 자동 적용하지 않는다.
- 위험 변경은 Diff 보고서만 제공하고 사람이 별도 승인한다.

## 5. 스키마 및 매핑 관리

### 5.1 Version 관리 파일

```text
directus/
├─ schema/
│  ├─ collections.json
│  ├─ fields.json
│  ├─ relations.json
│  └─ manifest-version.json
└─ mappings/
   ├─ prompts-v1.json
   ├─ registry-v1.json
   ├─ design-tokens-v1.json
   ├─ locales-v1.json
   └─ design-data-v1.json
```

Schema Manifest와 Mapping 파일은 소스 관리 대상으로 두고, 실행 이력에는 사용한 Version과 Checksum을 기록한다.

### 5.2 공통 변환 규칙

- 대상 필드명은 `snake_case`를 기본으로 한다.
- 빈 문자열과 `null`의 의미를 도메인별로 고정한다.
- 날짜는 UTC ISO-8601로 정규화한다.
- JSON 값은 크기 제한과 Schema 검사를 적용한다.
- 원본 UUID는 대상 PK로 강제하지 않고 `source_key`로 보존한다.
- 외래키는 원본 ID를 직접 쓰지 않고 Migration Mapping Table에서 Directus ID로 변환한다.
- 활성 Version/현재 상태 포인터는 하위 Version 이전이 끝난 뒤 적용한다.

### 5.3 충돌 정책

| 조건 | 처리 |
|---|---|
| 대상 레코드 없음 | 생성 |
| 동일 Source Key, 동일 Hash | 건너뜀 |
| 동일 Source Key, Hash 다름, 대상 수동 변경 없음 | 갱신 또는 새 Version 생성 |
| 동일 Source Key, 대상에서 사람이 변경함 | 충돌로 중지하고 검토 |
| Source Key는 다르지만 Business Key가 중복 | 충돌로 중지하고 병합 선택 요청 |
| 필수 관계 대상 없음 | 해당 항목 보류, 관계 오류로 기록 |

충돌 해결 옵션은 `원본으로 덮어쓰기`, `대상 유지`, `필드별 병합`, `항목 제외`로 제한하고 모든 선택을 감사 로그에 남긴다.

## 6. Migration 데이터 모델

### 6.1 Integration Config

`integration_configs`

- `id`, `type`, `environment`, `status`
- `base_url`, `active_version_id`
- `created_by`, `created_at`, `updated_at`

`integration_config_versions`

- `config_id`, `version`, `status`
- `schema_secret_ref`, `writer_secret_ref`, `reader_secret_ref`
- `request_policy_json`, `batch_policy_json`
- `mapping_manifest_version`, `schema_manifest_version`
- `validation_result_json`, `created_by`, `created_at`

### 6.2 Migration Plan과 Run

`integration_migration_plans`

- 선택한 도메인과 Collection
- Source Snapshot 기준 시각
- Schema/Mapping Version
- Dry Run 요약과 `plan_hash`
- 승인자, 승인 시각, 승인 상태

`integration_migration_runs`

- `plan_id`, 실행 유형: `full`, `delta`, `verify`, `rollback`
- 상태: `queued`, `running`, `paused`, `failed`, `completed`, `cancelled`
- 시작·종료·Heartbeat 시각
- 총계와 create/update/skip/conflict/fail 건수
- 마지막 Checkpoint와 오류 요약

`integration_migration_steps`

- 도메인·Collection별 순서와 의존성
- Cursor, Batch 번호, 재시도 횟수
- 단계별 상태와 처리량

`integration_migration_items`

- Source Collection/Key/Hash
- Target Collection/ID/Hash
- 작업 유형, 결과, 오류 코드
- 최초·최근 처리 Run ID

`integration_migration_conflicts`

- 원본/대상 Snapshot과 차이
- 충돌 유형과 추천 처리
- 해결 상태, 해결자, 해결 시각, 선택 사유

## 7. 실행 엔진

### 7.1 의존 순서

```text
공통 사전·정의 데이터
→ Root 엔터티
→ Version 엔터티
→ Field·Value 하위 엔터티
→ 다대다 관계
→ 활성 Version·현재 상태
→ History·Audit
→ Asset 메타데이터
```

구체적인 의존 관계는 DAG로 관리하고, 선행 단계가 실패하면 종속 단계는 실행하지 않는다.

### 7.2 Batch 처리

- Directus 다중 Item 생성·수정 API를 제한된 Batch 크기로 호출한다.
- 초기 기본값은 Batch 100, 동시 실행 2로 두고 환경별 조정 가능하게 한다.
- 매 Batch 성공 후 Source Cursor와 Target 결과를 Checkpoint로 저장한다.
- 프로세스 재시작 후 마지막 성공 Checkpoint부터 재개한다.
- `429`와 일시적 `5xx`는 지수 Backoff로 재시도한다.
- `400`, `401`, `403`, Schema 불일치는 자동 재시도하지 않는다.
- Pause, Resume, Cancel은 Batch 경계에서 안전하게 반영한다.

### 7.3 증분 마이그레이션

- Full Migration의 Source Snapshot 시각 이후 변경분을 다시 읽는다.
- `updated_at`만 신뢰하기 어려운 테이블은 PK Cursor와 History/Event를 함께 사용한다.
- 삭제된 레코드는 기본적으로 대상에서 즉시 삭제하지 않고 `source_deleted_at` 또는 비활성 상태로 표시한다.
- 최종 쓰기 Freeze 이후 마지막 Delta를 수행하고 검증한 뒤 조회를 전환한다.

## 8. 검증과 전환

### 8.1 자동 검증

- 도메인·Collection별 원본/대상 건수 비교
- 정규화된 Payload Hash 비교
- 필수 필드와 유일성 검사
- 끊어진 Relation과 순환 오류 검사
- 활성 Version 단일성 검사
- 비밀값 Pattern 미포함 검사
- 무작위·위험도 기반 표본 데이터 비교
- 기존 Adapter와 Directus Adapter의 응답 Contract 비교

### 8.2 전환 상태

```text
connection_ready
→ schema_ready
→ dry_run_approved
→ full_migrated
→ full_verified
→ source_write_frozen
→ delta_migrated
→ delta_verified
→ shadow_read
→ read_primary
```

상태를 건너뛸 수 없고, 단계별 승인 권한을 분리한다.

### 8.3 Shadow Read

- 사용자 응답은 기존 DB 결과를 사용한다.
- 백그라운드에서 같은 조회를 Directus에도 수행한다.
- 결과를 정규화해 건수, ID, Version, 주요 필드를 비교한다.
- 차이는 사용자 응답에 영향을 주지 않고 비교 로그와 대시보드에만 기록한다.
- 정해진 기간 동안 오류율과 불일치율 기준을 만족하면 `read_primary` 전환을 허용한다.

### 8.4 Rollback

- 조회 Adapter를 즉시 기존 DB로 되돌린다.
- Migration Run과 Mapping은 보존해 원인 분석과 재실행에 사용한다.
- Directus에서 사람이 수정한 데이터는 자동 삭제하거나 덮어쓰지 않는다.
- 자동 Schema Rollback은 제공하지 않는다.
- Rollback 후 발생한 차이는 새 Dry Run으로 다시 평가한다.

## 9. API 계획

### 9.1 연결·스키마

```text
GET   /api/integration-configs?type=directus
GET   /api/integration-config?id={id}
POST  /api/integration-config-draft
PATCH /api/integration-config
POST  /api/integration-config-validate
POST  /api/integration-schema-check
POST  /api/integration-schema-apply
```

### 9.2 마이그레이션

```text
POST  /api/integration-migration-plan
POST  /api/integration-migration-dry-run
POST  /api/integration-migration-approve
POST  /api/integration-migration-run
GET   /api/integration-migration-run?id={id}
POST  /api/integration-migration-control
GET   /api/integration-migration-conflicts?runId={id}
PATCH /api/integration-migration-conflicts
POST  /api/integration-migration-verify
POST  /api/integration-migration-cutover
POST  /api/integration-migration-rollback
```

모든 변경 API는 관리자 인증, 역할 권한, 요청 ID, Audit 기록, 중복 요청 방지 키를 요구한다.

## 10. 서버 모듈 계획

```text
api/_integration-config-store.js
api/_integration-config-contract.js
api/_integration-secret-resolver.js
api/_directus-client.js
api/_directus-url-policy.js
api/_directus-schema-checker.js
api/_migration-source-reader.js
api/_migration-transformer.js
api/_migration-target-writer.js
api/_migration-dependency-graph.js
api/_migration-runner.js
api/_migration-verifier.js
api/_migration-cutover.js
```

도메인별 Transformer는 Prompt, Registry, Design Token, Locale, Content Resource, Composition/Motion, Design Data로 분리한다. 공통 Transformer가 모든 도메인의 예외를 떠안지 않게 한다.

## 11. 기능 구현 Task

### MIG-DX-00. 보안·공통 실행 기반

- 관리자 인증과 역할별 권한 정의
- 요청 ID, 감사 로그, 비밀정보 마스킹 공통화
- 기존 Job의 Lease, Heartbeat, Retry, Pause/Resume 패턴 재사용 가능성 점검
- SSRF 방지를 위한 Directus URL Allowlist와 사설망 정책 구현
- 완료 조건: 비인가 사용자가 연결·Schema·Migration API를 실행할 수 없고 Token이 로그/응답에 노출되지 않음

### MIG-DX-01. Directus Integration Config

- Config 및 Version 테이블 추가
- 연결 설정 UI와 Draft/Validate/Activate 흐름 구현
- URL, Health, 인증, Collection별 Read/Write 권한 검사
- Schema/Writer/Reader Credential 분리
- 완료 조건: 환경별 연결 설정을 안전하게 저장하고 실제 권한 결과를 확인 가능

### MIG-DX-02. Schema 준비

- Directus Collection/Field/Relation Manifest 작성
- 현재 대상과 Manifest Diff 생성
- Create-only Schema Apply 구현
- 위험 변경 차단과 수동 작업 안내
- 완료 조건: 빈 Directus 프로젝트에 필요한 기본 스키마를 재현 가능하고 기존 스키마는 파괴하지 않음

### MIG-DX-03. Migration Framework

- Plan, Run, Step, Item, Conflict 테이블 추가
- Source Reader와 Target Writer 공통 인터페이스 구현
- 의존성 DAG, Checkpoint, Lock, 중복 실행 방지 구현
- Source Key/Hash 기반 멱등성 구현
- 완료 조건: 중간 실패 후 재개해도 중복 레코드가 생기지 않음

### MIG-DX-04. 도메인 Transformer

- 04A: Prompt와 Worker 설정
- 04B: Component, Section, Form Template
- 04C: Design Token과 Locale
- 04D: Content Resource, Composition Shell, Motion Preset
- 04E: 선택적 Design Data와 Asset 메타데이터
- 관계 ID 해석, Version 활성화 후처리, Domain Validation 구현
- 완료 조건: 각 그룹의 원본 데이터가 대상 Contract로 손실 없이 변환되고 관계가 유지됨

### MIG-DX-05. Dry Run·충돌 UI

- 범위 선택과 의존 그룹 자동 포함
- Schema/변환/관계/Secret Scan 결과 제공
- create/update/skip/conflict 예상치와 표본 Preview 제공
- 충돌 비교와 해결 승인 UI 구현
- 완료 조건: 실제 쓰기 전에 예상 결과와 위험 항목을 검토·승인 가능

### MIG-DX-06. Batch Runner·검증 대시보드

- 다중 Item Batch 쓰기와 적응형 Batch 크기 구현
- Retry, Pause, Resume, Cancel, Checkpoint 재개 구현
- 진행률, 처리량, 실패/충돌 Drill-down 구현
- 건수·Hash·관계·표본 자동 검증 구현
- 완료 조건: 대용량 실행 중 장애가 발생해도 안전하게 재개하고 결과를 증명 가능

### MIG-DX-07. Shadow Read·Cutover·Rollback

- 기존 DB/Directus Reader Adapter 분리
- Shadow Read 비교와 허용 기준 구현
- Full 이후 Delta, 쓰기 Freeze, 최종 검증 흐름 구현
- Feature Flag 기반 조회 전환과 즉시 Rollback 구현
- 완료 조건: 사용자 중단 없이 조회 원본을 전환하고 문제 시 기존 DB로 복귀 가능

### MIG-DX-08. 파일 이전 확장

- Asset Manifest, Checksum, Directus File ID Mapping 구현
- 파일 복사, 재시도, 중복 방지, 접근 권한 검증
- 메타데이터와 바이너리 상태 불일치 복구 구현
- 완료 조건: 선택한 Asset 파일과 참조가 빠짐없이 이전됨

## 12. 권장 구현 순서

1. `MIG-DX-00` 보안·공통 기반
2. `MIG-DX-01` 연결 설정
3. `MIG-DX-02` Schema 준비
4. `MIG-DX-03` Migration Framework
5. `MIG-DX-04A` Prompt 한 그룹으로 수직 Slice 완성
6. `MIG-DX-05` Dry Run·충돌 검토
7. `MIG-DX-06` Runner·검증
8. 나머지 `MIG-DX-04` 도메인 확장
9. `MIG-DX-07` Shadow Read·Cutover·Rollback
10. 필요 시 `MIG-DX-08` 파일 이전

첫 수직 Slice는 다음으로 제한한다.

```text
Prompt Template 선택
→ Schema 검사
→ Dry Run
→ Template/Version Batch 이전
→ Source Hash 검증
→ Shadow Read 비교
→ Directus 조회 전환
→ 즉시 기존 DB Rollback 시험
```

이 Slice로 연결, 스키마, 멱등성, 관계, 검증, 전환, 복구의 전체 경로를 먼저 증명한다.

## 13. 테스트 전략

### 13.1 단위 테스트

- Source Key와 Hash 안정성
- 날짜·Null·JSON 정규화
- 도메인별 변환과 필수값 검증
- 관계 ID Mapping
- 충돌 판정과 Secret Redaction
- Retry 가능/불가능 오류 분류

### 13.2 통합 테스트

- 비어 있는 Directus에 Schema 준비 후 Full Migration
- 기존 대상 데이터가 있는 상태의 Update/Skip/Conflict
- Batch 중 프로세스 종료 후 Checkpoint 재개
- 429/5xx 재시도와 401/403 즉시 중지
- 원본 변경 후 Delta Migration
- 대상 수동 수정 후 덮어쓰기 방지

### 13.3 전환 테스트

- Shadow Read 결과 동등성
- 전환 직전 마지막 Delta의 무결성
- Directus Timeout/장애 시 안전한 Fallback
- Read Primary 전환 후 Rollback
- Rollback 이후 재 Dry Run과 재이관

## 14. 완료 기준

- 설정 화면에서 Directus 연결·권한·스키마 준비 상태를 확인할 수 있다.
- 관리자가 이관 데이터 범위와 매핑을 검토하고 Dry Run을 승인할 수 있다.
- 필수 대상 데이터가 의존 순서에 맞춰 Directus로 이전된다.
- 같은 Plan을 재실행해도 중복 데이터가 생기지 않는다.
- 실패 Run은 마지막 Checkpoint부터 재개할 수 있다.
- Target의 사람 수정 내용은 충돌로 보호된다.
- 원본과 대상의 건수, Hash, Relation, 활성 Version을 검증할 수 있다.
- Secret 원문이 Directus, Migration DB, 로그, 화면에 남지 않는다.
- Shadow Read 기준을 통과한 뒤에만 조회 원본을 전환할 수 있다.
- 전환 실패 시 기존 DB로 즉시 Rollback할 수 있다.
- 모든 변경 API에 관리자 인증·권한·감사 로그가 적용된다.
- 단위·통합·전환 테스트와 프로젝트 Build가 통과한다.

## 15. 운영 체크리스트

### 실행 전

- Directus 백업과 복구 절차 확인
- Schema/Writer/Reader Credential 최소 권한 확인
- Schema Manifest와 Mapping Version 고정
- Source Snapshot 기준 시각 기록
- Dry Run 충돌 0건 또는 해결 승인 확인
- 대상 저장 공간과 API Rate Limit 확인

### 실행 중

- 처리량, 오류율, Retry, Heartbeat 감시
- 401/403/Schema 오류 발생 시 즉시 Pause
- Conflict가 허용 기준을 넘으면 자동 Pause
- Source 쓰기와 Snapshot 경계 시각 추적

### 실행 후

- 자동 검증과 표본 검토 완료
- Delta Migration 완료
- Shadow Read 관찰 기간 충족
- Cutover 승인과 Rollback 담당자 대기
- 실행 결과, 예외, 수동 결정 Audit 보관

## 16. 참고 기준

- Directus Authentication: Static Token은 서버 간 통신에 사용할 수 있으며 Bearer Header를 사용한다.
- Directus Server Health: 연결 상태 확인에 `/server/health`를 사용한다.
- Directus Schema: Snapshot/Diff/Apply는 관리자 권한이 필요한 별도 단계로 취급한다.
- Directus Items API: 다중 Item 생성·수정을 Batch Writer의 기반으로 사용한다.
- Directus Collections: Collection과 필드 구조 및 단일 Primary Key 제약을 고려해 `source_key`를 둔다.

