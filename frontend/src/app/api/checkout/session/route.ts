import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import { sendEmail } from '@/lib/email'; 

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { items, user, shippingAddress, couponCode, shippingOption } = await req.json(); // RECEBE Frete
    
    // Validar e aplicar desconto de Cupom
    let discounts = [];
    if (couponCode) {
      const dbCoupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (dbCoupon) {
        const stripeCoupon = await stripe.coupons.create({
          percent_off: dbCoupon.discountPercentage,
          duration: 'once',
          name: dbCoupon.code
        });
        discounts.push({ coupon: stripeCoupon.id });
      }
    }

    // Preparar Itens e Frete para o Stripe
    const productLineItems = items.map((item: any) => ({
      price_data: {
        currency: 'brl',
        product_data: { name: item.title, images: item.image ? [item.image] : [], },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    
    // Adicionar Frete como um item de linha separado (Formato Stripe)
    const shippingLineItem = shippingOption && {
      price_data: {
        currency: 'brl',
        product_data: { name: `Frete (${shippingOption.name.split(' ')[0]})` },
        unit_amount: Math.round(shippingOption.cost * 100),
      },
      quantity: 1,
    };

    const allLineItems = shippingLineItem ? [...productLineItems, shippingLineItem] : productLineItems;
    
    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const totalWithShipping = subtotal + (shippingOption?.cost || 0);

    // Criar o pedido local (Status: Pendente)
    const order = await Order.create({
      user: user?.id || null,
      items: items.map((i: any) => ({ product: i.id, quantity: i.quantity, price: i.price })),
      total: totalWithShipping, 
      status: 'pending',
      shippingAddress,
      coupon: couponCode || null,
      shippingPrice: shippingOption?.cost || 0, // Salvar custo do frete
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: allLineItems, // Usar todos os itens (produtos + frete)
      mode: 'payment',
      discounts: discounts, 
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cart`,
      metadata: { orderId: order._id.toString() },
    });

    // Enviar Email (Passo 8)
    if(user?.email) {
        await sendEmail({
            to: user.email,
            subject: `🛒 Pedido #${order._id.toString().slice(-6)} recebido!`,
            html: `<h1>O seu pedido está à espera de pagamento</h1><p>Obrigado pela sua compra. O seu pedido está pendente de pagamento no valor de R$ ${totalWithShipping.toFixed(2)}.</p><p>Acompanhe o status: <a href="http://localhost:3000/profile/orders">Meus Pedidos</a></p>`
        });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Erro no Stripe/Order API:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}