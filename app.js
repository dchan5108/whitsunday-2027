/* 頁面：準備、今日、總覽、行程、費用。資料在 data.js */
(function(){
const D=window.DATA,$=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=n=>"$"+(Math.round(n*100)/100).toLocaleString("en-AU",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2});
const md=s=>{const [y,m,d]=s.split("-");return +m+"/"+(+d)};
const srcList=keys=>(keys||[]).filter(k=>D.SRC[k]).map(k=>`<a href="${esc(D.SRC[k][1])}" target="_blank" rel="noopener">${esc(D.SRC[k][0])}</a>`).join("<br>");

/* ---------- 行程 ---------- */
let cur=0;
function spotCard(k){const p=D.SPOTS[k];if(!p)return"";
 return `<details class="spot"><summary>${esc(p.n)}</summary><p>${esc(p.i)}</p><p class="meta">時間：${esc(p.h)}</p><p class="src">來源：<br>${srcList(p.s)}</p></details>`}
function trip(){
 const chips=D.DAYS.map((d,i)=>`<button type="button" data-i="${i}" aria-pressed="${i===cur}"><b>D${i+1}</b><small>${md(d.date)}（${d.wd}）</small></button>`).join("");
 const d=D.DAYS[cur];
 const rows=d.s.map(([t,a,tag,x])=>`<li class="${tag||""}"><span class="t">${esc(t)}</span><div class="a">${esc(a)}${x&&x.ai?' <span class="ai">AI 建議</span>':""}${x&&x.sp?spotCard(x.sp):""}</div></li>`).join("");
 const cons=cur===D.DAYS.length-1?"":"";
 $("trip").innerHTML=`<div class="chips" role="group" aria-label="選擇日子">${chips}</div>
 <article class="card day"><div class="dh"><h2>D${cur+1}　${esc(d.title)}</h2><span class="dt">${md(d.date)}（${d.wd}）</span></div>
 ${highlightBadges(cur)}${d.ph?`<span class="ph">昆士蘭公眾假期</span>`:""}
 ${d.note?`<p class="note">${esc(d.note)}</p>`:""}
 <ul class="tl">${rows}</ul>
 <p class="legend"><span class="k book">●</span> 要預訂　<span class="k done">✓</span> 已訂　<span class="ai">AI 建議</span> 不是你指定的，可改</p>
 <div class="dnav"><button type="button" data-i="${cur-1}" ${cur===0?"disabled":""}>‹ 前一日</button><button type="button" data-i="${cur+1}" ${cur===D.DAYS.length-1?"disabled":""}>後一日 ›</button></div></article>
 ${D.CONSIDER.length?`<section class="card"><h3>考慮中（未放入行程）</h3>${D.CONSIDER.map(c=>`<p class="note">${esc(c.note)}</p>${spotCard(c.sp)}`).join("")}</section>`:""}
 ${d.ph?`<p class="src">公眾假期來源：${srcList(["fw"])}</p>`:""}${cons}`;
 $("trip").querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i>=0&&i<D.DAYS.length){cur=i;trip();window.scrollTo({top:0,behavior:"smooth"})}});
}

/* ---------- 旅行費用 ---------- */
function budget(){
 const N=D.TRIP.people,cats=["住宿","交通","活動","飲食","其他"];
 const each=c=>c.share==="shared"?c.amount/N:c.amount;
 const counted=D.COSTS.filter(c=>c.status==="confirmed"||c.status==="estimate");
 const sum=st=>counted.filter(c=>c.status===st).reduce((s,c)=>s+each(c),0);
 const conf=sum("confirmed"),est=sum("estimate"),miss=D.COSTS.filter(c=>c.status==="missing"),cons=D.COSTS.filter(c=>c.status==="consider");
 const lab={confirmed:"已確認",estimate:"估算",missing:"未有價錢",consider:"考慮中"};
 const row=c=>`<tr class="${c.status}"><td>${esc(c.n)}${c.ai?' <span class="ai">AI 建議</span>':""}<small>${c.share==="shared"?"兩人平分":"每人"}${c.note?" · "+esc(c.note):""}${c.s?`<br>${srcList(c.s)}`:""}</small></td><td><span class="st ${c.status}">${lab[c.status]}</span></td><td class="num">${c.status==="missing"?"—":fmt(each(c))}${c.share==="shared"&&c.status!=="missing"?`<small>總數 ${fmt(c.amount)}</small>`:""}</td></tr>`;
 $("budget").innerHTML=`<section class="card"><h2>費用（每人，AUD）</h2>
 <p class="note">用來估算旅費，不是記帳。兩人共用的費用（例如住宿）除以 2；機票、團費等按每人計。</p>
 <div class="tot"><div><small>已確認</small><b>${fmt(conf)}</b></div><div><small>估算</small><b>${fmt(est)}</b></div><div class="all"><small>合計（未完整）</small><b>${fmt(conf+est)}</b></div></div>
 ${miss.length?`<p class="miss">另有 <b>${miss.length}</b> 項未有價錢，未計入合計：${miss.map(c=>esc(c.n)).join("、")}。</p>`:""}</section>
 ${cats.map(cat=>{const r=D.COSTS.filter(c=>c.cat===cat&&c.status!=="consider");if(!r.length)return"";
   return `<section class="card"><h3>${cat}</h3><table class="bt"><tbody>${r.map(row).join("")}</tbody></table></section>`}).join("")}
 ${cons.length?`<section class="card"><h3>考慮中（不計入合計）</h3><table class="bt"><tbody>${cons.map(row).join("")}</tbody></table></section>`:""}`;
}

