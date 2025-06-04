'use client';

import { useState } from 'react';

export default function PaginaDeRegistro() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    data_nascimento: '',
    senha: '',
    confirmarSenha: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você faria uma chamada à API para registrar o usuário
    console.log('Dados do formulário:', formData);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Criar Conta
      </h1>

      <form onSubmit={handleSubmit}>
        {['nome', 'cpf', 'email', 'telefone', 'endereco'].map((field) => (
          <div key={field} className="mb-4">
            <label htmlFor={field} className="block text-sm font-semibold text-gray-700 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        ))}

        <div className="mb-4">
          <label htmlFor="data_nascimento" className="block text-sm font-semibold text-gray-700 mb-1">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="data_nascimento"
            name="data_nascimento"
            value={formData.data_nascimento}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-1">
            Senha
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-gray-700 mb-1">
            Confirmar Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Registrar
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Já tem uma conta?{' '}
        <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
          Acesse aqui
        </a>
      </p>
    </div>
  );
}
