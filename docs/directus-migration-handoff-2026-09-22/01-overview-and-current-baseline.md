# 01. 개요와 현행 시스템 기준선

```yaml
status: Draft
source_commit: 3e1386a
baseline_date: 2026-09-22
decision_required: false
```

## 1. 연동 목적

Promo Web Builder의 편집·생성 기능을 유지하면서 게시 콘텐츠, 재사용 Component, Design Token, 다국어 Resource와 Asset Metadata 중 합의된 도메인을 내부 시스템 또는 Directus에서 관리할 수 있는 구조를 만든다.

연동의 목적은 기존 PostgreSQL을 즉시 대체하는 것이 아니다. 먼저 데이터 계약과 소유권을 고정하고, 연결 검사 → Schema 준비 → Dry Run → 데이터 대사 → Shadow Read → 도메인별 Cutover 순서로 진행한다.

## 2. 현재 구현 범위

### Builder와 디자인 생성

- 외부 디자인 이미지 등록
- AI 기반 복수 Component 후보 분석
- 후보별 Source Region, Field, RenderSpec, Responsive Spec 생성
- RenderSpec 검증과 안전한 자동 보정
- 선택된 후보의 Component Draft 일괄 생성
- Component·Section DOM Workbench와 Single Live Preview
- Desktop·Mobile 품질 확인과 게시 Quality Gate

### 공개 출력

- Builder Document Revision 고정
- Publication의 Slug·Locale·SEO·상태 관리
- Nuxt SSR 공개 페이지
- 서명 Token 기반 미게시 Revision Preview
- 게시·재게시·게시 중지 시 Nuxt Cache 갱신
- Nuxt Export와 Runtime Compatibility Manifest

### Directus 연결 기반

- 환경별 Directus Config Version
- URL·Secret Reference·Timeout·Retry 설정
- HTTPS·Host Allowlist 검증
- `/server/health` 검사
- `/users/me` 인증 검사
- 연결 검사 결과 저장
- 최신 연결 검사 성공 전 Config 활성화 차단

## 3. 현행 데이터 흐름

```text
관리자 또는 편집자
  → Admin / Promo Builder / Visual Editor
  → PostgreSQL Builder Document 및 Revision
  → Publication이 특정 Revision 고정
  → Publication API
  → Nuxt Runtime
  → 공개 프로모션 SSR
```

AI Component 생성 흐름:

```text
디자인 이미지
  → component_design_sources
  → component_generation_runs
  → AI Visual Analyzer
  → component_generation_proposals
  → RenderSpec 검증·관리자 선택
  → wizard_item_components + draft version
```

Directus 연결 흐름:

```text
관리자 설정
  → promo_integration_configs
  → Validation
  → Directus Health·Auth 요청
  → promo_integration_connection_checks
  → Config 활성화 가능
```

이 흐름에는 Collection 생성이나 데이터 Read/Write가 포함되지 않는다.

## 4. Source of Truth

| 도메인 | 현재 Source of Truth | 비고 |
|---|---|---|
| Component Definition·Version | PostgreSQL | 활성 Version과 Draft 분리 |
| RenderSpec | PostgreSQL Version | 활성 RenderSpec은 검증 통과 필수 |
| Design Token | PostgreSQL | Version 기반 |
| Builder Document·Revision | PostgreSQL | 편집 충돌·Revision 관리 |
| Publication·SEO | PostgreSQL | Slug·Locale별 고정 Revision |
| AI Generation Run·Proposal | PostgreSQL | 실행 추적 데이터 |
| Directus Config·Check | PostgreSQL | 연결 정보와 결과만 저장 |
| 이미지 Binary | Object Storage | DB에는 Metadata·Storage Key 저장 |
| Secret | 배포 환경 Secret Store | DB에는 `env:*` 참조만 저장 |

## 5. 현재 비지원 범위

- Directus Collection·Field·Relation 자동 생성
- PostgreSQL → Directus 데이터 복사
- Asset Binary 이전
- Directus Adapter 기반 Runtime Read
- Directus Runtime Write
- Internal·Directus Shadow Compare
- 자동 Cutover와 양방향 동기화

## 6. 기준 Migration

| Migration | 목적 | 현재 역할 |
|---|---|---|
| `066` | Component RenderSpec·이미지 분석 기반 | Source·Run·Proposal 테이블 |
| `067` | Component Visual Analyzer Prompt | 관리자 활성화 전 Draft 생성 |
| `068` | Multi-candidate 분석 | 큰 이미지에서 복수 후보 계약 |
| `069` | Publication Runtime | Slug·Locale·고정 Revision |
| `070` | Directus Connection Tunnel | Config Version·연결 검사 |

## 7. 기준선 승인 조건

- [ ] 기준 커밋이 Preview와 Production 중 어느 환경에 배포됐는지 기록
- [ ] Migration `066`~`070` 적용 여부를 환경별로 확인
- [ ] 실제 PostgreSQL Object 수와 문서 Inventory 대조
- [ ] Directus가 현재 Runtime 데이터 경로에 연결되지 않았음을 확인
- [ ] 연동 대상 도메인의 Product Owner 지정

