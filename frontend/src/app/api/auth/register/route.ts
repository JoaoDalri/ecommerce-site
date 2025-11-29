import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { sendEmail } from '@/lib/email'; // Novo Import

export async function POST(request: Request) {
  await dbConnect();
  const { name, email, password } = await request.json();

  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Senha deve ter no mínimo 6 caracteres' }, { status: 400 });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  
  // AÇÃO DO PASSO 8: Enviar Email de Boas-Vindas
  await sendEmail({
    to: email,
    subject: '🎉 Bem-vindo à LojaPro!',
    html: `<h1>Olá, ${name}!</h1><p>Obrigado por se juntar à nossa comunidade. Sua conta foi criada com sucesso.</p><p>Explore nossas ofertas: <a href="http://localhost:3000">Ir para a Loja</a></p>`
  });
  // FIM DA AÇÃO DO PASSO 8

  return NextResponse.json({ token: 'mock-jwt-token', user: { id: user._id, name, email, role: user.role } });
}