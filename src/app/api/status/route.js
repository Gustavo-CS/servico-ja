import { NextResponse } from 'next/server';
import database from '../../../infra/database';
import { sql } from 'drizzle-orm';

export async function GET() {
  const updatedAt = new Date().toISOString();

  try {
    const dbName = process.env.POSTGRES_DB;

    const versionResult = await database.execute(sql`SHOW server_version;`);
    const dbVersion = versionResult.rows[0].server_version;

    const maxConnResult = await database.execute(sql`SHOW max_connections;`);
    const maxConnections = parseInt(maxConnResult.rows[0].max_connections);

    const openConnResult = await database.execute(sql`SELECT count(*)::int FROM pg_stat_activity WHERE datname = ${dbName};`);
    const openedConnections = openConnResult.rows[0].count;

    return NextResponse.json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbVersion,
          max_connections: maxConnections,
          opened_connections: openedConnections,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Erro ao consultar status do banco de dados',
        message: error.message,
        updated_at: updatedAt,
      },
      { status: 500 }
    );
  }
}
