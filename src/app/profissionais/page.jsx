'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';


const cidadesDF = [
    '', 
    'Águas Claras', 'Arniqueira', 'Brazlândia', 'Ceilândia', 'Cruzeiro',
    'Gama', 'Guará', 'Lago Norte', 'Lago Sul', 'Núcleo Bandeirante',
    'Paranoá', 'Plano Piloto', 'Recanto das Emas', 'Riacho Fundo I', 'Riacho Fundo II',
    'Samambaia', 'Santa Maria', 'São Sebastião', 'Sobradinho', 'Taguatinga',
    'Vicente Pires'
].sort((a, b) => a.localeCompare(b));

const especialidadesComuns = [
    '', 
    'Eletricista', 'Encanador', 'Diarista', 'Jardineiro', 'Montador de Móveis',
    'Pedreiro', 'Pintor', 'Mecânico (Geral)', 'Chaveiro', 'Gesseiro',
    'Instalador de Ar Condicionado', 'Vidraceiro', 'Marceneiro', 'Serralheiro',
    'Desentupidor', 'Dedetizador', 'Tapeceiro', 'Técnico de Eletrônicos',
    'Churrasqueiro', 'Costureira/Alfaiate'
].sort((a, b) => a.localeCompare(b));


export default function Profissionais() {
    const [profissionais, setProfissionais] = useState([]);
    const [filtroEspecialidade, setFiltroEspecialidade] = useState('');
    const [filtroRegiaoAdministrativa, setFiltroRegiaoAdministrativa] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();

    const buscarProfissionais = useCallback(async () => {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (filtroEspecialidade) {
            queryParams.append('especialidade', filtroEspecialidade);
        }
        if (filtroRegiaoAdministrativa) {
            queryParams.append('regiaoAdministrativa', filtroRegiaoAdministrativa);
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
    }, [filtroEspecialidade, filtroRegiaoAdministrativa]);

    useEffect(() => {
        buscarProfissionais();
    }, [buscarProfissionais]);

    return (
        <div className="p-4 sm:p-8"> 
            <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-xl">
                <div className="relative overflow-hidden rounded-lg mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-800" />
                    <h1 className="relative text-4xl font-extrabold tracking-tight text-white py-6 text-center sm:text-5xl md:text-6xl">
                        Lista de Profissionais
                    </h1>
                </div>

                <div className="flex flex-wrap gap-4 mb-8 p-6 bg-gray-100 rounded-lg shadow-inner justify-center items-center">
                    {/* Filtro por Especialidade */}
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <label htmlFor="especialidade-filtro" className="font-semibold text-gray-700">Especialidade:</label>
                        <select
                            id="especialidade-filtro"
                            value={filtroEspecialidade}
                            onChange={e => setFiltroEspecialidade(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800 bg-white appearance-none min-w-[150px] relative z-10"
                        >
                            <option value="">Todas as Especialidades</option>
                            {especialidadesComuns.map(esp => (
                                <option key={esp} value={esp}>{esp}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Cidade/Região Administrativa */}
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <label htmlFor="regiao-filtro" className="font-semibold text-gray-700">Cidade/RA:</label>
                        <select
                            id="regiao-filtro"
                            value={filtroRegiaoAdministrativa}
                            onChange={e => setFiltroRegiaoAdministrativa(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800 bg-white appearance-none min-w-[150px] relative z-10"
                        >
                            <option value="">Todas as Cidades/RAs</option>
                            {cidadesDF.map(cidade => (
                                <option key={cidade} value={cidade}>{cidade}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading && <p className="text-center text-lg text-gray-600 my-8">Carregando profissionais...</p>}
                {error && <p className="text-center text-lg text-red-500 my-8">{error}</p>}
                {!loading && !error && profissionais.length === 0 && (
                    <p className="text-center text-lg text-gray-500 my-8">Nenhum profissional encontrado com os filtros aplicados.</p>
                )}

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
                    {profissionais.map(prof => (
                        <li key={prof.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <img 
                                src={prof.fotoPerfilUrl || 'https://res.cloudinary.com/dtwnpkgph/image/upload/v1750992429/145856997_296fe121-5dfa-43f4-98b5-db50019738a7_afxcdn.svg'} 
                                alt={prof.nome} 
                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4" 
                            />
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{prof.nome}</h2>

                            {prof.descricaoPerfil && ( 
                                <p className="text-gray-600 text-sm italic mt-2 mb-4 line-clamp-3"> 
                                    {prof.descricaoPerfil}
                                </p>
                            )}
                            
                            <p className="text-gray-700 mb-1">
                                <strong className="font-semibold text-gray-800">Especialidade:</strong> {prof.especialidade}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <strong className="font-semibold text-gray-800">Cidade:</strong> {prof.regiaoAdministrativa}
                            </p>
                        
                            <p className="text-gray-700 mb-4">
                                <strong className="font-semibold text-gray-800">Avaliação:</strong> {prof.avaliacaoMedia ? parseFloat(prof.avaliacaoMedia).toFixed(1) : 'Sem avaliações'} ⭐
                            </p>
                            
                            <button
                              onClick={() => router.push(`/perfil/${prof.id}`)}
                              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                            >
                              Ver Perfil
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}