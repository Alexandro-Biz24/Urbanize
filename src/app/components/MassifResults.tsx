import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RefreshCcw, ShoppingCart, CheckCircle, Truck, Info, ArrowRight, Mail, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from './ui/utils';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ProgressBar } from './ProgressBar';
import { DeliveryAddressForm, DeliveryAddress } from './DeliveryAddressForm';
import { StripeCheckout } from './StripeCheckout';
import { SiretLookup } from './SiretLookup';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog';

interface MassifResultsProps {
  config: MassifConfig;
  onReset: () => void;
}

interface ContactInfo {
  company: string;
  siret: string;
  name: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
}

interface LiftingEyesState {
  active: boolean;
  capacity: '1.3t' | '2.5t';
  quantity: 'single' | 'pair';
}

const MASSIF_DATA: Record<MassifDimension, { label: string; weight: number; prices: { reservation: number; tiges: number } }> = {
  '500x500x500': {
    label: '500 x 500 x 500 mm',
    weight: 300,
    prices: { reservation: 0, tiges: 0 }
  },
  '600x600x600': {
    label: '600 x 600 x 600 mm',
    weight: 518,
    prices: { reservation: 0, tiges: 0 }
  },
  '800x800x800': {
    label: '800 x 800 x 800 mm',
    weight: 1228,
    prices: { reservation: 217.30, tiges: 231.40 }
  },
  '1000x1000x800': {
    label: '1000 x 1000 x 800 mm',
    weight: 1920,
    prices: { reservation: 0, tiges: 0 }
  },
  '1000x1000x1000': {
    label: '1000 x 1000 x 1000 mm',
    weight: 2400,
    prices: { reservation: 317.00, tiges: 335.00 }
  },
  '1200x1200x800': {
    label: '1200 x 1200 x 800 mm',
    weight: 2765,
    prices: { reservation: 0, tiges: 0 }
  }
};

