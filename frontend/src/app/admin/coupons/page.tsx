'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetch('/api/coupons').then(res => res.json()).then(setCoupons);
  }, []);

  async function handleDelete(id: string) {
    if(!confirm('Apagar este cupom?')) return;
    await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
    setCoupons(prev => prev.filter((c: any) => c._id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
        <Link href="/admin/coupons/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Criar Cupom
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Código</th>
              <th className="p-4">Desconto</th>
              <th className="p-4">Expira em</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((c: any) => (
              <tr key={c._id}>
                <td className="p-4 font-bold text-blue-600">{c.code}</td>
                <td className="p-4">{c.discountPercentage}%</td>
                <td className="p-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:underline">Apagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}