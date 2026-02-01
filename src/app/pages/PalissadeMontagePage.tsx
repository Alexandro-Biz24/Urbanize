import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator } from '../components/Calculator';
import type { HoardingConfig } from '../App';
import { useN8nEstimation } from '../hooks/useN8nEstimation';
import { Loader2, Bug, ChevronDown, ChevronUp } from 'lucide-react';

export function PalissadeMontagePage() {
  const navigate = useNavigate();
  const { sendAndWait, loading } = useN8nEstimation();
  const [isCalculating, setIsCalculating] = useState(false);
  const [debugResponse, setDebugResponse] = useState<string | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('webhookDebugResponse');
    setDebugResponse(raw);
  }, [isCalculating, loading]);

  const handleCalculate = async (config: HoardingConfig) => {
    setIsCalculating(true);
    
    try {
      const response = await sendAndWait('palissade', config);
      
      if (response.success) {
        sessionStorage.setItem('palissadeConfig', JSON.stringify(config));
        navigate('/palissade/resultats');
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
    <div className="relative">
      <Calculator 
        projectType="montage" 
        onCalculate={handleCalculate} 
      />
      {/* Panneau debug : affiche la dernière réponse webhook */}
      {debugResponse && (
        <div className="fixed bottom-4 right-4 z-50 max-w-lg">
          <button
            onClick={() => setDebugOpen(!debugOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-lg text-sm font-medium"
          >
            <Bug className="w-4 h-4" />
            Debug webhook {debugOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {debugOpen && (
            <div className="mt-2 p-4 bg-slate-900 text-green-400 rounded-lg shadow-xl max-h-80 overflow-auto text-xs font-mono whitespace-pre-wrap break-all">
              <p className="text-amber-400 mb-2 text-xs font-sans">Dernière réponse webhook (copiez et envoyez-moi) :</p>
              <pre>{debugResponse}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(debugResponse);
                  alert('Copié !');
                }}
                className="mt-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
              >
                Copier
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
