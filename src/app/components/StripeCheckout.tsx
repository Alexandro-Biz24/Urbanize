import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Loader2 } from 'lucide-react';

// Clé publique Stripe (mode test)
const stripePromise = loadStripe('pk_test_51SnQmhLYbLga2mRIbLAzbfB4PWrTjMLzfZZpMOXtgffseefmQSm8VaS0xuJFdpfRUQD9l82WYwZ66ec5O405uGRP00d4zStIqM');

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  orderDetails: {
    type: string;
    description: string;
  };
}

function CheckoutForm({ amount, onSuccess, onCancel, orderDetails }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Ici, vous devrez créer un Payment Intent côté serveur
      // Pour la démo, on simule un paiement réussi
      
      // const { error } = await stripe.confirmPayment({
      //   elements,
      //   confirmParams: {
      //     return_url: `${window.location.origin}/payment-success`,
      //   },
      // });

      // if (error) {
      //   setErrorMessage(error.message || 'Une erreur est survenue');
      //   setIsProcessing(false);
      // } else {
      //   onSuccess();
      // }

      // Simulation pour la démo
      setTimeout(() => {
        onSuccess();
        setIsProcessing(false);
      }, 2000);
      
    } catch (err) {
      setErrorMessage('Une erreur est survenue lors du paiement');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
        <h3 className="font-semibold mb-2">Récapitulatif</h3>
        <div className="flex justify-between mb-1">
          <span className="text-slate-600">{orderDetails.type}</span>
        </div>
        <p className="text-sm text-slate-600 mb-3">{orderDetails.description}</p>
        <div className="flex justify-between pt-3 border-t border-slate-300">
          <span className="font-bold">Total HT</span>
          <span className="font-bold text-2xl">{amount.toLocaleString('fr-FR')} €</span>
        </div>
      </div>

      {/* Payment Element sera inséré ici par Stripe */}
      <div className="border-2 border-slate-200 rounded-lg p-4">
        <div className="text-center text-slate-600 py-8">
          <p className="mb-2">📝 Formulaire de paiement Stripe</p>
          <p className="text-sm">En production, le formulaire de carte bancaire apparaîtra ici</p>
        </div>
        {/* <PaymentElement /> */}
      </div>

      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-800">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-2"
          disabled={isProcessing}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-black hover:bg-slate-800 text-white"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Traitement...
            </>
          ) : (
            `Payer ${amount.toLocaleString('fr-FR')} €`
          )}
        </Button>
      </div>

      <div className="text-xs text-center text-slate-500">
        <p>🔒 Paiement sécurisé par Stripe</p>
        <p className="mt-1">Vos informations de paiement sont protégées</p>
      </div>
    </form>
  );
}

export function StripeCheckout({ amount, onSuccess, onCancel, orderDetails }: CheckoutFormProps) {
  return (
    <Card className="border-2 border-slate-200 shadow-lg">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">Paiement sécurisé</h2>
        
        {/* En production, décommenter cette ligne et commenter le CheckoutForm ci-dessous */}
        {/* <Elements stripe={stripePromise}>
          <CheckoutForm 
            amount={amount} 
            onSuccess={onSuccess} 
            onCancel={onCancel}
            orderDetails={orderDetails}
          />
        </Elements> */}
        
        {/* Version démo sans Stripe réel */}
        <CheckoutForm 
          amount={amount} 
          onSuccess={onSuccess} 
          onCancel={onCancel}
          orderDetails={orderDetails}
        />
      </CardContent>
    </Card>
  );
}