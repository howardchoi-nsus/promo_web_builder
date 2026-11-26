import {nodes,textContent} from '../../../../shared/page-schema/runtime.mjs';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,character=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',
}[character]));

function tagFor(node){
  if(node.type==='text'&&Number(node.headingLevel)>=1&&Number(node.headingLevel)<=6)return `h${Number(node.headingLevel)}`;
  if(node.type==='text')return 'p';
  if(node.type==='image')return 'img';
  if(node.type==='button')return 'a';
  if(node.type==='divider')return 'hr';
  if(node.role==='section')return 'section';
  return 'div';
}

function serializeNode(node,context){
  const tag=tagFor(node),editable=node.type==='text'&&node.contentMode==='editorial';
  const attributes=` data-page-node-id="${escapeHtml(node.id)}" data-page-node-type="${escapeHtml(node.type)}"${editable?' data-html-editable="text"':''}`;
  if(node.type==='image'){
    const source=context?.assets?.[node.assetId]?.url||'';
    return `<img${attributes} src="${escapeHtml(source)}" alt="${escapeHtml(node.alt||'')}">`;
  }
  if(node.type==='divider')return `<hr${attributes}>`;
  const content=node.type==='text'
    ? escapeHtml(textContent(node,context))
    : (node.children||[]).map(child=>serializeNode(child,context)).join('\n');
  return `<${tag}${attributes}>${content}</${tag}>`;
}

export function editorHtmlSource(page,context){
  return `<!-- 문구와 이미지 alt만 수정할 수 있습니다. data-page-node-* 속성과 구조는 유지해 주세요. -->\n${serializeNode(page.root,context)}`;
}

export function applyEditorHtmlSource(page,context,source,{parse}={}){
  if(typeof source!=='string'||!source.trim())throw Error('HTML 소스를 입력해 주세요.');
  const parseHtml=parse||((html)=>new DOMParser().parseFromString(html,'text/html'));
  const document=parseHtml(source);
  if(document.querySelector('parsererror'))throw Error('HTML 문법을 확인해 주세요.');
  if(document.querySelector('script,style,iframe,object,embed,form,link,meta,base'))throw Error('스크립트·스타일·프레임·폼 태그는 사용할 수 없습니다.');
  const elements=[...document.querySelectorAll('[data-page-node-id]')];
  const pageNodes=nodes(page),expectedIds=pageNodes.map(node=>node.id),actualIds=elements.map(element=>element.getAttribute('data-page-node-id'));
  if(actualIds.length!==new Set(actualIds).size)throw Error('중복된 data-page-node-id가 있습니다.');
  if(JSON.stringify(actualIds)!==JSON.stringify(expectedIds))throw Error('HTML 요소 구조와 data-page-node-id는 변경할 수 없습니다.');
  const expectedParent=new Map();
  for(const parent of pageNodes)for(const child of parent.children||[])expectedParent.set(child.id,parent.id);
  for(const element of elements){
    const id=element.getAttribute('data-page-node-id'),original=pageNodes.find(node=>node.id===id);
    if(!original||element.getAttribute('data-page-node-type')!==original.type||element.tagName.toLowerCase()!==tagFor(original))throw Error('HTML 태그와 data-page-node-type은 변경할 수 없습니다.');
    const parentId=element.parentElement?.closest?.('[data-page-node-id]')?.getAttribute('data-page-node-id')||null;
    if(parentId!==(expectedParent.get(id)||null))throw Error('HTML 요소의 부모 구조는 변경할 수 없습니다.');
    for(const attribute of [...element.attributes]){
      const name=attribute.name.toLowerCase();
      if(name==='style'||name==='srcdoc'||name.startsWith('on'))throw Error('인라인 스타일과 이벤트 속성은 사용할 수 없습니다.');
    }
  }
  const copy=structuredClone(page);
  const copyById=new Map(nodes(copy).map(node=>[node.id,node]));
  const originalById=new Map(pageNodes.map(node=>[node.id,node]));
  for(const element of elements){
    const id=element.getAttribute('data-page-node-id'),node=copyById.get(id),original=originalById.get(id);
    if(node.type==='text'){
      const next=element.textContent||'';
      if(node.contentMode==='editorial')node.text=next;
      else if(next!==textContent(original,context))throw Error('승인된 원문은 HTML에서 변경할 수 없습니다.');
    }
    if(node.type==='image')node.alt=element.getAttribute('alt')||'';
  }
  return copy;
}
