'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Link href="/historico">Ir para Histórico de Serviços</Link>
      <br />
      <Link href="/login">Botão Login Teste</Link>

    </div>
  );
}
