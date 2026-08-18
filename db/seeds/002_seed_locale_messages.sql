-- Generated from locales/ko.json and locales/en.json.
-- Idempotent: preserves existing versions and only creates a baseline active
-- version when a locale/message key has no active version.

begin;

insert into locales (code, label, is_default, enabled)
values ('ko', '한국어', false, true), ('en', 'English', false, true)
on conflict (code) do update
set label = excluded.label, enabled = true, updated_at = now();

update locales
set is_default = true, updated_at = now()
where code = 'ko'
  and not exists (select 1 from locales where is_default = true);

with baseline(locale, messages) as (
  values
    ('ko', $ko_baseline${
  "common.action.save": "저장",
  "common.action.saveContinue": "저장하고 계속 추가",
  "common.action.cancel": "취소",
  "common.action.close": "닫기",
  "common.action.delete": "삭제",
  "common.action.duplicate": "복사본 만들기",
  "common.action.update": "수정",
  "common.action.edit": "편집",
  "common.action.saveChanges": "변경사항 저장",
  "common.action.refresh": "새로고침",
  "common.action.reset": "기본값으로 되돌리기",
  "common.action.preview": "미리보기",
  "common.action.download": "다운로드",
  "common.action.reorder": "순서 바꾸기",
  "common.action.previous": "이전",
  "common.action.next": "다음",
  "common.action.open": "열기",
  "common.action.archive": "보관",
  "common.action.activate": "활성화",
  "common.action.deactivate": "비활성화",
  "common.action.rollback": "과거 버전으로 새 초안 만들기",
  "common.action.viewSource": "원본 보기",
  "common.state.active": "활성",
  "common.state.inactive": "비활성",
  "common.state.archived": "보관됨",
  "common.state.draft": "초안",
  "common.state.all": "전체",
  "common.state.inUse": "사용 중",
  "common.state.required": "필수",
  "common.state.recommended": "권장",
  "common.state.notRecommended": "비권장",
  "common.state.loading": "불러오는 중",
  "common.state.saving": "저장 중...",
  "common.state.fixed": "고정",
  "common.field.name": "이름",
  "common.field.description": "설명",
  "common.field.briefDescription": "간략 설명",
  "common.field.type": "유형",
  "common.field.status": "상태",
  "common.field.order": "순서",
  "common.field.changeReason": "변경 사유",
  "common.field.changeType": "작업 유형",
  "common.field.before": "변경 전",
  "common.field.after": "변경 후",
  "common.field.version": "버전",
  "common.field.lastUpdated": "최종 수정",
  "entity.section.label": "섹션",
  "entity.section.name": "섹션 이름",
  "entity.section.key": "섹션 식별자",
  "entity.section.background": "섹션 배경",
  "entity.section.add": "섹션 추가",
  "entity.section.required": "필수 섹션",
  "entity.section.selectPrompt": "섹션을 선택하세요.",
  "entity.section.aiAllow": "AI 디자인 생성 허용",
  "entity.section.changeHistory": "섹션 변경 이력",
  "entity.section.activityHistory": "섹션 작업 이력",
  "entity.section.manage": "섹션 관리",
  "entity.section.usage": "사용 중인 템플릿 {count}개",
  "entity.section.usageLoading": "섹션 사용처를 확인하고 있습니다.",
  "entity.item.label": "항목",
  "entity.item.name": "항목 이름",
  "entity.item.key": "항목 식별자",
  "entity.item.add": "항목 추가",
  "entity.item.imageItem": "이미지 항목",
  "entity.item.emptyInSection": "선택한 섹션에 항목이 없습니다.",
  "entity.component.label": "컴포넌트",
  "entity.component.name": "컴포넌트 이름",
  "entity.component.key": "컴포넌트 식별자",
  "entity.component.manage": "컴포넌트 관리",
  "entity.component.select": "컴포넌트 선택",
  "entity.component.selectPrompt": "컴포넌트를 선택하세요.",
  "entity.component.add": "컴포넌트 추가",
  "entity.component.addDefaultsHint": "컴포넌트 기본 설정으로 섹션에 추가됩니다. 추가 후 섹션별 설정을 변경할 수 있습니다.",
  "entity.component.info": "컴포넌트 정보",
  "entity.component.editNotice": "컴포넌트 정의와 요소는 컴포넌트 관리에서 수정합니다.",
  "entity.component.editDetailNotice": "컴포넌트 이름, 설명과 요소는 컴포넌트 관리에서 수정하세요.",
  "entity.component.activeVersion": "활성 버전",
  "entity.component.usage": "사용 중인 섹션 {count}개",
  "entity.component.usageLoading": "컴포넌트 사용처를 확인하고 있습니다.",
  "entity.component.fieldLabel": "컴포넌트 요소",
  "entity.component.fieldName": "요소 이름",
  "entity.component.fieldKey": "요소 식별자",
  "entity.component.fieldAdd": "요소 추가",
  "entity.template.label": "템플릿",
  "entity.template.name": "템플릿 이름",
  "entity.template.key": "템플릿 식별자",
  "entity.template.sectionConfig": "템플릿 섹션 구성",
  "entity.template.add": "템플릿 추가",
  "admin.title": "관리자",
  "admin.i18n.title": "언어 및 문구 관리",
  "admin.i18n.language": "언어",
  "admin.i18n.addLanguage": "언어 추가",
  "admin.i18n.defaultLanguage": "기본 언어",
  "admin.i18n.messageCategory": "문구 분류",
  "admin.i18n.messageId": "메시지 식별자",
  "admin.i18n.translation": "번역 문구",
  "admin.i18n.koreanText": "한글 문구",
  "admin.i18n.englishText": "영문 문구",
  "admin.i18n.messages": "문구 목록",
  "admin.i18n.untranslated": "미번역 문구",
  "admin.i18n.progress": "번역 진행률",
  "admin.i18n.history": "버전 이력",
  "admin.i18n.selectMessage": "수정할 문구를 선택하세요.",
  "admin.i18n.emptyMessages": "등록된 문구가 없습니다.",
  "admin.i18n.savedDraft": "문구를 초안으로 저장했습니다.",
  "admin.i18n.activated": "문구를 활성화했습니다.",
  "admin.i18n.activatedCount": "문구 {count}개를 활성화했습니다.",
  "admin.i18n.archived": "문구를 보관했습니다.",
  "admin.i18n.rollbackCreated": "과거 버전으로 새 초안을 만들었습니다.",
  "admin.i18n.scopeNotice": "제작 도구의 화면 문구만 관리합니다. 사용자가 등록한 프로모션 콘텐츠에는 적용되지 않습니다.",
  "admin.i18n.languageCode": "언어 코드",
  "admin.i18n.languageCodeExample": "예: ja, en-US",
  "admin.i18n.languageNameExample": "예: 日本語",
  "admin.i18n.activateSelected": "선택 문구 활성화 ({count})",
  "admin.i18n.applyToCurrentScreen": "현재 화면에 적용",
  "shell.nav.builder": "프로모션 빌더",
  "shell.nav.admin": "관리자 페이지",
  "shell.nav.promoWizard": "프로모션 마법사",
  "shell.nav.createPromo": "프로모션 만들기",
  "shell.nav.visualEditor": "비주얼 편집기",
  "shell.nav.generated": "생성된 UI",
  "shell.theme.toLight": "라이트 모드로 변경",
  "shell.theme.toDark": "다크 모드로 변경",
  "admin.i18n.loadFailed": "언어 문구를 불러오지 못했습니다.",
  "admin.i18n.saveFailed": "언어 문구를 저장하지 못했습니다.",
  "admin.templateLayout.eyebrow": "프로모션 빌더 기본값",
  "admin.templateLayout.title": "템플릿 기본 레이아웃",
  "admin.templateLayout.description": "프로모션 빌더의 배경, 섹션 높이, 컴포넌트 위치와 글자 스타일을 설정합니다. 사용자 작업별 변경은 관리자 템플릿에 역반영되지 않습니다.",
  "admin.templateLayout.revision": "레이아웃",
  "admin.templateLayout.loading": "레이아웃 정보를 확인하는 중입니다.",
  "admin.templateLayout.openEditor": "레이아웃 편집 열기",
  "admin.templateLayout.readOnlyHelp": "활성 버전은 읽기 전용입니다. 먼저 새 초안을 만들어 주세요.",
  "admin.templateLayout.draftHelp": "편집 내용은 초안에만 반영되며 템플릿 활성화 후 프로모션 빌더에서 사용됩니다.",
  "admin.prompt.imageSize": "이미지 해상도",
  "admin.prompt.imageSizeHelp": "Gemini 이미지의 긴 변 기준 해상도입니다. 새 실행부터 적용됩니다.",
  "builder.title": "프로모션 페이지 제작",
  "builder.progress.analyzingOverview": "프로모션 개요를 분석하고 있습니다.",
  "builder.progress.retryingOverview": "AI 응답 오류로 재시도하고 있습니다. ({attempt}/{maxAttempts})",
  "builder.progress.composingStructure": "프로모션 구조를 구성하고 있습니다.",
  "builder.progress.generatingStructure": "프로모션 구조를 생성하고 있습니다.",
  "builder.progress.generatingAssets": "AI 이미지를 생성하고 있습니다.",
  "builder.progress.preparingPreview": "Live Preview를 준비하고 있습니다.",
  "builder.progress.verifyingAssets": "AI 이미지 생성 완료를 확인하고 있습니다.",
  "builder.step.designMode": "제작 방식 선택",
  "builder.step.input": "프로모션 정보 입력",
  "builder.step.generate": "디자인 생성",
  "builder.mode.ai": "AI로 만들기",
  "builder.mode.advanced": "직접 설정",
  "builder.sectionCount": "{count}개 섹션",
  "common.action.create": "생성",
  "admin.designToken.title": "디자인 토큰 관리",
  "admin.designToken.scopeNotice": "프로모션 결과물에 적용되는 --promo-* 토큰 세트와 버전을 관리합니다. 관리자 화면용 --app-* 토큰과는 분리됩니다.",
  "admin.designToken.addSet": "토큰 세트 추가",
  "admin.designToken.setList": "토큰 세트",
  "admin.designToken.emptySets": "등록된 토큰 세트가 없습니다.",
  "admin.designToken.name": "토큰 세트 이름",
  "admin.designToken.description": "설명",
  "admin.designToken.settings": "토큰 세트 설정",
  "admin.designToken.changeNote": "변경 사유",
  "admin.designToken.version": "버전",
  "admin.designToken.versionCount": "버전 {count}개",
  "admin.designToken.createDraft": "새 초안 만들기",
  "admin.designToken.validate": "검증",
  "admin.designToken.csvImport": "CSV 가져오기",
  "admin.designToken.sourceName": "원본 파일명",
  "admin.designToken.csv": "CSV 내용",
  "admin.designToken.dryRun": "가져오기 전 검증",
  "admin.designToken.import": "초안으로 가져오기",
  "admin.designToken.validationErrors": "검증 오류",
  "admin.designToken.preview": "적용 미리보기",
  "admin.designToken.previewEyebrow": "이벤트 프로모션",
  "admin.designToken.previewTitle": "특별한 혜택을 확인하세요",
  "admin.designToken.previewBody": "선택한 토큰의 색상, 글자 크기, 간격과 모서리 스타일을 실제 CSS 변수로 확인합니다.",
  "admin.designToken.previewButton": "참여하기",
  "admin.designToken.usage": "사용 현황",
  "admin.designToken.templateUsage": "연결된 템플릿 {count}개",
  "admin.designToken.aiRunUsage": "AI 디자인 실행 이력 {count}개",
  "admin.designToken.templateGuidance": "템플릿에 적용하려면 템플릿·레이아웃 관리에서 초안 템플릿의 디자인 토큰 버전을 선택한 뒤 활성화하세요.",
  "admin.designToken.history": "변경 이력",
  "admin.designToken.emptyHistory": "변경 이력이 없습니다.",
  "admin.designToken.created": "디자인 토큰 세트를 생성했습니다.",
  "admin.designToken.metadataSaved": "디자인 토큰 세트 정보를 저장했습니다.",
  "admin.designToken.draftCreated": "새 디자인 토큰 초안을 생성했습니다.",
  "admin.designToken.draftSaved": "디자인 토큰 초안을 저장했습니다.",
  "admin.designToken.validated": "디자인 토큰 검증을 완료했습니다.",
  "admin.designToken.activated": "활성 디자인 토큰 버전으로 지정했습니다.",
  "admin.designToken.imported": "CSV 내용을 디자인 토큰 초안에 반영했습니다.",
  "admin.designToken.importValidated": "CSV 가져오기 전 검증을 완료했습니다.",
  "admin.designToken.archived": "디자인 토큰 세트를 보관했습니다.",
  "admin.designToken.history.setCreated": "토큰 세트 생성",
  "admin.designToken.history.setUpdated": "토큰 세트 수정",
  "admin.designToken.history.setCloned": "토큰 세트 복제",
  "admin.designToken.history.setArchived": "토큰 세트 보관",
  "admin.designToken.history.draftCreated": "초안 생성",
  "admin.designToken.history.draftUpdated": "초안 수정",
  "admin.designToken.history.imported": "CSV 가져오기",
  "admin.designToken.history.validated": "검증",
  "admin.designToken.history.activated": "활성화",
  "admin.designToken.history.rollbackDraftCreated": "과거 버전 기반 초안 생성"
  ,"admin.designToken.cloneName": "복제할 토큰 세트 이름"
  ,"admin.designToken.cloned": "디자인 토큰 세트를 복제했습니다."
  ,"admin.designToken.compare": "버전 비교"
  ,"admin.designToken.compareWith": "비교할 버전"
  ,"admin.designToken.selectVersion": "버전을 선택하세요"
  ,"admin.designToken.noDifferences": "변경된 토큰이 없습니다."
  ,"admin.designToken.comparePreview": "비교 버전"
  ,"admin.designToken.desktop": "데스크톱"
  ,"admin.designToken.mobile": "모바일"
  ,"admin.designToken.applyTemplate": "적용할 초안 템플릿"
  ,"admin.designToken.selectTemplate": "초안 템플릿을 선택하세요"
  ,"admin.designToken.applyToDraft": "초안 템플릿에 적용"
  ,"admin.designToken.templateApplied": "선택한 초안 템플릿에 디자인 토큰 버전을 적용했습니다."
  ,"admin.designToken.unsavedConfirm": "저장하지 않은 토큰 값 변경이 있습니다. 이동할까요?"
  ,"admin.designToken.aiSelectable": "AI 선택 가능"
  ,"admin.designToken.search": "토큰 검색"
  ,"admin.designToken.allCategories": "전체 분류"
  ,"admin.designToken.changedOnly": "변경된 항목만 보기"
  ,"admin.designToken.category": "분류"
  ,"admin.designToken.token": "토큰"
  ,"admin.designToken.type": "형식"
  ,"admin.designToken.value": "현재 값"
  ,"admin.designToken.status": "상태"
  ,"admin.designToken.changed": "변경됨"
  ,"admin.designToken.normal": "정상"
  ,"admin.designToken.csvExport": "CSV 내보내기"
  ,"admin.designToken.saveAndApply": "저장 및 적용"
  ,"admin.designToken.applyTemplates": "적용할 프로모션 템플릿"
  ,"admin.designToken.templateDraftConflict": "기존 초안이 있어 적용할 수 없습니다."
  ,"admin.designToken.selectTemplateRequired": "적용할 프로모션 템플릿을 하나 이상 선택하세요."
  ,"admin.designToken.csvTypeError": "CSV 파일만 가져올 수 있습니다."
  ,"admin.designToken.csvSizeError": "CSV 파일은 2MB 이하여야 합니다."
  ,"admin.designToken.saveSuccess": "디자인 토큰을 저장하고 활성화했습니다."
  ,"admin.designToken.saveApplySuccess": "디자인 토큰을 저장하고 프로모션 템플릿 {count}개에 적용했습니다."
}$ko_baseline$::jsonb),
    ('en', $en_baseline${
  "common.action.save": "Save",
  "common.action.saveContinue": "Save and add more",
  "common.action.cancel": "Cancel",
  "common.action.close": "Close",
  "common.action.delete": "Delete",
  "common.action.duplicate": "Make a copy",
  "common.action.update": "Update",
  "common.action.edit": "Edit",
  "common.action.saveChanges": "Save changes",
  "common.action.refresh": "Refresh",
  "common.action.reset": "Restore defaults",
  "common.action.preview": "Preview",
  "common.action.download": "Download",
  "common.action.reorder": "Reorder",
  "common.action.previous": "Previous",
  "common.action.next": "Next",
  "common.action.open": "Open",
  "common.action.archive": "Archive",
  "common.action.activate": "Activate",
  "common.action.deactivate": "Deactivate",
  "common.action.rollback": "Create draft from this version",
  "common.action.viewSource": "View source",
  "common.state.active": "Active",
  "common.state.inactive": "Inactive",
  "common.state.archived": "Archived",
  "common.state.draft": "Draft",
  "common.state.all": "All",
  "common.state.inUse": "In use",
  "common.state.required": "Required",
  "common.state.recommended": "Recommended",
  "common.state.notRecommended": "Not recommended",
  "common.state.loading": "Loading",
  "common.state.saving": "Saving...",
  "common.state.fixed": "Fixed",
  "common.field.name": "Name",
  "common.field.description": "Description",
  "common.field.briefDescription": "Brief description",
  "common.field.type": "Type",
  "common.field.status": "Status",
  "common.field.order": "Order",
  "common.field.changeReason": "Change reason",
  "common.field.changeType": "Activity type",
  "common.field.before": "Before",
  "common.field.after": "After",
  "common.field.version": "Version",
  "common.field.lastUpdated": "Last updated",
  "entity.section.label": "Section",
  "entity.section.name": "Section name",
  "entity.section.key": "Section ID",
  "entity.section.background": "Section background",
  "entity.section.add": "Add section",
  "entity.section.required": "Required section",
  "entity.section.selectPrompt": "Select a section.",
  "entity.section.aiAllow": "Allow AI design generation",
  "entity.section.changeHistory": "Section change history",
  "entity.section.activityHistory": "Section activity history",
  "entity.section.manage": "Section management",
  "entity.section.usage": "Used by {count} templates",
  "entity.section.usageLoading": "Checking section usage.",
  "entity.item.label": "Item",
  "entity.item.name": "Item name",
  "entity.item.key": "Item ID",
  "entity.item.add": "Add item",
  "entity.item.imageItem": "Image item",
  "entity.item.emptyInSection": "No items in the selected section.",
  "entity.component.label": "Component",
  "entity.component.name": "Component name",
  "entity.component.key": "Component ID",
  "entity.component.manage": "Component management",
  "entity.component.select": "Select component",
  "entity.component.selectPrompt": "Select a component.",
  "entity.component.add": "Add component",
  "entity.component.addDefaultsHint": "The component will be added to the section with its defaults. Section-specific settings can be changed afterward.",
  "entity.component.info": "Component information",
  "entity.component.editNotice": "Edit component definitions and fields in Component management.",
  "entity.component.editDetailNotice": "Edit the component name, description, and fields in Component management.",
  "entity.component.activeVersion": "Active version",
  "entity.component.usage": "Used by {count} sections",
  "entity.component.usageLoading": "Checking component usage.",
  "entity.component.fieldLabel": "Component field",
  "entity.component.fieldName": "Field name",
  "entity.component.fieldKey": "Field ID",
  "entity.component.fieldAdd": "Add field",
  "entity.template.label": "Template",
  "entity.template.name": "Template name",
  "entity.template.key": "Template ID",
  "entity.template.sectionConfig": "Template section setup",
  "entity.template.add": "Add template",
  "admin.title": "Admin",
  "admin.i18n.title": "Languages & messages",
  "admin.i18n.language": "Language",
  "admin.i18n.addLanguage": "Add language",
  "admin.i18n.defaultLanguage": "Default language",
  "admin.i18n.messageCategory": "Message category",
  "admin.i18n.messageId": "Message ID",
  "admin.i18n.translation": "Translation",
  "admin.i18n.koreanText": "Korean text",
  "admin.i18n.englishText": "English text",
  "admin.i18n.messages": "Messages",
  "admin.i18n.untranslated": "Untranslated messages",
  "admin.i18n.progress": "Translation progress",
  "admin.i18n.history": "Version history",
  "admin.i18n.selectMessage": "Select a message to edit.",
  "admin.i18n.emptyMessages": "No messages are registered.",
  "admin.i18n.savedDraft": "Message saved as a draft.",
  "admin.i18n.activated": "Message activated.",
  "admin.i18n.activatedCount": "Activated {count} messages.",
  "admin.i18n.archived": "Message archived.",
  "admin.i18n.rollbackCreated": "Created a new draft from the previous version.",
  "admin.i18n.scopeNotice": "Manage production-tool interface text only. User-provided promotion content is not affected.",
  "admin.i18n.languageCode": "Language code",
  "admin.i18n.languageCodeExample": "Example: ja, en-US",
  "admin.i18n.languageNameExample": "Example: Japanese",
  "admin.i18n.activateSelected": "Activate selected messages ({count})",
  "admin.i18n.applyToCurrentScreen": "Apply to current screen",
  "shell.nav.builder": "Promotion Builder",
  "shell.nav.admin": "Admin",
  "shell.nav.promoWizard": "Promo Wizard",
  "shell.nav.createPromo": "Create Promo",
  "shell.nav.visualEditor": "Visual Editor",
  "shell.nav.generated": "Generated UI",
  "shell.theme.toLight": "Switch to light mode",
  "shell.theme.toDark": "Switch to dark mode",
  "admin.i18n.loadFailed": "Could not load language messages.",
  "admin.i18n.saveFailed": "Could not save the language message.",
  "admin.templateLayout.eyebrow": "Promotion Builder defaults",
  "admin.templateLayout.title": "Default template layout",
  "admin.templateLayout.description": "Configure the Promotion Builder background, section height, component placement, and typography. User-specific changes are not written back to the admin template.",
  "admin.templateLayout.revision": "Layout",
  "admin.templateLayout.loading": "Loading layout information.",
  "admin.templateLayout.openEditor": "Open layout editor",
  "admin.templateLayout.readOnlyHelp": "Active versions are read-only. Create a new draft first.",
  "admin.templateLayout.draftHelp": "Edits apply only to the draft and become available in Promotion Builder after template activation.",
  "admin.prompt.imageSize": "Image resolution",
  "admin.prompt.imageSizeHelp": "Long-edge resolution for Gemini images. Applies to new runs.",
  "builder.title": "Promotion page builder",
  "builder.progress.analyzingOverview": "Analyzing the promotion overview.",
  "builder.progress.retryingOverview": "Retrying after a temporary AI response error. ({attempt}/{maxAttempts})",
  "builder.progress.composingStructure": "Composing the promotion structure.",
  "builder.progress.generatingStructure": "Generating the promotion structure.",
  "builder.progress.generatingAssets": "Generating AI images.",
  "builder.progress.preparingPreview": "Preparing Live Preview.",
  "builder.progress.verifyingAssets": "Checking that AI images are ready.",
  "builder.step.designMode": "Select creation method",
  "builder.step.input": "Enter promotion details",
  "builder.step.generate": "Generate design",
  "builder.mode.ai": "Create with AI",
  "builder.mode.advanced": "Custom settings",
  "builder.sectionCount": "{count} sections",
  "common.action.create": "Create",
  "admin.designToken.title": "Design tokens",
  "admin.designToken.scopeNotice": "Manage --promo-* token sets and versions used in promotion output. These are separate from the admin interface --app-* tokens.",
  "admin.designToken.addSet": "Add token set",
  "admin.designToken.setList": "Token sets",
  "admin.designToken.emptySets": "No token sets are registered.",
  "admin.designToken.name": "Token set name",
  "admin.designToken.description": "Description",
  "admin.designToken.settings": "Token set settings",
  "admin.designToken.changeNote": "Change note",
  "admin.designToken.version": "Version",
  "admin.designToken.versionCount": "{count} versions",
  "admin.designToken.createDraft": "Create draft",
  "admin.designToken.validate": "Validate",
  "admin.designToken.csvImport": "Import CSV",
  "admin.designToken.sourceName": "Source filename",
  "admin.designToken.csv": "CSV content",
  "admin.designToken.dryRun": "Validate before import",
  "admin.designToken.import": "Import as draft",
  "admin.designToken.validationErrors": "Validation errors",
  "admin.designToken.preview": "Applied preview",
  "admin.designToken.previewEyebrow": "Event promotion",
  "admin.designToken.previewTitle": "Discover a special offer",
  "admin.designToken.previewBody": "Preview the selected token colors, typography, spacing, and corner styles through real CSS variables.",
  "admin.designToken.previewButton": "Join now",
  "admin.designToken.usage": "Usage",
  "admin.designToken.templateUsage": "{count} linked templates",
  "admin.designToken.aiRunUsage": "{count} AI design runs",
  "admin.designToken.templateGuidance": "To apply this set, select its token version on a draft in Template & Layout Management, then activate the template.",
  "admin.designToken.history": "History",
  "admin.designToken.emptyHistory": "No history is available.",
  "admin.designToken.created": "Design token set created.",
  "admin.designToken.metadataSaved": "Design token set details saved.",
  "admin.designToken.draftCreated": "Design token draft created.",
  "admin.designToken.draftSaved": "Design token draft saved.",
  "admin.designToken.validated": "Design token validation completed.",
  "admin.designToken.activated": "Design token version activated.",
  "admin.designToken.imported": "CSV content imported into the design token draft.",
  "admin.designToken.importValidated": "CSV pre-import validation completed.",
  "admin.designToken.archived": "Design token set archived.",
  "admin.designToken.history.setCreated": "Token set created",
  "admin.designToken.history.setUpdated": "Token set updated",
  "admin.designToken.history.setCloned": "Token set cloned",
  "admin.designToken.history.setArchived": "Token set archived",
  "admin.designToken.history.draftCreated": "Draft created",
  "admin.designToken.history.draftUpdated": "Draft updated",
  "admin.designToken.history.imported": "CSV imported",
  "admin.designToken.history.validated": "Validated",
  "admin.designToken.history.activated": "Activated",
  "admin.designToken.history.rollbackDraftCreated": "Rollback draft created"
  ,"admin.designToken.cloneName": "Cloned token set name"
  ,"admin.designToken.cloned": "Design token set cloned."
  ,"admin.designToken.compare": "Compare versions"
  ,"admin.designToken.compareWith": "Compare with"
  ,"admin.designToken.selectVersion": "Select a version"
  ,"admin.designToken.noDifferences": "No token values changed."
  ,"admin.designToken.comparePreview": "Comparison version"
  ,"admin.designToken.desktop": "Desktop"
  ,"admin.designToken.mobile": "Mobile"
  ,"admin.designToken.applyTemplate": "Draft template to update"
  ,"admin.designToken.selectTemplate": "Select a draft template"
  ,"admin.designToken.applyToDraft": "Apply to draft template"
  ,"admin.designToken.templateApplied": "Design token version applied to the selected draft template."
  ,"admin.designToken.unsavedConfirm": "You have unsaved token value changes. Leave this version?"
  ,"admin.designToken.aiSelectable": "AI selectable"
  ,"admin.designToken.search": "Search tokens"
  ,"admin.designToken.allCategories": "All categories"
  ,"admin.designToken.changedOnly": "Show changed only"
  ,"admin.designToken.category": "Category"
  ,"admin.designToken.token": "Token"
  ,"admin.designToken.type": "Type"
  ,"admin.designToken.value": "Current value"
  ,"admin.designToken.status": "Status"
  ,"admin.designToken.changed": "Changed"
  ,"admin.designToken.normal": "Valid"
  ,"admin.designToken.csvExport": "Export CSV"
  ,"admin.designToken.saveAndApply": "Save and apply"
  ,"admin.designToken.applyTemplates": "Promotion templates to update"
  ,"admin.designToken.templateDraftConflict": "This template already has a draft."
  ,"admin.designToken.selectTemplateRequired": "Select at least one promotion template."
  ,"admin.designToken.csvTypeError": "Only CSV files can be imported."
  ,"admin.designToken.csvSizeError": "CSV files must be 2MB or smaller."
  ,"admin.designToken.saveSuccess": "Design tokens saved and activated."
  ,"admin.designToken.saveApplySuccess": "Design tokens saved and applied to {count} promotion templates."
}$en_baseline$::jsonb)
)
insert into locale_message_keys (message_key, namespace)
select distinct entry.key, split_part(entry.key, '.', 1)
from baseline
cross join lateral jsonb_each_text(baseline.messages) as entry
on conflict (message_key) do nothing;

