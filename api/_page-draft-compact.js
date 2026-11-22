// Compact provider transport only. Persisted PageSchema stays unchanged.
const {runtimeSchema,TYPES}=require('../shared/page-schema/contract.cjs');
const DEFAULT_LAYOUT={direction:'column',columns:[],align:'stretch',justify:'start',width:'fill',columnSpan:1};
const EMPTY_SPACING={gap:null,padding:null,margin:null};
const clone=value=>structuredClone(value);
const nullable=value=>({anyOf:[value,{type:'null'}]});
function compactRegionSchema(context,region){
 const schema=runtimeSchema(context),defs=schema.$defs;
 for(const type of TYPES){
  const original=defs[type];const branches=original.anyOf||[original];
  const candidates=type==='container'?branches.filter(b=>b.properties.role.const==='group'):branches;
  const compact=candidates.map(source=>{
   const branch=clone(source),roles=clone(branch.properties.styles.properties.base);roles.maxItems=Math.min(roles.maxItems??24,8);
   const variant={type:'object',additionalProperties:false,properties:{layout:nullable({$ref:'#/$defs/layout'}),styles:nullable(roles),spacing:nullable({$ref:'#/$defs/spacingValues'})},required:['layout','styles','spacing']};
   branch.properties.layout=type==='grid'?{$ref:'#/$defs/layout'}:nullable({$ref:'#/$defs/layout'});
   branch.properties.layout.description='null uses the generic column/stretch/start/fill/one-span layout; use explicit geometry when required.';
   branch.properties.styles=roles;branch.properties.styles.description='Registered base style role keys only. Responsive overrides are separate.';branch.properties.spacing=nullable({$ref:'#/$defs/spacingValues'});branch.properties.tablet=nullable(variant);branch.properties.mobile=nullable(variant);branch.properties.tablet.description='null uses safe responsive layout defaults and inherited base styles.';branch.properties.mobile.description='null uses safe mobile defaults and inherited base styles.';
   if(branch.properties.children)branch.properties.children.items={$ref:'#/$defs/compactNode'};
   branch.required=Object.keys(branch.properties);return branch;
  });
  defs['compact_'+type]=compact.length===1?compact[0]:{anyOf:compact};
 }
 defs.compactNode={anyOf:defs.node.anyOf.map(ref=>({$ref:ref.$ref.replace('#/$defs/','#/$defs/compact_')}))};
 const root=clone(defs.container.anyOf.find(b=>region.shell.role==='group'?b.properties.role.const==='group':b.properties.role.const!=='group'));
 root.properties.id={type:'string',const:region.shell.id};root.properties.children.items={$ref:'#/$defs/compactNode'};defs.regionRoot=root;
 return {type:'object',additionalProperties:false,$defs:defs,properties:{node:{$ref:'#/$defs/regionRoot'},sourceAssignments:{type:'array',maxItems:48,items:{type:'object',additionalProperties:false,properties:{nodeId:{type:'string'},sourceId:{type:'string',minLength:1,maxLength:160}},required:['nodeId','sourceId']}},mediaRequests:schema.properties.mediaRequests},required:['node','sourceAssignments','mediaRequests']};
}
function hydrateNode(value){
 const {layout,styles,spacing,tablet,mobile,children,...other}=value;
 const node={...clone(other),layout:{desktop:clone(layout||DEFAULT_LAYOUT),tablet:clone(tablet?.layout??null),mobile:clone(mobile?.layout??null)},styles:{base:clone(styles),tablet:clone(tablet?.styles??null),mobile:clone(mobile?.styles??null),spacing:{base:clone(spacing||EMPTY_SPACING),tablet:clone(tablet?.spacing??null),mobile:clone(mobile?.spacing??null)}}};
 if(value.children)node.children=value.children.map(hydrateNode);return node;
}
function hydrateRegion(result){return {...clone(result),node:{...clone(result.node),children:result.node.children.map(hydrateNode)}};}
// Used by regression fixtures to express existing canonical nodes in the wire form.
function compactNode(node){const {layout,styles,children,...other}=clone(node);const variant=view=>layout[view]!==null||styles[view]!==null||styles.spacing?.[view]!=null?{layout:layout[view],styles:styles[view],spacing:styles.spacing?.[view]??null}:null;const def=JSON.stringify(layout.desktop)===JSON.stringify(DEFAULT_LAYOUT);return {...other,layout:def&&node.type!=='grid'?null:layout.desktop,styles:styles.base,spacing:styles.spacing?.base&&Object.values(styles.spacing.base).some(v=>v!==null)?styles.spacing.base:null,tablet:variant('tablet'),mobile:variant('mobile'),...(children?{children:children.map(compactNode)}:{})};}
function compactRegion(result){return {...clone(result),node:{...clone(result.node),children:result.node.children.map(compactNode)}};}
module.exports={compactRegionSchema,hydrateRegion,compactRegion,DEFAULT_LAYOUT};
