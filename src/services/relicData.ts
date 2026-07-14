export interface RelicDrop {
  name: string;
  urlName: string;
  rarity: "common" | "uncommon" | "rare";
}

export interface Relic {
  era: "Lith" | "Meso" | "Neo" | "Axi";
  name: string;
  status: "Unvaulted" | "Resurgence" | "Vaulted";
  drops: RelicDrop[];
}

export interface CorruptedMod {
  name: string;
  urlName: string;
  category: "Warframe" | "Fusil" | "Pistolet" | "Mêlée";
}

export interface Arcane {
  name: string;
  urlName: string;
  rarity: "common" | "uncommon" | "rare";
}

// 1. Liste des Reliques Actives (Unvaulted) et Vaultées pour exemple
export const RELICS: Relic[] = [
  // Reliques de SEVAGOTH PRIME (100% actives et farmables en 2026)
  {
    era: "Lith",
    name: "C12",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Paris Prime Upper Limb", urlName: "paris_prime_upper_limb", rarity: "common" },
      { name: "Sevagoth Prime Blueprint", urlName: "sevagoth_prime_blueprint", rarity: "common" },
      { name: "Epitaph Prime Receiver", urlName: "epitaph_prime_receiver", rarity: "uncommon" },
      { name: "Corinth Prime Barrel", urlName: "corinth_prime_barrel", rarity: "uncommon" },
      { name: "Pangolin Prime Blade", urlName: "pangolin_prime_blade", rarity: "rare" }
    ]
  },
  {
    era: "Meso",
    name: "A7",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Spira Prime Blade", urlName: "spira_prime_blade", rarity: "common" },
      { name: "Sevagoth Prime Neuroptics", urlName: "sevagoth_prime_neuroptics", rarity: "common" },
      { name: "Epitaph Prime Barrel", urlName: "epitaph_prime_barrel", rarity: "uncommon" },
      { name: "Corinth Prime Blueprint", urlName: "corinth_prime_blueprint", rarity: "uncommon" },
      { name: "Pangolin Prime Blueprint", urlName: "pangolin_prime_blueprint", rarity: "rare" }
    ]
  },
  {
    era: "Neo",
    name: "A13",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Spira Prime Blueprint", urlName: "spira_prime_blueprint", rarity: "common" },
      { name: "Epitaph Prime String", urlName: "epitaph_prime_string", rarity: "common" },
      { name: "Sevagoth Prime Systems", urlName: "sevagoth_prime_systems", rarity: "uncommon" },
      { name: "Corinth Prime Stock", urlName: "corinth_prime_stock", rarity: "uncommon" },
      { name: "Pangolin Prime Handle", urlName: "pangolin_prime_handle", rarity: "rare" }
    ]
  },
  {
    era: "Axi",
    name: "S17",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Paris Prime Blueprint", urlName: "paris_prime_blueprint", rarity: "common" },
      { name: "Epitaph Prime Receiver", urlName: "epitaph_prime_receiver", rarity: "common" },
      { name: "Epitaph Prime Blueprint", urlName: "epitaph_prime_blueprint", rarity: "uncommon" },
      { name: "Corinth Prime Receiver", urlName: "corinth_prime_receiver", rarity: "uncommon" },
      { name: "Sevagoth Prime Chassis", urlName: "sevagoth_prime_chassis", rarity: "rare" }
    ]
  },
  // Reliques de GAUSS PRIME (Unvaulted et très populaires)
  {
    era: "Axi",
    name: "B7",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Paris Prime Lower Limb", urlName: "paris_prime_lower_limb", rarity: "common" },
      { name: "Corinth Prime Stock", urlName: "corinth_prime_stock", rarity: "common" },
      { name: "Acceltra Prime Barrel", urlName: "acceltra_prime_barrel", rarity: "uncommon" },
      { name: "Akarius Prime Receiver", urlName: "akarius_prime_receiver", rarity: "uncommon" },
      { name: "Gauss Prime Blueprint", urlName: "gauss_prime_blueprint", rarity: "rare" }
    ]
  },
  {
    era: "Neo",
    name: "W1",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Lex Prime Barrel", urlName: "lex_prime_barrel", rarity: "common" },
      { name: "Fang Prime Blade", urlName: "fang_prime_blade", rarity: "common" },
      { name: "Acceltra Prime Blueprint", urlName: "acceltra_prime_blueprint", rarity: "uncommon" },
      { name: "Akarius Prime Blueprint", urlName: "akarius_prime_blueprint", rarity: "uncommon" },
      { name: "Gauss Prime Chassis", urlName: "gauss_prime_chassis", rarity: "rare" }
    ]
  },
  // Relique en Prime Resurgence (exemple)
  {
    era: "Meso",
    name: "W4 (Wisp)",
    status: "Resurgence",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Burston Prime Barrel", urlName: "burston_prime_barrel", rarity: "common" },
      { name: "Orthos Prime Blade", urlName: "orthos_prime_blade", rarity: "common" },
      { name: "Wisp Prime Chassis Blueprint", urlName: "wisp_prime_chassis", rarity: "uncommon" },
      { name: "Wisp Prime Systems Blueprint", urlName: "wisp_prime_systems", rarity: "uncommon" },
      { name: "Wisp Prime Blueprint", urlName: "wisp_prime_blueprint", rarity: "rare" }
    ]
  },
  // Reliques Vaultées (Exemple d'affichage/filtrage)
  {
    era: "Lith",
    name: "S11 (Saryn)",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Braton Prime Stock", urlName: "braton_prime_stock", rarity: "common" },
      { name: "Paris Prime Upper Limb", urlName: "paris_prime_upper_limb", rarity: "common" },
      { name: "Spira Prime Blade", urlName: "spira_prime_blade", rarity: "uncommon" },
      { name: "Saryn Prime Chassis Blueprint", urlName: "saryn_prime_chassis", rarity: "uncommon" },
      { name: "Saryn Prime Blueprint", urlName: "saryn_prime_blueprint", rarity: "rare" }
    ]
  },
  {
    era: "Neo",
    name: "V10 (Volt)",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Lex Prime Barrel", urlName: "lex_prime_barrel", rarity: "common" },
      { name: "Fang Prime Blade", urlName: "fang_prime_blade", rarity: "common" },
      { name: "Volt Prime Neuroptics Blueprint", urlName: "volt_prime_neuroptics", rarity: "uncommon" },
      { name: "Volt Prime Chassis Blueprint", urlName: "volt_prime_chassis", rarity: "uncommon" },
      { name: "Volt Prime Blueprint", urlName: "volt_prime_blueprint", rarity: "rare" }
    ]
  }
];

