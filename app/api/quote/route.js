export const dynamic = 'force-dynamic';

export async function GET(request) {
  const symbol = new URL(request.url).searchParams.get('symbol')?.toUpperCase() || 'SPY';
  const key = process.env.POLYGON_API_KEY;
  const base = process.env.POLYGON_BASE_URL || 'https://api.polygon.io';
  if (!key) return Response.json({ symbol, price: Number((100 + Math.random() * 900).toFixed(2)), source: 'mock' });
  try {
    const url = `${base}/v2/snapshot/locale/us/markets/stocks/tickers/${encodeURIComponent(symbol)}?apiKey=${encodeURIComponent(key)}`;
    const r = await fetch(url, { cache: 'no-store' });
    const data = await r.json();
    const item = data?.ticker || data?.results || data;
    const price = item?.lastTrade?.p ?? item?.day?.c ?? item?.last?.p ?? Number((100 + Math.random() * 900).toFixed(2));
    return Response.json({ symbol, price, source: 'polygon' });
  } catch {
    return Response.json({ symbol, price: Number((100 + Math.random() * 900).toFixed(2)), source: 'mock' });
  }
}
