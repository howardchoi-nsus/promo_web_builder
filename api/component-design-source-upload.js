const { parseBody } = require("./_item-components-store");
const { MAX_SOURCE_BYTES, MIME_EXTENSIONS, ComponentSourceError } = require("./_component-design-source-contract");
const { resolveBuilderOwner } = require("./_promo-builder-auth");

const UPLOAD_PREFIX = "component-source-uploads/";
const ALLOWED_CONTENT_TYPES = Object.freeze(Object.keys(MIME_EXTENSIONS));

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
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const owner = resolveBuilderOwner(req, res, { issue: false });
        const normalizedPathname = String(pathname || "").trim();
        if (!normalizedPathname.startsWith(UPLOAD_PREFIX)) {
          throw new ComponentSourceError("INVALID_UPLOAD_PATH", "이미지 업로드 경로가 올바르지 않습니다.");
        }

        let payload = {};
        if (clientPayload) {
          try { payload = JSON.parse(clientPayload); } catch {
            throw new ComponentSourceError("INVALID_UPLOAD_PAYLOAD", "이미지 업로드 정보가 올바르지 않습니다.");
          }
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_SOURCE_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            ownerSubject: owner.ownerSubject,
            fileName: String(payload.fileName || "").slice(0, 180),
          }),
        };
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    const known = error instanceof ComponentSourceError;
    return res.status(known ? error.statusCode : (error.statusCode || 500)).json({
      error: known ? error.code : (error.code || "Component source upload failed"),
      message: error.message,
    });
  }
};

module.exports.UPLOAD_PREFIX = UPLOAD_PREFIX;
