'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function PainelCliente() {
  const [slots, setSlots] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [cancelamentos, setCancelamentos] = useState([]);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(null);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const idProfissional = params.id;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const buscarSlotsDisponiveis = async (profissionalId = null) => {
    try {
      let url = '/api/disponibilidade';
      if (profissionalId) {
        url += `?profissional_id=${profissionalId}`;
      }
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('Erro ao buscar horários');
      const data = await res.json();

      if (!Array.isArray(data)) {
        setSlots([]);
        return;
      }

      setSlots(data.filter((slot) => !slot.reservado));
    } catch {
      setSlots([]);
    }
  };

  const buscarAgendamentos = async () => {
    try {
      const res = await fetch('/api/agendamentos', { headers });
      if (res.status === 204) {
        setAgendamentos([]);
        return;
      }
      if (!res.ok) throw new Error('Erro ao buscar agendamentos');
      const data = await res.json();
      setAgendamentos(data.sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora)));
    } catch {
      setAgendamentos([]);
    }
  };

  const buscarCancelamentos = async () => {
    try {
      const res = await fetch('/api/cancelamentos', { headers });
      if (res.status === 204) {
        setCancelamentos([]);
        return;
      }
      if (!res.ok) throw new Error('Erro ao buscar cancelamentos');
      const data = await res.json();
      setCancelamentos(data);
    } catch {
      setCancelamentos([]);
    }
  };

  const agendarHorario = async (slotId) => {
    if (!token) return alert('Usuário não autenticado.');

    setLoading(true);
    try {
      const res = await fetch('/api/agendamentos', {
        method: 'POST',
        headers,
        body: JSON.stringify({ slot_id: slotId }),
      });

      if (res.ok) {
        alert('Agendamento realizado com sucesso!');
        await buscarSlotsDisponiveis(idProfissional);
        await buscarAgendamentos();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao agendar horário.');
      }
    } catch {
      alert('Erro ao agendar horário.');
    }
    setLoading(false);
  };

  const cancelarAgendamento = async (id) => {
    const motivo = prompt('Informe o motivo do cancelamento:');
    if (!motivo?.trim()) return alert('Cancelamento sem motivo não permitido.');

    setLoading(true);
    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ motivo }),
      });

      if (res.ok) {
        alert('Agendamento cancelado com sucesso!');
        await buscarAgendamentos();
        await buscarCancelamentos();
        await buscarSlotsDisponiveis(idProfissional);
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao cancelar agendamento.');
      }
    } catch {
      alert('Erro ao cancelar agendamento.');
    }
    setLoading(false);
  };

  useEffect(() => {
    buscarSlotsDisponiveis(idProfissional);
    buscarAgendamentos();
    buscarCancelamentos();
  }, [idProfissional]);

  return (
    <div className="min-h-screen bg-blue-500 py-8">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl space-y-12 text-black">
        <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-8">
          Agendamento
        </h1>

        {/* Horários Disponíveis */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Horários Disponíveis</h2>
          {slots.length === 0 ? (
            <p className="text-gray-500">Nenhum horário disponível no momento.</p>
          ) : (
            <ul className="divide-y divide-black">
              {slots.map((slot) => (
                <li
                  key={slot.id}
                  className="flex justify-between items-center py-3"
                >
                  <span>{new Date(slot.dataHora).toLocaleString()}</span>
                  <button
                    disabled={loading}
                    onClick={() => agendarHorario(slot.id)}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-2 rounded font-semibold transition"
                  >
                    Agendar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Meus Agendamentos */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-blue-700">Meus Agendamentos</h2>
          {agendamentos.length === 0 ? (
            <p>Você não tem agendamentos.</p>
          ) : (
            <ul className="space-y-6">
              {agendamentos.map((ag) => {
                const cancelamento = cancelamentos.find((c) => c.agendamentoId === ag.id);
                return (
                  <li key={ag.id} className="border rounded-md p-4 space-y-3 shadow-sm hover:shadow-md transition">
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
                          <button
                            onClick={() =>
                              setDetalhesVisiveis((prev) => (prev === ag.id ? null : ag.id))
                            }
                            className="ml-3 inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            {detalhesVisiveis === ag.id ? 'Ocultar detalhes' : 'Veja o porquê'}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
                              />
                            </svg>
                          </button>

                          {detalhesVisiveis === ag.id && (
                            <div className="mt-2 p-3 bg-gray-100 rounded text-sm space-y-1">
                              {cancelamento ? (
                                <>
                                  <div>
                                    <strong>Motivo:</strong> {cancelamento.motivo}
                                  </div>
                                  <div>
                                    <strong>Cancelado por:</strong> {cancelamento.canceladoPor}
                                  </div>
                                  <div>
                                    <strong>Data do cancelamento:</strong>{' '}
                                    {new Date(cancelamento.canceladoEm).toLocaleString()}
                                  </div>
                                </>
                              ) : (
                                <div className="text-gray-500">Informações de cancelamento não encontradas.</div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <span>{ag.status}</span>
                      )}
                    </div>

                    {ag.status !== 'cancelado' && (
                      <button
                        disabled={loading}
                        onClick={() => cancelarAgendamento(ag.id)}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition font-semibold"
                      >
                        Cancelar
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}