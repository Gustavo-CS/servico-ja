import db from '@/infra/database';
import { profissional, usuario, ratings } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import { eq, like, and, sql, avg } from 'drizzle-orm';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const especialidadeFiltro = searchParams.get('especialidade');
        const bairroFiltro = searchParams.get('bairro');

        let conditions = [];

        if (especialidadeFiltro) {
            conditions.push(eq(profissional.especialidade, especialidadeFiltro));
        }

        // **Lembrete:** Idealmente, ter um campo 'bairro' separado no schema seria melhor.
        if (bairroFiltro) {
            conditions.push(like(usuario.endereco, `%${bairroFiltro}%`));
        }

        let query = db.select({
            id: profissional.id, 
            nome: usuario.nome, 
            especialidade: profissional.especialidade, 
            endereco: usuario.endereco, 
            // foto: usuario.foto, // REVISAR: Adicionar campo 'foto' ao schema 'usuario'**
            avaliacaoMedia: avg(ratings.score),
        })
        .from(profissional)
        .innerJoin(usuario, eq(profissional.usuarioId, usuario.id))
        .leftJoin(ratings, eq(profissional.id, ratings.profissionalId))
        .groupBy(
            profissional.id,
            usuario.nome,
            profissional.especialidade,
            usuario.endereco,
            // usuario.foto // 
        );

        if (conditions.length > 0) {
            query = query.where(and(...conditions));
        }

        const result = await query;
        return NextResponse.json(result);

    } catch (error) {
        console.error('Erro ao buscar profissionais na API:', error);
        return NextResponse.json({ error: 'Erro interno do servidor ao buscar profissionais.' }, { status: 500 });
    }
}