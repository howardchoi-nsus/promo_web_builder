import assert from 'node:assert/strict';
import {requirementNarrative} from '../visual-editor/src/builder/services/requirement-narrative.mjs';
assert.deepEqual(requirementNarrative(),{paragraphs:[],content:''});
const value=requirementNarrative({promotionPurpose:'기타',promotionPurposeOther:'경품 지급',audience:'신규 고객',mainOffer:'$100 tickets; match up to $600',campaignTone:'활기찬',contentSections:[{title:'혜택'},{title:'참여 방법'}]});
assert.ok(value.paragraphs.includes('핵심 혜택은 다음과 같습니다: $100 tickets; match up to $600'));
assert.equal(value.content,'예정된 콘텐츠는 혜택, 참여 방법 순서로 구성할 예정입니다.');
assert.equal(requirementNarrative({contentSections:[{sectionType:'hero'}]}).content,'');
assert.deepEqual(requirementNarrative({mainOffer:'<script>alert(1)</script>'}).paragraphs,['핵심 혜택은 다음과 같습니다: <script>alert(1)</script>']); // Vue interpolation escapes text.
console.log('Requirement narrative: exact facts, optional fields, real section titles and order passed');
