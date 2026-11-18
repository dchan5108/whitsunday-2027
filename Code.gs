/** Whitsundays 2027 — independent Apps Script backend.
 * Bind this script to a NEW Whitsundays Google Sheet. Do not paste over Iceland.
 * Script properties: GOOGLE_CLIENT_ID, OWNER_EMAIL, optionally DRIVE_FOLDER_ID.
 * Deploy as web app: Execute as me; Who has access: Anyone (API verifies Google ID tokens).
 */
const PREFIX='wh27_';
function prop_(k){return PropertiesService.getScriptProperties().getProperty(k)||''}
function json_(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON)}
function sheet_(n,headers){const ss=SpreadsheetApp.getActiveSpreadsheet();let s=ss.getSheetByName(PREFIX+n);if(!s){s=ss.insertSheet(PREFIX+n);s.appendRow(headers)}return s}
function verify_(token){if(!token)return '';const r=UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(token),{muteHttpExceptions:true});if(r.getResponseCode()!==200)return '';const j=JSON.parse(r.getContentText());if(j.aud!==prop_('GOOGLE_CLIENT_ID')||!['accounts.google.com','https://accounts.google.com'].includes(j.iss)||String(j.email_verified)!=='true'||Number(j.exp)*1000<Date.now())return '';return String(j.email||'').toLowerCase()}
function members_(){return sheet_('members',['email','status','role','name','requested']).getDataRange().getValues().slice(1).map((r,i)=>({row:i+2,email:String(r[0]).toLowerCase(),status:r[1],role:r[2],name:r[3],requested:r[4]})).filter(x=>x.email)}
function role_(email){if(email===prop_('OWNER_EMAIL').toLowerCase())return 'owner';const m=members_().find(x=>x.email===email);return !m?'':m.status==='approved'?String(m.role||'real'):m.status==='rejected'?'rejected':'pending'}
function digest_(s){return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s))}
function session_(sk){if(!sk)return null;const p=PropertiesService.getScriptProperties(),k='S_'+digest_(String(sk)),raw=p.getProperty(k);if(!raw)return null;let o;try{o=JSON.parse(raw)}catch(e){return null}const role=role_(o.email);if(o.exp<Date.now()||role==='rejected'||!role){p.deleteProperty(k);return null}return {email:o.email,role}}
function makeSession_(email){const sk=Utilities.getUuid()+Utilities.getUuid();PropertiesService.getScriptProperties().setProperty('S_'+digest_(sk),JSON.stringify({email,exp:Date.now()+30*86400000}));return sk}
function kv_(){const s=sheet_('state',['key','json','updated']);const rows=s.getDataRange().getValues().slice(1),out={};rows.forEach(r=>{if(r[0])try{out[String(r[0])]=JSON.parse(r[1])}catch(e){}});return out}
function setkv_(key,value){const s=sheet_('state',['key','json','updated']);const v=s.getDataRange().getValues();let row=v.findIndex((r,i)=>i&&r[0]===key)+1;if(!row)row=s.getLastRow()+1;s.getRange(row,1,1,3).setValues([[key,JSON.stringify(value),new Date()]])}
function docs_(){return sheet_('docs',['id','name','mime','owner','date']).getDataRange().getValues().slice(1).filter(r=>r[0]).map(r=>({id:String(r[0]),name:String(r[1]),mime:String(r[2]),owner:String(r[3]),date:String(r[4])}))}
function doGet(e){return json_({ok:1,service:'Whitsundays 2027',version:1})}
function doPost(e){let b={};try{b=JSON.parse(e.postData.contents)}catch(x){return json_({err:'json'})}try{return json_(handle_(b))}catch(x){return json_({err:'server',detail:String(x.message||x).slice(0,140)})}}
function handle_(b){if(b.op==='login'||b.op==='glogin'){
 const email=verify_(b.idt);if(!email)return {err:'token'};let role=role_(email);
 if(!role){sheet_('members',['email','status','role','name','requested']).appendRow([email,'pending','real',String(b.name||'').slice(0,80),new Date()]);role='pending'}
 if(role==='rejected')return {err:'notallowed'};
 return {ok:1,sk:makeSession_(email),email,role,owner:role==='owner'};
 }
 const s=session_(b.sk);if(!s)return {err:'sess'};
 if(b.op==='ping'||b.op==='gpull')return {ok:1,email:s.email,role:s.role,owner:s.role==='owner'};
 if(b.op==='logout'||b.op==='gout'){PropertiesService.getScriptProperties().deleteProperty('S_'+digest_(String(b.sk)));return {ok:1}}
 if(s.role==='pending')return {err:'pending'};
 if(b.op==='stget')return {ok:1,st:kv_().checklist||{}};
 if(b.op==='stset'){const lock=LockService.getScriptLock();lock.waitLock(15000);try{const st=kv_().checklist||{};const key=String(b.key||'');if(!/^[a-z0-9-]{1,40}$/i.test(key))return {err:'key'};if(b.val)st[key]=Date.now();else delete st[key];setkv_('checklist',st);return {ok:1,st}}finally{lock.releaseLock()}}
 if(b.op==='docs')return {ok:1,docs:docs_()};
 if(b.op==='docup'){
  if(s.role!=='owner')return {err:'admin'};const folderId=prop_('DRIVE_FOLDER_ID');if(!folderId)return {err:'folder'};
  const b64=String(b.b64||'');if(b64.length>14000000)return {err:'big'};
  const name=String(b.name||'document').slice(0,150),mime=String(b.mime||'application/octet-stream');
  const file=DriveApp.getFolderById(folderId).createFile(Utilities.newBlob(Utilities.base64Decode(b64),mime,name));
  sheet_('docs',['id','name','mime','owner','date']).appendRow([file.getId(),name,mime,s.email,new Date()]);return {ok:1,docs:docs_()};
 }
 if(b.op==='docget'){const d=docs_().find(x=>x.id===b.id);if(!d)return {err:'missing'};const f=DriveApp.getFileById(d.id);if(f.getSize()>10485760)return {err:'big'};return {ok:1,b64:Utilities.base64Encode(f.getBlob().getBytes()),mime:d.mime}}
 if(b.op==='docdel'){if(s.role!=='owner')return {err:'admin'};const d=docs_().find(x=>x.id===b.id);if(!d)return {err:'missing'};DriveApp.getFileById(d.id).setTrashed(true);const sh=sheet_('docs',['id','name','mime','owner','date']),v=sh.getDataRange().getValues(),i=v.findIndex((r,n)=>n&&r[0]===b.id);if(i>0)sh.deleteRow(i+1);return {ok:1,docs:docs_()}}
 if(b.op==='members'){if(s.role!=='owner')return {err:'admin'};return {ok:1,members:members_()}}
 if(b.op==='mset'){if(s.role!=='owner')return {err:'admin'};const m=members_().find(x=>x.email===String(b.email||'').toLowerCase());if(!m)return {err:'missing'};const a=String(b.act||'');if(!['approve','reject','pending'].includes(a))return {err:'act'};sheet_('members',['email','status','role','name','requested']).getRange(m.row,2,1,2).setValues([[a==='approve'?'approved':a==='reject'?'rejected':'pending',a==='approve'?'real':'']]);return {ok:1,members:members_()}}
 if(b.op==='visits'){if(s.role!=='owner')return {err:'admin'};return {ok:1,visits:[]}}
 return {err:'op'};
}
