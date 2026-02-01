// Prix des matériaux au m²
export const MATERIAL_PRICES = {
  dibond: 50,
  dibond_antigraffiti: 60,
  tole: 12,
  bois_classe2: 11, // Sans traitement
  bois_classe3: 15, // Avec traitement autoclave
  vegetal_feuillage: 32.5,
  vegetal_mur: 45
} as const;

// Installation : 8€/m² avec minimum de 600€
export const INSTALLATION_PRICE_PER_M2 = 8;
export const INSTALLATION_MINIMUM = 600;

// Calcul du prix d'installation
export function calculateInstallationCost(totalSurface: number): number {
  const cost = totalSurface * INSTALLATION_PRICE_PER_M2;
  return Math.max(cost, INSTALLATION_MINIMUM);
}
