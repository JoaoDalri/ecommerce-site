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