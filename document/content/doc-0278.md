# Status: Superseded - 2026-07-10

This design request is superseded by:

```text
docs/standalone-promo-wizard-development-plan-2026-07-10.md
```

Reason:

```text
The A+B in-SPA/tab wizard direction still mixes the long-running generation
workflow with the restored promo builder page.

The adopted direction is now a standalone full-page wizard:
prototype/promo-wizard.html
prototype/promo-wizard.js
prototype/promo-wizard.css
```

Keep this file as historical design context only. Do not implement from this document unless the decision is explicitly reopened.

# Promo 빌더 위저드 전환 — 디자인 요청서 (2026-07-10)

작성: Claude (요청/제안용 문서, 소스 수정 없음)
대상: Claude Design / 디자인 담당자
관련 문서: `promo-admin-ui-separation-proposal-2026-07-10.md`(같은 폴더)
대상 파일(참고용, 실제 구현은 코덱스): `prototype/index.html`, `prototype/app.js`

## 배경

현재 "프로모션 빌더" 화면(`currentView === 'builder'`)은 A(디자인 MD 관리) · B(프로모션 빌더) · C(생성된 UI 결과)를 3개 컬럼으로 동시에 노출한다. 반면 B 섹션 내부는 이미 B1(디자인 모드) → B2(컨텐츠 입력) → B3(디자인 생성) 모달 스텝퍼로 구성돼 있어, 화면 전체 구조와 B 내부 구조 사이에 일관성이 없다.

또한 사용자가 확인한 `ai-design-recommendation-workflow-proposal-2026-07-09.md`(v3)는 향후 방향을 Stage 0~7 순차 플로우(브리프 → AI 추천 → 검증 → 선택 → 컨텐츠 입력 → 생성 → 확인)로 정의하고 있어, 팀이 그리는 미래 구조 자체가 이미 위저드형이다. README의 "담당자는 디자인 지식 없이 설명만 하면 된다"는 원칙도 3컬럼 대시보드보다 단계별 안내에 더 부합한다.

## 요청 사항

"새 프로모션 만들기" 플로우를 A→B 통합 3단계 위저드로 재구성하고, C(생성된 UI 결과 목록)는 위저드에서 분리해 별도 상단 탭("생성 이력")으로 옮기는 디자인을 요청한다.

```text
기존: [A. 디자인 MD | B. 빌더(내부 위저드) | C. 결과 목록]  — 3컬럼 동시 노출
제안: 프로모션 빌더 탭 = Step 1 → Step 2 → Step 3 위저드
      생성 이력 탭 = 기존 C 섹션 전체 이동
      관리자 페이지 탭 = 변경 없음
```

## 스텝별 상세 스펙

### Step 1. 디자인 스타일 선택 (기존 Section A 내용을 위저드 1단계로)

- 목적: 74개 디자인 MD 중 이번 프로모션에 쓸 스타일 1개 선택
- 포함 요소: 브랜드/태그 검색 입력, 스타일 카드 그리드(브랜드명, 슬러그, 컬러 스와치 최대 4개, 인기도 라벨, 태그 최대 3개), 선택 시 카드 하이라이트, "+ 디자인 추가" 액션
- 선택 후에는 선택된 디자인 토큰 요약(색상/타이포 등, 기존 `design-token-panel`)을 같은 스텝 하단이나 다음 스텝 사이드에 계속 보여줄지 결정 필요 — 완전히 다음 스텝으로 넘어가면 톤 참고가 어려울 수 있음(디자인 판단 필요 지점으로 표시)
- 참고: 현재 `index.html` 48~175행, `designDocuments` / `selectedDocument` 데이터

### Step 2. 프로모션 컨텐츠 입력 (기존 Section B1+B2)

- 목적: 프로모션 실제 내용과 섹션 구성 입력
- 포함 요소: 디자인 모드(AI/고급) 라디오, 마켓/지역 선택, 프로모션 개요(제목/목적/대상고객/캠페인톤), 섹션별 사용 여부 토글 + 아이템별 텍스트 입력 + AI 이미지 생성 여부, "자동등록"/"섹션 기본값"/"초기화" 액션
- 반복 섹션(Step Bar 등 repeatable set) 추가/삭제 UI 유지
- 참고: 현재 `index.html` 208~467행

### Step 3. 생성 및 결과 확인 (기존 Section B3 + 해당 run의 LO-FI/Final 비교)

- 목적: 디자인 생성 실행 후 LO-FI 초안 확인 → 확정 → 최종 디자인 생성/검수까지 한 화면에서 진행
- 포함 요소: 생성 콘솔(로딩 상태 표시), LO-FI 초안 갤러리(여러 draft 비교), 초안 확정 액션, 확정된 초안과 Final 디자인 나란히 비교, 다른 초안 재선택 시 새 Final 생성 옵션
- `lofi-final-design-variant-review-2026-07-09.md`에 정리된 결정사항을 그대로 반영: 초안 갤러리는 모달/상세뷰 형태 권장, 초안 변경은 명시적 "생성" 버튼으로만 실행(자동 확정 금지), stale 상태의 다른 초안이 신규 생성을 막지 않음
- 참고: 현재 `index.html` 469~504행, `promo_generation_lofi_drafts` / `promo_generation_final_designs` 데이터 모델

## 결과 목록 → "생성 이력" 탭으로 분리

- 상단 네비게이션 구성(안): `프로모션 빌더 | 생성 이력 | 관리자 페이지`
- "생성 이력" 탭 = 기존 Section C 테이블(No, 미리보기, 프로모션, 선택 MD, 스타일 기준, 상태, 동작) 그대로 이동
- 목록 행 클릭 시 해당 run의 위저드 Step 3(LO-FI/Final 비교) 화면으로 바로 진입하는 딥링크 형태 권장

## 스텝퍼 UI 요구사항

- 상단에 진행 표시(1/2/3), 이전/다음 이동 버튼
- 완료된 스텝은 클릭으로 재방문 가능 — 기존 B1~B3 스텝퍼(`builder-stepper`, `goBuilderStep()`)와 동일한 상호작용 패턴 재사용
- 스텝 전환 시 입력값이 손실되지 않아야 함(기존 Vue 데이터 모델 유지 전제)

## 톤 / 비주얼 방향

- 기존 컴포넌트 스타일(`styles.css`의 `subsection`, `tiny-button`, `field`, `radio-card` 등) 최대한 재사용 — 완전히 새로운 디자인 시스템 도입은 이번 요청 범위 밖
- 다크/라이트 테마 토글(`themeMode`) 기존대로 유지
- 참고 시안: 대화 중 공유한 인터랙티브 목업 2건 — (1) A/B/C 동시 노출 vs 관리자 페이지 탭 비교, (2) 현재 3컬럼 구조 vs 3단계 위저드 비교. 이미지가 필요하면 별도로 캡처해 첨부 요청.

## 기대 산출물

- 각 스텝 와이어프레임(레이아웃 확인 수준)
- 스텝퍼 컴포넌트 상태별 스펙(진행 전 / 진행 중 / 완료)
- "생성 이력" 탭 목록 화면 와이어프레임
- (선택) Step 1에서 선택한 디자인 토큰 요약을 Step 2~3에서 어떻게 계속 노출할지에 대한 안

## 상태

요청 단계. 디자인 확정 후 실제 구현은 코덱스가 진행.
