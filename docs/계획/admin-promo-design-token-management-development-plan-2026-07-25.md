# 관리자 프로모션 디자인 토큰 관리 개발계획서

- 최초 작성일: 2026-07-25
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: P0~P3 구현 및 로컬 검증 완료
- 대상 화면: 설정
- 신규 기능명: 디자인 토큰 관리
- 관리 대상: 프로모션 출력용 `--promo-*` 토큰
- 제외 대상: 관리자 애플리케이션 UI용 `--app-*` 토큰
- 선행 분석 문서: `docs/기획/natural-language-section-composition-analysis-report-2026-07-25.md`
- 용어 기준: `docs/설계/admin-page-terminology-dictionary-2026-07-22.md`
- 현재 최신 DB 마이그레이션: `034_promo_design_token_management.sql`

## 구현 현황

- 구현 완료일: 2026-07-25
- 구현 범위: P0~P3
- 후속 범위: P4 자연어 섹션 구성 및 AI 토큰 선택 연계
- 배포 전 필수 작업: Neon 대상 환경에 `034_promo_design_token_management.sql` 적용

구현된 주요 항목:

- 토큰 세트 서버 식별자 자동 생성, 생성·수정·복제·보관
- 한 세트당 단일 Draft, 활성 버전 기반 Draft 및 과거 버전 기반 롤백 Draft
- Draft 개별 값 편집, CSV Dry Run, CSV 원자 저장
- 활성화 직전 전체 값 재검증 및 기존 활성 버전을 보존하는 원자 활성화
- 버전 목록·값 비교·변경 이력·템플릿 및 AI 실행 사용 현황
- Desktop/Mobile 공통 Renderer CSS 기반 미리보기
- 활성 토큰 버전을 선택한 Draft 템플릿에 명시적으로 연결
- Public Template → Create Promo snapshot → Visual Editor/Web Output으로 `--promo-*` 값 전달
- 관리자 UI 문구의 한국어·영어 locale 기준 데이터 등록
- 관리자 전용 Vite 컴포넌트와 서비스 모듈 분리

검증 결과:

- 전체 테스트 스위트 통과: 61개 테스트 파일
- 신규 관리자 디자인 토큰 브라우저 테스트 통과
- 관리자 및 Visual Editor 프로덕션 빌드 통과
- 경고: 로컬 검증 런타임 Node 24에서 프로젝트 지정 엔진 Node 22와 다르다는 pnpm 경고가 있으나 빌드와 테스트 결과에는 영향 없음

운영 확인이 필요한 항목:

- 실제 Neon 마이그레이션 적용 및 이력 테이블·함수 생성 확인
- 운영 관리자에서 기존 Rounded/Square 세트 조회
- Draft 저장 → 검증 → 활성화 → Draft 템플릿 연결
- 템플릿 활성화 후 프로모션 빌더와 Web Output의 색상·반경·글자 크기 동등성 확인

---

## 0. 결론

관리자 페이지에는 프로모션 디자인 토큰을 운영할 수 있는 전용 관리 기능이 필요하다.

현재 저장소에는 디자인 토큰 세트, 버전, 토큰 값, CSV 가져오기, 활성화 및 템플릿 연결을 위한 DB와 API가 부분적으로 구현되어 있다. 그러나 관리자 UI는 활성 토큰 버전을 템플릿에서 선택하는 기능만 제공하고, 다음 핵심 운영 기능은 제공하지 않는다.

- 토큰 세트 생성·복제·보관
- 버전 이력 조회
- 활성 버전 기반 새 초안 생성
- 개별 토큰 값 편집
- CSV 검증·가져오기
- 이전 버전과 비교
- 활성화 전 전체 검증
- 안전한 활성화 및 롤백
- 사용 중인 템플릿 확인
- 새 토큰 버전을 템플릿 초안에 적용
- 생성 결과 미리보기
- AI 선택 가능 토큰 확인

또한 현재 CSV 가져오기와 버전 활성화가 여러 SQL 문으로 나뉘어 있어 중간 실패 시 부분 저장 또는 활성 버전 공백이 발생할 가능성이 있다. 관리 UI를 만들기 전에 DB 작업의 원자성을 먼저 보강해야 한다.

개발은 다음 순서로 진행한다.

1. P0: DB 원자성·API 계약·검증 보강
2. P1: 디자인 토큰 세트 및 버전 조회 UI
3. P2: 초안 생성·값 편집·CSV 가져오기·활성화
4. P3: 미리보기·버전 비교·템플릿 반영
5. P4: 자연어 섹션 구성 및 필드별 AI 토큰 선택 연계

---

## 1. 목적

관리자가 복수의 프로모션 디자인 토큰 세트를 등록하고 버전 단위로 안전하게 운영할 수 있도록 한다.

예:

```text
Rounded Style
├─ v1 inactive
├─ v2 inactive
└─ v3 active

Square Style
└─ v1 active
```

각 토큰 세트는 동일한 토큰 카탈로그를 사용하지만 서로 다른 값을 제공할 수 있다.

```text
Rounded Style
--promo-title-xl: 80px
--promo-highlight: #ef4444
--promo-radius: 24px

Square Style
--promo-title-xl: 72px
--promo-highlight: #c40000
--promo-radius: 0px
```

템플릿은 특정 토큰 세트의 특정 활성 버전을 고정하여 참조한다. 이를 통해 이미 생성된 프로모션 결과와 AI 실행 이력의 재현성을 유지한다.

---

## 2. 범위

### 2.1 포함 범위

