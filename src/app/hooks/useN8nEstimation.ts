/**
 * Hook pour gérer l'envoi vers n8n et l'attente de la réponse
 */

import { useState } from 'react';
import { sendProjectToWebhook, type WebhookResponse } from '../services/webhookService';
import { collectProjectData, formatDataForWebhook } from '../services/dataCollector';

export interface N8nEstimationResponse {
  success: boolean;
  estimation?: {
    totalPrice?: number;
    totalCost?: number;
    materialCost?: number;
    foundationCost?: number;
    gatesCost?: number;
    laborCost?: number;
    betCost?: number;
    breakdown?: Record<string, any>;
    [key: string]: any;
  };
  message?: string;
  error?: string;
  [key: string]: any;
}

interface UseN8nEstimationReturn {
  sendAndWait: (
    projectType: 'totem' | 'palissade' | 'massif' | 'bet',
    config: Record<string, any>
  ) => Promise<N8nEstimationResponse>;
  loading: boolean;
  error: string | null;
}

export function useN8nEstimation(): UseN8nEstimationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendAndWait = async (
    projectType: 'totem' | 'palissade' | 'massif' | 'bet',
    config: Record<string, any>
  ): Promise<N8nEstimationResponse> => {
    setLoading(true);
    setError(null);
    const startedAt = Date.now();
    const MIN_LOADING_MS = 500; // afficher le chargement au moins 500 ms

    try {
      // 1. Stocker temporairement la config dans sessionStorage
      const configKey = `${projectType}Config`;
      sessionStorage.setItem(configKey, JSON.stringify(config));

      // 2. Collecter et formater les données
      // Attendre un peu pour que sessionStorage soit à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const projectData = collectProjectData(projectType);
      if (!projectData) {
        throw new Error(`Impossible de collecter les données pour ${projectType}`);
      }

      const formattedData = formatDataForWebhook(projectData);

      // 3. Envoyer vers n8n et attendre la réponse
      const response = await sendProjectToWebhook(projectType);

      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de l\'envoi vers n8n');
      }

      // 4. Normaliser la réponse (webhook renvoie { success, result_estimation })
      const rawData = response.data;

      let total: number | null = null;
      if (rawData?.result_estimation != null) {
        total = typeof rawData.result_estimation === 'number'
          ? rawData.result_estimation
          : parseFloat(String(rawData.result_estimation));
      }
      if ((total == null || Number.isNaN(total)) && (rawData?.estimation?.totalPrice ?? rawData?.estimation?.totalCost) != null) {
        total = Number(rawData.estimation?.totalPrice ?? rawData.estimation?.totalCost);
      }
      if (total == null && Array.isArray(rawData) && rawData.length > 0) {
        const last = rawData[rawData.length - 1];
        const t = last?.__TOTAL ?? last?.['__TOTAL'];
        total = t != null ? (typeof t === 'number' ? t : parseFloat(String(t))) : null;
      }

      const n8nResponse: N8nEstimationResponse = total != null
        ? {
            success: true,
            estimation: { totalPrice: total, totalCost: total },
            raw: rawData,
          }
        : { success: true };

      // 5. Stocker la réponse de n8n dans sessionStorage pour la page de résultats
      sessionStorage.setItem(`${projectType}N8nResponse`, JSON.stringify(n8nResponse));

      // 6. Retourner la réponse
      return n8nResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise(r => setTimeout(r, MIN_LOADING_MS - elapsed));
      }
      setLoading(false);
    }
  };

  return {
    sendAndWait,
    loading,
    error,
  };
}
