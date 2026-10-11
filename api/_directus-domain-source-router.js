const { builderFlags } = require("./_promo-builder-flags");

function domainSet(value = "") {
  return new Set(String(value).split(",").map((domain) => domain.trim()).filter(Boolean));
}

function sourcePolicy(domain, env = process.env) {
  const flags = builderFlags(env);
  const runtimeDomains = domainSet(env.DIRECTUS_RUNTIME_READ_DOMAINS);
  const shadowDomains = domainSet(env.DIRECTUS_SHADOW_READ_DOMAINS);
  return {
    domain,
    primary: flags.directusIntegration && flags.directusRuntimeRead && runtimeDomains.has(domain) ? "directus" : "internal",
    shadow: flags.directusIntegration && flags.directusShadowRead && shadowDomains.has(domain),
    fallback: "internal",
    writeEnabled: flags.directusIntegration && flags.directusRuntimeWrite && runtimeDomains.has(domain),
  };
}

async function readDomain({ domain, query, internalAdapter, directusAdapter, compare, env = process.env }) {
  const policy = sourcePolicy(domain, env);
  if (policy.primary === "internal") {
    const internal = await internalAdapter.find(query);
    if (policy.shadow) {
      try {
        const directus = await directusAdapter.find(query);
        await compare?.({ domain, query, internal, directus });
      } catch (error) {
        await compare?.({ domain, query, internal, directus: null, error });
      }
    }
    return { value: internal, source: "internal", fallback: false, policy };
  }
  try {
    return { value: await directusAdapter.find(query), source: "directus", fallback: false, policy };
  } catch (error) {
    return { value: await internalAdapter.find(query), source: "internal", fallback: true, fallbackReason: error?.code || "DIRECTUS_READ_FAILED", policy };
  }
}

module.exports = { domainSet, readDomain, sourcePolicy };
