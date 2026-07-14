import type { Relic, CorruptedMod, Syndicate, ModFarmActivity } from "../services/relicData";

// Calcul de l'Expected Value (EV) en Solo
export function calculateSoloEV(
  relic: Relic,
  refinement: "intact" | "radiant",
  prices: Record<string, number>
): number {
  let ev = 0;
  relic.drops.forEach((drop) => {
    const price = prices[drop.urlName] ?? 0;
    let prob = 0;
    if (refinement === "intact") {
      if (drop.rarity === "rare") prob = 0.02;
      else if (drop.rarity === "uncommon") prob = 0.11;
      else prob = 0.2533; // ~76% réparti sur 3 commons
    } else {
      if (drop.rarity === "rare") prob = 0.10;
      else if (drop.rarity === "uncommon") prob = 0.20;
      else prob = 0.1667; // ~50% réparti sur 3 commons
    }
    ev += prob * price;
  });
  return ev;
}

// Calcul de l'Expected Value (EV) en Radshare
export function calculateRadshareEV(
  relic: Relic,
  prices: Record<string, number>
): number {
  const items = relic.drops.map((drop) => {
    const price = prices[drop.urlName] ?? 0;
    let prob = 0;
    if (drop.rarity === "rare") prob = 0.10;
    else if (drop.rarity === "uncommon") prob = 0.20;
    else prob = 0.1667;
    return { price, prob };
  });

  items.sort((a, b) => a.price - b.price);

  const f: number[] = [];
  let cumulativeProb = 0;
  for (let i = 0; i < items.length; i++) {
    cumulativeProb += items[i].prob;
    f.push(cumulativeProb);
  }

  let ev = 0;
  for (let i = 0; i < items.length; i++) {
    const v_i = items[i].price;
    const f_i = f[i];
    const f_prev = i > 0 ? f[i - 1] : 0;

    const probMaxIsVi = Math.pow(f_i, 4) - Math.pow(f_prev, 4);
    ev += v_i * probMaxIsVi;
  }

  return ev;
}

// Calcul de l'EV des soutes Orokin (Mods Corrompus)
export function calculateCorruptedModsEV(
  prices: Record<string, number>,
  mods: CorruptedMod[]
): number {
  let sum = 0;
  mods.forEach((mod) => {
    sum += prices[mod.urlName] ?? 0;
  });
  return sum / mods.length;
}

// Calcul de l'EV d'une chasse aux Eidolons (1 run Tridolon)
export function calculateEidolonEV(prices: Record<string, number>): number {
  const teralystCommons = [
    "arcane_nullifier",
    "arcane_warmth",
    "arcane_deflection",
    "arcane_ice",
    "arcane_healing",
    "arcane_resistance"
  ];
  let teralystEV = 0;
  teralystCommons.forEach((url) => {
    teralystEV += (prices[url] ?? 0) / teralystCommons.length;
  });

  const gantulystUncommons = [
    "arcane_guardian",
    "arcane_strike",
    "arcane_fury",
    "arcane_precision",
    "arcane_velocity"
  ];
  const gantulystCommons = ["arcane_nullifier", "arcane_deflection"];
  
  let gantulystEV = 0;
  gantulystUncommons.forEach((url) => {
    gantulystEV += 0.12 * (prices[url] ?? 0);
  });
  gantulystCommons.forEach((url) => {
    gantulystEV += 0.20 * (prices[url] ?? 0);
  });

  const hydrolystRares = [
    { url: "arcane_energize", prob: 0.05 },
    { url: "arcane_grace", prob: 0.05 },
    { url: "arcane_barrier", prob: 0.05 }
  ];
  const hydrolystOthers = [
    { url: "arcane_aegis", prob: 0.125 },
    { url: "arcane_trickery", prob: 0.125 },
    { url: "arcane_guardian", prob: 0.20 },
    { url: "arcane_strike", prob: 0.20 },
    { url: "arcane_nullifier", prob: 0.20 }
  ];
  
  let hydrolystEV = 0;
  hydrolystRares.forEach((item) => {
    hydrolystEV += item.prob * (prices[item.url] ?? 0);
  });
  hydrolystOthers.forEach((item) => {
    hydrolystEV += item.prob * (prices[item.url] ?? 0);
  });

  return teralystEV + gantulystEV + hydrolystEV;
}

// Calcul de conversion de réputation pour un Syndicat (générique)
export function calculateSyndicateConversion(
  syndicate: Syndicate,
  prices: Record<string, number>
): { bestItemName: string; ratio1k: number; evMaxStanding: number } {
  let bestItemName = "Aucun";
  let maxRatio = 0; // PL pour 1 point de réputation

  syndicate.exchangeItems.forEach((item) => {
    const price = prices[item.urlName] ?? 0;
    const ratio = price / item.cost;
    if (ratio > maxRatio) {
      maxRatio = ratio;
      bestItemName = item.name;
    }
  });

  // Calcul du gain pour 1k points
  const ratio1k = maxRatio * 1000;
  
  // Calcul pour la réputation max (132 000 points)
  const evMaxStanding = maxRatio * syndicate.maxStanding;

  return {
    bestItemName,
    ratio1k,
    evMaxStanding
  };
}

// Calculs pour les farms de mods
export function calculateModFarmEV(
  activity: ModFarmActivity,
  prices: Record<string, number>
): { totalEV: number; currencyEV: number; dropsEV: number } {
  let currencyEV = 0;
  let dropsEV = 0;

  if (activity.id === "arbitration") {
    const vitusAmount = 15;
    let maxGalvPrice = 0;
    activity.rewards.forEach(r => {
      if (r.cost && r.cost === 20) {
        const p = prices[r.urlName] ?? 0;
        if (p > maxGalvPrice) maxGalvPrice = p;
      }
    });
    const vitusUnitValue = maxGalvPrice / 20;
    currencyEV = vitusAmount * vitusUnitValue;

    const numRotations = 4;
    activity.rewards.forEach(r => {
      if (!r.cost) {
        const p = prices[r.urlName] ?? 0;
        dropsEV += numRotations * r.chance * p;
      }
    });
  } else if (activity.id === "steel_path") {
    const steelEssenceAmount = 12;
    const relicPackValue = 4.5;
    const steelEssenceUnitValue = relicPackValue / 15;
    currencyEV = steelEssenceAmount * steelEssenceUnitValue;

    const numArcanes = 6;
    activity.rewards.forEach(r => {
      if (!r.cost) {
        const p = prices[r.urlName] ?? 0;
        dropsEV += numArcanes * r.chance * p;
      }
    });
  } else if (activity.id === "plains_bounty") {
    activity.rewards.forEach(r => {
      const p = prices[r.urlName] ?? 0;
      dropsEV += r.chance * p;
    });
  }

  return {
    totalEV: currencyEV + dropsEV,
    currencyEV,
    dropsEV
  };
}
