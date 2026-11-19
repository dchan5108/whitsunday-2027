/* 頁面：準備、今日、總覽、行程、費用。資料在 data.js */
(function(){
const D=window.DATA,$=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=n=>"$"+(Math.round(n*100)/100).toLocaleString("en-AU",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2});
const md=s=>{const [y,m,d]=s.split("-");return +m+"/"+(+d)};
const srcList=keys=>(keys||[]).filter(k=>D.SRC[k]).map(k=>`<a href="${esc(D.SRC[k][1])}" target="_blank" rel="noopener">${esc(D.SRC[k][0])}</a>`).join("<br>");

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


let OVERRIDES=(()=>{try{return JSON.parse(localStorage.getItem("wh27-days"))||{}}catch(e){return {}}})();
function liveDays(){return D.DAYS.map((d,i)=>({...d,...(OVERRIDES['day'+i]||{})}))}
function editDay(i){if(!ME||!ME.owner)return;const d=liveDays()[i];const title=prompt("修改 D"+(i+1)+" 標題",d.title);if(title===null)return;
 const note=prompt("修改當日備註",d.note||"");if(note===null)return;
 const lines=prompt("修改時間表（每行：時間 | 活動），留空時間亦可以",d.s.map(x=>x[0]+" | "+x[1]).join("\n"));if(lines===null)return;
 const entries=lines.split(/\n/).map(x=>x.split("|")).filter(x=>x.length>=2).map(x=>[x[0].trim(),x.slice(1).join("|").trim(),""]);
 const patch={title:title.trim(),note:note.trim(),s:entries};if(!patch.title||!entries.length){alert("標題同時間表不可為空");return}
 call({op:"dayset",key:'day'+i,value:patch}).then(j=>{if(!j.ok)throw Error(j.err);OVERRIDES=j.days||{};trip()}).catch(e=>alert("儲存失敗："+e.message))}
async function loadDays(){try{const j=await call({op:"dayget"});if(j.ok){OVERRIDES=j.days||{};LS.set("days",OVERRIDES);const t=TABS.find(x=>!$(x).hidden);if(t&&["home","today","trip"].includes(t))({home,today,trip})[t]()}}catch(e){}}

/* ---------- 行程 ---------- */
let cur=0;
function spotCard(k){const p=D.SPOTS[k];if(!p)return"";
 return `<details class="spot"><summary>${esc(p.n)}</summary><p>${esc(p.i)}</p><p class="meta">時間：${esc(p.h)}</p><p class="src">來源：<br>${srcList(p.s)}</p></details>`}
function trip(){
 const chips=liveDays().map((d,i)=>`<button type="button" data-i="${i}" aria-pressed="${i===cur}"><b>D${i+1}</b><small>${md(d.date)}（${d.wd}）</small></button>`).join("");
 const d=liveDays()[cur];
 const rows=d.s.map(([t,a,tag,x])=>`<li class="${tag||""}"><span class="t">${esc(t)}</span><div class="a">${esc(a)}${x&&x.ai?' <span class="ai">AI 建議</span>':""}${x&&x.sp?spotCard(x.sp):""}</div></li>`).join("");
 const cons=cur===D.DAYS.length-1?"":"";
 $("trip").innerHTML=`<div class="chips" role="group" aria-label="選擇日子">${chips}</div>
 <article class="card day"><div class="dh"><h2>D${cur+1}　${esc(d.title)}</h2><span class="dt">${md(d.date)}（${d.wd}）</span></div>
 ${d.ph?`<span class="ph">昆士蘭公眾假期</span>`:""}
 ${d.note?`<p class="note">${esc(d.note)}</p>`:""}${ME&&ME.owner?`<button type="button" class="btn ghost" id="edit-day">編輯當日行程</button>`:""}${highlightBadges(cur)}
 <ul class="tl">${rows}</ul>
 <p class="legend"><span class="k book">●</span> 要預訂　<span class="k done">✓</span> 已訂　<span class="ai">AI 建議</span> 不是你指定的，可改</p>
 <div class="dnav"><button type="button" data-i="${cur-1}" ${cur===0?"disabled":""}>‹ 前一日</button><button type="button" data-i="${cur+1}" ${cur===D.DAYS.length-1?"disabled":""}>後一日 ›</button></div></article>
 ${D.CONSIDER.length?`<section class="card"><h3>考慮中（未放入行程）</h3>${D.CONSIDER.map(c=>`<p class="note">${esc(c.note)}</p>${spotCard(c.sp)}`).join("")}</section>`:""}
 ${d.ph?`<p class="src">公眾假期來源：${srcList(["fw"])}</p>`:""}${cons}`;
 const edit=$("edit-day");if(edit)edit.onclick=()=>editDay(cur);$("trip").querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i>=0&&i<D.DAYS.length){cur=i;trip();window.scrollTo({top:0,behavior:"smooth"})}});
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

