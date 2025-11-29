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
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-accent border-t-transparent rounded-full animate-spin"/>
    </div>
  )
  
  if (error || !product || product.error) return <div className="container py-20 text-center text-red-500">Produto não encontrado</div>

  const mainImage = product.images?.[0] || '/next.svg'

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.button 
        onClick={() => router.back()}
        className="mb-8 text-muted hover:text-white transition-colors flex items-center gap-2"
      >
        ← Voltar
      </motion.button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagem */}
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface rounded-3xl p-8 flex items-center justify-center border border-white/5 relative group"
        >
            <div className="absolute inset-0 bg-primary-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
            <Image 
              src={mainImage} 
              alt={product.name} 
              width={500}
              height={500}
              className="object-contain relative z-10 drop-shadow-2xl" 
            />
        </motion.div>

        {/* Detalhes */}
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
        >
          <div className="mb-4">
             <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-primary-accent">
               Em Estoque
             </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{product.name}</h1>
          
          <p className="text-muted text-lg mb-8 leading-relaxed">
            {product.description || 'Experiência de alta performance garantida com este produto de última geração.'}
          </p>
          
          <div className="flex items-end gap-4 mb-10">
            <span className="text-5xl font-black text-white">R$ {product.price?.toFixed(2)}</span>
            <span className="text-muted line-through mb-2">R$ {(product.price * 1.2).toFixed(2)}</span>
          </div>
          
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { 
                add({ id: product._id, title: product.name, price: product.price, img: product.images?.[0] }); 
                router.push('/cart') 
              }} 
              className="flex-1 py-4 bg-primary-accent text-white rounded-xl font-bold text-lg shadow-[0_4px_20px_rgba(255,73,118,0.4)] hover:bg-primary-hover transition-colors"
            >
              Comprar Agora
            </motion.button>
            
            <button className="p-4 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}