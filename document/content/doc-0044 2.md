# 디자인 토큰 테이블 편집기 및 원클릭 적용 개발계획서

- 작성일: 2026-07-26
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 전 검토안
- 대상 화면: 설정 > 디자인 토큰 관리
- 대상 토큰: 프로모션 결과물용 `--promo-*`
- 제외 토큰: 관리자·애플리케이션 UI용 `--app-*`
- 선행 문서:
  - `docs/계획/admin-promo-design-token-management-development-plan-2026-07-25.md`
  - `docs/계획/css-design-token-unification-development-plan-2026-07-21.md`

---

## 1. 결론

현재 디자인 토큰 관리 기능은 데이터 모델과 버전 관리 기능은 갖추고 있지만, 운영 절차가 관리자 UI에 그대로 노출되어 사용하기 어렵다.

목표 UI는 다음과 같이 단순화한다.

```text
토큰 세트 선택
  → 고정된 토큰 항목을 테이블에서 수정
  → 적용할 템플릿 선택
  → 저장 및 적용
```

관리자에게 다음 절차를 각각 수행하도록 요구하지 않는다.

```text
초안 생성 → 값 저장 → 검증 → 활성화 → 템플릿 초안 연결 → 템플릿 활성화
```

대신 `저장 및 적용` 요청 한 번으로 백엔드가 내부 절차를 수행한다.

초안과 버전은 삭제하지 않는다. 기존 프로모션의 재현성, 검증, 롤백 및 AI 실행 이력 보존을 위해 내부 데이터 모델로 유지하되 기본 UI에서는 숨긴다.

또한 현재 가장 먼저 해결해야 할 문제는 UI가 아니라 실제 Renderer 토큰 매핑의 불완전성이다. 관리자 미리보기와 프로모션 빌더가 같은 토큰 값에 대해 동일한 결과를 출력하도록 P0에서 먼저 수정한다.

---

## 2. 현재 구현 분석

### 2.1 이미 구현된 기반

현재 다음 데이터 구조가 존재한다.

- `promo_design_token_definitions`
- `promo_design_token_sets`
- `promo_design_token_set_versions`
- `promo_design_token_values`
- `promo_design_token_histories`
- `wizard_form_templates.design_token_set_version_id`

현재 다음 기능도 구현되어 있다.

- 토큰 세트 생성·복제·보관
- 토큰 버전 생성·검증·활성화
- 토큰 값 개별 편집
- CSV 문자열 가져오기
- 템플릿 초안에 활성 토큰 버전 지정
- Public Template API를 통한 토큰 값 전달
- Create Promo snapshot에 `designTokens` 저장
- Visual Editor에서 `--promo-*` CSS 변수 주입

따라서 전체 DB 모델을 새로 만드는 작업은 필요하지 않다.

### 2.2 CSV 기능의 현재 문제

현재 관리자 화면에는 다음 요소만 있다.

- 원본 파일명 텍스트 입력
- CSV 내용을 붙여넣는 textarea
- Dry Run 버튼
- 가져오기 버튼

다음 요소는 없다.

- `<input type="file">`
- 파일 선택 버튼
- 파일명 자동 입력
- UTF-8/BOM 처리 결과 안내
- 업로드한 파일의 행 단위 미리보기
- 프로모션 토큰 CSV 샘플 다운로드

서버의 `csvText` 파싱 API는 이미 존재하므로 파일 자체를 multipart로 전송할 필요는 없다. 브라우저에서 선택한 파일을 `File.text()`로 읽고 기존 JSON API에 전달하면 된다.

### 2.3 토큰 적용의 현재 문제

토큰 전달 경로는 존재한다.

```text
wizard_form_templates.design_token_set_version_id
  → GET /api/wizard-form-template-public
  → result.designTokens
  → contentState.formTemplate.designTokens
  → PromoPageRenderer managedTokenStyle
```

하지만 실제 Renderer에서 토큰별 사용처가 일치하지 않는다.

