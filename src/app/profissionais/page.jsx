'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Ícones SVG para uma UI Profissional ---
const WrenchIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M11.09 3.552A1.75 1.75 0 0 1 12.5 3h1.25a1.75 1.75 0 0 1 1.75 1.75v1.25a1.75 1.75 0 0 1-.552 1.259l-6.5 6.5a1.75 1.75 0 0 1-2.475 0l-2.5-2.5a1.75 1.75 0 0 1 0-2.475l6.5-6.5Zm-2.298 7.025 2.298-2.298-1.5-1.5-2.298 2.298 1.5 1.5Z" clipRule="evenodd" /><path d="M3.5 10.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z" /></svg>;
const MapPinIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.1.4-.223.615-.379C12.082 17.84 13.37 16.833 14.5 15.5c1.13-1.333 1.92-2.824 2.16-4.37C16.92 9.42 16.5 7.5 15.5 6c-1-1.5-2.583-2.5-4.5-2.5s-3.5 1-4.5 2.5c-1 1.5-1.42 3.42-1.16 4.97.24 1.546 1.03 3.037 2.16 4.37 1.13 1.333 2.418 2.34 3.235 2.952.215.156.43.279.615.379.09.046.18.09.28.14l.018.008.006.003Z" clipRule="evenodd" /><path fillRule="evenodd" d="M10 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" clipRule="evenodd" /></svg>;
const StarIcon = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const MagnifyingGlassIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" /></svg>;


// --- Listas de Filtros ---
const cidadesDF = ['', 'Águas Claras', 'Arniqueira', 'Brazlândia', 'Ceilândia', 'Cruzeiro', 'Gama', 'Guará', 'Lago Norte', 'Lago Sul', 'Núcleo Bandeirante', 'Paranoá', 'Plano Piloto', 'Recanto das Emas', 'Riacho Fundo I', 'Riacho Fundo II', 'Samambaia', 'Santa Maria', 'São Sebastião', 'Sobradinho', 'Taguatinga', 'Vicente Pires'].sort((a, b) => a.localeCompare(b));
const especialidadesComuns = ['', 'Eletricista', 'Encanador', 'Diarista', 'Jardineiro', 'Montador de Móveis', 'Pedreiro', 'Pintor', 'Mecânico (Geral)', 'Chaveiro', 'Gesseiro', 'Instalador de Ar Condicionado', 'Vidraceiro', 'Marceneiro', 'Serralheiro', 'Desentupidor', 'Dedetizador', 'Tapeceiro', 'Técnico de Eletrônicos', 'Churrasqueiro', 'Costureira/Alfaiate'].sort((a, b) => a.localeCompare(b));


// --- Componente de Esqueleto para Loading ---
const CardSkeleton = () => (
    <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200"></div>
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
            </div>
        </div>
        <div className="mt-4 space-y-2">
            <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded-md w-full"></div>
        </div>
        <div className="mt-auto pt-4">
            <div className="h-11 bg-slate-200 rounded-lg w-full"></div>
        </div>
    </div>
);

