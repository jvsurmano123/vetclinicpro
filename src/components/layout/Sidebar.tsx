"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Package,
  Settings,
  LogOut,
  User,
  PawPrint,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/app/dashboard',
  },
  {
    label: 'Pacientes',
    icon: PawPrint,
    href: '/app/patients',
  },
  {
    label: 'Agendamentos',
    icon: Calendar,
    href: '/app/appointments',
  },
  {
    label: 'Estoque',
    icon: Package,
    href: '/app/inventory',
  },
  {
    label: 'Prontuários',
    icon: FileText,
    href: '/app/medical-records',
  },
  {
    label: 'Alertas',
    icon: Bell,
    href: '/app/alerts',
  },
  {
    label: 'Configurações',
    icon: Settings,
    href: '/app/settings',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/app/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">VetClinicPro</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <User className="h-5 w-5" />
              <span>Minha Conta</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 