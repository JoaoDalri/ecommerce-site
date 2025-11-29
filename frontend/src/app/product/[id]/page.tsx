'use client'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext' // Verifique se o caminho está correto

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProductPage({ params }: { params: { id: string } }){
  const { id } = params
  // O fetcher agora chama a API interna do Next.js (porta 3000 implícita)
  const { data: product, error, isLoading } = useSWR(`/api/products/${id}`, fetcher)
  const { add } = useCart()
  const router = useRouter()

  // Correção de UX: Estado de carregamento
  if (isLoading) return <div className="container py-8">Carregando...</div>
  if (error || !product || product.error) return <div className="container py-8">Produto não encontrado</div>

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center">
            {/* Fallback seguro para imagem */}
            <img 
              src={product.images?.[0] || '/next.svg'} 
              alt={product.name} 
              className="max-h-full object-contain" 
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          
          <div className="text-3xl font-extrabold mt-4">
            R$ {product.price?.toFixed(2)}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => { 
                add({ 
                  id: product._id, 
                  title: product.name, 
                  price: product.price,
                  img: product.images?.[0] 
                }); 
                router.push('/cart') 
              }} 
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Comprar
            </button>
            <button className="px-5 py-2 border rounded-lg hover:bg-gray-50">
              Adicionar à lista
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}