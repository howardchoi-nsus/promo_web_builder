# 동적 PageSchema 기반 페이지 생성 솔루션

작성 기준: 현재 저장소의 Registry V3 구성, 재귀 RenderSpec, 중앙 토큰 사용 정책 구현.
상태: **구현 완료, 운영 활성화 전**. 실제 구현 및 활성화 조건은 [implementation.md](implementation.md)를 기준으로 합니다. 아래 후속 단계와 제안 경로는 초기 설계 기록이며 실제 파일 경로와 다를 수 있습니다.

## 1. 목표와 범위

AI가 사용자 목적과 확정 콘텐츠에 따라 섹션 개수·순서·중첩, 요소 종류·조합, 컬럼 비율, 화면 크기별 배치를 설계합니다. 시스템은 완성된 섹션이나 프리셋을 선택하도록 강제하지 않습니다. AI가 반환한 문서는 범용 요소와 검증된 속성만으로 구성된 PageSchema입니다.

허용 UI 요소는 container, grid, stack, text, image, button, card, input, divider, icon, video의 11종입니다. 내부적으로 native DOM을 만드는 것은 renderer의 책임입니다. AI는 HTML, CSS 문자열, Vue 코드, 이벤트 핸들러, 임의 DOM 태그를 반환하지 않습니다.

자유도와 구속 조건:

| 구분 | AI의 권한 | 시스템이 강제하는 조건 |
|---|---|---|
| 구조 | 섹션 수·트리·구성·순서 | 필수/잠금 콘텐츠, 예산, 최대 깊이, 구조 유효성 |
| 배치 | 컬럼 수·양의 fr 비율·정렬·유동 너비 | 허용 숫자 범위, 부모 grid와 span의 일치, 정상 흐름 |
| 스타일 | 승인된 정책 역할 선택 | 활성 중앙 정책 → 등록 토큰 → 유효한 값만 사용 |
| 콘텐츠 | 사실을 추가하지 않는 제목·전환 문구 | 금액·기간·자격·법적 문구는 고정 source 참조 |
| 미디어 | 승인 에셋 선택·이미지 생성 의도 요청 | 소유권·종류·MIME·출처·생성 한도 |
| 동작 | 승인 액션 선택 | URL·폼 처리·실행 코드는 시스템이 소유 |

외부 디자인 참고 자료는 구도·밀도·리듬의 참고 정보입니다. 레이아웃 템플릿 ID를 필수로 만들지 않으며, 원본 브랜드·문구·에셋의 복제를 허용하지 않습니다.

## 2. 현재 구조에서 바뀌는 부분

현재 `api/_promo-registry-composition-contract.js`는 Section version, layoutKey, component instance ID를 선택하는 계약입니다. 이것만 풀어서는 자유로운 섹션 중첩과 트리를 표현할 수 없습니다.

- 새로운 PageSchema 문서 타입과 생성 경로를 추가합니다.
- 현재 RenderSpec의 재귀 처리·안전 속성·반응형 해석·토큰 검증 경험은 재사용합니다.
- 기존 RenderSpec을 이름만 바꿔 그대로 사용하지 않습니다. 그 계약은 컴포넌트 단위이며 HTML tag/field 구조와 제한이 다릅니다.
- 기존 V2/V3 문서는 기존 렌더러로 읽습니다. 기존 결과를 자동 변환하거나 새 모델로 덮어쓰지 않습니다.
- 신규 경로에서 등록 섹션·컴포넌트 인스턴스·layoutKey는 필수 입력이 아닙니다.
- 기존 등록 컴포넌트는 필요하면 참고 예제로 정규화할 수 있으나 사용을 강제하지 않습니다. 초기 버전에서는 실행 가능한 사용자 정의 컴포넌트로 주입하지 않습니다.

## 3. 계약과 버전의 구분

| 계층 | 식별자 | 의미 |
|---|---|---|
| AI 출력 | `schemaVersion: page-schema-v1` | 재귀 PageSchema 문법 |
| 생성 계약 | `layoutContract: section-layout-v1` | 유효한 페이지/섹션 트리를 설계하는 실행 계약 |
| 저장 문서 | 구현: `contractVersion: 3`, `snapshotType: page-schema` | 기존 2/3 문서와의 구분 |
| 렌더러 | `page-schema-renderer@1` | 이 문서를 해석하는 구현 |
| 토큰 | tokenSetVersionId | 생성 시 사용한 등록 값의 스냅샷 |
| 사용 정책 | usagePolicy ID/version/schemaVersion | 대상·속성·상태의 허용 연결 |
| 서비스 API | 기존 Service Contract V3 | 서비스 도메인 계약. PageSchema v1 및 렌더러 버전과 별개 |

