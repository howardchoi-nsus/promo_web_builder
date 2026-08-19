# Promotion Overview Prompt v2 검토 결과

## 결론

프롬프트의 안전 경계, 제품 카탈로그 제한, 금액·일정 등 확정값 생성 금지, 컴플라이언스 확인 절차는 전반적으로 잘 설계되어 있습니다.

다만 원문에는 아래 문제가 있었습니다.

1. locale이 없으면 무조건 영어를 사용하므로, 사용자의 입력 언어와 결과 언어가 달라질 수 있었습니다.
2. 고객용 문구만 locale을 따르고 검토용 note·risk·mitigation 등은 영어로 고정되어, 한 JSON 안에서 언어가 섞였습니다.
3. self-check 1이 market과 버전 값까지 금지하는 것으로 읽혀 draftMeta 스키마와 충돌했습니다.
4. “Every field carries provenance”라는 규칙이 provenance 속성이 없는 배열 항목 스키마와 충돌했습니다.
5. 금지된 금액·날짜나 삽입 공격 문장을 unmappedInputs.input에 그대로 복사하면 다른 규칙을 우회할 여지가 있었습니다.
6. catalogVersion과 allowedValuesVersion이 입력에 없을 때의 처리 규칙이 없었습니다.
7. 신뢰 경계가 naturalLanguage와 currentOverviewJson에만 적용되어 나머지 입력 객체 안의 지시문에 취약했습니다.

수정본은 다음 순서로 출력 언어를 결정합니다.

- naturalLanguage에서 요청을 표현한 주된 언어를 감지
- 감지가 불가능할 때만 localeAndMarketJson.locale 사용
- 둘 다 없으면 영어를 사용하되 locale 확인 필요로 표시
- 시장은 언어로 추론하지 않음
- 사람이 읽는 모든 텍스트는 결정된 언어로 작성
- JSON 키, enum, provenance, type 같은 기계 판독 토큰은 영어 원형 유지

## 현재 저장소와의 호환성 주의

수정본의 JSON 계약은 현재 애플리케이션의 promo overview parser 계약과 직접 호환되지 않습니다.

- 프롬프트: promotion.title 같은 중첩 field object와 strategicAssessment를 요구
- 런타임: overview.title, leadText, ctaLabel 등의 평면 문자열을 요구
- 프롬프트 provenance: needs_confirmation
- 런타임 provenance: needs-confirmation
- 프롬프트 generationMode: new, expand, conservative
- 런타임 허용값: new-draft만 지원

따라서 이 프롬프트를 현재 promo_overview_parser에 바로 등록하면 structured-output 검증 실패 가능성이 큽니다. 프롬프트를 설계안으로 사용할 수는 있지만, 실제 적용 전에는 런타임 스키마를 프롬프트에 맞게 변경하거나 프롬프트 출력 계약을 현재 런타임에 맞게 축소해야 합니다.
