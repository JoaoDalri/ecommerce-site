'use client'
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeFromCart, subtotal, total, coupon, applyCoupon } = useCart();
  const router = useRouter();
  const [couponInput, setCouponInput] = useState('');
  const [message, setMessage] = useState('');

  async function handleApplyCoupon() {
    if (!couponInput) return;
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: couponInput })
    });
    const data = await res.json();
    
    if (res.ok) {
      applyCoupon(data.code, data.discount);
      setMessage(`Cupom ${data.code} aplicado: -${data.discount}%`);
    } else {
      setMessage(data.error);
    }
  }

  if (items.length === 0) return (
    <div className="container mx-auto py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
      <Link href="/" className="text-blue-600 underline">Voltar as compras</Link>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Meu Carrinho</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-xl shadow overflow-hidden h-fit">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-6 border-b last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : '📦'}
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-gray-500">Qtd: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Remover</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl h-fit border">
          <h3 className="font-bold text-lg mb-4">Resumo</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          
          {coupon && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Desconto ({coupon.code})</span>
              <span>- {coupon.discount}%</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-xl border-t pt-4 mt-2">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          {/* Área de Cupão */}
          <div className="mt-6 mb-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Cupom de desconto" 
                className="border p-2 rounded w-full uppercase"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
              />
              <button onClick={handleApplyCoupon} className="bg-gray-800 text-white px-4 rounded">OK</button>
            </div>
            {message && <p className="text-xs mt-2 text-blue-600">{message}</p>}
          </div>

          <button 
            onClick={() => router.push('/checkout')}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}