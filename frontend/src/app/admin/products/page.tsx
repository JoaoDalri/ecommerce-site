import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export default async function AdminProducts() {
  await dbConnect();
  const products = await Product.find({});

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Novo Produto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product._id} className="bg-white p-4 rounded-xl shadow-sm border flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
              {product.images?.[0] ? <img src={product.images[0]} className="h-full w-full object-cover rounded-lg"/> : '📷'}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold truncate">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">R$ {product.price.toFixed(2)}</span>
                <button className="text-red-500 text-sm hover:bg-red-50 p-1 rounded">Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}