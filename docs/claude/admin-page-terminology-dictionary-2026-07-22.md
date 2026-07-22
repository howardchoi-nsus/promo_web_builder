# 관리자 페이지 용어 사전 (다국어 i18n 기준)

- 작성일: 2026-07-22
- 대상: `prototype/index.html` (관리자 / Promo Builder UI)
- 목적: 하드코딩된 라벨의 개념을 정규화하고, ISO 639-1 언어 코드 기준 메시지 키로 전환하기 위한 기준 사전
- 상태: 계획/사전 문서 (소스코드 미반영)
- 전제 결정
  - 사용자 노출 라벨은 메시지 키로 추출해 locale 파일로 관리한다.
  - 언어 구분은 **ISO 639-1**(2자리) 기준: `ko`, `en`. 지역 구분이 필요하면 **BCP 47**로 확장한다(`ko-KR`, `en-US`).
  - locale 파일: `locales/ko.json`, `locales/en.json` (기준 언어 `ko`).
  - 식별자(Key) 필드의 라벨 단어는 영문 **`Key`** 로 통일한다.

## 0. 요약

`index.html`에서 사용자 노출 라벨 257건을 추출한 결과, 같은 개념이 서로 다른 표기로 갈리는 사례가 다수 확인되었다. 가장 심각한 것은 **동일 문자열의 한글판·영문판이 동시에 존재**하는 경우다.

동시 존재 확인 사례:

| 개념 | 표기 A | 표기 B |
|---|---|---|
| 섹션 AI 허용 토글 | `이 섹션에서 AI 디자인 생성 허용` | `이 Section에서 AI 디자인 생성 허용` |
| 섹션 선택 안내 | `섹션을 선택해 주세요.` | `Section을 선택해 주세요.` |
| 필수 섹션 | `필수 섹션` | `필수 Section` |
| 텍스트 유형 | `텍스트 타입` | `텍스트 유형` |

이는 개념 통일 없이 키를 추출하면 그대로 중복 번역이 복제됨을 의미한다. 따라서 **정규 개념 확정 → 키 배정 → locale 값 작성** 순서를 따른다.

## 1. 정규화 원칙

1. **한 개념 = 한 메시지 키**. 표기가 여러 개면 정규 개념 하나로 합친다.
2. **엔티티 명칭은 언어별로 분리**한다. `ko`는 한글(섹션/아이템/템플릿), `en`은 영문(Section/Item/Template). 소스에 하드코딩된 영문 라벨(`Section 이름` 등)은 제거하고 키로 대체한다.
3. **식별자 라벨의 `Key` 단어는 언어 공통으로 영문 유지**. 단, 라벨 전체는 키로 관리한다(`entity.section.key` → ko: `섹션 Key`, en: `Section Key`).
4. **동의어는 대표어로 통일**한다: `타입`→`유형`, `편집`→`수정`.
5. 키 네이밍은 도메인 네임스페이스 계층 구조를 따른다(`common.*`, `entity.*`, `admin.*`, `builder.*`).

## 2. 키 네임스페이스 규칙

```
common.action.*     저장/취소/삭제 등 범용 동작
common.state.*      활성/보관/전체 등 범용 상태
common.field.*      이름/설명/유형 등 범용 필드 라벨
entity.section.*    섹션 도메인
entity.item.*       아이템 도메인
entity.template.*   템플릿 도메인
admin.prompt.*      프롬프트/LLM 관리
admin.design.*      디자인 MD/토큰/콘셉트
builder.*           프로모션 빌더(A/B/C 단계)
```

locale 파일 구조(예, `ko.json`):

```json
{
  "common": { "action": { "save": "저장", "cancel": "취소" } },
  "entity": { "section": { "name": "섹션 이름", "key": "섹션 Key" } }
}
```

## 3. 엔티티 용어 (표기 통일 대상)

