'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  Filter,
  BarChart3,
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
    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600 font-medium text-sm">Loading map...</p>
      </div>
    </div>
  )
});

interface TrashLocation {
  id: string;
  area: string;
  coordinates: number[]; // Changed from [number, number] to number[]
  totalItems: number;
  breakdown: {
    plasticBottles: number;
    foodContainers: number;
    plasticBags: number;
    metalCans: number;
    other: number;
  };
  density: string;
}

export default function TrashDeposits() {
  const [selectedArea, setSelectedArea] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'chart'
  const [selectedLocation, setSelectedLocation] = useState<TrashLocation | null>(null);
  const [selectedTrashType, setSelectedTrashType] = useState('all');

  // Updated data with more natural distribution across waterways
  const trashData = [
    // Calapan River - Main flow with multiple deposits
    { 
      id: 'calapan-river-upstream',
      area: 'Calapan River - Upstream', 
      coordinates: [13.4180, 121.1750], 
      totalItems: 1856,
      breakdown: {
        plasticBottles: 721,
        foodContainers: 445,
        plasticBags: 356,
        metalCans: 234,
        other: 100
      },
      density: 'Very High'
    },
    { 
      id: 'calapan-river-midstream',
      area: 'Calapan River - Midstream', 
      coordinates: [13.4115, 121.1803], 
      totalItems: 1643,
      breakdown: {
        plasticBottles: 634,
        foodContainers: 412,
        plasticBags: 298,
        metalCans: 201,
        other: 98
      },
      density: 'High'
    },
    { 
      id: 'calapan-river-downtown',
      area: 'Calapan River - Downtown', 
      coordinates: [13.4095, 121.1820],
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
      id: 'calapan-river-mouth',
      area: 'Calapan River - River Mouth', 
      coordinates: [13.4045, 121.1845],
      totalItems: 987,
      breakdown: {
        plasticBottles: 398,
        foodContainers: 234,
        plasticBags: 189,
        metalCans: 123,
        other: 43
      },
      density: 'Medium'
    },

    // Bucayao River - Natural flow pattern
    { 
      id: 'bucayao-river-source',
      area: 'Bucayao River - Source Area', 
      coordinates: [13.4345, 121.1398], 
      totalItems: 654,
      breakdown: {
        plasticBottles: 234,
        foodContainers: 156,
        plasticBags: 123,
        metalCans: 89,
        other: 52
      },
      density: 'Low'
    },
    { 
      id: 'bucayao-river-residential',
      area: 'Bucayao River - Residential Area', 
      coordinates: [13.4289, 121.1456], 
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
      id: 'bucayao-river-confluence',
      area: 'Bucayao River - Confluence', 
      coordinates: [13.4198, 121.1523],
      totalItems: 876,
      breakdown: {
        plasticBottles: 345,
        foodContainers: 198,
        plasticBags: 156,
        metalCans: 123,
        other: 54
      },
      density: 'Medium'
    },

    // Naujan Lake - Distributed around shoreline
    { 
      id: 'naujan-lake-north',
      area: 'Naujan Lake - North Shore', 
      coordinates: [13.3398, 121.3012], 
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
      id: 'naujan-lake-east',
      area: 'Naujan Lake - East Shore', 
      coordinates: [13.3289, 121.3125],
      totalItems: 543,
      breakdown: {
        plasticBottles: 198,
        foodContainers: 134,
        plasticBags: 89,
        metalCans: 76,
        other: 46
      },
      density: 'Low'
    },
    { 
      id: 'naujan-lake-south',
      area: 'Naujan Lake - South Shore', 
      coordinates: [13.3156, 121.3045],
      totalItems: 892,
      breakdown: {
        plasticBottles: 387,
        foodContainers: 223,
        plasticBags: 145,
        metalCans: 97,
        other: 40
      },
      density: 'Medium'
    },
    { 
      id: 'naujan-lake-west',
      area: 'Naujan Lake - West Shore', 
      coordinates: [13.3234, 121.2934],
      totalItems: 434,
      breakdown: {
        plasticBottles: 167,
        foodContainers: 98,
        plasticBags: 76,
        metalCans: 65,
        other: 28
      },
      density: 'Low'
    },

    // Additional smaller tributaries for realism
    { 
      id: 'tributary-1',
      area: 'Small Creek - Barangay A', 
      coordinates: [13.4267, 121.1634],
      totalItems: 321,
      breakdown: {
        plasticBottles: 123,
        foodContainers: 78,
        plasticBags: 56,
        metalCans: 43,
        other: 21
      },
      density: 'Low'
    },
    { 
      id: 'tributary-2',
      area: 'Drainage Canal - Market Area', 
      coordinates: [13.4087, 121.1789],
      totalItems: 1567,
      breakdown: {
        plasticBottles: 645,
        foodContainers: 398,
        plasticBags: 287,
        metalCans: 167,
        other: 70
      },
      density: 'High'
    }
  ];

  // Filter data based on selected area and trash type
  const filteredData = useMemo(() => {
    let filtered = trashData;

    // Filter by area
    if (selectedArea !== 'all') {
      filtered = filtered.filter(location => {
        switch (selectedArea) {
          case 'calapan':
            return location.area.toLowerCase().includes('calapan');
          case 'bucayao':
            return location.area.toLowerCase().includes('bucayao');
          case 'naujan':
            return location.area.toLowerCase().includes('naujan');
          default:
            return true;
        }
      });
    }

    // Filter by trash type - only show locations that have the selected type
    if (selectedTrashType !== 'all') {
      filtered = filtered.filter(location => {
        const count = location.breakdown[selectedTrashType as keyof typeof location.breakdown];
        return count > 0;
      });
    }

    return filtered;
  }, [selectedArea, selectedTrashType]);

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

  const handleLocationSelect = (location: TrashLocation) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Compact Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Trash Deposits Analysis</h1>
              <p className="text-slate-600 text-sm">Geographic distribution and composition of collected waste</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-1.5 border border-slate-200/50 rounded-lg text-sm font-medium text-slate-700 bg-white/70 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </button>
              <button className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                <Download className="h-3 w-3 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{filteredData.length}</p>
                <p className="text-xs text-blue-600 font-medium">Areas</p>
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1 text-sm">Monitored Zones</h3>
            <p className="text-xs text-slate-600">
              {selectedArea === 'all' ? 'All waterways' : 
               selectedArea === 'calapan' ? 'Calapan River system' :
               selectedArea === 'bucayao' ? 'Bucayao River system' :
               selectedArea === 'naujan' ? 'Naujan Lake area' : 'Selected areas'} tracked
            </p>
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
              All zones active
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-emerald-50/80 backdrop-blur-sm rounded-xl border border-emerald-200/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md">
                <Recycle className="h-4 w-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  {filteredData.reduce((sum, item) => sum + item.totalItems, 0).toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600 font-medium">Items</p>
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1 text-sm">Total Collected</h3>
            <p className="text-xs text-slate-600">
              {selectedTrashType === 'all' ? 'All trash types' : 
               selectedTrashType === 'plasticBottles' ? 'Plastic bottles only' :
               selectedTrashType === 'foodContainers' ? 'Food containers only' :
               selectedTrashType === 'plasticBags' ? 'Plastic bags only' :
               selectedTrashType === 'metalCans' ? 'Metal cans only' :
               'Other debris only'}
            </p>
            <div className="mt-2 flex items-center text-xs text-emerald-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              {filteredData.length > 0 ? '+12% from last week' : 'No data for filter'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-purple-50/80 backdrop-blur-sm rounded-xl border border-purple-200/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">1,261</p>
                <p className="text-xs text-purple-600 font-medium">Avg/Zone</p>
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1 text-sm">Average Density</h3>
            <p className="text-xs text-slate-600">Items per monitored area</p>
            <div className="mt-2 flex items-center text-xs text-purple-600">
              <Activity className="w-3 h-3 mr-1" />
              Moderate levels
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-orange-50/80 backdrop-blur-sm rounded-xl border border-orange-200/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">1</p>
                <p className="text-xs text-orange-600 font-medium">Zone</p>
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1 text-sm">High Density Alert</h3>
            <p className="text-xs text-slate-600">Calapan River Z1</p>
            <div className="mt-2 flex items-center text-xs text-orange-600">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></div>
              Requires attention
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compact Map/Chart Display */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg">
              <div className="p-4 border-b border-slate-200/50">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      {viewMode === 'map' ? 'Geographic Distribution' : 'Trash Composition Analysis'}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {viewMode === 'map' 
                        ? 'Interactive map showing trash deposits across waterways' 
                        : 'Statistical breakdown of collected waste types'
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'map' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                          : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 hover:from-slate-100 hover:to-slate-200 border border-slate-200/50'
                      }`}
                    >
                      <MapPin className="h-3 w-3 mr-1 inline" />
                      Map
                    </button>
                    <button
                      onClick={() => setViewMode('chart')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'chart' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                          : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 hover:from-slate-100 hover:to-slate-200 border border-slate-200/50'
                      }`}
                    >
                      <BarChart3 className="h-3 w-3 mr-1 inline" />
                      Chart
                    </button>
                  </div>
                </div>

                {/* Compact Filters */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-3 border border-slate-200/50">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <select 
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="border border-slate-200/50 rounded-md px-2.5 py-1 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/70 backdrop-blur-sm"
                      >
                        <option value="all">All Areas</option>
                        <option value="calapan">Calapan River</option>
                        <option value="bucayao">Bucayao River</option>
                        <option value="naujan">Naujan Lake</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <Filter className="h-3 w-3 text-slate-500" />
                      <select 
                        value={selectedTrashType}
                        onChange={(e) => setSelectedTrashType(e.target.value)}
                        className="border border-slate-200/50 rounded-md px-2.5 py-1 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/70 backdrop-blur-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="plasticBottles">Plastic Bottles</option>
                        <option value="foodContainers">Food Containers</option>
                        <option value="plasticBags">Plastic Bags</option>
                        <option value="metalCans">Metal Cans</option>
                        <option value="other">Other Debris</option>
                      </select>
                    </div>

                    <div className="ml-auto flex items-center space-x-1.5">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors">
                        <Layers className="h-3 w-3" />
                      </button>
                      <button className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-slate-700 bg-white/70 border border-slate-200/50 rounded-md hover:bg-white transition-colors shadow-sm">
                        <RefreshCw className="h-2.5 w-2.5 mr-1" />
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {viewMode === 'map' ? (
                  <div className="h-64">
                    <TrashDepositsMap 
                      locations={filteredData}
                      onLocationSelect={handleLocationSelect}
                      selectedLocation={selectedLocation}
                      selectedTrashType={selectedTrashType}
                    />
                  </div>
                ) : (
                  // Compact chart view
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Compact Composition Chart */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200/50">
                        <h4 className="font-medium text-slate-800 mb-3 text-sm">Trash Type Distribution</h4>
                        <div className="space-y-2">
                          {(() => {
                            const totals = filteredData.reduce((acc, item) => ({
                              plasticBottles: acc.plasticBottles + item.breakdown.plasticBottles,
                              foodContainers: acc.foodContainers + item.breakdown.foodContainers,
                              plasticBags: acc.plasticBags + item.breakdown.plasticBags,
                              metalCans: acc.metalCans + item.breakdown.metalCans,
                              other: acc.other + item.breakdown.other
                            }), { plasticBottles: 0, foodContainers: 0, plasticBags: 0, metalCans: 0, other: 0 });
                            
                            const grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);
                            
                            return [
                              { type: 'Plastic Bottles', count: totals.plasticBottles, percentage: ((totals.plasticBottles / grandTotal) * 100).toFixed(1), color: 'bg-blue-500' },
                              { type: 'Food Containers', count: totals.foodContainers, percentage: ((totals.foodContainers / grandTotal) * 100).toFixed(1), color: 'bg-green-500' },
                              { type: 'Plastic Bags', count: totals.plasticBags, percentage: ((totals.plasticBags / grandTotal) * 100).toFixed(1), color: 'bg-yellow-500' },
                              { type: 'Metal Cans', count: totals.metalCans, percentage: ((totals.metalCans / grandTotal) * 100).toFixed(1), color: 'bg-purple-500' },
                              { type: 'Other Debris', count: totals.other, percentage: ((totals.other / grandTotal) * 100).toFixed(1), color: 'bg-gray-500' },
                            ];
                          })().map((item) => (
                            <div key={item.type} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                                <span className="text-xs text-slate-800">{item.type}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-medium text-slate-800">{item.count}</span>
                                <span className="text-xs text-slate-500 ml-1">({item.percentage}%)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Compact Area Comparison */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200/50">
                        <h4 className="font-medium text-slate-800 mb-3 text-sm">Area Comparison</h4>
                        <div className="space-y-2">
                          {filteredData.length > 0 ? filteredData.map((area) => (
                            <div key={area.area} className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-medium text-slate-800">{area.area}</span>
                                <span className={`text-xs ml-1.5 px-1.5 py-0.5 rounded-full ${
                                  area.density === 'Very High' ? 'bg-red-100 text-red-800' :
                                  area.density === 'High' ? 'bg-orange-100 text-orange-800' :
                                  area.density === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {area.density}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-slate-800">{area.totalItems}</span>
                            </div>
                          )) : (
                            <div className="text-center text-slate-500 py-4">
                              <p className="text-xs">No data matches current filters</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact Sidebar */}
          <div className="space-y-4">
            {/* Compact Area Details */}
            <div className="bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg">
              <div className="p-4 border-b border-slate-200/50">
                <h3 className="text-base font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Area Details</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  {filteredData.length > 0 ? 'Click on zones for detailed breakdown' : 'No areas match current filters'}
                </p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {filteredData.length > 0 ? filteredData.map((area, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedLocation?.id === area.id 
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md' 
                          : 'border-slate-200/50 hover:border-slate-300/50 bg-gradient-to-r from-white to-slate-50'
                      }`}
                      onClick={() => handleLocationSelect(area)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-slate-800 text-sm">{area.area}</h4>
                          <p className={`text-xs font-medium ${getDensityTextColor(area.density)} flex items-center mt-0.5`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getDensityColor(area.density)}`}></div>
                            {area.density} Density
                          </p>
                        </div>
                        <span className="text-base font-bold text-slate-800">{area.totalItems}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">🍶 Bottles</span>
                          <span className="font-medium">{area.breakdown.plasticBottles}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">📦 Containers</span>
                          <span className="font-medium">{area.breakdown.foodContainers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">🛍️ Bags</span>
                          <span className="font-medium">{area.breakdown.plasticBags}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">🥫 Cans</span>
                          <span className="font-medium">{area.breakdown.metalCans}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-slate-500 py-6">
                      <p className="text-sm mb-1">No areas found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Compact Legend */}
            <div className="bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg">
              <div className="p-4 border-b border-slate-200/50">
                <h3 className="text-base font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Density Legend</h3>
                <p className="text-sm text-slate-600 mt-0.5">Trash concentration levels</p>
              </div>
              <div className="p-4 space-y-2">
                {(
                  [
                    { level: 'Very High', range: '1500+ items', color: 'bg-red-500', description: 'Critical - Immediate action needed' },
                    { level: 'High', range: '1000-1499 items', color: 'bg-orange-500', description: 'High priority cleanup zone' },
                    { level: 'Medium', range: '500-999 items', color: 'bg-yellow-500', description: 'Regular monitoring required' },
                    { level: 'Low', range: '0-499 items', color: 'bg-green-500', description: 'Well maintained area' },
                  ] as Array<{ level: string, range: string, color: string, description: string }>
                ).map((item) => (
                  <div key={item.level} className="flex items-start space-x-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${item.color} mt-0.5 shadow-sm`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-slate-800">{item.level}</span>
                        <span className="text-xs text-slate-500 font-medium">{item.range}</span>
                      </div>
                      <p className="text-xs text-slate-600">{item.description}</p>
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
