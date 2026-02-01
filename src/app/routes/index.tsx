import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { TotemCalculatorPage } from '../pages/TotemCalculatorPage';
import { TotemResultsPage } from '../pages/TotemResultsPage';
import { PalissadeSubTypePage } from '../pages/PalissadeSubTypePage';
import { PalissadeHabillagePage } from '../pages/PalissadeHabillagePage';
import { PalissadeMontagePage } from '../pages/PalissadeMontagePage';
import { PalissadeResultsPage } from '../pages/PalissadeResultsPage';
import { MassifCalculatorPage } from '../pages/MassifCalculatorPage';
import { MassifResultsPage } from '../pages/MassifResultsPage';
import { BETCalculatorPage } from '../pages/BETCalculatorPage';
import { BETResultsPage } from '../pages/BETResultsPage';
import { LoginPage } from '../pages/LoginPage';
import { CartPage } from '../pages/CartPage';
import { MentionsLegalesPage } from '../pages/MentionsLegalesPage';
import { CGVPage } from '../pages/CGVPage';
import { ConfidentialitePage } from '../pages/ConfidentialitePage';
import { CookiesPage } from '../pages/CookiesPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Page d'accueil - Sélection du domaine */}
      <Route path="/" element={<HomePage />} />
      
      {/* Routes Totem */}
      <Route path="/totem" element={<TotemCalculatorPage />} />
      <Route path="/totem/resultats" element={<TotemResultsPage />} />
      
      {/* Routes Palissade */}
      <Route path="/palissade" element={<PalissadeSubTypePage />} />
      <Route path="/palissade/habillage" element={<PalissadeHabillagePage />} />
      <Route path="/palissade/montage" element={<PalissadeMontagePage />} />
      <Route path="/palissade/resultats" element={<PalissadeResultsPage />} />
      
      {/* Routes Massif */}
      <Route path="/massif" element={<MassifCalculatorPage />} />
      <Route path="/massif/resultats" element={<MassifResultsPage />} />
      
      {/* Routes BET */}
      <Route path="/bet" element={<BETCalculatorPage />} />
      <Route path="/bet/resultats" element={<BETResultsPage />} />
      
      {/* Route Panier */}
      <Route path="/panier" element={<CartPage />} />

      {/* Routes légales */}
      <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
      <Route path="/cgv" element={<CGVPage />} />
      <Route path="/confidentialite" element={<ConfidentialitePage />} />
      <Route path="/cookies" element={<CookiesPage />} />
    </Routes>
  );
}