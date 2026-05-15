# Sandeep Terminal Next.js App

Next.js App Router starter with backend route handlers for Polygon.

## Run locally
1. Copy `.env.example` to `.env.local`.
2. Add your Polygon API key.
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## Deploy to Vercel
1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add `POLYGON_API_KEY` and `POLYGON_BASE_URL` in Vercel Environment Variables.
4. Redeploy.

## Routes
- `/api/health`
- `/api/symbols?q=SPY`
- `/api/quote?symbol=SPY`
- `/api/candles?symbol=SPY`

## Notes
- Route Handlers keep the key server-side.
- Static files belong in `public/`.
- If a route returns `mock`, the Polygon request failed or the env var was not loaded.

## Live data note
- `/api/quote` now prefers Polygon snapshot data.
- `/api/candles` now prefers Polygon aggs data.
- If you still see `mock`, check the deployed env vars and redeploy.