/* ---------- 其他頁（下一步製作） ---------- */
function todo(id,t){$(id).innerHTML=`<section class="card"><h2>${t}</h2><p class="note">製作中。</p></section>`}
/* ---------- 登入、文件、同步（後台：Google Apps Script） ---------- */
const API=D.CONFIG.api,LS={get:(k,d)=>{try{const v=localStorage.getItem("wh27-"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>{try{v==null?localStorage.removeItem("wh27-"+k):localStorage.setItem("wh27-"+k,JSON.stringify(v))}catch(e){}}};
let ME=LS.get("me",null),ST=LS.get("st",{}),DOCS=null,VIS=null;
const dev=()=>{const u=navigator.userAgent;return (/iPhone/.test(u)?"iPhone":/iPad/.test(u)?"iPad":/Android/.test(u)?"Android":/Mac/.test(u)?"Mac":/Windows/.test(u)?"Windows":"其他")+" · "+(/CriOS|Chrome/.test(u)?"Chrome":/Firefox|FxiOS/.test(u)?"Firefox":/Safari/.test(u)?"Safari":"瀏覽器")+(matchMedia("(display-mode: standalone)").matches?"（主畫面）":"")};
async function call(body){if(!API)throw new Error("後台未設定");const r=await fetch(API,{method:"POST",body:JSON.stringify(Object.assign({sk:ME&&ME.sk},body))});const j=await r.json();
 if(j.err==="sess"){ME=null;LS.set("me",null);DOCS=VIS=null;showGate("登入已失效，請重新登入。");throw new Error("登入已失效，請再登入")}return j}
const errTxt={notallowed:"這個 Gmail 未被加入可登入名單。",token:"Google 登入失敗，請再試。",aud:"後台的 CLIENT_ID 設定不正確。",big:"檔案太大（上限 10MB）。",owner:"只有你的帳戶看到登入記錄。"};
function gsi(cb){if(window.google&&google.accounts)return cb();const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=cb;s.onerror=()=>{const e=document.getElementById("gate-msg");if(e)e.textContent="無法載入 Google 登入，請檢查網絡。"};document.head.appendChild(s)}
function loginBtn(el,msg){gsi(()=>{google.accounts.id.initialize({client_id:D.CONFIG.gclient,ux_mode:"popup",callback:async r=>{msg.textContent="檢查中…";
 try{const j=await call({op:"login",idt:r.credential,dev:dev()});if(!j.ok){msg.textContent=errTxt[j.err]||("登入失敗："+j.err+(j.detail?"："+j.detail:""));return}
  ME={sk:j.sk,email:j.email,owner:!!j.owner,role:j.role};LS.set("me",ME);if(j.role==="pending"){showGate("登入成功，等待管理員批准。");return}hideGate();show("home");syncState();loadDays()}catch(e){msg.textContent=e.message}}});
 google.accounts.id.renderButton(el,{theme:"outline",size:"large",text:"signin_with",locale:"zh-TW"})})}
async function syncState(){if(!ME)return;try{const j=await call({op:"stget"});if(j.ok){ST=j.st||{};LS.set("st",ST);if(!$("prep").hidden)drawChk()}}catch(e){}}
function ping(){if(ME&&API)call({op:"ping",dev:dev()}).then(j=>{if(j.ok&&ME){ME.owner=!!j.owner;ME.role=j.role;LS.set("me",ME);if(j.role==="pending")showGate("登入成功，等待管理員批准。");else hideGate()}}).catch(e=>{if(!(e instanceof TypeError||!navigator.onLine))showGate("登入狀態未能驗證，請重新登入。")})}
const kb=n=>n>1048576?(n/1048576).toFixed(1)+" MB":Math.max(1,Math.round(n/1024))+" KB";
const dt=t=>new Date(t).toLocaleString("zh-HK",{hour12:false,month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"});

/* 準備頁（冰島版樣式）：預訂清單＋出發前要做。已訂／已完成會同步；「要再確認」「不用訂」只存在這部裝置 */
let ST2=LS.get("st2",{}),TKF="todo";const GOPEN={};
const stOf=id=>ST[id]?"ok":(ST2[id]||"todo");
const STL={todo:"未訂",ok:"已訂",recheck:"要再確認",na:"不用訂"};
async function setDone(k,v){if(v)ST[k]=Date.now();else delete ST[k];LS.set("st",ST);
 if(ME)try{const j=await call({op:"stset",key:k,val:v});if(j.ok){ST=j.st||ST;LS.set("st",ST);drawChk()}}catch(e){}}
function prepHero(){const start=new Date(D.TRIP.start+"T00:00:00+10:00"),left=Math.ceil((start-Date.now())/864e5);if(left<=0)return"";
 const pct=Math.max(2,Math.min(98,100-left/365*100)),tm=new Date().toLocaleTimeString("zh-HK",{timeZone:"Australia/Brisbane",hour:"numeric",minute:"2-digit",hour12:true});
 return `<section class="fcd noen" aria-label="倒數"><div class="fct"><b>${left} 日後出發</b><span>3月27日 – 3月30日</span></div><div class="fcb"><i style="width:${pct}%"></i><u style="left:${pct}%">✈️</u></div><div class="fcr"><span>今日</span><span>出發 🇦🇺</span></div><div class="fcr fci">昆士蘭時間 ${tm}</div></section>`}
function drawChk(){const el=$("chk");if(!el)return;
 const B=D.PREP.filter(p=>p.g==="book"),P=D.PREP.filter(p=>p.g!=="book");
 const isDone=p=>["ok","na"].includes(stOf(p.id)),nd=B.filter(isDone).length,nok=B.filter(p=>stOf(p.id)==="ok").length;
 const shown=B.filter(p=>TKF==="all"||(TKF==="done")===isDone(p));
 const groups=[...new Set(shown.map(p=>p.dl||"沒有期限"))];
 const item=p=>{const st=stOf(p.id);return `<li class="tk tk-${st}"><div class="tk-h"><select class="tst st ${st}" data-task="${p.id}" aria-label="狀態：${esc(p.n)}">${Object.keys(STL).map(k=>`<option value="${k}"${k===st?" selected":""}>${STL[k]}</option>`).join("")}</select><i class="tkcat noen" aria-hidden="true">${p.ic||"📌"}</i><span class="bkn">${esc(p.n)}</span>${p.imp?'<span class="tkimp">重要</span>':""}</div>
  <div class="bkm">${p.d?esc(p.d)+" · ":""}<b class="tkd">${esc(p.dl||"沒有期限")}</b>${p.ai?' <span class="ai">AI 建議</span>':""}</div>${p.s?`<div class="tk-a"><button type="button" class="tkdet" aria-expanded="false">詳情</button><div class="bkmore tkmore" hidden><p class="src">來源：<br>${srcList(p.s)}</p></div></div>`:""}</li>`};
 const pd=P.filter(p=>ST[p.id]).length,pp=P.length?Math.round(pd/P.length*100):0;
 el.innerHTML=`<div id="bookp"><section id="g-book"><h3 class="bkh">預訂</h3><div class="bkprog">已訂 <b>${nok}</b> / ${B.length}<small class="bklocal"> · ${ME?"已同步":"登入後同步"}</small><div class="bkbar"><i style="width:${B.length?nd/B.length*100:0}%"></i></div></div>
 <div class="tkf" role="group" aria-label="篩選狀態"><span class="tkseg">${[["todo","未訂",B.length-nd],["done","已訂",nd],["all","全部",B.length]].map(([k,t,n])=>`<button type="button" data-tkf="${k}" aria-pressed="${TKF===k}">${t} <b>${n}</b></button>`).join("")}</span></div>
 ${groups.length?groups.map(g=>{const open=GOPEN[g]!==false,r=shown.filter(p=>(p.dl||"沒有期限")===g);return `<h3 class="tiph bkday bkcol" role="button" tabindex="0" aria-expanded="${open}" data-g="${esc(g)}">${esc(g)}<span class="bkc">${r.length} 項</span></h3><ul class="bkchk tkl"${open?"":" hidden"}>${r.map(item).join("")}</ul>`}).join(""):`<p class="note">沒有項目。</p>`}</section></div>
 <section class="pcard"><h3>出發前要做</h3><div id="prep-pre"><div class="pdash2"><div class="pd-h"><b>已完成 ${pd} / ${P.length}</b><small>${pp}%</small></div><div class="pd-bar"><i style="width:${pp}%"></i></div></div>
 <ul class="prelist">${P.map(p=>`<li class="${ST[p.id]?"done":""}"><label><input type="checkbox" data-k="${p.id}" ${ST[p.id]?"checked":""}><span><b>${esc(p.n)}${p.ai?'<em class="ai">AI 建議</em>':""}</b>${p.d?`<small>${esc(p.d)}</small>`:""}${p.s?`<small class="src">來源：${srcList(p.s)}</small>`:""}</span></label></li>`).join("")}</ul>
 <p class="bnote">${ME?"剔了的會同步到旅伴的裝置。":"登入後才會同步。"}</p></div></section>`;
 el.querySelectorAll("[data-tkf]").forEach(b=>b.onclick=()=>{TKF=b.dataset.tkf;drawChk()});
 el.querySelectorAll(".bkcol").forEach(h=>{const t=()=>{GOPEN[h.dataset.g]=h.getAttribute("aria-expanded")!=="true";drawChk()};h.onclick=t;h.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();t()}}});
 el.querySelectorAll(".tkdet").forEach(b=>b.onclick=()=>{const m=b.nextElementSibling,o=m.hidden;m.hidden=!o;b.setAttribute("aria-expanded",o)});
 el.querySelectorAll("select.tst").forEach(c=>c.onchange=()=>{const k=c.dataset.task,v=c.value;if(v==="ok"||v==="todo")delete ST2[k];else ST2[k]=v;LS.set("st2",ST2);
  const was=!!ST[k];if((v==="ok")!==was)setDone(k,v==="ok");drawChk()});
 el.querySelectorAll("[data-k]").forEach(c=>c.onchange=()=>{setDone(c.dataset.k,c.checked);drawChk()})}
function drawDocs(){const el=$("docs");if(!el)return;
 if(!ME){el.innerHTML=`<p class="note">登入後可以上載及查看文件。文件存放在你的 Google Drive，不會上 GitHub。</p>`;return}
 el.innerHTML=`${ME.owner?`<label class="btn">上載文件<input type="file" id="docf" hidden></label>`:""} <span class="note" id="docmsg"></span>
 ${DOCS==null?`<p class="note">載入中…</p>`:DOCS.length?`<ul class="docl">${DOCS.map(d=>`<li><button type="button" class="lnk" data-open="${esc(d.id)}">${esc(d.name)}</button><small>${d.date?esc(d.date):"已上載"}</small>${ME.owner?`<button type="button" class="del" data-del="${esc(d.id)}" aria-label="刪除 ${esc(d.name)}">刪除</button>`:""}</li>`).join("")}</ul>`:`<p class="note">未有文件。</p>`}`;
 const msg=$("docmsg");
 if($("docf"))$("docf").onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>10485760){msg.textContent=errTxt.big;return}msg.textContent="上載中…";
  const rd=new FileReader();rd.onload=async()=>{try{const j=await call({op:"docup",name:f.name,mime:f.type,b64:String(rd.result).split(",")[1]});if(j.ok){DOCS=j.docs;drawDocs()}else msg.textContent=errTxt[j.err]||("上載失敗："+j.err)}catch(er){msg.textContent=er.message}};rd.readAsDataURL(f)};
 el.querySelectorAll("[data-open]").forEach(b=>b.onclick=async()=>{const w=window.open("","_blank");msg.textContent="開啟中…";
  try{const j=await call({op:"docget",id:b.dataset.open});if(!j.ok){msg.textContent="開啟失敗";w&&w.close();return}
   const bin=atob(j.b64),u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
   const url=URL.createObjectURL(new Blob([u8],{type:j.mime}));if(w)w.location=url;else location.href=url;msg.textContent=""}catch(er){msg.textContent=er.message;w&&w.close()}});
 el.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{const d=DOCS.find(x=>x.id===b.dataset.del);if(!confirm("刪除「"+(d?d.name:"")+"」？（會放入 Google Drive 垃圾桶，30 日內可還原）"))return;
  try{const j=await call({op:"docdel",id:b.dataset.del});if(j.ok){DOCS=j.docs;drawDocs()}}catch(er){msg.textContent=er.message}});
 if(DOCS==null)call({op:"docs"}).then(j=>{if(j.ok){DOCS=j.docs;drawDocs()}}).catch(er=>{msg.textContent=er instanceof TypeError?"沒有網絡，連線後才會顯示文件。":er.message})}
