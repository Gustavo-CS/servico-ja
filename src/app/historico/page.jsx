// // Exemplo com App Router
// 'use client';

// import { useState } from 'react';

// const historicoCliente = [
//   {
//     id: 1,
//     profissional: 'Ana Souza',
//     servico: 'Corte de Cabelo',
//     data: '2025-05-20',
//   },
//   {
//     id: 2,
//     profissional: 'Carlos Lima',
//     servico: 'Massagem Relaxante',
//     data: '2025-05-18',
//   },
// ];

// const historicoProfissional = [
//   {
//     id: 1,
//     cliente: 'Gustavo Santos',
//     servico: 'Corte de Cabelo',
//     data: '2025-05-20',
//   },
//   {
//     id: 2,
//     cliente: 'Mariana Dias',
//     servico: 'Barba e Bigode',
//     data: '2025-05-19',
//   },
// ];

// export default function HistoricoPage() {
//   const [tipo, setTipo] = useState<'cliente' | 'profissional'>('cliente');

//   // const historico = tipo === 'cliente' ? historicoCliente : historicoProfissional;

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Histórico de Serviços</h1>

//       <div className="mb-6">
//         <button
//           onClick={() => setTipo('cliente')}
//           className={`px-4 py-2 mr-2 rounded ${tipo === 'cliente' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         >
//           Como Cliente
//         </button>
//         <button
//           onClick={() => setTipo('profissional')}
//           className={`px-4 py-2 rounded ${tipo === 'profissional' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         >
//           Como Profissional
//         </button>
//       </div>

//       <ul className="space-y-4">
//         {/* {historico.map((item) => (
//           <li key={item.id} className="border p-4 rounded shadow-sm">
//             <p><strong>Serviço:</strong> {item.servico}</p>
//             <p>
//               <strong>{tipo === 'cliente' ? 'Profissional' : 'Cliente'}:</strong>{' '}
//               {tipo === 'cliente' ? item.profissional : item.cliente}
//             </p>
//             <p><strong>Data:</strong> {item.data}</p>
//           </li>
//         ))} */}
//         {tipo === 'cliente' ? (
//           historicoCliente.map((item) => (
//             <li key={item.id} className="border p-4 rounded shadow-sm">
//               <p><strong>Serviço:</strong> {item.servico}</p>
//               <p><strong>Profissional:</strong> {item.profissional}</p>
//               <p><strong>Data:</strong> {item.data}</p>
//             </li>
//           ))
//         ) : (
//           historicoProfissional.map((item) => (
//             <li key={item.id} className="border p-4 rounded shadow-sm">
//               <p><strong>Serviço:</strong> {item.servico}</p>
//               <p><strong>Cliente:</strong> {item.cliente}</p>
//               <p><strong>Data:</strong> {item.data}</p>
//             </li>
//           ))
//         )}

//       </ul>
//     </div>
//   );
// }


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