with baseline(locale, messages) as (
  values
    ('ko', $ko_baseline${
  "common.action.save": "저장",
  "common.action.saveContinue": "저장하고 계속 추가",
  "common.action.cancel": "취소",
  "common.action.close": "닫기",
  "common.action.delete": "삭제",
  "common.action.duplicate": "복사본 만들기",
  "common.action.update": "수정",
  "common.action.edit": "편집",
  "common.action.saveChanges": "변경사항 저장",
  "common.action.refresh": "새로고침",
  "common.action.reset": "기본값으로 되돌리기",
  "common.action.preview": "미리보기",
  "common.action.download": "다운로드",
  "common.action.reorder": "순서 바꾸기",
  "common.action.previous": "이전",
  "common.action.next": "다음",
  "common.action.open": "열기",
  "common.action.archive": "보관",
  "common.action.activate": "활성화",
  "common.action.deactivate": "비활성화",
  "common.action.rollback": "과거 버전으로 새 초안 만들기",
  "common.action.viewSource": "원본 보기",
  "common.state.active": "활성",
  "common.state.inactive": "비활성",
  "common.state.archived": "보관됨",
  "common.state.draft": "초안",
  "common.state.all": "전체",
  "common.state.inUse": "사용 중",
  "common.state.required": "필수",
  "common.state.recommended": "권장",
  "common.state.notRecommended": "비권장",
  "common.state.loading": "불러오는 중",
  "common.state.saving": "저장 중...",
  "common.state.fixed": "고정",
  "common.field.name": "이름",
  "common.field.description": "설명",
  "common.field.briefDescription": "간략 설명",
  "common.field.type": "유형",
  "common.field.status": "상태",
  "common.field.order": "순서",
  "common.field.changeReason": "변경 사유",
  "common.field.changeType": "작업 유형",
  "common.field.before": "변경 전",
  "common.field.after": "변경 후",
  "common.field.version": "버전",
  "common.field.lastUpdated": "최종 수정",
  "entity.section.label": "섹션",
  "entity.section.name": "섹션 이름",
  "entity.section.key": "섹션 식별자",
  "entity.section.background": "섹션 배경",
  "entity.section.add": "섹션 추가",
  "entity.section.required": "필수 섹션",
  "entity.section.selectPrompt": "섹션을 선택하세요.",
  "entity.section.aiAllow": "AI 디자인 생성 허용",
  "entity.section.changeHistory": "섹션 변경 이력",
  "entity.section.activityHistory": "섹션 작업 이력",
  "entity.section.manage": "섹션 관리",
  "entity.section.usage": "사용 중인 템플릿 {count}개",
  "entity.section.usageLoading": "섹션 사용처를 확인하고 있습니다.",
  "entity.item.label": "항목",
  "entity.item.name": "항목 이름",
  "entity.item.key": "항목 식별자",
  "entity.item.add": "항목 추가",
  "entity.item.imageItem": "이미지 항목",
  "entity.item.emptyInSection": "선택한 섹션에 항목이 없습니다.",
  "entity.component.label": "컴포넌트",
  "entity.component.name": "컴포넌트 이름",
  "entity.component.key": "컴포넌트 식별자",
  "entity.component.manage": "컴포넌트 관리",
  "entity.component.select": "컴포넌트 선택",
  "entity.component.selectPrompt": "컴포넌트를 선택하세요.",
  "entity.component.add": "컴포넌트 추가",
  "entity.component.addDefaultsHint": "컴포넌트 기본 설정으로 섹션에 추가됩니다. 추가 후 섹션별 설정을 변경할 수 있습니다.",
  "entity.component.info": "컴포넌트 정보",
  "entity.component.editNotice": "컴포넌트 정의와 요소는 컴포넌트 관리에서 수정합니다.",
  "entity.component.editDetailNotice": "컴포넌트 이름, 설명과 요소는 컴포넌트 관리에서 수정하세요.",
  "entity.component.activeVersion": "활성 버전",
  "entity.component.usage": "사용 중인 섹션 {count}개",
  "entity.component.usageLoading": "컴포넌트 사용처를 확인하고 있습니다.",
  "entity.component.fieldLabel": "컴포넌트 요소",
  "entity.component.fieldName": "요소 이름",
  "entity.component.fieldKey": "요소 식별자",
  "entity.component.fieldAdd": "요소 추가",
  "entity.template.label": "템플릿",
  "entity.template.name": "템플릿 이름",
  "entity.template.key": "템플릿 식별자",
  "entity.template.sectionConfig": "템플릿 섹션 구성",
  "entity.template.add": "템플릿 추가",
  "admin.title": "관리자",
  "admin.i18n.title": "언어 및 문구 관리",
  "admin.i18n.language": "언어",
  "admin.i18n.addLanguage": "언어 추가",
  "admin.i18n.defaultLanguage": "기본 언어",
  "admin.i18n.messageCategory": "문구 분류",
  "admin.i18n.messageId": "메시지 식별자",
  "admin.i18n.translation": "번역 문구",
  "admin.i18n.koreanText": "한글 문구",
  "admin.i18n.englishText": "영문 문구",
  "admin.i18n.messages": "문구 목록",
  "admin.i18n.untranslated": "미번역 문구",
  "admin.i18n.progress": "번역 진행률",
  "admin.i18n.history": "버전 이력",
  "admin.i18n.selectMessage": "수정할 문구를 선택하세요.",
  "admin.i18n.emptyMessages": "등록된 문구가 없습니다.",
  "admin.i18n.savedDraft": "문구를 초안으로 저장했습니다.",
  "admin.i18n.activated": "문구를 활성화했습니다.",
  "admin.i18n.activatedCount": "문구 {count}개를 활성화했습니다.",
  "admin.i18n.archived": "문구를 보관했습니다.",
  "admin.i18n.rollbackCreated": "과거 버전으로 새 초안을 만들었습니다.",
  "admin.i18n.scopeNotice": "제작 도구의 화면 문구만 관리합니다. 사용자가 등록한 프로모션 콘텐츠에는 적용되지 않습니다.",
  "admin.i18n.languageCode": "언어 코드",
  "admin.i18n.languageCodeExample": "예: ja, en-US",
  "admin.i18n.languageNameExample": "예: 日本語",
  "admin.i18n.activateSelected": "선택 문구 활성화 ({count})",
  "admin.i18n.applyToCurrentScreen": "현재 화면에 적용",
  "shell.nav.builder": "프로모션 빌더",
  "shell.nav.admin": "관리자 페이지",
  "shell.nav.promoWizard": "프로모션 마법사",
  "shell.nav.createPromo": "프로모션 만들기",
  "shell.nav.visualEditor": "비주얼 편집기",
  "shell.nav.generated": "생성된 UI",
  "shell.theme.toLight": "라이트 모드로 변경",
  "shell.theme.toDark": "다크 모드로 변경",
  "admin.i18n.loadFailed": "언어 문구를 불러오지 못했습니다.",
  "admin.i18n.saveFailed": "언어 문구를 저장하지 못했습니다.",
  "admin.templateLayout.eyebrow": "프로모션 빌더 기본값",
  "admin.templateLayout.title": "템플릿 기본 레이아웃",
  "admin.templateLayout.description": "프로모션 빌더의 배경, 섹션 높이, 컴포넌트 위치와 글자 스타일을 설정합니다. 사용자 작업별 변경은 관리자 템플릿에 역반영되지 않습니다.",
  "admin.templateLayout.revision": "레이아웃",
  "admin.templateLayout.loading": "레이아웃 정보를 확인하는 중입니다.",
  "admin.templateLayout.openEditor": "레이아웃 편집 열기",
  "admin.templateLayout.readOnlyHelp": "활성 버전은 읽기 전용입니다. 먼저 새 초안을 만들어 주세요.",
  "admin.templateLayout.draftHelp": "편집 내용은 초안에만 반영되며 템플릿 활성화 후 프로모션 빌더에서 사용됩니다.",
  "admin.prompt.imageSize": "이미지 해상도",
  "admin.prompt.imageSizeHelp": "Gemini 이미지의 긴 변 기준 해상도입니다. 새 실행부터 적용됩니다.",
  "builder.title": "프로모션 페이지 제작",
  "builder.progress.analyzingOverview": "프로모션 개요를 분석하고 있습니다.",
  "builder.progress.retryingOverview": "AI 응답 오류로 재시도하고 있습니다. ({attempt}/{maxAttempts})",
  "builder.progress.composingStructure": "프로모션 구조를 구성하고 있습니다.",
  "builder.progress.generatingStructure": "프로모션 구조를 생성하고 있습니다.",
  "builder.progress.generatingAssets": "AI 이미지를 생성하고 있습니다.",
  "builder.progress.preparingPreview": "Live Preview를 준비하고 있습니다.",
  "builder.progress.verifyingAssets": "AI 이미지 생성 완료를 확인하고 있습니다.",
  "builder.step.designMode": "제작 방식 선택",
  "builder.step.input": "프로모션 정보 입력",
  "builder.step.generate": "디자인 생성",
  "builder.mode.ai": "AI로 만들기",
  "builder.mode.advanced": "직접 설정",
  "builder.sectionCount": "{count}개 섹션",
  "common.action.create": "생성",
  "admin.designToken.title": "디자인 토큰 관리",
  "admin.designToken.scopeNotice": "프로모션 결과물에 적용되는 --promo-* 토큰 세트와 버전을 관리합니다. 관리자 화면용 --app-* 토큰과는 분리됩니다.",
  "admin.designToken.addSet": "토큰 세트 추가",
  "admin.designToken.setList": "토큰 세트",
  "admin.designToken.emptySets": "등록된 토큰 세트가 없습니다.",
  "admin.designToken.name": "토큰 세트 이름",
  "admin.designToken.description": "설명",
  "admin.designToken.settings": "토큰 세트 설정",
  "admin.designToken.changeNote": "변경 사유",
  "admin.designToken.version": "버전",
  "admin.designToken.versionCount": "버전 {count}개",
  "admin.designToken.createDraft": "새 초안 만들기",
  "admin.designToken.validate": "검증",
  "admin.designToken.csvImport": "CSV 가져오기",
  "admin.designToken.sourceName": "원본 파일명",
  "admin.designToken.csv": "CSV 내용",
  "admin.designToken.dryRun": "가져오기 전 검증",
  "admin.designToken.import": "초안으로 가져오기",
  "admin.designToken.validationErrors": "검증 오류",
  "admin.designToken.preview": "적용 미리보기",
  "admin.designToken.previewEyebrow": "이벤트 프로모션",
  "admin.designToken.previewTitle": "특별한 혜택을 확인하세요",
  "admin.designToken.previewBody": "선택한 토큰의 색상, 글자 크기, 간격과 모서리 스타일을 실제 CSS 변수로 확인합니다.",
  "admin.designToken.previewButton": "참여하기",
  "admin.designToken.usage": "사용 현황",
  "admin.designToken.templateUsage": "연결된 템플릿 {count}개",
  "admin.designToken.aiRunUsage": "AI 디자인 실행 이력 {count}개",
  "admin.designToken.templateGuidance": "템플릿에 적용하려면 템플릿·레이아웃 관리에서 초안 템플릿의 디자인 토큰 버전을 선택한 뒤 활성화하세요.",
  "admin.designToken.history": "변경 이력",
  "admin.designToken.emptyHistory": "변경 이력이 없습니다.",
  "admin.designToken.created": "디자인 토큰 세트를 생성했습니다.",
  "admin.designToken.metadataSaved": "디자인 토큰 세트 정보를 저장했습니다.",
  "admin.designToken.draftCreated": "새 디자인 토큰 초안을 생성했습니다.",
  "admin.designToken.draftSaved": "디자인 토큰 초안을 저장했습니다.",
  "admin.designToken.validated": "디자인 토큰 검증을 완료했습니다.",
  "admin.designToken.activated": "활성 디자인 토큰 버전으로 지정했습니다.",
  "admin.designToken.imported": "CSV 내용을 디자인 토큰 초안에 반영했습니다.",
  "admin.designToken.importValidated": "CSV 가져오기 전 검증을 완료했습니다.",
  "admin.designToken.archived": "디자인 토큰 세트를 보관했습니다.",
  "admin.designToken.history.setCreated": "토큰 세트 생성",
  "admin.designToken.history.setUpdated": "토큰 세트 수정",
  "admin.designToken.history.setCloned": "토큰 세트 복제",
  "admin.designToken.history.setArchived": "토큰 세트 보관",
  "admin.designToken.history.draftCreated": "초안 생성",
  "admin.designToken.history.draftUpdated": "초안 수정",
  "admin.designToken.history.imported": "CSV 가져오기",
  "admin.designToken.history.validated": "검증",
  "admin.designToken.history.activated": "활성화",
  "admin.designToken.history.rollbackDraftCreated": "과거 버전 기반 초안 생성"
  ,"admin.designToken.cloneName": "복제할 토큰 세트 이름"
  ,"admin.designToken.cloned": "디자인 토큰 세트를 복제했습니다."
  ,"admin.designToken.compare": "버전 비교"
  ,"admin.designToken.compareWith": "비교할 버전"
  ,"admin.designToken.selectVersion": "버전을 선택하세요"
  ,"admin.designToken.noDifferences": "변경된 토큰이 없습니다."
  ,"admin.designToken.comparePreview": "비교 버전"
  ,"admin.designToken.desktop": "데스크톱"
  ,"admin.designToken.mobile": "모바일"
  ,"admin.designToken.applyTemplate": "적용할 초안 템플릿"
  ,"admin.designToken.selectTemplate": "초안 템플릿을 선택하세요"
  ,"admin.designToken.applyToDraft": "초안 템플릿에 적용"
  ,"admin.designToken.templateApplied": "선택한 초안 템플릿에 디자인 토큰 버전을 적용했습니다."
  ,"admin.designToken.unsavedConfirm": "저장하지 않은 토큰 값 변경이 있습니다. 이동할까요?"
  ,"admin.designToken.aiSelectable": "AI 선택 가능"
  ,"admin.designToken.search": "토큰 검색"
  ,"admin.designToken.allCategories": "전체 분류"
  ,"admin.designToken.changedOnly": "변경된 항목만 보기"
  ,"admin.designToken.category": "분류"
  ,"admin.designToken.token": "토큰"
  ,"admin.designToken.type": "형식"
  ,"admin.designToken.value": "현재 값"
  ,"admin.designToken.status": "상태"
  ,"admin.designToken.changed": "변경됨"
  ,"admin.designToken.normal": "정상"
  ,"admin.designToken.csvExport": "CSV 내보내기"
  ,"admin.designToken.saveAndApply": "저장 및 적용"
  ,"admin.designToken.applyTemplates": "적용할 프로모션 템플릿"
  ,"admin.designToken.templateDraftConflict": "기존 초안이 있어 적용할 수 없습니다."
  ,"admin.designToken.selectTemplateRequired": "적용할 프로모션 템플릿을 하나 이상 선택하세요."
  ,"admin.designToken.csvTypeError": "CSV 파일만 가져올 수 있습니다."
  ,"admin.designToken.csvSizeError": "CSV 파일은 2MB 이하여야 합니다."
  ,"admin.designToken.saveSuccess": "디자인 토큰을 저장하고 활성화했습니다."
  ,"admin.designToken.saveApplySuccess": "디자인 토큰을 저장하고 프로모션 템플릿 {count}개에 적용했습니다."
}$ko_baseline$::jsonb),
    ('en', $en_baseline${
  "common.action.save": "Save",
  "common.action.saveContinue": "Save and add more",
  "common.action.cancel": "Cancel",
  "common.action.close": "Close",
  "common.action.delete": "Delete",
  "common.action.duplicate": "Make a copy",
  "common.action.update": "Update",
  "common.action.edit": "Edit",
  "common.action.saveChanges": "Save changes",
  "common.action.refresh": "Refresh",
  "common.action.reset": "Restore defaults",
  "common.action.preview": "Preview",
  "common.action.download": "Download",
  "common.action.reorder": "Reorder",
  "common.action.previous": "Previous",
  "common.action.next": "Next",
  "common.action.open": "Open",
  "common.action.archive": "Archive",
  "common.action.activate": "Activate",
  "common.action.deactivate": "Deactivate",
  "common.action.rollback": "Create draft from this version",
  "common.action.viewSource": "View source",
  "common.state.active": "Active",
  "common.state.inactive": "Inactive",
  "common.state.archived": "Archived",
  "common.state.draft": "Draft",
  "common.state.all": "All",
  "common.state.inUse": "In use",
  "common.state.required": "Required",
  "common.state.recommended": "Recommended",
  "common.state.notRecommended": "Not recommended",
  "common.state.loading": "Loading",
  "common.state.saving": "Saving...",
  "common.state.fixed": "Fixed",
  "common.field.name": "Name",
  "common.field.description": "Description",
  "common.field.briefDescription": "Brief description",
  "common.field.type": "Type",
  "common.field.status": "Status",
  "common.field.order": "Order",
  "common.field.changeReason": "Change reason",
  "common.field.changeType": "Activity type",
  "common.field.before": "Before",
  "common.field.after": "After",
  "common.field.version": "Version",
  "common.field.lastUpdated": "Last updated",
  "entity.section.label": "Section",
  "entity.section.name": "Section name",
  "entity.section.key": "Section ID",
  "entity.section.background": "Section background",
  "entity.section.add": "Add section",
  "entity.section.required": "Required section",
  "entity.section.selectPrompt": "Select a section.",
  "entity.section.aiAllow": "Allow AI design generation",
  "entity.section.changeHistory": "Section change history",
  "entity.section.activityHistory": "Section activity history",
  "entity.section.manage": "Section management",
  "entity.section.usage": "Used by {count} templates",
  "entity.section.usageLoading": "Checking section usage.",
  "entity.item.label": "Item",
  "entity.item.name": "Item name",
  "entity.item.key": "Item ID",
  "entity.item.add": "Add item",
  "entity.item.imageItem": "Image item",
  "entity.item.emptyInSection": "No items in the selected section.",
  "entity.component.label": "Component",
  "entity.component.name": "Component name",
  "entity.component.key": "Component ID",
  "entity.component.manage": "Component management",
  "entity.component.select": "Select component",
  "entity.component.selectPrompt": "Select a component.",
  "entity.component.add": "Add component",
  "entity.component.addDefaultsHint": "The component will be added to the section with its defaults. Section-specific settings can be changed afterward.",
  "entity.component.info": "Component information",
  "entity.component.editNotice": "Edit component definitions and fields in Component management.",
  "entity.component.editDetailNotice": "Edit the component name, description, and fields in Component management.",
  "entity.component.activeVersion": "Active version",
  "entity.component.usage": "Used by {count} sections",
  "entity.component.usageLoading": "Checking component usage.",
  "entity.component.fieldLabel": "Component field",
  "entity.component.fieldName": "Field name",
  "entity.component.fieldKey": "Field ID",
  "entity.component.fieldAdd": "Add field",
  "entity.template.label": "Template",
  "entity.template.name": "Template name",
  "entity.template.key": "Template ID",
  "entity.template.sectionConfig": "Template section setup",
  "entity.template.add": "Add template",
  "admin.title": "Admin",
  "admin.i18n.title": "Languages & messages",
  "admin.i18n.language": "Language",
  "admin.i18n.addLanguage": "Add language",
  "admin.i18n.defaultLanguage": "Default language",
  "admin.i18n.messageCategory": "Message category",
  "admin.i18n.messageId": "Message ID",
  "admin.i18n.translation": "Translation",
  "admin.i18n.koreanText": "Korean text",
  "admin.i18n.englishText": "English text",
  "admin.i18n.messages": "Messages",
  "admin.i18n.untranslated": "Untranslated messages",
  "admin.i18n.progress": "Translation progress",
  "admin.i18n.history": "Version history",
  "admin.i18n.selectMessage": "Select a message to edit.",
  "admin.i18n.emptyMessages": "No messages are registered.",
  "admin.i18n.savedDraft": "Message saved as a draft.",
  "admin.i18n.activated": "Message activated.",
  "admin.i18n.activatedCount": "Activated {count} messages.",
  "admin.i18n.archived": "Message archived.",
  "admin.i18n.rollbackCreated": "Created a new draft from the previous version.",
  "admin.i18n.scopeNotice": "Manage production-tool interface text only. User-provided promotion content is not affected.",
  "admin.i18n.languageCode": "Language code",
  "admin.i18n.languageCodeExample": "Example: ja, en-US",
  "admin.i18n.languageNameExample": "Example: Japanese",
  "admin.i18n.activateSelected": "Activate selected messages ({count})",
  "admin.i18n.applyToCurrentScreen": "Apply to current screen",
  "shell.nav.builder": "Promotion Builder",
  "shell.nav.admin": "Admin",
  "shell.nav.promoWizard": "Promo Wizard",
  "shell.nav.createPromo": "Create Promo",
  "shell.nav.visualEditor": "Visual Editor",
  "shell.nav.generated": "Generated UI",
  "shell.theme.toLight": "Switch to light mode",
  "shell.theme.toDark": "Switch to dark mode",
  "admin.i18n.loadFailed": "Could not load language messages.",
  "admin.i18n.saveFailed": "Could not save the language message.",
  "admin.templateLayout.eyebrow": "Promotion Builder defaults",
  "admin.templateLayout.title": "Default template layout",
  "admin.templateLayout.description": "Configure the Promotion Builder background, section height, component placement, and typography. User-specific changes are not written back to the admin template.",
  "admin.templateLayout.revision": "Layout",
  "admin.templateLayout.loading": "Loading layout information.",
  "admin.templateLayout.openEditor": "Open layout editor",
  "admin.templateLayout.readOnlyHelp": "Active versions are read-only. Create a new draft first.",
  "admin.templateLayout.draftHelp": "Edits apply only to the draft and become available in Promotion Builder after template activation.",
  "admin.prompt.imageSize": "Image resolution",
  "admin.prompt.imageSizeHelp": "Long-edge resolution for Gemini images. Applies to new runs.",
  "builder.title": "Promotion page builder",
  "builder.progress.analyzingOverview": "Analyzing the promotion overview.",
  "builder.progress.retryingOverview": "Retrying after a temporary AI response error. ({attempt}/{maxAttempts})",
  "builder.progress.composingStructure": "Composing the promotion structure.",
  "builder.progress.generatingStructure": "Generating the promotion structure.",
  "builder.progress.generatingAssets": "Generating AI images.",
  "builder.progress.preparingPreview": "Preparing Live Preview.",
  "builder.progress.verifyingAssets": "Checking that AI images are ready.",
  "builder.step.designMode": "Select creation method",
  "builder.step.input": "Enter promotion details",
  "builder.step.generate": "Generate design",
  "builder.mode.ai": "Create with AI",
  "builder.mode.advanced": "Custom settings",
  "builder.sectionCount": "{count} sections",
  "common.action.create": "Create",
  "admin.designToken.title": "Design tokens",
  "admin.designToken.scopeNotice": "Manage --promo-* token sets and versions used in promotion output. These are separate from the admin interface --app-* tokens.",
  "admin.designToken.addSet": "Add token set",
  "admin.designToken.setList": "Token sets",
  "admin.designToken.emptySets": "No token sets are registered.",
  "admin.designToken.name": "Token set name",
  "admin.designToken.description": "Description",
  "admin.designToken.settings": "Token set settings",
  "admin.designToken.changeNote": "Change note",
  "admin.designToken.version": "Version",
  "admin.designToken.versionCount": "{count} versions",
  "admin.designToken.createDraft": "Create draft",
  "admin.designToken.validate": "Validate",
  "admin.designToken.csvImport": "Import CSV",
  "admin.designToken.sourceName": "Source filename",
  "admin.designToken.csv": "CSV content",
  "admin.designToken.dryRun": "Validate before import",
  "admin.designToken.import": "Import as draft",
  "admin.designToken.validationErrors": "Validation errors",
  "admin.designToken.preview": "Applied preview",
  "admin.designToken.previewEyebrow": "Event promotion",
  "admin.designToken.previewTitle": "Discover a special offer",
  "admin.designToken.previewBody": "Preview the selected token colors, typography, spacing, and corner styles through real CSS variables.",
  "admin.designToken.previewButton": "Join now",
  "admin.designToken.usage": "Usage",
  "admin.designToken.templateUsage": "{count} linked templates",
  "admin.designToken.aiRunUsage": "{count} AI design runs",
  "admin.designToken.templateGuidance": "To apply this set, select its token version on a draft in Template & Layout Management, then activate the template.",
  "admin.designToken.history": "History",
  "admin.designToken.emptyHistory": "No history is available.",
  "admin.designToken.created": "Design token set created.",
  "admin.designToken.metadataSaved": "Design token set details saved.",
  "admin.designToken.draftCreated": "Design token draft created.",
  "admin.designToken.draftSaved": "Design token draft saved.",
  "admin.designToken.validated": "Design token validation completed.",
  "admin.designToken.activated": "Design token version activated.",
  "admin.designToken.imported": "CSV content imported into the design token draft.",
  "admin.designToken.importValidated": "CSV pre-import validation completed.",
  "admin.designToken.archived": "Design token set archived.",
  "admin.designToken.history.setCreated": "Token set created",
  "admin.designToken.history.setUpdated": "Token set updated",
  "admin.designToken.history.setCloned": "Token set cloned",
  "admin.designToken.history.setArchived": "Token set archived",
  "admin.designToken.history.draftCreated": "Draft created",
  "admin.designToken.history.draftUpdated": "Draft updated",
  "admin.designToken.history.imported": "CSV imported",
  "admin.designToken.history.validated": "Validated",
  "admin.designToken.history.activated": "Activated",
  "admin.designToken.history.rollbackDraftCreated": "Rollback draft created"
  ,"admin.designToken.cloneName": "Cloned token set name"
  ,"admin.designToken.cloned": "Design token set cloned."
  ,"admin.designToken.compare": "Compare versions"
  ,"admin.designToken.compareWith": "Compare with"
  ,"admin.designToken.selectVersion": "Select a version"
  ,"admin.designToken.noDifferences": "No token values changed."
  ,"admin.designToken.comparePreview": "Comparison version"
  ,"admin.designToken.desktop": "Desktop"
  ,"admin.designToken.mobile": "Mobile"
  ,"admin.designToken.applyTemplate": "Draft template to update"
  ,"admin.designToken.selectTemplate": "Select a draft template"
  ,"admin.designToken.applyToDraft": "Apply to draft template"
  ,"admin.designToken.templateApplied": "Design token version applied to the selected draft template."
  ,"admin.designToken.unsavedConfirm": "You have unsaved token value changes. Leave this version?"
  ,"admin.designToken.aiSelectable": "AI selectable"
  ,"admin.designToken.search": "Search tokens"
  ,"admin.designToken.allCategories": "All categories"
  ,"admin.designToken.changedOnly": "Show changed only"
  ,"admin.designToken.category": "Category"
  ,"admin.designToken.token": "Token"
  ,"admin.designToken.type": "Type"
  ,"admin.designToken.value": "Current value"
  ,"admin.designToken.status": "Status"
  ,"admin.designToken.changed": "Changed"
  ,"admin.designToken.normal": "Valid"
  ,"admin.designToken.csvExport": "Export CSV"
  ,"admin.designToken.saveAndApply": "Save and apply"
  ,"admin.designToken.applyTemplates": "Promotion templates to update"
  ,"admin.designToken.templateDraftConflict": "This template already has a draft."
  ,"admin.designToken.selectTemplateRequired": "Select at least one promotion template."
  ,"admin.designToken.csvTypeError": "Only CSV files can be imported."
  ,"admin.designToken.csvSizeError": "CSV files must be 2MB or smaller."
  ,"admin.designToken.saveSuccess": "Design tokens saved and activated."
  ,"admin.designToken.saveApplySuccess": "Design tokens saved and applied to {count} promotion templates."
}$en_baseline$::jsonb)
), source as (
  select baseline.locale, entry.key as message_key, entry.value
  from baseline
  cross join lateral jsonb_each_text(baseline.messages) as entry
), inserted as (
  insert into locale_message_versions (
    locale, message_key, value, status, version, change_note, changed_by
  )
  select source.locale, source.message_key, source.value, 'active',
    coalesce((
      select max(existing.version) + 1
      from locale_message_versions existing
      where existing.locale = source.locale
        and existing.message_key = source.message_key
    ), 1),
    'Initial locale message imported from repository baseline.',
    'baseline-seed'
  from source
  where not exists (
    select 1
    from locale_message_versions active
    where active.locale = source.locale
      and active.message_key = source.message_key
      and active.status = 'active'
  )
  returning locale
)
update locales
set snapshot_revision = snapshot_revision + 1, updated_at = now()
where code in (select distinct locale from inserted);

commit;

select locale, status, count(*)::integer as message_count
from locale_message_versions
where locale in ('ko', 'en')
group by locale, status
order by locale, status;
