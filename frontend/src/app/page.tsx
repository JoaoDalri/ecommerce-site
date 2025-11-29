'use client';

import { useState, useEffect } from 'react';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';

async function fetchProducts() {
  // Use caminho relativo para chamar a API interna
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Falha ao buscar produtos');
  return res.json();
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts().then(data => setProducts(data)).catch(console.error);
  }, []);

  return (
    <main className="pb-20">
      <HeroBanner />

      {/* Seção de Benefícios */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', title: 'Frete Grátis', desc: 'Em compras acima de R$ 200' },
            { icon: '💳', title: 'Parcelamento', desc: 'Até 12x sem juros' },
            { icon: '🛡️', title: 'Compra Segura', desc: 'Proteção total dos dados' },
            { icon: '↩️', title: 'Troca Fácil', desc: '30 dias para devolução' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-white rounded-xl border shadow-sm">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vitrine de Produtos */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            🔥 Destaques da Semana
          </h2>
          <a href="/search" className="text-blue-600 font-semibold hover:underline">Ver tudo →</a>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Carregando vitrine...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onQuickView={(p: any) => setSelectedProduct(p)} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal de Quick View */}
      {selectedProduct && (
        <QuickViewModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </main>
  );
}