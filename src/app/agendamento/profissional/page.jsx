'use client';

import { useState, useEffect } from 'react';

export default function PainelProfissional() {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [dataHora, setDataHora] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const buscarDisponibilidades = async () => {
    const res = await fetch('/api/disponibilidade', { headers });
    if (res.ok) {
      const dados = await res.json();
      setDisponibilidades(dados);
    } else {
      setDisponibilidades([]);
    }
  };

  const buscarAgendamentos = async () => {
    const res = await fetch('/api/agendamentos', { headers });
    if (res.ok) {
      const dados = await res.json();
      setAgendamentos(dados);
    } else {
      setAgendamentos([]);
    }
  };

  const adicionarHorario = async () => {
    if (!dataHora) return alert('Informe uma data e hora.');

    const res = await fetch('/api/disponibilidade', {
      method: 'POST',
      headers,
      body: JSON.stringify({ data_hora: dataHora }),
    });

    if (res.ok) {
      setDataHora('');
      buscarDisponibilidades();
    } else {
      alert('Erro ao adicionar horário.');
    }
  };

  const confirmarAgendamento = async (id) => {
    const res = await fetch('/api/agendamentos', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id, profissionalAceitou: true }),
    });

    if (res.ok) {
      buscarAgendamentos();
    } else {
      alert('Erro ao confirmar agendamento.');
    }
  };

  const cancelarAgendamento = async (id) => {
    const motivo = prompt('Informe o motivo do cancelamento:');
    if (!motivo) return;

    const res = await fetch(`/api/agendamentos/${id}?motivo=${motivo}&cancelado_por=profissional`, {
      method: 'DELETE',
      headers,
    });

    if (res.ok) {
      buscarDisponibilidades();
      buscarAgendamentos();
    } else {
      alert('Erro ao cancelar agendamento.');
    }
  };

  useEffect(() => {
    buscarDisponibilidades();
    buscarAgendamentos();
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
          />
          <button
            onClick={adicionarHorario}
            className="bg-blue-600 text-white px-4 py-2 rounded"
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
                <span className="text-red-500">Reservado</span>
              ) : (
                <span className="text-green-600">Disponível</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
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
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => confirmarAgendamento(ag.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => cancelarAgendamento(ag.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}