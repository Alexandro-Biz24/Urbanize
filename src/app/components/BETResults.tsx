import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { RefreshCcw, ShoppingCart, Shield, MapPin, CheckCircle, Wind } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { StripeCheckout } from './StripeCheckout';
import type { BETConfig } from './BETCalculator';

interface BETResultsProps {
  config: BETConfig;
  onReset: () => void;
}

const TERRAIN_CATEGORIES = {
  bord_mer: {
    label: 'Bord de mer',
    eurocodeCategory: 'Catégorie 0',
    description: 'Mer ou zone côtière exposée aux vents de mer'
  },
  rase_campagne: {
    label: 'Rase campagne',
    eurocodeCategory: 'Catégorie II',
    description: 'Campagne avec haies basses, arbres isolés'
  },
  campagne_haies: {
    label: 'Campagne avec haies',
    eurocodeCategory: 'Catégorie IIIa',
    description: 'Campagne avec nombreuses haies ou arbres'
  },
  zone_urbanisee: {
    label: 'Zone urbanisée',
    eurocodeCategory: 'Catégorie IIIb',
    description: 'Zone avec bâtiments industriels ou habitations'
  },
  zone_urbaine: {
    label: 'Zone urbaine (>15% surface bâtie)',
    eurocodeCategory: 'Catégorie IV',
    description: 'Zone urbaine dense avec bâtiments de grande hauteur'
  }
};

const BET_PRICE = 1600;

