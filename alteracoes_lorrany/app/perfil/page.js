'use client';

import { useEffect, useState } from 'react';

export default function PaginaPerfil() {
  const [profissional, setProfissional] = useState({ id: 1, nome: 'João da Silva' });
  const [media, setMedia] = useState(0);
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [usuario, setUsuario] = useState('');
  const [servico, setServico] = useState('');

  useEffect(() => {
    fetch(`/api/avaliacoes?profissionalId=${profissional.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMedia(data.media);
        setTotalAvaliacoes(data.totalAvaliacoes);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/avaliacoes', {
      method: 'POST',
      body: JSON.stringify({
        profissionalId: profissional.id,
        usuario,
        servico,
        nota: Number(nota),
        comentario,
      }),
    });

    if (res.ok) {
      alert('Avaliação enviada!');
      window.location.reload();
    } else {
      const errorData = await res.json();
      alert('Erro ao enviar avaliação: ' + (errorData.error || 'Erro desconhecido'));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Perfil de {profissional.nome}</h1>
      <h2>⭐ Média: {media} ({totalAvaliacoes} avaliações)</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <h3>Deixe sua avaliação:</h3>

        <label>
          Seu nome:
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Serviço avaliado:
          <input
            type="text"
            value={servico}
            onChange={(e) => setServico(e.target.value)}
          />
        </label>
        <br />

        <label>
          Nota (0 a 5):
          <input
            type="number"
            min="0"
            max="5"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Comentário:
          <br />
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </label>
        <br />

        <button type="submit">Enviar Avaliação</button>
      </form>
    </div>
  );
}