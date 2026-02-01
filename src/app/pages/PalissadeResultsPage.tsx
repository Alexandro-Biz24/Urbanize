import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Results, CartData } from '../components/Results';
import type { HoardingConfig, PriceBreakdown } from '../App';
import { MATERIAL_PRICES, calculateInstallationCost } from '../lib/pricing';

export function PalissadeResultsPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<HoardingConfig | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);

  useEffect(() => {
    const storedConfig = sessionStorage.getItem('palissadeConfig');
    const n8nResponse = sessionStorage.getItem('palissadeN8nResponse');
    
    if (storedConfig) {
      const parsedConfig: HoardingConfig = JSON.parse(storedConfig);
      setConfig(parsedConfig);
      
      // PRIORITÉ : Utiliser les données du webhook n8n (result_estimation) si disponibles
      if (n8nResponse) {
        try {
          const n8nData = JSON.parse(n8nResponse);

          let totalFromN8n: number | null = null;
          if (n8nData?.estimation?.totalPrice != null || n8nData?.estimation?.totalCost != null) {
            totalFromN8n = Number(n8nData.estimation?.totalPrice ?? n8nData.estimation?.totalCost);
          }
          if (totalFromN8n == null && n8nData?.raw?.result_estimation != null) {
            totalFromN8n = Number(n8nData.raw.result_estimation);
          }
          if (totalFromN8n == null && Array.isArray(n8nData?.raw) && n8nData.raw.length > 0) {
            const last = n8nData.raw[n8nData.raw.length - 1];
            const t = last?.__TOTAL ?? last?.['__TOTAL'];
            totalFromN8n = t != null ? (typeof t === 'number' ? t : parseFloat(String(t))) : null;
          }

          const estimation = (n8nData as any).estimation || {};
          const materialCost = estimation.materialCost || 0;
          const foundationCost = estimation.foundationCost || 0;
          const gatesCost = estimation.gatesCost || 0;
          const laborCost = estimation.laborCost || 0;
          const betCost = estimation.betCost || 0;

          const totalCost = totalFromN8n ?? 0;

          if (totalCost > 0) {
            setPriceBreakdown({
              materialCost,
              foundationCost,
              gatesCost,
              laborCost,
              betCost,
              totalCost,
              fromWebhook: true, // Afficher le prix exact du webhook (pas de fourchette ±5%)
            });
            console.log('✅ Utilisation du result_estimation webhook n8n pour palissade:', totalCost);
            return;
          }
        } catch (e) {
          console.warn('⚠️ Erreur parsing réponse n8n, utilisation du calcul local:', e);
        }
      }
      
      // FALLBACK : Calcul local si n8n n'a pas répondu ou erreur
      console.log('ℹ️ Utilisation du calcul local (fallback)');
      let materialCost = 0;
      let foundationCost = 0;
      let gatesCost = 0;
      let laborCost = 0;
      let betCost = 0;

      if (parsedConfig.projectType === 'habillage') {
        if (parsedConfig.materials && parsedConfig.materials.length > 0) {
          parsedConfig.materials.forEach(mat => {
            const surface = mat.surface || 0;
            
            if (mat.type === 'dibond') {
              materialCost += surface * MATERIAL_PRICES.dibond;
            } else if (mat.type === 'dibond_antigraffiti') {
              materialCost += surface * MATERIAL_PRICES.dibond_antigraffiti;
            } else if (mat.type === 'tole') {
              materialCost += surface * MATERIAL_PRICES.tole;
            } else if (mat.type === 'bois') {
              const pricePerM2 = mat.boisTreatment === 'classe3' 
                ? MATERIAL_PRICES.bois_classe3 
                : MATERIAL_PRICES.bois_classe2;
              materialCost += surface * pricePerM2;
            } else if (mat.type === 'vegetal') {
              const pricePerM2 = mat.vegetalType === 'mur'
                ? MATERIAL_PRICES.vegetal_mur
                : MATERIAL_PRICES.vegetal_feuillage;
              materialCost += surface * pricePerM2;
            }
          });
          
          if (parsedConfig.includeInstaller) {
            const totalSurface = parsedConfig.materials.reduce((sum, mat) => sum + (mat.surface || 0), 0);
            laborCost = calculateInstallationCost(totalSurface);
          }
        }
      } else {
        foundationCost = (parsedConfig.soilEnrobe || 0) * 45 + (parsedConfig.soilMeuble || 0) * 65;
        gatesCost = (parsedConfig.portails || 0) * 850 + (parsedConfig.portillons || 0) * 450;
        
        if (parsedConfig.materials) {
          parsedConfig.materials.forEach(mat => {
            const surface = mat.length * parsedConfig.height;
            
            if (mat.type === 'dibond') {
              materialCost += surface * MATERIAL_PRICES.dibond;
            } else if (mat.type === 'dibond_antigraffiti') {
              materialCost += surface * MATERIAL_PRICES.dibond_antigraffiti;
            } else if (mat.type === 'tole') {
              materialCost += surface * MATERIAL_PRICES.tole;
            } else if (mat.type === 'bois') {
              const pricePerM2 = mat.boisTreatment === 'classe3' 
                ? MATERIAL_PRICES.bois_classe3 
                : MATERIAL_PRICES.bois_classe2;
              materialCost += surface * pricePerM2;
            } else if (mat.type === 'vegetal') {
              const pricePerM2 = mat.vegetalType === 'mur'
                ? MATERIAL_PRICES.vegetal_mur
                : MATERIAL_PRICES.vegetal_feuillage;
              materialCost += surface * pricePerM2;
            }
          });
        }
      }
      
      if (parsedConfig.includeBET) {
        betCost = 280;
      }
      
      const totalCost = materialCost + foundationCost + gatesCost + laborCost + betCost;

      setPriceBreakdown({
        materialCost,
        foundationCost,
        gatesCost,
        laborCost,
        betCost,
        totalCost
      });
    } else {
      navigate('/palissade');
    }
  }, [navigate]);

  const handleReset = () => {
    sessionStorage.removeItem('palissadeConfig');
    sessionStorage.removeItem('palissadeN8nResponse');
    navigate('/');
  };

  const handleAddToCart = (cartData: CartData) => {
    // Stocker les données du panier dans sessionStorage
    sessionStorage.setItem('cartData', JSON.stringify(cartData));
    // Naviguer vers la page panier
    navigate('/panier');
  };

  if (!config || !priceBreakdown) {
    return null;
  }

  return (
    <Results 
      config={config} 
      priceBreakdown={priceBreakdown} 
      onReset={handleReset}
      onAddToCart={handleAddToCart}
    />
  );
}