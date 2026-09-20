import {
  rendererIdentity,
  supportsRenderer,
  supportsSnapshotContract,
} from "./renderer.mjs";

export const PUBLICATION_CONTRACT_VERSION = 1;
export const PUBLICATION_STATUSES = Object.freeze(["draft", "published", "unpublished", "archived"]);
export const PUBLICATION_LOCALE_PATTERN = /^[a-z]{2,3}(?:-[A-Z]{2})?$/;
export const PUBLICATION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function text(value, maximum = 500) {
  return String(value || "").trim().slice(0, maximum);
}

function integer(value, fallback = 0) {
  const normalized = Number(value);
  return Number.isInteger(normalized) && normalized >= 0 ? normalized : fallback;
}

function timestamp(value) {
  const raw = text(value, 64);
  return raw && !Number.isNaN(Date.parse(raw)) ? new Date(raw).toISOString() : "";
}

export function normalizePublicationMetadata(candidate = {}) {
  const source = object(candidate);
  const status = PUBLICATION_STATUSES.includes(source.status) ? source.status : "draft";
  return {
    id: text(source.id, 128),
    documentId: text(source.documentId, 128),
    slug: text(source.slug, 160).toLowerCase(),
    locale: text(source.locale || "ko-KR", 16),
    status,
    publishedRevision: integer(source.publishedRevision),
    publishedAt: timestamp(source.publishedAt),
    updatedAt: timestamp(source.updatedAt),
  };
}

export function normalizePublicationSeo(candidate = {}) {
  const source = object(candidate);
  return {
    title: text(source.title, 120),
    description: text(source.description, 300),
    imageUrl: text(source.imageUrl, 2_048),
    canonicalUrl: text(source.canonicalUrl, 2_048),
    noIndex: Boolean(source.noIndex),
  };
}

export function normalizePublicationCache(candidate = {}) {
  const source = object(candidate);
  return {
    etag: text(source.etag, 160),
    revalidateSeconds: Math.min(86_400, Math.max(0, integer(source.revalidateSeconds, 300))),
  };
}

export function normalizePublishedPromotion(candidate = {}) {
  const source = object(candidate);
  const snapshot = clone(object(source.snapshot));
  const layoutIdentity = object(snapshot.layoutIdentity || snapshot.renderer);
  return {
    contractVersion: PUBLICATION_CONTRACT_VERSION,
    publication: normalizePublicationMetadata(source.publication),
    seo: normalizePublicationSeo(source.seo),
    renderer: rendererIdentity(source.renderer || layoutIdentity),
    snapshot,
    manifest: clone(object(source.manifest)),
    cache: normalizePublicationCache(source.cache),
  };
}

export function validatePublishedPromotion(candidate = {}) {
  const normalized = normalizePublishedPromotion(candidate);
  const errors = [];
  const add = (code, path, message) => errors.push({ code, path, message });
  const publication = normalized.publication;
  const snapshotContractVersion = Number(
    normalized.snapshot.contractVersion || normalized.snapshot.content?.contractVersion,
  );

  if (Number(candidate?.contractVersion || PUBLICATION_CONTRACT_VERSION) !== PUBLICATION_CONTRACT_VERSION) {
    add("UNSUPPORTED_PUBLICATION_CONTRACT", "contractVersion", "Publication contract version is not supported.");
  }
  if (!publication.id) add("PUBLICATION_ID_REQUIRED", "publication.id", "Publication id is required.");
  if (!publication.documentId) add("DOCUMENT_ID_REQUIRED", "publication.documentId", "Document id is required.");
  if (!PUBLICATION_SLUG_PATTERN.test(publication.slug)) {
    add("INVALID_PUBLICATION_SLUG", "publication.slug", "Slug must contain lowercase letters, numbers, and hyphens only.");
  }
  if (!PUBLICATION_LOCALE_PATTERN.test(publication.locale)) {
    add("INVALID_PUBLICATION_LOCALE", "publication.locale", "Locale must use a supported language or language-region format.");
  }
  if (publication.status === "published" && publication.publishedRevision < 1) {
    add("PUBLISHED_REVISION_REQUIRED", "publication.publishedRevision", "A published promotion requires a fixed document revision.");
  }
  if (!supportsRenderer(normalized.renderer)) {
    add("UNSUPPORTED_RENDERER", "renderer", "Publication renderer is not supported.");
  }
  if (!supportsSnapshotContract(snapshotContractVersion)) {
    add("UNSUPPORTED_SNAPSHOT_CONTRACT", "snapshot.contractVersion", "Snapshot contract version is not supported.");
  }
  if (!Array.isArray(normalized.snapshot.content?.sectionSnapshot)) {
    add("SECTION_SNAPSHOT_REQUIRED", "snapshot.content.sectionSnapshot", "Snapshot sections are required.");
  }
  return { ok: errors.length === 0, errors, value: normalized };
}

export function assertPublishedPromotion(candidate = {}) {
  const validation = validatePublishedPromotion(candidate);
  if (!validation.ok) {
    const error = new TypeError("PublishedPromotion validation failed");
    error.code = "INVALID_PUBLISHED_PROMOTION";
    error.validation = validation;
    throw error;
  }
  return validation.value;
}
