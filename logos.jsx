// Mariyum logo variations. All share the "mari" + script "yum" DNA.
// Each accepts a `color` + `scale` + optional per-variant overrides.

const PALETTE = {
  mauve:  '#B69B8E',   // dusty mauve-taupe (from site)
  deep:   '#8A6F5F',   // deeper walnut-taupe
  sage:   '#8A9579',   // the 'art' green
  ink:    '#2E2621',   // near-black warm ink
  cream:  '#F5EFE7',   // bg
  paper:  '#FBF8F3',   // soft paper
};

// ─── Variation 1 ──────────────────────────────────────────
// REFINED CURRENT — same Cormorant + script DNA, but:
//  • mari bumped 300→400 so it holds at small sizes
//  • tighter tracking
//  • script sits on shared baseline, not dropped
function V1_RefinedCurrent({ color = PALETTE.mauve, yumColor, size = 140 }) {
  return (
    <span className="wm" style={{ color, fontSize: size }}>
      <span className="mari" style={{ fontWeight: 400, letterSpacing: '-0.005em' }}>mari</span>
      <span className="yum" style={{
        fontFamily: '"Pinyon Script", cursive',
        fontSize: size * 1.15,
        marginLeft: size * -0.03,
        letterSpacing: '-0.01em',
        transform: `translateY(${size * 0.08}px)`,
        display: 'inline-block',
        color: yumColor || color,
      }}>yum</span>
    </span>
  );
}

// ─── Variation 2 ──────────────────────────────────────────
// EDITORIAL — Fraunces (modern serif w/ soft flares), lowercase
// script swapped for a more confident Italianno
function V2_Editorial({ color = PALETTE.deep, yumColor, size = 140 }) {
  return (
    <span className="wm" style={{ color, fontSize: size }}>
      <span style={{
        fontFamily: '"Fraunces", serif',
        fontWeight: 300,
        fontVariationSettings: '"opsz" 144, "SOFT" 100',
        letterSpacing: '-0.02em',
      }}>mari</span>
      <span style={{
        fontFamily: '"Italianno", cursive',
        fontSize: size * 1.35,
        marginLeft: size * -0.04,
        transform: `translateY(${size * 0.12}px)`,
        display: 'inline-block',
        fontWeight: 400,
        color: yumColor || color,
      }}>yum</span>
    </span>
  );
}

// ─── Variation 3 ──────────────────────────────────────────
// TIGHT & CONFIDENT — Cormorant medium weight, tighter script
// Both sit more upright; no dropped baseline.
function V3_TightConfident({ color = PALETTE.ink, yumColor, size = 140 }) {
  return (
    <span className="wm" style={{ color, fontSize: size }}>
      <span style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 500,
        letterSpacing: '-0.02em',
      }}>mari</span>
      <span style={{
        fontFamily: '"Parisienne", cursive',
        fontSize: size * 1.05,
        marginLeft: size * 0.02,
        fontWeight: 400,
        letterSpacing: '-0.02em',
        transform: `translateY(${size * 0.02}px)`,
        display: 'inline-block',
        color: yumColor || color,
      }}>yum</span>
    </span>
  );
}

// ─── Variation 4 ──────────────────────────────────────────
// ALL-SCRIPT — single unified script wordmark.
// Strips the serif/script tension for a pure signature feel.
function V4_Signature({ color = PALETTE.mauve, yumColor, size = 140 }) {
  // All-script single word — split 'mari' + 'yum' so the yum can tint independently.
  return (
    <span style={{
      fontSize: size * 1.6,
      fontFamily: '"Pinyon Script", cursive',
      fontWeight: 400,
      letterSpacing: '-0.01em',
      display: 'inline-block',
      lineHeight: 0.9,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color }}>mari</span><span style={{ color: yumColor || color }}>yum</span>
    </span>
  );
}

// ─── Variation 5 ──────────────────────────────────────────
// ALL-SERIF — no script. Clean editorial wordmark with a
// subtle italic 'yum' for the nod to the original contrast.
function V5_AllSerif({ color = PALETTE.ink, yumColor, size = 140 }) {
  return (
    <span className="wm" style={{ color, fontSize: size, letterSpacing: '0.02em' }}>
      <span style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 400,
      }}>mari</span>
      <span style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 400,
        fontStyle: 'italic',
        color: yumColor || color,
      }}>yum</span>
    </span>
  );
}

// ─── Names + metadata ──────────────────────────────────────
const LOGOS = [
  {
    key: 'v1',
    title: '01 · Refined current',
    description: 'Same DNA. Heavier "mari" (300 → 400) for legibility, tighter tracking, Pinyon script on a lower baseline — keeps the signature feel.',
    Component: V1_RefinedCurrent,
    defaultColor: PALETTE.mauve,
  },
  {
    key: 'v2',
    title: '02 · Editorial',
    description: 'Fraunces — a modern serif with soft flares — paired with a more confident Italianno script. Reads as cookbook-shelf editorial.',
    Component: V2_Editorial,
    defaultColor: PALETTE.deep,
  },
  {
    key: 'v3',
    title: '03 · Tight & confident',
    description: 'Medium-weight Cormorant + Parisienne. Both sit upright on the same baseline. Better for merch, small sizes, the cookbook spine.',
    Component: V3_TightConfident,
    defaultColor: PALETTE.ink,
  },
  {
    key: 'v4',
    title: '04 · One signature',
    description: 'Pure script — "mariyum" as one flowing signature. Romantic and personal; works as a watermark on recipe cards or Instagram.',
    Component: V4_Signature,
    defaultColor: PALETTE.mauve,
  },
  {
    key: 'v5',
    title: '05 · All-serif',
    description: 'No script at all. Roman + italic Cormorant carries the "mari"/"yum" contrast. The most restrained, versatile direction.',
    Component: V5_AllSerif,
    defaultColor: PALETTE.ink,
  },
];

Object.assign(window, { LOGOS, PALETTE, V1_RefinedCurrent, V2_Editorial, V3_TightConfident, V4_Signature, V5_AllSerif });
