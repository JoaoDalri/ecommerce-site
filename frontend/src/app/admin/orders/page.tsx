// Server Component
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export default async function AdminOrders() {
  // Configuração para garantir que o Server Component busca dados frescos
  const orders = await getOrdersData();
  
  // NOTE: A VERIFICAÇÃO DE ROLE DE ADMIN DEVE OCORRER NO MIDDLEWARE.TS E NO LAYOUT (FEITO NO PASSO 14/2).
  // Se o usuário chegar aqui, ele já está logado e foi verificado no layout.

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestão de Pedidos</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order: any) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-sm text-gray-500">...{order._id.toString().slice(-6)}</td>
                <td className="p-4">{order.user?.name || 'Visitante'}</td>
                <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 font-bold">R$ {order.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline text-sm">Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="p-8 text-center text-gray-500">Nenhum pedido encontrado.</div>}
      </div>
    </div>
  );
}

// Função de Server Data Fetching, garantindo que não usa cache estático do build (SSR/ISR)
async function getOrdersData() {
    await dbConnect();
    // Revalidação manual (Next.js 14+)
    const { revalidatePath } = require('next/cache');
    revalidatePath('/admin/orders'); 
    
    // Configuração de cache no fetch nativo (fetch(..., { cache: 'no-store' })) seria uma alternativa
    
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email').lean();

    // Mongoose retorna ObjectIds. Convertemos para string para evitar erros de serialização em Server Components
    return JSON.parse(JSON.stringify(orders));
}