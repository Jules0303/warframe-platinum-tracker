import React, { useState } from "react";
import { MOD_FARM_ACTIVITIES, type ModFarmActivity } from "../services/relicData";
import { calculateModFarmEV } from "../utils/calculations";
import { PlatinumIcon } from "./Icons";

interface ModFarmsTrackerProps {
  prices: Record<string, number>;
  refreshPrice: (urlName: string) => Promise<number>;
}

export const ModFarmsTracker: React.FC<ModFarmsTrackerProps> = ({ prices, refreshPrice }) => {
  const [selectedActivity, setSelectedActivity] = useState<ModFarmActivity>(MOD_FARM_ACTIVITIES[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [customTime, setCustomTime] = useState<number>(selectedActivity.runTimeMinutes);

  const selectActivity = (act: ModFarmActivity) => {
    setSelectedActivity(act);
    setCustomTime(act.runTimeMinutes);
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    for (const reward of selectedActivity.rewards) {
      await refreshPrice(reward.urlName);
    }
    setIsRefreshing(false);
  };

  const handleRefreshAllModFarms = async () => {
    setIsRefreshingAll(true);
    const uniqueItems = new Set<string>();
    MOD_FARM_ACTIVITIES.forEach((act) => {
      act.rewards.forEach((r) => {
        uniqueItems.add(r.urlName);
      });
    });
    for (const urlName of uniqueItems) {
      await refreshPrice(urlName);
    }
    setIsRefreshingAll(false);
  };

  const { totalEV, currencyEV, dropsEV } = calculateModFarmEV(selectedActivity, prices);
  // Calcul horaire
  const plPerHour = Math.round(totalEV * (60 / customTime));

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.header}>
          <h1 className="title-grad-blue glow-gold">Tracker de Farms de Mods</h1>
          <p style={styles.subtitle}>
            Estimez l'efficacité horaire des Arbitrages, du Steel Path et des mises à prix spéciales des Plaines d'Eidolon.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleRefreshAllModFarms}
          disabled={isRefreshingAll}
          style={{ padding: "10px 16px", alignSelf: "center" }}
        >
          {isRefreshingAll ? "Chargement..." : "🔄 Actualiser tous les Farms"}
        </button>
      </div>

      {/* Activity Selector */}
      <div style={styles.selectorContainer}>
        {MOD_FARM_ACTIVITIES.map((act) => (
          <button
            key={act.id}
            className="glass-panel"
            onClick={() => selectActivity(act)}
            style={{
              ...styles.selectorTab,
              borderColor: selectedActivity.id === act.id ? "var(--accent-blue)" : "var(--panel-border)",
              background: selectedActivity.id === act.id ? "rgba(44, 94, 138, 0.08)" : "var(--panel-bg)",
              color: selectedActivity.id === act.id ? "var(--accent-blue)" : "var(--text-primary)",
            }}
          >
            <span style={styles.relicName}>{act.name}</span>
            <span style={styles.eraBadge}>⏱️ {act.runTimeMinutes} min</span>
          </button>
        ))}
      </div>

      <div style={styles.mainLayout}>
        {/* Left Column: Summary */}
        <div className="glass-panel" style={styles.summaryCard}>
          <div style={styles.summaryTitleRow}>
            <h2 className="title-grad-blue">Analyse de Rentabilité</h2>
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
              <span style={styles.statLabel}>EV Moyenne par Run</span>
              <span className="plat-price plat-price-gold" style={styles.statValue}>
                <PlatinumIcon size={16} style={{ marginRight: "4px" }} />
                {totalEV.toFixed(1)}
              </span>
              <span style={styles.statSub}>
                {selectedActivity.id !== "plains_bounty" 
                  ? `Monnaie : ${currencyEV.toFixed(0)} | Drops : ${dropsEV.toFixed(0)}`
                  : "Drops directs uniquement"
                }
              </span>
            </div>

            <div style={styles.statBoxHighlight}>
              <span style={styles.statLabelHighlight}>Gains Horaires Estimés</span>
              <span className="plat-price plat-price-gold" style={styles.statValueHighlight}>
                <PlatinumIcon size={18} style={{ marginRight: "6px" }} />
                {plPerHour} <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "normal" }}>/ h</span>
              </span>
              <span style={styles.statSubHighlight}>⏱️ Pour {customTime} minutes de farm</span>
            </div>
          </div>

          <div style={styles.controlBox}>
            <label style={styles.label}>
              ⏱️ Ajuster la durée de votre session (minutes) :
            </label>
            <div style={styles.inputRow}>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={customTime}
                onChange={(e) => setCustomTime(parseInt(e.target.value))}
                style={styles.slider}
              />
              <span style={styles.runTimeValue}>{customTime} min</span>
            </div>
          </div>

          <div style={styles.infoBox}>
            {selectedActivity.id === "arbitration" && (
              <p>
                ⚖️ <strong>Arbitrage :</strong> Les drones d'Arbitrage drop de l'Essence Vitus. Le calcul d'EV se base sur un gain moyen de 15 Vitus en 20 minutes (convertis en mods Galvanisés à 20 Vitus l'unité) + 4 tirages de rotation de 5 minutes (taux cumulé de Rolling Guard et Adaptation).
              </p>
            )}
            {selectedActivity.id === "steel_path" && (
              <p>
                ⚔️ <strong>Steel Path :</strong> En 30 minutes de survie, vous affrontez environ 6 Acolytes (12 Steel Essences + 6 arcanes d'acolytes). Les essences d'acier sont converties selon le ratio de achat de packs de reliques chez Teshin.
              </p>
            )}
            {selectedActivity.id === "plains_bounty" && (
              <p>
                🌾 <strong>Mises à prix Cetus :</strong> Calculé sur le taux de drop du mod Gladiator Might (12.5% en rotation A/B) et Augur Secrets (2.5%) sur un contrat classique accompli en 8 minutes.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Rewards details */}
        <div className="glass-panel" style={styles.tableCard}>
          <h3 style={styles.sectionTitle}>Tableau des Récompenses du Farm</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item / Mod</th>
                  <th>Obtention / Condition</th>
                  <th>Prix Actuel</th>
                  <th>Espérance Partielle</th>
                </tr>
              </thead>
              <tbody>
                {selectedActivity.rewards.map((reward) => {
                  const price = prices[reward.urlName] ?? 0;
                  let obtentionText = "";
                  let partialValueText = "";

                  if (reward.cost) {
                    obtentionText = `Achat Boutique (${reward.cost} ${selectedActivity.currencyName.split(" ")[0]})`;
                    // Valeur partielle d'une essence vitus / acier accumulée dans la session
                    const unitValue = price / reward.cost;
                    const sessionAmount = selectedActivity.id === "arbitration" ? 15 : 12;
                    partialValueText = `~ ${(unitValue * sessionAmount).toFixed(1)} PL`;
                  } else {
                    obtentionText = `Taux de Drop: ${(reward.chance * 100).toFixed(1)}%`;
                    const occurrences = selectedActivity.id === "arbitration" ? 4 : selectedActivity.id === "steel_path" ? 6 : 1;
                    partialValueText = `~ ${(reward.chance * occurrences * price).toFixed(1)}`;
                  }

                  return (
                    <tr key={reward.urlName}>
                      <td style={{ fontWeight: 600 }}>{reward.name}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{obtentionText}</td>
                      <td>
                        <span className="plat-price plat-price-gold">
                          <PlatinumIcon size={12} style={{ marginRight: "3px" }} />
                          {price}
                        </span>
                      </td>
                      <td>
                        <span className="plat-price" style={{ color: "var(--text-secondary)" }}>
                          <PlatinumIcon size={11} style={{ marginRight: "3px" }} />
                          {partialValueText}
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
  selectorContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  selectorTab: {
    flex: "1 1 200px",
    padding: "14px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    borderWidth: "1px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
  },
  eraBadge: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontWeight: 600,
    marginTop: "4px",
  },
  relicName: {
    fontSize: "16px",
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
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  statBox: {
    backgroundColor: "#070a0d",
    border: "1px solid var(--panel-border)",
    borderRadius: "8px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  statBoxHighlight: {
    backgroundColor: "#0c1521",
    border: "1px solid rgba(0, 210, 255, 0.2)",
    borderRadius: "8px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  statLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  statLabelHighlight: {
    fontSize: "11px",
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
    fontSize: "11px",
    color: "var(--text-muted)",
    textAlign: "center",
  },
  statSubHighlight: {
    fontSize: "11px",
    color: "var(--text-secondary)",
  },
  controlBox: {
    backgroundColor: "#faf9f6",
    border: "1px solid var(--panel-border)",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  label: {
    fontSize: "13px",
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
    height: "5px",
    cursor: "pointer",
  },
  runTimeValue: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--accent-blue)",
    width: "70px",
    textAlign: "right",
  },
  infoBox: {
    backgroundColor: "#faf9f6",
    border: "1px solid var(--panel-border)",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "12px",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
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
