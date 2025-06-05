'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [professional, setProfessional] = useState({
    id: 1,
    name: 'João da Silva',
  });

  const [average, setAverage] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetch(`/api/ratings?professionalId=${professional.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAverage(data.average);
        setTotalRatings(data.totalRatings);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/ratings', {
      method: 'POST',
      body: JSON.stringify({
        professionalId: professional.id,
        score: Number(score),
        comment,
      }),
    });

    if (res.ok) {
      alert('Avaliação enviada!');
      window.location.reload();
    } else {
      alert('Erro ao enviar avaliação');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Perfil de {professional.name}</h1>

      <h2>⭐ Média: {average} ({totalRatings} avaliações)</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <h3>Deixe sua avaliação:</h3>
        <label>
          Nota (1 a 5):
          <input
            type="number"
            min="1"
            max="5"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Comentário:
          <br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Enviar Avaliação</button>
      </form>
    </div>
  );
}