import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import { getFilteredProducts } from '@/services/productService'; // Usa o service diretamente
import QuickViewModal from '@/components/QuickViewModal';
import { Suspense } from 'react';

// Função de busca no servidor (SSR/ISR)
async function fetchFeaturedProducts() {
  // A chamada ao service aqui é SSG/SSR/ISR dependendo das opções de fetch dentro do service
  // Ou usamos fetch diretamente na API interna com a cache configurada:
  const res = await fetch('http://localhost:3000/api/products?sort=price_desc', { 
     next: { revalidate: 3600 } // Cache no Next.js (1 hora)
  });
  if (!res.ok) throw new Error('Falha ao buscar produtos');
  return res.json();
}

export default async function Home() {
  const products = await fetchFeaturedProducts(); // Carrega os dados na build/requisição

  return (
    <main className="pb-20">
      <HeroBanner />

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {/* Benefícios */}
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
          <div className="text-center py-20 text-gray-400">Nenhum produto encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                // QuickView Modal precisa ser client-side, mantido para compatibilidade
                onQuickView={() => {}} 
              />
            ))}
          </div>
        )}
      </section>
      
      {/* O QuickView Modal é um componente client-side que pode ser adicionado aqui, mas requer estado */}
    </main>
  );
}