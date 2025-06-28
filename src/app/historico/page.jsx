'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// --- Ícones SVG ---
const ChevronRightIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" /></svg>;
const ChatBubbleLeftRightIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM5.47 5.47a.75.75 0 0 1 1.06 0L10 8.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L11.06 10l3.47 3.47a.75.75 0 1 1-1.06 1.06L10 11.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L8.94 10 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>;


// --- Componente de Esqueleto para Loading ---
const ListItemSkeleton = () => (
    <div className="flex items-center space-x-4 p-4 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-slate-200"></div>
        <div className="flex-1 space-y-2">
            <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
        </div>
        <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
    </div>
);


export default function ListaUsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
  const [usuarios, SetUsuarios] = useState([]);
  const [busca, setBusca] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/historico');
                if (res.ok) {
                    const users = await res.json();
                    setUsuarios(users);
                } else {
                    console.error("Falha ao buscar histórico");
                }
            } catch (error) {
                console.error("Erro na requisição de histórico:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Função para extrair o ID de forma segura
    const getUserId = (usuario) => {
        return usuario.tipo === 'cliente' ? usuario.cliente?.id : usuario.profissional?.id;
    };
  useEffect(() => {
    async function load() {
      const res = await fetch('/api/historico?tipo=profissional');
      if (res.status == 200) {
        const users = await res.json();
        SetUsuarios(users);
        setBusca(true);
      }
    }
    load();
  }, []);

  async function mudarTipoBusca(tipo, bool) {
    const res = await fetch(`/api/historico?tipo=${tipo}`);
    if (res.status == 200) {
      const users = await res.json();
      SetUsuarios(users);
      setBusca(bool);
    }
  }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Histórico de Conversas</h1>
                <p className="mt-2 text-lg text-slate-600">Acesse suas interações e agendamentos anteriores.</p>

                <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div>
                            {[...Array(5)].map((_, i) => <ListItemSkeleton key={i} />)}
                        </div>
                    ) : usuarios.length > 0 ? (
                        <ul className="divide-y divide-slate-200">
                            {usuarios.map((usuario) => {
                                const userId = getUserId(usuario);
                                if (!userId) return null; // Não renderiza se o ID não for encontrado
                                
                                return (
                                    <li key={`${usuario.tipo}-${userId}`} className="hover:bg-slate-50 transition-colors">
                                        <Link href={`/historico/${userId}?tipo=${usuario.tipo}`} className="flex items-center p-4 space-x-4">
                                            <img
                                                src={usuario.usuario?.fotoPerfilUrl || 'https://res.cloudinary.com/dtwnpkgph/image/upload/v1750992429/145856997_296fe121-5dfa-43f4-98b5-db50019738a7_afxcdn.svg'}
                                                alt={`Foto de ${usuario.usuario?.nome}`}
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-800 truncate">{usuario.usuario?.nome}</p>
                                                <p className="text-sm text-slate-500 truncate">
                                                    {/* Dica: Futuramente, você pode mostrar a última mensagem aqui */}
                                                    Clique para ver o histórico de interações
                                                </p>
                                            </div>
                                            <div className="flex items-center text-slate-400">
                                                <ChevronRightIcon className="w-6 h-6" />
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-center py-16 px-6">
                            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">Nenhuma conversa encontrada</h3>
                            <p className="mt-1 text-slate-500">Quando você iniciar uma conversa, ela aparecerá aqui.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
  return (
    <div className=' bg-blue-500 min-h-screen py-8'>
      <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-xl">
        <div className='bg-gradient-to-r from-sky-600 to-blue-800 rounded-lg mb-4'>
          <h1 className="relative text-4xl font-bold tracking-tight text-white py-3 text-center"> {/* Título branco e com padding */}
            Histórico de serviços
          </h1>
        </div>
        <div className='flex gap-5'>
          <button onClick={() => { mudarTipoBusca("profissional", true) }} className={`flex mx-auto items-center justify-center rounded-md px-4 py-3 text-lg font-bold text-white shadow-sm hover:bg-blue-800 sm:px-8 transition-colors mb-4 w-60 ${busca ? "bg-blue-600" : "bg-blue-400"}`}>Profissionais</button>
          <button onClick={() => { mudarTipoBusca("cliente", false) }} className={`flex mx-auto items-center justify-center rounded-md px-4 py-3 text-lg font-bold text-white shadow-sm hover:bg-blue-800 sm:px-8 transition-colors mb-4 w-60 ${!busca ? "bg-blue-600" : "bg-blue-400"}`}>Cliente</button>
        </div>
        <ul className="space-y-4">
          {usuarios.map((usuario) => {
            console.log(usuario);
            return (
              <li key={usuario.tipo == 'cliente' ? 'cliente' + usuario.cliente.id : 'profissional' + usuario.profissional.id} className="border p-4 rounded shadow-sm hover:bg-gray-100 bg-white">
                <Link href={`/historico/${usuario.tipo === 'cliente' ? usuario.cliente.usuarioId : usuario.profissional.usuarioId}?tipo=${usuario.tipo}`}>
                  <div>
                    <p className="font-semibold">{usuario.usuario.nome}</p>
                    <p className="text-sm text-gray-500">{usuario.tipo === 'cliente' ? 'Cliente' : 'Profissional'}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}