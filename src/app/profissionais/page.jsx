'use client';

import { useEffect, useState, useCallback } from 'react';

export default function Profissionais() {
    const [profissionais, setProfissionais] = useState([]);
    const [filtroEspecialidade, setFiltroEspecialidade] = useState('');
    const [filtroBairro, setFiltroBairro] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const buscarProfissionais = useCallback(async () => {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (filtroEspecialidade) {
            queryParams.append('especialidade', filtroEspecialidade);
        }
        if (filtroBairro) {
            queryParams.append('bairro', filtroBairro);
        }

        try {
            const response = await fetch(`/api/profissionais?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setProfissionais(data);
        } catch (err) {
            console.error("Erro ao buscar profissionais:", err);
            setError("Não foi possível carregar os profissionais. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    }, [filtroEspecialidade, filtroBairro]);

    useEffect(() => {
        buscarProfissionais();
    }, [buscarProfissionais]);

    return (
        <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-xl my-8">
    
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Lista de Profissionais</h1>

            <div className="flex flex-wrap gap-4 mb-8 p-6 bg-gray-100 rounded-lg shadow-inner justify-center items-center">

                <div className="flex flex-col md:flex-row items-center gap-2">
                    <label htmlFor="especialidade-filtro" className="font-semibold text-gray-700">Especialidade:</label>
                    <input
                        id="especialidade-filtro"
                        type="text"
                        value={filtroEspecialidade}
                        onChange={e => setFiltroEspecialidade(e.target.value)}
                        placeholder="Ex: Eletricista"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800 min-w-[150px]"
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2">
                    <label htmlFor="bairro-filtro" className="font-semibold text-gray-700">Bairro:</label>
                    <input
                        id="bairro-filtro"
                        type="text"
                        value={filtroBairro}
                        onChange={e => setFiltroBairro(e.target.value)}
                        placeholder="Ex: Centro"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800 min-w-[150px]"
                    />
                </div>
                {/* Removi o filtro de disponibilidade por enquanto */}
            </div>

            {loading && <p className="text-center text-lg text-gray-600 my-8">Carregando profissionais...</p>}
            {error && <p className="text-center text-lg text-red-500 my-8">{error}</p>}
            {!loading && !error && profissionais.length === 0 && (
                <p className="text-center text-lg text-gray-500 my-8">Nenhum profissional encontrado com os filtros aplicados.</p>
            )}

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
                {profissionais.map(prof => (
                  
                    <li key={prof.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        {/* TODO: Implementar a exibição da foto real do profissional.
                            1. Adicionar o campo 'foto' (URL ou nome do arquivo) no schema 'usuario' (ou 'profissional').
                            2. Atualizar a query no 'app/api/profissionais/route.js' para selecionar 'usuario.foto' e incluir no groupBy.
                            3. Substituir '/default-avatar.png' por `{prof.foto || '/default-avatar.png'}` para usar a foto do DB se existir, senão usar o padrão.
                        */}
                        <img src={`/default-avatar.png`} alt={prof.nome} className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4" />
                        
                        
                        <h2>{prof.nome}</h2>
            
                        <p className="text-gray-700 mb-1">
                            <strong className="font-semibold text-gray-800">Especialidade:</strong> {prof.especialidade}
                        </p>
                        <p className="text-gray-700 mb-1">
                            <strong className="font-semibold text-gray-800">Endereço:</strong> {prof.endereco}
                        </p>
                        {/* Exibe a avaliação média, formatando para 1 casa decimal */}
                        <p className="text-gray-700 mb-4">
                            <strong className="font-semibold text-gray-800">Avaliação:</strong> {prof.avaliacaoMedia ? parseFloat(prof.avaliacaoMedia).toFixed(1) : 'Sem avaliações'} ⭐</p>
                      
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
                            Ver Perfil
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}