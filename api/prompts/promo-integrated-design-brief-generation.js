import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const prompt = await readPromptFile();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      id: "promo-integrated-design-brief-generation",
      version: "2026-06-30.external-prompt-v1",
      prompt,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Integrated design brief prompt could not be read",
      message: error.message,
    });
  }
}

async function readPromptFile() {
  const filename = "promo-integrated-design-brief-generation.md";
  const candidates = [
    path.join(process.cwd(), "prompts", filename),
    path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "prompts", filename),
  ];

  let lastError;
  for (const promptPath of candidates) {
    try {
      return await readFile(promptPath, "utf8");
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
