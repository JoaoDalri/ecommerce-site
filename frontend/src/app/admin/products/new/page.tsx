'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    const product = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      category: formData.get('category'),
      images: [formData.get('image')], // Simples URL por enquanto
      stock: Number(formData.get('stock'))
    };

    // Nota: Precisamos criar esta rota API específica para POST de produtos se não existir
    // Vamos usar a rota existente ou criar uma lógica no setup
    // Assumindo que /api/products aceita POST (vamos garantir isso no próximo passo)
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    if (res.ok) {
      router.push('/admin/products');
      router.refresh();
    } else {
      alert('Erro ao criar');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6">Adicionar Novo Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Produto</label>
          <input name="title" required className="w-full border p-3 rounded-lg" placeholder="Ex: Cadeira Gamer" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preço (R$)</label>
            <input name="price" type="number" step="0.01" required className="w-full border p-3 rounded-lg" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Estoque</label>
            <input name="stock" type="number" required className="w-full border p-3 rounded-lg" placeholder="10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
          <select name="category" className="w-full border p-3 rounded-lg bg-white">
            <option>Eletrônicos</option>
            <option>Moda</option>
            <option>Casa</option>
            <option>Games</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">URL da Imagem</label>
          <input name="image" required className="w-full border p-3 rounded-lg" placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
          <textarea name="description" rows={4} className="w-full border p-3 rounded-lg"></textarea>
        </div>

        <button disabled={loading} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition">
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </form>
    </div>
  );
}