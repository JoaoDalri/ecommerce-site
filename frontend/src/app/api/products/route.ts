import { NextResponse } from 'next/server';
import { getFilteredProducts } from '@/services/productService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Enforce Next.js Cache Strategy (Isso é uma otimização chave)
  const fetchOptions = {
    next: { 
      revalidate: 3600 // Cache por 1 hora (ou use 0 para no-cache)
    } 
  };
  
  const products = await getFilteredProducts({
    q: searchParams.get('q'),
    category: searchParams.get('category'),
    sort: searchParams.get('sort'),
    id: searchParams.get('id'),
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  // Esta rota POST não precisa de cache e invalida a cache dos GETs após criação
  const { revalidateTag } = require('next/cache'); 
  const { NextResponse } = require('next/server');
  const Product = require('@/models/Product').default;

  const body = await request.json();
  const product = await Product.create(body);

  revalidateTag('products'); // Força a revalidação de qualquer cache dependente de 'products'
  return NextResponse.json(product, { status: 201 });
}