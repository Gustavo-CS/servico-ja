import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg'; // importação do pacote 'pg'
import { noTable4 } from '../../drizzle/schema';
const { Pool } = pkg;

// Cria pool de conexão
const isProd = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: true } : false
});

// Passa o pool para o Drizzle
const db = drizzle(pool);

export default db;