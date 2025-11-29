'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (sessionId && orderId) {
      // Aqui você poderia chamar uma API para confirmar se o session_id é válido no Stripe
      // Por enquanto, assumimos sucesso e limpamos o carrinho
      clearCart();
      setIsValid(true);
    }
  }, [sessionId, orderId]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-6 animate-bounce">
        ✓
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Pagamento Confirmado!</h1>
      <p className="text-gray-600 mb-8 text-lg max-w-md">
        Seu pedido <b>#{orderId?.slice(-6)}</b> foi recebido com sucesso. Enviamos um email com os detalhes.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/profile/orders" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-lg transition">
          Meus Pedidos
        </Link>
        <Link href="/" className="px-8 py-3 border border-gray-300 rounded-full font-bold hover:bg-gray-50 transition">
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
}