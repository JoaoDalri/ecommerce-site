'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'

export default function ProductCard({ product, onQuickView }: any) {
    const { add } = useCart()
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            className="group relative"
        >
            {/* Card Background with Glass Effect */}
            <div className="absolute inset-0 bg-glass rounded-2xl transition-colors duration-300 group-hover:bg-white/5" />
            
            {/* Glow Effect on Hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-30 rounded-2xl blur-lg transition-opacity duration-500" />

            <div className="relative p-4 rounded-2xl border border-glass-border overflow-hidden h-full flex flex-col">
                
                {/* Image Container */}
                <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center group-hover:shadow-inner transition-all">
                    <Link href={`/product/${product._id}`} className="block w-full h-full relative z-10">
                        <Image 
                            src={product.img || '/next.svg'} 
                            fill
                            alt={product.title}
                            className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                        />
                    </Link>
                    
                    {/* Quick View Button (Overlay) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <button 
                            onClick={(e) => { e.preventDefault(); onQuickView(); }}
                            className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-white hover:text-black"
                        >
                            Espiar
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-auto">
                    <h3 className="text-gray-200 font-medium text-lg leading-tight mb-1 truncate group-hover:text-white transition-colors">{product.title}</h3>
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-accent-glow">
                            R$ {product.price.toFixed(2)}
                        </span>
                        
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => add({ id: product._id, title: product.title, price: product.price, img: product.img })} 
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center border border-white/10 transition-colors"
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