import os

BASE_DIR = "src"

files_to_create = {
    # ---------------------------
    # 1. MODELO DE CUPÃO
    # ---------------------------
    f"{BASE_DIR}/models/Coupon.ts": """
import mongoose, { Schema } from 'mongoose';

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercentage: { type: Number, required: true, min: 1, max: 100 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
""",

    # ---------------------------
    # 2. API DE VALIDAÇÃO (Frontend usa esta)
    # ---------------------------
    f"{BASE_DIR}/app/api/coupons/validate/route.ts": """
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon';

export async function POST(req: Request) {
  await dbConnect();
  const { code } = await req.json();

  if (!code) return NextResponse.json({ error: 'Código necessário' }, { status: 400 });

  const coupon = await Coupon.findOne({ 
    code: code.toUpperCase(),
    isActive: true,
    expiryDate: { $gt: new Date() } // Data futura
  });

  if (!coupon) {
    return NextResponse.json({ error: 'Cupom inválido ou expirado' }, { status: 400 });
  }

  return NextResponse.json({ 
    code: coupon.code, 
    discount: coupon.discountPercentage 
  });
}
""",

    # ---------------------------
    # 3. API DE GESTÃO (Admin usa esta)
    # ---------------------------
    f"{BASE_DIR}/app/api/coupons/route.ts": """
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon';

export async function GET() {
  await dbConnect();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const coupon = await Coupon.create({
      ...body,
      code: body.code.toUpperCase()
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await Coupon.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
""",

    # ---------------------------
    # 4. ATUALIZAR CONTEXTO (Adicionar Lógica de Desconto)
    # ---------------------------
    f"{BASE_DIR}/context/CartContext.tsx": """
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  coupon: { code: string; discount: number } | null;
  total: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product._id || i.id === product.id);
      if (existing) {
        return prev.map(i => (i.id === product._id || i.id === product.id) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: product._id || product.id, 
        title: product.title || product.name, 
        price: product.price, 
        image: product.images?.[0] || product.image || '', 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    localStorage.removeItem('cart');
  };

  const applyCoupon = (code: string, discount: number) => {
    setCoupon({ code, discount });
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = coupon ? subtotal * (1 - coupon.discount / 100) : subtotal;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, applyCoupon, coupon, total, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
""",

    # ---------------------------
    # 5. UI DO CARRINHO (Com input de cupão)
    # ---------------------------
    f"{BASE_DIR}/app/cart/page.tsx": """
'use client'
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeFromCart, subtotal, total, coupon, applyCoupon } = useCart();
  const router = useRouter();
  const [couponInput, setCouponInput] = useState('');
  const [message, setMessage] = useState('');

  async function handleApplyCoupon() {
    if (!couponInput) return;
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: couponInput })
    });
    const data = await res.json();
    
    if (res.ok) {
      applyCoupon(data.code, data.discount);
      setMessage(`Cupom ${data.code} aplicado: -${data.discount}%`);
    } else {
      setMessage(data.error);
    }
  }

  if (items.length === 0) return (
    <div className="container mx-auto py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
      <Link href="/" className="text-blue-600 underline">Voltar as compras</Link>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Meu Carrinho</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-xl shadow overflow-hidden h-fit">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-6 border-b last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : '📦'}
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-gray-500">Qtd: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Remover</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl h-fit border">
          <h3 className="font-bold text-lg mb-4">Resumo</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          
          {coupon && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Desconto ({coupon.code})</span>
              <span>- {coupon.discount}%</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-xl border-t pt-4 mt-2">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          {/* Área de Cupão */}
          <div className="mt-6 mb-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Cupom de desconto" 
                className="border p-2 rounded w-full uppercase"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
              />
              <button onClick={handleApplyCoupon} className="bg-gray-800 text-white px-4 rounded">OK</button>
            </div>
            {message && <p className="text-xs mt-2 text-blue-600">{message}</p>}
          </div>

          <button 
            onClick={() => router.push('/checkout')}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
""",

    # ---------------------------
    # 6. ADMIN - LISTA DE CUPÕES
    # ---------------------------
    f"{BASE_DIR}/app/admin/coupons/page.tsx": """
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetch('/api/coupons').then(res => res.json()).then(setCoupons);
  }, []);

  async function handleDelete(id: string) {
    if(!confirm('Apagar este cupom?')) return;
    await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
    setCoupons(prev => prev.filter((c: any) => c._id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
        <Link href="/admin/coupons/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Criar Cupom
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Código</th>
              <th className="p-4">Desconto</th>
              <th className="p-4">Expira em</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((c: any) => (
              <tr key={c._id}>
                <td className="p-4 font-bold text-blue-600">{c.code}</td>
                <td className="p-4">{c.discountPercentage}%</td>
                <td className="p-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:underline">Apagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",

    # ---------------------------
    # 7. ADMIN - NOVO CUPÃO
    # ---------------------------
    f"{BASE_DIR}/app/admin/coupons/new/page.tsx": """
'use client';
import { useRouter } from 'next/navigation';

export default function NewCoupon() {
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const res = await fetch('/api/coupons', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (res.ok) router.push('/admin/coupons');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow border">
      <h1 className="text-2xl font-bold mb-6">Novo Cupom</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Código (Ex: VERÃO10)</label>
          <input name="code" required className="w-full border p-2 rounded uppercase" />
        </div>
        <div>
          <label className="block text-sm mb-1">Porcentagem de Desconto (%)</label>
          <input name="discountPercentage" type="number" min="1" max="100" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Data de Validade</label>
          <input name="expiryDate" type="date" required className="w-full border p-2 rounded" />
        </div>
        <button className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Criar</button>
      </form>
    </div>
  );
}
""",

    # ---------------------------
    # 8. ATUALIZAR CHECKOUT SESSION (Para aplicar desconto no Stripe)
    # ---------------------------
    f"{BASE_DIR}/app/api/checkout/session/route.ts": """
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { items, user, shippingAddress, couponCode } = await req.json();

    let discounts = [];
    
    // Validar Cupom no Backend antes de enviar ao Stripe
    if (couponCode) {
      const dbCoupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (dbCoupon) {
        // Criar um cupom temporário no Stripe para esta sessão
        // Nota: Em produção, idealmente sincronizaria os cupons, mas isto funciona para checkout dinâmico
        const stripeCoupon = await stripe.coupons.create({
          percent_off: dbCoupon.discountPercentage,
          duration: 'once',
          name: dbCoupon.code
        });
        discounts.push({ coupon: stripeCoupon.id });
      }
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Criar o pedido local
    const order = await Order.create({
      user: user?.id || null,
      items: items.map((i: any) => ({ product: i.id, quantity: i.quantity, price: i.price })),
      total: 0, // Será atualizado pelo webhook ou sucesso
      status: 'pending',
      shippingAddress,
      coupon: couponCode || null
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      discounts: discounts, // Aplica o desconto aqui
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cart`,
      metadata: { orderId: order._id.toString() },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
""",
    # Atualizar também a pagina checkout/page.tsx para enviar o couponCode
    f"{BASE_DIR}/app/checkout/page.tsx": """
'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, coupon } = useCart();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) return <div className="p-10 text-center">Seu carrinho está vazio.</div>;

  async function handleStripeCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const shippingAddress = {
      street: formData.get('street'),
      city: formData.get('city'),
      zip: formData.get('zip'),
    };

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          user, 
          shippingAddress,
          couponCode: coupon?.code // Envia o código do cupão
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro: ' + data.error);
        setLoading(false);
      }
    } catch (err) {
      alert('Erro de conexão');
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form id="checkout-form" onSubmit={handleStripeCheckout} className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
            <h2 className="text-xl font-semibold">📍 Endereço de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="street" required placeholder="Rua e Número" className="border p-3 rounded w-full md:col-span-2" />
              <input name="city" required placeholder="Cidade" className="border p-3 rounded w-full" />
              <input name="zip" required placeholder="Código Postal" className="border p-3 rounded w-full" />
            </div>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl h-fit border">
          <h3 className="text-lg font-bold mb-4">Resumo</h3>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.title}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          {coupon && (
            <div className="flex justify-between text-green-600 mb-2 text-sm">
              <span>Cupom ({coupon.code})</span>
              <span>-{coupon.discount}%</span>
            </div>
          )}
          
          <div className="border-t pt-4 flex justify-between font-bold text-xl">
            <span>Total a Pagar</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          
          <button 
            form="checkout-form"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Redirecionando...' : 'Pagar com Stripe'}
          </button>
        </div>
      </div>
    </div>
  );
}
"""
}

def create_part7():
    print("🏷️ Criando Passo 7: Sistema de Cupons...")
    for path, content in files_to_create.items():
        dir_name = os.path.dirname(path)
        if dir_name and not os.path.exists(dir_name):
            os.makedirs(dir_name)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print(f"✅ {path}")

    print("\n✨ Funcionalidade de Cupons Instalada!")
    print("👉 1. Vá a http://localhost:3000/admin/coupons/new para criar um cupão (ex: PROMO20).")
    print("👉 2. Adicione produtos ao carrinho e teste o cupão.")

if __name__ == "__main__":
    create_part7()