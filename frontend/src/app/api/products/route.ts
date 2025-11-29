import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getFilteredProducts } from '@/services/productService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const products = await getFilteredProducts({
    q: searchParams.get('q'),
    category: searchParams.get('category'),
    sort: searchParams.get('sort'),
    id: searchParams.get('id'), // Adicionado suporte para filtro por ID direto
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 400 });
  }
}