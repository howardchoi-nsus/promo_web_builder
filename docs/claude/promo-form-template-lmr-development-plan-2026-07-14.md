# Form Template L/M/R 관리자 및 Wizard 순서 제어 개발 계획

- 작성일: 2026-07-14
- 상태: 개발 전 확정 계획
- 대상: 관리자 `프로모션 폼 관리`, Promo Wizard 2단계

## 1. 목표

관리자가 여러 Form Template을 만들고, 각 템플릿 안에서 Section과 Section Item을 독립적으로 구성할 수 있게 한다. Wizard 사용자는 관리자가 허용한 Section과 Item만 순서를 변경할 수 있다.

관리자 화면은 다음 세 영역으로 고정한다.

| 영역 | 역할 |
| --- | --- |
| L | Form Template 목록과 템플릿 생성 |
| M | 선택한 템플릿의 Section 생성, 수정, 삭제, 순서 관리 |
| R | 선택한 Section의 Section Item 생성, 수정, 삭제, 순서 관리 |

## 2. 확정 요구사항

### 2.1 L 영역

- Form Template 목록을 표시한다.
- 템플릿의 이름, Key, 상태, 버전, 기본 템플릿 여부를 표시한다.
- `+ 템플릿 추가` 버튼은 L 목록 하단에 배치한다.
- 템플릿 생성, 복제, 초안 생성, 활성화, 보관을 지원한다.
- 템플릿을 선택하면 M과 R이 해당 템플릿 기준으로 즉시 변경된다.

### 2.2 M 영역

- 선택한 템플릿에 포함된 Section만 표시한다.
- `+ Section 추가`는 기존 공통 Section을 선택하는 방식이 아니라 새 Section을 생성하는 방식으로 동작한다.
- Section 생성 후 현재 템플릿에 즉시 연결한다.
- Section 생성, 수정, 삭제, 복제, 순서 변경을 지원한다.
- Section 순서는 숫자 입력이 아니라 드래그 앤 드롭으로 관리한다.
- 활성 템플릿은 읽기 전용이며 초안에서만 변경한다.

Section 생성 및 수정 항목:

- Section ID 또는 Key 자동 부여
- Section 이름
- 간략한 설명
- 필수 여부
- Wizard 노출 여부
- Wizard 사용자 순서 변경 허용 여부
- 구조적 고정 위치: 없음, 상단, 하단
- 변경 사유

### 2.3 R 영역

- M에서 선택한 Section의 Item 목록을 표시한다.
- `+ Item 추가`를 반복해서 사용할 수 있어야 한다.
- Item 저장 후 기존 Item 목록은 유지하고 입력 폼만 초기화한다.
- Item 생성, 수정, 삭제, 순서 변경을 지원한다.
- 여러 Item을 연속으로 추가할 수 있어야 한다.

Section Item 설정 항목:

- Item Key 자동 또는 관리자 입력
- Item 이름
- Wizard 노출 여부
- 필수 여부
- Wizard 사용자 순서 변경 허용 여부
- 텍스트: Title, Remark, Multi
- 이미지: 파일 첨부, URL 첨부, AI 생성
- 이미지 프롬프트, 대체 텍스트, 비율, 최대 크기
- CTA: 버튼 이름, URL, GA UTM
- 고정값 여부와 고정값

## 3. `고정` 의미 재정의

기존 구현은 `orderChangeAllowed`와 `fixedPosition`을 관리자 드래그 제한에 사용한다. 새 요구사항에서는 관리자의 편집 권한과 Wizard 사용자의 편집 권한을 분리한다.

| 설정 | 의미 |
| --- | --- |
| `sortOrder` | 관리자가 지정한 기본 출력 순서 |
| `userReorderAllowed` | Wizard 사용자가 순서를 변경할 수 있는지 여부 |
| `fixedPosition` | Header/Footer처럼 상단 또는 하단에 구조적으로 고정되는 위치 |

관리자는 초안 상태에서 모든 Section과 Item의 기본 순서를 변경할 수 있다. `userReorderAllowed=false`는 관리자 편집을 막지 않고 Wizard 사용자 재정렬만 차단한다.

Wizard 표시 문구는 `고정` 대신 다음처럼 명시한다.

- `Wizard 순서 변경 가능`
- `Wizard 순서 고정`
- `상단 고정`
- `하단 고정`

## 4. Wizard 재정렬 규칙

