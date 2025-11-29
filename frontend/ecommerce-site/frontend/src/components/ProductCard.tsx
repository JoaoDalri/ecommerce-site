'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'

export default function ProductCard({ product, onQuickView }: any) {
    const { add } = useCart()
    
    // Configurações para efeito de Hover 3D (Opcional: Mouse tracking poderia ser adicionado aqui, mas vamos manter simples e performático)
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative h-full perspective-1000"
        >
            {/* Glow Traseiro (Ambiente) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500" />

            {/* Cartão Principal */}
            <div className="relative h-full glass-premium rounded-[1.5rem] p-5 flex flex-col overflow-hidden">
                
                {/* Badge de Destaque */}
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black bg-white/90 rounded-md backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-2 group-hover:translate-y-0">
                        Visualizar
                    </span>
                </div>

                {/* Área da Imagem com "Spotlight" */}
                <div className="relative w-full aspect-square mb-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center overflow-hidden group-hover:shadow-[inset_0_0_40px_rgba(255,255,255,0.05)] transition-all">
                    
                    {/* Círculo de Luz de Fundo */}
                    <div className="absolute w-24 h-24 bg-indigo-500/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    
                    <Link href={`/product/${product._id}`} className="relative z-10 w-full h-full flex items-center justify-center">
                        <motion.div
                            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image 
                                src={product.img || '/next.svg'} 
                                width={200}
                                height={200}
                                alt={product.title}
                                className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </Link>

                    {/* Botão Flutuante Quick View */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={(e) => { e.preventDefault(); onQuickView(); }}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </motion.button>
                </div>

                {/* Informações */}
                <div className="mt-auto relative z-10">
                    <h3 className="text-gray-300 font-medium text-lg leading-tight mb-2 truncate group-hover:text-white transition-colors">{product.title}</h3>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 line-through">R$ {(product.price * 1.2).toFixed(2)}</span>
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                                R$ {product.price.toFixed(2)}
                            </span>
                        </div>
                        
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => add({ id: product._id, title: product.title, price: product.price, img: product.img })} 
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white hover:text-black border border-white/10 flex items-center justify-center transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}