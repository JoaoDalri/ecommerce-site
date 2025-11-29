'use client'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'


export default function ProductCard({ product }: any) {
    const { add } = useCart()
    return (
        <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200">
            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <Image src={product.img || '/next.svg'} width={80} height={80} alt={product.title} />
            </div>
            <h4 className="mt-3 font-semibold">{product.title}</h4>
            <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
            <button onClick={() => add({ id: product._id, title: product.title, price: product.price })} className="mt-3 w-full py-2 bg-blue-600 text-white rounded-xl">
                Comprar
            </button>
        </div>
    )
}