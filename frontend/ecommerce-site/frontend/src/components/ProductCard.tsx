'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'

export default function ProductCard({ product }: any) {
    const { add } = useCart()
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-surface rounded-2xl p-4 border border-white/5 hover:border-primary-accent/50 transition-colors group overflow-hidden"
        >
            <Link href={`/product/${product._id}`} className="block relative">
                <div className="w-full h-48 bg-black/20 rounded-xl flex items-center justify-center overflow-hidden mb-4 relative">
                    <div className="absolute inset-0 bg-primary-accent/0 group-hover:bg-primary-accent/5 transition-colors z-0" />
                    <Image 
                        src={product.img || '/next.svg'} 
                        width={150} 
                        height={150} 
                        alt={product.title}
                        className="object-contain transition-transform duration-500 group-hover:scale-110 z-10"
                    />
                </div>
            </Link>

            <div className="space-y-2">
                <h4 className="font-bold text-lg text-white truncate">{product.title}</h4>
                <div className="flex items-center justify-between">
                    <p className="text-xl font-black text-primary-accent">
                        R$ {product.price.toFixed(2)}
                    </p>
                </div>
                
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => add({ id: product._id, title: product.title, price: product.price, img: product.img })} 
                    className="w-full py-2.5 mt-2 bg-white/5 hover:bg-primary-accent text-white font-medium rounded-lg transition-all border border-white/10 hover:border-transparent"
                >
                    Adicionar
                </motion.button>
            </div>
        </motion.div>
    )
}