`section-layout-v1`은 단순 설명용 key가 되어서는 안 됩니다. 서버 계약 레지스트리에서 key/version을 실제 schema factory, semantic validator, responsive normalizer, renderer key에 연결합니다. 지원하지 않는 계약이면 409로 거부합니다. DB의 안전 계약 metadata에 key만 넣는 것으로 구현 완료라고 보지 않습니다.

AI가 policy/token/renderer/document version을 임의로 정하지 않습니다. 서버가 요청 당시의 승인된 버전을 저장 envelope에 부착합니다.

## 4. PageSchema 구성

공식 구조 제안은 `page-schema.schema.json`에 있습니다. Draft 2020-12의 구조 검증용 원본이며, 실제 모델에는 공급사가 지원하는 structured-output subset으로 생성한 스키마를 전달해야 합니다.

### 출력 최상위

- schemaVersion, layoutContract: 고정 계약 식별자
- root: container, role=page (실제 DOM은 한 개의 main)
- mediaRequests: 이미지 생성 요청 목록
- summary: 실제 설계 요약
- warnings: 해결되지 않은 콘텐츠/리소스 제한

### 공통 노드

- id: 문서 안에서 유일하고 편집 중 안정적으로 유지되는 ID
- type: 11개 허용 요소 중 하나
- layout: desktop 필수, tablet/mobile nullable override
- styles: 정책 역할 키 배열(base/tablet/mobile)
- sourceIds: 허용된 콘텐츠 출처 ID
- 종류별 속성, 필요한 노드에만 children

컨테이너·grid·stack·card에만 children이 있습니다. leaf에 children을 추가하거나 임의 props/style/className을 전달할 수 없습니다.

### 스타일은 값이나 토큰명을 직접 생성하지 않음

예: `styles.base = ["text.primary", "text.titleSize", "text.font"]`.

시스템은 이를 **고정된 중앙 정책 → 등록 토큰 → CSS 속성** 순서로 해석합니다. `text.primary`는 새로운 디자인 토큰이 아니라 기존 중앙 정책의 사용 역할입니다. 정책의 token binding은 관리자 소유이며 AI가 고칠 수 없습니다.

노드별 허용 대상:

| 노드 | 사용 가능한 정책 대상 |
|---|---|
| page/section container | page, layout |
| group container, grid, stack | layout |
| card | card, layout |
| text | text |
| button | button, 구조 배치를 위한 layout |
| image, divider, input, icon, video | 해당 대상의 정책이 존재할 때만 장식 적용 |

동일 속성·동일 상태를 두 역할로 중복 지정하면 거부합니다. hover/pressed/disabled는 해당 정책 상태에만 적용합니다. 레이아웃 스타일 역할은 gap/padding 등 실제 허용 속성으로 제한합니다.

현재 중앙 정책에는 text/button/card/layout 중심의 항목이 있습니다. input/divider/icon/video/image의 추가 장식, 최대 너비나 상세 그리드 스타일이 필요하면 중앙 정책의 명시적 항목을 추가해야 합니다. 범용 렌더러에서 임의 값을 보충하지 않습니다. 미연결 필수 역할은 생성 차단, 선택 역할은 생략합니다.

### 사실 콘텐츠의 참조

text.contentMode:

- source: 정확히 한 sourceId와 빈 text를 반환. 렌더러가 고정된 원본 텍스트를 해석해 출력합니다.
- editorial: 사실을 추가하지 않는 제목·구분 문구 등 실제 text 사용. 필요한 근거 sourceIds를 함께 기록합니다.

가격·금액·비율·행사 기간·자격·법적 문구는 서버가 critical/locked source로 분류하고 source 모드로 출력합니다. 필수 source는 출력되는 leaf에서 누락되지 않아야 하며 중복 허용 여부도 source 정책을 따릅니다. AI가 sourceId만 붙이고 사실 문구를 고쳐 쓰는 것을 허용하지 않습니다.

