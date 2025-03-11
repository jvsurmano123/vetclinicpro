import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401 }
      );
    }

    // Buscar o usuário e sua clínica associada
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        clinic: true
      }
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { status: 404 }
      );
    }

    // Verificar se o usuário tem uma clínica associada
    const hasClinic = user.clinic !== null;
    
    return new NextResponse(
      JSON.stringify({
        hasClinic,
        clinic: hasClinic ? user.clinic : null
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('[User Clinic API Error]:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500 }
    );
  }
} 