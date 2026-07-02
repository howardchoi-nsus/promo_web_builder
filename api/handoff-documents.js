const { readFile, readdir, stat } = require("node:fs/promises");
const path = require("node:path");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const docsDir = path.join(process.cwd(), "docs");
    const requestedFile = String(req.query.file || "").trim();
    const documents = await listHandoffDocuments(docsDir);

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");

    if (!requestedFile) {
      return res.status(200).json({ documents });
    }

    const document = documents.find((item) => item.file === requestedFile);
    if (!document) {
      return res.status(404).json({ error: "Handoff document not found", file: requestedFile });
    }

    const markdown = await readFile(path.join(docsDir, document.file), "utf8");
    return res.status(200).json({ document: { ...document, markdown } });
  } catch (error) {
    return res.status(500).json({
      error: "Handoff document API failed",
      message: error.message,
    });
  }
};

async function listHandoffDocuments(docsDir) {
  const names = await readdir(docsDir);
  const handoffNames = names
    .filter((name) => /^handoff-\d{4}-\d{2}-\d{2}\.md$/i.test(name))
    .sort((a, b) => b.localeCompare(a));

  const documents = [];
  for (const file of handoffNames) {
    const fileStat = await stat(path.join(docsDir, file));
    documents.push({
      file,
      label: file.replace(/^handoff-/, "").replace(/\.md$/i, ""),
      updatedAt: fileStat.mtime.toISOString(),
      size: fileStat.size,
    });
  }
  return documents;
}
