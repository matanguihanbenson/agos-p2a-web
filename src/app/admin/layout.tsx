'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  MapPin, 
  Thermometer, 
  Users, 
  Video,
  Bot,
  LogOut,
  Settings
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Trash Deposits', href: '/admin/trash-deposits', icon: MapPin },
    { name: 'Heatmaps', href: '/admin/heatmaps', icon: Thermometer },
    { name: 'User & Bot Management', href: '/admin/user-bot-management', icon: Users },
    { name: 'Live Video', href: '/admin/live-video', icon: Video },
  ];

  const isActive = (href: string) => pathname === href;

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/80 backdrop-blur shadow-xl border-r border-blue-200/50 fixed h-screen z-30">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 px-6 py-6 border-b border-blue-200/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">AGOS</h1>
              <p className="text-sm text-slate-600">Admin Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="px-4 py-6 border-t border-blue-200/50 space-y-2">
            <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 w-full transition-all duration-200">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Back to Public Site</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}
