# Wizard Step 2 템플릿 연동 개발계획서

- 작성일: 2026-07-15
- 상태: 개발 전 확정 계획
- 대상: Promo Wizard Step 2 Content
- 선행 조건: 관리자 폼 템플릿 P1 기능 완료

## 1. 목표

Wizard Step 2에서 관리자가 활성화한 폼 템플릿을 선택하고, 선택된 템플릿의 Section과 Item을 입력 폼으로 렌더링한다.

Step 2의 `프로모션 개요`는 모든 템플릿에 공통으로 유지하고, 기존 `Message JSON` 입력 UI는 제거한다. 실제 웹 출력 콘텐츠는 선택된 템플릿의 Section Item으로만 입력받는다.

## 2. 최종 화면 구조

### 2.1 프로모션 개요

템플릿과 무관한 생성 요청 메타데이터로 고정 유지한다.

- 프로모션 제목
- 프로모션 목적
- 기타 목적
- 마켓/지역
- 대상 고객
- 캠페인 톤

이 값은 Integrated Brief와 디자인 생성 방향에 사용하며, 웹페이지에 자동 노출하지 않는다.

### 2.2 템플릿 선택

- 관리자가 활성화한 템플릿만 표시한다.
- 기본 템플릿이 있으면 최초 진입 시 자동 선택한다.
- 선택 항목에는 템플릿 이름과 간략 설명을 표시한다.
- 템플릿 선택 후 해당 버전의 Section/Item 구성을 조회한다.
- 활성 템플릿이 없거나 조회에 실패하면 다음 단계 진행을 차단한다.

### 2.3 프로모션 콘텐츠

- 선택된 템플릿의 Wizard 노출 Section만 표시한다.
- Section 순서와 Item 순서는 관리자 설정을 따른다.
- 필수 여부, 고정값, 이미지 입력 방식, 설명 입력 허용 설정을 반영한다.
- 실제 웹 출력 제목, 설명, 이미지, CTA, 약관, Footer 등은 이 영역에서 입력받는다.

## 3. Message JSON 제거 범위

화면에서 다음 입력 항목을 제거한다.

- `mainOffer`
- `secondaryMessage`
- `targetAction`
- `leadText`
- `subline`

함께 수정할 항목:

- `simpleBrief` 필수 검증 제거
- Message JSON 자동 입력/파싱 기능 제거
- Coverage Checklist의 Message JSON 항목 제거
- Step 3 요약의 Message JSON 직접 참조 제거
- LO-FI payload의 `simpleBrief` 의존성 제거 또는 호환용 내부 변환으로 제한
- 기존 로컬 저장 데이터는 읽을 수 있으나 신규 요청의 소스로 사용하지 않도록 처리

## 4. 데이터 모델

Wizard 세션에 다음 정보를 저장한다.

```json
{
  "formTemplate": {
    "id": "uuid",
    "templateKey": "aaa",
    "name": "AAA Template",
    "version": 2,
    "configRevision": "revision"
  },
  "promoOverview": {},
  "sectionInputs": {},
  "sectionSnapshot": []
}
```

### 저장 원칙

- 입력값 경로는 `templateKey.sectionKey.itemKey` 조합으로 구분한다.
- 같은 템플릿을 다시 선택하면 이전 입력값을 복원한다.
- 다른 템플릿의 동일 Item Key와 값을 혼합하지 않는다.
- 생성 시작 시 Section/Item 정의를 `sectionSnapshot`으로 저장한다.
- 관리자 설정이 나중에 변경되어도 진행 중인 Run은 저장된 Snapshot을 사용한다.

## 5. 공개 API

관리자 API와 Wizard 공개 API를 분리한다.

### 5.1 템플릿 목록

`GET /api/wizard-form-templates-public`

반환 범위:

- Active 템플릿만 반환
- 템플릿 ID, Key, 이름, 설명, 버전, 기본 여부
- Draft, Archived 템플릿 제외

### 5.2 템플릿 상세

`GET /api/wizard-form-template-public?id={templateId}`

반환 범위:

- 선택된 Active 템플릿
- Wizard 노출 Section만 반환
- Wizard 노출 Item만 반환
- 정렬 순서, 필수 여부, 고정값 포함
- 이미지 허용 방식과 설명 입력 허용 포함
- 내부 관리자 메모와 Draft 정보 제외

### 5.3 Revision

템플릿 ID와 버전 외에 구성 Revision을 반환한다. 저장된 Revision과 서버 Revision이 다르면 생성 전에 사용자에게 새로고침 필요 상태를 표시한다.

## 6. 템플릿 전환 정책

- 입력 전 템플릿 전환은 즉시 허용한다.
- 입력값이 존재하면 전환 확인을 표시한다.
- 기존 입력은 템플릿별 임시 상태로 보관한다.
- 새 템플릿에 같은 Key가 있어도 값을 자동 복사하지 않는다.
- 고정값은 관리자 설정을 우선하며 사용자 수정이 불가능하다.

## 7. 동적 필드 렌더링

### 텍스트

- `title`: 한 줄 입력
- `remark`: 한 줄 또는 짧은 참고 입력
- `multi`: 여러 줄 입력

### 이미지

