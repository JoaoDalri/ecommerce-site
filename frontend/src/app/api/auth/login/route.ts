import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();

  // 1. Verificar se usuário existe (incluindo a password que está escondida por padrão)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 400 });
  }

  // 2. Validar senha
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 400 });
  }

  // 3. Retornar dados (sem a senha)
  // Nota: Em produção, use JWT (NextAuth ou jsonwebtoken) aqui.
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address
  };

  return NextResponse.json(userData);
}