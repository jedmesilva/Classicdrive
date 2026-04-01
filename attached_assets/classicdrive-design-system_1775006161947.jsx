// ═══════════════════════════════════════════════════════════
// CLASSICDRIVE — DESIGN SYSTEM
// Extraído fielmente do classicdrive-full.jsx
// ═══════════════════════════════════════════════════════════

export const COLORS = {
  // Primária
  gold:           "#C9A96E",
  goldLight:      "#E8D5A3",

  // Backgrounds
  bgPage:         "#F9F7F4",  // home
  bgSheet:        "#FDFCFA",  // sheets
  bgSurface:      "#F5F2EE",  // hover states, NativeTrigger
  bgInput:        "#F2EFE9",  // campo de busca
  bgIconClock:    "#F2EFE9",  // ícone de recentes
  bgIconPin:      "#C9A96E20",// ícone de sugestão (gold 12%)

  // Bordas
  borderCard:     "#EDE9E2",  // cards brancos
  borderSubtle:   "#E0D9D0",  // divisores, handle da sheet

  // Texto
  textPrimary:    "#1A1A1A",
  textSecondary:  "#999",
  textTertiary:   "#BBB",
  textPlaceholder:"#CCC",
  textMuted:      "#AAA",     // subtítulos de endereço, ícones inativos
  textBadge:      "#C0B9B0",  // label de seção uppercase (RECENTES)
};

export const TYPOGRAPHY = {
  // Home
  pageTitle:    { fontSize: 28, fontWeight: 800, lineHeight: 1.2 },
  greeting:     { fontSize: 15, fontWeight: 400 },

  // Carousel card
  cardYear:     { fontSize: 13, fontWeight: 500 },
  cardName:     { fontSize: 22, fontWeight: 800, lineHeight: 1.1 },
  cardPrice:    { fontSize: 20, fontWeight: 700 },
  cardPriceSub: { fontSize: 13, fontWeight: 400 },
  cardBadge:    { fontSize: 11, fontWeight: 700, letterSpacing: 0.8 },

  // BookingCard
  bookingLabel: { fontSize: 14, fontWeight: 600, letterSpacing: 0.2, lineHeight: "16px" },
  bookingValue: { fontSize: 17, fontWeight: 600 },

  // Sheet
  sheetTitle:   { fontSize: 20, fontWeight: 800 },
  sheetSubtitle:{ fontSize: 13, fontWeight: 400 },
  sheetLabel:   { fontSize: 13, fontWeight: 600, letterSpacing: 0.3 },
  sheetSection: { fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }, // uppercase

  // NativeTrigger (ScheduleSheet)
  triggerLabel: { fontSize: 11, fontWeight: 600, letterSpacing: 0.4 }, // uppercase
  triggerValue: { fontSize: 16, fontWeight: 700 },

  // AddressRow
  addrMain:     { fontSize: 15, fontWeight: 600 },
  addrSub:      { fontSize: 12, fontWeight: 400 },

  // DayChip
  chip:         { fontSize: 13, fontWeight: 600 },

  // Resumo agendamento
  confirmLabel: { fontSize: 13, fontWeight: 400 },
  confirmValue: { fontSize: 17, fontWeight: 800 },

  // CTA
  cta:          { fontSize: 17, fontWeight: 700, letterSpacing: 0.3 },

  // Input de busca
  searchInput:  { fontSize: 16, fontWeight: 400 }, // 16px evita zoom no iOS
};

export const RADIUS = {
  cardLarge:  20, // cards do carousel
  cardInner:  17, // inner do card do carousel (20 - border 3px)
  card:       14, // BookingCard, NativeTrigger, input de busca, resumo
  chip:       20, // DayChip, badge do carousel
  iconBox:    10, // container de ícone no AddressRow e NativeTrigger
  button:     16, // CTA e botão de confirmar
  sheet:      24, // borderRadius top das sheets
  dot:        "50%", // bullet points da timeline
  handle:      2, // handle da sheet
  divider:     1, // linha divisória
};

