import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function POST(req: Request) {
  // Validação de Segurança da Chave Stripe
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey.includes('sua_chave') || stripeKey.length < 10) {
      return NextResponse.json({ 
          error: 'CONFIGURAÇÃO: Chave do Stripe inválida no .env.local. Adicione uma chave real (sk_test_...).' 
      }, { status: 500 });
  }

  try {
    await dbConnect();
    const { items, user, shippingAddress, shippingOption } = await req.json();

    // Cria itens para o Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'brl',
        product_data: { 
            name: item.title,
            images: item.image ? [item.image] : [] 
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Adiciona Frete se existir
    if (shippingOption) {
        line_items.push({
            price_data: {
                currency: 'brl',
                product_data: { name: `Frete: ${shippingOption.name}` },
                unit_amount: Math.round(shippingOption.cost * 100),
            },
            quantity: 1,
        });
    }

    // Calcular total
    const total = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) + (shippingOption?.cost || 0);

    // Criar Pedido
    const order = await Order.create({
      user: user?.id || null,
      items: items.map((i: any) => ({ product: i.id, quantity: i.quantity, price: i.price })),
      total: total,
      status: 'pending',
      shippingAddress,
      shippingPrice: shippingOption?.cost || 0
    });

    // Criar Sessão
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
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