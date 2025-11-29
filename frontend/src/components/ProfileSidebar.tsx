'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Visão Geral', href: '/profile', icon: '👤' },
  { name: 'Meus Pedidos', href: '/profile/orders', icon: '📦' },
  { name: 'Endereços', href: '/profile/address', icon: '📍' },
  { name: 'Favoritos', href: '/profile/wishlist', icon: '❤️' },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border p-6 h-fit">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
          U
        </div>
        <div>
          <p className="text-sm text-gray-500">Bem-vindo,</p>
          <p className="font-bold text-gray-800">Usuário</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
        <button 
          onClick={() => { 
            localStorage.removeItem('user'); 
            window.location.href = '/login'; 
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg mt-4 transition"
        >
          <span>🚪</span> Sair
        </button>
      </nav>
    </aside>
  );
}