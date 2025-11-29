'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'


type CartItem = { id: string; title: string; price: number; qty: number }


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
const [items, setItems] = useState<CartItem[]>(() => {
try { const raw = localStorage.getItem('cart'); return raw ? JSON.parse(raw) : [] } catch { return [] }
})


useEffect(() => {
try { localStorage.setItem('cart', JSON.stringify(items)) } catch {}
}, [items])


const add = (p: Omit<CartItem,'qty'>) => {
setItems(prev => {
const ex = prev.find(x => x.id === p.id)
if (ex) return prev.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x)
return [...prev, { ...p, qty: 1 }]
})
}
const remove = (id: string) => setItems(prev => prev.filter(x => x.id !== id))
const clear = () => setItems([])
const total = items.reduce((s, i) => s + i.price * i.qty, 0)


return (
<CartContext.Provider value={{ items, add, remove, clear, total }}>
{children}
</CartContext.Provider>
)
}