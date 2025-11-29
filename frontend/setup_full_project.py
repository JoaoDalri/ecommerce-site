import os

BASE_DIR = "src"

files_to_fix = {
    # ---------------------------
    # 1. CORREÇÃO DA SERIALIZAÇÃO (Service)
    # ---------------------------
    # Adicionamos .lean() e convertemos _id e datas para string
    f"{BASE_DIR}/services/productService.ts": """
import Product from '@/models/Product';
import dbConnect from '@/lib/dbConnect';

// Helper para limpar objetos do Mongoose
function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data));
}

export async function getFilteredProducts(filter: any) {
  await dbConnect();
  const { q, category, sort, id } = filter;
  
  let query: any = {};
  if (q) query.$text = { $search: q };
  if (category) query.category = category;
  if (id) query._id = id;

  let sortOption: any = {};
  if (sort === 'price_asc') sortOption.price = 1;
  if (sort === 'price_desc') sortOption.price = -1;

  const projection = 'title price category images oldPrice _id averageRating numReviews';

  // Nota: .lean() converte o documento Mongoose para um objeto JS simples (Plain Object)
  // Isso resolve o erro "Only plain objects can be passed..."
  const products = await Product.find(query)
    .sort(sortOption)
    .select(projection)
    .limit(20)
    .lean();

  return serializeData(products);
}

export async function getProductById(id: string) {
  await dbConnect();
  try {
    const product = await Product.findById(id).select('-__v').lean();
    if (!product) return null;
    return serializeData(product);
  } catch (error) {
    return null;
  }
}

export async function getRelatedProducts(productId: string, category: string) {
  await dbConnect();
  const related = await Product.find({
      category: category,
      _id: { $ne: productId }
  })
  .select('title price category images _id')
  .limit(4)
  .lean();
  
  return serializeData(related);
}
""",

    # ---------------------------
    # 2. CORREÇÃO DA PÁGINA HOME (Usa Service Atualizado)
    # ---------------------------
    f"{BASE_DIR}/app/page.tsx": """
import { Suspense } from 'react';
import HeroBanner from '@/components/HeroBanner';
import ProductShowcase from '@/components/ProductShowcase';
import { getFilteredProducts } from '@/services/productService';

export const dynamic = 'force-dynamic'; // Garante que a home não fica cacheada estaticamente com dados velhos

export const metadata = {
  title: 'LojaPro | As Melhores Ofertas',
  description: 'E-commerce completo com Next.js 15',
};

async function getProducts() {
  const products = await getFilteredProducts({ sort: 'price_desc' });
  return products || [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="pb-20">
      <HeroBanner />

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', title: 'Frete Grátis', desc: 'Acima de R$ 200' },
            { icon: '💳', title: 'Parcelamento', desc: 'Até 12x sem juros' },
            { icon: '🛡️', title: 'Compra Segura', desc: 'Certificado SSL' },
            { icon: '↩️', title: 'Troca Fácil', desc: '30 dias grátis' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            🔥 Destaques da Semana
          </h2>
        </div>

        <Suspense fallback={<div className="text-center py-10">A carregar ofertas...</div>}>
           <ProductShowcase products={products} />
        </Suspense>
      </section>
    </main>
  );
}
""",

    # ---------------------------
    # 3. PROTEÇÃO DA ROTA DE CHECKOUT (Erro de Chave)
    # ---------------------------
    f"{BASE_DIR}/app/api/checkout/session/route.ts": """
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';

export async function POST(req: Request) {
  // Verificação de Segurança da Chave
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_...')) {
    console.error("ERRO CRÍTICO: Chave do Stripe não configurada.");
    return NextResponse.json({ 
        error: 'Configuração de pagamento incompleta no servidor. Verifique o .env.local' 
    }, { status: 500 });
  }

  try {
    await dbConnect();
    const { items, user, shippingAddress, couponCode, shippingOption } = await req.json();

    let discounts = [];
    if (couponCode) {
      const dbCoupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (dbCoupon) {
        try {
             const stripeCoupon = await stripe.coupons.create({
               percent_off: dbCoupon.discountPercentage,
               duration: 'once',
               name: dbCoupon.code
             });
             discounts.push({ coupon: stripeCoupon.id });
        } catch(e) {
             console.log('Erro ao criar cupom no stripe (pode já existir)', e);
        }
      }
    }

    const productLineItems = items.map((item: any) => ({
      price_data: {
        currency: 'brl',
        product_data: { 
            name: item.title, 
            // Fallback para imagem se estiver vazia ou quebrada
            images: item.image && item.image.startsWith('http') ? [item.image] : [], 
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    
    if (shippingOption) {
        productLineItems.push({
            price_data: {
                currency: 'brl',
                product_data: { name: `Frete: ${shippingOption.name}` },
                unit_amount: Math.round(shippingOption.cost * 100),
            },
            quantity: 1,
        });
    }

    const total = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) + (shippingOption?.cost || 0);

    const order = await Order.create({
      user: user?.id || null,
      items: items.map((i: any) => ({ product: i.id, quantity: i.quantity, price: i.price })),
      total: total, 
      status: 'pending',
      shippingAddress,
      coupon: couponCode || null,
      shippingPrice: shippingOption?.cost || 0
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: productLineItems,
      mode: 'payment',
      discounts: discounts, 
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cart`,
      metadata: { orderId: order._id.toString() },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
""",
    
    # ---------------------------
    # 4. SEEDER ATUALIZADO (Imagens Funcionais)
    # ---------------------------
    # Substitui as imagens do Unsplash que estão a dar 404 por imagens placeholder confiáveis
    f"scripts/seed.js": """
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, index: true },
  images: [String],
  stock: { type: Number, default: 10 },
  featured: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const electronics = [
  {
    title: "Smartphone Galaxy S23",
    description: "Smartphone topo de linha com câmera incrível.",
    price: 5999.90,
    category: "Eletrônicos",
    images: ["https://placehold.co/600x400/png?text=Galaxy+S23"],
    stock: 15,
    featured: true,
    averageRating: 4.8,
    numReviews: 10
  },
  {
    title: "MacBook Pro M2",
    description: "Notebook para profissionais criativos.",
    price: 12499.00,
    category: "Eletrônicos",
    images: ["https://placehold.co/600x400/png?text=MacBook+Pro"],
    stock: 5,
    featured: true,
    averageRating: 5.0,
    numReviews: 5
  },
  {
    title: "Fone Sony WH-1000XM5",
    description: "Cancelamento de ruído líder da indústria.",
    price: 1899.00,
    category: "Eletrônicos",
    images: ["https://placehold.co/600x400/png?text=Sony+Headphone"],
    stock: 20,
    featured: false,
    averageRating: 4.7,
    numReviews: 12
  },
  {
    title: "Camiseta Oversized",
    description: "Algodão 100% de alta qualidade.",
    price: 89.90,
    category: "Moda",
    images: ["https://placehold.co/600x400/png?text=T-Shirt"],
    stock: 100,
    featured: false,
    averageRating: 4.5,
    numReviews: 2
  },
  {
    title: "Tênis de Corrida",
    description: "Conforto e performance para seus treinos.",
    price: 299.90,
    category: "Moda",
    images: ["https://placehold.co/600x400/png?text=Running+Shoes"],
    stock: 30,
    featured: true,
    averageRating: 4.8,
    numReviews: 8
  }
];

async function seed() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('🧹 Limpando produtos antigos...');
    await Product.deleteMany({});

    console.log('🌱 Inserindo novos produtos...');
    await Product.insertMany(electronics);

    console.log('✨ Sucesso! Banco de dados populado.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

seed();
"""
}

def apply_final_fixes():
    print("🚑 Aplicando correção crítica de serialização e pagamentos...")
    
    for path, content in files_to_fix.items():
        # Garante que o diretório existe
        dir_name = os.path.dirname(path)
        if dir_name and not os.path.exists(dir_name):
            os.makedirs(dir_name)
            
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print(f"✅ Corrigido: {path}")

    print("\n⚠️ AVISO FINAL SOBRE STRIPE ⚠️")
    print("O erro 'Invalid API Key' que viu no log acontece porque a chave no seu arquivo .env.local ainda é a padrão.")
    print("1. Abra o arquivo 'frontend/.env.local'")
    print("2. Substitua 'sk_test_...' pela sua chave real do Dashboard do Stripe.")
    print("3. Execute 'node scripts/seed.js' para corrigir as imagens quebradas.")
    print("4. Reinicie com 'npm run dev'.")

if __name__ == "__main__":
    apply_final_fixes()