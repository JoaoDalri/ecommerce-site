import Product from '@/models/Product';
import dbConnect from '@/lib/dbConnect';

export async function getFilteredProducts(filter: any) {
  await dbConnect();
  const { q, category, sort } = filter;
  
  let query: any = {};
  if (q) query.$text = { $search: q };
  if (category) query.category = category;

  let sortOption: any = {};
  if (sort === 'price_asc') sortOption.price = 1;
  if (sort === 'price_desc') sortOption.price = -1;

  const products = await Product.find(query).sort(sortOption).limit(20);
  return products;
}