function drawVis(){const el=$("vis");if(!el)return;
 el.innerHTML=VIS==null?`<button type="button" class="btn ghost" id="visb">看登入記錄</button>`:VIS.length?`<table class="bt vt"><tbody>${VIS.map(v=>`<tr><td>${dt(v.t)}</td><td>${esc(v.email)}<small>${esc(v.act)}${v.dev?" · "+esc(v.dev):""}</small></td></tr>`).join("")}</tbody></table>`:`<p class="note">未有記錄。</p>`;
 const b=$("visb");if(b)b.onclick=async()=>{b.textContent="載入中…";try{const j=await call({op:"visits"});if(j.ok){VIS=j.visits;drawVis()}else b.textContent=errTxt[j.err]||j.err}catch(e){b.textContent=e.message}}}


let MEMBERS=null;
function drawMembers(){const el=$("members");if(!el||!ME||!ME.owner)return;
 el.innerHTML=`<h3>成員審批</h3><p class="note">只有管理員可以批准或拒絕登入申請。</p>${MEMBERS===null?`<button type="button" class="btn" id="loadmembers">載入申請</button>`:MEMBERS.length?`<ul class="docl">${MEMBERS.map(m=>`<li><strong>${esc(m.name||m.email)}</strong><small>${esc(m.email)} · ${esc(m.status)}</small>${m.status!=="approved"?`<button type="button" class="btn" data-email="${esc(m.email)}" data-act="approve">批准</button>`:""}${m.status!=="rejected"?`<button type="button" class="btn ghost" data-email="${esc(m.email)}" data-act="reject">拒絕</button>`:""}</li>`).join("")}</ul>`:`<p class="note">暫時未有申請。</p>`}<p class="note" id="membermsg"></p>`;
 const b=$("loadmembers");if(b)b.onclick=()=>loadMembers();
 el.querySelectorAll("[data-act]").forEach(b=>b.onclick=async()=>{const msg=$("membermsg");msg.textContent="處理中…";try{const j=await call({op:"mset",email:b.dataset.email,act:b.dataset.act});if(!j.ok)throw Error(j.err);MEMBERS=j.members;drawMembers()}catch(e){msg.textContent=e.message}})
}
async function loadMembers(){try{const j=await call({op:"members"});if(!j.ok)throw Error(j.err);MEMBERS=j.members;drawMembers()}catch(e){const m=$("membermsg");if(m)m.textContent=e.message}}

