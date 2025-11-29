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