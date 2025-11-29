import Link from 'next/link';
import Image from 'next/image'; // NOVO

export default function HeroBanner() {
  return (
    <div className="relative bg-gray-900 text-white overflow-hidden rounded-2xl mx-4 mt-6 md:mx-0">
      <div className="absolute inset-0 opacity-40">
        {/* NOVO: Imagem Otimizada com Layout Fill e Priority */}
        <Image 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Banner Background" 
          fill // Preenche o container pai
          priority // Carrega primeiro
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      <div className="relative container mx-auto px-6 py-16 md:py-24 flex flex-col items-start">
        <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded mb-4 uppercase tracking-wider">
          Tempo Limitado
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Tecnologia de Ponta <br/> Preços Baixos
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
          Descubra os últimos lançamentos em smartphones, portáteis e acessórios com até 40% de desconto.
        </p>
        <Link 
          href="/search" 
          className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
        >
          Ver Ofertas Agora
        </Link>
      </div>
    </div>
  );
}