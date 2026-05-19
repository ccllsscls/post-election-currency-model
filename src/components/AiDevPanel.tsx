import React from "react";

const tools = [
  { icon: "💬", name: "Claude.ai", desc: "Architecture · code gen · data research" },
  { icon: "🐙", name: "GitHub + Actions", desc: "Version control · auto-deploy CI/CD" },
  { icon: "⚡", name: "Vite + React", desc: "Frontend · Recharts · TypeScript" },
  { icon: "🌐", name: "ECB public API", desc: "Free · no key needed · SDMX-JSON" },
];

const timeline = [
  { color: "#378ADD", day: "Day 1 · Research + design", desc: "Prompted Claude for data sources, election dates, PLN/HUF history" },
  { color: "#1D9E75", day: "Day 2 · Core chart + logic", desc: "Chart integration, projection model, interactive sliders" },
  { color: "#7F77DD", day: "Day 3 · Polish + deploy", desc: "GitHub Actions setup, GitHub Pages live URL, AI dev panel" },
];

const prompts = [
  {
    tag: "Research", tagBg: "#E6F1FB", tagColor: "#0C447C",
    note: "Used to gather historical FX data",
    text: `"Compare EUR/PLN trend from Oct 2023 Polish election vs EUR/HUF from Apr 2026 Hungarian election. Give me monthly % changes from election day baseline."`,
  },
  {
    tag: "Architecture", tagBg: "#EAF3DE", tagColor: "#27500A",
    note: "Used to design the projection model",
    text: `"Design a React component using PLN post-election trajectory as template to project HUF. Allow user to adjust: PLN weight %, EU fund unlock speed, rate cut probability."`,
  },
  {
    tag: "Iteration", tagBg: "#EEEDFE", tagColor: "#3C3489",
    note: "Used when chart labels were overlapping",
    text: `"X-axis labels overlap at 14 data points. Fix with autoSkip: false and maxRotation: 45. Dashed projection line needs a bridge point to last actual data point."`,
  },
];

const lessons = [
  "Prompting for architecture first, code second, produces cleaner results.",
  "ECB SDMX-JSON API is free with no auth — better than paid alternatives.",
  "Chart.js cannot read CSS variables — hardcoded hex required for colours.",
  "GitHub Pages needs base set in vite.config.ts to match the repo name.",
];

const stats = [
  { label: "Built with", value: "Claude", sub: "Sonnet 4 · vibe coding" },
  { label: "Time to ship", value: "~3 days", sub: "concept → live URL" },
  { label: "AI assistance", value: "~80%", sub: "of code generated" },
  { label: "Data sources", value: "ECB + AI", sub: "live rates · commentary" },
];

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: 12,
  padding: "1rem 1.25rem",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 600, color: "#aaa",
      letterSpacing: ".05em", textTransform: "uppercase", margin: "0 0 10px",
    }}>
      {children}
    </p>
  );
}

export default function AiDevPanel() {
  return (
    <div style={{ padding: "1.5rem 0", fontFamily: "inherit" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: 10,
        marginBottom: "1.5rem",
      }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "#f5f5f3", borderRadius: 8, padding: "1rem" }}>
            <p style={{ fontSize: 12, color: "#888", margin: "0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div style={card}>
          <Label>Tools used</Label>
          {tools.map(t => (
            <div key={t.name} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{t.name}</p>
                <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={card}>
          <Label>Build timeline</Label>
          {timeline.map(t => (
            <div key={t.day} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: t.color, flexShrink: 0, marginTop: 4,
              }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 500, margin: 0 }}>{t.day}</p>
                <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...card, marginBottom: "1rem" }}>
        <Label>Key prompts that shaped this project</Label>
        {prompts.map(p => (
          <div key={p.tag} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 99,
                background: p.tagBg, color: p.tagColor,
              }}>
                {p.tag}
              </span>
              <span style={{ fontSize: 12, color: "#888" }}>{p.note}</span>
            </div>
            <div style={{
              fontFamily: "monospace", fontSize: 12,
              background: "#f5f5f3",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 8, padding: "10px 12px",
              color: "#666", lineHeight: 1.6,
            }}>
              {p.text}
            </div>
          </div>
        ))}
      </div>

      <div style={card}>
        <Label>What I learned</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {lessons.map(l => (
            <div key={l} style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#1D9E75", fontWeight: 600, flexShrink: 0 }}>✓</span>
              <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.6 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
