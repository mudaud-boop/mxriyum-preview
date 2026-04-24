// ─── Typography page ─────────────────────────────────────
// Scale rendering, token copy, live specimen handling.

const SCALE = [
  { name: 'display',  token: '--t-display', size: 84,
    family: 'Cormorant Garamond',  weight: 300,
    tracking: '-0.02em', leading: 0.95,
    use: 'Hero block, homepage quote' },
  { name: 'h1',       token: '--t-h1', size: 56,
    family: 'Cormorant Garamond',  weight: 300,
    tracking: '-0.02em', leading: 1.0,
    use: 'Recipe title, article title' },
  { name: 'h2',       token: '--t-h2', size: 40,
    family: 'Cormorant Garamond',  weight: 400,
    tracking: '-0.02em', leading: 1.05,
    use: 'Section heading' },
  { name: 'h3',       token: '--t-h3', size: 26,
    family: 'Cormorant Garamond',  weight: 400,
    tracking: '-0.01em', leading: 1.15,
    use: 'Subsection, card title' },
  { name: 'h4',       token: '--t-h4', size: 20,
    family: 'Inter',  weight: 500,
    tracking: '0',      leading: 1.35,
    use: 'Step label, block heading' },
  { name: 'body',     token: '--t-body', size: 16,
    family: 'Inter',  weight: 400,
    tracking: '0',      leading: 1.65,
    use: 'Paragraphs, descriptions' },
  { name: 'small',    token: '--t-small', size: 14,
    family: 'Inter',  weight: 400,
    tracking: '0',      leading: 1.55,
    use: 'Secondary body, tips' },
  { name: 'caption',  token: '--t-caption', size: 13,
    family: 'Inter',  weight: 400,
    tracking: '0',      leading: 1.5,
    use: 'Photo caption, footnote',
    style: 'italic' },
  { name: 'eyebrow',  token: '--t-eyebrow', size: 11,
    family: 'Inter',  weight: 600,
    tracking: '0.18em', leading: 1.5,
    use: 'Category label, overline',
    upper: true },
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

// ─── Render scale rows ───────────────────────────────────
const rows = document.getElementById('scale-rows');
SCALE.forEach(row => {
  const el = document.createElement('div');
  el.className = 'scale-row';
  const sampleStyle = `
    font-family: ${row.family === 'Inter' ? "'Inter', sans-serif" : "'Cormorant Garamond', serif"};
    font-size: ${row.size}px;
    font-weight: ${row.weight};
    letter-spacing: ${row.tracking};
    line-height: ${row.leading};
    ${row.style ? `font-style: ${row.style};` : ''}
    ${row.upper ? 'text-transform: uppercase;' : ''}
    color: var(--ink);
  `.replace(/\s+/g, ' ').trim();

  el.innerHTML = `
    <div class="sname">${row.name}<span class="tk">${row.token}</span></div>
    <div style="${sampleStyle}">Turning food into art</div>
    <div class="smeta">
      ${row.size}px · ${row.family.split(' ')[0]} ${row.weight}<br/>
      track ${row.tracking} · lead ${row.leading}<br/>
      <span style="color:var(--ink);opacity:0.75">${row.use}</span>
    </div>
  `;
  el.style.cursor = 'pointer';
  el.addEventListener('click', () => copy(row.token));
  rows.appendChild(el);
});
