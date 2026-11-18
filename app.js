/* 頁面：總覽、今日、行程、旅行費用、注意事項。資料在 data.js */
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
 const rows=d.s.map(([t,a,tag,x])=>`<li class="${tag||""}"><span class="t">${esc(t)}</span><div class="a">${esc(a)}${x&&x.sp?spotCard(x.sp):""}</div></li>`).join("");
 const cons=cur===D.DAYS.length-1?"":"";
 $("trip").innerHTML=`<div class="chips" role="group" aria-label="選擇日子">${chips}</div>
 <article class="card day"><div class="dh"><h2>D${cur+1}　${esc(d.title)}</h2><span class="dt">${md(d.date)}（${d.wd}）</span></div>
 ${d.ph?`<span class="ph">昆士蘭公眾假期</span>`:""}
 ${d.note?`<p class="note">${esc(d.note)}</p>`:""}
 <ul class="tl">${rows}</ul>
 <p class="legend"><span class="k book">●</span> 要預訂　<span class="k done">✓</span> 已訂</p>
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
 const row=c=>`<tr class="${c.status}"><td>${esc(c.n)}<small>${c.share==="shared"?"兩人平分":"每人"}${c.note?" · "+esc(c.note):""}${c.s?`<br>${srcList(c.s)}`:""}</small></td><td><span class="st ${c.status}">${lab[c.status]}</span></td><td class="num">${c.status==="missing"?"—":fmt(each(c))}${c.share==="shared"&&c.status!=="missing"?`<small>總數 ${fmt(c.amount)}</small>`:""}</td></tr>`;
 $("budget").innerHTML=`<section class="card"><h2>旅行費用（每人，AUD）</h2>
 <p class="note">用來估算旅費，不是記帳。兩人共用的費用（住宿、租車、油費、水上電單車）除以 2；機票、團費等按每人計。</p>
 <div class="tot"><div><small>已確認</small><b>${fmt(conf)}</b></div><div><small>估算</small><b>${fmt(est)}</b></div><div class="all"><small>合計（未完整）</small><b>${fmt(conf+est)}</b></div></div>
 ${miss.length?`<p class="miss">另有 <b>${miss.length}</b> 項未有價錢，未計入合計：${miss.map(c=>esc(c.n)).join("、")}。</p>`:""}</section>
 ${cats.map(cat=>{const r=D.COSTS.filter(c=>c.cat===cat&&c.status!=="consider");if(!r.length)return"";
   return `<section class="card"><h3>${cat}</h3><table class="bt"><tbody>${r.map(row).join("")}</tbody></table></section>`}).join("")}
 ${cons.length?`<section class="card"><h3>考慮中（不計入合計）</h3><table class="bt"><tbody>${cons.map(row).join("")}</tbody></table></section>`:""}`;
}

/* ---------- 其他頁（下一步製作） ---------- */
function todo(id,t){$(id).innerHTML=`<section class="card"><h2>${t}</h2><p class="note">製作中。</p></section>`}
function tips(){
 $("tips").innerHTML=`<section class="card"><h2>注意事項</h2><p class="note">內容待更新及補充來源。</p>
 <ul class="tips"><li>3 月風浪較大，船團可能因天氣取消。</li><li>旅程期間屬水母季，在海中浮潛要穿 stinger suit。</li><li>Airlie Beach 沒有 Uber。</li></ul></section>`}

/* ---------- 分頁 ---------- */
const TABS=["home","today","trip","budget","tips"];
function show(t){if(!TABS.includes(t))t="trip";
 document.querySelectorAll(".bnav button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===t));
 TABS.forEach(s=>$(s).hidden=s!==t);
 ({home:()=>todo("home","總覽"),today:()=>todo("today","今日"),trip,budget,tips})[t]();
 try{if(location.hash.slice(1)!==t)history.replaceState(null,"","#"+t)}catch(e){}}
document.querySelectorAll(".bnav button").forEach(b=>b.onclick=()=>{show(b.dataset.tab);window.scrollTo(0,0)});
window.addEventListener("hashchange",()=>show(location.hash.slice(1)));
show(location.hash.slice(1));
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
