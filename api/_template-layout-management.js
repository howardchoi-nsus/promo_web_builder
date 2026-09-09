const { builderFlags } = require("./_promo-builder-flags");

const DISABLED_CODE = "TEMPLATE_LAYOUT_MANAGEMENT_DISABLED";

function templateLayoutManagementEnabled(env = process.env) {
  return builderFlags(env).templateLayoutManagement;
}

function rejectTemplateLayoutManagement(res) {
  return res.status(409).json({
    error: "Template and page layout management is disabled",
    code: DISABLED_CODE,
    message: "기존 템플릿은 계속 사용할 수 있지만 신규 생성과 변경은 비활성화되어 있습니다.",
  });
}

function allowTemplateLayoutWrite(res, env = process.env) {
  if (templateLayoutManagementEnabled(env)) return true;
  rejectTemplateLayoutManagement(res);
  return false;
}

module.exports = {
  DISABLED_CODE,
  templateLayoutManagementEnabled,
  rejectTemplateLayoutManagement,
  allowTemplateLayoutWrite,
};
