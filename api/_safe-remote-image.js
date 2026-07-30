const dns = require("node:dns/promises");
const net = require("node:net");

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_REDIRECTS = 2;

class RemoteImageError extends Error {
  constructor(message, code = "REMOTE_IMAGE_REJECTED") {
    super(message);
    this.name = "RemoteImageError";
    this.code = code;
  }
}

async function fetchRemoteImage(input, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const lookup = options.lookup || dns.lookup;
  const maxBytes = positiveInteger(options.maxBytes, 24 * 1024 * 1024);
  const timeoutMs = positiveInteger(options.timeoutMs, DEFAULT_TIMEOUT_MS);
  const maxRedirects = positiveInteger(options.maxRedirects, DEFAULT_MAX_REDIRECTS);
  const allowedHosts = options.allowedHosts || remoteImageAllowedHosts();
  let currentUrl = String(input || "").trim();

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    const parsed = await validateRemoteImageUrl(currentUrl, { allowedHosts, lookup });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(parsed.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: { Accept: "image/png,image/jpeg,image/webp" },
      });

      if (isRedirect(response.status)) {
        if (redirectCount >= maxRedirects) {
          throw new RemoteImageError("Remote image redirected too many times", "REMOTE_IMAGE_REDIRECT_LIMIT");
        }
        const location = response.headers.get("location");
        if (!location) throw new RemoteImageError("Remote image redirect has no location");
        currentUrl = new URL(location, parsed).toString();
        continue;
      }

      if (!response.ok) {
        throw new RemoteImageError(`Remote image request failed with status ${response.status}`, "REMOTE_IMAGE_FETCH_FAILED");
      }

      const declaredLength = Number(response.headers.get("content-length") || 0);
      if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
        throw new RemoteImageError(`Remote image exceeds ${maxBytes} bytes`, "REMOTE_IMAGE_TOO_LARGE");
      }

      const bytes = await readResponseBytes(response, maxBytes);
      return {
        bytes,
        contentType: response.headers.get("content-type") || "",
        sourceUrl: parsed.toString(),
      };
    } catch (error) {
      if (error instanceof RemoteImageError) throw error;
      if (error.name === "AbortError") {
        throw new RemoteImageError(`Remote image download timed out after ${timeoutMs}ms`, "REMOTE_IMAGE_TIMEOUT");
      }
      throw new RemoteImageError(`Remote image download failed: ${error.message}`, "REMOTE_IMAGE_FETCH_FAILED");
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new RemoteImageError("Remote image request could not be completed");
}

async function validateRemoteImageUrl(input, options = {}) {
  let parsed;
  try {
    parsed = new URL(String(input || ""));
  } catch {
    throw new RemoteImageError("Remote image URL is invalid");
  }

  if (parsed.protocol !== "https:") {
    throw new RemoteImageError("Remote image URL must use HTTPS");
  }
  if (parsed.username || parsed.password) {
    throw new RemoteImageError("Remote image URL must not include credentials");
  }
  if (parsed.port && parsed.port !== "443") {
    throw new RemoteImageError("Remote image URL must use the standard HTTPS port");
  }

  const allowedHosts = normalizeHosts(options.allowedHosts || remoteImageAllowedHosts());
  if (!hostAllowed(parsed.hostname, allowedHosts)) {
    throw new RemoteImageError("Remote image host is not allowed", "REMOTE_IMAGE_HOST_NOT_ALLOWED");
  }

  const lookup = options.lookup || dns.lookup;
  let addresses;
  try {
    addresses = await lookup(parsed.hostname, { all: true, verbatim: true });
  } catch (error) {
    throw new RemoteImageError(`Remote image host lookup failed: ${error.message}`, "REMOTE_IMAGE_DNS_FAILED");
  }
  if (!Array.isArray(addresses) || !addresses.length) {
    throw new RemoteImageError("Remote image host did not resolve");
  }
  if (addresses.some((entry) => !isPublicIpAddress(entry.address))) {
    throw new RemoteImageError("Remote image host resolves to a non-public address", "REMOTE_IMAGE_PRIVATE_ADDRESS");
  }

  return parsed;
}

