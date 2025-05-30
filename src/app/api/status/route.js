import { NextResponse } from 'next/server';
import database from '../../../infra/database';

export async function GET() {
  const updatedAt = new Date().toISOString();

  try {
    const dbName = process.env.POSTGRES_DB;

    const dbVersionResult = await database.query('SHOW server_version;');
    const dbVersion = dbVersionResult.rows[0].server_version;

    const maxConnResult = await database.query('SHOW max_connections;');
    const maxConnections = parseInt(maxConnResult.rows[0].max_connections);

    const openConnResult = await database.query({
      text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;',
      values: [dbName],
    });
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
