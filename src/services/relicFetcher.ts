import { type Relic, type RelicDrop } from "./relicData";

export interface ApiRelicReward {
  itemName: string;
  rarity: "Common" | "Uncommon" | "Rare";
  chance: number;
}

export interface ApiRelic {
  tier: string;
  relicName: string;
  state: string;
  rewards: ApiRelicReward[];
}

export interface ApiResponse {
  relics: ApiRelic[];
}

// Convert game item name to warframe.market urlName
export function getItemUrlName(name: string): string {
  let urlName = name.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s_]/g, "")
    .trim()
    .replace(/\s+/g, "_");
    
  // If it's a Warframe part blueprint, remove the "_blueprint" suffix for warframe.market
  if (
    urlName.endsWith("_blueprint") &&
    (urlName.includes("_neuroptics") || urlName.includes("_chassis") || urlName.includes("_systems") || urlName.includes("_harness") || urlName.includes("_wings"))
  ) {
    urlName = urlName.substring(0, urlName.length - 10);
  }
  
  return urlName;
}

export async function fetchAllRelics(staticRelics: Relic[]): Promise<Relic[]> {
  try {
    // Récupérer la base de reliques et les tables de drop actives en parallèle
    const [relicsRes, missionsRes, cetusRes, solarisRes, deimosRes] = await Promise.all([
      fetch("https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/relics.json"),
      fetch("https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/missionRewards.json").catch(() => null),
      fetch("https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/cetusBountyRewards.json").catch(() => null),
      fetch("https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/solarisBountyRewards.json").catch(() => null),
      fetch("https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/deimosBountyRewards.json").catch(() => null),
    ]);

    if (!relicsRes.ok) {
      throw new Error(`Failed to fetch relics database: ${relicsRes.statusText}`);
    }

    const data: ApiResponse = await relicsRes.json();
    
    // Lire les tables de drop sous forme de texte brut pour faire une recherche rapide par sous-chaîne
    const missionsText = missionsRes && missionsRes.ok ? await missionsRes.text() : "";
    const cetusText = cetusRes && cetusRes.ok ? await cetusRes.text() : "";
    const solarisText = solarisRes && solarisRes.ok ? await solarisRes.text() : "";
    const deimosText = deimosRes && deimosRes.ok ? await deimosRes.text() : "";

    if (!data || !Array.isArray(data.relics)) {
      throw new Error("Invalid relics database format");
    }

    // Garder uniquement l'état "Intact" pour rassembler la liste unique des reliques
    const intactRelics = data.relics.filter((r) => r.state === "Intact");

    const parsedRelics: Relic[] = intactRelics.map((r) => {
      const era = r.tier as any; // Lith, Meso, Neo, Axi
      const name = r.relicName;
      
      const drops: RelicDrop[] = r.rewards.map((rew) => {
        const rarity = rew.rarity.toLowerCase() as "common" | "uncommon" | "rare";
        return {
          name: rew.itemName,
          urlName: getItemUrlName(rew.itemName),
          rarity,
        };
      });

      // Nom de recherche exact de la relique dans les tables de drop (ex: "Lith C12 Relic")
      const searchName = `"${era} ${name} Relic"`;

      let status: "Unvaulted" | "Resurgence" | "Vaulted" = "Vaulted";

      const inMissions = missionsText.includes(searchName);
      const inBounties = cetusText.includes(searchName) || 
                         solarisText.includes(searchName) || 
                         deimosText.includes(searchName);

      if (inMissions) {
        status = "Unvaulted"; // Drop actif dans les missions régulières
      } else if (inBounties) {
        status = "Resurgence"; // Drop actif uniquement dans les mises à prix (Prime Resurgence)
      }

      return {
        era,
        name,
        status,
        drops,
      };
    });

    // Conserver uniquement les ères classiques du jeu
    const validEras = ["Lith", "Meso", "Neo", "Axi"];
    const filteredRelics = parsedRelics.filter((r) => validEras.includes(r.era));

    // Tri : Unvaulted en premier, puis Resurgence, puis Vaulted, trié par Ère et par Nom
    const eraOrder = { Lith: 1, Meso: 2, Neo: 3, Axi: 4 };
    filteredRelics.sort((a, b) => {
      const statusScore = { Unvaulted: 3, Resurgence: 2, Vaulted: 1 };
      const scoreA = statusScore[a.status] || 1;
      const scoreB = statusScore[b.status] || 1;
      if (scoreA !== scoreB) return scoreB - scoreA;

      const eraA = eraOrder[a.era as keyof typeof eraOrder] || 99;
      const eraB = eraOrder[b.era as keyof typeof eraOrder] || 99;
      if (eraA !== eraB) return eraA - eraB;

      return a.name.localeCompare(b.name);
    });

    return filteredRelics;
  } catch (error) {
    console.error("Error fetching relics and drop tables:", error);
    // Fallback aux reliques statiques en cas d'échec réseau
    return staticRelics;
  }
}
