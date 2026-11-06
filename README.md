# THREAD AI — Fashion Mockup Studio

THREAD AI turns a garment reference photo into a professional fashion mockup using Replicate's FLUX Kontext Pro model.

## Requirements
- Node.js 20 or newer
- A Replicate account and API token
- npm

## Run locally
1. Extract this ZIP.
2. Open the extracted `thread-ai` folder in VS Code.
3. In the VS Code terminal run:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env.local`.
5. Open `.env.local` and add your Replicate token:

   ```env
   REPLICATE_API_TOKEN=your_real_token
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

7. Open http://localhost:3000

## Deploy to Vercel
1. Push the project to a GitHub repository.
2. Import that repository in Vercel.
3. In Vercel → Project Settings → Environment Variables, add `REPLICATE_API_TOKEN`.
4. Redeploy.

## Important notes
- Never put your Replicate token in frontend code or commit `.env.local` to GitHub.
- Uploads are limited to 4 MB in this starter project.
- History is stored in the current browser's localStorage only. It does not sync between devices.
- Generated provider URLs may expire. Download images you want to keep.
- AI image generation can change fine details despite preservation instructions. Inspect logos, text, stitching and colours before production use.
- Replicate usage is paid according to your account/model pricing.
- Check the Replicate model's current input schema and pricing before production deployment.
