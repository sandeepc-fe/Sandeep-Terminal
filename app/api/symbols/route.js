import symbols from '../../../symbols.json' assert { type: 'json' };
export async function GET(request) { const q = new URL(request.url).searchParams.get('q')?.toUpperCase() || ''; return Response.json({ results: symbols.filter(s => !q || s.symbol.includes(q) || s.name.toUpperCase().includes(q)).slice(0, 500).map(({symbol,name}) => ({ symbol, name })) }); }
