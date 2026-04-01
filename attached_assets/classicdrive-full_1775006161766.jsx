import { useState, useRef, useEffect } from "react";

// ── Tokens ─────────────────────────────────────────────────
const GOLD = "#C9A96E";
const GOLD_LIGHT = "#E8D5A3";
const DOT_SIZE = 14;

// ── Dados ──────────────────────────────────────────────────
const vehicles = [
  { id: 1, year: "1969", name: "Ford Mustang Fastback", price: "R$220", tag: "VEÍCULO CLÁSSICO", image: "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=600&q=80" },
  { id: 2, year: "1957", name: "Chevrolet Bel Air",     price: "R$280", tag: "VEÍCULO CLÁSSICO", image: "https://images.unsplash.com/photo-1566008885218-90a1e8d32e9c?w=600&q=80" },
  { id: 3, year: "1965", name: "Porsche 356 C",         price: "R$350", tag: "ESPORTIVO",        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80" },
];

const RECENT_ADDRESSES = [
  { id: 1, main: "Rua Havaí, 350",          sub: "Centro, Belo Horizonte - MG",       icon: "clock" },
  { id: 2, main: "Av. do Contorno, 6000",   sub: "Funcionários, Belo Horizonte - MG", icon: "clock" },
  { id: 3, main: "Praça da Liberdade",      sub: "Funcionários, Belo Horizonte - MG", icon: "clock" },
  { id: 4, main: "Shopping Diamond Mall",   sub: "Gutierrez, Belo Horizonte - MG",    icon: "clock" },
  { id: 5, main: "Aeroporto de Confins",    sub: "Confins - MG",                      icon: "clock" },
];

const MOCK_SUGGESTIONS = {
  "r":  [
    { id: 10, main: "Rua da Bahia, 1148",   sub: "Centro, Belo Horizonte - MG",       icon: "pin" },
    { id: 11, main: "Rua Sergipe, 400",     sub: "Funcionários, Belo Horizonte - MG", icon: "pin" },
    { id: 12, main: "Rua Curitiba, 832",    sub: "Centro, Belo Horizonte - MG",       icon: "pin" },
  ],
  "av": [
    { id: 13, main: "Av. Afonso Pena, 1500",   sub: "Centro, Belo Horizonte - MG",       icon: "pin" },
    { id: 14, main: "Av. Getúlio Vargas, 300", sub: "Funcionários, Belo Horizonte - MG", icon: "pin" },
    { id: 15, main: "Av. Raja Gabaglia, 1000", sub: "Gutierrez, Belo Horizonte - MG",    icon: "pin" },
  ],
  "pr": [
    { id: 16, main: "Praça Sete de Setembro", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
    { id: 17, main: "Praça da Estação",       sub: "Centro, Belo Horizonte - MG", icon: "pin" },
  ],
};

function getSuggestions(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  for (const key of Object.keys(MOCK_SUGGESTIONS)) {
    if (q.startsWith(key)) return MOCK_SUGGESTIONS[key];
  }
  return [
    { id: 99, main: `${query}, 100`,    sub: "Belo Horizonte - MG", icon: "pin" },
    { id: 98, main: `${query} - Centro`, sub: "Belo Horizonte - MG", icon: "pin" },
  ];
}

// ── Helpers data/hora ──────────────────────────────────────
function todayStr() { return new Date().toISOString().split("T")[0]; }
function nowTimeStr() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
}
function formatDate(s) {
  if (!s) return null;
  const [y,m,d] = s.split("-");
  const date = new Date(y, m-1, d);
  const today = new Date(); today.setHours(0,0,0,0);
  const tom = new Date(today); tom.setDate(today.getDate()+1);
  if (date.getTime() === today.getTime()) return "Hoje";
  if (date.getTime() === tom.getTime())   return "Amanhã";
  return date.toLocaleDateString("pt-BR", { weekday:"short", day:"numeric", month:"short" });
}
function formatTime(s) {
  if (!s) return null;
  const [h,m] = s.split(":");
  return `${h}:${m}`;
}

// ── Icons ──────────────────────────────────────────────────
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const ChevronIcon = ({ color = "#CCC" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const ClockIconSm = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const PinIcon = ({ color = GOLD }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    <circle cx="12" cy="12" r="8" strokeDasharray="2 3"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const CalendarIcon = ({ color = GOLD }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="3"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ClockIcon = ({ color = GOLD }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── AddressSheet ───────────────────────────────────────────
function AddressRow({ addr, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(addr.main)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "13px 24px", cursor: "pointer",
        background: hovered ? "#F5F2EE" : "transparent",
        transition: "background 0.12s",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: addr.icon === "clock" ? "#F2EFE9" : `${GOLD}20`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: addr.icon === "clock" ? "#AAA" : GOLD,
      }}>
        {addr.icon === "clock" ? <ClockIconSm /> : <PinIcon />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{addr.main}</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#AAA", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{addr.sub}</p>
      </div>
      <ChevronIcon />
    </div>
  );
}

function AddressSheet({ label, onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const showSuggestions = query.length >= 2;
  const list = showSuggestions ? getSuggestions(query) : RECENT_ADDRESSES;
  const listLabel = showSuggestions ? "Sugestões" : "Recentes";

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 150); }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)", backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "relative", background: "#FDFCFA",
        borderRadius: "24px 24px 0 0", maxHeight: "88vh",
        display: "flex", flexDirection: "column",
        animation: "slideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0D9D0" }} />
        </div>
        <div style={{ padding: "10px 24px 16px" }}>
          <p style={{ margin: "0 0 12px", color: "#999", fontSize: 13, fontWeight: 600, letterSpacing: 0.3 }}>{label}</p>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#F2EFE9", borderRadius: 14, padding: "0 14px",
            border: focused ? `1.5px solid ${GOLD}` : "1.5px solid transparent",
            transition: "border 0.18s",
          }}>
            <SearchIcon />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="Buscar endereço..."
              style={{ flex: 1, border: "none", background: "transparent", fontSize: 16, color: "#1A1A1A", padding: "14px 0", outline: "none", fontFamily: "inherit" }}
            />
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => onSelect("Minha localização atual")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 0 6px 12px", display: "flex", alignItems: "center", borderLeft: "1px solid #E0D9D0" }}
            >
              <LocationIcon />
            </button>
          </div>
        </div>
        <div style={{ height: 1, background: "#F0EDE7", margin: "0 24px" }} />
        <div style={{ overflowY: "auto", flex: 1, paddingBottom: 32 }}>
          <div key={listLabel} style={{ animation: "fadeIn 0.16s ease" }}>
            <p style={{ margin: "14px 24px 4px", fontSize: 11, fontWeight: 700, color: "#C0B9B0", letterSpacing: 1.2, textTransform: "uppercase" }}>{listLabel}</p>
            {list.map(addr => <AddressRow key={addr.id} addr={addr} onSelect={onSelect} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ScheduleSheet ──────────────────────────────────────────
function DayChip({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: 20,
      border: selected ? `1.5px solid ${GOLD}` : "1.5px solid #EDE9E2",
      background: selected ? `${GOLD}18` : "#fff",
      color: selected ? GOLD : "#888",
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      transition: "all 0.15s", fontFamily: "inherit", whiteSpace: "nowrap",
    }}>{label}</button>
  );
}

