import { use } from 'react';
import Reviews from '@/components/Reviews';
import { getProductById, getRelatedProducts } from '@/services/productService'; // Novo Import
import Image from 'next/image'; 
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; // Client side only

// Função principal de Server Component
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) return <div className="p-10 text-center">Produto não encontrado.</div>;

  // Carregar produtos relacionados (Server Component)
  // O uso do .category garante que a variável exista antes de chamar a função
  const relatedProducts = product.category ? await getRelatedProducts(product._id, product.category) : [];

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Detalhes do Produto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-2xl shadow-sm flex items-center justify-center min-h-[400px]">
           {product.images?.[0] ? (
             <Image 
               src={product.images[0]} 
               alt={product.title} 
               width={400}
               height={400} 
               className="max-h-full max-w-full object-contain" 
               priority
             />
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
          
          <AddToCartButton product={product} /> 
        </div>
      </div>

      {/* Seção de Reviews */}
      <Reviews product={product} />

      {/* NOVO: Produtos Relacionados (Venda Cruzada/Cross-Sell) */}
      {relatedProducts.length > 0 && (
          <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Você também pode gostar</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.map((p: any) => (
                      <Link href={`/product/${p._id}`} key={p._id} className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                          <div className="h-24 relative mb-3">
                            {p.images?.[0] ? (
                                <Image 
                                    src={p.images[0]} 
                                    alt={p.title} 
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            ) : (
                                <span className="text-gray-400">Sem Imagem</span>
                            )}
                          </div>
                          <p className="text-sm font-semibold truncate hover:text-blue-600">{p.title}</p>
                          <p className="text-sm font-bold text-blue-600">R$ {p.price.toFixed(2)}</p>
                      </Link>
                  ))}
              </div>
          </section>
      )}

    </div>
  );
}

// COMPONENTE CLIENTE SEPARADO (para o botão)
function AddToCartButton({ product }: { product: any }) {
    'use client';
    const { addToCart } = useCart();
    
    return (
        <button 
            onClick={() => addToCart(product)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
        >
            Adicionar ao Carrinho
        </button>
    )
}