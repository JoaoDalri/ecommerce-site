'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { items } = useCart()
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Produtos' },
    { href: '/cart', label: 'Carrinho' },
  ]

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-6 pointer-events-none" // pointer-events-none no container para clicar através
    >
      <div className="glass-panel mx-auto max-w-5xl rounded-full px-8 py-4 flex items-center justify-between pointer-events-auto">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all duration-500">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            LUMINA
          </span>
        </Link>
        
        {/* Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="relative px-5 py-2 rounded-full transition-all">
              {pathname === link.href && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-inner" />
              )}
              <span className={`relative z-10 text-sm font-medium ${pathname === link.href ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Cart */}
        <Link href="/cart" className="relative group">
            <div className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group-hover:border-primary/30">
                <svg className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={totalItems}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg"
              >
                {totalItems}
              </motion.span>
            )}
        </Link>
      </div>
    </motion.header>
  )
}