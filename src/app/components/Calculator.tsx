import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ArrowRight, Plus, X, Info } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { RALSelector } from './RALSelector';
import { MATERIAL_PRICES, INSTALLATION_PRICE_PER_M2, INSTALLATION_MINIMUM } from '../lib/pricing';
import type { HoardingConfig, MaterialType, MaterialSelection, RALColor } from '../App';

interface CalculatorProps {
  projectType: 'habillage' | 'montage';
  onCalculate: (config: HoardingConfig) => void;
}

const MATERIAL_LABELS = {
  dibond: 'Dibond imprimé anti-UV',
  dibond_antigraffiti: 'Dibond imprimé anti-graffiti',
  tole: 'Tôle ondulée bac acier',
  bois: 'Lames de sapin Coffrage brut Avivé',
  vegetal: 'Végétal synthétique'
};

const MATERIAL_DESCRIPTIONS = {
  dibond: 'Épaisseur: 3mm • Impression HD 1200 dpi • Empreinte carbone: 10,38 kgCO2e/m²',
  dibond_antigraffiti: 'Épaisseur: 3mm • Lamination anti-graffiti • Impression HD 1200 dpi • Empreinte carbone: 10,38 kgCO2e/m²',
  tole: 'Format: 3m x 1m • Empreinte carbone: 1,33 kgCO2e/m²',
  bois: 'Lames de 27mm x 200mm x 4m • Empreinte carbone: 0,45 kgCO2e/m²',
  vegetal: 'Feuillage synthétique sur support maille • Empreinte carbone: 2,1 kgCO2e/m²'
};

const MATERIAL_CO2 = {
  dibond: 10.38,
  dibond_antigraffiti: 10.38,
  tole: 1.33,
  bois: 0.45,
  vegetal: 2.1
} as const;

// Options de végétal synthétique
const VEGETAL_OPTIONS = {
  feuillage: [
    { value: 'buis', label: 'Buis' },
    { value: 'fougere', label: 'Fougère' },
    { value: 'primevere', label: 'Primevère' },
    { value: 'cypres_vert', label: 'Cyprès vert' },
    { value: 'buisson_intense', label: 'Buisson intense' },
    { value: 'laurier_rouge', label: 'Laurier rouge' },
    { value: 'lierre', label: 'Lierre' },
    { value: 'laurier_cerise', label: 'Laurier cerise' }
  ],
  mur: [
    { value: 'jasmin', label: 'Jasmin' },
    { value: 'oxygene', label: 'Oxygène' },
    { value: 'serenite', label: 'Sérénité' },
    { value: 'harmonie', label: 'Harmonie' },
    { value: 'mango_green', label: 'Mango green' },
    { value: 'tropical', label: 'Tropical' },
    { value: 'savane', label: 'Savane' },
    { value: 'liseron_blanc', label: 'Liseron blanc' },
    { value: 'bougainvillier', label: 'Bougainvillier' }
  ]
} as const;

// 1 pot de 5L couvre environ 40m² 
const SATURATOR_COVERAGE = 40; // m² par pot de 5L

