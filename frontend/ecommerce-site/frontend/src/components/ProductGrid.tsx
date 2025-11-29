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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50, rotateX: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden grid md:grid-cols-2 perspective-1000"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Lado da Imagem */}
                <div className="bg-gradient-to-br from-gray-900 to-black p-10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                    
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 w-full h-64 md:h-full"
                    >
                        <Image 
                            src={product.img || '/next.svg'} 
                            fill
                            alt={product.title}
                            className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        />
                    </motion.div>
                </div>

                {/* Lado do Conteúdo */}
                <div className="p-10 flex flex-col justify-center bg-[#0a0a0a]">
                     <button 
                        onClick={onClose} 
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>

                    <div className="mb-6">
                        <span className="text-primary text-xs font-bold tracking-widest uppercase border border-primary/20 px-2 py-1 rounded">Em Destaque</span>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{product.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 border-l-2 border-white/10 pl-4">
                        {product.description || 'Descrição indisponível. Detalhes técnicos e especificações completas podem ser vistos na página do produto.'}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl font-bold text-white">R$ {product.price?.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 line-through">R$ {(product.price * 1.2).toFixed(2)}</span>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Comprar Agora
                        </button>
                        <button className="px-6 py-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors">
                            ❤️
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function ProductGrid({ products = [] }: { products?: any[] }) {
    const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

    return (
        <section className="relative z-10">
            <div className="flex items-end justify-between mb-12">
                 <div>
                    <h3 className="text-4xl font-bold text-white mb-2">Coleção <span className="text-gradient-primary">Destaque</span></h3>
                    <p className="text-gray-400">Os itens mais desejados da temporada.</p>
                 </div>
                 <button className="hidden md:block text-sm font-bold text-primary hover:text-white transition-colors">Ver Todos &rarr;</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map((p, i) => (
                        <motion.div
                            key={p._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="h-full"
                        >
                            <ProductCard 
                                product={p} 
                                onQuickView={() => setQuickViewProduct(p)} 
                            />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-4 py-20 text-center glass-panel rounded-2xl">
                        <p className="text-gray-500 text-lg">Nenhum produto encontrado na base de dados.</p>
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