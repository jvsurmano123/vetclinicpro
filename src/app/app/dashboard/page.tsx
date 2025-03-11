'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { usePatients } from '@/hooks/usePatients';
import { useEffect } from 'react';
import { 
  Loader2, 
  Users, 
  Calendar, 
  Bug, 
  ChevronDown, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LineChart } from '@/components/charts/LineChart';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { patients, loading, error, fetchPatients } = usePatients();

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total de Projetos',
      value: '23',
      change: '+32.54%',
      trend: 'up',
      icon: Users,
      color: 'indigo'
    },
    {
      title: 'Total de Tarefas',
      value: '23',
      change: '-12.54%',
      trend: 'down',
      icon: Calendar,
      color: 'rose'
    },
    {
      title: 'Total de Bugs',
      value: '23',
      change: '+32.54%',
      trend: 'up',
      icon: Bug,
      color: 'cyan'
    },
    {
      title: 'Total de Usuários',
      value: '23',
      change: '+32.54%',
      trend: 'up',
      icon: Users,
      color: 'emerald'
    }
  ];

  const tasks = [
    {
      title: 'Em Andamento',
      value: 45,
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Completas',
      value: 75,
      icon: CheckCircle2,
      color: 'green'
    },
    {
      title: 'Pendentes',
      value: 25,
      icon: AlertCircle,
      color: 'yellow'
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-500">Dashboard / Projetos</p>
            <h1 className="text-2xl font-semibold text-gray-900 mt-1">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              Último Mês <ChevronDown className="h-4 w-4" />
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nova Tarefa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <span className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
                    } px-2 py-1 rounded-full flex items-center gap-1`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Visão Geral do Projeto</h2>
                <p className="text-sm text-gray-500 mt-1">Crescimento de Last 6 Month Projects</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2 text-sm py-1">
                Último Mês <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[300px]">
              <LineChart />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Status das Tarefas</h2>
                <p className="text-sm text-gray-500 mt-1">54 tarefas neste mês</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2 text-sm py-1">
                Hoje <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-6">
              {tasks.map((task, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <task.icon className={`h-4 w-4 text-${task.color}-600`} />
                      <span className="text-gray-500">{task.title}</span>
                    </div>
                    <span className="text-gray-900 font-medium">{task.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div 
                      className={`h-full bg-${task.color}-500 rounded-full`}
                      style={{ width: `${task.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 