- 프로모션 디자인 토큰 세트 목록
- 토큰 세트 생성
- 토큰 세트 이름 및 설명 수정
- 토큰 세트 복제
- 토큰 세트 보관
- 버전 이력
- 활성 버전 기반 초안 생성
- 토큰 값 개별 편집
- CSV 가져오기
- CSV Dry Run 검증
- 초안 전체 검증
- 버전 비교
- 활성 버전 전환
- 이전 버전 롤백
- 토큰 세트 사용 현황
- 템플릿 초안에 새 버전 적용
- 프로모션 컴포넌트 기반 미리보기
- AI 선택 가능 토큰 표시
- 변경 이력
- 관리자 다국어 메시지 키

### 2.2 제외 범위

- 관리자 애플리케이션 CSS 토큰 `--app-*` 수정
- `prototype/design-tokens.css` 자동 생성
- 프로모션 생성 결과에서 임의 토큰 정의 생성
- LLM의 자유 형식 CSS 생성
- 활성 토큰 버전 직접 수정
- 활성 템플릿의 토큰 버전 자동 교체
- 디자인 문서의 DTCG 추출 토큰과 프로모션 토큰의 자동 병합
- 외부 디자인 도구와의 실시간 동기화

---

## 3. 토큰 체계 분리

### 3.1 관리자 애플리케이션 토큰

```text
--app-*
```

용도:

- 설정 화면
- 프로모션 빌더 셸
- 공통 UI 컴포넌트
- 관리자 페이지 Light/Dark 테마

소스 기준:

- `prototype/design-tokens.css`
- 관리자 공통 CSS

관리 방식:

- 소스코드와 정적 CSS에서 개발자가 관리
- 이번 관리자 기능에서 수정하지 않음

### 3.2 프로모션 디자인 토큰

```text
--promo-*
```

용도:

- 생성되는 프로모션 페이지
- 섹션 및 컴포넌트 요소
- AI 레이아웃·스타일 선택
- Web Output

소스 기준:

- `promo_design_token_definitions`
- `promo_design_token_sets`
- `promo_design_token_set_versions`
- `promo_design_token_values`

관리 방식:

- 관리자 페이지의 디자인 토큰 관리에서 운영
- 버전 단위 불변성 유지

### 3.3 디자인 문서 토큰과의 구분

현재 디자인 문서 기능에는 DTCG 형태의 추출 토큰과 원본 디자인 토큰 JSON이 존재한다.

이는 디자인 분석 자료이며, 프로모션 실행용 `--promo-*` 토큰 세트와 동일한 엔티티가 아니다.

향후 변환 기능을 추가할 수는 있지만 다음과 같이 명시적 변환 단계를 거쳐야 한다.

```text
디자인 문서 토큰
→ 관리자 검토
→ 프로모션 토큰 카탈로그 매핑
→ 새 프로모션 토큰 세트 초안
```

---

## 4. 현재 구현 분석

### 4.1 DB

현재 `029_item_components_design_tokens_and_planner.sql`에 다음 테이블이 존재한다.

#### `promo_design_token_definitions`

토큰 카탈로그다.

주요 필드:

- `token_key`
- `category`
- `value_type`
- `semantic_role`
- `css_property`
- `allowed_values`
- `required`
- `ai_selectable`
- `editable`

#### `promo_design_token_sets`

토큰 세트의 논리적 식별자다.

주요 필드:

- `set_key`
- `name`
- `description`
- `status`

#### `promo_design_token_set_versions`

토큰 세트의 불변 버전이다.

주요 필드:

- `token_set_id`
- `version`
- `status`
- `source_name`
- `source_hash`
- `change_note`

#### `promo_design_token_values`

특정 버전의 실제 토큰 값이다.

주요 필드:

- `token_set_version_id`
- `token_key`
- `token_value`
- `metadata`

#### `wizard_form_templates.design_token_set_version_id`

템플릿이 사용할 특정 토큰 세트 버전을 고정한다.

### 4.2 현재 API

| API | 현재 기능 | 보완 필요 |
|---|---|---|
| `GET /api/design-token-sets` | 세트 목록과 대표 버전 조회 | 전체 버전·사용량·초안 상태 부족 |
| `POST /api/design-token-sets` | 세트 생성 | `setKey` 수동 입력, 생성 후 초안 없음 |
| `GET /api/design-token-set` | 특정 버전 상세 조회 | 버전 이력·사용량 부족 |
| `POST /api/design-token-set-import` | CSV/배열을 새 초안 버전으로 저장 | 원자성, 복제 편집, 부분 오류 처리 |
| `POST /api/design-token-set-activate` | 버전 활성화 | 원자성, 전체 값 재검증, 이력 |
| `POST /api/design-token-catalog-import` | 토큰 카탈로그 가져오기 | 일반 관리 UI와 분리 필요 |

### 4.3 현재 관리자 UI

현재 템플릿·레이아웃 관리에서는 활성 디자인 토큰 세트 버전을 선택할 수 있다.

현재 가능한 동작:

- 활성 토큰 버전 목록 조회
- 템플릿 초안에서 토큰 버전 선택

현재 불가능한 동작:

- 토큰 세트 자체 관리
- 토큰 값 확인 및 수정
- 버전 이력 확인
- CSV 검증
- 활성화
- 미리보기
- 사용 중인 템플릿 확인

---

## 5. 주요 문제

### 5.1 CSV 가져오기 부분 저장 위험

현재 처리 순서:

1. 새 버전 행 생성
2. 토큰 값을 반복문으로 개별 저장

중간 값 저장이 실패하면 일부 값만 들어간 초안 버전이 남을 수 있다.

### 5.2 활성화 중 활성 버전 공백 위험

현재 처리 순서:

