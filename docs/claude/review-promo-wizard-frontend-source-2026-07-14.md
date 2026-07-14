# 검토 의견: prototype/promo-wizard.* (Standalone Promo Wizard 프론트엔드)

Reviewer: Claude
Date: 2026-07-14
검토 범위: `prototype/promo-wizard.html`, `prototype/promo-wizard.css`, `prototype/promo-wizard.js`(1796줄 전체). `handoff-2026-07-13.md`에서 오늘의 주요 작업 대상으로 언급된 파일들.
참고: `api/` 폴더는 `docs/claude/review-api-folder-source-2026-07-12.md`, `docs/claude/comprehensive-review-report-2026-07-12.md`에서 이미 검토됨. 이번 검토는 그 범위와 겹치지 않음. `prototype/app.js`(레거시 Promo Builder, 3920줄)는 이번 세션에서 구조만 확인했고 심층 검토는 하지 않음.

## 결론

**`createField()`(Step 2 상단 개요/CTA 섹션)에 실제 타이핑을 방해하는 버그가 있음.** 제목, 마켓/지역, CTA 텍스트/URL, Alpha 고지, 약관 문구 입력창에 한 글자씩 입력할 때마다 전체 Step 2 DOM이 통째로 재생성되어, 입력 중이던 필드가 포커스를 잃는다. 실제 사용자가 이 필드에 여러 글자를 연달아 입력하면 매 글자마다 클릭을 다시 해야 하는 상태다. 같은 파일 안에서 `createSectionField()`(Header/Hero/Footer 등)와 JSON 텍스트에어리어는 이미 이 문제를 피하는 방식으로 구현되어 있어, 이번 케이스는 설계 의도가 아니라 누락으로 보인다. 이 외에는 에러 처리·polling·상태 저장 패턴이 전반적으로 견고하게 구현되어 있음.

## 이슈사항

### 1. (버그, 우선순위 높음) Step 2 일부 입력 필드에서 타이핑 중 포커스 손실

- 위치: `promo-wizard.js` `createField()` 442~443줄, `setFieldValue()` 384~395줄, `renderContentStep()` 682줄(`placeholders.innerHTML = ""`).
- 원인: `createField()`가 만든 input/textarea는 `input` 이벤트마다 `setFieldValue()`를 호출하고, `setFieldValue()`는 끝에서 항상 `renderStep()`을 호출한다. `renderStep()` → `renderContentStep()`은 `placeholders.innerHTML = ""` 후 모든 DOM을 새로 생성한다. 즉 사용자가 입력 중인 바로 그 input 엘리먼트가 매 키 입력마다 파괴되고 새 노드로 교체되어 포커스가 사라진다.
- 영향받는 필드: "1. 프로모션 개요"의 프로모션 제목·마켓/지역, "3. CTA/약관"의 CTA 버튼 텍스트·CTA URL·Alpha 고지·약관 문구(textarea, 여러 문장 입력 시 특히 체감됨).
- 대조 확인: 같은 파일의 `createSectionField()`(Header/Hero Banner/Footer 등, 397~402줄 `setSectionValue()`)는 `renderStep()`을 호출하지 않아 이 문제가 없고, `createMessageJsonSection()`의 JSON textarea도 `input` 시점엔 렌더링하지 않고 `blur` 시점에만 `renderStep`을 호출하도록 이미 올바르게 구현되어 있음. 이 둘과 비교하면 `createField()`만 예외적으로 문제가 있는 상태.
- 제안: `createField()`의 input 리스너에서 `renderStep()` 전체 재실행 대신, 상태만 갱신하고 필요한 부분(coverage 패널의 체크리스트, invalid 표시)만 갱신하거나, `createSectionField`/JSON 섹션처럼 `blur` 시점에만 리렌더링하도록 통일 권장.

```js
// 현재 (442~443줄)
control.addEventListener("input", (event) => setFieldValue(group, key, event.target.value));
control.addEventListener("change", (event) => setFieldValue(group, key, event.target.value));

// setFieldValue (384~395줄)
function setFieldValue(group, key, value) {
  contentState[group][key] = value;
  ...
  renderStep(); // ← 이 호출이 매 keystroke마다 전체 Step 2 DOM을 재생성함
}
```

### 2. (사소함) localStorage 키에 디버그성 접미사 잔존

- 위치: `promo-wizard.js` 41줄, `storageKeys.selectedDocumentId: "promoPrototype.selectedDocumentId.abc"`.
- `.abc`는 다른 키(`wizardContent.v1`, `wizardRun.v1`)의 버전 네이밍 규칙과 맞지 않는 임시/디버그성 값으로 보임. 실제 동작에는 영향 없으나 정리 대상.

### 3. (코드 스멜, 참고) DOM 순서에 의존하는 필드 숨김 처리

- 위치: `renderContentStep()` 712줄, `overview.querySelector("label:nth-child(3)")`로 "기타 목적" 필드를 찾아 숨김 처리.
- `createContentSection`에 전달하는 필드 배열의 순서가 바뀌면 조용히 다른 필드를 숨기게 되는 구조. data attribute나 필드 key 기반 선택으로 바꾸면 더 안전함. 지금 당장 문제를 일으키진 않음.

## 간략한 내용

- 에러 처리: `fetchJson()`이 실패 응답을 일관되게 `Error`로 변환하고, 각 액션 핸들러(`prepareLofiRun`, `createNewLofiDraft`, `generateFinalDesign`, `confirmDraft`)가 `try/catch/finally`로 `runLoading`/`runError`를 빠짐없이 관리함. `api/` 폴더 리뷰에서 확인된 패턴과 일관성 있음.
- Polling(`syncRunPolling`)은 진행 중 상태가 있을 때만 5초 간격으로 재시도하고 완료 시 정리됨. 다만 네트워크 오류가 반복되는 경우 backoff 없이 계속 재시도하는 점은 참고할 부분(PoC 단계에서는 큰 문제 아님).
- `createSectionField`/JSON 섹션은 이미 "입력 중 리렌더 방지" 패턴이 적용되어 있어, 이슈 1번은 프로젝트 전체의 설계 결함이 아니라 `createField()` 한 곳의 국소적 누락으로 판단됨.
- 이번 세션에서는 `prototype/app.js`(레거시, 3920줄)와 `prototype/index.html`/`styles.css`는 심층 검토하지 않음. 필요하면 다음 세션에서 이어서 검토 가능.

## 제안 우선순위

1. `createField()` 포커스 손실 버그 수정 (이슈 1) — 실사용 타이핑 경험에 직접 영향.
2. `localStorage` 키 네이밍 정리 (이슈 2).
3. 필드 숨김 로직 리팩터 (이슈 3, 선택적).
