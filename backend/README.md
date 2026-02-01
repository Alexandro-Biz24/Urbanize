# Backend Urbanize

Backend simple pour proxy vers webhook n8n.

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copiez `.env.example` vers `.env`:
```bash
cp .env.example .env
```

2. Modifiez `.env` et ajoutez votre URL de webhook n8n:
```
N8N_WEBHOOK_URL=https://urbaniz.app.n8n.cloud/webhook-test/palissade
```

## Lancement

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:3001` par défaut.

## Routes API

### POST /api/webhook
Reçoit les données du frontend et les transmet au webhook n8n.

**Body:**
```json
{
  "metadata": {
    "timestamp": "2026-01-25T12:00:00.000Z",
    "sessionId": "session_123",
    "projectType": "palissade"
  },
  "project": {
    "type": "palissade",
    "subType": "habillage",
    "configuration": { ... }
  }
}
```

### GET /health
Vérifie l'état du serveur.

### GET /api/test-webhook
Teste la connexion au webhook n8n.

## Note

Vous pouvez aussi appeler directement le webhook n8n depuis le frontend sans passer par ce backend. 
Ce backend est optionnel et sert principalement de proxy si vous avez besoin de :
- Ajouter de l'authentification
- Logger les requêtes
- Transformer les données avant envoi
- Gérer les erreurs de manière centralisée
