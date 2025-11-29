'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, subtotal, coupon, shipping, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  if (items.length === 0 || !shipping) return <div className="p-10 text-center">Carrinho vazio ou Frete não selecionado. Por favor, volte ao carrinho.</div>;

  async function handleStripeCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const shippingAddress = {
      street: formData.get('street'),
      city: formData.get('city'),
      zip: formData.get('zip'),
    };

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          user, 
          shippingAddress,
          couponCode: coupon?.code,
          shippingOption: shipping, // ENVIANDO Frete
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        // clearCart(); // Limpar carrinho apenas após sucesso no webhook (futuro passo)
        window.location.href = data.url;
      } else {
        alert('Erro ao iniciar pagamento: ' + data.error);
      }
    } catch (err) {
      alert('Erro de conexão no pagamento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form id="checkout-form" onSubmit={handleStripeCheckout} className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
            <h2 className="text-xl font-semibold">📍 Endereço de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="street" required placeholder="Rua e Número" className="border p-3 rounded w-full md:col-span-2" />
              <input name="city" required placeholder="Cidade" className="border p-3 rounded w-full" />
              <input name="zip" required placeholder="Código Postal" className="border p-3 rounded w-full" />
            </div>

            <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
              ℹ️ Você será redirecionado para o ambiente seguro do Stripe para concluir o pagamento.
            </div>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl h-fit border">
          <h3 className="text-lg font-bold mb-4">Resumo do Pedido</h3>
          <div className="space-y-2 mb-4 text-sm">
            {items.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.quantity}x {item.title}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {coupon && <div className="flex justify-between text-green-600"><span>Desconto ({coupon.code})</span><span>- R$ {(subtotal - total + shipping!.cost).toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold">
              <span>Frete ({shipping.name.split(' ')[0]})</span>
              <span>{shipping.cost === 0 ? 'GRÁTIS' : `R$ ${shipping.cost.toFixed(2)}`}</span>
            </div>
          </div>
          
          <div className="border-t pt-4 flex justify-between font-bold text-xl">
            <span>Total Final</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          
          <button 
            form="checkout-form"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Redirecionando...' : 'Pagar Agora'}
          </button>
        </div>
      </div>
    </div>
  );
}