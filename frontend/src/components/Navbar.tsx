'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // NOVO: Importar useAuth

export default function Navbar() {
  const { items } = useCart();
  const { isAuthenticated, user, logout } = useAuth(); // Usar Auth Context
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LojaPro
          </Link>

          {/* Busca */}
          <div className="hidden md:flex flex-1 mx-10 relative">
            <input 
              type="text" 
              placeholder="O que procura hoje?" 
              className="w-full border rounded-full py-2 px-4 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <button className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600">
              🔍
            </button>
          </div>

          {/* Ícones e Menu */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
                // Se Logado
                <Link href="/profile" className="hidden md:block text-gray-600 hover:text-blue-600 font-semibold">
                    👤 {user?.name.split(' ')[0]}
                </Link>
            ) : (
                // Se Deslogado
                <Link href="/login" className="hidden md:block text-gray-600 hover:text-blue-600">
                    Login
                </Link>
            )}
            
            <Link href="/cart" className="relative text-gray-600 hover:text-blue-600">
              🛒
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-2xl">
              ☰
            </button>
          </div>
        </div>

        {/* Categorias (Sub-menu) */}
        <div className="hidden md:flex gap-8 mt-4 text-sm font-medium text-gray-600 overflow-x-auto pb-2">
          <Link href="/search?category=Eletrônicos" className="hover:text-blue-600 whitespace-nowrap">Eletrónicos</Link>
          <Link href="/search?category=Moda" className="hover:text-blue-600 whitespace-nowrap">Moda</Link>
          <Link href="/search" className="hover:text-blue-600 whitespace-nowrap">Busca Avançada</Link>
          {user?.role === 'admin' && (
              <Link href="/admin" className="text-purple-500 font-bold hover:text-purple-700 whitespace-nowrap">
                  ⭐ Admin Dashboard
              </Link>
          )}
        </div>
      </div>
    </nav>
  );
}