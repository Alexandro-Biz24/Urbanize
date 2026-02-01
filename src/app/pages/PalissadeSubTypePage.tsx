import { useNavigate } from 'react-router-dom';
import { PalissadeSubTypeSelector } from '../components/PalissadeSubTypeSelector';

export function PalissadeSubTypePage() {
  const navigate = useNavigate();

  const handleSelect = (type: 'habillage' | 'montage') => {
    navigate(`/palissade/${type}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <PalissadeSubTypeSelector onSelect={handleSelect} onBack={handleBack} />
      
      {/* Materials Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Matériaux fréquemment utilisés</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img src="/assets/palissade_taule.png" alt="Dibond" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Dibond imprimé</h3>
                <p className="text-slate-600">Panneau composite haute qualité, résistant et durable</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img src="/assets/info.png" alt="Tôle" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Tôle ondulée</h3>
                <p className="text-slate-600">Solution métallique robuste et économique</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img src="/assets/bois.png" alt="Bois" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Bois & Végétal synthétique</h3>
                <p className="text-slate-600">Aspect naturel et chaleureux pour vos projets</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}