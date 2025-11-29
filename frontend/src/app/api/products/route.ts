import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET(request: Request) {
  await dbConnect();
  
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const sort = searchParams.get('sort');

  let query: any = {};
  if (category) query.category = category;

  // Correção do bug de performance: Ordenação feita no banco de dados
  let productsQuery = Product.find(query);
  
  if (sort === 'price') {
    productsQuery = productsQuery.sort({ price: 1 }); // 1 para crescente
  }

  const products = await productsQuery.exec();
  
  return NextResponse.json(products);
}