1. 기존 활성 버전 비활성화
2. 대상 버전 활성화

두 번째 작업이 실패하면 활성 버전이 없는 상태가 될 수 있다.

### 5.3 템플릿 반영 오해

토큰 세트의 새 버전을 활성화해도 기존 템플릿은 이전 버전 ID를 계속 참조한다.

이는 재현성과 버전 고정 관점에서는 정상이다. 그러나 관리자 UI가 이를 안내하지 않으면 사용자는 “활성화했는데 프로모션 빌더에 반영되지 않는다”고 판단할 수 있다.

### 5.4 토큰 카탈로그와 값 관리 혼동

토큰 정의는 다음 보안·실행 계약을 결정한다.

- 허용 CSS 속성
- 값 유형
- 의미 역할
- 필수 여부
- AI 선택 가능 여부

일반 운영자가 이를 자유롭게 수정하면 AI 계약과 Renderer가 동시에 깨질 수 있다.

따라서 일반 디자인 토큰 관리에서는 세트 값만 편집하고, 카탈로그는 고급 관리로 분리한다.

### 5.5 AI 디자인을 위한 토큰 부족

현재 기본 토큰만으로는 다음 자연어 요구를 충분히 표현하기 어렵다.

```text
타이틀을 80px 레드로 강조
설명은 작은 회색 글자
CTA는 둥근 빨간 버튼
```

최소 다음 의미 역할이 필요하다.

- 제목 크기 단계
- 본문 크기 단계
- 제목·본문·보조 문구 색상
- 강조 색상
- CTA 배경·글자·모서리
- 이미지 모서리
- 컴포넌트 간격
- 줄 높이
- 글자 굵기

---

## 6. 목표 사용자 흐름

### 6.1 토큰 세트 생성

```text
디자인 토큰 관리
→ 토큰 세트 추가
→ 이름·설명 입력
→ 서버가 식별자 자동 생성
→ 기준 버전 선택 또는 CSV 가져오기
→ 초안 생성
→ 검증
→ 미리보기
→ 활성화
```

### 6.2 새 버전 생성

```text
Rounded Style v3 active
→ 새 초안 만들기
→ v4 draft 생성
→ 토큰 값 수정
→ 변경 사유 입력
→ 검증
→ v3과 비교
→ v4 활성화
```

### 6.3 템플릿 반영

```text
Rounded Style v4 활성화
→ 사용 중인 템플릿 확인
→ 대상 템플릿의 새 초안 생성
→ 디자인 토큰 버전을 v4로 변경
→ 템플릿 미리보기
→ 템플릿 활성화
→ 프로모션 빌더에서 새 템플릿 버전 사용
```

활성 템플릿의 토큰 참조를 자동 변경하지 않는다.

### 6.4 롤백

롤백은 이전 행을 다시 활성으로 바꾸는 단순 상태 변경이 아니라, 선택한 이전 버전의 값을 복제한 새 초안을 만든 뒤 검증·활성화하는 방식도 검토한다.

권장 방식:

```text
v4 active
→ v2 기준 롤백 초안 생성
→ v5 draft
→ 검증
→ v5 active
```

이 방식은 시간 순서와 변경 이력을 보존한다.

---

## 7. 목표 UI

### 7.1 메뉴

설정의 전용 탭으로 구성한다.

```text
설정
├─ 템플릿·레이아웃 관리
├─ 컴포넌트 관리
├─ 디자인 토큰 관리
├─ AI 설정
└─ 언어 및 문구 관리
```

표준 표시:

- 한국어: 디자인 토큰 관리
- 영어: Design token management

### 7.2 3단 레이아웃

```text
┌────────────────┬────────────────────────────┬─────────────────────┐
│ 토큰 세트      │ 버전 및 토큰 값            │ 미리보기·사용 현황  │
│                │                            │                     │
│ Rounded Style  │ v4 draft                   │ 컴포넌트 미리보기   │
│ Square Style   │ Color                      │ 사용 템플릿         │
│ + 세트 추가    │ Typography                 │ 검증 결과           │
│                │ Shape                      │ 변경 요약           │
└────────────────┴────────────────────────────┴─────────────────────┘
```

각 열의 스크롤은 독립적으로 동작한다.

### 7.3 왼쪽: 토큰 세트

토큰 세트 목록 항목:

- 이름
- 설명 요약
- 상태
- 활성 버전
- 초안 존재 여부
- 사용 중인 템플릿 수
- 설정 아코디언

설정 아코디언:

- 이름 수정
- 설명 수정
- 복제
- 보관
- 버전 보기

추가 버튼:

- `토큰 세트 추가`

`setKey`는 UI에 입력받지 않고 서버가 자동 생성한다. 상세 화면에서 읽기 전용 식별자로 표시할 수 있다.

### 7.4 중앙: 버전 및 토큰 값

상단:

- 선택 버전
- 상태
- 생성일
- 원본 파일
- 변경 사유
- 새 초안 만들기
- CSV 가져오기
- 이전 버전과 비교

토큰 목록 컬럼:

| 컬럼 | 설명 |
|---|---|
| 토큰 이름 | 사용자용 라벨 |
| 식별자 | `--promo-*` |
| 유형 | color, length, shadow 등 |
| 의미 | title-size, accent-color 등 |
| 값 | 현재 버전 값 |
| AI 선택 | AI가 선택 가능한지 |
| 필수 | 활성화에 필요한지 |
| 상태 | 정상, 누락, 오류 |

편집 규칙:

- Draft 버전만 수정 가능
- `editable=false`는 읽기 전용
- 색상은 컬러 피커와 텍스트 입력 병행
- length는 숫자와 단위 입력
- enum은 선택 목록
- font, shadow는 텍스트 입력과 검증

