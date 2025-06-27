'use client';

import { useState, useEffect } from 'react';

export default function PainelCliente() {
  const [idProfissional, setIdProfissional] = useState('');
  const [slots, setSlots] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [atualizar, setAtualizar] = useState(false);

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
        console.error('Resposta da API não é um array:', data);
        setSlots([]);
        return;
      }

      setSlots(data.filter((slot) => !slot.reservado));
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
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
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setAgendamentos([]);
    }
  };

  const filtrarPorProfissional = () => {
    const profIdNum = Number(idProfissional);
    if (!idProfissional || isNaN(profIdNum)) {
      buscarSlotsDisponiveis(null);
    } else {
      buscarSlotsDisponiveis(profIdNum);
    }
  };

  const agendarHorario = async (slotId) => {
    try {
      const res = await fetch('/api/agendamentos', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          slot_id: slotId,
        }),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || 'Erro ao agendar');
      }

      alert('Agendamento realizado com sucesso!');
      buscarSlotsDisponiveis(idProfissional);
      buscarAgendamentos();
    } catch (error) {
      alert('Erro ao agendar horário: ' + error.message);
    }
  };

  const cancelarAgendamento = async (id) => {
    const motivo = prompt('Informe o motivo do cancelamento:');
    if (!motivo) return alert('Cancelamento sem motivo não permitido.');

    const res = await fetch(`/api/agendamentos/${id}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ motivo }),
    });

    if (res.ok) {
      alert('Agendamento cancelado com sucesso!');
      setAtualizar((prev) => !prev);
    } else {
      const error = await res.json();
      alert('Erro ao cancelar agendamento: ' + (error.error || 'Erro desconhecido'));
    }
  };

  useEffect(() => {
    buscarSlotsDisponiveis(idProfissional || null);
    buscarAgendamentos();
  }, [atualizar, idProfissional]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Painel do Cliente</h1>

      <section className="mb-6">
        <label className="block mb-2 font-semibold" htmlFor="idProfissional">
          Filtrar horários por ID do profissional:
        </label>
        <div className="flex gap-2 mb-4">
          <input
            id="idProfissional"
            type="number"
            value={idProfissional}
            onChange={(e) => setIdProfissional(e.target.value)}
            placeholder="Digite o ID do profissional"
            className="border rounded px-3 py-2 flex-grow"
          />
          <button onClick={filtrarPorProfissional} className="bg-blue-600 text-white px-4 py-2 rounded">
            Filtrar
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-2">Horários Disponíveis</h2>
        {slots.length === 0 ? (
          <p>Nenhum horário disponível no momento.</p>
        ) : (
          <ul className="space-y-2">
            {slots.map((slot) => (
              <li key={slot.id} className="border p-3 rounded flex justify-between items-center">
                <span>{new Date(slot.dataHora).toLocaleString()}</span>
                <button
                  onClick={() => agendarHorario(slot.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Agendar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Meus Agendamentos</h2>
        {agendamentos.length === 0 ? (
          <p>Você não tem agendamentos.</p>
        ) : (
          <ul className="space-y-2">
            {agendamentos.map((agendamento) => (
              <li key={agendamento.id} className="border p-3 rounded space-y-1">
                <div>
                  <strong>Data:</strong> {new Date(agendamento.data_hora).toLocaleString()}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  {agendamento.status === "confirmado" ? (
                    <span className="text-green-600 font-semibold">Confirmado</span>
                  ) : agendamento.status === "pendente" ? (
                    <span className="text-yellow-600 font-semibold">Pendente</span>
                  ) : agendamento.status === "cancelado" ? (
                    <span className="text-red-600 font-semibold">Cancelado</span>
                  ) : (
                    <span>{agendamento.status}</span>
                  )}
                </div>
                
                {agendamento.status !== "cancelado" && (
                  <button
                    onClick={() => cancelarAgendamento(agendamento.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded mt-2"
                  >
                    Cancelar Agendamento
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}