| 토큰 | 현재 상태 | 문제 |
|---|---|---|
| `--promo-surface` | 부분 적용 | 개별 섹션 배경색과 우선순위가 불명확함 |
| `--promo-text` | 부분 적용 | 명시적 Item 스타일과의 우선순위가 문서화되지 않음 |
| `--promo-muted` | 미사용 | Renderer의 보조 문구에 연결되지 않음 |
| `--promo-accent` | 부분 적용 | CTA가 theme의 고정 색상을 참조해 토큰 변경이 반영되지 않을 수 있음 |
| `--promo-radius` | 미사용 | 실제 CTA·이미지·컴포넌트 모서리에 연결되지 않음 |
| `--promo-shadow` | 미사용 | 실제 Renderer에 연결되지 않음 |
| `--promo-title-size` | 적용 | 제목 기본 크기에 연결됨 |

관리자 토큰 미리보기는 별도의 별칭 규칙을 사용한다.

```text
--promo-bg         ← --promo-surface
--promo-ink        ← --promo-text
--promo-cta        ← --promo-accent
--promo-cta-radius ← --promo-radius
```

실제 프로모션 Renderer가 이 규칙을 동일하게 사용하지 않기 때문에 관리자 미리보기와 프로모션 빌더 결과가 다를 수 있다.

### 2.4 사용성 문제

현재 UI는 다음 개념을 동시에 노출한다.

- 토큰 세트
- 토큰 세트 버전
- 초안
- 활성 버전
- 검증
- CSV Dry Run
- 활성화
- 템플릿 초안 적용

이는 개발자에게는 정확하지만 일반 관리자에게는 작업 목표가 불분명하다.

관리자가 실제로 원하는 작업은 다음 두 가지다.

1. 선택한 디자인 스타일의 값을 수정한다.
2. 선택한 프로모션 템플릿에 적용한다.

---

## 3. 초안을 유지해야 하는 이유

초안은 UI 절차가 아니라 안전한 저장 모델로 유지한다.

### 3.1 운영 중인 결과의 불변성

활성 버전 값을 직접 수정하면 같은 버전 ID를 참조하는 기존 템플릿과 AI 실행 결과가 사후에 달라진다.

활성 버전은 수정하지 않고 새로운 버전을 생성해야 한다.

### 3.2 전체 값의 원자적 적용

여러 토큰 중 일부만 저장된 상태가 운영에 반영되면 안 된다.

새 버전에서 전체 값을 검증한 뒤 한 번에 활성화해야 한다.

### 3.3 검증과 롤백

다음 오류는 운영 반영 전에 차단해야 한다.

- 필수 토큰 누락
- 허용되지 않은 토큰
- `--app-*` 혼입
- 잘못된 색상·길이·그림자 값
- CSS 주입 위험 값

문제가 발생하면 이전 활성 버전이 그대로 유지되어야 한다.

### 3.4 실행 이력 재현

템플릿과 AI 실행 이력은 사용한 토큰 버전 ID와 값 hash를 보존해야 한다.

### 3.5 UI 정책

기본 화면에서는 `초안`이라는 용어와 수동 단계를 노출하지 않는다.

```text
관리자: 값 수정 → 저장 및 적용

백엔드:
  내부 작업 버전 생성
  → 전체 검증
  → 새 버전 활성화
  → 선택한 템플릿 새 버전에 연결
```

버전 이력 화면에서만 `작업 버전`, `활성 버전`, `이전 버전` 상태를 제공한다.

---

## 4. 목표 사용자 흐름

### 4.1 토큰 세트 선택

```text
디자인 토큰 관리
  [둥근 스타일 ▼] [새 스타일] [복제] [버전 이력]
```

토큰 세트는 N개 등록할 수 있다.

예:

- 둥근 스타일
- 각진 스타일
- 프리미엄 다크
- 라이트 이벤트

### 4.2 테이블 편집

| 분류 | 항목 | 변수 | 형식 | 현재 값 | 미리보기 | 상태 |
|---|---|---|---|---|---|---|
| 색상 | 배경색 | `--promo-surface` | color | `#FFFFFF` | 색상칩 | 정상 |
| 색상 | 본문 색상 | `--promo-text` | color | `#171717` | 색상칩 | 정상 |
| 색상 | 강조 색상 | `--promo-accent` | color | `#D30000` | 색상칩 | 변경됨 |
| 형태 | 기본 모서리 | `--promo-radius` | length | `24px` | 카드 | 정상 |
| 효과 | 기본 그림자 | `--promo-shadow` | shadow | `0 18px...` | 카드 | 정상 |
| 글꼴 | 제목 크기 | `--promo-title-size` | length | `80px` | 텍스트 | 정상 |

