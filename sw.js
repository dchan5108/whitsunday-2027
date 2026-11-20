/* keeps a copy of the trip page so it opens without internet; always tries the newest version first */
const C="whitsunday-2027-v8";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./index.html","./style.css","./prep.css","./today.css","./home.css","./trip.css","./day1.webp","./day2.webp","./day4.webp","./day3.webp","./images/landing-bg.webp","./app.js","./data.js","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin===location.origin){
    /* 網絡太慢（4 秒）或斷線就用已儲存的版本 */
    const nav=r.mode==="navigate",fb=()=>(nav?caches.match("./index.html").then(m=>m||caches.match("./")):caches.match(r,{ignoreSearch:true}));
    e.respondWith(new Promise(ok=>{let done=0;const fin=x=>{if(!done&&x){done=1;ok(x)}};
      const t=setTimeout(()=>fb().then(fin),4000);
      fetch(r).then(res=>{clearTimeout(t);if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(nav?"./index.html":r,cp))}fin(res)})
        .catch(()=>{clearTimeout(t);fb().then(m=>fin(m||Response.error()))})}));return}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res})))}
});
