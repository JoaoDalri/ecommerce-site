'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'


export default function CartPage(){
const { items, remove, clear, total } = useCart()
return (
<div className="container py-10">
<h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
{items.length === 0 ? (
<div>
<p>Seu carrinho está vazio.</p>
<Link href="/">Voltar às compras</Link>
</div>
) : (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="md:col-span-2 space-y-4">
{items.map(i => (
<div key={i.id} className="flex items-center gap-4 bg-white p-4 rounded-lg border">
<div className="w-20 h-20 bg-gray-100 rounded-md" />
<div className="flex-1">
<div className="font-semibold">{i.title}</div>
<div className="text-sm text-gray-600">R$ {i.price.toFixed(2)} x {i.qty}</div>
</div>
<div>
<button onClick={() => remove(i.id)} className="text-sm text-red-600">Remover</button>
</div>
</div>
))}
<button onClick={() => clear()} className="mt-4 text-sm text-red-600">Limpar carrinho</button>
</div>


<div className="bg-white p-6 rounded-lg border">
<div className="font-semibold">Resumo</div>
<div className="text-lg font-bold mt-4">R$ {total.toFixed(2)}</div>
<form action="/api/checkout" method="post">
<button type="submit" className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg">Finalizar compra</button>
</form>
</div>
</div>
)}
</div>
)
}