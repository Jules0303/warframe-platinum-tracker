import React, { useState } from "react";
import { CORRUPTED_MODS } from "../services/relicData";
import { calculateCorruptedModsEV } from "../utils/calculations";
import { PlatinumIcon } from "./Icons";

interface CorruptedModsTrackerProps {
  prices: Record<string, number>;
  refreshPrice: (urlName: string) => Promise<number>;
}

export const CorruptedModsTracker: React.FC<CorruptedModsTrackerProps> = ({ prices, refreshPrice }) => {
  const [runTime, setRunTime] = useState<number>(3.5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("Tous");

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    // On lance en série avec petit délai les fetches
    for (const mod of CORRUPTED_MODS) {
      await refreshPrice(mod.urlName);
    }
    setIsRefreshing(false);
  };

  const ev = calculateCorruptedModsEV(prices, CORRUPTED_MODS);
  const plPerHour = Math.round(ev * (60 / runTime));

  // Catégories uniques
  const categories = ["Tous", "Warframe", "Fusil", "Pistolet", "Mêlée"];
  
  // Filtrer les mods
  const filteredMods = CORRUPTED_MODS.filter(mod => 
    filterCategory === "Tous" || mod.category === filterCategory
  );

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.header}>
          <h1 className="title-grad-blue glow-blue">Farming de Soutes Deimos</h1>
          <p style={styles.subtitle}>
            Optimisez votre farm de soutes Orokin (Mods Corrompus) en analysant l'espérance de gain globale de cette activité.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          style={{ padding: "10px 16px", alignSelf: "center" }}
        >
          {isRefreshing ? "Chargement..." : "🔄 Actualiser tous les Mods"}
        </button>
      </div>

      <div style={styles.mainLayout}>
        {/* Left Column: Stats & Sliders */}
        <div className="glass-panel" style={styles.summaryCard}>
          <div style={styles.summaryTitleRow}>
            <h2 className="title-grad-blue">Rentabilité de la Soute</h2>
            <button
              className="btn btn-secondary"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              style={{ padding: "8px 12px", fontSize: "12px" }}
            >
              {isRefreshing ? "Chargement..." : "🔄 Actualiser Prix"}
            </button>
          </div>

          <div style={styles.statGrid}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Espérance par Soute</span>
              <span className="plat-price plat-price-gold" style={styles.statValue}>
                <PlatinumIcon size={16} style={{ marginRight: "4px" }} />
                {ev.toFixed(2)}
              </span>
              <span style={styles.statSub}>1 chance sur 24 par mod</span>
            </div>

            <div style={styles.statBoxHighlight}>
              <span style={styles.statLabelHighlight}>Gains Horaires Estimés</span>
              <span className="plat-price plat-price-gold" style={styles.statValueHighlight}>
                <PlatinumIcon size={18} style={{ marginRight: "6px" }} />
                {plPerHour} <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "normal" }}>/ h</span>
              </span>
              <span style={styles.statSubHighlight}>Basé sur vos performances</span>
            </div>
          </div>

          <div style={styles.controlBox}>
            <label style={styles.label}>
              ⏱️ Temps de Run Moyen (minutes, temps de chargement inclus) :
            </label>
            <div style={styles.inputRow}>
              <input
                type="range"
                min="2"
                max="8"
                step="0.5"
                value={runTime}
                onChange={(e) => setRunTime(parseFloat(e.target.value))}
                style={styles.slider}
              />
              <span style={styles.runTimeValue}>{runTime} min</span>
            </div>
          </div>

          <div style={styles.infoBox}>
            <p>
              🗝️ <strong>Comment ça marche ?</strong> Chaque soute Orokin sur Deimos (Capture) requiert l'une des 4 Clés de Dragon (Entravée, Décimée, Sanglante ou Boiteuse). Le mod récompensé est choisi aléatoirement de manière équiprobable parmi les 24 mods existants.
            </p>
          </div>
        </div>

        {/* Right Column: Mods list */}
        <div className="glass-panel" style={styles.tableCard}>
          <div style={styles.tableTitleRow}>
            <h3 style={styles.sectionTitle}>Catalogue des 24 Mods Corrompus</h3>
            <div style={styles.filterRow}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    ...styles.filterBtn,
                    borderColor: filterCategory === cat ? "var(--accent-blue)" : "rgba(255,255,255,0.05)",
                    background: filterCategory === cat ? "rgba(41, 182, 246, 0.1)" : "rgba(0,0,0,0.2)",
                    color: filterCategory === cat ? "var(--accent-blue)" : "var(--text-secondary)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mod</th>
                  <th>Catégorie</th>
                  <th>Taux de Drop</th>
                  <th>Prix de Vente</th>
                </tr>
              </thead>
              <tbody>
                {filteredMods.map((mod) => {
                  const price = prices[mod.urlName] ?? 0;
                  // Les mods de valeur ont un prix élevé (>12 pl)
                  const isValuable = price >= 12;

                  return (
                    <tr key={mod.urlName}>
                      <td style={{ fontWeight: 600, color: isValuable ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        {mod.name}
                      </td>
                      <td>
                        <span className="badge badge-purple">{mod.category}</span>
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>
                        4.17% (1/24)
                      </td>
                      <td>
                        <span className={`plat-price ${isValuable ? 'plat-price-gold' : ''}`} style={{ fontWeight: 600 }}>
                          <PlatinumIcon size={12} style={{ marginRight: "3px" }} />
                          {price}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px 0",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  header: {
    marginBottom: "0",
  },
  subtitle: {
    color: "var(--text-secondary)",
    marginTop: "8px",
    fontSize: "16px",
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
    alignItems: "start",
  },
  summaryCard: {
    padding: "24px",
  },
  summaryTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  statBox: {
    backgroundColor: "var(--bg-color)",
    border: "1px solid var(--panel-border)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  statBoxHighlight: {
    backgroundColor: "rgba(0, 162, 255, 0.05)",
    border: "1px solid rgba(0, 162, 255, 0.2)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  statLabel: {
    fontSize: "12px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  statLabelHighlight: {
    fontSize: "12px",
    color: "var(--accent-blue)",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
  },
  statValueHighlight: {
    fontSize: "26px",
    fontWeight: 800,
  },
  statSub: {
    fontSize: "12px",
    color: "var(--text-muted)",
  },
  statSubHighlight: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  controlBox: {
    backgroundColor: "var(--bg-color)",
    border: "1px solid var(--panel-border)",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "24px",
  },
  label: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    display: "block",
    marginBottom: "12px",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  slider: {
    flexGrow: 1,
    accentColor: "var(--accent-blue)",
    height: "6px",
    borderRadius: "3px",
    cursor: "pointer",
  },
  runTimeValue: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--accent-blue)",
    width: "70px",
    textAlign: "right",
  },
  infoBox: {
    backgroundColor: "var(--bg-color)",
    border: "1px solid var(--panel-border)",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
  },
  tableCard: {
    padding: "24px",
  },
  tableTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  filterRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  filterBtn: {
    border: "1px solid transparent",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  }
};

if (typeof window !== "undefined" && window.innerWidth > 992) {
  styles.mainLayout.gridTemplateColumns = "1fr 1.3fr";
}
