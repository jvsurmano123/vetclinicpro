import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  className?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, className }: MetricCardProps) {
  return (
    <Card className={cn('p-6 bg-white shadow-sm', className)}>
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <span className={cn(
                'text-xs px-2 py-1 rounded-full flex items-center gap-1',
                trend.direction === 'up' 
                  ? 'text-green-500 bg-green-50' 
                  : 'text-red-500 bg-red-50'
              )}>
                {trend.value}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 