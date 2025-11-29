'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LojaPro
          </Link>

          {/* Busca (Desktop) */}
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
            <Link href="/profile" className="hidden md:block text-gray-600 hover:text-blue-600">
              👤 Minha Conta
            </Link>
            <Link href="/cart" className="relative text-gray-600 hover:text-blue-600">
              🛒
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-2xl">
              ☰
            </button>
          </div>
        </div>

        {/* Categorias (Sub-menu) */}
        <div className="hidden md:flex gap-8 mt-4 text-sm font-medium text-gray-600 overflow-x-auto pb-2">
          <Link href="/search?category=eletronicos" className="hover:text-blue-600 whitespace-nowrap">Eletrónicos</Link>
          <Link href="/search?category=moda" className="hover:text-blue-600 whitespace-nowrap">Moda</Link>
          <Link href="/search?category=casa" className="hover:text-blue-600 whitespace-nowrap">Casa & Jardim</Link>
          <Link href="/search?category=desporto" className="hover:text-blue-600 whitespace-nowrap">Desporto</Link>
          <Link href="/offers" className="text-red-500 font-bold hover:text-red-600 whitespace-nowrap">🔥 Ofertas do Dia</Link>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 p-4 border-t">
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Buscar..." className="p-2 border rounded mb-2" />
            <Link href="/category/eletronicos">Eletrónicos</Link>
            <Link href="/category/moda">Moda</Link>
            <Link href="/profile">Minha Conta</Link>
          </div>
        </div>
      )}
    </nav>
  );
}