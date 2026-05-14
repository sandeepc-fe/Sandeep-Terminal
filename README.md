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

## Deploy
- Push to GitHub.
- Import into Vercel.
- Set `POLYGON_API_KEY` and `POLYGON_BASE_URL` in Vercel environment variables.
- Do not put secret keys in client code.

## Routes
- `/api/health`
- `/api/symbols?q=SPY`
- `/api/quote?symbol=SPY`
- `/api/candles?symbol=SPY`

## Notes
- Route Handlers keep the key server-side.
- Static files belong in `public/`.
