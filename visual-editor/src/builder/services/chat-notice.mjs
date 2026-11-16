export function chatNotice(warning) {
  if (!warning || /ASSET|IMAGE/.test(warning.code || '')) return null;
  const text = warning.code === 'UNCONFIRMED_OPTIONAL_CONTENT_OMITTED'
    ? '아직 확정되지 않은 조건이나 안내 문구는 이번 출력에서 제외했습니다. 입력하신 내용을 바탕으로 생성을 이어갑니다. 포함할 내용이 있으면 채팅으로 알려주세요.'
    : String(warning.message || '').trim();
  return text ? {text,metadata:{noticeCode:warning.code || '',noticeDetails:warning.message || ''}} : null;
}
