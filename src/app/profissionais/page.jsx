'use client';

import { useEffect, useState } from 'react';

export default function ProfissionaisPage() {
  const [filtro, setFiltro] = useState({
    especialidade: '',
    bairro: '',
    disponibilidade: '',
  });

  const profissionaisMock = [
    {
      id: 1,
      nome: 'João Silva',
      especialidade: 'Eletricista',
      bairro: 'Centro',
      disponibilidade: ['Segunda', 'Quarta'],
      avaliacao: 4.5,
      foto: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      nome: 'Maria Souza',
      especialidade: 'Diarista',
      bairro: 'Bela Vista',
      disponibilidade: ['Terça', 'Sexta'],
      avaliacao: 4.8,
      foto: 'https://via.placeholder.com/100',
    },
    {
      id: 3,
      nome: 'Carlos Lima',
      especialidade: 'Encanador',
      bairro: 'Centro',
      disponibilidade: ['Segunda', 'Sexta'],
      avaliacao: 4.2,
      foto: 'https://via.placeholder.com/100',
    },
  ];

  const handleFiltroChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const profissionaisFiltrados = profissionaisMock.filter((prof) => {
    const filtroEspecialidade =
      filtro.especialidade === '' || prof.especialidade === filtro.especialidade;
    const filtroBairro = filtro.bairro === '' || prof.bairro === filtro.bairro;
    const filtroDisponibilidade =
      filtro.disponibilidade === '' ||
      prof.disponibilidade.includes(filtro.disponibilidade);

    return filtroEspecialidade && filtroBairro && filtroDisponibilidade;
  });

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Profissionais Disponíveis</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          name="especialidade"
          onChange={handleFiltroChange}
          className="border p-2 rounded"
        >
          <option value="">Todas as Especialidades</option>
          <option value="Eletricista">Eletricista</option>
          <option value="Diarista">Diarista</option>
          <option value="Encanador">Encanador</option>
        </select>

        <select
          name="bairro"
          onChange={handleFiltroChange}
          className="border p-2 rounded"
        >
          <option value="">Todos os Bairros</option>
          <option value="Centro">Centro</option>
          <option value="Bela Vista">Bela Vista</option>
        </select>

        <select
          name="disponibilidade"
          onChange={handleFiltroChange}
          className="border p-2 rounded"
        >
          <option value="">Todos os Dias</option>
          <option value="Segunda">Segunda</option>
          <option value="Terça">Terça</option>
          <option value="Quarta">Quarta</option>
          <option value="Sexta">Sexta</option>
        </select>
      </div>

      {/* Listagem */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profissionaisFiltrados.length > 0 ? (
          profissionaisFiltrados.map((prof) => (
            <div
              key={prof.id}
              className="border p-4 rounded shadow hover:scale-105 transition-transform"
            >
              <img
                src={prof.foto}
                alt={prof.nome}
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h2 className="text-xl font-semibold text-center mt-2">
                {prof.nome}
              </h2>
              <p className="text-center">{prof.especialidade}</p>
              <p className="text-center">{prof.bairro}</p>
              <p className="text-center">⭐ {prof.avaliacao}</p>
              <p className="text-center text-sm">
                Disponível:{' '}
                {prof.disponibilidade.join(', ')}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">
            Nenhum profissional encontrado.
          </p>
        )}
      </div>
    </main>
  );
}
