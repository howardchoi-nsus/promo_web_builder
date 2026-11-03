# 검토 의견: 관리자 페이지 UI/UX (2026-07-15)

Reviewer: Claude
Date: 2026-07-15
검토 범위: `prototype/index.html` 642~1450줄(관리자 3개 탭: 웹훅 설정 / LLM 및 프롬프트 관리 / 프로모션 폼 관리 + Section CRUD 로그), `prototype/styles.css`(admin-tab, prompt-admin-grid, form-template-admin-grid, 반응형/모션 규칙), `prototype/app.js` 관리자 인터랙션 로직

## 결론

**기능적으로는 잘 짜인 3-컬럼 관리 콘솔이지만, "실수해도 안전한가"라는 관리자 도구의 핵심 기준에서 구멍이 여러 개다.** 가장 큰 문제 세 가지: (1) 모든 피드백이 우상단 status pill 텍스트 하나로 흘러가서 저장 실패·validation 오류를 놓치기 쉽고, 서버가 주는 상세 오류(422 errors 배열)를 버린다. (2) 편집 상태(dirty state) 보호가 없어 다른 섹션/아이템/탭을 클릭하면 입력 중이던 내용이 조용히 사라진다. (3) 드래그앤드롭이 유일한 순서 변경 수단이라 키보드로는 순서 변경이 불가능하다. 그 외 라벨 용어 불일치("삭제"·"보관(삭제)"·"제외"), 읽기 전용 상태에서 Item 편집기가 열리는 문제, 죽은 마크업 잔존 등 정리가 필요하다.

CSS 기반기(focus-visible, prefers-reduced-motion, 720px/980px 반응형 축소)는 이미 갖춰져 있어 좋은 상태다. 아래 이슈는 대부분 구조 변경 없이 보완 가능하다.

## 이슈사항

### 1. (UX, 최우선) 피드백 채널이 status pill 하나 — 오류가 스쳐 지나감

- `setStatus()`(app.js 4220행)는 topbar의 `status-pill` 텍스트를 교체할 뿐이다. 성공/실패 구분(색·아이콘) 없음, 지속 시간 개념 없음, 다음 메시지가 오면 즉시 덮임.
- 관리자 작업은 대부분 화면 하단(아이템 편집기, Section 구성)에서 일어나는데 피드백은 화면 반대편 구석에 뜬다. "아이템 저장 실패: ..."를 못 보고 지나가면 저장됐다고 믿게 된다.
- 특히 활성화 API가 주는 `errors` 배열(422, `{path, code, message}` 상세 validation 결과)을 프론트가 `error.message` 한 줄로 뭉개서 버린다. 서버는 "어느 섹션의 어떤 항목이 왜 문제인지"를 알려주는데 UI는 표시할 자리가 없다.
- 제안: ① 실패는 작업 위치 근처 inline `danger-state` 블록으로 표시(웹훅/프롬프트 목록 로딩 오류는 이미 이 패턴을 씀 — 쓰기 작업에도 확장), ② 활성화 validation 오류는 errors 배열을 항목별 리스트로 렌더링, ③ status pill은 성공 알림 전용으로 축소하거나 success/error 스타일 구분.

### 2. (UX, 데이터 유실) 편집 중 상태 보호 없음

- Section 편집기(`wizardFormTemplateSectionEditor`)와 Item 편집기(`wizardFormTemplateItemEditor`)는 전역 단일 객체라, 저장 전에 다른 섹션/아이템을 클릭하면 입력값이 경고 없이 초기화된다(`selectWizardFormTemplateSection`이 편집기를 덮어씀).
- 탭 전환(`adminTab` 변경), 목록의 다른 템플릿 선택, 새로고침 버튼도 마찬가지로 dirty 상태를 버린다.
- 프롬프트 편집기(LLM 탭)도 동일: 본문 24줄을 수정하다가 목록에서 다른 프롬프트를 클릭하면 그대로 유실.
- 제안: 편집기 open 시점의 snapshot과 현재 값을 비교하는 dirty flag를 두고, 전환 시 `window.confirm` 1줄이라도 가드. (Wizard 템플릿 전환에는 이미 이 패턴이 있음 — promo-wizard.js 290행 — 관리자에도 동일 적용.)

