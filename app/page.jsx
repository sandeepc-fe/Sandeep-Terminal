'use client';
import { useEffect, useMemo, useState } from 'react';
const initial = ['SPY','NVDA','QQQ','SPX'];
export default function Page() {
  const [symbol, setSymbol] = useState('SPY');
  const [quote, setQuote] = useState(null);
  const [candles, setCandles] = useState([]);
  const [candleSource, setCandleSource] = useState('...');
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [health, setHealth] = useState('...');

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(d => setHealth(d.proxy ? 'backend live' : 'backend mock')).catch(() => setHealth('offline'));
  }, []);

  useEffect(() => {
    fetch(`/api/quote?symbol=${symbol}`).then(r => r.json()).then(setQuote).catch(() => {});
    fetch(`/api/candles?symbol=${symbol}`).then(r => r.json()).then(d => { setCandleSource(d.source || '...'); setCandles(d.results || []); }).catch(() => { setCandleSource('...'); setCandles([]); });
  }, [symbol]);

  useEffect(() => {
    if (!q) { setResults([]); return; }
    fetch(`/api/symbols?q=${encodeURIComponent(q)}`).then(r => r.json()).then(d => setResults(d.results || [])).catch(() => setResults([]));
  }, [q]);

  const price = quote?.price ?? '...';
  const source = quote?.source || 'loading';
  const chartBars = useMemo(() => candles.slice(-20), [candles]);
  const maxH = Math.max(...chartBars.map(d => d.h || 0), 1);
  const minL = Math.min(...chartBars.map(d => d.l || 0), maxH);
  const range = Math.max(maxH - minL, 0.01);

  return (
    <main style={{fontFamily:'system-ui',background:'#07111f',color:'#e3f0ff',minHeight:'100vh',padding:24}}>
      <h1 style={{margin:0, fontSize:24}}>Sandeep Terminal</h1>
      <p style={{color:'#8ea9c7'}}>Next.js market terminal with a secure backend proxy for Polygon.</p>
      <div style={{margin:'12px 0',display:'inline-block',padding:'6px 10px',borderRadius:999,border:'1px solid rgba(114,164,255,.18)',background:'rgba(9,24,43,.9)',color:'#8ea9c7'}}>Status: {health} | Live data is shown only when Polygon returns successfully</div>
      <section style={{display:'grid',gridTemplateColumns:'1.2fr .8fr',gap:16}}>
        <div style={{border:'1px solid rgba(114,164,255,.18)',borderRadius:18,padding:16,background:'rgba(9,24,43,.9)'}}>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            {initial.map(s => <button key={s} onClick={() => setSymbol(s)} style={{padding:'8px 12px',borderRadius:999,border:'1px solid rgba(114,164,255,.18)',background:s===symbol?'rgba(31,224,255,.12)':'rgba(9,24,43,.9)',color:'#e3f0ff'}}>{s}</button>)}
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search all U.S. listed symbols" style={{marginLeft:'auto',padding:10,borderRadius:12,border:'1px solid rgba(114,164,255,.18)',background:'#09182b',color:'#e3f0ff'}} />
          </div>
          <div style={{marginTop:18,fontSize:48,fontWeight:700,color:'#52f59d'}}>{price}</div>
          <div style={{marginTop:10,color:'#8ea9c7'}}>Source: {source}</div>
          <div style={{marginTop:10,color:'#8ea9c7'}}>Candles: {candleSource}</div>
          <div style={{marginTop:10,color:'#8ea9c7'}}>Try /api/candles?symbol={symbol} and /api/quote?symbol={symbol}</div>
          <div style={{marginTop:18,height:220,display:'flex',alignItems:'flex-end',gap:4,padding:'10px 0',borderTop:'1px solid rgba(114,164,255,.08)'}}>
            {chartBars.map((d, i) => {
              const hi = ((d.h - minL) / range) * 100;
              const lo = ((d.l - minL) / range) * 100;
              const top = 100 - hi;
              const height = Math.max(2, hi - lo);
              const up = (d.c ?? 0) >= (d.o ?? 0);
              return <div key={i} title={`${new Date(d.t).toLocaleString()} O:${d.o} H:${d.h} L:${d.l} C:${d.c}`} style={{position:'relative',flex:1,minWidth:6,height:'100%'}}><div style={{position:'absolute',left:'50%',transform:'translateX(-50%)',top:`${top}%`,height:`${height}%`,width:8,borderRadius:4,background:up ? '#52f59d' : '#ff6b8b'}} /></div>
            })}
          </div>
        </div>
        <div style={{border:'1px solid rgba(114,164,255,.18)',borderRadius:18,padding:16,background:'rgba(9,24,43,.9)'}}>
          <div style={{fontWeight:700,marginBottom:8}}>Live search</div>
          <div style={{maxHeight:260,overflow:'auto',borderTop:'1px solid rgba(114,164,255,.08)'}}>
            {results.map(r => <div key={r.symbol} onClick={() => setSymbol(r.symbol)} style={{padding:'10px 0',borderBottom:'1px solid rgba(114,164,255,.08)',cursor:'pointer'}}>{r.symbol} <span style={{color:'#8ea9c7'}}>{r.name}</span></div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
