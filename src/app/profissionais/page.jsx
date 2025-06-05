'use client';

import { useEffect, useState } from 'react';

export default function Profissionais() {
  const [dados, setDados] = useState([]);
  const [especialidade, setEspecialidade] = useState('');

  useEffect(() => {
    fetch('/api/profissionais')
      .then(res => res.json())
      .then(data => setDados(data));
  }, []);

  const filtrados = dados.filter(item =>
    (filtroEspecialidade ? item.especialidade === filtroEspecialidade : true)
  );

  return (
    <div>
      <h1>Lista de Profissionais</h1>

      <div>
        <label>Especialidade:</label>
        <input value={filtroEspecialidade} onChange={e => setFiltroEspecialidade(e.target.value)} />
      </div>

      <ul>
        {filtrados.map(prof => (
          <li key={prof.id} style={{ border: '1px solid gray', margin: 10, padding: 10 }}>
            <img src={`/profissionais/${prof.foto}`} alt={prof.nome} width={100} />
            <h2>{prof.nome}</h2>
            <p>Especialidade: {prof.especialidade}</p>
            <p>Avaliação: {prof.avaliacao} ⭐</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
