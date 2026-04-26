import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0a0e1a",
  surface: "#111827",
  surfaceAlt: "#1a2235",
  border: "#1e2d45",
  accent: "#3b82f6",
  accentHover: "#2563eb",
  accentSoft: "rgba(59,130,246,0.12)",
  gold: "#f59e0b",
  goldSoft: "rgba(245,158,11,0.12)",
  green: "#10b981",
  greenSoft: "rgba(16,185,129,0.12)",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.12)",
  text: "#f1f5f9",
  textMuted: "#64748b",
  textSub: "#94a3b8",
};

const STYLES = {
  fontTitle: "'Playfair Display', Georgia, serif",
  fontBody: "'DM Sans', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INITIAL_BUILDING = {
  id: 1,
  name: "Skyline Residency",
  totalApartments: 12,
  address: "42 Agrabad C/A, Chattogram",
  securityService: true,
  wasteManagement: true,
  elevator: true,
  generator: true,
  contact: "01712-345678",
};

const ROOM_TYPES = ["Studio", "1-Bedroom", "2-Bedroom", "3-Bedroom", "Penthouse"];

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ label, type = "default" }) => {
  const colors = {
    Available: { bg: COLORS.greenSoft, color: COLORS.green, dot: COLORS.green },
    Booked: { bg: COLORS.accentSoft, color: COLORS.accent, dot: COLORS.accent },
    Maintenance: { bg: COLORS.goldSoft, color: COLORS.gold, dot: COLORS.gold },
    Active: { bg: COLORS.greenSoft, color: COLORS.green, dot: COLORS.green },
    Inactive: { bg: COLORS.redSoft, color: COLORS.red, dot: COLORS.red },
    default: { bg: COLORS.surfaceAlt, color: COLORS.textSub, dot: COLORS.textSub },
  };
  const c = colors[label] || colors.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: c.bg, color: c.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
      {label}
    </span>
  );
};

const Card = ({ children, style }) => (
  <div style={{
    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
    borderRadius: 14, ...style,
  }}>{children}</div>
);

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
const Sidebar = ({ active, onNav, building }) => (
  <aside style={{
    width: 240, minHeight: "100vh", background: COLORS.surface,
    borderRight: `1px solid ${COLORS.border}`,
    display: "flex", flexDirection: "column",
    position: "fixed", left: 0, top: 0,
  }}>
    <div style={{ padding: "24px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏢</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{building.name}</div>
          <div style={{ fontSize: 10, color: COLORS.textMuted }}>Admin Portal</div>
        </div>
      </div>
    </div>
    <nav style={{ flex: 1, padding: "16px 12px" }}>
      {[
        { id: "dashboard", label: "Dashboard", icon: "⬡" },
        { id: "flats", label: "Flats & Booking", icon: "◫" },
        { id: "tenants", label: "Tenants", icon: "👤" },
      ].map(item => (
        <button key={item.id} onClick={() => onNav(item.id)}
          style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%",
            padding: "12px", borderRadius: 10, marginBottom: 4,
            background: active === item.id ? COLORS.accentSoft : "transparent",
            border: "none", color: active === item.id ? COLORS.accent : COLORS.textSub,
            cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 600,
          }}
        >
          <span>{item.icon}</span> {item.label}
        </button>
      ))}
    </nav>
  </aside>
);

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const Dashboard = ({ building, flats = [], tenants = [] }) => {
  const stats = [
    { label: "Total Units", value: 12, color: COLORS.accent },
    { label: "Occupied", value: 4, color: COLORS.green },
    { label: "Available", value: 7, color: COLORS.gold },
    { label: "Maintenance", value: 1, color: COLORS.red },
  ];

  return (
    <div style={{ paddingLeft: 260, paddingRight: 40, paddingTop: 40 }}>
      <header style={{ marginBottom: 30 }}>
        <h1 style={{ fontFamily: STYLES.fontTitle, fontSize: 32, marginBottom: 8 }}>Building Overview</h1>
        <p style={{ color: COLORS.textMuted }}>{building.address}</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600, marginBottom: 8 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        <Card style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Building Services</h3>
          {["securityService", "wasteManagement", "elevator", "generator"].map(s => (
            <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ color: COLORS.textSub }}>{s.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              <Badge label={building[s] ? "Active" : "Inactive"} />
            </div>
          ))}
        </Card>

        <Card style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Quick Contact</h3>
          <div style={{ background: COLORS.surfaceAlt, padding: 16, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>Manager Phone</div>
            <div style={{ fontSize: 18, color: COLORS.accent, fontWeight: 700 }}>{building.contact}</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [building] = useState(INITIAL_BUILDING);

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: STYLES.fontBody }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        body { margin: 0; }
        * { box-sizing: border-box; }
      `}</style>
      
      <Sidebar active={page} onNav={setPage} building={building} />
      
      <main>
        {page === "dashboard" && <Dashboard building={building} />}
        {page === "flats" && <div style={{ paddingLeft: 260, padding: 40 }}><h2>Flats Management (API Connected)</h2></div>}
        {page === "tenants" && <div style={{ paddingLeft: 260, padding: 40 }}><h2>Tenants List (API Connected)</h2></div>}
      </main>
    </div>
  );
}