'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Search,
  MessageSquare,
  LayoutGrid,
  Users,
  Calendar,
  ShoppingCart,
  Settings,
  ChevronDown,
  Bell,
  Home,
  FileText,
  BarChart2,
  Package,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { icon: Home, label: 'Dashboard', href: '/app/dashboard' },
  { icon: Users, label: 'Pacientes', href: '/app/patients' },
  { icon: Calendar, label: 'Consultas', href: '/app/appointments' },
  { icon: FileText, label: 'Prontuários', href: '/app/medical-records' },
  { icon: Package, label: 'Estoque', href: '/app/inventory' },
  { icon: BarChart2, label: 'Relatórios', href: '/app/reports' },
  { icon: Settings, label: 'Configurações', href: '/app/settings' },
  { icon: HelpCircle, label: 'Ajuda', href: '/app/help' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r border-gray-100 shadow-sm`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="font-semibold text-gray-900">VetClinicPro</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-100 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-full w-full bg-indigo-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session?.user?.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session?.user?.email || 'usuario@email.com'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair da conta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 h-16 fixed top-0 right-0 left-64 z-30">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Pesquisar..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
} 