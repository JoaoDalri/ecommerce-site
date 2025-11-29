import Product from '@/models/Product';
import dbConnect from '@/lib/dbConnect';

// Helper para limpar objetos do Mongoose
function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data));
}

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

  // Nota: .lean() converte o documento Mongoose para um objeto JS simples (Plain Object)
  // Isso resolve o erro "Only plain objects can be passed..."
  const products = await Product.find(query)
    .sort(sortOption)
    .select(projection)
    .limit(20)
    .lean();

  return serializeData(products);
}

export async function getProductById(id: string) {
  await dbConnect();
  try {
    const product = await Product.findById(id).select('-__v').lean();
    if (!product) return null;
    return serializeData(product);
  } catch (error) {
    return null;
  }
}

export async function getRelatedProducts(productId: string, category: string) {
  await dbConnect();
  const related = await Product.find({
      category: category,
      _id: { $ne: productId }
  })
  .select('title price category images _id')
  .limit(4)
  .lean();
  
  return serializeData(related);
}