// 2. Les 24 Mods Corrompus
export const CORRUPTED_MODS: CorruptedMod[] = [
  { name: "Overextended", urlName: "overextended", category: "Warframe" },
  { name: "Transient Fortitude", urlName: "transient_fortitude", category: "Warframe" },
  { name: "Fleeting Expertise", urlName: "fleeting_expertise", category: "Warframe" },
  { name: "Blind Rage", urlName: "blind_rage", category: "Warframe" },
  { name: "Narrow Minded", urlName: "narrow_minded", category: "Warframe" },
  { name: "Critical Deceleration", urlName: "critical_deceleration", category: "Fusil" },
  { name: "Creeping Bullseye", urlName: "creeping_bullseye", category: "Pistolet" },
  { name: "Vile Acceleration", urlName: "vile_acceleration", category: "Fusil" },
  { name: "Depleted Reload", urlName: "depleted_reload", category: "Fusil" },
  { name: "Vicious Spread", urlName: "vicious_spread", category: "Fusil" },
  { name: "Tainted Mag", urlName: "tainted_mag", category: "Fusil" },
  { name: "Frail Momentum", urlName: "frail_momentum", category: "Fusil" },
  { name: "Anemic Agility", urlName: "anemic_agility", category: "Pistolet" },
  { name: "Magnum Force", urlName: "magnum_force", category: "Pistolet" },
  { name: "Hollow Point", urlName: "hollow_point", category: "Pistolet" },
  { name: "Tainted Clip", urlName: "tainted_clip", category: "Pistolet" },
  { name: "Corrupt Charge", urlName: "corrupt_charge", category: "Mêlée" },
  { name: "Spoiled Strike", urlName: "spoiled_strike", category: "Mêlée" },
  { name: "Heavy Trauma", urlName: "heavy_trauma", category: "Mêlée" },
  { name: "Tainted Shell", urlName: "tainted_shell", category: "Fusil" },
  { name: "Critical Delay", urlName: "critical_delay", category: "Fusil" },
  { name: "Burdened Magazine", urlName: "burdened_magazine", category: "Fusil" },
  { name: "Target Acquired", urlName: "target_acquired", category: "Pistolet" },
  { name: "Bane of Corrupted", urlName: "bane_of_corrupted", category: "Mêlée" }
];

