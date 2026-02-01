import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 mt-20 border-t-4 border-slate-600">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Section principale */}
        <div className="border-b border-slate-700 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-slate-500">
              © {currentYear} Urbanize. Tous droits réservés.
            </p>

            {/* Liens légaux */}
            <div className="flex flex-wrap gap-6 text-sm justify-center">
              <Link 
                to="/mentions-legales" 
                className="text-slate-400 hover:text-white transition-colors hover:underline"
              >
                Mentions légales
              </Link>
              <Link 
                to="/cgv" 
                className="text-slate-400 hover:text-white transition-colors hover:underline"
              >
                CGV
              </Link>
              <Link 
                to="/confidentialite" 
                className="text-slate-400 hover:text-white transition-colors hover:underline"
              >
                Politique de confidentialité
              </Link>
              <Link 
                to="/cookies" 
                className="text-slate-400 hover:text-white transition-colors hover:underline"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Mention plateforme et juridique */}
        <div className="pt-6">
          <p className="text-xs text-slate-500 text-center leading-relaxed max-w-4xl mx-auto">
            <strong className="text-slate-400">Hoardingo</strong> est une plateforme e-commerce appartenant à la société <strong className="text-slate-400">Urbanize</strong>, 
            spécialisée dans l'habillage urbain et les solutions professionnelles pour le secteur du BTP. 
            Société de droit français soumise à la juridiction du <strong className="text-slate-400">Tribunal de Commerce de Paris</strong>.
          </p>
        </div>
      </div>
    </footer>
  );
}