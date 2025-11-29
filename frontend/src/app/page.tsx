import { Suspense } from 'react';
import HeroBanner from '@/components/HeroBanner';
import ProductShowcase from '@/components/ProductShowcase';
import { getFilteredProducts } from '@/services/productService';

// SEO Estático para a Home
export const metadata = {
  title: 'LojaPro | As Melhores Ofertas em Eletrônicos',
  description: 'Encontre smartphones, notebooks e acessórios com os melhores preços do Brasil.',
};

// Função de busca de dados (Server-Side)
async function getProducts() {
  // Busca direta ao banco ou API interna
  // Revalidate define o tempo de cache (ISR) - 1 hora
  return await getFilteredProducts({ sort: 'price_desc' });
}

export default async function Home() {
  const products = await getProducts();

  // JSON-LD para Rich Snippets de Negócio Local/Loja
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "LojaPro",
    "url": process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
    "description": "E-commerce de eletrônicos e acessórios.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      
      <HeroBanner />

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', title: 'Frete Grátis', desc: 'Em compras acima de R$ 200' },
            { icon: '💳', title: 'Parcelamento', desc: 'Até 12x sem juros' },
            { icon: '🛡️', title: 'Compra Segura', desc: 'Proteção total dos dados' },
            { icon: '↩️', title: 'Troca Fácil', desc: '30 dias para devolução' },
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
          <a href="/search" className="text-blue-600 font-semibold hover:underline">Ver tudo →</a>
        </div>

        {/* O componente cliente cuida da interatividade */}
        <Suspense fallback={<div className="text-center py-10">Carregando ofertas...</div>}>
           <ProductShowcase products={products} />
        </Suspense>
      </section>
    </main>
  );
}