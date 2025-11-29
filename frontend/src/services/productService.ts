// frontend/src/services/productService.ts
import Product from '@/models/Product';
import dbConnect from '@/lib/dbConnect';

// Serviço Principal de Busca (Otimizado)
export async function getFilteredProducts(filter: any) {
  await dbConnect();
  const { q, category, sort, id } = filter;
  
  let query: any = {};
  if (q) query.$text = { $search: q };
  if (category) query.category = category;
  if (id) query._id = id;

  let sortOption: any = {};
  if (sort === 'price_asc') sortOption.price = 1;
  if (sort === 'price_desc') sortOption.price = -1;

  const projection = 'title price category images oldPrice _id averageRating numReviews';

  // Usando um índice de texto para busca, se 'q' estiver presente
  if (q) {
      sortOption = { score: { $meta: "textScore" } };
      query.$score = { $meta: "textScore" };
  }

  // Aplica a projeção para performance
  const products = await Product.find(query).sort(sortOption).select(projection).limit(20);
  return products;
}

// Serviço: Obter um único produto com todos os detalhes
export async function getProductById(id: string) {
  await dbConnect();
  // Busca o produto e popula reviews (simulação)
  return Product.findById(id).select('-__v'); 
}

// NOVO SERVIÇO DE MARKETING: Produtos Relacionados
export async function getRelatedProducts(productId: string, category: string) {
  await dbConnect();
  // Busca 4 produtos da mesma categoria, excluindo o produto atual
  const related = await Product.find({
      category: category,
      _id: { $ne: productId } // Excluir o produto atual
  })
  .select('title price category images _id')
  .limit(4)
  .lean(); // Retorna objetos JS simples para melhor performance
  
  return related;
}