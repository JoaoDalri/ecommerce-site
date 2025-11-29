'use client'
import Link from 'next/link'
import { useCart } from '@/lib/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function CartPage(){
  const { items, remove, clear, total } = useCart()
  
  // Garantia extra: se items for undefined por algum motivo, usa array vazio
  const cartItems = Array.isArray(items) ? items : []

  return (
    <div className="min-h-screen pt-28 pb-20 container mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Seu Carrinho</h1>
      
      {cartItems.length === 0 ? (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-12 rounded-3xl text-center max-w-2xl mx-auto border border-white/10"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-400 mb-8">Parece que você ainda não adicionou nenhum item.</p>
          <Link href="/" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Começar a Comprar
          </Link>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map(i => (
                <motion.div 
                  key={i.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="glass-card p-4 rounded-2xl flex items-center gap-6 border border-white/5"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-xl p-2 flex-shrink-0 relative overflow-hidden">
                     <Image src={i.img || '/next.svg'} fill alt={i.title} className="object-contain p-2"/>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{i.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">ID: {i.id ? i.id.substring(0,6) : '...'}</p>
                    <div className="flex items-center gap-4">
                        <span className="text-primary font-bold">R$ {i.price.toFixed(2)}</span>
                        <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">Qtd: {i.qty}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => remove(i.id)} 
                    className="p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-gray-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <div className="flex justify-end pt-4">
                <button onClick={() => clear()} className="text-sm text-red-400 hover:text-red-300 font-medium hover:underline">
                    Esvaziar Carrinho
                </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl h-fit sticky top-28 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Resumo do Pedido</h3>
            
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Envio</span>
                  <span className="text-green-400">Grátis</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Taxas</span>
                  <span>R$ 0,00</span>
                </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-8">
               <div className="flex justify-between items-end">
                 <span className="text-gray-200">Total</span>
                 <span className="text-3xl font-bold text-white">R$ {total.toFixed(2)}</span>
               </div>
            </div>

            <form action="/api/checkout" method="post">
              <button type="submit" className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-lg shadow-lg shadow-white/10 transition-all transform hover:scale-[1.02]">
                Finalizar Compra
              </button>
            </form>
            
            <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                Checkout Seguro
            </p>
          </div>

        </div>
      )}
    </div>
  )
}