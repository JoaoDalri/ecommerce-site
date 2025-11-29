"use client";
import ProductGrid from "@/components/ProductGrid"; 
import Hero3D from "@/components/Hero3D"; 

export default function HomeClient({ initialProducts }: { initialProducts: any[] }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Hero3D />
      <div className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-12 pl-6 border-l-8 border-primary">
            Destaques da Loja
        </h2>
        <ProductGrid products={initialProducts} />
      </div>
    </div>
  );
}