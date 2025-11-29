import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon';

export async function GET() {
  await dbConnect();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const coupon = await Coupon.create({
      ...body,
      code: body.code.toUpperCase()
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await Coupon.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}