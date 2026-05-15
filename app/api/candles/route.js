export const dynamic = 'force-dynamic';

export async function GET(request) {
  const symbol = new URL(request.url).searchParams.get('symbol')?.toUpperCase() || 'SPY';
  const key = process.env.POLYGON_API_KEY;
  const base = process.env.POLYGON_BASE_URL || 'https://api.polygon.io';
  const fallback = Array.from({ length: 60 }, (_, i) => ({
    t: Date.now() - (59 - i) * 300000,
    o: 100 + i * 0.5,
    h: 101 + i * 0.55,
    l: 99 + i * 0.45,
    c: 100.2 + i * 0.48,
    v: 100000 + i * 2500
  }));
  if (!key) return Response.json({ symbol, results: fallback, source: 'mock' });
  try {
    const url = `${base}/v2/aggs/ticker/${encodeURIComponent(symbol)}/range/5/minute/2024-01-01/2026-12-31?adjusted=true&sort=asc&limit=50000&apiKey=${encodeURIComponent(key)}`;
    const r = await fetch(url, { cache: 'no-store' });
    const data = await r.json();
    const results = (data?.results || []).slice(-60).map(b => ({
      t: b.t,
      o: b.o,
      h: b.h,
      l: b.l,
      c: b.c,
      v: b.v
    }));
    return Response.json({ symbol, results: results.length ? results : fallback, source: 'polygon' });
  } catch {
    return Response.json({ symbol, results: fallback, source: 'mock' });
  }
}
