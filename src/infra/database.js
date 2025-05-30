import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg'; // importação do pacote 'pg'
import { sql } from 'drizzle-orm';
import { noTable } from './schema.js';
const { Pool } = pkg;

// Cria pool de conexão
const pool = new Pool({
  connectionString: "postgresql://faculDb_owner:npg_lfLGIhx6w0rN@ep-delicate-cell-ac36nkie-pooler.sa-east-1.aws.neon.tech/faculDb?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

// Passa o pool para o Drizzle
const db = drizzle(pool);

export default db;