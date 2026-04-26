import { useRef, useEffect, useState, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger } from '../hooks/useScrollAnimation'

// ── Community area numbers for neighborhood polygon highlighting ──────────────
// Latino (red): Logan Sq, Humboldt Park, Little Village, Pilsen, Back of Yards
const LATINO_AREAS  = new Set([22, 23, 30, 31, 61])
// Black (blue): Bronzeville, South Shore, Englewood, Chatham, Auburn Gresham, Austin
const BLACK_AREAS   = new Set([38, 43, 68, 44, 71, 25])
// Additional context polygons (lighter styling)
const CONTEXT_AREAS = new Set([35, 36, 37, 24, 26, 27, 29, 60, 42, 46, 49, 41])

// ── Active trading neighborhoods (will appear in the animation) ───────────────
const LATINO = [
  { name:'Logan Square',   lat:41.923, lng:-87.704, color:'#E53950' },
  { name:'Humboldt Park',  lat:41.900, lng:-87.725, color:'#E53950' },
  { name:'Little Village', lat:41.852, lng:-87.719, color:'#E53950' },
  { name:'Pilsen',         lat:41.858, lng:-87.662, color:'#E53950' },
  { name:'Back of Yards',  lat:41.809, lng:-87.715, color:'#E53950' },
]
const BLACK = [
  { name:'Bronzeville',     lat:41.822, lng:-87.619, color:'#0F5EA8' },
  { name:'South Shore',     lat:41.762, lng:-87.573, color:'#0F5EA8' },
  { name:'Englewood',       lat:41.780, lng:-87.647, color:'#0F5EA8' },
  { name:'Chatham',         lat:41.743, lng:-87.609, color:'#0F5EA8' },
  { name:'Auburn Gresham',  lat:41.737, lng:-87.653, color:'#0F5EA8' },
  { name:'Austin',          lat:41.887, lng:-87.745, color:'#0F5EA8' },
]

// ── 10 connections with real user names — spans the whole city ────────────────
const CONNECTIONS = [
  { li:0, bi:5, tx:{ icon:'✂️', service:'Haircut',        buyer:'Carlos V.',  provider:'Anthony D.', usd:27,  usdFee:3,  chi:15, chiFee:3  } },
  { li:1, bi:0, tx:{ icon:'🌮', service:'Tacos al Pastor', buyer:'Diego R.',   provider:'Marcus B.',  usd:11,  usdFee:1,  chi:13, chiFee:2  } },
  { li:2, bi:2, tx:{ icon:'🏠', service:'Home Repair',     buyer:'Maria G.',   provider:'Keisha W.',  usd:180, usdFee:20, chi:68, chiFee:12 } },
  { li:3, bi:3, tx:{ icon:'📚', service:'Tutoring',        buyer:'Sofia M.',   provider:'Jerome L.',  usd:23,  usdFee:2,  chi:10, chiFee:2  } },
  { li:4, bi:4, tx:{ icon:'🎧', service:'DJ Set',          buyer:'Ana P.',     provider:'DeShawn T.', usd:92,  usdFee:8,  chi:42, chiFee:8  } },
  { li:2, bi:1, tx:{ icon:'💇', service:'Hair Braiding',   buyer:'Rosa C.',    provider:'Aisha J.',   usd:65,  usdFee:5,  chi:35, chiFee:6  } },
  { li:3, bi:5, tx:{ icon:'🔧', service:'Auto Repair',     buyer:'Luis T.',    provider:'Anthony D.', usd:80,  usdFee:6,  chi:30, chiFee:5  } },
  { li:0, bi:0, tx:{ icon:'💅', service:'Nail Salon',      buyer:'Ana P.',     provider:'Tamika R.',  usd:45,  usdFee:4,  chi:22, chiFee:4  } },
  { li:1, bi:4, tx:{ icon:'🌿', service:'Lawn Service',    buyer:'Miguel H.',  provider:'Jerome L.',  usd:55,  usdFee:5,  chi:28, chiFee:5  } },
  { li:4, bi:1, tx:{ icon:'🍽️', service:'Catering',        buyer:'Maria G.',   provider:'Dena M.',    usd:150, usdFee:12, chi:55, chiFee:8  } },
]

