'use client';
import { useEffect, useState } from 'react';

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
            <div key={order._id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition">
              <div>
                <p className="font-bold text-gray-800">Pedido #{order._id}</p>
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
          ))
        )}
      </div>
    </div>
  );
}