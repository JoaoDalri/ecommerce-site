'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Image from 'next/image'; // NOVO

interface ProductCardProps {
  product: any;
  onQuickView: (product: any) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-xl border hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {product.oldPrice && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          -20%
        </span>
      )}

      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-10 translate-x-4 group-hover:translate-x-0">
        <button 
          onClick={() => onQuickView(product)}
          className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 text-gray-600" 
          title="Visualização Rápida"
        >
          👁️
        </button>
        <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 text-gray-600" title="Favoritos">
          ♥
        </button>
      </div>

      <Link href={`/product/${product._id}`}>
        {/* NOVO: Container para a imagem otimizada */}
        <div className="h-60 bg-gray-50 flex items-center justify-center p-6 relative">
          {product.images?.[0] ? (
            <Image 
              src={product.images[0]} 
              alt={product.title} 
              fill // Preenche o container
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" 
            />
          ) : (
             <span className="text-gray-400">Sem Imagem</span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <Link href={`/product/${product._id}`}>
          <h3 className="font-bold text-gray-800 truncate hover:text-blue-600 mb-2">{product.title}</h3>
        </Link>
        
        <div className="flex items-end justify-between mt-2">
          <div>
            {product.oldPrice && <span className="text-sm text-gray-400 line-through">R$ {product.oldPrice}</span>}
            <div className="text-lg font-bold text-blue-600">R$ {product.price.toFixed(2)}</div>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            + 🛒
          </button>
        </div>
      </div>
    </div>
  );
}