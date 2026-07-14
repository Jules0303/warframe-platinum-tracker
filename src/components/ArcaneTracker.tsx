import React, { useState } from "react";
import { ARCANES } from "../services/relicData";

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

  const sources = ["Tous", "Eidolons", "Zariman", "Cavia", "Fortuna", "Cetus", "Steel Path"];

  // Filtrer les arcanes
  const filteredArcanes = ARCANES.filter((arcane) => {
    const matchesSource = filterSource === "Tous" || arcane.source === filterSource;
    const matchesSearch = arcane.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  // Mapper les prix et calculer les prix max
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
      setSortOrder("desc"); // Tri décroissant par défaut pour les prix
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.header}>
          <h1 className="title-grad-purple glow-gold">Base de Données des Arcanes</h1>
          <p style={styles.subtitle}>
            Comparez les prix des Arcanes de toutes les activités de farm et visualisez leur valeur à l'unité (Rang 0) et au Rang Max (Rang 5).
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
                borderColor: filterSource === src ? "var(--accent-purple)" : "rgba(0,0,0,0.05)",
                background: filterSource === src ? "rgba(122, 53, 156, 0.08)" : "rgba(255,255,255,0.05)",
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

      <div className="glass-panel" style={styles.tableCard}>
        <div style={styles.tableHeaderRow}>
          <h3 style={styles.sectionTitle}>Catalogue des Arcanes ({arcanesWithPrices.length})</h3>
          <button
            className="btn btn-secondary"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            style={{ padding: "8px 12px", fontSize: "12px" }}
          >
            {isRefreshing ? "Chargement..." : "🔄 Actualiser Prix de cette Catégorie"}
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
                  Prix Unitaire (Rang 0) {sortField === "price" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => toggleSort("maxPrice")} style={{ cursor: "pointer" }}>
                  Valeur Rang Max (x21) {sortField === "maxPrice" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {arcanesWithPrices.map((arcane) => {
                const isEnergize = arcane.urlName === "arcane_energize";
                const isValuable = arcane.price >= 12;

                const rarityBadgeClass =
                  arcane.rarity === "rare" ? "badge-gold" :
                  arcane.rarity === "uncommon" ? "badge-blue" :
                  "badge-purple";

                return (
                  <tr key={arcane.urlName}>
                    <td style={{ fontWeight: 700, color: isEnergize ? "var(--accent-gold)" : "var(--text-primary)" }}>
                      {arcane.name}
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{arcane.source}</td>
                    <td>
                      <span className={`badge ${rarityBadgeClass}`}>{arcane.rarity}</span>
                    </td>
                    <td>
                      <span className={`plat-price ${isValuable ? "plat-price-gold" : ""}`} style={{ fontWeight: 700 }}>
                        {arcane.price} PL
                      </span>
                    </td>
                    <td>
                      <span className="plat-price plat-price-gold" style={{ fontWeight: 700 }}>
                        {arcane.maxPrice} PL
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
    backgroundColor: "#ffffff"
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
    backgroundColor: "#faf9f6",
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
  }
};
