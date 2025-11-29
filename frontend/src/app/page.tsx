import { Suspense } from 'react';
import HeroBanner from '@/components/HeroBanner';
import ProductShowcase from '@/components/ProductShowcase';
import { getFilteredProducts } from '@/services/productService';

export const dynamic = 'force-dynamic'; // Garante que a home não fica cacheada estaticamente com dados velhos

export const metadata = {
  title: 'LojaPro | As Melhores Ofertas',
  description: 'E-commerce completo com Next.js 15',
};

async function getProducts() {
  const products = await getFilteredProducts({ sort: 'price_desc' });
  return products || [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="pb-20">
      <HeroBanner />

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', title: 'Frete Grátis', desc: 'Acima de R$ 200' },
            { icon: '💳', title: 'Parcelamento', desc: 'Até 12x sem juros' },
            { icon: '🛡️', title: 'Compra Segura', desc: 'Certificado SSL' },
            { icon: '↩️', title: 'Troca Fácil', desc: '30 dias grátis' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            🔥 Destaques da Semana
          </h2>
        </div>

        <Suspense fallback={<div className="text-center py-10">A carregar ofertas...</div>}>
           <ProductShowcase products={products} />
        </Suspense>
      </section>
    </main>
  );
}