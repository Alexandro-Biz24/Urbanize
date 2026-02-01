/**
 * Hook React pour faciliter l'envoi de données vers le webhook n8n
 */

import { useState, useCallback } from 'react';
import { sendProjectToWebhook, sendAllDataToWebhook, sendCustomDataToWebhook, type WebhookResponse } from '../services/webhookService';

interface UseWebhookReturn {
  sendProject: (projectType: 'totem' | 'palissade' | 'massif' | 'bet', webhookUrl?: string) => Promise<WebhookResponse>;
  sendAll: (webhookUrl?: string) => Promise<WebhookResponse>;
  sendCustom: (data: Record<string, any>, webhookUrl?: string) => Promise<WebhookResponse>;
  loading: boolean;
  error: string | null;
  lastResponse: WebhookResponse | null;
}

export function useWebhook(): UseWebhookReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<WebhookResponse | null>(null);

  const sendProject = useCallback(async (
    projectType: 'totem' | 'palissade' | 'massif' | 'bet',
    webhookUrl?: string
  ): Promise<WebhookResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sendProjectToWebhook(projectType, webhookUrl);
      setLastResponse(response);
      
      if (!response.success) {
        setError(response.error || 'Erreur inconnue');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      const errorResponse: WebhookResponse = {
        success: false,
        error: errorMessage,
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendAll = useCallback(async (webhookUrl?: string): Promise<WebhookResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sendAllDataToWebhook(webhookUrl);
      setLastResponse(response);
      
      if (!response.success) {
        setError(response.error || 'Erreur inconnue');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      const errorResponse: WebhookResponse = {
        success: false,
        error: errorMessage,
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendCustom = useCallback(async (
    data: Record<string, any>,
    webhookUrl?: string
  ): Promise<WebhookResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sendCustomDataToWebhook(data, webhookUrl);
      setLastResponse(response);
      
      if (!response.success) {
        setError(response.error || 'Erreur inconnue');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      const errorResponse: WebhookResponse = {
        success: false,
        error: errorMessage,
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendProject,
    sendAll,
    sendCustom,
    loading,
    error,
    lastResponse,
  };
}
