import { Cookie, Settings, ToggleLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CookiesPage() {
  return (
    <div className="pt-24 pb-20 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Cookie className="w-10 h-10" />
            Politique Cookies
          </h1>
          <p className="text-slate-200 text-lg">Gestion des cookies et traceurs sur Hoardingo</p>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-slate-600" />
              Qu'est-ce qu'un cookie ?
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site internet. 
                Il permet au site de mémoriser des informations sur votre visite (langue, préférences, panier d'achat, etc.) 
                afin de faciliter votre prochaine connexion et de rendre le site plus utile.
              </p>
              <p>
                Sur la plateforme <strong className="text-slate-900">Hoardingo</strong>, nous utilisons différents types de cookies pour améliorer votre expérience utilisateur 
                et analyser la performance de notre site.
              </p>
            </div>
          </section>

          {/* Types de cookies */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Types de cookies utilisés</h2>
            <div className="space-y-6">
              
              {/* Cookies essentiels */}
              <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. Cookies strictement nécessaires (essentiels)</h3>
                <div className="text-slate-700 space-y-2">
                  <p>
                    Ces cookies sont indispensables au bon fonctionnement de la plateforme. Ils permettent l'utilisation des fonctionnalités principales 
                    telles que la navigation sécurisée, l'accès à votre compte client, la gestion du panier d'achat et la validation des commandes.
                  </p>
                  <p className="text-sm mt-3">
                    <strong className="text-slate-900">Durée de conservation :</strong> Session (supprimés à la fermeture du navigateur) ou 12 mois maximum
                  </p>
                  <p className="text-sm">
                    <strong className="text-slate-900">Exemples :</strong> Cookie de session, cookie de panier, cookie d'authentification
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mt-3">
                    ⚠️ Ces cookies ne peuvent pas être refusés car ils sont nécessaires au fonctionnement du site.
                  </p>
                </div>
              </div>

              {/* Cookies fonctionnels */}
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Cookies fonctionnels (préférences)</h3>
                <div className="text-slate-700 space-y-2">
                  <p>
                    Ces cookies permettent de mémoriser vos préférences et choix effectués sur le site (langue, devise, préférences d'affichage) 
                    afin de personnaliser votre expérience utilisateur.
                  </p>
                  <p className="text-sm mt-3">
                    <strong className="text-slate-900">Durée de conservation :</strong> 12 mois maximum
                  </p>
                  <p className="text-sm">
                    <strong className="text-slate-900">Exemples :</strong> Langue préférée, préférences d'affichage, dernières recherches
                  </p>
                  <p className="text-sm text-slate-600 mt-3">
                    ℹ️ Le refus de ces cookies peut limiter certaines fonctionnalités du site.
                  </p>
                </div>
              </div>

              {/* Cookies analytiques */}
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Cookies analytiques (mesure d'audience)</h3>
                <div className="text-slate-700 space-y-2">
                  <p>
                    Ces cookies nous permettent de mesurer le nombre de visiteurs, de comprendre comment les utilisateurs naviguent sur le site 
                    (pages les plus visitées, temps passé, taux de rebond) et d'améliorer la performance et l'ergonomie de la plateforme.
                  </p>
                  <p className="text-sm mt-3">
                    <strong className="text-slate-900">Durée de conservation :</strong> 13 mois maximum
                  </p>
                  <p className="text-sm">
                    <strong className="text-slate-900">Outils utilisés :</strong> Google Analytics (ou équivalent anonymisé)
                  </p>
                  <p className="text-sm">
                    <strong className="text-slate-900">Données collectées :</strong> Pages visitées, durée de visite, source de trafic, type d'appareil (données anonymisées)
                  </p>
                  <p className="text-sm text-slate-600 mt-3">
                    ℹ️ Ces cookies nécessitent votre consentement préalable (sauf si anonymisés).
                  </p>
                </div>
              </div>

              {/* Cookies marketing */}
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3">4. Cookies marketing (publicité ciblée)</h3>
                <div className="text-slate-700 space-y-2">
                  <p>
                    Ces cookies permettent de vous proposer des offres commerciales personnalisées et des publicités adaptées à vos centres d'intérêt, 
                    en fonction de votre navigation sur le site. Ils peuvent également être utilisés pour limiter le nombre de fois où vous voyez une publicité.
                  </p>
                  <p className="text-sm mt-3">
                    <strong className="text-slate-900">Durée de conservation :</strong> 13 mois maximum
                  </p>
                  <p className="text-sm">
                    <strong className="text-slate-900">Outils utilisés :</strong> Google Ads, Facebook Pixel (selon activation)
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mt-3">
                    ⚠️ Ces cookies nécessitent votre consentement préalable et peuvent être refusés.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Gestion des cookies */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-slate-600" />
              Comment gérer vos cookies ?
            </h2>
            <div className="text-slate-700 space-y-4">
              
              <div className="bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-slate-300 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ToggleLeft className="w-5 h-5 text-slate-600" />
                  Bandeau de consentement
                </h3>
                <p className="text-slate-700">
                  Lors de votre première visite sur Hoardingo, un bandeau d'information vous invite à accepter ou refuser les cookies non essentiels. 
                  Vous pouvez modifier vos préférences à tout moment en cliquant sur le bouton « Gérer les cookies » présent en bas de page.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Via les paramètres de votre navigateur</h3>
                <p className="mb-4">
                  Vous pouvez également configurer votre navigateur pour accepter ou refuser les cookies. 
                  Voici les liens pour gérer vos préférences sur les principaux navigateurs :
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong className="text-slate-900">Google Chrome :</strong>{' '}
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" 
                       className="text-slate-700 underline hover:text-slate-900">
                      Gérer les cookies sur Chrome
                    </a>
                  </li>
                  <li>
                    <strong className="text-slate-900">Mozilla Firefox :</strong>{' '}
                    <a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" target="_blank" rel="noopener noreferrer" 
                       className="text-slate-700 underline hover:text-slate-900">
                      Gérer les cookies sur Firefox
                    </a>
                  </li>
                  <li>
                    <strong className="text-slate-900">Safari :</strong>{' '}
                    <a href="https://support.apple.com/fr-fr/HT201265" target="_blank" rel="noopener noreferrer" 
                       className="text-slate-700 underline hover:text-slate-900">
                      Gérer les cookies sur Safari
                    </a>
                  </li>
                  <li>
                    <strong className="text-slate-900">Microsoft Edge :</strong>{' '}
                    <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" 
                       className="text-slate-700 underline hover:text-slate-900">
                      Gérer les cookies sur Edge
                    </a>
                  </li>
                </ul>
                <p className="text-sm text-slate-600 mt-4">
                  ⚠️ Attention : La désactivation de tous les cookies peut empêcher l'utilisation de certaines fonctionnalités du site 
                  (panier d'achat, espace client, etc.).
                </p>
              </div>
            </div>
          </section>

          {/* Opposition au traçage */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Opposition au traçage publicitaire</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Pour s'opposer au traçage publicitaire, vous pouvez utiliser les plateformes de gestion suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-slate-900">Plateforme européenne :</strong>{' '}
                  <a href="https://www.youronlinechoices.com/fr/" target="_blank" rel="noopener noreferrer" 
                     className="text-slate-700 underline hover:text-slate-900">
                    YourOnlineChoices
                  </a>
                </li>
                <li>
                  <strong className="text-slate-900">Google Ads :</strong>{' '}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" 
                     className="text-slate-700 underline hover:text-slate-900">
                    Paramètres de personnalisation des annonces
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* Durée de conservation */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Durée de conservation du consentement</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Votre consentement à l'utilisation de cookies est valable pour une durée de <strong className="text-slate-900">13 mois maximum</strong>, 
                conformément aux recommandations de la CNIL (Commission Nationale de l'Informatique et des Libertés).
              </p>
              <p>
                À l'issue de cette période, votre consentement vous sera de nouveau demandé lors de votre prochaine visite.
              </p>
            </div>
          </section>

          {/* Liens vers autres politiques */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Pour en savoir plus</h2>
            <div className="text-slate-700 space-y-3">
              <p>Pour plus d'informations sur la protection de vos données personnelles :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <Link to="/confidentialite" className="text-slate-700 font-semibold underline hover:text-slate-900">
                    Politique de confidentialité
                  </Link> - Comment nous protégeons vos données personnelles (RGPD)
                </li>
                <li>
                  <Link to="/mentions-legales" className="text-slate-700 font-semibold underline hover:text-slate-900">
                    Mentions légales
                  </Link> - Informations légales sur Urbanize et Hoardingo
                </li>
                <li>
                  <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer" 
                     className="text-slate-700 underline hover:text-slate-900">
                    Site de la CNIL
                  </a> - Comprendre les cookies et traceurs
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Nous contacter</h2>
            <div className="bg-slate-50 p-6 rounded-lg text-slate-700">
              <p>
                Pour toute question relative à notre politique de cookies, vous pouvez nous contacter à :
              </p>
              <p className="font-bold text-slate-900 mt-3">Email : contact@urbanize.fr</p>
              <p className="font-bold text-slate-900">Téléphone : +33 (0)X XX XX XX XX</p>
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