- 관리자가 허용한 방식만 선택지로 표시한다.
- URL, 파일 첨부, AI 생성 중 사용자가 한 가지 방식을 선택한다.
- `descriptionEnabled=true`이면 설명 입력란을 표시한다.
- `altTextRequired=true`이면 Alt 입력을 필수 검증한다.
- 파일 첨부와 AI 생성의 실제 실행 API는 별도 작업으로 연결한다.

### CTA

- 버튼 이름
- 버튼 URL
- 관리자 UTM 기본값
- 필요한 경우 최종 URL에 UTM을 병합한다.

## 8. 검증 규칙

- 프로모션 개요 필수값 검증
- 템플릿 선택 필수
- 필수 Section에 노출 Item이 없으면 구성 오류
- 필수 Item 입력 검증
- 이미지 방식별 값 검증
- 고정 Item 값 존재 여부 검증
- 템플릿 Revision 변경 여부 검증
- 오류가 있으면 Step 3 이동 및 Integrated Brief 실행 차단

## 9. 생성 파이프라인 변경

### Integrated Brief

- 프로모션 개요를 생성 메타데이터로 전달한다.
- 선택 템플릿 정보와 Section Snapshot을 전달한다.
- 실제 콘텐츠는 `sectionInputs`를 원본 그대로 전달한다.
- LLM 요약 과정에서 누락되지 않도록 Section/Item Coverage를 검증한다.

### LO-FI

- 기존 `simpleBrief` 중심 fallback을 제거한다.
- 템플릿 Section 순서와 Item 역할을 레이아웃 입력으로 전달한다.
- 사용자 입력과 고정값을 모두 포함한다.
- 생성 결과와 원본 입력 사이의 Coverage 결과를 Run에 저장한다.

### 하위 호환

- API가 일시적으로 `simpleBrief`를 요구하면 내부 Adapter에서 파생값을 생성한다.
- Adapter는 UI 입력 모델이 아니며 제거 가능한 임시 호환 계층으로 표시한다.

## 10. 개발 Task

### Task 1. 공개 템플릿 API

- Active 목록 API 구현
- Active 상세 API 구현
- 공개 필드 화이트리스트 적용
- API 계약 테스트 작성

### Task 2. Wizard 세션 모델

- 선택 템플릿 상태 추가
- 템플릿별 입력 저장 구조 추가
- 기존 `wizardContent` 마이그레이션 처리
- Snapshot/Revision 저장 추가

### Task 3. Step 2 UI

- Message JSON 제거
- 템플릿 선택 UI 추가
- 로딩, 빈 상태, 오류, 재시도 상태 구현
- 선택 템플릿 동적 폼 렌더링

### Task 4. 검증 및 전환

- 템플릿 전환 확인
- 필수값 검증
- 고정값과 이미지 설정 반영
- Step 이동 차단 및 오류 위치 표시

### Task 5. Integrated Brief/LO-FI

- payload에 템플릿 메타데이터 추가
- `sectionSnapshot` 추가
- `simpleBrief` 직접 의존 제거
- Coverage 검증 연결

### Task 6. 회귀 테스트

- 기본 템플릿 자동 선택
- 템플릿별 서로 다른 Section 구성
- Header/Footer가 없는 템플릿
- 신규 Section이 있는 템플릿
- 템플릿 전환 및 입력 복원
- 필수/고정/숨김 Item
- 이미지 URL/파일/AI 허용 조합
- Integrated Brief, LO-FI, Final 전체 흐름

## 11. 완료 기준

- Wizard 2단계에서 Active 템플릿을 선택할 수 있다.
- 선택 템플릿의 Section/Item만 정확한 순서로 표시된다.
- Message JSON UI가 제거되고 생성 요청이 정상 완료된다.
- 프로모션 개요는 모든 템플릿에 공통 적용된다.
- 템플릿 전환 시 입력값이 혼합되거나 유실되지 않는다.
- Integrated Brief와 LO-FI에 전체 프로모션 콘텐츠가 전달된다.
- 관리자 설정 변경이 진행 중 Run을 훼손하지 않는다.
- 로컬 계약 테스트와 운영 End-to-End 테스트가 통과한다.

## 12. 주요 위험과 대응

| 위험 | 대응 |
|---|---|
| Message JSON 제거 후 LO-FI 필수값 누락 | Adapter와 계약 테스트로 단계적 제거 |
| 템플릿 전환 시 입력 혼합 | 템플릿 Key별 입력 상태 분리 |
| 관리자 변경으로 진행 중 Run 변형 | 생성 시 Snapshot 저장 |
| Draft/숨김 데이터 공개 | 공개 전용 API 화이트리스트 적용 |
| LLM 요약 중 콘텐츠 손실 | Section/Item Coverage 검증 |
| 파일/AI 이미지 기능 미완성 | URL과 분리된 실행 상태 및 후속 API Task로 관리 |

## 13. 권장 구현 순서

1. 공개 템플릿 API와 계약 테스트
2. Wizard 세션 데이터 모델
3. 템플릿 선택 UI와 동적 폼
4. Message JSON 제거와 검증 수정
5. Integrated Brief/LO-FI payload 전환
6. 전체 생성 회귀 및 운영 테스트

이 순서를 지켜야 UI만 먼저 바뀌어 생성 파이프라인이 실패하는 상태를 피할 수 있다.
