'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'

export default function ProductCard({ product, onQuickView }: any) {
    const { add } = useCart()
    
    // Fallback de segurança para a imagem
    const imageSrc = (product.img && product.img.length > 0) ? product.img : '/next.svg';

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative h-full"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-accent rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

            <div className="relative h-full glass-panel rounded-3xl p-4 flex flex-col overflow-hidden border border-white/5 group-hover:border-primary/30 transition-all bg-[#0a0a0a]">
                
                <div className="relative w-full aspect-square mb-4 rounded-2xl bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center overflow-hidden">
                    <Image 
                        src={imageSrc} 
                        width={250} height={250}
                        alt={product.title || 'Produto'}
                        className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 relative z-10"
                    />
                    
                    <button 
                        onClick={(e) => { e.preventDefault(); onQuickView(); }}
                        className="absolute bottom-3 bg-white text-black px-4 py-1.5 rounded-full font-bold text-xs hover:bg-gray-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all z-20"
                    >
                        Espiar
                    </button>
                </div>

                <div className="mt-auto">
                    <h3 className="text-gray-100 font-bold text-lg mb-1 truncate">{product.title}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">R$ {product.price?.toFixed(2)}</span>
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => add({ id: product._id, title: product.title, price: product.price, img: imageSrc })}
                            className="w-10 h-10 rounded-xl bg-primary hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-primary/20 transition-all"
                        >
                            +
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}