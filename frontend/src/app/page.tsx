import { getProducts } from "@/lib/fetchData";
import HomeClient from "./HomeClient";

export const dynamic = 'force-dynamic'; // Força atualização

export default async function Page() {
  const products = await getProducts();
  return <HomeClient initialProducts={products} />;
}