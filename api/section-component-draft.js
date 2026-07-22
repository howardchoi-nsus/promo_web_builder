const wizardContentSectionsHandler = require("./wizard-content-sections");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  return wizardContentSectionsHandler(req, res);
};
