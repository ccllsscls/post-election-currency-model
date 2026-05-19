import CurrencyChart from "./components/CurrencyChart";
import { useState } from "react";
import AiDevPanel from "./components/AiDevPanel";

type Tab = "analysis" | "how-built";

export default function App() {
  const [active, setActive] = useState<Tab>("analysis");

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", background: "#fff", padding: "0 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontSize: 18, fontWeight: 500, margin: "1rem 0" }}>
            PLN / HUF Post-Election Currency Tracker
          </h1>
          <div style={{ display: "flex", gap: 0 }}>
            {(["analysis", "how-built"] as Tab[]).map(t => (
              <button key={t} onClick={() => setActive(t)} style={{
                background: "none", border: "none",
                borderBottom: active === t ? "2px solid #378ADD" : "2px solid transparent",
                color: active === t ? "#378ADD" : "#888",
                fontFamily: "inherit", fontSize: 14,
                fontWeight: active === t ? 500 : 400,
                padding: "8px 16px 10px", cursor: "pointer",
              }}>
                {t === "analysis" ? "Analysis" : "How it was built"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem" }}>
        {active === "analysis" && <CurrencyChart />}
        {active === "how-built" && <AiDevPanel />}
      </div>
    </div>
  );
}