테이블 상단 기능:

- 토큰 검색
- 분류 필터
- 변경된 항목만 보기
- 전체 초기값 복원
- CSV 가져오기
- CSV 내보내기

행 단위 기능:

- 값 입력
- 기본값으로 복원
- 값 형식 오류 표시
- 변경 전·후 비교

일반 관리자 화면에서는 다음 고급 속성을 읽기 전용 또는 숨김 처리한다.

- `semantic_role`
- `css_property`
- `required`
- `ai_selectable`
- `editable`

### 4.3 적용 대상 선택

```text
적용할 프로모션 템플릿
☑ Default Template
☐ Event Template
☐ Premium Template
```

버튼:

- `저장`: 새 토큰 버전만 활성화
- `저장 및 적용`: 새 토큰 버전을 활성화하고 선택한 템플릿에 적용

적용 대상이 없으면 `저장 및 적용` 버튼을 비활성화한다.

### 4.4 결과 안내

성공:

```text
둥근 스타일 v4를 저장했습니다.
Default Template v2에 적용했습니다.
프로모션 빌더에서 최신 템플릿을 다시 불러오면 확인할 수 있습니다.
```

실패:

```text
3개 값을 수정해야 합니다.
- 강조 색상: 올바른 색상 값이 아닙니다.
- 제목 크기: px, rem 또는 clamp() 값을 입력하세요.
- 기본 그림자: 허용되지 않은 CSS 문자가 포함되어 있습니다.
```

---

## 5. CSV 파일 설계

### 5.1 파일 선택 UI

```html
<input type="file" accept=".csv,text/csv">
```

처리 순서:

1. 파일 확장자·MIME 확인
2. 최대 파일 크기 확인
3. `await file.text()`
4. UTF-8 BOM 제거
5. 파일명 자동 입력
6. Dry Run API 호출
7. 행 단위 검증 결과 표시
8. 관리자가 확인 후 `가져오기`

권장 최대 크기:

```text
2MB
```

### 5.2 프로모션 전용 CSV 형식

최소 형식:

```csv
token,value,label,category
--promo-surface,#FFFFFF,프로모션 배경,color
--promo-text,#171717,본문 색상,color
--promo-muted,#737373,보조 색상,color
--promo-accent,#D30000,강조 색상,color
--promo-radius,24px,기본 모서리,shape
--promo-shadow,"0 18px 48px rgba(15,23,42,0.16)",기본 그림자,effect
--promo-title-size,80px,제목 크기,typography
```

`value_light`, `value_dark` 형식을 지원해야 한다면 한 파일을 두 개의 토큰 세트로 분리하는 별도 가져오기 모드로 정의한다. 1차 구현에서는 한 파일이 한 토큰 세트를 나타내도록 제한한다.

### 5.3 `--app-*` 파일과 분리

현재 `docs/claude/design-tokens.csv`는 관리자 UI용 `--app-*` 토큰 파일이므로 프로모션 토큰 가져오기 샘플로 사용하지 않는다.

신규 샘플 제안:

```text
docs/samples/promo-design-token-set.csv
```

`--app-*`가 포함되면 다음 오류를 반환한다.

```text
관리자 UI 토큰은 프로모션 디자인 토큰으로 가져올 수 없습니다.
--promo-* 형식의 프로모션 토큰 파일을 사용하세요.
```

---

## 6. Renderer 토큰 적용 계약

### 6.1 공통 매핑

관리자 미리보기와 실제 Renderer가 같은 매핑을 사용해야 한다.

| 관리 토큰 | Renderer 변수·속성 |
|---|---|
| `--promo-surface` | 기본 프로모션·섹션 배경 |
| `--promo-text` | 기본 본문·제목 색상 |
| `--promo-muted` | 보조 문구·빈 필드 안내 색상 |
| `--promo-accent` | Primary CTA, 강조선, 기본 강조색 |
| `--promo-radius` | CTA·이미지 프레임·컴포넌트 기본 모서리 |
| `--promo-shadow` | 프로모션·컴포넌트 기본 그림자 |
| `--promo-title-size` | title 유형 기본 글꼴 크기 |

