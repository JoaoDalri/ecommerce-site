'use client';

import { useCart } from '@/context/CartContext';

export default function QuickViewModal({ product, onClose }: { product: any, onClose: () => void }) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden grid md:grid-cols-2 relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10">
          ✕
        </button>

        <div className="bg-gray-100 flex items-center justify-center h-64 md:h-auto p-8">
          <img 
            src={product.images?.[0] || '/placeholder.png'} 
            alt={product.title} 
            className="max-h-full max-w-full object-contain mix-blend-multiply" 
          />
        </div>

        <div className="p-8 flex flex-col">
          <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400">★★★★☆</span>
            <span className="text-gray-400 text-sm">(42 avaliações)</span>
          </div>
          
          <div className="text-3xl font-bold text-blue-600 mb-6">
            R$ {product.price.toFixed(2)}
          </div>

          <p className="text-gray-600 mb-6 flex-1">{product.description}</p>

          <div className="flex gap-3 mt-auto">
            <button 
              onClick={() => { addToCart(product); onClose(); }}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Adicionar ao Carrinho
            </button>
            <button className="px-4 border rounded-lg hover:bg-gray-50">♥</button>
          </div>
        </div>
      </div>
    </div>
  );
}