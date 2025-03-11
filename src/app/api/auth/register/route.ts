import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, clinicName } = body;

    if (!email || !password || !clinicName) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    // Verifica se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse('Email já cadastrado', { status: 400 });
    }

    // Cria a clínica
    const clinic = await prisma.clinic.create({
      data: {
        name: clinicName,
      },
    });

    // Hash da senha
    const hashedPassword = await hash(password, 12);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        clinicId: clinic.id,
        role: 'ADMIN', // Primeiro usuário da clínica é admin
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        clinicId: user.clinicId,
      },
    });
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return new NextResponse('Erro interno', { status: 500 });
  }
} 