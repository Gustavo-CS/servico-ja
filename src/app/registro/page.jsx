'use client';

import { useState } from 'react';

function EyeIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
}

function EyeSlashIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );
}

function formatarCPF(cpf) {
    const numeros = cpf.replace(/\D/g, '').slice(0, 11);
    return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}


const cidadesDF = [
    '', 
    'Plano Piloto', 'Taguatinga', 'Ceilândia', 'Samambaia', 'Gama',
    'Guará', 'Águas Claras', 'Sobradinho', 'Recanto das Emas', 'Santa Maria',
    'Arniqueira', 'Vicente Pires', 'Lago Sul', 'Lago Norte', 'Riacho Fundo I',
    'Riacho Fundo II', 'Cruzeiro', 'Paranoá', 'São Sebastião', 'Brazlândia'
].sort((a, b) => a.localeCompare(b)); 

const especialidadesComuns = [
    '',
    'Eletricista', 'Encanador', 'Diarista', 'Jardineiro', 'Montador de Móveis',
    'Pedreiro', 'Pintor', 'Mecânico (Geral)', 'Chaveiro', 'Gesseiro',
    'Instalador de Ar Condicionado', 'Vidraceiro', 'Marceneiro', 'Serralheiro',
    'Desentupidor', 'Dedetizador', 'Tapeceiro', 'Técnico de Eletrônicos',
    'Churrasqueiro', 'Costureira/Alfaiate'
].sort((a, b) => a.localeCompare(b));


export default function PaginaDeRegistro() {

    const [userType, setUserType] = useState('usuario');
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        endereco: '',
        regiaoAdministrativa: '',
        dataNascimento: '',
        senha: '',
        confirmarSenha: '',
        especialidade: '', 
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'cpf') {
            newValue = formatarCPF(value);
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const handleUserTypeChange = (e) => {
        const newUserType = e.target.value;
        setUserType(newUserType);
        if (newUserType === 'usuario') {
            setFormData(prev => ({ ...prev, especialidade: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.senha !== formData.confirmarSenha) {
            setError("As senhas não coincidem!");
            setIsLoading(false);
            return;
        }

        if (!formData.regiaoAdministrativa) {
            setError("Por favor, selecione sua Cidade/Região Administrativa.");
            setIsLoading(false);
            return;
        }

        if (userType === 'profissional' && !formData.especialidade) {
            setError("Por favor, selecione uma Especialidade para o profissional.");
            setIsLoading(false);
            return;
        }


        const finalData = {
            userType,
            ...formData,
            especialidade: userType === 'profissional' ? formData.especialidade : '',
        };

        try {
            const response = await fetch('/api/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Ocorreu um erro ao registrar.');
            }

            alert('Conta criada com sucesso!');

            window.location.href = '/login';
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Criar Conta
            </h1>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Qual tipo de conta você deseja criar?</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="userType" value="usuario" checked={userType === 'usuario'} onChange={handleUserTypeChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        <span className="ml-2 text-gray-800">Sou Cliente</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="userType" value="profissional" checked={userType === 'profissional'} onChange={handleUserTypeChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        <span className="ml-2 text-gray-800">Sou Profissional</span>
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-1">Nome completo</label>
                    <input type="text" id="nome" name="nome" placeholder="João da Silva" value={formData.nome} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black" required />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="cpf" className="block text-sm font-semibold text-gray-700 mb-1">CPF</label>
                    <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black" required />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
                    <input type="email" id="email" name="email" placeholder="exemplo@email.com" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black" required />
                </div>

                <div className="mb-4">
                    <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-1">Telefone</label>
                    <input type="tel" id="telefone" name="telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black" required />
                </div>

                <div className="mb-4">
                    <label htmlFor="regiaoAdministrativa" className="block text-sm font-semibold text-gray-700 mb-1">
                        Sua Cidade / Região Administrativa (DF)
                    </label>
                    <select
                        id="regiaoAdministrativa"
                        name="regiaoAdministrativa"
                        value={formData.regiaoAdministrativa}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black bg-white"
                        required
                    >
                        <option value="">Selecione uma cidade/RA</option>
                        {cidadesDF.map(cidade => (
                            <option key={cidade} value={cidade}>{cidade}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="endereco" className="block text-sm font-semibold text-gray-700 mb-1">Endereço (Rua, Número, Complemento)</label>
                    <input type="text" id="endereco" name="endereco" placeholder="Rua Exemplo, 123" value={formData.endereco} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black" required />
                </div>

                <div className="mb-4">
                    <label htmlFor="dataNascimento" className="block text-sm font-semibold text-gray-700 mb-1">Data de nascimento</label>
                    <input type="date" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black" required />
                </div>
                
                {userType === 'profissional' && (
                    <div className="mb-4">
                        <label htmlFor="especialidade" className="block text-sm font-semibold text-gray-700 mb-1">
                            Sua Especialidade Principal
                        </label>
                        <select
                            id="especialidade"
                            name="especialidade"
                            value={formData.especialidade}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black bg-white"
                            required 
                        >
                            <option value="">Selecione uma especialidade</option>
                            {especialidadesComuns.map(esp => (
                                <option key={esp} value={esp}>{esp}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                <div className="mb-4 relative">
                    <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
                    <input type={showPassword ? 'text' : 'password'} id="senha" name="senha" placeholder="••••••••" value={formData.senha} onChange={handleChange} className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-black" required />
                </div>

                <div className="mb-6 relative">
                    <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-gray-700 mb-1">Confirmar Senha</label>
                    <input type={showPassword ? 'text' : 'password'} id="confirmarSenha" name="confirmarSenha" placeholder="••••••••" value={formData.confirmarSenha} onChange={handleChange} className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-black" required />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600 -translate-y-1/2 top-1/2">
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                </div>
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:bg-indigo-300">
                    {isLoading ? 'Registrando...' : 'Registrar'}
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