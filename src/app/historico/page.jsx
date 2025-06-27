'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ListaUsuariosPage() {
  const [usuarios, SetUsuarios] = useState([]);
  const [busca, setBusca] = useState(true);

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
