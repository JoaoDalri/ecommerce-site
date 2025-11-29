'use client';
import { useState } from 'react';
import { useCart, ShippingOption } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeFromCart, subtotal, total, coupon, applyCoupon, shipping, setShipping, discountValue } = useCart();
  const router = useRouter();
  
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  
  const [zipCode, setZipCode] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [calcLoading, setCalcLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  // Função para aplicar Cupom
  async function handleApplyCoupon() {
    if (!couponInput) return;
    const res = await fetch('/api/coupons/validate', {
      method: 'POST', body: JSON.stringify({ code: couponInput })
    });
    const data = await res.json();
    
    if (res.ok) {
      applyCoupon(data.code, data.discount);
      setCouponMsg(`Desconto aplicado: -${data.discount}%`);
    } else {
      setCouponMsg(data.error || 'Cupom inválido');
      applyCoupon('', 0);
    }
  }

  // Função para calcular Frete
  async function handleCalculateShipping() {
    const cleanCep = zipCode.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
        setCepError('Digite um CEP válido (8 números)');
        return;
    }
    
    setCepError('');
    setCalcLoading(true);
    
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartTotal: subtotal - discountValue, zipCode: cleanCep })
      });
      
      const data = await res.json();
      if (res.ok) {
        setShippingOptions(data);
        // Seleciona automaticamente a primeira opção se nenhuma estiver selecionada
        if (!shipping) setShipping(data[0]);
      } else {
        setCepError(data.error || 'Erro ao calcular');
        setShippingOptions([]);
      }
    } catch (e) {
      setCepError('Erro de conexão');
    } finally {
      setCalcLoading(false);
    }
  }

  if (items.length === 0) return (
    <div className="container mx-auto py-20 text-center px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Seu carrinho está vazio 🛒</h2>
      <p className="text-gray-500 mb-8">Adicione produtos para começar.</p>
      <Link href="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
        Voltar às compras
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Meu Carrinho ({items.length})</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 p-6 border-b last:border-0 hover:bg-gray-50 transition">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                  <Image 
                    src={item.image || '/placeholder.png'} 
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <span className="font-bold text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Qtd: {item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="text-red-500 text-sm hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    🗑️ Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Calculadora de Frete */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              🚚 Calcular Entrega
            </h3>
            <div className="flex gap-3 mb-2">
              <input 
                type="text" 
                placeholder="Digite seu CEP" 
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
                maxLength={9}
              />
              <button 
                onClick={handleCalculateShipping}
                disabled={calcLoading}
                className="bg-gray-800 text-white px-6 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-70 transition"
              >
                {calcLoading ? '...' : 'Calcular'}
              </button>
            </div>
            {cepError && <p className="text-red-500 text-sm mb-4">{cepError}</p>}
            
            {shippingOptions.length > 0 && (
              <div className="space-y-3 mt-4 animate-fadeIn">
                <p className="text-sm text-gray-500">Opções para o CEP {zipCode}:</p>
                {shippingOptions.map((option) => (
                  <label key={option.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                    shipping?.id === option.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={shipping?.id === option.id}
                        onChange={() => setShipping(option)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{option.name}</div>
                        <div className="text-xs text-gray-500">{option.deliveryTime}</div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-800">
                        {option.cost === 0 ? <span className="text-green-600">Grátis</span> : `R$ ${option.cost.toFixed(2)}`}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div className="bg-gray-50 p-6 rounded-xl border h-fit sticky top-24">
          <h3 className="font-bold text-xl text-gray-800 mb-6">Resumo</h3>
          
          <div className="space-y-3 text-sm text-gray-600 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            
            {/* Linha de Desconto */}
            {coupon ? (
              <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded">
                <span>Cupom ({coupon.code})</span>
                <span>- R$ {discountValue.toFixed(2)}</span>
              </div>
            ) : (
               <div className="flex gap-2 mt-2">
                 <input 
                   placeholder="Cupom" 
                   className="border p-2 rounded w-full text-xs uppercase"
                   value={couponInput}
                   onChange={e => setCouponInput(e.target.value)}
                 />
                 <button onClick={handleApplyCoupon} className="text-xs bg-white border px-3 rounded font-bold hover:bg-gray-100">OK</button>
               </div>
            )}
            {couponMsg && <p className="text-xs text-blue-600">{couponMsg}</p>}

            <div className="flex justify-between items-center">
              <span>Frete</span>
              {shipping ? (
                <span className="font-medium">{shipping.cost === 0 ? 'Grátis' : `R$ ${shipping.cost.toFixed(2)}`}</span>
              ) : (
                <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded">Calcule o CEP</span>
              )}
            </div>
          </div>

          <div className="flex justify-between font-bold text-2xl text-gray-900 mb-8">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          <button 
            onClick={() => router.push('/checkout')}
            disabled={!shipping} // Bloqueia se não houver frete selecionado
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {!shipping ? 'Selecione o Frete' : 'Finalizar Compra →'}
          </button>
          
          {!shipping && (
            <p className="text-xs text-center text-gray-500 mt-3">
              * O cálculo do frete é obrigatório para continuar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}