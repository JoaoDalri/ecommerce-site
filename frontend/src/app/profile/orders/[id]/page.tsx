'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import OrderTimeline from '@/components/OrderTimeline';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/user/orders/${id}`)
      .then(res => res.json())
      .then(setOrder)
      .catch(console.error);
  }, [id]);

  if (!order) return <div className="p-10 text-center">Carregando detalhes do pedido...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Pedido #{order._id.slice(-6)}</h1>
      <p className="text-sm text-gray-500 mb-6">Realizado em: {new Date(order.createdAt).toLocaleDateString()}</p>

      {/* Timeline de Status */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
        <h2 className="font-bold mb-4">Acompanhamento</h2>
        <OrderTimeline status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Itens do Pedido */}
        <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Itens</h2>
            {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                            <p className="font-semibold">{item.product.title || 'Produto Indisponível'}</p>
                            <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                        </div>
                    </div>
                    <span className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
        </div>

        {/* Resumo e Endereço */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold mb-3">Resumo Financeiro</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>R$ {order.total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Frete</span><span>R$ {order.shippingPrice?.toFixed(2) || '0.00'}</span></div>
              <div className="flex justify-between pt-2 border-t mt-2 font-bold text-lg">
                <span>Total</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold mb-3">Endereço de Entrega</h3>
            <p className="text-sm text-gray-600">Rua: {order.shippingAddress?.street}</p>
            <p className="text-sm text-gray-600">Cidade: {order.shippingAddress?.city} - CEP: {order.shippingAddress?.zip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}