'use client';

import { use, useEffect, useState } from 'react';

export default function HistoricoUsuario({
  params,
  searchParams,
}) {
  const { id } = use(params);
  const { tipo } = use(searchParams);

  const [historico, SetHistorico] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/historico/${id}?tipo=${tipo}`);
      if (res.status == 200) {
        const hist = await res.json();
        SetHistorico(hist);
      }
    }
    load();
  }, []);

  return (
    <div className=' bg-blue-500 min-h-screen py-8'>
      <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-xl">
        <div className='bg-gradient-to-r from-sky-600 to-blue-800 rounded-lg mb-4'>
          <h1 className="relative text-4xl font-bold tracking-tight text-white py-3 text-center"> {/* Título branco e com padding */}
            Histórico do {tipo}
          </h1>
        </div>

        {historico.length === 0 ? (
          <p className="text-gray-500">Nenhum serviço encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {historico.map((item) => (
              <li key={item.disponibilidade.id} className="border p-4 rounded shadow-sm hover:bg-gray-100 bg-white">
              {/* <li key={item.disponibilidade.id} className="border p-4 rounded shadow-sm"> */}
                <p><strong>Serviço:</strong> {item.profissional.especialidade}</p>
                <p>
                  <strong>{item.tipo == 'cliente' ? 'Profissional' : 'Cliente'}:</strong>{' '}
                  {item.tipo == 'cliente' ? item.usuarioProfissional.nome : item.usuarioCliente.nome}
                </p>
                <p><strong>Data:</strong> {item.disponibilidade.dataHora}</p>
                {item.agendamentos.status == "cancelado" && (<p className='font-bold text-red-600'>cancelado</p>)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
