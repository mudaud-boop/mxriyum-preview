// ─── Scaffolding page ─────────────────────────────────────
// Renders spacing, radii tables. Click-to-copy.

const SPACING = [
  { t: '--sp-0',  px: 0,   use: 'reset, zero gap' },
  { t: '--sp-1',  px: 2,   use: 'hairline nudges' },
  { t: '--sp-2',  px: 4,   use: 'icon→label, chip gap' },
  { t: '--sp-3',  px: 8,   use: 'tight stack, chip pad-y' },
  { t: '--sp-4',  px: 12,  use: 'small pad, list gap' },
  { t: '--sp-5',  px: 16,  use: 'default gap' },
  { t: '--sp-6',  px: 20,  use: 'card inner stack' },
  { t: '--sp-7',  px: 24,  use: 'card padding · default' },
  { t: '--sp-8',  px: 32,  use: 'section inset' },
  { t: '--sp-9',  px: 40,  use: 'grid gap, card→card' },
  { t: '--sp-10', px: 48,  use: 'section gap' },
  { t: '--sp-11', px: 64,  use: 'major section pad' },
  { t: '--sp-12', px: 80,  use: 'page margin (mobile)' },
  { t: '--sp-13', px: 96,  use: 'between-sections' },
  { t: '--sp-14', px: 120, use: 'hero inset, big breathing' },
];

const RADII = [
  { t: '--r-none',   val: '0',    shape: '0',      use: 'edges, images flush to cover' },
  { t: '--r-xs',     val: '2px',  shape: '2px',    use: 'dividers, thin progress bars' },
  { t: '--r-sm',     val: '4px',  shape: '4px',    use: 'inputs, small badges' },
  { t: '--r-md',     val: '8px',  shape: '8px',    use: 'buttons, compact cards' },
  { t: '--r-lg',     val: '12px', shape: '12px',   use: 'recipe cards · default' },
  { t: '--r-xl',     val: '20px', shape: '20px',   use: 'hero blocks, modals' },
  { t: '--r-pill',   val: '999px',shape: '999px',  use: 'chips, tags, pill buttons' },
  { t: '--r-circle', val: '50%',  shape: '50%',    use: 'avatars, icon buttons' },
];

// ─── Toast ───────────────────────────────────────────────
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1400);
}
function copy(text) {
  navigator.clipboard.writeText(text).then(() => showToast('copied  ' + text));
}

// ─── Spacing table ───────────────────────────────────────
const spTable = document.getElementById('sp-table');
const maxPx = Math.max(...SPACING.map(s => s.px));
SPACING.forEach(s => {
  const row = document.createElement('div');
  row.className = 'sp-row';
  const w = s.px === 0 ? 0 : (s.px / maxPx) * 100;
  row.innerHTML = `
    <div class="token">${s.t}</div>
    <div class="px">${s.px}px</div>
    <div class="bar-wrap"><div class="bar" style="width:${w}%"></div></div>
    <div class="use">${s.use}</div>
  `;
  row.addEventListener('click', () => copy(s.t));
  spTable.appendChild(row);
});

// ─── Radii grid ──────────────────────────────────────────
const radiiGrid = document.getElementById('radii-grid');
RADII.forEach(r => {
  const tile = document.createElement('div');
  tile.className = 'radius-tile';
  tile.innerHTML = `
    <div class="radius-shape" style="border-radius:${r.shape}">${r.val}</div>
    <div class="radius-meta"><div class="radius-token">${r.t}</div><div class="radius-val">${r.val}</div></div>
    <div class="radius-use">${r.use}</div>
  `;
  tile.addEventListener('click', () => copy(r.t));
  radiiGrid.appendChild(tile);
});

// ─── Elevation copy ──────────────────────────────────────
document.querySelectorAll('.elev-tile').forEach(t => {
  t.addEventListener('click', () => copy(t.dataset.token));
});
