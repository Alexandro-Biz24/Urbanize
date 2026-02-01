import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Download } from 'lucide-react';
import { DeliveryAddressForm, DeliveryAddress } from './DeliveryAddressForm';
import type { TotemItem } from './TotemCalculator';
import { TOTEM_PRICES } from './TotemCalculator';
import jsPDF from 'jspdf';

interface TotemCartProps {
  items: TotemItem[];
  purchaseType: 'fabrication' | 'plans_only';
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onBack: () => void;
  onProceedToCheckout: (deliveryAddress?: DeliveryAddress) => void;
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

export function TotemCart({ 
  items, 
  purchaseType, 
  onUpdateQuantity, 
  onRemoveItem, 
  onBack,
  onProceedToCheckout 
}: TotemCartProps) {
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: '',
    street2: '',
    postalCode: '',
    city: '',
    country: 'France',
    specialInstructions: ''
  });

  // Calculer le nombre de types uniques pour les plans
  const getUniqueTotemTypes = () => {
    const uniqueTypes = new Set<string>();
    items.forEach(item => {
      if (item.totemType === 'caisson_bois') {
        uniqueTypes.add(`${item.totemType}_${item.caissonBoisFormat}`);
      } else {
        uniqueTypes.add(item.totemType);
      }
    });
    return uniqueTypes.size;
  };

  // Calculer le sous-total
  const calculateSubtotal = () => {
    if (purchaseType === 'plans_only') {
      return getUniqueTotemTypes() * PLANS_PRICE_PER_TYPE;
    }

    let total = 0;
    items.forEach(item => {
      if (item.totemType === 'caisson_bois') {
        const price = TOTEM_PRICES.caisson_bois[item.caissonBoisFormat!];
        total += price * item.quantity;
      } else {
        const price = TOTEM_PRICES[item.totemType] as number;
        total += price * item.quantity;
      }
    });
    return total;
  };

  // Calculer la remise
  const calculateDiscount = () => {
    if (purchaseType === 'fabrication') {
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      if (totalQuantity >= 5) {
        return calculateSubtotal() * 0.05; // 5% de remise
      }
    }
    return 0;
  };

  // Calculer le total final
  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueTypesCount = getUniqueTotemTypes();
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const total = calculateTotal();
  const hasDiscount = discount > 0;

  // Générer le PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(`Devis ${purchaseType === 'plans_only' ? 'Plans' : 'Fabrication'} Totems`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
    
    doc.setFontSize(14);
    doc.text('Panier', 20, 45);
    doc.setFontSize(10);
    
    let yPos = 55;
    
    if (purchaseType === 'plans_only') {
      doc.text('Plans et fournisseurs recommandés', 20, yPos);
      yPos += 7;
      doc.text(`${uniqueTypesCount} type${uniqueTypesCount > 1 ? 's' : ''} de totem × 890 € HT`, 20, yPos);
      yPos += 7;
      doc.text(`Sous-total: ${subtotal.toLocaleString('fr-FR')} € HT`, 20, yPos);
    } else {
      items.forEach((item) => {
        const label = TOTEM_LABELS[item.totemType];
        const format = item.totemType === 'caisson_bois' ? ` - ${CAISSON_FORMAT_LABELS[item.caissonBoisFormat!]}` : '';
        let unitPrice = 0;
        
        if (item.totemType === 'caisson_bois') {
          unitPrice = TOTEM_PRICES.caisson_bois[item.caissonBoisFormat!];
        } else {
          unitPrice = TOTEM_PRICES[item.totemType] as number;
        }
        
        const itemTotal = unitPrice * item.quantity;
        doc.text(`${label}${format}`, 20, yPos);
        yPos += 7;
        doc.text(`${item.quantity} × ${unitPrice.toLocaleString('fr-FR')} € = ${itemTotal.toLocaleString('fr-FR')} € HT`, 20, yPos);
        yPos += 10;
      });

      doc.text(`Sous-total: ${subtotal.toLocaleString('fr-FR')} € HT`, 20, yPos);
      yPos += 7;
      
      if (hasDiscount) {
        doc.setTextColor(0, 150, 0);
        doc.text(`Remise 5%: -${discount.toLocaleString('fr-FR')} € HT`, 20, yPos);
        yPos += 7;
        doc.setTextColor(0, 0, 0);
      }
    }
    
    yPos += 10;
    doc.setFontSize(14);
    doc.text(`Total: ${total.toLocaleString('fr-FR')} € HT`, 20, yPos);
    
    doc.save(`devis-totem-${purchaseType}-hoardingo.pdf`);
  };

  const handleProceedToCheckout = () => {
    if (purchaseType === 'fabrication') {
      if (!deliveryAddress.street || !deliveryAddress.postalCode || !deliveryAddress.city || !deliveryAddress.country) {
        alert('Veuillez renseigner l\'adresse de livraison complète');
        return;
      }
      onProceedToCheckout(deliveryAddress);
    } else {
      onProceedToCheckout();
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-12 px-4">
      <div className="mb-8">
        <Button onClick={onBack} variant="outline" className="border-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Modifier l'option choisie
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale - Panier */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Votre panier</h2>
                  <p className="text-slate-600">
                    {purchaseType === 'plans_only' ? 'Plans et fournisseurs' : 'Fabrication complète'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {purchaseType === 'plans_only' ? (
                  // Affichage pour les plans (par type unique)
                  <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Plans et fournisseurs recommandés</h3>
                        <p className="text-sm text-slate-600 mb-3">Documentation complète incluant :</p>
                        <ul className="text-sm text-slate-600 space-y-1 mb-3 list-disc list-inside ml-2">
                          <li>Plans 2D + vues techniques</li>
                          <li>Recommandations matériaux & fixations</li>
                          <li>Contraintes vent / stabilité (hypothèses normées)</li>
                          <li>Check-list de fabrication</li>
                        </ul>
                        <div className="bg-white rounded p-3 mt-3 border border-slate-300">
                          <p className="text-xs text-slate-500 font-semibold mb-2">Totems configurés :</p>
                          <div className="space-y-1">
                            {items.map((item, index) => {
                              const label = TOTEM_LABELS[item.totemType];
                              const format = item.totemType === 'caisson_bois' ? ` - ${CAISSON_FORMAT_LABELS[item.caissonBoisFormat!]}` : '';
                              return (
                                <div key={index} className="text-xs text-slate-600">• {label}{format} (Qté: {item.quantity})</div>
                              );
                            })}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-3 font-medium">
                          {uniqueTypesCount} type{uniqueTypesCount > 1 ? 's' : ''} unique{uniqueTypesCount > 1 ? 's' : ''} de totem
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-slate-600 mb-1">Prix unitaire</div>
                        <div className="font-semibold">890 € HT</div>
                        <div className="text-sm text-slate-500 mt-2">× {uniqueTypesCount}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Affichage pour la fabrication (modifiable)
                  items.map((item) => {
                    let unitPrice = 0;
                    if (item.totemType === 'caisson_bois') {
                      unitPrice = TOTEM_PRICES.caisson_bois[item.caissonBoisFormat!];
                    } else {
                      unitPrice = TOTEM_PRICES[item.totemType] as number;
                    }
                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <div key={item.id} className="border-2 border-slate-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">
                              {TOTEM_LABELS[item.totemType]}
                              {item.totemType === 'caisson_bois' && ` - ${CAISSON_FORMAT_LABELS[item.caissonBoisFormat!]}`}
                            </h3>
                            <p className="text-sm text-slate-600 mb-3">
                              Prix unitaire : {unitPrice.toLocaleString('fr-FR')} € HT
                            </p>

                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                variant="outline"
                                size="sm"
                                className="border-2"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-20 text-center border-2"
                              />
                              
                              <Button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                variant="outline"
                                size="sm"
                                className="border-2"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>

                              <Button
                                onClick={() => onRemoveItem(item.id)}
                                variant="ghost"
                                size="sm"
                                className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {itemTotal.toLocaleString('fr-FR')} €
                            </div>
                            <div className="text-sm text-slate-600">HT</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {hasDiscount && (
                <div className="mt-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">-5%</span>
                      </div>
                      <div>
                        <div className="font-semibold text-green-800">Remise appliquée !</div>
                        <div className="text-sm text-green-700">{totalQuantity} totems ou plus</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-700">Économie</div>
                      <div className="text-lg font-bold text-green-800">
                        -{discount.toLocaleString('fr-FR')} € HT
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adresse de livraison (seulement pour fabrication) */}
          {purchaseType === 'fabrication' && (
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Adresse de livraison</h3>
                <DeliveryAddressForm address={deliveryAddress} onChange={setDeliveryAddress} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne latérale - Récapitulatif */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <Card className="border-2 border-black shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Récapitulatif</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Sous-total</span>
                    <span className="font-medium">{subtotal.toLocaleString('fr-FR')} € HT</span>
                  </div>

                  {hasDiscount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Remise (5%)</span>
                      <span className="font-medium text-green-700">-{discount.toLocaleString('fr-FR')} € HT</span>
                    </div>
                  )}

                  <div className="pt-3 border-t-2 border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{total.toLocaleString('fr-FR')} €</div>
                        <div className="text-sm text-slate-600">HT</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Nombre d'articles</span>
                    <span className="font-medium">{totalQuantity}</span>
                  </div>
                  {purchaseType === 'plans_only' && (
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Types de totems</span>
                      <span className="font-medium">{uniqueTypesCount}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-black hover:bg-slate-800 text-white py-6 mb-3"
                >
                  Procéder au paiement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  onClick={generatePDF}
                  variant="outline"
                  className="w-full border-2 py-3"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le devis PDF
                </Button>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Bon à savoir</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Tarifs fermes hors livraison</li>
                <li>• Paiement sécurisé par Stripe</li>
                {purchaseType === 'plans_only' 
                  ? <li>• Plans envoyés sous 24-48h</li>
                  : <li>• Délai de fabrication sur devis</li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}