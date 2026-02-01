import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TotemResults } from '../components/TotemResults';
import type { TotemConfig } from '../components/TotemCalculator';

export function TotemResultsPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<TotemConfig | null>(null);
  const [n8nData, setN8nData] = useState<any>(null);

  useEffect(() => {
    const storedConfig = sessionStorage.getItem('totemConfig');
    const n8nResponse = sessionStorage.getItem('totemN8nResponse');
    
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
      
      // Récupérer les données de n8n si disponibles
      if (n8nResponse) {
        try {
          const n8nData = JSON.parse(n8nResponse);
          setN8nData(n8nData);
          console.log('✅ Utilisation de l\'estimation n8n pour totem:', n8nData);
        } catch (e) {
          console.warn('⚠️ Erreur parsing réponse n8n:', e);
        }
      }
    } else {
      navigate('/totem');
    }
  }, [navigate]);

  const handleReset = () => {
    sessionStorage.removeItem('totemConfig');
    navigate('/');
  };

  if (!config) {
    return null;
  }

  // Les données n8n sont disponibles dans n8nData si nécessaire
  // Pour l'instant, le composant TotemResults utilise ses propres calculs
  // Vous pouvez modifier TotemResults plus tard pour utiliser n8nData
  return (
    <TotemResults config={config} onReset={handleReset} />
  );
}
