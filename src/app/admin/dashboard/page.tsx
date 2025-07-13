'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
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
  Recycle,
  AlertTriangle,
  Bell,
  Settings,
  RefreshCw,
  Battery,
  Wifi,
  MoreHorizontal,
  Plus,
  TrendingUp,
  MapPin,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
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

      <div className="mx-8 my-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Active Bots</CardTitle>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">12</div>
              <p className="text-xs text-blue-600">
                <span className="text-emerald-600 font-semibold">+2</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Field Operators</CardTitle>
              <div className="p-2 bg-green-600 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">8</div>
              <p className="text-xs text-green-600">
                <span className="text-blue-600 font-semibold">All active</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-violet-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Trash Collected Today</CardTitle>
              <div className="p-2 bg-purple-600 rounded-lg">
                <Recycle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">247</div>
              <p className="text-xs text-purple-600">
                <span className="text-emerald-600 font-semibold">+18%</span> vs average
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">System Alerts</CardTitle>
              <div className="p-2 bg-orange-600 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">3</div>
              <p className="text-xs text-orange-600">
                <span className="text-red-600 font-semibold">2 require attention</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bot Fleet Status */}
            <Card className="border-blue-200 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader className="border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-blue-900">Bot Fleet Status</CardTitle>
                    <CardDescription className="text-blue-600">Real-time monitoring of all AGOS bots</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100 shadow-sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[{
                    id: 'AGOS-001',
                    status: 'Active',
                    location: 'Pasig River - Zone A',
                    battery: 87,
                    signal: 'Strong',
                  },
                  {
                    id: 'AGOS-002',
                    status: 'Active',
                    location: 'Marikina River - Zone B',
                    battery: 92,
                    signal: 'Strong',
                  },
                  {
                    id: 'AGOS-003',
                    status: 'Charging',
                    location: 'Station 1',
                    battery: 45,
                    signal: 'Good',
                  },
                  {
                    id: 'AGOS-004',
                    status: 'Maintenance',
                    location: 'Workshop',
                    battery: 23,
                    signal: 'Offline',
                  }].map((bot) => (
                    <div key={bot.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-white to-slate-50 hover:shadow-md transition-all">
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant={bot.status === 'Active' ? 'default' : bot.status === 'Charging' ? 'secondary' : 'destructive'}
                          className={
                            bot.status === 'Active' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-sm' 
                              : bot.status === 'Charging'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              : 'bg-gradient-to-r from-red-500 to-pink-500'
                          }
                        >
                          {bot.status}
                        </Badge>
                        <div>
                          <p className="font-semibold text-slate-800">{bot.id}</p>
                          <p className="text-sm text-slate-600">{bot.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <Battery className="h-4 w-4 text-slate-500" />
                          <span className="font-medium">{bot.battery}%</span>
                          <Progress value={bot.battery} className="w-20" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wifi className="h-4 w-4 text-slate-500" />
                          <span className="font-medium">{bot.signal}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-blue-100 rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Send Command</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Maintenance Mode</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="shadow-lg bg-white/80 backdrop-blur">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-xl text-slate-800">Recent Activity</CardTitle>
                <CardDescription className="text-slate-600">Latest system events and notifications</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[{
                    time: '2 min ago',
                    event: 'AGOS-001 collected 15 plastic bottles',
                    type: 'success',
                  },
                  {
                    time: '8 min ago',
                    event: 'Water quality alert in Zone B - pH level anomaly',
                    type: 'warning',
                  },
                  {
                    time: '15 min ago',
                    event: 'AGOS-003 completed charging cycle',
                    type: 'info',
                  },
                  {
                    time: '1 hour ago',
                    event: 'Field Operator Maria assigned to Zone C',
                    type: 'info',
                  },
                  {
                    time: '2 hours ago',
                    event: 'AGOS-002 navigation system updated',
                    type: 'success',
                  }].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`w-3 h-3 rounded-full mt-2 shadow-sm ${
                        activity.type === 'success' ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                        activity.type === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                      }`}></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm leading-relaxed text-slate-800">{activity.event}</p>
                        <p className="text-xs text-slate-500 font-medium">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="shadow-lg bg-white/80 backdrop-blur">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg text-slate-800">Quick Actions</CardTitle>
                <CardDescription className="text-slate-600">Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button 
                  className="w-full justify-start h-11 text-left font-medium" 
                  variant="outline" 
                  className="w-full justify-start h-11 hover:bg-blue-50 hover:border-blue-300 border-slate-200 group transition-all duration-200"
                >
                  <Users className="h-4 w-4 mr-3 text-blue-600 group-hover:text-blue-700" />
                  <span className="text-slate-700 group-hover:text-blue-700">Add Field Operator</span>
                </Button>
                <Button 
                  className="w-full justify-start h-11 text-left font-medium" 
                  variant="outline" 
                  className="w-full justify-start h-11 hover:bg-green-50 hover:border-green-300 border-slate-200 group transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-3 text-green-600 group-hover:text-green-700" />
                  <span className="text-slate-700 group-hover:text-green-700">Add New Bot</span>
                </Button>
                <Button 
                  className="w-full justify-start h-11 text-left font-medium" 
                  variant="outline" 
                  className="w-full justify-start h-11 hover:bg-purple-50 hover:border-purple-300 border-slate-200 group transition-all duration-200"
                >
                  <TrendingUp className="h-4 w-4 mr-3 text-purple-600 group-hover:text-purple-700" />
                  <span className="text-slate-700 group-hover:text-purple-700">View Reports</span>
                </Button>
                <Button 
                  className="w-full justify-start h-11 text-left font-medium" 
                  variant="outline" 
                  className="w-full justify-start h-11 hover:bg-orange-50 hover:border-orange-300 border-slate-200 group transition-all duration-200"
                >
                  <MapPin className="h-4 w-4 mr-3 text-orange-600 group-hover:text-orange-700" />
                  <span className="text-slate-700 group-hover:text-orange-700">View Heatmap</span>
                </Button>
              </CardContent>
            </Card>

            {/* Environmental Metrics */}
            <Card className="border-blue-200 shadow-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur">
              <CardHeader className="border-b border-blue-100">
                <CardTitle className="text-lg text-blue-900">Today's Metrics</CardTitle>
                <CardDescription className="text-blue-600">Environmental monitoring data</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-slate-700">Water Quality Index</span>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200">8.2/10</Badge>
                </div>
                <Separator className="bg-blue-100" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-slate-700">Trash Density</span>
                  <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">Low</Badge>
                </div>
                <Separator className="bg-blue-100" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-slate-700">Coverage Area</span>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800">15.2 km²</Badge>
                </div>
                <Separator className="bg-blue-100" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-slate-700">pH Level</span>
                  <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">7.4</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card className="border-orange-200 shadow-lg bg-gradient-to-br from-orange-50/50 to-red-50/50 backdrop-blur">
              <CardHeader className="border-b border-orange-100">
                <CardTitle className="text-lg text-orange-900">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Alert className="border-yellow-200 bg-yellow-50/80">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Network latency increased in Zone B
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50/80">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Bot AGOS-004 requires maintenance
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
    
            