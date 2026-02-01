/**
 * Service pour envoyer les données vers le webhook n8n
 */

import { collectAllUserData, collectProjectData, formatDataForWebhook } from './dataCollector';

const DEFAULT_WEBHOOK_URL = 'https://urbaniz.app.n8n.cloud/webhook-test/palissade';
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL?.trim() || DEFAULT_WEBHOOK_URL;

export interface WebhookResponse {
  success: boolean;
  message?: string;
  /** Réponse brute du webhook (tableau [{ __TOTAL }] ou objet) */
  data?: any;
  error?: string;
}

function formatWebhookError(status: number, errorText: string): string {
  try {
    const errJson = JSON.parse(errorText);
    const msg = errJson?.message ?? '';
    if (msg.includes('Respond to Webhook')) {
      return 'Erreur n8n : le node "Respond to Webhook" n’est pas exécuté.';
    }
  } catch (_) {}
  return `Erreur HTTP ${status}: ${errorText}`;
}

/**
 * Envoie les données d'un projet spécifique vers le webhook n8n
 */
export async function sendProjectToWebhook(
  projectType: 'totem' | 'palissade' | 'massif' | 'bet',
  webhookUrl?: string
): Promise<WebhookResponse> {
  try {
    const projectData = collectProjectData(projectType);
    if (!projectData) {
      return { success: false, error: `Aucune donnée pour ${projectType}` };
    }

    const formattedData = formatDataForWebhook(projectData);
    const url = webhookUrl || WEBHOOK_URL;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: formatWebhookError(response.status, errorText) };
    }

    // Le webhook renvoie : { "success": true, "result_estimation": 19457.47 }
    const responseData = await response.json().catch(() => null);
    if (responseData == null) {
      return { success: false, error: 'Réponse webhook invalide (JSON vide ou invalide)' };
    }

    // Extraire le total : priorité à result_estimation (format n8n actuel)
    const raw = responseData?.result_estimation ?? responseData?.estimation?.totalPrice ?? responseData?.estimation?.totalCost;
    let total = raw != null ? (typeof raw === 'number' ? raw : parseFloat(String(raw))) : null;

    // Fallback : format tableau avec __TOTAL
    if (total == null) {
      const arr = Array.isArray(responseData) ? responseData : responseData?.data ?? responseData?.body ?? responseData?.json;
      const lastItem = Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null;
      const t = lastItem?.__TOTAL ?? lastItem?.['__TOTAL'];
      total = t != null ? (typeof t === 'number' ? t : parseFloat(String(t))) : null;
    }

    if (total == null || Number.isNaN(total)) {
      return {
        success: false,
        error: 'Réponse webhook invalide : result_estimation ou __TOTAL introuvable.',
      };
    }

    return {
      success: true,
      message: 'Données envoyées avec succès',
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Envoie toutes les données disponibles vers le webhook n8n
 */
export async function sendAllDataToWebhook(webhookUrl?: string): Promise<WebhookResponse> {
  try {
    const allData = collectAllUserData();
    if (allData.length === 0) {
      return { success: false, error: 'Aucune donnée à envoyer' };
    }
    const formattedData = {
      metadata: { timestamp: new Date().toISOString(), source: 'urbanize-frontend', version: '1.0.0', totalProjects: allData.length },
      projects: allData.map((d: any) => formatDataForWebhook(d)),
    };
    const url = webhookUrl || WEBHOOK_URL;
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formattedData) });
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: formatWebhookError(response.status, errorText) };
    }
    const responseData = await response.json().catch(() => null);
    return { success: true, message: `${allData.length} projet(s) envoyé(s)`, data: responseData };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

/**
 * Envoie des données personnalisées vers le webhook
 */
export async function sendCustomDataToWebhook(data: Record<string, any>, webhookUrl?: string): Promise<WebhookResponse> {
  try {
    const url = webhookUrl || WEBHOOK_URL;
    const payload = { metadata: { timestamp: new Date().toISOString(), source: 'urbanize-frontend', version: '1.0.0' }, ...data };
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: formatWebhookError(response.status, errorText) };
    }
    const responseData = await response.json().catch(() => null);
    return { success: true, message: 'Données envoyées', data: responseData };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}
