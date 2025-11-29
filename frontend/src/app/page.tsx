import { Suspense } from 'react';
import ProductShowcase from '@/components/ProductShowcase';
import { getFilteredProducts } from '@/services/productService';

// Força a página a ser dinâmica para ter sempre produtos novos
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Busca dados reais do MongoDB
  const products = await getFilteredProducts({ sort: 'price_desc' });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner */}
      <section className="bg-blue-600 text-white py-20 px-4 mb-10">
        <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Ofertas Imperdíveis</h1>
            <p className="text-xl opacity-90">Os melhores eletrônicos com os melhores preços.</p>
        </div>
      </section>

      {/* Vitrine */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Destaques</h2>
        </div>

        <Suspense fallback={<div className="text-center p-10">Carregando produtos...</div>}>
           <ProductShowcase products={products} />
        </Suspense>
      </section>
    </main>
  );
}