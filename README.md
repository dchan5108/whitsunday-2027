# Whitsundays 2027

Whitsundays 四日三夜網站（2027 年 3 月 27–30 日）。基於你現有 Whitsundays 行程資料及 Iceland 網站設計需求重新整合，**不是 Iceland 537KB HTML 原始碼的逐行 1:1 搬移**。

### 已實作

- 登入頁／倒數計時、Google Sign-In、後端 Session 驗證
- 新會員待審批、Owner 批准／拒絕、登入記錄
- 總覽、今日行程（旅行前標註預覽）、四日時間表、景點資料及來源
- 每日不同圖案的今日重點
- Owner 修改每日標題、備註及時間表（同步 Google Sheet）
- 出發前清單同步、文件上載及下載、旅行費用估算
- 獨立 Whitsundays Apps Script／Sheet；不修改 Iceland

### 未包含

- Iceland 網站全部原有模組逐行移植、Iceland badges 解鎖系統
- 完全保密的私人行程 API（靜態 `data.js` 可被檢視）
- 真實部署及登入測試

安裝請參考 `SETUP.md`。
