module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  return res.status(409).json({ error: '공통 디자인 토큰 라이브러리는 복제하지 않습니다. 버전 이력을 사용하세요.' });
};
