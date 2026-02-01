import { Building2, MapPin, Mail, Phone, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MentionsLegalesPage() {
  return (
    <div className="pt-24 pb-20 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Mentions Légales</h1>
          <p className="text-slate-200 text-lg">Informations légales relatives à la plateforme Hoardingo</p>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Éditeur du site */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-slate-600" />
              Éditeur du site
            </h2>
            <div className="space-y-3 text-slate-700">
              <p><strong className="text-slate-900">Raison sociale :</strong> Urbanize</p>
              <p><strong className="text-slate-900">Forme juridique :</strong> Société [à compléter]</p>
              <p><strong className="text-slate-900">Capital social :</strong> [à compléter] €</p>
              <p><strong className="text-slate-900">SIRET :</strong> XXX XXX XXX XXXXX</p>
              <p><strong className="text-slate-900">N° TVA Intracommunautaire :</strong> FRXX XXXXXXXXX</p>
              <p><strong className="text-slate-900">RCS :</strong> Paris [numéro à compléter]</p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-slate-500 shrink-0" />
                <span><strong className="text-slate-900">Siège social :</strong> [Adresse complète], Paris, France</span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 text-slate-500 shrink-0" />
                <span><strong className="text-slate-900">Email :</strong> contact@urbanize.fr</span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-slate-500 shrink-0" />
                <span><strong className="text-slate-900">Téléphone :</strong> +33 (0)X XX XX XX XX</span>
              </p>
            </div>
          </section>

          {/* Directeur de la publication */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Directeur de la publication</h2>
            <p className="text-slate-700">
              <strong className="text-slate-900">Nom :</strong> [Nom du directeur de la publication]<br />
              <strong className="text-slate-900">Qualité :</strong> [Président / Directeur Général]
            </p>
          </section>

          {/* Hébergement */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Hébergement</h2>
            <div className="text-slate-700 space-y-2">
              <p><strong className="text-slate-900">Hébergeur :</strong> [Nom de l'hébergeur]</p>
              <p><strong className="text-slate-900">Adresse :</strong> [Adresse complète de l'hébergeur]</p>
              <p><strong className="text-slate-900">Téléphone :</strong> [Numéro de téléphone]</p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Propriété intellectuelle</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                L'ensemble des contenus présents sur la plateforme Hoardingo (textes, images, graphismes, logos, icônes, sons, logiciels, etc.) 
                est la propriété exclusive de la société Urbanize ou de ses partenaires.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, 
                quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Urbanize.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme 
                constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation de responsabilité</h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Urbanize s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur la plateforme Hoardingo, 
                dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
              </p>
              <p>
                Toutefois, Urbanize ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
              <p>
                En conséquence, Urbanize décline toute responsabilité pour toute inexactitude, erreur ou omission portant sur des informations 
                disponibles sur la plateforme.
              </p>
            </div>
          </section>

          {/* Tribunal compétent */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-slate-600" />
              Tribunal compétent
            </h2>
            <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded-r-lg">
              <p className="text-slate-700 leading-relaxed">
                Les présentes mentions légales sont régies par le droit français. 
                En cas de litige et à défaut de règlement amiable, <strong className="text-slate-900">compétence exclusive est attribuée 
                au Tribunal de Commerce de Paris</strong>, nonobstant pluralité de défendeurs ou appel en garantie, 
                même pour les procédures d'urgence ou les procédures conservatoires en référé ou par requête.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Nous contacter</h2>
            <p className="text-slate-700 mb-4">
              Pour toute question relative aux mentions légales ou à l'utilisation de la plateforme Hoardingo, 
              vous pouvez nous contacter :
            </p>
            <div className="bg-slate-50 p-6 rounded-lg space-y-2 text-slate-700">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <strong className="text-slate-900">Email :</strong> contact@urbanize.fr
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <strong className="text-slate-900">Téléphone :</strong> +33 (0)X XX XX XX XX
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
