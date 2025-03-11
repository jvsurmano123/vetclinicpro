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
  Plus,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import Link from 'next/link';

const sidebarLinks = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/app/dashboard', active: true },
  { icon: Users, label: 'Pacientes', href: '/app/patients' },
  { icon: Calendar, label: 'Consultas', href: '/app/appointments' },
  { icon: ShoppingCart, label: 'Estoque', href: '/app/inventory' },
  { icon: Settings, label: 'Configurações', href: '/app/settings' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r border-gray-200`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="font-semibold text-lg">VetClinicPro</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  link.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-64 z-30">
          <div className="flex h-full items-center justify-between px-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Pesquisar..."
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" className="p-2">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" className="p-2">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-600" />
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </div>
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