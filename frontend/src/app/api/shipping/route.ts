import { NextResponse } from 'next/server';
import { calculateShipping } from '@/services/shippingService';

export async function POST(req: Request) {
  try {
    const { cartTotal, zipCode } = await req.json();
    
    if (!cartTotal || !zipCode) {
      return NextResponse.json({ error: 'Faltam dados de total/CEP' }, { status: 400 });
    }

    const options = await calculateShipping(cartTotal, zipCode);
    return NextResponse.json(options);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}