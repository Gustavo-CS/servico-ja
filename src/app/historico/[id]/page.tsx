import { use } from 'react';

const historicoCliente: Record<string, {
  id: number;
  servico: string;
  profissional: string;
  data: string;
}[]> = {
  '1': [
    { id: 1, servico: 'Corte de Cabelo', profissional: 'Ana Souza', data: '2025-05-20' },
    { id: 2, servico: 'Corte de Cabelo', profissional: 'Ana Souza', data: '2025-06-20' },
    { id: 3, servico: 'Corte de Cabelo', profissional: 'Ana Souza', data: '2025-07-10' },
  ],
  '4': [
    { id: 2, servico: 'Massagem Relaxante', profissional: 'Carlos Lima', data: '2025-05-18' },
  ],
};

const historicoProfissional: Record<string, {
  id: number;
  servico: string;
  cliente: string;
  data: string;
}[]> = {
  '2': [
    { id: 1, servico: 'Corte de Cabelo', cliente: 'Felipe Cardoso', data: '2025-05-20' },
    { id: 2, servico: 'Corte de Cabelo', cliente: 'Felipe Cardoso', data: '2025-06-20' },
    { id: 3, servico: 'Corte de Cabelo', cliente: 'Felipe Cardoso', data: '2025-07-10' },
  ],
  '3': [
    { id: 4, servico: 'Massagem Relaxante', cliente: 'Mariana Dias', data: '2025-05-18' },
  ],
};

export default function HistoricoUsuario({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { id } = use(params);
  const { tipo } = use(searchParams);

  const historico =
  tipo === 'cliente' ? historicoCliente[id] || [] : historicoProfissional[id] || [];

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Histórico de {tipo}</h1>

      {historico.length === 0 ? (
        <p className="text-gray-500">Nenhum serviço encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {historico.map((item) => (
            <li key={item.id} className="border p-4 rounded shadow-sm">
              <p><strong>Serviço:</strong> {item.servico}</p>
              <p>
                <strong>{'profissional' in item ? 'Profissional' : 'Cliente'}:</strong>{' '}
                {'profissional' in item ? item.profissional : item.cliente}
              </p>
              <p><strong>Data:</strong> {item.data}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
