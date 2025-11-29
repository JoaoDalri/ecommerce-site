import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SearchBar from './SearchBar'; // Assuma que existe

export default function Layout({ children }) {
  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">E-Shop</Link>
            <SearchBar products={[]} /> {/* Integre com produtos */}
            <div className="space-x-4">
              <Link href="/categories">Categorias</Link>
              <Link href="/cart">Carrinho ({cartItems.length})</Link>
              <Link href="/login">Login</Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="bg-blue-600 text-white py-4 text-center">© 2025 E-Shop</footer>
    </div>
  );
}