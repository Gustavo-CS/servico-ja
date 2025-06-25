'use client';

import { useEffect, useState } from 'react';

export default function PaginaDePerfil() {
  const [usuario, setUsuario] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }

    uploadFoto();
  }, [selectedFile]);

  if (!usuario) return <div className="p-6 text-center">Carregando...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Meu Perfil</h1>

      <div className="flex flex-col items-center mb-6">
        <img
          src={previewUrl || usuario.fotoPerfilUrl || '/placeholder.jpg'}
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

      <div className="space-y-4 text-gray-700 text-sm">
        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>CPF:</strong> {usuario.cpf}</p>
        <p><strong>Telefone:</strong> {usuario.telefone}</p>
        <p><strong>Data de nascimento:</strong> {new Date(usuario.dataNascimento).toLocaleDateString()}</p>
        <p><strong>Endereço:</strong> {usuario.endereco}</p>
        <p><strong>Tipo de Conta:</strong> {usuario.tipoConta ?? 'Não especificado'}</p>
      </div>
    </div>
  );
}
