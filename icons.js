// ─── Icon library ────────────────────────────────────────
// 20 icons, 24×24 grid, 1.5px stroke, round caps & joins, currentColor.

const ICON_DEFAULTS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

const UI_ICONS = [
  { name: 'search', svg: `<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>` },
  { name: 'menu',   svg: `<path d="M4 7h16M4 12h16M4 17h10"/>` },
  { name: 'heart',  svg: `<path d="M20.8 4.6a5 5 0 00-7.1 0L12 6.4 10.3 4.6a5 5 0 00-7.1 7.1L12 20.5l8.8-8.8a5 5 0 000-7.1z"/>` },
  { name: 'share',  svg: `<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 11l8-4M8 13l8 4"/>` },
  { name: 'close',  svg: `<path d="M6 6l12 12M18 6L6 18"/>` },
  { name: 'arrow-back', svg: `<path d="M20 12H4M10 6l-6 6 6 6"/>` },
];

const CATEGORY_ICONS = [
  // Breakfast — sunrise over a plate
  { name: 'breakfast', key: 'butter', label: 'Breakfast',
    svg: `<path d="M3 17h18"/><path d="M6 17a6 6 0 0112 0"/><path d="M12 4v3M5 7l2 2M19 7l-2 2"/>` },
  // Lunch — sandwich / stacked plate
  { name: 'lunch', key: 'sage', label: 'Lunch',
    svg: `<path d="M4 9h16l-2 3H6z"/><path d="M5 13h14v2a2 2 0 01-2 2H7a2 2 0 01-2-2z"/><path d="M8 6c0-1 1-2 2-2s1 1 2 1 2-1 2-1 2 1 2 2"/>` },
  // Dinner — plate with fork & knife
  { name: 'dinner', key: 'walnut', label: 'Dinner',
    svg: `<circle cx="12" cy="13" r="6"/><circle cx="12" cy="13" r="3"/><path d="M4 4v6M4 4v6M4 10c0 1 .5 2 1.5 2"/><path d="M20 4c-1.5 0-2.5 1.5-2.5 3.5S18.5 11 20 11"/>` },
  // Appetizer — olive on toothpick
  { name: 'appetizer', key: 'tomato', label: 'Appetizers',
    svg: `<ellipse cx="12" cy="9" rx="4" ry="5"/><path d="M12 14v7"/><path d="M10 20h4"/>` },
  // Bread — loaf
  { name: 'bread', key: 'mauve', label: 'Breads',
    svg: `<path d="M4 13c0-3 2-5 4-5h8c2 0 4 2 4 5v5a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M7 13c.5-1 1.5-1.5 2.5-1M12 11c.5-1 1.5-1.5 2.5-1"/>` },
  // Dessert — cake slice
  { name: 'dessert', key: 'berry', label: 'Dessert',
    svg: `<path d="M5 18V10l7-5 7 5v8z"/><path d="M5 14h14"/><path d="M12 5v13"/>` },
];

const META_ICONS = [
  { name: 'time',        svg: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>` },
  { name: 'servings',    svg: `<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/>` },
  { name: 'difficulty',  svg: `<path d="M4 18L10 10 14 14 20 6"/><path d="M14 6h6v6"/>` },
  { name: 'dietary',     svg: `<path d="M12 3c3 5 6 7 6 11a6 6 0 01-12 0c0-4 3-6 6-11z"/>` },
];

const SOCIAL_ICONS = [
  { name: 'instagram', svg: `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none"/>` },
  { name: 'tiktok',    svg: `<path d="M14 4v10.5a3.5 3.5 0 11-3.5-3.5"/><path d="M14 4c.5 2.5 2.5 4 5 4"/>` },
  { name: 'youtube',   svg: `<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M10 9.5v5l5-2.5z" fill="currentColor" stroke="none"/>` },
  { name: 'twitter',   svg: `<path d="M4 4l7.5 9.5L4.5 20M20 4l-7 8L20 20"/>` },
];

// ─── Toast & copy ────────────────────────────────────────
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1400);
}
function copyToken(token) {
  navigator.clipboard.writeText(token).then(() => showToast('copied  ' + token));
}

// ─── Render helpers ──────────────────────────────────────
function renderUiGrid(containerId, icons, prefix) {
  const el = document.getElementById(containerId);
  icons.forEach(ic => {
    const tile = document.createElement('div');
    tile.className = 'icon-tile';
    const token = `icon-${prefix}-${ic.name}`;
    tile.innerHTML = `
      <svg ${ICON_DEFAULTS}>${ic.svg}</svg>
      <div class="name">${ic.name.replace(/-/g, ' ')}</div>
      <div class="token">${token}</div>
    `;
    tile.addEventListener('click', () => copyToken(token));
    el.appendChild(tile);
  });
}

function renderCategoryGrid() {
  const el = document.getElementById('cat-grid');
  const hueColors = {
    butter: { bg: '#FAEBBC', fg: '#6A4B0E' },
    sage:   { bg: '#DCE0D0', fg: '#3A4230' },
    walnut: { bg: '#E6D7CB', fg: '#3E2E22' },
    tomato: { bg: '#F4CABE', fg: '#5E1F12' },
    mauve:  { bg: '#EADDD4', fg: '#4F382B' },
    berry:  { bg: '#E0BBC1', fg: '#40131E' },
  };
  CATEGORY_ICONS.forEach(ic => {
    const colors = hueColors[ic.key];
    const tile = document.createElement('div');
    tile.className = 'cat-tile';
    tile.style.background = colors.bg;
    tile.style.color = colors.fg;
    tile.style.borderColor = 'transparent';
    const token = `icon-category-${ic.name}`;
    tile.innerHTML = `
      <svg ${ICON_DEFAULTS}>${ic.svg}</svg>
      <div class="cat-name">${ic.label}</div>
    `;
    tile.addEventListener('click', () => copyToken(token));
    el.appendChild(tile);
  });
}

renderUiGrid('ui-grid',     UI_ICONS,     'ui');
renderUiGrid('meta-grid',   META_ICONS,   'meta');
renderUiGrid('social-grid', SOCIAL_ICONS, 'social');
renderCategoryGrid();

window.__ICONS = { UI_ICONS, CATEGORY_ICONS, META_ICONS, SOCIAL_ICONS };
