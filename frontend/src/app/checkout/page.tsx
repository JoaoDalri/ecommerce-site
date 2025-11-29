'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, coupon } = useCart();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) return <div className="p-10 text-center">Seu carrinho está vazio.</div>;

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
          couponCode: coupon?.code // Envia o código do cupão
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro: ' + data.error);
        setLoading(false);
      }
    } catch (err) {
      alert('Erro de conexão');
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
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl h-fit border">
          <h3 className="text-lg font-bold mb-4">Resumo</h3>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.title}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          {coupon && (
            <div className="flex justify-between text-green-600 mb-2 text-sm">
              <span>Cupom ({coupon.code})</span>
              <span>-{coupon.discount}%</span>
            </div>
          )}
          
          <div className="border-t pt-4 flex justify-between font-bold text-xl">
            <span>Total a Pagar</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          
          <button 
            form="checkout-form"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Redirecionando...' : 'Pagar com Stripe'}
          </button>
        </div>
      </div>
    </div>
  );
}