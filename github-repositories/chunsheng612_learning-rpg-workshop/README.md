# 自學 RPG 遊戲製作工坊

一個可重複使用的 Codex Skill，整理《文道問劍》、英文版與《誓劍阿瓦隆》的製作經驗，協助把不同學科、教材與故事主題做成手機優先的答題 RPG。

## 使用範例

安裝後，在 Codex 輸入：

```text
使用 $learning-rpg-workshop，幫我製作一款國小五年級的分數學習遊戲，主題是星際冒險。
```

也可以先規劃或延續作品：

```text
使用 $learning-rpg-workshop，先幫我規劃一款國中自然冒險遊戲，這次先完成企劃、樣題和美術清單。
```

```text
使用 $learning-rpg-workshop，繼續這個遊戲，依素材清單逐張補圖並接入戰鬥。
```

## 流程涵蓋

- 學習目標、世界觀、劇情、章節與手機介面。
- 題庫打樣、解析、干擾項、審稿、選題與複習。
- 角色母版、逐張 AI 繪圖、透明素材、動作表與動態審稿。
- 答題戰鬥、HP／MP、技能、勝敗、獎勵與獨立存檔。
- 瀏覽器驗收、素材失敗處理、封裝與依需求發布。

可替換學科、角色、風格與技術，不要求每款作品沿用原作的素材數量。圖片工具、部署服務和雲端帳戶由使用環境提供；Skill 不附原遊戲、題庫、美術、帳戶或 API 金鑰。

## 安裝

下載此儲存庫，將包含 `SKILL.md`、`agents/`、`references/`、`assets/` 和 `scripts/` 的整個資料夾命名為 `learning-rpg-workshop`，放進個人 Skills 目錄：

```text
~/.codex/skills/learning-rpg-workshop/
```

若已設定 `CODEX_HOME`，使用該目錄下的 `skills/`。保留完整資料夾，不只複製 `SKILL.md`；已有同名 Skill 時先比較與備份。

## 內容位置

| 路徑 | 用途 |
|---|---|
| [SKILL.md](SKILL.md) | Skill 主流程與模式選擇 |
| [references/](references/) | 企劃、題庫、美術、程式、驗收與原作對照 |
| [assets/](assets/) | 新作品企劃與素材追蹤範本 |
| [scripts/create_game_brief.py](scripts/create_game_brief.py) | 建立新專案製作文件，不覆寫已有檔案 |
| [agents/openai.yaml](agents/openai.yaml) | Codex 顯示名稱與起始提示 |

## 建立企劃文件

在本儲存庫目錄中執行，需 Python 3.9 或更新版本，腳本本身不需外部套件：

```bash
python3 scripts/create_game_brief.py /absolute/path/star-math \
  --title '星海算術遠征' --subject '分數與比例' \
  --audience '國小五年級' --theme '星際探險' --slug star-math
```

這會產出企劃草稿、製作進度與空白素材清單；後續由使用者與 Codex 按需求完成內容、遊戲程式及素材。
