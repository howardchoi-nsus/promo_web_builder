const { createHash } = require("node:crypto");

const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 8192;
const MIME_EXTENSIONS = Object.freeze({
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
});

class ComponentSourceError extends Error {
  constructor(code, message, statusCode = 400) {
    super(message);
    this.name = "ComponentSourceError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function parseDataUrl(value) {
  const match = /^data:([^;,]+);base64,([a-z0-9+/=\r\n]+)$/i.exec(String(value || ""));
  if (!match) throw new ComponentSourceError("INVALID_IMAGE_DATA", "Base64 이미지 데이터가 올바르지 않습니다.");
  const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (!bytes.length) throw new ComponentSourceError("EMPTY_IMAGE", "빈 이미지는 업로드할 수 없습니다.");
  if (bytes.length > MAX_SOURCE_BYTES) throw new ComponentSourceError("IMAGE_TOO_LARGE", "이미지는 10MB 이하여야 합니다.", 413);
  const mimeType = detectMimeType(bytes);
  if (!mimeType || mimeType !== String(match[1]).toLowerCase()) {
    throw new ComponentSourceError("IMAGE_SIGNATURE_MISMATCH", "파일 확장 정보와 실제 이미지 형식이 일치하지 않습니다.");
  }
  const dimensions = readImageDimensions(bytes, mimeType);
  if (!dimensions || dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
    throw new ComponentSourceError("INVALID_IMAGE_DIMENSIONS", `이미지 가로·세로는 각각 ${MAX_DIMENSION}px 이하여야 합니다.`);
  }
  return {
    bytes,
    mimeType,
    extension: MIME_EXTENSIONS[mimeType],
    width: dimensions.width,
    height: dimensions.height,
    contentHash: createHash("sha256").update(bytes).digest("hex"),
  };
}

function detectMimeType(bytes) {
  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9) return "image/jpeg";
  if (bytes.length >= 16 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return "";
}

function readImageDimensions(bytes, mimeType) {
  if (mimeType === "image/png") return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  if (mimeType === "image/jpeg") {
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      const marker = bytes[offset + 1];
      if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
      const length = bytes.readUInt16BE(offset + 2);
      if (length < 2 || offset + 2 + length > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
      }
      offset += 2 + length;
    }
  }
  if (mimeType === "image/webp") {
    const chunk = bytes.toString("ascii", 12, 16);
    if (chunk === "VP8X" && bytes.length >= 30) return {
      width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3),
    };
    if (chunk === "VP8 " && bytes.length >= 30) return {
      width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff,
    };
    if (chunk === "VP8L" && bytes.length >= 25) {
      const packed = bytes.readUInt32LE(21);
      return { width: 1 + (packed & 0x3fff), height: 1 + ((packed >> 14) & 0x3fff) };
    }
  }
  return null;
}

function normalizeCropSpec(value) {
  const source = value && typeof value === "object" ? value : {};
  const number = (key, fallback) => Number.isFinite(Number(source[key])) ? Number(source[key]) : fallback;
  const crop = {
    x: Math.max(0, Math.min(1, number("x", 0))),
    y: Math.max(0, Math.min(1, number("y", 0))),
    width: Math.max(0.02, Math.min(1, number("width", 1))),
    height: Math.max(0.02, Math.min(1, number("height", 1))),
  };
  crop.width = Math.min(crop.width, 1 - crop.x);
  crop.height = Math.min(crop.height, 1 - crop.y);
  if (crop.width < 0.02 || crop.height < 0.02) throw new ComponentSourceError("CROP_TOO_SMALL", "선택 영역이 너무 작습니다.");
  for (const key of ["x", "y", "width", "height"]) crop[key] = Number(crop[key].toFixed(6));
  return crop;
}

module.exports = {
  MAX_SOURCE_BYTES, MAX_DIMENSION, MIME_EXTENSIONS, ComponentSourceError,
  parseDataUrl, detectMimeType, readImageDimensions, normalizeCropSpec,
};
