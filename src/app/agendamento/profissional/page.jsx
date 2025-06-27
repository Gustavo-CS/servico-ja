'use client';

import { useState, useEffect } from 'react';

export default function PainelProfissional() {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [cancelamentos, setCancelamentos] = useState([]);
  const [dataHora, setDataHora] = useState('');
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const buscarDisponibilidades = async () => {
    try {
      const res = await fetch('/api/disponibilidade', { headers });
      if (res.ok) {
        const dados = await res.json();
        setDisponibilidades(dados);
      } else {
        setDisponibilidades([]);
      }
    } catch {
      setDisponibilidades([]);
    }
  };

  const buscarAgendamentos = async () => {
    try {
      const res = await fetch('/api/agendamentos', { headers });
      if (res.ok) {
        const dados = await res.json();
        setAgendamentos(dados);
      } else {
        setAgendamentos([]);
      }
    } catch {
      setAgendamentos([]);
    }
  };

  const buscarCancelamentos = async () => {
    try {
      const res = await fetch('/api/cancelamentos', { headers });
      if (res.status === 204) {
        setCancelamentos([]);
      } else if (res.ok) {
        const dados = await res.json();
        setCancelamentos(dados);
      } else {
        setCancelamentos([]);
      }
    } catch {
      setCancelamentos([]);
    }
  };

  const carregarTudo = async () => {
    setLoading(true);
    await Promise.all([buscarDisponibilidades(), buscarAgendamentos(), buscarCancelamentos()]);
    setLoading(false);
  };

  const adicionarHorario = async () => {
    if (!dataHora) return alert('Informe uma data e hora.');

    setLoading(true);
    try {
      const res = await fetch('/api/disponibilidade', {
        method: 'POST',
        headers,
        body: JSON.stringify({ data_hora: dataHora }),
      });

      if (res.ok) {
        setDataHora('');
        await buscarDisponibilidades();
      } else {
        alert('Erro ao adicionar horário.');
      }
    } catch {
      alert('Erro ao adicionar horário.');
    }
    setLoading(false);
  };

  const confirmarAgendamento = async (id) => {
    setLoading(true);
    try {
      const res = await fetch('/api/agendamentos', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ id, profissionalAceitou: true }),
      });

      if (res.ok) {
        await buscarAgendamentos();
      } else {
        alert('Erro ao confirmar agendamento.');
      }
    } catch {
      alert('Erro ao confirmar agendamento.');
    }
    setLoading(false);
  };

  const cancelarAgendamento = async (id) => {
    const motivo = prompt('Por favor, informe o motivo do cancelamento:');
    if (!motivo || motivo.trim() === '') {
      alert('Cancelamento abortado: motivo obrigatório.');
      return;
    }

    if (!token) {
      alert('Usuário não autenticado.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo }),
      });

      if (res.ok) {
        alert('Agendamento cancelado com sucesso.');
        await carregarTudo();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Erro ao cancelar agendamento.');
      }
    } catch {
      alert('Erro ao cancelar agendamento.');
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarTudo();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Painel do Profissional</h1>

      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2">Adicionar Horário</h2>
        <div className="flex gap-4 items-center mb-4">
          <input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            disabled={loading}
          />
          <button
            onClick={adicionarHorario}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Adicionar
          </button>
        </div>

        <h2 className="font-semibold text-lg mb-2">Horários Disponíveis</h2>
        <ul className="space-y-2">
          {disponibilidades.length === 0 && <li>Nenhum horário disponível.</li>}
          {disponibilidades.map((horario) => (
            <li
              key={horario.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <span>{new Date(horario.dataHora).toLocaleString()}</span>
              {horario.reservado ? (
                <span className="text-red-500 font-semibold">Reservado</span>
              ) : (
                <span className="text-green-600 font-semibold">Disponível</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2">Agendamentos</h2>
        {agendamentos.length === 0 ? (
          <p>Nenhum agendamento.</p>
        ) : (
          <ul className="space-y-2">
            {agendamentos.map((ag) => (
              <li key={ag.id} className="border p-3 rounded space-y-1">
                <div>
                  <strong>Cliente:</strong> {ag.cliente_nome || ag.cliente_id}
                </div>
                <div>
                  <strong>Data:</strong> {new Date(ag.data_hora).toLocaleString()}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  {ag.status === 'confirmado' ? (
                    <span className="text-green-600 font-semibold">Confirmado</span>
                  ) : ag.status === 'pendente' ? (
                    <span className="text-yellow-600 font-semibold">Pendente</span>
                  ) : ag.status === 'cancelado' ? (
                    <>
                      <span className="text-red-600 font-semibold">Cancelado</span>
                      <div>
                        <strong>Cancelado por:</strong>{' '}
                        {ag.canceladoPor === 'cliente'
                          ? 'Cliente'
                          : ag.canceladoPor === 'profissional'
                          ? 'Profissional'
                          : ag.canceladoPor}
                      </div>
                      <div>
                        <strong>Motivo:</strong> {ag.motivo || '-'}
                      </div>
                    </>
                  ) : (
                    <span>{ag.status}</span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => confirmarAgendamento(ag.id)}
                    disabled={ag.status === 'confirmado' || ag.status === 'cancelado' || loading}
                    className={`px-3 py-1 rounded ${
                      ag.status === 'confirmado' || ag.status === 'cancelado'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {ag.status === 'confirmado' ? 'Confirmado' : 'Confirmar'}
                  </button>

                  {ag.status !== 'cancelado' && (
                    <button
                      onClick={() => cancelarAgendamento(ag.id)}
                      disabled={loading}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Cancelamentos</h2>
        {cancelamentos.length === 0 ? (
          <p>Não há cancelamentos registrados.</p>
        ) : (
          <ul className="space-y-4">
            {cancelamentos.map((canc) => (
              <li key={canc.id} className="border p-4 rounded shadow-sm">
                <div>
                  <strong>Cliente:</strong> {canc.clienteNome || canc.clienteId}
                </div>
                <div>
                  <strong>Motivo:</strong> {canc.motivo}
                </div>
                <div>
                  <strong>Cancelado por:</strong>{' '}
                  {canc.canceladoPor === 'cliente'
                    ? 'Cliente'
                    : canc.canceladoPor === 'profissional'
                    ? 'Profissional'
                    : canc.canceladoPor}
                </div>
                <div>
                  <strong>Data do cancelamento:</strong>{' '}
                  {new Date(canc.canceladoEm).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}