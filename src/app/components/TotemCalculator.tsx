import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

export type TotemType = 'caisson_bois' | 'gabion' | 'liz';
export type CaissonBoisFormat = '80' | '120' | '160' | '200';

export type TotemItem = {
  id: string;
  totemType: TotemType;
  caissonBoisFormat?: CaissonBoisFormat;
  quantity: number;
};

export interface TotemConfig {
  items: TotemItem[];
}

interface TotemCalculatorProps {
  onCalculate: (config: TotemConfig) => void;
}

const TOTEM_LABELS = {
  caisson_bois: 'Totem Caisson Bois',
  gabion: 'Totem Gabion',
  liz: 'Totem LIZ'
};

export const TOTEM_PRICES = {
  caisson_bois: {
    '80': 2150,
    '120': 2600,
    '160': 3200,
    '200': 3800
  },
  gabion: 1800,
  liz: 2600
};

const CAISSON_FORMAT_LABELS = {
  '80': 'Format 80',
  '120': 'Format 120',
  '160': 'Format 160',
  '200': 'Format 200'
};

export function TotemCalculator({ onCalculate }: TotemCalculatorProps) {
  const [items, setItems] = useState<TotemItem[]>([
    {
      id: '1',
      totemType: 'caisson_bois',
      caissonBoisFormat: '80',
      quantity: 1
    }
  ]);

  const addItem = () => {
    const newItem: TotemItem = {
      id: Date.now().toString(),
      totemType: 'caisson_bois',
      caissonBoisFormat: '80',
      quantity: 1
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof TotemItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getTotalQuantity = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        alert('Veuillez entrer des quantités valides pour tous les totems');
        return;
      }
    }

    onCalculate({ items });
  };

  return (
    <div className="max-w-3xl mx-auto pt-12">
      <ProgressBar 
        currentStep={1} 
        totalSteps={4}
        steps={['Configuration', 'Choix', 'Validation', 'Confirmation']}
      />
      
      <Card className="border-2 border-slate-200 shadow-lg mt-8">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-2">Configuration des Totems</h3>
          <p className="text-slate-600 mb-6">
            Sélectionnez vos totems et quantités. Vous choisirez ensuite entre l'achat de plans ou la fabrication complète.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Configuration des totems */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Vos totems</Label>
                <Button
                  type="button"
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                  className="border-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un type de totem
                </Button>
              </div>

              {items.map((item, index) => (
                <Card key={item.id} className="border-2 bg-slate-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div>
                          <Label className="text-sm mb-2 block">Type de totem</Label>
                          <Select
                            value={item.totemType}
                            onValueChange={(value) => {
                              updateItem(item.id, 'totemType', value as TotemType);
                              if (value === 'caisson_bois' && !item.caissonBoisFormat) {
                                updateItem(item.id, 'caissonBoisFormat', '80');
                              }
                            }}
                          >
                            <SelectTrigger className="border-2 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="caisson_bois">Totem Caisson Bois (plusieurs formats)</SelectItem>
                              <SelectItem value="gabion">Totem Gabion</SelectItem>
                              <SelectItem value="liz">Totem LIZ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {item.totemType === 'caisson_bois' && (
                          <div>
                            <Label className="text-sm mb-2 block">Format du Caisson Bois</Label>
                            <Select
                              value={item.caissonBoisFormat || '80'}
                              onValueChange={(value) => updateItem(item.id, 'caissonBoisFormat', value as CaissonBoisFormat)}
                            >
                              <SelectTrigger className="border-2 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="80">Format 80</SelectItem>
                                <SelectItem value="120">Format 120</SelectItem>
                                <SelectItem value="160">Format 160</SelectItem>
                                <SelectItem value="200">Format 200</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div>
                          <Label className="text-sm mb-2 block">Quantité</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="border-2 bg-white"
                          />
                        </div>
                      </div>

                      {items.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          variant="ghost"
                          size="sm"
                          className="mt-8"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Prochaine étape :</strong> Après validation de votre configuration, vous pourrez choisir entre :
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                <li>Acheter uniquement les plans (890 € HT par type de totem)</li>
                <li>Commander la fabrication complète gérée par Atelier Urbanize</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-slate-800 text-white py-6 text-lg"
            >
              Continuer vers le choix de prestation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}