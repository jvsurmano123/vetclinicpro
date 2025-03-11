export interface DashboardMetrics {
  totalPatients: number;
  appointmentsToday: number;
  monthlyRevenue: number;
  clinicOccupation: number;
}

export interface Alert {
  id: string;
  type: 'lowStock' | 'vaccineRenewal' | 'pendingReturn' | 'examReview';
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

export interface TodayAppointment {
  id: string;
  time: string;
  status: 'confirmed' | 'waiting' | 'inProgress';
  petName: string;
  ownerName: string;
  appointmentType: string;
}

export interface PerformanceIndicator {
  appointments: number[];
  labels: string[];
  returnRate: number;
  customerSatisfaction: number;
  topProcedures: {
    name: string;
    count: number;
  }[];
}

export interface FinancialOverview {
  revenue: number;
  expenses: number;
  pendingPayments: number;
  expectedRevenue: number;
  canceledAppointments: number;
}

export interface InventoryStatus {
  mostUsedProducts: {
    name: string;
    quantity: number;
  }[];
  expiringItems: {
    name: string;
    expiryDate: Date;
  }[];
  lowStockItems: {
    name: string;
    currentQuantity: number;
    minimumQuantity: number;
  }[];
  stockValue: number;
}

export interface PendingTask {
  id: string;
  type: 'return' | 'exam' | 'prescription' | 'vaccine';
  description: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface DashboardData {
  metrics: DashboardMetrics;
  alerts: Alert[];
  todayAppointments: TodayAppointment[];
  performance: PerformanceIndicator;
  financial: FinancialOverview;
  inventory: InventoryStatus;
  pendingTasks: PendingTask[];
} 