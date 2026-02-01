import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { AppRoutes } from './routes';

// Export des types pour l'utilisation dans les pages
export type MaterialType = 'dibond' | 'dibond_antigraffiti' | 'tole' | 'bois' | 'vegetal';

export type RALColor = 
  | '1015' | '1018' | '1023' 
  | '2004' | '2008' 
  | '3000' | '3020' 
  | '5001' | '5002' | '5011' | '5012' | '5017' | '5019' 
  | '6001' | '6004' | '6005' | '6008' | '6009' | '6012' | '6018' | '6019' | '6024' 
  | '7005' | '7011' | '7040' 
  | '9002' | '9006' | '9010';

export interface MaterialSelection {
  type: MaterialType;
  length: number;
  surface?: number; // m² pour chaque bardage
  ralColor?: RALColor; // Uniquement pour la tôle
  includeProtectionFrame?: boolean; // Châssis de protection pour dibond et bois
  vegetalType?: 'feuillage' | 'mur'; // Type de végétal synthétique
  vegetalVariety?: string; // Variété de végétal (buis, jasmin, etc.)
  boisTreatment?: 'classe2' | 'classe3'; // Traitement du bois
}

export type PortailType = 
  | 'galvanise_4m_battant'
  | 'galvanise_5m_battant'
  | 'galvanise_6m_battant'
  | 'galvanise_4m_coulissant'
  | 'galvanise_5m_coulissant'
  | 'galvanise_6m_coulissant'
  | 'galvanise_7m_coulissant';

export type PortillonType = 
  | 'bois_0_9m'
  | 'bois_1_4m'
  | 'galvanise_0_9m'
  | 'galvanise_1_4m';

export interface PortailSelection {
  type: PortailType;
}

export interface PortillonSelection {
  type: PortillonType;
}

export interface HoardingConfig {
  projectType: 'habillage' | 'montage';
  // Habillage simple
  length?: number;
  height: number;
  // Métadonnées STRUCTURE pour le webhook
  zoneGeographique?: string;
  terrainCategory?: string;
  soilType?: string;
  espacementBastaings?: string; // valeur numérique (m)
  lestType?: string;
  // Métadonnées HABILLAGE pour le webhook
  oculiUnite?: number;
  oculiType?: string;
  accompagnementSouhaite?: string;
  // Métadonnées PORTAIL pour le webhook
  portailUnite?: number;
  portailTypeLabel?: string;
  portillonUnite?: number;
  portillonTypeLabel?: string;
  material?: MaterialType;
  ralColor?: RALColor; // Couleur RAL pour la tôle (mode habillage)
  includeWoodSaturator?: boolean; // Saturateur bois pour les lames de sapin
  // Montage et habillage
  soilEnrobe?: number; // ml sur sol enrobé
  soilMeuble?: number; // ml sur sol meuble
  portails?: number;
  portailsSelections?: PortailSelection[]; // Sélection détaillée des portails
  portillons?: number;
  portillonsSelections?: PortillonSelection[]; // Sélection détaillée des portillons
  materials?: MaterialSelection[]; // Jusqu'à 3 types
  includeInstaller: boolean; // Installation physique (pose)
  includeBET?: boolean; // Bureau d'études techniques (montage seulement)
  includeCERFA?: boolean; // Demande d'autorisation pré-enseigne CERFA
  // Livraison
  deliveryAddress?: string;
  deliveryInstructions?: string;
  deliveryDate?: string;
}

export interface PriceBreakdown {
  materialCost: number;
  foundationCost: number;
  gatesCost: number;
  laborCost: number;
  betCost: number;
  totalCost: number;
  /** Si true, le total vient du webhook n8n → afficher le prix exact (pas de fourchette ±5%) */
  fromWebhook?: boolean;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <AppRoutes />
        <ChatWidget />
        <Footer />
      </div>
    </BrowserRouter>
  );
}