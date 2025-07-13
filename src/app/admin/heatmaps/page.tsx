'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Map, 
  Filter,
  RefreshCw,
  Download,
  Play,
  Pause,
  Eye,
  MapPin,
  X,
  BarChart3,
  Droplets,
  Zap
} from 'lucide-react';

// Type definitions
interface HeatmapArea {
  name: string;
  coordinates: number[][];
  value: number;
  intensity: string;
  color: string;
}

interface ReverseGeocodeResponse {
  display_name?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    [key: string]: string | undefined;
  };
  [key: string]: unknown;
}

// Dynamic import for the map component to avoid SSR issues
const HeatmapViewer = dynamic(() => import('./HeatmapViewer'), {
  ssr: false,
  loading: () => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading heatmap...</p>
      </div>
    </div>
  )
});

export default function Heatmaps() {
  const [selectedMetric, setSelectedMetric] = useState('trash-density');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedArea, setSelectedArea] = useState<HeatmapArea | null>(null);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [reverseGeocode, setReverseGeocode] = useState<ReverseGeocodeResponse | null>(null);
  const [loadingGeocode, setLoadingGeocode] = useState(false);

  // Utility function for reverse geocoding using OpenStreetMap Nominatim
  const getReverseGeocode = async (lat: number, lng: number): Promise<void> => {
    setLoadingGeocode(true);
    try {
      // Add User-Agent header to comply with Nominatim usage policy
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=16`,
        {
          headers: {
            'User-Agent': 'P2A-Heatmap-Viewer/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as ReverseGeocodeResponse;
      console.log('Reverse geocode response:', data); // Debug log
      setReverseGeocode(data);
    } catch (error) {
      console.error('Error fetching reverse geocode:', error);
      setReverseGeocode({ error: 'Failed to fetch address information' } as ReverseGeocodeResponse);
    } finally {
      setLoadingGeocode(false);
    }
  };

  // Handle area click
  const handleAreaClick = (area: HeatmapArea): void => {
    console.log('Area clicked:', area); // Debug log
    setSelectedArea(area);
    setShowLocationPopup(true);
    setReverseGeocode(null);
    
    // Calculate center point of the area for reverse geocoding
    const centerLat = area.coordinates.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / area.coordinates.length;
    const centerLng = area.coordinates.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / area.coordinates.length;
    
    console.log('Center coordinates:', { centerLat, centerLng }); // Debug log
    
    // Add a small delay to ensure the popup is visible before making the API call
    setTimeout(() => {
      getReverseGeocode(centerLat, centerLng);
    }, 100);
  };

  // Sample data for different areas with coordinates for polygons
  const heatmapData = {
    'trash-density': {
      title: 'Trash Density Distribution',
      description: 'Real-time visualization of trash concentration across monitored areas',
      areas: [
        {
          name: 'Calapan River Zone 1',
          coordinates: [
            [13.4100, 121.1790],
            [13.4120, 121.1790],
            [13.4130, 121.1810],
            [13.4120, 121.1820],
            [13.4100, 121.1820],
            [13.4090, 121.1810]
          ],
          value: 2156,
          intensity: 'very-high',
          color: '#ef4444'
        },
        {
          name: 'Calapan River Zone 2',
          coordinates: [
            [13.4080, 121.1805],
            [13.4100, 121.1805],
            [13.4110, 121.1825],
            [13.4100, 121.1835],
            [13.4080, 121.1835],
            [13.4070, 121.1825]
          ],
          value: 1543,
          intensity: 'high',
          color: '#f97316'
        },
        {
          name: 'Bucayao River Zone 1',
          coordinates: [
            [13.4280, 121.1440],
            [13.4300, 121.1440],
            [13.4310, 121.1460],
            [13.4300, 121.1470],
            [13.4280, 121.1470],
            [13.4270, 121.1460]
          ],
          value: 987,
          intensity: 'medium',
          color: '#eab308'
        },
        {
          name: 'Bucayao River Zone 2',
          coordinates: [
            [13.4290, 121.1430],
            [13.4310, 121.1430],
            [13.4320, 121.1450],
            [13.4310, 121.1460],
            [13.4290, 121.1460],
            [13.4280, 121.1450]
          ],
          value: 1234,
          intensity: 'high',
          color: '#f97316'
        },
        {
          name: 'Naujan Lake Zone 1',
          coordinates: [
            [13.3280, 121.3010],
            [13.3300, 121.3010],
            [13.3310, 121.3030],
            [13.3300, 121.3040],
            [13.3280, 121.3040],
            [13.3270, 121.3030]
          ],
          value: 756,
          intensity: 'medium',
          color: '#eab308'
        },
        {
          name: 'Naujan Lake Zone 2',
          coordinates: [
            [13.3290, 121.3030],
            [13.3310, 121.3030],
            [13.3320, 121.3050],
            [13.3310, 121.3060],
            [13.3290, 121.3060],
            [13.3280, 121.3050]
          ],
          value: 892,
          intensity: 'medium',
          color: '#eab308'
        }
      ]
    },
    'water-quality': {
      title: 'Water Quality Index',
      description: 'Spatial distribution of water quality measurements',
      areas: [
        {
          name: 'Calapan River Zone 1',
          coordinates: [
            [13.4100, 121.1790],
            [13.4120, 121.1790],
            [13.4130, 121.1810],
            [13.4120, 121.1820],
            [13.4100, 121.1820],
            [13.4090, 121.1810]
          ],
          value: 7.2,
          intensity: 'good',
          color: '#22c55e'
        },
        {
          name: 'Calapan River Zone 2',
          coordinates: [
            [13.4080, 121.1805],
            [13.4100, 121.1805],
            [13.4110, 121.1825],
            [13.4100, 121.1835],
            [13.4080, 121.1835],
            [13.4070, 121.1825]
          ],
          value: 8.1,
          intensity: 'excellent',
          color: '#16a34a'
        },
        {
          name: 'Bucayao River Zone 1',
          coordinates: [
            [13.4280, 121.1440],
            [13.4300, 121.1440],
            [13.4310, 121.1460],
            [13.4300, 121.1470],
            [13.4280, 121.1470],
            [13.4270, 121.1460]
          ],
          value: 6.8,
          intensity: 'fair',
          color: '#eab308'
        },
        {
          name: 'Bucayao River Zone 2',
          coordinates: [
            [13.4290, 121.1430],
            [13.4310, 121.1430],
            [13.4320, 121.1450],
            [13.4310, 121.1460],
            [13.4290, 121.1460],
            [13.4280, 121.1450]
          ],
          value: 5.9,
          intensity: 'poor',
          color: '#ef4444'
        },
        {
          name: 'Naujan Lake Zone 1',
          coordinates: [
            [13.3280, 121.3010],
            [13.3300, 121.3010],
            [13.3310, 121.3030],
            [13.3300, 121.3040],
            [13.3280, 121.3040],
            [13.3270, 121.3030]
          ],
          value: 7.5,
          intensity: 'good',
          color: '#22c55e'
        },
        {
          name: 'Naujan Lake Zone 2',
          coordinates: [
            [13.3290, 121.3030],
            [13.3310, 121.3030],
            [13.3320, 121.3050],
            [13.3310, 121.3060],
            [13.3290, 121.3060],
            [13.3280, 121.3050]
          ],
          value: 6.9,
          intensity: 'fair',
          color: '#eab308'
        }
      ]
    },
    'collection-efficiency': {
      title: 'Collection Efficiency',
      description: 'Bot performance and collection rates across different areas',
      areas: [
        {
          name: 'Calapan River Zone 1',
          coordinates: [
            [13.4100, 121.1790],
            [13.4120, 121.1790],
            [13.4130, 121.1810],
            [13.4120, 121.1820],
            [13.4100, 121.1820],
            [13.4090, 121.1810]
          ],
          value: 94,
          intensity: 'excellent',
          color: '#16a34a'
        },
        {
          name: 'Calapan River Zone 2',
          coordinates: [
            [13.4080, 121.1805],
            [13.4100, 121.1805],
            [13.4110, 121.1825],
            [13.4100, 121.1835],
            [13.4080, 121.1835],
            [13.4070, 121.1825]
          ],
          value: 87,
          intensity: 'good',
          color: '#22c55e'
        },
        {
          name: 'Bucayao River Zone 1',
          coordinates: [
            [13.4280, 121.1440],
            [13.4300, 121.1440],
            [13.4310, 121.1460],
            [13.4300, 121.1470],
            [13.4280, 121.1470],
            [13.4270, 121.1460]
          ],
          value: 92,
          intensity: 'excellent',
          color: '#16a34a'
        },
        {
          name: 'Bucayao River Zone 2',
          coordinates: [
            [13.4290, 121.1430],
            [13.4310, 121.1430],
            [13.4320, 121.1450],
            [13.4310, 121.1460],
            [13.4290, 121.1460],
            [13.4280, 121.1450]
          ],
          value: 78,
          intensity: 'fair',
          color: '#eab308'
        },
        {
          name: 'Naujan Lake Zone 1',
          coordinates: [
            [13.3280, 121.3010],
            [13.3300, 121.3010],
            [13.3310, 121.3030],
            [13.3300, 121.3040],
            [13.3280, 121.3040],
            [13.3270, 121.3030]
          ],
          value: 89,
          intensity: 'good',
          color: '#22c55e'
        },
        {
          name: 'Naujan Lake Zone 2',
          coordinates: [
            [13.3290, 121.3030],
            [13.3310, 121.3030],
            [13.3320, 121.3050],
            [13.3310, 121.3060],
            [13.3290, 121.3060],
            [13.3280, 121.3050]
          ],
          value: 85,
          intensity: 'good',
          color: '#22c55e'
        }
      ]
    }
  };

  const currentData = heatmapData[selectedMetric as keyof typeof heatmapData];

  // Calculate statistics
  const totalAreas = currentData.areas.length;
  const highIntensityAreas = currentData.areas.filter(area => 
    area.intensity === 'very-high' || area.intensity === 'poor'
  ).length;
  const averageValue = selectedMetric === 'water-quality' 
    ? (currentData.areas.reduce((sum, area) => sum + area.value, 0) / totalAreas).toFixed(1)
    : Math.round(currentData.areas.reduce((sum, area) => sum + area.value, 0) / totalAreas);

  // Metric icons mapping
  const metricIcons = {
    'trash-density': BarChart3,
    'water-quality': Droplets,
    'collection-efficiency': Zap
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Simplified Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Environmental Heatmaps</h1>
              <p className="text-gray-600 text-sm">Real-time spatial analysis across waterways</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAnimated(!isAnimated)}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isAnimated 
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/25' 
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/25'
                } shadow-lg`}
              >
                {isAnimated ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Animate
                  </>
                )}
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Modern Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Metric Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-3">Analysis Type</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(metricIcons).map(([key, Icon]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedMetric === key
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {key === 'trash-density' ? 'Trash' : key === 'water-quality' ? 'Quality' : 'Efficiency'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-3">Time Range</label>
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="hour">Last Hour</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-end gap-2">
              <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Filter className="h-5 w-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Eye className="h-5 w-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Heatmap Display */}
          <div className="xl:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{currentData.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{currentData.description}</p>
                  </div>
                  {isAnimated && (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Live</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {/* Heatmap Container */}
                <div className="h-96 rounded-xl overflow-hidden">
                  <HeatmapViewer 
                    areas={currentData.areas}
                    isAnimated={isAnimated}
                  />
                </div>

                {/* Compact Stats */}
                <div className="mt-6 grid grid-cols-4 gap-4">
                  <div className="bg-gray-50/50 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-gray-900">{totalAreas}</div>
                    <div className="text-xs text-gray-500 mt-1">Areas</div>
                  </div>
                  <div className="bg-red-50/50 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-red-600">{highIntensityAreas}</div>
                    <div className="text-xs text-gray-500 mt-1">High Risk</div>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {averageValue}{selectedMetric === 'water-quality' ? '' : selectedMetric === 'collection-efficiency' ? '%' : ''}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Average</div>
                  </div>
                  <div className="bg-green-50/50 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-green-600">92%</div>
                    <div className="text-xs text-gray-500 mt-1">Coverage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Sidebar */}
          <div className="space-y-6">
            {/* Intensity Scale */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Scale</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {selectedMetric === 'water-quality' ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        <span className="text-sm text-gray-700">Excellent</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Good</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-700">Fair</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                        <span className="text-sm text-gray-700">Poor</span>
                      </div>
                    </>
                  ) : selectedMetric === 'collection-efficiency' ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        <span className="text-sm text-gray-700">Excellent</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Good</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-700">Fair</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                        <span className="text-sm text-gray-700">Poor</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                        <span className="text-sm text-gray-700">Very High</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-700">High</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-700">Medium</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Low</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Area List */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Areas</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {currentData.areas.map((area, index) => (
                    <div 
                      key={index} 
                      className="group border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200"
                      onClick={() => handleAreaClick(area)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-900">{area.name}</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2.5 h-2.5 rounded-full shadow-sm" 
                            style={{ backgroundColor: area.color }}
                          ></div>
                          <MapPin className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {selectedMetric === 'water-quality' ? 'Quality' : 
                           selectedMetric === 'collection-efficiency' ? 'Efficiency' : 'Items'}
                        </span>
                        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-900">
                          {selectedMetric === 'water-quality' ? area.value.toFixed(1) : 
                           selectedMetric === 'collection-efficiency' ? `${area.value}%` : 
                           `${area.value}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Popup Modal */}
      {showLocationPopup && selectedArea && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-hidden border border-gray-200/50">
            {/* Fixed Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2.5 h-2.5 rounded-full shadow-sm" 
                    style={{ backgroundColor: selectedArea.color }}
                  ></div>
                  <h3 className="font-semibold text-gray-900 text-base">{selectedArea.name}</h3>
                </div>
                <button 
                  onClick={() => setShowLocationPopup(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {selectedMetric === 'water-quality' ? selectedArea.value.toFixed(1) : 
                     selectedMetric === 'collection-efficiency' ? `${selectedArea.value}%` : 
                     `${selectedArea.value}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedMetric === 'water-quality' ? 'Quality Index' : 
                     selectedMetric === 'collection-efficiency' ? 'Efficiency' : 'Items'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 text-center">
                  <div className="text-lg font-bold capitalize" style={{ color: selectedArea.color }}>
                    {selectedArea.intensity.replace('-', ' ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Intensity</div>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Location</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                  <div className="text-xs text-gray-600 mb-2">Center Coordinates</div>
                  <div className="font-mono text-sm text-gray-900 leading-relaxed">
                    {(selectedArea.coordinates.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / selectedArea.coordinates.length).toFixed(4)}, {(selectedArea.coordinates.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / selectedArea.coordinates.length).toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {selectedArea.coordinates.length} polygon points
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Address</span>
                  </div>
                  {!loadingGeocode && (
                    <button 
                      onClick={() => getReverseGeocode(
                        selectedArea.coordinates.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / selectedArea.coordinates.length,
                        selectedArea.coordinates.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / selectedArea.coordinates.length
                      )}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                  {loadingGeocode ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border border-green-500 border-t-transparent"></div>
                      <span className="text-xs text-gray-600">Loading...</span>
                    </div>
                  ) : reverseGeocode ? (
                    reverseGeocode.error ? (
                      <div className="text-xs text-red-600">Unable to fetch address</div>
                    ) : (
                      <div className="space-y-2">
                        {reverseGeocode.address?.city && (
                          <div className="text-sm text-gray-900 font-medium">{reverseGeocode.address.city}</div>
                        )}
                        {reverseGeocode.address?.state && (
                          <div className="text-xs text-gray-600">{reverseGeocode.address.state}</div>
                        )}
                        {!reverseGeocode.address?.city && reverseGeocode.display_name && (
                          <div className="text-xs text-gray-700">
                            {reverseGeocode.display_name.split(',').slice(0, 3).join(', ')}
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="text-xs text-gray-500">Click refresh to load</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
                       