공통 모듈 제안:

```text
visual-editor/src/platform/design-tokens/promo-token-runtime.mjs
```

책임:

- 허용 토큰 필터링
- 토큰 객체를 CSS Custom Property 객체로 변환
- 기본 별칭 구성
- 값이 없을 때 fallback 구성
- 관리자 미리보기와 Renderer가 공유할 style 객체 생성

### 6.2 우선순위

스타일 우선순위를 다음과 같이 고정한다.

```text
1. 관리자가 해당 섹션·컴포넌트에 명시적으로 저장한 스타일
2. AI가 허용된 style slot에 적용한 token binding
3. 템플릿에 연결된 전역 프로모션 토큰
4. designSpec 기본값
5. Renderer CSS fallback
```

예:

- 섹션에서 배경색을 명시적으로 지정하면 `--promo-surface`보다 우선한다.
- CTA 색상을 별도로 지정하지 않았다면 `--promo-accent`를 사용한다.
- 이미지 모서리를 원형으로 지정하면 `--promo-radius`보다 원형 설정이 우선한다.

### 6.3 관리자 미리보기

별도 정적 HTML로 토큰을 흉내 내지 않는다.

실제 `PromoPageRenderer`와 고정 fixture snapshot을 사용한다.

검증 대상:

- 배경
- 제목
- 본문
- 보조 문구
- CTA
- 이미지 프레임
- 컴포넌트 프레임
- 그림자

---

## 7. 백엔드 원클릭 저장·적용

### 7.1 신규 API

제안:

```http
POST /api/design-token-set-publish
```

요청:

```json
{
  "tokenSetId": "uuid",
  "sourceVersionId": "uuid",
  "tokens": [
    {
      "tokenKey": "--promo-accent",
      "value": "#D30000",
      "metadata": {}
    }
  ],
  "templateIds": ["uuid"],
  "applyMode": "save-and-apply",
  "changeNote": "프로모션 강조 색상 및 모서리 변경"
}
```

응답:

```json
{
  "ok": true,
  "tokenVersion": {
    "id": "uuid",
    "version": 4,
    "status": "active"
  },
  "templates": [
    {
      "templateKey": "default",
      "previousVersion": 1,
      "newVersion": 2,
      "status": "active"
    }
  ]
}
```

### 7.2 서버 처리

1. 요청 인증·권한 확인
2. 토큰 세트와 기준 활성 버전 확인
3. 토큰 카탈로그 조회
4. 전체 값 normalize 및 검증
5. 충돌한 기준 버전이면 `409`
6. 내부 작업 버전 생성
7. 전체 값 저장
8. 새 토큰 버전 활성화
9. 적용할 템플릿 상태 확인
10. 템플릿의 새 버전 생성
11. 새 토큰 버전 ID 연결
12. 템플릿 전체 검증
13. 템플릿 새 버전 활성화
14. 변경 이력 저장
15. 결과 반환

### 7.3 템플릿 초안 충돌 정책

선택한 템플릿에 이미 별도 초안이 있다면 자동으로 병합하지 않는다.

`409` 응답:

```json
{
  "error": "TEMPLATE_DRAFT_CONFLICT",
  "message": "선택한 템플릿에 편집 중인 변경 사항이 있습니다.",
  "templateKey": "default"
}
```

이유:

- 토큰 적용 과정에서 다른 관리자의 섹션·레이아웃 변경을 함께 활성화하면 안 된다.
- 숨겨진 자동 병합은 변경 범위를 예측하기 어렵게 만든다.

관리자는 다음 중 하나를 선택한다.

- 기존 템플릿 초안을 먼저 처리
- 해당 템플릿을 적용 대상에서 제외

### 7.4 원자성

토큰 활성화는 성공했지만 템플릿 적용이 실패하는 부분 성공 상태를 허용하지 않는다.

`save-and-apply`는 DB 함수 또는 단일 트랜잭션으로 처리한다.

신규 DB 변경이 필요하다면 최신 번호 확인 후 다음 역할의 함수를 추가한다.

```text
publish_promo_design_token_version_and_templates(...)
```

단, `save` 모드는 기존 토큰 버전 원자적 생성·활성화 함수를 재사용할 수 있다.

---

## 8. 데이터 모델 및 마이그레이션