export const SPACING = {
  // Padding de página
  pageTop:      52,
  pageH:        24, // horizontal padrão

  // Carousel
  carouselGap:  14,
  carouselPb:   20, // padding-bottom para a sombra do snap

  // BookingCard
  cardGap:      16, // espaço vertical entre cards (também altura da linha da timeline)
  dotSize:      12, // diâmetro do bullet
  dotLineW:      2, // espessura da linha pontilhada
  timelineGap:  12, // gap entre coluna do dot e coluna do conteúdo

  // Sheets
  sheetPaddingH:  24,
  sheetHandlePt:  12,
  sheetSectionMt: 14,

  // AddressRow
  addrRowPadV:  13,
  addrIconSize: 38,
  addrGap:      14,

  // NativeTrigger
  triggerIconSize: 36,
  triggerGap:      10,
  triggerPad:      14,

  // CTA
  ctaPadV:      17,
  ctaMb:        40,
};

export const SHADOWS = {
  // Não há box-shadows explícitos no app atual.
  // A profundidade é criada por diferença de background:
  // bgPage (#F9F7F4) → card branco (#FFF) → sheet (#FDFCFA)
};

export const ANIMATION = {
  slideUp: "slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
  fadeIn:  "fadeIn 0.16s ease",
  border:  "border 0.18s",
  bg:      "background 0.12s",
  all:     "all 0.15s",
  all25:   "all 0.25s", // dots do carousel
};

// ─── Preview visual ─────────────────────────────────────────

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 48 }}>
    <p style={{ margin: "0 0 20px", fontSize: 11, fontWeight: 700, color: "#C0B9B0", letterSpacing: 1.4, textTransform: "uppercase" }}>
      {title}
    </p>
    {children}
  </div>
);

const ColorSwatch = ({ name, hex, border }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
    <div style={{
      width: 44, height: 44, borderRadius: 10, background: hex, flexShrink: 0,
      border: border ? "1px solid #EDE9E2" : "none",
    }} />
    <div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{name}</p>
      <p style={{ margin: 0, fontSize: 12, color: "#AAA", fontFamily: "monospace" }}>{hex}</p>
    </div>
  </div>
);

const TypeRow = ({ name, style }) => (
  <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #F0EDE7" }}>
    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#BBB", fontFamily: "monospace" }}>{name}</p>
    <p style={{ margin: 0, color: "#1A1A1A", ...style }}>
      Classic Drive — Veículos Clássicos
    </p>
  </div>
);

