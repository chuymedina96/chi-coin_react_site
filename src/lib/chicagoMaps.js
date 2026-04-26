// Shared Chicago civic map data and Leaflet HTML builders.
// Ported from mobile app's MapCarousel.js / RedliningMapView.js.
// Both CivicMaps.jsx (section) and MapCarouselModal.jsx (modal) import from here.

import {
  POVERTY_BY_AREA, MEDIAN_INCOME_BY_AREA, HOME_OWNERSHIP_BY_AREA,
  EVICTION_BY_ZIP, TIF_DISTRICTS,
  BLOOD_LEAD_BY_ZIP, ASTHMA_BY_ZIP, INDUSTRIAL_FACILITIES,
  CHA_DEMOLISHED_PROJECTS, SHOOTINGS_BY_AREA,
  TRANSIT_SCORE_BY_AREA, PARK_ACRES_PER_1K, FOOD_DESERT_ZIPS,
  LIFE_EXPECTANCY_ZIPS, BANK_BRANCHES, PAYDAY_LENDERS, SCHOOL_CLOSURES_2013,
} from '../data/chicagoMapData'

export const COMMUNITY_URL = 'https://data.cityofchicago.org/resource/igwz-8jzy.geojson?$limit=100'
// HOLC data is served locally (copied from backend static file) — no CORS issues
export const HOLC_LOCAL_URL = '/holc-chicago-1940.geojson'

