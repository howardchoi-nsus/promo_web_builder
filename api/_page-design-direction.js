const {createHash}=require('node:crypto');
const clean=(value,max=12000)=>typeof value==='string'?value.slice(0,max):'';
function designDirection({request='',instruction='',overview={},previous=null}={}){
 const original=clean(request)||clean(previous?.requestText),revisionRequest=clean(instruction,4000);
 const continuing=Boolean(previous&&original===previous.requestText&&revisionRequest);
 const text=continuing?revisionRequest:[original,revisionRequest].filter(Boolean).join('\n');
 const prior=continuing?previous.artDirection||{}:{};
 const choice=(pairs,fallback=null)=>{let best=-1,result=fallback;for(const [pattern,value] of pairs){const re=new RegExp(pattern,'giu');for(const match of text.matchAll(re))if(match.index>=best){best=match.index;result=value;}}return result;};
 const hero=choice([['좌측.{0,12}(?:카피|텍스트)|스플릿|split','split'],['중앙.{0,12}(?:카피|텍스트)|센터형|시네마틱 레이아웃|centered','center']],prior.composition?.hero||null);
 let mood=[['시네마틱|cinematic','cinematic'],['프리미엄|premium','premium'],['대담|bold','bold'],['미니멀|minimal','minimal']].filter(([p])=>new RegExp(p,'iu').test(text)).map(([,v])=>v);
 let palette=[...new Set([...(text.match(/#[0-9a-f]{6}\b/gi)||[]),...(text.match(/\b\d+(?:\.\d+)?(?:px|rem|vh|vw)\b/gi)||[]),...[...text.matchAll(/(?:line-height|행간|줄 높이)\s*[:=]?\s*(\d+(?:\.\d+)?)/gi)].map(match=>match[1])])].slice(0,20);
 let names=[['레드|빨강|\\bred\\b','red'],['골드|금색|\\bgold\\b','gold'],['블랙|검정|\\bblack\\b','black'],['화이트|흰색|\\bwhite\\b','white']].filter(([p])=>new RegExp(p,'iu').test(text)).map(([,v])=>v);
 if(continuing){if(!mood.length)mood=prior.brandMood||[];if(!palette.length)palette=previous.tokenPreferences?.values||[];if(!names.length)names=previous.tokenPreferences?.names||[];}
 const data={briefVersion:2,requestText:original,revisionRequest,artDirection:{brandMood:mood,composition:{hero,contentRhythm:choice([['비대칭|asymmetric','asymmetric'],['균등|equal','equal']],prior.composition?.contentRhythm||null),mobileIntent:prior.composition?.mobileIntent||null},typographyDirection:{headline:choice([['굵은|대담|bold','bold'],['얇은|light weight','light']],prior.typographyDirection?.headline||null),body:'readable supporting copy'},keyVisualDirection:{subject:prior.keyVisualDirection?.subject||null,lighting:mood.includes('cinematic')?'cinematic':null,copySafeArea:hero==='split'?'left':hero==='center'?'lower-center':null,textInImage:false},referenceIds:prior.referenceIds||[],explicitRequirements:continuing?[...(prior.explicitRequirements||[]),revisionRequest].slice(-12):text?[text]:[],inferredPreferences:[],unsupportedRequests:[]},tokenPreferences:{values:palette,names,bold:mood.includes('bold')||/굵은|bold/iu.test(text)},overviewTone:clean(overview.tone||overview.mood,200)};
 data.briefHash=createHash('sha256').update(JSON.stringify(data)).digest('hex');return data;
}
function savedDesignBrief(snapshot){return snapshot?.content?.pageContext?.designBrief||snapshot?.generationMeta?.design||null;}
module.exports={designDirection,savedDesignBrief};
