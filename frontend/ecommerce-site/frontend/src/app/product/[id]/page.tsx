'use client'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/context/CartContext'
import { motion } from 'framer-motion'
import Image from 'next/image'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProductPage({ params }: { params: { id: string } }){
  const { id } = params
  const { data: product, error, isLoading } = useSWR(`/api/products/${id}`, fetcher)
  const { add } = useCart()
  const router = useRouter()

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
            <p className="text-gray-500 animate-pulse">Carregando experiência...</p>
        </div>
    </div>
  )
  
  if (error || !product) return <div className="container pt-32 text-center text-red-400">Produto indisponível</div>

  const mainImage = product.images?.[0] || '/next.svg'

  return (
    <div className="min-h-screen pt-28 pb-20 container mx-auto px-4">
      <motion.button 
        onClick={() => router.back()}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 px-4 py-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium w-fit"
      >
        &larr; Voltar
      </motion.button>

      <div className="grid lg:grid-cols-2 gap-16">
        
        {/* Left: Sticky Image */}
        <div className="relative">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="sticky top-32 glass-panel rounded-3xl p-10 flex items-center justify-center aspect-square bg-gradient-to-br from-gray-900 to-black overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                
                <Image 
                  src={mainImage} 
                  alt={product.name} 
                  width={600}
                  height={600}
                  className="object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                />
            </motion.div>
        </div>

        {/* Right: Info */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit mb-6">
            Lançamento
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl font-bold text-white">R$ {product.price?.toFixed(2)}</span>
            <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm font-semibold">
                Em 12x sem juros
            </div>
          </div>

          <p className="text-gray-400 text-lg mb-10 leading-relaxed border-l-2 border-white/10 pl-6">
            {product.description || 'Eleve seu setup com este produto exclusivo. Design meticuloso e performance que desafia os limites.'}
          </p>

          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Garantia</span>
                    <span className="text-white font-medium">12 Meses</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Envio</span>
                    <span className="text-white font-medium">Imediato</span>
                </div>
             </div>

             <div className="flex gap-4">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { 
                    add({ id: product._id, title: product.name, price: product.price, img: product.images?.[0] }); 
                    router.push('/cart') 
                  }} 
                  className="flex-1 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                >
                  Adicionar ao Carrinho
                </motion.button>
                
                <button className="p-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}