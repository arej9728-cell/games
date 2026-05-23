#!/usr/bin/env node
/**
 * 扫描项目根目录，自动发现含 index.html 的游戏文件夹，生成 games.json。
 * 用法: node scripts/generate-games.js
 *
 * 可选：在游戏目录下放 game.meta.json 自定义展示信息：
 * { "title": "我的游戏", "description": "简介", "thumb": "thumb.png" }
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'games.json');
const SKIP = new Set(['site', 'scripts', 'node_modules', '.git']);

function humanize(id) {
  return id
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function loadMeta(dir) {
  const metaPath = path.join(dir, 'game.meta.json');
  if (!fs.existsSync(metaPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    console.warn(`警告: 无法解析 ${metaPath}`);
    return {};
  }
}

function discover() {
  const entries = fs.readdirSync(ROOT, { withFileTypes: true });
  const games = [];

  for (const ent of entries) {
    if (!ent.isDirectory() || SKIP.has(ent.name) || ent.name.startsWith('.')) continue;

    const dir = path.join(ROOT, ent.name);
    const indexPath = path.join(dir, 'index.html');
    if (!fs.existsSync(indexPath)) continue;

    const meta = loadMeta(dir);
    const id = ent.name;

    games.push({
      id,
      title: meta.title || humanize(id),
      description: meta.description || '点击开始游戏',
      path: `${id}/index.html`,
      ...(meta.thumb ? { thumb: `${id}/${meta.thumb}` } : {}),
    });
  }

  games.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return games;
}

const games = discover();
fs.writeFileSync(OUT, JSON.stringify(games, null, 2) + '\n', 'utf8');
console.log(`已写入 ${games.length} 个游戏 → games.json`);
