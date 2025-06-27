import db from '@/infra/database.js';
import { profissional, usuario, avaliacao } from '@root/drizzle/schema';
import { NextResponse } from 'next/server';
import { eq, like, and, sql, avg } from 'drizzle-orm';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const especialidadeFiltro = searchParams.get('especialidade');
        const regiaoAdministrativaFiltro = searchParams.get('regiaoAdministrativa');

        let conditions = [];

        if (especialidadeFiltro) {
            conditions.push(eq(profissional.especialidade, especialidadeFiltro));
        }

        if (regiaoAdministrativaFiltro) {
            conditions.push(eq(usuario.regiaoAdministrativa, regiaoAdministrativaFiltro));
        }

        let query = db.select({
            id: profissional.id,
            nome: usuario.nome,
            especialidade: profissional.especialidade,
            endereco: usuario.endereco,
            regiaoAdministrativa: usuario.regiaoAdministrativa,
            fotoPerfilUrl: usuario.fotoPerfilUrl,
            descricaoPerfil: usuario.descricaoPerfil, 
            avaliacaoMedia: avg(avaliacao.score),
        })
        .from(profissional)
        .innerJoin(usuario, eq(profissional.usuarioId, usuario.id))
        .leftJoin(avaliacao, eq(usuario.id, avaliacao.idAvaliado)) 
        .groupBy(
            profissional.id,
            usuario.nome,
            profissional.especialidade,
            usuario.endereco,
            usuario.regiaoAdministrativa,
            usuario.fotoPerfilUrl,
            usuario.descricaoPerfil 
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