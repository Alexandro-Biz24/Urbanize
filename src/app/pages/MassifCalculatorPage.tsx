import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MassifCalculator } from '../components/MassifCalculator';
import type { MassifConfig } from '../components/MassifCalculator';
import { useN8nEstimation } from '../hooks/useN8nEstimation';
import { Loader2 } from 'lucide-react';

export function MassifCalculatorPage() {
  const navigate = useNavigate();
  const { sendAndWait, loading } = useN8nEstimation();
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Récupérer la config existante si elle existe
  const savedConfig = sessionStorage.getItem('massifConfig');
  const initialConfig = savedConfig ? JSON.parse(savedConfig) : undefined;

  const handleCalculate = async (config: MassifConfig) => {
    setIsCalculating(true);
    
    try {
      const response = await sendAndWait('massif', config);
      
      if (response.success) {
        sessionStorage.setItem('massifConfig', JSON.stringify(config));
        navigate('/massif/resultats');
      } else {
        alert(`Erreur: ${response.error || 'Impossible d\'obtenir l\'estimation'}`);
      }
    } catch (err) {
      alert(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsCalculating(false);
    }
  };

  if (isCalculating || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-semibold text-slate-900">Calcul de l'estimation en cours...</p>
          <p className="text-sm text-slate-600 mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <MassifCalculator 
      initialConfig={initialConfig} 
      onCalculate={handleCalculate} 
    />
  );
}
