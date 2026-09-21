import { timingSafeEqual } from "node:crypto";

function secretsMatch(supplied: string, expected: string) {
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const expectedSecret = String(config.revalidateSecret || "");
  const suppliedSecret = String(getHeader(event, "x-promo-revalidate-secret") || "");
  if (!expectedSecret || !secretsMatch(suppliedSecret, expectedSecret)) {
    throw createError({ statusCode: 401, statusMessage: "Invalid revalidation credential" });
  }

  const body = await readBody<{ slug?: string; locale?: string; reason?: string }>(event);
  const slug = String(body?.slug || "").trim().toLowerCase();
  const locale = String(body?.locale || "ko-KR").trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw createError({ statusCode: 422, statusMessage: "Invalid promotion slug" });
  }

  // Nitro route-rule SWR responses are stored in the nitro/routes cache group.
  // Clear only promotion page entries so future cached routes remain warm.
  const storage = useStorage();
  const cacheKeys = (await storage.getKeys("cache:nitro/routes"))
    .filter((key) => key.includes(":promotions"));
  await Promise.all(cacheKeys.map((key) => storage.removeItem(key)));
  return {
    ok: true,
    slug,
    locale,
    scope: "promotion-routes",
    clearedEntries: cacheKeys.length,
  };
});
