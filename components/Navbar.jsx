'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('usuario');
        if (user) {
            try {
                setUsuarioLogado(JSON.parse(user));
            } catch (e) {
                console.error("Erro ao parsear dados do usuário do localStorage:", e);
                localStorage.removeItem('usuario');
                localStorage.removeItem('token');
                setUsuarioLogado(null);
            }
        }
    }, []);

    const deslogar = async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuarioLogado(null);
        router.push('/login');
    };

    return (

        <nav className="bg-white text-blue-800 py-3 shadow-md"> 
            <div className="container mx-auto flex justify-between items-center">

                <Link href="/" className="text-2xl font-bold text-blue-800 hover:text-blue-600 transition-colors">
                    <img src="/logo.png" alt="Serviço Já Logo" className="h-18 w-auto" /> 
                </Link>

                <div className="flex space-x-6 items-center">

                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link> 
                    <Link href="/profissionais" className="hover:text-blue-600 transition-colors">Profissionais</Link> 

                    {usuarioLogado ? (
                        <>
                            {usuarioLogado.tipoConta === 'profissional' && (
                                <>
                                    
                                    <Link href="/historico" className="hover:text-blue-600 transition-colors">Meus Serviços</Link>
                                    <Link href="/agendamento/profissional" className="hover:text-blue-600 transition-colors">Meus Agendamentos</Link> 
                                </>
                            )}
                            <Link href="/profile" className="hover:text-blue-600 transition-colors">Perfil</Link> 
                            
                            <button
                                onClick={deslogar}
                                className="bg-red-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-red-700 transition-colors"
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Links para USUÁRIOS NÃO LOGADOS */}
                            <Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link> {/* Alterado aqui */}
                            <Link href="/registro" className="bg-blue-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-blue-700 transition-colors">
                                Cadastro
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}