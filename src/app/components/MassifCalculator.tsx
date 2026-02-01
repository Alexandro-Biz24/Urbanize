import { useState, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, Trash2, ArrowRight, Truck, Info } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';


export type MassifDimension = 
  | '500x500x500' 
  | '600x600x600' 
  | '800x800x800' 
  | '1000x1000x800' 
  | '1000x1000x1000' 
  | '1200x1200x800';

export type MassifOption = 'reservation' | 'tiges';

export type MassifItem = {
  id: string;
  dimension: MassifDimension;
  option: MassifOption;
  quantity: number;
};

export interface MassifConfig {
  items: MassifItem[];
}

interface MassifCalculatorProps {
  initialConfig?: MassifConfig;
  onCalculate: (config: MassifConfig) => void;
}

interface MassifDef {
  label: string;
  weight: number; // kg
  prices: {
    reservation: number;
    tiges: number;
  };
  specs: {
    tiges: string;
    reservation: string;
  }
}

const MASSIF_DATA: Record<MassifDimension, MassifDef> = {
  '500x500x500': {
    label: '500 x 500 x 500 mm',
    weight: 300,
    prices: {
      reservation: 0,
      tiges: 0
    },
    specs: {
      tiges: 'Tige de 16/18mm - Entraxe: 200 mm',
      reservation: 'Ouverture: sur demande'
    }
  },
  '600x600x600': {
    label: '600 x 600 x 600 mm',
    weight: 518,
    prices: {
      reservation: 0,
      tiges: 0
    },
    specs: {
      tiges: 'Tige de 16/18mm - Entraxe: 200 mm',
      reservation: 'Ouverture: 140 mm ou sur demande'
    }
  },
  '800x800x800': {
    label: '800 x 800 x 800 mm',
    weight: 1228,
    prices: {
      reservation: 217.30,
      tiges: 231.40
    },
    specs: {
      tiges: 'Tige de 18/24 mm - Entraxe: 200 ou 300 mm',
      reservation: 'Ouverture: 280/320 mm'
    }
  },
  '1000x1000x800': {
    label: '1000 x 1000 x 800 mm',
    weight: 1920,
    prices: {
      reservation: 0,
      tiges: 0
    },
    specs: {
      tiges: 'Tige de 18/24 mm - Entraxe: 200 ou 300 mm',
      reservation: 'Ouverture: 280/320 mm'
    }
  },
  '1000x1000x1000': {
    label: '1000 x 1000 x 1000 mm',
    weight: 2400,
    prices: {
      reservation: 317.00,
      tiges: 335.00
    },
    specs: {
      tiges: 'Tige de 18/24 mm - Entraxe: 200 ou 300 mm',
      reservation: 'Ouverture: 280/320 mm'
    }
  },
  '1200x1200x800': {
    label: '1200 x 1200 x 800 mm',
    weight: 2765,
    prices: {
      reservation: 0,
      tiges: 0
    },
    specs: {
      tiges: 'Tige de 18/24 mm - Entraxe: 200 ou 300 mm',
      reservation: 'Ouverture: 280/320 mm'
    }
  }
};

