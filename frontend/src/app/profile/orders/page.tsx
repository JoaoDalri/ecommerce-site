'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/user/orders')
      .then(res => res.json())
      .then(setOrders);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Meus Pedidos</h2>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
           <p className="text-gray-500">Você ainda não fez pedidos.</p>
        ) : (
          orders.map((order: any) => (
            <Link href={`/profile/orders/${order._id}`} key={order._id}>
              <div className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer">
                <div>
                  <p className="font-bold text-gray-800">Pedido #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-500">{order.date} • {order.items} itens</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    order.status === 'Entregue' ? 'bg-green-100 text-green-600' : 
                    order.status === 'Cancelado' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.status}
                  </span>
                  <p className="font-bold mt-2">R$ {order.total.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}