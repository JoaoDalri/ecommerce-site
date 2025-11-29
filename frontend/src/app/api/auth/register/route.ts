import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();
  
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashedPassword });
    return NextResponse.json({ success: true, userId: user._id });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 400 });
  }
}