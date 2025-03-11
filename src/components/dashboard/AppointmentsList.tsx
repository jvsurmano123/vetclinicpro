import { Card } from '@/components/ui/card';
import { TodayAppointment } from '@/types/dashboard';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppointmentsListProps {
  appointments: TodayAppointment[];
  className?: string;
}

const statusIcons = {
  confirmed: CheckCircle2,
  waiting: Clock,
  inProgress: AlertCircle
};

const statusStyles = {
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  waiting: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  inProgress: 'bg-blue-50 text-blue-700 border-blue-200'
};

const statusLabels = {
  confirmed: 'Confirmada',
  waiting: 'Aguardando',
  inProgress: 'Em Andamento'
};

export function AppointmentsList({ appointments, className }: AppointmentsListProps) {
  return (
    <Card className={cn('p-6 bg-white shadow-sm', className)}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Consultas de Hoje</h2>
          <p className="text-sm text-gray-500 mt-1">
            {appointments.length} consultas agendadas
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {appointments.map((appointment) => {
          const Icon = statusIcons[appointment.status];
          return (
            <div
              key={appointment.id}
              className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(appointment.time).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      statusStyles[appointment.status]
                    )}>
                      {statusLabels[appointment.status]}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mt-2">
                    {appointment.petName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tutor: {appointment.ownerName}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {appointment.appointmentType}
                  </p>
                </div>
                <Icon className={cn(
                  'h-5 w-5',
                  appointment.status === 'confirmed' && 'text-green-600',
                  appointment.status === 'waiting' && 'text-yellow-600',
                  appointment.status === 'inProgress' && 'text-blue-600'
                )} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
} 