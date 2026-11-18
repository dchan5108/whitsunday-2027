# whitsunday-2027

Whitsundays 2027（3/27–3/30）旅行網站，靜態 GitHub Pages。

- `data.js`：行程、景點、費用、出發前清單、後台設定
- `app.js`：頁面（準備、今日、總覽、行程、費用）
- `apps-script/Code.gs`：後台（Gmail 登入、登入記錄、文件同步、清單同步）

私隱：訂位編號、確認電郵、護照、電話、Gmail 地址不可放入這個 repo。
文件存放在擁有者的 Google Drive，登入記錄存放在 Google Sheet。

## 設定後台

1. 開 https://script.google.com ，新增專案，把 `apps-script/Code.gs` 全部貼上。
2. 專案設定 → 指令碼屬性，加入：
   - `CLIENT_ID`：Google OAuth 用戶端 ID（與 `data.js` 的 `gclient` 相同）
   - `ALLOWED_EMAILS`：可登入的 Gmail，以逗號分隔
   - `OWNER_EMAIL`：可看登入記錄的 Gmail
3. 部署 → 新增部署作業 → 類型「網頁應用程式」；執行身分「我」；存取權「所有人」。第一次會要求授權 Drive、Sheet 和對外連線。
4. 把網頁應用程式網址填入 `data.js` 的 `CONFIG.api`。
5. 之後改 `Code.gs` 要「管理部署作業 → 編輯 → 新版本」，網址不變。
