import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b-2 border-slate-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-md border-2 border-slate-500">
              <Building2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight text-slate-900">Hoardingo</h1>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link 
              to="/login-client"
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Espace Client
            </Link>
            <Link 
              to="/login-partenaire"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors shadow-md"
            >
              Espace Partenaire
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}