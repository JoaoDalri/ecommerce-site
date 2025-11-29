'use client';
import { useState } from 'react';

export default function Reviews({ product }: { product: any }) {
  const [reviews, setReviews] = useState(product.reviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function submitReview(e: any) {
    e.preventDefault();
    setLoading(true);
    
    // Pegar usuário do localStorage (Simulação)
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { name: 'Visitante' };

    const res = await fetch(`/api/products/${product._id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user.name, rating, comment })
    });

    const data = await res.json();
    if (res.ok) {
      setReviews(data.reviews);
      setComment('');
    } else {
      alert('Erro ao enviar avaliação');
    }
    setLoading(false);
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Avaliações ({reviews.length})</h2>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Lista */}
        <div className="space-y-6">
          {reviews.length === 0 && <p className="text-gray-500">Seja o primeiro a avaliar!</p>}
          {reviews.map((review: any, idx: number) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{review.user}</span>
                <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Formulário */}
        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-4">Deixe sua opinião</h3>
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nota</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Comentário</label>
              <textarea 
                required
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full border rounded-lg p-3"
                rows={3}
                placeholder="O que achou do produto?"
              ></textarea>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}