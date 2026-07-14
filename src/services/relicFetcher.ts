import { type Relic, type RelicDrop } from "./relicData";

// ============================================================
// Types pour warframe-items/data/json/Relics.json
// (contient warframeMarket.urlName validé par la communauté)
// ============================================================
export interface WfItemsRelicRewardItem {
  name: string;
  uniqueName?: string;
  warframeMarket?: {
    id: string;
    urlName: string;
  };
}

export interface WfItemsRelicReward {
  rarity: "Common" | "Uncommon" | "Rare";
  chance: number;
  item: WfItemsRelicRewardItem;
}

export interface WfItemsRelic {
  uniqueName: string;
  name: string; // ex: "Lith C7 Intact"
  type: string;
  category: string;
  tradable: boolean;
  rewards: WfItemsRelicReward[];
  marketInfo?: {
    id: string;
    urlName: string; // ex: "lith_c7_relic"
  };
  vaulted: boolean;
}

export async function fetchAllRelics(staticRelics: Relic[]): Promise<Relic[]> {
  try {
    // Récupérer la base warframe-items (avec urlName marché validé) + les tables de drop actives
    const [wfItemsRes, missionsRes, cetusRes, solarisRes, deimosRes] = await Promise.all([
      fetch("https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/Relics.json"),
      fetch("https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/missionRewards.json").catch(() => null),
      fetch("https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/cetusBountyRewards.json").catch(() => null),
      fetch("https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/solarisBountyRewards.json").catch(() => null),
      fetch("https://raw.githubusercontent.com/WFCD/warframe-drop-data/master/data/deimosBountyRewards.json").catch(() => null),
    ]);

    if (!wfItemsRes.ok) {
      throw new Error(`Failed to fetch warframe-items Relics: ${wfItemsRes.statusText}`);
    }

    const allRelicsRaw: WfItemsRelic[] = await wfItemsRes.json();

    // Lire les tables de drop sous forme de texte brut pour recherche rapide
    const missionsText = missionsRes && missionsRes.ok ? await missionsRes.text() : "";
    const cetusText = cetusRes && cetusRes.ok ? await cetusRes.text() : "";
    const solarisText = solarisRes && solarisRes.ok ? await solarisRes.text() : "";
    const deimosText = deimosRes && deimosRes.ok ? await deimosRes.text() : "";

    if (!Array.isArray(allRelicsRaw)) {
      throw new Error("Invalid Relics.json format");
    }

    // Garder uniquement les reliques "Intact" (tier implicite dans le name)
    const intactRelics = allRelicsRaw.filter((r) => r.name.endsWith(" Intact"));

    // Ères valides
    const validEras = ["Lith", "Meso", "Neo", "Axi"];

    const parsedRelics: Relic[] = intactRelics.flatMap((r) => {
      // Parser l'ère et le nom depuis "Lith C7 Intact" -> era="Lith", name="C7"
      const parts = r.name.split(" ");
      if (parts.length < 3) return [];
      const era = parts[0];
      const relicName = parts[1];
      if (!validEras.includes(era)) return [];

      // Construire les drops avec les urlName VALIDÉS par warframe.market
      const drops: RelicDrop[] = (r.rewards || []).flatMap((rew) => {
        // Ignorer les items sans URL marché (ex: Forma Blueprint n'a pas de prix)
        const urlName = rew.item?.warframeMarket?.urlName;
        if (!urlName) {
          // Pour le Forma Blueprint, garder avec urlName générique
          if (rew.item?.name?.toLowerCase().includes("forma")) {
            return [{
              name: rew.item.name,
              urlName: "forma_blueprint",
              rarity: rew.rarity.toLowerCase() as "common" | "uncommon" | "rare",
            }];
          }
          return [];
        }

        return [{
          name: rew.item.name,
          urlName,
          rarity: rew.rarity.toLowerCase() as "common" | "uncommon" | "rare",
        }];
      });

      // Détecter le statut en cherchant le nom exact de la relique dans les tables de drop
      const searchName = `"${era} ${relicName} Relic"`;
      const inMissions = missionsText.includes(searchName);
      const inBounties =
        cetusText.includes(searchName) ||
        solarisText.includes(searchName) ||
        deimosText.includes(searchName);

      let status: "Unvaulted" | "Resurgence" | "Vaulted" = "Vaulted";
      if (inMissions) {
        status = "Unvaulted";
      } else if (inBounties) {
        status = "Resurgence";
      }

      return [{
        era: era as "Lith" | "Meso" | "Neo" | "Axi",
        name: relicName,
        status,
        drops,
      }];
    });

    // Tri : Unvaulted en premier, puis Resurgence, puis Vaulted, trié par Ère et par Nom
    const eraOrder = { Lith: 1, Meso: 2, Neo: 3, Axi: 4 };
    parsedRelics.sort((a, b) => {
      const statusScore = { Unvaulted: 3, Resurgence: 2, Vaulted: 1 };
      const scoreA = statusScore[a.status] || 1;
      const scoreB = statusScore[b.status] || 1;
      if (scoreA !== scoreB) return scoreB - scoreA;

      const eraA = eraOrder[a.era as keyof typeof eraOrder] || 99;
      const eraB = eraOrder[b.era as keyof typeof eraOrder] || 99;
      if (eraA !== eraB) return eraA - eraB;

      return a.name.localeCompare(b.name);
    });

    return parsedRelics;
  } catch (error) {
    console.error("Error fetching relics from warframe-items:", error);
    // Fallback aux reliques statiques en cas d'échec réseau
    return staticRelics;
  }
}
