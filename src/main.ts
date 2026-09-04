import './styles.css';
import { GraphScene } from './GraphScene';
import { kindLabels, links, nodes, progress, relationLabels, type GraphNode, type NodeKind } from './data';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root');

const groupLabels: Record<string, string> = {
  all: '全部阵营 / 体系',
  'never-winter': '无冬城核心',
  'witch-union': '女巫联盟',
  'sleeping-island': '沉睡岛女巫',
  'city-hall': '市政厅',
  military: '第一军 / 军务',
  industry: '工业 / 炼金',
  'royal-family': '温布顿王室',
  church: '教会',
  'ancient-witch': '古代女巫 / 第三边陲区',
  graycastle: '灰堡地区',
  kingdoms: '四大王国',
  geography: '其他地理',
};

app.innerHTML = `
  <aside class="sidebar sidebar-left">
    <div class="brand">
      <div class="eyebrow">RELEASE THAT WITCH</div>
      <h1>3D 关系图谱</h1>
      <p>人物 × 组织 × 地区 × 国家 × 教会</p>
    </div>

    <section class="progress-card">
      <span>剧透边界</span>
      <strong>${progress.label}</strong>
      <p>${progress.spoilerRule}</p>
    </section>

    <section class="controls">
      <label>
        搜索
        <input id="search" type="search" placeholder="罗兰 / 女巫联盟 / 灰堡…" autocomplete="off" />
      </label>
      <label>
        节点类型
        <select id="kind-filter">
          <option value="all">全部类型</option>
          ${Object.entries(kindLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
        </select>
      </label>
      <label>
        阵营 / 体系
        <select id="group-filter">
          ${Object.entries(groupLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
        </select>
      </label>
      <label class="checkbox-row">
        <input id="roland-direct" type="checkbox" />
        <span>只看与罗兰直接相连的节点</span>
      </label>
    </section>

    <section class="stats">
      <div><strong id="node-count">0</strong><span>节点</span></div>
      <div><strong id="link-count">0</strong><span>关系</span></div>
    </section>

    <section class="legend">
      <h2>节点形状</h2>
      <div><i class="shape person"></i>人物 · 球体</div>
      <div><i class="shape organization"></i>组织 · 八面体</div>
      <div><i class="shape location"></i>地点 · 环形</div>
      <div><i class="shape kingdom"></i>王国 · 多面体</div>
      <div><i class="shape concept"></i>体系 · 核心多面体</div>
    </section>
  </aside>

  <main class="stage">
    <div id="graph"></div>
    <div class="stage-toolbar">
      <button id="reset-view" type="button">回到罗兰</button>
      <span>拖拽旋转 · 滚轮缩放 · 悬停高亮 · 点击锁定</span>
    </div>
  </main>

  <aside class="sidebar sidebar-right">
    <div id="detail"></div>
  </aside>
`;

const graphEl = document.querySelector<HTMLElement>('#graph')!;
const detailEl = document.querySelector<HTMLElement>('#detail')!;
const searchEl = document.querySelector<HTMLInputElement>('#search')!;
const kindFilterEl = document.querySelector<HTMLSelectElement>('#kind-filter')!;
const groupFilterEl = document.querySelector<HTMLSelectElement>('#group-filter')!;
const directEl = document.querySelector<HTMLInputElement>('#roland-direct')!;
const nodeCountEl = document.querySelector<HTMLElement>('#node-count')!;
const linkCountEl = document.querySelector<HTMLElement>('#link-count')!;
const resetEl = document.querySelector<HTMLButtonElement>('#reset-view')!;

const nodeById = new Map(nodes.map((node) => [node.id, node]));
const directFromRoland = new Set<string>(['roland']);
for (const link of links) {
  if (link.source === 'roland') directFromRoland.add(link.target);
  if (link.target === 'roland') directFromRoland.add(link.source);
}

const scene = new GraphScene(graphEl, nodes, links);
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => htmlEntities[char]);
}

function renderDetail(node: GraphNode | null) {
  if (!node) {
    detailEl.innerHTML = `
      <div class="detail-empty">
        <span>未选择节点</span>
        <p>点击图谱中的人物、组织、地点或国家查看关系。</p>
      </div>`;
    return;
  }

  const related = links.filter((link) => link.source === node.id || link.target === node.id);
  const relationCards = related.map((link) => {
    const otherId = link.source === node.id ? link.target : link.source;
    const other = nodeById.get(otherId);
    if (!other) return '';
    return `
      <button class="relation-card" type="button" data-node-id="${other.id}">
        <div>
          <span class="relation-type">${relationLabels[link.type]}</span>
          <strong>${escapeHtml(other.name)}</strong>
        </div>
        <p>${escapeHtml(link.label)}</p>
      </button>`;
  }).join('');

  detailEl.innerHTML = `
    <div class="detail-head">
      <span class="kind-badge">${kindLabels[node.kind]}</span>
      <h2>${escapeHtml(node.name)}</h2>
      <p>${escapeHtml(node.summary)}</p>
      <div class="tags">${node.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
    </div>
    <div class="detail-meta">
      <span>阵营 / 体系</span>
      <strong>${escapeHtml(groupLabels[node.group] ?? node.group)}</strong>
    </div>
    <div class="relations-title">
      <h3>直接关系</h3>
      <span>${related.length}</span>
    </div>
    <div class="relation-list">${relationCards || '<p class="muted">暂无直接关系</p>'}</div>
  `;

  detailEl.querySelectorAll<HTMLButtonElement>('[data-node-id]').forEach((button) => {
    button.addEventListener('click', () => scene.focus(button.dataset.nodeId!));
  });
}

function applyFilters() {
  const query = searchEl.value.trim().toLowerCase();
  const kind = kindFilterEl.value as NodeKind | 'all';
  const group = groupFilterEl.value;

  const visible = nodes.filter((node) => {
    if (kind !== 'all' && node.kind !== kind) return false;
    if (group !== 'all' && node.group !== group) return false;
    if (directEl.checked && !directFromRoland.has(node.id)) return false;
    if (query) {
      const haystack = `${node.name} ${node.summary} ${node.tags.join(' ')}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const ids = new Set(visible.map((node) => node.id));
  scene.setVisible(ids);
  nodeCountEl.textContent = String(ids.size);
  linkCountEl.textContent = String(links.filter((link) => ids.has(link.source) && ids.has(link.target)).length);
}

scene.onHover = (node) => {
  if (node) renderDetail(node);
};
scene.onSelect = (node) => renderDetail(node);

searchEl.addEventListener('input', applyFilters);
kindFilterEl.addEventListener('change', applyFilters);
groupFilterEl.addEventListener('change', applyFilters);
directEl.addEventListener('change', applyFilters);
resetEl.addEventListener('click', () => {
  searchEl.value = '';
  kindFilterEl.value = 'all';
  groupFilterEl.value = 'all';
  directEl.checked = false;
  applyFilters();
  scene.resetView();
});

renderDetail(nodeById.get('roland') ?? null);
applyFilters();
