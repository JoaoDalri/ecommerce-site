import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { user, rating, comment } = await req.json();

  const product = await Product.findById(id);
  
  if (!product) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  }

  const review = { user, rating: Number(rating), comment };
  product.reviews.push(review);

  // Recalcular média
  product.numReviews = product.reviews.length;
  product.averageRating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;

  await product.save();

  return NextResponse.json({ message: 'Avaliação adicionada', reviews: product.reviews });
}