'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'
import { useAuth } from '@/lib/context/AuthContext'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const { items } = useCart()
  const { user, logout } = useAuth()
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-6 pointer-events-none"
    >
      <div className="glass-panel mx-auto max-w-7xl rounded-2xl px-6 py-3 flex items-center justify-between pointer-events-auto bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10">
        
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">L</div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">LUMINA</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {['Home', 'Produtos', 'Ofertas'].map((item) => (
            <Link key={item} href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
            {user ? (
                <div className="relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 hover:bg-white/5 px-3 py-1.5 rounded-xl transition-colors">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-400">Olá,</p>
                            <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-primary/50 overflow-hidden bg-gray-800">
                            {/* Avatar gerado ou placeholder */}
                            <img src={user.avatar} alt="User" className="w-full h-full" />
                        </div>
                    </button>
                    
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1"
                            >
                                <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors">
                                    Sair da conta
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <Link href="/login" className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-all">
                    Entrar
                </Link>
            )}

            <Link href="/cart" className="relative group">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-indigo-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all transform group-hover:scale-105">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                    {totalItems}
                  </span>
                )}
            </Link>
        </div>
      </div>
    </motion.header>
  )
}