### 7.5 오른쪽: 미리보기

최소 샘플:

- 섹션 배경
- 제목
- 보조 문구
- 본문
- Primary CTA
- 콘텐츠 이미지 자리

미리보기는 실제 프로모션 Renderer와 동일한 토큰 적용 경로를 사용한다.

별도 정적 HTML로 유사하게 재현하지 않는다.

추가 정보:

- 현재 검증 결과
- 필수 토큰 누락
- 사용 중인 템플릿
- 이전 버전 대비 변경
- AI 선택 가능 토큰 개수

---

## 8. 토큰 카탈로그 관리 정책

### 8.1 일반 운영 화면

일반 관리자는 다음만 관리한다.

- 토큰 세트
- 버전
- 토큰 값
- 활성화
- 템플릿 적용

### 8.2 고급 관리

토큰 카탈로그는 별도 고급 영역으로 분리한다.

관리 항목:

- 토큰 식별자
- 카테고리
- 값 유형
- 의미 역할
- CSS 속성
- 허용 값
- 필수 여부
- AI 선택 가능 여부
- 편집 가능 여부

P0~P3에서는 카탈로그 조회만 제공하고, UI 수정 기능은 제외하는 것을 권장한다.

카탈로그 추가·변경은 CSV Dry Run과 서버 검증을 거친 관리자 전용 작업으로 유지한다.

---

## 9. 데이터 모델 보강

### 9.1 신규 마이그레이션

제안 파일:

```text
db/migrations/034_promo_design_token_management.sql
```

실제 개발 시작 전 최신 마이그레이션 번호를 다시 확인한다.

### 9.2 변경 이력 테이블

```sql
create table if not exists promo_design_token_histories (
  id uuid primary key default gen_random_uuid(),
  token_set_id uuid not null
    references promo_design_token_sets(id) on delete restrict,
  token_set_version_id uuid
    references promo_design_token_set_versions(id) on delete set null,
  action text not null
    check (action in (
      'set_created',
      'set_updated',
      'set_cloned',
      'set_archived',
      'draft_created',
      'draft_updated',
      'imported',
      'validated',
      'activated',
      'rollback_draft_created'
    )),
  previous_status text,
  new_status text,
  change_note text not null default '',
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

인덱스:

```sql
create index if not exists promo_design_token_histories_set_idx
  on promo_design_token_histories(token_set_id, created_at desc);
