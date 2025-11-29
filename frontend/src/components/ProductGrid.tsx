'use client'
import React, { useState } from 'react'
import ProductCard from './ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

function QuickViewModal({ product, onClose }: { product: any, onClose: () => void }) {
    if (!product) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                onClick={onClose} 
            />
            
            <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                className="relative w-full max-w-4xl bg-[#0f0f11] border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 z-10"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="bg-gradient-to-br from-gray-900 to-black p-10 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-primary/10 blur-[80px]" />
                    <Image src={product.img} width={300} height={300} alt={product.title} className="object-contain relative z-10 drop-shadow-2xl" />
                </div>

                <div className="p-10 flex flex-col justify-center">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">✕</button>
                    <h3 className="text-3xl font-bold text-white mb-4">{product.title}</h3>
                    <p className="text-gray-400 mb-8">{product.description}</p>
                    <div className="text-4xl font-bold text-white mb-8">R$ {product.price?.toFixed(2)}</div>
                    <button className="w-full py-4 bg-primary hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default function ProductGrid({ products = [] }: { products?: any[] }) {
    const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

    return (
        <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map((p, i) => (
                        <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <ProductCard product={p} onQuickView={() => setQuickViewProduct(p)} />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-4 text-center py-20 text-gray-500">Nenhum produto encontrado.</div>
                )}
            </div>

            <AnimatePresence>
                {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
            </AnimatePresence>
        </section>
    );
}