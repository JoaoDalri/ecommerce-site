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
    { href: '/categories', label: 'Coleções' },
  ]

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="glass-panel mx-auto max-w-6xl rounded-2xl px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-primary/50 transition-shadow">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
            LUMINA
          </span>
        </Link>
        
        {/* Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="relative group py-2">
              <span className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                {link.label}
              </span>
              {pathname === link.href && (
                <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative group">
            <div className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={totalItems}
                className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg shadow-accent/40"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          
          <button className="hidden md:block px-5 py-2 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
            Entrar
          </button>
        </div>
      </div>
    </motion.header>
  )
}