export function MassifResults({ config, onReset }: MassifResultsProps) {
  const [currentStep, setCurrentStep] = useState<'delivery' | 'summary' | 'payment' | 'email'>('delivery');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    company: '',
    siret: '',
    name: '',
    email: '',
    phone: ''
  });

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

  const getMinDeliveryDate = () => {
    const date = new Date();
    // Reset time to avoid issues with comparison
    date.setHours(0, 0, 0, 0);
    
    let addedDays = 0;
    while (addedDays < 4) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        addedDays++;
      }
    }
    return date;
  };

  const [liftingEyes, setLiftingEyes] = useState<LiftingEyesState>({
    active: false,
    capacity: '1.3t',
    quantity: 'single'
  });

  const handlePaymentSuccess = () => {
    setCurrentStep('payment');
    setPaymentSuccess(true);
  };

  const handleCancelCheckout = () => {
    setCurrentStep('summary');
  };

  const handleDeliverySubmit = () => {
    if (!deliveryDate) {
      alert('Veuillez sélectionner une date de livraison souhaitée');
      return;
    }
    if (!deliveryAddress.street || !deliveryAddress.postalCode || !deliveryAddress.city) {
      alert('Veuillez renseigner l\'adresse de livraison complète');
      return;
    }
    setCurrentStep('summary');
  };

  const handleCompanySelect = (company: { name: string; address: any; siret: string }) => {
    setContactInfo(prev => ({
      ...prev,
      company: company.name,
      siret: company.siret,
      address: {
        street: company.address.street,
        postalCode: company.address.postalCode,
        city: company.address.city,
        country: 'France'
      }
    }));
    // Note: Delivery address is explicitly NOT updated based on SIRET as per requirements
  };

  const calculateTotals = () => {
    let totalPrice = 0;
    let totalWeight = 0;
    let totalItems = 0;

    config.items.forEach(item => {
      const data = MASSIF_DATA[item.dimension];
      if (data) {
        const price = data.prices[item.option];
        totalPrice += price * item.quantity;
        totalWeight += data.weight * item.quantity;
        totalItems += item.quantity;
      }
    });

    let liftingEyesCost = 0;
    let liftingEyesDelivery = 0;

    if (liftingEyes.active) {
      const unitPrice = liftingEyes.capacity === '1.3t' ? 29.80 : 37.90;
      const multiplier = liftingEyes.quantity === 'pair' ? 2 : 1;
      liftingEyesCost = unitPrice * multiplier;
      liftingEyesDelivery = 20;
    }

    return { 
      totalPrice: Math.round(totalPrice * 100) / 100, 
      totalWeight, 
      totalItems,
      liftingEyesCost,
      liftingEyesDelivery
    };
  };

  const { totalPrice, totalWeight, totalItems, liftingEyesCost, liftingEyesDelivery } = calculateTotals();

  // Calculate trucks needed
  const trucksCount = totalWeight <= 29400 ? 1 : Math.ceil(totalWeight / 28000);

  // Calculate fill percentage for each truck
  const truckFills = [];
  let remainingWeight = totalWeight;
  
  for (let i = 0; i < trucksCount; i++) {
     const capacity = 28000;
     const currentLoad = Math.min(remainingWeight, capacity);
     // If single truck and within tolerance, allows >100%
     const displayLoad = (trucksCount === 1 && totalWeight > capacity) ? totalWeight : currentLoad;
     
     const percentage = Math.round((displayLoad / capacity) * 100);
     truckFills.push(percentage);
     remainingWeight -= currentLoad;
  }
  
  // Overall percentage (for optimization check)
  const totalCapacity = trucksCount * 28000;
  const percentageFull = Math.min(Math.round((totalWeight / totalCapacity) * 100), 100);

  // Transport optimization check
  const isTransportOptimized = totalWeight >= (totalCapacity * 0.98) && totalWeight <= (totalCapacity * 1.02);

  // Calculer le coût de livraison
  useEffect(() => {
    const calculateDistance = async () => {
      if (!deliveryAddress.coordinates) {
        setDeliveryCost(null);
        setDistanceKm(null);
        return;
      }

      const originLat = 47.8931;
      const originLon = 1.9272;
      const destLat = deliveryAddress.coordinates.lat;
      const destLon = deliveryAddress.coordinates.lng;

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${destLon},${destLat}?overview=false`
        );
        
        if (response.ok) {
           const data = await response.json();
           if (data.routes && data.routes.length > 0) {
              const meters = data.routes[0].distance;
              const km = Math.round(meters / 1000);
              
              setDistanceKm(km);
              setDeliveryCost((250 + km) * trucksCount);
           }
        }
      } catch (error) {
         console.error('Error calculating distance:', error);
      }
    };

    calculateDistance();
  }, [deliveryAddress.coordinates, trucksCount]);

  const handlePurchase = () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      alert('Veuillez renseigner vos coordonnées de contact');
      return;
    }
    if (!deliveryAddress.street || !deliveryAddress.postalCode || !deliveryAddress.city || !deliveryAddress.country) {
      alert('Veuillez renseigner l\'adresse de livraison complète');
      setCurrentStep('delivery');
      return;
    }

    setCurrentStep('payment');
  };

  const handleSendEmail = () => {
    // In a real app, this would call a backend API
    alert(`Le récapitulatif a été envoyé à ${contactInfo.email}`);
    // Optional: Return to home or summary?
  };

  const getOrderDescription = () => {
    const items = config.items.map(item => {
      const data = MASSIF_DATA[item.dimension];
      return data ? `${item.quantity}x ${data.label}` : '';
    }).filter(Boolean).join(', ');
    
    let desc = `${items} (${totalWeight}kg)`;
    if (liftingEyes.active) {
      desc += ` + Mains de levage (${liftingEyes.capacity} - ${liftingEyes.quantity})`;
    }
    desc += ` - Livraison à ${deliveryAddress.city}`;
    
    return desc;
  };

  const finalDeliveryCost = (deliveryCost || 0) + liftingEyesDelivery;

  // Page de confirmation après paiement
  if (paymentSuccess) {
    return (
      <div className="max-w-4xl mx-auto pt-12">
        <Card className="border-2 border-green-500 shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-600" />
            <h2 className="text-3xl font-bold mb-4">Paiement réussi !</h2>
            <p className="text-lg text-slate-600 mb-6">
              Votre commande de {totalItems} massif{totalItems > 1 ? 's' : ''} béton a été confirmée.
            </p>
            <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-3">Détails de la commande :</h3>
              <div className="space-y-2 text-sm">
                {config.items.map((item, idx) => {
                  const data = MASSIF_DATA[item.dimension];
                  if (!data) return null;
                  const price = data.prices[item.option];
                  return (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity}x {data.label} ({item.option === 'reservation' ? 'Réservation' : 'Tiges'})</span>
                      <span className="font-semibold">{price > 0 ? `${(price * item.quantity).toFixed(2)} €` : 'Sur devis'}</span>
                    </div>
                  );
                })}
                {liftingEyes.active && (
                   <div className="flex justify-between text-blue-700">
                      <span>Mains de levage ({liftingEyes.capacity}, {liftingEyes.quantity === 'pair' ? 'paire' : 'unité'})</span>
                      <span className="font-semibold">{liftingEyesCost.toFixed(2)} €</span>
                   </div>
                )}
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total</span>
                  <span>{(totalPrice + liftingEyesCost + finalDeliveryCost).toFixed(2)} € HT</span>
                </div>
                {deliveryCost && (
                   <div className="flex justify-between text-xs text-slate-600">
                     <span>Dont livraison {liftingEyesDelivery > 0 && `(+${liftingEyesDelivery}€ levage)`}</span>
                     <span>{finalDeliveryCost.toFixed(2)} €</span>
                   </div>
                )}
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Poids total</span>
                  <span>{totalWeight.toLocaleString('fr-FR')} kg</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-slate-600">
                  <strong>Contact :</strong> {contactInfo.name} ({contactInfo.phone})<br />
                  <strong>Adresse de livraison :</strong><br />
                  {deliveryAddress.street}<br />
                  {deliveryAddress.street2 && <>{deliveryAddress.street2}<br /></>}
                  {deliveryAddress.postalCode} {deliveryAddress.city}<br />
                  {deliveryAddress.country}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Prochaines étapes :</h3>
              <ul className="space-y-2 text-sm text-slate-700 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Email de confirmation envoyé à {contactInfo.email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Préparation : 1 à 2 semaines</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Livraison : vous serez contacté pour fixer la date</span>
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

  // Formulaire de paiement Stripe
  if (currentStep === 'payment' && !paymentSuccess) {
    const finalAmount = totalPrice + liftingEyesCost + finalDeliveryCost;
    return (
      <div className="max-w-2xl mx-auto pt-12">
        <StripeCheckout
          amount={finalAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancelCheckout}
          orderDetails={{
            type: `Massif béton - ${totalItems} unité${totalItems > 1 ? 's' : ''}`,
            description: getOrderDescription()
          }}
        />
      </div>
    );
  }

  // Page Email
  if (currentStep === 'email') {
    return (
      <div className="max-w-md mx-auto pt-20">
         <Card className="border-2 border-slate-200 shadow-lg">
            <CardContent className="p-8">
               <h3 className="text-2xl font-bold mb-4">Envoyer le récapitulatif</h3>
               <p className="text-slate-600 mb-6">
                 Saisissez votre adresse email pour recevoir votre devis complet.
               </p>
               
               <div className="space-y-4">
                  <div>
                    <Label htmlFor="email-send">Email</Label>
                    <Input 
                      id="email-send" 
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      className="bg-white border-2"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSendEmail}
                    className="w-full bg-black hover:bg-slate-800 text-white"
                    disabled={!contactInfo.email}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => setCurrentStep('summary')}
                  >
                    Retour
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
    );
  }

  // Étape 2: Livraison
  if (currentStep === 'delivery') {
     return (
        <div className="max-w-4xl mx-auto pt-12">
           <ProgressBar 
             currentStep={2} 
             totalSteps={4}
             steps={['Configuration', 'Livraison', 'Validation', 'Confirmation']}
           />
           
           <Card className="border-2 border-slate-200 shadow-lg mt-8">
             <CardContent className="p-8">
               <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Livraison</h3>
                    <p className="text-slate-600">Veuillez renseigner l'adresse de livraison</p>
                  </div>
               </div>

               {/* Rappel des produits */}
               <div className="bg-slate-50 rounded-lg p-4 mb-8 text-sm">
                 <h4 className="font-semibold mb-2 flex items-center gap-2">
                   <Truck className="w-4 h-4" /> 
                   Rappel de votre commande :
                 </h4>
                 <ul className="space-y-1 text-slate-700 pl-6 list-disc">
                   {config.items.map((item, idx) => {
                     const data = MASSIF_DATA[item.dimension];
                     if (!data) return null;
                     return (
                       <li key={idx}>
                         {item.quantity}x {data.label} ({item.option === 'reservation' ? 'Avec réservation' : 'Avec tiges'})
                       </li>
                     );
                   })}
                 </ul>
                 
                 <div className="mt-4 pt-3 border-t border-slate-200">
                    {truckFills.map((fill, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-xs font-medium text-slate-700">
                             {truckFills.length > 1 ? `Camion ${index + 1}` : 'Remplissage du camion'} ({fill}%)
                           </span>
                           <span className="text-xs text-slate-500">Objectif : 95%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
                           <div 
                             className={`h-2.5 rounded-full ${fill < 80 ? 'bg-slate-400' : (fill > 100 ? 'bg-red-400' : (fill >= 95 ? 'bg-emerald-400' : 'bg-blue-400'))}`} 
                             style={{ width: `${Math.min(fill, 100)}%` }}
                           />
                        </div>
                      </div>
                    ))}
                    
                    {percentageFull < 95 && (
                      <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg border-2 border-slate-300 mt-2">
                        <div className="flex items-start gap-2">
                           <Info className="w-4 h-4 text-slate-600 mt-0.5" />
                           <p className="text-slate-700 text-xs">
                               <strong>Conseil :</strong> Augmentez votre commande pour atteindre 95% et rentabiliser les frais de transport.
                           </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={onReset} className="ml-2 h-8 text-xs bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap">
                           Ajouter des massifs
                        </Button>
                      </div>
                    )}
                 </div>
               </div>

               <div className="mb-8">
                  <div className="mb-6">
                    <Label className="font-semibold mb-2 block">
                      Date de livraison souhaitée <span className="text-slate-500 font-normal text-sm">(minimum 4 jours ouvrés)</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal border-slate-300",
                            !deliveryDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deliveryDate ? format(deliveryDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          disabled={(date) => date < getMinDeliveryDate() || date.getDay() === 0 || date.getDay() === 6}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <DeliveryAddressForm address={deliveryAddress} onChange={setDeliveryAddress} />
                  
                  {/* Affichage du coût de livraison calculé */}
                  {deliveryAddress.city && (
                     <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                        <div>
                           <p className="font-semibold text-sm">
                             Estimation des frais de port
                             {trucksCount > 1 && <span className="text-slate-600 ml-1">({trucksCount} camions)</span>}
                           </p>
                           {distanceKm !== null ? (
                              <p className="text-xs text-slate-500">Distance : {distanceKm} km depuis Saint-Jean-le-Blanc (45)</p>
                           ) : (
                              <p className="text-xs text-slate-500 italic">Calcul en cours...</p>
                           )}
                        </div>
                        <div className="text-right">
                           {deliveryCost !== null ? (
                              <p className="text-xl font-bold">{deliveryCost.toFixed(2)} € HT</p>
                           ) : (
                              <p className="text-sm text-slate-400">--- €</p>
                           )}
                        </div>
                     </div>
                  )}
               </div>

               <div className="flex justify-end gap-4">
                 <Button onClick={onReset} variant="ghost" className="text-slate-500">
                    Retour
                 </Button>
                 <Button 
                   onClick={handleDeliverySubmit}
                   className="bg-black hover:bg-slate-800 text-white py-6 px-8"
                 >
                   Voir le récapitulatif
                   <ArrowRight className="w-5 h-5 ml-2" />
                 </Button>
               </div>
             </CardContent>
           </Card>
        </div>
     );
  }

  // Étape 3: Récapitulatif (Summary)
  return (
    <div className="max-w-4xl mx-auto pt-12">
      <ProgressBar 
        currentStep={3} 
        totalSteps={4}
        steps={['Configuration', 'Livraison', 'Validation', 'Confirmation']}
      />
      
      <Card className="border-2 border-slate-200 shadow-lg mt-8">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">Récapitulatif & Coordonnées</h3>
              <p className="text-slate-600">Vérifiez votre commande et vos informations</p>
            </div>
            <Button onClick={() => setCurrentStep('delivery')} variant="outline" className="border-2">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Modifier Livraison
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-8">
            {config.items.map((item, index) => {
              const data = MASSIF_DATA[item.dimension];
              if (!data) return null;
              
              const price = data.prices[item.option];
              const subtotal = price * item.quantity;
              const itemWeight = data.weight * item.quantity;
              const optionLabel = item.option === 'reservation' ? 'Avec réservation' : 'Avec tiges';

              return (
                <div key={item.id} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{data.label}</h4>
                      <p className="text-sm text-slate-500">{optionLabel}</p>
                      <p className="text-sm text-slate-600">Poids unitaire: {data.weight} kg</p>
                    </div>
                    <div className="text-right">
                      <p>{price > 0 ? `${price.toFixed(2)} € HT` : 'Sur devis'}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="text-sm text-slate-600">Quantité: {item.quantity}</span>
                    <div className="text-right">
                      <p>{price > 0 ? `${subtotal.toFixed(2)} € HT` : 'Sur devis'}</p>
                      <p className="text-xs text-slate-600">{itemWeight.toLocaleString('fr-FR')} kg</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lifting Eyes Option */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6 border-2 border-slate-200">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="lifting-eyes" 
                checked={liftingEyes.active}
                onCheckedChange={(checked) => setLiftingEyes(prev => ({ ...prev, active: !!checked }))}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="lifting-eyes" className="font-bold text-base cursor-pointer">
                  Mains de levage
                </Label>
                <p className="text-sm text-slate-600 mb-3">
                  Facilitez la manutention de vos massifs
                </p>
                
                {liftingEyes.active && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-xs mb-1 block">Capacité</Label>
                      <Select 
                        value={liftingEyes.capacity} 
                        onValueChange={(v: any) => setLiftingEyes(prev => ({ ...prev, capacity: v }))}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.3t">1.3 tonnes (29,80 €)</SelectItem>
                          <SelectItem value="2.5t">2.5 tonnes (37,90 €)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Quantité</Label>
                      <Select 
                        value={liftingEyes.quantity}
                        onValueChange={(v: any) => setLiftingEyes(prev => ({ ...prev, quantity: v }))}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">À l'unité</SelectItem>
                          <SelectItem value="pair">Par paire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              {liftingEyes.active && (
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {liftingEyesCost.toFixed(2)} € HT
                  </div>
                  <div className="text-xs text-slate-500">
                    + 20.00 € livraison
                  </div>
                </div>
              )}
            </div>

            {/* Photos explicatives - Uniquement si mains de levage cochées */}
            {liftingEyes.active && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-200 pt-4">
                 {[
                   { src: "/assets/massif_img.png", title: "Produit" },
                   { src: "/assets/massif_img.png", title: "Schéma de levage" },
                   { src: "/assets/massif_img.png", title: "Conseils d'utilisation" },
                   { src: "/assets/massif_img.png", title: "Dimensions & Spécifications" }
                 ].map((img, idx) => (
                   <div key={idx} className="bg-white p-2 rounded border border-slate-200 cursor-pointer hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold mb-2 text-center text-slate-600">{img.title}</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <img 
                            src={img.src} 
                            alt={img.title} 
                            className="w-full h-32 object-contain mx-auto hover:opacity-90 transition-opacity" 
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full p-2 bg-white">
                          <DialogTitle className="sr-only">{img.title}</DialogTitle>
                          <img 
                            src={img.src} 
                            alt={img.title} 
                            className="w-full h-auto max-h-[80vh] object-contain" 
                          />
                        </DialogContent>
                      </Dialog>
                   </div>
                 ))}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="bg-slate-100 rounded-lg p-6 mb-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Nombre total de massifs</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Poids total</span>
                <span className="font-semibold">{totalWeight.toLocaleString('fr-FR')} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Sous-total Massifs</span>
                <span className="font-semibold">{totalPrice.toFixed(2)} €</span>
              </div>
              {liftingEyes.active && (
                 <div className="flex justify-between text-sm text-slate-700">
                    <span>Mains de levage ({liftingEyes.capacity}, {liftingEyes.quantity === 'pair' ? 'paire' : 'unité'})</span>
                    <span className="font-semibold">{liftingEyesCost.toFixed(2)} €</span>
                 </div>
              )}
              {deliveryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Date de livraison souhaitée</span>
                  <span className="font-semibold">{format(deliveryDate, "dd MMMM yyyy", { locale: fr })}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  Frais de livraison {distanceKm ? `(${distanceKm} km)` : ''}
                  {trucksCount > 1 && ` - ${trucksCount} camions`}
                  {liftingEyesDelivery > 0 && <span className="text-xs text-slate-500 ml-1">(+20€ levage)</span>}
                </span>
                <span className="font-semibold">{deliveryCost ? `${finalDeliveryCost.toFixed(2)} €` : 'À calculer'}</span>
              </div>
              
              <div className="pt-3 border-t-2 border-slate-300 flex justify-between">
                <span className="font-bold text-lg">Total HT</span>
                <span className="font-bold text-2xl">{(totalPrice + liftingEyesCost + finalDeliveryCost).toFixed(2)} €</span>
              </div>
            </div>
            
            {/* Optimization message in results */}
            <div className="mt-4 pt-4 border-t border-slate-200">
                {isTransportOptimized ? (
                 <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-800 text-sm flex items-start gap-3">
                   <Truck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                   <p>
                     <strong>Transport optimisé !</strong> Le poids total ({(totalWeight/1000).toFixed(2)}T) est proche de 28 tonnes (±2%).
                   </p>
                 </div>
               ) : (
                 <div className="bg-white/50 rounded-lg p-3 text-slate-600 text-sm flex items-start gap-3">
                   <Info className="w-4 h-4 mt-0.5 shrink-0" />
                   <p>
                     Le transport peut être optimisé si le poids total atteint <strong>28 tonnes</strong> (±2%).
                   </p>
                 </div>
               )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
             {/* Contact Info Form - Changed title and added fields */}
             <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <h4 className="font-semibold text-lg">Adresse de facturation</h4>
                </div>
                <Card className="border-2 border-slate-200 bg-slate-50">
                   <CardContent className="p-6 space-y-4">
                      <div className="mb-6">
                        <Label className="mb-2 block">Rechercher votre entreprise (Autocomplétion)</Label>
                        <SiretLookup onSelect={handleCompanySelect} />
                      </div>

                      <div>
                        <Label htmlFor="company">Société</Label>
                        <Input 
                          id="company" 
                          value={contactInfo.company}
                          onChange={(e) => setContactInfo({...contactInfo, company: e.target.value})}
                          className="bg-white border-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="siret">SIRET</Label>
                        <Input 
                          id="siret" 
                          value={contactInfo.siret}
                          onChange={(e) => setContactInfo({...contactInfo, siret: e.target.value})}
                          className="bg-white border-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Nom complet <span className="text-red-500">*</span></Label>
                        <Input 
                          id="name" 
                          value={contactInfo.name}
                          onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                          className="bg-white border-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                          className="bg-white border-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone <span className="text-red-500">*</span></Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                          className="bg-white border-2"
                          required
                        />
                      </div>

                      {/* Billing Address Fields - Added based on SIRET requirements */}
                      <div className="pt-4 mt-4 border-t border-slate-200">
                         <Label className="mb-3 block font-semibold">Adresse postale</Label>
                         <div className="space-y-3">
                            <div>
                               <Label htmlFor="billing-street" className="text-xs">Rue</Label>
                               <Input 
                                 id="billing-street"
                                 value={contactInfo.address?.street || ''}
                                 onChange={(e) => setContactInfo(prev => ({...prev, address: { ...prev.address!, street: e.target.value } }))}
                                 className="bg-white border-2"
                               />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                               <div>
                                 <Label htmlFor="billing-zip" className="text-xs">Code postal</Label>
                                 <Input 
                                   id="billing-zip"
                                   value={contactInfo.address?.postalCode || ''}
                                   onChange={(e) => setContactInfo(prev => ({...prev, address: { ...prev.address!, postalCode: e.target.value } }))}
                                   className="bg-white border-2"
                                 />
                               </div>
                               <div>
                                 <Label htmlFor="billing-city" className="text-xs">Ville</Label>
                                 <Input 
                                   id="billing-city"
                                   value={contactInfo.address?.city || ''}
                                   onChange={(e) => setContactInfo(prev => ({...prev, address: { ...prev.address!, city: e.target.value } }))}
                                   className="bg-white border-2"
                                 />
                               </div>
                            </div>
                         </div>
                      </div>

                   </CardContent>
                </Card>
             </div>

             {/* Delivery Address Recap */}
             <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <h4 className="font-semibold text-lg">Adresse de livraison</h4>
                </div>
                <Card className="border-2 border-slate-200 bg-slate-50">
                   <CardContent className="p-6">
                      <div className="space-y-1 text-sm text-slate-700">
                        <p className="font-semibold text-base text-black mb-2">Lieu de livraison :</p>
                        {deliveryAddress.company && <p className="font-medium">{deliveryAddress.company}</p>}
                        <p>{deliveryAddress.street}</p>
                        {deliveryAddress.street2 && <p>{deliveryAddress.street2}</p>}
                        <p>{deliveryAddress.postalCode} {deliveryAddress.city}</p>
                        <p>{deliveryAddress.country}</p>
                        {deliveryAddress.specialInstructions && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                             <p className="font-semibold text-black mb-1">Instructions :</p>
                             <p className="italic text-slate-600">{deliveryAddress.specialInstructions}</p>
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto mt-4 text-slate-500 hover:text-black"
                        onClick={() => setCurrentStep('delivery')}
                      >
                        Modifier l'adresse
                      </Button>
                   </CardContent>
                </Card>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={() => setCurrentStep('email')}
              variant="outline" 
              className="flex-1 border-2 py-6"
            >
              <Mail className="w-5 h-5 mr-2" />
              Envoyer le récapitulatif par email
            </Button>
            <Button 
              onClick={handlePurchase}
              className="flex-1 bg-black hover:bg-slate-800 text-white py-6"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Acheter en ligne
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}