source/asset/action ID는 JSONPath나 URL이 아니라 요청별 승인 registry의 ID입니다. 예시 context는 `example-context.json`에 있으며 실제 운영 데이터가 아닙니다.

## 5. 범용 요소별 구현 계약

| 요소 | 역할과 처리 |
|---|---|
| container | main/section/header/footer/nav/form/div 중 승인된 의미에 따라 시스템이 선택. nested main 금지 |
| grid | CSS Grid, 1~12개 양의 fr 비율. 절대 위치 없음 |
| stack | Flex, 방향/정렬/줄바꿈 등 허용 배치만 적용 |
| text | 의미상 heading/body/label/caption. 문자열은 텍스트로 escape하여 출력 |
| image | 승인된 assetId 또는 media request 연결. 장식이면 alt="", 비장식이면 설명 필수 |
| button | label과 승인 actionId. navigate면 a, action이면 button. 임의 handler 없음 |
| card | 의미상 article/div 컨테이너. 고정 padding/shadow/radius를 내장하지 않음 |
| input | label, 승인 fieldId와 form action 연결. 실제 고객 입력값은 생성 문서에 저장하지 않음 |
| divider | semantic separator. 방향 및 등록 스타일만 적용 |
| icon | 승인 iconId만 사용. 임의 SVG/HTML/path 문자열 금지 |
| video | 승인 에셋과 선택 poster/caption. controls=true, autoplay=false, loop=false |

버튼 actionId가 null이면 미리보기에서는 비활성 버튼과 진단을 표시하며, 필수 CTA라면 최종 출력은 막습니다. 입력 fieldId가 null이면 미리보기 전용 비활성 입력으로 표시합니다. video assetId가 null이면 실제 video 요청을 하지 않는 미등록 표시 영역으로 처리합니다. 필수 폼/미디어 미연결은 최종 출력 차단 항목입니다. 존재하지 않는 링크·폼 처리·동영상을 만들어 성공으로 표시하지 않습니다.

원본 콘텐츠 트리는 하나입니다. Desktop/Tablet/Mobile마다 다른 DOM 복사본을 생성하지 않습니다.

## 6. 반응형 정규화

처리 순서는 **원본 구조 검증 → 의미/정책 검사 → 반응형 정규화 → 재검증**입니다.

- desktop은 기준 배치. tablet/mobile의 null은 시스템의 명시적 규칙으로 보완합니다.
- 모바일 grid 미지정: 1열, 자식 columnSpan=1.
- 모바일 stack 미지정: 세로 방향. 읽기 순서는 자식 배열 순서를 보존합니다.
- tablet 미지정: 과도한 다열은 최대 2열로 줄이고, 자식 span을 유효 범위로 보완합니다. 간단한 배치는 desktop 상속.
- 유동 너비, min-width:0, 텍스트 줄바꿈, 미디어의 부모 너비 제한을 구조 기본값으로 적용합니다.
- 글자 크기·line-height·패딩·간격을 px/rem/clamp로 임의 생성하지 않습니다. 역할이 없으면 상속/생략합니다.
- 기본 breakpoints는 요청 context의 승인된 반응형 계약에서 읽습니다. AI가 새 breakpoint 값을 생성하지 않습니다.
- 반응형 이동 때문에 키보드/읽기 순서가 달라지는 CSS order 변경은 기본 계약에서 제공하지 않습니다. 논리적 트리 순서를 유지합니다.
- 각 보완은 nodeId, viewport, 변경 항목, 근거를 normalization diagnostics에 기록합니다.

명시된 모바일 다열도 최소 가독 너비/overflow 검사를 통과해야 합니다. 조건을 만족하지 못하면 보정 요청 또는 오류로 처리합니다.

## 7. 실행 경로

