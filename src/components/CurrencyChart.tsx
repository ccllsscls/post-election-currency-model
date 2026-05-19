import { useState, useEffect, useRef } from "react";

// ── Static historical data (sourced from ECB / market data) ──────────────
// PLN: EUR/PLN monthly from Oct 2023 election (index 0 = election month)
const PLN_DATA = [
  { label: "Election", value: 4.58 },
  { label: "M+1",  value: 4.38 },
  { label: "M+2",  value: 4.32 },
  { label: "M+3",  value: 4.28 },
  { label: "M+4",  value: 4.25 },
  { label: "M+5",  value: 4.23 },
  { label: "M+6",  value: 4.21 },
  { label: "M+9",  value: 4.18 },
  { label: "M+12", value: 4.17 },
  { label: "M+18", value: 4.20 },
  { label: "M+24", value: 4.22 },
];

// HUF: EUR/HUF from Apr 2026 election
const HUF_ACTUAL = [
  { label: "Election", value: 383 },
  { label: "M+1 (now)", value: 366 },
];

// PLN % change from election baseline
const plnPct = PLN_DATA.map(d => +((d.value / PLN_DATA[0].value - 1) * 100).toFixed(2));

function computeProjection(plnWeight: number, speed: number, rateCut: number) {
  const speedMult = speed === 1 ? 0.7 : speed === 2 ? 1.0 : 1.25;
  const rateMult  = rateCut === 1 ? 1.05 : rateCut === 2 ? 1.0 : 0.93;
  const hufBase   = HUF_ACTUAL[0].value;
  return PLN_DATA.map((d) => {
    const plnChange = (d.value - PLN_DATA[0].value) / PLN_DATA[0].value;
    const blended   = plnChange * speedMult * rateMult * plnWeight
                    + plnChange * 0.5 * (1 - plnWeight);
    return +((hufBase * (1 + blended) / hufBase - 1) * 100).toFixed(2);
  });
}