```

작업자 식별 체계가 확정되면 `actor_id`, `actor_email` 등을 별도 추가한다. 현재 인증 주체가 명확하지 않은 상태에서 임의 값을 저장하지 않는다.

### 9.3 원자적 Draft 저장 함수

목표:

- 버전 번호 결정
- 버전 생성
- 전체 토큰 값 저장
- 변경 이력 저장
- 하나라도 실패하면 전체 롤백

제안 함수:

```text
create_promo_design_token_draft(
  p_token_set_id uuid,
  p_source_version_id uuid,
  p_values jsonb,
  p_source_name text,
  p_source_hash text,
  p_change_note text
)
```

API의 JavaScript 반복 저장을 제거하고 DB 함수 또는 단일 SQL 트랜잭션으로 처리한다.

### 9.4 원자적 활성화 함수

목표:

- 대상 버전 잠금
- 동일 세트의 현재 활성 버전 확인
- 전체 토큰 값 검증
- 필수 토큰 검증
- 기존 활성 버전 비활성화
- 대상 버전 활성화
- 변경 이력 저장
- 하나라도 실패하면 전체 롤백

제안 함수:

```text
activate_promo_design_token_version(
  p_version_id uuid,
  p_change_note text
)
```

동시 활성화 요청을 막기 위해 토큰 세트 단위 advisory lock 또는 `FOR UPDATE`를 사용한다.

### 9.5 보관 보호

다음 조건에서는 토큰 세트 보관을 거부한다.

- 활성 또는 Draft 템플릿이 해당 세트 버전을 참조
- 진행 중인 Section AI run이 해당 버전을 참조
- 해당 토큰 세트에 진행 중인 Draft 변경이 존재

비활성 과거 템플릿과 완료된 AI run의 FK는 유지한다.

물리 삭제는 제공하지 않는다.

---

## 10. 서버 검증

### 10.1 토큰 키

```regex
^--promo-[a-z0-9-]+$
```

`--app-*`는 거부한다.

### 10.2 값 유형

현재 허용 유형:

- `color`
- `length`
- `number`
- `font`
- `shadow`
- `enum`

### 10.3 안전한 CSS 속성

현재 allowlist를 유지하고 확장이 필요하면 마이그레이션·Renderer·테스트를 동시에 수정한다.

허용 예:

- `color`
- `background-color`
- `border-color`
- `border-radius`
- `border-width`
- `box-shadow`
- `font-family`
- `font-size`
- `font-weight`
- `line-height`
- `letter-spacing`
- `padding`
- `gap`
- `max-width`
- `min-height`

금지 예:

- `background-image`
- `content`
- `position`
- `z-index`
- `behavior`
- `filter`의 자유 문자열
- `url(...)`
- `expression(...)`
- 세미콜론과 중괄호를 포함한 값

### 10.4 활성화 검증

활성화 전 다음을 모두 검증한다.

- 토큰 세트가 보관 상태가 아닌가
- 대상 버전이 Draft 또는 허용 상태인가
- 토큰 키가 카탈로그에 모두 존재하는가
- 필수 토큰이 모두 존재하는가
- 값 유형과 값이 일치하는가
- CSS 속성이 allowlist에 포함되는가
- `editable=false` 토큰이 허용되지 않은 방식으로 변경되지 않았는가
- 동일 토큰 키가 중복되지 않는가
- AI 선택 가능 토큰의 의미 역할이 유효한가

---

## 11. API 목표 계약

기존 엔드포인트는 가능한 범위에서 유지한다.

### 11.1 목록

```http
GET /api/design-token-sets?includeArchived=false
```

응답 추가 항목:

```json
{
  "id": "uuid",
  "setKey": "rounded-style",
  "name": "Rounded Style",
  "status": "active",
  "activeVersion": {
    "id": "uuid",
    "version": 3,
    "status": "active"
  },
  "draftVersion": {
    "id": "uuid",
    "version": 4,
    "status": "draft"
  },
  "usage": {
    "templateCount": 2,
    "activeTemplateCount": 1
  }
}
```

### 11.2 세트 생성

```http
POST /api/design-token-sets
```

요청:

```json
{
  "name": "Rounded Style",
  "description": "부드러운 모서리 디자인"
}
```

`setKey`는 서버가 생성한다.

이름을 정규화한 slug와 충돌 방지 suffix를 사용하되, 생성 이후 식별자는 변경하지 않는다.

### 11.3 세트 수정

```http
PATCH /api/design-token-set-metadata
```

수정 가능:

- 이름
- 설명

수정 불가:

- `setKey`

### 11.4 상세 및 버전 이력

```http
GET /api/design-token-set?id={tokenSetId}
GET /api/design-token-set-version?versionId={versionId}
```

상세 응답:

- 세트 정보
- 전체 버전
- 선택 버전 값
- 변경 이력
- 사용 템플릿
- 검증 상태

### 11.5 Draft 생성

```http
POST /api/design-token-set-draft
```

요청:

```json
{
  "tokenSetId": "uuid",
  "sourceVersionId": "uuid",
  "changeNote": "CTA 및 제목 강조색 수정"
}
```

동일 세트에 Draft가 이미 있으면 새 Draft 생성을 거부하고 기존 Draft를 반환한다.

### 11.6 Draft 수정

```http
PUT /api/design-token-set-version
```

요청:

```json
{
  "versionId": "uuid",
  "values": [
    {
      "tokenKey": "--promo-title-xl",
      "value": "80px",
      "metadata": {}
    }
  ],
  "changeNote": "제목 크기 조정"
}
```

전체 교체 방식으로 처리하여 누락·중복을 명확히 검증한다.

활성 버전 수정 요청은 `409`로 거부한다.

### 11.7 CSV Dry Run

기존 API 확장:

```http
POST /api/design-token-set-import
```

```json
{
  "tokenSetId": "uuid",
  "csvText": "...",
  "dryRun": true
}
```

응답:

- 전체 행 수
- 정상 행 수
- 오류 행
- 필수 토큰 누락
- 알 수 없는 토큰
- 현재 버전과 변경된 값

### 11.8 검증

```http
POST /api/design-token-set-validate
```

### 11.9 활성화

```http
POST /api/design-token-set-activate
```

기존 API를 유지하되 DB 원자적 함수만 호출하도록 변경한다.

### 11.10 보관

```http
POST /api/design-token-set-archive
```

사용 중이면 `409`와 사용처를 반환한다.

### 11.11 사용 현황

```http
GET /api/design-token-set-usage?tokenSetId={id}
```

응답:

- 참조 템플릿
- 템플릿 상태와 버전
- 진행 중인 AI run
- 완료된 AI run 수

---

## 12. CSV 계약

### 12.1 프로모션 토큰 CSV

관리자 애플리케이션용 `--app-*` CSV와 별도 파일을 사용한다.

권장 최소 컬럼:

```csv
token,value,label,category,change_note
--promo-surface,#111827,섹션 배경,color,
--promo-text,#ffffff,본문 색상,color,
--promo-highlight,#ef4444,강조 색상,color,
--promo-title-xl,80px,큰 제목,typography,
--promo-radius,24px,기본 모서리,shape,
```

정의 정보인 다음 컬럼은 일반 토큰 값 가져오기에서 신뢰하지 않는다.

- `value_type`
- `semantic_role`
- `css_property`
- `required`
- `ai_selectable`

이 값은 서버 토큰 카탈로그를 기준으로 한다.

### 12.2 가져오기 처리

1. UTF-8 BOM 제거
2. 헤더 검증
3. 중복 토큰 검사
4. 카탈로그 존재 확인
5. 값 유형 검증
6. 필수 토큰 확인
7. 현재 버전과 diff 생성
8. Dry Run 결과 표시
9. 사용자 확인
10. 단일 원자 작업으로 Draft 저장

---

## 13. 템플릿 반영 정책

### 13.1 버전 고정 유지

템플릿은 다음 값을 참조한다.

```text
design_token_set_version_id
```

논리적 토큰 세트 ID만 참조하도록 변경하지 않는다.

### 13.2 활성 버전 변경 시 안내

토큰 버전 활성화 성공 후 다음 안내를 표시한다.

```text
Rounded Style v4를 활성화했습니다.
기존 템플릿은 현재 연결된 이전 버전을 계속 사용합니다.
새 버전을 적용할 템플릿 초안을 선택하세요.
```

### 13.3 템플릿 적용

활성 템플릿을 직접 수정하지 않는다.

```text
템플릿 선택
→ 새 템플릿 초안 생성 또는 기존 초안 선택
→ designTokenSetVersionId 변경
→ 템플릿 검증
→ 미리보기
→ 템플릿 활성화
```

### 13.4 프로모션 빌더 캐시

템플릿 버전 활성화 후 프로모션 빌더는 최신 활성 템플릿 API 결과를 사용해야 한다.

다음 캐시 키에 토큰 버전이 포함되어 있는지 검증한다.

- 템플릿 버전
- Layout revision
- 디자인 토큰 세트 버전 ID
- 토큰 값 hash

---

## 14. 자연어 섹션 구성 연계

### 14.1 AI 선택 범위

LLM은 선택된 토큰 세트 버전에서 다음 조건을 만족하는 토큰만 선택한다.

- `ai_selectable=true`
- 컴포넌트 요소의 스타일 슬롯도 AI 선택 허용
- 스타일 슬롯과 토큰의 의미 역할 일치
- 현재 토큰 세트에 값 존재

### 14.2 필드 주소

토큰 바인딩 주소:

```text
componentInstanceId 또는 itemKey
+ fieldKey
+ slotKey
+ tokenKey
```

예:

```json
{
  "itemKey": "title",
  "fieldKey": "fld_title",
  "slotKey": "fontSize",
  "tokenKey": "--promo-title-xl"
}
```

### 14.3 요청 값 보정

사용자가 `80px 레드`를 요청했지만 정확한 토큰이 없으면:

1. 의미가 일치하는 가장 가까운 토큰 선택
2. 보정 내용을 결과에 표시
3. 의미가 일치하는 토큰이 없으면 스타일 미적용
4. 자유 CSS 생성 금지

---

## 15. 프런트엔드 구현 구조

현재 Admin Vite 앱 구조를 기준으로 모듈화한다.

제안 모듈:

```text
admin-app/src/
├─ modules/
│  └─ design-token-manager/
│     ├─ api.js
│     ├─ state.js
│     ├─ validators.js
│     ├─ csv.js
│     └─ diff.js
└─ components/
   └─ design-tokens/
      ├─ DesignTokenManager.vue
      ├─ TokenSetList.vue
      ├─ TokenVersionPanel.vue
      ├─ TokenValueEditor.vue
      ├─ TokenImportDialog.vue
      ├─ TokenVersionDiff.vue
      ├─ TokenPreview.vue
      └─ TokenUsagePanel.vue
