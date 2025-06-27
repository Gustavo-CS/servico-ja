# Projeto Avaliação de Serviços com Drizzle

## Funcionalidades
- Apenas usuários que receberam um serviço podem avaliar
- Média de avaliações por profissional
- Integração com banco Neon via Drizzle ORM

## Como usar

1. Instale dependências:
npm install drizzle-orm @vercel/postgres drizzle-kit

2. Crie um `.env` com base em `.env.example`

3. Rode:
npx drizzle-kit pull
npx drizzle-kit push

4. Execute:
npm run dev

5. Acesse: http://localhost:3000/perfil