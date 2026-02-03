import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import type { CartData } from '@/app/components/Results';
import { useEffect, useState } from 'react';

const MATERIAL_LABELS = {
  dibond: 'Dibond imprimé anti-UV',
  dibond_antigraffiti: 'Dibond imprimé anti-UV (Anti-graffiti)',
  tole: 'Tôle ondulée bac acier',
  bois: 'Lames de sapin Coffrage brut Avivé',
  vegetal: 'Végétal synthétique'
};

const SUPPORT_LABELS = {
  none: 'Aucun accompagnement',
  fiche: 'Fiche d\'installation avec tips',
  pilotage: 'Pilotage de l\'installation par Hoardingo',
  pilotage_suivi: 'Pilotage + suivi sur site par Hoardingo'
};

const CERFA_LABELS = {
  none: 'Pas d\'accompagnement CERFA',
  accompagnement: 'Accompagnement téléphonique CERFA',
  complet: 'Service complet CERFA avec mandat'
};

export function CartPage() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<CartData | null>(null);

  useEffect(() => {
    // Récupérer les données du panier depuis le sessionStorage
    const cartDataString = sessionStorage.getItem('cartData');
    if (cartDataString) {
      setCartData(JSON.parse(cartDataString));
    }
  }, []);

  const handleBackToResults = () => {
    navigate(-1); // Retour à la page précédente
  };

  const handleValidate = () => {
    // TODO: Implémenter la validation du panier (envoi email, paiement, etc.)
    alert('Validation du panier ! (Fonctionnalité à implémenter)');
    // Nettoyer le panier après validation
    sessionStorage.removeItem('cartData');
    navigate('/');
  };

  if (!cartData) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-slate-600">Votre panier est vide</p>
          <Button 
            onClick={() => navigate('/')}
            className="mt-8"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const { config, subtotalMin, subtotalMax, services, servicesTotal, finalMin, finalMax } = cartData;

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg border-2 border-orange-400">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Votre panier
          </h2>
          <p className="text-lg text-slate-600 mb-2">
            Récapitulatif de votre commande
          </p>
          <p className="text-sm text-slate-500">
            Estimation budgétaire : {subtotalMin.toLocaleString()} € – {subtotalMax.toLocaleString()} € HT (fourchette ±5%)
          </p>
        </div>

        {/* Estimation du projet */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-1 shadow-2xl shadow-emerald-500/25">
          <div className="rounded-xl bg-white p-8">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Estimation du projet</h3>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent">
                {subtotalMin.toLocaleString('fr-FR')} € – {subtotalMax.toLocaleString('fr-FR')} € HT
              </p>
              <p className="text-sm text-emerald-600 mt-2 font-medium">Fourchette ±5%</p>
              {config.includeInstaller && (
                <p className="text-sm text-green-700 font-semibold mt-3">
                  ✓ Installation incluse dans l'estimation
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Prestations Hoardingo */}
        <Card className="border-2 border-orange-500 shadow-2xl shadow-orange-200/50 mb-8">
          <CardContent className="p-8 md:p-12">
            <h3 className="text-lg font-semibold mb-6">Prestations Hoardingo sélectionnées</h3>
            
            <div className="space-y-4">
              {services.wantsProductDetails && (
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-medium text-base">Liste d'approvisionnement clé en main</p>
                    <p className="font-semibold text-lg">280 € HT</p>
                  </div>
                  <p className="text-xs text-slate-700 mb-3 font-medium">
                    Gagnez un temps précieux avec notre réseau de professionnels qualifiés !
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 ml-4 mb-3">
                    <li>✓ <strong>Liste complète des matériaux</strong> adaptée à votre projet</li>
                    <li>✓ <strong>Minimum 2 fournisseurs de matériaux</strong> dans votre secteur avec coordonnées directes</li>
                    <li>✓ <strong>Minimum 2 artisans installateurs qualifiés</strong> proche de votre chantier</li>
                  </ul>
                  <div className="bg-white border-l-4 border-green-500 p-3 mt-3 rounded">
                    <p className="text-xs text-green-800">
                      <strong>🛡️ Garantie satisfaction :</strong> Si aucun des fournisseurs ou artisans ne peut répondre favorablement à votre demande, 
                      un représentant Hoardingo se mettra personnellement en relation avec vous pour trouver une solution adaptée.
                    </p>
                  </div>
                </div>
              )}

              {services.supportType !== 'none' && (
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">{SUPPORT_LABELS[services.supportType]}</p>
                    <p className="text-xs text-slate-600 mt-1">Accompagnement installation</p>
                  </div>
                  <p className="font-semibold">
                    {services.supportType === 'fiche' && '280 € HT'}
                    {services.supportType === 'pilotage' && '960 € HT'}
                    {services.supportType === 'pilotage_suivi' && '1 460 € HT'}
                  </p>
                </div>
              )}

              {services.cerfaType !== 'none' && (
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">{CERFA_LABELS[services.cerfaType]}</p>
                    <p className="text-xs text-slate-600 mt-1">Accompagnement administratif</p>
                  </div>
                  <p className="font-semibold">
                    {services.cerfaType === 'accompagnement' && '90 € HT'}
                    {services.cerfaType === 'complet' && '350 € HT'}
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
              <div className="text-center">
                <p className="text-sm opacity-90 mb-2">Total des prestations Hoardingo</p>
                <p className="text-3xl font-bold">
                  {servicesTotal.toLocaleString()} € HT
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message de confiance Hoardingo */}
        <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xl shadow-amber-200/50 mb-8">
          <CardContent className="p-8 md:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-400 rounded-full mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">
                Vous avez fait le bon choix !
              </h3>
              <p className="text-base text-slate-700 leading-relaxed max-w-2xl mx-auto">
                En choisissant de partir avec <strong className="text-green-700">Hoardingo</strong>, vous réussirez votre projet <strong>au meilleur prix</strong> et <strong>sans prise de tête</strong>. Notre équipe de professionnels vous accompagne à chaque étape grâce à une <strong>expérience de plus de 20 ans</strong> dans le domaine de l'aménagement urbain et des palissades de chantier.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                <span>Plus de 20 ans d'expérience</span>
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full ml-4"></span>
                <span>Équipe de professionnels qualifiés</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button 
            onClick={handleBackToResults}
            variant="outline" 
            className="flex-1 h-14 text-base border-2 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'estimation
          </Button>
          <Button 
            onClick={handleValidate}
            className="flex-1 h-14 text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md border-2 border-orange-400"
          >
            <Check className="w-4 h-4 mr-2" />
            Valider le panier
          </Button>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-12 text-center">
          <p className="text-sm text-slate-600 mb-2">
            <strong>Contact :</strong> <a href="mailto:info@urbanize.site" className="text-black hover:underline">info@urbanize.site</a>
          </p>
          <p className="text-sm text-slate-600">
            <strong>Adresse :</strong> 39 rue Dupleix - 75015 Paris, France
          </p>
        </div>
      </div>
    </div>
  );
}