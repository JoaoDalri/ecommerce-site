import dbConnect from './mongodb';
import Product from '@/models/Product';
import { seedProducts } from '@/data/seedproducts';

export async function getProducts() {
  try {
    await dbConnect();
    // Busca os produtos
    const dbProducts = await Product.find({}).lean();
    
    // Se não tiver produtos no banco, usa o Seed
    const productsToReturn = dbProducts.length > 0 ? dbProducts : seedProducts;

    // TÉCNICA NUCLEAR DE SERIALIZAÇÃO:
    // Transforma tudo em texto e volta para JSON. 
    // Isso remove funções, buffers e objetos complexos do Mongoose automaticamente.
    return JSON.parse(JSON.stringify(productsToReturn));

  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    // Retorna o seed limpo em caso de erro
    return JSON.parse(JSON.stringify(seedProducts));
  }
}