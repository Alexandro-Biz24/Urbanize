# Format de réponse attendu de n8n

## Format actuel (prioritaire)

```json
{
  "success": true,
  "result_estimation": 19457.466666666667
}
```

Le champ `result_estimation` contient le prix total en €.

---

## Format alternatif (legacy)

Quand n8n traite les données et renvoie une réponse, elle peut aussi suivre ce format :

```json
{
  "success": true,
  "estimation": {
    "totalPrice": 1250.50,
    "materialCost": 800.00,
    "foundationCost": 0,
    "gatesCost": 0,
    "laborCost": 450.50,
    "betCost": 0,
    "breakdown": {
      // Détails optionnels de la décomposition
    }
  },
  "message": "Estimation calculée avec succès"
}
```

## Champs requis

### Pour tous les projets

- `success` (boolean) : `true` si le calcul a réussi
- `estimation.totalPrice` ou `estimation.totalCost` (number) : Prix total

### Pour Palissade

- `estimation.materialCost` (number) : Coût des matériaux
- `estimation.foundationCost` (number) : Coût des fondations (pour montage)
- `estimation.gatesCost` (number) : Coût des portails/portillons
- `estimation.laborCost` (number) : Coût de l'installation
- `estimation.betCost` (number) : Coût du BET si inclus

### Pour Totem, Massif, BET

Vous pouvez adapter les champs selon vos besoins. Le frontend utilisera principalement `totalPrice`.

## Exemple de réponse n8n

```javascript
// Dans n8n, votre dernier nœud doit retourner :
return {
  success: true,
  estimation: {
    totalPrice: 1250.50,
    materialCost: 800.00,
    laborCost: 450.50,
    breakdown: {
      dibond: {
        surface: 50,
        unitPrice: 16.00,
        total: 800.00
      }
    }
  },
  message: "Estimation calculée avec succès"
};
```

## Gestion des erreurs

Si une erreur survient, renvoyez :

```json
{
  "success": false,
  "error": "Message d'erreur descriptif"
}
```

Le frontend affichera une alerte avec ce message et utilisera un calcul de fallback si disponible.
