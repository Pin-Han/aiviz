# AIViz

> 你的商品，AI 搜得到嗎？

電商商品頁 AI 可見度健檢工具。輸入商品 URL，60 秒內告訴你 AI 搜尋引擎看不看得到你的商品。

[English](README.md)

## 功能

1. **結構化資料評分** (0-100 分) — 檢查商品頁是否有正確的 schema.org 標記
2. **AI 可讀性評估** — 從 AI 搜尋引擎的角度評估商品資料品質
3. **一鍵修復建議** — 具體告訴你缺什麼，附上可直接複製的 JSON-LD 程式碼

## 誰適合用？

- Shopify 店家
- CYBERBIZ 店家
- 91APP 店家
- WooCommerce / 自架站

## 開發進度

| 階段 | 說明 | 狀態 |
|------|------|------|
| [Phase 1](docs/plans/phase1.md) | 專案基礎建設 | Completed |
| [Phase 2](docs/plans/phase2.md) | 爬蟲與解析器 | Completed |
| [Phase 3](docs/plans/phase3.md) | 評分引擎 | Completed |
| [Phase 4](docs/plans/phase4.md) | AI 層與流量限制 | Completed |
| [Phase 5](docs/plans/phase5.md) | API 端點 | Completed |
| [Phase 6](docs/plans/phase6.md) | 前端介面 | Completed |
| [Phase 7](docs/plans/phase7.md) | 部署與文件 | Completed |
| [Phase 8](docs/plans/phase8.md) | UX 優化：評分智慧化 | Not Started |

## 本地開發

```bash
npm install
cd frontend && npm run dev
```

## 授權

MIT
