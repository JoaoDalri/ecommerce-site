import dbConnect from './lib/mongodb';
import Product from '@/models/Product';

export async function getProducts() {
  try {
    await dbConnect();
    // .lean() retorna objetos JavaScript puros em vez de documentos Mongoose
    const products = await Product.find({}).lean();

    // Serialização manual para garantir que _id e datas sejam strings
    return products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      title: p.title || p.name, // Garante compatibilidade entre title/name
      price: p.price,
      img: p.img || p.images?.[0] || '/next.svg', // Fallback para imagem
      createdAt: p.createdAt ? p.createdAt.toString() : null,
      updatedAt: p.updatedAt ? p.updatedAt.toString() : null,
    }));
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return []; // Retorna array vazio em caso de erro para não quebrar a UI
  }
}