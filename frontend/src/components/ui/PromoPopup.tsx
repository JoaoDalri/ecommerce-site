'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Simula "Exit Intent" ou tempo de página
    const timer = setTimeout(() => setIsOpen(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-[#0f0f11] border border-primary/50 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(99,102,241,0.3)]"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎁</div>
            <h3 className="text-2xl font-bold text-white mb-2">Primeira vez aqui?</h3>
            <p className="text-gray-400 mb-6">Ganhe <span className="text-primary font-bold">10% OFF</span> na sua primeira compra tecnológica.</p>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg mb-6 flex justify-between items-center cursor-pointer hover:bg-white/10 transition">
                <code className="text-accent font-mono text-lg font-bold tracking-widest">NEON10</code>
                <span className="text-xs text-gray-500 uppercase">Copiar</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200">Aproveitar Desconto</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}