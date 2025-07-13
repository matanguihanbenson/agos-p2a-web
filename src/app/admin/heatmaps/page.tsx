'use client';

import React, { useState } from 'react';
import { 
  Map, 
  Thermometer,
  Filter,
  RefreshCw,
  Download,
  Play,
  Pause,
  Settings,
  Eye,
  Layers
} from 'lucide-react';

export default function Heatmaps() {
  const [selectedMetric, setSelectedMetric] = useState('trash-density');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [isAnimated, setIsAnimated] = useState(false);

  const heatmapData = {
    'trash-density': {
      title: 'Trash Density Distribution',
      description: 'Real-time visualization of trash concentration across monitored areas',
      zones: [
        { name: 'Zone A - Pasig Bridge', intensity: 85, coords: [14.5995, 120.9842], color: 'high' },
        { name: 'Zone B - Marikina Park', intensity: 62, coords: [14.6760, 121.1309], color: 'medium' },
        { name: 'Zone C - Taguig Canal', intensity: 43, coords: [14.5176, 121.0509], color: 'low' },
        { name: 'Zone D - San Juan Creek', intensity: 91, coords: [14.6019, 121.0355], color: 'very-high' },
        { name: 'Zone E - Pasig Estero', intensity: 74, coords: [14.5995, 120.9742], color: 'high' },
      ]
    },
    'water-quality': {
      title: 'Water Quality Index',
      description: 'Spatial distribution of water quality measurements',
      zones: [
        { name: 'Zone A - Pasig Bridge', intensity: 7.2, coords: [14.5995, 120.9842], color: 'good' },
        { name: 'Zone B - Marikina Park', intensity: 8.1, coords: [14.6760, 121.1309], color: 'excellent' },
        { name: 'Zone C - Taguig Canal', intensity: 6.8, coords: [14.5176, 121.0509], color: 'fair' },
        { name: 'Zone D - San Juan Creek', intensity: 5.9, coords: [14.6019, 121.0355], color: 'poor' },
        { name: 'Zone E - Pasig Estero', intensity: 7.5, coords: [14.5995, 120.9742], color: 'good' },
      ]
    },
    'collection-efficiency': {
      title: 'Collection Efficiency',
      description: 'Bot performance and collection rates across different areas',
      zones: [
        { name: 'Zone A - Pasig Bridge', intensity: 94, coords: [14.5995, 120.9842], color: 'excellent' },
        { name: 'Zone B - Marikina Park', intensity: 87, coords: [14.6760, 121.1309], color: 'good' },
        { name: 'Zone C - Taguig Canal', intensity: 92, coords: [14.5176, 121.0509], color: 'excellent' },
        { name: 'Zone D - San Juan Creek', intensity: 78, coords: [14.6019, 121.0355], color: 'fair' },
        { name: 'Zone E - Pasig Estero', intensity: 89, coords: [14.5995, 120.9742], color: 'good' },
      ]
    }
  };

  const getIntensityColor = (color: string) => {
    switch (color) {
      case 'very-high': case 'poor': return 'bg-red-600';
      case 'high': case 'fair': return 'bg-orange-500';
      case 'medium': case 'good': return 'bg-yellow-500';
      case 'low': case 'excellent': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getIntensityRing = (color: string) => {
    switch (color) {
      case 'very-high': case 'poor': return 'ring-red-300';
      case 'high': case 'fair': return 'ring-orange-300';
      case 'medium': case 'good': return 'ring-yellow-300';
      case 'low': case 'excellent': return 'ring-green-300';
      default: return 'ring-gray-300';
    }
  };

  const currentData = heatmapData[selectedMetric as keyof typeof heatmapData];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trash Density Heatmaps</h1>
              <p className="text-gray-600 mt-1">Real-time spatial analysis of environmental data</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsAnimated(!isAnimated)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAnimated 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isAnimated ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Animation
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Animation
                  </>
                )}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heatmap Type</label>
                <select 
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="trash-density">Trash Density</option>
                  <option value="water-quality">Water Quality</option>
                  <option value="collection-efficiency">Collection Efficiency</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hour">Last Hour</option>
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  defaultValue="70"
                  className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Layers className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Filter className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Heatmap Display */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{currentData.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{currentData.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isAnimated && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Live Updates</span>
                      </div>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Heatmap Container */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg h-96 relative overflow-hidden">
                  {/* Background map representation */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 via-green-100 to-blue-200"></div>
                  </div>
                  
                  {/* River paths */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path 
                      d="M50 100 Q150 80 250 120 Q350 160 450 140" 
                      stroke="#3b82f6" 
                      strokeWidth="8" 
                      fill="none" 
                      opacity="0.3"
                    />
                    <path 
                      d="M80 200 Q180 180 280 220 Q380 260 480 240" 
                      stroke="#06b6d4" 
                      strokeWidth="6" 
                      fill="none" 
                      opacity="0.3"
                    />
                  </svg>

                  {/* Heatmap zones */}
                  {currentData.zones.map((zone, index) => (
                    <div
                      key={index}
                      className={`absolute rounded-full ${getIntensityColor(zone.color)} opacity-60 animate-pulse ring-4 ${getIntensityRing(zone.color)}`}
                      style={{
                        left: `${15 + index * 18}%`,
                        top: `${20 + (index % 2) * 40}%`,
                        width: `${Math.max(60, zone.intensity)}px`,
                        height: `${Math.max(60, zone.intensity)}px`,
                        animationDelay: `${index * 0.5}s`,
                        transform: isAnimated ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 2s ease-in-out'
                      }}
                      title={`${zone.name}: ${zone.intensity}${selectedMetric === 'water-quality' ? '/10' : '%'}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {selectedMetric === 'water-quality' ? zone.intensity.toFixed(1) : zone.intensity}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Center info */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Live Data</div>
                      <div className="text-gray-600">Updated 2 min ago</div>
                    </div>
                  </div>
                </div>

                {/* Data Summary */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">5</div>
                    <div className="text-sm text-gray-600">Active Zones</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-gray-600">High Intensity</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedMetric === 'water-quality' ? '7.1' : '71'}
                      {selectedMetric === 'water-quality' ? '' : '%'}
                    </div>
                    <div className="text-sm text-gray-600">Average Reading</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-gray-600">Coverage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Intensity Scale */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Intensity Scale</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {selectedMetric === 'water-quality' ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-sm">Excellent (8.0+)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Good (7.0-7.9)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                        <span className="text-sm">Fair (6.0-6.9)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-red-600"></div>
                        <span className="text-sm">Poor (&lt;6.0)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-red-600"></div>
                        <span className="text-sm">Very High (80%+)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                        <span className="text-sm">High (60-79%)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Medium (40-59%)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-sm">Low (&lt;40%)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Zone Details */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Zone Details</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {currentData.zones.map((zone, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{zone.name}</span>
                        <div className={`w-3 h-3 rounded-full ${getIntensityColor(zone.color)}`}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                          {selectedMetric === 'water-quality' ? 'Quality Index' : 'Intensity'}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {selectedMetric === 'water-quality' ? zone.intensity.toFixed(1) : `${zone.intensity}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Map className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-900 font-medium">Full Screen Map</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-green-600" />
                    <span className="text-green-900 font-medium">Export Heatmap</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Thermometer className="h-5 w-5 text-purple-600" />
                    <span className="text-purple-900 font-medium">Configure Thresholds</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