// Fonction pour déterminer la zone de vent selon le département (2 premiers chiffres du code postal)
function getWindZone(postalCode: string, country: string, city?: string): { zone: number; vb: number; description: string } {
  // Pour la France uniquement
  if (country !== 'France') {
    return { zone: 2, vb: 24, description: 'Zone standard (hors France métropolitaine)' };
  }

  const dept = parseInt(postalCode.substring(0, 2));
  const cityLower = city?.toLowerCase().trim() || '';
  
  // Normaliser la ville (retirer accents, tirets, etc. pour meilleure correspondance)
  const normalizeCity = (str: string) => {
    return str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/['-]/g, ' ')
      .trim();
  };
  
  const cityNorm = normalizeCity(cityLower);
  
  // Mapping des départements selon le tableau 4.3(NA) - Définition des régions climatiques
  
  // ========== RÉGION 4 (Zone 4, Vb = 28 m/s) - Zones les plus exposées ==========
  
  // 2A Corse-du-Sud - Région 4 uniquement pour communes littorales spécifiques
  if (postalCode.startsWith('2A') || dept === 20) {
    const zone4Cities = ['bonifacio', 'figari', 'levie', 'porto vecchio', 'serra di scopamene', 'sotta'];
    if (zone4Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 4, vb: 28, description: 'Corse-du-Sud (littoral exposé)' };
    }
    // Sinon région 3 pour le reste de la Corse-du-Sud
    return { zone: 3, vb: 26, description: 'Corse-du-Sud' };
  }
  
  // 2B Haute-Corse - Région 4 uniquement pour communes littorales spécifiques
  if (postalCode.startsWith('2B') || (dept === 20 && cityNorm.includes('bastia'))) {
    const zone4Cities = ['ile rousse', 'l ile rousse', 'calenzana', 'calvi', 'belgodere'];
    if (zone4Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 4, vb: 28, description: 'Haute-Corse (littoral exposé)' };
    }
    // Sinon région 3 pour le reste de la Haute-Corse
    return { zone: 3, vb: 26, description: 'Haute-Corse' };
  }
  
  // ========== RÉGION 3 (Zone 3, Vb = 26 m/s) - Zones côtières exposées ==========
  
  // Départements entièrement en région 3
  if ([13, 22, 29, 34, 56, 85].includes(dept)) {
    const deptNames: { [key: number]: string } = {
      13: 'Bouches-du-Rhône',
      22: 'Côtes-d\'Armor',
      29: 'Finistère',
      34: 'Hérault',
      56: 'Morbihan',
      85: 'Vendée'
    };
    return { zone: 3, vb: 26, description: deptNames[dept] };
  }
  
  // ========== Départements MIXTES avec certaines communes en région 3 ==========
  
  // 11 Aude - Régions 2,3 (majoritairement région 3 sur littoral)
  if (dept === 11) {
    // Liste des cantons région 3 selon le tableau
    const zone3Cities = ['capendu', 'castelnaudary', 'conques', 'coursan', 'duban', 'lagrasse', 
                         'lezignan', 'narbonne', 'peyriac', 'sigean'];
    if (zone3Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 3, vb: 26, description: 'Aude (zone exposée)' };
    }
    return { zone: 2, vb: 24, description: 'Aude (intérieur)' };
  }
  
  // 17 Charente-Maritime - Régions 1,2,3 (complexe)
  if (dept === 17) {
    // Région 1 - communes spécifiques
    const zone1Cities = ['montendre', 'montguyon', 'montlieu'];
    if (zone1Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 1, vb: 22, description: 'Charente-Maritime (zone intérieure protégée)' };
    }
    
    // Région 2 - communes intermédiaires
    const zone2Cities = ['archiac', 'aulnay', 'burie', 'cozes', 'gemozac', 'jonzac', 'loulay', 
                         'matha', 'mirambeau', 'pons', 'saintes', 'saint genis', 'saint hilaire', 
                         'saint jean', 'saint porchaire', 'saint savinien', 'saujon', 'tonnay'];
    if (zone2Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 2, vb: 24, description: 'Charente-Maritime (zone intermédiaire)' };
    }
    
    // Par défaut région 3 (littoral)
    return { zone: 3, vb: 26, description: 'Charente-Maritime (littoral)' };
  }
  
  // 30 Gard - Régions 2,3
  if (dept === 30) {
    const zone3Cities = ['aigues mortes', 'aimargues', 'aramon', 'beaucaire', 'bouillargues', 
                         'saint gilles', 'marguerites', 'nimes', 'quissac', 'saint mamert', 
                         'sommieres', 'vauvert'];
    if (zone3Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 3, vb: 26, description: 'Gard (zone exposée)' };
    }
    return { zone: 2, vb: 24, description: 'Gard' };
  }
  
  // 44 Loire-Atlantique - Régions 2,3
  if (dept === 44) {
    const zone3Cities = ['ancenis', 'blain', 'chateaubriant', 'clisson', 'guerande', 'lege', 
                         'machecoul', 'nantes', 'paimboeuf', 'saint etienne', 'saint nazaire', 
                         'saint philbert', 'savenay', 'vertou'];
    if (zone3Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 3, vb: 26, description: 'Loire-Atlantique (zone exposée)' };
    }
    return { zone: 2, vb: 24, description: 'Loire-Atlantique' };
  }
  
  // 59 Nord - Régions 2,3 (SEULEMENT certaines communes en région 3)
  if (dept === 59) {
    const zone3Cities = ['armentieres', 'avesnes nord', 'avesnes sud', 'bailleul', 'bavay', 
                         'cambrai est', 'cambrai ouest', 'cassel', 'clary', 'conde', 'denain', 
                         'douai', 'dunkerque', 'hazebrouck', 'hondschoote', 'le quesnoy est', 
                         'le quesnoy ouest', 'lille', 'loos', 'marcoing', 'merville', 'orchies', 
                         'roubaix', 'seclin', 'solesmes', 'steenvoorde', 'tourcoing', 'valenciennes', 
                         'wormhout'];
    if (zone3Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 3, vb: 26, description: 'Nord (zone exposée)' };
    }
    // Par défaut région 2 pour le reste (comme Arleux)
    return { zone: 2, vb: 24, description: 'Nord' };
  }
  
  // 62 Pas-de-Calais - Régions 2,3
  if (dept === 62) {
    const zone3Cities = ['aire', 'arras', 'aubigny', 'auxi', 'avion', 'beaumetz', 'berck', 
                         'bethune', 'boulogne', 'bruay', 'calais', 'cambrin', 'carvin', 'desvres', 
                         'etaples', 'fruges', 'guines', 'harnes', 'hebuterne', 'henin', 'hesdin', 
                         'houdain', 'hucqueliers', 'lens', 'lievin', 'lillers', 'marquise', 
                         'montreuil', 'norrent fontes', 'pas', 'saint omer', 'saint pol', 
                         'samer', 'vimy', 'vitry'];
    if (zone3Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 3, vb: 26, description: 'Pas-de-Calais (zone exposée)' };
    }
    return { zone: 2, vb: 24, description: 'Pas-de-Calais' };
  }
  
  // 76 Seine-Maritime - Régions 2,3
  if (dept === 76) {
    const zone3Cities = ['bacqueville', 'blangy', 'cany barville', 'eu', 'dieppe', 'envermeu', 
                         'fontaine le dun', 'offranville', 'saint valery'];
    if (zone3Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 3, vb: 26, description: 'Seine-Maritime (littoral)' };
    }
    return { zone: 2, vb: 24, description: 'Seine-Maritime' };
  }
  
  // 80 Somme - Régions 2,3
  if (dept === 80) {
    const zone3Cities = ['ailly', 'albert', 'bray', 'chaulnes', 'combles', 'ham', 'montdidier', 
                         'morell', 'nesle', 'peronne', 'roisel', 'rosieres'];
    if (zone3Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 3, vb: 26, description: 'Somme (zone exposée)' };
    }
    return { zone: 2, vb: 24, description: 'Somme' };
  }
  
  // ========== RÉGION 2 (Zone 2, Vb = 24 m/s) - Majorité du territoire ==========
  
  // Départements entièrement ou majoritairement en région 2
  if ([2, 3, 5, 7, 8, 9, 10, 12, 14, 15, 18, 21, 25, 26, 27, 28, 31, 33, 35, 36, 37, 38, 
       40, 41, 42, 43, 45, 48, 49, 50, 51, 52, 53, 54, 55, 57, 58, 60, 61, 63, 64, 
       65, 67, 68, 69, 71, 72, 75, 77, 78, 79, 83, 84, 86, 88, 89, 90, 91, 92, 93, 94, 95].includes(dept)) {
    const deptNames: { [key: number]: string } = {
      2: 'Aisne', 3: 'Allier', 5: 'Hautes-Alpes', 7: 'Ardèche', 8: 'Ardennes', 
      9: 'Ariège', 10: 'Aube', 12: 'Aveyron', 14: 'Calvados', 15: 'Cantal',
      18: 'Cher', 21: 'Côte-d\'Or', 25: 'Doubs', 26: 'Drôme', 27: 'Eure',
      28: 'Eure-et-Loir', 31: 'Haute-Garonne', 33: 'Gironde', 35: 'Ille-et-Vilaine',
      36: 'Indre', 37: 'Indre-et-Loire', 38: 'Isère', 40: 'Landes', 41: 'Loir-et-Cher',
      42: 'Loire', 43: 'Haute-Loire', 45: 'Loiret', 48: 'Lozère', 49: 'Maine-et-Loire',
      50: 'Manche', 51: 'Marne', 52: 'Haute-Marne', 53: 'Mayenne', 54: 'Meurthe-et-Moselle',
      55: 'Meuse', 57: 'Moselle', 58: 'Nièvre', 60: 'Oise', 61: 'Orne',
      63: 'Puy-de-Dôme', 64: 'Pyrénées-Atlantiques', 65: 'Hautes-Pyrénées', 67: 'Bas-Rhin',
      68: 'Haut-Rhin', 69: 'Rhône', 71: 'Saône-et-Loire', 72: 'Sarthe', 75: 'Paris',
      77: 'Seine-et-Marne', 78: 'Yvelines', 79: 'Deux-Sèvres', 83: 'Var', 84: 'Vaucluse',
      86: 'Vienne', 88: 'Vosges', 89: 'Yonne', 90: 'Territoire de Belfort',
      91: 'Essonne', 92: 'Hauts-de-Seine', 93: 'Seine-Saint-Denis', 94: 'Val-de-Marne', 95: 'Val-d\'Oise'
    };
    return { zone: 2, vb: 24, description: deptNames[dept] || 'Zone 2' };
  }
  
  // ========== Départements MIXTES (Régions 1,2) ==========
  
  // 01 Ain - Régions 1,2
  if (dept === 1) {
    const zone2Cities = ['bage', 'chalamont', 'chatillon', 'coligny', 'maximieux', 'miribel', 
                         'montluel', 'montrevel', 'pont de vaux', 'pont de veyle', 'reyrieux', 
                         'saint trivier de courtes', 'saint trivier', 'thoissey', 'trevoux', 'villars'];
    if (zone2Cities.some(c => cityNorm.includes(normalizeCity(c)))) {
      return { zone: 2, vb: 24, description: 'Ain' };
    }
    return { zone: 1, vb: 22, description: 'Ain (zone protégée)' };
  }
  
  // 04 Alpes-de-Haute-Provence - Régions 1,2 (par défaut région 2)
  if (dept === 4) {
    return { zone: 2, vb: 24, description: 'Alpes-de-Haute-Provence' };
  }
  
  // 06 Alpes-Maritimes - Régions 1,2 (par défaut région 2)
  if (dept === 6) {
    return { zone: 2, vb: 24, description: 'Alpes-Maritimes' };
  }
  
  // 70 Haute-Saône - Régions 1,2 (par défaut région 2)
  if (dept === 70) {
    return { zone: 2, vb: 24, description: 'Haute-Saône' };
  }
  
  // 81 Tarn - Régions 1,2 (par défaut région 2)
  if (dept === 81) {
    return { zone: 2, vb: 24, description: 'Tarn' };
  }
  
  // ========== RÉGION 1 (Zone 1, Vb = 22 m/s) - Zones les plus protégées ==========
  
  if ([16, 19, 23, 24, 32, 39, 46, 47, 66, 73, 74, 82, 87].includes(dept)) {
    const descriptions: { [key: number]: string } = {
      16: 'Charente',
      19: 'Corrèze',
      23: 'Creuse',
      24: 'Dordogne',
      32: 'Gers',
      39: 'Jura',
      46: 'Lot',
      47: 'Lot-et-Garonne',
      66: 'Pyrénées-Orientales',
      73: 'Savoie',
      74: 'Haute-Savoie',
      82: 'Tarn-et-Garonne',
      87: 'Haute-Vienne'
    };
    return { zone: 1, vb: 22, description: descriptions[dept] || 'Zone protégée' };
  }
  
  // Par défaut, région 2 (zone la plus courante en France métropolitaine)
  return { zone: 2, vb: 24, description: 'Zone standard' };
}