// ── Leaflet HTML shell (dark CartoDB tiles, matches mobile app) ───────────────
export function leafletShell(body, legendHtml = '') {
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body,#map{width:100%;height:100%;background:#1a1a2e;}
.legend{background:rgba(15,15,30,.92);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:8px 10px;font-family:-apple-system,sans-serif;font-size:11px;color:#e0e0e0;line-height:1.6;}
.legend-title{font-weight:700;font-size:10px;letter-spacing:.8px;color:#aaa;text-transform:uppercase;margin-bottom:5px;}
.legend-row{display:flex;align-items:center;gap:6px;margin:2px 0;}
.legend-swatch{width:14px;height:14px;border-radius:3px;flex-shrink:0;}
.src{margin-top:6px;font-size:9px;color:#777;line-height:1.4;}
</style></head><body><div id="map"></div>
<script>
const map=L.map('map',{center:[41.83,-87.68],zoom:10,zoomControl:true,attributionControl:false});
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:18}).addTo(map);
${body}
${legendHtml ? `const _lg=L.control({position:'bottomright'});_lg.onAdd=()=>{const d=L.DomUtil.create('div','legend');d.innerHTML=${JSON.stringify(legendHtml)};return d;};_lg.addTo(map);` : ''}
</script></body></html>`
}

// ── HTML builders ─────────────────────────────────────────────────────────────

// holcHtml — self-fetching iframe. React never handles the GeoJSON directly.
// Fetches from the locally-bundled static file (same origin = no CORS).
// Falls back to API allorigins proxy if local fetch somehow fails.
export function holcHtml() {
  const leg =
    `<div class="legend-title">HOLC Grade · Chicago 1940</div>` +
    [['#4CAF50','A — Best'],['#2196F3','B — Still Desirable'],['#FFC107','C — Declining'],['#E53935','D — Hazardous (Redlined)']].map(([c,l])=>
      `<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('') +
    `<div class="src">Source: Mapping Inequality, U. of Richmond · Public domain</div>`

  const body = `
const COLS={A:'#4CAF50',B:'#2196F3',C:'#FFC107',D:'#E53935'};
const LBL={A:'A — Best',B:'B — Still Desirable',C:'C — Declining',D:'D — Hazardous (Redlined)'};
// Local file is same-origin → no CORS. Fallback to allorigins proxy if needed.
const URLS=[
  '/holc-chicago-1940.geojson',
  'https://api.allorigins.win/raw?url='+encodeURIComponent('https://dsl.richmond.edu/panorama/redlining/static/downloads/geojson/ILChicago1940.geojson'),
];

// Loading spinner overlay
const ov=document.createElement('div');
ov.style.cssText='position:absolute;inset:0;background:#1a1a2e;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:9999;pointer-events:none;';
ov.innerHTML='<div style="width:30px;height:30px;border:3px solid rgba(255,255,255,.12);border-top-color:#4A90D9;border-radius:50%;animation:sp 1s linear infinite"></div><span style="color:rgba(255,255,255,.45);font-family:sans-serif;font-size:12px">Loading redlining map…</span>';
const st=document.createElement('style');st.textContent='@keyframes sp{to{transform:rotate(360deg)}}';
document.head.appendChild(st);document.body.appendChild(ov);

async function loadData(){
  for(const url of URLS){
    try{
      const r=await fetch(url,{headers:{Accept:'application/json,*/*'}});
      if(!r.ok) continue;
      const json=await r.json();
      if(json?.features?.length) return json;
    }catch(e){ continue; }
  }
  return null;
}

loadData().then(data=>{
  ov.remove();
  if(!data){
    const err=document.createElement('div');
    err.style.cssText='position:absolute;inset:0;background:#1a1a2e;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;z-index:9999;';
    err.innerHTML='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E53935" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span style="color:rgba(255,255,255,.4);font-family:sans-serif;font-size:12px;text-align:center;padding:0 20px">Map data unavailable. Check your connection.</span>';
    document.body.appendChild(err);
    return;
  }
  L.geoJSON(data,{
    style(f){const g=(f.properties.grade||'').trim().toUpperCase();return{fillColor:COLS[g]||'#888',fillOpacity:.62,color:COLS[g]||'#888',weight:.8,opacity:.9};},
    onEachFeature(f,l){
      const g=(f.properties.grade||'').trim().toUpperCase();
      const lbl=LBL[g]||('Grade '+g);
      const area=f.properties.label||'';
      const cat=f.properties.category||'';
      l.bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111;line-height:1.5"><strong>Area '+(area||'—')+'</strong><br><span style="color:'+(COLS[g]||'#888')+';font-weight:700">'+lbl+'</span><br><span style="color:#555;font-size:11px">'+cat+'</span></div>',{maxWidth:220});
    }
  }).addTo(map);
});`

  return leafletShell(body, leg)
}

export function povertyHtml(geo) {
  const g=JSON.stringify(geo),d=JSON.stringify(POVERTY_BY_AREA)
  const leg=`<div class="legend-title">Poverty Rate</div>`+[['#7F0000','40%+'],['#C62828','30–40%'],['#EF5350','20–30%'],['#FF8F00','15–20%'],['#FFB74D','10–15%'],['#FFF9C4','< 10%']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: U.S. Census ACS 2020 5-Year</div>`
  return leafletShell(`const GEO=${g};const POV=${d};function pc(p){if(p>=40)return'#7F0000';if(p>=30)return'#C62828';if(p>=20)return'#EF5350';if(p>=15)return'#FF8F00';if(p>=10)return'#FFB74D';return'#FFF9C4';}L.geoJSON(GEO,{style(f){const p=POV[String(+(f.properties.area_numbe||0))]||0;return{fillColor:pc(p),fillOpacity:.72,color:'#222',weight:.5};},onEachFeature(f,l){const n=(f.properties.community||'').replace(/\\b\\w/g,c=>c.toUpperCase());const p=POV[String(+(f.properties.area_numbe||0))]||0;l.bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>'+n+'</strong><br><span style="color:#C62828;font-weight:700">'+p+'% below poverty line</span></div>',{maxWidth:160});}}).addTo(map);`,leg)
}

export function incomeHtml(geo) {
  const g=JSON.stringify(geo),d=JSON.stringify(MEDIAN_INCOME_BY_AREA)
  const leg=`<div class="legend-title">Median Household Income</div>`+[['#7F0000','< $25K'],['#C62828','$25–35K'],['#EF5350','$35–50K'],['#81C784','$50–70K'],['#388E3C','$70–90K'],['#1B5E20','> $90K']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: U.S. Census ACS 2020 5-Year</div>`
  return leafletShell(`const GEO=${g};const INC=${d};function ic(v){if(v>=90000)return'#1B5E20';if(v>=70000)return'#388E3C';if(v>=50000)return'#81C784';if(v>=35000)return'#EF5350';if(v>=25000)return'#C62828';return'#7F0000';}L.geoJSON(GEO,{style(f){const v=INC[String(+(f.properties.area_numbe||0))]||0;return{fillColor:ic(v),fillOpacity:.75,color:'#222',weight:.5};},onEachFeature(f,l){const n=(f.properties.community||'').replace(/\\b\\w/g,c=>c.toUpperCase());const v=INC[String(+(f.properties.area_numbe||0))]||0;l.bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>'+n+'</strong><br><span style="font-weight:700;color:#388E3C">Median: $'+(v>=1000?Math.round(v/1000)+'K':v)+'</span></div>',{maxWidth:160});}}).addTo(map);`,leg)
}

export function homeOwnershipHtml(geo) {
  const g=JSON.stringify(geo),d=JSON.stringify(HOME_OWNERSHIP_BY_AREA)
  const leg=`<div class="legend-title">Home Ownership Rate</div>`+[['#7F0000','< 25%'],['#C62828','25–35%'],['#FF8F00','35–50%'],['#81C784','50–65%'],['#1B5E20','> 65%']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: U.S. Census ACS 2020</div>`
  return leafletShell(`const GEO=${g};const OWN=${d};function oc(p){if(p>=65)return'#1B5E20';if(p>=50)return'#81C784';if(p>=35)return'#FF8F00';if(p>=25)return'#C62828';return'#7F0000';}L.geoJSON(GEO,{style(f){const p=OWN[String(+(f.properties.area_numbe||0))]||0;return{fillColor:oc(p),fillOpacity:.75,color:'#222',weight:.5};},onEachFeature(f,l){const n=(f.properties.community||'').replace(/\\b\\w/g,c=>c.toUpperCase());const p=OWN[String(+(f.properties.area_numbe||0))]||0;l.bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>'+n+'</strong><br><span style="font-weight:700;color:#1565C0">'+p+'% owner-occupied</span></div>',{maxWidth:160});}}).addTo(map);`,leg)
}

export function evictionsHtml() {
  const d=JSON.stringify(EVICTION_BY_ZIP)
  const leg=`<div class="legend-title">Eviction Filing Rate</div>`+[['#FFF9C4','< 1%'],['#FFB74D','1–3%'],['#EF5350','3–5%'],['#C62828','5–7%'],['#7F0000','> 7%']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: Princeton Eviction Lab 2018</div>`
  return leafletShell(`const EV=${d};function ec(r){if(r>=7)return'#7F0000';if(r>=5)return'#C62828';if(r>=3)return'#EF5350';if(r>=1)return'#FFB74D';return'#FFF9C4';}EV.forEach(z=>{L.circle([z.lat,z.lng],{radius:800,fillColor:ec(z.rate),fillOpacity:.8,color:'#111',weight:.5}).bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>ZIP '+z.zip+'</strong><br><span style="font-weight:700;color:#C62828">'+z.rate+' per 100 renter households</span></div>',{maxWidth:150}).addTo(map);});`,leg)
}

export function tifHtml() {
  const d=JSON.stringify(TIF_DISTRICTS)
  const leg=`<div class="legend-title">TIF Annual Revenue</div>`+[['#1B5E20',18,'> $50M/yr'],['#F57F17',12,'$10–50M/yr'],['#E65100',7,'< $10M/yr']].map(([c,r,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c};border-radius:50%;width:${r}px;height:${r}px;"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: City of Chicago Annual TIF Reports</div>`
  return leafletShell(`const TIFS=${d};TIFS.forEach(d=>{const r=d.annualRevM>=50?18:d.annualRevM>=10?12:7;const c=d.annualRevM>=50?'#1B5E20':d.annualRevM>=10?'#F57F17':'#E65100';L.circleMarker([d.lat,d.lng],{radius:r,fillColor:c,fillOpacity:.85,color:'#111',weight:1}).bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>'+d.name+'</strong><br><span style="color:#F57F17;font-weight:700">~$'+d.annualRevM+'M/yr</span></div>',{maxWidth:180}).addTo(map);});`,leg)
}

export function lifeExpHtml() {
  const d=JSON.stringify(LIFE_EXPECTANCY_ZIPS)
  const leg=`<div class="legend-title">Life Expectancy</div>`+[['#1B5E20','80+ yrs'],['#388E3C','75–80'],['#F9A825','70–75'],['#E64A19','65–70'],['#7F0000','< 65 yrs']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: CDPH Community Health Atlas 2018</div>`
  return leafletShell(`const ZIPS=${d};function lc(y){if(y>=80)return'#1B5E20';if(y>=75)return'#388E3C';if(y>=70)return'#F9A825';if(y>=65)return'#E64A19';return'#7F0000';}ZIPS.forEach(z=>{L.circle([z.lat,z.lng],{radius:900,fillColor:lc(z.lifeExp),fillOpacity:.78,color:'#111',weight:.5}).bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>ZIP '+z.zip+'</strong><br><span style="font-weight:700;color:'+lc(z.lifeExp)+'">'+z.lifeExp+' years</span></div>',{maxWidth:150}).addTo(map);});`,leg)
}

export function leadLevelsHtml() {
  const d=JSON.stringify(BLOOD_LEAD_BY_ZIP)
  const leg=`<div class="legend-title">Children w/ Elevated Blood Lead</div>`+[['#FFF9C4','< 2%'],['#FFB74D','2–4%'],['#EF5350','4–7%'],['#C62828','7–10%'],['#7F0000','> 10%']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: CDPH CLPPP 2019</div>`
  return leafletShell(`const LEAD=${d};function lc(p){if(p>=10)return'#7F0000';if(p>=7)return'#C62828';if(p>=4)return'#EF5350';if(p>=2)return'#FFB74D';return'#FFF9C4';}LEAD.forEach(z=>{L.circle([z.lat,z.lng],{radius:800,fillColor:lc(z.pct),fillOpacity:.82,color:'#111',weight:.5}).bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>ZIP '+z.zip+'</strong><br><span style="font-weight:700;color:#BF360C">'+z.pct+'% of children under 6</span></div>',{maxWidth:150}).addTo(map);});`,leg)
}

export function asthmaHtml() {
  const d=JSON.stringify(ASTHMA_BY_ZIP)
  const leg=`<div class="legend-title">Asthma ER Rate (per 10,000)</div>`+[['#FFF9C4','< 30'],['#FFB74D','30–60'],['#EF5350','60–90'],['#C62828','90–120'],['#7F0000','> 120']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: CDPH 2019</div>`
  return leafletShell(`const AS=${d};function ac(r){if(r>=120)return'#7F0000';if(r>=90)return'#C62828';if(r>=60)return'#EF5350';if(r>=30)return'#FFB74D';return'#FFF9C4';}AS.forEach(z=>{L.circle([z.lat,z.lng],{radius:800,fillColor:ac(z.rate),fillOpacity:.82,color:'#111',weight:.5}).bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>ZIP '+z.zip+'</strong><br><span style="font-weight:700;color:#880E4F">'+z.rate+' per 10,000</span></div>',{maxWidth:160}).addTo(map);});`,leg)
}

export function industrialHtml() {
  const d=JSON.stringify(INDUSTRIAL_FACILITIES)
  const tc=JSON.stringify({petcoke:'#4A148C',coal_plant:'#1A237E',steel_mill:'#880E4F',heavy_industrial:'#BF360C',waste_transfer:'#E65100',treatment_plant:'#006064',scrap_metal:'#33691E'})
  const tl=JSON.stringify({petcoke:'Petcoke Terminal',coal_plant:'Former Coal Plant',steel_mill:'Former Steel Mill',heavy_industrial:'Heavy Industrial',waste_transfer:'Waste Transfer',treatment_plant:'Water Treatment',scrap_metal:'Scrap Metal'})
  const leg=`<div class="legend-title">Industrial Pollution Sites</div>`+[['#4A148C','Petcoke'],['#1A237E','Coal Plant'],['#BF360C','Heavy Industrial'],['#E65100','Waste Transfer']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c};border-radius:50%"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: EPA EJSCREEN; Illinois EPA</div>`
  return leafletShell(`const IND=${d};const TC=${tc};const TL=${tl};IND.forEach(f=>{const c=TC[f.type]||'#BF360C';L.circleMarker([f.lat,f.lng],{radius:7,fillColor:c,fillOpacity:.9,color:'#111',weight:1}).bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>'+f.name+'</strong><br><span style="color:#888;font-size:11px">'+f.hood+'</span><br><span style="color:'+c+';font-weight:700">'+TL[f.type]+'</span></div>',{maxWidth:200}).addTo(map);});`,leg)
}

export function chaHtml() {
  const d=JSON.stringify(CHA_DEMOLISHED_PROJECTS)
  const leg=`<div class="legend-title">Demolished CHA Projects</div><div class="legend-row"><div class="legend-swatch" style="background:#7B1FA2;border-radius:50%"></div><span>Size = units demolished</span></div><div class="src">Source: CHA; UIC Natl. Ctr. for Poverty Research</div>`
  return leafletShell(`const CHA=${d};CHA.forEach(p=>{const r=Math.max(7,Math.min(20,Math.round(p.units/300)));L.circleMarker([p.lat,p.lng],{radius:r,fillColor:'#7B1FA2',fillOpacity:.88,color:'#4A0072',weight:1.5}).bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>'+p.name+'</strong><br><span style="color:#7B1FA2;font-weight:700">Demolished: '+p.demolished+'</span><br><span style="font-size:11px;color:#555">Peak pop: '+p.peakPop.toLocaleString()+'<br>'+p.units.toLocaleString()+' units lost</span></div>',{maxWidth:200}).addTo(map);});`,leg)
}

export function bankingHtml() {
  const b=JSON.stringify(BANK_BRANCHES),p=JSON.stringify(PAYDAY_LENDERS)
  const leg=`<div class="legend-title">Banks vs Predatory Lenders</div><div class="legend-row"><div class="legend-swatch" style="background:#1565C0"></div><span>Bank branch</span></div><div class="legend-row"><div class="legend-swatch" style="background:#BF360C"></div><span>Payday / check-cash lender</span></div><div class="src">Source: FDIC; IDFPR Registry</div>`
  return leafletShell(`const B=${b};const P=${p};B.forEach(b=>{L.circleMarker([b.lat,b.lng],{radius:6,fillColor:'#1565C0',fillOpacity:.9,color:'#0D47A1',weight:1.5}).bindPopup('<div style="font-size:13px;font-family:sans-serif;color:#111"><strong>'+b.name+'</strong><br><span style="color:#1565C0">Bank Branch</span></div>',{maxWidth:150}).addTo(map);});P.forEach(p=>{L.circleMarker([p.lat,p.lng],{radius:6,fillColor:'#BF360C',fillOpacity:.9,color:'#7F0000',weight:1.5}).bindPopup('<div style="font-size:13px;font-family:sans-serif;color:#111"><strong>'+p.name+'</strong><br><span style="color:#BF360C">Predatory Lender</span></div>',{maxWidth:150}).addTo(map);});`,leg)
}

export function schoolsHtml() {
  const d=JSON.stringify(SCHOOL_CLOSURES_2013)
  const leg=`<div class="legend-title">CPS School Closures 2013</div><div class="legend-row"><div class="legend-swatch" style="background:#E53935;border-radius:50%"></div><span>School closed May 2013</span></div><div class="src">Source: Chicago Board of Education 2013</div>`
  return leafletShell(`const SC=${d};SC.forEach(s=>{L.circleMarker([s.lat,s.lng],{radius:6,fillColor:'#E53935',fillOpacity:.88,color:'#7F0000',weight:1.5}).bindPopup('<div style="font-size:13px;font-family:sans-serif;color:#111"><strong>'+s.name+'</strong><br><span style="color:#888;font-size:11px">'+s.hood+'</span><br><span style="color:#E53935;font-weight:700">Closed 2013</span></div>',{maxWidth:180}).addTo(map);});`,leg)
}

export function transitHtml(geo) {
  const g=JSON.stringify(geo),d=JSON.stringify(TRANSIT_SCORE_BY_AREA)
  const leg=`<div class="legend-title">CTA Transit Access Score</div>`+[['#7F0000','< 25 — Desert'],['#C62828','25–40'],['#FF8F00','40–55'],['#81C784','55–75'],['#1B5E20','> 75 — Excellent']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: CTA GTFS; CMAP 2023</div>`
  return leafletShell(`const GEO=${g};const TR=${d};function tc(s){if(s>=75)return'#1B5E20';if(s>=55)return'#81C784';if(s>=40)return'#FF8F00';if(s>=25)return'#C62828';return'#7F0000';}L.geoJSON(GEO,{style(f){const s=TR[String(+(f.properties.area_numbe||0))]||0;return{fillColor:tc(s),fillOpacity:.75,color:'#222',weight:.5};},onEachFeature(f,l){const n=(f.properties.community||'').replace(/\\b\\w/g,c=>c.toUpperCase());const s=TR[String(+(f.properties.area_numbe||0))]||0;l.bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>'+n+'</strong><br><span style="font-weight:700;color:#006064">Score: '+s+'/100</span></div>',{maxWidth:160});}}).addTo(map);`,leg)
}

export function foodDesertHtml() {
  const d=JSON.stringify(FOOD_DESERT_ZIPS)
  const leg=`<div class="legend-title">Food Desert Severity</div>`+[['#7F0000','Severe'],['#EF5350','Significant'],['#FFB74D','Moderate']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: USDA Food Access Research Atlas 2019</div>`
  return leafletShell(`const FD=${d};function fc(s){if(s>=3)return'#7F0000';if(s>=2)return'#EF5350';return'#FFB74D';}function fl(s){return s>=3?'Severe food desert':s>=2?'Significant food desert':'Moderate food desert';}FD.forEach(z=>{L.circle([z.lat,z.lng],{radius:900*z.severity,fillColor:fc(z.severity),fillOpacity:.78,color:'#111',weight:.5}).bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>ZIP '+z.zip+'</strong><br><span style="font-size:11px;color:#555">'+z.hood+'</span><br><span style="font-weight:700;color:'+fc(z.severity)+'">'+fl(z.severity)+'</span></div>',{maxWidth:180}).addTo(map);});`,leg)
}

export function parksHtml(geo) {
  const g=JSON.stringify(geo),d=JSON.stringify(PARK_ACRES_PER_1K)
  const leg=`<div class="legend-title">Park Acres per 1,000 Residents</div>`+[['#7F0000','< 1 acre'],['#C62828','1–2 acres'],['#FF8F00','2–4 acres'],['#81C784','4–8 acres'],['#1B5E20','> 8 acres']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: Chicago Park District 2023</div>`
  return leafletShell(`const GEO=${g};const PK=${d};function pc(a){if(a>=8)return'#1B5E20';if(a>=4)return'#81C784';if(a>=2)return'#FF8F00';if(a>=1)return'#C62828';return'#7F0000';}L.geoJSON(GEO,{style(f){const a=PK[String(+(f.properties.area_numbe||0))]||0;return{fillColor:pc(a),fillOpacity:.75,color:'#222',weight:.5};},onEachFeature(f,l){const n=(f.properties.community||'').replace(/\\b\\w/g,c=>c.toUpperCase());const a=PK[String(+(f.properties.area_numbe||0))]||0;l.bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>'+n+'</strong><br><span style="font-weight:700;color:#33691E">'+a+' acres per 1,000</span></div>',{maxWidth:160});}}).addTo(map);`,leg)
}

export function shootingsHtml(geo) {
  const g=JSON.stringify(geo),d=JSON.stringify(SHOOTINGS_BY_AREA)
  const leg=`<div class="legend-title">Gun Violence (per 10,000)</div>`+[['#FFF9C4','< 5'],['#FFB74D','5–15'],['#EF5350','15–35'],['#C62828','35–60'],['#7F0000','> 60']].map(([c,l])=>`<div class="legend-row"><div class="legend-swatch" style="background:${c}"></div><span>${l}</span></div>`).join('')+`<div class="src">Source: CPD CLEAR 2023</div>`
  return leafletShell(`const GEO=${g};const SH=${d};function sc(v){if(v>=60)return'#7F0000';if(v>=35)return'#C62828';if(v>=15)return'#EF5350';if(v>=5)return'#FFB74D';return'#FFF9C4';}L.geoJSON(GEO,{style(f){const v=SH[String(+(f.properties.area_numbe||0))]||0;return{fillColor:sc(v),fillOpacity:.78,color:'#222',weight:.5};},onEachFeature(f,l){const n=(f.properties.community||'').replace(/\\b\\w/g,c=>c.toUpperCase());const v=SH[String(+(f.properties.area_numbe||0))]||0;l.bindPopup('<div style="font-family:sans-serif;font-size:13px;color:#111"><strong>'+n+'</strong><br><span style="font-weight:700;color:#B71C1C">'+v+' per 10,000</span></div>',{maxWidth:160});}}).addTo(map);`,leg)
}

// ── Master dispatcher ─────────────────────────────────────────────────────────
export function buildHtmlForSlide(id, { commGeo } = {}) {
  switch (id) {
    case 'holc':          return holcHtml()   // self-fetching, no GeoJSON param needed
    case 'poverty':       return commGeo  ? povertyHtml(commGeo)        : null
    case 'income':        return commGeo  ? incomeHtml(commGeo)         : null
    case 'homeOwnership': return commGeo  ? homeOwnershipHtml(commGeo)  : null
    case 'transit':       return commGeo  ? transitHtml(commGeo)        : null
    case 'parks':         return commGeo  ? parksHtml(commGeo)          : null
    case 'shootings':     return commGeo  ? shootingsHtml(commGeo)      : null
    case 'evictions':     return evictionsHtml()
    case 'tif':           return tifHtml()
    case 'lifeExp':       return lifeExpHtml()
    case 'leadLevels':    return leadLevelsHtml()
    case 'asthma':        return asthmaHtml()
    case 'industrial':    return industrialHtml()
    case 'chaProjects':   return chaHtml()
    case 'banking':       return bankingHtml()
    case 'schools':       return schoolsHtml()
    case 'foodDesert':    return foodDesertHtml()
    default:              return null
  }
}

// ── Slide catalogue ───────────────────────────────────────────────────────────
export const SLIDES = [
  { id:'holc',          cat:'history',   color:'#E53935', needsHolc:false, needsGeo:false, title:'HOLC Redlining Map · 1940',        year:'1935–1940',  desc:'Federal HOLC grades A–D. Neighborhoods marked "D" (red) were denied mortgage access — devastating Black and immigrant communities for generations.' },
  { id:'chaProjects',   cat:'history',   color:'#7B1FA2', needsHolc:false, needsGeo:false, title:'Demolished CHA Public Housing',     year:'1995–2011',  desc:'Major CHA demolitions displaced 70,000+ residents. 47 separate projects. Replacement units never matched what was destroyed.' },
  { id:'poverty',       cat:'economy',   color:'#C62828', needsHolc:false, needsGeo:true,  title:'Poverty Rate',                      year:'ACS 2020',   desc:'South and West Side neighborhoods show poverty rates 3–5× higher than North Side areas — a direct legacy of redlining and intentional disinvestment.' },
  { id:'income',        cat:'economy',   color:'#388E3C', needsHolc:false, needsGeo:true,  title:'Median Household Income',           year:'ACS 2020',   desc:'The $79,000 income gap between Englewood and Lincoln Park — 8 miles apart — is the measurable result of 80+ years of policy-driven disinvestment.' },
  { id:'homeOwnership', cat:'economy',   color:'#1565C0', needsHolc:false, needsGeo:true,  title:'Home Ownership Rate',               year:'ACS 2020',   desc:'Homeownership — the primary wealth-building tool of the 20th century — remains dramatically lower in historically redlined communities.' },
  { id:'evictions',     cat:'economy',   color:'#C62828', needsHolc:false, needsGeo:false, title:'Eviction Filing Rate',              year:'2018',       desc:'Eviction concentrations correlate almost perfectly with 1940 HOLC "D" grade zones.' },
  { id:'tif',           cat:'economy',   color:'#F57F17', needsHolc:false, needsGeo:false, title:'TIF District Revenue',              year:'2023',       desc:'The Loop TIF captures $180M/yr in property taxes. South Side TIFs generate $1–3M for entire neighborhoods.' },
  { id:'banking',       cat:'economy',   color:'#1565C0', needsHolc:false, needsGeo:false, title:'Banks vs Predatory Lenders',        year:'2023',       desc:'Bank deserts on the South and West Sides are filled by predatory lenders charging 300%+ APR.' },
  { id:'lifeExp',       cat:'health',    color:'#388E3C', needsHolc:false, needsGeo:false, title:'Life Expectancy by ZIP Code',       year:'CDPH 2018',  desc:'A 22-year life expectancy gap within the same city. Downtown: 85 years. Englewood (60621): 63 years.' },
  { id:'leadLevels',    cat:'health',    color:'#BF360C', needsHolc:false, needsGeo:false, title:'Children with Elevated Blood Lead', year:'CDPH 2019',  desc:'Lead poisoning rates in redlined neighborhoods are 10–20× higher, permanently damaging children\'s cognitive development.' },
  { id:'asthma',        cat:'health',    color:'#880E4F', needsHolc:false, needsGeo:false, title:'Asthma Emergency Room Rate',        year:'CDPH 2019',  desc:'Asthma ER visits are 6× higher near industrial corridors concentrated in communities of color.' },
  { id:'industrial',    cat:'health',    color:'#4A148C', needsHolc:false, needsGeo:false, title:'Industrial Pollution Sites',        year:'2023',       desc:'Petcoke terminals, coal plants, steel mills, and waste transfer stations concentrate in communities of color.' },
  { id:'schools',       cat:'community', color:'#E53935', needsHolc:false, needsGeo:false, title:'CPS School Closures 2013',          year:'May 2013',   desc:'47 public schools closed in a single day — 90% in Black neighborhoods. Community anchors built over decades, destroyed overnight.' },
  { id:'transit',       cat:'community', color:'#006064', needsHolc:false, needsGeo:true,  title:'CTA Transit Access Score',          year:'2023',       desc:'Far South Side communities score 15–20/100, making it nearly impossible to reach jobs or hospitals without a car.' },
  { id:'foodDesert',    cat:'community', color:'#7F0000', needsHolc:false, needsGeo:false, title:'Food Desert Map',                   year:'USDA 2019',  desc:'Englewood, West Garfield Park, and Austin face the most severe food deserts in the city.' },
  { id:'parks',         cat:'community', color:'#33691E', needsHolc:false, needsGeo:true,  title:'Park Access per 1,000 Residents',   year:'2023',       desc:'Some South Side neighborhoods average under 1 acre of park per 1,000 residents.' },
  { id:'shootings',     cat:'community', color:'#B71C1C', needsHolc:false, needsGeo:true,  title:'Gun Violence by Community Area',    year:'CPD 2023',   desc:'Gun violence concentrates in the most economically distressed neighborhoods — a public health crisis driven by poverty and disinvestment.' },
  { id:'chiCoin',       cat:'chiCoin',   color:'#0F5EA8', needsHolc:false, needsGeo:false, title:'Chi Coin Economy Layer',            year:'Live',       desc:'Chi Coin overlays an economic layer on top of every map — routing value back to communities that every other map shows have been stripped of it.' },
]

export const CATEGORIES = [
  { id:'all',       label:'All 18' },
  { id:'history',   label:'History (2)'    },
  { id:'economy',   label:'Economy (6)'    },
  { id:'health',    label:'Health (4)'     },
  { id:'community', label:'Community (5)'  },
  { id:'chiCoin',   label:'Chi Coin'       },
]
