'use client'

import Link from 'next/link'

export default function Home() {
  return (
   
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">

       <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Atalhos do Projeto
      </h1>


          
          


    <div>
      <Link href="/historico" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">Ir para Histórico de Serviços</Link>
      <br />
      <Link href="/login" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">Pagina de login</Link>

    </div>
    
    </div>

  );
}
