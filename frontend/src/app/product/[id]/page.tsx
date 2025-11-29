import { use } from 'react';
import Reviews from '@/components/Reviews';
import { getProductById } from '@/services/productService'; 
import Image from 'next/image'; 
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; // Client side only

// 1. SEO AVANÇADO: Geração de Metadados Dinâmicos (Server-Side)
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) {
    return { title: 'Produto Não Encontrado', description: 'Item indisponível na loja.' };
  }

  return {
    title: product.title + ' | LojaPro',
    description: product.description?.substring(0, 160) || `Compre ${product.title} por R$ ${product.price.toFixed(2)}`,
    keywords: [product.category, product.title, 'e-commerce'],
    openGraph: {
      images: [product.images?.[0] || '/next.svg'],
    },
  };
}


export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) return <div className="p-10 text-center">Produto não encontrado.</div>;

  // Gerar Schema Markup para Rich Snippets
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images?.[0] || 'http://localhost:3000/placeholder.png',
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BRL",
      "price": product.price.toFixed(2),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.averageRating || 5,
      "reviewCount": product.numReviews || 0
    }
  };


  return (
    <div className="container mx-auto py-10 px-4">
      {/* 2. JSON-LD INJETADO (Script de Structured Data) */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Detalhes do Produto (UI) */}
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

      <Reviews product={product} />
      {/* Seção de Produtos Relacionados (Marketing) seria inserida aqui */}
    </div>
  );
}

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