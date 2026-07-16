// Service de communication avec l'API Warframe.market
// Gère le cache en localstorage et respecte la limite de requêtes (3 req/s max)

export interface CachedPrice {
  price: number;
  timestamp: number;
}

// Prix par défaut réalistes en cas de panne d'API ou de chargement initial
export const FALLBACK_PRICES: Record<string, number> = {
  // Reliques & Prime Parts (Sevagoth / Gauss)
  "sevagoth_prime_blueprint": 20,
  "sevagoth_prime_neuroptics": 15,
  "sevagoth_prime_systems": 18,
  "sevagoth_prime_chassis": 40,
  "gauss_prime_blueprint": 35,
  "gauss_prime_chassis": 30,
  "gauss_prime_systems": 15,
  "gauss_prime_neuroptics": 15,
  "epitaph_prime_receiver": 15,
  "epitaph_prime_barrel": 10,
  "epitaph_prime_blueprint": 15,
  "epitaph_prime_string": 6,
  "paris_prime_upper_limb": 2,
  "paris_prime_lower_limb": 2,
  "paris_prime_blueprint": 2,
  "corinth_prime_barrel": 4,
  "corinth_prime_blueprint": 5,
  "corinth_prime_stock": 4,
  "corinth_prime_receiver": 4,
  "pangolin_prime_blade": 10,
  "pangolin_prime_blueprint": 10,
  "pangolin_prime_handle": 8,
  "acceltra_prime_barrel": 8,
  "acceltra_prime_blueprint": 8,
  "akarius_prime_receiver": 10,
  "akarius_prime_blueprint": 8,
  "braton_prime_stock": 2,
  "burston_prime_barrel": 2,
  "orthos_prime_blade": 3,
  "lex_prime_barrel": 2,
  "fang_prime_blade": 2,
  
  // Revenant Prime (Actif)
  "tatsu_prime_handle": 3,
  "tatsu_prime_blueprint": 4,
  "phantasma_prime_receiver": 4,
  "phantasma_prime_stock": 3,
  "phantasma_prime_blueprint": 3,
  "spira_prime_blade": 10,
  "spira_prime_blueprint": 15,
  "revenant_prime_chassis": 5,
  "revenant_prime_systems": 12,
  "revenant_prime_blueprint": 45,
  "revenant_prime_neuroptics": 10,
  
  // Wisp & Protea & Hildryn & Khora & Baruuk & Wukong
  "wisp_prime_blueprint": 30,
  "wisp_prime_chassis": 12,
  "wisp_prime_systems": 10,
  "wisp_prime_neuroptics": 10,
  "fulmin_prime_barrel": 6,
  "velox_prime_blueprint": 5,
  "okina_prime_blade": 12,
  "okina_prime_blueprint": 12,
  "okina_prime_handle": 8,
  "velox_prime_receiver": 5,
  "protea_prime_blueprint": 35,
  "protea_prime_chassis": 40,
  "protea_prime_neuroptics": 15,
  "protea_prime_systems": 10,
  "larkspur_prime_blueprint": 8,
  "larkspur_prime_barrel": 6,
  "larkspur_prime_stock": 6,
  "hildryn_prime_chassis": 6,
  "hildryn_prime_neuroptics": 12,
  "hildryn_prime_systems": 5,
  "hildryn_prime_blueprint": 30,
  "shade_prime_systems": 8,
  "shade_prime_blueprint": 10,
  "shade_prime_burst_laser_receiver": 15,
  "hystrix_prime_barrel": 6,
  "khora_prime_neuroptics": 5,
  "dual_keres_prime_blueprint": 6,
  "khora_prime_chassis": 10,
  "khora_prime_blueprint": 35,
  "hystrix_prime_blueprint": 5,
  "khora_prime_systems": 6,
  "dual_keres_prime_handle": 10,
  "hystrix_prime_receiver": 6,
  "dual_keres_prime_blade": 15,
  "afentis_prime_blueprint": 6,
  "baruuk_prime_neuroptics": 5,
  "cobra_crane_prime_blueprint": 5,
  "baruuk_prime_systems": 10,
  "baruuk_prime_blueprint": 30,
  "zhuge_prime_barrel": 5,
  "wukong_prime_neuroptics": 8,
  "zhuge_prime_blueprint": 5,
  "wukong_prime_systems": 8,
  "wukong_prime_blueprint": 80,
  "wukong_prime_chassis": 15,
  
  // Saryn & Volt & Nekros (Vaulted)
  "saryn_prime_blueprint": 45,
  "saryn_prime_chassis": 20,
  "volt_prime_blueprint": 50,
  "volt_prime_neuroptics": 35,
  "volt_prime_chassis": 15,
  "nekros_prime_blueprint": 40,
  "nekros_prime_systems": 15,
  "nekros_prime_neuroptics": 15,
  "dakra_prime_blade": 10,
  "carrier_prime_systems": 12,
  
  "forma_blueprint": 0, // Non échangeable
  
  // Mods Corrompus
  "overextended": 15,
  "transient_fortitude": 15,
  "fleeting_expertise": 15,
  "blind_rage": 15,
  "narrow_minded": 15,
  "vile_acceleration": 12,
  "heavy_trauma": 4,
  "spoiled_strike": 4,
  "critical_deceleration": 15,
  "creeping_bullseye": 10,
  "depleted_reload": 8,
  "vicious_spread": 8,
  "tainted_mag": 4,
  "frail_momentum": 4,
  "anemic_agility": 6,
  "magnum_force": 6,
  "hollow_point": 5,
  "tainted_clip": 3,
  "corrupt_charge": 12,
  "tainted_shell": 3,
  "critical_delay": 5,
  "burdened_magazine": 3,
  "target_acquired": 5,
  "bane_of_corrupted": 2,
  
  // Arcanes Eidolons / Zariman / Cavia
  "arcane_energize": 85,
  "arcane_grace": 35,
  "arcane_barrier": 25,
  "arcane_guardian": 8,
  "arcane_nullifier": 7,
  "arcane_tempo": 5,
  "arcane_warmth": 4,
  "arcane_deflection": 4,
  "arcane_ice": 4,
  "arcane_healing": 4,
  "arcane_resistance": 4,
  "arcane_strike": 6,
  "arcane_fury": 6,
  "arcane_precision": 6,
  "arcane_velocity": 6,
  "arcane_aegis": 15,
  "arcane_trickery": 6,
  "molt_augmented": 12,
  "molt_efficiency": 10,
  "molt_reconstruct": 8,
  
  // Cavia Bounties
  "melee_influence": 12,
  "melee_exposure": 12,
  "melee_animosity": 10,
  "melee_crescendo": 45,
  "melee_duplicate": 50,
  
  // Zariman Bounty direct drops
  "gyre_blueprint": 10,
  "void_thrax_plasm": 1, // par unité
  
  // Fortuna & Cetus Arcanes
  "magus_lockdown": 12,
  "magus_melt": 6,
  "magus_elevate": 15,
  "magus_husk": 8,

  // Nouveaux Farms de Mods (Arbitrage / Steel Path / Plains)
  "galvanized_chamber": 18,
  "galvanized_diffusion": 15,
  "galvanized_hell": 15,
  "adaptation": 25,
  "rolling_guard": 25,
  "primary_merciless": 3,
  "secondary_merciless": 2,
  "relic_pack": 4, // 3 reliques
  "gladiator_might": 12,
  "augur_secrets": 18,
  "vigilante_armaments": 4,
  
  // Syndicates classique items
  "mesa_waltz": 12,
  "justice_blades": 12,
  "scatter_justice": 12,
  "acid_shells": 12,
  "vaykor_marelok": 35,
  "vaykor_hek": 35,
  "vaykor_sydon": 35,
  "fluctus_limb": 8,
  "fluctus_stock": 8,
  "centaur_blade": 10,
  "rathbone_head": 8,
  
  "seeking_shuriken": 12,
  "accumulating_whipclaw": 12,
  "phoenix_renewal": 12,
  "chilling_globe": 12,
  "telos_boltace": 35,
  "telos_akbolto": 35,
  "telos_boltor": 40,
  "cyngas_receiver": 8,
  "cyngas_stock": 8,
  "centaur_aegis": 10,
  "onorix_handle": 8,

  "resonance": 12,
  "pilfering_strangledome": 12,
  "counter_pulse": 12,
  "synoid_gammacor": 35,
  "synoid_heliocor": 35,
  "synoid_simulor": 40,
  "fluctus_barrel": 8,
  "velocitus_barrel": 10,
  "veritux_blade": 8,

  "eternal_war": 12,
  "chaos_sphere": 12,
  "despoil": 12,
  "abating_link": 12,
  "secura_penta": 35,
  "secura_dual_cestra": 35,
  "secura_lecta": 40,
  "kaszas_blade": 8,

  "therapeutic_sentry": 12,
  "rakta_cernos": 35,
  "rakta_ballistica": 35,
  "rakta_dark_dagger": 40,
  "phaedra_stock": 8,
  "onorix_blade": 8,
  "kaszas_handle": 8,

  "pilfering_swarm": 12,
  "vampiric_leech": 12,
  "sancti_tigris": 35,
  "sancti_castanas": 35,
  "sancti_magistar": 40,
  "phaedra_barrel": 8,
  "dual_decurion_receiver": 8,
  "agkuza_blade": 10,
  "rathbone_handle": 8,

  // Open World items
  "virtuos_tempo": 6,
  "virtuos_fury": 6,
  "virtuos_strike": 8,
  "virtuos_ghost": 6,
  "virtuos_shadow": 8,
  "magus_vigor": 6,
  "magus_cadence": 6,
  "magus_replenish": 8,
  "magus_cloud": 6,

  "magus_repair": 12,
  "magus_anomaly": 10,
  "magus_drive": 5,
  "magus_firewall": 6,
  "virtuos_trojan": 8,
  "virtuos_surge": 6,
  "virtuos_forge": 6,
  "virtuos_spike": 6,
  "pax_bolt": 15,
  "pax_charge": 15,
  "pax_soar": 10,
  "pax_seeker": 15,

  "molt_vigor": 8,
  "emergence_dissipate": 10,
  "emergence_savior": 6,
  "emergence_renew": 5,
  "fractal_reset": 5,
  "cascadia_flare": 8,
  "cascadia_overcharge": 6,
  "cascadia_empowered": 8,
  "cascadia_accuracy": 5,

  "melee_retaliation": 8,
  "melee_fortification": 8,
  "melee_vortex": 8,
};