### 3. (접근성) 순서 변경이 드래그앤드롭 전용 — 키보드 사용자 배제

- `section-drag-handle`은 `<span draggable>`로 tabindex가 없어 포커스 자체가 불가능하고, 위/아래 이동 버튼 같은 대체 수단이 없다. Section·Item 순서 변경이 마우스 없이는 불가능.
- 터치 기기에서도 HTML5 drag & drop은 기본 동작하지 않으므로 모바일 관리자도 동일하게 막힌다(반응형 CSS는 갖춰놓고 핵심 인터랙션이 막히는 셈).
- 제안: 핸들을 `<button>`으로 바꾸고 확장 영역에 "위로/아래로" 버튼 추가(기존 `wizard-content-sections-order` API 재사용 가능). 드래그는 보조 수단으로 유지.

### 4. (일관성) 읽기 전용 상태에서 Item 편집기가 열리고 저장 버튼도 활성

- 템플릿이 active/inactive일 때: 템플릿 이름·설명·Section 편집기 필드는 `wizardFormTemplateCanEdit`로 disabled 처리되지만, **Item 행의 펼침 버튼과 편집기 내부 필드·"수정 저장"·"삭제" 버튼은 이 가드가 없다**(index.html 1126~1146행 — `wizardFormTemplateSectionSaving`만 검사).
- 실제로 저장을 누르면 서버의 draft 가드(409)에 막혀 실패하므로 데이터는 안전하지만, "수정할 수 있어 보이는데 저장하면 에러"는 사용자를 혼란시키는 UI 거짓말이다.
- 제안: Item 편집기에도 `:disabled="!wizardFormTemplateCanEdit"`를 일괄 적용하고, 읽기 전용일 때는 "새 초안을 만들어야 수정할 수 있습니다" 안내를 Item 패널에도 노출.

### 5. (카피) 파괴적 액션 용어 불일치 — 같은 말이 다른 뜻, 다른 말이 같은 뜻

| 위치 | 버튼 라벨 | 실제 동작 |
|---|---|---|
| 템플릿 Section 편집기 | "삭제" | 템플릿에서 제외(공유 섹션) 또는 실제 삭제(owned 섹션), confirm 문구는 "제외할까요?" |
| Section Item | "삭제" | 실제 삭제 |
| 폼 템플릿 | "보관" | 소프트 삭제(복구 불가 UI 없음) |
| 섹션 라이브러리(비활성 코드) | "보관(삭제)" | 소프트 삭제 |
- 버튼 라벨과 confirm 문구가 다르면("삭제" 버튼 → "제외할까요?") 사용자는 어느 쪽을 믿어야 할지 알 수 없다. 라벨은 동작을 그대로 말해야 한다: 제외는 "템플릿에서 제외", 삭제는 "삭제", 보관은 "보관".
- 보관(archive)에는 confirm이 아예 없다 — Item 삭제(confirm 있음)보다 더 큰 파괴적 액션인데 보호가 약하다.

### 6. (UX) 웹훅 URL "비워두면 유지" 패턴 — placeholder에 정책을 실음

- "기존 URL을 유지하려면 비워 두세요"가 placeholder에만 있어 입력을 시작하면 사라진다. 빈 값 제출 = 유지라는 규칙 자체가 발견 불가능하고, URL을 지울 방법이 없다는 07-14 이슈 #3도 그대로다.
- 제안: 정책 설명은 필드 아래 고정 helper text로 이동, "URL 제거" 명시 버튼 추가.

### 7. (구조) 상태 관리 소실 — 탭·화면 상태가 URL/스토리지에 없음

- `adminTab`, `currentView`, 선택된 템플릿/프롬프트가 어디에도 저장되지 않아 새로고침하면 항상 "프로모션 빌더 > 웹훅 설정"으로 리셋된다. 깊은 편집 작업 중 새로고침(또는 세션 공유용 링크 복사)이 불가능.
- themeMode, selectedDocumentId는 이미 localStorage에 저장하고 있으므로 같은 패턴으로 `adminTab`/`currentView`만 추가해도 체감이 크다. URL hash(`#admin/promo-form`)면 더 좋다.

