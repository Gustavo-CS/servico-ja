'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// --- Ícones SVG para uma UI profissional ---
const UserIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.41-1.412A6.962 6.962 0 0 0 10 11.5a6.962 6.962 0 0 0-6.535 2.993Z" /></svg>;
const CogIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M7.83 11.006a1 1 0 0 1 1.413-.099l.106.105a1 1 0 0 1 .1 1.414l-1.32 1.32a1 1 0 1 1-1.414-1.414l1.114-1.114.001-.002Zm-1.318.002a1 1 0 0 1 1.414.1l.105.106a1 1 0 0 1-.1 1.413l-1.32 1.32a1 1 0 1 1-1.414-1.414l1.114-1.114-.001.001Z" clipRule="evenodd" /><path d="M10.002 6.75a.5.5 0 0 1 .5.5v1.518a4.502 4.502 0 0 1 2.368 2.368h1.518a.5.5 0 0 1 0 1h-1.518a4.502 4.502 0 0 1-2.368 2.368v1.518a.5.5 0 0 1-1 0v-1.518A4.502 4.502 0 0 1 6.75 12.272H5.232a.5.5 0 0 1 0-1h1.518a4.502 4.502 0 0 1 2.368-2.368V6.75a.5.5 0 0 1 .5-.5Z" /><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-5.5-8a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z" clipRule="evenodd" /></svg>;
const LogoutIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" /><path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.75a.75.75 0 0 0 0 1.5h9.5a.75.75 0 0 0 .75-.75Z" clipRule="evenodd" /><path fillRule="evenodd" d="M15.53 6.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06L13.81 10.5l2.72-2.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" /></svg>;
const CameraIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.5a.5.5 0 0 0 0-1H3a3 3 0 0 0-3 3v1.5a.5.5 0 0 0 1 0V8Zm18 0a2 2 0 0 0-2-2h-.5a.5.5 0 0 1 0-1H17a3 3 0 0 1 3 3v1.5a.5.5 0 0 1-1 0V8Z" clipRule="evenodd" /><path d="M10 2a4 4 0 0 0-4 4v1.5a.5.5 0 0 0 1 0V6a3 3 0 0 1 3-3h.155A2.996 2.996 0 0 1 13 6v1.5a.5.5 0 0 0 1 0V6a4 4 0 0 0-4-4h-.155Z" /><path fillRule="evenodd" d="M3 9.5a.5.5 0 0 0-.5.5v3a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-3a.5.5 0 0 0-1 0v3a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-3a.5.5 0 0 0-.5-.5Z" clipRule="evenodd" /><path d="M10 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM7.5 10.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z" /></svg>;

// --- Componente de Spinner ---
const Spinner = () => (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export default function PaginaDePerfil() {
    const [usuario, setUsuario] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [editDescricao, setEditDescricao] = useState(false);
    const [descricaoTemp, setDescricaoTemp] = useState('');
    const router = useRouter();

    const [token, setToken] = useState(null);
    
    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
        if (!storedToken) {
            router.push('/login');
            return;
        }
        async function fetchUsuario() {
          console.log("chegou até aqi")
            try {
                const res = await fetch('/api/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Falha ao carregar usuário.');
                const data = await res.json();
                setUsuario(data);
                setDescricaoTemp(data.descricao_perfil || '');
            } catch (error) {
                console.error(error);
                // router.push('/login');
            }
        }
        fetchUsuario();
    }, [token, router]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
    useEffect(() => {
        if (!selectedFile) return;
        async function uploadFoto() {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const res = await fetch('/api/upload_image_profile', {
                method: 'POST',
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setUsuario((prev) => ({ ...prev, fotoPerfilUrl: data.secure_url }));
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        }
        uploadFoto();
    }, [selectedFile, token]);

    const deslogar = async () => {
        await fetch('/api/logout', { method: 'POST', credentials: 'include' });
        localStorage.removeItem('token');
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
    
    // Formata a data para o padrão brasileiro
    const formatarData = (dataISO) => {
        if (!dataISO) return 'Não especificado';
        return new Date(dataISO).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    if (!usuario) return <Spinner />;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8 p-4 sm:p-6 lg:p-8">

                {/* --- MENU LATERAL --- */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-8 bg-white p-4 rounded-2xl shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative group">
                                <img
                                    src={previewUrl || usuario.fotoPerfilUrl || 'https://res.cloudinary.com/dtwnpkgph/image/upload/v1750992429/145856997_296fe121-5dfa-43f4-98b5-db50019738a7_afxcdn.svg'}
                                    alt="Foto de perfil"
                                    className="w-28 h-28 rounded-full object-cover ring-4 ring-white"
                                />
                                <label htmlFor="file-upload" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                                    <CameraIcon className="w-8 h-8 text-white" />
                                </label>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-slate-900">{usuario.nome}</h2>
                            <p className="text-sm text-slate-500">{usuario.email}</p>
                        </div>
                        <nav className="mt-8 flex flex-col space-y-2">
                            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-sky-50 text-sky-600 font-semibold rounded-lg">
                                <UserIcon className="w-5 h-5" /> Meu Perfil
                            </a>
                           
                            <button onClick={deslogar} className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <LogoutIcon className="w-5 h-5" /> Sair da conta
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* --- CONTEÚDO PRINCIPAL --- */}
                <main className="lg:col-span-3 flex flex-col gap-8">
                    {/* Card Sobre Você */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Sobre Você</h3>
                            <button onClick={() => { setEditDescricao(!editDescricao); setDescricaoTemp(usuario.descricao_perfil || ''); }} className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                                {editDescricao ? 'Cancelar' : 'Editar'}
                            </button>
                        </div>
                        <div className="mt-4">
                            {editDescricao ? (
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        value={descricaoTemp}
                                        onChange={e => setDescricaoTemp(e.target.value)}
                                        rows={5}
                                        maxLength={240}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                                        placeholder="Escreva um pouco sobre você..."
                                    />
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-slate-400">{descricaoTemp.length}/240</p>
                                        <button onClick={salvarDescricao} className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors">
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-600 leading-relaxed">
                                    {usuario.descricao_perfil || <span className="text-slate-400 italic">Nenhuma descrição adicionada.</span>}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Card Detalhes da Conta */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Detalhes da Conta</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {[
                                { label: 'Nome Completo', value: usuario.nome },
                                { label: 'CPF', value: usuario.cpf },
                                { label: 'Telefone', value: usuario.telefone },
                                { label: 'Data de Nascimento', value: formatarData(usuario.dataNascimento) },
                                { label: 'Endereço', value: usuario.endereco },
                                { label: 'Região Administrativa', value: usuario.regiaoAdministrativa },
                                { label: 'Tipo de Conta', value: usuario.tipoConta },
                            ].map(item => (
                                <div key={item.label} className="pt-2">
                                    <dt className="text-sm font-medium text-slate-500">{item.label}</dt>
                                    <dd className="text-md font-semibold text-slate-800">{item.value || 'Não especificado'}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </main>

            </div>
        </div>
    );
}