| 메시지 키 | ko | en | 제거할 비표준 표기(소스 실재) |
|---|---|---|---|
| `entity.section.label` | 섹션 | Section | `Section`(한글 UI 내 영문 노출) |
| `entity.section.name` | 섹션 이름 | Section name | `Section 이름` |
| `entity.section.key` | 섹션 Key | Section Key | `섹션 Key (영문/숫자/_)`, `Section` 혼용 |
| `entity.section.background` | 섹션 배경 | Section background | `Section 배경` |
| `entity.section.add` | 섹션 추가 | Add section | `Section 생성`, `+ 섹션 추가` |
| `entity.section.required` | 필수 섹션 | Required section | `필수 Section` |
| `entity.section.selectPrompt` | 섹션을 선택해 주세요. | Select a section. | `Section을 선택해 주세요.` |
| `entity.section.aiAllow` | 이 섹션에서 AI 디자인 생성 허용 | Allow AI design in this section | `이 Section에서 AI 디자인 생성 허용` |
| `entity.section.changeLog` | 섹션 변경 로그 | Section change log | `Section 변경 로그`, `Section CRUD 로그`, `B Section Log` |
| `entity.item.label` | 아이템 | Item | `Item`(한글 UI 내 영문 노출) |
| `entity.item.name` | 아이템 이름 | Item name | `Item 이름` |
| `entity.item.key` | 아이템 Key | Item Key | (영문 접두어 혼용) |
| `entity.item.add` | 아이템 추가 | Add item | `Item 추가`, `+ Item 추가`, `+ 아이템 추가` |
| `entity.item.imageItem` | 이미지 아이템 | Image item | `이미지 Item` |
| `entity.item.emptyInSection` | 선택한 섹션에 등록된 아이템이 없습니다. | No items in the selected section. | `선택 Section에 등록된 Item이 없습니다.` |
| `entity.template.label` | 템플릿 | Template | `Template` |
| `entity.template.name` | 템플릿 이름 | Template name | `새 템플릿 이름` |
| `entity.template.key` | 템플릿 Key | Template Key | `새 Template Key`, `Template Key` |
| `entity.template.sectionConfig` | 템플릿 섹션 구성 | Template section config | `템플릿 Section 구성` |

> 핵심: `섹션`/`Section`, `아이템`/`Item`, `템플릿`/`Template`이 한 화면에 섞여 있음. `ko` 값은 한글, `en` 값은 영문으로 두고, 소스의 영문 하드코딩 라벨은 전부 키로 대체한다. `Key`는 두 언어 모두 영문 유지.

## 4. 개념 충돌 (동의어 → 대표어 통일)

| 메시지 키 | 대표 개념 | ko | en | 통합되는 표기 |
|---|---|---|---|---|
| `common.field.type` | 유형 | 유형 | Type | `타입`, `유형` |
| `common.field.textType` | 텍스트 유형 | 텍스트 유형 | Text type | `텍스트 타입`, `텍스트 유형` |
| `common.action.edit` | 수정 | 수정 | Edit | `수정`, `편집` |
| `common.action.editSave` | 수정 저장 | 수정 저장 | Save changes | `수정 저장` |
| `common.action.archive` | 보관 | 보관 | Archive | `보관`, `보관(삭제)` |
| `admin.design.concept` | 디자인 콘셉트 | 디자인 콘셉트 | Design concept | `디자인 콘셉트`, `디자인 스타일 콘셉트`, `디자인 스타일 이름` |
| `admin.design.conceptDetail` | 디자인 콘셉트 상세 | 디자인 콘셉트 상세 | Design concept detail | `디자인 콘셉트 상세` |
| `common.log.changeHistory` | 변경 이력 | 변경 이력 | Change history | `변경 이력`, `변경 로그`, `CRUD 로그` |

> `타입`/`유형`, `수정`/`편집`은 대표어(`유형`, `수정`)로 통일. `보관`과 `보관(삭제)`는 실제 동작이 soft-delete인지 확인 후 라벨을 하나로 확정 필요.

## 5. 공통 액션 (`common.action.*`)

| 메시지 키 | ko | en |
|---|---|---|
| `common.action.save` | 저장 | Save |
| `common.action.saveContinue` | 저장 후 계속 추가 | Save and add more |
| `common.action.cancel` | 취소 | Cancel |
| `common.action.close` | 닫기 | Close |
| `common.action.delete` | 삭제 | Delete |
| `common.action.duplicate` | 복제 | Duplicate |
| `common.action.edit` | 수정 | Edit |
| `common.action.refresh` | 새로고침 | Refresh |
| `common.action.reset` | 초기화 | Reset |
| `common.action.preview` | 미리보기 | Preview |
| `common.action.download` | 다운로드 | Download |
| `common.action.reorder` | 순서 변경 | Reorder |
| `common.action.prev` | 이전 | Previous |
| `common.action.next` | 다음 | Next |
| `common.action.open` | 열기 | Open |
| `common.action.viewSource` | 원문 보기 | View source |

## 6. 공통 상태 (`common.state.*`)