### 8.1 유지할 구조

다음 테이블은 유지한다.

- `promo_design_token_definitions`
- `promo_design_token_sets`
- `promo_design_token_set_versions`
- `promo_design_token_values`
- `promo_design_token_histories`

테이블 기반 UI를 위해 새로운 토큰 값 테이블을 만들지 않는다.

화면의 행은 다음 join 결과다.

```text
promo_design_token_definitions
  LEFT JOIN promo_design_token_values
```

### 8.2 마이그레이션 필요 여부

UI 테이블화와 파일 선택만 구현하면 마이그레이션은 필요 없다.

다음 요구를 모두 만족하는 원클릭 적용을 구현할 때만 신규 마이그레이션을 검토한다.

- 토큰 버전 생성·활성화
- 여러 템플릿 버전 생성·활성화
- 전체 작업 원자성
- 변경 이력 저장

현재 최신 마이그레이션은 `036_section_ai_image_policy_v3_drafts.sql`이므로 실제 개발 시작 시 다음 번호를 다시 확인한다.

---

## 9. 프런트엔드 구조

제안 구조:

```text
admin-app/src/components/design-tokens/
├─ DesignTokenManager.vue
├─ DesignTokenToolbar.vue
├─ DesignTokenTable.vue
├─ DesignTokenValueCell.vue
├─ DesignTokenCsvDialog.vue
├─ DesignTokenApplyPanel.vue
├─ DesignTokenPreview.vue
└─ DesignTokenHistoryDialog.vue

admin-app/src/modules/design-tokens/
├─ token-table.mjs
├─ token-validation.mjs
├─ csv-file.mjs
└─ token-diff.mjs
```

원칙:

- `DesignTokenManager.vue` 단일 파일에 모든 로직을 추가하지 않는다.
- API 호출은 기존 `design-token-service.mjs`에 유지한다.
- CSV 파싱의 최종 판정은 서버가 수행한다.
- 클라이언트 검증은 빠른 사용자 안내용이다.
- 화면 문구는 locale 메시지 DB·기준 파일에 등록한다.

---

## 10. 단계별 개발계획

### P0. Renderer 토큰 계약 정상화

목표:

- 저장된 토큰이 실제 프로모션 빌더와 Web Output에 모두 반영되도록 한다.

작업:

1. 현재 카탈로그 토큰과 Renderer 사용처 전수 비교
2. `promo-token-runtime.mjs` 공통 모듈 추가
3. `--promo-surface` 연결
4. `--promo-text` 연결
5. `--promo-muted` 연결
6. `--promo-accent`와 CTA 연결
7. `--promo-radius` 연결
8. `--promo-shadow` 연결
9. `--promo-title-size` 연결
10. 명시적 섹션·Item 스타일 우선순위 적용
11. 관리자 미리보기를 실제 Renderer 기반으로 변경
12. Preview와 Web Output 동등성 테스트 추가

완료 조건:

- 카탈로그의 모든 필수 토큰이 하나 이상의 실제 Renderer 속성에 연결된다.
- Rounded와 Square 토큰 세트의 차이가 프로모션 빌더에서 명확하게 보인다.
- 관리자 미리보기, Live Preview, Web Output의 계산 스타일이 동일하다.

### P1. 테이블 기반 관리 UI

목표:

- 관리자가 버전 구조를 이해하지 않아도 토큰 값을 수정할 수 있게 한다.

작업:

1. 토큰 세트 선택 UI 단순화
2. 토큰 정의+값 테이블 구현
3. category 필터
4. 검색
5. 변경 항목 표시
6. 타입별 입력 컨트롤
7. 행 단위 오류
8. 기본값 복원
9. 변경 전·후 diff
10. 버전·초안 상태를 기본 화면에서 숨김
11. 버전 이력을 보조 Dialog로 이동
12. dirty 상태 이탈 경고

완료 조건:

- 관리자가 선택한 세트의 모든 기본 항목을 한 테이블에서 수정할 수 있다.
- `초안 생성`, `검증`, `활성화` 버튼이 기본 화면에 노출되지 않는다.
- 잘못된 값은 해당 행에서 즉시 확인할 수 있다.

### P2. CSV 파일 가져오기·내보내기

목표:

- CSV 파일을 실제 파일 선택 방식으로 등록한다.

작업:

1. 파일 선택 UI
2. 파일명 자동 표시
3. UTF-8/BOM 처리
4. 크기·확장자 검증
5. Dry Run 자동 실행
6. 신규·변경·오류 행 표시
7. 가져오기 확인
8. 현재 세트 CSV 내보내기
9. 프로모션 토큰 샘플 다운로드
10. `--app-*` 혼입 전용 오류 안내

완료 조건:

- 파일 선택 후 textarea에 수동으로 붙여넣지 않아도 된다.
- 오류가 있으면 DB에 아무 값도 저장되지 않는다.
- 가져온 값이 테이블에 반영되고 변경 상태가 표시된다.

### P3. 저장 및 적용 원클릭 흐름

목표:

- 한 번의 사용자 동작으로 안전한 버전 생성과 템플릿 적용을 완료한다.

작업:

1. 적용 대상 템플릿 다중 선택
2. `저장` API
3. `저장 및 적용` API
4. 기준 버전 optimistic concurrency
5. 서버 전체 검증
6. 내부 작업 버전 생성
7. 토큰 활성화
8. 템플릿 새 버전 생성·연결·활성화
9. 템플릿 초안 충돌 차단
10. 전체 작업 원자성 보장
11. 변경 이력 저장
12. 완료 결과 요약
13. Create Promo 최신 템플릿 갱신 검증

완료 조건:

- 관리자는 별도 초안·검증·활성화 절차를 수행하지 않는다.
- 실패 시 기존 활성 토큰과 활성 템플릿이 모두 유지된다.
- 성공 시 프로모션 빌더에서 새 토큰 버전이 반영된다.

### P4. 운영 안정화

목표:

- 실제 운영에서 변경·복구·추적이 가능하도록 한다.

작업:

1. 이전 버전 복원
2. 적용 영향 템플릿 사전 표시
3. 토큰 version ID와 hash snapshot 확인
4. 브라우저 캐시·snapshot 갱신 점검
5. 변경 감사 로그
6. 접근 권한
7. 대량 파일 성능 점검
8. 오류 로그 및 관측성

---

## 11. 테스트 계획

### 11.1 단위 테스트

- CSV BOM 제거
- quoted comma 처리
- 중복 token 검사
- `--app-*` 거부
- 허용되지 않은 token 거부
- color/length/shadow/enum 검증
- 변경 diff
- Renderer token style 변환
- 스타일 우선순위

### 11.2 API 테스트

- 정상 저장
- 정상 저장 및 적용
- 기준 버전 충돌 `409`
- 템플릿 초안 충돌 `409`
- 필수 토큰 누락 `422`
- 잘못된 CSS 값 `422`
- 템플릿 적용 실패 시 전체 롤백
- 이전 활성 토큰 유지
- 변경 이력 생성

### 11.3 관리자 브라우저 테스트

- 토큰 세트 선택
- 테이블 값 변경
- 변경 행 표시
- CSV 파일 선택
- Dry Run 결과
- CSV 가져오기
- 적용 템플릿 선택
- 저장 및 적용
- 오류 행 포커스
- 이탈 경고

### 11.4 통합 브라우저 테스트

반드시 실제 흐름을 검증한다.

```text
관리자 토큰 값 변경
  → 저장 및 적용
  → Public Template API 확인
  → Create Promo 템플릿 선택
  → Live Preview 계산 스타일 확인
  → Web Output 계산 스타일 확인
```

검증 속성:

- background-color
- color
- font-size
- border-radius
- box-shadow
- CTA background/color/radius

### 11.5 회귀 테스트

```text
pnpm run build:admin
pnpm run build:visual-editor
pnpm test
git diff --check
```

테스트 파일 수는 문서에 고정하지 않고 실행 로그에 기록한다.

---

## 12. 위험 요소 및 대응

