'use client'
import { useEffect, useState, use } from 'react'; // 1. Importa o 'use'
import { useCart } from '@/context/CartContext';

// 2. Atualiza o tipo para Promise
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 3. Desembrulha os params com use()
  const { id } = use(params); 
  
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // 4. Usa a variável 'id' que foi extraída, em vez de 'params.id'
    fetch(`/api/products?id=${id}`)
      .then(res => res.json())
      .then(data => {
         if(Array.isArray(data)) {
            // 5. Usa 'id' aqui também
            setProduct(data.find((p: any) => p._id === id));
         } else {
            setProduct(data);
         }
      });
  }, [id]); // 6. A dependência passa a ser apenas 'id'

  if (!product) return <div className="p-10 text-center">Carregando produto...</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-2xl shadow-sm flex items-center justify-center min-h-[400px]">
           {/* Adicionei um estilo extra na imagem para evitar quebras */}
           {product.images?.[0] ? (
             <img src={product.images[0]} className="max-h-full max-w-full object-contain" alt={product.title} />
           ) : (
             <span className="text-6xl">📦</span>
           )}
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 text-lg mb-6">{product.description || 'Sem descrição'}</p>
          <div className="text-3xl font-bold text-blue-600 mb-8">
            R$ {product.price?.toFixed(2) || '0.00'}
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}