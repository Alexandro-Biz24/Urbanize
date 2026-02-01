# Configuration du Webhook n8n pour Urbanize

## Réponse à votre question : UN SEUL WEBHOOK

**✅ OUI, on utilise UN SEUL webhook** pour :
- **Envoyer** les choix de l'utilisateur depuis le frontend
- **Recevoir** les résultats de n8n dans la même requête

C'est la solution la plus simple et efficace !

## Comment ça fonctionne ?

### Flow complet

1. **Utilisateur remplit le formulaire** (matériaux, mètres linéaires, etc.)
2. **Frontend collecte toutes les données** depuis `sessionStorage`
3. **Frontend envoie POST** vers le webhook n8n avec toutes les données
4. **n8n reçoit les données**, fait les calculs/estimations
5. **n8n renvoie immédiatement la réponse** dans la même requête HTTP
6. **Frontend reçoit les résultats** et les affiche

### Avantages

- ✅ **Simple** : Une seule URL à configurer
- ✅ **Synchrone** : Réponse immédiate, pas besoin de polling
- ✅ **Pas de complexité** : Pas besoin de gérer deux endpoints

## Configuration

### ⚠️ Corriger l’erreur « Unused Respond to Webhook node »

Si tu vois **"Unused Respond to Webhook node found in the workflow"** ou **"le nœud Respond to Webhook n'est pas exécuté"** :

n8n exige **deux nœuds** et **une connexion entre eux** :

1. **Webhook Trigger** (reçoit la requête)
2. **Respond to Webhook** (envoie la réponse) — ce nœud **doit être exécuté** pendant le workflow, donc **relié** au Webhook.

**À faire dans n8n :**

1. Ouvre ton workflow.
2. Clique sur le nœud **Webhook Trigger** (ou **Webhook**).
3. Dans les paramètres du Webhook, trouve **« Respond »** / **« Response »** / **« Response Mode »**.
4. Choisis **« Using 'Respond to Webhook' node »** (et non « When Last Node Finishes »).
5. Ajoute un nœud **« Respond to Webhook »** (recherche « Respond to Webhook » dans la palette).
6. **Relie les nœuds** : tire une flèche **du Webhook Trigger vers le nœud Respond to Webhook** (sortie du Webhook → entrée du Respond to Webhook). Sans cette connexion, le nœud Respond to Webhook n’est jamais exécuté → erreur.
7. Dans le nœud **Respond to Webhook** :
   - **Respond With** : « JSON »
   - **Response Body** : par exemple (pour tester) :
   ```json
   {
     "success": true,
     "estimation": {
       "totalPrice": 38000,
       "totalCost": 38000,
       "materialCost": 20000,
       "laborCost": 18000
     }
   }
   ```
8. **Sauvegarde** le workflow et **active-le** (toggle « Active » en haut).

**Schéma du flux minimal :**

```
[Webhook Trigger]  ——(connexion obligatoire)——►  [Respond to Webhook]
```

Dès que la flèche va du Webhook jusqu’au Respond to Webhook, l’erreur disparaît.

---

### 1. Dans n8n (workflow complet)

1. Créez un nouveau workflow (ou corrigez l’existant comme ci-dessus).
2. Nœud **Webhook** (ou **Webhook Trigger**) :
   - **HTTP Method** : `POST`
   - **Path** : celui de votre URL (ex. `data-webhook`)
   - **Respond** : **« Using 'Respond to Webhook' node »** ⚠️

3. **Connectez** ce Webhook à un nœud **Respond to Webhook** (obligatoire pour que la réponse soit envoyée).

4. Optionnel : entre le Webhook et le Respond to Webhook, ajoutez des nœuds de traitement (Code, etc.). Le flux doit toujours **aboutir** au nœud **Respond to Webhook**.

Exemple avec un nœud **Code** avant le Respond to Webhook :

```javascript
// Nœud Code : prépare les données
const body = $input.first().json.body || {};
return {
  json: {
    success: true,
    estimation: {
      totalPrice: 38000,
      totalCost: 38000,
      materialCost: 20000,
      laborCost: 18000,
      breakdown: {}
    }
  }
};
```

Puis connectez la **sortie** de ce nœud Code à l’**entrée** du nœud **Respond to Webhook**, et dans Respond to Webhook choisissez par ex. **Respond With** = « First Incoming Item » pour renvoyer ce JSON.

### 2. Dans le code frontend

Créez un fichier `.env` à la racine du projet `Urbanize/` :

```env
VITE_N8N_WEBHOOK_URL=https://urbaniz.app.n8n.cloud/webhook-test/palissade
```

**Important** : Les variables d'environnement Vite doivent commencer par `VITE_`

### 3. Redémarrer le serveur

Après avoir créé/modifié le `.env`, redémarrez le serveur de développement :

```bash
npm run dev
```

## Format des données

### Données envoyées au webhook

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
  },
  "pricing": {
    "materialCost": 800,
    "laborCost": 450.50,
    "totalCost": 1250.50
  }
}
```

### Réponse attendue de n8n

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
      }
    }
  },
  "message": "Estimation calculée avec succès"
}
```

## Envoi automatique

Les données sont **automatiquement envoyées** quand l'utilisateur arrive sur la page de résultats :
- `PalissadeResultsPage` → envoie les données palissade
- `TotemResultsPage` → envoie les données totem
- `MassifResultsPage` → envoie les données massif
- `BETResultsPage` → envoie les données BET

Vous pouvez voir les logs dans la console du navigateur (F12).

## Test

Pour tester, vous pouvez utiliser le hook `useWebhook` dans n'importe quel composant :

```typescript
import { useWebhook } from '../hooks/useWebhook';

function MonComposant() {
  const { sendProject, loading, error } = useWebhook();
  
  const handleSend = async () => {
    const response = await sendProject('palissade');
    if (response.success) {
      console.log('Résultats:', response.data);
    }
  };
  
  return <button onClick={handleSend}>Envoyer</button>;
}
```

## Alternative : Deux webhooks (si nécessaire)

Si vous avez besoin d'un traitement asynchrone (calculs très longs), vous pouvez utiliser deux webhooks :

1. **Webhook 1** : `/webhook/receive` - Reçoit les données
2. **Webhook 2** : `/webhook/results` - Renvoie les résultats

Mais pour votre cas, **un seul webhook est recommandé** !

## Support

Si vous avez des questions, consultez :
- `backend/WEBHOOK_EXPLANATION.md` - Explication détaillée
- `backend/README.md` - Documentation du backend
