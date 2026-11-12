const {resolveAdminOwner}=require('./_promo-admin-auth');
const {getSql,parseBody}=require('./_prompt-template-store');
const {listSkills,readSkillVersion,saveSkill,setSkillActive}=require('./_agent-skill-store');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');
 try{
  if(!['GET','POST','PATCH'].includes(req.method)){res.setHeader('Allow','GET, POST, PATCH');return res.status(405).json({error:'Method not allowed'});}
  const owner=resolveAdminOwner(req,res),sql=getSql();
  if(req.method==='GET')return res.status(200).json(req.query?.versionId?{ok:true,version:await readSkillVersion(sql,req.query.versionId)}:{ok:true,skills:await listSkills(sql)});
  const body=parseBody(req.body);
  if(req.method==='PATCH')return res.status(200).json({ok:true,skill:await setSkillActive(sql,body,owner.ownerSubject)});
  return res.status(201).json({ok:true,version:await saveSkill(sql,body,owner.ownerSubject)});
 }catch(error){return res.status(error.statusCode||500).json({error:error.message,code:error.code||'SKILL_REGISTRY_FAILED'});}
};
