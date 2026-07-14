import React, { useState } from "react";
import { EIDOLON_ARCANES } from "../services/relicData";
import { calculateEidolonEV } from "../utils/calculations";
import { PlatinumIcon } from "./Icons";

interface EidolonTrackerProps {
  prices: Record<string, number>;
  refreshPrice: (urlName: string) => Promise<number>;
}

export const EidolonTracker: React.FC<EidolonTrackerProps> = ({ prices, refreshPrice }) => {
  const [capturesPerCycle, setCapturesPerCycle] = useState<number>(4); // Par défaut 4x3 (4 captures en 50 minutes)
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    // On rassemble tous les arcanes uniques pour ne pas double-charger
    const uniqueArcanes = new Set<string>();
    Object.values(EIDOLON_ARCANES).forEach(list => {
      list.forEach(arcane => uniqueArcanes.add(arcane.urlName));
    });

    for (const urlName of uniqueArcanes) {
      await refreshPrice(urlName);
    }
    setIsRefreshing(false);
  };

  const evPerTridolon = calculateEidolonEV(prices);
  // Un cycle de nuit dure 50 minutes réelles dans les Plaines d'Eidolon
  const plPerNightCycle = Math.round(evPerTridolon * capturesPerCycle);
  const plPerHour = Math.round(evPerTridolon * (capturesPerCycle * 1.2)); // 50 mins = 1 cycle. 1 heure = 1.2 cycles.

  // Regrouper les arcanes pour affichage
  const allArcanes = [
    ...EIDOLON_ARCANES.teralyst.map(a => ({ ...a, source: "Teralyst" })),
    ...EIDOLON_ARCANES.gantulyst.filter(a => !EIDOLON_ARCANES.teralyst.some(t => t.urlName === a.urlName)).map(a => ({ ...a, source: "Gantulyst" })),
    ...EIDOLON_ARCANES.hydrolyst.filter(a => !EIDOLON_ARCANES.gantulyst.some(g => g.urlName === a.urlName) && !EIDOLON_ARCANES.teralyst.some(t => t.urlName === a.urlName)).map(a => ({ ...a, source: "Hydrolyst" }))
  ];

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.header}>
          <h1 className="title-grad-purple glow-purple">Calculateur d'Eidolons</h1>
          <p style={styles.subtitle}>
            Estimez vos gains de chasse aux Eidolons basés sur la rareté et les prix des Arcanes sur Warframe.market.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          style={{ padding: "10px 16px", alignSelf: "center" }}
        >
          {isRefreshing ? "Chargement..." : "🔄 Actualiser les Eidolons"}
        </button>
      </div>

      <div style={styles.mainLayout}>
        {/* Left Column: Summary */}
        <div className="glass-panel" style={styles.summaryCard}>
          <div style={styles.summaryTitleRow}>
            <h2 className="title-grad-purple">Rentabilité de la Chasse</h2>
          </div>

          <div style={styles.statGrid}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>EV par Run Tridolon (1x3)</span>
              <span className="plat-price" style={styles.statValue}>
                <PlatinumIcon size={16} style={{ marginRight: "4px" }} />
                {evPerTridolon.toFixed(1)}
              </span>
              <span style={styles.statSub}>1 Arcane par Eidolon capturé</span>
            </div>

            <div style={styles.statBoxHighlight}>
              <span style={styles.statLabelHighlight}>Gains par Nuit (50 min)</span>
              <span className="plat-price plat-price-gold" style={styles.statValueHighlight}>
                <PlatinumIcon size={18} style={{ marginRight: "6px" }} />
                {plPerNightCycle}
              </span>
              <span style={styles.statSubHighlight}>~ <PlatinumIcon size={11} style={{ marginRight: "3px" }} />{plPerHour} / heure</span>
            </div>
          </div>

          <div style={styles.controlBox}>
            <label style={styles.label}>
              ⚔️ Rythme de Chasse (Nombre de Tridolons par cycle de Nuit) :
            </label>
            <div style={styles.buttonRow}>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setCapturesPerCycle(num)}
                  style={{
                    ...styles.controlBtn,
                    borderColor: capturesPerCycle === num ? "var(--accent-purple)" : "var(--panel-border)",
                    background: capturesPerCycle === num ? "rgba(138, 43, 226, 0.1)" : "var(--bg-color)",
                    color: capturesPerCycle === num ? "var(--accent-purple)" : "var(--text-secondary)"
                  }}
                >
                  {num}x3
                </button>
              ))}
            </div>
            <span style={styles.helperText}>
              {capturesPerCycle === 1 && "Débutant : 1 Tridolon en 50 minutes (solo ou groupe public)."}
              {capturesPerCycle === 2 && "Intermédiaire : 2 Tridolons en 50 minutes."}
              {capturesPerCycle === 3 && "Bon niveau : 3 Tridolons en 50 minutes."}
              {capturesPerCycle === 4 && "Avancé : 4 Tridolons en 50 minutes (équipe coordonnée)."}
              {capturesPerCycle === 5 && "Expert : 5 Tridolons en 50 minutes (compos optimisées)."}
              {capturesPerCycle === 6 && "Légendaire : 6 Tridolons en 50 minutes (speedrunners)."}
            </span>
          </div>

          <div style={styles.infoBox}>
            <p>
              🌟 <strong>Probabilités Clés :</strong>
              <br />- <strong>Hydrolyst :</strong> Donne 5% de chances d'obtenir <em>Arcane Energize</em> (le plus cher du jeu), 5% pour <em>Arcane Grace</em> et 5% pour <em>Arcane Barrier</em>.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Arcanes Table */}
        <div className="glass-panel" style={styles.tableCard}>
          <h3 style={styles.sectionTitle}>Prix Actuels des Arcanes Majeurs</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Arcane</th>
                  <th>Source Majeure</th>
                  <th>Rareté</th>
                  <th>Prix Actuel</th>
                </tr>
              </thead>
              <tbody>
                {allArcanes.map((arcane) => {
                  const price = prices[arcane.urlName] ?? 0;
                  const isEnergize = arcane.urlName === "arcane_energize";
                  
                  const rarityBadgeClass =
                    arcane.rarity === "rare" ? "badge-gold" :
                    arcane.rarity === "uncommon" ? "badge-blue" :
                    "badge-purple";

                  return (
                    <tr key={arcane.urlName}>
                      <td style={{ fontWeight: 600, color: isEnergize ? "var(--accent-gold)" : "var(--text-primary)" }}>
                        {arcane.name}
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>
                        {arcane.source}
                      </td>
                      <td>
                        <span className={`badge ${rarityBadgeClass}`}>{arcane.rarity}</span>
                      </td>
                      <td>
                        <span className={`plat-price ${isEnergize ? 'plat-price-gold' : ''}`} style={{ fontWeight: 600 }}>
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
    backgroundColor: "rgba(138, 43, 226, 0.05)",
    border: "1px solid rgba(138, 43, 226, 0.2)",
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
    color: "var(--accent-purple)",
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
  buttonRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  controlBtn: {
    flex: "1 1 50px",
    border: "1px solid transparent",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  helperText: {
    fontSize: "13px",
    color: "var(--text-muted)",
    fontStyle: "italic",
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
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "16px",
  }
};

if (typeof window !== "undefined" && window.innerWidth > 992) {
  styles.mainLayout.gridTemplateColumns = "1fr 1.3fr";
}
