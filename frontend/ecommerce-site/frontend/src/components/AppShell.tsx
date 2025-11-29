'use client'
import React from 'react'
import Navbar from './Navbar'
import { CartProvider } from '@/lib/context/CartContext'
import { motion } from 'framer-motion'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <motion.main
          className="flex-grow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
        
        <footer className="bg-surface text-muted text-center py-8 mt-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <h3 className="text-primary-accent font-bold mb-2">CYBER-SHOP</h3>
            <p className="text-sm opacity-60">
              © {new Date().getFullYear()} Design Futurista. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}