// ── Tiny canvas chart ────────────────────────────────────────────────────
function LineChart({
  datasets,
  labels,
  height = 280,
}: {
  datasets: { label: string; data: (number | null)[]; color: string; dash?: number[] }[];
  labels: string[];
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = height;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const pad = { top: 20, right: 20, bottom: 48, left: 52 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top  - pad.bottom;

    // Collect all non-null values for scale
    const allVals = datasets.flatMap(d => d.data.filter(v => v !== null) as number[]);
    const minV = Math.min(...allVals) - 1;
    const maxV = Math.max(...allVals) + 1;
    const xStep = chartW / (labels.length - 1);
    const yScale = (v: number) => pad.top + chartH - ((v - minV) / (maxV - minV)) * chartH;
    const xPos   = (i: number) => pad.left + i * xStep;

    // Grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth   = 1;
    const ticks = 5;
    for (let t = 0; t <= ticks; t++) {
      const v = minV + (maxV - minV) * (t / ticks);
      const y = yScale(v);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();
      ctx.fillStyle = "#aaa";
      ctx.font      = "11px system-ui";
      ctx.textAlign = "right";
      ctx.fillText((v >= 0 ? "+" : "") + v.toFixed(1) + "%", pad.left - 6, y + 4);
    }

    // Zero line
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, yScale(0));
    ctx.lineTo(pad.left + chartW, yScale(0));
    ctx.stroke();

    // X labels
    ctx.fillStyle = "#aaa";
    ctx.font      = "11px system-ui";
    ctx.textAlign = "center";
    labels.forEach((l, i) => {
      if (i % 2 === 0 || i === labels.length - 1) {
        ctx.fillText(l, xPos(i), H - pad.bottom + 18);
      }
    });

    // Draw each dataset
    datasets.forEach(ds => {
      ctx.strokeStyle = ds.color;
      ctx.lineWidth   = 2;
      ctx.setLineDash(ds.dash || []);
      ctx.beginPath();
      let started = false;
      ds.data.forEach((v, i) => {
        if (v === null) return;
        const x = xPos(i);
        const y = yScale(v);
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Dots
      ds.data.forEach((v, i) => {
        if (v === null) return;
        ctx.beginPath();
        ctx.arc(xPos(i), yScale(v), 3.5, 0, Math.PI * 2);
        ctx.fillStyle = ds.color;
        ctx.fill();
      });
    });
  }, [datasets, labels, height]);

  return (
    <canvas
      ref={ref}
      style={{ width: "100%", height, display: "block" }}
      aria-label="PLN and HUF post-election currency chart"
    />
  );
}

// ── Main component ───────────────────────────────────────────────────────
export default function CurrencyChart() {
  const [plnWeight, setPlnWeight] = useState(80);
  const [speed,     setSpeed]     = useState(2);
  const [rateCut,   setRateCut]   = useState(2);

  const proj = computeProjection(plnWeight / 100, speed, rateCut);

  // Align datasets to shared label axis (PLN labels)
  const sharedLabels = PLN_DATA.map(d => d.label);

  // HUF actual: only first 2 points, rest null
  const hufActual = sharedLabels.map((_, i) => i < HUF_ACTUAL.length ? +((HUF_ACTUAL[i].value / HUF_ACTUAL[0].value - 1) * 100).toFixed(2) : null);

  // HUF projection: all points, but first point anchored to actual
  const hufProj = proj.map((v, i) => i === 0 ? hufActual[0] : v);

  const datasets = [
    { label: "PLN (Oct 2023 template)", data: plnPct,   color: "#378ADD" },
    { label: "HUF actual",              data: hufActual, color: "#f59e0b" },
    { label: "HUF projected",           data: hufProj,   color: "#10b981", dash: [6, 4] },
  ];

  const proj12 = proj[8]; // M+12 index
  const proj6  = proj[6]; // M+6 index
  const hufBase = HUF_ACTUAL[0].value;

  const speedLabel = ["", "Slow", "Medium", "Fast"];
  const rateLabel  = ["", "Low",  "Medium", "High"];

  return (
    <div style={{ padding: "1.5rem 0" }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10, marginBottom: "1.5rem" }}>
        {[
          { label: "PLN election",   value: "Oct 15, 2023", sub: "Opposition wins",  color: "#378ADD" },
          { label: "PLN 12m gain",   value: "+8.0%",         sub: "vs EUR baseline",  color: "#378ADD" },
          { label: "HUF election",   value: "Apr 13, 2026", sub: "Tisza landslide",  color: "#10b981" },
          { label: "HUF day-1 gain", value: "+4.6%",         sub: "383 → 366/EUR",   color: "#10b981" },
        ].map(s => (
          <div key={s.label} style={{ background: "#f5f5f3", borderRadius: 8, padding: "0.875rem", borderLeft: `3px solid ${s.color}` }}>
            <p style={{ fontSize: 12, color: "#888", margin: "0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#10b981", margin: "2px 0 0" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 8, flexWrap: "wrap", fontSize: 12, color: "#888" }}>
        {[
          { color: "#378ADD", label: "PLN (post Oct 2023)", dash: false },
          { color: "#f59e0b", label: "HUF actual",          dash: false },
          { color: "#10b981", label: "HUF projected",        dash: true  },
        ].map(l => (
          <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              display: "inline-block", width: 18, height: 3,
              background: l.color, borderRadius: 2,
              opacity: l.dash ? 0.7 : 1,
              borderBottom: l.dash ? `2px dashed ${l.color}` : "none",
            }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "1rem" }}>
        <LineChart datasets={datasets} labels={sharedLabels} height={280} />
      </div>

      {/* Sliders */}
      <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "1rem 1.25rem", marginTop: "1rem" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: ".05em", textTransform: "uppercase", margin: "0 0 12px" }}>
          Projection parameters
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1rem" }}>
          {[
            { label: `PLN template weight: ${plnWeight}%`, min: 0, max: 100, step: 5,  val: plnWeight, set: setPlnWeight },
            { label: `EU funds speed: ${speedLabel[speed]}`, min: 1, max: 3,   step: 1,  val: speed,     set: setSpeed     },
            { label: `Rate cut prob: ${rateLabel[rateCut]}`,  min: 1, max: 3,   step: 1,  val: rateCut,   set: setRateCut   },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontSize: 12, color: "#888", margin: "0 0 6px" }}>{s.label}</p>
              <input
                type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                onChange={e => s.set(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Projection targets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10, marginTop: "1rem" }}>
        {[
          { label: "Current HUF",      value: "366/EUR",                          sub: "Post-election day 1", color: "#f59e0b" },
          { label: "6-month target",   value: `${Math.round(hufBase*(1+proj6/100))}/EUR`,  sub: "Based on PLN template", color: "#10b981" },
          { label: "12-month target",  value: `${Math.round(hufBase*(1+proj12/100))}/EUR`, sub: "Projection midpoint",   color: "#7F77DD" },
          { label: "PLN ref (12m)",    value: "4.17 PLN/EUR",                      sub: "+8% vs pre-election",  color: "#378ADD" },
        ].map(s => (
          <div key={s.label} style={{ background: "#f5f5f3", borderRadius: 8, padding: "0.875rem", borderLeft: `3px solid ${s.color}` }}>
            <p style={{ fontSize: 11, color: "#888", margin: "0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: 11, color: "#bbb", marginTop: "1rem", lineHeight: 1.6 }}>
        % change from election day baseline. PLN data: Oct 2023 – Oct 2024. HUF projection uses PLN trajectory scaled by user parameters. Not financial advice.
      </p>
    </div>
  );
}
