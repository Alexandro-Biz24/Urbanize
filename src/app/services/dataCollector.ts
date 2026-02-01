/**
 * Service pour collecter toutes les données utilisateur depuis sessionStorage
 * et les formater pour l'envoi vers le webhook n8n
 */

// Types pour les différentes configurations
export interface UserProjectData {
  projectType: 'totem' | 'palissade' | 'massif' | 'bet';
  projectSubType?: 'habillage' | 'montage';
  timestamp: string;
  sessionId?: string;
  data: Record<string, any>;
  priceBreakdown?: {
    materialCost?: number;
    foundationCost?: number;
    gatesCost?: number;
    laborCost?: number;
    betCost?: number;
    totalCost?: number;
  };
  cartData?: Record<string, any>;
}

/**
 * Collecte toutes les données utilisateur disponibles dans sessionStorage
 */
export function collectAllUserData(): UserProjectData[] {
  const allData: UserProjectData[] = [];
  const timestamp = new Date().toISOString();
  
  // Générer un ID de session unique si pas déjà présent
  let sessionId = sessionStorage.getItem('userSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('userSessionId', sessionId);
  }

  // 1. Données Palissade
  const palissadeConfig = sessionStorage.getItem('palissadeConfig');
  if (palissadeConfig) {
    try {
      const config = JSON.parse(palissadeConfig);
      
      // Récupérer le priceBreakdown depuis la config ou le cart
      let priceBreakdown = undefined;
      
      // D'abord vérifier si c'est dans la config elle-même
      if (config._priceBreakdown) {
        priceBreakdown = config._priceBreakdown;
      } else {
        // Sinon chercher dans le cartData
        const cartData = sessionStorage.getItem('cartData');
        if (cartData) {
          try {
            const cart = JSON.parse(cartData);
            if (cart.priceBreakdown) {
              priceBreakdown = cart.priceBreakdown;
            }
          } catch (e) {
            // Ignore
          }
        }
      }
      
      // Nettoyer la config pour ne pas inclure _priceBreakdown dans data
      const cleanConfig = { ...config };
      delete cleanConfig._priceBreakdown;
      
      allData.push({
        projectType: 'palissade',
        projectSubType: config.projectType,
        timestamp,
        sessionId,
        data: cleanConfig, // Toutes les données de configuration (sans _priceBreakdown)
        priceBreakdown, // Prix calculés si disponibles
      });
    } catch (e) {
      console.error('Erreur parsing palissadeConfig:', e);
    }
  }

  // 2. Données Totem
  const totemConfig = sessionStorage.getItem('totemConfig');
  if (totemConfig) {
    try {
      const config = JSON.parse(totemConfig);
      allData.push({
        projectType: 'totem',
        timestamp,
        sessionId,
        data: config,
      });
    } catch (e) {
      console.error('Erreur parsing totemConfig:', e);
    }
  }

  // 3. Données Massif
  const massifConfig = sessionStorage.getItem('massifConfig');
  if (massifConfig) {
    try {
      const config = JSON.parse(massifConfig);
      allData.push({
        projectType: 'massif',
        timestamp,
        sessionId,
        data: config,
      });
    } catch (e) {
      console.error('Erreur parsing massifConfig:', e);
    }
  }

  // 4. Données BET
  const betConfig = sessionStorage.getItem('betConfig');
  if (betConfig) {
    try {
      const config = JSON.parse(betConfig);
      allData.push({
        projectType: 'bet',
        timestamp,
        sessionId,
        data: config,
      });
    } catch (e) {
      console.error('Erreur parsing betConfig:', e);
    }
  }

  // 5. Données du panier (si disponible) - Associer aux projets correspondants
  const cartData = sessionStorage.getItem('cartData');
  if (cartData) {
    try {
      const cart = JSON.parse(cartData);
      // Associer les données du panier au projet correspondant
      allData.forEach(project => {
        // Comparaison plus flexible pour associer le panier au bon projet
        if (cart.config) {
          // Pour palissade, comparer les champs principaux
          if (project.projectType === 'palissade' && cart.config.projectType) {
            const configMatch = 
              cart.config.projectType === project.projectSubType &&
              cart.config.height === project.data.height &&
              JSON.stringify(cart.config.materials || cart.config.material) === 
              JSON.stringify(project.data.materials || project.data.material);
            
            if (configMatch) {
              project.cartData = cart;
              if (cart.priceBreakdown) {
                project.priceBreakdown = cart.priceBreakdown;
              }
            }
          }
        }
      });
    } catch (e) {
      console.error('Erreur parsing cartData:', e);
    }
  }

  return allData;
}

