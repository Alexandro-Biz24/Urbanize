/**
 * Serveur Express simple pour proxy vers webhook n8n
 * 
 * Ce serveur reçoit les données du frontend et les transmet au webhook n8n
 * Vous pouvez aussi appeler directement le webhook n8n depuis le frontend
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// URL du webhook n8n - À CONFIGURER dans .env ou ici
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://urbaniz.app.n8n.cloud/webhook-test/palissade';

/**
 * Route principale pour recevoir les données et les envoyer vers n8n
 */
app.post('/api/webhook', async (req, res) => {
  try {
    const data = req.body;
    
    console.log('📥 Données reçues:', JSON.stringify(data, null, 2));

    // Envoyer vers le webhook n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur n8n:', errorText);
      return res.status(response.status).json({
        success: false,
        error: `Erreur n8n: ${errorText}`,
      });
    }

    const responseData = await response.json().catch(() => ({}));
    
    console.log('✅ Données envoyées avec succès vers n8n');
    
    res.json({
      success: true,
      message: 'Données envoyées avec succès',
      data: responseData,
    });
  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur serveur',
    });
  }
});

/**
 * Route de santé
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Route pour tester la connexion au webhook n8n
 */
app.get('/api/test-webhook', async (req, res) => {
  try {
    const testData = {
      metadata: {
        timestamp: new Date().toISOString(),
        test: true,
        source: 'urbanize-backend-test',
      },
      message: 'Test de connexion au webhook n8n',
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Erreur: ${response.status} ${response.statusText}`,
      });
    }

    res.json({
      success: true,
      message: 'Connexion au webhook n8n réussie',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur de connexion',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend Urbanize démarré sur http://localhost:${PORT}`);
  console.log(`📡 Webhook n8n configuré: ${N8N_WEBHOOK_URL}`);
  console.log(`\nRoutes disponibles:`);
  console.log(`  POST /api/webhook - Envoyer des données vers n8n`);
  console.log(`  GET  /health - Vérifier l'état du serveur`);
  console.log(`  GET  /api/test-webhook - Tester la connexion n8n`);
});
