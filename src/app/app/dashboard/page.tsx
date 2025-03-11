'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Users, 
  Calendar, 
  DollarSign,
  Activity,
  ChevronDown, 
  Plus
} from 'lucide-react';
import { LineChart } from '@/components/charts/LineChart';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { AppointmentsList } from '@/components/dashboard/AppointmentsList';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">Erro ao carregar dados do dashboard</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const metrics = [
    {
      title: 'Total de Pacientes',
      value: data.metrics.totalPatients,
      icon: Users
    },
    {
      title: 'Consultas Hoje',
      value: data.metrics.appointmentsToday,
      icon: Calendar
    },
    {
      title: 'Faturamento Mensal',
      value: formatCurrency(data.metrics.monthlyRevenue),
      icon: DollarSign
    },
    {
      title: 'Taxa de Ocupação',
      value: `${data.metrics.clinicOccupation}%`,
      icon: Activity
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-500">Dashboard / Visão Geral</p>
            <h1 className="text-2xl font-semibold text-gray-900 mt-1">
              Bem-vindo, {session?.user?.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              Último Mês <ChevronDown className="h-4 w-4" />
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nova Consulta
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Visão Geral de Atendimentos
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Últimos 30 dias
                </p>
              </div>
              <Button variant="outline" className="flex items-center gap-2 text-sm py-1">
                Último Mês <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[300px]">
              <LineChart 
                data={data.performance.appointments}
                labels={data.performance.labels}
              />
            </div>
          </Card>

          <AlertsList alerts={data.alerts} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentsList appointments={data.todayAppointments} />
          
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Indicadores Financeiros
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Visão geral do mês atual
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">Receita</p>
                  <p className="text-lg font-semibold text-green-900 mt-1">
                    {formatCurrency(data.financial.revenue)}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">Despesas</p>
                  <p className="text-lg font-semibold text-red-900 mt-1">
                    {formatCurrency(data.financial.expenses)}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Pagamentos Pendentes
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.financial.pendingPayments)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 