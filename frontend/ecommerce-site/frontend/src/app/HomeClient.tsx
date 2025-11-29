"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import ProductGrid from "@/components/ProductGrid"; 
import Image from "next/image";
import { useRef } from "react";

export default function HomeClient({ initialProducts }: { initialProducts: any[] }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] });
  
  // Parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const categories = [
    { name: "Hardware", icon: "⚡", color: "from-indigo-600 to-blue-600" },
    { name: "Periféricos", icon: "⌨️", color: "from-fuchsia-600 to-purple-600" },
    { name: "Smart Home", icon: "🏠", color: "from-emerald-600 to-teal-600" },
    { name: "Games", icon: "🎮", color: "from-orange-600 to-red-600" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 overflow-hidden relative" ref={targetRef}>
      
      {/* GLOBAL AMBIENT LIGHTING */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
      </div>

      {/* HERO SECTION 3D */}
      <motion.section 
        style={{ opacity: opacityHero }}
        className="relative container mx-auto px-4 mb-32 perspective-1000"
      >
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Texto Hero */}
            <div className="relative z-20">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-8">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-300">Nova Coleção 2024</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter drop-shadow-2xl">
                        FUTURE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-glow">
                           REALITY
                        </span>
                    </h1>

                    <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed border-l-2 border-white/10 pl-6">
                        Experimente a próxima dimensão do e-commerce. Produtos selecionados com design futurista e performance extrema.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-black font-bold rounded-xl relative overflow-hidden group"
                        >
                            <span className="relative z-10">Explorar Agora</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                        </motion.button>
                        
                        <motion.button 
                             whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                             className="px-8 py-4 glass-premium text-white font-bold rounded-xl"
                        >
                            Ver Ofertas
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Elemento 3D Flutuante (Ilustrativo) */}
            <div className="relative hidden lg:flex justify-center perspective-1000">
                <motion.div 
                    initial={{ opacity: 0, rotateY: -30, x: 50 }}
                    animate={{ opacity: 1, rotateY: -15, x: 0 }}
                    transition={{ duration: 1.5, type: "spring" }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative w-[400px] h-[500px]"
                >
                    {/* Floating Cards Simulation */}
                    <motion.div 
                        animate={{ y: [-15, 15, -15], rotateZ: [-2, 2, -2] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 glass-premium rounded-[40px] z-10 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent border-t border-l border-white/20"
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">👟</div>
                            <h3 className="text-2xl font-bold">Cyber Sneakers</h3>
                            <p className="text-indigo-400">Edição Limitada</p>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        animate={{ y: [20, -20, 20], x: [20, 10, 20] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute top-10 -right-20 w-64 h-40 glass-premium rounded-3xl z-0 backdrop-blur-sm bg-indigo-900/30 border border-indigo-500/30 flex items-center justify-center"
                    >
                         <span className="font-mono text-indigo-300 text-sm">STATUS: EM ESTOQUE</span>
                    </motion.div>
                </motion.div>
            </div>
        </div>
      </motion.section>

      {/* Categories Grid - 3D Cards */}
      <section className="container mx-auto px-4 mb-32">
        <h2 className="text-3xl font-bold mb-10 flex items-center gap-4">
            <span className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"/>
            Categorias
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
                <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10, rotateX: 5, rotateY: 5, scale: 1.05 }}
                    className="relative h-48 rounded-3xl overflow-hidden cursor-pointer group perspective-1000"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20 group-hover:opacity-100 transition-all duration-500`} />
                    <div className="absolute inset-0 glass-premium group-hover:bg-transparent transition-colors duration-500" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <span className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">{cat.icon}</span>
                        <h3 className="font-bold text-xl text-white group-hover:tracking-widest transition-all duration-300">{cat.name}</h3>
                    </div>
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