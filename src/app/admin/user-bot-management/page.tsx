'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Bot, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  MapPin,
  Battery,
  Wifi,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserBotManagement() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for users
  const users = [
    {
      id: 1,
      name: 'Maria Santos',
      email: 'maria.santos@agos.com',
      role: 'Field Operator',
      status: 'Active',
      assignedBots: ['AGOS-001', 'AGOS-002'],
      lastActive: '2 hours ago',
      location: 'Pasig River - Zone A'
    },
    {
      id: 2,
      name: 'Juan dela Cruz',
      email: 'juan.delacruz@agos.com',
      role: 'Field Operator',
      status: 'Active',
      assignedBots: ['AGOS-003'],
      lastActive: '30 minutes ago',
      location: 'Marikina River - Zone B'
    },
    {
      id: 3,
      name: 'Ana Reyes',
      email: 'ana.reyes@agos.com',
      role: 'Field Operator',
      status: 'Offline',
      assignedBots: ['AGOS-004'],
      lastActive: '1 day ago',
      location: 'Taguig Channel - Zone C'
    },
    {
      id: 4,
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@agos.com',
      role: 'Supervisor',
      status: 'Active',
      assignedBots: [],
      lastActive: '1 hour ago',
      location: 'Main Station'
    }
  ];

  // Mock data for bots
  const bots = [
    {
      id: 'AGOS-001',
      name: 'River Cleaner Alpha',
      status: 'Active',
      operator: 'Maria Santos',
      location: 'Pasig River - Zone A',
      battery: 87,
      signal: 'Strong',
      lastMaintenance: '2024-01-10',
      totalCollected: 1247,
      operationTime: '156 hours'
    },
    {
      id: 'AGOS-002',
      name: 'Aqua Guardian Beta',
      status: 'Active',
      operator: 'Maria Santos',
      location: 'Pasig River - Zone A',
      battery: 92,
      signal: 'Strong',
      lastMaintenance: '2024-01-08',
      totalCollected: 892,
      operationTime: '134 hours'
    },
    {
      id: 'AGOS-003',
      name: 'Water Sentinel Gamma',
      status: 'Charging',
      operator: 'Juan dela Cruz',
      location: 'Charging Station 1',
      battery: 45,
      signal: 'Good',
      lastMaintenance: '2024-01-12',
      totalCollected: 634,
      operationTime: '98 hours'
    },
    {
      id: 'AGOS-004',
      name: 'Eco Defender Delta',
      status: 'Maintenance',
      operator: 'Ana Reyes',
      location: 'Workshop',
      battery: 23,
      signal: 'Offline',
      lastMaintenance: '2024-01-15',
      totalCollected: 1456,
      operationTime: '187 hours'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'charging': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'offline': return <AlertCircle className="h-4 w-4" />;
      case 'charging': return <Battery className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-blue-200/50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="mx-8 flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">User & Bot Management</h1>
            <p className="text-slate-600 mt-1">Manage field operators and bot assignments</p>
          </div>
          
          <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab === 'users' ? 'User' : 'Bot'}
          </Button>
        </div>
      </header>

      <div className="mx-8 my-8 space-y-8">
        {/* Tabs */}
        <Card className="shadow-lg bg-white/80 backdrop-blur border-blue-200">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Field Operators ({users.length})</span>
              </TabsTrigger>
              <TabsTrigger value="bots" className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <span>AGOS Bots ({bots.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <CardHeader className="border-b border-slate-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`Search ${activeTab}...`}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="offline">Offline</option>
                    {activeTab === 'bots' && (
                      <>
                        <option value="charging">Charging</option>
                        <option value="maintenance">Maintenance</option>
                      </>
                    )}
                  </select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <TabsContent value="users" className="p-6">
              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow bg-gradient-to-r from-white to-slate-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{user.name}</h3>
                            <p className="text-sm text-slate-600">{user.email}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-slate-500">{user.role}</span>
                              <span className="text-xs text-slate-500">• {user.lastActive}</span>
                              <span className="text-xs text-slate-500">• {user.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge className={getStatusColor(user.status)}>
                              {getStatusIcon(user.status)}
                              <span className="ml-1">{user.status}</span>
                            </Badge>
                            <div className="text-xs text-slate-500 mt-1">
                              {user.assignedBots.length} bot{user.assignedBots.length !== 1 ? 's' : ''} assigned
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="hover:bg-blue-100">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-red-100">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {user.assignedBots.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-600">Assigned Bots:</span>
                            {user.assignedBots.map((botId) => (
                              <Badge key={botId} variant="secondary" className="bg-blue-100 text-blue-800">
                                {botId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bots" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bots.map((bot) => (
                  <Card key={bot.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-slate-50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <Bot className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-slate-800">{bot.id}</CardTitle>
                            <CardDescription>{bot.name}</CardDescription>
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(bot.status)}>
                          {getStatusIcon(bot.status)}
                          <span className="ml-1">{bot.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Operator</span>
                        <span className="font-medium text-slate-900">{bot.operator}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Location</span>
                        <span className="font-medium text-slate-900 text-right">{bot.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Battery</span>
                        <div className="flex items-center space-x-2">
                          <Battery className="h-4 w-4 text-slate-400" />
                          <span className={`font-medium ${
                            bot.battery > 60 ? 'text-green-600' :
                            bot.battery > 30 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {bot.battery}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Signal</span>
                        <div className="flex items-center space-x-2">
                          <Wifi className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{bot.signal}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-slate-900">{bot.totalCollected}</div>
                            <div className="text-xs text-slate-600">Items Collected</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-slate-900">{bot.operationTime}</div>
                            <div className="text-xs text-slate-600">Operation Time</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          Manage
                        </Button>
                        <Button variant="outline" size="icon">
                          <MapPin className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Operators</p>
                  <p className="text-3xl font-bold text-blue-900">{users.length}</p>
                  <p className="text-sm text-blue-600">
                    {users.filter(u => u.status === 'Active').length} active
                  </p>
                </div>
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Active Bots</p>
                  <p className="text-3xl font-bold text-green-900">
                    {bots.filter(b => b.status === 'Active').length}
                  </p>
                  <p className="text-sm text-green-600">
                    {bots.length} total bots
                  </p>
                </div>
                <div className="bg-green-600 p-3 rounded-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Avg Battery</p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {Math.round(bots.reduce((acc, bot) => acc + bot.battery, 0) / bots.length)}%
                  </p>
                  <p className="text-sm text-yellow-600">Above threshold</p>
                </div>
                <div className="bg-yellow-600 p-3 rounded-lg">
                  <Battery className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Coverage Areas</p>
                  <p className="text-3xl font-bold text-purple-900">8</p>
                  <p className="text-sm text-purple-600">All monitored</p>
                </div>
                <div className="bg-purple-600 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

