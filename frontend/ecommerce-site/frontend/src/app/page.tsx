import { getProducts } from "@/lib/fetchData";
import HomeClient from "./HomeClient";

// Esta página é renderizada no SERVIDOR.
// Ela busca os dados, serializa e passa para o componente cliente.
export default async function Page() {
  const products = await getProducts();
  return <HomeClient initialProducts={products} />;
}