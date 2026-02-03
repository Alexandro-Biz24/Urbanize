/**
 * Service pour envoyer les données vers le webhook n8n
 * Essaie d'abord TEST, puis PROD en fallback (au moment du clic sur "Estimation")
 */

import { collectAllUserData, collectProjectData, formatDataForWebhook } from './dataCollector';

const N8N_WEBHOOK_URL_TEST = 'https://urbaniz.app.n8n.cloud/webhook-test/palissade';
const N8N_WEBHOOK_URL_PROD = 'https://urbaniz.app.n8n.cloud/webhook/palissade';

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

function extractTotal(responseData: any): number | null {
  const raw = responseData?.result_estimation ?? responseData?.estimation?.totalPrice ?? responseData?.estimation?.totalCost;
  let total = raw != null ? (typeof raw === 'number' ? raw : parseFloat(String(raw))) : null;
  if (total == null) {
    const arr = Array.isArray(responseData) ? responseData : responseData?.data ?? responseData?.body ?? responseData?.json;
    const lastItem = Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null;
    const t = lastItem?.__TOTAL ?? lastItem?.['__TOTAL'];
    total = t != null ? (typeof t === 'number' ? t : parseFloat(String(t))) : null;
  }
  return total != null && !Number.isNaN(total) ? total : null;
}

async function postToWebhook(url: string, body: string): Promise<WebhookResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, error: formatWebhookError(response.status, errorText) };
  }
  const responseData = await response.json().catch(() => null);
  if (responseData == null) {
    return { success: false, error: 'Réponse webhook invalide (JSON vide ou invalide)' };
  }
  const total = extractTotal(responseData);
  if (total == null) {
    return { success: false, error: 'Réponse webhook invalide : result_estimation ou __TOTAL introuvable.' };
  }
  return { success: true, message: 'Données envoyées avec succès', data: responseData };
}

/**
 * Envoie les données vers le webhook n8n.
 * Essaie d'abord TEST, puis PROD si le premier n'est pas disponible.
 */
export async function sendProjectToWebhook(
  projectType: 'totem' | 'palissade' | 'massif' | 'bet',
  webhookUrlOverride?: string
): Promise<WebhookResponse> {
  try {
    const projectData = collectProjectData(projectType);
    if (!projectData) {
      return { success: false, error: `Aucune donnée pour ${projectType}` };
    }

    const body = JSON.stringify(formatDataForWebhook(projectData));
    const urls = webhookUrlOverride
      ? [webhookUrlOverride]
      : [N8N_WEBHOOK_URL_TEST, N8N_WEBHOOK_URL_PROD];

    let lastError: string | undefined;
    for (const url of urls) {
      try {
        const result = await postToWebhook(url, body);
        if (result.success) return result;
        lastError = result.error;
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Erreur réseau';
      }
    }

    return {
      success: false,
      error: lastError || 'Aucun webhook n8n disponible (test et prod).',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Envoie toutes les données disponibles vers le webhook n8n (TEST puis PROD en fallback)
 */
export async function sendAllDataToWebhook(webhookUrlOverride?: string): Promise<WebhookResponse> {
  try {
    const allData = collectAllUserData();
    if (allData.length === 0) {
      return { success: false, error: 'Aucune donnée à envoyer' };
    }
    const payload = {
      metadata: { timestamp: new Date().toISOString(), source: 'urbanize-frontend', version: '1.0.0', totalProjects: allData.length },
      projects: allData.map((d: any) => formatDataForWebhook(d)),
    };
    const body = JSON.stringify(payload);
    const urls = webhookUrlOverride ? [webhookUrlOverride] : [N8N_WEBHOOK_URL_TEST, N8N_WEBHOOK_URL_PROD];
    let lastError: string | undefined;
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          return { success: true, message: `${allData.length} projet(s) envoyé(s)`, data };
        }
        lastError = await res.text();
      } catch (e) {
        lastError = e instanceof Error ? e.message : 'Erreur réseau';
      }
    }
    return { success: false, error: lastError || 'Aucun webhook disponible.' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

/**
 * Envoie des données personnalisées vers le webhook (TEST puis PROD en fallback)
 */
export async function sendCustomDataToWebhook(data: Record<string, any>, webhookUrlOverride?: string): Promise<WebhookResponse> {
  try {
    const payload = { metadata: { timestamp: new Date().toISOString(), source: 'urbanize-frontend', version: '1.0.0' }, ...data };
    const body = JSON.stringify(payload);
    const urls = webhookUrlOverride ? [webhookUrlOverride] : [N8N_WEBHOOK_URL_TEST, N8N_WEBHOOK_URL_PROD];
    let lastError: string | undefined;
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          return { success: true, message: 'Données envoyées', data };
        }
        lastError = await res.text();
      } catch (e) {
        lastError = e instanceof Error ? e.message : 'Erreur réseau';
      }
    }
    return { success: false, error: lastError || 'Aucun webhook disponible.' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}
