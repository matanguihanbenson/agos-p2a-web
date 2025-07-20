'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WeatherDashboard from '@/components/weather/WeatherDashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bot,
  Users,
  Bell,
  Settings,
  Plus,
  TrendingUp,
  MapPin,
  Droplets,
  Thermometer,
  Eye,
  Package,
  AlertTriangle,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import type { RiverMonitoringData, TrashHotspot } from '@/types';

export default function AdminDashboard() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: unknown) {
      console.error('Logout failed:', error);
    }
  };

  // Sample river monitoring data
  const riverData: RiverMonitoringData[] = [
    {
      id: 'calapan-river',
      name: 'Calapan River',
      location: { latitude: 13.4115, longitude: 121.1803 },
      waterQuality: {
        ph: 7.2,
        turbidity: 12.5,
        temperature: 26.8,
        dissolvedOxygen: 8.1
      },
      trashCollection: {
        totalKg: 234.5,
        totalItems: 2156,
        todayKg: 15.2,
        todayItems: 89
      },
      botId: 'AGOS-001',
      lastUpdated: new Date(),
      status: 'good'
    },
    {
      id: 'bucayao-river',
      name: 'Bucayao River',
      location: { latitude: 13.4289, longitude: 121.1456 },
      waterQuality: {
        ph: 6.8,
        turbidity: 18.3,
        temperature: 27.2,
        dissolvedOxygen: 7.4
      },
      trashCollection: {
        totalKg: 187.3,
        totalItems: 1724,
        todayKg: 12.7,
        todayItems: 67
      },
      botId: 'AGOS-002',
      lastUpdated: new Date(),
      status: 'fair'
    },
    {
      id: 'naujan-lake',
      name: 'Naujan Lake',
      location: { latitude: 13.3289, longitude: 121.3025 },
      waterQuality: {
        ph: 7.5,
        turbidity: 8.2,
        temperature: 25.9,
        dissolvedOxygen: 8.8
      },
      trashCollection: {
        totalKg: 156.8,
        totalItems: 1289,
        todayKg: 9.4,
        todayItems: 42
      },
      botId: 'AGOS-003',
      lastUpdated: new Date(),
      status: 'good'
    }
  ];

  // Sample hotspot data
  const hotspots: TrashHotspot[] = [
    {
      id: 'calapan-zone-1',
      name: 'Calapan River Zone 1',
      location: { latitude: 13.4115, longitude: 121.1803 },
      density: 'very-high',
      itemCount: 2156,
      area: 'Calapan River',
      lastUpdated: new Date(),
      trend: 'increasing'
    },
    {
      id: 'bucayao-zone-2',
      name: 'Bucayao River Zone 2',
      location: { latitude: 13.4298, longitude: 121.1445 },
      density: 'high',
      itemCount: 1543,
      area: 'Bucayao River',
      lastUpdated: new Date(),
      trend: 'stable'
    },
    {
      id: 'calapan-zone-2',
      name: 'Calapan River Zone 2',
      location: { latitude: 13.4095, longitude: 121.1820 },
      density: 'high',
      itemCount: 1234,
      area: 'Calapan River',
      lastUpdated: new Date(),
      trend: 'decreasing'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'very-high': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <ArrowUp className="h-3 w-3 text-red-500" />;
      case 'decreasing': return <ArrowDown className="h-3 w-3 text-green-500" />;
      case 'stable': return <Minus className="h-3 w-3 text-gray-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-blue-200/50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="mx-8 flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">AGOS Admin Portal</h1>
                <p className="text-sm text-slate-600">System Management Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-blue-100">
              <Bell className="h-4 w-4 text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-blue-100">
              <Settings className="h-4 w-4 text-blue-600" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-blue-100">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@agos.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="mx-8 my-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Weather Dashboard - Full Width at Top */}
          <WeatherDashboard />

          {/* Top 3 Trash Density Hotspots and Quick Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top 3 Trash Density Hotspots - Left side (2/3 width) */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg bg-white/80 backdrop-blur h-full">
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-slate-800 flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                        Top 3 Trash Density Hotspots
                      </CardTitle>
                      <CardDescription className="text-slate-600">Critical areas requiring immediate attention</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-300">
                      View All Hotspots
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hotspots.map((hotspot, index) => (
                      <div 
                        key={hotspot.id} 
                        className={`border rounded-lg p-4 ${getDensityColor(hotspot.density)} transition-all duration-200 hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm">
                              <span className="text-xs font-bold text-gray-700">#{index + 1}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getTrendIcon(hotspot.trend)}
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/70 font-medium capitalize">
                            {hotspot.density.replace('-', ' ')}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm mb-2">{hotspot.name}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs opacity-75">Items</span>
                            <span className="text-sm font-bold">{hotspot.itemCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs opacity-75">Area</span>
                            <span className="text-xs">{hotspot.area}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs opacity-75">Trend</span>
                            <span className="text-xs capitalize flex items-center space-x-1">
                              {getTrendIcon(hotspot.trend)}
                              <span>{hotspot.trend}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions - Right side (1/3 width) */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg bg-white/80 backdrop-blur h-full">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-lg text-slate-800">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-600">Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start h-11 hover:bg-blue-50 hover:border-blue-300 border-slate-200 group transition-all duration-200"
                    >
                      <Users className="h-4 w-4 mr-3 text-blue-600 group-hover:text-blue-700" />
                      <span className="text-slate-700 group-hover:text-blue-700">Add Field Operator</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-11 hover:bg-green-50 hover:border-green-300 border-slate-200 group transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-3 text-green-600 group-hover:text-green-700" />
                      <span className="text-slate-700 group-hover:text-green-700">Add New Bot</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-11 hover:bg-purple-50 hover:border-purple-300 border-slate-200 group transition-all duration-200"
                    >
                      <TrendingUp className="h-4 w-4 mr-3 text-purple-600 group-hover:text-purple-700" />
                      <span className="text-slate-700 group-hover:text-purple-700">View Reports</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-11 hover:bg-orange-50 hover:border-orange-300 border-slate-200 group transition-all duration-200"
                    >
                      <MapPin className="h-4 w-4 mr-3 text-orange-600 group-hover:text-orange-700" />
                      <span className="text-slate-700 group-hover:text-orange-700">View Heatmap</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Real-time River Monitoring */}
          <Card className="shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-800 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Real-time River Monitoring
                  </CardTitle>
                  <CardDescription className="text-slate-600">Live water quality and trash collection data</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Live</span>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {riverData.map((river) => (
                  <div key={river.id} className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50 hover:shadow-lg transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">{river.name}</h3>
                        <p className="text-xs text-slate-500">Bot: {river.botId}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(river.status)}`}>
                        {river.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Water Quality Metrics */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                        <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                        Water Quality
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600">pH</span>
                            <Eye className="h-3 w-3 text-blue-400" />
                          </div>
                          <p className="text-lg font-bold text-blue-800">{river.waterQuality.ph}</p>
                        </div>
                        <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-cyan-600">Turbidity</span>
                            <Eye className="h-3 w-3 text-cyan-400" />
                          </div>
                          <p className="text-lg font-bold text-cyan-800">{river.waterQuality.turbidity} NTU</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-orange-600">Temp</span>
                            <Thermometer className="h-3 w-3 text-orange-400" />
                          </div>
                          <p className="text-lg font-bold text-orange-800">{river.waterQuality.temperature}°C</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-600">DO</span>
                            <Droplets className="h-3 w-3 text-green-400" />
                          </div>
                          <p className="text-lg font-bold text-green-800">{river.waterQuality.dissolvedOxygen} mg/L</p>
                        </div>
                      </div>
                    </div>

                    {/* Trash Collection */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                        <Package className="h-4 w-4 mr-1 text-purple-500" />
                        Trash Collection
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg border border-purple-100">
                          <span className="text-xs text-purple-600">Total Weight</span>
                          <span className="text-sm font-bold text-purple-800">{river.trashCollection.totalKg} kg</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                          <span className="text-xs text-indigo-600">Total Items</span>
                          <span className="text-sm font-bold text-indigo-800">{river.trashCollection.totalItems.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                            <p className="text-xs text-emerald-600 mb-1">Today</p>
                            <p className="text-sm font-bold text-emerald-800">{river.trashCollection.todayKg} kg</p>
                            <p className="text-xs text-emerald-600">{river.trashCollection.todayItems} items</p>
                          </div>
                          <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-600 mb-1">Updated</p>
                            <p className="text-xs text-slate-800 font-medium">
                              {new Date(river.lastUpdated).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}