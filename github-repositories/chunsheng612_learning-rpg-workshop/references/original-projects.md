# 原作對照與查證入口

提煉自本機「自學遊戲」工作區。下列路徑相對於原工作區；其他位置使用 Skill 時不要求資料存在，也不自動下載或複製原作。

| 資料 | 可查內容 |
|---|---|
| `wendao-wenjian-v2026-08-28/` | 國語／修仙答題 RPG、早期 4×5 主角圖集 |
| `english-wenjian-v2026-08-29/` | 保留操作架構，替換學科、題型、程度與朗讀 |
| `Avalon English Quest/` | 更換世界觀、角色、收藏、敵影、共享 MP、手機介面與獨立存檔 |
| `wendao-wenjian-release/` | 素材接線、封裝、Firebase 與 Cloudflare 發布 |

## Avalon 定位

- `README.md`：版本概覽與後期玩法／聲音修正。
- `reference/design-planning-2026-08-30/01-game-design.md`、`02-story.md`：企劃、故事；`03-art-direction.md`：母版、ID、逐張生圖；`04-learning-and-sources.md`：來源、命題、複習。
- 同資料夾 `06`–`10` 文件：收服、MP 與能力介面多次演進的歷史設計，不全部同時當最新規格。
- `reference/art-production-2026-08-30/CONTINUE-GENERATION.md`、`catalog.json`、`metadata/`：素材與圖集審查紀錄、續做清單。
- `src/App.tsx`、`src/battleRules.ts`、`src/abilityRules.ts`：實際玩法、save key、勝敗與技能。
- `src/questionSelector.ts`、`src/content/verified-question-seed.json`：實際選題與啟用題庫，不用候選詞或總庫數冒充可玩題數。
- `src/enemySpriteManifest.ts`：ready／reserved；圖已生成不代表開放部署。
- `src/audio.ts`、`src/englishSpeech.ts`：實際音軌與朗讀；提示詞文件的尚待接入可能已過時。
- `docs/player-audit-and-fixes.md`、`docs/game-first-qa-checklist.md`、`scripts/verify-*.mjs`：玩家問題與驗證入口。

## 資料矛盾

先從目前工作分支、入口與 package scripts 確認消費端，再查資料及文件。修改時間是線索，不是正確性的保證。

已觀察例子：舊題數／生成數和後續報告不同；舊文件寫存活結算，後期要求擊破；能力曾藏在頭像後，後期直接四技能；legacy storage key 不等於 App 用的 key。這些是查證提醒，不能變成新作固定規格。

寫目前完成前追蹤實際資料、manifest 與畫面；本次沒跑原作驗證時，原文件結果寫成歷史紀錄，不冒稱重新驗證通過。
