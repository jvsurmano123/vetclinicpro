import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, address, phone, email } = body;

    if (!name || !address || !phone || !email) {
      return new NextResponse(
        JSON.stringify({ error: 'Dados incompletos' }),
        { status: 400 }
      );
    }

    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { status: 404 }
      );
    }

    // Criar a clínica primeiro
    const clinic = await prisma.clinic.create({
      data: {
        name,
        address,
        phone,
        email,
        users: {
          connect: {
            email: session.user.email
          }
        }
      },
      include: {
        users: true
      }
    });

    // Não é mais necessário atualizar o usuário separadamente pois já foi feito na criação da clínica

    return new NextResponse(
      JSON.stringify(clinic),
      { status: 201 }
    );
  } catch (error) {
    console.error('[Clinics API Error]:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500 }
    );
  }
} 