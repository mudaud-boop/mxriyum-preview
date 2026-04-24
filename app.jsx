// App: design canvas showing all 5 logo variations + a tweakable hero logo.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "v1",
  "heroColor": "#B69B8E",
  "heroYumColor": "#B69B8E",
  "heroBg": "#FBF8F3",
  "heroSize": 220
}/*EDITMODE-END*/;

function HeroLogo({ variant, color, yumColor, bg, size }) {
  const def = LOGOS.find(l => l.key === variant) || LOGOS[0];
  const C = def.Component;
  return (
    <div style={{
      background: bg,
      padding: '140px 100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      boxSizing: 'border-box',
      minHeight: 480,
    }}>
      <C color={color} yumColor={yumColor} size={size} />
    </div>
  );
}

function Swatch({ hex, label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        width: 32, height: 32, borderRadius: '50%',
        background: hex,
        border: selected ? '2px solid #2E2621' : '2px solid rgba(0,0,0,0.1)',
        outline: selected ? '2px solid #fff' : 'none',
        outlineOffset: -4,
        cursor: 'pointer', padding: 0,
      }}
    />
  );
}

function TweaksPanel({ state, setState, visible }) {
  if (!visible) return null;
  const colors = [
    ['Mauve',  PALETTE.mauve],
    ['Walnut', PALETTE.deep],
    ['Sage',   PALETTE.sage],
    ['Ink',    PALETTE.ink],
  ];
  const bgs = [
    ['Paper',  PALETTE.paper],
    ['Cream',  PALETTE.cream],
    ['White',  '#ffffff'],
    ['Ink',    PALETTE.ink],
  ];

  const setKey = (key, val) => {
    const next = { ...state, [key]: val };
    setState(next);
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
    } catch(e) {}
  };

  return (
    <div style={{
      position: 'fixed', right: 24, bottom: 24, zIndex: 1000,
      width: 300,
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: 12,
      boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      padding: 20,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#2E2621',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#8A6F5F', marginBottom: 16,
      }}>Tweaks</div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(46,38,33,0.6)', marginBottom: 8 }}>Variant</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {LOGOS.map(l => (
            <button key={l.key}
              onClick={() => setKey('heroVariant', l.key)}
              style={{
                padding: '8px 10px',
                border: state.heroVariant === l.key ? '1px solid #2E2621' : '1px solid rgba(0,0,0,0.1)',
                background: state.heroVariant === l.key ? '#2E2621' : '#fff',
                color: state.heroVariant === l.key ? '#fff' : '#2E2621',
                fontSize: 11, fontWeight: 500,
                borderRadius: 6, cursor: 'pointer',
                textAlign: 'left',
              }}
            >{l.title.split(' · ')[0]}<br/><span style={{fontSize:9,opacity:0.7}}>{l.title.split(' · ')[1]}</span></button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(46,38,33,0.6)', marginBottom: 8 }}>
          “mari” color
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {colors.map(([l, h]) => (
            <Swatch key={h} hex={h} label={l} selected={state.heroColor === h} onClick={() => setKey('heroColor', h)} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(46,38,33,0.6)', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>“yum” color</span>
          <button
            onClick={() => setKey('heroYumColor', state.heroColor)}
            style={{
              fontSize: 10, fontWeight: 500,
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.12)',
              color: 'rgba(46,38,33,0.7)',
              padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
            }}
          >match mari</button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {colors.map(([l, h]) => (
            <Swatch key={h} hex={h} label={l} selected={state.heroYumColor === h} onClick={() => setKey('heroYumColor', h)} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(46,38,33,0.6)', marginBottom: 8 }}>Background</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {bgs.map(([l, h]) => (
            <Swatch key={h} hex={h} label={l} selected={state.heroBg === h} onClick={() => setKey('heroBg', h)} />
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(46,38,33,0.6)', marginBottom: 8 }}>
          Size · <span style={{color:'#2E2621'}}>{state.heroSize}px</span>
        </div>
        <input type="range" min={80} max={360} value={state.heroSize}
          onChange={e => setKey('heroSize', Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

function App() {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    // Announce after listener is live
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e) {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  return (
    <>
      <DesignCanvas>
        {/* ───── HERO · tweakable ───── */}
        <DCSection
          title="Hero logo — live tweakable"
          subtitle="Toggle Tweaks in the toolbar to swap variant, color, background, and size."
        >
          <DCArtboard label="Hero · 1200 × 520" width={1200} height={520}>
            <HeroLogo
              variant={tweaks.heroVariant}
              color={tweaks.heroColor}
              yumColor={tweaks.heroYumColor}
              bg={tweaks.heroBg}
              size={tweaks.heroSize}
            />
          </DCArtboard>

          <DCPostIt top={-30} left={1240} rotate={3} width={220}>
            Click the Tweaks toggle in the toolbar → a panel appears bottom-right with variant, color, bg, and size controls.
          </DCPostIt>
        </DCSection>

        {/* ───── FIVE VARIATIONS · side by side ───── */}
        <DCSection
          title="Five directions"
          subtitle="All refine the original DNA: lowercase, warm palette, serif/script contrast. Notes below each."
          gap={36}
        >
          {LOGOS.map(({ key, title, description, Component, defaultColor }) => (
            <DCArtboard key={key} label={title} width={620} height={520}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: PALETTE.paper,
                  padding: '40px 20px',
                }}>
                  <Component color={defaultColor} size={150} />
                </div>
                <div style={{
                  padding: '20px 28px',
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: 'rgba(46,38,33,0.75)',
                  minHeight: 100,
                  boxSizing: 'border-box',
                }}>
                  {description}
                </div>
              </div>
            </DCArtboard>
          ))}
        </DCSection>

        {/* ───── SCALE TEST ───── */}
        <DCSection
          title="Scale test"
          subtitle="Each variant at 3 sizes — header (80px), website (44px), and small/footer (22px). Thin serifs break first at small sizes."
          gap={36}
        >
          {LOGOS.map(({ key, title, Component, defaultColor }) => (
            <DCArtboard key={key} label={title} width={440} height={380}>
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                padding: '32px 36px',
                background: PALETTE.paper,
                boxSizing: 'border-box',
              }}>
                <div><Component color={defaultColor} size={80} /></div>
                <div><Component color={defaultColor} size={44} /></div>
                <div><Component color={defaultColor} size={22} /></div>
              </div>
            </DCArtboard>
          ))}
        </DCSection>

        {/* ───── COLOR TEST ───── */}
        <DCSection
          title="In the palette"
          subtitle="Winner (01 · Refined current) shown across the palette — so you can see how the existing mauve holds up vs alternatives."
          gap={36}
        >
          {[
            ['Mauve — current', PALETTE.mauve, null,          PALETTE.paper],
            ['Walnut',           PALETTE.deep,  null,          PALETTE.paper],
            ['Sage',             PALETTE.sage,  null,          PALETTE.paper],
            ['Ink',               PALETTE.ink,  null,          PALETTE.paper],
            ['Cream on ink',     PALETTE.cream, null,          PALETTE.ink],
            ['Mauve on cream',   PALETTE.mauve, null,          PALETTE.cream],
          ].map(([label, c, yc, bg]) => (
            <DCArtboard key={label} label={label} width={420} height={260}>
              <div style={{
                height: '100%', background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <V1_RefinedCurrent color={c} yumColor={yc} size={110} />
              </div>
            </DCArtboard>
          ))}
        </DCSection>

        {/* ───── TWO-TONE PREVIEW ───── */}
        <DCSection
          title="Two-tone — “yum” in an accent"
          subtitle="Each variant with mari in one color and yum in another. This is what the new Tweaks controls let you play with."
          gap={36}
        >
          {[
            { l: 'mauve + sage',   mari: PALETTE.mauve, yum: PALETTE.sage  },
            { l: 'ink + mauve',    mari: PALETTE.ink,   yum: PALETTE.mauve },
            { l: 'walnut + sage',  mari: PALETTE.deep,  yum: PALETTE.sage  },
            { l: 'mauve + walnut', mari: PALETTE.mauve, yum: PALETTE.deep  },
            { l: 'ink + sage',     mari: PALETTE.ink,   yum: PALETTE.sage  },
          ].map(({ l, mari, yum }) => (
            <DCArtboard key={l} label={l} width={440} height={520}>
              <div style={{
                height: '100%', background: PALETTE.paper,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-around',
                padding: '28px 20px', boxSizing: 'border-box',
              }}>
                {LOGOS.map(({ key, Component }) => (
                  <Component key={key} color={mari} yumColor={yum} size={56} />
                ))}
              </div>
            </DCArtboard>
          ))}
        </DCSection>
      </DesignCanvas>

      <TweaksPanel state={tweaks} setState={setTweaks} visible={editMode} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
