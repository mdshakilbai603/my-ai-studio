import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static frontend (my_ai_studio.html and assets)
app.use(express.static(path.join(__dirname, "public")));

// Health
app.get("/_health", (req, res) => res.json({ ok: true }));

// Generic Google proxy endpoint
app.post("/google/generate", async (req, res) => {
  try {
    // client can send: { endpoint, key, body }
    const { endpoint, key, body } = req.body || {};
    const apiKey = (key && key.trim()) || process.env.GOOGLE_API_KEY;
    if(!apiKey) return res.status(400).json({ error: "Missing Google API key. Provide in body.key or set GOOGLE_API_KEY on server." });

    // If frontend passed 'endpoint' as full google url, use that; else require endpoint or infer from body
    const url = endpoint ? endpoint + "?key=" + encodeURIComponent(apiKey) : null;
    if(!url) return res.status(400).json({ error: "Missing 'endpoint' in request body." });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    });
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();
    // Try parse JSON
    try {
      const j = JSON.parse(text);
      res.json(j);
    } catch (e) {
      // fallback to raw text
      res.type(contentType.includes("json") ? "application/json" : "text/plain").send(text);
    }
  } catch (err) {
    console.error("Google proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Generic OpenAI proxy endpoint
app.post("/openai/generate", async (req, res) => {
  try {
    const { endpoint, key, body } = req.body || {};
    const apiKey = (key && key.trim()) || process.env.OPENAI_API_KEY;
    if(!apiKey) return res.status(400).json({ error: "Missing OpenAI API key. Provide in body.key or set OPENAI_API_KEY on server." });
    if(!endpoint) return res.status(400).json({ error: "Missing 'endpoint' in request body." });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify(body || {})
    });
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();
    try {
      const j = JSON.parse(text);
      res.json(j);
    } catch (e) {
      res.type(contentType.includes("json") ? "application/json" : "text/plain").send(text);
    }
  } catch (err) {
    console.error("OpenAI proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fallback: serve index.html (my_ai_studio.html) if route not found — useful for single-page usage
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "my_ai_studio.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy + static server running on http://localhost:${port}`));
