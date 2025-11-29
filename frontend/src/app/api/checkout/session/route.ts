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