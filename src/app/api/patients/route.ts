import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/patients
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const patients = await prisma.patient.findMany({
      where: {
        clinic: {
          users: {
            some: {
              id: session.user.id
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pacientes' },
      { status: 500 }
    );
  }
}

// POST /api/patients
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await req.json();

    // Busca a clínica do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { clinic: true }
    });

    if (!user?.clinic) {
      return NextResponse.json(
        { error: 'Usuário não está associado a uma clínica' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        ...data,
        clinic: {
          connect: { id: user.clinic.id }
        }
      }
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar paciente' },
      { status: 500 }
    );
  }
}

// PUT /api/patients
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await req.json();
    const { id, ...updateData } = data;

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar paciente' },
      { status: 500 }
    );
  }
} 