'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Map, 
  Filter,
  RefreshCw,
  Download,
  Eye,
  MapPin,
  X,
  BarChart3,
  Droplets,
  Zap,
  ChevronLeft,
  ChevronRight
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
  error?: string;
  fallback?: boolean;
  coordinates?: string;
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
  const [selectedArea, setSelectedArea] = useState<HeatmapArea | null>(null);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [reverseGeocode, setReverseGeocode] = useState<ReverseGeocodeResponse | null>(null);
  const [loadingGeocode, setLoadingGeocode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Utility function for reverse geocoding using internal API
  const getReverseGeocode = async (lat: number, lng: number): Promise<void> => {
    setLoadingGeocode(true);
    try {
      const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as ReverseGeocodeResponse;
      console.log('Reverse geocode response:', data); // Debug log
      setReverseGeocode(data);
    } catch (error) {
      console.error('Error fetching reverse geocode:', error);
      // Fallback to showing coordinates only
      setReverseGeocode({ 
        error: 'Address lookup unavailable',
        fallback: true,
        coordinates: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });
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

  // Pagination logic
  const itemsPerPage = 3;
  const totalPages = Math.ceil(currentData.areas.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAreas = currentData.areas.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Reset pagination when metric changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [selectedMetric]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Updated Header to match Reports */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Environmental Heatmaps</h1>
              <p className="text-slate-600 text-sm">Real-time spatial analysis across waterways</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Metric Selection */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">Analysis Type</label>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.entries(metricIcons).map(([key, Icon]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedMetric === key
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">
                      {key === 'trash-density' ? 'Trash' : key === 'water-quality' ? 'Quality' : 'Efficiency'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="lg:w-40">
              <label className="block text-xs font-medium text-gray-700 mb-2">Time Range</label>
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="hour">Last Hour</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-end gap-1">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <Filter className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <Eye className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Main Heatmap Display */}
          <div className="xl:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{currentData.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{currentData.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {/* Heatmap Container */}
                <div className="h-80 rounded-lg overflow-hidden">
                  <HeatmapViewer 
                    areas={currentData.areas}
                  />
                </div>

                {/* Compact Stats */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="bg-gray-50/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{totalAreas}</div>
                    <div className="text-xs text-gray-500">Areas</div>
                  </div>
                  <div className="bg-red-50/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-red-600">{highIntensityAreas}</div>
                    <div className="text-xs text-gray-500">High Risk</div>
                  </div>
                  <div className="bg-blue-50/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {averageValue}{selectedMetric === 'water-quality' ? '' : selectedMetric === 'collection-efficiency' ? '%' : ''}
                    </div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>
                  <div className="bg-green-50/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-600">92%</div>
                    <div className="text-xs text-gray-500">Coverage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Sidebar */}
          <div className="space-y-4">
            {/* Intensity Scale */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Scale</h3>
              </div>
              <div className="p-3">
                <div className="space-y-1.5">
                  {selectedMetric === 'water-quality' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                        <span className="text-xs text-gray-700">Excellent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-700">Good</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-gray-700">Fair</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                        <span className="text-xs text-gray-700">Poor</span>
                      </div>
                    </>
                  ) : selectedMetric === 'collection-efficiency' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                        <span className="text-xs text-gray-700">Excellent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-700">Good</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-gray-700">Fair</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                        <span className="text-xs text-gray-700">Poor</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                        <span className="text-xs text-gray-700">Very High</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                        <span className="text-xs text-gray-700">High</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-gray-700">Medium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-700">Low</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Area List with Pagination */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">Areas</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{startIndex + 1}-{Math.min(endIndex, currentData.areas.length)}</span>
                    <span>of</span>
                    <span>{currentData.areas.length}</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="space-y-2">
                  {currentAreas.map((area, index) => (
                    <div 
                      key={startIndex + index} 
                      className="group border border-gray-200 rounded-lg p-2.5 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200"
                      onClick={() => handleAreaClick(area)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-gray-900 group-hover:text-blue-900">{area.name}</span>
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-2 h-2 rounded-full shadow-sm" 
                            style={{ backgroundColor: area.color }}
                          ></div>
                          <MapPin className="h-2.5 w-2.5 text-gray-400 group-hover:text-blue-500" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {selectedMetric === 'water-quality' ? 'Quality' : 
                           selectedMetric === 'collection-efficiency' ? 'Efficiency' : 'Items'}
                        </span>
                        <span className="text-xs font-bold text-gray-900 group-hover:text-blue-900">
                          {selectedMetric === 'water-quality' ? area.value.toFixed(1) : 
                           selectedMetric === 'collection-efficiency' ? `${area.value}%` : 
                           `${area.value}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={prevPage}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-6 h-6 text-xs rounded-lg transition-all duration-200 ${
                            i === currentPage
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={nextPage}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === totalPages - 1}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Popup Modal */}
      {showLocationPopup && selectedArea && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-xs w-full max-h-[70vh] overflow-hidden border border-gray-200/50">
            {/* Fixed Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full shadow-sm" 
                    style={{ backgroundColor: selectedArea.color }}
                  ></div>
                  <h3 className="font-semibold text-gray-900 text-sm">{selectedArea.name}</h3>
                </div>
                <button 
                  onClick={() => setShowLocationPopup(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center">
                  <div className="text-base font-bold text-gray-900">
                    {selectedMetric === 'water-quality' ? selectedArea.value.toFixed(1) : 
                     selectedMetric === 'collection-efficiency' ? `${selectedArea.value}%` : 
                     `${selectedArea.value}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {selectedMetric === 'water-quality' ? 'Quality Index' : 
                     selectedMetric === 'collection-efficiency' ? 'Efficiency' : 'Items'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center">
                  <div className="text-base font-bold capitalize" style={{ color: selectedArea.color }}>
                    {selectedArea.intensity.replace('-', ' ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Intensity</div>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-gray-700">Location</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                  <div className="text-xs text-gray-600 mb-1">Center Coordinates</div>
                  <div className="font-mono text-xs text-gray-900 leading-relaxed">
                    {(selectedArea.coordinates.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / selectedArea.coordinates.length).toFixed(4)}, {(selectedArea.coordinates.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / selectedArea.coordinates.length).toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedArea.coordinates.length} polygon points
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Map className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-medium text-gray-700">Address</span>
                  </div>
                  {!loadingGeocode && (
                    <button 
                      onClick={() => getReverseGeocode(
                        selectedArea.coordinates.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / selectedArea.coordinates.length,
                        selectedArea.coordinates.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / selectedArea.coordinates.length
                      )}
                      className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                    >
                      <RefreshCw className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
                  {loadingGeocode ? (
                    <div className="flex items-center gap-1.5">
                      <div className="animate-spin rounded-full h-2.5 w-2.5 border border-green-500 border-t-transparent"></div>
                      <span className="text-xs text-gray-600">Loading address...</span>
                    </div>
                  ) : reverseGeocode ? (
                    reverseGeocode.error ? (
                      <div className="space-y-1">
                        <div className="text-xs text-orange-600 font-medium">
                          {reverseGeocode.fallback ? 'Address lookup unavailable' : 'Unable to fetch address'}
                        </div>
                        {reverseGeocode.coordinates && (
                          <div className="text-xs text-gray-600 font-mono">
                            Coordinates: {reverseGeocode.coordinates}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {reverseGeocode.address?.city && (
                          <div className="text-xs text-gray-900 font-medium">{reverseGeocode.address.city}</div>
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
                    <div className="text-xs text-gray-500">Click refresh to load address</div>
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
