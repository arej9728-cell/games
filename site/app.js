const ICONS = ['🎮', '🧩', '🎯', '⚡', '🏹', '🔮', '🕹️', '✨'];

function iconFor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) | 0;
  return ICONS[Math.abs(hash) % ICONS.length];
}

function renderCard(game) {
  const thumb = game.thumb
    ? `<img src="${escapeHtml(game.thumb)}" alt="" loading="lazy">`
    : `<span class="placeholder" aria-hidden="true">${iconFor(game.id)}</span>`;

  return `
    <a class="card" href="${escapeHtml(game.path)}" data-title="${escapeHtml(game.title.toLowerCase())}">
      <div class="card-thumb">${thumb}</div>
      <div class="card-body">
        <h2 class="card-title">${escapeHtml(game.title)}</h2>
        <p class="card-desc">${escapeHtml(game.description)}</p>
        <span class="card-play">开始游戏 →</span>
      </div>
    </a>
  `;
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

async function init() {
  const grid = document.getElementById('grid');
  const search = document.getElementById('search');
  const countEl = document.getElementById('count');

  let games = [];
  try {
    const res = await fetch('games.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.statusText);
    games = await res.json();
  } catch (err) {
    grid.innerHTML = `<p class="empty">无法加载游戏列表，请确认 games.json 存在。<br><small>${escapeHtml(String(err))}</small></p>`;
    return;
  }

  function paint(list) {
    if (list.length === 0) {
      grid.innerHTML = '<p class="empty">没有匹配的游戏</p>';
    } else {
      grid.innerHTML = list.map(renderCard).join('');
    }
    countEl.textContent = `${list.length} / ${games.length} 款游戏`;
  }

  paint(games);

  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    if (!q) {
      paint(games);
      return;
    }
    paint(
      games.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.id.toLowerCase().includes(q) ||
          (g.description && g.description.toLowerCase().includes(q))
      )
    );
  });
}

init();
