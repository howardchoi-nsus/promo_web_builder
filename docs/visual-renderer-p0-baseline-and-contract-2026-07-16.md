# Visual Renderer P0 기준선 및 기술 계약

- 작성일: 2026-07-16
- 상태: P0 완료, P1 착수 기준
- 관련 계획: `visual-template-editor-development-plan-2026-07-16.md`
- 소스 구현: P1부터 진행

서비스 구분:

- **기존 Promo Wizard**: 현재 구현된 `prototype/promo-wizard.html/js/css` 4단계 서비스. P1에서 수정하지 않는다.
- **Visual Editor**: 신규 독립 페이지. 콘텐츠 편집 Preview와 디자인 Variant를 제공한다.
- **Web Output**: Visual Editor가 확정한 Snapshot을 동일 Renderer로 출력하는 별도 결과 화면이다.

## 1. P0 결론

현재 저장소에는 Vue/Vite build pipeline이 없다.

- Wizard: `prototype/promo-wizard.html`, `promo-wizard.js`, `promo-wizard.css`
- Admin/Builder: CDN Vue 기반 `prototype/app.js`
- Generated Page: Local Storage 기반 프로토타입
- `package.json`: Vue, Vite 및 build script 없음

따라서 P1에서는 기존 Wizard를 Vue로 전환하거나 내부에 Preview를 삽입하지 않는다. **Visual Editor 전용 페이지와 Renderer용 Vue 3 + Vite bundle**을 별도로 추가한다. Visual Editor Preview와 Web Output route는 같은 Renderer entry와 build artifact를 사용한다.

## 2. 기준 상태

기준 커밋:

```text
e35ca3f 제안서
```

P0 실행 시 문서 작업 파일이 존재하므로 저장소 전체가 clean 상태는 아니다. 애플리케이션 기준 소스의 변경 여부와 문서 변경을 구분해서 관리한다.

2026-07-16 실행 결과:

| 검사 | 결과 |
|---|---|
| `prototype/app.js` syntax | PASS |
| `prototype/generated.js` syntax | PASS |
| `prototype/promo-wizard.js` syntax | PASS |
| Wizard content sections contract | PASS |
| Wizard form templates contract | PASS |
| Wizard public form template contract | PASS |
| Wizard section audit log contract | PASS |
| Integrated Brief completion contract | PASS |
| LO-FI worker contract | PASS |
| Final worker contract | PASS |

로컬 셸에는 일반 `npm` PATH가 없어서 Codex bundled Node 실행 파일로 테스트했다. 테스트 자체의 실패는 없었다.

## 3. 기준 Form Template 선정 규칙

P1 기준 템플릿은 DB UUID나 특정 환경의 ID로 하드코딩하지 않는다.

선정 순서:

1. `GET /api/wizard-form-templates-public`에서 `isDefault=true`인 active 템플릿
2. 기본 템플릿이 없으면 active 목록 첫 번째가 아니라 **설정 오류로 차단**
3. 선택된 템플릿 상세는 `GET /api/wizard-form-template-public?id=...`로 조회
4. 응답의 `configRevision`, Section/Item 정의를 Snapshot에 포함

P1 기술 검증에서는 위 규칙으로 얻은 Default Form Template 하나만 완전 지원한다. 다른 템플릿은 Generic Renderer 호환성 확인 대상으로 포함하되 전용 디자인을 만들지 않는다.

## 4. Renderer 적용 범위

### P1 포함

- Visual Editor에서 사용할 Wizard-visible Section 전량
- Text Item
- Multi-line Text Item
- Image Item
- Image + Description Item
- CTA Item
- Generic Section/Item fallback
- 사용자 Section/Item 순서
- `isLocked`, `isRequired`, `userReorderAllowed`, `fixedPosition`
- Desktop 및 Mobile Preview
- Preview와 Web Output 동등성

### P1 제외

- Renderer Registry DB와 관리자 CRUD
- LLM Design Spec 생성
- n8n 신규 Workflow
- AI Section Asset 생성
- 실제 파일 업로드 저장소
- LLM Vue 코드 생성
- Sandbox Build
- 기존 LO-FI/Final Worker 변경

## 5. Renderer Props 계약

Renderer public entry는 다음 세 Props만 받는다.

```ts
export type PromoRendererProps = {
  content: PromoContentSnapshot;
  designSpec: PageDesignSpec;
  assets: AssetManifest;
};
```

### 5.1 Content

```ts
export type PromoContentSnapshot = {
  contractVersion: 1;
  formTemplate: {
    id: string;
    templateKey: string;
    name: string;
    version: number;
    configRevision: string;
  };
  sectionSnapshot: RendererSectionDefinition[];
  sectionInputs: Record<string, Record<string, unknown>>;
  sectionOrder: string[];
};
```

규칙:

- `sectionInputs`가 콘텐츠 원문의 Source of Truth다.
- Renderer는 콘텐츠 문구를 요약하거나 다시 생성하지 않는다.
- `sectionSnapshot`에 존재하고 Wizard-visible인 Item은 출력 또는 명시적 hidden 결과에 매핑돼야 한다.
- 알 수 없는 Section Key를 이유로 전체 렌더링에 실패하지 않는다.
- CTA URL과 UTM은 기존 Wizard가 확정한 값을 그대로 사용한다.

