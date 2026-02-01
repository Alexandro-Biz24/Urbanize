import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Construction, ArrowLeft, Loader2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler une connexion
    setTimeout(() => {
      setLoading(false);
      alert('Cette fonctionnalité n\'est pas encore disponible dans cette démo.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-black transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour à l'accueil
      </Link>

      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-black rounded mx-auto flex items-center justify-center mb-4">
          <Construction className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Hoardingo</h1>
      </div>

      <Card className="w-full max-w-md border-2 border-slate-200 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Accédez à votre espace sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nom@entreprise.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-black hover:bg-slate-800" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-sm text-slate-600">
          <a href="#" className="hover:underline">Mot de passe oublié ?</a>
          <div className="pt-4 border-t w-full">
             Pas encore de compte ? <a href="#" className="font-semibold text-black hover:underline">Créer un compte</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