// Messages d'encouragement selon la longueur de palissade
const getEncouragingMessage = (surfaceInM2: number): string => {
  if (surfaceInM2 >= 400) {
    return "C'est un projet monumental ! Nous sommes particulièrement honorés de vous accompagner sur cette réalisation d'envergure exceptionnelle et mettons à votre disposition toute notre expertise pour garantir son succès.";
  } else if (surfaceInM2 >= 360) {
    return "C'est un projet exceptionnel ! Nous sommes fiers de vous accompagner sur cette réalisation majeure et mobilisons toutes nos ressources pour assurer sa parfaite exécution.";
  } else if (surfaceInM2 >= 300) {
    return "C'est un projet remarquable ! Nous sommes ravis de vous accompagner sur cette belle réalisation et mettons tout en œuvre pour vous proposer une solution optimale.";
  } else if (surfaceInM2 >= 240) {
    return "C'est un grand projet ! Nous sommes enthousiastes à l'idée de vous accompagner dans sa réalisation et nous engageons à vous offrir le meilleur accompagnement possible.";
  } else if (surfaceInM2 >= 200) {
    return "C'est un projet d'envergure ! Nous sommes ravis de pouvoir vous accompagner et mettons notre savoir-faire à votre service pour garantir sa réussite.";
  } else if (surfaceInM2 >= 160) {
    return "C'est un projet conséquent ! Nous sommes heureux de vous accompagner dans sa réalisation et vous proposons nos meilleures solutions adaptées à vos besoins.";
  } else if (surfaceInM2 >= 120) {
    return "C'est un projet ambitieux ! Nous sommes ravis de pouvoir vous accompagner et mettons tout en œuvre pour vous proposer la meilleure solution.";
  } else if (surfaceInM2 >= 80) {
    return "C'est un beau projet ! Nous sommes ravis de pouvoir vous accompagner dans sa réalisation et vous proposer une solution adaptée à vos besoins.";
  } else if (surfaceInM2 >= 40) {
    return "C'est un joli projet ! Nous sommes heureux de vous accompagner et mettons notre expertise à votre service pour sa réussite.";
  } else {
    return "C'est un projet intéressant ! Nous sommes ravis de pouvoir vous accompagner et vous proposer la meilleure solution adaptée.";
  }
};

