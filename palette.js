// ───────────────────────────────────────────────────────
// Palette — core hues + 10-step ramps + semantic tokens
// Ramps are generated in OKLCH for perceptually even
// lightness steps, then converted to sRGB hex for use.
// ───────────────────────────────────────────────────────

const HUES = [
  { key: 'paper',  name: 'Paper',   hex: '#FBF8F3', role: 'Foundation · backgrounds',     huePin: 70,  chromaMax: 0.015 },
  { key: 'cream',  name: 'Cream',   hex: '#F5EFE7', role: 'Warm neutral surface',          huePin: 68,  chromaMax: 0.022 },
  { key: 'mauve',  name: 'Mauve',   hex: '#B69B8E', role: 'Primary · the brand',           huePin: 45,  chromaMax: 0.035 },
  { key: 'walnut', name: 'Walnut',  hex: '#8A6F5F', role: 'Deep warm · body text alt',     huePin: 45,  chromaMax: 0.045 },
  { key: 'sage',   name: 'Sage',    hex: '#8A9579', role: 'Fresh · herbs, salads',         huePin: 130, chromaMax: 0.035 },
  { key: 'tomato', name: 'Tomato',  hex: '#C85943', role: 'Accent · warm / appetite',      huePin: 30,  chromaMax: 0.14  },
  { key: 'butter', name: 'Butter',  hex: '#E8B94D', role: 'Accent · breads, baking',       huePin: 82,  chromaMax: 0.13  },
  { key: 'berry',  name: 'Berry',   hex: '#8A3A4E', role: 'Accent · desserts, rich notes', huePin: 10,  chromaMax: 0.12  },
  { key: 'ink',    name: 'Ink',     hex: '#2E2621', role: 'Text · deep warm near-black',   huePin: 55,  chromaMax: 0.02  },
];

