"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { seedProducts } from "@/data/seedproducts"; 

export default function Home() {
  const [products] = useState(seedProducts);
  const categories = ["Hardware", "Periféricos", "Smart Home", "Acessórios", "Games", "Áudio"];

  return (
    <div className="pb-20">
      
      {/* HERO SECTION */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden mb-16">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
          >
            NEXT GEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-accent to-purple-500">STORE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-muted max-w-2xl mx-auto mb-10"
          >
            Explore o melhor da tecnologia com design futurista e performance inigualável.
          </motion.p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary-accent text-white font-bold rounded-full shadow-[0_0_20px_rgba(255,73,118,0.5)] hover:shadow-[0_0_30px_rgba(255,73,118,0.7)] transition-shadow"
          >
            Ver Ofertas
          </motion.button>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* CATEGORIES */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary-accent rounded-full"/> Categorias
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, backgroundColor: 'var(--color-primary-accent)' }}
                className="bg-surface p-4 rounded-xl text-center font-medium border border-white/5 cursor-pointer hover:border-primary-accent/50 transition-colors"
              >
                {cat}
              </motion.div>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-purple-500 rounded-full"/> Destaques da Semana
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}