"use client";
import { motion } from "framer-motion";
import ProductGrid from "@/components/ProductGrid"; 
import Image from "next/image";

export default function HomeClient({ initialProducts }: { initialProducts: any[] }) {
  const categories = [
    { name: "Hardware", color: "from-blue-500 to-cyan-500" },
    { name: "Periféricos", color: "from-purple-500 to-pink-500" },
    { name: "Smart Home", color: "from-green-500 to-emerald-500" },
    { name: "Games", color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative container mx-auto px-4 mb-24">
        <div className="glass-panel rounded-3xl p-10 md:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                        <span className="text-sm font-medium text-gradient-primary">🔥 A nova geração chegou</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
                    >
                        Tecnologia <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Além do Limite</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-400 mb-10 max-w-lg"
                    >
                        Descubra produtos que redefinem o que é possível. Design premium, performance inigualável.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-4"
                    >
                        <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Explorar Coleção
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
                <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer group overflow-hidden relative"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <h3 className="font-bold text-lg text-white relative z-10">{cat.name}</h3>
                </motion.div>
            ))}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <div className="container mx-auto px-4">
        <ProductGrid products={initialProducts} />
      </div>
    </div>
  );
}