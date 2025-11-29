'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'

export default function ProductCard({ product, onQuickView }: any) {
    const { add } = useCart()
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
            className="group relative h-full perspective-1000" // Perspective é chave para 3D
        >
            {/* Glow Traseiro (Ambiente) - Só aparece no hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-purple-600 rounded-[2rem] opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 -z-10" />

            {/* Cartão Principal */}
            <div className="relative h-full glass-card rounded-[1.5rem] p-5 flex flex-col overflow-hidden transition-all duration-300 group-hover:border-white/20">
                
                {/* Badge "NEW" */}
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-primary/20 border border-primary/30 rounded-full backdrop-blur-md">
                        Novo
                    </span>
                </div>

                {/* Área da Imagem com Efeito de Profundidade */}
                <Link href={`/product/${product._id}`} className="block relative w-full aspect-square mb-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center overflow-hidden group-hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                    
                    {/* Luz de Fundo da Imagem */}
                    <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <motion.div
                        className="relative z-10 w-full h-full p-6"
                        whileHover={{ scale: 1.15, rotateZ: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Image 
                            src={product.img || '/next.svg'} 
                            fill
                            alt={product.title}
                            className="object-contain drop-shadow-2xl"
                        />
                    </motion.div>

                    {/* Botão Quick View (Aparece no Hover) */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20">
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
                            className="bg-white text-black px-5 py-2 rounded-full font-bold text-xs shadow-lg hover:bg-gray-200 transition-colors"
                        >
                            Espiar
                        </button>
                    </div>
                </Link>

                {/* Informações */}
                <div className="mt-auto">
                    <Link href={`/product/${product._id}`}>
                        <h3 className="text-gray-200 font-medium text-lg leading-snug mb-3 line-clamp-2 hover:text-primary transition-colors">
                            {product.title}
                        </h3>
                    </Link>
                    
                    <div className="flex items-end justify-between border-t border-white/5 pt-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-mono mb-1">PREÇO</span>
                            <span className="text-xl font-bold text-white tracking-tight">
                                R$ {product.price.toFixed(2)}
                            </span>
                        </div>
                        
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); add({ id: product._id, title: product.title, price: product.price, img: product.img }); }}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary text-white flex items-center justify-center border border-white/10 transition-all shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}