// ── Leaflet HTML (self-contained: animation + postMessage → React) ────────────
function buildMapHtml(latinoNeighborhoods, blackNeighborhoods, connections, latinoAreas, blackAreas) {
  const lStr = JSON.stringify(latinoNeighborhoods)
  const bStr = JSON.stringify(blackNeighborhoods)
  const cStr = JSON.stringify(connections)
  const laStr = JSON.stringify([...latinoAreas])
  const baStr = JSON.stringify([...blackAreas])

  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body,#map{width:100%;height:100%;}
.nh-label{background:transparent;border:none;pointer-events:none;}
.nh-label div{font:700 11px/1 Inter,sans-serif;white-space:nowrap;text-shadow:0 1px 3px rgba(255,255,255,0.95),0 0 6px white;}
.icon-wrap{display:flex;flex-direction:column;align-items:center;pointer-events:none;}
.icon-dot{border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25);transition:transform .25s;}
.icon-sub{font:600 8px/1.3 Inter,sans-serif;text-align:center;margin-top:3px;white-space:nowrap;}
.node-wrap{display:flex;flex-direction:column;align-items:center;}
.node-dot{border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid white;box-shadow:0 3px 12px rgba(0,0,0,.2);transition:transform .3s,box-shadow .3s;}
.node-label{font:700 10px/1 Inter,sans-serif;margin-top:3px;white-space:nowrap;text-shadow:0 1px 3px rgba(255,255,255,.9);}
</style>
</head><body>
<div id="map"></div>
<script>
const LATINO = ${lStr};
const BLACK  = ${bStr};
const CONNS  = ${cStr};
const LA_SET = new Set(${laStr});
const BA_SET = new Set(${baStr});
const GEO_URL = 'https://data.cityofchicago.org/resource/igwz-8jzy.geojson?$limit=100';

const map = L.map('map',{center:[41.83,-87.695],zoom:11,zoomControl:true,attributionControl:false});
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:18}).addTo(map);

// ── Attribution (small, bottom right) ──
L.control.attribution({position:'bottomright'}).addTo(map);

// ── Community area polygons ──
fetch(GEO_URL,{headers:{Accept:'application/json'}})
  .then(r=>r.ok?r.json():null).then(geo=>{
  if(!geo) return;
  L.geoJSON(geo,{
    style(f){
      const n = +(f.properties.area_numbe||0);
      if(LA_SET.has(n)) return{fillColor:'#E53950',fillOpacity:.18,color:'#E53950',weight:1.8,opacity:.5};
      if(BA_SET.has(n)) return{fillColor:'#0F5EA8',fillOpacity:.18,color:'#0F5EA8',weight:1.8,opacity:.5};
      return{fillColor:'transparent',fillOpacity:0,color:'#C8D5E0',weight:.7,opacity:.6};
    },
    onEachFeature(f,layer){
      const n = +(f.properties.area_numbe||0);
      const hood = (f.properties.community||'').replace(/\\b\\w/g,c=>c.toUpperCase());
      if(LA_SET.has(n)||BA_SET.has(n)){
        layer.bindTooltip(hood,{permanent:false,className:'',sticky:true,
          direction:'top',offset:[0,-4]});
      }
    }
  }).addTo(map);
}).catch(()=>{});

