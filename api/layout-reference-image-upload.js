const { resolveAdminOwner } = require("./_promo-admin-auth");
const { parseBody } = require("./_wizard-form-templates-store");

const UPLOAD_PREFIX = "layout-reference-uploads/";
const ALLOWED_CONTENT_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAXIMUM_SIZE_IN_BYTES = 10 * 1024 * 1024;

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const { handleUpload } = await import("@vercel/blob/client");
    const result = await handleUpload({
      request: req,
      body: parseBody(req.body),
      onBeforeGenerateToken: async (pathname) => {
        resolveAdminOwner(req, res);
        const normalizedPathname = String(pathname || "").trim();
        if (!normalizedPathname.startsWith(UPLOAD_PREFIX)) {
          throw Object.assign(new Error("레이아웃 레퍼런스 이미지 경로가 올바르지 않습니다."), {
            statusCode: 422,
            code: "LAYOUT_REFERENCE_UPLOAD_PATH_INVALID",
          });
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAXIMUM_SIZE_IN_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.code || "LAYOUT_REFERENCE_UPLOAD_FAILED",
      message: error.message,
    });
  }
};

module.exports.ALLOWED_CONTENT_TYPES = ALLOWED_CONTENT_TYPES;
module.exports.MAXIMUM_SIZE_IN_BYTES = MAXIMUM_SIZE_IN_BYTES;
module.exports.UPLOAD_PREFIX = UPLOAD_PREFIX;
