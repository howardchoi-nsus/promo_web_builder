// Route only explicit viewport layout requests. Content/attachments keep the
// normal conversation pipeline so a mobile mention cannot discard those edits.
export function isMobileLayoutRequest(text,{hasPendingAttachment=false}={}){
 if(hasPendingAttachment)return false;
 const value=String(text||'').trim();
 if(/(?:텍스트|문구|카피|혜택|금액|기간|이미지|사진|영상|섹션\s*(?:추가|삭제)|콘텐츠|content|copy|image|photo|video|offer)/i.test(value))return false;
 return /(?:모바일(?:\s*(?:전용|화면|버전))?(?:도|을|를|로|의|에)?\s*(?:배치|레이아웃|디자인|구성|만들)|mobile\s+(?:layout|design|version)|(?:adapt|adjust|change)\s+(?:the\s+)?(?:layout\s+)?(?:for|to)\s+mobile)/i.test(value);
}
