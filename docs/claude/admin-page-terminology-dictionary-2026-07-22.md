# 관리자 페이지 용어 사전 (다국어 i18n 기준)

- 작성일: 2026-07-22
- 대상: 관리자 / Promo Builder UI의 `index.html`, `app.js`, 관리자 모듈, 공통 셸 및 사용자 노출 오류 문구
- 목적: 하드코딩된 라벨을 일반적인 한국어 서비스·업무 도구에서 이해하기 쉬운 표현으로 정규화하고, 다국어 메시지 키로 전환하기 위한 기준 사전
- 상태: 일반 사용자 중심 워딩 검토 반영 / 소스코드 미반영
- 전제 결정
  - 사용자 노출 라벨은 메시지 키로 추출해 locale 파일로 관리한다.
  - 언어 구분은 **ISO 639-1**(2자리) 기준: `ko`, `en`. 지역 구분이 필요하면 **BCP 47**로 확장한다(`ko-KR`, `en-US`).
  - locale 파일: `locales/ko.json`, `locales/en.json` (기준 언어 `ko`).
  - 사용자 화면에서는 `Key` 대신 **`식별자`**를 사용한다. 개발 문서나 도움말에는 필요한 경우 `Key`를 병기한다.

## 0. 요약

기준 소스에서 사용자 노출 라벨을 추출한 결과, 같은 개념이 서로 다른 표기로 갈리는 사례가 다수 확인되었다. 특히 **동일 개념의 한글·영문 표기가 한 화면에 동시에 존재**한다. 실제 마이그레이션 전에는 `index.html`뿐 아니라 `app.js`, 관리자 모듈, 공통 셸 및 사용자에게 노출되는 오류 문구까지 다시 추출하고 실행 로그에 건수를 기록한다.

동시 존재 확인 사례:

| 개념 | 표기 A | 표기 B |
|---|---|---|
| 섹션 AI 허용 토글 | `이 섹션에서 AI 디자인 생성 허용` | `이 Section에서 AI 디자인 생성 허용` |
| 섹션 선택 안내 | `섹션을 선택해 주세요.` | `Section을 선택해 주세요.` |
| 필수 섹션 | `필수 섹션` | `필수 Section` |
| 텍스트 유형 | `텍스트 타입` | `텍스트 유형` |

이는 개념 통일 없이 키를 추출하면 그대로 중복 번역이 복제됨을 의미한다. 따라서 **정규 개념 확정 → 키 배정 → locale 값 작성** 순서를 따른다.

## 1. 정규화 원칙

1. **한 개념 = 한 메시지 키**. 표기만 다른 동의어는 정규 개념 하나로 합친다.
2. **의미가 다른 단어는 합치지 않는다**. 데이터와 설정 변경은 `수정`, 문서·콘텐츠·레이아웃 작업은 `편집`으로 구분한다.
3. **엔티티 명칭은 언어별로 분리**한다. `ko`는 한글(섹션/항목/템플릿), `en`은 영문(Section/Item/Template)을 사용한다.
4. 사용자 화면의 식별자 필드는 `식별자`로 표기한다(`entity.section.key` → ko: `섹션 식별자`, en: `Section ID`). 형식 안내는 별도 도움말 키에서 `Key` 의미를 설명할 수 있다.
5. **내부 개발 용어보다 사용자의 행동과 결과를 표현**한다. `CRUD 로그`는 `작업 이력`, `LLM 관리`는 `AI 설정`, `MD 관리`는 `디자인 문서 관리`로 표현한다.
6. 동의어는 대표어로 통일한다. 예: `타입`→`유형`, `아이템`→`항목`.
7. 버튼은 짧은 동사형, 안내 문구는 간결한 존댓말을 사용한다.
8. 키 네이밍은 도메인 네임스페이스 계층 구조를 따른다(`common.*`, `entity.*`, `admin.*`, `builder.*`).

## 2. 키 네임스페이스 규칙

```
common.action.*     저장/취소/삭제 등 범용 동작
common.state.*      활성/보관/전체 등 범용 상태
common.field.*      이름/설명/유형 등 범용 필드 라벨
entity.section.*    섹션 도메인
entity.item.*       항목 도메인
entity.template.*   템플릿 도메인
admin.prompt.*      AI 설정/프롬프트 관리
admin.design.*      디자인 문서/설정/방향
builder.*           프로모션 빌더(A/B/C 단계)
```

locale 파일 구조(예, `ko.json`):

