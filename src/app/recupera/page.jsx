'use client';

import { useState } from 'react'; 




export default function PaginaDeRecuperar() {



  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Recuperar Conta
      </h1>

        <div className="mb-5">
          <label htmlFor="login" className="block text-sm font-semibold text-gray-700 mb-1">
            Digite o email para recuperação:
          </label>
          <input
            type="text"
            id="login"
            name="login"
            placeholder="exemplo@email.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>




    </div>

)
}