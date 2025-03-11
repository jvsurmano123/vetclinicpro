import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    console.log('[Dashboard] Iniciando busca de dados do dashboard');
    
    // Verificar conexão com o banco
    try {
      await prisma.$connect();
      console.log('[Dashboard] Conexão com o banco estabelecida');
    } catch (dbConnError) {
      console.error('[Dashboard] Erro ao conectar com o banco:', dbConnError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Erro de conexão com o banco de dados',
          details: dbConnError.message
        }),
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    console.log('[Dashboard] Sessão:', JSON.stringify(session, null, 2));

    if (!session?.user) {
      console.log('[Dashboard] Usuário não autenticado');
      return new NextResponse(
        JSON.stringify({ error: 'Não autorizado - Usuário não autenticado' }),
        { status: 401 }
      );
    }

    // Buscar o usuário atualizado do banco
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { clinicId: true }
    });

    if (!user?.clinicId) {
      console.log('[Dashboard] Usuário sem clínica associada');
      return new NextResponse(
        JSON.stringify({ error: 'Não autorizado - Usuário sem clínica associada' }),
        { status: 401 }
      );
    }

    const clinicId = user.clinicId;
    console.log('[Dashboard] ID da clínica:', clinicId);

    // Verificar se a clínica existe
    try {
      const clinic = await prisma.clinic.findUnique({
        where: { id: clinicId }
      });

      if (!clinic) {
        console.log('[Dashboard] Clínica não encontrada');
        return new NextResponse(
          JSON.stringify({ error: 'Clínica não encontrada' }),
          { status: 404 }
        );
      }
      console.log('[Dashboard] Clínica encontrada:', clinic.name);
    } catch (clinicError) {
      console.error('[Dashboard] Erro ao buscar clínica:', clinicError);
      throw clinicError;
    }

    try {
      // Buscar métricas principais
      console.log('[Dashboard] Buscando métricas principais...');
      const [
        totalPatients,
        appointmentsToday,
        monthlyRevenue,
        clinicOccupation
      ] = await Promise.all([
        prisma.patient.count({
          where: { clinicId }
        }).catch(error => {
          console.error('[Dashboard] Erro ao contar pacientes:', error);
          return 0;
        }),
        prisma.appointment.count({
          where: {
            clinicId,
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        }).catch(error => {
          console.error('[Dashboard] Erro ao contar consultas do dia:', error);
          return 0;
        }),
        prisma.payment.aggregate({
          where: {
            clinicId,
            status: 'paid',
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date()
            }
          },
          _sum: {
            amount: true
          }
        }).catch(error => {
          console.error('[Dashboard] Erro ao calcular receita mensal:', error);
          return { _sum: { amount: 0 } };
        }),
        prisma.appointment.count({
          where: {
            clinicId,
            status: 'inProgress'
          }
        }).catch(error => {
          console.error('[Dashboard] Erro ao contar ocupação da clínica:', error);
          return 0;
        })
      ]);
      console.log('[Dashboard] Métricas principais:', { totalPatients, appointmentsToday, monthlyRevenue, clinicOccupation });

      // Buscar alertas
      console.log('[Dashboard] Buscando alertas...');
      const alerts = await prisma.alert.findMany({
        where: { clinicId },
        orderBy: { createdAt: 'desc' },
        take: 5
      }).catch(error => {
        console.error('[Dashboard] Erro ao buscar alertas:', error);
        return [];
      });
      console.log('[Dashboard] Alertas encontrados:', alerts.length);

      // Buscar consultas do dia
      console.log('[Dashboard] Buscando consultas do dia...');
      const todayAppointments = await prisma.appointment.findMany({
        where: {
          clinicId,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        },
        include: {
          patient: {
            include: {
              owner: true
            }
          }
        },
        orderBy: { date: 'asc' }
      }).catch(error => {
        console.error('[Dashboard] Erro ao buscar consultas do dia:', error);
        return [];
      });
      console.log('[Dashboard] Consultas do dia encontradas:', todayAppointments.length);

      // Buscar indicadores de performance
      console.log('[Dashboard] Buscando indicadores de performance...');
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
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999))
              }
            }
          }).catch(error => {
            console.error('[Dashboard] Erro ao contar consultas para data:', date, error);
            return 0;
          })
        )
      );
      console.log('[Dashboard] Dados de performance coletados');

      // Buscar dados financeiros
      console.log('[Dashboard] Buscando dados financeiros...');
      const [
        totalExpenses,
        pendingPayments,
        canceledAppointments
      ] = await Promise.all([
        prisma.payment.aggregate({
          where: {
            clinicId,
            status: 'expense',
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date()
            }
          },
          _sum: {
            amount: true
          }
        }).catch(error => {
          console.error('[Dashboard] Erro ao calcular despesas:', error);
          return { _sum: { amount: 0 } };
        }),
        prisma.payment.aggregate({
          where: {
            clinicId,
            status: 'pending'
          },
          _sum: {
            amount: true
          }
        }).catch(error => {
          console.error('[Dashboard] Erro ao calcular pagamentos pendentes:', error);
          return { _sum: { amount: 0 } };
        }),
        prisma.appointment.count({
          where: {
            clinicId,
            status: 'canceled',
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date()
            }
          }
        }).catch(error => {
          console.error('[Dashboard] Erro ao contar consultas canceladas:', error);
          return 0;
        })
      ]);
      console.log('[Dashboard] Dados financeiros coletados');

      // Formatar dados para resposta
      console.log('[Dashboard] Formatando dados para resposta...');
      const dashboardData = {
        metrics: {
          totalPatients,
          appointmentsToday,
          monthlyRevenue: monthlyRevenue?._sum?.amount || 0,
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
          petName: apt.patient?.name || 'N/A',
          ownerName: apt.patient?.owner?.name || 'N/A',
          appointmentType: apt.type
        })),
        performance: {
          appointments,
          labels: lastMonthDates.map(date => date.toLocaleDateString('pt-BR')),
          returnRate: 75,
          customerSatisfaction: 4.5,
          topProcedures: []
        },
        financial: {
          revenue: monthlyRevenue?._sum?.amount || 0,
          expenses: totalExpenses?._sum?.amount || 0,
          pendingPayments: pendingPayments?._sum?.amount || 0,
          expectedRevenue: (monthlyRevenue?._sum?.amount || 0) + (pendingPayments?._sum?.amount || 0),
          canceledAppointments
        },
        inventory: {
          mostUsedProducts: [],
          expiringItems: [],
          lowStockItems: [],
          stockValue: 0
        },
        pendingTasks: []
      };

      console.log('[Dashboard] Retornando dados do dashboard');
      return NextResponse.json(dashboardData);
    } catch (dbError) {
      console.error('[Dashboard] Erro ao buscar dados do banco:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar dados do dashboard:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Erro interno do servidor', 
        details: error.message,
        stack: error.stack 
      }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
    console.log('[Dashboard] Conexão com o banco desconectada');
  }
} 