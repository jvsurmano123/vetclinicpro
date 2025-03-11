'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { usePatients } from '@/hooks/usePatients';
import { useEffect } from 'react';
import { Loader2, Users, Calendar, Bug, ChevronDown, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-500">Dashboard / Projetos</p>
            <h1 className="text-2xl font-semibold mt-1">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              Último Mês <ChevronDown className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nova Tarefa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Pacientes</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">{patients.length}</h3>
                  <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                    +32.54%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Consultas</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">23</h3>
                  <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                    -12.54%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-100 p-3 rounded-lg">
                <Bug className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Bugs</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">23</h3>
                  <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                    +32.54%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Usuários</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">23</h3>
                  <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                    +32.54%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Visão Geral do Projeto</h2>
                <p className="text-sm text-gray-500 mt-1">Crescimento de Last 6 Month Projects</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2 text-sm py-1">
                Último Mês <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Gráfico de Visão Geral será implementado aqui
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Status das Tarefas</h2>
                <p className="text-sm text-gray-500 mt-1">54 tarefas neste mês</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2 text-sm py-1">
                Hoje <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-500">Em Andamento</span>
                  </div>
                  <span className="text-gray-900 font-medium">45%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full w-[45%] bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-gray-500">Completas</span>
                  </div>
                  <span className="text-gray-900 font-medium">75%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full w-[75%] bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-gray-500">Pendentes</span>
                  </div>
                  <span className="text-gray-900 font-medium">25%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full w-[25%] bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 