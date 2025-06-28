'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

// --- Ícones SVG para uma UI Profissional ---
const LocationIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" {...props}>
    <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.1.4-.223.615-.379C12.082 17.84 13.37 16.833 14.5 15.5c1.13-1.333 1.92-2.824 2.16-4.37C16.92 9.42 16.5 7.5 15.5 6c-1-1.5-2.583-2.5-4.5-2.5s-3.5 1-4.5 2.5c-1 1.5-1.42 3.42-1.16 4.97.24 1.546 1.03 3.037 2.16 4.37 1.13 1.333 2.418 2.34 3.235 2.952.215.156.43.279.615-.379.09.046.18.09.28.14l.018.008.006.003Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M10 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" clipRule="evenodd" />
  </svg>
);

// ÍCONE CORRIGIDO
const BriefcaseIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" {...props}>
      <path d="M8.5 2.5a.5.5 0 0 0-1 0v.213a3.52 3.52 0 0 0-1.14.713l-.159-.159a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.159.159a3.52 3.52 0 0 0-.713 1.14H2.5a.5.5 0 0 0 0 1h.213a3.52 3.52 0 0 0 .713 1.14l-.159.159a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.159-.159a3.52 3.52 0 0 0 1.14.713v.213a.5.5 0 0 0 1 0v-.213a3.52 3.52 0 0 0 1.14-.713l.159.159a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.159-.159a3.52 3.52 0 0 0 .713-1.14h.213a.5.5 0 0 0 0-1h-.213a3.52 3.52 0 0 0-.713-1.14l.159-.159a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.159.159A3.52 3.52 0 0 0 8.5 2.713V2.5Z" />
      <path d="M11.5 6.5a.5.5 0 0 0-1 0v.5a1.5 1.5 0 0 0 1.5 1.5h.5a.5.5 0 0 0 0-1h-.5a.5.5 0 0 1-.5-.5v-.5Z" />
    </svg>
);
const StarIcon = (props) => <svg className={props.className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

// --- Componente de Spinner ---
const Spinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-slate-50">
    <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// --- Componente para renderizar a avaliação com estrelas ---
const RenderAvaliacao = ({ avaliacaoMedia }) => {
    const score = parseFloat(avaliacaoMedia) || 0;
    return (
        <div className="flex items-center gap-1 justify-center">
            {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(score) ? 'text-amber-400' : 'text-slate-300'}`} />
            ))}
            <span className="text-sm font-semibold text-slate-600 ml-1">{score > 0 ? score.toFixed(1) : 'N/A'}</span>
        </div>
    );
};

export default function PaginaDePerfil() {
  const [usuario, setUsuario] = useState(null);
  const [isOwner, setIsOwner] = useState(false); // Estado para saber se é o dono do perfil
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    async function fetchUsuario() {
      if (!id) return;
      try {
        const res = await fetch(`/api/perfil/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Falha ao carregar perfil do usuário.');

        const data = await res.json();
        
        // AQUI ESTÁ A CORREÇÃO PRINCIPAL:
        // A gente pega o objeto 'user' de dentro do 'data'
        setUsuario(data.user); 
        // E também pegamos a informação se somos o dono do perfil
        setIsOwner(data.isOwner); 

      } catch (error) {
        console.error(error);
        // Opcional: redirecionar para uma página 404 se o perfil não for encontrado
        // router.push('/not-found');
      }
    }

    fetchUsuario();
  }, [id, token, router]);

  if (!usuario) return <Spinner />;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Coluna da Esquerda: Cartão de Perfil */}
        <aside className="lg:col-span-1 flex flex-col">
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center flex flex-col items-center sticky top-8">
            <img
              src={usuario.fotoPerfilUrl || 'https://res.cloudinary.com/dtwnpkgph/image/upload/v1750992429/145856997_296fe121-5dfa-43f4-98b5-db50019738a7_afxcdn.svg'}
              alt={`Foto de ${usuario.nome}`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <h1 className="text-2xl font-bold text-slate-800 mt-4">{usuario.nome}</h1>
            <p className="text-md text-sky-600 font-medium">{usuario.especialidade || 'Cliente'}</p>
            <div className="mt-2">
                <RenderAvaliacao avaliacaoMedia={usuario.avaliacaoMedia} />
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 justify-center">
              <LocationIcon className="text-slate-400" />
              <span>{usuario.regiaoAdministrativa || 'Não especificado'}</span>
            </div>

            {/* A LÓGICA CORRIGIDA PARA MOSTRAR O BOTÃO: */}
            {/* Só mostra se NÃO formos o dono E se a conta for de um profissional */}
            {!isOwner && usuario.tipoConta === 'profissional' && (
              <Link 
                href={`/agendamento/cliente/${usuario.id}`} 
                className='mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'>
                  <BriefcaseIcon />
                  Contratar Serviços
              </Link>
            )}
          </div>
        </aside>

        {/* Coluna da Direita: Detalhes e Avaliações */}
        <section className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Sobre {usuario.nome.split(' ')[0]}</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {usuario.descricao_perfil || <span className="italic text-slate-400">Nenhuma descrição adicionada.</span>}
                </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Avaliações Recebidas</h2>
              {usuario.reviews && usuario.reviews.length > 0 ? (
                <ul className="space-y-6">
                  {usuario.reviews.map((rev) => (
                    <li key={rev.id} className="flex gap-4">
                      <img
                        src={rev.avaliadorFoto || 'https://res.cloudinary.com/dtwnpkgph/image/upload/v1750992429/145856997_296fe121-5dfa-43f4-98b5-db50019738a7_afxcdn.svg'}
                        alt={rev.avaliadorNome}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                          <div className="flex justify-between items-center">
                              <p className="font-semibold text-slate-700">{rev.avaliadorNome}</p>
                              <p className="text-xs text-slate-400">{new Date(rev.criadoEm).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div className="flex items-center my-1">
                            <RenderAvaliacao avaliacaoMedia={rev.score} />
                          </div>
                          {rev.comentario && <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{rev.comentario}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-slate-500">
                    <p>Este profissional ainda não recebeu avaliações.</p>
                </div>
              )}
            </div>
        </section>
      </main>
    </div>
  );
}
