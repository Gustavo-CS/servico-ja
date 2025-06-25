'use client';
import { useState } from 'react';

export default function PaginaUpload() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert('Selecione uma imagem antes.');

    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');

    const res = await fetch('/api/upload_image_profile', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });



    const data = await res.json();
    console.log('URL da imagem:', data.secure_url);
    setUploadedUrl(data.secure_url);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Upload de Imagem
      </h1>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />

        {preview && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Pré-visualização:</p>
            <img
              src={preview}
              alt="Prévia da imagem"
              className="w-full h-auto rounded shadow"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Enviar para Cloudinary
        </button>
      </form>

      {uploadedUrl && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">Imagem enviada com sucesso:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline break-words"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
}