1. 고객 요청 → 기존 Overview Parser → 고객의 요청 요약 확인.
2. 서버가 확정 contentSources, 액션, 미디어, 아이콘, 입력 field, 중앙 정책, 예산을 고정.
3. PageSchema 전용 프롬프트와 동적으로 좁힌 JSON Schema로 LLM 직접 호출. n8n 사용 없음.
4. JSON 구조·전체 payload 예산 검사.
5. ID·출처·사실·정책·접근성·에셋·액션 의미 검사.
6. 제한적 repair(최대 1회) 또는 고객 확인 필요 항목 반환.
7. 반응형 정규화 및 재검증.
8. PageSchema 문서 리비전 저장, 미리보기 렌더링.
9. 필요 이미지 생성 후 asset ID를 서버 작업으로 연결, 재검증.
10. Desktop/Tablet/Mobile 실측 품질 검사.
11. 고객 확정 → 동일 문서/동일 렌더러로 웹 출력·내보내기.

작업 상태: accepted → planning → validating → repairing/normalizing → preview_ready → assets_pending/quality_checking → ready. 실패 시 failed와 구조화 진단을 반환합니다. 멱등 키·소유자·문서 리비전·생성 lease를 유지합니다.

## 8. 검증 계층

| 계층 | 검사 |
|---|---|
| 요청 | 인증, 문서 소유권, 리비전, 활성 프롬프트/모델, 활성 토큰 정책 |
| 구조 | 허용 요소/키/값, 모든 object의 additionalProperties=false, 순환 불가 |
| 예산 | 최대 200 nodes, 깊이 8, 자식 100, 이미지 요청 8, 입력 JSON/AI 출력 256 KiB 제안 |
| 식별자 | node/request ID 중복 금지, 참조 해석, nodeId ↔ 요청 대상 일치 |
| 토큰 | 역할 존재, 대상/속성/상태, 토큰 등록·참조 유효성, 버전 고정 |
| 콘텐츠 | critical source 직접 참조, 필수 정보 누락/금지된 반복 방지, 근거 없는 주장 차단 |
| 미디어 | asset 소유권·승인 상태·MIME·종류·승인 도메인. 서버의 임의 URL fetch 금지 |
| 동작 | 승인 actionId만 허용. javascript/data/protocol-relative URL과 미승인 외부 host 차단 |
| 접근성 | main 1개, h1 1개, 제목 단계, image alt, 버튼/입력 label, icon 장식 여부, spoken video 자막 |
| 폼 | field/action 소유권, 필드 타입·필수조건, 승인된 submit 처리, 미리보기에서 전송 금지 |
| 실측 | 320/390/768/1024/1280/1440 등 승인 viewport에서 overflow/겹침/잘림/CTA·고지 가독성 |

JSON Schema 검증만으로 콘텐츠 사실성이나 모든 접근성을 보장한다고 주장하지 않습니다. 실제 렌더링·고객 확인이 별도 필요합니다. 대비/키보드 테스트도 포함합니다.

정적 schema 파일의 ID/역할 정의는 문법 검사입니다. 실제 요청에서는 sourceId/assetId/actionId/iconId/formFieldId/policyRole을 해당 registry의 enum으로 좁힙니다. 빈 enum을 만들지 말고 해당 기능을 제거하거나 허용된 null 미연결 상태로 제한합니다. 모델 공급사의 structured-output 지원 범위도 별도 smoke test로 확인합니다.

## 9. 실패·대체·진단

- 검증 실패 시 최대 1회 repair. 잘못된 ID/속성/누락 정보만 구조화해 전달하고 사실을 만들어 채우지 못하게 합니다.
- 그래도 실패하면 기존 정상 리비전을 유지하고 nodeId/path/reasonCode/message를 표시합니다.
- 고정 템플릿으로 조용히 교체하지 않습니다. 선택적 기본 구조를 제공할 경우 ‘대체안’으로 명시하고 고객이 선택해야 합니다.
- 고객 확인 전 raw AI 결과를 DOM에 렌더링하지 않습니다. 스트리밍은 상태/진단만 표시하거나 검증 완료 subtree에 한정합니다.

권장 오류 코드: PAGE_SCHEMA_INVALID(422), PAGE_SCHEMA_LIMIT_EXCEEDED(422), TOKEN_USAGE_POLICY_MISMATCH(422), CONTENT_SOURCE_REQUIRED(422), ASSET_REFERENCE_INVALID(422), ACTION_REFERENCE_INVALID(422), ACCESSIBILITY_INVALID(422), PAGE_REPAIR_EXHAUSTED(422), DOCUMENT_REVISION_MISMATCH(409), UNSUPPORTED_LAYOUT_CONTRACT(409), QUALITY_GATE_REQUIRED(409).

