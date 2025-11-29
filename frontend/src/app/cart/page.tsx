'use client'
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, total } = useCart();

  if (items.length === 0) return (
    <div className="container mx-auto py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
      <Link href="/" className="text-blue-600 underline">Voltar as compras</Link>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Meu Carrinho</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-6 border-b last:border-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">📦</div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-gray-500">Qtd: {item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">Remover</button>
            </div>
          </div>
        ))}
        <div className="p-6 bg-gray-50 flex justify-between items-center">
          <span className="text-xl">Total</span>
          <span className="text-2xl font-bold text-blue-600">R$ {total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-6 text-right">
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700">
          Finalizar Compra (Checkout)
        </button>
      </div>
    </div>
  );
}