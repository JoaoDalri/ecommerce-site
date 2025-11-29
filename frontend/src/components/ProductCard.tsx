'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'

export default function ProductCard({ product, onQuickView }: any) {
    const { add } = useCart()
    
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="group relative h-full"
        >
            {/* Card Body - Fundo Escuro Glass */}
            <div className="relative h-full glass-panel rounded-2xl p-4 flex flex-col overflow-hidden group-hover:border-indigo-500/30 transition-all duration-300 bg-[#121212]">
                
                {/* Imagem */}
                <div className="relative w-full aspect-square mb-4 rounded-xl bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center overflow-hidden">
                    <Image 
                        src={product.img || '/next.svg'} 
                        width={200} height={200}
                        alt={product.title}
                        className="object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Ações Rápidas */}
                    <div className="absolute bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                        <button 
                            onClick={(e) => { e.preventDefault(); onQuickView(); }}
                            className="bg-white text-black px-4 py-2 rounded-lg font-bold text-xs hover:bg-gray-200"
                        >
                            Ver
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-auto">
                    <h3 className="text-gray-200 font-medium text-lg mb-1 truncate group-hover:text-white transition-colors">{product.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{product.category || 'Eletrônicos'}</p>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-indigo-400">R$ {product.price.toFixed(2)}</span>
                        <button 
                            onClick={() => add({ id: product._id, title: product.title, price: product.price, img: product.img })}
                            className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}