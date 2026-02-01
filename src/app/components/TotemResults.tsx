import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { RefreshCcw, CheckCircle, FileText, Package } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { DeliveryAddress } from './DeliveryAddressForm';
import { StripeCheckout } from './StripeCheckout';
import { TotemCart } from './TotemCart';
import type { TotemConfig, TotemItem } from './TotemCalculator';
import { TOTEM_PRICES } from './TotemCalculator';

interface TotemResultsProps {
  config: TotemConfig;
  onReset: () => void;
}

const TOTEM_LABELS = {
  caisson_bois: 'Totem Caisson Bois',
  gabion: 'Totem Gabion',
  liz: 'Totem LIZ'
};

const CAISSON_FORMAT_LABELS = {
  '80': 'Format 80',
  '120': 'Format 120',
  '160': 'Format 160',
  '200': 'Format 200'
};

const PLANS_PRICE_PER_TYPE = 890;

export function TotemResults({ config, onReset }: TotemResultsProps) {
  const [purchaseType, setPurchaseType] = useState<'fabrication' | 'plans_only' | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cartItems, setCartItems] = useState<TotemItem[]>(config.items);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: '',
    street2: '',
    postalCode: '',
    city: '',
    country: 'France',
    specialInstructions: ''
  });

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    setPaymentSuccess(true);
  };

  const handleCancelCheckout = () => {
    setShowCheckout(false);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    if (cartItems.length > 1) {
      setCartItems(items => items.filter(item => item.id !== itemId));
    } else {
      alert('Vous devez avoir au moins un totem dans votre panier');
    }
  };

  const handleProceedToCheckout = (address?: DeliveryAddress) => {
    if (address) {
      setDeliveryAddress(address);
    }
    setShowCheckout(true);
  };

  // Calculer le nombre de types de totems uniques (pour le prix des plans)
  const getUniqueTotemTypes = () => {
    const uniqueTypes = new Set<string>();
    config.items.forEach(item => {
      if (item.totemType === 'caisson_bois') {
        uniqueTypes.add(`${item.totemType}_${item.caissonBoisFormat}`);
      } else {
        uniqueTypes.add(item.totemType);
      }
    });
    return uniqueTypes.size;
  };

  // Calculer le total pour la fabrication
  const calculateFabricationTotal = () => {
    let total = 0;
    const totalQuantity = config.items.reduce((sum, item) => sum + item.quantity, 0);
    
    config.items.forEach(item => {
      if (item.totemType === 'caisson_bois') {
        const price = TOTEM_PRICES.caisson_bois[item.caissonBoisFormat!];
        total += price * item.quantity;
      } else {
        const price = TOTEM_PRICES[item.totemType] as number;
        total += price * item.quantity;
      }
    });

    // Remise de 5% si >= 5 totems
    if (totalQuantity >= 5) {
      total = total * 0.95;
    }

    return total;
  };

  // Calculer le total pour les plans uniquement
  const calculatePlansTotal = () => {
    return getUniqueTotemTypes() * PLANS_PRICE_PER_TYPE;
  };

  // Si l'utilisateur n'a pas encore choisi le type d'achat
  if (purchaseType === null) {
    const uniqueTypesCount = getUniqueTotemTypes();
    const plansTotal = calculatePlansTotal();
    const fabricationTotal = calculateFabricationTotal();
    const totalQuantity = config.items.reduce((sum, item) => sum + item.quantity, 0);
    const hasDiscount = totalQuantity >= 5;

    return (
      <div className="max-w-4xl mx-auto pt-12">
        <ProgressBar 
          currentStep={2} 
          totalSteps={4}
          steps={['Configuration', 'Choix', 'Validation', 'Confirmation']}
        />
        
        <Card className="border-2 border-slate-200 shadow-lg mt-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold mb-2">Choisissez votre prestation</h3>
                <p className="text-slate-600">Configuration validée - Sélectionnez le type de service</p>
              </div>
              <Button onClick={onReset} variant="outline" className="border-2">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>

            {/* Résumé de la configuration */}
            <div className="bg-slate-50 rounded-lg p-6 mb-8 border-2 border-slate-200">
              <h4 className="font-semibold mb-4">Votre configuration</h4>
              <div className="space-y-2">
                {config.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {TOTEM_LABELS[item.totemType]}
                      {item.totemType === 'caisson_bois' && ` - ${CAISSON_FORMAT_LABELS[item.caissonBoisFormat!]}`}
                    </span>
                    <span className="font-medium">Quantité : {item.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-300 font-semibold">
                  Total : {totalQuantity} totem{totalQuantity > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Options d'achat */}
            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-lg">Options disponibles</h4>

              {/* Option 1: Plans uniquement */}
              <Card className="border-2 hover:border-black transition-all cursor-pointer group" onClick={() => setPurchaseType('plans_only')}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 group-hover:bg-black rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                      <FileText className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xl font-bold mb-2">Plans et fournisseurs recommandés</h5>
                      <p className="text-slate-600 text-sm mb-3">
                        Documentation complète pour gérer la fabrication vous-même :
                      </p>
                      <ul className="text-sm text-slate-600 space-y-1 mb-3 list-disc list-inside">
                        <li>Plans 2D + vues techniques</li>
                        <li>Recommandations matériaux & fixations</li>
                        <li>Contraintes vent / stabilité (hypothèses normées)</li>
                        <li>Check-list de fabrication</li>
                      </ul>
                      <p className="text-sm text-slate-500">
                        <strong>Prix par type de totem :</strong> 890 € HT
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{plansTotal.toLocaleString('fr-FR')} €</div>
                      <div className="text-sm text-slate-600">HT</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {uniqueTypesCount} type{uniqueTypesCount > 1 ? 's' : ''} de totem
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Option 2: Fabrication complète */}
              <Card className="border-2 hover:border-black transition-all cursor-pointer group" onClick={() => setPurchaseType('fabrication')}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 group-hover:bg-black rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                      <Package className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xl font-bold mb-2">Fabrication complète</h5>
                      <p className="text-slate-600 text-sm mb-3">
                        Fabrication gérée par Atelier Urbanize. Production de haute qualité avec garantie et service client.
                      </p>
                      {hasDiscount && (
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm mb-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">Remise de 5% appliquée ({totalQuantity} totems)</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{fabricationTotal.toLocaleString('fr-FR')} €</div>
                      <div className="text-sm text-slate-600">HT{hasDiscount && ' (avec remise)'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note :</strong> Les tarifs sont fermes et hors livraison. Possibilité d'achat en ligne.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Écran de confirmation de paiement réussi
  if (paymentSuccess) {
    return (
      <>
        <ProgressBar 
          currentStep={4} 
          totalSteps={4}
          steps={['Configuration', 'Choix', 'Panier', 'Confirmation']}
        />
        <div className="max-w-4xl mx-auto pt-12">
          <Card className="border-2 border-green-500 shadow-lg">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-600" />
              <h2 className="text-3xl font-bold mb-4">Paiement réussi !</h2>
              <p className="text-lg text-slate-600 mb-6">
                {purchaseType === 'plans_only' 
                  ? 'Votre commande de plans a été confirmée. Vous allez recevoir les documents par email.'
                  : 'Votre commande de totems a été confirmée.'}
              </p>
              <Button 
                onClick={onReset}
                className="bg-black hover:bg-slate-800 text-white"
              >
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Écran de paiement Stripe
  if (showCheckout) {
    // Recalculer le total basé sur cartItems (qui peut avoir changé)
    let amount = 0;
    if (purchaseType === 'plans_only') {
      const uniqueTypes = new Set<string>();
      cartItems.forEach(item => {
        if (item.totemType === 'caisson_bois') {
          uniqueTypes.add(`${item.totemType}_${item.caissonBoisFormat}`);
        } else {
          uniqueTypes.add(item.totemType);
        }
      });
      amount = uniqueTypes.size * PLANS_PRICE_PER_TYPE;
    } else {
      const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartItems.forEach(item => {
        if (item.totemType === 'caisson_bois') {
          const price = TOTEM_PRICES.caisson_bois[item.caissonBoisFormat!];
          amount += price * item.quantity;
        } else {
          const price = TOTEM_PRICES[item.totemType] as number;
          amount += price * item.quantity;
        }
      });
      if (totalQuantity >= 5) {
        amount = amount * 0.95;
      }
    }

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return (
      <>
        <ProgressBar 
          currentStep={3} 
          totalSteps={4}
          steps={['Configuration', 'Choix', 'Panier', 'Confirmation']}
        />
        <div className="max-w-2xl mx-auto pt-12">
          <StripeCheckout
            amount={amount}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancelCheckout}
            orderDetails={{
              type: purchaseType === 'plans_only' ? 'Plans Totem' : 'Fabrication Totem',
              description: `${totalQuantity} totem(s) - ${purchaseType === 'plans_only' ? 'Plans et fournisseurs' : 'Fabrication complète'}`
            }}
          />
        </div>
      </>
    );
  }

  // Affichage du panier une fois le type d'achat choisi
  if (purchaseType) {
    return (
      <>
        <ProgressBar 
          currentStep={3} 
          totalSteps={4}
          steps={['Configuration', 'Choix', 'Panier', 'Confirmation']}
        />
        
        <TotemCart
          items={cartItems}
          purchaseType={purchaseType}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onBack={() => setPurchaseType(null)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      </>
    );
  }

  return null;
}