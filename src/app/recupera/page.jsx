'use client';

import { useState } from 'react'; 




export default function PaginaDeRecuperar() {



  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Recuperar Conta
      </h1>

        <div className="mb-5">
          <label htmlFor="recovery" className="block text-sm font-semibold text-gray-700 mb-1">
          Digite o email para recuperação:
          </label>
          <input
            type="text"
            id="recovery"
            name="recovery"
            placeholder="exemplo@email.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>


         <div className="mb-4">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Recuperar conta
          </button>
        </div>




    </div>

)
}