import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BETResults } from '../components/BETResults';
import type { BETConfig } from '../components/BETCalculator';

export function BETResultsPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<BETConfig | null>(null);
  const [n8nData, setN8nData] = useState<any>(null);

  useEffect(() => {
    const storedConfig = sessionStorage.getItem('betConfig');
    const n8nResponse = sessionStorage.getItem('betN8nResponse');
    
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
      
      // Récupérer les données de n8n si disponibles
      if (n8nResponse) {
        try {
          const n8nData = JSON.parse(n8nResponse);
          setN8nData(n8nData);
          console.log('✅ Utilisation de l\'estimation n8n pour BET:', n8nData);
        } catch (e) {
          console.warn('⚠️ Erreur parsing réponse n8n:', e);
        }
      }
    } else {
      navigate('/bet');
    }
  }, [navigate]);

  const handleReset = () => {
    sessionStorage.removeItem('betConfig');
    navigate('/');
  };

  if (!config) {
    return null;
  }

  return (
    <BETResults config={config} onReset={handleReset} />
  );
}
