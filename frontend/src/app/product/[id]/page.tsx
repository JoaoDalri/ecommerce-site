'use client'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'


const fetcher = (url: string) => fetch(url).then(r => r.json())


export default function ProductPage({ params }: any){
const { id } = params
const { data } = useSWR(`/api/products/${id}`, fetcher)
const product = data?.product
const { add } = useCart()
const router = useRouter()


if (!product) return <div className="container py-8">Produto não encontrado</div>


return (
<div className="container py-8">
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div>
<div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center">
<img src={product.img || '/next.svg'} alt="" className="max-h-full" />
</div>
</div>
<div>
<h1 className="text-2xl font-bold">{product.title}</h1>
<p className="text-gray-600 mt-2">{product.description}</p>
<div className="text-3xl font-extrabold mt-4">R$ {product.price.toFixed(2)}</div>
<div className="mt-6 flex gap-3">
<button onClick={() => { add({ id: product._id, title: product.title, price: product.price }); router.push('/cart') }} className="px-5 py-2 bg-blue-600 text-white rounded-lg">Comprar</button>
<button className="px-5 py-2 border rounded-lg">Adicionar à lista</button>
</div>
</div>
</div>
</div>
)
}