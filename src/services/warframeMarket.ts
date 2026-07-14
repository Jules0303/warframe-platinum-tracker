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
  
  // Wisp (Resurgence)
  "wisp_prime_blueprint": 30,
  "wisp_prime_chassis": 12,
  "wisp_prime_systems": 10,
  "wisp_prime_neuroptics": 10,
  
  // Saryn & Volt & Nekros (Vaulted)
  "saryn_prime_blueprint": 45,
  "saryn_prime_chassis": 20,
  "volt_prime_blueprint": 50,
  "volt_prime_neuroptics": 35,
  "volt_prime_chassis": 15,
  "nekros_prime_blueprint": 40,
  "nekros_prime_systems": 15,
  "nekros_prime_neuroptics": 15,
  
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