/* ---------- Landing / 今日 ---------- */
const dateLocal=s=>new Date(s+"T00:00:00");
const dayIndex=()=>{const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());return Math.round((today-dateLocal(D.TRIP.start))/86400000)};
const niceDate=s=>new Intl.DateTimeFormat("zh-HK",{month:"long",day:"numeric",weekday:"short"}).format(dateLocal(s));
function overview(){
 const diff=dayIndex(),total=D.DAYS.length,daysLeft=Math.max(0,-diff);
 const state=diff<0?"出發倒數":diff<total?"旅程進行中":"旅程回憶";
 const title=diff<0?`仲有 <strong>${daysLeft}</strong> 日，出發去海島！`:diff<total?`Day ${diff+1} · 今日去探索`:"Whitsundays · 美好回憶";
 $("home").innerHTML=`<section class="landing-intro"><div class="eyebrow">THE WHITSUNDAYS · QUEENSLAND</div><h2>Whitsundays 2027</h2><p>4日3夜 · ${esc(niceDate(D.TRIP.start))} — ${esc(niceDate(D.TRIP.end))}</p></section>
 <section class="card countdown"><span class="eyebrow">${state}</span><div class="count-main">${title}</div><p class="note">${diff<0?"查看行程及出發準備。":diff<total?"打開今日行程，睇吓下一站。":"隨時翻閱呢趟海島旅程。"}</p><button class="btn" type="button" data-go="${diff>=0&&diff<total?"today":"trip"}">${diff>=0&&diff<total?"查看今日行程":"探索四日行程"} →</button></section>
 <section class="section-head"><h2>四日海島日記</h2></section>
 <div class="day-cards">${D.DAYS.map((d,i)=>`<button class="day-preview" type="button" data-day="${i}"><span class="day-num">DAY ${String(i+1).padStart(2,"0")}</span><span class="day-name">${esc(d.title)}</span><span class="day-date">${esc(niceDate(d.date))} <span aria-hidden="true">↗</span></span></button>`).join("")}</div>
 <section class="card stay"><span class="eyebrow">OUR ISLAND BASE</span><h3>${esc(D.TRIP.base)}</h3><p class="note">${D.TRIP.people} 人 · 4 日 3 夜 · Airlie Beach</p></section>`;
 $("home").querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>navigate(b.dataset.go));
 $("home").querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{cur=+b.dataset.day;navigate("trip")});
}
function today(){
 const idx=dayIndex(),preview=idx<0,finished=idx>=D.DAYS.length,i=preview?0:Math.min(idx,D.DAYS.length-1),d=D.DAYS[i];
 $("today").innerHTML=`<section class="card today-head"><span class="eyebrow">${preview?"DAY 1 · 預覽":finished?"旅程已結束":"TODAY · DAY "+(i+1)}</span><h2>${esc(d.title)}</h2><p class="note">${esc(niceDate(d.date))}${preview?" · 出發前先睇第一日安排":""}</p><button class="btn" id="today-open" type="button">查看完整行程 →</button></section>${highlightBadges(i)}<section class="card"><h3>${preview?"第一日行程預覽":"當日行程"}</h3><ul class="tl">${d.s.map(([t,a,tag])=>`<li class="${esc(tag||"")}"><span class="t">${esc(t)}</span><div class="a">${esc(a)}</div></li>`).join("")}</ul></section>`;
 $("today-open").onclick=()=>{cur=i;navigate("trip")};
}
/* 今日重點：獨立圖案，避免不同景點重用同一款 */
/* 今日重點：每個地點獨立勳章圖案，不使用冰島的解鎖系統。 */
const HIGHLIGHTS=[
 [{id:"reef",name:"Heart Reef Scenic Flight"},{id:"airlie",name:"Airlie Beach"}],
 [{id:"sail",name:"Camira Sailing"},{id:"white",name:"Whitehaven Beach"},{id:"snorkel",name:"浮潛"}],
 [{id:"hamilton",name:"Hamilton Island"},{id:"peak",name:"Passage Peak"},{id:"catseye",name:"Catseye Beach"}],
 [{id:"walk",name:"Bicentennial Walkway"},{id:"plane",name:"回程"}]
];
function badgeArt(id){
 const water='<path d="M5 52 Q18 46 30 52 T55 52 T79 52 V81 H5Z" fill="#2c9ba7"/><path d="M5 61 Q20 55 35 61 T65 61 T79 61" stroke="#baf1e6" stroke-width="3" fill="none"/>';
 const sun='<circle cx="62" cy="23" r="11" fill="#ffdf94"/>';
 const art={
 reef:'<path d="M25 48 C10 36 20 24 32 30 Q42 18 49 31 Q62 27 62 41 Q62 52 43 64 Q27 58 25 48Z" fill="#eaf8ef" stroke="#fff" stroke-width="3"/><path d="M12 17 l48 12 -17 3 -8 12 -5 -13 -18 -8Z" fill="#fff" stroke="#30667a" stroke-width="2"/>',
 airlie:sun+'<path d="M9 53 Q30 43 45 51 L74 47 V74 H9Z" fill="#e7d7aa"/><path d="M46 50 l7 -26" stroke="#745a3d" stroke-width="4"/><path d="M53 24 Q35 11 27 23 Q46 20 53 24 Q63 10 74 19 Q62 18 53 24" fill="#397a59"/>',
 sail:sun+'<path d="M42 13 V62 M39 20 L17 52 H39Z M46 29 L68 52 H46Z" fill="#fff9e9" stroke="#ffffff" stroke-width="2"/><path d="M21 60 Q42 70 65 60 L59 69 H30Z" fill="#8b583c"/>',
 white:sun+'<path d="M7 58 Q25 39 42 50 T77 42 V80 H7Z" fill="#f8efcf"/><path d="M7 63 Q24 54 36 61 T77 54" fill="none" stroke="#fff" stroke-width="5"/>',
 snorkel:'<path d="M18 30 Q42 18 64 30 L61 46 Q42 57 21 46Z" fill="#f1fcfc" stroke="#155b75" stroke-width="4"/><path d="M40 27 V47 M65 35 H74 V19" stroke="#155b75" stroke-width="4" fill="none"/><circle cx="29" cy="39" r="3" fill="#4c9eb6"/>',
 hamilton:sun+'<path d="M7 54 Q20 28 38 44 Q56 21 77 53 V77 H7Z" fill="#4e9577"/><path d="M11 65 Q42 53 74 62" fill="none" stroke="#f3ebc9" stroke-width="6"/><path d="M46 56 L46 40 L59 40 L59 56Z" fill="#fff7e8"/>',
 peak:sun+'<path d="M7 64 L32 22 L47 44 L58 30 L78 64Z" fill="#4e8d77"/><path d="M25 64 L37 48 L44 54 L54 45 L65 64" fill="none" stroke="#c9e6bd" stroke-width="3"/>',
 catseye:sun+'<path d="M7 62 Q22 42 40 51 T77 49 V78 H7Z" fill="#e9d4a7"/><path d="M7 57 Q22 48 39 57 T77 54" fill="none" stroke="#fff8ed" stroke-width="4"/><path d="M16 33 Q25 27 34 33" fill="none" stroke="#fff" stroke-width="3"/>',
 walk:sun+'<path d="M7 58 Q25 38 42 52 T77 44 V78 H7Z" fill="#4b977a"/><path d="M15 79 Q32 53 57 54 T77 38" fill="none" stroke="#e9d3aa" stroke-width="9"/><path d="M15 79 Q32 53 57 54 T77 38" fill="none" stroke="#fff4d9" stroke-width="3"/>',
 plane:'<path d="M11 43 L70 18 L52 43 L70 56 L62 64 L44 52 L29 67 L23 62 L34 45Z" fill="#fffdf2" stroke="#2c6a80" stroke-width="2"/>'
 };
 return `<svg viewBox="0 0 84 84" role="img" aria-label="${esc(id)}"><defs><linearGradient id="sky-${id}" x2="0" y2="1"><stop stop-color="#dff9f2"/><stop offset="1" stop-color="#80d1d6"/></linearGradient></defs><circle cx="42" cy="42" r="40" fill="url(#sky-${id})"/>${water}${art[id]||sun}<circle cx="42" cy="42" r="39" fill="none" stroke="#fff7dd" stroke-width="2"/></svg>`
}
function highlightBadges(i){return `<section class="card highlight-section"><div class="section-head"><h3>今日重點</h3><span class="eyebrow">DAY ${i+1} HIGHLIGHTS</span></div><div class="highlight-grid">${(HIGHLIGHTS[i]||[]).map(h=>`<div class="highlight-badge"><span class="badge-art" aria-hidden="true">${badgeArt(h.id)}</span><span class="badge-label">${esc(h.name)}</span></div>`).join("")}</div></section>`}
/* ---------- 登入、文件、同步（後台：Google Apps Script） ---------- */
const API=D.CONFIG.api,LS={get:(k,d)=>{try{const v=localStorage.getItem("wh27-"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>{try{v==null?localStorage.removeItem("wh27-"+k):localStorage.setItem("wh27-"+k,JSON.stringify(v))}catch(e){}}};
let ME=LS.get("me",null),ST=LS.get("st",{}),DOCS=null,VIS=null;
const dev=()=>{const u=navigator.userAgent;return (/iPhone/.test(u)?"iPhone":/iPad/.test(u)?"iPad":/Android/.test(u)?"Android":/Mac/.test(u)?"Mac":/Windows/.test(u)?"Windows":"其他")+" · "+(/CriOS|Chrome/.test(u)?"Chrome":/Firefox|FxiOS/.test(u)?"Firefox":/Safari/.test(u)?"Safari":"瀏覽器")+(matchMedia("(display-mode: standalone)").matches?"（主畫面）":"")};
async function call(body){if(!API)throw new Error("後台未設定");const r=await fetch(API,{method:"POST",body:JSON.stringify(Object.assign({sk:ME&&ME.sk},body))});const j=await r.json();
 if(j.err==="sess"){ME=null;LS.set("me",null);DOCS=VIS=null;lockApp();renderGate("登入已失效，請重新登入。");throw new Error("登入已失效，請再登入")}return j}
const errTxt={notallowed:"這個 Gmail 未被加入可登入名單。",token:"Google 登入失敗，請再試。",aud:"後台的 CLIENT_ID 設定不正確。",big:"檔案太大（上限 10MB）。",owner:"只有你的帳戶看到登入記錄。"};
function gsi(cb){if(window.google&&google.accounts)return cb();const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=cb;document.head.appendChild(s)}
function loginBtn(el,msg){gsi(()=>{google.accounts.id.initialize({client_id:D.CONFIG.gclient,ux_mode:"popup",callback:async r=>{msg.textContent="檢查中…";
 try{const j=await call({op:"login",idt:r.credential,dev:dev()});if(!j.ok){msg.textContent=errTxt[j.err]||("登入失敗："+j.err);return}
  ME={sk:j.sk,email:j.email,owner:!!j.owner};LS.set("me",ME);prep();syncState();unlockApp();navigate("home")}catch(e){msg.textContent=e.message}}});
 google.accounts.id.renderButton(el,{theme:"outline",size:"large",text:"signin_with",locale:"zh-TW"})})}
async function syncState(){if(!ME)return;try{const j=await call({op:"stget"});if(j.ok){ST=j.st||{};LS.set("st",ST);if(!$("prep").hidden)drawChk()}}catch(e){}}
function ping(){if(ME&&API)call({op:"ping",dev:dev()}).then(j=>{if(j.ok&&ME){ME.owner=!!j.owner;LS.set("me",ME)}}).catch(()=>{})}
const kb=n=>n>1048576?(n/1048576).toFixed(1)+" MB":Math.max(1,Math.round(n/1024))+" KB";
const dt=t=>new Date(t).toLocaleString("zh-HK",{hour12:false,month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"});

function drawChk(){const el=$("chk");if(!el)return;const done=D.PREP.filter(p=>ST[p.id]).length;
 el.innerHTML=`<p class="note">已完成 ${done}／${D.PREP.length}${ME?"（已同步）":"（登入後同步）"}</p><ul class="chk">${D.PREP.map(p=>`<li class="${ST[p.id]?"done":""}"><label><input type="checkbox" data-k="${p.id}" ${ST[p.id]?"checked":""}><span><span class="n">${esc(p.n)}</span>${p.ai?' <span class="ai">AI 建議</span>':""}${p.d?`<small>${esc(p.d)}</small>`:""}${p.s?`<small class="src">來源：${srcList(p.s)}</small>`:""}</span></label></li>`).join("")}</ul>`;
 el.querySelectorAll("[data-k]").forEach(c=>c.onchange=async()=>{const k=c.dataset.k;if(c.checked)ST[k]=Date.now();else delete ST[k];LS.set("st",ST);drawChk();
  if(ME)try{const j=await call({op:"stset",key:k,val:c.checked});if(j.ok){ST=j.st;LS.set("st",ST);drawChk()}}catch(e){}})}
function drawDocs(){const el=$("docs");if(!el)return;
 if(!ME){el.innerHTML=`<p class="note">登入後可以上載及查看文件。文件存放在你的 Google Drive，不會上 GitHub。</p>`;return}
 el.innerHTML=`<label class="btn">上載文件<input type="file" id="docf" hidden></label> <span class="note" id="docmsg"></span>
 ${DOCS==null?`<p class="note">載入中…</p>`:DOCS.length?`<ul class="docl">${DOCS.map(d=>`<li><button type="button" class="lnk" data-open="${esc(d.id)}">${esc(d.name)}</button><small>${kb(d.size)} · ${dt(d.t)}</small><button type="button" class="del" data-del="${esc(d.id)}" aria-label="刪除 ${esc(d.name)}">刪除</button></li>`).join("")}</ul>`:`<p class="note">未有文件。</p>`}`;
 const msg=$("docmsg");
 $("docf").onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>10485760){msg.textContent=errTxt.big;return}msg.textContent="上載中…";
  const rd=new FileReader();rd.onload=async()=>{try{const j=await call({op:"docup",name:f.name,mime:f.type,b64:String(rd.result).split(",")[1]});if(j.ok){DOCS=j.docs;drawDocs()}else msg.textContent=errTxt[j.err]||("上載失敗："+j.err)}catch(er){msg.textContent=er.message}};rd.readAsDataURL(f)};
 el.querySelectorAll("[data-open]").forEach(b=>b.onclick=async()=>{const w=window.open("","_blank");msg.textContent="開啟中…";
  try{const j=await call({op:"docget",id:b.dataset.open});if(!j.ok){msg.textContent="開啟失敗";w&&w.close();return}
   const bin=atob(j.b64),u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
   const url=URL.createObjectURL(new Blob([u8],{type:j.mime}));if(w)w.location=url;else location.href=url;msg.textContent=""}catch(er){msg.textContent=er.message;w&&w.close()}});
 el.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{const d=DOCS.find(x=>x.id===b.dataset.del);if(!confirm("刪除「"+(d?d.name:"")+"」？（會放入 Google Drive 垃圾桶，30 日內可還原）"))return;
  try{const j=await call({op:"docdel",id:b.dataset.del});if(j.ok){DOCS=j.docs;drawDocs()}}catch(er){msg.textContent=er.message}});
 if(DOCS==null)call({op:"docs"}).then(j=>{if(j.ok){DOCS=j.docs;drawDocs()}}).catch(er=>{msg.textContent=er.message})}
function drawVis(){const el=$("vis");if(!el)return;
 el.innerHTML=VIS==null?`<button type="button" class="btn ghost" id="visb">看登入記錄</button>`:VIS.length?`<table class="bt vt"><tbody>${VIS.map(v=>`<tr><td>${dt(v.t)}</td><td>${esc(v.email)}<small>${esc(v.act)}${v.dev?" · "+esc(v.dev):""}</small></td></tr>`).join("")}</tbody></table>`:`<p class="note">未有記錄。</p>`;
 const b=$("visb");if(b)b.onclick=async()=>{b.textContent="載入中…";try{const j=await call({op:"visits"});if(j.ok){VIS=j.visits;drawVis()}else b.textContent=errTxt[j.err]||j.err}catch(e){b.textContent=e.message}}}

function prep(){
 $("prep").innerHTML=`<section class="card"><h2>帳戶</h2>${!API?`<p class="note">後台未設定：登入、文件和同步要先部署 Google Apps Script。</p>`:ME?`<p class="note">已登入：${esc(ME.email)}</p><button type="button" class="btn ghost" id="lgout">登出</button>`:`<p class="note">用 Gmail 登入，只限你同旅伴。</p><div id="gbtn"></div><p class="note" id="gmsg"></p>`}</section>
 <section class="card"><h2>出發前要做</h2><div id="chk"></div></section>
 <section class="card"><h2>文件</h2><div id="docs"></div></section>
 ${ME&&ME.owner?`<section class="card"><h2>登入記錄</h2><div id="vis"></div></section>`:""}
 <section class="card"><h2>注意事項</h2><p class="note">內容待更新及補充來源。</p>
 <ul class="tips"><li>3 月風浪較大，船團可能因天氣取消。</li><li>旅程期間屬水母季，在海中浮潛要穿 stinger suit。</li><li>Airlie Beach 沒有 Uber。</li></ul></section>`;
 if(API&&!ME)loginBtn($("gbtn"),$("gmsg"));
 const lo=$("lgout");if(lo)lo.onclick=()=>{call({op:"logout"}).catch(()=>{});ME=null;LS.set("me",null);DOCS=VIS=null;lockApp();renderGate()};
 drawChk();drawDocs();drawVis()}

/* ---------- 登入閘門 ---------- */
let AUTH_READY=false;
function lockApp(){AUTH_READY=false;document.body.classList.add("locked");document.querySelectorAll("main > section").forEach(el=>el.hidden=true)}
function unlockApp(){AUTH_READY=true;document.body.classList.remove("locked");$("gate").hidden=true}
function renderGate(message=""){
 lockApp();const el=$("gate");el.hidden=false;
 el.innerHTML=`<div class="gate-cover"><div class="gate-sun">☀</div><div class="gate-kicker">THE WHITSUNDAYS · QUEENSLAND</div><h1>Whitsundays 2027</h1><p>27–30 March 2027</p></div><div class="gate-panel"><h2>旅程登入</h2><p class="note">只限已獲授權的旅伴查看行程。</p>${message?`<p class="gate-error" role="status">${esc(message)}</p>`:""}<div id="gate-google"></div><p class="note" id="gate-msg"></p></div>`;
 if(!API||!D.CONFIG.gclient){$("gate-msg").textContent="登入服務尚未設定。";return}
 loginBtn($("gate-google"),$("gate-msg"));
}
async function verifySession(){
 if(!ME||!ME.sk){renderGate();return}
 lockApp();$("gate").hidden=false;$("gate").innerHTML='<div class="gate-panel"><h2>正在驗證登入…</h2></div>';
 try{const j=await call({op:"ping",dev:dev()});if(!j.ok)throw Error("登入已失效");ME.owner=!!j.owner;LS.set("me",ME);unlockApp();show(location.hash.slice(1)||"home");syncState()}
 catch(e){ME=null;LS.set("me",null);renderGate("登入已失效，請重新登入。")}
}
/* ---------- 分頁 ---------- */
const TABS=["prep","today","home","trip","budget"];
function navigate(t){show(t);window.scrollTo({top:0,behavior:"smooth"})}
function show(t){if(!AUTH_READY)return;if(!TABS.includes(t))t="home";
 document.querySelectorAll(".bnav button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===t));
 TABS.forEach(k=>$(k).hidden=k!==t);
 ({prep,today,home:overview,trip,budget})[t]();
 try{if(location.hash.slice(1)!==t)history.replaceState(null,"","#"+t)}catch(e){}
}
document.querySelectorAll(".bnav button").forEach(b=>b.onclick=()=>{show(b.dataset.tab);window.scrollTo(0,0)});
window.addEventListener("hashchange",()=>show(location.hash.slice(1)));
verifySession();
/* 不註冊舊版 Iceland service worker，避免錯誤快取。 */
})();