응답에는 requestId와 진단을 포함합니다. `Request failed (500)`만 표시하지 않습니다. 실제 시스템 오류만 500으로 분류합니다.

## 10. 편집과 저장

초기 생성 이후에는 node ID를 대상으로 작은 작업을 적용합니다.

- insertNode(parentId, index, subtree)
- removeNode(nodeId)
- moveNode(nodeId, parentId, index)
- updateContent(nodeId, 승인된 콘텐츠 속성)
- updateLayout(nodeId, viewport, 허용된 배치 속성)
- bindPolicyRole(nodeId, viewport, roleKey)
- replaceAsset(nodeId, approvedAssetId)

작업마다 baseDocumentRevision을 필수로 하고, 자기 하위 노드로 이동/필수 source 삭제/lock 위반/미승인 style 주입을 금지합니다. 모든 변경은 전체 예산과 의미 검증을 다시 통과해야 합니다. 편집 시 영향을 받지 않은 node ID·콘텐츠·에셋은 유지하고, undo/rollback은 불변 리비전으로 제공합니다.

토큰/정책/프롬프트/모델/컨텍스트의 버전과 해시를 저장합니다. 실제 고객이 입력한 폼 값은 문서 리비전에 섞지 않습니다.

## 11. 프런트엔드와 출력

`PageSchemaRenderer → NodeRenderer → 검증된 primitive registry` 구조를 사용합니다. v-html, innerHTML, new Function, eval, 동적 코드 import는 사용하지 않습니다.

Preview, Visual Editor, Web Output, HTML export, Nuxt runtime이 같은 renderer package와 responsive normalization 결과를 사용해야 합니다. 현재 `CompositionPreviewCanvas.vue`는 desktop/mobile 중심이므로 tablet 선택과 검사 경로를 추가해야 합니다.

현재 `api/_promo-builder-export-adapters.js`는 문서 2/3과 기존 렌더러를 지원합니다. 새 문서 타입/renderer key를 명시적으로 지원하고, 미지원 버전은 오류로 처리합니다. 내보내기는 서버/시스템이 검증 문서를 HTML로 직렬화할 수 있으며, ‘AI가 HTML을 생성하지 않는다’는 조건과 충돌하지 않습니다. 임의 AI HTML을 출력에 삽입하지 않습니다.

## 12. 프롬프트와 LLM 구성

권장 신규 타입: `promo_page_schema_planner` (고객 화면상 3단계). 기존 `promo_page_composer`는 과거 문서/선택형 경로용으로 유지합니다.

필수 변수는 현재와 같은 overviewJson, candidateSnapshotJson, constraintsJson 3개를 사용할 수 있습니다. 다만 candidateSnapshotJson의 내용은 섹션 프리셋이 아니라 primitive catalog, 정책 역할, 승인 에셋/액션/콘텐츠 출처로 변경합니다. 프롬프트 타입을 분리해 기존 활성 본문과 새 입력 의미가 섞이지 않게 합니다.

`planner-prompt.txt`는 이 신규 타입에 사용할 검토용 본문입니다. 기존 선택형 프롬프트에 그대로 덮어쓰지 않습니다.

정확한 모델은 관리자에서 관리합니다. recursive structured output 지원, 복잡한 구성의 성공률, 사실 보존, 속도/비용을 실험해 선택하며 임의로 모델명을 고정하지 않습니다.

## 13. 구현 변경 목록 (제안 경로)

| 작업 | 제안 위치 |
|---|---|
| schema factory/타입/정규화 | packages/promo-contracts/src/page-schema/ |
| 공유 의미·정책 검사 | shared/page-schema/ |
| 승인 요청 context | api/_page-schema-context.js |
| 생성·검증·repair 실행 | api/_page-schema-generation-service.js |
| 제안/적용 API | api/promo-page-schema-proposals.js, api/promo-page-schema-apply.js |
| 프롬프트 계약 등록 | api/_prompt-template-store.js, prompt group catalog |
| renderer dispatch | visual-editor/src/runtime/ |
| primitive 렌더러 | visual-editor/src/platform/page-schema/ |
| 편집 adapter | visual-editor/src/platform/adapters/page-schema-adapter.mjs |
| builder 경로 | AiBuilderApp.vue, CompositionPreviewCanvas.vue |
| 저장/배포/내보내기 | builder document store, publication contracts, export adapters, Nuxt renderer |
| DB | 문서 계약 4/renderer metadata/제안 형식/노드 편집 이력에 필요한 migration |

