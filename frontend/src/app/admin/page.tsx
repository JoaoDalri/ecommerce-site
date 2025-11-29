import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

async function getStats() {
  await dbConnect();
  // Busca otimizada usando lean()
  const totalOrders = await Order.countDocuments().lean();
  const totalProducts = await Product.countDocuments().lean();
  const totalUsers = await User.countDocuments().lean();
  
  const salesData = await Order.aggregate([
    { $match: { isPaid: true } }, // Apenas vendas pagas
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  const totalSales = salesData[0]?.total || 0;

  return { totalOrders, totalProducts, totalUsers, totalSales };
}

export default async function AdminDashboard() {
  // Dados buscados no Server Component (Otimizado)
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel de Controle</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Vendas Totais</h3>
          <p className="text-3xl font-bold text-green-600">R$ {stats.totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pedidos</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Produtos</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Clientes</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4">Atividade Recente</h2>
        <p className="text-gray-500">Apenas os pedidos pagos entram no cálculo de Vendas Totais.</p>
      </div>
    </div>
  );
}