function NativeTrigger({ icon, label, displayValue, placeholder, inputType, inputValue, onChange, inputRef, min }) {
  const hasValue = !!displayValue;
  return (
    <div style={{ flex: "0 0 auto", position: "relative" }}>
      <div
        onClick={() => inputRef.current?.showPicker?.() || inputRef.current?.click()}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#F5F2EE", borderRadius: 14, padding: "14px 16px",
          cursor: "pointer",
          border: hasValue ? `1.5px solid ${GOLD}40` : "1.5px solid transparent",
          transition: "all 0.15s",
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: hasValue ? `${GOLD}22` : "#EDEAE4",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#BBB", letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 2 }}>{label}</p>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: hasValue ? "#1A1A1A" : "#CCC" }}>{displayValue || placeholder}</p>
        </div>
        <ChevronIcon />
      </div>
      <input
        ref={inputRef} type={inputType} value={inputValue} min={min}
        onChange={e => onChange(e.target.value)}
        style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer", fontSize: 16 }}
      />
    </div>
  );
}

function ScheduleSheet({ onConfirm, onClose }) {
  const today = todayStr();
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(nowTimeStr());
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const isNow = date === today && Math.abs(
    parseInt(time.replace(":","")) - parseInt(nowTimeStr().replace(":",""))
  ) <= 5;

  function handleNow() { setDate(today); setTime(nowTimeStr()); }

  const dateDisplay = formatDate(date);
  const timeDisplay = formatTime(time);

  const dayChips = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    const str = d.toISOString().split("T")[0];
    const label = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : d.toLocaleDateString("pt-BR", { weekday:"short", day:"numeric" });
    return { str, label };
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)", backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "relative", background: "#FDFCFA",
        borderRadius: "24px 24px 0 0",
        animation: "slideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
        paddingBottom: 40,
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0D9D0" }} />
        </div>
        <div style={{ padding: "8px 24px 20px" }}>
          <p style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 800, color: "#1A1A1A" }}>Para quando?</p>
          <p style={{ margin: 0, fontSize: 13, color: "#BBB" }}>Escolha dia e horário de retirada</p>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 24px 20px", scrollbarWidth: "none" }}>
          <DayChip label="Agora" selected={isNow} onClick={handleNow} />
          {dayChips.map(chip => (
            <DayChip key={chip.str} label={chip.label} selected={!isNow && date === chip.str} onClick={() => setDate(chip.str)} />
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: "0 24px" }}>
          <NativeTrigger
            icon={<CalendarIcon color={date ? GOLD : "#CCC"} />}
            label="Dia" displayValue={isNow ? "Hoje" : dateDisplay} placeholder="Selecionar"
            inputType="date" inputValue={date} onChange={setDate} inputRef={dateRef} min={today}
          />
          <NativeTrigger
            icon={<ClockIcon color={time ? GOLD : "#CCC"} />}
            label="Hora" displayValue={timeDisplay} placeholder="Selecionar"
            inputType="time" inputValue={time} onChange={setTime} inputRef={timeRef}
          />
        </div>
        {(date || time) && (
          <div style={{
            margin: "20px 24px 0", padding: "14px 16px",
            background: `${GOLD}12`, borderRadius: 14, border: `1px solid ${GOLD}30`,
            animation: "fadeIn 0.2s ease",
          }}>
            <p style={{ margin: 0, fontSize: 13, color: "#999", marginBottom: 4 }}>Confirmando agendamento para</p>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1A1A1A" }}>
              {isNow ? "Agora mesmo" : `${dateDisplay} às ${timeDisplay}`}
            </p>
          </div>
        )}
        <div style={{ padding: "20px 24px 0" }}>
          <button
            onClick={() => onConfirm({
              display: isNow ? "Agora" : `${dateDisplay} às ${timeDisplay}`
            })}
            style={{
              width: "100%", padding: "17px 0",
              background: `linear-gradient(135deg, ${GOLD} 0%, #A8834A 100%)`,
              border: "none", borderRadius: 16, color: "#fff",
              fontSize: 17, fontWeight: 700, letterSpacing: 0.3, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "inherit",
            }}
          >
            <CheckIcon /> Confirmar horário
          </button>
        </div>
      </div>
    </div>
  );
}

