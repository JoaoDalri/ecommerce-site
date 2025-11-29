"use client";
import ProductGrid from "@/components/ProductGrid"; 
import Hero3D from "@/components/Hero3D"; 

export default function HomeClient({ initialProducts }: { initialProducts: any[] }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Hero3D />
      <div className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-10 pl-4 border-l-4 border-[#6366f1]">Destaques</h2>
        <ProductGrid products={initialProducts} />
      </div>
    </div>
  );
}