/**
 * Collecte les données d'un projet spécifique
 */
export function collectProjectData(projectType: 'totem' | 'palissade' | 'massif' | 'bet'): UserProjectData | null {
  const allData = collectAllUserData();
  return allData.find(p => p.projectType === projectType) || null;
}

/**
 * Formate les données pour l'envoi vers n8n
 * Structure organisée et complète pour faciliter le traitement dans n8n
 */
export function formatDataForWebhook(data: UserProjectData): Record<string, any> {
  // Structure complète et organisée
  const formatted: Record<string, any> = {
    // ========== MÉTADONNÉES ==========
    metadata: {
      timestamp: data.timestamp,
      sessionId: data.sessionId,
      projectType: data.projectType,
      projectSubType: data.projectSubType,
      source: 'urbanize-frontend',
      version: '1.0.0',
    },
    
    // ========== CONFIGURATION DU PROJET ==========
    project: {
      type: data.projectType,
      subType: data.projectSubType,
      // Toutes les données de configuration sont incluses ici
      configuration: data.data,
    },
    
    // ========== DÉTAILS PAR TYPE DE PROJET ==========
    details: {},
  };

  // Organiser les détails selon le type de projet
  if (data.projectType === 'palissade') {
    // Matériaux normalisés
    const materials =
      data.data.materials ||
      (data.data.material
        ? [
            {
              type: data.data.material,
              length: data.data.length,
              surface:
                data.data.length && data.data.height
                  ? data.data.length * data.data.height
                  : undefined,
              ralColor: data.data.ralColor,
              includeProtectionFrame: data.data.includeProtectionFrame,
              vegetalType: data.data.vegetalType,
              vegetalVariety: data.data.vegetalVariety,
              boisTreatment: data.data.boisTreatment,
              includeWoodSaturator: data.data.includeWoodSaturator,
            },
          ]
        : []);

    /**
     * Map internal material type to exact JSON label for webhook (accents, libellés exacts).
     * Si rien de choisi ou surface 0 → "AUCUN".
     */
    function mapSupportTypeToLabel(mat: { type?: string; surface?: number; boisTreatment?: string; vegetalType?: string }): string {
      if (!mat?.type || (mat.surface ?? 0) <= 0) return 'AUCUN';
      switch (mat.type) {
        case 'dibond':
        case 'dibond_antigraffiti':
          return 'Bidon - 2,5 l pour traitement autoclave - pour 6m2';
        case 'tole':
          return 'Tole ondulée bac acier (RAL à préciser) - format  3m x 1 m';
        case 'bois':
          return mat.boisTreatment === 'classe3'
            ? '* Lames de sapin Raboté 4 faces (25 x 145 x 4000 mm) - Classe 3'
            : '* Lames de sapin Coffrage brut Avivé (27 x 150 x 4000 mm) - non traité';
        case 'vegetal':
          return mat.vegetalType === 'mur'
            ? 'Mur végétal en plaque - 1mx1m'
            : 'Feuillage synthétique en plaque - 1mx1m';
        default:
          return 'AUCUN';
      }
    }

    const supportA = materials[0] || {};
    const supportB = materials[1] || {};
    const supportC = materials[2] || {};

    // STRUCTURE – valeurs exactes, avec accents
    const espacementVal = data.data.espacementBastaings;
    formatted.STRUCTURE = {
      'Longueur': data.data.length,
      'Hauteur moyenne': data.data.height,
      'Zone Géographique': data.data.zoneGeographique ?? null,
      'Catégorie de terrain': data.data.terrainCategory ?? null,
      'Type de sol (Si meuble=>massif béton)': data.data.soilType ?? null,
      'Espacement entre 2 bastaings (m)': espacementVal !== undefined && espacementVal !== '' ? (typeof espacementVal === 'string' ? parseFloat(espacementVal) : espacementVal) : null,
      'Type de lest': data.data.lestType ?? null,
    };

    // HABILLAGE – Support A/B/C type = libellés exacts ; ACCOMPAGNEMENT SOUHAITÉ = valeurs exactes
    formatted.HABILLAGE = {
      'Support A surface': supportA.surface ?? null,
      'Support A type': mapSupportTypeToLabel(supportA),
      'Support B surface': supportB.surface ?? null,
      'Support B type': mapSupportTypeToLabel(supportB),
      'Support C surface': supportC.surface ?? null,
      'Support C type': mapSupportTypeToLabel(supportC),
      'Oculi unité': data.data.oculiUnite ?? null,
      'Oculi type': data.data.oculiType ?? null,
      'ACCOMPAGNEMENT SOUHAITÉ': data.data.accompagnementSouhaite ?? null,
    };

    // PORTAIL
    formatted.PORTAIL = {
      'Portail unité': data.data.portailUnite ?? data.data.portails ?? null,
      'Portail': data.data.portailTypeLabel ?? null,
      'Portillon unité': data.data.portillonUnite ?? data.data.portillons ?? null,
      'Portillon': data.data.portillonTypeLabel ?? null,
    };

    // Garder aussi un bloc details technique si utile dans n8n
    formatted.details = {
      height: data.data.height,
      length: data.data.length,
      materials,
      soilEnrobe: data.data.soilEnrobe,
      soilMeuble: data.data.soilMeuble,
      portails: data.data.portails,
      portailsSelections: data.data.portailsSelections,
      portillons: data.data.portillons,
      portillonsSelections: data.data.portillonsSelections,
      includeInstaller: data.data.includeInstaller,
      includeBET: data.data.includeBET,
      includeCERFA: data.data.includeCERFA,
      deliveryAddress: data.data.deliveryAddress,
      deliveryInstructions: data.data.deliveryInstructions,
      deliveryDate: data.data.deliveryDate,
    };
  } else if (data.projectType === 'totem') {
    formatted.details = {
      items: data.data.items || [],
    };
  } else if (data.projectType === 'massif') {
    formatted.details = {
      items: data.data.items || [],
    };
  } else if (data.projectType === 'bet') {
    formatted.details = {
      street: data.data.street,
      street2: data.data.street2,
      postalCode: data.data.postalCode,
      city: data.data.city,
      country: data.data.country,
      terrainCategory: data.data.terrainCategory,
      windZone: data.data.windZone,
      windSpeed: data.data.windSpeed,
    };
  }

  // ========== PRIX ET ESTIMATION ==========
  if (data.priceBreakdown) {
    formatted.pricing = {
      materialCost: data.priceBreakdown.materialCost,
      foundationCost: data.priceBreakdown.foundationCost,
      gatesCost: data.priceBreakdown.gatesCost,
      laborCost: data.priceBreakdown.laborCost,
      betCost: data.priceBreakdown.betCost,
      totalCost: data.priceBreakdown.totalCost,
    };
  }

  // ========== DONNÉES DU PANIER ==========
  if (data.cartData) {
    formatted.cart = {
      subtotalMin: data.cartData.subtotalMin,
      subtotalMax: data.cartData.subtotalMax,
      services: data.cartData.services,
      servicesTotal: data.cartData.servicesTotal,
      finalMin: data.cartData.finalMin,
      finalMax: data.cartData.finalMax,
    };
  }

  return formatted;
}
