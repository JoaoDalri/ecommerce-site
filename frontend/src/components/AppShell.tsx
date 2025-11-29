'use client'
import { CartProvider } from '@/lib/context/CartContext'
import { AuthProvider } from '@/lib/context/AuthContext'
import Navbar from './Navbar'
import { motion } from 'framer-motion'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <CartProvider>
            <div className="min-h-screen bg-[#050505] text-white flex flex-col">
                <Navbar />
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-0 flex-grow pt-0" // Reset pt-0 pois Hero cuida disso
                >
                    {children}
                </motion.main>
            </div>
        </CartProvider>
    </AuthProvider>
  )
}