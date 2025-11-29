'use client'
import { useState } from 'react';
import { useCart, ShippingOption } from '@/context/CartContext'; // Importar ShippingOption
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeFromCart, subtotal, total, coupon, applyCoupon, shipping, setShipping, discountValue } = useCart();
  const router = useRouter();
  const [couponInput, setCouponInput] = useState('');
  const [message, setMessage] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [calcLoading, setCalcLoading] = useState(false);

  async function handleApplyCoupon() {
    if (!couponInput) return;
    const res = await fetch('/api/coupons/validate', {
      method: 'POST', body: JSON.stringify({ code: couponInput })
    });
    const data = await res.json();
    
    if (res.ok) {
      applyCoupon(data.code, data.discount);
      setMessage(`Cupom ${data.code} aplicado: -${data.discount}%`);
    } else {
      setMessage(data.error);
      applyCoupon('', 0);
    }
  }

  async function handleCalculateShipping() {
    if (!zipCode || items.length === 0) return;
    setCalcLoading(true);
    
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartTotal: subtotal - discountValue, zipCode })
      });
      
      const data = await res.json();
      if (res.ok) {
        setShippingOptions(data);
        setShipping(data[0]); // Seleciona a primeira opção por defeito
      } else {
        alert('Erro ao calcular frete: ' + data.error);
        setShippingOptions([]);
      }
    } catch (e) {
      alert('Erro de conexão ao calcular frete');
    } finally {
      setCalcLoading(false);
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
        {/* Coluna Principal: Itens e Cupom/Frete */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Lista de Itens */}
          <div className="bg-white rounded-xl shadow overflow-hidden h-fit border">
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

          {/* Cálculo de Frete */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold mb-3">🚚 Calcular Frete e Prazo</h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Seu CEP (apenas números)" 
                className="border p-2 rounded w-full"
                value={zipCode}
                onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))}
                maxLength={8}
              />
              <button 
                onClick={handleCalculateShipping}
                disabled={calcLoading}
                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {calcLoading ? 'Aguarde...' : 'Calcular'}
              </button>
            </div>
            
            {shippingOptions.length > 0 && (
              <div className="space-y-3 pt-2 border-t">
                {shippingOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={shipping?.id === option.id}
                      onChange={() => setShipping(option)}
                      className="form-radio text-blue-600"
                    />
                    <span className="font-medium">{option.name}</span>
                    <span className="text-sm text-gray-500">({option.deliveryTime})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Lateral: Resumo e Cupão */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit border">
          <h3 className="font-bold text-lg mb-4">Resumo</h3>
          
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal (Itens)</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-green-600">
                <span>Desconto ({coupon.code})</span>
                <span>- R$ {discountValue.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Frete</span>
              <span>{shipping?.cost === 0 ? 'Grátis' : shipping ? `R$ ${shipping.cost.toFixed(2)}` : 'R$ 0.00'}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-xl border-t pt-4 mt-2">
            <span>Total</span>
            <span className="text-blue-600">R$ {total.toFixed(2)}</span>
          </div>

          {/* Área de Cupão */}
          <div className="mt-6 mb-4">
            <h3 className="font-bold mb-2 text-sm">Aplicar Cupom</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Código" 
                className="border p-2 rounded w-full uppercase"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
              />
              <button onClick={handleApplyCoupon} className="bg-gray-800 text-white px-4 rounded hover:bg-gray-700">OK</button>
            </div>
            {message && <p className={`text-xs mt-2 ${coupon ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
          </div>

          <button 
            onClick={() => router.push('/checkout')}
            disabled={items.length === 0 || !shipping}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg disabled:opacity-50"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}