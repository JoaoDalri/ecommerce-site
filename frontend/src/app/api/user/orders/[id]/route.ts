import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  
  try {
    const order = await Order.findById(params.id).populate('user', 'name email').lean();

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Apenas retorna dados relevantes e status para o cliente
    const orderData = JSON.parse(JSON.stringify(order));

    return NextResponse.json(orderData);
  } catch (error) {
    return NextResponse.json({ error: 'ID de pedido inválido' }, { status: 400 });
  }
}