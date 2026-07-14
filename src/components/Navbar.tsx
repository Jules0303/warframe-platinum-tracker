import React from "react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Tableau de Bord", icon: "📊" },
    { id: "relics", label: "Fissures de Reliques", icon: "💎" },
    { id: "corrupted", label: "Soutes (Corrompus)", icon: "🔑" },
    { id: "modfarms", label: "Farms de Mods", icon: "⚔️" },
    { id: "eidolons", label: "Chasse Eidolons", icon: "👁️" },
    { id: "bounties", label: "Syndicats", icon: "📜" },
  ];

  return (
    <header style={styles.header} className="glass-panel">
      <div className="container" style={styles.navContainer}>
        <div style={styles.logo} onClick={() => setActiveTab("dashboard")}>
          <span style={styles.logoIcon}>☤</span>
          <span className="title-grad-gold" style={styles.logoText}>WF Profit Tracker</span>
        </div>
        <nav style={styles.nav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.navButton,
                color: activeTab === tab.id ? "var(--accent-gold)" : "var(--text-secondary)",
                borderBottom: activeTab === tab.id ? "2px solid var(--accent-gold)" : "2px solid transparent",
                backgroundColor: activeTab === tab.id ? "rgba(166, 124, 55, 0.05)" : "transparent",
                fontWeight: activeTab === tab.id ? 700 : 500,
              }}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    width: "100%",
    borderRadius: "0",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    padding: "0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backgroundColor: "#ffffff",
    borderBottom: "1px solid var(--panel-border)"
  },
  navContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "64px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logoIcon: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "var(--accent-gold)",
    textShadow: "0 0 6px var(--accent-gold-glow)",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  nav: {
    display: "flex",
    height: "100%",
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "0 15px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    height: "100%",
    border: "none",
    outline: "none",
  },
  tabIcon: {
    fontSize: "15px",
  }
};
