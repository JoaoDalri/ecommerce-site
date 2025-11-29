'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/CartContext' // Erro proposital no import corrigido abaixo
import { motion } from 'framer-motion'
// Correção do import manual, pois o AuthContext é novo
import { useAuth as useAuthCorrect } from '@/lib/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthCorrect()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
        login(email)
        router.push('/')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] animate-pulse delay-1000" />

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 relative z-10"
        >
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-primary/30">
                    L
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
                <p className="text-gray-400">Acesse sua conta Lumina</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="seu@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Senha</label>
                    <input 
                        type="password" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-primary hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] flex items-center justify-center"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        "Entrar na Matrix"
                    )}
                </button>
            </form>
            
            <p className="text-center text-gray-500 text-sm mt-6">
                Não tem conta? <span className="text-primary cursor-pointer hover:underline">Criar agora</span>
            </p>
        </motion.div>
    </div>
  )
}