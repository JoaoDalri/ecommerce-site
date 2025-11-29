'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'

const navItemVariants = {
  hover: { scale: 1.05, color: '#FF4976' },
  initial: { scale: 1, color: '#F0F0F5' }
}

export default function Navbar() {
  const { items } = useCart()
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
      className="sticky top-0 z-50 bg-surface/80 shadow-lg backdrop-blur-md border-b border-white/5"
    >
      <div className="container mx-auto px-4 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-widest text-white group">
          CYBER<span className="text-primary-accent group-hover:animate-pulse">SHOP</span>
        </Link>
        
        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-wide">
          <Link href="/" passHref>
            <motion.span variants={navItemVariants} initial="initial" whileHover="hover" className="cursor-pointer">
              Home
            </motion.span>
          </Link>
          <Link href="/products" passHref>
            <motion.span variants={navItemVariants} initial="initial" whileHover="hover" className="cursor-pointer">
              Produtos
            </motion.span>
          </Link>
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center space-x-4">
          <Link href="/cart" passHref>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-white hover:text-primary-accent transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-accent rounded-full shadow-lg"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}