// ─── Color conversion helpers (OKLCH ↔ sRGB) ─────────────
// Reference: https://www.w3.org/TR/css-color-4/#color-conversion-code
function oklchToRgb(L, C, hDeg) {
  const h = hDeg * Math.PI / 180;
  const a = Math.cos(h) * C;
  const b = Math.sin(h) * C;
  // OKLab -> linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl= -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  const toSrgb = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * (v ** (1/2.4)) - 0.055);
  const clip = (v) => Math.max(0, Math.min(1, toSrgb(v)));
  r = clip(r); g = clip(g); bl = clip(bl);
  return [Math.round(r*255), Math.round(g*255), Math.round(bl*255)];
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}
function srgbToLinear(v) {
  v = v / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function rgbToOklch(r, g, b) {
  const lin = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  const [lr, lg, lb] = lin;
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_;
  const A = 1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_;
  const B = 0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_;
  const C = Math.sqrt(A*A + B*B);
  let H = Math.atan2(B, A) * 180 / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}
function hexToRgb(hex) {
  const h = hex.replace('#','');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

// ─── Build ramps ─────────────────────────────────────────
// Step 500 = the base hex. Other steps vary L around it;
// chroma reduces toward extremes (cleaner tints & deeper shades).
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const L_TARGETS = {
   50: 0.975, 100: 0.94, 200: 0.88, 300: 0.80, 400: 0.70,
  500: null,  600: 0.48, 700: 0.38, 800: 0.28, 900: 0.19,
};
// Chroma scalar relative to base — edges lose saturation
const C_SCALE = {
   50: 0.15, 100: 0.30, 200: 0.55, 300: 0.80, 400: 0.95,
  500: 1.00, 600: 0.95, 700: 0.82, 800: 0.65, 900: 0.45,
};

// Interpolate lightness targets so that step 500 sits at the base L,
// the ramp reaches near-white at 50 and near-black at 900, and every
// adjacent pair has roughly equal perceptual spacing (no cliffs).
function buildLTargets(baseL) {
  const L_TOP = 0.985;   // step 50
  const L_BOT = 0.16;    // step 900
  const out = {};
  // 50..500 — linear from L_TOP down to baseL over 6 stops (indices 0..5)
  const topSteps = [50, 100, 200, 300, 400, 500];
  topSteps.forEach((s, i) => {
    const t = i / 5;
    out[s] = L_TOP + (baseL - L_TOP) * t;
  });
  // 500..900 — linear from baseL down to L_BOT over 5 stops (indices 0..4 of 600..900 + 500 pin)
  const botSteps = [500, 600, 700, 800, 900];
  botSteps.forEach((s, i) => {
    const t = i / 4;
    out[s] = baseL + (L_BOT - baseL) * t;
  });
  return out;
}

function buildRamp(hue) {
  const [r, g, b] = hexToRgb(hue.hex);
  const base = rgbToOklch(r, g, b);
  const L_T = buildLTargets(base.L);
  const ramp = {};
  for (const step of STEPS) {
    // Use interpolated L at every step — do NOT pin 500 to the raw hex,
    // that causes 400/500/600 cliffs & inversions on high-chroma hues.
    // Since L_T[500] === base.L, step 500 computes to (approximately) the
    // provided hex naturally and the ramp remains perceptually smooth.
    const L = L_T[step];
    const C = base.C * C_SCALE[step];
    const [R, G, B] = oklchToRgb(L, C, base.H);
    ramp[step] = rgbToHex([R, G, B]);
  }
  return ramp;
}

const PALETTE = {};
HUES.forEach(h => { PALETTE[h.key] = buildRamp(h); });

// ─── Contrast (WCAG) ─────────────────────────────────────
function relLum([r, g, b]) {
  const [R, G, B] = [r, g, b].map(srgbToLinear);
  return 0.2126*R + 0.7152*G + 0.0722*B;
}
function contrast(hexA, hexB) {
  const l1 = relLum(hexToRgb(hexA));
  const l2 = relLum(hexToRgb(hexB));
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}
function contrastVerdict(ratio) {
  if (ratio >= 7)   return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3)   return 'AA-lg';
  return 'fail';
}

// ─── Toast & copy ────────────────────────────────────────
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

// ─── Render: core nine ───────────────────────────────────
const coreGrid = document.getElementById('core-grid');
HUES.forEach(h => {
  const sw = document.createElement('div');
  sw.className = 'core-swatch';
  const light = relLum(hexToRgb(h.hex)) > 0.55;
  sw.innerHTML = `
    <div class="chip" style="background:${h.hex}"></div>
    <div class="core-meta">
      <div class="core-name">${h.name}</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:6px">${h.role}</div>
      <div class="core-hex">${h.hex}</div>
      <div class="core-hex" style="margin-top:2px">--color-${h.key}-500</div>
    </div>
  `;
  sw.addEventListener('click', () => copy(h.hex));
  coreGrid.appendChild(sw);
});

// ─── Render: ramps ───────────────────────────────────────
const rampWrap = document.getElementById('ramp-wrap');
// Header row
const headEl = document.createElement('div');
headEl.className = 'ramp-header';
headEl.innerHTML = '<div class="spacer-head"></div>' + STEPS.map(s => `<div class="step-head">${s}</div>`).join('');
rampWrap.appendChild(headEl);

HUES.forEach(h => {
  const row = document.createElement('div');
  row.className = 'ramp-row';
  let inner = `<div class="ramp-label">
    <div class="n">${h.name}</div>
    <div class="role">--color-${h.key}</div>
  </div>`;
  STEPS.forEach(step => {
    const hex = PALETTE[h.key][step];
    const light = relLum(hexToRgb(hex)) > 0.55;
    const fg = light ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.9)';
    inner += `
      <div class="ramp-cell" style="background:${hex};color:${fg}" data-hex="${hex}" data-token="--color-${h.key}-${step}">
        <div class="step">${step}</div>
        <div class="hex">${hex}</div>
      </div>
    `;
  });
  row.innerHTML = inner;
  rampWrap.appendChild(row);
});
rampWrap.addEventListener('click', (e) => {
  const cell = e.target.closest('.ramp-cell');
  if (!cell) return;
  copy(cell.dataset.hex);
});

// ─── Render: semantic tokens ─────────────────────────────
const SEMANTIC = [
  { token: '--surface-page',     hex: PALETTE.paper[500],   desc: 'Primary page background. Warmer than pure white.' },
  { token: '--surface-raised',   hex: '#FFFFFF',            desc: 'Cards, modals, elevated surfaces over the page.' },
  { token: '--surface-sunken',   hex: PALETTE.cream[500],   desc: 'Recessed panels, image backdrops, section dividers.' },
  { token: '--surface-inverse',  hex: PALETTE.ink[500],     desc: 'Dark hero blocks, footer, high-contrast callouts.' },

  { token: '--text-primary',     hex: PALETTE.ink[800],     desc: 'Body copy and headings on light surfaces.' },
  { token: '--text-secondary',   hex: PALETTE.walnut[700],  desc: 'Supporting text, captions, metadata.' },
  { token: '--text-muted',       hex: PALETTE.walnut[400],  desc: 'Timestamps, de-emphasized labels.' },
  { token: '--text-inverse',     hex: PALETTE.paper[500],   desc: 'Text on dark/inverse surfaces.' },

  { token: '--border-subtle',    hex: PALETTE.mauve[100],   desc: 'Hairline dividers, card borders.' },
  { token: '--border-default',   hex: PALETTE.mauve[200],   desc: 'Input borders, visible dividers.' },

  { token: '--accent-primary',   hex: PALETTE.mauve[500],   desc: 'Brand primary. Logo, key links, active states.' },
  { token: '--accent-hover',     hex: PALETTE.mauve[700],   desc: 'Hover state for primary accent.' },
  { token: '--accent-warm',      hex: PALETTE.tomato[500],  desc: 'Warm highlight — new, featured, savory content.' },
  { token: '--accent-sweet',     hex: PALETTE.berry[500],   desc: 'Sweet content — desserts, rich flavors.' },
  { token: '--accent-fresh',     hex: PALETTE.sage[500],    desc: 'Fresh content — salads, herbs, light.' },
];
const semGrid = document.getElementById('semantic-grid');
SEMANTIC.forEach(s => {
  const card = document.createElement('div');
  card.className = 'sem-card';
  card.innerHTML = `
    <div class="preview" style="background:${s.hex}"></div>
    <div class="token">${s.token}</div>
    <div class="desc">${s.desc}</div>
    <div class="hex">${s.hex}</div>
  `;
  card.addEventListener('click', () => copy(s.token));
  semGrid.appendChild(card);
});

