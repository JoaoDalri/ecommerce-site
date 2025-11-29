'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

type CartItem = { id: string; title: string; price: number; qty: number; img?: string }

type CartCtx = {
  items: CartItem[]
  add: (p: Omit<CartItem, 'qty'>) => void
  remove: (id: string) => void
  clear: () => void
  total: number
}

const CartContext = createContext<CartCtx | undefined>(undefined)

export function useCart(){
  const c = useContext(CartContext)
  if (!c) throw new Error('useCart must be used inside CartProvider')
  return c
}

export function CartProvider({ children }: { children: React.ReactNode }){
  // Inicializa sempre como array vazio para evitar undefined
  const [items, setItems] = useState<CartItem[]>([])

  // Carregar do localStorage com verificação de tipo
  useEffect(() => {
    try {
        const raw = localStorage.getItem('cart')
        if (raw) {
            const parsed = JSON.parse(raw)
            // Só define se for realmente um array
            if (Array.isArray(parsed)) {
                setItems(parsed)
            }
        }
    } catch (e) {
        console.error("Erro ao carregar carrinho:", e)
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    if (Array.isArray(items) && items.length > 0) {
        try { localStorage.setItem('cart', JSON.stringify(items)) } catch {}
    }
  }, [items])
  
  const add = (p: Omit<CartItem,'qty'>) => {
    setItems(prev => {
      // Garante que prev é um array antes de usar
      const currentItems = Array.isArray(prev) ? prev : []
      const ex = currentItems.find(x => x.id === p.id)
      let newItems;
      if (ex) {
          newItems = currentItems.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x)
      } else {
          newItems = [...currentItems, { ...p, qty: 1 }]
      }
      try { localStorage.setItem('cart', JSON.stringify(newItems)) } catch {}
      return newItems
    })
  }
  
  const remove = (id: string) => {
      setItems(prev => {
          const currentItems = Array.isArray(prev) ? prev : []
          const newItems = currentItems.filter(x => x.id !== id)
          try { localStorage.setItem('cart', JSON.stringify(newItems)) } catch {}
          return newItems
      })
  }

  const clear = () => {
      setItems([])
      try { localStorage.removeItem('cart') } catch {}
  }

  // Cálculo seguro do total
  const safeItems = Array.isArray(items) ? items : []
  const total = safeItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)

  return (
    <CartContext.Provider value={{ items: safeItems, add, remove, clear, total }}>
      {children}
    </CartContext.Provider>
  )
}