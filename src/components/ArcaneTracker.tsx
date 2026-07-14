import React, { useState } from "react";
import { ARCANES, type Arcane } from "../services/relicData";
import { PlatinumIcon } from "./Icons";

interface ArcaneTrackerProps {
  prices: Record<string, number>;
  refreshPrice: (urlName: string) => Promise<number>;
}

type SortField = "name" | "price" | "maxPrice";
type SortOrder = "asc" | "desc";

export const ArcaneTracker: React.FC<ArcaneTrackerProps> = ({ prices, refreshPrice }) => {
  const [filterSource, setFilterSource] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [sortField, setSortField] = useState<SortField>("price");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedArcane, setSelectedArcane] = useState<Arcane>(ARCANES[0]);
  const [arcaneRank, setArcaneRank] = useState<number>(5);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    const listToRefresh = ARCANES.filter(
      (a) => filterSource === "Tous" || a.source === filterSource
    );
    for (const arcane of listToRefresh) {
      await refreshPrice(arcane.urlName);
    }
    setIsRefreshing(false);
  };

  const handleRefreshAllArcanes = async () => {
    setIsRefreshingAll(true);
    for (const arcane of ARCANES) {
      await refreshPrice(arcane.urlName);
    }
    setIsRefreshingAll(false);
  };

  const handleRefreshSingle = async () => {
    setIsRefreshing(true);
    await refreshPrice(selectedArcane.urlName);
    setIsRefreshing(false);
  };

  const sources = ["Tous", "Eidolons", "Zariman", "Cavia", "Fortuna", "Cetus", "Steel Path"];

  // Filtrer les arcanes
  const filteredArcanes = ARCANES.filter((arcane) => {
    const matchesSource = filterSource === "Tous" || arcane.source === filterSource;
    const matchesSearch = arcane.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  // Mapper les prix
  const arcanesWithPrices = filteredArcanes.map((arcane) => {
    const price = prices[arcane.urlName] ?? 0;
    const maxPrice = price * 21; // 21 arcanes requis pour le rang max 5
    return {
      ...arcane,
      price,
      maxPrice
    };
  });

  // Gérer le tri
  arcanesWithPrices.sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === "name") {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Calcul du nombre de copies selon le rang de l'arcane
  // Rang 0: 1, Rang 1: 3, Rang 2: 6, Rang 3: 10, Rang 4: 15, Rang 5: 21
  const copiesRequired = [1, 3, 6, 10, 15, 21][arcaneRank] ?? 21;
  const activeArcanePrice = prices[selectedArcane.urlName] ?? 0;
  const estimatedRankPrice = activeArcanePrice * copiesRequired;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.header}>
          <h1 className="title-grad-purple glow-gold">Base de Données des Arcanes</h1>
          <p style={styles.subtitle}>
            Comparez les prix des Arcanes de toutes les activités de farm et estimez la valeur de vos arcanes selon leur rang.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleRefreshAllArcanes}
          disabled={isRefreshingAll}
          style={{ padding: "10px 16px", alignSelf: "center" }}
        >
          {isRefreshingAll ? "Chargement..." : "🔄 Actualiser tous les Arcanes"}
        </button>
      </div>

      {/* Control Panel: Filters & Search */}
      <div style={styles.controlPanel} className="glass-panel">
        <div style={styles.filterRow}>
          {sources.map((src) => (
            <button
              key={src}
              onClick={() => setFilterSource(src)}
              style={{
                ...styles.filterBtn,
                borderColor: filterSource === src ? "var(--accent-purple)" : "rgba(255,255,255,0.03)",
                background: filterSource === src ? "rgba(157, 78, 221, 0.08)" : "rgba(255,255,255,0.02)",
                color: filterSource === src ? "var(--accent-purple)" : "var(--text-secondary)",
              }}
            >
              {src}
            </button>
          ))}
        </div>
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un arcane..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* Left Column: Arcanes Table */}
        <div className="glass-panel" style={styles.tableCard}>
          <div style={styles.tableHeaderRow}>
            <h3 style={styles.sectionTitle}>Catalogue des Arcanes ({arcanesWithPrices.length})</h3>
            <button
              className="btn btn-secondary"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              style={{ padding: "8px 12px", fontSize: "11px" }}
            >
              {isRefreshing ? "Chargement..." : "🔄 Catégorie"}
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>
                    Arcane {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th>Source</th>
                  <th>Rareté</th>
                  <th onClick={() => toggleSort("price")} style={{ cursor: "pointer" }}>
                    Prix (R0) {sortField === "price" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => toggleSort("maxPrice")} style={{ cursor: "pointer" }}>
                    Rang Max (R5) {sortField === "maxPrice" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {arcanesWithPrices.map((arcane) => {
                  const isSelected = selectedArcane.urlName === arcane.urlName;
                  const isEnergize = arcane.urlName === "arcane_energize";
                  const isValuable = arcane.price >= 12;

                  const rarityBadgeClass =
                    arcane.rarity === "rare" ? "badge-gold" :
                    arcane.rarity === "uncommon" ? "badge-blue" :
                    "badge-purple";

                  return (
                    <tr
                      key={arcane.urlName}
                      onClick={() => setSelectedArcane(arcane)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected ? "rgba(157, 78, 221, 0.04)" : "transparent"
                      }}
                    >
                      <td style={{ fontWeight: 700, color: isSelected ? "var(--accent-purple)" : isEnergize ? "var(--accent-gold)" : "var(--text-primary)" }}>
                        {arcane.name}
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>{arcane.source}</td>
                      <td>
                        <span className={`badge ${rarityBadgeClass}`}>{arcane.rarity}</span>
                      </td>
                      <td>
                        <span className={`plat-price ${isValuable ? "plat-price-gold" : ""}`} style={{ fontWeight: 700 }}>
                          <PlatinumIcon size={12} style={{ marginRight: "3px" }} />
                          {arcane.price}
                        </span>
                      </td>
                      <td>
                        <span className="plat-price plat-price-gold" style={{ fontWeight: 700 }}>
                          <PlatinumIcon size={12} style={{ marginRight: "3px" }} />
                          {arcane.maxPrice}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Dynamic Rank Calculator */}
        <div className="glass-panel" style={styles.summaryCard}>
          <div style={styles.summaryTitleRow}>
            <div>
              <h2 className="title-grad-purple" style={{ fontSize: "18px" }}>
                {selectedArcane.name}
              </h2>
              <div style={{ marginTop: "4px" }}>
                <span className={`badge ${
                  selectedArcane.rarity === "rare" ? "badge-gold" :
                  selectedArcane.rarity === "uncommon" ? "badge-blue" :
                  "badge-purple"
                }`}>
                  {selectedArcane.rarity}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "12px", marginLeft: "8px" }}>
                  📍 {selectedArcane.source}
                </span>
              </div>
            </div>
            <button
              className="btn btn-secondary"
              onClick={handleRefreshSingle}
              disabled={isRefreshing}
              style={{ padding: "8px 12px", fontSize: "11px" }}
            >
              {isRefreshing ? "Chargement..." : "🔄 Actualiser"}
            </button>
          </div>

          <div style={styles.detailEVBox}>
            <span style={styles.detailEVLabel}>Prix Unitaire (R0)</span>
            <span className="plat-price plat-price-gold" style={styles.detailEVValue}>
              <PlatinumIcon size={16} style={{ marginRight: "4px" }} />
              {activeArcanePrice}
            </span>
          </div>

          <div style={styles.calculatorCard}>
            <h4 style={styles.calcTitle}>🧮 Calculateur de Rang</h4>
            
            <div style={styles.controlBox}>
              <label style={styles.label}>
                Rang de l'Arcane ciblé : <span style={styles.rankHighlight}>Rang {arcaneRank}</span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={arcaneRank}
                onChange={(e) => setArcaneRank(parseInt(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>R0</span>
                <span>R1</span>
                <span>R2</span>
                <span>R3</span>
                <span>R4</span>
                <span>R5</span>
              </div>
            </div>

            <div style={styles.calcResultBox}>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Nombre de copies :</span>
                <span style={styles.resultValue}>{copiesRequired} {copiesRequired > 1 ? "arcanes" : "arcane"}</span>
              </div>
              <div style={styles.resultItemHighlight}>
                <span style={styles.resultLabelHighlight}>Valeur Estimée :</span>
                <span className="plat-price plat-price-gold" style={styles.resultValueHighlight}>
                  <PlatinumIcon size={18} style={{ marginRight: "4px" }} />
                  {estimatedRankPrice}
                </span>
              </div>
            </div>
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
    border: "1px solid var(--panel-border)",
    backgroundColor: "var(--panel-bg)"
  },
  filterRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  filterBtn: {
    border: "1px solid var(--panel-border)",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
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
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
    alignItems: "start",
  },
  tableCard: {
    padding: "24px",
    border: "1px solid var(--panel-border)",
  },
  tableHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "12px",
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-primary)",
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
  detailEVBox: {
    backgroundColor: "#070a0d",
    border: "1px solid var(--panel-border)",
    padding: "16px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  detailEVLabel: {
    fontSize: "10px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  detailEVValue: {
    fontSize: "22px",
    fontWeight: 700,
    margin: "6px 0 0 0",
  },
  calculatorCard: {
    borderTop: "1px solid var(--panel-border)",
    paddingTop: "20px",
  },
  calcTitle: {
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "16px",
    color: "var(--text-primary)"
  },
  controlBox: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginBottom: "8px",
  },
  rankHighlight: {
    color: "var(--accent-purple)",
    fontWeight: 700,
  },
  slider: {
    width: "100%",
    accentColor: "var(--accent-purple)",
    cursor: "pointer",
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "var(--text-muted)",
    marginTop: "4px",
    padding: "0 2px",
  },
  calcResultBox: {
    backgroundColor: "#070a0d",
    border: "1px solid var(--panel-border)",
    borderRadius: "6px",
    padding: "16px",
  },
  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "13px",
    color: "var(--text-secondary)",
  },
  resultLabel: {
    fontWeight: 500,
  },
  resultValue: {
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  resultItemHighlight: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px dashed var(--panel-border)",
    paddingTop: "10px",
  },
  resultLabelHighlight: {
    fontWeight: 700,
    fontSize: "13px",
    color: "var(--accent-purple)",
  },
  resultValueHighlight: {
    fontSize: "18px",
    fontWeight: 800,
  }
};

if (typeof window !== "undefined" && window.innerWidth > 992) {
  styles.mainLayout.gridTemplateColumns = "1.3fr 1fr";
}
