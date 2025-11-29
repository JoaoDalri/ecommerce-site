'use client'
import Link from 'next/link'
import { useCart } from '@/lib/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function CartPage(){
  const { items, remove, clear, total } = useCart()

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <span className="text-primary-accent">/</span> Carrinho
      </h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-white/5">
          <p className="text-xl text-muted mb-6">Seu carrinho está no vazio sideral.</p>
          <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-colors">
            Voltar para a Loja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(i => (
                <motion.div 
                  key={i.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-white/5"
                >
                  <div className="w-20 h-20 bg-black/20 rounded-lg p-2 flex-shrink-0">
                     <Image src={i.img || '/next.svg'} width={64} height={64} alt={i.title} className="w-full h-full object-contain"/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{i.title}</h3>
                    <p className="text-sm text-muted">R$ {i.price.toFixed(2)} x {i.qty}</p>
                  </div>
                  <button onClick={() => remove(i.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    Remover
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={() => clear()} className="text-sm text-muted hover:text-white underline">
                Limpar tudo
            </button>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-white/5 h-fit sticky top-24">
            <h3 className="text-xl font-bold mb-6">Resumo</h3>
            <div className="flex justify-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-muted">Frete</span>
              <span className="text-primary-accent font-bold">Grátis</span>
            </div>
            <div className="border-t border-white/10 pt-4 mb-6">
               <div className="flex justify-between text-2xl font-bold">
                 <span>Total</span>
                 <span>R$ {total.toFixed(2)}</span>
               </div>
            </div>
            <form action="/api/checkout" method="post">
              <button type="submit" className="w-full py-4 bg-primary-accent hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-[1.02]">
                Finalizar Compra
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  )
}