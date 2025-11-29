import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getRawBody } from '@/lib/utils/rawBody'; // Novo helper
import Order from '@/models/Order';
import { sendEmail } from '@/lib/email'; 

// IMPORTANTE: Necessário para o Next.js não parsear o body como JSON (precisamos do raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const buf = await getRawBody(req);
  const sig = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // NOVO SEGREDO NECESSÁRIO!

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
        throw new Error('Assinatura Stripe ou segredo faltando');
    }
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error(`❌ Erro de Webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Obter o objeto relevante do evento
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  
  if (!orderId) {
    console.warn(`Webhook recebido sem OrderId na metadata: ${session.id}`);
    return NextResponse.json({ received: true });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      try {
        const order = await Order.findById(orderId);
        
        if (order && order.status === 'pending') {
          // 1. Atualizar Status para Pago no DB
          order.isPaid = true;
          order.paidAt = new Date();
          order.status = 'paid';
          // order.paymentResult = { id: session.payment_intent, status: 'succeeded' }; // Salvar dados do pagamento
          await order.save();

          // 2. Enviar Email de Confirmação Final
          const userEmail = session.customer_details?.email || 'N/A';
          await sendEmail({
            to: userEmail,
            subject: `✅ Pedido #${orderId.slice(-6)} Confirmado!`,
            html: `<h1>Obrigado pela sua compra!</h1><p>O seu pagamento foi confirmado com sucesso. O pedido está agora em processamento.</p><p>Total pago: R$ ${session.amount_total! / 100}</p>`,
          });
        }
      } catch (e) {
        console.error('Falha ao processar evento de pagamento:', e);
        return NextResponse.json({ error: 'Falha interna do servidor' }, { status: 500 });
      }
      break;
    
    case 'payment_intent.payment_failed':
      // Aqui você lidaria com a falha do pagamento (ex: notificar o cliente e o admin)
      console.log(`Pagamento Falhou para sessão ${session.id}`);
      break;

    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}