| 위험 | 우선순위 | 대응 |
|---|---:|---|
| 관리자 미리보기와 실제 Renderer 불일치 | P0 | 실제 Renderer와 공통 token runtime 사용 |
| 토큰 활성화만 하고 템플릿 적용을 누락 | P0 | 적용 대상 필수 선택 및 원클릭 적용 |
| 템플릿의 다른 초안 변경까지 자동 활성화 | P0 | 초안 충돌 시 차단 |
| 토큰 적용 중 부분 성공 | P0 | 단일 트랜잭션 또는 DB 함수 |
| `--app-*` CSV 혼입 | P0 | namespace 검증과 전용 안내 |
| 명시적 섹션 스타일이 전역 토큰을 덮어씀 | P1 | 우선순위 문서화 및 UI 표시 |
| 토큰 버전 변경으로 기존 결과 재현 불가 | P0 | immutable version pin 유지 |
| 잘못된 CSS 값 주입 | P0 | 서버 allowlist 및 값 검증 |
| UI 단순화 과정에서 이력 기능 상실 | P1 | 이력 Dialog로 이동 |
| 토큰 변경 후 Builder가 오래된 snapshot 사용 | P1 | 템플릿 버전 갱신 및 통합 테스트 |

---

## 13. 배포 및 롤백

### 13.1 배포 순서

1. P0 공통 token runtime 배포
2. 기존 토큰 세트로 Live Preview/Web Output 회귀 확인
3. P1 테이블 UI 배포
4. P2 CSV 파일 UI 배포
5. P3 API·DB 변경 배포
6. 원클릭 적용 기능 활성화
7. Production 통합 확인

### 13.2 기능 플래그

신규 원클릭 적용 기능은 초기 배포에서 다음 플래그로 보호할 수 있다.

```text
DESIGN_TOKEN_SIMPLE_MANAGER_ENABLED
```

단, 안정화 후에는 환경변수 의존을 제거하고 기존 UI를 정리한다.

### 13.3 롤백

- 신규 테이블 UI 비활성화
- 기존 API 유지
- 신규 publish API 호출 중단
- 기존 활성 토큰 버전과 템플릿 버전 유지
- 신규 이력 및 버전 데이터는 삭제하지 않음

---

## 14. 완료 기준

다음 조건을 모두 만족하면 완료로 판단한다.

1. 디자인 토큰 세트를 N개 관리할 수 있다.
2. 동일한 기본 토큰 항목을 테이블에서 수정할 수 있다.
3. 관리자는 초안·검증·활성화 절차를 직접 수행하지 않는다.
4. CSV 파일을 파일 선택 방식으로 가져올 수 있다.
5. 프로모션 전용 CSV 샘플을 제공한다.
6. `--app-*` 토큰 파일은 명확한 오류로 차단한다.
7. 저장 전 모든 값이 서버에서 검증된다.
8. `저장 및 적용` 한 번으로 토큰과 선택한 템플릿이 반영된다.
9. 실패 시 기존 활성 상태가 유지된다.
10. 관리자 미리보기와 실제 프로모션 Renderer가 같은 token runtime을 사용한다.
11. 모든 관리 토큰이 실제 Renderer 속성에 연결된다.
12. Create Promo Live Preview와 Web Output 결과가 동일하다.
13. 이전 버전과 AI 실행 이력의 재현성이 유지된다.
14. 빌드와 전체 테스트가 통과한다.

---

## 15. 개발 시작 전 확인 사항

1. `--promo-radius`의 기본 적용 범위를 CTA·이미지·컴포넌트·전체 프로모션 중 어디까지로 할지 확정
2. `--promo-shadow`의 기본 적용 대상을 프로모션 전체 또는 컴포넌트 프레임 중 하나로 확정
3. `--promo-surface`와 섹션별 명시적 배경색의 우선순위 확인
4. `저장 및 적용` 시 활성 템플릿의 새 버전을 자동 활성화할지 최종 승인
5. 기존 템플릿 초안이 있을 때 무조건 차단하는 정책 승인
6. CSV 한 파일이 한 토큰 세트를 표현하는 1차 범위 승인
7. 토큰 세트 활성화만 하는 `저장` 버튼을 유지할지 확인

권장 기본값:

- 명시적 섹션·컴포넌트 스타일이 전역 토큰보다 우선
- `--promo-radius`: CTA·이미지·컴포넌트 프레임 기본값
- `--promo-shadow`: 컴포넌트 프레임 기본값
- 기존 템플릿 초안이 있으면 자동 적용 차단
- CSV 한 파일은 한 토큰 세트
- `저장`과 `저장 및 적용` 모두 제공

