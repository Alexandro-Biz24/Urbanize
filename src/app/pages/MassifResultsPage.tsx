import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MassifResults } from '../components/MassifResults';
import type { MassifConfig } from '../components/MassifCalculator';

export function MassifResultsPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<MassifConfig | null>(null);
  const [n8nData, setN8nData] = useState<any>(null);

  useEffect(() => {
    const storedConfig = sessionStorage.getItem('massifConfig');
    const n8nResponse = sessionStorage.getItem('massifN8nResponse');
    
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
      
      // Récupérer les données de n8n si disponibles
      if (n8nResponse) {
        try {
          const n8nData = JSON.parse(n8nResponse);
          setN8nData(n8nData);
          console.log('✅ Utilisation de l\'estimation n8n pour massif:', n8nData);
        } catch (e) {
          console.warn('⚠️ Erreur parsing réponse n8n:', e);
        }
      }
    } else {
      navigate('/massif');
    }
  }, [navigate]);

  const handleReset = () => {
    // On garde la config en session pour pouvoir la modifier
    navigate('/massif');
  };

  if (!config) {
    return null;
  }

  return (
    <MassifResults config={config} onReset={handleReset} />
  );
}
