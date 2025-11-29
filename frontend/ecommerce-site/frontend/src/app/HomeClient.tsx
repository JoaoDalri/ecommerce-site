"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import ProductGrid from "@/components/ProductGrid"; 
import Hero3D from "@/components/Hero3D"; 
import { useRef } from "react";

export default function HomeClient({ initialProducts }: { initialProducts: any[] }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const categories = [
    { name: "Hardware", color: "from-blue-600 to-indigo-600", icon: "⚡" },
    { name: "Periféricos", color: "from-purple-600 to-pink-600", icon: "⌨️" },
    { name: "Smart Home", color: "from-emerald-500 to-teal-500", icon: "🏠" },
    { name: "Games", color: "from-orange-500 to-red-500", icon: "🎮" },
  ];

  return (
    <div className="min-h-screen bg-bg relative overflow-x-hidden" ref={containerRef}>
      
      {/* 3D HERO SECTION com Parallax */}
      <motion.div style={{ y }} className="relative z-0">
        <Hero3D />
      </motion.div>

      {/* Categories - Flutuando sobre a Hero */}
      <section className="container mx-auto px-4 relative z-10 -mt-24 mb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
                <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="glass-panel p-6 rounded-3xl h-48 flex flex-col justify-between cursor-pointer group hover:border-primary/50 transition-colors overflow-hidden relative"
                >
                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${cat.color} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity`} />
                    
                    <span className="text-4xl bg-white/5 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                        {cat.icon}
                    </span>
                    
                    <div>
                        <h3 className="font-bold text-xl text-white mb-1">{cat.name}</h3>
                        <div className="w-8 h-1 bg-gray-700 rounded-full group-hover:w-full group-hover:bg-primary transition-all duration-500" />
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <div className="container mx-auto px-4 pb-32 relative z-10">
        {/* Faixa decorativa de fundo */}
        <div className="absolute top-20 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10 blur-3xl" />
        <ProductGrid products={initialProducts} />
      </div>
      
      {/* Footer Simples */}
      <footer className="border-t border-white/5 bg-black py-12 text-center relative z-10">
        <p className="text-gray-500 text-sm">© 2025 LUMINA. Design Futurista.</p>
      </footer>
    </div>
  );
}