const RadiusBox = ({ name, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
    <div style={{
      width: 44, height: 44, flexShrink: 0,
      background: "#C9A96E20", border: "1.5px solid #C9A96E",
      borderRadius: typeof value === "number" ? value : value,
    }} />
    <div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{name}</p>
      <p style={{ margin: 0, fontSize: 12, color: "#AAA", fontFamily: "monospace" }}>{value}px</p>
    </div>
  </div>
);

export default function DesignSystem() {
  return (
    <div style={{
      minHeight: "100vh", background: "#F9F7F4",
      fontFamily: "'Inter', sans-serif",
      maxWidth: 390, margin: "0 auto",
      padding: "52px 24px 60px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#C9A96E", letterSpacing: 1.4, textTransform: "uppercase" }}>
          Design System
        </p>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.2 }}>
          Classic Drive
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#999" }}>
          Tokens extraídos do app v2.0
        </p>
      </div>

      {/* Cores */}
      <Section title="Cores — Primária">
        <ColorSwatch name="Gold" hex="#C9A96E" />
        <ColorSwatch name="Gold Light" hex="#E8D5A3" />
      </Section>

      <Section title="Cores — Backgrounds">
        <ColorSwatch name="bgPage"      hex="#F9F7F4" border />
        <ColorSwatch name="bgSheet"     hex="#FDFCFA" border />
        <ColorSwatch name="bgSurface"   hex="#F5F2EE" border />
        <ColorSwatch name="bgInput"     hex="#F2EFE9" border />
      </Section>

      <Section title="Cores — Bordas">
        <ColorSwatch name="borderCard"   hex="#EDE9E2" border />
        <ColorSwatch name="borderSubtle" hex="#E0D9D0" border />
      </Section>

      <Section title="Cores — Texto">
        <ColorSwatch name="textPrimary"     hex="#1A1A1A" />
        <ColorSwatch name="textSecondary"   hex="#999999" />
        <ColorSwatch name="textTertiary"    hex="#BBBBBB" />
        <ColorSwatch name="textMuted"       hex="#AAAAAA" />
        <ColorSwatch name="textPlaceholder" hex="#CCCCCC" />
        <ColorSwatch name="textBadge"       hex="#C0B9B0" />
      </Section>

      {/* Tipografia */}
      <Section title="Tipografia">
        <TypeRow name="pageTitle — 28px / 800"     style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2 }} />
        <TypeRow name="sheetTitle — 20px / 800"    style={{ fontSize: 20, fontWeight: 800 }} />
        <TypeRow name="cardName — 22px / 800"      style={{ fontSize: 22, fontWeight: 800 }} />
        <TypeRow name="cta / confirmValue — 17px / 800" style={{ fontSize: 17, fontWeight: 800 }} />
        <TypeRow name="bookingValue — 17px / 600"  style={{ fontSize: 17, fontWeight: 600 }} />
        <TypeRow name="triggerValue — 16px / 700"  style={{ fontSize: 16, fontWeight: 700 }} />
        <TypeRow name="addrMain — 15px / 600"      style={{ fontSize: 15, fontWeight: 600 }} />
        <TypeRow name="bookingLabel — 14px / 600"  style={{ fontSize: 14, fontWeight: 600 }} />
        <TypeRow name="cardYear / sheetSubtitle — 13px / 500" style={{ fontSize: 13, fontWeight: 500 }} />
        <TypeRow name="addrSub — 12px / 400"       style={{ fontSize: 12, fontWeight: 400 }} />
        <TypeRow name="cardBadge / sheetSection — 11px / 700" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1 }} />
      </Section>

      {/* Border Radius */}
      <Section title="Border Radius">
        <RadiusBox name="sheet"      value={24} />
        <RadiusBox name="cardLarge"  value={20} />
        <RadiusBox name="chip"       value={20} />
        <RadiusBox name="button"     value={16} />
        <RadiusBox name="card"       value={14} />
        <RadiusBox name="iconBox"    value={10} />
      </Section>

      {/* Espaçamento */}
      <Section title="Espaçamento">
        {[
          ["pageTop",       52],
          ["pageH",         24],
          ["cardGap",       16],
          ["timelineGap",   12],
          ["dotSize",       12],
          ["carouselGap",   14],
          ["addrRowPadV",   13],
          ["triggerPad",    14],
          ["ctaPadV",       17],
        ].map(([name, val]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0EDE7" }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1A1A1A", fontFamily: "monospace" }}>{name}</p>
            <p style={{ margin: 0, fontSize: 13, color: "#AAA", fontFamily: "monospace" }}>{val}px</p>
          </div>
        ))}
      </Section>

      {/* Animações */}
      <Section title="Animações">
        {[
          ["slideUp",  "0.3s cubic-bezier(0.32, 0.72, 0, 1)"],
          ["fadeIn",   "0.16s ease"],
          ["border",   "0.18s"],
          ["bg",       "0.12s"],
          ["all",      "0.15s"],
          ["carousel", "0.25s"],
        ].map(([name, val]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0EDE7" }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1A1A1A", fontFamily: "monospace" }}>{name}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#AAA", fontFamily: "monospace", textAlign: "right", maxWidth: 200 }}>{val}</p>
          </div>
        ))}
      </Section>

    </div>
  );
}
