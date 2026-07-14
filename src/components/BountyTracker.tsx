import React, { useState } from "react";
import { SYNDICATES, type Syndicate } from "../services/relicData";
import { calculateSyndicateConversion } from "../utils/calculations";

interface BountyTrackerProps {
  prices: Record<string, number>;
  refreshPrice: (urlName: string) => Promise<number>;
}

export const BountyTracker: React.FC<BountyTrackerProps> = ({ prices, refreshPrice }) => {
  const [selectedSyndicate, setSelectedSyndicate] = useState<Syndicate>(SYNDICATES[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("Tous");

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    for (const item of selectedSyndicate.exchangeItems) {
      await refreshPrice(item.urlName);
    }
    setIsRefreshing(false);
  };

  // Calculer la conversion pour tous les syndicats
  const syndicatesWithConversion = SYNDICATES.map((syndicate) => {
    const conversion = calculateSyndicateConversion(syndicate, prices);
    return {
      syndicate,
      ...conversion
    };
  });

  // Trier par ratio (PL pour 10k points) décroissant
  syndicatesWithConversion.sort((a, b) => b.ratio1k - a.ratio1k);

  // Filtrer la liste
  const filteredSyndicates = syndicatesWithConversion.filter((item) => 
    filterCategory === "Tous" || item.syndicate.category === filterCategory
  );

  const activeSyndicateObj = syndicatesWithConversion.find(
    (s) => s.syndicate.id === selectedSyndicate.id
  ) || syndicatesWithConversion[0];

  const activeSyndicate = activeSyndicateObj.syndicate;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 className="title-grad-purple glow-gold">Comparateur de Syndicats & Réputations</h1>
        <p style={styles.subtitle}>
          Comparez le taux de conversion en platines de vos points de réputation à travers tous les syndicats du jeu.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterRow}>
        {["Tous", "Classique", "Monde Ouvert"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              ...styles.filterBtn,
              borderColor: filterCategory === cat ? "var(--accent-gold)" : "rgba(0,0,0,0.05)",
              background: filterCategory === cat ? "rgba(166, 124, 55, 0.08)" : "var(--panel-bg)",
              color: filterCategory === cat ? "var(--accent-gold)" : "var(--text-secondary)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={styles.mainLayout}>
        {/* Left Column: All Syndicates Table */}
        <div className="glass-panel" style={styles.tableCard}>
          <h3 style={styles.sectionTitle}>Classement des Syndicats</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Syndicat</th>
                  <th>Catégorie</th>
                  <th>Meilleur Item</th>
                  <th>PL pour 10k Pts</th>
                  <th>Max Standing (132k)</th>
                </tr>
              </thead>
              <tbody>
                {filteredSyndicates.map((item) => {
                  const isSelected = activeSyndicate.id === item.syndicate.id;
                  
                  return (
                    <tr
                      key={item.syndicate.id}
                      onClick={() => setSelectedSyndicate(item.syndicate)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected ? "rgba(166,124,55,0.04)" : "transparent"
                      }}
                    >
                      <td style={{ fontWeight: 700, color: isSelected ? "var(--accent-gold)" : "var(--text-primary)" }}>
                        {item.syndicate.name.split(" (")[0]}
                      </td>
                      <td>
                        <span className={`badge ${item.syndicate.category === "Classique" ? "badge-blue" : "badge-purple"}`}>
                          {item.syndicate.category}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {item.bestItemName.split(" (")[0]}
                      </td>
                      <td>
                        <span className="plat-price plat-price-gold" style={{ fontWeight: 700 }}>
                          {item.ratio1k.toFixed(1)} PL
                        </span>
                      </td>
                      <td className="plat-price">
                        {Math.round(item.evMaxStanding)} PL
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Syndicate Detail Panel */}
        <div className="glass-panel" style={styles.summaryCard}>
          <div style={styles.summaryTitleRow}>
            <div>
              <h2 className="title-grad-gold" style={{ fontSize: "18px" }}>
                {activeSyndicate.name}
              </h2>
              <div style={{ marginTop: "4px" }}>
                <span className={`badge ${activeSyndicate.category === "Classique" ? "badge-blue" : "badge-purple"}`}>
                  {activeSyndicate.category}
                </span>
              </div>
            </div>
            <button
              className="btn btn-secondary"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              style={{ padding: "8px 12px", fontSize: "11px" }}
            >
              {isRefreshing ? "Chargement..." : "🔄 Actualiser"}
            </button>
          </div>

          {/* Quick Stats Box */}
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Meilleur Ratio de Conversion</span>
            <span style={styles.statValue}>
              {activeSyndicateObj.bestItemName.split(" (")[0]}
            </span>
            <span className="plat-price plat-price-gold" style={{ fontSize: "20px", fontWeight: 800, marginTop: "8px" }}>
              {activeSyndicateObj.ratio1k.toFixed(1)} PL <span style={{ fontSize: "11px", fontWeight: "normal", color: "var(--text-muted)" }}>/ 10k points</span>
            </span>
          </div>

          <h4 style={{ ...styles.sectionTitle, marginTop: "20px" }}>Boutique de Récompenses</h4>
          <div className="table-container" style={{ marginTop: "8px" }}>
            <table className="data-table" style={{ fontSize: "12px" }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Coût</th>
                  <th>Prix</th>
                  <th>PL/10k Pts</th>
                </tr>
              </thead>
              <tbody>
                {activeSyndicate.exchangeItems.map((item) => {
                  const price = prices[item.urlName] ?? 0;
                  const ratio10k = (price / item.cost) * 10000;
                  const isBest = item.name === activeSyndicateObj.bestItemName;

                  return (
                    <tr key={item.urlName} style={{ backgroundColor: isBest ? "rgba(166,124,55,0.03)" : "transparent" }}>
                      <td style={{ fontWeight: 600, color: isBest ? "var(--accent-gold)" : "var(--text-primary)" }}>
                        {item.name.split(" (")[0]} {isBest && "⭐"}
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>{item.cost}</td>
                      <td>
                        <span className="plat-price plat-price-gold" style={{ fontWeight: 600 }}>
                          {price} PL
                        </span>
                      </td>
                      <td>
                        <span className="plat-price" style={{ color: "var(--text-secondary)" }}>
                          {ratio10k.toFixed(1)} PL
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
    marginBottom: "24px",
  },
  subtitle: {
    color: "var(--text-secondary)",
    marginTop: "4px",
    fontSize: "14px",
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    backgroundColor: "#ffffff",
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid var(--panel-border)",
    width: "fit-content",
  },
  filterBtn: {
    border: "1px solid transparent",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
    alignItems: "start",
  },
  summaryCard: {
    padding: "24px",
    border: "1px solid var(--panel-border)"
  },
  summaryTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  statBox: {
    backgroundColor: "#faf9f6",
    border: "1px solid var(--panel-border)",
    padding: "16px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  statLabel: {
    fontSize: "10px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  statValue: {
    fontSize: "14px",
    fontWeight: 700,
    marginTop: "4px",
    color: "var(--text-primary)",
  },
  tableCard: {
    padding: "24px",
    border: "1px solid var(--panel-border)"
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "12px",
  }
};

if (typeof window !== "undefined" && window.innerWidth > 992) {
  styles.mainLayout.gridTemplateColumns = "1.3fr 1fr";
}
