'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">
        ✓
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagamento Confirmado!</h1>
      <p className="text-gray-600 mb-8">Obrigado pela sua compra. O seu pedido #{orderId?.slice(-6)} está a ser processado.</p>
      
      <div className="flex gap-4">
        <Link href="/profile/orders" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Acompanhar Pedido
        </Link>
        <Link href="/" className="px-6 py-2 border rounded-lg hover:bg-gray-50">
          Voltar à Loja
        </Link>
      </div>
    </div>
  );
}