```json
{
  "common": { "action": { "save": "저장", "cancel": "취소" } },
  "entity": { "section": { "name": "섹션 이름", "key": "섹션 식별자" } }
}
```

## 3. 엔티티 용어 (표기 통일 대상)

| 메시지 키 | ko | en | 제거할 비표준 표기(소스 실재) |
|---|---|---|---|
| `entity.section.label` | 섹션 | Section | `Section`(한글 UI 내 영문 노출) |
| `entity.section.name` | 섹션 이름 | Section name | `Section 이름` |
| `entity.section.key` | 섹션 식별자 | Section ID | `섹션 Key (영문/숫자/_)`, `Section Key` |
| `entity.section.background` | 섹션 배경 | Section background | `Section 배경` |
| `entity.section.add` | 섹션 추가 | Add section | `Section 생성`, `+ 섹션 추가` |
| `entity.section.required` | 필수 섹션 | Required section | `필수 Section` |
| `entity.section.selectPrompt` | 섹션을 선택하세요. | Select a section. | `섹션을 선택해 주세요.`, `Section을 선택해 주세요.` |
| `entity.section.aiAllow` | AI 디자인 생성 허용 | Allow AI design generation | `이 Section에서 AI 디자인 생성 허용` |
| `entity.section.changeHistory` | 섹션 변경 이력 | Section change history | `Section 변경 로그`, `B Section Log` |
| `entity.section.activityHistory` | 섹션 작업 이력 | Section activity history | `Section CRUD 로그` |
| `entity.item.label` | 항목 | Item | `아이템`, `Item` |
| `entity.item.name` | 항목 이름 | Item name | `아이템 이름`, `Item 이름` |
| `entity.item.key` | 항목 식별자 | Item ID | `아이템 Key`, `Item Key` |
| `entity.item.add` | 항목 추가 | Add item | `Item 추가`, `+ Item 추가`, `+ 아이템 추가` |
| `entity.item.imageItem` | 이미지 항목 | Image item | `이미지 아이템`, `이미지 Item` |
| `entity.item.emptyInSection` | 선택한 섹션에 항목이 없습니다. | No items in the selected section. | `선택 Section에 등록된 Item이 없습니다.` |
| `entity.template.label` | 템플릿 | Template | `Template` |
| `entity.template.name` | 템플릿 이름 | Template name | `새 템플릿 이름` |
| `entity.template.key` | 템플릿 식별자 | Template ID | `새 Template Key`, `Template Key` |
| `entity.template.sectionConfig` | 템플릿 섹션 구성 | Template section config | `템플릿 Section 구성` |

> 핵심: 한국어 화면에서는 `섹션`, `항목`, `템플릿`, `식별자`를 사용한다. 영문 화면에서는 `Section`, `Item`, `Template`, `ID`를 사용하고 소스의 혼합 표기는 메시지 키로 대체한다.

## 4. 개념 충돌 (동의어 → 대표어 통일)

| 메시지 키 | 대표 개념 | ko | en | 통합되는 표기 |
|---|---|---|---|---|
| `common.field.type` | 유형 | 유형 | Type | `타입`, `유형` |
| `common.field.textType` | 텍스트 유형 | 텍스트 유형 | Text type | `텍스트 타입`, `텍스트 유형` |
| `common.action.update` | 정보·설정 변경 | 수정 | Update | 데이터와 설정의 `수정` |
| `common.action.edit` | 문서·콘텐츠 작업 | 편집 | Edit | 문서, 프롬프트, 콘텐츠, 레이아웃의 `편집` |
| `common.action.saveChanges` | 변경사항 저장 | 변경사항 저장 | Save changes | `수정 저장` |
| `common.action.archive` | 보관 | 보관 | Archive | `보관`, `보관(삭제)` |
| `admin.design.styleName` | 스타일 이름 | 스타일 이름 | Style name | `디자인 스타일 이름` |
| `admin.design.concept` | 디자인 방향 | 디자인 방향 | Design direction | `디자인 콘셉트`, `디자인 스타일 콘셉트` |
| `admin.design.conceptDetail` | 디자인 방향 상세 | 디자인 방향 상세 | Design direction details | `디자인 콘셉트 상세` |
| `common.log.changeHistory` | 데이터 변경 내역 | 변경 이력 | Change history | `변경 이력`, `변경 로그` |
| `common.log.activityHistory` | 생성·수정·보관 등 작업 기록 | 작업 이력 | Activity history | `CRUD 로그`, `Audit log` |

