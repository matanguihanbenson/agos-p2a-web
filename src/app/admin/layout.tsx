'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  MapPin, 
  Thermometer, 
  Users, 
  Video,
  LogOut,
  Settings,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const isLoginPage = pathname === '/admin/login';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Trash Deposits', href: '/admin/trash-deposits', icon: MapPin },
    { name: 'Heatmaps', href: '/admin/heatmaps', icon: Thermometer },
    { name: 'User & Bot Management', href: '/admin/user-bot-management', icon: Users },
    { name: 'Live Video', href: '/admin/live-video', icon: Video },
    { name: 'System Logs', href: '/admin/logs', icon: List },
  ];

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, loading, isLoginPage, router]);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex overflow-x-hidden">
      {/* Sidebar Container */}
      <div className={`${isCollapsed ? 'w-16' : 'w-56'} bg-white/80 backdrop-blur shadow-xl border-r border-blue-200/50 fixed h-screen z-30 transition-all duration-300 ease-in-out overflow-hidden`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-2 px-4'} py-4 border-b border-blue-200/50 transition-all duration-300`}>
            <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">
              <Image 
                src="/img/app_launcher.png" 
                alt="AGOS Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="transition-all duration-300 overflow-hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">AGOS</h1>
                <p className="text-xs text-slate-600">Admin Portal</p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-2 border-b border-blue-200/50`}>
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* User Info Section - Always show but adapt to collapsed state */}
          <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-3 border-b border-blue-200/50 transition-all duration-300`}>
            {isCollapsed ? (
              <div className="relative group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium mx-auto">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                {/* Tooltip for collapsed state */}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] pointer-events-none">
                  {user.email}
                  <br />
                  Administrator
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-1 overflow-y-auto overflow-x-hidden transition-all duration-300`}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="relative">
                  <Link
                    href={item.href}
                    className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'} py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && <span className="text-xs truncate min-w-0">{item.name}</span>}
                  </Link>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className={`${isCollapsed ? 'px-2' : 'px-3'} py-4 border-t border-blue-200/50 space-y-1 transition-all duration-300`}>
            <div className="relative">
              <button className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'} py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 w-full transition-all duration-200 group`}
                title={isCollapsed ? 'Settings' : undefined}
              >
                <Settings className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">Settings</span>}
              </button>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] pointer-events-none">
                  Settings
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={handleLogout}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'} py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 w-full transition-all duration-200 group`}
                title={isCollapsed ? 'Logout' : undefined}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">Logout</span>}
              </button>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] pointer-events-none">
                  Logout
                </div>
              )}
            </div>
            
            <div className="relative">
              <Link
                href="/"
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'} py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group`}
                title={isCollapsed ? 'Back to Public Site' : undefined}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">Back to Public Site</span>}
              </Link>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] pointer-events-none">
                  Back to Public Site
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-56'} transition-all duration-300 ease-in-out min-w-0`}>
        {children}
      </div>
    </div>
  );
}
