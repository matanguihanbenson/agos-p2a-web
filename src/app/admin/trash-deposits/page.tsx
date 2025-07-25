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
    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading map...</p>
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
                <p className="text-2xl font-bold text-blue-900">{filteredData.length}</p>
                <p className="text-xs text-blue-600 font-medium">Areas</p>
              </div>
            </div>
            <h3 className="font-semibold text-blue-900 mb-1">Monitored Zones</h3>
            <p className="text-sm text-blue-700">
              {selectedArea === 'all' ? 'All waterways' : 
               selectedArea === 'calapan' ? 'Calapan River system' :
               selectedArea === 'bucayao' ? 'Bucayao River system' :
               selectedArea === 'naujan' ? 'Naujan Lake area' : 'Selected areas'} tracked
            </p>
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
                <p className="text-2xl font-bold text-green-900">
                  {filteredData.reduce((sum, item) => sum + item.totalItems, 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 font-medium">Items</p>
              </div>
            </div>
            <h3 className="font-semibold text-green-900 mb-1">Total Collected</h3>
            <p className="text-sm text-green-700">
              {selectedTrashType === 'all' ? 'All trash types' : 
               selectedTrashType === 'plasticBottles' ? 'Plastic bottles only' :
               selectedTrashType === 'foodContainers' ? 'Food containers only' :
               selectedTrashType === 'plasticBags' ? 'Plastic bags only' :
               selectedTrashType === 'metalCans' ? 'Metal cans only' :
               'Other debris only'}
            </p>
            <div className="mt-3 flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              {filteredData.length > 0 ? '+12% from last week' : 'No data for filter'}
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
                      locations={filteredData}
                      onLocationSelect={handleLocationSelect}
                      selectedLocation={selectedLocation}
                      selectedTrashType={selectedTrashType}
                    />
                  </div>
                ) : (
                  // Updated chart view with filtered data
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Composition Chart with filtered data */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-4">Trash Type Distribution</h4>
                        <div className="space-y-3">
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

                      {/* Area Comparison with filtered data */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-4">Area Comparison</h4>
                        <div className="space-y-3">
                          {filteredData.length > 0 ? filteredData.map((area) => (
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
                          )) : (
                            <div className="text-center text-gray-500 py-4">
                              <p className="text-sm">No data matches current filters</p>
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

          {/* Sidebar with filtered data */}
          <div className="space-y-6">
            {/* Area Details with filtered data */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Area Details</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredData.length > 0 ? 'Click on zones for detailed breakdown' : 'No areas match current filters'}
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {filteredData.length > 0 ? filteredData.map((area, index) => (
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
                  )) : (
                    <div className="text-center text-gray-500 py-8">
                      <p className="text-sm mb-2">No areas found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  )}
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