async function readResponseBytes(response, maxBytes) {
  if (!response.body || typeof response.body.getReader !== "function") {
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > maxBytes) {
      throw new RemoteImageError(`Remote image exceeds ${maxBytes} bytes`, "REMOTE_IMAGE_TOO_LARGE");
    }
    return bytes;
  }

  const chunks = [];
  let total = 0;
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new RemoteImageError(`Remote image exceeds ${maxBytes} bytes`, "REMOTE_IMAGE_TOO_LARGE");
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, total);
}

function isPublicIpAddress(address) {
  const version = net.isIP(String(address || ""));
  if (version === 4) return isPublicIpv4(address);
  if (version === 6) return isPublicIpv6(address);
  return false;
}

function isPublicIpv4(address) {
  const octets = String(address).split(".").map(Number);
  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) return false;
  const [a, b, c] = octets;
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
  if (a === 100 && b >= 64 && b <= 127) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && b === 168) return false;
  if (a === 192 && b === 0 && (c === 0 || c === 2)) return false;
  if (a === 198 && (b === 18 || b === 19)) return false;
  if (a === 198 && b === 51 && c === 100) return false;
  if (a === 203 && b === 0 && c === 113) return false;
  return true;
}

function isPublicIpv6(address) {
  const normalized = String(address || "").toLowerCase().split("%")[0];
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(normalized);
  if (mapped) return isPublicIpv4(mapped[1]);

  const groups = expandIpv6Groups(normalized);
  if (!groups) return false;
  const [first, second] = groups;
  const isMappedHex = groups.slice(0, 5).every((value) => value === 0)
    && groups[5] === 0xffff;
  if (isMappedHex) {
    const ipv4 = [
      groups[6] >> 8,
      groups[6] & 0xff,
      groups[7] >> 8,
      groups[7] & 0xff,
    ].join(".");
    return isPublicIpv4(ipv4);
  }

  if (groups.every((value) => value === 0) || groups.slice(0, 7).every((value) => value === 0) && groups[7] === 1) return false;
  if ((first & 0xfe00) === 0xfc00) return false;
  if ((first & 0xffc0) === 0xfe80) return false;
  if ((first & 0xff00) === 0xff00) return false;
  if (first === 0x2001 && second === 0x0db8) return false;
  return true;
}

function expandIpv6Groups(value) {
  if (!value || (value.match(/::/g) || []).length > 1) return null;
  let input = value;
  const dotted = input.match(/(?:^|:)(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted) {
    const octets = dotted[1].split(".").map(Number);
    if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null;
    input = input.slice(0, -dotted[1].length)
      + ((octets[0] << 8) | octets[1]).toString(16)
      + ":"
      + ((octets[2] << 8) | octets[3]).toString(16);
  }

  const [headText, tailText = ""] = input.split("::");
  const head = headText ? headText.split(":") : [];
  const tail = tailText ? tailText.split(":") : [];
  const omitted = input.includes("::") ? 8 - head.length - tail.length : 0;
  if (omitted < 0 || (!input.includes("::") && head.length !== 8)) return null;
  const groups = [
    ...head,
    ...Array(omitted).fill("0"),
    ...tail,
  ].map((part) => /^[0-9a-f]{1,4}$/.test(part) ? Number.parseInt(part, 16) : NaN);
  return groups.length === 8 && groups.every(Number.isFinite) ? groups : null;
}

function remoteImageAllowedHosts() {
  return normalizeHosts(String(process.env.PROMO_DESIGN_IMAGE_HOST_ALLOWLIST || "").split(","));
}

function normalizeHosts(values) {
  return Array.from(new Set(
    (Array.isArray(values) ? values : [values])
      .map((value) => String(value || "").trim().toLowerCase().replace(/^\./, ""))
      .filter(Boolean),
  ));
}

function hostAllowed(hostname, allowedHosts) {
  const host = String(hostname || "").toLowerCase();
  return allowedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

function isRedirect(status) {
  return [301, 302, 303, 307, 308].includes(Number(status));
}

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

module.exports = {
  RemoteImageError,
  fetchRemoteImage,
  hostAllowed,
  isPublicIpAddress,
  validateRemoteImageUrl,
};