class WarframeMarketService {
  private queue: { urlName: string; resolve: (price: number) => void; reject: (err: any) => void }[] = [];
  private isProcessingQueue = false;
  private cacheKeyPrefix = "wf_price_";
  private cacheExpiry = 60 * 60 * 1000; // 1 heure en millisecondes
  private requestInterval = 350; // 350ms entre chaque requête (environ 2.8 requêtes/sec)
  
  // Obtient le prix d'un item (soit depuis le cache, soit via l'API avec file d'attente)
  public async getPrice(urlName: string): Promise<number> {
    const cached = this.getFromCache(urlName);
    if (cached !== null) {
      return cached;
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ urlName, resolve, reject });
      this.processQueue();
    });
  }

  // Stocke dans le cache localStorage
  private saveToCache(urlName: string, price: number): void {
    try {
      const data: CachedPrice = {
        price,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKeyPrefix + urlName, JSON.stringify(data));
    } catch (e) {
      console.warn("Impossible d'écrire dans localStorage :", e);
    }
  }

  // Récupère du cache si valide
  private getFromCache(urlName: string): number | null {
    try {
      const raw = localStorage.getItem(this.cacheKeyPrefix + urlName);
      if (!raw) return null;

      const data: CachedPrice = JSON.parse(raw);
      const isExpired = Date.now() - data.timestamp > this.cacheExpiry;
      
      if (isExpired) {
        return null;
      }
      return data.price;
    } catch (e) {
      return null;
    }
  }

  // Traite la file d'attente de requêtes de manière séquentielle
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.queue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    const { urlName, resolve } = this.queue.shift()!;

    try {
      const price = await this.fetchLivePrice(urlName);
      this.saveToCache(urlName, price);
      resolve(price);
    } catch (err) {
      console.error(`Erreur pour l'item ${urlName}, utilisation du fallback :`, err);
      // En cas d'erreur (CORS en local sans proxy ou rate limit), on renvoie le prix de secours
      const fallback = FALLBACK_PRICES[urlName] ?? 10;
      resolve(fallback);
    } finally {
      // Attendre 350ms avant d'autoriser la requête suivante
      setTimeout(() => {
        this.isProcessingQueue = false;
        this.processQueue();
      }, this.requestInterval);
    }
  }

  // Effectue la requête HTTP réelle (passe par le proxy local /api-market ou production Netlify)
  private async fetchLivePrice(urlName: string): Promise<number> {
    // Les requêtes vont vers /api-market/items/{url_name}/orders pour récupérer les ordres de vente
    const response = await fetch(`/api-market/items/${urlName}/orders`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const orders = data.payload?.orders || [];
    
    // Filtrer les ordres : type "sell", plate-forme "pc", utilisateur "online" ou "ingame"
    const activeSellOrders = orders.filter((order: any) => 
      order.order_type === "sell" &&
      order.platform === "pc" &&
      (order.user.status === "ingame" || order.user.status === "online")
    );

    if (activeSellOrders.length === 0) {
      // Si aucun vendeur en ligne, regarder les offline
      const offlineSellOrders = orders.filter((order: any) => 
        order.order_type === "sell" &&
        order.platform === "pc"
      );
      if (offlineSellOrders.length === 0) {
        return FALLBACK_PRICES[urlName] ?? 10;
      }
      
      // Trier par prix croissant et retourner le moins cher
      offlineSellOrders.sort((a: any, b: any) => a.platinum - b.platinum);
      return offlineSellOrders[0].platinum;
    }

    // Trier les ordres actifs par prix croissant
    activeSellOrders.sort((a: any, b: any) => a.platinum - b.platinum);
    
    // Pour éviter de prendre une valeur aberrante d'un "fake seller" trop bas,
    // on peut prendre le prix du 1er ou faire une moyenne des 3 premiers.
    // Prenons le minimum direct qui est la norme de transaction.
    return activeSellOrders[0].platinum;
  }
}

export const warframeMarket = new WarframeMarketService();