// ── Node icon helper ──
function nodeIcon(emoji,label,color,size=36){
  return L.divIcon({
    html:\`<div class="node-wrap">
      <div class="node-dot" style="width:\${size}px;height:\${size}px;background:\${color};font-size:\${size*.38}px">\${emoji}</div>
      <div class="node-label" style="color:\${color}">\${label}</div>
    </div>\`,
    iconSize:[size+4,size+18],iconAnchor:[size/2+2,size/2],className:''
  });
}

// ── Neighborhood marker helper ──
function nhIcon(color,label,size=14){
  return L.divIcon({
    html:\`<div class="nh-label"><div class="node-wrap">
      <div class="node-dot" style="width:\${size}px;height:\${size}px;background:\${color};font-size:7px;"></div>
      <div class="node-label" style="color:\${color};font-size:10px;">\${label}</div>
    </div></div>\`,
    iconSize:[80,size+14],iconAnchor:[40,size/2],className:''
  });
}

// ── Moving icon helper ──
function movingIcon(text,bg,size=22){
  return L.divIcon({
    html:\`<div class="icon-dot" style="width:\${size}px;height:\${size}px;background:\${bg};font-size:\${size*.42}px;">\${text}</div>\`,
    iconSize:[size,size],iconAnchor:[size/2,size/2],className:''
  });
}

// ── Fixed: DAO Treasury + Liquidity Reserve ──
// Lakefront positions — Museum Campus (south) and Navy Pier (north)
const TREASURY_LL  = [41.860,-87.614]; // Museum Campus / Soldier Field lakefront
const LIQUIDITY_LL = [41.891,-87.609]; // Navy Pier / lakefront north

let treasuryMarker  = L.marker(TREASURY_LL,  {icon:nodeIcon('🏛','DAO Treasury','#0F5EA8',52),zIndexOffset:600}).addTo(map);
let liquidityMarker = L.marker(LIQUIDITY_LL, {icon:nodeIcon('💧','Liq. Reserve','#22C55E',52),zIndexOffset:600}).addTo(map);

// ── Static neighborhood markers ──
LATINO.forEach(n=>L.marker([n.lat,n.lng],{icon:nhIcon(n.color,n.name),zIndexOffset:300}).addTo(map));
BLACK .forEach(n=>L.marker([n.lat,n.lng],{icon:nhIcon(n.color,n.name),zIndexOffset:300}).addTo(map));

// ── Lerp helper ──
function lerp(a,b,t){return a+(b-a)*t;}
function ease(t){return t<.5?2*t*t:-1+(4-2*t)*t;}

// ── Animate a marker along a straight path ──
function flyMarker(marker,fromLL,toLL,duration,cb){
  const start=Date.now();
  const tick=setInterval(()=>{
    const t=ease(Math.min((Date.now()-start)/duration,1));
    marker.setLatLng([lerp(fromLL[0],toLL[0],t),lerp(fromLL[1],toLL[1],t)]);
    if(t>=1){clearInterval(tick);cb&&cb();}
  },16);
  return tick;
}

// ── Pulse a node ──
function pulseNode(marker){
  const el=marker.getElement();
  if(!el){return;}
  const dot=el.querySelector('.node-dot');
  if(!dot){return;}
  dot.style.transform='scale(1.4)';
  dot.style.boxShadow='0 0 18px '+dot.style.background+'99';
  setTimeout(()=>{dot.style.transform='scale(1)';dot.style.boxShadow='';},350);
}

// ── Shuffle array helper ──────────────────────────────────────────────────────
function shuffle(arr){return [...arr].sort(()=>Math.random()-.5);}

// ── Draw a line progressively ─────────────────────────────────────────────────
function drawRoute(fromLL,toLL,color,duration,localL,cb){
  const line=L.polyline([fromLL],{color,weight:3,opacity:.75}).addTo(map);
  localL.push(line);
  const start=Date.now();
  const t2=setInterval(()=>{
    const t=ease(Math.min((Date.now()-start)/duration,1));
    line.setLatLngs([fromLL,[lerp(fromLL[0],toLL[0],t),lerp(fromLL[1],toLL[1],t)]]);
    if(t>=1){clearInterval(t2);cb&&cb();}
  },16);
}

// ── Fire a single connection (manages its own layer group) ────────────────────
function fireOne(connIdx){
  const conn=CONNS[connIdx%CONNS.length];
  const from=LATINO[conn.li], to=BLACK[conn.bi];
  const fromLL=[from.lat,from.lng], toLL=[to.lat,to.lng];
  const midLL=[lerp(from.lat,to.lat,.5),lerp(from.lng,to.lng,.5)];
  const localL=[];

  function done(){
    // Clean up after 2s so viewers can see the completed route briefly
    setTimeout(()=>{localL.forEach(l=>{try{map.removeLayer(l);}catch(e){}});},2000);
  }

  // Phase 1: draw the route line (1.2s)
  drawRoute(fromLL,toLL,from.color,1200,localL,()=>{

    // Phase 2: USD particle (3s)
    const usdM=L.marker(fromLL,{icon:movingIcon('$','#22C55E',28),zIndexOffset:1000}).addTo(map);
    localL.push(usdM);
    flyMarker(usdM,fromLL,toLL,3000,()=>{
      const usdB=L.polyline([midLL,LIQUIDITY_LL],{color:'#22C55E',weight:2,dashArray:'5 4',opacity:.8}).addTo(map);
      localL.push(usdB);
      const usdF=L.marker(midLL,{icon:movingIcon('$','#22C55E',20),zIndexOffset:1000}).addTo(map);
      localL.push(usdF);
      flyMarker(usdF,midLL,LIQUIDITY_LL,1800,()=>{pulseNode(liquidityMarker);});
    });

    // Phase 2b: CHI particle (starts 500ms after USD)
    setTimeout(()=>{
      const chiM=L.marker(fromLL,{icon:movingIcon('₡','#E53950',28),zIndexOffset:999}).addTo(map);
      localL.push(chiM);
      flyMarker(chiM,fromLL,toLL,3000,()=>{
        const chiB=L.polyline([midLL,TREASURY_LL],{color:'#0F5EA8',weight:2,dashArray:'5 4',opacity:.8}).addTo(map);
        localL.push(chiB);
        const chiF=L.marker(midLL,{icon:movingIcon('₡','#0F5EA8',20),zIndexOffset:999}).addTo(map);
        localL.push(chiF);
        flyMarker(chiF,midLL,TREASURY_LL,1800,()=>{
          pulseNode(treasuryMarker);
          // Notify React with user names
          window.parent&&window.parent.postMessage({type:'tx_complete',data:{
            ...conn.tx,from:from.name,to:to.name,
            ts:new Date().toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'})
          }},'*');
          done();
        });
      });
    },500);

  });
}

// ── Batch: fire 2–3 connections at once with 900ms stagger ───────────────────
let batchIdx=0;
function fireBatch(){
  // Pick 2 or 3 different connections
  const count=2+(Math.random()>.45?1:0);
  const pool=shuffle([...Array(CONNS.length).keys()]);
  const chosen=pool.slice(0,count);
  chosen.forEach((ci,i)=>setTimeout(()=>fireOne((batchIdx+ci)%CONNS.length),i*900));
  batchIdx+=count;
  // Next batch starts 6.5s after this one began (overlapping animation is intentional)
  setTimeout(fireBatch,6500);
}

// Start after tiles + polygons have loaded
setTimeout(fireBatch,2200);
</script></body></html>`
}

// ── Main React component ───────────────────────────────────────────────────────
export default function BridgingNeighborhoods() {
  const { ref: titleRef, isInView: titleInView } = useScrollAnimation()
  const { ref: btmRef,   isInView: btmInView   } = useScrollAnimation()
  const sectionRef = useRef(null)
  const sectionInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const [loaded,       setLoaded]       = useState(false)
  const [treasuryAmt,  setTreasuryAmt]  = useState(14_320)
  const [liquidityAmt, setLiquidityAmt] = useState(8_450)
  const [txLog,        setTxLog]        = useState([])
  const txCounter = useRef(0)

  const mapHtml = useMemo(
    () => buildMapHtml(LATINO, BLACK, CONNECTIONS, LATINO_AREAS, BLACK_AREAS),
    []
  )

  // Receive postMessage from Leaflet iframe
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type !== 'tx_complete') return
      const d = { ...e.data.data, id: txCounter.current++ }
      setTreasuryAmt(prev  => prev + d.chiFee)
      setLiquidityAmt(prev => prev + d.usdFee)
      setTxLog(prev => [d, ...prev].slice(0, 5))
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <section id="bridging" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-bg-dark/30 to-white pointer-events-none" />
      <div className="orb w-[500px] h-[500px] bg-chi-red/5   top-0    left-[-200px] pointer-events-none" />
      <div className="orb w-[400px] h-[400px] bg-chi-blue/6  bottom-0 right-[-100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          ref={titleRef}
          variants={stagger} initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <motion.p variants={fadeUp} className="text-chi-red text-xs tracking-widest uppercase font-semibold mb-4">
            Transaction Preview · Connecting Chicago
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5 text-ink">
            When neighbors trade,
            <span className="text-gradient"> the whole city wins.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base md:text-lg text-ink-dim leading-relaxed">
            This is what city-wide Chi Coin transactions will look like — Black and Latino
            neighborhoods across Chicago doing commerce together, with fees automatically
            routing to the DAO treasury and liquidity reserve.
          </motion.p>
        </motion.div>

        {/* ── Map + feed ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch mb-10">

          {/* Leaflet Map (3 cols) */}
          <div ref={sectionRef} className="lg:col-span-3 flex flex-col gap-3">
            {/* Map frame */}
            <div className="relative rounded-2xl overflow-hidden border border-chi-border shadow-xl"
              style={{ height: '420px' }}>
              {!loaded && (
                <div className="absolute inset-0 bg-bg-dark flex items-center justify-center z-10">
                  <div className="text-center">
                    <svg className="animate-spin w-7 h-7 text-chi-blue mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <p className="text-xs text-ink-muted">Loading Chicago map…</p>
                  </div>
                </div>
              )}
              <iframe
                srcDoc={mapHtml}
                title="Chi Coin Chicago Neighborhoods"
                onLoad={() => setLoaded(true)}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>

            {/* Counters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl border border-chi-border px-4 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">🏛</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wide leading-none mb-0.5">DAO Treasury</p>
                    <p className="text-[9px] text-ink-faint">CHI fee → grants</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 shrink-0">
                  <motion.span key={treasuryAmt}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-black text-ink tabular-nums"
                  >{treasuryAmt.toLocaleString()}</motion.span>
                  <span className="text-xs font-bold text-chi-blue">₡</span>
                </div>
              </div>
              <div className="glass rounded-xl border border-chi-border px-4 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">💧</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wide leading-none mb-0.5">Liquidity Reserve</p>
                    <p className="text-[9px] text-ink-faint">USD fee → market depth</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-0.5 shrink-0">
                  <span className="text-xs font-bold text-green-600">$</span>
                  <motion.span key={liquidityAmt}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-black text-ink tabular-nums"
                  >{liquidityAmt.toLocaleString()}</motion.span>
                </div>
              </div>
            </div>

            {/* Tip */}
            <p className="text-center text-[10px] text-ink-faint">
              Scroll to zoom · Drag to pan · Click any neighborhood for details
            </p>
          </div>

          {/* Live transaction feed (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">

            {/* Feed header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <motion.div className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ opacity:[1,.3,1] }} transition={{ duration:1.4, repeat:Infinity }} />
                <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Live Transaction Feed Preview</p>
              </div>
              <h3 className="text-xl font-black text-ink leading-snug mb-1">
                What real activity will look like
              </h3>
              <p className="text-xs text-ink-dim leading-relaxed">
                2–3 bookings firing simultaneously across Chicago. Each routes fees to
                the DAO treasury (CHI) and liquidity reserve (USD) automatically.
              </p>
            </div>

            {/* Transaction feed — scrollable, up to 5 cards */}
            <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto no-scrollbar" style={{ maxHeight:'480px' }}>
              <AnimatePresence initial={false}>
                {txLog.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-chi-border bg-bg-dark flex-1 flex items-center justify-center min-h-[200px]">
                    <div className="text-center px-6">
                      <motion.div className="w-3 h-3 rounded-full bg-chi-blue mx-auto mb-3"
                        animate={{ opacity:[1,.3,1] }} transition={{ duration:1.2, repeat:Infinity }} />
                      <p className="text-sm font-medium text-ink-muted">Waiting for first transactions…</p>
                      <p className="text-xs text-ink-faint mt-1">Map will fire 2–3 at once</p>
                    </div>
                  </div>
                ) : txLog.map((tx) => (
                  <motion.div
                    key={tx.id}
                    layout
                    initial={{ opacity:0, y:-20, scale:0.96 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, height:0, marginBottom:0 }}
                    transition={{ duration:0.35, ease:[0.25,0.1,0.25,1] }}
                    className="rounded-xl border border-chi-border bg-white shadow-sm overflow-hidden shrink-0"
                  >
                    <div className="h-1 bg-gradient-to-r from-chi-red via-chi-blue-light to-chi-blue" />
                    <div className="px-4 py-3">
                      {/* Buyer → Provider row */}
                      <div className="flex items-center gap-2 mb-3">
                        {/* Buyer avatar */}
                        <div className="w-8 h-8 rounded-full bg-chi-red flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm">
                          {tx.buyer?.[0] ?? '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-ink leading-tight truncate">{tx.buyer}</p>
                          <p className="text-[9px] text-chi-red truncate">{tx.from}</p>
                        </div>
                        {/* Arrow + service icon */}
                        <div className="flex flex-col items-center gap-0.5 shrink-0">
                          <span className="text-base leading-none">{tx.icon}</span>
                          <svg width="18" height="8" viewBox="0 0 18 8" fill="none">
                            <path d="M1 4h14M11 1l4 3-4 3" stroke="#D8E0E8" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        {/* Provider avatar */}
                        <div className="min-w-0 flex-1 text-right">
                          <p className="text-xs font-black text-ink leading-tight truncate">{tx.provider}</p>
                          <p className="text-[9px] text-chi-blue truncate">{tx.to}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-chi-blue flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm">
                          {tx.provider?.[0] ?? '?'}
                        </div>
                      </div>

                      {/* Service name + time */}
                      <div className="flex items-center justify-between mb-2.5">
                        <p className="text-sm font-bold text-ink">{tx.service}</p>
                        <p className="text-[9px] text-ink-faint">{tx.ts}</p>
                      </div>

                      {/* Money split — compact 2×2 grid */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5">
                          <span className="text-[10px] font-black text-green-600 shrink-0">$</span>
                          <span className="text-[10px] text-green-700 font-semibold flex-1 truncate">USD → provider</span>
                          <span className="text-xs font-black text-green-700 shrink-0">${tx.usd}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                          <span className="text-[10px] shrink-0">💧</span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex-1 truncate">→ Reserve</span>
                          <span className="text-xs font-black text-emerald-600 shrink-0">${tx.usdFee}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-soft-red border border-chi-red/20 rounded-lg px-2.5 py-1.5">
                          <span className="text-[10px] font-black text-chi-red shrink-0">₡</span>
                          <span className="text-[10px] text-chi-red font-semibold flex-1 truncate">CHI → provider</span>
                          <span className="text-xs font-black text-chi-red shrink-0">+{tx.chi}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-soft-blue border border-chi-blue/20 rounded-lg px-2.5 py-1.5">
                          <span className="text-[10px] shrink-0">🏛</span>
                          <span className="text-[10px] text-chi-blue font-semibold flex-1 truncate">→ Treasury</span>
                          <span className="text-xs font-black text-chi-blue shrink-0">+{tx.chiFee}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              {[
                { v:'+10 ₡', l:'Cross-hood bonus',     c:'text-chi-blue'       },
                { v:'2–3',   l:'Simultaneous bookings', c:'text-chi-red'        },
                { v:'2-way', l:'Fee auto-routing',      c:'text-chi-blue-light' },
              ].map((s,i) => (
                <div key={i} className="glass rounded-xl border border-chi-border p-3 text-center">
                  <p className={`text-base font-black ${s.c} mb-0.5`}>{s.v}</p>
                  <p className="text-[9px] text-ink-muted leading-tight">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── App screenshots + copy ───────────────────────────────────────── */}
        <motion.div
          ref={btmRef}
          initial={{ opacity:0, y:28 }}
          animate={btmInView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          <div className="flex gap-5 justify-center items-end">
            <div className="relative">
              <div className="w-40 md:w-44 rounded-[2rem] md:rounded-[2.5rem] border-2 border-chi-border shadow-2xl shadow-black/10 overflow-hidden bg-white">
                <img src="/landingChiCoin.PNG" alt="Chi Coin App" className="w-full block" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-chi-blue text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md whitespace-nowrap">
                Bridge the City
              </div>
            </div>
            <div className="relative mt-10">
              <div className="w-40 md:w-44 rounded-[2rem] md:rounded-[2.5rem] border-2 border-chi-border shadow-2xl shadow-black/10 overflow-hidden bg-white">
                <img src="/IMG_4090.PNG" alt="Chi Coin Community DAO" className="w-full block" />
              </div>
              <div className="absolute -bottom-2 -left-2 bg-chi-red text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md whitespace-nowrap">
                Community DAO
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-chi-blue uppercase tracking-widest mb-3">A New Chicago Economy</p>
            <h3 className="text-2xl sm:text-3xl font-black text-ink leading-tight mb-4">
              Two cultures. One economy.
              <span className="text-gradient"> Building Chicago together.</span>
            </h3>
            <div className="flex flex-col gap-3 text-sm text-ink-dim leading-relaxed mb-5">
              <p>
                Black and Latino communities have shared Chicago's streets for generations.
                Chi Coin will give them a shared economic layer — where every cross-neighborhood
                booking earns bonuses for both parties and strengthens the whole system.
              </p>
              <p>
                The USD fee to the liquidity reserve means the more Chicago trades with itself,
                the deeper and more stable the market becomes. Built to get stronger as it grows.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Little Village','Englewood'],
                ['Humboldt Park','Bronzeville'],
                ['Logan Square','Austin'],
                ['Pilsen','South Shore'],
              ].map(([a,b],i) => (
                <div key={i} className="flex items-center gap-1.5 glass rounded-xl border border-chi-border px-3 py-2.5">
                  <span className="text-[10px] font-bold text-chi-red truncate">{a}</span>
                  <div className="w-px h-3 bg-chi-border shrink-0" />
                  <span className="text-[10px] font-bold text-chi-blue truncate">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Closing quote ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={btmInView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, delay:0.35 }}
          className="mt-12 md:mt-16 rounded-2xl overflow-hidden text-center px-6 md:px-10 py-10 md:py-14"
          style={{ background:'linear-gradient(135deg, #E53950 0%, #111827 50%, #0F5EA8 100%)' }}
        >
          <p className="text-lg sm:text-xl md:text-2xl font-light text-white italic leading-relaxed max-w-2xl mx-auto mb-4">
            "When you spend with your neighbor, the money stays.
            When money stays, neighborhoods grow.
            That's how every great city is built."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-white/30" />
            <span className="text-white/50 text-xs tracking-widest">Chi Coin · Chicago, IL</span>
            <div className="w-8 h-px bg-white/30" />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
