'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Pedidos', href: '/admin/orders', icon: '📦' },
  { name: 'Produtos', href: '/admin/products', icon: '🏷️' },
  { name: 'Criar Produto', href: '/admin/products/new', icon: '➕' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex-shrink-0 hidden md:block">
      <div className="p-6 text-2xl font-bold border-b border-gray-800">Admin ⚡</div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === item.href ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
        <Link href="/" className="flex items-center gap-3 px-4 py-3 mt-10 text-red-400 hover:bg-gray-800 rounded-lg">
          ⬅ Voltar à Loja
        </Link>
      </nav>
    </aside>
  );
}