# Mouse Swarm Builder 적용 패키지

2026-11-19 · 패키지 v2 · 정책 확정 / 프롬프트·스킬 등록용 초안 · 저장소 구현 반영 / Admin 활성화·실제 서비스 통합 검증·배포 전

상단 서비스 단계는 **1. 요청 요약 → 2. 페이지 제작**으로 통합한다. 기존 단계 2·3은 페이지 제작 내부의 구성·디자인 상태로 유지한다. 완성 후에는 같은 PageSchema를 웹빌더 에디터에서 수정한다. [통합 개발 계획](../계획/unified-page-builder-editor-plan-2026-11-19.md)이 최신 화면 흐름 기준이다.

목표: 빈 캔버스 → 와이어프레임 생성 → 채팅에서 구성 승인 → 영역 디자인·미디어 준비 → 자동 품질검사·보정 → 출력. 컴포넌트 작업에는 선택 박스·핸들·텍스트 입력 표시를 결합하고, 최대 12개의 시각 커서로 실제 진행 대상을 보여준다.

## 파일과 책임

| 구분 | 파일 | 적용 위치 |
|---|---|---|
| 저장소 기본 정책 | ../../AGENTS.md | 전체 개발·검증·배포 |
| 상세 표시 정책·구현 계약 | policy.md | 프런트엔드와 작업 상태 연결 |
| AI 구조 설계 스킬 | skills/page-structure.md | promo_page_schema_planner에만 연결 |
| AI 영역 디자인 스킬 | skills/region-design.md | promo_page_section_designer에만 연결 |
| AI 이미지 아트디렉션 스킬 | skills/image-art-direction.md | section_background_image / component_image에 연결 |
| AI 품질검토 스킬 | skills/quality-review.md | promo_page_quality_reviewer에만 연결 |
| 구현 담당 지침 | skills/frontend-rendering.md | 개발용 문서. Admin AI 프롬프트에 연결하지 않음 |
| 등록용 프롬프트 | prompts/*.md | 아래 매핑에 따라 새 Draft 버전 생성 |
| 등록 명세 | manifest.json | 타입·필수 변수·스킬 파일·권장 순서 |

## 프롬프트 연결

| 서비스 단계 | Admin 표시 / 내부 타입 | 역할 | 필수 변수 |
|---|---|---|---|
| 페이지 제작 · 구성 생성 (기존 프롬프트 여정 3) | AI 동적 페이지 구조 설계 / promo_page_schema_planner | 동적 PageSchema 생성 | overviewJson, candidateSnapshotJson, constraintsJson |
| 페이지 제작 · 영역 디자인 (기존 프롬프트 여정 6) | AI 영역 디자인 / promo_page_section_designer | 승인된 영역의 등록 스타일 패치 | currentPageJson, sectionJson, candidateSnapshotJson, constraintsJson |
| 페이지 제작 · 배경 키비주얼 | section_background_image | 공통 이미지 아트디렉션 | sectionName, contentJson, backgroundColor (선택 변수는 manifest 참조) |
| 페이지 제작 · 컴포넌트 이미지 | component_image | 이미지 필드별 구도 | sectionName, componentName, fieldName, contentJson |
| 최종 자동 검사·보정 | AI 품질 검토·수정 / promo_page_quality_reviewer | 측정값에 근거한 제한 보정 | currentPageJson, qualityReportJson, candidateSnapshotJson, constraintsJson |

커서·박스·타이핑을 위한 별도 LLM 프롬프트는 만들지 않는다. 개요 분석, 기존 V1/V2는 변경하지 않는다. 이미지 생성 프롬프트 2종은 공통 브리프를 반영한 Draft로 갱신하되 기존 등록 모델·실행 설정을 유지한다. 모델명·온도·토큰 한도·안전 계약은 현재 Admin 등록값을 보존하며 새 모델로 임의 전환하지 않는다.

## 적용 순서

1. Admin 스킬 관리에 AI용 MD 네 개를 각각 등록하고 불변 버전으로 저장한다. 전역 자동 적용은 하지 않는다.
2. 각 타입의 현재 활성 프롬프트를 새 Draft로 복제한다. 해당 `prompts/*.md`를 본문에 적용하고 manifest의 스킬을 그 Draft에만 연결한다. 기존 스킬은 충돌 여부를 검토하고 명시적으로 유지·해제한다. 중복 실행 프롬프트 항목을 새로 만들지 않는다.
3. 필수 변수·서버 스키마·스킬 연결 검증 후 테스트한다. 정책이나 템플릿 값을 모델·응답 계약 설정에 넣지 않는다.
4. 아래 구현 차이를 해소한 뒤 실제 Preview LLM·DB·Blob 여정을 검증한다. 기존 활성 버전은 유지하고 검증된 Draft를 활성화한다. MD 저장만으로 활성화 또는 UI 적용이 된 것으로 간주하지 않는다.
5. 기존 출력·미디어·자동 품질검사 게이트를 통과한 결과만 출력한다. 장애 시 프롬프트·연결 스킬을 함께 이전 버전으로 되돌리고 완료 문서·에셋을 보존한다.

## 저장소 구현 상태와 운영 활성화

- 공통 디자인 브리프, 요청에 따른 등록 토큰 후보 순위, 2단계 UI, 실제 PageSchema 에디터, 정적 HTML 출력 경로를 구현했다.
- 누적 초안은 `095_progressive_page_drafts.sql`의 서버 저장소와 096의 V2 작업 계획·영역 구성 계약을 사용한다. `PAGE_SCHEMA_DRAFT_ENABLED` 기본값은 false다. 096 적용 후 `promo_page_manifest_planner`(작업 계획 V2), `promo_page_region_builder`(영역 구성 V2)를 검증·활성화하고 켠다. 이전 두 타입은 진행 중 V1 초안 복구용으로 보존한다.
- 12개 커서는 실제 작업 대상의 시각 표현이다. 모델을 12개 병렬 실행하거나 완성된 템플릿을 타이머로 노출하지 않는다. 가벼운 계획 1회와 최대 12개 실제 영역/컴포넌트 그룹 호출이다. 승인 문구만 있어도 영역별로 생성·저장·표시하며 전체 구조를 먼저 생성하지 않는다.
- `094_design_direction_pack.sql`은 기존 5종 프롬프트의 새 Draft와 비활성 스킬 4종을 만든다. 기존 활성 모델·버전을 교체하지 않는다. 스킬 연결이 이미 4개인 프롬프트는 자동 Draft 생성을 건너뛰므로 기존 연결을 검토해야 한다.
- 실제 LLM·Neon·Blob·Vercel Preview 여정은 미검증이다. 파일 저장이나 로컬 테스트만으로 운영 활성화·배포 완료로 간주하지 않는다.

## 검증 완료 기준

- 문서 계약 검사: `node scripts/test-mouse-swarm-doc-pack.mjs`.
- 실제 기능 검증은 policy.md의 수용 기준과 기존 `scripts/check-design-preview.mjs`를 함께 적용한다. 위 문서 검사가 UI·실제 모델·운영 DB 검증을 대신하지 않는다.

## 디자인 방향 연결 v2

[디자인 방향 계약](design-direction.md)에 정책·스킬·프롬프트·개발 책임을 구분했다. 등록용 프롬프트는 총 5종, AI 스킬은 4종이며 이미지 두 경로는 같은 이미지 스킬을 연결한다. 프런트엔드 구현 지침은 별도다. 공통 브리프는 기존 constraintsJson/contentJson 안에 런타임 주입한다. 새 필수 템플릿 변수는 추가하지 않았다. 운영 활성화는 아래 조건을 따른다.

세부 구현·검증·운영 준비 상태는 [개발 반영 기록](implementation-status.md)을 참고한다.

V2 운영 이행: 기존 094·095를 반복하지 말고 [096 마이그레이션](../../db/migrations/096_page_draft_units_v2.sql)을 적용한다. 신규 두 타입은 모델·실행·스킬 설정을 기존 구조/문구 타입에서 복제한 Draft이며 자동 활성화되지 않는다. V2 전용 스킬 연결은 필수가 아니고, 복제된 연결 지침과 V2 응답 계약의 호환성을 Admin에서 검토한다.

문구 표시 보정(2026-11-22): 새 문구는 즉시 DOM 반영 후 360ms 일회성 Mask Reveal, 캐럿은 실제 공개 경계를 따른다. 커서는 대상 전환 시 220ms 이동 후 정지하며 반복 횡이동하지 않는다. 같은 단위 문구의 긴 직렬 공개는 하지 않는다. [계획서 17절](../계획/unified-page-builder-editor-plan-2026-11-19.md)과 개발 반영 기록을 참고한다.
