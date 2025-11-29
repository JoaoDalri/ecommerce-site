import os

BASE_DIR = "src"

files_to_create = {
    # ---------------------------
    # 1. MODELO DE PRODUTO FINAL (Com Reviews)
    # ---------------------------
    f"{BASE_DIR}/models/Product.ts": """
import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  oldPrice: Number,
  category: { type: String, index: true },
  images: [String],
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  reviews: [ReviewSchema],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

ProductSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
""",
    # ---------------------------
    # 2. AUTH CONTEXT (NOVO: Para gerir o estado de login de forma global)
    # ---------------------------
    f"{BASE_DIR}/context/AuthContext.tsx": """
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta carregar usuário do localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
""",
    # ---------------------------
    # 3. ATUALIZAR LAYOUT (Incluir AuthProvider)
    # ---------------------------
    f"{BASE_DIR}/app/layout.tsx": """
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
""",
    # ---------------------------
    # 4. COMPONENTE NAVBAR FINAL (Com estado de Login)
    # ---------------------------
    f"{BASE_DIR}/components/Navbar.tsx": """
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
""",
    # ---------------------------
    # 5. ATUALIZAR PRODUCT CARD (Final, otimizado com Next/Image)
    # ---------------------------
    # Este card agora USA O NEXT/IMAGE COMPONENT, desfazendo o experimento Sharp, para performance real.
    f"{BASE_DIR}/components/ProductCard.tsx": """
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Image from 'next/image'; 

interface ProductCardProps {
  product: any;
  onQuickView: (product: any) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const imageSrc = product.images?.[0] || '/placeholder.png'; // Fallback seguro

  return (
    <div className="group bg-white rounded-xl border hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {product.oldPrice && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          -20%
        </span>
      )}

      {/* Ações Flutuantes */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-10 translate-x-4 group-hover:translate-x-0">
        <button 
          onClick={() => onQuickView(product)}
          className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 text-gray-600" 
          title="Visualização Rápida"
        >
          👁️
        </button>
        <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 text-gray-600" title="Favoritos">
          ♥
        </button>
      </div>

      <Link href={`/product/${product._id}`}>
        <div className="h-60 bg-gray-50 flex items-center justify-center p-6 relative">
          {/* USANDO OTIMIZAÇÃO NATIVA DO NEXT/IMAGE (MELHOR PARA PRODUÇÃO) */}
          <Image 
            src={imageSrc} 
            alt={product.title} 
            fill // Preenche o container
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: 'contain' }}
            className="group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" 
          />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <Link href={`/product/${product._id}`}>
          <h3 className="font-bold text-gray-800 truncate hover:text-blue-600 mb-2">{product.title}</h3>
        </Link>
        
        <div className="flex items-end justify-between mt-2">
          <div>
            {product.oldPrice && <span className="text-sm text-gray-400 line-through">R$ {product.oldPrice}</span>}
            <div className="text-lg font-bold text-blue-600">R$ {product.price.toFixed(2)}</div>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            + 🛒
          </button>
        </div>
      </div>
    </div>
  );
}
""",
    # ---------------------------
    # 6. ATUALIZAR LOGIN PAGE (Para usar AuthContext)
    # ---------------------------
    f"{BASE_DIR}/app/(auth)/login/page.tsx": """
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // NOVO

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Usar função login do contexto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const userData = await res.json();
      if (!res.ok) throw new Error(userData.error || 'Login falhou');

      login(userData); // SALVAR USUÁRIO NO CONTEXTO
      router.push('/profile');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bem-vindo de volta</h1>
          <p className="text-gray-500 mt-2">Acesse a sua conta para continuar</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input name="password" type="password" required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Não tem conta? <Link href="/register" className="text-blue-600 font-bold hover:underline">Crie uma agora</Link>
        </div>
      </div>
    </div>
  );
}
""",
    # ---------------------------
    # 7. ATUALIZAR ADMIN DASHBOARD (Para usar Server Components)
    # ---------------------------
    f"{BASE_DIR}/app/admin/page.tsx": """
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

async function getStats() {
  await dbConnect();
  // Busca otimizada usando lean()
  const totalOrders = await Order.countDocuments().lean();
  const totalProducts = await Product.countDocuments().lean();
  const totalUsers = await User.countDocuments().lean();
  
  const salesData = await Order.aggregate([
    { $match: { isPaid: true } }, // Apenas vendas pagas
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  const totalSales = salesData[0]?.total || 0;

  return { totalOrders, totalProducts, totalUsers, totalSales };
}

export default async function AdminDashboard() {
  // Dados buscados no Server Component (Otimizado)
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel de Controle</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Vendas Totais</h3>
          <p className="text-3xl font-bold text-green-600">R$ {stats.totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pedidos</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Produtos</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Clientes</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4">Atividade Recente</h2>
        <p className="text-gray-500">Apenas os pedidos pagos entram no cálculo de Vendas Totais.</p>
      </div>
    </div>
  );
}
"""
}

def create_consolidation_script():
    print("🧹 Iniciando a Consolidação e Correção Arquitetural...")
    
    # Criar pasta context
    os.makedirs(f"{BASE_DIR}/context", exist_ok=True)
    os.makedirs(f"{BASE_DIR}/app/(auth)", exist_ok=True)
    
    for path, content in files_to_create.items():
        dir_name = os.path.dirname(path)
        if dir_name and not os.path.exists(dir_name):
            os.makedirs(dir_name)
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print(f"✅ Arquivo consolidado/atualizado: {path}")

    # AVISO: O arquivo CartContext.tsx é complexo e foi corrigido no script
    # Ele precisa ser substituído pelo novo conteúdo final do Passo 9.
    
    # O arquivo ProductCard.tsx (Passo 13) foi revertido para usar o Next/Image de forma otimizada (produção)
    # e não a API Sharp customizada, que é mais um demo do que uma solução final de escalabilidade.

    print("\n✅ Consolidação Concluída! O Auth Context e as principais páginas estão corrigidas.")

if __name__ == "__main__":
    create_consolidation_script()