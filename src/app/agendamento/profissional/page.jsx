'use client';

import { useState, useEffect } from 'react';

export default function PainelProfissional() {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [disponibilidadesFixas, setDisponibilidadesFixas] = useState([]); // NOVO: horários fixos
  const [agendamentos, setAgendamentos] = useState([]);
  const [cancelamentos, setCancelamentos] = useState([]);

  const [dataHora, setDataHora] = useState('');

  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [horaSelecionada, setHoraSelecionada] = useState('');

  const [loading, setLoading] = useState(false);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(null);

  const diasDaSemana = [
    { label: 'Dom', value: 0 },
    { label: 'Seg', value: 1 },
    { label: 'Ter', value: 2 },
    { label: 'Qua', value: 3 },
    { label: 'Qui', value: 4 },
    { label: 'Sex', value: 5 },
    { label: 'Sáb', value: 6 },
  ];

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Busca disponibilidades pontuais (slots concretos)
  const buscarDisponibilidades = async () => {
    try {
      const res = await fetch('/api/disponibilidade', { headers });
      const dados = res.ok ? await res.json() : [];
      setDisponibilidades(dados);
    } catch {
      setDisponibilidades([]);
    }
  };

  // NOVO: busca horários fixos semanais
  const buscarDisponibilidadesFixas = async () => {
    try {
      const res = await fetch('/api/disponibilidade/recorrente', { headers });
      const dados = res.ok ? await res.json() : [];
      setDisponibilidadesFixas(dados);
    } catch {
      setDisponibilidadesFixas([]);
    }
  };

  const buscarAgendamentos = async () => {
    try {
      const res = await fetch('/api/agendamentos', { headers });
      const dados = res.ok ? await res.json() : [];
      setAgendamentos(dados);
    } catch {
      setAgendamentos([]);
    }
  };

  const buscarCancelamentos = async () => {
    try {
      const res = await fetch('/api/cancelamentos', { headers });
      const dados = res.status === 204 ? [] : res.ok ? await res.json() : [];
      setCancelamentos(dados);
    } catch {
      setCancelamentos([]);
    }
  };

  const carregarTudo = async () => {
    setLoading(true);
    await Promise.all([
      buscarDisponibilidades(),
      buscarDisponibilidadesFixas(),
      buscarAgendamentos(),
      buscarCancelamentos(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    carregarTudo();
  }, []);

  const alternarDia = (dia) => {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
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

  const adicionarHorariosFixos = async () => {
    if (diasSelecionados.length === 0 || !horaSelecionada) {
      alert('Selecione pelo menos um dia e um horário.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/disponibilidade/recorrente', {
        method: 'POST',
        headers,
        body: JSON.stringify({ dias: diasSelecionados, hora: horaSelecionada }),
      });

      if (res.ok) {
        alert('Horários fixos adicionados com sucesso.');
        setDiasSelecionados([]);
        setHoraSelecionada('');
        await buscarDisponibilidadesFixas();
        await buscarDisponibilidades();
      } else {
        alert('Erro ao adicionar horários fixos.');
      }
    } catch {
      alert('Erro ao adicionar horários fixos.');
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

      if (res.ok) await buscarAgendamentos();
      else alert('Erro ao confirmar agendamento.');
    } catch {
      alert('Erro ao confirmar agendamento.');
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

  return (
    <div className="min-h-screen bg-blue-500 py-8">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl space-y-12">
        <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-8">
          Agendamentos
        </h1>

        {/* Horário Pontual */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Adicionar Horário Pontual</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-black">
            <input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              disabled={loading}
              className="flex-grow border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={adicionarHorario}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2 rounded transition"
            >
              Adicionar
            </button>
          </div>
        </section>

        {/* Horários Fixos Semanais */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Adicionar Horários Fixos Semanais</h2>
          <div className="flex flex-wrap gap-3 mb-4 justify-center">
            {diasDaSemana.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => alternarDia(value)}
                disabled={loading}
                className={`rounded-full px-4 py-2 font-medium border transition
                  ${
                    diasSelecionados.includes(value)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center text-black">
            <input
              type="time"
              value={horaSelecionada}
              onChange={(e) => setHoraSelecionada(e.target.value)}
              disabled={loading}
              className="border border-black rounded px-4 py-2 w-32 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={adicionarHorariosFixos}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2 rounded transition"
            >
              Adicionar Fixos
            </button>
          </div>
        </section>

        {/* Horários Disponíveis */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Horários Disponíveis</h2>
          {disponibilidades.length === 0 ? (
            <p className="text-gray-500">Nenhum horário disponível.</p>
          ) : (
            <ul className="divide-y divide-black">
              {disponibilidades.map((horario) => (
                <li
                  key={horario.id}
                  className="flex justify-between items-center py-3 text-black"
                >
                  <span>{new Date(horario.dataHora).toLocaleString()}</span>
                  <span
                    className={`font-semibold ${
                      horario.reservado ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {horario.reservado ? 'Reservado' : 'Disponível'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Agendamentos */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-blue-700">Agendamentos</h2>
          {agendamentos.length === 0 ? (
            <p className="text-black">Nenhum agendamento.</p>
          ) : (
            <ul className="space-y-6">
              {[...agendamentos]
                .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))
                .map((ag) => {
                  const cancelamento = cancelamentos.find((c) => c.agendamentoId === ag.id);
                  return (
                    <li
                      key={ag.id}
                      className="border rounded-md p-4 space-y-3 shadow-sm hover:shadow-md transition text-black"
                    >
                      <div>
                        <strong>Cliente:</strong> {ag.clienteNome || ag.clienteId}
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
                              <div className="mt-2 p-3 bg-black-50 rounded text-sm space-y-1">
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
                                  <div className="text-black-400">Informações de cancelamento não encontradas.</div>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <span>{ag.status}</span>
                        )}
                      </div>

                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => confirmarAgendamento(ag.id)}
                          disabled={ag.status === 'confirmado' || ag.status === 'cancelado' || loading}
                          className={`px-4 py-2 rounded font-semibold transition
                            ${
                              ag.status === 'confirmado' || ag.status === 'cancelado'
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }
                          `}
                        >
                          {ag.status === 'confirmado' ? 'Confirmado' : 'Confirmar'}
                        </button>

                        {ag.status !== 'cancelado' && (
                          <button
                            onClick={() => cancelarAgendamento(ag.id)}
                            disabled={loading}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
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