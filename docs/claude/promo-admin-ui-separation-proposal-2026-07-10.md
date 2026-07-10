# Promo(사용자) / 관리자 페이지 분리 개선 제안 (2026-07-10)

작성: Claude (검토/제안용 문서, 소스 수정은 하지 않음 — 적용은 코덱스가 진행)
대상 파일: `prototype/index.html`

## 배경 및 목적

사용자 요청: "Promo는 사용자 전용이고, 관리자 페이지는 설정이나 기타 관리용으로 구성"하고 싶다는 방향에 따라 현재 `prototype/index.html`의 화면 구조를 점검했다.

## 현재 상태 분석

`currentView` 상태값 기준으로 이미 아래처럼 나뉘어 있다.

```text
currentView === 'builder'  -> "프로모션 빌더" (사용자용)
  A. 디자인 MD 관리
  B. 프로모션 빌더 (Step 1~3: 디자인 모드/마켓, 입력, 생성)
  C. 생성된 UI 디자인 / 결과

currentView === 'prompts'  -> "관리자 페이지" (관리용)
  A. Worker Webhook 설정
  B. 현재 프롬프트 관리
```

전반적인 분리는 잘 되어 있으나, 한 가지 예외를 발견했다.

**문제**: 화면 최상단 `<header class="topbar">` 안의 `handoff-picker`(내부 handoff 문서 select + "보기" 버튼)가 `currentView` 조건과 무관하게 항상 노출된다 (`index.html` 12~24행 부근). 이 UI는 `/api/handoff-documents` API를 호출하는데, 이 API는 서버의 `docs/handoff-*.md` 파일을 그대로 읽어 반환한다(`api/handoff-documents.js`). 즉 내부 개발 진행 기록이 "프로모션 빌더"(사용자용) 화면에서도 그대로 노출되는 상태다. "Promo는 사용자 전용"이라는 목적에 어긋나는 부분이다.

그 외에는 A/B/C 섹션 구성과 관리자 페이지 A/B 구성 모두 사용자용/관리용 구분에 문제가 없어 보인다.

## 제안 사항

`handoff-picker` UI를 상단 topbar에서 제거하고, 관리자 페이지 안에 기존 "A. Worker Webhook / B. 현재 프롬프트" 패턴을 따르는 **"C. Handoff 문서 (참고자료)"** 섹션으로 이동한다. 데이터/메서드(`selectedHandoffFile`, `handoffDocuments`, `handoffLoading`, `openSelectedHandoff` 등)는 `app.js`에 이미 구현되어 있으므로 **`app.js` 수정은 필요 없고 `index.html` 마크업 이동만** 하면 된다.

### 변경 1 — topbar에서 handoff-picker 제거

`index.html` 약 12~30행 부근, 아래 블록에서

```html
<div>
  <div class="title-row-with-tools">
    <h1>PROMO WEB BUILDER</h1>
    <div class="handoff-picker">
      <select v-model="selectedHandoffFile" :disabled="!handoffDocuments.length || handoffLoading" aria-label="handoff 문서 선택">
        <option value="" disabled>handoff 문서</option>
        <option v-for="doc in handoffDocuments" :key="doc.file" :value="doc.file">{{ doc.label }}</option>
      </select>
      <button class="tiny-button" type="button" :disabled="!selectedHandoffFile || handoffLoading" @click="openSelectedHandoff">보기</button>
    </div>
  </div>
</div>
```

`handoff-picker` div를 제거하고 아래처럼 h1만 남긴다.

```html
<div>
  <div class="title-row-with-tools">
    <h1>PROMO WEB BUILDER</h1>
  </div>
</div>
```

### 변경 2 — 관리자 페이지에 "C. Handoff 문서" 섹션 추가

`index.html`에서 관리자 페이지 `panel-header`(관리자 페이지 제목 + 새로고침 버튼) 바로 다음, 기존 `admin-ab-layout`(A/B 두 컬럼) 시작 지점 앞에 아래 블록을 추가한다.

```html
<!-- panel-header 닫힘(</div>) 직후, admin-ab-layout div 시작 전 -->
<div class="subsection admin-docs-subsection">
  <div class="subsection-title">
    <h3>C. Handoff 문서 (참고자료)</h3>
    <span>내부 개발 진행 기록 · 사용자 화면에는 노출되지 않음</span>
  </div>
  <div class="handoff-picker">
    <select v-model="selectedHandoffFile" :disabled="!handoffDocuments.length || handoffLoading" aria-label="handoff 문서 선택">
      <option value="" disabled>handoff 문서</option>
      <option v-for="doc in handoffDocuments" :key="doc.file" :value="doc.file">{{ doc.label }}</option>
    </select>
    <button class="tiny-button" type="button" :disabled="!selectedHandoffFile || handoffLoading" @click="openSelectedHandoff">보기</button>
  </div>
</div>
```

`subsection`, `subsection-title`, `handoff-picker`, `tiny-button` 클래스는 `styles.css`에 이미 정의되어 있어 별도 CSS 추가가 필요 없다. 문서 뷰어 모달(`<dialog class="modal handoff-modal" ref="handoffModal">`, index.html 약 848행 부근)은 위치와 무관하게 독립적으로 동작하므로 그대로 둔다.

## 참고

- 순수 마크업 이동이라 `app.js`는 변경 불필요.
- `mounted()`에서 `loadHandoffDocuments()`를 무조건 호출하는 부분은 그대로 둬도 무방(가벼운 목록 조회라 사용자 화면 진입 시 비용 문제 없음). 다만 원한다면 "관리자 페이지 최초 진입 시"(`openPromptManager()`)로 지연 로딩하는 것도 고려할 수 있음 — 필수는 아님.
- 적용 후 확인 포인트: (1) 사용자 화면(프로모션 빌더)에 handoff 관련 UI가 전혀 안 보이는지, (2) 관리자 페이지에서 기존과 동일하게 handoff 문서 선택 → "보기" → 모달에 markdown이 정상 표시되는지.

## 상태

제안 단계. 코덱스 쪽에서 적용 여부 판단 후 반영 요청.
