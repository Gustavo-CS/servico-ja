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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Histórico de {tipo}</h1>

      {historico.length === 0 ? (
        <p className="text-gray-500">Nenhum serviço encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {historico.map((item) => (
            <li key={item.disponibilidade.id} className="border p-4 rounded shadow-sm">
              <p><strong>Serviço:</strong> {item.profissional.especialidade}</p>
              <p>
                <strong>{item.tipo == 'cliente' ? 'Profissional' : 'Cliente'}:</strong>{' '}
                { item.tipo == 'cliente' ? item.usuarioProfissional.nome : item.usuarioCliente.nome}
              </p>
              <p><strong>Data:</strong> {item.disponibilidade.dataHora}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