// ── BookingCard (Home) ────────────────────────────────────
const DOT_R = 12;
const LINE_W = 2;
const CARD_GAP = 16; // espaço entre cards — a linha preenche exatamente isso

function BookingCard({ label, value, onClick, placeholder, last }) {
  const isEmpty = !value || value === placeholder;

  return (
    // Container autossuficiente por item — dot + linha + conteúdo encapsulados
    <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>

      {/* ── Coluna esquerda: dot + linha ── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingBottom: last ? 0 : CARD_GAP,
      }}>
        {/* marginTop: metade da line-height do label (12px * 1.4 / 2) menos metade do dot */}
        <div style={{
          width: DOT_R, height: DOT_R, borderRadius: "50%",
          background: GOLD, flexShrink: 0,
          marginTop: 2,
        }} />
        {!last && (
          <div style={{
            flex: 1, width: LINE_W, marginTop: 5,
            background: `repeating-linear-gradient(to bottom, ${GOLD} 0, ${GOLD} 5px, transparent 5px, transparent 10px)`,
          }} />
        )}
      </div>

      {/* ── Coluna direita: label + card clicável ── */}
      <div style={{ flex: 1, paddingBottom: last ? 0 : CARD_GAP }}>
        <p style={{ margin: "0 0 6px", color: "#999", fontSize: 14, fontWeight: 600, letterSpacing: 0.2, lineHeight: "16px" }}>
          {label}
        </p>
        <div
          onClick={onClick}
          style={{
            background: "#fff", borderRadius: 14, padding: "14px 16px",
            border: "1px solid #EDE9E2",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer", transition: "border 0.15s",
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 600, color: isEmpty ? "#CCC" : "#1A1A1A" }}>
            {value || placeholder}
          </span>
          <ChevronIcon />
        </div>
      </div>

    </div>
  );
}

