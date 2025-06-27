'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaginaDePerfil() {
  const [usuario, setUsuario] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editDescricao, setEditDescricao] = useState(false);
  const [descricaoTemp, setDescricaoTemp] = useState('');
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Carrega dados do usuário autenticado
  useEffect(() => {
    async function fetchUsuario() {
      const res = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsuario(data);
    }

    fetchUsuario();
  }, []);

  // Envia imagem ao selecionar arquivo
  useEffect(() => {
    if (!selectedFile) return;

    async function uploadFoto() {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/upload_image_profile', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUsuario((prev) => ({ ...prev, fotoPerfilUrl: data.secure_url }));
        setDescricaoTemp(data.descricao_perfil || '');
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }
    
    uploadFoto();
  }, [selectedFile]);

  // api de logout
  const deslogar = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    router.push('/login');
  };

  const salvarDescricao = async () => {
    const res = await fetch('/api/update_descricao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ descricaoPerfil: descricaoTemp }),
    });
    if (res.ok) {
      setUsuario(prev => ({ ...prev, descricao_perfil: descricaoTemp }));
      setEditDescricao(false);
    }
  };

  if (!usuario) return <div className="p-6 text-center">Carregando...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Meu Perfil</h1>

      <div className="flex flex-col items-center mb-6">
        <img
          src={previewUrl || usuario.fotoPerfilUrl || 'https://res.cloudinary.com/dtwnpkgph/image/upload/v1750992429/145856997_296fe121-5dfa-43f4-98b5-db50019738a7_afxcdn.svg'}
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full object-cover shadow"
        />
        <label className="mt-4 cursor-pointer text-indigo-600 hover:underline text-sm">
          Alterar foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
        </label>
      </div>

      <div className="mb-4">
        <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700 mb-1">
          Sobre você
        </label>

        {editDescricao ? (
          <>
            <textarea
              id="descricao"
              name="descricao"
              rows={4}
              value={descricaoTemp}
              onChange={e => setDescricaoTemp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {descricaoTemp.length}/240
            </p>

            <div className="mt-2 space-x-2">
              <button
                onClick={() => setEditDescricao(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={salvarDescricao}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Salvar
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="border border-gray-200 p-3 rounded bg-gray-50">
              {usuario.descricao_perfil || 'Nenhuma descrição ainda.'}
            </p>
            <button
              onClick={() => setEditDescricao(true)}
              className="mt-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
            >
              Editar
            </button>
          </>
        )}
      </div>

      <div className="space-y-4 text-gray-700 text-sm">
        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>CPF:</strong> {usuario.cpf}</p>
        <p><strong>Telefone:</strong> {usuario.telefone}</p>
        <p><strong>Data de nascimento:</strong> {new Date(usuario.dataNascimento).toLocaleDateString()}</p>
        <p><strong>Endereço:</strong> {usuario.endereco}</p>
        <p><strong>Tipo de Conta:</strong> {usuario.tipoConta ?? 'Não especificado'}</p>
        <p><strong>Região Administrativa:</strong> {usuario.regiaoAdministrativa ?? 'Não especificado'}</p>
      </div>
      <button
        onClick={deslogar}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Sair da conta
      </button>
    </div>

    
  );
}
