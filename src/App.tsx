import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { RelicTracker } from "./components/RelicTracker";
import { CorruptedModsTracker } from "./components/CorruptedModsTracker";
import { ModFarmsTracker } from "./components/ModFarmsTracker";
import { EidolonTracker } from "./components/EidolonTracker";
import { BountyTracker } from "./components/BountyTracker";
import { warframeMarket, FALLBACK_PRICES } from "./services/warframeMarket";

function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [prices, setPrices] = useState<Record<string, number>>({ ...FALLBACK_PRICES });

  // Effet de chargement initial et boucle de synchronisation lente en arrière-plan
  useEffect(() => {
    const itemsToFetch = Object.keys(FALLBACK_PRICES);

    // Charger d'abord les prix depuis le cache localStorage (pour réactivité immédiate)
    const initialPrices: Record<string, number> = { ...FALLBACK_PRICES };
    itemsToFetch.forEach((urlName) => {
      const raw = localStorage.getItem("wf_price_" + urlName);
      if (raw) {
        try {
          const data = JSON.parse(raw);
          const isExpired = Date.now() - data.timestamp > 3600000; // 1h
          if (!isExpired) {
            initialPrices[urlName] = data.price;
          }
        } catch (e) {
          // Ignorer si JSON invalide
        }
      }
    });
    setPrices(initialPrices);

    // Mettre à jour séquentiellement tous les prix
    let active = true;
    const fetchAllPricesSequentially = async () => {
      for (const urlName of itemsToFetch) {
        if (!active) break;
        try {
          const livePrice = await warframeMarket.getPrice(urlName);
          setPrices((prev) => ({
            ...prev,
            [urlName]: livePrice,
          }));
        } catch (err) {
          console.error(`Erreur de rafraîchissement en arrière-plan pour ${urlName}:`, err);
        }
      }
    };

    fetchAllPricesSequentially();

    return () => {
      active = false;
    };
  }, []);

  // Fonction pour forcer le rafraîchissement d'un item particulier (efface le cache)
  const refreshPrice = async (urlName: string): Promise<number> => {
    localStorage.removeItem("wf_price_" + urlName);
    const livePrice = await warframeMarket.getPrice(urlName);
    setPrices((prev) => ({
      ...prev,
      [urlName]: livePrice,
    }));
    return livePrice;
  };

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container" style={styles.main}>
        {activeTab === "dashboard" && (
          <Dashboard prices={prices} setActiveTab={setActiveTab} />
        )}
        {activeTab === "relics" && (
          <RelicTracker prices={prices} refreshPrice={refreshPrice} />
        )}
        {activeTab === "corrupted" && (
          <CorruptedModsTracker prices={prices} refreshPrice={refreshPrice} />
        )}
        {activeTab === "modfarms" && (
          <ModFarmsTracker prices={prices} refreshPrice={refreshPrice} />
        )}
        {activeTab === "eidolons" && (
          <EidolonTracker prices={prices} refreshPrice={refreshPrice} />
        )}
        {activeTab === "bounties" && (
          <BountyTracker prices={prices} refreshPrice={refreshPrice} />
        )}
      </main>

      <footer style={styles.footer} className="glass-panel">
        <div className="container" style={styles.footerContainer}>
          <p>© {new Date().getFullYear()} - Warframe Platinum Profit Tracker</p>
          <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Données de prix fournies par Warframe.market. Ce site n'est pas affilié à Digital Extremes.
          </p>
        </div>
      </footer>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    flexGrow: 1,
    paddingBottom: "40px",
  },
  footer: {
    width: "100%",
    borderRadius: "0",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    padding: "20px 0",
    marginTop: "40px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid var(--panel-border)"
  },
  footerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    textAlign: "center",
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
};

export default App;