| 메시지 키 | ko | en |
|---|---|---|
| `common.state.active` | 활성 | Active |
| `common.state.archived` | 보관 | Archived |
| `common.state.draft` | 초안 | Draft |
| `common.state.all` | 전체 | All |
| `common.state.inUse` | 사용 | In use |
| `common.state.required` | 필수 | Required |
| `common.state.recommended` | 권장 | Recommended |
| `common.state.notRecommended` | 비권장 | Not recommended |
| `common.state.loading` | 불러오는 중 | Loading |
| `common.state.fixed` | 고정됨 | Fixed |

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
| `common.field.reason` | 변경 사유 | Reason |
| `common.field.changeType` | 변경 유형 | Change type |
| `common.field.before` | 변경 전 | Before |
| `common.field.after` | 변경 후 | After |

## 8. 도메인 용어 — 관리자/빌더

| 메시지 키 | ko | en |
|---|---|---|
| `admin.title` | 관리자 페이지 | Admin |
| `admin.prompt.manage` | LLM 및 프롬프트 관리 | LLM & prompt management |
| `admin.prompt.name` | 프롬프트 이름 | Prompt name |
| `admin.prompt.body` | 프롬프트 본문 | Prompt body |
| `admin.prompt.setActive` | 활성 프롬프트로 지정 | Set as active prompt |
| `admin.design.mdManage` | 디자인 MD 관리 | Design MD management |
| `admin.design.tokenFile` | 디자인 토큰 파일 | Design token file |
| `admin.design.policy` | AI 디자인 정책 | AI design policy |
| `admin.template.baseSetting` | 템플릿 기본 설정 | Template base settings |
| `admin.template.manage` | 템플릿·레이아웃 관리 | Template & layout management |
| `builder.title` | 프로모션 UI 디자인 빌더 | Promo UI design builder |
| `builder.step.designMode` | 디자인 모드 선택 | Select design mode |
| `builder.step.input` | 프로모션 입력 및 섹션 구성 | Promo input & section setup |
| `builder.step.generate` | 디자인 생성 | Generate design |
| `builder.mode.ai` | AI 모드 | AI mode |
| `builder.mode.advanced` | 고급 모드 | Advanced mode |

## 9. 열거형(옵션) 값 — 별도 키 그룹

프로모션 입력의 선택지도 동일 규칙으로 키화한다. 값 자체가 데이터로 저장되면 **저장 값(코드)과 표시 라벨(i18n)을 분리**해야 한다(예: 저장은 `welcome`, 표시는 `admin.purpose.welcome`).

| 그룹 | 메시지 키 예시 | ko |
|---|---|---|
| 프로모션 목적 | `builder.purpose.coupon` / `.welcome` / `.event` / `.etc` | 할인쿠폰 / 웰컴 / 이벤트 / 기타 |
| 대상 고객 | `builder.audience.new` / `.existing` / `.winback` | 신규 / 기존고객 / 윈백고객 |
| 캠페인 톤 | `builder.tone.lively` / `.careful` / `.lucky` / `.premium` / `.urgent` / `.friendly` | 활기찬 / 신중한 / 럭키 / 프리미엄 / 긴급한 / 친근한 |

## 10. 적용 시 주의사항

1. **저장 값과 표시 라벨 분리**: `유형`/`타입`처럼 라벨만 바꾸면 되는 경우와 달리, 드롭다운 선택 값이 DB/JSON에 저장되는 항목은 코드 값을 그대로 두고 표시만 i18n 처리한다. 라벨 통일이 저장 데이터 마이그레이션을 유발하지 않도록 확인 필요.
2. **동적 문자열**: `${group.versions.length}개`, `{{ ... }}개 섹션` 등은 보간(interpolation)/복수형(pluralization) 규칙이 필요하다. locale 값에 `{count}` 플레이스홀더를 둔다(예: `"sectionCount": "{count}개 섹션"`).
3. **`보관(삭제)` 의미 확정**: 실제 동작이 soft-delete인지 hard-delete인지 코드 확인 후 라벨 단일화.
4. **`Key` 라벨 정책**: 라벨 단어는 영문 `Key` 유지하되, 키 형식 안내(`영문/숫자/_`)는 별도 help 키(`entity.section.keyHint`)로 분리.

## 11. 다음 단계 제안

1. 이 사전을 기준으로 `locales/ko.json`, `locales/en.json` 초안 생성.
2. i18n 라이브러리 선정(Vue 앱이므로 `vue-i18n` 후보) 및 도입 실행계획(Phase) 작성.
3. `index.html`의 하드코딩 라벨을 키로 치환하는 마이그레이션 순서 정의(도메인 단위 커밋).
4. 영문 하드코딩 라벨(`Section 이름` 등) 제거 회귀 테스트.