export default function Profissionais() {
    const [profissionais, setProfissionais] = useState([]);
    const [filtroEspecialidade, setFiltroEspecialidade] = useState('');
    const [filtroRegiaoAdministrativa, setFiltroRegiaoAdministrativa] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const buscarProfissionais = useCallback(async (especialidade, regiao) => {
        setLoading(true);
        setError(null);
        const queryParams = new URLSearchParams();
        if (especialidade) queryParams.append('especialidade', especialidade);
        if (regiao) queryParams.append('regiaoAdministrativa', regiao);

        try {
            const response = await fetch(`/api/profissionais?${queryParams.toString()}`);
            if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
            const data = await response.json();
            setProfissionais(data);
        } catch (err) {
            console.error("Erro ao buscar profissionais:", err);
            setError("Não foi possível carregar os profissionais. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        buscarProfissionais(filtroEspecialidade, filtroRegiaoAdministrativa);
    }, [filtroEspecialidade, filtroRegiaoAdministrativa, buscarProfissionais]);

    const limparFiltros = () => {
        setFiltroEspecialidade('');
        setFiltroRegiaoAdministrativa('');
    }

    const renderAvaliacao = (avaliacao) => {
        const score = parseFloat(avaliacao) || 0;
        const totalStars = 5;
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: totalStars }, (_, i) => (
                    <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(score) ? 'text-amber-400' : 'text-slate-300'}`} />
                ))}
                <span className="text-sm font-semibold text-slate-600 ml-1">{score.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* HERO SECTION / FILTROS */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Encontre o Profissional Ideal</h1>
                    <p className="mt-2 text-lg text-slate-600">Filtre por especialidade e região para achar o serviço que você precisa.</p>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div className="relative">
                            <label htmlFor="especialidade-filtro" className="block text-sm font-medium text-slate-700 mb-1">Especialidade</label>
                            <WrenchIcon className="pointer-events-none absolute top-9 left-3 h-5 w-5 text-slate-400" />
                            <select id="especialidade-filtro" value={filtroEspecialidade} onChange={e => setFiltroEspecialidade(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition appearance-none">
                                <option value="">Todas</option>
                                {especialidadesComuns.map(esp => esp && <option key={esp} value={esp}>{esp}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <label htmlFor="regiao-filtro" className="block text-sm font-medium text-slate-700 mb-1">Cidade / Região Administrativa</label>
                            <MapPinIcon className="pointer-events-none absolute top-9 left-3 h-5 w-5 text-slate-400" />
                            <select id="regiao-filtro" value={filtroRegiaoAdministrativa} onChange={e => setFiltroRegiaoAdministrativa(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition appearance-none">
                                <option value="">Todas</option>
                                {cidadesDF.map(cidade => cidade && <option key={cidade} value={cidade}>{cidade}</option>)}
                            </select>
                        </div>
                        {(filtroEspecialidade || filtroRegiaoAdministrativa) && (
                            <button onClick={limparFiltros} className="text-sm font-semibold text-sky-600 hover:text-sky-700 lg:col-start-3 justify-self-start lg:justify-self-end">Limpar Filtros</button>
                        )}
                    </div>
                </section>

                {/* GRID DE PROFISSIONAIS */}
                <div>
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-semibold text-red-600">Ocorreu um Erro</h3>
                            <p className="text-slate-500 mt-2">{error}</p>
                        </div>
                    )}

                    {!loading && !error && profissionais.length === 0 && (
                        <div className="text-center py-16">
                            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">Nenhum Profissional Encontrado</h3>
                            <p className="mt-1 text-slate-500">Tente ajustar seus filtros ou verificar novamente mais tarde.</p>
                        </div>
                    )}

                    {!loading && !error && profissionais.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profissionais.map(prof => (
                                <div key={prof.id} className="bg-white p-5 rounded-2xl shadow-md flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={prof.fotoPerfilUrl || 'https://res.cloudinary.com/dtwnpkgph/image/upload/v1750992429/145856997_296fe121-5dfa-43f4-98b5-db50019738a7_afxcdn.svg'}
                                            alt={`Foto de ${prof.nome}`}
                                            className="w-16 h-16 rounded-full object-cover ring-2 ring-offset-2 ring-sky-200"
                                        />
                                        <div className="flex-1">
                                            <h2 className="text-lg font-bold text-slate-900 truncate">{prof.nome}</h2>
                                            {renderAvaliacao(prof.avaliacaoMedia)}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 text-sm space-y-3 text-slate-600 flex-grow">
                                        {prof.descricaoPerfil && (
                                            <p className="text-slate-500 italic line-clamp-3">
                                                "{prof.descricaoPerfil}"
                                            </p>
                                        )}
                                        <p className="flex items-center gap-2 !mt-3">
                                            <WrenchIcon className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-slate-800">{prof.especialidade}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <MapPinIcon className="w-4 h-4 text-slate-400" />
                                            {prof.regiaoAdministrativa}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4">
                                        <button
                                            onClick={() => router.push(`/perfil/${prof.id}`)}
                                            className="w-full bg-sky-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                        >
                                            Ver Perfil
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}