function prep(){
 $("prep").innerHTML=`<div id="prepHero">${prepHero()}</div><div id="chk"></div>
 <section class="pcard"><h3>文件</h3><div id="docs"></div></section>
 <section class="pcard"><h3>注意事項</h3><p class="note">內容待更新及補充來源。</p>
 <ul class="tips"><li>3 月風浪較大，船團可能因天氣取消。</li><li>旅程期間屬水母季，在海中浮潛要穿 stinger suit。</li><li>交通服務及接送時間請於出發前再確認。</li></ul></section>
 ${ME&&ME.owner?`<section class="pcard" id="members"></section><section class="pcard"><h3>登入記錄</h3><div id="vis"></div></section>`:""}
 <section class="pcard"><h3>帳戶</h3>${!API?`<p class="note">後台未設定：登入、文件和同步要先部署 Google Apps Script。</p>`:ME?`<p class="note">已登入：${esc(ME.email)}</p><button type="button" class="btn ghost" id="lgout">登出</button>`:`<p class="note">用 Gmail 登入，只限你同旅伴。</p><div id="gbtn"></div><p class="note" id="gmsg"></p>`}</section>`;
 if(API&&!ME)loginBtn($("gbtn"),$("gmsg"));
 const lo=$("lgout");if(lo)lo.onclick=()=>{call({op:"logout"}).catch(()=>{});ME=null;LS.set("me",null);DOCS=VIS=null;showGate()};
 drawChk();drawDocs();drawVis();drawMembers()}

