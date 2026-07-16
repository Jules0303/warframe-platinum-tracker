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
  source: string;
}

// 1. Base de données étendue de reliques (+ de 20 reliques avec des drops réels)
export const RELICS: Relic[] = [
  // SEVAGOTH PRIME (Actif - Unvaulted)
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
  
  // GAUSS PRIME (Actif - Unvaulted)
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

  // REVENANT PRIME (Actif - Unvaulted)
  {
    era: "Lith",
    name: "R11",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Tatsu Prime Handle", urlName: "tatsu_prime_handle", rarity: "common" },
      { name: "Revenant Prime Chassis", urlName: "revenant_prime_chassis", rarity: "common" },
      { name: "Phantasma Prime Receiver", urlName: "phantasma_prime_receiver", rarity: "uncommon" },
      { name: "Revenant Prime Systems", urlName: "revenant_prime_systems", rarity: "uncommon" },
      { name: "Revenant Prime Blueprint", urlName: "revenant_prime_blueprint", rarity: "rare" }
    ]
  },
  {
    era: "Meso",
    name: "R6",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Tatsu Prime Blueprint", urlName: "tatsu_prime_blueprint", rarity: "common" },
      { name: "Phantasma Prime Stock", urlName: "phantasma_prime_stock", rarity: "common" },
      { name: "Revenant Prime Neuroptics", urlName: "revenant_prime_neuroptics", rarity: "uncommon" },
      { name: "Phantasma Prime Blueprint", urlName: "phantasma_prime_blueprint", rarity: "uncommon" },
      { name: "Revenant Prime Blueprint", urlName: "revenant_prime_blueprint", rarity: "rare" }
    ]
  },

  // WISP PRIME (Resurgence)
  {
    era: "Meso",
    name: "W4",
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
  {
    era: "Lith",
    name: "W3",
    status: "Resurgence",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Orthos Prime Blueprint", urlName: "orthos_prime_blueprint", rarity: "common" },
      { name: "Burston Prime Stock", urlName: "burston_prime_stock", rarity: "common" },
      { name: "Wisp Prime Neuroptics Blueprint", urlName: "wisp_prime_neuroptics", rarity: "uncommon" },
      { name: "Fulmin Prime Barrel", urlName: "fulmin_prime_barrel", rarity: "uncommon" },
      { name: "Wisp Prime Blueprint", urlName: "wisp_prime_blueprint", rarity: "rare" }
    ]
  },

  // PROTEA PRIME (Actif - Unvaulted)
  {
    era: "Lith",
    name: "P9",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Velox Prime Blueprint", urlName: "velox_prime_blueprint", rarity: "common" },
      { name: "Protea Prime Neuroptics", urlName: "protea_prime_neuroptics", rarity: "common" },
      { name: "Okina Prime Blade", urlName: "okina_prime_blade", rarity: "uncommon" },
      { name: "Protea Prime Systems", urlName: "protea_prime_systems", rarity: "uncommon" },
      { name: "Protea Prime Blueprint", urlName: "protea_prime_blueprint", rarity: "rare" }
    ]
  },
  {
    era: "Axi",
    name: "P11",
    status: "Unvaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Okina Prime Blueprint", urlName: "okina_prime_blueprint", rarity: "common" },
      { name: "Velox Prime Barrel", urlName: "velox_prime_barrel", rarity: "common" },
      { name: "Okina Prime Handle", urlName: "okina_prime_handle", rarity: "uncommon" },
      { name: "Velox Prime Receiver", urlName: "velox_prime_receiver", rarity: "uncommon" },
      { name: "Protea Prime Chassis", urlName: "protea_prime_chassis", rarity: "rare" }
    ]
  },

  // HILDRYN PRIME (Vaulted)
  {
    era: "Lith",
    name: "H9",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Larkspur Prime Blueprint", urlName: "larkspur_prime_blueprint", rarity: "common" },
      { name: "Hildryn Prime Chassis", urlName: "hildryn_prime_chassis", rarity: "common" },
      { name: "Larkspur Prime Barrel", urlName: "larkspur_prime_barrel", rarity: "uncommon" },
      { name: "Shade Prime Systems", urlName: "shade_prime_systems", rarity: "uncommon" },
      { name: "Hildryn Prime Blueprint", urlName: "hildryn_prime_blueprint", rarity: "rare" }
    ]
  },
  {
    era: "Meso",
    name: "H5",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Shade Prime Blueprint", urlName: "shade_prime_blueprint", rarity: "common" },
      { name: "Hildryn Prime Neuroptics", urlName: "hildryn_prime_neuroptics", rarity: "common" },
      { name: "Larkspur Prime Stock", urlName: "larkspur_prime_stock", rarity: "uncommon" },
      { name: "Hildryn Prime Systems", urlName: "hildryn_prime_systems", rarity: "uncommon" },
      { name: "Shade Prime Burst Laser Receiver", urlName: "shade_prime_burst_laser_receiver", rarity: "rare" }
    ]
  },

  // KHORA PRIME (Vaulted)
  {
    era: "Meso",
    name: "K11",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Hystrix Prime Barrel", urlName: "hystrix_prime_barrel", rarity: "common" },
      { name: "Khora Prime Neuroptics", urlName: "khora_prime_neuroptics", rarity: "common" },
      { name: "Dual Keres Prime Blueprint", urlName: "dual_keres_prime_blueprint", rarity: "uncommon" },
      { name: "Khora Prime Chassis", urlName: "khora_prime_chassis", rarity: "uncommon" },
      { name: "Khora Prime Blueprint", urlName: "khora_prime_blueprint", rarity: "rare" }
    ]
  },
  {
    era: "Neo",
    name: "K5",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Hystrix Prime Blueprint", urlName: "hystrix_prime_blueprint", rarity: "common" },
      { name: "Khora Prime Systems", urlName: "khora_prime_systems", rarity: "common" },
      { name: "Dual Keres Prime Handle", urlName: "dual_keres_prime_handle", rarity: "uncommon" },
      { name: "Hystrix Prime Receiver", urlName: "hystrix_prime_receiver", rarity: "uncommon" },
      { name: "Dual Keres Prime Blade", urlName: "dual_keres_prime_blade", rarity: "rare" }
    ]
  },

  // BARUUK PRIME (Vaulted)
  {
    era: "Neo",
    name: "B8",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Afentis Prime Blueprint", urlName: "afentis_prime_blueprint", rarity: "common" },
      { name: "Baruuk Prime Neuroptics", urlName: "baruuk_prime_neuroptics", rarity: "common" },
      { name: "Cobra & Crane Prime Blueprint", urlName: "cobra_crane_prime_blueprint", rarity: "uncommon" },
      { name: "Baruuk Prime Systems", urlName: "baruuk_prime_systems", rarity: "uncommon" },
      { name: "Baruuk Prime Blueprint", urlName: "baruuk_prime_blueprint", rarity: "rare" }
    ]
  },

  // WUKONG PRIME (Vaulted)
  {
    era: "Lith",
    name: "W2",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Zhuge Prime Barrel", urlName: "zhuge_prime_barrel", rarity: "common" },
      { name: "Wukong Prime Neuroptics", urlName: "wukong_prime_neuroptics", rarity: "common" },
      { name: "Zhuge Prime Blueprint", urlName: "zhuge_prime_blueprint", rarity: "uncommon" },
      { name: "Wukong Prime Systems", urlName: "wukong_prime_systems", rarity: "uncommon" },
      { name: "Wukong Prime Blueprint", urlName: "wukong_prime_blueprint", rarity: "rare" }
    ]
  },

  // SARYN PRIME (Vaulted)
  {
    era: "Lith",
    name: "S11",
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
  
  // VOLT PRIME (Vaulted)
  {
    era: "Neo",
    name: "V10",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Lex Prime Barrel", urlName: "lex_prime_barrel", rarity: "common" },
      { name: "Fang Prime Blade", urlName: "fang_prime_blade", rarity: "common" },
      { name: "Volt Prime Neuroptics Blueprint", urlName: "volt_prime_neuroptics", rarity: "uncommon" },
      { name: "Volt Prime Chassis Blueprint", urlName: "volt_prime_chassis", rarity: "uncommon" },
      { name: "Volt Prime Blueprint", urlName: "volt_prime_blueprint", rarity: "rare" }
    ]
  },

  // NEKROS PRIME (Vaulted)
  {
    era: "Axi",
    name: "N10",
    status: "Vaulted",
    drops: [
      { name: "Forma Blueprint", urlName: "forma_blueprint", rarity: "common" },
      { name: "Dakra Prime Blade", urlName: "dakra_prime_blade", rarity: "common" },
      { name: "Carrier Prime Systems Blueprint", urlName: "carrier_prime_systems", rarity: "common" },
      { name: "Nekros Prime Systems Blueprint", urlName: "nekros_prime_systems", rarity: "uncommon" },
      { name: "Nekros Prime Neuroptics Blueprint", urlName: "nekros_prime_neuroptics", rarity: "uncommon" },
      { name: "Nekros Prime Blueprint", urlName: "nekros_prime_blueprint", rarity: "rare" }
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

// 3. Modèles d'Arcanes (utilisés pour l'onglet dédié)
export const ARCANES: Arcane[] = [
  // Eidolons
  { name: "Arcane Energize", urlName: "arcane_energize", rarity: "rare", source: "Eidolons" },
  { name: "Arcane Grace", urlName: "arcane_grace", rarity: "rare", source: "Eidolons" },
  { name: "Arcane Barrier", urlName: "arcane_barrier", rarity: "rare", source: "Eidolons" },
  { name: "Arcane Aegis", urlName: "arcane_aegis", rarity: "uncommon", source: "Eidolons" },
  { name: "Arcane Guardian", urlName: "arcane_guardian", rarity: "uncommon", source: "Eidolons" },
  { name: "Arcane Strike", urlName: "arcane_strike", rarity: "uncommon", source: "Eidolons" },
  { name: "Arcane Fury", urlName: "arcane_fury", rarity: "uncommon", source: "Eidolons" },
  { name: "Arcane Precision", urlName: "arcane_precision", rarity: "uncommon", source: "Eidolons" },
  { name: "Arcane Velocity", urlName: "arcane_velocity", rarity: "uncommon", source: "Eidolons" },
  { name: "Arcane Trickery", urlName: "arcane_trickery", rarity: "uncommon", source: "Eidolons" },
  { name: "Arcane Nullifier", urlName: "arcane_nullifier", rarity: "common", source: "Eidolons" },
  { name: "Arcane Deflection", urlName: "arcane_deflection", rarity: "common", source: "Eidolons" },
  { name: "Arcane Warmth", urlName: "arcane_warmth", rarity: "common", source: "Eidolons" },
  { name: "Arcane Ice", urlName: "arcane_ice", rarity: "common", source: "Eidolons" },
  { name: "Arcane Healing", urlName: "arcane_healing", rarity: "common", source: "Eidolons" },
  { name: "Arcane Resistance", urlName: "arcane_resistance", rarity: "common", source: "Eidolons" },

  // Zariman (Holdfasts)
  { name: "Molt Augmented", urlName: "molt_augmented", rarity: "uncommon", source: "Zariman" },
  { name: "Molt Efficiency", urlName: "molt_efficiency", rarity: "uncommon", source: "Zariman" },
  { name: "Molt Reconstruct", urlName: "molt_reconstruct", rarity: "common", source: "Zariman" },

  // Cavia (Albrecht's Laboratories)
  { name: "Melee Influence", urlName: "melee_influence", rarity: "common", source: "Cavia" },
  { name: "Melee Exposure", urlName: "melee_exposure", rarity: "common", source: "Cavia" },
  { name: "Melee Animosity", urlName: "melee_animosity", rarity: "common", source: "Cavia" },
  { name: "Melee Crescendo", urlName: "melee_crescendo", rarity: "rare", source: "Cavia" },
  { name: "Melee Duplicate", urlName: "melee_duplicate", rarity: "rare", source: "Cavia" },

  // Fortuna (Vox Solaris)
  { name: "Magus Lockdown", urlName: "magus_lockdown", rarity: "rare", source: "Fortuna" },
  { name: "Magus Melt", urlName: "magus_melt", rarity: "uncommon", source: "Fortuna" },
  
  // Cetus (Quills)
  { name: "Magus Elevate", urlName: "magus_elevate", rarity: "rare", source: "Cetus" },
  { name: "Magus Husk", urlName: "magus_husk", rarity: "uncommon", source: "Cetus" },

  // Steel Path
  { name: "Primary Merciless", urlName: "primary_merciless", rarity: "common", source: "Steel Path" },
  { name: "Secondary Merciless", urlName: "secondary_merciless", rarity: "common", source: "Steel Path" }
];

export const EIDOLON_ARCANES = {
  teralyst: ARCANES.filter(a => a.source === "Eidolons" && a.rarity === "common"),
  gantulyst: ARCANES.filter(a => a.source === "Eidolons" && (a.rarity === "common" || a.rarity === "uncommon") && a.name !== "Arcane Aegis" && a.name !== "Arcane Trickery"),
  hydrolyst: ARCANES.filter(a => a.source === "Eidolons")
};

// 4. Comparateur de Syndicats
export interface Syndicate {
  id: string;
  name: string;
  category: "Classique" | "Monde Ouvert";
  maxStanding: number;
  exchangeItems: { name: string; urlName: string; cost: number }[];
}

export const SYNDICATES: Syndicate[] = [
  // 6 Syndicats de Base (Classiques)
  {
    id: "steel_meridian",
    name: "Méridien d'Acier (Steel Meridian)",
    category: "Classique",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Mesa Waltz (Mod d'Augmentation)", urlName: "mesa_waltz", cost: 25000 },
      { name: "Justice Blades (Mod d'Augmentation)", urlName: "justice_blades", cost: 25000 },
      { name: "Scatter Justice (Mod d'Augmentation)", urlName: "scatter_justice", cost: 25000 },
      { name: "Acid Shells (Mod d'Augmentation)", urlName: "acid_shells", cost: 25000 },
      { name: "Vaykor Marelok (Arme de Syndicat)", urlName: "vaykor_marelok", cost: 100000 },
      { name: "Vaykor Hek (Arme de Syndicat)", urlName: "vaykor_hek", cost: 100000 },
      { name: "Vaykor Sydon (Arme de Syndicat)", urlName: "vaykor_sydon", cost: 125000 },
      { name: "Fluctus Limb (Archwing)", urlName: "fluctus_limb", cost: 20000 },
      { name: "Fluctus Stock (Archwing)", urlName: "fluctus_stock", cost: 20000 },
      { name: "Centaur Blade (Archwing)", urlName: "centaur_blade", cost: 20000 },
      { name: "Rathbone Head (Archwing)", urlName: "rathbone_head", cost: 20000 }
    ]
  },
  {
    id: "arbiters_hexis",
    name: "Arbitres de Hexis (Arbiters of Hexis)",
    category: "Classique",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Seeking Shuriken (Mod d'Augmentation)", urlName: "seeking_shuriken", cost: 25000 },
      { name: "Accumulating Whipclaw (Mod d'Augmentation)", urlName: "accumulating_whipclaw", cost: 25000 },
      { name: "Phoenix Renewal (Mod d'Augmentation)", urlName: "phoenix_renewal", cost: 25000 },
      { name: "Chilling Globe (Mod d'Augmentation)", urlName: "chilling_globe", cost: 25000 },
      { name: "Telos Boltace (Arme de Syndicat)", urlName: "telos_boltace", cost: 100000 },
      { name: "Telos Akbolto (Arme de Syndicat)", urlName: "telos_akbolto", cost: 100000 },
      { name: "Telos Boltor (Arme de Syndicat)", urlName: "telos_boltor", cost: 125000 },
      { name: "Cyngas Receiver (Archwing)", urlName: "cyngas_receiver", cost: 20000 },
      { name: "Cyngas Stock (Archwing)", urlName: "cyngas_stock", cost: 20000 },
      { name: "Centaur Aegis (Archwing)", urlName: "centaur_aegis", cost: 20000 },
      { name: "Onorix Handle (Archwing)", urlName: "onorix_handle", cost: 20000 }
    ]
  },
  {
    id: "cephalon_suda",
    name: "Céphalon Suda (Cephalon Suda)",
    category: "Classique",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Resonance (Mod d'Augmentation)", urlName: "resonance", cost: 25000 },
      { name: "Chilling Globe (Mod d'Augmentation)", urlName: "chilling_globe", cost: 25000 },
      { name: "Pilfering Strangledome (Mod d'Augmentation)", urlName: "pilfering_strangledome", cost: 25000 },
      { name: "Counter Pulse (Mod d'Augmentation)", urlName: "counter_pulse", cost: 25000 },
      { name: "Synoid Gammacor (Arme de Syndicat)", urlName: "synoid_gammacor", cost: 100000 },
      { name: "Synoid Heliocor (Arme de Syndicat)", urlName: "synoid_heliocor", cost: 100000 },
      { name: "Synoid Simulor (Arme de Syndicat)", urlName: "synoid_simulor", cost: 125000 },
      { name: "Fluctus Barrel (Archwing)", urlName: "fluctus_barrel", cost: 20000 },
      { name: "Cyngas Stock (Archwing)", urlName: "cyngas_stock", cost: 20000 },
      { name: "Velocitus Barrel (Archwing)", urlName: "velocitus_barrel", cost: 20000 },
      { name: "Veritux Blade (Archwing)", urlName: "veritux_blade", cost: 20000 }
    ]
  },
  {
    id: "perrin_sequence",
    name: "Séquence Perrin (Perrin Sequence)",
    category: "Classique",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Eternal War (Mod d'Augmentation)", urlName: "eternal_war", cost: 25000 },
      { name: "Chaos Sphere (Mod d'Augmentation)", urlName: "chaos_sphere", cost: 25000 },
      { name: "Despoil (Mod d'Augmentation)", urlName: "despoil", cost: 25000 },
      { name: "Abating Link (Mod d'Augmentation)", urlName: "abating_link", cost: 25000 },
      { name: "Secura Penta (Arme de Syndicat)", urlName: "secura_penta", cost: 100000 },
      { name: "Secura Dual Cestra (Arme de Syndicat)", urlName: "secura_dual_cestra", cost: 100000 },
      { name: "Secura Lecta (Arme de Syndicat)", urlName: "secura_lecta", cost: 125000 },
      { name: "Fluctus Limb (Archwing)", urlName: "fluctus_limb", cost: 20000 },
      { name: "Fluctus Stock (Archwing)", urlName: "fluctus_stock", cost: 20000 },
      { name: "Centaur Blade (Archwing)", urlName: "centaur_blade", cost: 20000 },
      { name: "Kaszas Blade (Archwing)", urlName: "kaszas_blade", cost: 20000 }
    ]
  },
  {
    id: "red_veil",
    name: "Voile Rouge (Red Veil)",
    category: "Classique",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Despoil (Mod d'Augmentation)", urlName: "despoil", cost: 25000 },
      { name: "Mesa Waltz (Mod d'Augmentation)", urlName: "mesa_waltz", cost: 25000 },
      { name: "Seeking Shuriken (Mod d'Augmentation)", urlName: "seeking_shuriken", cost: 25000 },
      { name: "Therapeutic Sentry (Mod d'Augmentation)", urlName: "therapeutic_sentry", cost: 25000 },
      { name: "Rakta Cernos (Arme de Syndicat)", urlName: "rakta_cernos", cost: 100000 },
      { name: "Rakta Ballistica (Arme de Syndicat)", urlName: "rakta_ballistica", cost: 100000 },
      { name: "Rakta Dark Dagger (Arme de Syndicat)", urlName: "rakta_dark_dagger", cost: 125000 },
      { name: "Cyngas Receiver (Archwing)", urlName: "cyngas_receiver", cost: 20000 },
      { name: "Phaedra Stock (Archwing)", urlName: "phaedra_stock", cost: 20000 },
      { name: "Onorix Blade (Archwing)", urlName: "onorix_blade", cost: 20000 },
      { name: "Kaszas Handle (Archwing)", urlName: "kaszas_handle", cost: 20000 }
    ]
  },
  {
    id: "new_loka",
    name: "Nouveau Loka (New Loka)",
    category: "Classique",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Pilfering Swarm (Mod d'Augmentation)", urlName: "pilfering_swarm", cost: 25000 },
      { name: "Vampiric Leech (Mod d'Augmentation)", urlName: "vampiric_leech", cost: 25000 },
      { name: "Abating Link (Mod d'Augmentation)", urlName: "abating_link", cost: 25000 },
      { name: "Phoenix Renewal (Mod d'Augmentation)", urlName: "phoenix_renewal", cost: 25000 },
      { name: "Sancti Tigris (Arme de Syndicat)", urlName: "sancti_tigris", cost: 100000 },
      { name: "Sancti Castanas (Arme de Syndicat)", urlName: "sancti_castanas", cost: 100000 },
      { name: "Sancti Magistar (Arme de Syndicat)", urlName: "sancti_magistar", cost: 125000 },
      { name: "Phaedra Barrel (Archwing)", urlName: "phaedra_barrel", cost: 20000 },
      { name: "Decurion Receiver (Archwing)", urlName: "dual_decurion_receiver", cost: 20000 },
      { name: "Agkuza Blade (Archwing)", urlName: "agkuza_blade", cost: 20000 },
      { name: "Rathbone Handle (Archwing)", urlName: "rathbone_handle", cost: 20000 }
    ]
  },
  // Syndicats de Mondes Ouverts
  {
    id: "ostron",
    name: "Ostron (Cetus)",
    category: "Monde Ouvert",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Magus Elevate (Arcane)", urlName: "magus_elevate", cost: 10000 },
      { name: "Magus Husk (Arcane)", urlName: "magus_husk", cost: 10000 },
      { name: "Virtuos Tempo (Arcane d'Ampli)", urlName: "virtuos_tempo", cost: 10000 },
      { name: "Virtuos Fury (Arcane d'Ampli)", urlName: "virtuos_fury", cost: 10000 },
      { name: "Virtuos Strike (Arcane d'Ampli)", urlName: "virtuos_strike", cost: 10000 },
      { name: "Virtuos Ghost (Arcane d'Ampli)", urlName: "virtuos_ghost", cost: 10000 },
      { name: "Virtuos Shadow (Arcane d'Ampli)", urlName: "virtuos_shadow", cost: 10000 },
      { name: "Magus Vigor (Arcane)", urlName: "magus_vigor", cost: 10000 },
      { name: "Magus Cadence (Arcane)", urlName: "magus_cadence", cost: 10000 },
      { name: "Magus Replenish (Arcane)", urlName: "magus_replenish", cost: 10000 },
      { name: "Magus Cloud (Arcane)", urlName: "magus_cloud", cost: 10000 }
    ]
  },
  {
    id: "solaris_united",
    name: "Solaris Uni (Fortuna / Vox)",
    category: "Monde Ouvert",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Magus Lockdown (Arcane)", urlName: "magus_lockdown", cost: 10000 },
      { name: "Magus Melt (Arcane)", urlName: "magus_melt", cost: 10000 },
      { name: "Magus Repair (Arcane)", urlName: "magus_repair", cost: 10000 },
      { name: "Magus Anomaly (Arcane)", urlName: "magus_anomaly", cost: 10000 },
      { name: "Magus Drive (Arcane)", urlName: "magus_drive", cost: 10000 },
      { name: "Magus Firewall (Arcane)", urlName: "magus_firewall", cost: 10000 },
      { name: "Virtuos Trojan (Arcane d'Ampli)", urlName: "virtuos_trojan", cost: 10000 },
      { name: "Virtuos Surge (Arcane d'Ampli)", urlName: "virtuos_surge", cost: 10000 },
      { name: "Virtuos Forge (Arcane d'Ampli)", urlName: "virtuos_forge", cost: 10000 },
      { name: "Virtuos Spike (Arcane d'Ampli)", urlName: "virtuos_spike", cost: 10000 },
      { name: "Pax Bolt (Arcane Kitgun)", urlName: "pax_bolt", cost: 20000 },
      { name: "Pax Charge (Arcane Kitgun)", urlName: "pax_charge", cost: 20000 },
      { name: "Pax Soar (Arcane Kitgun)", urlName: "pax_soar", cost: 20000 },
      { name: "Pax Seeker (Arcane Kitgun)", urlName: "pax_seeker", cost: 20000 }
    ]
  },
  {
    id: "holdfasts",
    name: "Plumes (Zariman)",
    category: "Monde Ouvert",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Molt Augmented (Arcane)", urlName: "molt_augmented", cost: 10000 },
      { name: "Molt Efficiency (Arcane)", urlName: "molt_efficiency", cost: 10000 },
      { name: "Molt Reconstruct (Arcane)", urlName: "molt_reconstruct", cost: 10000 },
      { name: "Molt Vigor (Arcane)", urlName: "molt_vigor", cost: 10000 },
      { name: "Emergence Dissipate (Arcane)", urlName: "emergence_dissipate", cost: 10000 },
      { name: "Emergence Savior (Arcane)", urlName: "emergence_savior", cost: 10000 },
      { name: "Emergence Renew (Arcane)", urlName: "emergence_renew", cost: 10000 },
      { name: "Fractal Reset (Arcane)", urlName: "fractal_reset", cost: 10000 },
      { name: "Cascadia Flare (Arcane)", urlName: "cascadia_flare", cost: 10000 },
      { name: "Cascadia Overcharge (Arcane)", urlName: "cascadia_overcharge", cost: 10000 },
      { name: "Cascadia Empowered (Arcane)", urlName: "cascadia_empowered", cost: 10000 },
      { name: "Cascadia Accuracy (Arcane)", urlName: "cascadia_accuracy", cost: 10000 }
    ]
  },
  {
    id: "cavia",
    name: "Cavia (Deimos)",
    category: "Monde Ouvert",
    maxStanding: 132000,
    exchangeItems: [
      { name: "Melee Influence (Arcane)", urlName: "melee_influence", cost: 7500 },
      { name: "Melee Exposure (Arcane)", urlName: "melee_exposure", cost: 7500 },
      { name: "Melee Animosity (Arcane)", urlName: "melee_animosity", cost: 7500 },
      { name: "Melee Retaliation (Arcane)", urlName: "melee_retaliation", cost: 7500 },
      { name: "Melee Fortification (Arcane)", urlName: "melee_fortification", cost: 7500 },
      { name: "Melee Vortex (Arcane)", urlName: "melee_vortex", cost: 7500 }
    ]
  }
];

// 5. Farms de Mods
export interface ModFarmItem {
  name: string;
  urlName: string;
  chance: number;
  cost?: number;
}

export interface ModFarmActivity {
  id: string;
  name: string;
  description: string;
  currencyName: string;
  currencyUrlName?: string;
  runTimeMinutes: number;
  rewards: ModFarmItem[];
}

export const MOD_FARM_ACTIVITIES: ModFarmActivity[] = [
  {
    id: "arbitration",
    name: "Arbitrages (Alerte Spéciale)",
    description: "Survivez aux missions d'Arbitrage pour obtenir de l'Essence Vitus sur les drones et acheter des mods Galvanisés.",
    currencyName: "Essence Vitus",
    runTimeMinutes: 20,
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
    runTimeMinutes: 30,
    rewards: [
      { name: "Primary Merciless (Arcane Drop)", urlName: "primary_merciless", chance: 0.4 },
      { name: "Secondary Merciless (Arcane Drop)", urlName: "secondary_merciless", chance: 0.3 },
      { name: "Relic Pack (Teshin - 15 Essences)", urlName: "relic_pack", chance: 1.0, cost: 15 }
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