export function BETResults({ config, onReset }: BETResultsProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const categoryData = TERRAIN_CATEGORIES[config.terrainCategory];
  const windData = getWindZone(config.postalCode, config.country, config.city);
  
  // Générer l'URL de la carte Google Maps
  const mapAddress = encodeURIComponent(
    `${config.street}, ${config.postalCode} ${config.city}, ${config.country}`
  );
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapAddress}&zoom=14`;

  const handlePurchaseClick = () => {
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    setPaymentSuccess(true);
  };

  const handleCancelCheckout = () => {
    setShowCheckout(false);
  };

  // Si le paiement a réussi, afficher la confirmation
  if (paymentSuccess) {
    return (
      <div className="max-w-4xl mx-auto pt-12">
        <Card className="border-2 border-green-500 shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-600" />
            <h2 className="text-3xl font-bold mb-4">Paiement réussi !</h2>
            <p className="text-lg text-slate-600 mb-6">
              Votre commande pour l'Étude BET a été confirmée.
            </p>
            <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-3">Prochaines étapes :</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Vous allez recevoir un email de confirmation à l'adresse fournie</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Notre bureau d'études prendra contact avec vous sous 48h</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>L'étude certifiée vous sera livrée dans un délai de 7 à 10 jours ouvrés</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={onReset}
              className="bg-black hover:bg-slate-800 text-white"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si on affiche le formulaire de paiement
  if (showCheckout) {
    return (
      <div className="max-w-2xl mx-auto pt-12">
        <StripeCheckout
          amount={BET_PRICE}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancelCheckout}
          orderDetails={{
            type: 'Étude BET - Résistance au vent',
            description: `Chantier : ${config.city} (${config.postalCode}) - Zone de vent ${windData.zone} - ${categoryData.label}`
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-12">
      <ProgressBar 
        currentStep={2} 
        totalSteps={4}
        steps={['Configuration', 'Analyse', 'Validation', 'Confirmation']}
      />
      
      <Card className="border-2 border-slate-200 shadow-lg mt-8">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">Récapitulatif Étude BET</h3>
              <p className="text-slate-600">Étude de résistance au vent certifiée</p>
            </div>
            <Button onClick={onReset} variant="outline" className="border-2">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>

          {/* Service Description */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <Shield className="w-10 h-10 text-blue-700 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2 text-blue-900">Étude certifiée Eurocode EN 1991-1-4</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Calculs de résistance au vent (renversement et glissement)</li>
                  <li>Analyse personnalisée selon la localisation de votre chantier</li>
                  <li>Rapport certifié par notre bureau d'études agréé</li>
                  <li>Recommandations techniques de lestage et fixation</li>
                  <li>Document valide pour votre assurance</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Site Location */}
          <div className="bg-slate-50 rounded-lg p-6 mb-6 border-2 border-slate-200">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Localisation du chantier
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-sm">
                <p className="font-medium">{config.street}</p>
                {config.street2 && <p className="text-slate-600">{config.street2}</p>}
                <p className="font-medium">{config.postalCode} {config.city}</p>
                <p className="text-slate-600">{config.country}</p>
              </div>
              <div className="h-48 rounded-lg overflow-hidden border-2 border-slate-300">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(config.postalCode)}&layer=mapnik&marker=${config.postalCode}%20${config.city}`}
                  allowFullScreen
                  title="Carte de localisation du chantier"
                />
              </div>
            </div>
          </div>

          {/* Wind Zone Analysis */}
          <div className="bg-cyan-50 rounded-lg p-6 mb-6 border-2 border-cyan-500">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-cyan-900">
              <Wind className="w-5 h-5" />
              Analyse de la zone de vent
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-cyan-700 mb-1">Zone de vent</p>
                  <p className="font-semibold text-cyan-900 text-2xl">Zone {windData.zone}</p>
                </div>
                <div>
                  <p className="text-xs text-cyan-700 mb-1">Vitesse de base Vb</p>
                  <p className="font-semibold text-cyan-900 text-2xl">{windData.vb} m/s</p>
                </div>
                <div>
                  <p className="text-xs text-cyan-700 mb-1">Équivalent</p>
                  <p className="font-semibold text-cyan-900">{Math.round(windData.vb * 3.6)} km/h</p>
                </div>
              </div>
              <div className="pt-3 border-t border-cyan-300">
                <p className="text-sm text-cyan-800">
                  <strong>Région :</strong> {windData.description}
                </p>
                <p className="text-xs text-cyan-700 mt-1">
                  Selon carte des vents de France - Eurocode NF EN 1991-1-4
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border-2 border-black rounded-lg p-8 mb-8 bg-white">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Prix de l'étude certifiée</p>
              <p className="text-5xl font-bold mb-2">
                {BET_PRICE.toLocaleString('fr-FR')} €
              </p>
              <p className="text-slate-600">HT</p>
              <p className="text-sm text-slate-600 mt-4">
                Rapport personnalisé avec calculs détaillés
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-orange-900">
              <strong>Important :</strong> Cette étude est un élément de sécurité essentiel qui protège votre 
              responsabilité et vous couvre vis-à-vis de votre assurance en cas d'accident ou de forte tempête.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={handlePurchaseClick}
              className="flex-1 bg-black hover:bg-slate-800 text-white py-6"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Acheter l'étude
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}