'use client';
import { useEffect, useMemo, useState } from 'react';
const initial = ['SPY','NVDA','QQQ','SPX'];
export default function Page() {
  const [symbol, setSymbol] = useState('SPY');
  const [quote, setQuote] = useState(null);
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  useEffect(() => { fetch(`/api/quote?symbol=${symbol}`).then(r => r.json()).then(setQuote).catch(()=>{}); }, [symbol]);
  useEffect(() => { if (!q) { setResults([]); return; } fetch(`/api/symbols?q=${encodeURIComponent(q)}`).then(r => r.json()).then(d => setResults(d.results || [])); }, [q]);
  const price = quote?.price ?? '...';
  return (
    <main style={{fontFamily:'system-ui',background:'#07111f',color:'#e3f0ff',minHeight:'100vh',padding:24}}>
      <h1 style={{margin:0, fontSize:24}}>Sandeep Terminal</h1>
      <p style={{color:'#8ea9c7'}}>Next.js market terminal with a secure backend proxy for Polygon.</p>
      <section style={{display:'grid',gridTemplateColumns:'1.2fr .8fr',gap:16}}>
        <div style={{border:'1px solid rgba(114,164,255,.18)',borderRadius:18,padding:16,background:'rgba(9,24,43,.9)'}}>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            {initial.map(s => <button key={s} onClick={() => setSymbol(s)} style={{padding:'8px 12px',borderRadius:999,border:'1px solid rgba(114,164,255,.18)',background:s===symbol?'rgba(31,224,255,.12)':'rgba(9,24,43,.9)',color:'#e3f0ff'}}>{s}</button>)}
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search all U.S. listed symbols" style={{marginLeft:'auto',padding:10,borderRadius:12,border:'1px solid rgba(114,164,255,.18)',background:'#09182b',color:'#e3f0ff'}} />
          </div>
          <div style={{marginTop:18,fontSize:48,fontWeight:700,color:'#52f59d'}}>{price}</div>
          <div style={{marginTop:10,color:'#8ea9c7'}}>Source: {quote?.source || 'loading'}</div>
          <div style={{marginTop:10,color:'#8ea9c7'}}>Try /api/candles?symbol={symbol} and /api/quote?symbol={symbol}</div>
        </div>
        <div style={{border:'1px solid rgba(114,164,255,.18)',borderRadius:18,padding:16,background:'rgba(9,24,43,.9)'}}>
          <div style={{fontWeight:700,marginBottom:8}}>Live search</div>
          <div style={{maxHeight:260,overflow:'auto',borderTop:'1px solid rgba(114,164,255,.08)'}}>
            {results.map(r => <div key={r.symbol} onClick={() => setSymbol(r.symbol)} style={{padding:'10px 0',borderBottom:'1px solid rgba(114,164,255,.08)',cursor:'pointer'}}>{r.symbol}</div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
