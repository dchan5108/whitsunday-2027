/**
 * Whitsundays 2027 後台（Google Apps Script）
 * 功能：Gmail 登入、登入記錄、文件上載／同步、出發前清單同步。
 * 文件存放在你的 Google Drive，登入記錄存放在你的 Google Sheet；兩者都不會上 GitHub。
 *
 * 設定（專案設定 → 指令碼屬性）：
 *   CLIENT_ID       Google OAuth 用戶端 ID（同冰島網站同一個）
 *   ALLOWED_EMAILS  可以登入的 Gmail，用逗號分隔（你同旅伴）
 *   OWNER_EMAIL     你的 Gmail（只有這個帳戶看到登入記錄）
 * 部署：部署 → 新增部署作業 → 網頁應用程式；執行身分「我」；存取權「所有人」。
 */
const SV = 1;               // 後台版本
const MAX_BYTES = 10 * 1024 * 1024;
const SESSION_DAYS = 60;

function doPost(e) {
  let out;
  try { out = handle(JSON.parse(e.postData.contents || "{}")); }
  catch (err) { out = { err: String(err && err.message || err) }; }
  out.sv = SV;
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() { return ContentService.createTextOutput(JSON.stringify({ ok: true, sv: SV })).setMimeType(ContentService.MimeType.JSON); }

const P = () => PropertiesService.getScriptProperties();
const prop = k => (P().getProperty(k) || "").trim();
const emails = k => prop(k).toLowerCase().split(",").map(s => s.trim()).filter(String);

function handle(b) {
  if (b.op === "login") return login(b);
  const me = session(b.sk);
  if (!me) return { err: "sess" };
  switch (b.op) {
    case "ping": logVisit(me, "開啟", b.dev); return { ok: true, email: me, owner: me === emails("OWNER_EMAIL")[0] };
    case "logout": P().deleteProperty("sess_" + b.sk); return { ok: true };
    case "visits": return visits(me);
    case "docs": return { ok: true, docs: listDocs() };
    case "docup": return docUp(me, b);
    case "docget": return docGet(b.id);
    case "docdel": return docDel(me, b.id);
    case "stget": return { ok: true, st: JSON.parse(prop("STATE") || "{}") };
    case "stset": return stSet(b.key, b.val);
  }
  return { err: "op" };
}

/* ---------- 登入 ---------- */
function login(b) {
  const r = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(b.idt || ""), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) return { err: "token" };
  const t = JSON.parse(r.getContentText());
  if (t.aud !== prop("CLIENT_ID")) return { err: "aud" };
  if (String(t.email_verified) !== "true") return { err: "email" };
  const email = String(t.email).toLowerCase();
  if (emails("ALLOWED_EMAILS").indexOf(email) < 0) { logVisit(email, "拒絕登入", b.dev); return { err: "notallowed" }; }
  const sk = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  P().setProperty("sess_" + sk, JSON.stringify({ email, exp: Date.now() + SESSION_DAYS * 864e5 }));
  logVisit(email, "登入", b.dev);
  return { ok: true, sk, email, owner: email === emails("OWNER_EMAIL")[0] };
}
function session(sk) {
  if (!sk || !/^[a-f0-9]{64}$/.test(sk)) return null;
  const v = P().getProperty("sess_" + sk);
  if (!v) return null;
  const s = JSON.parse(v);
  if (s.exp < Date.now() || emails("ALLOWED_EMAILS").indexOf(s.email) < 0) { P().deleteProperty("sess_" + sk); return null; }
  return s.email;
}

/* ---------- 登入記錄（Google Sheet） ---------- */
function sheet() {
  let id = prop("LOG_SHEET");
  if (!id) {
    const ss = SpreadsheetApp.create("Whitsundays 2027 登入記錄");
    ss.getSheets()[0].appendRow(["時間", "Gmail", "動作", "裝置"]);
    id = ss.getId(); P().setProperty("LOG_SHEET", id);
  }
  return SpreadsheetApp.openById(id).getSheets()[0];
}
function logVisit(email, act, dev) { sheet().appendRow([new Date(), email, act, String(dev || "").slice(0, 60)]); }
function visits(me) {
  if (me !== emails("OWNER_EMAIL")[0]) return { err: "owner" };
  const sh = sheet(), n = sh.getLastRow();
  if (n < 2) return { ok: true, visits: [] };
  const from = Math.max(2, n - 199);
  const rows = sh.getRange(from, 1, n - from + 1, 4).getValues().reverse();
  return { ok: true, visits: rows.map(r => ({ t: new Date(r[0]).getTime(), email: r[1], act: r[2], dev: r[3] })) };
}

/* ---------- 文件（Google Drive） ---------- */
function folder() {
  let id = prop("DOC_FOLDER");
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const f = DriveApp.createFolder("Whitsundays 2027 文件");
  P().setProperty("DOC_FOLDER", f.getId());
  return f;
}
function listDocs() {
  const it = folder().getFiles(), out = [];
  while (it.hasNext()) {
    const f = it.next();
    out.push({ id: f.getId(), name: f.getName(), mime: f.getMimeType(), size: f.getSize(), t: f.getDateCreated().getTime(), by: f.getDescription() });
  }
  return out.sort((a, b) => b.t - a.t);
}
function docUp(me, b) {
  const bytes = Utilities.base64Decode(b.b64 || "");
  if (!bytes.length) return { err: "empty" };
  if (bytes.length > MAX_BYTES) return { err: "big" };
  const name = String(b.name || "file").replace(/[\\/:*?"<>|]/g, "_").slice(0, 120);
  const f = folder().createFile(Utilities.newBlob(bytes, b.mime || "application/octet-stream", name));
  f.setDescription(me);
  logVisit(me, "上載文件：" + name, "");
  return { ok: true, docs: listDocs() };
}
function docGet(id) {
  const f = DriveApp.getFileById(id);
  if (!inFolder(f)) return { err: "nf" };
  return { ok: true, name: f.getName(), mime: f.getMimeType(), b64: Utilities.base64Encode(f.getBlob().getBytes()) };
}
function docDel(me, id) {
  const f = DriveApp.getFileById(id);
  if (!inFolder(f)) return { err: "nf" };
  logVisit(me, "刪除文件：" + f.getName(), "");
  f.setTrashed(true);   // 放入 Google Drive 垃圾桶，30 日內可以還原
  return { ok: true, docs: listDocs() };
}
function inFolder(f) { const fid = folder().getId(), ps = f.getParents(); while (ps.hasNext()) if (ps.next().getId() === fid) return true; return false; }

/* ---------- 出發前清單同步 ---------- */
function stSet(key, val) {
  if (!/^[a-z0-9_-]{1,40}$/i.test(key || "")) return { err: "key" };
  const lock = LockService.getScriptLock(); lock.waitLock(5000);
  try {
    const st = JSON.parse(prop("STATE") || "{}");
    if (val) st[key] = Date.now(); else delete st[key];
    P().setProperty("STATE", JSON.stringify(st));
    return { ok: true, st };
  } finally { lock.releaseLock(); }
}
