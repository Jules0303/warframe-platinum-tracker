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
    const response = await fetch(
      "https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/relics.json"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch relics: ${response.statusText}`);
    }
    const data: ApiResponse = await response.json();
    
    if (!data || !Array.isArray(data.relics)) {
      throw new Error("Invalid response format");
    }

    // Filter only "Intact" state to avoid duplicates and gather rewards
    const intactRelics = data.relics.filter((r) => r.state === "Intact");

    const parsedRelics: Relic[] = intactRelics.map((r) => {
      const era = r.tier as any; // Lith, Meso, Neo, Axi, Requiem
      const name = r.relicName;
      
      const drops: RelicDrop[] = r.rewards.map((rew) => {
        const rarity = rew.rarity.toLowerCase() as "common" | "uncommon" | "rare";
        return {
          name: rew.itemName,
          urlName: getItemUrlName(rew.itemName),
          rarity,
        };
      });

      // Find status from our static unvaulted/resurgence list
      const staticMatch = staticRelics.find(
        (sr) => sr.era === era && sr.name.toLowerCase() === name.toLowerCase()
      );
      const status = staticMatch ? staticMatch.status : "Vaulted";

      return {
        era,
        name,
        status,
        drops,
      };
    });

    // Remove duplicates just in case, and filter out Requiem relics if they don't fit
    const validEras = ["Lith", "Meso", "Neo", "Axi"];
    const filteredRelics = parsedRelics.filter((r) => validEras.includes(r.era));

    // Sort: Unvaulted/Resurgence first, then by Era (Lith -> Meso -> Neo -> Axi), then by Name
    const eraOrder = { Lith: 1, Meso: 2, Neo: 3, Axi: 4 };
    filteredRelics.sort((a, b) => {
      // Status priority
      const statusScore = { Unvaulted: 3, Resurgence: 2, Vaulted: 1 };
      const scoreA = statusScore[a.status] || 1;
      const scoreB = statusScore[b.status] || 1;
      if (scoreA !== scoreB) return scoreB - scoreA;

      // Era priority
      const eraA = eraOrder[a.era as keyof typeof eraOrder] || 99;
      const eraB = eraOrder[b.era as keyof typeof eraOrder] || 99;
      if (eraA !== eraB) return eraA - eraB;

      // Name priority
      return a.name.localeCompare(b.name);
    });

    return filteredRelics;
  } catch (error) {
    console.error("Error fetching all relics from API:", error);
    // Fallback to static relics if API fails
    return staticRelics;
  }
}