### 5.2 Design Spec

P1에서는 LLM 없이 코드에 고정된 기본 Spec을 사용한다.

```ts
export type PageDesignSpec = {
  contractVersion: 1;
  specKey: "default";
  theme: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
  };
  responsive: {
    contentMaxWidth: number;
    mobileBreakpoint: number;
  };
};
```

P1에서는 임의 CSS, HTML, JavaScript, 외부 import를 허용하지 않는다.

### 5.3 Assets

```ts
export type AssetManifest = {
  contractVersion: 1;
  items: Record<string, {
    sectionKey: string;
    itemKey: string;
    sourceType: "url" | "file" | "ai" | "placeholder";
    url: string;
    alt: string;
  }>;
};
```

P1에서는 기존 URL 값과 placeholder만 사용한다. File/AI는 계약 값은 보존하되 실제 업로드·생성 기능을 구현하지 않는다.

## 6. Generic Renderer 계약

렌더링 우선순위:

```text
등록된 전용 Section Component
  -> Item kind별 공통 Component
  -> Generic Section/Item fallback
  -> Unsupported 경고
```

필수 Generic Component:

- `GenericSection`
- `GenericTextItem`
- `GenericImageItem`
- `GenericImageDescriptionItem`
- `GenericCtaItem`

Unsupported Item은 페이지 전체를 중단하지 않고 개발 경고를 남긴다. 필수 Item이 Unsupported이면 coverage 검증은 실패해야 한다.

## 7. Renderer bundle 경계

권장 구조:

```text
renderer/
  src/
    entry.js
    PromoPageRenderer.vue
    components/
    contracts/
    styles/
  vite.config.js
```

통합 방식:

```text
Visual Editor host
  -> renderer bundle mount
  -> props update

Web Output host
  -> same renderer bundle mount
  -> same snapshot props
```

규칙:

- Preview 전용 Renderer 복제본을 만들지 않는다.
- Web Output 전용 데이터 adapter를 만들지 않는다.
- host UI의 선택 테두리와 편집 장식은 Renderer root 바깥에서 처리한다.
- Renderer bundle은 기존 Wizard 전역 상태나 Visual Editor store를 직접 읽지 않고 Props만 사용한다.
- Renderer는 Local Storage, n8n, DB API를 직접 호출하지 않는다.

## 8. Preview/Output Snapshot 계약

```ts
export type RendererExecutionSnapshot = {
  snapshotVersion: 1;
  renderer: {
    key: "default-promo-renderer";
    version: 1;
    buildId: string;
  };
  content: PromoContentSnapshot;
  designSpec: PageDesignSpec;
  assets: AssetManifest;
  createdAt: string;
};
```

동등성 검증 시 Preview와 Web Output에 같은 Snapshot 객체를 공급한다. `createdAt`처럼 표시 결과에 영향을 주지 않는 metadata는 비교에서 제외할 수 있다.

## 9. 동등성 완료 기준

P1 완료를 위해 다음을 모두 확인한다.

1. Renderer ID/Version/buildId가 같다.
2. Content, Design Spec, Asset Snapshot hash가 같다.
3. Renderer root의 Section/Item DOM mapping이 같다.
4. 필수 Item coverage가 100%다.
5. 숨김 Item은 양쪽 모두 출력하지 않는다.
6. Desktop과 Mobile에서 텍스트 overflow와 요소 겹침이 없다.
7. CTA label과 최종 URL/UTM이 같다.
8. host 편집 장식을 제외한 Renderer root 스크린숏이 허용 오차 내에서 일치한다.

## 10. P1 구현 순서

1. Renderer 전용 Vite/Vue 개발 의존성과 build script 추가
2. 계약 타입 또는 JSDoc과 기본 Snapshot fixture 작성
3. Generic Item Component 구현
4. Default `PromoPageRenderer` 구현
5. 독립 Renderer 개발 Preview 구성
6. 독립 Visual Editor host에 bundle mount
7. 입력 변경을 Props update로 전달
8. 별도 Web Output host에 같은 bundle mount
9. coverage 및 동등성 테스트
10. 기존 Promo Wizard/n8n 회귀 테스트와 Visual Editor 브라우저 검수

## 11. P1 착수 차단 조건

다음 조건이 생기면 임의 구현하지 않고 먼저 계약을 갱신한다.

- 공개 API에 active Default Form Template이 없음
- 현재 Item kind를 기존 API 응답만으로 구분할 수 없음
- URL과 File/AI 이미지 값의 데이터 구조가 동일 Item에서 충돌
- Visual Editor host와 Web Output host에 같은 bundle을 제공할 배포 경로가 없음
- Renderer build 도입이 기존 Vercel routing과 충돌

## 12. P0 완료 판정

- 기존 기준 테스트: 완료
- 기준 Form Template 선정 규칙: 완료
- Renderer 적용 범위: 완료
- Renderer Props 계약: 완료
- Preview/Output Snapshot 계약: 완료
- 동등성 검증 기준: 완료
- P1 구현 순서와 차단 조건: 완료

P0는 문서와 기술 계약을 고정하는 단계로 완료한다. 실제 Vue/Vite bundle과 사용자 화면 변경은 P1 개발 반영 범위다.
