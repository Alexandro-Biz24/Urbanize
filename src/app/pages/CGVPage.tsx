import { FileText, ShoppingCart, Truck, CreditCard, AlertTriangle, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CGVPage() {
  return (
    <div className="pt-24 pb-20 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <FileText className="w-10 h-10" />
            Conditions Générales de Vente
          </h1>
          <p className="text-slate-200 text-lg">Applicables aux professionnels du BTP</p>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Préambule */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Préambule</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-900">Urbanize</strong>, société [forme juridique], au capital de [montant] €, 
                immatriculée au RCS de Paris sous le numéro [numéro], dont le siège social est situé à [adresse], ci-après dénommée « le Vendeur »</li>
                <li>Et toute personne physique ou morale, professionnelle du secteur BTP, ci-après dénommée « l'Acheteur » ou « le Client »</li>
              </ul>
              <p className="mt-4">
                La plateforme <strong className="text-slate-900">Hoardingo</strong> permet aux professionnels du BTP d'accéder à des <strong>prestations de services</strong> 
                (installation de palissades, études BET) et à des <strong>produits</strong> (totems, massifs béton) destinés à l'habillage urbain et à la signalétique de chantier.
              </p>
            </div>
          </section>

          {/* Article 1 - Champ d'application */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 1 - Champ d'application</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Les présentes CGV s'appliquent exclusivement aux ventes B2B (Business to Business) réalisées via la plateforme Hoardingo.
              </p>
              <p>
                Elles régissent les conditions de vente de :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-900">Prestations de service :</strong> Installation de palissades, études techniques BET (Bureau d'Études Techniques), 
                demandes d'autorisation CERFA</li>
                <li><strong className="text-slate-900">Produits :</strong> Totems de signalétique, massifs béton de lestage, éléments d'habillage urbain</li>
              </ul>
              <p className="mt-4">
                Toute commande passée sur la plateforme Hoardingo implique l'adhésion sans réserve de l'Acheteur aux présentes CGV, 
                à l'exclusion de toutes autres conditions, notamment les conditions générales d'achat du Client.
              </p>
            </div>
          </section>

          {/* Article 2 - Commandes */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-slate-600" />
              Article 2 - Commandes
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                <strong className="text-slate-900">2.1. Processus de commande</strong><br />
                Les commandes sont passées en ligne via la plateforme Hoardingo. L'Acheteur sélectionne les produits ou prestations souhaités, 
                renseigne les informations nécessaires (dimensions, quantités, adresse de livraison, etc.) et valide sa commande.
              </p>
              <p>
                <strong className="text-slate-900">2.2. Confirmation de commande</strong><br />
                Une fois la commande validée et le paiement effectué, l'Acheteur reçoit un email de confirmation récapitulant 
                les détails de sa commande (référence, produits/prestations, montant, date de livraison estimée).
              </p>
              <p>
                <strong className="text-slate-900">2.3. Modification ou annulation</strong><br />
                Toute demande de modification ou d'annulation doit être adressée par email à contact@urbanize.fr dans les 24 heures suivant la validation de la commande. 
                Passé ce délai, la commande est considérée comme ferme et définitive.
              </p>
            </div>
          </section>

          {/* Article 3 - Prix */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-slate-600" />
              Article 3 - Prix et modalités de paiement
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                <strong className="text-slate-900">3.1. Prix</strong><br />
                Les prix affichés sur la plateforme Hoardingo sont exprimés en euros (€) hors taxes (HT) pour les professionnels assujettis à la TVA. 
                La TVA applicable est de 20% sauf mention contraire.
              </p>
              <p>
                Les prix incluent la livraison pour les palissades (tarifs fermes livraison incluse). Pour les autres produits, 
                les frais de livraison sont indiqués avant validation de la commande.
              </p>
              <p>
                <strong className="text-slate-900">3.2. Modalités de paiement</strong><br />
                Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard) ou par virement bancaire pour les commandes supérieures à [montant] €. 
                Le paiement est exigible immédiatement à la commande.
              </p>
              <p>
                <strong className="text-slate-900">3.3. Facturation</strong><br />
                Une facture est émise et envoyée par email à l'Acheteur dès validation du paiement. 
                Elle comporte les mentions légales obligatoires (TVA, numéro de facture, date, etc.).
              </p>
            </div>
          </section>

          {/* Article 4 - Livraison */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Truck className="w-6 h-6 text-slate-600" />
              Article 4 - Livraison et exécution des prestations
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                <strong className="text-slate-900">4.1. Délais de livraison</strong><br />
                Les délais de livraison sont communiqués à titre indicatif lors de la commande. Pour les palissades, 
                un délai minimum de 4 jours ouvrés est requis à compter de la validation de la commande.
              </p>
              <p>
                <strong className="text-slate-900">4.2. Modalités de livraison</strong><br />
                La livraison s'effectue à l'adresse indiquée par l'Acheteur lors de la commande. 
                L'Acheteur doit s'assurer de la praticabilité du lieu de livraison pour les véhicules de transport (poids lourds, semi-remorques).
              </p>
              <p>
                <strong className="text-slate-900">4.3. Réception de la livraison</strong><br />
                L'Acheteur ou son représentant doit être présent lors de la livraison pour réceptionner la marchandise. 
                En cas de dommages apparents, l'Acheteur doit formuler des réserves précises sur le bon de livraison et en informer Urbanize par email sous 48 heures.
              </p>
              <p>
                <strong className="text-slate-900">4.4. Prestations de service</strong><br />
                Pour les prestations d'installation (palissades) ou d'études (BET), les délais d'intervention sont convenus avec l'Acheteur après validation de la commande. 
                Un planning d'intervention est communiqué par email.
              </p>
            </div>
          </section>

          {/* Article 5 - Garanties */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 5 - Garanties</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                <strong className="text-slate-900">5.1. Garantie légale de conformité</strong><br />
                Les produits vendus bénéficient de la garantie légale de conformité prévue par les articles L.217-4 et suivants du Code de la consommation 
                (applicable aux ventes entre professionnels pour les biens mobiliers).
              </p>
              <p>
                <strong className="text-slate-900">5.2. Garantie des vices cachés</strong><br />
                Les produits bénéficient également de la garantie des vices cachés prévue par les articles 1641 et suivants du Code civil.
              </p>
              <p>
                <strong className="text-slate-900">5.3. Durée de garantie</strong><br />
                Sauf mention contraire, la garantie commerciale est de 12 mois à compter de la date de livraison pour les produits, 
                et de 12 mois à compter de la fin d'exécution pour les prestations de service.
              </p>
            </div>
          </section>

          {/* Article 6 - Responsabilité */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-slate-600" />
              Article 6 - Responsabilité
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                La responsabilité d'Urbanize ne pourra être engagée en cas de non-exécution ou de mauvaise exécution du contrat 
                due à un cas de force majeure, au fait imprévisible et insurmontable d'un tiers, ou à la faute de l'Acheteur 
                (notamment mauvaise utilisation du produit, non-respect des consignes d'installation).
              </p>
              <p>
                En tout état de cause, la responsabilité d'Urbanize est limitée au montant de la commande.
              </p>
            </div>
          </section>

          {/* Article 7 - Force majeure */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 7 - Force majeure</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Urbanize ne sera pas tenue responsable de tout retard ou inexécution de ses obligations résultant d'un cas de force majeure, 
                tel que défini par la jurisprudence française (incendie, inondation, pandémie, grève, conflit social, etc.).
              </p>
              <p>
                En cas de force majeure se prolongeant au-delà de 30 jours, le contrat pourra être résilié de plein droit par l'une ou l'autre des parties, 
                sans indemnité de part et d'autre.
              </p>
            </div>
          </section>

          {/* Article 8 - Propriété intellectuelle */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 8 - Propriété intellectuelle</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Tous les éléments de la plateforme Hoardingo (marques, logos, textes, images, bases de données, logiciels) sont la propriété exclusive d'Urbanize 
                ou font l'objet d'une autorisation d'utilisation.
              </p>
              <p>
                Toute reproduction, représentation, modification ou exploitation de ces éléments, sans l'autorisation préalable et écrite d'Urbanize, 
                est strictement interdite et constitue une contrefaçon sanctionnée par le Code de la Propriété Intellectuelle.
              </p>
            </div>
          </section>

          {/* Article 9 - Données personnelles */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 9 - Protection des données personnelles</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Les données personnelles collectées via la plateforme Hoardingo font l'objet d'un traitement informatique destiné à la gestion des commandes, 
                à la facturation et à la relation client.
              </p>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), l'Acheteur dispose d'un droit d'accès, de rectification, 
                de suppression et d'opposition au traitement de ses données personnelles.
              </p>
              <p>
                Pour en savoir plus, consulter notre <Link to="/confidentialite" className="text-slate-700 font-semibold underline hover:text-slate-900">Politique de confidentialité</Link>.
              </p>
            </div>
          </section>

          {/* Article 10 - Litiges */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-slate-600" />
              Article 10 - Litiges et droit applicable
            </h2>
            <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded-r-lg space-y-3">
              <p className="text-slate-700">
                <strong className="text-slate-900">10.1. Droit applicable</strong><br />
                Les présentes CGV sont soumises au droit français.
              </p>
              <p className="text-slate-700">
                <strong className="text-slate-900">10.2. Règlement amiable</strong><br />
                En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire.
              </p>
              <p className="text-slate-700">
                <strong className="text-slate-900">10.3. Tribunal compétent</strong><br />
                À défaut de règlement amiable, <strong className="text-slate-900">compétence exclusive est attribuée au Tribunal de Commerce de Paris</strong>, 
                nonobstant pluralité de défendeurs ou appel en garantie, même pour les procédures d'urgence ou conservatoires.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
            <p className="text-slate-700">
              Pour toute question relative aux présentes CGV, vous pouvez contacter notre service client à l'adresse : 
              <strong className="text-slate-900"> contact@urbanize.fr</strong> ou par téléphone au <strong className="text-slate-900">+33 (0)X XX XX XX XX</strong>.
            </p>
          </section>

          {/* Retour */}
          <div className="border-t border-slate-200 pt-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Dernière mise à jour */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Version en vigueur au 1er janvier 2026
        </div>
      </div>
    </div>
  );
}
