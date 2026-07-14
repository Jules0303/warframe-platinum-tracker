import React from "react";
import { RELICS, CORRUPTED_MODS, SYNDICATE_BOUNTIES, MOD_FARM_ACTIVITIES } from "../services/relicData";
import {
  calculateRadshareEV,
  calculateCorruptedModsEV,
  calculateEidolonEV,
  calculateBountyEV,
  calculateModFarmEV
} from "../utils/calculations";

interface DashboardProps {
  prices: Record<string, number>;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ prices, setActiveTab }) => {
  // 1. Calculs des rentabilités pour chaque activité

  // Reliques : On prend une relique unvaulted active, ex: Axi B7 (Gauss Blueprint)
  const bestRelic = RELICS.find(r => r.status === "Unvaulted" && r.era === "Axi") || RELICS[0];
  const relicRadshareEV = calculateRadshareEV(bestRelic, prices);
  const relicTimeMin = 4;
  const relicHourProfit = Math.round(relicRadshareEV * (60 / relicTimeMin));

  // Mods Corrompus :
  const corruptedEV = calculateCorruptedModsEV(prices, CORRUPTED_MODS);
  const corruptedTimeMin = 3.5;
  const corruptedHourProfit = Math.round(corruptedEV * (60 / corruptedTimeMin));

  // Chasse Eidolon (4x3 captures)
  const singleTridolonEV = calculateEidolonEV(prices);
  const eidolonCapturesPerHour = 4.8;
  const eidolonHourProfit = Math.round(singleTridolonEV * eidolonCapturesPerHour);

  // Missions Syndicat (Cavia)
  const caviaBounty = SYNDICATE_BOUNTIES[1];
  const { totalEV: caviaEV } = calculateBountyEV(caviaBounty, prices);
  const caviaHourProfit = Math.round(caviaEV * (60 / caviaBounty.runTimeMinutes));

  // Arbitrages (Nouveau)
  const arbiAct = MOD_FARM_ACTIVITIES[0];
  const { totalEV: arbiEV } = calculateModFarmEV(arbiAct, prices);
  const arbiHourProfit = Math.round(arbiEV * (60 / arbiAct.runTimeMinutes));

  // Steel Path (Nouveau)
  const spAct = MOD_FARM_ACTIVITIES[1];
  const { totalEV: spEV } = calculateModFarmEV(spAct, prices);
  const spHourProfit = Math.round(spEV * (60 / spAct.runTimeMinutes));

  // 2. Cartes d'activités
  const activities = [
    {
      id: "relics",
      title: "Fissures de Reliques (Radshare)",
      description: `Ouvrir des reliques éclatantes en escouade de 4. Exemple basé sur Axi ${bestRelic.name} (Gauss Prime Rares).`,
      profitPerHour: relicHourProfit,
      profitPerRun: Math.round(relicRadshareEV),
      timeLabel: `${relicTimeMin} min / run`,
      difficulty: "Facile",
      difficultyBadge: "badge-success",
      borderTheme: "var(--accent-gold)",
    },
    {
      id: "corrupted",
      title: "Soutes Orokin (Mods Corrompus)",
      description: "Chasse aux soutes de Deimos avec les 4 Clés de Dragon équipées en équipe ou solo. 24 mods possibles.",
      profitPerHour: corruptedHourProfit,
      profitPerRun: Math.round(corruptedEV),
      timeLabel: `${corruptedTimeMin} min / run`,
      difficulty: "Facile",
      difficultyBadge: "badge-success",
      borderTheme: "var(--accent-blue)",
    },
    {
      id: "modfarms",
      title: "Arbitrages (Mods Galvanisés)",
      description: "Survivez aux vagues d'Arbitrage pour obtenir de l'Essence Vitus, acheter des mods Galvanisés et espérer Rolling Guard.",
      profitPerHour: arbiHourProfit,
      profitPerRun: Math.round(arbiEV),
      timeLabel: "20 min / run",
      difficulty: "Moyen",
      difficultyBadge: "badge-blue",
      borderTheme: "var(--accent-blue)",
    },
    {
      id: "modfarms",
      title: "Steel Path Survival (Acolytes)",
      description: "Affrontez les Acolytes qui spawnent en Steel Path pour farmer de l'Essence d'Acier et des Arcanes d'armes.",
      profitPerHour: spHourProfit,
      profitPerRun: Math.round(spEV),
      timeLabel: "30 min / run",
      difficulty: "Difficile",
      difficultyBadge: "badge-gold",
      borderTheme: "var(--accent-purple)",
    },
    {
      id: "eidolons",
      title: "Chasse aux Eidolons (Tridolon 4x3)",
      description: "Vaincre le Teralyst, Gantulyst et Hydrolyst pour obtenir des Arcanes légendaires comme Arcane Energize.",
      profitPerHour: eidolonHourProfit,
      profitPerRun: Math.round(singleTridolonEV),
      timeLabel: "12 min / Tridolon",
      difficulty: "Difficile",
      difficultyBadge: "badge-gold",
      borderTheme: "var(--accent-purple)",
    },
    {
      id: "bounties",
      title: "Contrats de Syndicats (Cavia Bounties)",
      description: "Réaliser des contrats du Cavia dans le Sanctum Anatomica et échanger la réputation contre des Arcanes de Mêlée.",
      profitPerHour: caviaHourProfit,
      profitPerRun: Math.round(caviaEV),
      timeLabel: `${caviaBounty.runTimeMinutes} min / run`,
      difficulty: "Moyen",
      difficultyBadge: "badge-blue",
      borderTheme: "var(--accent-gold)",
    }
  ];

  // Trier par profit décroissant
  activities.sort((a, b) => b.profitPerHour - a.profitPerHour);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 className="title-grad-purple glow-purple">Activités les plus Rentables</h1>
        <p style={styles.subtitle}>
          Classement en temps réel des méthodes de farm basées sur les prix actuels de Warframe.market.
        </p>
      </div>

      {/* Grid of Main Stats */}
      <div style={styles.statsRow}>
        <div className="glass-panel" style={styles.statBox}>
          <span style={styles.statLabel}>Meilleur Farm Actuel</span>
          <span className="title-grad-gold" style={styles.statValue}>
            {activities[0].title.split(" (")[0]}
          </span>
        </div>
        <div className="glass-panel" style={styles.statBox}>
          <span style={styles.statLabel}>Rentabilité Max Estimée</span>
          <span className="plat-price plat-price-gold" style={styles.statValue}>
            {activities[0].profitPerHour} <span style={{fontSize: "14px", fontWeight: "normal"}}>PL / h</span>
          </span>
        </div>
        <div className="glass-panel" style={styles.statBox}>
          <span style={styles.statLabel}>Marché Analysé</span>
          <span style={{...styles.statValue, color: "var(--accent-blue)"}}>
            PC (Live)
          </span>
        </div>
      </div>

      <div className="cards-grid">
        {activities.map((act, index) => (
          <div
            key={index}
            className="glass-panel glass-panel-hover"
            style={{
              ...styles.card,
              borderTop: `4px solid ${act.borderTheme}`,
            }}
          >
            <div style={styles.cardHeader}>
              <span className={`badge ${act.difficultyBadge}`}>{act.difficulty}</span>
              <span style={styles.rankBadge}>#{index + 1}</span>
            </div>
            
            <h3 style={styles.cardTitle}>
              {act.title}
            </h3>
            
            <p style={styles.cardDesc}>{act.description}</p>
            
            <div style={styles.metricsContainer}>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Profit estimé</span>
                <span className="plat-price plat-price-gold" style={styles.metricValue}>
                  {act.profitPerHour} <span style={styles.metricUnit}>PL/h</span>
                </span>
              </div>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Moyenne / Session</span>
                <span className="plat-price" style={styles.metricValueSub}>
                  {act.profitPerRun} PL
                </span>
              </div>
            </div>

            <div style={styles.cardFooter}>
              <span style={styles.timeLabel}>⏱️ {act.timeLabel}</span>
              <button className="btn btn-primary" onClick={() => setActiveTab(act.id)}>
                Détails ➔
              </button>
            </div>
          </div>
        ))}
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
    fontSize: "15px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statBox: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    border: "1px solid var(--panel-border)"
  },
  statLabel: {
    color: "var(--text-muted)",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600,
  },
  statValue: {
    fontSize: "20px",
    fontWeight: 700,
    textAlign: "center",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    height: "100%",
    border: "1px solid var(--panel-border)"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  rankBadge: {
    backgroundColor: "#faf9f6",
    border: "1px solid var(--panel-border)",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--text-secondary)",
  },
  cardTitle: {
    fontSize: "17px",
    fontWeight: 700,
    marginBottom: "12px",
    color: "var(--text-primary)"
  },
  cardDesc: {
    color: "var(--text-secondary)",
    fontSize: "13px",
    lineHeight: "1.6",
    marginBottom: "20px",
    flexGrow: 1,
  },
  metricsContainer: {
    display: "flex",
    backgroundColor: "#faf9f6",
    border: "1px solid var(--panel-border)",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metric: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metricLabel: {
    fontSize: "10px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  metricValue: {
    fontSize: "18px",
    fontWeight: 700,
  },
  metricValueSub: {
    fontSize: "15px",
    fontWeight: 600,
  },
  metricUnit: {
    fontSize: "11px",
    fontWeight: "normal",
    color: "var(--text-muted)",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeLabel: {
    fontSize: "13px",
    color: "var(--text-secondary)",
  }
};