export function Calculator({ projectType, onCalculate }: CalculatorProps) {
  const [height, setHeight] = useState<string>('2');
  const [length, setLength] = useState<string>('');
  const [materials, setMaterials] = useState<MaterialSelection[]>([
    { type: 'dibond', length: 0, surface: 0 }
  ]);
  const [includeInstaller, setIncludeInstaller] = useState(false);

  // Champs STRUCTURE pour le webhook
  const [zoneGeographique, setZoneGeographique] = useState<string>('');
  const [terrainCategory, setTerrainCategory] = useState<string>('');
  const [soilType, setSoilType] = useState<string>('');
  // Champs HABILLAGE pour le webhook
  const [oculiUnite, setOculiUnite] = useState<string>('');
  const [oculiType, setOculiType] = useState<string>('');
  const [accompagnementSouhaite, setAccompagnementSouhaite] = useState<string>('');

  // Champs PORTAIL pour le webhook
  const [portailUnite, setPortailUnite] = useState<string>('');
  const [portailTypeLabel, setPortailTypeLabel] = useState<string>('');
  const [portillonUnite, setPortillonUnite] = useState<string>('');
  const [portillonTypeLabel, setPortillonTypeLabel] = useState<string>('');

  // Calculer les pots de saturateur recommandés pour chaque matériau bois
  const calculateSaturatorPots = (materialIndex: number): number => {
    const mat = materials[materialIndex];
    if (mat.type !== 'bois') return 0;
    
    const surface = mat.surface || 0;
    if (surface <= 0) return 0;
    
    return Math.ceil(surface / SATURATOR_COVERAGE);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const heightNum = parseFloat(height);
    if (!heightNum || heightNum < 2 || heightNum > 4.5) {
      alert('La hauteur doit être entre 2 et 4,5 mètres');
      return;
    }

    // Valider au moins un matériau avec surface > 0
    const validMaterials = materials.filter(m => (m.surface || 0) > 0);
    if (validMaterials.length === 0) {
      alert('Veuillez spécifier au moins un type de bardage avec une surface');
      return;
    }

    onCalculate({
      projectType: 'habillage',
      height: heightNum,
      length: parseFloat(length) || 0,
      materials: validMaterials,
      includeInstaller,
      // STRUCTURE
      zoneGeographique,
      terrainCategory,
      soilType,
      // HABILLAGE
      oculiUnite: parseFloat(oculiUnite) || 0,
      oculiType,
      accompagnementSouhaite,
      // PORTAIL
      portailUnite: parseFloat(portailUnite) || 0,
      portailTypeLabel,
      portillonUnite: parseFloat(portillonUnite) || 0,
      portillonTypeLabel,
    });
  };

  const addMaterial = () => {
    if (materials.length < 3) {
      setMaterials([...materials, { type: 'dibond', length: 0, surface: 0 }]);
    }
  };

  const removeMaterial = (index: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index));
    }
  };

  const updateMaterial = (index: number, updates: Partial<MaterialSelection>) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], ...updates };
    setMaterials(updated);
  };

  return (
    <div className="max-w-3xl mx-auto -mt-12">
      <Card className="border-0 shadow-2xl shadow-slate-200/50">
        <CardContent className="p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Habiller une palissade
            </h3>
            <p className="text-sm text-slate-600">
              Remplissez les informations ci-dessous pour obtenir votre estimation
            </p>
          </div>

          <ProgressBar 
            currentStep={1}
            totalSteps={5}
            steps={['Besoin', 'Livraison', 'Estimation', 'Services', 'Panier']}
          />

          <form onSubmit={handleSubmit} className="space-y-10 mt-8">
            {/* SECTION 1 - LES DIMENSIONS */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1 pb-2 border-b-2 border-slate-200">
                  1 - Les dimensions
                </h4>
                <p className="text-xs text-slate-600 mt-2">
                  Il s'agit de préciser la totalité des dimensions dédiées à l'habillage de la palissade.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Longueur */}
                <div className="space-y-3">
                  <Label htmlFor="length" className="text-sm font-medium text-slate-900">
                    Longueur (mètres linéaires)
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="10"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="h-14 text-lg border-slate-300 focus:border-black focus:ring-black"
                    required
                  />
                </div>

                {/* Hauteur */}
                <div className="space-y-3">
                  <Label htmlFor="height" className="text-sm font-medium text-slate-900">
                    Hauteur (2 à 4,5 mètres)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    min="2"
                    max="4.5"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-14 text-lg border-slate-300 focus:border-black focus:ring-black"
                    required
                  />
                  <div className="flex gap-2 flex-wrap">
                    {[2, 2.5, 3, 3.5, 4, 4.5].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHeight(h.toString())}
                        className={`px-4 py-2 text-sm rounded-md transition-all ${
                          parseFloat(height) === h
                            ? 'bg-black text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {h}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rappel de la surface totale + message d'accompagnement */}
              {length && parseFloat(length) > 0 && height && parseFloat(height) >= 2 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">📐</div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-slate-900">
                        Surface totale à habiller : {(parseFloat(length) * parseFloat(height)).toFixed(2)} m²
                      </p>
                      <p className="text-sm text-slate-700 mt-2">
                        {getEncouragingMessage(parseFloat(length) * parseFloat(height))}
                      </p>
                      
                      {/* Invitation à passer à l'étape 2 */}
                      <div className="mt-4 pt-4 border-t-2 border-blue-300">
                        <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <span className="text-lg">👉</span>
                          Passons maintenant à l'étape 2 : le choix du bardage
                        </p>
                        <p className="text-xs text-slate-700 mt-2 italic">
                          Le choix du bardage est essentiel et doit se faire en cohérence avec l'ouvrage en devenir. 
                          Prenez le temps d'analyser les contraintes techniques, esthétiques et budgétaires de votre projet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Informations de STRUCTURE supplémentaires pour le webhook */}
              <div className="mt-6 space-y-4">
                <h5 className="text-sm font-semibold text-slate-900">
                  Conditions de site (STRUCTURE)
                </h5>
                <p className="text-xs text-slate-600">
                  Ces informations permettent d'affiner l'étude technique (zone de vent, type de terrain, type de sol, etc.).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Zone géographique */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-900">
                      Zone géographique
                    </Label>
                    <Select
                      value={zoneGeographique}
                      onValueChange={setZoneGeographique}
                    >
                      <SelectTrigger className="h-10 border-slate-300">
                        <SelectValue placeholder="Sélectionner une zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Région 1">Région 1</SelectItem>
                        <SelectItem value="Région 2">Région 2</SelectItem>
                        <SelectItem value="Région 3">Région 3</SelectItem>
                        <SelectItem value="Région 4">Région 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Catégorie de terrain */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-900">
                      Catégorie de terrain
                    </Label>
                    <Select
                      value={terrainCategory}
                      onValueChange={setTerrainCategory}
                    >
                      <SelectTrigger className="h-10 border-slate-300">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bord de mer">Bord de mer</SelectItem>
                        <SelectItem value="Rase campagne">Rase campagne</SelectItem>
                        <SelectItem value="Campagne avec haies">Campagne avec haies</SelectItem>
                        <SelectItem value="Zone urbanisée">Zone urbanisée</SelectItem>
                        <SelectItem value="Zone urbaine (>15% surface)">
                          Zone urbaine (&gt;15% surface)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type de sol */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-900">
                      Type de sol (Si meuble⇒massif béton)
                    </Label>
                    <Select
                      value={soilType}
                      onValueChange={setSoilType}
                    >
                      <SelectTrigger className="h-10 border-slate-300">
                        <SelectValue placeholder="Sélectionner un type de sol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Enrobé">Enrobé</SelectItem>
                        <SelectItem value="Meuble">Meuble</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2 - TYPE DE BARDAGE */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900 mb-0 pb-2 border-b-2 border-slate-200 flex-1">
                  2 - Type de bardage
                </h4>
                {materials.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMaterial}
                    className="ml-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter un bardage
                  </Button>
                )}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Comment choisir ?</strong> Le <strong>Dibond imprimé</strong> permet une réponse graphique personnalisée avec impression de votre graphisme. 
                  La <strong>tôle ondulée</strong> est le choix économique pour un budget maîtrisé. 
                  Les <strong>lames de sapin</strong> offrent une solution écologique avec une faible empreinte carbone. Le <strong>végétal synthétique</strong> permet d'introduire la notion éco.
                </p>
              </div>

              {/* Liste des bardages */}
              <div className="space-y-6">
                {materials.map((mat, index) => (
                  <div key={index} className="border-2 border-slate-300 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h5 className="font-semibold text-base">Bardage {index + 1}</h5>
                        {length && parseFloat(length) > 0 && height && parseFloat(height) >= 2 && (
                          <p className="text-sm text-slate-600 mt-1">
                            <span className="font-semibold text-slate-900">
                              Surface totale à habiller : {(parseFloat(length) * parseFloat(height)).toFixed(2)} m²
                            </span>
                          </p>
                        )}
                      </div>
                      {materials.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Sélection du type */}
                    <RadioGroup 
                      value={mat.type} 
                      onValueChange={(value) => updateMaterial(index, { type: value as MaterialType })}
                    >
                      {/* Dibond */}
                      <div className={`border-2 rounded-lg p-4 mb-3 ${mat.type === 'dibond' || mat.type === 'dibond_antigraffiti' ? 'border-black bg-slate-50' : 'border-slate-200'}`}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-2xl">🎨</div>
                          <div className="flex-1">
                            <h6 className="font-semibold text-sm">Dibond imprimé - Choix graphique</h6>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Épaisseur: 3mm • Impression HD 1200 dpi • Empreinte carbone: 10,38 kgCO2e/m²
                            </p>
                          </div>
                        </div>

                        <div className="ml-8 space-y-2">
                          <div 
                            className="flex items-start gap-3 p-3 rounded border border-slate-200 hover:bg-white transition-colors cursor-pointer"
                          >
                            <RadioGroupItem value="dibond" id={`dibond-${index}`} className="mt-0.5 w-5 h-5" />
                            <Label htmlFor={`dibond-${index}`} className="cursor-pointer text-sm flex-1">
                              <div className="font-medium">Lamination plastique (standard)</div>
                              <div className="text-xs text-slate-500 mt-0.5">Protection standard contre les UV</div>
                            </Label>
                          </div>

                          <div 
                            className="flex items-start gap-3 p-3 rounded border border-slate-200 hover:bg-white transition-colors cursor-pointer"
                          >
                            <RadioGroupItem value="dibond_antigraffiti" id={`dibond_ag-${index}`} className="mt-0.5 w-5 h-5" />
                            <Label htmlFor={`dibond_ag-${index}`} className="cursor-pointer text-sm flex-1">
                              <div className="font-medium">Lamination anti-graffiti</div>
                              <div className="text-xs text-amber-700 mt-0.5 font-semibold">⚠️ Nécessite un nettoyage sous 48h pour être efficace</div>
                            </Label>
                          </div>
                        </div>

                        {/* Recommandation pour Dibond */}
                        <div className="mt-3 mx-8 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                          <p className="text-xs text-blue-900">
                            <strong>💡 Recommandation :</strong> Pour faciliter la pose, nous recommandons des panneaux imprimés de <strong>2m de hauteur x 1,5m de largeur</strong>.
                          </p>
                        </div>
                      </div>

                      {/* Tôle */}
                      <div 
                        className={`border-2 rounded-lg p-4 mb-3 ${mat.type === 'tole' ? 'border-black bg-slate-50' : 'border-slate-200'}`}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="tole" id={`tole-${index}`} className="mt-1 w-5 h-5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-2xl">💰</div>
                              <Label htmlFor={`tole-${index}`} className="cursor-pointer font-semibold text-sm">
                                Tôle ondulée bac acier - Choix économique
                              </Label>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Format: 3m x 1m • Empreinte carbone: 1,33 kgCO2e/m²
                            </p>

                            {mat.type === 'tole' && (
                              <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                                <RALSelector
                                  value={mat.ralColor || '9006'}
                                  onChange={(val) => updateMaterial(index, { ralColor: val })}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bois */}
                      <div 
                        className={`border-2 rounded-lg p-4 mb-3 ${mat.type === 'bois' ? 'border-black bg-slate-50' : 'border-slate-200'}`}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="bois" id={`bois-${index}`} className="mt-1 w-5 h-5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-2xl">🌱</div>
                              <Label htmlFor={`bois-${index}`} className="cursor-pointer font-semibold text-sm">
                                Lames de sapin Coffrage brut Avivé - Choix écologique
                              </Label>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Lames de 27mm x 200mm x 4m • Empreinte carbone: 0,45 kgCO2e/m²
                            </p>

                            {mat.type === 'bois' && (
                              <div className="mt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
                                <Label className="text-xs font-semibold text-slate-700">Classe de protection :</Label>
                                <RadioGroup
                                  value={mat.boisTreatment || 'classe2'}
                                  onValueChange={(value) => updateMaterial(index, { boisTreatment: value as 'classe2' | 'classe3' })}
                                >
                                  <div className="flex items-start gap-3 p-3 bg-white rounded border border-slate-200">
                                    <RadioGroupItem value="classe2" id={`bois-c2-${index}`} />
                                    <Label htmlFor={`bois-c2-${index}`} className="cursor-pointer text-xs flex-1">
                                      <div className="font-medium">Classe 2 - Sans traitement</div>
                                      <div className="text-slate-500">Intérieur et extérieur couvert</div>
                                    </Label>
                                  </div>
                                  <div className="flex items-start gap-3 p-3 bg-white rounded border border-slate-200">
                                    <RadioGroupItem value="classe3" id={`bois-c3-${index}`} />
                                    <Label htmlFor={`bois-c3-${index}`} className="cursor-pointer text-xs flex-1">
                                      <div className="font-medium">Classe 3 - Traitement autoclave</div>
                                      <div className="text-slate-500">Extérieur exposé aux intempéries</div>
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Végétal */}
                      <div 
                        className={`border-2 rounded-lg p-4 ${mat.type === 'vegetal' ? 'border-black bg-slate-50' : 'border-slate-200'}`}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="vegetal" id={`vegetal-${index}`} className="mt-1 w-5 h-5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-2xl">🌿</div>
                              <Label htmlFor={`vegetal-${index}`} className="cursor-pointer font-semibold text-sm">
                                Végétal synthétique - Choix esthétique
                              </Label>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Feuillage synthétique sur support maille • Empreinte carbone: 2,1 kgCO2e/m²
                            </p>

                            {mat.type === 'vegetal' && (
                              <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                                {/* Description professionnelle */}
                                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                                  <p className="text-xs text-green-900 leading-relaxed">
                                    <strong>🌟 Innovation & Mimétisme naturel</strong><br/>
                                    Grâce à un mimétisme des feuilles naturelles et une densité luxuriante, nos feuillages artificiels créent l'illusion parfaite de se fondre dans le paysage.
                                    Traités anti-UV dans la masse (et non en surface), ils conservent leur belle couleur verte sans ternir malgré les fortes expositions.
                                    <br/><br/>
                                    <strong>✓ Avantages professionnels :</strong><br/>
                                    • Garantie 10 ans anti-UV et anti-feu<br/>
                                    • Résistant à tous les temps (pluie, soleil, neige, gel, vent)<br/>
                                    • Aucun entretien : ni arrosage, ni taille, ni pesticides<br/>
                                    • Matériaux 100% recyclables<br/>
                                    • Aspect naturel permanent, densité stable
                                  </p>
                                </div>

                                {/* Type de végétal */}
                                <div>
                                  <Label className="text-xs font-semibold text-slate-700 mb-2 block">Type de végétal :</Label>
                                  <RadioGroup
                                    value={mat.vegetalType || 'feuillage'}
                                    onValueChange={(value) => updateMaterial(index, { 
                                      vegetalType: value as 'feuillage' | 'mur',
                                      vegetalVariety: undefined // Reset variety when changing type
                                    })}
                                  >
                                    <div className="flex items-start gap-3 p-3 bg-white rounded border border-slate-200">
                                      <RadioGroupItem value="feuillage" id={`vegetal-feuillage-${index}`} />
                                      <Label htmlFor={`vegetal-feuillage-${index}`} className="cursor-pointer text-xs flex-1">
                                        <div className="font-medium">Feuillage synthétique 1m x 1m</div>
                                        <div className="text-slate-500">Arbustes, conifères et plantes grimpantes</div>
                                      </Label>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-white rounded border border-slate-200">
                                      <RadioGroupItem value="mur" id={`vegetal-mur-${index}`} />
                                      <Label htmlFor={`vegetal-mur-${index}`} className="cursor-pointer text-xs flex-1">
                                        <div className="font-medium">Mur végétal 1m x 1m</div>
                                        <div className="text-slate-500">Plantes à fleurs et compositions premium</div>
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                {/* Variété */}
                                <div>
                                  <Label className="text-xs font-semibold text-slate-700 mb-2 block">
                                    Variété de {mat.vegetalType === 'mur' ? 'mur végétal' : 'feuillage'} :
                                  </Label>
                                  <select
                                    value={mat.vegetalVariety || ''}
                                    onChange={(e) => updateMaterial(index, { vegetalVariety: e.target.value })}
                                    className="w-full h-10 px-3 rounded border-2 border-slate-300 bg-white text-sm focus:border-black focus:ring-black"
                                  >
                                    <option value="">Sélectionner une variété</option>
                                    {(mat.vegetalType === 'mur' ? VEGETAL_OPTIONS.mur : VEGETAL_OPTIONS.feuillage).map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </RadioGroup>

                    {/* Surface en m² */}
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <Label htmlFor={`surface-${index}`} className="text-sm font-medium text-slate-900 block mb-2">
                        Surface à couvrir (m²)
                      </Label>
                      <Input
                        id={`surface-${index}`}
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="20"
                        value={mat.surface || ''}
                        onChange={(e) => updateMaterial(index, { surface: parseFloat(e.target.value) || 0 })}
                        className="h-12 border-slate-300 focus:border-black focus:ring-black w-32"
                      />
                      
                      {/* Calcul automatique */}
                      <p className="text-xs mt-2">
                        <span className="text-slate-600">Surface calculée de la palissade : </span>
                        <span className="font-bold text-slate-900">
                          {(parseFloat(length || '0') * parseFloat(height || '2')).toFixed(1)} m²
                        </span>
                      </p>
                      
                      {/* Warning si surface > calculée */}
                      {(mat.surface || 0) > (parseFloat(length || '0') * parseFloat(height || '2')) && (
                        <div className="mt-2 p-2 bg-amber-100 border-l-2 border-amber-500 rounded">
                          <p className="text-xs text-amber-800">
                            ⚠️ La surface saisie est supérieure à la surface calculée de la palissade
                          </p>
                        </div>
                      )}
                      
                      {/* Calcul CO2 total */}
                      {(mat.surface || 0) > 0 && (
                        <p className="text-xs text-slate-600 mt-2">
                          Empreinte carbone totale : <span className="font-semibold">
                            {((mat.surface || 0) * MATERIAL_CO2[mat.type]).toFixed(2)} kgCO2e
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Options spécifiques */}
                    {(mat.type === 'dibond' || mat.type === 'dibond_antigraffiti' || mat.type === 'bois') && (
                      <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`frame-${index}`}
                            checked={mat.includeProtectionFrame || false}
                            onCheckedChange={(checked) => updateMaterial(index, { includeProtectionFrame: checked as boolean })}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`frame-${index}`} className="text-sm font-semibold cursor-pointer text-slate-900 block">
                              Ajouter un châssis de protection
                            </Label>
                            <p className="text-xs text-slate-600 mt-1">
                              Protège vos bardages des coups depuis l'intérieur du chantier. Réduit le nombre de vis sur les bardages tout en garantissant une excellente tenue sur la tôle ondulée existante.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Saturateur pour bois */}
                    {mat.type === 'bois' && (mat.surface || 0) > 0 && (
                      <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400">
                        <div className="flex items-start gap-2 mb-3">
                          <Info className="w-4 h-4 text-green-700 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-green-900 font-semibold">
                              Protection du bois recommandée
                            </p>
                            <p className="text-xs text-green-800 mt-1">
                              Sans traitement, le bois grisaille après 3 semaines. Un saturateur permet de le faire passer de <strong>Classe 2</strong> (intérieur/ext. couvert) à <strong>Classe 3</strong> (ext. exposé aux intempéries).
                            </p>
                          </div>
                        </div>
                        <div className="bg-green-100 rounded p-3 mt-3">
                          <p className="text-sm font-semibold text-green-900">
                            📦 {calculateSaturatorPots(index)} pot{calculateSaturatorPots(index) > 1 ? 's' : ''} de 5L recommandé{calculateSaturatorPots(index) > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Pour {mat.surface}m² (1 pot couvre environ {SATURATOR_COVERAGE}m²)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3 - Oculi & accompagnement (HABILLAGE) */}
            <div className="border-2 border-slate-200 rounded-lg p-5 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1 pb-2 border-b-2 border-slate-200">
                  3 - Oculi & accompagnement
                </h4>
                <p className="text-xs text-slate-600 mt-2">
                  Ces options complètent l'habillage de votre palissade (ouvertures, grille, vitres, accompagnement Celize, etc.).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Oculi unité */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-900">
                    Oculi - quantité (unités)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={oculiUnite}
                    onChange={(e) => setOculiUnite(e.target.value)}
                    className="h-10 border-slate-300 w-32"
                  />
                </div>

                {/* Oculi type */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-900">
                    Type d'oculi
                  </Label>
                  <Select
                    value={oculiType}
                    onValueChange={setOculiType}
                  >
                    <SelectTrigger className="h-10 border-slate-300">
                      <SelectValue placeholder="Sélectionner un type d'oculi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oculus - Grille - 35cm x 35cm">
                        Oculus - Grille - 35cm x 35cm
                      </SelectItem>
                      <SelectItem value="Oculus - Vitre PMMA  - 35cm x 35cm">
                        Oculus - Vitre PMMA  - 35cm x 35cm
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Accompagnement souhaité */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-900">
                  Accompagnement souhaité
                </Label>
                <RadioGroup
                  value={accompagnementSouhaite}
                  onValueChange={setAccompagnementSouhaite}
                  className="flex flex-col md:flex-row gap-3"
                >
                  <div className="flex-1 border border-slate-200 rounded-lg p-3 flex items-start gap-3 cursor-pointer">
                    <RadioGroupItem value="Toolkit (Matériel, Plan de montage, Etude BET)" id="accompagnement-toolkit" className="mt-1" />
                    <Label htmlFor="accompagnement-toolkit" className="cursor-pointer text-xs flex-1">
                      <div className="font-semibold text-slate-900">Toolkit (Matériel, Plan de montage, Etude BET)</div>
                      <div className="text-slate-600">
                        Mise à disposition d'un kit d'outils et de recommandations pour la mise en œuvre.
                      </div>
                    </Label>
                  </div>
                  <div className="flex-1 border border-slate-200 rounded-lg p-3 flex items-start gap-3 cursor-pointer">
                    <RadioGroupItem value="Installation Celize" id="accompagnement-celize" className="mt-1" />
                    <Label htmlFor="accompagnement-celize" className="cursor-pointer text-xs flex-1">
                      <div className="font-semibold text-slate-900">Installation Celize</div>
                      <div className="text-slate-600">
                        Accompagnement complet par les équipes Celize pour la mise en place et le suivi.
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* SECTION 4 - Portails & portillons (PORTAIL) */}
            <div className="border-2 border-slate-200 rounded-lg p-5 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1 pb-2 border-b-2 border-slate-200">
                  4 - Portails & portillons
                </h4>
                <p className="text-xs text-slate-600 mt-2">
                  Indiquez les besoins en portails et portillons pour intégrer les accès dans l'estimation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Portail unité & type */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-slate-900">
                    Portail - quantité (unités)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={portailUnite}
                    onChange={(e) => setPortailUnite(e.target.value)}
                    className="h-10 border-slate-300 w-32"
                  />

                  <Label className="text-xs font-semibold text-slate-900 mt-3 block">
                    Portail - type
                  </Label>
                  <Select
                    value={portailTypeLabel}
                    onValueChange={setPortailTypeLabel}
                  >
                    <SelectTrigger className="h-10 border-slate-300">
                      <SelectValue placeholder="Sélectionner un type de portail" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      <SelectItem value="Portail en bac acier blanc 4mx2mh ouvrant à sceller avec serrure simple">
                        Portail en bac acier blanc 4mx2mh ouvrant à sceller avec serrure simple
                      </SelectItem>
                      <SelectItem value="Portail en bac acier blanc 4mx2,5mh ouvrant à sceller avec serrure simple">
                        Portail en bac acier blanc 4mx2,5mh ouvrant à sceller avec serrure simple
                      </SelectItem>
                      <SelectItem value="Portail en bac acier blanc 4m coulissant à sceller avec serrure simple">
                        Portail en bac acier blanc 4m coulissant à sceller avec serrure simple
                      </SelectItem>
                      <SelectItem value="Portail en bac acier gris RAL 7012  5,5m ouvrant à sceller avec serrure à code">
                        Portail bac acier gris RAL 7012 5,5m ouvrant, serrure à code
                      </SelectItem>
                      <SelectItem value="Portail en bac acier gris RAL 7012  7m coulissant">
                        Portail bac acier gris RAL 7012 7m coulissant
                      </SelectItem>
                      <SelectItem value="Portail en bac acier gris RAL 7012  7m ouvrant">
                        Portail bac acier gris RAL 7012 7m ouvrant
                      </SelectItem>
                      <SelectItem value="Portail en bac acier gris RAL 7012  8m coulissant">
                        Portail bac acier gris RAL 7012 8m coulissant
                      </SelectItem>
                      <SelectItem value="2 barrières bac acier ouverture 4m non scellé (fermeture cadena)">
                        2 barrières bac acier ouverture 4m non scellé (fermeture cadenas)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Portillon unité & type */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-slate-900">
                    Portillon - quantité (unités)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={portillonUnite}
                    onChange={(e) => setPortillonUnite(e.target.value)}
                    className="h-10 border-slate-300 w-32"
                  />

                  <Label className="text-xs font-semibold text-slate-900 mt-3 block">
                    Portillon - type
                  </Label>
                  <Select
                    value={portillonTypeLabel}
                    onValueChange={setPortillonTypeLabel}
                  >
                    <SelectTrigger className="h-10 border-slate-300">
                      <SelectValue placeholder="Sélectionner un type de portillon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Portillon en bac acier blanc 1,15m x 2m avec serrure à code">
                        Portillon bac acier blanc 1,15m x 2m avec serrure à code
                      </SelectItem>
                      <SelectItem value="Portillon en BOIS BRUT 1m x 2m avec serrure simple">
                        Portillon BOIS BRUT 1m x 2m avec serrure simple
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Installation */}
            <div className="border-2 border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="installer" className="text-base font-semibold cursor-pointer text-slate-900">
                    Inclure l'installation dans l'estimation
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Souhaitez-vous que l'estimation inclue l'installation ?
                  </p>
                </div>
                <Switch
                  id="installer"
                  checked={includeInstaller}
                  onCheckedChange={setIncludeInstaller}
                />
              </div>
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              className="w-full h-14 text-base bg-black hover:bg-slate-800 transition-colors"
            >
              Continuer vers l'estimation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}