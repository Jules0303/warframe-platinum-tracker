import React, { useState } from "react";
import { RELICS, type Relic } from "../services/relicData";
import { calculateSoloEV, calculateRadshareEV } from "../utils/calculations";
import { PlatinumIcon, RelicIcon } from "./Icons";

interface RelicTrackerProps {
  prices: Record<string, number>;
  refreshPrice: (urlName: string) => Promise<number>;
}

export const RelicTracker: React.FC<RelicTrackerProps> = ({ prices, refreshPrice }) => {
  const [hideVaulted, setHideVaulted] = useState<boolean>(true);
  const [selectedRelic, setSelectedRelic] = useState<Relic>(RELICS[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);

  const selectRelic = (relic: Relic) => setSelectedRelic(relic);

  const handleRefreshAllRelics = async () => {
    setIsRefreshingAll(true);
    const uniqueItems = new Set<string>();
    visibleRelics.forEach((relic) => {
      relic.drops.forEach((drop) => {
        if (drop.urlName !== "forma_blueprint") {
          uniqueItems.add(drop.urlName);
        }
      });
    });
    for (const urlName of uniqueItems) {
      await refreshPrice(urlName);
    }
    setIsRefreshingAll(false);
  };

  // Filtrer les reliques selon la recherche et le statut vaulted
  const visibleRelics = RELICS.filter((relic) => {
    const matchesSearch = 
      relic.era.toLowerCase().includes(searchQuery.toLowerCase()) || 
      relic.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVaulted = !hideVaulted || relic.status !== "Vaulted";
    return matchesSearch && matchesVaulted;
  });

  // Calculer l'EV Radshare de chaque relique visible pour les classer
  const relicsWithEV = visibleRelics.map((relic) => {
    const evRadshare = calculateRadshareEV(relic, prices);
    const evSoloRadiant = calculateSoloEV(relic, "radiant", prices);
    const evSoloIntact = calculateSoloEV(relic, "intact", prices);
    return {
      relic,
      evRadshare,
      evSoloRadiant,
      evSoloIntact
    };
  });

  // Trier les reliques par EV Radshare décroissant
  relicsWithEV.sort((a, b) => b.evRadshare - a.evRadshare);

  // Top 5 des meilleures reliques
  const top5Relics = relicsWithEV.slice(0, 5);

  const activeRelicObj = relicsWithEV.find((r) => r.relic.name === selectedRelic.name) || relicsWithEV[0] || {
    relic: RELICS[0],
    evRadshare: 0,
    evSoloRadiant: 0,
    evSoloIntact: 0
  };

  const activeRelic = activeRelicObj.relic;

  // Rafraîchir tous les prix de la relique active
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    for (const drop of activeRelic.drops) {
      if (drop.urlName !== "forma_blueprint") {
        await refreshPrice(drop.urlName);
      }
    }
    setIsRefreshing(false);
  };

  const runTimeMin = 4; // 4 minutes par run fissure

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.header}>
          <h1 className="title-grad-gold glow-gold">Calculateur de Reliques</h1>
          <p style={styles.subtitle}>
            Identifiez les reliques les plus rentables du marché et comparez les espérances de gains (EV).
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleRefreshAllRelics}
          disabled={isRefreshingAll}
          style={{ padding: "10px 16px", alignSelf: "center" }}
        >
          {isRefreshingAll ? "Chargement..." : "🔄 Actualiser toutes les Reliques"}
        </button>
      </div>

      {/* Control Panel: Hide Vaulted & Search */}
      <div style={styles.controlPanel} className="glass-panel">
        <label className="checkbox-container">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={hideVaulted}
            onChange={(e) => setHideVaulted(e.target.checked)}
          />
          Masquer les reliques vaultées (Non farmables en jeu)
        </label>
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher par ère ou nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* TOP 5 Section */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={styles.sectionHeading}>🔥 Top 5 des Reliques les plus Rentables (Radshare)</h3>
        <div style={styles.top5Grid}>
          {top5Relics.map((item, index) => {
            const statusBadgeColor =
              item.relic.status === "Unvaulted" ? "badge-success" :
              item.relic.status === "Resurgence" ? "badge-gold" :
              "badge-purple";
            const isSelected = activeRelic.name === item.relic.name;
            return (
              <div
                key={item.relic.name}
                onClick={() => selectRelic(item.relic)}
                className="glass-panel glass-panel-hover"
                style={{
                  ...styles.top5Card,
                  borderColor: isSelected ? "var(--accent-gold)" : "var(--panel-border)",
                  borderTop: `4px solid ${
                    item.relic.era === "Lith" ? "#4ca3dd" :
                    item.relic.era === "Meso" ? "#e09f3e" :
                    item.relic.era === "Neo" ? "#9d4edd" :
                    "#d4b26f"
                  }`,
                  background: isSelected ? "rgba(207, 167, 81, 0.05)" : "var(--panel-bg)"
                }}
              >
                <div style={styles.top5Header}>
                  <span style={styles.top5Rank}>#{index + 1}</span>
                  <span className={`badge ${statusBadgeColor}`} style={{ fontSize: "8px", padding: "1px 4px" }}>
                    {item.relic.status === "Unvaulted" ? "Farmable" : item.relic.status === "Resurgence" ? "Aya" : "Vaulted"}
                  </span>
                </div>
                <h4 style={{ ...styles.top5Title, color: 
                  item.relic.era === "Lith" ? "#4ca3dd" :
                  item.relic.era === "Meso" ? "#e09f3e" :
                  item.relic.era === "Neo" ? "#9d4edd" :
                  "#d4b26f"
                }}>
                  <RelicIcon size={14} style={{ marginRight: "4px" }} />
                  {item.relic.era} {item.relic.name}
                </h4>
                <div style={styles.top5ProfitRow}>
                  <span style={styles.top5ProfitLabel}>EV :</span>
                  <span className="plat-price plat-price-gold" style={{ fontSize: "14px", fontWeight: 700 }}>
                    <PlatinumIcon size={12} style={{ marginRight: "3px" }} />
                    {item.evRadshare.toFixed(0)}
                  </span>
                </div>
                <span style={styles.top5HourProfit}>~ {Math.round(item.evRadshare * (60 / runTimeMin))} /h</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* Left Column: All Relics Table */}
        <div className="glass-panel" style={styles.tableCard}>
          <h3 style={styles.sectionTitle}>Catalogue des Reliques</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Relique</th>
                  <th>Statut</th>
                  <th>EV Intact</th>
                  <th>EV Éclatant</th>
                  <th>EV Radshare (4x)</th>
                </tr>
              </thead>
              <tbody>
                {relicsWithEV.map((item) => {
                  const isSelected = activeRelic.name === item.relic.name;
                  const statusBadgeColor =
                    item.relic.status === "Unvaulted" ? "badge-success" :
                    item.relic.status === "Resurgence" ? "badge-gold" :
                    "badge-purple";

                  return (
                    <tr
                      key={item.relic.name}
                      onClick={() => selectRelic(item.relic)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected ? "rgba(207, 167, 81, 0.04)" : "transparent"
                      }}
                    >
                      <td style={{ fontWeight: 700, color: 
                        item.relic.era === "Lith" ? "#4ca3dd" :
                        item.relic.era === "Meso" ? "#e09f3e" :
                        item.relic.era === "Neo" ? "#9d4edd" :
                        "#d4b26f"
                      }}>
                        <RelicIcon size={14} style={{ marginRight: "6px" }} />
                        {item.relic.era} {item.relic.name}
                      </td>
                      <td>
                        <span className={`badge ${statusBadgeColor}`}>
                          {item.relic.status === "Unvaulted" ? "Farmable" : item.relic.status === "Resurgence" ? "Aya" : "Vaulted"}
                        </span>
                      </td>
                      <td className="plat-price">
                        <PlatinumIcon size={11} style={{ marginRight: "3px" }} />
                        {item.evSoloIntact.toFixed(1)}
                      </td>
                      <td className="plat-price">
                        <PlatinumIcon size={11} style={{ marginRight: "3px" }} />
                        {item.evSoloRadiant.toFixed(1)}
                      </td>
                      <td>
                        <span className="plat-price plat-price-gold" style={{ fontWeight: 700 }}>
                          <PlatinumIcon size={12} style={{ marginRight: "3px" }} />
                          {item.evRadshare.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Selected Relic Details */}
        <div className="glass-panel" style={styles.summaryCard}>
          <div style={styles.summaryTitleRow}>
            <div>
              <h2 className="title-grad-gold" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
                <RelicIcon size={18} />
                {activeRelic.era} {activeRelic.name}
              </h2>
              <div style={{ marginTop: "4px" }}>
                <span
                  className={`badge ${
                    activeRelic.status === "Unvaulted" ? "badge-success" :
                    activeRelic.status === "Resurgence" ? "badge-gold" :
                    "badge-purple"
                  }`}
                >
                  {activeRelic.status === "Unvaulted" ? "Active" : 
                   activeRelic.status === "Resurgence" ? "Resurgence" : 
                   "Vaultée"}
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

          <div style={styles.relicDetailStats}>
            <div style={styles.detailEVBox}>
              <span style={styles.detailEVLabel}>Radshare (4x)</span>
              <span className="plat-price plat-price-gold" style={styles.detailEVValue}>
                <PlatinumIcon size={16} style={{ marginRight: "4px" }} />
                {activeRelicObj.evRadshare.toFixed(1)}
              </span>
              <span style={styles.detailEVSub}>~ {Math.round(activeRelicObj.evRadshare * (60 / runTimeMin))} /h</span>
            </div>
            <div style={styles.detailEVBox}>
              <span style={styles.detailEVLabel}>Solo Éclatant</span>
              <span className="plat-price" style={{ ...styles.detailEVValue, color: "var(--text-primary)" }}>
                <PlatinumIcon size={14} style={{ marginRight: "4px" }} />
                {activeRelicObj.evSoloRadiant.toFixed(1)}
              </span>
              <span style={styles.detailEVSub}>~ {Math.round(activeRelicObj.evSoloRadiant * (60 / runTimeMin))} /h</span>
            </div>
          </div>

          <h4 style={{ ...styles.sectionTitle, marginTop: "20px" }}>Drops de la Relique</h4>
          <div className="table-container" style={{ marginTop: "8px" }}>
            <table className="data-table" style={{ fontSize: "12px" }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Rareté</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>
                {activeRelic.drops.map((drop) => {
                  const price = prices[drop.urlName] ?? 0;
                  const isForma = drop.urlName === "forma_blueprint";
                  
                  const rarityBadgeClass =
                    drop.rarity === "rare" ? "badge-gold" :
                    drop.rarity === "uncommon" ? "badge-blue" :
                    "badge-purple";

                  return (
                    <tr key={drop.urlName}>
                      <td style={{ fontWeight: 600 }}>{drop.name}</td>
                      <td>
                        <span className={`badge ${rarityBadgeClass}`} style={{ fontSize: "8px", padding: "1px 4px" }}>{drop.rarity}</span>
                      </td>
                      <td>
                        {isForma ? (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>0 PL</span>
                        ) : (
                          <span className="plat-price plat-price-gold" style={{ fontWeight: 600 }}>
                            <PlatinumIcon size={12} style={{ marginRight: "3px" }} />
                            {price}
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
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  header: {
    marginBottom: "0",
  },
  subtitle: {
    color: "var(--text-secondary)",
    marginTop: "4px",
    fontSize: "14px",
  },
  controlPanel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderRadius: "8px",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
    border: "1px solid var(--panel-border)"
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#070a0d",
    border: "1px solid var(--panel-border)",
    borderRadius: "4px",
    padding: "6px 12px",
    width: "300px",
  },
  searchIcon: {
    marginRight: "8px",
    fontSize: "13px",
  },
  searchInput: {
    border: "none",
    background: "transparent",
    outline: "none",
    width: "100%",
    fontSize: "13px",
    color: "var(--text-primary)",
  },
  sectionHeading: {
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "var(--text-secondary)",
    marginBottom: "12px",
  },
  top5Grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  top5Card: {
    padding: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.2s ease",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  top5Header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  top5Rank: {
    fontWeight: 700,
    fontSize: "12px",
    color: "var(--accent-gold)",
  },
  top5Title: {
    fontSize: "15px",
    fontWeight: 700,
    marginBottom: "12px",
  },
  top5ProfitRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  top5ProfitLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
  top5HourProfit: {
    fontSize: "11px",
    color: "var(--text-secondary)",
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
    border: "1px solid var(--panel-border)"
  },
  summaryTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  relicDetailStats: {
    display: "flex",
    gap: "12px",
  },
  detailEVBox: {
    flex: 1,
    backgroundColor: "#070a0d",
    border: "1px solid var(--panel-border)",
    padding: "12px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  detailEVLabel: {
    fontSize: "10px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  detailEVValue: {
    fontSize: "18px",
    fontWeight: 700,
    margin: "4px 0",
  },
  detailEVSub: {
    fontSize: "11px",
    color: "var(--text-secondary)",
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
