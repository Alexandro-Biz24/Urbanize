import { HardHat, Truck, Shield, Award, Package, Wrench } from 'lucide-react';
import { ProjectTypeSelector } from '../components/ProjectTypeSelector';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  const handleDomainSelect = (selectedDomain: 'totem' | 'palissade' | 'massif' | 'bet') => {
    navigate(`/${selectedDomain}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-slate-100 via-white to-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight text-slate-900">
            Hoardingo
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-700 font-medium mb-4 max-w-3xl mx-auto">
            Votre plateforme dédiée à <span className="text-slate-700 font-bold">l'habillage urbain</span>
          </p>
          
          <p className="text-base text-slate-600 mb-12 max-w-2xl mx-auto">
            Estimation instantanée • Achat en ligne sécurisé
          </p>
          
          {/* Distinguo Prestations de service vs Produits */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">Prestations de service</h3>
              <p className="text-sm text-slate-600 mb-3">Solutions professionnelles avec accompagnement</p>
              <ul className="text-sm text-slate-700 space-y-1 text-left">
                <li>• <strong>Palissade</strong> : Habillage et installation</li>
                <li>• <strong>Étude BET</strong> : Résistance au vent et glissement</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">Produits</h3>
              <p className="text-sm text-slate-600 mb-3">Commercialisation d'équipements urbains prêts à l'emploi</p>
              <ul className="text-sm text-slate-700 space-y-1 text-left">
                <li>• <strong>Totem</strong> : Signalétique verticale</li>
                <li>• <strong>Massif béton</strong> : Lestage et stabilisation</li>
              </ul>
            </div>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md border-2 border-slate-200">
              <Shield className="w-5 h-5 text-slate-600" />
              <span className="font-bold text-slate-800 text-sm">Paiement 100% sécurisé</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md border-2 border-slate-200">
              <Award className="w-5 h-5 text-slate-600" />
              <span className="font-bold text-slate-800 text-sm">+20 ans d'expertise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Type Selection */}
      <section className="pb-20 px-6 bg-slate-50">
        <ProjectTypeSelector onSelect={handleDomainSelect} />
      </section>
    </>
  );
}