현재 동기 CommonJS API에서는 정책의 생성된 `.cjs` 버전을 사용하고, 브라우저에서는 원본 `.mjs`를 사용합니다. 최근 확인한 require(ESM) cold-start 문제를 재도입하지 않습니다.

## 14. 적용 단계와 검수 기준

1. 계약: 11종, 허용 속성, 중앙 정책 역할, 에셋/액션 registry, 예산 확정.
2. 엔진: 스키마 생성/검증/정규화/primitive renderer 구현. 모든 요소를 fixture로 검사.
3. 생성: 전용 프롬프트·직접 LLM·repair·미리보기·이미지 연결 구현.
4. 편집·출력: node 작업, 이력/rollback, 동일 렌더러 출력, Nuxt/HTML parity 구현.
5. Preview 검증 후 `PAGE_SCHEMA_GENERATION_ENABLED` 같은 기본 false capability로 점진 적용. 기존 렌더러 제거 없음.

수락 기준:

- 같은 원시 요소로 다른 섹션 수/중첩/컬럼 구성을 표현하고 렌더링할 수 있음.
- 스키마 안에 sectionVersionId/layoutKey 같은 고정 템플릿 선택 필수가 없음.
- 금지 키, handler, 임의 HTML, 잘못된 URL/action/asset, 과다 깊이/노드를 거부.
- 동일 콘텐츠 source와 필수 법적 문구가 보존됨.
- 모바일 누락 시 1열/자연 높이/줄바꿈으로 보완하며 고정 시각 값을 만들지 않음.
- 정상/실패/repair/미디어 대기/버전 충돌/필수 누락 상태가 고객에게 명확히 표시됨.
- 11개 요소의 키보드·접근성·반응형과 공통 CSS 대체값 미사용을 검증.
- 최초 구조와 다른 부모로 node를 이동해도 ID/출처/에셋/정책을 보존.
- Preview·출력·다운로드·Nuxt가 같은 문서에서 같은 구조와 토큰을 사용.
- 기존 V2/V3 결과와 생성 기능이 회귀하지 않음.

## 15. 이 산출물에서 검증한 것과 남은 것

포함: 구조 JSON Schema, 서로 다른 12-node/15-node 예시, 예시용 content/action context, 신규 프롬프트 초안, `verify-examples.py`.

검증: Draft 2020-12 schema 문법, 두 예시의 구조·고유 ID·깊이·제목 계층·필수 출처·미디어 요청 연결, 금지 이벤트 키·미승인 정책 역할·중복 ID 거부.

미포함: 운영 API 연결, 실제 모델 structured-output 지원 검증, 반응형 정규화 구현, 11종 renderer 구현, 에셋/폼 처리, 실제 접근성/화면 품질 검증, DB/Production 적용. 예시 validator는 설계 검증 도구이며 운영 검증기를 대체하지 않습니다.

예시 검증 명령: `python docs/설계/dynamic-page-schema/verify-examples.py` (Python jsonschema 필요).

### 구현 착수 전 확인 사항

- 현재 운영 미리보기 500 오류의 배포 후 재현 여부를 확인하고 기본 생성 경로를 안정화합니다.
- 중앙 정책이 활성화되어 있고 일반 텍스트 기본 색상 등 필수 연결이 유효해야 합니다.
- 제목/보조 제목/본문/캡션 등 충분한 타이포그래피 역할이 필요한지 확인합니다. 현재 title/body 중심의 정책만으로 시각적 위계가 부족하면 역할을 확장하되 등록 토큰을 새로 추측하거나 생성하지 않습니다.
- 신규 경로의 스타일 기본값도 중앙 정책 역할만 사용합니다. text의 기본 색상·글꼴·본문/제목 크기를 비롯한 필수 역할이 누락되면 preflight에서 중단합니다. 정규화가 역할을 보완할 경우 그 내역을 기록합니다.
- 운영 배포 이전에 실제 LLM structured output과 모든 출력 채널의 렌더러 일치를 검증합니다.
