import React, { useState } from "react";
import { SYNDICATE_BOUNTIES, type SyndicateBounty } from "../services/relicData";
import { calculateBountyEV } from "../utils/calculations";

interface BountyTrackerProps {
  prices: Record<string, number>;
  refreshPrice: (urlName: string) => Promise<number>;
}

export const BountyTracker: React.FC<BountyTrackerProps> = ({ prices, refreshPrice }) => {
  const [selectedBounty, setSelectedBounty] = useState<SyndicateBounty>(SYNDICATE_BOUNTIES[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    // On actualise les prix des arcanes échangeables
    for (const arcane of selectedBounty.exchangeArcanes) {
      await refreshPrice(arcane.urlName);
    }
    // On actualise les drops directs
    for (const drop of selectedBounty.directDrops) {
      await refreshPrice(drop.urlName);
    }
    setIsRefreshing(false);
  };

  const { totalEV, standingEV, dropsEV } = calculateBountyEV(selectedBounty, prices);
  const plPerHour = Math.round(totalEV * (60 / selectedBounty.runTimeMinutes));

  // Trouver l'arcane le plus rentable à acheter
  let bestArcaneToBuy = selectedBounty.exchangeArcanes[0];
  let bestArcaneRatio = 0;
  selectedBounty.exchangeArcanes.forEach((arcane) => {
    const price = prices[arcane.urlName] ?? 0;
    const ratio = price / arcane.cost;
    if (ratio > bestArcaneRatio) {
      bestArcaneRatio = ratio;
      bestArcaneToBuy = arcane;
    }
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 className="title-grad-purple glow-purple">Farming de Contrats de Syndicat</h1>
        <p style={styles.subtitle}>
          Calculez la rentabilité des missions du Zariman et du Cavia en combinant les récompenses de réputation et les taux de drop directs.
        </p>
      </div>

      {/* Syndicate Selector */}
      <div style={styles.selectorContainer}>
        {SYNDICATE_BOUNTIES.map((bounty) => (
          <button
            key={bounty.name}
            className="glass-panel"
            onClick={() => setSelectedBounty(bounty)}
            style={{
              ...styles.selectorTab,
              borderColor: selectedBounty.name === bounty.name ? "var(--accent-purple)" : "var(--panel-border)",
              background: selectedBounty.name === bounty.name ? "rgba(171, 71, 188, 0.08)" : "var(--panel-bg)",
              color: selectedBounty.name === bounty.name ? "var(--accent-purple)" : "var(--text-primary)",
            }}
          >
            <span style={styles.relicName}>{bounty.name.split(" (")[0]}</span>
            <span style={styles.eraBadge}>{bounty.name.includes("Zariman") ? "Holdfasts" : "Cavia"}</span>
          </button>
        ))}
      </div>

      <div style={styles.mainLayout}>
        {/* Left Column: Summary */}
        <div className="glass-panel" style={styles.summaryCard}>
          <div style={styles.summaryTitleRow}>
            <h2 className="title-grad-purple">Analyse du Contrat</h2>
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
              <span style={styles.statLabel}>EV Totale par Run</span>
              <span className="plat-price plat-price-gold" style={styles.statValue}>
                {totalEV.toFixed(1)} PL
              </span>
              <span style={styles.statSub}>
                Réput : {standingEV.toFixed(1)} PL | Drops : {dropsEV.toFixed(1)} PL
              </span>
            </div>

            <div style={styles.statBoxHighlight}>
              <span style={styles.statLabelHighlight}>Gains Horaires Estimés</span>
              <span className="plat-price plat-price-gold" style={styles.statValueHighlight}>
                {plPerHour} <span style={{ fontSize: "14px", fontWeight: "normal" }}>PL / h</span>
              </span>
              <span style={styles.statSubHighlight}>⏱️ Basé sur {selectedBounty.runTimeMinutes} min / run</span>
            </div>
          </div>

          <div style={styles.bestExchangeBox}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              💡 Stratégie de Réputation recommandée
            </span>
            <p style={{ marginTop: "8px", fontSize: "14px", lineHeight: "1.5" }}>
              Achetez l'arcane <strong>{bestArcaneToBuy.name}</strong> chez le marchand du syndicat. 
              Avec un prix actuel de <strong>{prices[bestArcaneToBuy.urlName] ?? 0} PL</strong> pour un coût de {bestArcaneToBuy.cost} points, 
              cela offre le meilleur ratio de conversion : 
              <strong style={{ color: "var(--accent-purple)", marginLeft: "4px" }}>
                {((prices[bestArcaneToBuy.urlName] ?? 0) / bestArcaneToBuy.cost * 1000).toFixed(2)} PL pour 1k Réput
              </strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Rewards details */}
        <div className="glass-panel" style={styles.tableCard}>
          <h3 style={styles.sectionTitle}>Boutique de Réputation & Drops Directs</h3>
          
          <h4 style={styles.subSectionTitle}>Arcanes Échangeables</h4>
          <div className="table-container" style={{ marginBottom: "24px" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Arcane</th>
                  <th>Coût Réputation</th>
                  <th>Prix Actuel</th>
                  <th>Valeur pour 10k points</th>
                </tr>
              </thead>
              <tbody>
                {selectedBounty.exchangeArcanes.map((arcane) => {
                  const price = prices[arcane.urlName] ?? 0;
                  const value10k = (price / arcane.cost) * 10000;
                  const isBest = arcane.urlName === bestArcaneToBuy.urlName;

                  return (
                    <tr key={arcane.urlName} style={{ backgroundColor: isBest ? "rgba(171,71,188,0.03)" : "transparent" }}>
                      <td style={{ fontWeight: 600, color: isBest ? "var(--accent-purple)" : "var(--text-primary)" }}>
                        {arcane.name} {isBest && "⭐"}
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>{arcane.cost}</td>
                      <td>
                        <span className="plat-price plat-price-gold" style={{ fontWeight: 600 }}>
                          {price} PL
                        </span>
                      </td>
                      <td>
                        <span className="plat-price" style={{ color: "var(--text-secondary)" }}>
                          {value10k.toFixed(1)} PL
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h4 style={styles.subSectionTitle}>Drops Directs Estimés</h4>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Drop</th>
                  <th>Taux de Drop estimé</th>
                  <th>Prix Actuel</th>
                  <th>EV Partielle</th>
                </tr>
              </thead>
              <tbody>
                {selectedBounty.directDrops.map((drop) => {
                  const price = prices[drop.urlName] ?? 0;
                  const partialEV = drop.chance * price;

                  return (
                    <tr key={drop.urlName}>
                      <td style={{ fontWeight: 600 }}>{drop.name}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{(drop.chance * 100).toFixed(0)}%</td>
                      <td>
                        <span className="plat-price plat-price-gold" style={{ fontWeight: 600 }}>
                          {price} PL
                        </span>
                      </td>
                      <td>
                        <span className="plat-price" style={{ color: "var(--text-secondary)" }}>
                          {partialEV.toFixed(1)} PL
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
  header: {
    marginBottom: "32px",
  },
  subtitle: {
    color: "var(--text-secondary)",
    marginTop: "8px",
    fontSize: "16px",
  },
  selectorContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  selectorTab: {
    flex: "1 1 200px",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    borderWidth: "1px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
  },
  eraBadge: {
    fontSize: "12px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  relicName: {
    fontSize: "18px",
    fontWeight: 700,
    marginTop: "4px",
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
    backgroundColor: "rgba(0,0,0,0.15)",
    border: "1px solid rgba(255,255,255,0.03)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  statBoxHighlight: {
    backgroundColor: "rgba(171, 71, 188, 0.05)",
    border: "1px solid rgba(171, 71, 188, 0.2)",
    boxShadow: "0 0 15px rgba(171, 71, 188, 0.05)",
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
    textAlign: "center",
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
  bestExchangeBox: {
    backgroundColor: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "12px",
    padding: "16px",
  },
  tableCard: {
    padding: "24px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "20px",
  },
  subSectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: "12px",
  }
};

if (typeof window !== "undefined" && window.innerWidth > 992) {
  styles.mainLayout.gridTemplateColumns = "1fr 1.3fr";
}
