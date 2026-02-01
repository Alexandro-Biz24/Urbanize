import { Shield, Database, Eye, Lock, UserCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ConfidentialitePage() {
  return (
    <div className="pt-24 pb-20 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Shield className="w-10 h-10" />
            Politique de confidentialité
          </h1>
          <p className="text-slate-200 text-lg">Protection de vos données personnelles (RGPD)</p>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                La société <strong className="text-slate-900">Urbanize</strong>, éditrice de la plateforme <strong className="text-slate-900">Hoardingo</strong>, 
                accorde une importance particulière à la protection de vos données personnelles et au respect de votre vie privée.
              </p>
              <p>
                Cette politique de confidentialité a pour objectif de vous informer sur la manière dont nous collectons, utilisons, 
                partageons et protégeons vos données personnelles dans le cadre de l'utilisation de notre plateforme e-commerce professionnelle.
              </p>
              <p>
                Cette politique est conforme au <strong className="text-slate-900">Règlement Général sur la Protection des Données (RGPD)</strong> 
                et à la loi Informatique et Libertés modifiée.
              </p>
            </div>
          </section>

          {/* Responsable du traitement */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-slate-600" />
              Responsable du traitement des données
            </h2>
            <div className="bg-slate-50 p-6 rounded-lg text-slate-700 space-y-2">
              <p><strong className="text-slate-900">Raison sociale :</strong> Urbanize</p>
              <p><strong className="text-slate-900">Siège social :</strong> [Adresse complète], Paris, France</p>
              <p><strong className="text-slate-900">Email :</strong> contact@urbanize.fr</p>
              <p><strong className="text-slate-900">Téléphone :</strong> +33 (0)X XX XX XX XX</p>
            </div>
          </section>

          {/* Données collectées */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-slate-600" />
              Données personnelles collectées
            </h2>
            <div className="text-slate-700 space-y-4">
              <p>
                Dans le cadre de l'utilisation de la plateforme Hoardingo, nous sommes susceptibles de collecter les catégories de données suivantes :
              </p>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">1. Données d'identification</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li>Nom, prénom</li>
                    <li>Raison sociale de l'entreprise</li>
                    <li>Numéro SIRET</li>
                    <li>Adresse email professionnelle</li>
                    <li>Numéro de téléphone professionnel</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">2. Données de commande et de facturation</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li>Adresse de livraison</li>
                    <li>Adresse de facturation</li>
                    <li>Historique des commandes</li>
                    <li>Devis et factures</li>
                    <li>Informations de paiement (via prestataire de paiement sécurisé)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">3. Données de navigation</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li>Adresse IP</li>
                    <li>Cookies et traceurs (voir notre <Link to="/cookies" className="text-slate-700 font-semibold underline hover:text-slate-900">Politique Cookies</Link>)</li>
                    <li>Pages visitées et durée de navigation</li>
                    <li>Données de connexion (date, heure)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">4. Données techniques du projet</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li>Dimensions et spécifications des équipements commandés</li>
                    <li>Plans et documents techniques (pour études BET)</li>
                    <li>Adresses de chantier</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Finalités */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-slate-600" />
              Finalités du traitement
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-900">Gestion des commandes :</strong> traitement, validation, préparation, livraison et facturation</li>
                <li><strong className="text-slate-900">Relation client :</strong> communication sur l'état des commandes, service après-vente, réclamations</li>
                <li><strong className="text-slate-900">Exécution des prestations :</strong> installation de palissades, réalisation d'études BET, demandes d'autorisation</li>
                <li><strong className="text-slate-900">Gestion comptable :</strong> facturation, comptabilité, recouvrement</li>
                <li><strong className="text-slate-900">Respect des obligations légales :</strong> conservation des factures, déclarations fiscales</li>
                <li><strong className="text-slate-900">Amélioration de nos services :</strong> analyses statistiques, optimisation de l'expérience utilisateur</li>
                <li><strong className="text-slate-900">Marketing (avec consentement) :</strong> envoi d'offres commerciales, newsletters professionnelles</li>
              </ul>
            </div>
          </section>

          {/* Base légale */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Base légale du traitement</h2>
            <div className="text-slate-700 space-y-3">
              <p>Les traitements de données personnelles reposent sur les bases légales suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-900">Exécution du contrat :</strong> gestion des commandes, livraison, facturation</li>
                <li><strong className="text-slate-900">Obligation légale :</strong> conservation des factures (10 ans), déclarations fiscales</li>
                <li><strong className="text-slate-900">Intérêt légitime :</strong> prévention de la fraude, amélioration de nos services</li>
                <li><strong className="text-slate-900">Consentement :</strong> envoi d'emails marketing (révocable à tout moment)</li>
              </ul>
            </div>
          </section>

          {/* Destinataires */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Destinataires des données</h2>
            <div className="text-slate-700 space-y-3">
              <p>Vos données personnelles sont destinées aux services internes d'Urbanize (commercial, logistique, comptabilité, service client).</p>
              <p>Elles peuvent également être partagées avec :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-900">Prestataires techniques :</strong> hébergeur web, prestataire de paiement sécurisé</li>
                <li><strong className="text-slate-900">Transporteurs :</strong> pour l'acheminement des commandes</li>
                <li><strong className="text-slate-900">Partenaires d'installation :</strong> pour les prestations de pose sur chantier</li>
                <li><strong className="text-slate-900">Autorités compétentes :</strong> sur demande légale (administration fiscale, justice)</li>
              </ul>
              <p className="mt-3">
                <strong className="text-slate-900">Aucune donnée personnelle n'est vendue à des tiers à des fins commerciales.</strong>
              </p>
            </div>
          </section>

          {/* Durée de conservation */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Durée de conservation</h2>
            <div className="text-slate-700 space-y-3">
              <p>Les données personnelles sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-900">Données de commande :</strong> 10 ans (obligation légale comptable et fiscale)</li>
                <li><strong className="text-slate-900">Données clients :</strong> 3 ans à compter de la dernière commande (relation commerciale)</li>
                <li><strong className="text-slate-900">Données de navigation :</strong> 13 mois maximum (cookies)</li>
                <li><strong className="text-slate-900">Données marketing :</strong> 3 ans à compter du dernier contact (prospect inactif)</li>
              </ul>
              <p className="mt-3">
                À l'issue de ces délais, les données sont supprimées ou anonymisées.
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-slate-600" />
              Sécurité des données
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Urbanize met en œuvre toutes les mesures techniques et organisationnelles appropriées pour assurer la sécurité et la confidentialité de vos données personnelles, 
                notamment pour empêcher qu'elles soient déformées, endommagées ou que des tiers non autorisés y aient accès :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chiffrement SSL/TLS pour les échanges de données</li>
                <li>Authentification sécurisée</li>
                <li>Hébergement de données sur serveurs sécurisés en Europe</li>
                <li>Accès restreint aux données (collaborateurs habilités uniquement)</li>
                <li>Sauvegardes régulières</li>
                <li>Politique de mots de passe robuste</li>
              </ul>
            </div>
          </section>

          {/* Droits */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Vos droits (RGPD)</h2>
            <div className="text-slate-700 space-y-4">
              <p>
                Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
              </p>
              
              <div className="bg-slate-50 p-6 rounded-lg space-y-3">
                <p><strong className="text-slate-900">• Droit d'accès :</strong> Vous pouvez demander l'accès à vos données personnelles</p>
                <p><strong className="text-slate-900">• Droit de rectification :</strong> Vous pouvez demander la correction de données inexactes</p>
                <p><strong className="text-slate-900">• Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données (« droit à l'oubli »)</p>
                <p><strong className="text-slate-900">• Droit à la limitation :</strong> Vous pouvez demander la limitation du traitement</p>
                <p><strong className="text-slate-900">• Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré</p>
                <p><strong className="text-slate-900">• Droit d'opposition :</strong> Vous pouvez vous opposer au traitement à des fins marketing</p>
                <p><strong className="text-slate-900">• Droit de retirer votre consentement :</strong> À tout moment, sans affecter la licéité du traitement avant retrait</p>
              </div>

              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à : <strong className="text-slate-900">contact@urbanize.fr</strong> en précisant votre demande et en joignant une pièce d'identité.
              </p>
              <p>
                Vous disposez également du droit d'introduire une réclamation auprès de la <strong className="text-slate-900">CNIL</strong> 
                (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-slate-700 underline hover:text-slate-900">www.cnil.fr</a>
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Modifications de la politique</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Urbanize se réserve le droit de modifier la présente politique de confidentialité à tout moment, notamment pour l'adapter aux évolutions législatives ou réglementaires.
              </p>
              <p>
                Toute modification sera portée à votre connaissance via la plateforme Hoardingo ou par email. 
                Nous vous invitons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-slate-600" />
              Nous contacter
            </h2>
            <div className="bg-slate-50 p-6 rounded-lg text-slate-700 space-y-2">
              <p>Pour toute question relative à la protection de vos données personnelles ou pour exercer vos droits :</p>
              <p className="font-bold text-slate-900 mt-3">Email : contact@urbanize.fr</p>
              <p className="font-bold text-slate-900">Téléphone : +33 (0)X XX XX XX XX</p>
              <p className="text-sm text-slate-600 mt-3">
                Délai de réponse : 30 jours maximum à compter de la réception de votre demande
              </p>
            </div>
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
          Dernière mise à jour : Janvier 2026
        </div>
      </div>
    </div>
  );
}