export function MassifCalculator({ initialConfig, onCalculate }: MassifCalculatorProps) {
  const [items, setItems] = useState<MassifItem[]>(initialConfig?.items || [
    {
      id: '1',
      dimension: '800x800x800',
      option: 'reservation',
      quantity: 1
    }
  ]);

  const addItem = () => {
    const newItem: MassifItem = {
      id: Date.now().toString(),
      dimension: '800x800x800',
      option: 'reservation',
      quantity: 1
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof MassifItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalWeight = useMemo(() => {
    return items.reduce((sum, item) => {
      const data = MASSIF_DATA[item.dimension];
      if (!data) return sum;
      return sum + (data.weight * item.quantity);
    }, 0);
  }, [items]);

  const trucksCount = useMemo(() => {
    // Tolérance de 5% (29400 kg max pour 1 camion)
    if (totalWeight <= 29400) return 1;
    return Math.ceil(totalWeight / 28000);
  }, [totalWeight]);

  const percentageFull = useMemo(() => {
    return Math.min(Math.round((totalWeight / (trucksCount * 28000)) * 100), 100);
  }, [totalWeight, trucksCount]);

  const truckFills = useMemo(() => {
     const fills = [];
     let remaining = totalWeight;
     for (let i = 0; i < trucksCount; i++) {
        const capacity = 28000;
        const currentLoad = Math.min(remaining, capacity);
        // Special case for single truck overload within tolerance
        const displayLoad = (trucksCount === 1 && totalWeight > capacity) ? totalWeight : currentLoad;
        fills.push(Math.round((displayLoad / capacity) * 100));
        remaining -= currentLoad;
     }
     return fills;
  }, [totalWeight, trucksCount]);

  const isTransportOptimized = useMemo(() => {
    // 28 tonnes +/- 2% per truck?
    // Or just check if the last truck is full?
    // Let's keep it simple for now, optimized if total close to capacity * trucksCount
    const capacity = trucksCount * 28000;
    const min = capacity * 0.98;
    const max = capacity * 1.02;
    return totalWeight >= min && totalWeight <= max;
  }, [totalWeight, trucksCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        alert('Veuillez entrer des quantités valides pour tous les massifs');
        return;
      }
    }
    onCalculate({ items });
  };

  return (
    <div className="max-w-4xl mx-auto pt-12">
      <ProgressBar 
        currentStep={1} 
        totalSteps={4}
        steps={['Configuration', 'Estimation', 'Validation', 'Confirmation']}
      />
      
      <Card className="border-2 border-slate-200 shadow-lg mt-8">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-2">Configuration Massif béton</h3>
          <p className="text-slate-600 mb-6">Lestage permettant de stabiliser des dispositifs extérieurs</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Vos massifs</Label>
                <Button
                  type="button"
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                  className="border-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un type
                </Button>
              </div>

              {items.map((item) => {
                const data = MASSIF_DATA[item.dimension];
                if (!data) return null;
                
                const price = data.prices[item.option];
                const spec = data.specs[item.option];

                return (
                  <Card key={item.id} className="border-2 bg-slate-50 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="w-full md:w-48 h-48 md:h-auto relative bg-slate-200 shrink-0">
                          <ImageWithFallback
                            src="/assets/massif_img.png"
                            alt="Massif béton"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Controls Section */}
                        <div className="p-6 flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm mb-2 block">Dimensions</Label>
                              <Select
                                value={item.dimension}
                                onValueChange={(val) => updateItem(item.id, 'dimension', val as MassifDimension)}
                              >
                                <SelectTrigger className="border-2 bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(MASSIF_DATA).map(([key, def]) => (
                                    <SelectItem key={key} value={key}>
                                      {def.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-sm mb-2 block">Option</Label>
                              <Select
                                value={item.option}
                                onValueChange={(val) => updateItem(item.id, 'option', val as MassifOption)}
                              >
                                <SelectTrigger className="border-2 bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="reservation">Avec réservation (Ouverture)</SelectItem>
                                  <SelectItem value="tiges">Avec tiges filetées</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 p-3 bg-slate-100 rounded-lg border-2 border-slate-200">
                            <Info className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                            <div className="text-sm text-slate-700 space-y-1">
                              <p className="font-medium">Caractéristiques :</p>
                              <p>{spec}</p>
                              <p className="text-slate-600">Poids unitaire : {data.weight} kg</p>
                            </div>
                          </div>

                          <div className="flex items-end justify-between gap-4">
                             <div>
                                <Label className="text-sm mb-2 block">Quantité</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                  className="w-32 border-2 bg-white"
                                />
                             </div>

                             <div className="text-right">
                               <p className="text-sm text-slate-500">Prix unitaire</p>
                               <p className="text-xl font-bold">{price > 0 ? `${price.toFixed(2)} €` : 'Sur devis'}</p>
                             </div>

                             {items.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                             )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Total Weight & Optimization */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-xl space-y-4 shadow-lg border-2 border-slate-600">
               <div className="flex items-center justify-between">
                 <div>
                   <h4 className="text-lg font-semibold flex items-center gap-2">
                     <Truck className="w-5 h-5 text-slate-300" />
                     Poids total estimé
                   </h4>
                   <p className="text-slate-300 text-sm">Nécessaire pour le calcul du transport</p>
                 </div>
                 <div className="text-right">
                   <div className="text-3xl font-bold">
                     {(totalWeight / 1000).toFixed(2)} Tonnes
                   </div>
                   {trucksCount > 1 && (
                     <div className="text-slate-300 text-sm font-medium mt-1">
                       {trucksCount} camions nécessaires
                     </div>
                   )}
                 </div>
               </div>

               {isTransportOptimized ? (
                 <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3 text-emerald-100 text-sm flex items-start gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                   <p>
                     <strong>Transport optimisé !</strong> Le poids total est proche de {trucksCount * 28} tonnes (±2%), ce qui permet d'optimiser le remplissage et de réduire les coûts.
                   </p>
                 </div>
               ) : (
                 <div className={`rounded-lg p-3 text-sm flex flex-col gap-3 ${percentageFull < 80 ? 'bg-slate-600/60 border border-slate-500/50 text-slate-200' : 'bg-slate-600/40 border border-slate-500/30 text-slate-200'}`}>
                   <div className="flex items-start gap-3">
                     <Info className={`w-4 h-4 mt-0.5 shrink-0 ${percentageFull < 80 ? 'text-slate-300' : 'text-slate-400'}`} />
                     <div>
                       <p className="mb-1">
                         {trucksCount > 1 
                           ? `Transport réparti sur ${trucksCount} camions (Capacité: 28t / camion).`
                           : "Le transport peut être optimisé si le poids total atteint 28 tonnes (±2%)."
                         }
                       </p>
                       <p className={`font-bold ${percentageFull < 80 ? 'text-slate-100' : 'text-slate-200'}`}>
                         Actuellement : {percentageFull}% {trucksCount > 1 ? 'du volume total' : "d'un camion complet"}.
                       </p>
                       {percentageFull < 80 && (
                          <p className="text-xs mt-1 text-slate-300">
                             Rentabilisez votre transport ! Augmentez votre commande pour atteindre au moins 95% de chargement.
                          </p>
                       )}
                     </div>
                   </div>

                   {/* Visualisation des camions */}
                   <div className="w-full space-y-3 pl-7 pr-1">
                      {truckFills.map((fill, i) => (
                         <div key={i}>
                            <div className="flex justify-between text-xs mb-1 text-slate-300">
                               <span>{trucksCount > 1 ? `Camion ${i+1}` : 'Remplissage'}</span>
                               <span>{fill}%</span>
                            </div>
                            <div className="w-full bg-slate-600/50 rounded-full h-2 border border-slate-500/30">
                               <div 
                                 className={`h-2 rounded-full transition-all duration-500 ${
                                   fill < 80 ? 'bg-slate-400' : 
                                   (fill > 100 ? 'bg-red-400' : 
                                   (fill >= 95 ? 'bg-emerald-400' : 'bg-blue-400'))
                                 }`} 
                                 style={{ width: `${Math.min(fill, 100)}%` }} 
                               />
                            </div>
                         </div>
                      ))}
                   </div>
                 </div>
               )}
            </div>

            <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-4">
              <p className="text-sm text-slate-700">
                <strong>Note :</strong> Les tarifs affichés sont fermes et hors livraison. 
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white py-6 text-lg shadow-lg border-2 border-slate-600"
            >
              Commander
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}