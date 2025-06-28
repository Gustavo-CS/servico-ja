'use client';

import Link from 'next/link';

// Os componentes de ícones não mudam, pois a cor é definida pela classe no momento do uso.
const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const CalendarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" />
  </svg>
);

const StarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

const WrenchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83M11.42 15.17l2.472-2.472a.563.563 0 0 1 .796 0l2.472 2.472a.563.563 0 0 1 0 .796l-2.472 2.472a.563.563 0 0 1-.796 0l-2.472-2.472a.563.563 0 0 1 0-.796M4.5 12.75l6.375-6.375a1.125 1.125 0 0 1 1.591 0l2.25 2.25a1.125 1.125 0 0 1 0 1.591l-6.375 6.375a1.125 1.125 0 0 1-1.591 0l-2.25-2.25a1.125 1.125 0 0 1 0-1.591Z" />
  </svg>
);

const BoltIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const PaintBrushIcon = (props) => (
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 1.5 18.5a2.25 2.25 0 0 1 2.25-2.25c1.152 0 2.176.622 2.753 1.543a3 3 0 0 0 5.78-1.128Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.036 15.118c.585-.422 1.233-.734 1.927-.918a3.75 3.75 0 0 1 4.285.347 3.75 3.75 0 0 1 1.256 5.174 2.25 2.25 0 0 0 .584 1.953 2.25 2.25 0 0 1-2.18-2.475a3.75 3.75 0 0 1-.347-4.285 3.75 3.75 0 0 1-5.174-1.256c-.422-.585-.734-1.233-.918-1.927Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.563 0 1.096.034 1.62.096a5.25 5.25 0 0 1 4.496 4.496C18.182 8.904 18.25 9.437 18.25 10c0 .563-.034 1.096-.096 1.62a5.25 5.25 0 0 1-4.496 4.496C12.596 16.182 12.063 16.25 11.5 16.25c-.563 0-1.096-.034-1.62-.096a5.25 5.25 0 0 1-4.496-4.496C5.318 11.096 5.25 10.563 5.25 10c0-.563.034-1.096.096-1.62A5.25 5.25 0 0 1 9.838 3.884C10.362 3.818 10.888 3.75 11.5 3.75Z" />
  </svg>
);


export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      
      <header className="relative">
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-800" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Serviço Já
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-blue-100">
                A solução que você precisa, na hora que você quer.
            </p>
            <div className="mx-auto mt-10 max-w-sm sm:max-w-none sm:flex sm:justify-center">
                <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link href="/profissionais" className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8 transition-colors">
                        Encontrar um Profissional
                    </Link>
                    <Link href="/registro" className="flex items-center justify-center rounded-md border-2 border-blue-200 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-800 sm:px-8 transition-colors">
                        Sou um Profissional
                    </Link>
                </div>
            </div>
        </div>
      </header>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Como Funciona?</h2>
          <p className="text-gray-600 mb-12">Encontre ajuda em 3 passos simples.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 rounded-full p-6 mb-4">
                <SearchIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Busque</h3>
              <p className="text-gray-600">Digite o serviço que você precisa e veja uma lista de profissionais qualificados.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 rounded-full p-6 mb-4">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Agende</h3>
              <p className="text-gray-600">Verifique a disponibilidade e agende o serviço para o melhor dia e horário.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 rounded-full p-6 mb-4">
                <StarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Avalie</h3>
              <p className="text-gray-600">Após o serviço, deixe sua avaliação e ajude outros usuários a escolherem.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Explore Nossas Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <BoltIcon className="h-10 w-10 text-blue-600 mb-3" />
              <span className="font-semibold">Eletricistas</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <WrenchIcon className="h-10 w-10 text-blue-600 mb-3" />
              <span className="font-semibold">Encanadores</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <PaintBrushIcon className="h-10 w-10 text-blue-600 mb-3" />
              <span className="font-semibold">Pintores</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <StarIcon className="h-10 w-10 text-blue-600 mb-3" />
              <span className="font-semibold">Montadores</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <SearchIcon className="h-10 w-10 text-blue-600 mb-3" />
              <span className="font-semibold">Limpeza</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <CalendarIcon className="h-10 w-10 text-blue-600 mb-3" />
              <span className="font-semibold">Jardinagem</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-800">
        <div className="mx-auto max-w-2xl text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">É um profissional?</span>
            <span className="block">Aumente sua clientela hoje mesmo.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Cadastre-se na nossa plataforma, gerencie sua agenda e conecte-se com novos clientes todos os dias.
          </p>
          <Link href="/registro" className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-700 hover:bg-blue-50 sm:w-auto transition-colors">
            Quero me cadastrar
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto py-6 px-6 text-center">
          <p className="text-slate-400">&copy; 2025 Serviço Já. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}