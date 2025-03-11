import { Card } from '@/components/ui/card';
import { Alert } from '@/types/dashboard';
import { AlertCircle, Pill, Syringe, FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertsListProps {
  alerts: Alert[];
  className?: string;
}

const alertTypeIcons = {
  lowStock: Pill,
  vaccineRenewal: Syringe,
  pendingReturn: AlertCircle,
  examReview: FileSearch
};

const alertPriorityStyles = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  low: 'bg-blue-50 text-blue-700 border-blue-200'
};

export function AlertsList({ alerts, className }: AlertsListProps) {
  return (
    <Card className={cn('p-6 bg-white shadow-sm', className)}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Alertas</h2>
          <p className="text-sm text-gray-500 mt-1">Alertas e notificações importantes</p>
        </div>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alertTypeIcons[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                'p-4 rounded-lg border flex items-start gap-4',
                alertPriorityStyles[alert.priority]
              )}
            >
              <Icon className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">{alert.message}</p>
                <p className="text-sm mt-1 opacity-80">
                  {new Date(alert.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
} 