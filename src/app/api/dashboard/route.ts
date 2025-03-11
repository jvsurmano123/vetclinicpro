import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401 }
      );
    }

    const clinicId = session.user.clinicId;

    // Buscar métricas principais
    const [
      totalPatients,
      appointmentsToday,
      monthlyRevenue,
      clinicOccupation
    ] = await Promise.all([
      prisma.patient.count({ where: { clinicId } }),
      prisma.appointment.count({
        where: {
          clinicId,
          date: {
            gte: new Date().setHours(0, 0, 0, 0),
            lt: new Date().setHours(23, 59, 59, 999)
          }
        }
      }),
      prisma.payment.aggregate({
        where: {
          clinicId,
          createdAt: {
            gte: new Date(new Date().setDate(1)),
            lt: new Date()
          }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.appointment.count({
        where: {
          clinicId,
          status: 'inProgress'
        }
      })
    ]);

    // Buscar alertas
    const alerts = await prisma.alert.findMany({
      where: { clinicId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Buscar consultas do dia
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        clinicId,
        date: {
          gte: new Date().setHours(0, 0, 0, 0),
          lt: new Date().setHours(23, 59, 59, 999)
        }
      },
      include: {
        patient: true,
        owner: true
      },
      orderBy: { date: 'asc' }
    });

    // Buscar indicadores de performance
    const lastMonthDates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const appointments = await Promise.all(
      lastMonthDates.map(date =>
        prisma.appointment.count({
          where: {
            clinicId,
            date: {
              gte: new Date(date).setHours(0, 0, 0, 0),
              lt: new Date(date).setHours(23, 59, 59, 999)
            }
          }
        })
      )
    );

    // Formatar dados para resposta
    const dashboardData = {
      metrics: {
        totalPatients,
        appointmentsToday,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        clinicOccupation
      },
      alerts: alerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        message: alert.message,
        priority: alert.priority,
        createdAt: alert.createdAt
      })),
      todayAppointments: todayAppointments.map(apt => ({
        id: apt.id,
        time: apt.date.toISOString(),
        status: apt.status,
        petName: apt.patient.name,
        ownerName: apt.owner.name,
        appointmentType: apt.type
      })),
      performance: {
        appointments,
        labels: lastMonthDates.map(date => date.toLocaleDateString()),
        returnRate: 75, // Exemplo - implementar lógica real
        customerSatisfaction: 4.5, // Exemplo - implementar lógica real
        topProcedures: [] // Implementar busca dos procedimentos mais realizados
      },
      financial: {
        revenue: monthlyRevenue._sum.amount || 0,
        expenses: 0, // Implementar busca de despesas
        pendingPayments: 0, // Implementar busca de pagamentos pendentes
        expectedRevenue: 0, // Implementar cálculo de receita esperada
        canceledAppointments: 0 // Implementar contagem de consultas canceladas
      },
      inventory: {
        mostUsedProducts: [], // Implementar busca de produtos mais usados
        expiringItems: [], // Implementar busca de items próximos ao vencimento
        lowStockItems: [], // Implementar busca de items com estoque baixo
        stockValue: 0 // Implementar cálculo do valor em estoque
      },
      pendingTasks: [] // Implementar busca de tarefas pendentes
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500 }
    );
  }
} 