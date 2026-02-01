# Comment fonctionne le système de webhook avec n8n

## Architecture recommandée : UN SEUL WEBHOOK

### Pourquoi un seul webhook ?

**✅ Avantages :**
- **Simple** : Une seule URL à configurer
- **Synchrone** : Le frontend envoie les données et reçoit immédiatement la réponse
- **Pas de polling** : Pas besoin de vérifier périodiquement si les résultats sont prêts
- **Moins de complexité** : Pas besoin de gérer deux endpoints différents

### Comment ça marche ?

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │         │   Backend    │         │     n8n     │
│  (React)    │         │  (Express)   │         │  (Webhook)  │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                        │                        │
       │  1. POST /api/webhook  │                        │
       │────────────────────────>│                        │
       │                        │  2. POST données      │
       │                        │──────────────────────>│
       │                        │                        │
       │                        │  3. Traitement n8n   │
       │                        │     (calculs, etc.)    │
       │                        │                        │
       │                        │  4. Réponse avec      │
       │                        │     résultats          │
       │                        │<──────────────────────│
       │  5. Réponse avec       │                        │
       │     résultats          │                        │
       │<────────────────────────│                        │
       │                        │                        │
```

### Flow détaillé

1. **Frontend** : L'utilisateur remplit le formulaire (matériaux, mètres linéaires, etc.)
2. **Frontend** : Les données sont collectées depuis `sessionStorage`
3. **Frontend** : Envoi POST vers `/api/webhook` avec toutes les données
4. **Backend** : Reçoit les données et les transmet au webhook n8n
5. **n8n** : 
   - Reçoit les données via le webhook
   - Traite les données (calculs de prix, estimations, etc.)
   - Génère les résultats
   - **Renvoie immédiatement la réponse** dans la même requête HTTP
6. **Backend** : Transmet la réponse de n8n au frontend
7. **Frontend** : Reçoit les résultats et les affiche

## Configuration n8n

### Étape 1 : Créer un workflow n8n

1. Créez un nouveau workflow dans n8n
2. Ajoutez un nœud **Webhook** comme premier nœud
3. Configurez le webhook :
   - **HTTP Method** : POST
   - **Path** : `/urbanize` (ou ce que vous voulez)
   - **Response Mode** : "Respond to Webhook" (IMPORTANT !)

### Étape 2 : Traiter les données

Après le nœud Webhook, ajoutez vos nœuds de traitement :
- **Function** : Pour transformer les données
- **Code** : Pour faire vos calculs
- **HTTP Request** : Pour appeler d'autres APIs si nécessaire
- etc.

### Étape 3 : Renvoyer la réponse

Le dernier nœud doit renvoyer les résultats. Vous pouvez :
- Utiliser le nœud **Respond to Webhook** (si vous avez choisi "Wait for Response" dans le webhook)
- Ou simplement retourner les données depuis un nœud **Function** ou **Code**

**Exemple de réponse dans n8n (nœud Function/Code) :**

```javascript
// Dans n8n, le dernier nœud doit retourner les données
return {
  success: true,
  estimation: {
    totalPrice: 1250.50,
    materialCost: 800.00,
    laborCost: 450.50,
    breakdown: {
      // Vos détails de calcul
    }
  },
  message: "Estimation calculée avec succès"
};
```

## Alternative : Deux webhooks (si nécessaire)

Si vous avez besoin d'un traitement asynchrone (long calculs), vous pouvez utiliser deux webhooks :

1. **Webhook 1** : `/webhook/receive` - Reçoit les données du frontend
   - n8n traite les données
   - n8n envoie les résultats vers **Webhook 2**

2. **Webhook 2** : `/webhook/results` - Reçoit les résultats de n8n
   - Le frontend fait un polling ou utilise WebSockets pour récupérer les résultats

**⚠️ Mais pour votre cas, un seul webhook est recommandé !**

## Exemple de payload envoyé

```json
{
  "metadata": {
    "timestamp": "2026-01-25T12:00:00.000Z",
    "sessionId": "session_123456",
    "projectType": "palissade",
    "projectSubType": "habillage",
    "source": "urbanize-frontend",
    "version": "1.0.0"
  },
  "project": {
    "type": "palissade",
    "subType": "habillage",
    "configuration": {
      "height": 2,
      "materials": [
        {
          "type": "dibond",
          "surface": 50,
          "length": 25
        }
      ],
      "includeInstaller": true
    }
  }
}
```

## Exemple de réponse attendue de n8n

```json
{
  "success": true,
  "estimation": {
    "totalPrice": 1250.50,
    "materialCost": 800.00,
    "laborCost": 450.50,
    "breakdown": {
      "dibond": {
        "surface": 50,
        "unitPrice": 16.00,
        "total": 800.00
      },
      "installation": {
        "surface": 50,
        "unitPrice": 9.01,
        "total": 450.50
      }
    }
  },
  "message": "Estimation calculée avec succès"
}
```

## Configuration dans le code

### Frontend (.env ou vite.config.ts)

```env
VITE_N8N_WEBHOOK_URL=https://urbaniz.app.n8n.cloud/webhook-test/palissade
```

### Backend (.env)

```env
N8N_WEBHOOK_URL=https://urbaniz.app.n8n.cloud/webhook-test/palissade
```

## Résumé

✅ **Utilisez UN SEUL webhook** qui :
- Reçoit les données du frontend
- Traite dans n8n
- Renvoie immédiatement les résultats dans la même requête HTTP

C'est la solution la plus simple et efficace pour votre cas d'usage !
