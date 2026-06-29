import { readFile } from "node:fs/promises";
import path from "node:path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const promptPath = path.join(process.cwd(), "prompts", "promo-ui-design-image-generation.md");
    const prompt = await readFile(promptPath, "utf8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      id: "promo-ui-design-image-generation",
      version: "2026-06-29.external-prompt-v1",
      prompt,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to load prompt",
      message: error.message,
    });
  }
}
