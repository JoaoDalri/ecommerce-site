import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext' // NOVO: Importar AuthProvider
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LojaPro E-Commerce',
  description: 'Otimização, Venda Cruzada e Checkout Completo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <AuthProvider> {/* ENVOLVER com AuthProvider */}
          <CartProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}