> `타입`은 `유형`, `아이템`은 `항목`으로 통일한다. `수정`과 `편집`, `변경 이력`과 `작업 이력`, `스타일 이름`과 `디자인 방향`은 의미가 다르므로 별도 키를 유지한다. 현재 보관 API는 soft-delete 방식이므로 `보관(삭제)` 대신 `보관`을 사용한다.

## 5. 공통 액션 (`common.action.*`)

| 메시지 키 | ko | en |
|---|---|---|
| `common.action.save` | 저장 | Save |
| `common.action.saveContinue` | 저장하고 계속 추가 | Save and add more |
| `common.action.cancel` | 취소 | Cancel |
| `common.action.close` | 닫기 | Close |
| `common.action.delete` | 삭제 | Delete |
| `common.action.duplicate` | 복사본 만들기 | Make a copy |
| `common.action.update` | 수정 | Update |
| `common.action.edit` | 편집 | Edit |
| `common.action.saveChanges` | 변경사항 저장 | Save changes |
| `common.action.refresh` | 새로고침 | Refresh |
| `common.action.reset` | 기본값으로 되돌리기 | Restore defaults |
| `common.action.preview` | 미리보기 | Preview |
| `common.action.download` | 다운로드 | Download |
| `common.action.reorder` | 순서 바꾸기 | Reorder |
| `common.action.prev` | 이전 | Previous |
| `common.action.next` | 다음 | Next |
| `common.action.open` | 열기 | Open |
| `common.action.viewSource` | 원본 보기 | View source |

## 6. 공통 상태 (`common.state.*`)

| 메시지 키 | ko | en |
|---|---|---|
| `common.state.active` | 활성 | Active |
| `common.state.archived` | 보관됨 | Archived |
| `common.state.draft` | 초안 | Draft |
| `common.state.all` | 전체 | All |
| `common.state.inUse` | 사용 중 | In use |
| `common.state.required` | 필수 | Required |
| `common.state.recommended` | 권장 | Recommended |
| `common.state.notRecommended` | 비권장 | Not recommended |
| `common.state.loading` | 불러오는 중 | Loading |
| `common.state.fixed` | 고정 | Fixed |

## 7. 공통 필드 (`common.field.*`)

| 메시지 키 | ko | en |
|---|---|---|
| `common.field.name` | 이름 | Name |
| `common.field.description` | 설명 | Description |
| `common.field.briefDescription` | 간략 설명 | Brief description |
| `common.field.type` | 유형 | Type |
| `common.field.status` | 상태 | Status |
| `common.field.order` | 순서 | Order |
| `common.field.slug` | 슬러그 | Slug |
| `common.field.changeReason` | 변경 사유 | Change reason |
| `common.field.changeType` | 변경 유형 | Change type |
| `common.field.before` | 변경 전 | Before |
| `common.field.after` | 변경 후 | After |

## 8. 도메인 용어 — 관리자/빌더

| 메시지 키 | ko | en |
|---|---|---|
| `admin.title` | 관리자 | Admin |
| `admin.prompt.manage` | AI 설정 및 프롬프트 관리 | AI settings & prompt management |
| `admin.prompt.name` | 프롬프트 이름 | Prompt name |
| `admin.prompt.body` | 프롬프트 본문 | Prompt body |
| `admin.prompt.setActive` | 활성 프롬프트로 지정 | Set as active prompt |
| `admin.design.documentManage` | 디자인 문서 관리 | Design document management |
| `admin.design.tokenFile` | 디자인 설정 파일 | Design settings file |
| `admin.design.policy` | AI 디자인 설정 | AI design settings |
| `admin.template.baseSetting` | 템플릿 기본 설정 | Template base settings |
| `admin.template.manage` | 템플릿 및 레이아웃 관리 | Template & layout management |
| `builder.title` | 프로모션 페이지 제작 | Promotion page builder |
| `builder.step.designMode` | 제작 방식 선택 | Select creation method |
| `builder.step.input` | 프로모션 정보 입력 | Enter promotion details |
| `builder.step.generate` | 디자인 생성 | Generate design |
| `builder.mode.ai` | AI로 만들기 | Create with AI |
| `builder.mode.advanced` | 직접 설정 | Custom settings |

## 9. 열거형(옵션) 값 — 별도 키 그룹

프로모션 입력의 선택지도 동일 규칙으로 키화한다. 값 자체가 데이터로 저장되면 **저장 값(코드)과 표시 라벨(i18n)을 분리**해야 한다(예: 저장은 `welcome`, 표시는 `builder.purpose.welcome`).

