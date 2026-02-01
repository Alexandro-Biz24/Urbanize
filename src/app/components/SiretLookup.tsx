import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Loader2, Building2 } from 'lucide-react';
import { Card } from './ui/card';

interface CompanyResult {
  siren: string;
  nom_complet: string;
  nom_raison_sociale: string;
  siege: {
    siret: string;
    numero_voie: string;
    type_voie: string;
    libelle_voie: string;
    code_postal: string;
    libelle_commune: string;
  };
}

interface SiretLookupProps {
  onSelect: (company: { name: string; address: any; siret: string }) => void;
}

export function SiretLookup({ onSelect }: SiretLookupProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchCompanies = async () => {
    if (query.length < 3) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(query)}&per_page=5`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Erreur recherche entreprise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (company: CompanyResult) => {
    const address = {
      street: `${company.siege.numero_voie || ''} ${company.siege.type_voie || ''} ${company.siege.libelle_voie || ''}`.trim(),
      postalCode: company.siege.code_postal,
      city: company.siege.libelle_commune,
      country: 'France'
    };

    onSelect({
      name: company.nom_complet,
      siret: company.siege.siret,
      address
    });
    
    setQuery(company.nom_complet);
    setShowResults(false);
  };

  return (
    <div className="relative mb-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length < 3) setShowResults(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && searchCompanies()}
            placeholder="Rechercher par nom ou SIRET..."
            className="pl-9 bg-white border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>
        <Button 
          onClick={searchCompanies}
          disabled={isLoading || query.length < 3}
          className="bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-200"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Rechercher'}
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 border-2 border-slate-200 shadow-xl max-h-60 overflow-y-auto bg-white">
          <div className="p-1">
            {results.map((company) => (
              <button
                key={company.siren}
                onClick={() => handleSelect(company)}
                className="w-full text-left p-3 hover:bg-slate-50 rounded-md transition-colors flex items-start gap-3 border-b last:border-0 border-slate-100"
              >
                <Building2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm">{company.nom_complet}</div>
                  <div className="text-xs text-slate-500">
                    SIRET: {company.siege.siret}
                  </div>
                  <div className="text-xs text-slate-500">
                    {company.siege.code_postal} {company.siege.libelle_commune}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
      
      {showResults && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 p-4 bg-white border-2 border-slate-200 rounded-lg shadow-xl text-center text-sm text-slate-500">
          Aucune entreprise trouvée
        </div>
      )}
    </div>
  );
}
