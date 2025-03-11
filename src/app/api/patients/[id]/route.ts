import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

// DELETE /api/patients/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;

    // Verifica se o paciente existe e pertence à clínica do usuário
    const patient = await prisma.patient.findFirst({
      where: {
        id,
        clinic: {
          users: {
            some: {
              id: session.user.id
            }
          }
        }
      }
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      );
    }

    await prisma.patient.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Paciente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar paciente' },
      { status: 500 }
    );
  }
} 