'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { usePatients } from '@/hooks/usePatients';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

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
      <h1 className="text-2xl font-bold mb-6">
        Bem-vindo, {session?.user?.name || 'Usuário'}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Total de Pacientes</h2>
          <p className="text-3xl font-bold">{patients.length}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Consultas Hoje</h2>
          <p className="text-3xl font-bold">0</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Pacientes Novos (Mês)</h2>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
        <Card className="p-6">
          <p className="text-gray-500">Nenhuma atividade recente</p>
        </Card>
      </div>
    </div>
  );
} 