### 8. (접근성) ARIA tabs 패턴 절반만 구현

- 탭에 `role="tab"`/`aria-selected`는 있지만 `role="tabpanel"`, `id`/`aria-controls` 연결, 화살표 키 이동이 없다. 스크린리더는 "탭 3개 중 2번째"까지는 읽지만 어떤 패널이 열렸는지 연결하지 못한다.
- 최소 보완: 각 패널에 `role="tabpanel"` + `aria-labelledby`, 탭 버튼에 `id` 부여. (화살표 키 이동은 선택 사항 — 버튼이라 Tab 키로는 이동 가능.)

### 9. (정리) 죽은 코드·잔재가 마크업 품질을 깎음

- `v-if="false"`로 꺼둔 "섹션 라이브러리" 블록이 index.html 1197행~약 1450행까지 통째로 남아 있음. app.js에도 대응 메서드(`loadWizardSections` 등 400여 줄)가 살아 있다. 유지할 계획이 없으면 제거, 있으면 주석으로 사유·복구 시점 명시 필요.
- `admin-ab-layout`의 `@pointermove/@pointerup` 리사이즈 핸들러(index.html 680~683행)는 `is-single-panel` 전환 후 의미가 없어진 잔재.
- Section CRUD 로그 `<details open>`이 기본 펼침 + 200건 로드라 promo-form 탭 하단이 항상 무겁다. 기본 접힘 권장.

### 10. (참고) 경미한 사항

- 저장 버튼 라벨: 웹훅은 "저장 중..."으로 바뀌지만 폼 템플릿/프롬프트 저장은 disabled만 됨 — 진행 표시 패턴 통일 권장.
- "고정 내용 (JSON)" textarea는 관리자에게 `{"label":"..","link":".."}`를 손으로 치게 한다. fieldKind가 이미 있으므로 text/cta/image별 구조화된 입력 폼으로 대체 가능(오류도 저장 시점이 아니라 입력 시점에 잡힘).
- audit log 상세가 DB row 전체(snake_case JSON) dump라 관리자용 가독성이 낮음 — 변경된 필드만 diff로 보여주면 좋다.
- 텍스트 유형 옵션 라벨 대소문자 불일치: "Title / remark / Multi".
- 버전 전환 select가 "템플릿 기본 설정" details 안에 숨어 있어 발견성이 낮음 — 헤더의 버전 표기(v2 · 초안)를 클릭 가능한 버전 스위처로 승격 검토.

## 간략한 내용 (잘 되어 있는 부분)

- `admin-tab:focus-visible`, `section-expand-button:focus-visible` 등 포커스 스타일 존재, `prefers-reduced-motion` 2곳 대응, 720/980/1180px 반응형 그리드 축소 — 품질 바닥이 갖춰져 있음.
- 로딩 오류를 `danger-state` inline 블록으로 보여주는 패턴, empty state 문구("등록된 폼 템플릿이 없습니다", "Section을 선택해 주세요"), 활성화 버튼의 조건부 title 안내는 좋은 방향 — 이 패턴을 쓰기 작업 피드백까지 확장하는 것이 이슈 1의 요지.
- 드래그 중 drop-before/after 시각 피드백, transition-group 순서 애니메이션, 이중 제출 방지 가드 등 인터랙션 완성도는 높다.

## 제안 우선순위

1. 쓰기 실패·validation 오류의 inline 표시 (이슈 1) — 관리자 신뢰도 직결
2. dirty state 가드 (이슈 2) — 데이터 유실 방지
3. 읽기 전용 상태에서 Item 편집기 비활성화 (이슈 4) — 저비용 즉시 수정
4. 파괴적 액션 라벨·confirm 정리 (이슈 5) — 카피 수정만으로 해결
5. 키보드 순서 변경 수단 (이슈 3)
6. adminTab/currentView 상태 유지 (이슈 7)
7. 나머지 (이슈 6, 8, 9, 10)