```

현재 단일 `prototype/app.js`에 신규 로직을 직접 대량 추가하지 않는다.

빌드 산출물:

```text
prototype/admin-assets/admin-app.js
```

산출물은 `pnpm run build:admin`으로 생성한다.

---

## 16. 상태 모델

```text
tokenSets
selectedTokenSetId
versions
selectedVersionId
selectedVersion
draftValues
baselineValues
validation
usage
preview
loading
saving
importing
activating
dirty
```

규칙:

- 활성 버전 선택 시 읽기 전용
- Draft 선택 시 편집 가능
- 값 변경 시 `dirty=true`
- 다른 버전 이동 전 미저장 변경 경고
- 활성화 전 저장·검증 완료 필요
- 활성화 중 중복 요청 방지

---

## 17. 다국어 메시지

사용자 노출 문구는 하드코딩하지 않는다.

제안 네임스페이스:

```text
admin.designToken.*
entity.designToken.*
```

주요 키:

```text
admin.designToken.title
admin.designToken.addSet
admin.designToken.createDraft
admin.designToken.importCsv
admin.designToken.validate
admin.designToken.activate
admin.designToken.archive
admin.designToken.compareVersions
admin.designToken.preview
admin.designToken.usage
admin.designToken.activeVersion
admin.designToken.draftVersion
admin.designToken.templateUpdateRequired
admin.designToken.validationSuccess
admin.designToken.validationFailed
```

한국어 기준 용어:

- 디자인 토큰
- 토큰 세트
- 토큰 버전
- 활성 버전
- 초안
- 변경 이력
- 사용 현황
- 미리보기

신규 화면 개발 시 locale 기준 데이터와 DB 메시지 등록 절차를 함께 반영한다.

---

## 18. 단계별 개발계획

### P0. 데이터 안정성과 API 계약

목표:

- 관리 UI 개발 전에 저장·활성화 안정성 확보

작업:

1. 마이그레이션 `034` 작성
2. 디자인 토큰 변경 이력 테이블 추가
3. 원자적 Draft 생성·전체 값 저장 함수 추가
4. 원자적 활성화 함수 추가
5. 세트 보관 보호 함수 또는 API 검증 추가
6. 서버 `setKey` 자동 생성
7. 버전 이력 조회 API
8. Draft 생성 API
9. Draft 전체 값 수정 API
10. 검증 API
11. 사용 현황 API
12. API 오류 코드 표준화

완료 조건:

- 실패한 가져오기가 부분 Draft를 남기지 않음
- 활성화 실패 시 이전 활성 버전 유지
- 동시에 두 버전을 활성화할 수 없음
- 활성 버전 직접 수정 불가
- 사용 중인 세트 물리 삭제 불가

### P1. 조회 중심 관리자 UI

목표:

- 운영 데이터 구조를 안전하게 확인

작업:

1. 설정 메뉴에 디자인 토큰 관리 탭 추가
2. 3단 레이아웃
3. 토큰 세트 목록
4. 버전 이력
5. 토큰 값 카테고리 목록
6. 상태·필수·AI 선택 여부 표시
7. 사용 템플릿 목록
8. 읽기 전용 미리보기
9. locale 키 추가

완료 조건:

- Rounded/Square 등 N개 세트 표시
- 활성·Draft·비활성 버전 구분
- 선택 버전의 전체 토큰 값 확인
- 템플릿 사용 현황 확인

### P2. 편집 및 버전 운영

목표:

- 관리자 페이지에서 전체 버전 수명주기 운영

작업:

1. 세트 생성
2. 이름·설명 수정
3. 세트 복제
4. 활성 버전 기반 Draft 생성
5. Draft 토큰 값 편집
6. CSV Dry Run
7. CSV 가져오기
8. 전체 검증
9. 버전 비교
10. 활성화
11. 롤백 초안 생성
12. 보관
13. 미저장 변경 보호

완료 조건:

- 새 세트 생성 후 Draft 작성 가능
- 개별 값 수정과 CSV 가져오기 모두 가능
- 오류 값은 행·토큰별 표시
- 검증 실패 버전은 활성화 불가
- 활성화 이후 이전 활성 버전은 inactive
- 변경 이력 확인 가능

### P3. 실제 Renderer 미리보기와 템플릿 반영

목표:

- 토큰 변경이 실제 프로모션에 미치는 영향 확인

작업:

1. 공통 Renderer 기반 샘플 섹션
2. 제목·본문·CTA·이미지·배경 미리보기
3. Desktop/Mobile 미리보기
4. 이전 버전과 시각 비교
5. 활성화 후 템플릿 적용 안내
6. 템플릿 Draft 생성·선택 연결
7. 프로모션 빌더 캐시·최신 버전 확인

완료 조건:

- 미리보기와 프로모션 빌더 출력의 토큰 결과가 동일
- 토큰 활성화만으로 기존 템플릿이 바뀌지 않음
- 템플릿 새 버전 활성화 후 프로모션 빌더에 반영

### P4. AI 및 자연어 섹션 구성 연계

목표:

- 관리된 토큰 안에서 LLM이 컴포넌트 요소 스타일 선택

작업:

1. 컴포넌트 요소별 스타일 슬롯 주소 확장
2. AI 선택 가능 토큰 후보 구성
3. 의미 역할 검증
4. 자연어 스타일 요구 분석
5. 가장 가까운 토큰 보정
6. 적용 토큰 및 보정 내역 표시
7. 실행 시 토큰 세트 버전과 hash 고정

완료 조건:

- LLM이 존재하지 않는 토큰을 반환하면 거부
- `80px 레드` 요구가 허용 토큰으로 변환
- 필드별 토큰 적용 결과가 Live Preview와 Web Output에서 동일

---

## 19. 테스트 계획

### 19.1 DB 계약 테스트

- `promo_design_token_histories` 존재
- 한 세트당 활성 버전 1개
- 동일 세트 Draft 중복 정책
- 원자적 Draft 생성
- 원자적 활성화
- 필수 토큰 누락 활성화 거부
- 사용 중인 세트 보관 거부
- 완료된 AI run의 토큰 버전 FK 보존

### 19.2 API 테스트

- 세트 목록
- 자동 `setKey`
- 세트 이름·설명 수정
- Draft 생성
- Draft 전체 값 교체
- 활성 버전 수정 거부
- CSV Dry Run
- 알 수 없는 토큰 거부
- `--app-*` 거부
- 잘못된 color/length/shadow 거부
- 필수 토큰 누락
- 원자적 활성화
- 사용 현황
- 보관

### 19.3 관리자 브라우저 테스트

- 메뉴 접근
- 세트 선택
- 버전 선택
- 카테고리 필터
- Draft 생성
- 값 편집
- CSV 가져오기
- 검증 오류 표시
- 활성화
- 버전 비교
- 미저장 변경 경고
- 사용 템플릿 확인

### 19.4 Renderer 테스트

- 실제 토큰 값 CSS 변수 적용
- 제목 크기
- 글자 색상
- CTA 배경·글자·모서리
- 이미지 모서리
- 섹션 배경
- Desktop/Mobile
- Live Preview와 Web Output 동등성

### 19.5 회귀 테스트

필수 명령:

```text
pnpm test
pnpm run build:admin
pnpm run build:visual-editor
```

추가 권장:

```text
node --check api/*.js
git diff --check
```

전체 테스트 파일 개수는 문서에 고정하지 않고 실행 로그에 기록한다.

---

## 20. 배포 계획

### 20.1 배포 순서

1. 작업 전 Neon 브랜치 또는 백업 지점 생성
2. Preview 또는 검증 DB에 마이그레이션 `034` 적용
3. DB 계약 확인
4. API 배포
5. 읽기 전용 P1 UI 배포
6. Draft 생성·편집 기능 활성화
7. 활성화 기능 검증
8. Production DB 마이그레이션
9. Production 배포
10. 기존 Rounded/Square 세트 조회 확인
11. 신규 Draft 생성 및 검증
12. 활성화·템플릿 적용·프로모션 빌더 확인

### 20.2 마이그레이션 전 확인

- 현재 최신 마이그레이션 번호
- Production `promo_design_token_*` 테이블 건수
- 활성 토큰 세트 및 버전
- 토큰 버전을 참조하는 템플릿
- 진행 중인 Section AI run
- 중복 Draft 또는 활성 버전 이상 여부

### 20.3 마이그레이션 후 확인

- 기존 세트·버전·값 건수 유지
- 기존 템플릿 참조 유지
- 기존 AI run 참조 유지
- 변경 이력 테이블 생성
- 원자적 함수 생성
- 활성 버전 유니크 인덱스 유지

---

## 21. 롤백 계획

### 21.1 애플리케이션 롤백

- 관리자 디자인 토큰 탭 노출 중단
- 신규 편집 API 호출 중단
- 기존 템플릿 토큰 선택 기능 유지

### 21.2 DB 롤백

마이그레이션은 기존 테이블을 파괴하지 않는 additive 방식으로 작성한다.

문제 발생 시:

- 신규 DB 함수 사용 중단
- 기존 읽기 API 유지
- 신규 이력 테이블은 보존
- 기존 토큰 세트·버전·값 삭제 금지

원자성 보강 이전의 기존 활성화 API로 즉시 되돌리는 것은 권장하지 않는다. 대신 활성화 UI를 비활성화하고 문제를 수정한다.

---

## 22. 위험 분석

| 위험 | 우선순위 | 대응 |
|---|---:|---|
| `--app-*`와 `--promo-*` 혼합 | P0 | 네임스페이스 분리 및 서버 거부 |
| 가져오기 부분 저장 | P0 | DB 원자 함수 |
| 활성 버전 공백 | P0 | 원자 활성화 및 lock |
| 새 버전이 템플릿에 자동 반영된다고 오해 | P0 | 사용 현황·적용 안내 |
| 활성 버전 직접 수정 | P0 | API·UI 모두 차단 |
| 토큰 카탈로그 오수정 | P0 | 고급 관리 분리 |
| Renderer와 미리보기 차이 | P1 | 동일 Renderer 사용 |
| 토큰 부족으로 자연어 요청 미충족 | P1 | 의미 역할별 토큰 확장 |
| LLM의 존재하지 않는 토큰 선택 | P0 | 후보 allowlist 및 서버 검증 |
| CSS 주입 | P0 | 값 유형·속성 allowlist |
| 기존 AI 실행 재현성 손실 | P0 | 버전 ID·hash snapshot 유지 |
| 대형 단일 관리자 파일 재비대화 | P1 | Vite 모듈·컴포넌트 분리 |

---

## 23. 완료 기준

기능 완료는 다음 조건을 모두 만족해야 한다.

1. 관리자는 N개의 프로모션 토큰 세트를 조회할 수 있다.
2. 토큰 세트 식별자는 서버가 자동 생성한다.
3. 활성 버전은 수정할 수 없다.
4. 활성 버전에서 새 Draft를 만들 수 있다.
5. Draft 값을 개별 편집하거나 CSV로 가져올 수 있다.
6. 잘못된 토큰과 값은 저장 또는 활성화 전에 표시된다.
7. CSV 가져오기 실패 시 부분 데이터가 남지 않는다.
8. 활성화 실패 시 기존 활성 버전이 유지된다.
9. 버전 비교와 변경 이력을 확인할 수 있다.
10. 실제 Renderer 기반 미리보기를 제공한다.
11. 활성화된 새 토큰 버전은 기존 템플릿을 자동 변경하지 않는다.
12. 관리자는 새 버전을 적용할 템플릿 초안을 선택할 수 있다.
13. 템플릿 새 버전 활성화 후 프로모션 빌더에 반영된다.
14. AI는 `aiSelectable=true` 토큰만 선택한다.
15. Live Preview와 Web Output의 적용 결과가 동일하다.
16. 전체 테스트와 관리자·Visual Editor 빌드가 통과한다.

---

## 24. 구현 전 확정할 사항

1. 토큰 세트에 Draft를 동시에 한 개만 허용할지
2. 롤백을 과거 버전 재활성화로 할지 새 롤백 Draft 생성으로 할지
3. 일반 관리자에게 토큰 카탈로그 수정 권한을 제공할지
4. 토큰 세트 복제 시 활성 버전만 복제할지 전체 이력을 복제할지
5. 템플릿 적용을 디자인 토큰 화면에서 시작할지 템플릿 화면으로 이동시킬지
6. 사용 중인 활성 템플릿 수가 0인 세트만 보관할지
7. 작업자 식별 정보를 어떤 인증 정보에서 가져올지
8. 토큰 미리보기용 기준 샘플 섹션을 고정할지 실제 템플릿을 선택하게 할지
9. 자연어 요청과 정확히 일치하는 토큰이 없을 때 자동 보정할지 사용자 선택을 요구할지

권장 기본값:

- 한 세트당 Draft 1개
- 롤백은 새 Draft 생성
- 일반 관리자는 카탈로그 읽기 전용
- 복제는 선택한 버전 하나만 새 세트 v1 Draft로 복제
- 템플릿 적용은 디자인 토큰 화면에서 사용처를 확인한 뒤 템플릿 초안으로 이동
- 사용 중인 세트는 보관 금지
- 초기 미리보기는 고정 샘플 + 추후 실제 템플릿 선택
- 토큰 부재 시 가장 가까운 의미 토큰을 제안하되 적용 전 표시

---

## 25. 최종 의견

이 기능은 자연어 기반 섹션 구성과 컴포넌트 필드 디자인을 구현하기 위한 선행 기반이다.

현재 백엔드와 DB는 토큰 세트·버전·값·활성화의 기본 골격을 갖추고 있으므로 완전한 신규 개발은 아니다. 그러나 운영 UI를 바로 연결하기 전에 가져오기와 활성화의 원자성을 반드시 보강해야 한다.

가장 중요한 정책은 다음 세 가지다.

1. 관리자 UI 토큰과 프로모션 출력 토큰을 분리한다.
2. 활성 버전은 불변으로 유지하고 모든 변경은 새 Draft에서 진행한다.
3. 새 토큰 버전 활성화와 템플릿 적용을 별도 단계로 유지한다.

P0~P3을 완료하면 관리자는 Rounded, Square 등 N개의 디자인 토큰 세트를 안전하게 운영하고 실제 프로모션 출력 결과를 확인할 수 있다. 이후 P4에서 LLM은 관리자가 허용한 토큰만 사용하여 제목 크기, 강조 색상, CTA 스타일 등 컴포넌트 요소 디자인을 결정할 수 있다.