/* ---------- Iceland-style countdown / gated landing ---------- */
function gateMarkup(message){const left=Math.ceil((new Date(D.TRIP.start+'T00:00:00+10:00')-Date.now())/86400000);return `<div class="ocean-scene"><div class="ocean-sun"></div><div class="ocean-island"></div><div class="ocean-wave"></div></div><div class="gate-card"><div class="eyebrow">27–30 MARCH · QUEENSLAND</div><h1>WHITSUNDAYS<br>2027</h1><div class="countdown">${left>0?`<strong>${left}</strong><span>Days to go</span>`:'Adventure time'}</div><p>${esc(message||'登入後查看四日行程、準備事項及旅行費用。')}</p><div id="gate-google"></div><p class="gate-msg" id="gate-msg"></p></div>`}
function showGate(message){let g=document.getElementById('auth-gate');if(!g){g=document.createElement('div');g.id='auth-gate';document.body.appendChild(g)}g.innerHTML=gateMarkup(message);g.hidden=false;document.body.classList.add('locked');if(D.CONFIG.api&&D.CONFIG.gclient)loginBtn(document.getElementById('gate-google'),document.getElementById('gate-msg'));else document.getElementById('gate-msg').textContent='請先在 data.js 設定 Apps Script URL 及 Google OAuth Client ID。'}
function hideGate(){const g=document.getElementById('auth-gate');if(g)g.hidden=true;document.body.classList.remove('locked')}
/* ---------- 總覽、今日（冰島版樣式） ---------- */
const WDS="日一二三四五六",dlab=x=>{const [y,m,dd]=x.date.split("-");return `${+m}月${+dd}日（${x.wd}）`};
const G=(inner,w=22)=>`<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
function home(){const days=liveDays(),B=D.PREP.filter(p=>p.g==="book"),nok=B.filter(p=>ST[p.id]).length,hero=prepHero();
 $("home").innerHTML=`<div id="homeL"><div id="homeTop"><section class="ovhero noen"><div class="ovh-t"><small>2027 年 3 月 27–30 日</small><h2>Whitsundays 海島之旅</h2></div>${hero}${hero?`<div class="ovh-rem"><button type="button" class="ovh-go" data-ovprep="1">預訂 ${nok} / ${B.length} 已完成 ›</button></div>`:""}</section>
 <div class="ovplan2"><h3 class="ovdh">四日行程</h3><div class="ovdays">${days.map((x,k)=>`<button type="button" class="ovday" data-day="${k}">${x.img?`<img class="ovimg" src="${esc(x.img)}" alt="" loading="lazy">`:`<span class="ovimg ovph" aria-hidden="true">🏝️</span>`}<span class="ovtx"><small>D${k+1} · ${dlab(x)}</small><b>${esc(x.title)}</b></span></button>`).join("")}</div></div>
 <section class="hcard glance ovplan noen"><div class="glh"><h3>旅程一覽</h3></div>
 <div class="glst"><div>${G('<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>')}<b>4</b><small>天</small></div><div>${G('<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>')}<b>3</b><small>晚</small></div><div>${G('<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>')}<b>${D.TRIP.people}</b><small>人</small></div><div>${G('<path d="M12 3v13M12 4 5 15h7M13 7l5 8h-5"/><path d="M3 18c3 2 15 2 18 0"/>')}<b>3</b><small>項活動</small></div></div></section>
 <section class="hcard hlinks"><div class="thd2"><b>🔗 常用連結</b></div><div class="hicons noen">
  <a href="tel:000"><i>📞</i><span>000</span></a>
  <a href="https://www.bom.gov.au/places/qld/airlie-beach/" target="_blank" rel="noopener"><i>🌤️</i><span>天氣</span></a>
  <a href="https://www.bom.gov.au/australia/tides/" target="_blank" rel="noopener"><i>🌊</i><span>潮汐</span></a>
  <a href="${esc(D.SRC.fer3[1])}" target="_blank" rel="noopener"><i>⛴️</i><span>船班</span></a></div></section></div></div>`;
 $("home").querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{cur=+b.dataset.day;show("trip");window.scrollTo(0,0)});
 const go=$("home").querySelector("[data-ovprep]");if(go)go.onclick=()=>{show("prep");window.scrollTo(0,0)}}

/* 日出日落（Airlie Beach，昆士蘭時間 UTC+10） */
function sunTimes(ds,lat=-20.27,lon=148.72,tz=10){const R=Math.PI/180,[y,m,d]=ds.split("-").map(Number);
 const N=Math.floor(275*m/9)-Math.floor((m+9)/12)*(1+Math.floor((y-4*Math.floor(y/4)+2)/3))+d-30,lh=lon/15;
 const f=rise=>{const t=N+((rise?6:18)-lh)/24,M=.9856*t-3.289;let L=(M+1.916*Math.sin(M*R)+.02*Math.sin(2*M*R)+282.634)%360;if(L<0)L+=360;
  let RA=(Math.atan(.91764*Math.tan(L*R))/R+360)%360;RA=(RA+(Math.floor(L/90)-Math.floor(RA/90))*90)/15;
  const sd=.39782*Math.sin(L*R),cd=Math.cos(Math.asin(sd)),ch=(Math.cos(90.833*R)-sd*Math.sin(lat*R))/(cd*Math.cos(lat*R));
  const H=(rise?360-Math.acos(ch)/R:Math.acos(ch)/R)/15;let UT=(H+RA-.06571*t-6.622-lh)%24;if(UT<0)UT+=24;return (UT+tz)%24};
 return [f(1),f(0)]}
const hm=h=>{let mm=Math.round(h*60);return String(Math.floor(mm/60)%24).padStart(2,"0")+":"+String(mm%60).padStart(2,"0")};

/* 天氣、UV、潮汐（Open-Meteo，免費；出發前約 16 日先有預報；上次結果存低離線用） */
let WX=LS.get("wx2",null),WXT=0;
function loadWeather(){const start=new Date(D.TRIP.start+"T00:00:00+10:00");if((start-Date.now())/864e5>15||Date.now()-WXT<6e5)return;WXT=Date.now();
 const q="latitude=-20.27&longitude=148.72&timezone=Australia%2FBrisbane&start_date="+D.TRIP.start+"&end_date="+D.TRIP.end;
 Promise.allSettled([fetch("https://api.open-meteo.com/v1/forecast?"+q+"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max").then(r=>r.json()),
  fetch("https://marine-api.open-meteo.com/v1/marine?"+q+"&hourly=sea_level_height_msl").then(r=>r.json())]).then(([a,b])=>{
  const o={daily:{},tide:{}};
  if(a.status==="fulfilled"&&a.value.daily){const x=a.value.daily;x.time.forEach((t,k)=>o.daily[t]={c:x.weather_code[k],hi:x.temperature_2m_max[k],lo:x.temperature_2m_min[k],pp:x.precipitation_probability_max[k],uv:x.uv_index_max[k]})}
  if(b.status==="fulfilled"&&b.value.hourly){const t=b.value.hourly.time,v=b.value.hourly.sea_level_height_msl;
   for(let k=1;k<v.length-1;k++){if(v[k]==null)continue;const hi=v[k]>v[k-1]&&v[k]>=v[k+1],lo=v[k]<v[k-1]&&v[k]<=v[k+1];if(!hi&&!lo)continue;const day=t[k].slice(0,10);(o.tide[day]=o.tide[day]||[]).push([t[k].slice(11,16),hi?"高潮":"低潮"])}}
  if(Object.keys(o.daily).length||Object.keys(o.tide).length){WX=o;LS.set("wx2",WX);if(!$("today").hidden)today()}}).catch(()=>{})}
const wxIcon=c=>c==null?"":c<1?"☀️":c<3?"🌤️":c<4?"☁️":c<50?"🌫️":c<70?"🌧️":c<80?"🌨️":c<90?"🌦️":"⛈️";
const uvLab=u=>u<3?"低":u<6?"中":u<8?"高":u<11?"甚高":"極高";

/* 今日重點勳章：冰島版金框＋Whitsundays 圖案 */
function goldBadge(id,sz=72){const u="g"+id;return `<svg class="bdgsv" viewBox="0 0 100 100" width="${sz}" height="${sz}" aria-hidden="true"><defs>
<linearGradient id="${u}r" x1=".15" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#fbeec4"/><stop offset=".22" stop-color="#d9b56a"/><stop offset=".5" stop-color="#8f6a2e"/><stop offset=".72" stop-color="#e6c983"/><stop offset="1" stop-color="#7a5624"/></linearGradient>
<linearGradient id="${u}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3a8"/><stop offset=".5" stop-color="#c49a4c"/><stop offset="1" stop-color="#e9cf8c"/></linearGradient>
<radialGradient id="${u}v" cx=".5" cy=".42" r=".6"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient><clipPath id="${u}c"><circle cx="50" cy="50" r="40.5"/></clipPath></defs>
<circle cx="50.6" cy="51.4" r="48" fill="#000" opacity=".2"/><circle cx="50" cy="50" r="48" fill="url(#${u}r)"/><circle cx="50" cy="50" r="44.6" fill="none" stroke="#5a3f18" stroke-width=".6" opacity=".55"/><circle cx="50" cy="50" r="43.4" fill="url(#${u}r)" transform="rotate(180 50 50)"/>
<g clip-path="url(#${u}c)"><g transform="translate(8 8)">${badgeArt(id).replace(/^<svg[^>]*>|<\/svg>$/g,"")}</g><rect width="100" height="100" fill="url(#${u}v)"/><path d="M14 38A38 38 0 0 1 60 11L62 18A32 32 0 0 0 22 42Z" fill="#fff" opacity=".16"/></g>
<circle cx="50" cy="50" r="40.6" fill="none" stroke="url(#${u}l)" stroke-width="1.4"/><path d="M9.5 40A42 42 0 0 1 40 8.5" stroke="#fff" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/><path d="M91 60A42 42 0 0 1 62 91" stroke="#3d2a10" stroke-width="1.4" fill="none" opacity=".35" stroke-linecap="round"/></svg>`}

let TD=null;
function today(){const days=liveDays(),tdy=new Date().toLocaleDateString("en-CA",{timeZone:"Australia/Brisbane"}),n=days.findIndex(x=>x.date===tdy);
 if(TD==null||TD>=days.length)TD=n<0?0:n;const i=TD,d=days[i],[sr,ss]=sunTimes(d.date),dl=ss-sr;
 const away=Math.ceil((new Date(d.date+"T00:00:00+10:00")-Date.now())/864e5),w=WX&&WX.daily[d.date],td=WX&&WX.tide[d.date];
 const rt=d.rt||[],ru=rt.length>1?"https://www.google.com/maps/dir/?api=1&origin="+encodeURIComponent(rt[0])+"&destination="+encodeURIComponent(rt[rt.length-1])+(rt.length>2?"&waypoints="+encodeURIComponent(rt.slice(1,-1).join("|")):""):"";
 const hl=HIGHLIGHTS[i]||[],q=[];
 if(td&&td.length)q.push(["🌊","潮汐（約）",td.map(x=>x[1]+" "+x[0]).join("　")]);
 if(w&&w.uv!=null)q.push(["🕶️","UV 指數 "+Math.round(w.uv)+"（"+uvLab(w.uv)+"）","塗防曬、戴帽"]);
 q.push(["🪼","水母季（stinger season）","在海中游泳或浮潛要穿 stinger suit"]);
 if(d.meet)q.push(["⛴️","集合／船班",d.meet]);
 const notes=[...(d.ph?["昆士蘭公眾假期"]:[]),...String(d.note||"").split("。").map(x=>x.trim()).filter(Boolean)];
 $("today").innerHTML=`<div id="todayIn"><section class="tcard thero"><div class="tsub noen">${n<0?"行程預覽":i===n?"今日":"行程預覽"}</div><div class="tdrow"><h2 class="tdate">D${i+1} · ${dlab(d)}</h2></div><div class="chips tchips noen" role="group" aria-label="選擇日子">${days.map((x,k)=>`<button type="button" data-tday="${k}" aria-pressed="${k===i}">D${k+1}</button>`).join("")}</div>
 <div class="tbtns"><button type="button" data-tgo="now"${n<0||n===i?" hidden":""}>今日</button>${ru?`<a class="troute tlink noen" href="${esc(ru)}" target="_blank" rel="noopener">${G('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',16)}當日路線</a>`:""}<button type="button" class="tfull2" data-tfull="1">完整時間表 ›</button></div></section>
 <section class="dsum2 dsB tdsB"><div class="dhB noen"><div class="dhL"><div class="dhR">${esc(d.rl||d.title)}</div><div class="dhS"><span>🏠 ${i===days.length-1?"回程":esc(D.TRIP.base.replace(/（.*）/,""))}</span></div></div><div class="dhW" id="twx">${w?`<b>${wxIcon(w.c)}</b><span>${Math.round(w.lo)}–${Math.round(w.hi)}°C${w.pp!=null?" · 降雨 "+w.pp+"%":""}</span>`:`<b>⏳</b><span>${away>16?"16 日內有預報":"預報載入中"}</span>`}</div></div>
 <div class="sunlab"><span>🌅 ${hm(sr)}</span><span>日照 ${Math.floor(Math.round(dl*60)/60)} 小時 ${Math.round(dl*60)%60} 分</span><span>🌇 ${hm(ss)}</span></div><div class="sunbar"></div></section>
 <section class="tcard tquick noen"><div class="thd2"><b>📍 今日重點</b></div>${hl.length?`<div class="bdgs noen" style="--n:${hl.length}">${hl.map(h=>`<button type="button" class="bdg">${goldBadge(h.id)}<span>${esc(h.name)}</span></button>`).join("")}</div>`:""}
 <ul class="tqi">${q.map(([ic,t,s])=>`<li><i>${ic}</i><span>${esc(t)}<small>${esc(s)}</small></span></li>`).join("")}</ul></section>
 ${notes.length?`<section class="tcard tnotes noen"><div class="thd2"><b>⚠️ 今日注意</b></div><ul>${notes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>`:""}</div>`;
 $("today").querySelectorAll("[data-tday]").forEach(b=>b.onclick=()=>{TD=+b.dataset.tday;today()});
 const nw=$("today").querySelector("[data-tgo]");if(nw)nw.onclick=()=>{TD=n;today()};
 $("today").querySelector("[data-tfull]").onclick=()=>{cur=i;show("trip");window.scrollTo(0,0)};
 loadWeather()}
/* ---------- 分頁 ---------- */
const TABS=["prep","today","home","trip","budget"];
function show(t){if(!ME||ME.role==="pending"||ME.role==="rejected"){showGate(ME&&ME.role==="pending"?"登入成功，等待管理員批准。":"");return}if(!TABS.includes(t))t="home";
 document.querySelectorAll(".bnav button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===t));
 TABS.forEach(s=>$(s).hidden=s!==t);
 ({prep,today,home,trip,budget})[t]();
 try{if(location.hash.slice(1)!==t)history.replaceState(null,"","#"+t)}catch(e){}}
document.querySelectorAll(".bnav button").forEach(b=>b.onclick=()=>{show(b.dataset.tab);window.scrollTo(0,0)});
window.addEventListener("hashchange",()=>show(location.hash.slice(1)));
showGate('正在驗證登入狀態…');if(ME&&ME.sk){call({op:'ping',dev:dev()}).then(j=>{if(!j.ok||j.role==='pending'||j.role==='rejected')throw Error('尚未獲批');ME.owner=!!j.owner;ME.role=j.role;LS.set('me',ME);hideGate();show(location.hash.slice(1)||'home');syncState();loadDays()}).catch(e=>{if(ME&&ME.sk&&(e instanceof TypeError||!navigator.onLine)){hideGate();show(location.hash.slice(1)||'home')}else{ME=null;LS.set('me',null);showGate('請使用 Google 登入。')}})}
/* 離線：用 service worker 保存網站，冇網絡都打得開 */
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
})();