// ── App principal ──────────────────────────────────────────
export default function ClassicDriveApp() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef([]);
  const scrollRef = useRef(null);

  const [sheet, setSheet] = useState(null); // null | "when" | "from" | "to"

  const [when, setWhen] = useState("Hoje, Agora");
  const [from, setFrom] = useState("Rua Havaí 350, Centro - ...");
  const [to,   setTo]   = useState("Selecionar destino");

  useEffect(() => {
    const observers = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { root: scrollRef.current, threshold: 0.6 }
      );
      obs.observe(card);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#F9F7F4",
      fontFamily: "'Inter', sans-serif",
      maxWidth: 390, margin: "0 auto",
      position: "relative", overflowX: "hidden",
    }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(5px) } to { opacity: 1; transform: translateY(0) } }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "52px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: `2px solid ${GOLD}`, flexShrink: 0 }}>
            <img src="https://i.pravatar.cc/88?img=11" alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ color: "#999", fontSize: 15 }}>Olá, Lucas!</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.2, margin: 0 }}>
          Contrate um Clássico agora
        </h1>
      </div>

      {/* Carousel */}
      <div style={{ marginBottom: 28 }}>
        <div
          ref={scrollRef}
          style={{
            display: "flex", gap: 14, overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 20,
            scrollbarWidth: "none", backgroundColor: "#F9F7F4",
          }}
        >
          {vehicles.map((v, i) => (
            <div
              key={v.id}
              ref={el => cardRefs.current[i] = el}
              onClick={() => setActiveIndex(i)}
              style={{
                width: "calc(100vw - 72px)", maxWidth: 320, height: 305,
                borderRadius: 20, position: "relative",
                scrollSnapAlign: "center", flexShrink: 0, cursor: "pointer",
                border: activeIndex === i ? `3px solid ${GOLD}` : "3px solid transparent",
                transition: "border 0.2s",
              }}
            >
              <div style={{ position: "absolute", inset: 0, borderRadius: 17, overflow: "hidden" }}>
                <img src={v.image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)" }} />
              </div>
              <div style={{ position: "absolute", top: 16, left: 16, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 0.8, padding: "5px 12px", borderRadius: 20 }}>
                {v.tag}
              </div>
              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: "0 0 2px", fontWeight: 500 }}>{v.year}</p>
                <p style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.1 }}>{v.name}</p>
                <span style={{ color: GOLD_LIGHT, fontSize: 20, fontWeight: 700 }}>{v.price}</span>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginLeft: 4 }}>/hora</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14 }}>
          {vehicles.map((_, i) => (
            <div key={i} onClick={() => setActiveIndex(i)} style={{
              width: activeIndex === i ? 20 : 6, height: 6, borderRadius: 3,
              background: activeIndex === i ? GOLD : "#D8D0C4",
              transition: "all 0.25s", cursor: "pointer",
            }} />
          ))}
        </div>
      </div>

      {/* Booking cards */}
      <div style={{ padding: "0 24px" }}>
        <BookingCard label="Para quando?" value={when} placeholder="Selecionar data e hora" onClick={() => setSheet("when")} />
        <BookingCard label="De onde?"     value={from} placeholder="Selecionar origem"      onClick={() => setSheet("from")} />
        <BookingCard label="Para onde?"   value={to}   placeholder="Selecionar destino"     onClick={() => setSheet("to")} last />
      </div>

      {/* CTA */}
      <div style={{ padding: "28px 24px 40px" }}>
        <button style={{
          width: "100%", padding: "17px 0",
          background: `linear-gradient(135deg, ${GOLD} 0%, #A8834A 100%)`,
          border: "none", borderRadius: 16, color: "#fff",
          fontSize: 17, fontWeight: 700, letterSpacing: 0.3, cursor: "pointer",
        }}>
          Contratar agora
        </button>
      </div>

      {/* Sheet de agendamento */}
      {sheet === "when" && (
        <ScheduleSheet
          onConfirm={val => { setWhen(val.display); setSheet(null); }}
          onClose={() => setSheet(null)}
        />
      )}

      {/* Sheet de endereço */}
      {(sheet === "from" || sheet === "to") && (
        <AddressSheet
          label={sheet === "from" ? "De onde?" : "Para onde?"}
          onSelect={addr => {
            if (sheet === "from") setFrom(addr);
            else setTo(addr);
            setSheet(null);
          }}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  );
}
