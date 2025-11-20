
# My AI Studio — Full Package (Proxy + Static Frontend)

This package contains:
- `my_ai_studio.html` — updated frontend (uses relative proxy endpoints `/google/generate` and `/openai/generate`).
- `server.js` — Express proxy server that forwards requests to Google & OpenAI (handles keys from client or server env).
- `package.json`, `Dockerfile`, `.env.example`.

## Quick local run (for desktop + mobile on same network)

1. Extract files and open a terminal in the package folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   Server will run on `http://localhost:3000` by default.

4. Open the frontend:
   - On the same machine: `http://localhost:3000/my_ai_studio.html`
   - On mobile (same Wi‑Fi): find your computer's LAN IP (e.g. `192.168.1.42`) and open `http://192.168.1.42:3000/my_ai_studio.html` in mobile browser.
   - Or open the file directly `my_ai_studio.html` but proxy features require the server.

## How it works (security modes)

- **Mode A (recommended):** enter your Google & OpenAI API keys in the frontend top-bar. Frontend will send keys in the request body to the proxy which will forward to the provider. Keys are not stored server-side unless you set server env vars.
- **Mode B (server-side keys):** set `GOOGLE_API_KEY` and/or `OPENAI_API_KEY` in environment (.env) or server environment. Then frontend does not need to provide keys — server uses its env keys.

## Deploy to cloud (Render / Railway / Heroku / Vercel)

- The app is a single Node.js process. Push this repo to GitHub and connect to Render or Railway;
- Set environment variables on the platform (`GOOGLE_API_KEY`, `OPENAI_API_KEY`) if you prefer server-side keys.
- Build & start commands: `npm install` then `npm start` (or `node server.js`).
- Make sure the platform exposes port 3000 (or use `$PORT`).

## Notes about CORS and browser limitations

- Some provider endpoints may still enforce additional checks; the proxy forwards requests as-is. If a provider rejects requests from server-hosted origins, check provider docs for allowed origins or use provider-recommended SDKs.
- For video generation: this frontend creates keyframes via Gemini Flow + Imagen; it does not render a compressed MP4 on the server. You can stitch frames into a video locally (FFmpeg) or extend server to return a video file (we can add an FFmpeg step).

## Files included (path in this package):
- `/mnt/data/my_ai_studio_package/my_ai_studio.html`

If you want, I can now:
1. Start packaging into a ZIP and provide download link.  
2. Add an FFmpeg step on the server to assemble frames into an MP4 automatically.  
3. Provide step-by-step commands to deploy to Render (with sample Render service settings).

Tell me which next step you want.
