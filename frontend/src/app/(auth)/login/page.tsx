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