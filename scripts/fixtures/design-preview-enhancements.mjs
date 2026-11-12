import {fixture,context as original} from './page-schema.mjs';
import {pageStyleRoles} from '../../shared/token-usage-policy.mjs';
export function designFixture({pending=true}={}){
 const context=structuredClone(original);context.styleChoicesVersion=1;
 const tokens=[['--typography-title-2xl-font-size','48px','font-size'],['--typography-title-md-font-size','28px','font-size'],['--typography-body-sm-font-size','14px','font-size'],['--color-brand-500','#ff7777','color'],['--color-neutral-100','#eeeeee','color'],['--border-card-color','#999999','border-color'],['--border-width-md','2px','border-width'],['--border-style-solid','solid','border-style'],['--hero-overlay','linear-gradient(transparent, #000000)','background-image']];
 for(const [name,value,property] of tokens){context.tokenValues[name]=value;context.tokenCatalog.push({name,tokenKey:name,value,state:'active',cssProperties:[property]});}
 const role=name=>{const found=pageStyleRoles(context).find(rule=>rule.registeredVariant&&rule.token===name);if(!found)throw Error('Missing registered variant '+name);return found.key;};
 const page=fixture('example-editorial');
 function visit(node){node.styles.spacing={base:{gap:null,padding:null,margin:null},tablet:null,mobile:null};if(node.type==='container')node.overlayRole=null;if(node.type==='image')node.presentation='content';for(const child of node.children||[])visit(child);}
 visit(page.root);let heading;const find=n=>{if(n.type==='text'&&n.role==='heading'&&!heading)heading=n;for(const c of n.children||[])find(c);};find(page.root);
 heading.styles.base=[role('--typography-title-2xl-font-size'),role('--color-brand-500')];
 const secondary=structuredClone(heading);secondary.id='secondary_heading';secondary.headingLevel=2;secondary.contentMode='editorial';secondary.text='등록 스타일의 두 번째 제목';secondary.sourceIds=[];secondary.styles.base=[role('--typography-title-md-font-size')];
 const image={type:'image',id:'design_image',layout:structuredClone(page.root.layout),styles:{base:[],tablet:null,mobile:null,spacing:{base:{gap:null,padding:null,margin:null},tablet:null,mobile:null}},sourceIds:[],assetId:pending?null:'image_ready',requestId:pending?'design_request':null,alt:'프로모션 키비주얼',decorative:false,aspectRatio:'16:9',fit:'cover',presentation:'background'};
 const icon={type:'icon',id:'design_icon',layout:structuredClone(page.root.layout),styles:{base:[],tablet:null,mobile:null,spacing:{base:{gap:null,padding:null,margin:null},tablet:null,mobile:null}},sourceIds:[],iconId:'icon_registered',label:'혜택',decorative:false};
 context.icons.icon_registered={text:'♠',label:'등록 아이콘'};
 const divider={type:'divider',id:'design_divider',layout:structuredClone(page.root.layout),styles:structuredClone(icon.styles),sourceIds:[],direction:'horizontal'};
 delete context.usagePolicy.bindings['divider.color'];delete context.usagePolicy.bindings['divider.width'];
 page.root.children.push(secondary,icon,divider,image);
 const roles=pageStyleRoles(context);
 for(const property of ['border-color','border-width','border-style']){const r=roles.find(r=>r.target==='page'&&r.property===property&&r.registeredVariant);page.root.styles.base.push(r.key);}
 page.root.overlayRole=roles.find(r=>r.target==='page'&&r.property==='background-image'&&r.registeredVariant).key;
 page.mediaRequests=pending?[{id:'design_request',nodeId:'design_image',kind:'image',regenerate:false,intent:'절제된 프로모션 배경',aspectRatio:'16:9',sourceIds:[]}]:[];
 if(!pending)context.assets.image_ready={kind:'image',url:'/design-fixture.png',width:1,height:1,displayAspectRatio:'16:9'};
 return {page,context,role};
}
export const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWl8AAAAASUVORK5CYII=','base64');