- Wizard 최초 화면은 관리자가 저장한 기본 순서를 사용한다.
- `userReorderAllowed=true`인 항목에만 드래그 핸들을 표시한다.
- 고정 항목은 순서 기준점으로 사용한다.
- 이동 가능한 항목은 고정 항목 사이의 구간 안에서만 이동할 수 있다.
- 상단 고정 Section은 항상 첫 구간에, 하단 고정 Section은 항상 마지막 구간에 둔다.
- Section Item에도 동일한 구간 규칙을 적용한다.
- 사용자가 변경한 Section 및 Item 순서를 프로모션 실행 스냅샷에 저장한다.
- Integrated Brief, Design Draft, Web Output은 저장된 사용자 순서를 사용한다.

## 5. 데이터 모델 변경안

### 5.1 현재 구조의 문제

현재 `wizard_form_template_sections`는 `sectionKey`로 공통 활성 Section을 참조한다. 이 구조에서는 한 Section의 활성 버전 변경이 여러 템플릿에 동시에 영향을 줄 수 있으며, 과거 템플릿 구성을 재현하기 어렵다.

### 5.2 권장 구조

`wizard_form_template_sections`가 논리 Key만 참조하지 않고 구체적인 Section 버전을 참조하도록 변경한다.

추가 또는 변경 필드:

```text
wizard_content_sections
- owner_template_key 또는 owner_template_id
- scope: template | global

wizard_form_template_sections
- section_id
- section_key
- sort_order
- is_required
- is_visible
- user_reorder_allowed
- fixed_position

wizard_content_section_items
- user_reorder_allowed
```

권장 기본 정책:

- M에서 만든 Section은 `scope=template`로 생성한다.
- 생성한 Section은 현재 Form Template만 소유한다.
- 다른 템플릿에서 사용하려면 Section을 복제한다.
- 공통 Section 재사용은 기본 흐름이 아닌 별도 고급 기능으로 둔다.
- Form Template 복제 시 Section과 Item도 새 소유 관계로 함께 복제한다.

## 6. 생성 및 저장 트랜잭션

다음 작업은 각각 DB 트랜잭션 또는 DB 함수로 원자적으로 처리한다.

1. Section 생성과 Form Template 연결
2. Section 복제와 Item 전체 복제
3. Form Template 복제와 Section/Item 전체 복제
4. Form Template 활성 버전 교체
5. Section 및 Item 순서 일괄 저장

중간 실패로 빈 Section, 연결되지 않은 Section, 일부 Item만 복제된 상태가 남지 않아야 한다.

## 7. 삭제 정책

화면 문구와 실제 동작을 구분한다.

- `Section 삭제`: 현재 템플릿 소유 Section과 하위 Item을 초안에서 삭제한다.
- `템플릿에서 제외`: 공통 Section 연결만 제거하는 고급 기능에서 사용한다.
- `Item 삭제`: 선택한 Section 초안에서 Item을 삭제한다.
- 활성 버전은 직접 삭제하지 않고 보관 또는 새 초안에서 변경한다.
- 다른 활성 템플릿이 참조하는 공통 Section은 삭제를 차단한다.

## 8. 검증 규칙

Form Template 활성화 전 다음을 검사한다.

- 노출 Section이 한 개 이상 존재하는가
- 필수 Section에 노출되는 필수 Item이 존재하는가
- Section 및 Item Key가 중복되지 않는가
- 모든 연결이 유효한 Section 버전을 참조하는가
- 이미지 Item에 허용 소스가 한 개 이상 있는가
- AI 이미지 Item에 프롬프트가 있는가
- 고정값 형식이 Item 유형과 일치하는가
- 상단 및 하단 고정 규칙이 충돌하지 않는가

## 9. 마이그레이션 계획

1. 신규 컬럼과 참조 구조를 추가한다.
2. 현재 `default` Form Template의 Section 연결을 구체적인 활성 `section_id`로 채운다.
3. 기존 `order_change_allowed` 값을 `user_reorder_allowed`로 이관한다.
4. Section Item의 `user_reorder_allowed` 기본값을 `true`로 생성한다.
5. Header/Footer는 각각 `fixedPosition=top/bottom`, `userReorderAllowed=false`로 이관한다.
6. 기존 API와 Wizard는 전환 기간에 구형 필드를 읽을 수 있도록 호환 계층을 둔다.
7. 데이터 검증 후 구형 관리자 순서 제한 의미를 제거한다.

