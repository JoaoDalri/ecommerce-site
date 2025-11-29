'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';

interface ProductShowcaseProps {
  products: any[];
}

export default function ProductShowcase({ products }: ProductShowcaseProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  if (products.length === 0) {
    return <div className="text-center py-20 text-gray-400">Nenhum produto encontrado.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onQuickView={(p) => setSelectedProduct(p)} 
          />
        ))}
      </div>

      {selectedProduct && (
        <QuickViewModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}