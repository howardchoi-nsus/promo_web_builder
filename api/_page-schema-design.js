const {createHash}=require('node:crypto');
const guidelines=require('../shared/page-schema/design-guidelines.json');
const {walk}=require('../shared/page-schema/contract.cjs');
function shape(node){return {type:node.type,role:node.role||null,purpose:node.purpose||null,layout:node.layout,...(node.presentation==='background'?{presentation:'background'}:{}),children:(node.children||[]).map(shape)};}
function canonical(value){
 if(Array.isArray(value))return value.map(canonical);
 if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
 return value;
}
// PostgreSQL jsonb does not preserve object key order. Child/column array order
// still carries layout meaning and must remain significant.
function structuralHash(page){return createHash('sha256').update(JSON.stringify(canonical(shape(page.root)))).digest('hex');}
function compositionOutline(page){
 let remaining=24;
 const visit=node=>{if(!node||remaining--<=0)return null;return {type:node.type,role:node.role||null,purpose:node.purpose||null,direction:node.layout?.desktop?.direction,columns:node.layout?.desktop?.columns,children:(node.children||[]).map(visit).filter(Boolean)};};
 return {fingerprint:structuralHash(page),outline:visit(page.root)};
}
function designBrief(overview,{requestId,recentStructures=[],recentCompositions=[]}={}){
 const sections=overview.contentSections||[];
 return {guidelinesVersion:guidelines.version,seed:requestId||null,goal:(overview.promotionPurpose==='기타'?overview.promotionPurposeOther:overview.promotionPurpose)||'Communicate the supplied promotion',audience:overview.audience||null,
   primaryAction:overview.ctaLabel||sections.flatMap(s=>[s.cta?.label,...(s.items||[]).map(item=>item.ctaLabel)]).find(Boolean)||null,
   material:{contentSections:sections.length,hasImageIntent:sections.some(s=>s.media?.imageIntent||s.items?.some(i=>i.imageIntent)),hasRequiredLegalCopy:Boolean(overview.legalInformation?.length)},
   recentStructures:recentStructures.slice(0,5),recentCompositions:recentCompositions.slice(0,3),principles:guidelines.principles,qualityTiers:guidelines.qualityTiers};
}
function reviewDesign(page,{recentStructures=[],preserveLayout=false}={}){
 const warnings=[],sections=[],groups=[];
 walk(page.root,({node})=>{if(node.type==='container'&&node.role==='section')sections.push(node);if(['container','grid','stack','card'].includes(node.type)&&!(node.children||[]).length)groups.push(node.id);});
 if(!preserveLayout&&recentStructures.includes(structuralHash(page)))warnings.push({code:'DESIGN_STRUCTURE_REPEATED',tier:'designWarning',level:'warning',message:'최근 결과와 같은 구도입니다. 요청에 적합한지 확인하고 필요하면 다른 구도로 재생성해 주세요.'});
 if(groups.length)warnings.push({code:'DESIGN_EMPTY_GROUPS',tier:'designWarning',level:'warning',path:groups.join(','),message:'내용이 없는 구성 영역이 있습니다. 불필요한 빈 공간인지 확인해 주세요.'});
 const simple=n=>JSON.stringify({type:n.type,children:(n.children||[]).map(c=>({type:c.type,columns:c.layout?.desktop?.columns,children:(c.children||[]).map(x=>x.type)}))});
 const counts=new Map();sections.forEach(n=>counts.set(simple(n),(counts.get(simple(n))||0)+1));
 if([...counts.values()].some(n=>n>=3))warnings.push({code:'DESIGN_SECTION_PATTERN_REPEATED',tier:'designWarning',level:'warning',message:'같은 섹션 구도가 반복됩니다. 반복이 콘텐츠 이해에 필요한지 확인해 주세요.'});
 return {guidelinesVersion:guidelines.version,blockingCount:0,designWarnings:warnings,finish:[]};
}
module.exports={designBrief,reviewDesign,structuralHash,compositionOutline,guidelines};
