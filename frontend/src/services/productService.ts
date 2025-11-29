import Product from '@/models/Product';
import dbConnect from '@/lib/dbConnect';

// Função mágica que limpa os dados do Mongoose para o Next.js
function serialize(data: any) {
  return JSON.parse(JSON.stringify(data));
}

export async function getFilteredProducts(filter: any) {
  await dbConnect();
  const { q, category, sort, id } = filter;
  
  let query: any = {};
  
  // Busca por texto ou ID
  if (q) query.$text = { $search: q };
  if (category) query.category = category;
  if (id) query._id = id;

  let sortOption: any = {};
  if (sort === 'price_asc') sortOption.price = 1;
  if (sort === 'price_desc') sortOption.price = -1;

  // .lean() converte para objeto JS simples (muito mais rápido)
  const products = await Product.find(query)
    .sort(sortOption)
    .limit(20)
    .lean();

  return serialize(products);
}

export async function getProductById(id: string) {
  await dbConnect();
  try {
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return serialize(product);
  } catch (error) {
    return null;
  }
}

export async function getRelatedProducts(productId: string, category: string) {
  await dbConnect();
  if (!category) return [];
  
  const related = await Product.find({
      category: category,
      _id: { $ne: productId }
  })
  .limit(4)
  .lean();
  
  return serialize(related);
}