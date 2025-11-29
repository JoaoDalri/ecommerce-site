"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* NAVBAR */}
      <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">Minha Loja</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="px-4 py-2 w-64 rounded-full border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition">
            Buscar
          </button>
        </div>
      </header>

      {/* BANNER */}
      <section className="mt-6 px-6">
        <div className="w-full h-60 bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl flex items-center justify-start px-10 shadow-md">
          <h2 className="text-5xl text-white font-extrabold drop-shadow-lg max-w-xl">
            As melhores ofertas da semana estao aqui 🔥
          </h2>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mt-10 px-6">
        <h3 className="text-2xl font-semibold mb-4">Categorias</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {["Roupas", "Eletronicos", "Casa", "Beleza", "Games", "Acessorios"].map(
            (item) => (
              <div
                key={item}
                className="bg-white shadow-sm rounded-xl py-4 text-center text-sm font-medium hover:shadow-lg hover:bg-blue-50 transition cursor-pointer border border-gray-200"
              >
                {item}
              </div>
            )
          )}
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="mt-14 px-6 pb-20">
        <h3 className="text-2xl font-semibold mb-6">Produtos em Destaque</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition cursor-pointer border border-gray-200"
            >
              <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/next.svg"
                  width={70}
                  height={70}
                  alt="produto"
                  className="opacity-40"
                />
              </div>

              <h4 className="text-base font-semibold mt-4">
                Produto {i}
              </h4>

              <p className="text-gray-600 text-sm mt-1 font-medium">
                R$ {(i * 19.9).toFixed(2)}
              </p>

              <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                Comprar
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}