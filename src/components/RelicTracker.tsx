import React, { useState } from "react";
import { RELICS, type Relic } from "../services/relicData";
import { calculateSoloEV, calculateRadshareEV } from "../utils/calculations";

interface RelicTrackerProps {
  prices: Record<string, number>;
  refreshPrice: (urlName: string) => Promise<number>;
}

export const RelicTracker: React.FC<RelicTrackerProps> = ({ prices, refreshPrice }) => {
  const [hideVaulted, setHideVaulted] = useState<boolean>(true);
  const [selectedRelic, setSelectedRelic] = useState<Relic>(RELICS[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtrer les reliques selon le statut
  const visibleRelics = RELICS.filter((relic) => !hideVaulted || relic.status !== "Vaulted");

  // Sécurité si la relique sélectionnée a été filtrée
  const activeRelic = visibleRelics.some((r) => r.name === selectedRelic.name)
    ? selectedRelic
    : visibleRelics[0] || RELICS[0];

  const selectRelic = (relic: Relic) => {
    setSelectedRelic(relic);
  };

  // Rafraîchir tous les prix de la relique sélectionnée
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    for (const drop of activeRelic.drops) {
      if (drop.urlName !== "forma_blueprint") {
        await refreshPrice(drop.urlName);
      }
    }
    setIsRefreshing(false);
  };

  // Calculer les EVs
  const soloIntactEV = calculateSoloEV(activeRelic, "intact", prices);
  const soloRadiantEV = calculateSoloEV(activeRelic, "radiant", prices);
  const radshareRadiantEV = calculateRadshareEV(activeRelic, prices);

  const runTimeMin = 4;
  const radsharePLHour = Math.round(radshareRadiantEV * (60 / runTimeMin));
  const soloRadiantPLHour = Math.round(soloRadiantEV * (60 / runTimeMin));
  const soloIntactPLHour = Math.round(soloIntactEV * (60 / runTimeMin));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 className="title-grad-gold glow-gold">Calculateur de Reliques</h1>
        <p style={styles.subtitle}>
          Comparez l'espérance de gain en platines en Solo et en Partage de Reliques éclatantes (Radshare).
        </p>
      </div>

      {/* Filter and Option Controls */}
      <div style={styles.controlsRow}>
        <label className="checkbox-container">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={hideVaulted}
            onChange={(e) => setHideVaulted(e.target.checked)}
          />
          Masquer les reliques vaultées (Non farmables en jeu)
        </label>
      </div>

      {/* Relic Selector Tabs */}
      <div style={styles.selectorContainer}>
        {visibleRelics.map((relic) => {
          const isSelected = activeRelic.name === relic.name;
          const statusBadgeColor =
            relic.status === "Unvaulted" ? "badge-success" :
            relic.status === "Resurgence" ? "badge-gold" :
            "badge-purple";

          return (
            <button
              key={`${relic.era}-${relic.name}`}
              className="glass-panel"
              onClick={() => selectRelic(relic)}
              style={{
                ...styles.selectorTab,
                borderColor: isSelected ? "var(--accent-gold)" : "var(--panel-border)",
                background: isSelected ? "rgba(166, 124, 55, 0.06)" : "var(--panel-bg)",
                color: isSelected ? "var(--accent-gold)" : "var(--text-primary)",
              }}
            >
              <div style={styles.tabBadgeRow}>
                <span style={styles.eraBadge}>{relic.era}</span>
                <span className={`badge ${statusBadgeColor}`} style={{ fontSize: "8px", padding: "1px 4px" }}>
                  {relic.status === "Unvaulted" ? "Farmable" : relic.status === "Resurgence" ? "Aya" : "Vaulted"}
                </span>
              </div>
              <span style={styles.relicName}>{relic.name}</span>
            </button>
          );
        })}
      </div>

      <div style={styles.mainLayout}>
        {/* Left column: Summary & Comparison */}
        <div className="glass-panel" style={styles.summaryCard}>
          <div style={styles.summaryTitleRow}>
            <div>
              <h2 className="title-grad-gold" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                Relique {activeRelic.era} {activeRelic.name}
              </h2>
              <span
                className={`badge ${
                  activeRelic.status === "Unvaulted" ? "badge-success" :
                  activeRelic.status === "Resurgence" ? "badge-gold" :
                  "badge-purple"
                }`}
                style={{ marginLeft: "12px" }}
              >
                {activeRelic.status === "Unvaulted" ? "Farmable (Active)" : 
                 activeRelic.status === "Resurgence" ? "Prime Resurgence (Aya)" : 
                 "Vaultée (Non farmable)"}
              </span>
            </div>
            <button
              className="btn btn-secondary"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              style={{ padding: "8px 12px", fontSize: "12px" }}
            >
              {isRefreshing ? "Chargement..." : "🔄 Actualiser Prix"}
            </button>
          </div>

          <div style={styles.evGrid}>
            <div style={styles.evItem}>
              <span style={styles.evLabel}>Solo (Intact)</span>
              <span className="plat-price" style={styles.evValue}>
                {soloIntactEV.toFixed(1)} PL
              </span>
              <span style={styles.evSub}>~ {soloIntactPLHour} PL / h</span>
            </div>

            <div style={styles.evItem}>
              <span style={styles.evLabel}>Solo (Éclatant)</span>
              <span className="plat-price" style={styles.evValue}>
                {soloRadiantEV.toFixed(1)} PL
              </span>
              <span style={styles.evSub}>~ {soloRadiantPLHour} PL / h</span>
            </div>

            <div style={styles.evItemHighlight}>
              <span style={styles.evLabelHighlight}>Radshare 4x (Éclatant)</span>
              <span className="plat-price plat-price-gold" style={styles.evValueHighlight}>
                {radshareRadiantEV.toFixed(1)} PL
              </span>
              <span style={styles.evSubHighlight}>~ {radsharePLHour} PL / h</span>
            </div>
          </div>

          <div style={styles.infoBox}>
            <p>
              💡 <strong>Règle de calcul Radshare :</strong> En groupe de 4 joueurs avec des reliques éclatantes identiques, l'espérance mathématique prend en compte que vous sélectionnez toujours la récompense la plus chère disponible parmi les 4 tirages indépendants.
            </p>
          </div>
        </div>

        {/* Right column: Drops Details Table */}
        <div className="glass-panel" style={styles.tableCard}>
          <h3 style={styles.sectionTitle}>Table des Récompenses & Prix Actuels</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Récompense</th>
                  <th>Rareté</th>
                  <th>Probabilité (Intact / Radiant)</th>
                  <th>Prix Unitaire</th>
                </tr>
              </thead>
              <tbody>
                {activeRelic.drops.map((drop) => {
                  const price = prices[drop.urlName] ?? 0;
                  const isForma = drop.urlName === "forma_blueprint";
                  
                  const probIntact = drop.rarity === "rare" ? "2.0%" : drop.rarity === "uncommon" ? "11.0%" : "25.3%";
                  const probRadiant = drop.rarity === "rare" ? "10.0%" : drop.rarity === "uncommon" ? "20.0%" : "16.7%";
                  
                  const rarityBadgeClass =
                    drop.rarity === "rare" ? "badge-gold" :
                    drop.rarity === "uncommon" ? "badge-blue" :
                    "badge-purple";

                  return (
                    <tr key={drop.urlName}>
                      <td style={{ fontWeight: 600 }}>{drop.name}</td>
                      <td>
                        <span className={`badge ${rarityBadgeClass}`}>{drop.rarity}</span>
                      </td>
                      <td>
                        <span style={{ color: "var(--text-secondary)" }}>{probIntact}</span>
                        <span style={{ color: "var(--text-muted)", margin: "0 6px" }}>/</span>
                        <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>{probRadiant}</span>
                      </td>
                      <td>
                        {isForma ? (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Non échangeable</span>
                        ) : (
                          <span className="plat-price plat-price-gold" style={{ fontWeight: 600 }}>
                            {price} PL
                          </span>
                        )}
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
  header: {
    marginBottom: "24px",
  },
  subtitle: {
    color: "var(--text-secondary)",
    marginTop: "8px",
    fontSize: "16px",
  },
  controlsRow: {
    marginBottom: "20px",
    backgroundColor: "#ffffff",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid var(--panel-border)",
    display: "inline-flex",
  },
  selectorContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  selectorTab: {
    flex: "1 1 180px",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    borderWidth: "1px",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  },
  tabBadgeRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: "6px",
  },
  eraBadge: {
    fontSize: "11px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  relicName: {
    fontSize: "18px",
    fontWeight: 700,
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
  evGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  evItem: {
    backgroundColor: "#faf9f6",
    border: "1px solid var(--panel-border)",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  evItemHighlight: {
    backgroundColor: "rgba(166, 124, 55, 0.05)",
    border: "1px solid rgba(166, 124, 55, 0.25)",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  evLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  evLabelHighlight: {
    fontSize: "11px",
    color: "var(--accent-gold)",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  evValue: {
    fontSize: "22px",
    fontWeight: 700,
  },
  evValueHighlight: {
    fontSize: "24px",
    fontWeight: 800,
  },
  evSub: {
    fontSize: "13px",
    color: "var(--text-secondary)",
  },
  evSubHighlight: {
    fontSize: "14px",
    color: "var(--text-primary)",
    fontWeight: 500,
  },
  infoBox: {
    backgroundColor: "#faf9f6",
    border: "1px solid var(--panel-border)",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "12px",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
  },
  tableCard: {
    padding: "24px",
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "16px",
  }
};

if (typeof window !== "undefined" && window.innerWidth > 992) {
  styles.mainLayout.gridTemplateColumns = "1fr 1.3fr";
}
