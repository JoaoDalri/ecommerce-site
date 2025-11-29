'use client';
import { useEffect, useState, use } from 'react';
import { useCart } from '@/context/CartContext';
import Reviews from '@/components/Reviews';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products?id=${id}`)
      .then(res => res.json())
      .then(data => {
         if(Array.isArray(data)) {
            setProduct(data.find((p: any) => p._id === id));
         } else {
            setProduct(data);
         }
      });
  }, [id]);

  if (!product) return <div className="p-10 text-center">Carregando...</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-2xl shadow-sm flex items-center justify-center min-h-[400px]">
           {product.images?.[0] ? (
             <img src={product.images[0]} className="max-h-full max-w-full object-contain" alt={product.title} />
           ) : (
             <span className="text-6xl">📦</span>
           )}
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500 text-xl">★</span>
            <span className="font-bold">{product.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-gray-400 text-sm">({product.numReviews || 0} avaliações)</span>
          </div>

          <p className="text-gray-600 text-lg mb-6">{product.description || 'Sem descrição'}</p>
          
          <div className="text-3xl font-bold text-blue-600 mb-8">
            R$ {product.price?.toFixed(2) || '0.00'}
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>

      {/* Seção de Reviews */}
      <Reviews product={product} />
    </div>
  );
}