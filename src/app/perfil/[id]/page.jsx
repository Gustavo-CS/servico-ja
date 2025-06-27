'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PaginaDePerfil() {
  const [usuario, setUsuario] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editDescricao, setEditDescricao] = useState(false);
  const [descricaoTemp, setDescricaoTemp] = useState('');
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const params = useParams();
  const id = params.id;
  // Carrega dados do usuário autenticado
  useEffect(() => {
    async function fetchUsuario() {
      const res = await fetch(`/api/perfil/${id}`, {
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


  if (!usuario) return <div className="p-6 text-center">Carregando...</div>;
  console.log(usuario)
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Meu Perfil</h1>

      <div className="flex flex-col items-center mb-6">
        <img
          src={previewUrl || usuario.fotoPerfilUrl || 'https://res.cloudinary.com/dtwnpkgph/image/upload/v1750992429/145856997_296fe121-5dfa-43f4-98b5-db50019738a7_afxcdn.svg'}
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full object-cover shadow"
        />
      </div>

      <Link href={`/agendamento/cliente/${usuario.id}`}  className='flex mx-auto items-center justify-center rounded-md border-2 border-blue-200 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-800 bg-blue-600 sm:px-8 transition-colors mb-4 w-60'>
        contratar meus serviços
      </Link>
      <p className="border border-gray-200 p-3 rounded bg-gray-50">
          {usuario.descricao_perfil || 'Nenhuma descrição ainda.'}
      </p>

      <div className="space-y-4 text-gray-700 text-sm">
        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Telefone:</strong> {usuario.telefone}</p>
        <p><strong>Tipo de Conta:</strong> {usuario.especialidade ?? 'Não especificado'}</p>
        <p><strong>Região Administrativa:</strong> {usuario.regiaoAdministrativa ?? 'Não especificado'}</p>
      </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Avaliações recebidas</h2>
          {usuario.reviews.length === 0 ? (
            <p className="text-gray-500">Ainda não há avaliações.</p>
          ) : (
            <ul className="space-y-4">
              {usuario.reviews.map((rev) => (
                <li key={rev.id} className="p-4 bg-gray-50 rounded shadow-sm">
                  <div className="flex items-center mb-2">
                    <img
                      src={rev.avaliadorFoto || '/placeholder.png'}
                      alt={rev.avaliadorNome}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium">{rev.avaliadorNome}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < rev.score ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {rev.comentario && <p className="text-gray-700">{rev.comentario}</p>}
                  <p className="text-xs text-gray-400 mt-2">{new Date(rev.criadoEm).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    
  );
}