| 그룹 | 메시지 키 예시 | ko |
|---|---|---|
| 프로모션 목적 | `builder.purpose.coupon` / `.welcome` / `.event` / `.etc` | 할인쿠폰 / 웰컴 / 이벤트 / 기타 |
| 대상 고객 | `builder.audience.new` / `.existing` / `.winback` | 신규 / 기존고객 / 윈백고객 |
| 캠페인 톤 | `builder.tone.lively` / `.careful` / `.lucky` / `.premium` / `.urgent` / `.friendly` | 활기찬 / 신중한 / 럭키 / 프리미엄 / 긴급한 / 친근한 |

### 9.1 문구 작성 기준

- 버튼은 사용자의 행동을 표현한다: `수정 저장`→`변경사항 저장`, `복제`→`복사본 만들기`.
- 선택 안내는 간결하게 작성한다: `선택해 주세요.`→`선택하세요.`.
- 내부 처리 방식 대신 사용자가 이해할 수 있는 결과를 설명한다: `편집용 Section 준비 오류`→`편집할 섹션을 준비하지 못했습니다.`.
- 상태와 동작을 구분한다: 상태는 `활성`, 동작은 `활성화`; 상태는 `보관됨`, 동작은 `보관`.
- 삭제와 보관은 합치지 않는다. 삭제는 복구하기 어려운 제거, 보관은 목록에서 제외하되 데이터를 유지하는 동작이다.
- `초기화`는 실제 동작에 따라 `입력 내용 지우기` 또는 `기본값으로 되돌리기`로 구체화한다.
- 오류 문구는 원인보다 해결 가능한 다음 행동을 우선 안내한다.

## 10. 적용 시 주의사항

1. **저장 값과 표시 라벨 분리**: `유형`/`타입`처럼 라벨만 바꾸면 되는 경우와 달리, 드롭다운 선택 값이 DB/JSON에 저장되는 항목은 코드 값을 그대로 두고 표시만 i18n 처리한다. 라벨 통일이 저장 데이터 마이그레이션을 유발하지 않도록 확인 필요.
2. **동적 문자열**: `${group.versions.length}개`, `{{ ... }}개 섹션` 등은 보간(interpolation)/복수형(pluralization) 규칙이 필요하다. locale 값에 `{count}` 플레이스홀더를 둔다(예: `"sectionCount": "{count}개 섹션"`).
3. **보관과 삭제 분리**: 현재 섹션 보관은 soft-delete 방식이므로 화면에서는 `보관`으로 표시한다. 실제 영구 삭제 기능에만 `삭제`를 사용한다.
4. **식별자 라벨 정책**: 화면 라벨은 `식별자`를 사용하고, 키 형식 안내(`영문/숫자/_`)는 별도 help 키(`entity.section.keyHint`)로 분리한다.
5. **수정과 편집 분리**: 데이터·설정 변경은 `수정`, 문서·콘텐츠·레이아웃 작업은 `편집`으로 구분한다.
6. **사용자 노출 오류 처리**: API의 내부 오류 문자열을 그대로 표시하지 말고 안정적인 오류 코드와 locale 메시지를 연결한다.
7. **초기 언어 결정**: 사용자 저장값 → 브라우저 언어 → 기준 언어 `ko` 순서로 결정하고, 누락 키는 `ko`로 fallback한다.
8. **접근성**: 언어 변경 시 `<html lang>`을 함께 변경하고 아이콘 버튼에도 완전한 문장형 접근성 라벨을 제공한다.

## 11. 다음 단계 제안

1. `index.html`, `app.js`, `prototype/admin/*.js`, `shared-shell.js`와 사용자 노출 오류 문구를 다시 추출하고 기준 커밋과 건수를 실행 로그에 기록한다.
2. 이 사전을 기준으로 `locales/ko.json`, `locales/en.json` 초안을 생성한다.
3. 전역 Vue 앱의 현재 실행 구조를 고려해 i18n 라이브러리와 로컬 번들 방식을 선정하고, 초기 로딩·fallback·언어 저장 정책을 포함한 도입 계획을 작성한다.
4. 하드코딩 라벨을 도메인 단위로 메시지 키로 치환한다.
5. 영문 혼합 라벨(`Section 이름`, `Item Key` 등)과 내부 개발 용어(`CRUD`, `LLM`, `MD`)가 사용자 화면에 남지 않는지 회귀 테스트한다.
6. `수정/편집`, `변경 이력/작업 이력`, `보관/삭제`가 용도에 맞게 구분되는지 브라우저 테스트한다.
