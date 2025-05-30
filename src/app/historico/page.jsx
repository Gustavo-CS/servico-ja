'use client';

import Link from 'next/link';

const usuarios = [
  { id: '1', nome: 'Felipe Cardoso', tipo: 'cliente' },
  { id: '2', nome: 'Ana Souza', tipo: 'profissional' },
  { id: '3', nome: 'Carlos Lima', tipo: 'profissional' },
  { id: '4', nome: 'Mariana Dias', tipo: 'cliente' },
];

export default function ListaUsuariosPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      <ul className="space-y-4">
        {usuarios.map((usuario) => (
          <li key={usuario.id} className="border p-4 rounded shadow-sm hover:bg-gray-100">
            <Link href={`/historico/${usuario.id}?tipo=${usuario.tipo}`}>
              <div>
                <p className="font-semibold">{usuario.nome}</p>
                <p className="text-sm text-gray-500">{usuario.tipo === 'cliente' ? 'Cliente' : 'Profissional'}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
