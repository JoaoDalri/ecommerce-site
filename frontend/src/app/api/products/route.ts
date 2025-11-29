import { NextResponse } from 'next/server';
import { getFilteredProducts } from '@/services/productService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const products = await getFilteredProducts({
    q: searchParams.get('q'),
    category: searchParams.get('category'),
    sort: searchParams.get('sort'),
  });
  return NextResponse.json(products);
}