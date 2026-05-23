# 游戏大厅

根目录 `index.html` 为游戏门户首页，各子文件夹（如 `arrow1`）为独立 Cocos Web 游戏。

## 本地预览

```bash
# 需要本地 HTTP 服务（fetch 无法读 file:// 下的 games.json）
npx --yes serve .
# 浏览器打开 http://localhost:3000
```

## 添加新游戏

1. 将 Cocos（或其它）Web 构建产物放到新文件夹，例如 `mygame/`，且内含 `index.html`。
2. （可选）在同目录创建 `game.meta.json` 自定义展示：

```json
{
  "title": "我的新游戏",
  "description": "一句话简介",
  "thumb": "thumb.png"
}
```

3. 重新生成游戏列表：

```bash
node scripts/generate-games.js
```

4. 刷新首页即可看到新游戏。

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 门户首页 |
| `games.json` | 游戏清单（可由脚本生成） |
| `site/` | 门户样式与脚本 |
| `scripts/generate-games.js` | 自动扫描含 `index.html` 的文件夹 |
