'use client'
import React, { useState } from 'react'
import ProductCard from './ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

function QuickViewModal({ product, onClose }: { product: any, onClose: () => void }) {
    if (!product) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0f0f11] border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="bg-gradient-to-br from-gray-900 to-black p-8 flex items-center justify-center relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />
                    <Image 
                        src={product.img || '/next.svg'} 
                        width={250} 
                        height={250} 
                        alt={product.title}
                        className="object-contain relative z-10 drop-shadow-2xl"
                    />
                </div>

                <div className="p-8 flex flex-col justify-center relative">
                     <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white">✕</button>
                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{product.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{product.description}</p>
                    <div className="text-3xl font-bold text-white mb-8">R$ {product.price?.toFixed(2)}</div>
                    <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200">Ver Detalhes</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

// Aceita produtos via props ou usa array vazio como fallback
export default function ProductGrid({ products = [] }: { products?: any[] }) {
    const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

    return (
        <section>
            <div className="flex items-center justify-between mb-10">
                 <h3 className="text-3xl font-bold text-white">Destaques</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map((p, i) => (
                        <motion.div
                            key={p._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ProductCard 
                                product={p} 
                                onQuickView={() => setQuickViewProduct(p)} 
                            />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-4 text-center text-gray-500 py-10">
                        Nenhum produto encontrado no banco de dados.
                    </div>
                )}
            </div>

            <AnimatePresence>
                {quickViewProduct && (
                    <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
                )}
            </AnimatePresence>
        </section>
    );
}