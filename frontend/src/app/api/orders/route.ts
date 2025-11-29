import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const body = await req.json();
    const { items, shippingAddress, paymentMethod, total, user } = body;

    // Em produção, validaríamos o stock e o preço real do produto aqui
    
    const order = await Order.create({
      user: user?.id || null, // Pode ser nulo para Guest Checkout
      items: items.map((i: any) => ({
        product: i.id,
        quantity: i.quantity,
        price: i.price
      })),
      total: total,
      status: 'pending',
      shippingAddress: shippingAddress, // Assumindo que o schema suporta isto (se não, adicione ao model)
    });

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao processar pedido' }, { status: 500 });
  }
}