## 10. 단계별 개발 계획

### Task 1. 데이터 모델 및 마이그레이션

- Section 구체 버전 참조 추가
- 템플릿 소유권 필드 추가
- Section/Item 사용자 순서 권한 필드 추가
- 기존 `default` 데이터 이관
- 롤백 SQL과 데이터 검증 쿼리 작성

완료 기준: 기존 default 템플릿이 동일한 Section과 Item을 유지한다.

### Task 2. API 재구성

- 템플릿 전용 Section 생성 API
- Section 수정, 삭제, 복제 API
- 다중 Item CRUD API
- Section/Item 순서 일괄 저장 API
- Form Template 전체 복제 API 보완
- 활성화 검증 API 보완

완료 기준: L/M/R의 모든 저장 동작을 독립 API로 수행할 수 있다.

### Task 3. 관리자 L/M/R UI

- L 하단 템플릿 추가 버튼
- M Section 생성 폼과 포함 Section 목록
- M 드래그 순서 변경
- R Item 목록과 반복 추가 폼
- R Item 수정, 삭제, 드래그 순서 변경
- 미저장 변경 경고와 저장 상태 표시

완료 기준: 한 화면에서 템플릿, Section, Item 전체 CRUD가 가능하다.

### Task 4. Wizard 2단계 연결

- 선택된 Form Template의 활성 버전 조회
- Section 및 Item 동적 렌더링
- 사용자 순서 변경 핸들 및 고정 구간 적용
- 입력값과 사용자 순서 자동 저장
- 템플릿 변경 시 공통 입력값 유지 및 재검증

완료 기준: 템플릿마다 서로 다른 입력 폼과 재정렬 권한이 적용된다.

### Task 5. 생성 파이프라인 반영

- Section/Item 사용자 순서를 실행 스냅샷에 저장
- Integrated Brief에 순서와 전체 콘텐츠 반영
- Design Draft와 Web Output에서 동일 순서 사용
- 과거 실행의 템플릿 버전 재현성 검증

완료 기준: Wizard에서 본 순서와 생성 결과의 콘텐츠 순서가 일치한다.

### Task 6. 통합 및 회귀 테스트

- `aaa`: Header/Footer 없는 템플릿
- `bbb`: 신규 Section과 다중 Item이 있는 템플릿
- 고정 Section 사이에서만 이동 가능한지 검증
- 고정 Item 사이에서만 이동 가능한지 검증
- 템플릿 복제 독립성 검증
- 기존 default Wizard 회귀 테스트

## 11. 현재 진행 상황과 이슈

현재 완료된 기반:

- Form Template 생성, 복제, 초안, 활성화, 보관 API
- 템플릿과 Section 연결 API
- 템플릿별 Section 설정 및 순서 API
- 관리자 Form Template 목록과 초기 3열 UI

현재 구현과 새 계획의 차이:

- 현재 M은 기존 공통 Section을 가져오지만, 새 계획은 M에서 템플릿 전용 Section을 생성한다.
- 현재 R은 Item 읽기 중심이며, 새 계획은 다중 Item CRUD를 제공한다.
- 현재 `orderChangeAllowed`는 관리자 드래그 제한에도 쓰이지만, 새 계획은 Wizard 사용자 권한으로만 사용한다.
- 현재 템플릿 연결은 `sectionKey` 중심이지만, 새 계획은 구체적인 Section 버전 참조가 필요하다.

주요 위험:

- 데이터 모델 변경 없이 UI만 수정하면 템플릿 간 Section 변경이 전파될 수 있다.
- 템플릿 활성화와 Section 활성화가 별도로 진행되면 불완전한 조합이 만들어질 수 있다.
- 사용자 순서를 실행 스냅샷에 저장하지 않으면 이후 관리자 수정으로 과거 결과를 재현할 수 없다.

## 12. 권장 우선순위

```text
P0 데이터 모델 및 마이그레이션
→ P0 API 트랜잭션과 검증
→ P1 관리자 L/M/R UI
→ P1 Wizard 사용자 재정렬
→ P2 생성 파이프라인 순서 반영
→ P2 통합 회귀 테스트
```

UI를 먼저 수정하지 않고 데이터 모델과 API 계약을 먼저 확정해야 재작업을 줄일 수 있다.