// 3. Arcanes d'Eidolons
export const EIDOLON_ARCANES = {
  teralyst: [
    { name: "Arcane Nullifier", urlName: "arcane_nullifier", rarity: "common" as const },
    { name: "Arcane Warmth", urlName: "arcane_warmth", rarity: "common" as const },
    { name: "Arcane Deflection", urlName: "arcane_deflection", rarity: "common" as const },
    { name: "Arcane Ice", urlName: "arcane_ice", rarity: "common" as const },
    { name: "Arcane Healing", urlName: "arcane_healing", rarity: "common" as const },
    { name: "Arcane Resistance", urlName: "arcane_resistance", rarity: "common" as const }
  ],
  gantulyst: [
    { name: "Arcane Guardian", urlName: "arcane_guardian", rarity: "uncommon" as const },
    { name: "Arcane Strike", urlName: "arcane_strike", rarity: "uncommon" as const },
    { name: "Arcane Fury", urlName: "arcane_fury", rarity: "uncommon" as const },
    { name: "Arcane Precision", urlName: "arcane_precision", rarity: "uncommon" as const },
    { name: "Arcane Velocity", urlName: "arcane_velocity", rarity: "uncommon" as const },
    { name: "Arcane Nullifier", urlName: "arcane_nullifier", rarity: "common" as const },
    { name: "Arcane Deflection", urlName: "arcane_deflection", rarity: "common" as const }
  ],
  hydrolyst: [
    { name: "Arcane Energize", urlName: "arcane_energize", rarity: "rare" as const },
    { name: "Arcane Grace", urlName: "arcane_grace", rarity: "rare" as const },
    { name: "Arcane Barrier", urlName: "arcane_barrier", rarity: "rare" as const },
    { name: "Arcane Aegis", urlName: "arcane_aegis", rarity: "uncommon" as const },
    { name: "Arcane Trickery", urlName: "arcane_trickery", rarity: "uncommon" as const },
    { name: "Arcane Guardian", urlName: "arcane_guardian", rarity: "uncommon" as const },
    { name: "Arcane Strike", urlName: "arcane_strike", rarity: "uncommon" as const }
  ]
};

// 4. Données de contrats (Bounties) de Syndicats
export interface SyndicateBounty {
  name: string;
  standingReward: number;
  runTimeMinutes: number;
  exchangeArcanes: { name: string; urlName: string; cost: number }[];
  directDrops: { name: string; urlName: string; chance: number }[];
}

