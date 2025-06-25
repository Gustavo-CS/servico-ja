import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/infra/database.js';
import { usuario, cliente, profissional } from '@root/drizzle/schema'; 

export async function POST(request) {
    try {
        const data = await request.json();

        const {
            userType,
            nome,
            cpf,
            email,
            telefone,
            endereco,
            dataNascimento,
            senha,
            regiaoAdministrativa,
            especialidade 
        } = data;

        if (!nome || !email || !senha || !cpf || !regiaoAdministrativa) {
            return NextResponse.json(
                { message: "Dados essenciais (nome, email, senha, CPF, região administrativa) estão faltando." },
                { status: 400 }
            );
        }
        
        if (userType === 'profissional' && !especialidade) {
            return NextResponse.json(
                { message: "Profissionais devem informar sua especialidade." },
                { status: 400 }
            );
        }


        const hashedPassword = await bcrypt.hash(senha, 10);

        const novoUsuarioId = await db.transaction(async (tx) => {
            const enderecoCompleto = `${endereco}, ${regiaoAdministrativa}`;

            const novoUsuario = await tx.insert(usuario).values({
                nome: nome,
                cpf: cpf.replace(/\D/g, ''),
                email: email,
                telefone: telefone,
                endereco: enderecoCompleto, 
                dataNascimento: dataNascimento,
                senha: hashedPassword
            }).returning({ id: usuario.id });

            const usuarioId = novoUsuario[0].id;

            await tx.insert(cliente).values({
                usuarioId: usuarioId,
            });

            if (userType === 'profissional') {
                await tx.insert(profissional).values({
                    usuarioId: usuarioId,
                    especialidade: especialidade,
                });
            }

            return usuarioId;
        });

        return NextResponse.json(
            { message: "Usuário criado com sucesso!", userId: novoUsuarioId },
            { status: 201 }
        );

    } catch (error) {
        console.error("Erro no registro do usuário:", error);

        if (error.code === '23505') {
            return NextResponse.json(
                { message: "Erro ao criar usuário. O CPF ou E-mail já está em uso." },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: "Ocorreu um erro no servidor." },
            { status: 500 }
        );
    }
}