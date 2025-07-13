'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  Filter,
  Search,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Layers,
  Activity,
  Recycle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// Alternative dynamic import with full path
const TrashDepositsMap = dynamic(() => import('@/app/admin/trash-deposits/TrashDepositsMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading map...</p>
      </div>
    </div>
  )
});

export default function TrashDeposits() {
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'chart'
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedTrashType, setSelectedTrashType] = useState('all');

  // Updated data for Calapan City rivers
  const trashData = [
    { 
      id: 'calapan-river-zone-1',
      area: 'Calapan River - Zone 1', 
      coordinates: [13.4115, 121.1803], // Calapan River coordinates
      totalItems: 2156,
      breakdown: {
        plasticBottles: 892,
        foodContainers: 534,
        plasticBags: 387,
        metalCans: 243,
        other: 100
      },
      density: 'Very High'
    },
    { 
      id: 'calapan-river-zone-2',
      area: 'Calapan River - Zone 2', 
      coordinates: [13.4095, 121.1820],
      totalItems: 1543,
      breakdown: {
        plasticBottles: 623,
        foodContainers: 398,
        plasticBags: 276,
        metalCans: 156,
        other: 90
      },
      density: 'High'
    },
    { 
      id: 'bucayao-river-zone-1',
      area: 'Bucayao River - Zone 1', 
      coordinates: [13.4289, 121.1456], // Bucayao River coordinates
      totalItems: 987,
      breakdown: {
        plasticBottles: 423,
        foodContainers: 234,
        plasticBags: 178,
        metalCans: 98,
        other: 54
      },
      density: 'Medium'
    },
    { 
      id: 'bucayao-river-zone-2',
      area: 'Bucayao River - Zone 2', 
      coordinates: [13.4298, 121.1445],
      totalItems: 1234,
      breakdown: {
        plasticBottles: 534,
        foodContainers: 287,
        plasticBags: 198,
        metalCans: 145,
        other: 70
      },
      density: 'High'
    },
    { 
      id: 'naujan-lake-zone-1',
      area: 'Naujan Lake - Zone 1', 
      coordinates: [13.3289, 121.3025], // Naujan Lake coordinates
      totalItems: 756,
      breakdown: {
        plasticBottles: 298,
        foodContainers: 187,
        plasticBags: 123,
        metalCans: 89,
        other: 59
      },
      density: 'Medium'
    },
    { 
      id: 'naujan-lake-zone-2',
      area: 'Naujan Lake - Zone 2', 
      coordinates: [13.3298, 121.3045],
      totalItems: 892,
      breakdown: {
        plasticBottles: 387,
        foodContainers: 223,
        plasticBags: 145,
        metalCans: 97,
        other: 40
      },
      density: 'Medium'
    }
  ];

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'Very High': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDensityTextColor = (density: string) => {
    switch (density) {
      case 'Very High': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trash Deposits Analysis</h1>
              <p className="text-gray-600 mt-1">Geographic distribution and composition of collected waste</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Statistics - Moved to top with enhanced design */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 rounded-lg shadow-md">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">6</p>
                <p className="text-xs text-blue-600 font-medium">Areas</p>
              </div>
            </div>
            <h3 className="font-semibold text-blue-900 mb-1">Monitored Zones</h3>
            <p className="text-sm text-blue-700">Rivers & waterways tracked</p>
            <div className="mt-3 flex items-center text-xs text-blue-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              All zones active
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg border border-green-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-600 rounded-lg shadow-md">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-900">7,568</p>
                <p className="text-xs text-green-600 font-medium">Items</p>
              </div>
            </div>
            <h3 className="font-semibold text-green-900 mb-1">Total Collected</h3>
            <p className="text-sm text-green-700">Trash items identified</p>
            <div className="mt-3 flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last week
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl shadow-lg border border-purple-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600 rounded-lg shadow-md">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-900">1,261</p>
                <p className="text-xs text-purple-600 font-medium">Avg/Zone</p>
              </div>
            </div>
            <h3 className="font-semibold text-purple-900 mb-1">Average Density</h3>
            <p className="text-sm text-purple-700">Items per monitored area</p>
            <div className="mt-3 flex items-center text-xs text-purple-600">
              <Activity className="w-3 h-3 mr-1" />
              Moderate levels
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl shadow-lg border border-orange-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-600 rounded-lg shadow-md">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-900">1</p>
                <p className="text-xs text-orange-600 font-medium">Zone</p>
              </div>
            </div>
            <h3 className="font-semibold text-orange-900 mb-1">High Density Alert</h3>
            <p className="text-sm text-orange-700">Calapan River Z1</p>
            <div className="mt-3 flex items-center text-xs text-orange-600">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Requires attention
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map/Chart Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {viewMode === 'map' ? 'Geographic Distribution' : 'Trash Composition Analysis'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {viewMode === 'map' 
                        ? 'Interactive map showing trash deposits across waterways' 
                        : 'Statistical breakdown of collected waste types'
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'map' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <MapPin className="h-4 w-4 mr-2 inline" />
                      Map View
                    </button>
                    <button
                      onClick={() => setViewMode('chart')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'chart' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <BarChart3 className="h-4 w-4 mr-2 inline" />
                      Chart View
                    </button>
                  </div>
                </div>

                {/* Filters moved inside Geographic Distribution section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <select 
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="all">All Areas</option>
                        <option value="calapan">Calapan River</option>
                        <option value="bucayao">Bucayao River</option>
                        <option value="naujan">Naujan Lake</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <select 
                        value={selectedTrashType}
                        onChange={(e) => setSelectedTrashType(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="all">All Types</option>
                        <option value="plasticBottles">Plastic Bottles</option>
                        <option value="foodContainers">Food Containers</option>
                        <option value="plasticBags">Plastic Bags</option>
                        <option value="metalCans">Metal Cans</option>
                        <option value="other">Other Debris</option>
                      </select>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        <Layers className="h-4 w-4" />
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {viewMode === 'map' ? (
                  <div className="h-96">
                    <TrashDepositsMap 
                      locations={trashData}
                      onLocationSelect={handleLocationSelect}
                      selectedLocation={selectedLocation}
                      selectedTrashType={selectedTrashType}
                    />
                  </div>
                ) : (
                  // Chart view
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Composition Chart Placeholder */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-4">Trash Type Distribution</h4>
                        <div className="space-y-3">
                          {(
                            [
                              { type: 'Plastic Bottles', count: 3157, percentage: 41.7, color: 'bg-blue-500' },
                              { type: 'Food Containers', count: 1863, percentage: 24.6, color: 'bg-green-500' },
                              { type: 'Plastic Bags', count: 1307, percentage: 17.3, color: 'bg-yellow-500' },
                              { type: 'Metal Cans', count: 828, percentage: 10.9, color: 'bg-purple-500' },
                              { type: 'Other Debris', count: 413, percentage: 5.5, color: 'bg-gray-500' },
                            ] as Array<{ type: string, count: number, percentage: number, color: string }>
                          ).map((item) => (
                            <div key={item.type} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="text-sm text-gray-900">{item.type}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Area Comparison */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-4">Area Comparison</h4>
                        <div className="space-y-3">
                          {trashData.map((area) => (
                            <div key={area.area} className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-gray-900">{area.area}</span>
                                <span className={`text-xs ml-2 px-2 py-1 rounded-full ${
                                  area.density === 'Very High' ? 'bg-red-100 text-red-800' :
                                  area.density === 'High' ? 'bg-orange-100 text-orange-800' :
                                  area.density === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {area.density}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-gray-900">{area.totalItems}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Area Details */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Area Details</h3>
                <p className="text-sm text-gray-600 mt-1">Click on zones for detailed breakdown</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {trashData.map((area, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedLocation?.id === area.id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleLocationSelect(area)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{area.area}</h4>
                          <p className={`text-xs font-medium ${getDensityTextColor(area.density)} flex items-center mt-1`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${getDensityColor(area.density)}`}></div>
                            {area.density} Density
                          </p>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{area.totalItems}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">🍶 Bottles</span>
                          <span className="font-medium">{area.breakdown.plasticBottles}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">📦 Containers</span>
                          <span className="font-medium">{area.breakdown.foodContainers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">🛍️ Bags</span>
                          <span className="font-medium">{area.breakdown.plasticBags}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">🥫 Cans</span>
                          <span className="font-medium">{area.breakdown.metalCans}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Density Legend</h3>
                <p className="text-sm text-gray-600 mt-1">Trash concentration levels</p>
              </div>
              <div className="p-6 space-y-3">
                {(
                  [
                    { level: 'Very High', range: '1500+ items', color: 'bg-red-500', description: 'Critical - Immediate action needed' },
                    { level: 'High', range: '1000-1499 items', color: 'bg-orange-500', description: 'High priority cleanup zone' },
                    { level: 'Medium', range: '500-999 items', color: 'bg-yellow-500', description: 'Regular monitoring required' },
                    { level: 'Low', range: '0-499 items', color: 'bg-green-500', description: 'Well maintained area' },
                  ] as Array<{ level: string, range: string, color: string, description: string }>
                ).map((item) => (
                  <div key={item.level} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-4 h-4 rounded-full ${item.color} mt-0.5 shadow-sm`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{item.level}</span>
                        <span className="text-xs text-gray-500 font-medium">{item.range}</span>
                      </div>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
                      