import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ArrowRight, ArrowLeft, Calendar as CalendarIcon, Info, Truck } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { DeliveryAddressForm, DeliveryAddress } from './DeliveryAddressForm';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from './ui/utils';
import type { HoardingConfig } from '../App';

interface DeliveryFormProps {
  config: HoardingConfig;
  onSubmit: (deliveryData: {
    deliveryAddress: DeliveryAddress;
    deliveryDate: Date;
  }) => void;
  onBack: () => void;
}

const MATERIAL_LABELS = {
  dibond: 'Dibond imprimé anti-UV',
  dibond_antigraffiti: 'Dibond imprimé anti-graffiti',
  tole: 'Tôle ondulée bac acier',
  bois: 'Lames de sapin Coffrage brut Avivé',
  vegetal: 'Végétal synthétique'
};

// Calculer le nombre de jours ouvrés à partir d'aujourd'hui
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // Sauter les weekends (0 = dimanche, 6 = samedi)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  
  return result;
}

export function DeliveryForm({ config, onSubmit, onBack }: DeliveryFormProps) {
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    company: '',
    street: '',
    street2: '',
    postalCode: '',
    city: '',
    country: 'France',
    specialInstructions: ''
  });
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);

  // Calculer le délai minimum en fonction du type de matériau
  const calculateMinDays = (): number => {
    // Vérifier si au moins un matériau est du dibond
    const hasDibond = config.materials?.some(mat => 
      mat.type === 'dibond' || mat.type === 'dibond_antigraffiti'
    );

    if (hasDibond) {
      // Pour le dibond : 4 jours de base + 1 jour par tranche de 25m²
      let totalSurface = 0;
      
      if (config.materials && config.materials.length > 0) {
        totalSurface = config.materials.reduce((sum, mat) => sum + (mat.surface || 0), 0);
      } else if (config.length && config.height) {
        totalSurface = config.length * config.height;
      }
      
      const baseDays = 4;
      const extraDays = Math.floor(totalSurface / 25);
      
      return baseDays + extraDays;
    } else {
      // Pour les autres matériaux : forfait de 5 jours ouvrés
      return 5;
    }
  };

  const minDays = calculateMinDays();
  const minDeliveryDate = addBusinessDays(new Date(), minDays);

  useEffect(() => {
    // Définir la date minimale par défaut
    if (!deliveryDate) {
      setDeliveryDate(minDeliveryDate);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.postalCode || !deliveryAddress.country) {
      alert('Veuillez saisir une adresse de livraison complète');
      return;
    }

    if (!deliveryDate) {
      alert('Veuillez sélectionner une date de livraison');
      return;
    }

    // Vérifier que la date est au moins égale à la date minimale
    if (deliveryDate < minDeliveryDate) {
      alert(`La date de livraison doit être au minimum le ${minDeliveryDate.toLocaleDateString('fr-FR')}`);
      return;
    }

    onSubmit({
      deliveryAddress,
      deliveryDate
    });
  };

  // Calculer la surface totale pour l'affichage
  const totalSurface = config.materials 
    ? config.materials.reduce((sum, mat) => sum + (mat.surface || 0), 0)
    : (config.length || 0) * config.height;

  return (
    <div className="max-w-3xl mx-auto -mt-12">
      <Card className="border-0 shadow-2xl shadow-slate-200/50">
        <CardContent className="p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Informations de livraison
            </h3>
            <p className="text-sm text-slate-600">
              Précisez les détails de livraison pour votre commande
            </p>
          </div>

          <ProgressBar 
            currentStep={2}
            totalSteps={5}
            steps={['Besoin', 'Livraison', 'Estimation', 'Services', 'Panier']}
          />

          <form onSubmit={handleSubmit} className="space-y-8 mt-8">
            {/* Rappel de la demande */}
            <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
              <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Rappel de votre demande
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-600">Hauteur</p>
                    <p className="font-semibold">{config.height}m</p>
                  </div>
                  {config.length && (
                    <div>
                      <p className="text-slate-600">Longueur</p>
                      <p className="font-semibold">{config.length}m</p>
                    </div>
                  )}
                </div>

                {config.materials && config.materials.length > 0 && (
                  <div>
                    <p className="text-slate-600 mb-2">Bardages sélectionnés</p>
                    <div className="space-y-2">
                      {config.materials.map((mat, idx) => (
                        <div key={idx} className="bg-white rounded p-3 border border-slate-200">
                          <p className="font-medium">{MATERIAL_LABELS[mat.type]}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Surface : {mat.surface || 0}m²
                            {mat.includeProtectionFrame && ' • Avec châssis de protection'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-300">
                  <p className="text-slate-600">Surface totale</p>
                  <p className="font-bold text-lg">{totalSurface.toFixed(1)}m²</p>
                </div>
              </div>
            </div>

            {/* Date de livraison souhaitée */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-900">
                Date de livraison souhaitée <span className="text-slate-500 font-normal text-sm">(minimum {minDays} jours ouvrés)</span>
              </Label>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-14 justify-start text-left font-normal border-slate-300 text-base",
                      !deliveryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {deliveryDate ? format(deliveryDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    disabled={(date) => date < minDeliveryDate || date.getDay() === 0 || date.getDay() === 6}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Date la plus tôt possible :</strong> {minDeliveryDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Adresse de livraison */}
            <DeliveryAddressForm
              address={deliveryAddress}
              onChange={setDeliveryAddress}
            />

            {/* Frais de port */}
            <div className="bg-slate-900 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Frais de port forfaitaires</p>
                  <p className="text-xs opacity-60 mt-1">Inclus dans l'estimation</p>
                </div>
                <p className="text-3xl font-bold">300 € HT</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={onBack}
                className="flex-1 h-14 text-base border-2 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              
              <Button 
                type="submit" 
                className="flex-1 h-14 text-base bg-black hover:bg-slate-800 transition-colors"
              >
                Continuer vers l'estimation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
