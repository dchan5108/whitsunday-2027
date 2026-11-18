# Whitsundays 2027 — 安裝及部署指南

## 網站內容

- `index.html`, `style.css`, `app.js`, `data.js`: 網站前端
- `Code.gs`: **獨立** Google Apps Script 後台；請勿放到 GitHub Pages
- `README.md`: 功能及測試說明

## 1. 建立獨立後台

1. 在現有 Whitsundays 專用 Google Sheet 開啟 **Extensions → Apps Script**（不要覆蓋 Iceland 的 Apps Script）。
2. 將 `Code.gs` 貼到 Whitsundays 的 Apps Script 專案。
3. 在 **Project Settings → Script properties** 設定：
   - `GOOGLE_CLIENT_ID`: Google OAuth Web Client ID
   - `OWNER_EMAIL`: 你的 Google 登入電郵（**只放在 Apps Script 屬性，不放前端**）
   - `DRIVE_FOLDER_ID`: 你已建立的 `Trips planning / 2027 Whitsunday` 資料夾 ID（如要使用文件上載功能）
4. Deploy → New deployment → Web app；Execute as **Me**；Who has access **Anyone**。複製 `/exec` URL。
5. 在 `data.js` 填入 `CONFIG.api` 的 `/exec` URL；確認 `CONFIG.gclient` 與後台 `GOOGLE_CLIENT_ID` 相同。
6. Google Cloud OAuth Client 的 Authorized JavaScript origins 加入你 GitHub Pages 網站的 origin（例如 `https://username.github.io`）。

## 2. 部署前端

將 `index.html`、`style.css`、`app.js`、`data.js` 放到 Whitsundays 的 GitHub Pages repository。**不要**上傳 `Code.gs` 或任何私密文件。

## 3. 驗收

1. 未登入：只能看到登入頁；不能透過頁面選單看到行程。
2. Owner 登入：可查看所有頁面、編輯每日行程、審批成員、上載文件。
3. 新 Gmail 登入：顯示待審批；Owner 批准後可進入。
4. 跨兩個裝置測試清單勾選、行程編輯及文件存取。
5. 測試登出、失效 Session、拒絕成員及後台不可用。

## 安全限制

**重要：** GitHub Pages 是公開靜態網站，`data.js` 內的行程與費用仍可從原始碼讀取。登入頁只能阻止一般訪客從介面查看，**不能視為資料保密**。如要真正保密，必須把所有行程、費用搬到經 Google 驗證的後台 API，前端登入後才讀取。

**目前未經實際 Google 登入／Apps Script 部署測試**；需你填入專案設定並部署後才能驗證。
