# 08. Cutover·Rollback Runbook

```yaml
status: Draft
source_commit: 3e1386a
execution_allowed: false
decision_required: true
```

## 1. 기본 원칙

- Cutover는 도메인 단위로 수행한다.
- Migration 완료만으로 Runtime Source를 바꾸지 않는다.
- Shadow Read 합격과 서비스 Owner 승인을 필수로 한다.
- Runtime Write는 Read Cutover가 안정화된 이후 별도 단계로 검토한다.
- Rollback은 코드 재배포 없이 Feature Flag 또는 Active Config로 수행할 수 있어야 한다.

## 2. Cutover Gate

| Gate | 조건 | 결과 |
|---|---|---|
| G0 Baseline | Source·Owner·범위 승인 | Schema 설계 가능 |
| G1 Schema | Mapping·Permission 승인 | Development 생성 가능 |
| G2 Dry Run | 변환 오류·충돌 해결 | Preview Migration 가능 |
| G3 Reconciliation | Blocking Diff 0 | Shadow Read 가능 |
| G4 Shadow Read | 오류율·Latency 기준 통과 | Read Cutover 가능 |
| G5 Production Read | 운영 안정화 기간 통과 | Write 검토 가능 |
| G6 Write | 충돌·Rollback 정책 승인 | 제한적 Write 가능 |

## 3. Cutover 사전 Checklist

- [ ] Production Backup 확인
- [ ] 최신 Incremental Migration 완료
- [ ] Blocking Diff 0건
- [ ] Directus Health·Auth 통과
- [ ] Runtime Reader 권한 확인
- [ ] Internal Fallback 동작 확인
- [ ] Cache 제거 절차 확인
- [ ] 운영 담당·Rollback 담당 대기
- [ ] Change Window 공지
- [ ] Dashboard·Alert 준비

## 4. 도메인별 Read Cutover 절차

```text
1. 대상 Domain과 Config Version 고정
2. Shadow Read Metric 최종 확인
3. DIRECTUS_RUNTIME_READ_ENABLED 또는 Domain Policy 활성화
4. Cache 무효화
5. 대표 Query Smoke Test
6. 오류율·Latency·Fallback 관찰
7. 승인 시간까지 모니터링
8. 성공 기록 또는 Rollback
```

현재 `DIRECTUS_RUNTIME_READ_ENABLED`와 Domain Policy는 구현되지 않았다. 구현 전 이 Runbook을 실행할 수 없다.

## 5. Rollback Trigger

- Directus 연결 실패가 임계치 이상 지속
- 401·403 발생
- Schema Version 불일치
- Blocking Data Diff 발견
- 누락·중복·Relation 오류
- P95 Latency 임계치 초과
- 공개 페이지 오류율 증가
- Asset 깨짐 또는 SEO Metadata 손실
- Cache 갱신 실패로 오래된 콘텐츠 노출

## 6. Rollback 절차

```text
1. Directus Runtime Read Flag OFF
2. Domain Source를 Internal Adapter로 복귀
3. 공개 Promotion Cache 무효화
4. 대표 페이지와 API 확인
5. 장애 시작·복구 시각 기록
6. Directus Write가 있었다면 변경분 Freeze
7. Source·Target Diff 추출
8. 재Cutover 금지 상태 설정
```

## 7. Write Cutover 추가 조건

- Single Writer 원칙 확정
- Optimistic Lock 또는 Version Conflict 정책
- Dual Write 금지 또는 명시적 Outbox 설계
- 실패 Write 재처리와 Idempotency
- PostgreSQL 복귀 시 역동기화 절차
- 삭제·Archive 전파 정책
- Audit Log와 사용자 추적

## 8. 실행 기록

| 항목 | 값 |
|---|---|
| Change ID |  |
| Domain |  |
| Source Config Version |  |
| Target Schema Version |  |
| Migration Batch |  |
| Cutover 시작 |  |
| Cutover 완료 |  |
| 담당자 |  |
| 승인자 |  |
| 결과 | 미실행 |
| Rollback 여부 |  |
| Evidence |  |