export const SYNDICATE_BOUNTIES: SyndicateBounty[] = [
  {
    name: "Les Imposteurs (Zariman - Bounties)",
    standingReward: 5000,
    runTimeMinutes: 5,
    exchangeArcanes: [
      { name: "Molt Augmented", urlName: "molt_augmented", cost: 10000 },
      { name: "Molt Efficiency", urlName: "molt_efficiency", cost: 10000 },
      { name: "Molt Reconstruct", urlName: "molt_reconstruct", cost: 10000 }
    ],
    directDrops: [
      { name: "Gyre Blueprint", urlName: "gyre_blueprint", chance: 0.12 },
      { name: "Void Thrax Plasm", urlName: "void_thrax_plasm", chance: 0.3 }
    ]
  },
  {
    name: "Sanctum Anatomica (Cavia - Bounties)",
    standingReward: 7500,
    runTimeMinutes: 6,
    exchangeArcanes: [
      { name: "Melee Influence", urlName: "melee_influence", cost: 7500 },
      { name: "Melee Exposure", urlName: "melee_exposure", cost: 7500 },
      { name: "Melee Animosity", urlName: "melee_animosity", cost: 7500 }
    ],
    directDrops: [
      { name: "Melee Crescendo", urlName: "melee_crescendo", chance: 0.05 },
      { name: "Melee Duplicate", urlName: "melee_duplicate", chance: 0.05 }
    ]
  }
];

// 5. Nouvelles Données de Farms de Mods (Arbitrage, Steel Path, Mises à prix de Mods)
export interface ModFarmItem {
  name: string;
  urlName: string;
  chance: number;
  cost?: number; // Coût en monnaie d'activité (Vitus / Steel Essence)
}

export interface ModFarmActivity {
  id: string;
  name: string;
  description: string;
  currencyName: string;
  currencyUrlName?: string; // Si échangeable (ex: Steel Essence pour Relic Packs)
  runTimeMinutes: number;
  rewards: ModFarmItem[];
}

export const MOD_FARM_ACTIVITIES: ModFarmActivity[] = [
  {
    id: "arbitration",
    name: "Arbitrages (Alerte Spéciale)",
    description: "Survivez aux missions d'Arbitrage pour obtenir de l'Essence Vitus sur les drones et acheter des mods Galvanisés.",
    currencyName: "Essence Vitus",
    runTimeMinutes: 20, // 20 minutes typiques de run
    rewards: [
      { name: "Galvanized Chamber", urlName: "galvanized_chamber", chance: 1.0, cost: 20 },
      { name: "Galvanized Diffusion", urlName: "galvanized_diffusion", chance: 1.0, cost: 20 },
      { name: "Galvanized Hell", urlName: "galvanized_hell", chance: 1.0, cost: 20 },
      { name: "Adaptation (Drop direct 2.5%)", urlName: "adaptation", chance: 0.025 },
      { name: "Rolling Guard (Drop direct 2.0%)", urlName: "rolling_guard", chance: 0.02 }
    ]
  },
  {
    id: "steel_path",
    name: "Steel Path Survival (Acolytes)",
    description: "Affrontez les Acolytes qui apparaissent toutes les 4-5 minutes en Steel Path pour obtenir de l'Essence d'Acier et des Arcanes.",
    currencyName: "Essence d'Acier",
    currencyUrlName: "steel_essence",
    runTimeMinutes: 30, // 30 minutes de run SP
    rewards: [
      { name: "Primary Merciless (Arcane Drop)", urlName: "primary_merciless", chance: 0.4 },
      { name: "Secondary Merciless (Arcane Drop)", urlName: "secondary_merciless", chance: 0.3 },
      { name: "Relic Pack (Teshin - 15 Essences)", urlName: "relic_pack", chance: 1.0, cost: 15 } // Reliques converties en valeur moyenne de PL
    ]
  },
  {
    id: "plains_bounty",
    name: "Mises à prix Cetus (Plaines d'Eidolon)",
    description: "Réalisez les contrats de niveau 30-50 dans les Plaines pour obtenir des mods rares des ensembles Gladiator et Vigilante.",
    currencyName: "Récompenses directes",
    runTimeMinutes: 8,
    rewards: [
      { name: "Gladiator Might", urlName: "gladiator_might", chance: 0.125 },
      { name: "Augur Secrets", urlName: "augur_secrets", chance: 0.025 },
      { name: "Vigilante Armaments", urlName: "vigilante_armaments", chance: 0.18 }
    ]
  }
];
