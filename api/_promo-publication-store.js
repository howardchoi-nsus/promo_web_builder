const { getSql } = require("./_promo-builder-document-store");

function publicationEnvelope(row) {
  if (!row) return null;
  return {
    contractVersion: 1,
    publication: {
      id: row.id,
      documentId: row.document_id,
      slug: row.slug,
      locale: row.locale,
      status: row.status,
      publishedRevision: Number(row.document_revision),
      publishedAt: row.published_at,
      updatedAt: row.updated_at,
    },
    seo: row.seo_json || {},
    renderer: { key: "default-promo-renderer", version: 1 },
    snapshot: row.snapshot_json || {},
    manifest: row.manifest_json || {},
    cache: {
      etag: row.snapshot_hash || "",
      revalidateSeconds: Number(row.revalidate_seconds || 0),
    },
  };
}

async function findPublicationBySlug(sql, { slug, locale, publishedOnly = true }) {
  const rows = await sql`
    select publication.*, version.snapshot_json, version.snapshot_hash
    from promo_builder_publications publication
    join promo_builder_document_versions version
      on version.document_id = publication.document_id
      and version.revision = publication.document_revision
    where publication.slug = ${slug}
      and publication.locale = ${locale}
      and (${publishedOnly} = false or publication.status = 'published')
    limit 1
  `;
  return publicationEnvelope(rows[0]);
}

async function listPublications(sql, ownerSubject) {
  const rows = await sql`
    select publication.*, version.snapshot_json, version.snapshot_hash
    from promo_builder_publications publication
    join promo_builder_documents document on document.id = publication.document_id
    join promo_builder_document_versions version
      on version.document_id = publication.document_id
      and version.revision = publication.document_revision
    where document.owner_subject = ${ownerSubject}
    order by publication.updated_at desc
  `;
  return rows.map(publicationEnvelope);
}

async function findOwnedDocumentRevision(sql, { documentId, documentRevision, ownerSubject }) {
  const rows = await sql`
    select document.id::text as document_id, version.revision as document_revision,
      version.snapshot_json, version.snapshot_hash
    from promo_builder_documents document
    join promo_builder_document_versions version on version.document_id = document.id
    where document.id = ${documentId}::uuid
      and version.revision = ${documentRevision}
      and document.owner_subject = ${ownerSubject}
    limit 1
  `;
  return rows[0] || null;
}

async function findOwnedPublicationById(sql, { id, ownerSubject }) {
  const rows = await sql`
    select publication.*, version.snapshot_json, version.snapshot_hash
    from promo_builder_publications publication
    join promo_builder_documents document on document.id = publication.document_id
    join promo_builder_document_versions version
      on version.document_id = publication.document_id
      and version.revision = publication.document_revision
    where publication.id = ${id}::uuid
      and document.owner_subject = ${ownerSubject}
    limit 1
  `;
  return publicationEnvelope(rows[0]);
}

async function savePublication(sql, input) {
  const rows = await sql`
    insert into promo_builder_publications (
      document_id, document_revision, slug, locale, status, seo_json,
      manifest_json, revalidate_seconds, published_at, created_by
    )
    select
      document.id, ${input.documentRevision}, ${input.slug}, ${input.locale},
      ${input.status}, ${JSON.stringify(input.seo)}::jsonb,
      ${JSON.stringify(input.manifest)}::jsonb, ${input.revalidateSeconds},
      case when ${input.status} = 'published' then now() else null end,
      ${input.ownerSubject}
    from promo_builder_documents document
    where document.id = ${input.documentId}::uuid
      and document.owner_subject = ${input.ownerSubject}
      and document.current_document_revision >= ${input.documentRevision}
      and exists (
        select 1 from promo_builder_document_versions version
        where version.document_id = document.id and version.revision = ${input.documentRevision}
      )
    on conflict (locale, slug) do update set
      document_id = excluded.document_id,
      document_revision = excluded.document_revision,
      status = excluded.status,
      seo_json = excluded.seo_json,
      manifest_json = excluded.manifest_json,
      revalidate_seconds = excluded.revalidate_seconds,
      published_at = case
        when excluded.status = 'published' then coalesce(promo_builder_publications.published_at, now())
        else promo_builder_publications.published_at
      end,
      updated_at = now()
    where promo_builder_publications.created_by = ${input.ownerSubject}
    returning *
  `;
  if (!rows[0]) return null;
  return findPublicationBySlug(sql, {
    slug: rows[0].slug,
    locale: rows[0].locale,
    publishedOnly: false,
  });
}

async function updatePublicationStatus(sql, { id, ownerSubject, status }) {
  const rows = await sql`
    update promo_builder_publications publication
    set status = ${status},
      published_at = case when ${status} = 'published' then coalesce(published_at, now()) else published_at end,
      updated_at = now()
    from promo_builder_documents document
    where publication.id = ${id}::uuid
      and document.id = publication.document_id
      and document.owner_subject = ${ownerSubject}
    returning publication.slug, publication.locale
  `;
  if (!rows[0]) return null;
  return findPublicationBySlug(sql, {
    slug: rows[0].slug,
    locale: rows[0].locale,
    publishedOnly: false,
  });
}

module.exports = {
  getSql,
  publicationEnvelope,
  findPublicationBySlug,
  listPublications,
  findOwnedDocumentRevision,
  findOwnedPublicationById,
  savePublication,
  updatePublicationStatus,
};
