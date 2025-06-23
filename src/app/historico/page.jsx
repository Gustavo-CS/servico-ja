'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ListaUsuariosPage() {
  const [usuarios, SetUsuarios] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/historico');
      if (res.status == 200) {
        const users = await res.json();
        SetUsuarios(users);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      <ul className="space-y-4">
        {usuarios.map((usuario) => {console.log(usuario); return (
          <li key={usuario.usuario.id} className="border p-4 rounded shadow-sm hover:bg-gray-100">
            <Link href={`/historico/${usuario.usuario.id}?tipo=${usuario.tipo}`}>
              <div>
                <p className="font-semibold">{usuario.usuario.nome}</p>
                <p className="text-sm text-gray-500">{usuario.tipo === 'cliente' ? 'Cliente' : 'Profissional'}</p>
              </div>
            </Link>
          </li>
        )})}
      </ul>
    </div>
  );
}
