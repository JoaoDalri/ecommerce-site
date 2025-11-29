'use client';
import { useRouter } from 'next/navigation';

export default function NewCoupon() {
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const res = await fetch('/api/coupons', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (res.ok) router.push('/admin/coupons');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow border">
      <h1 className="text-2xl font-bold mb-6">Novo Cupom</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Código (Ex: VERÃO10)</label>
          <input name="code" required className="w-full border p-2 rounded uppercase" />
        </div>
        <div>
          <label className="block text-sm mb-1">Porcentagem de Desconto (%)</label>
          <input name="discountPercentage" type="number" min="1" max="100" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Data de Validade</label>
          <input name="expiryDate" type="date" required className="w-full border p-2 rounded" />
        </div>
        <button className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Criar</button>
      </form>
    </div>
  );
}