// ─── Render: category chips ──────────────────────────────
document.querySelectorAll('.chip-tag').forEach(el => {
  const hue = el.dataset.hue;
  el.style.background = PALETTE[hue][100];
  el.style.color      = PALETTE[hue][800];
  el.addEventListener('click', () => copy(`bg:${PALETTE[hue][100]} / fg:${PALETTE[hue][800]}`));
});

// ─── Preview preset swapping ─────────────────────────────
const rpCard = document.getElementById('rp-card');
const rpImg = document.getElementById('rp-img');
const rpCaption = document.getElementById('rp-caption');
const hdrPreview = document.getElementById('hdr-preview');
const hdrCaption = document.getElementById('hdr-caption');

function applyPreset(hue) {
  const p = PALETTE[hue];
  // Recipe card
  rpCard.style.background = p[50];
  rpCard.style.color = p[900];
  rpImg.style.background = `linear-gradient(135deg, ${p[200]}, ${p[400]})`;
  rpCaption.textContent = `bg: ${hue}-50  ·  text: ${hue}-900`;

  // Header
  hdrPreview.style.background = p[50];
  hdrPreview.style.color = p[900];
  hdrCaption.textContent = `bg: ${hue}-50  ·  text: ${hue}-900`;

  // Update logo colors in hdr
  hdrPreview.querySelectorAll('.logo, .logo .yum').forEach(el => el.style.color = p[600]);
  hdrPreview.querySelector('.hero-title em').style.color = p[500];

  // Active button
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === hue));
}
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
});
applyPreset('mauve');
// Map preset key 'default' to mauve
document.querySelector('[data-preset="default"]').dataset.preset = 'mauve';
document.querySelector('[data-preset="mauve"]').classList.add('active');

// ─── Pairings grid ──────────────────────────────────────
const PAIRS = [
  { bg: 'paper-500',  fg: 'ink-800',    label: 'Default body' },
  { bg: 'cream-500',  fg: 'walnut-800', label: 'Warm alternate' },
  { bg: 'mauve-50',   fg: 'walnut-700', label: 'Soft hero' },
  { bg: 'mauve-500',  fg: 'paper-500',  label: 'Primary button' },
  { bg: 'ink-800',    fg: 'paper-500',  label: 'Inverse / footer' },
  { bg: 'sage-100',   fg: 'sage-800',   label: 'Sage tag' },
  { bg: 'tomato-500', fg: 'paper-500',  label: 'Tomato accent' },
  { bg: 'butter-100', fg: 'butter-800', label: 'Butter tag' },
  { bg: 'berry-500',  fg: 'paper-500',  label: 'Berry accent' },
];
const pairingsEl = document.getElementById('pairings');
function resolve(t) {
  const [hue, step] = t.split('-');
  return PALETTE[hue][parseInt(step, 10)];
}
PAIRS.forEach(p => {
  const bgHex = resolve(p.bg);
  const fgHex = resolve(p.fg);
  const ratio = contrast(bgHex, fgHex);
  const verdict = contrastVerdict(ratio);
  const pass = verdict !== 'fail';
  const card = document.createElement('div');
  card.style.cssText = `background:${bgHex};color:${fgHex};border-radius:8px;overflow:hidden;border:1px solid var(--rule);`;
  card.innerHTML = `
    <div style="padding:32px 24px;">
      <div style="font-size:10px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.65;margin-bottom:10px;">${p.label}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-weight:400;font-size:32px;letter-spacing:-0.01em;line-height:1.05;margin-bottom:10px;">Turning food<br/>into art.</div>
      <div style="font-size:12px;opacity:0.75;line-height:1.55;">A short paragraph of body copy to show how the pairing reads at real sizes.</div>
    </div>
    <div style="padding:12px 20px;border-top:1px solid currentColor;font-family:'JetBrains Mono',monospace;font-size:10px;display:flex;justify-content:space-between;align-items:center;opacity:0.85;">
      <span>${p.fg} on ${p.bg}</span>
      <span style="font-weight:600;">${ratio.toFixed(2)} · ${pass ? verdict : 'fail'}</span>
    </div>
  `;
  pairingsEl.appendChild(card);
});

// Export for debugging / future tabs
window.__PALETTE = PALETTE;
