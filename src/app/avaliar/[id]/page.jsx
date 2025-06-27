'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AvaliarProfissional() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stars = [1,2,3,4,5];

  const enviarAvaliacao = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/avaliar/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: rating, comment: comment.trim() , tipo_avaliacao: 'profissional_avaliado',}),
      });
      if (!res.ok) throw new Error('Falha ao enviar avaliação');
      router.push(`/perfil/${profissionalId}?avaliado=true`);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Avaliar profissional</h2>

      <div className="flex items-center mb-4">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-3xl mr-2 ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        placeholder="Comentário (opcional)"
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring"
      />

      <button
        onClick={enviarAvaliacao}
        disabled={rating === 0 || loading}
        className={`w-full py-2 rounded text-white ${
          rating === 0 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Enviando...' : 'Enviar avaliação'}
      </button>

      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
