'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

// Componente interno para usar o useSearchParams dentro de Suspense
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    setLoading(true);
    // Constrói a URL da API com os filtros
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [query, category, sort]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Resultados para "${query}"` : 'Todos os Produtos'}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar de Filtros */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div>
            <h3 className="font-bold mb-2">Categorias</h3>
            <div className="space-y-2 flex flex-col text-sm text-gray-600">
              <button onClick={() => updateFilter('category', '')} className={`text-left ${category === '' ? 'text-blue-600 font-bold' : ''}`}>Todas</button>
              <button onClick={() => updateFilter('category', 'Eletrônicos')} className={`text-left ${category === 'Eletrônicos' ? 'text-blue-600 font-bold' : ''}`}>Eletrônicos</button>
              <button onClick={() => updateFilter('category', 'Moda')} className={`text-left ${category === 'Moda' ? 'text-blue-600 font-bold' : ''}`}>Moda</button>
              <button onClick={() => updateFilter('category', 'Casa')} className={`text-left ${category === 'Casa' ? 'text-blue-600 font-bold' : ''}`}>Casa</button>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Ordenar por</h3>
            <select 
              className="w-full border p-2 rounded"
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="">Relevância</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </aside>

        {/* Lista de Produtos */}
        <div className="flex-1">
          {loading ? (
            <div>Carregando...</div>
          ) : products.length === 0 ? (
            <div className="text-gray-500">Nenhum produto encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p: any) => (
                 // Mockando a função onQuickView para evitar erro se não for passada
                 <ProductCard key={p._id} product={p} onQuickView={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Carregando busca...</div>}>
      <SearchContent />
    </Suspense>
  );
}