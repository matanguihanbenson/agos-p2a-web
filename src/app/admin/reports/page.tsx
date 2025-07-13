'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  MapPin,
  BarChart3,
  TrendingUp,
  Play,
  Plus,
  X,
  Eye,
  PieChart,
  Droplets,
  Bot,
  Gauge,
  Target
} from 'lucide-react';

type ReportType = {
  id: string;
  name: string;
  category: 'environmental' | 'operational' | 'analysis';
};

export default function AdminReports() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('trash-distribution');
  const [timeline, setTimeline] = useState('month');
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['pasig']);
  const [comparisonMode, setComparisonMode] = useState<string>('none');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');

  const reportTypes: ReportType[] = [
    { id: 'trash-distribution', name: 'Trash Type Distribution by Area', category: 'environmental' },
    { id: 'volume-trends', name: 'Monthly/Quarterly Volume Trends', category: 'environmental' },
    { id: 'hotspot-mapping', name: 'Hotspot Mapping & Dump Sites', category: 'analysis' },
    { id: 'water-quality', name: 'Water Quality Report', category: 'environmental' },
    { id: 'bot-performance', name: 'Bot Performance Summary', category: 'operational' }
  ];

  const areas = [
    { id: 'pasig', name: 'Pasig River' },
    { id: 'marikina', name: 'Marikina River' },
    { id: 'taguig', name: 'Taguig Area' },
    { id: 'calapan', name: 'Calapan River' }
  ];

  // Dynamic configuration based on report type
  const getReportConfig = () => {
    const config = {
      allowedTimelines: ['day', 'week', 'month', 'quarter', 'year', 'custom'],
      allowedComparisons: ['none', 'areas', 'timelines', 'bots'],
      requiresAreas: true,
      defaultTimeline: 'month'
    };

    switch (selectedReportType) {
      case 'trash-distribution':
        return {
          ...config,
          allowedTimelines: ['week', 'month', 'quarter', 'year', 'custom'],
          allowedComparisons: ['none', 'areas', 'timelines'],
          defaultTimeline: 'month'
        };
      case 'volume-trends':
        return {
          ...config,
          allowedTimelines: ['month', 'quarter', 'year', 'custom'],
          allowedComparisons: ['none', 'areas', 'timelines'],
          defaultTimeline: 'quarter'
        };
      case 'hotspot-mapping':
        return {
          ...config,
          allowedTimelines: ['week', 'month', 'quarter', 'custom'],
          allowedComparisons: ['none', 'areas', 'timelines'],
          defaultTimeline: 'month'
        };
      case 'water-quality':
        return {
          ...config,
          allowedTimelines: ['day', 'week', 'month', 'custom'],
          allowedComparisons: ['none', 'areas', 'timelines'],
          defaultTimeline: 'day'
        };
      case 'bot-performance':
        return {
          ...config,
          allowedTimelines: ['day', 'week', 'month', 'quarter', 'custom'],
          allowedComparisons: ['none', 'bots', 'timelines'],
          requiresAreas: false,
          defaultTimeline: 'week'
        };
      default:
        return config;
    }
  };

  const reportConfig = getReportConfig();

  // Reset parameters when report type changes
  const handleReportTypeChange = (newType: string) => {
    setSelectedReportType(newType);
    const newConfig = getReportConfig();

    // Reset timeline if current one is not allowed
    if (!newConfig.allowedTimelines.includes(timeline)) {
      setTimeline(newConfig.defaultTimeline);
    }

    // Reset comparison mode if current one is not allowed
    if (!newConfig.allowedComparisons.includes(comparisonMode)) {
      setComparisonMode('none');
    }
  };

  const selectedReportData = reportTypes.find(r => r.id === selectedReportType);

  const handleGenerateReport = () => {
    // TODO: Generate new report with selected parameters
    setShowGenerateModal(false);
    console.log('Generating:', { selectedReportType, timeline, selectedAreas });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">Environmental monitoring and system performance insights</p>
            </div>

            <button
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report 1: Trash Distribution */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <PieChart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Detected Trash Distribution - Pasig River</h3>
                    <p className="text-sm text-gray-600">January 2024 • Autonomous detection data</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Mock Pie Chart */}
              <div className="relative h-48 mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-blue-500 border-r-green-500 border-b-yellow-500 border-l-purple-500"></div>
                </div>
              </div>
              <div className="space-y-3">
                {['Plastic Bottles', 'Food Containers', 'Plastic Bags', 'Metal Cans'].map((type, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][i]}`}></div>
                      <span className="font-medium text-gray-900">{type}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{['542', '298', '186', '142'][i]}</span>
                      <span className="text-gray-500 text-sm ml-1">({['43.5%', '23.9%', '14.9%', '11.4%'][i]})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report 2: Volume Trends */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Bot Collection Volume Trends</h3>
                    <p className="text-sm text-gray-600">Q4 2023 - Q1 2024 • Automated collection data</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Mock Line Chart */}
              <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-around p-4 mb-6">
                {[60, 75, 45, 80, 65, 90].map((height, i) => (
                  <div key={i} className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t shadow-sm" style={{ height: `${height}%`, width: '20px' }}></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">Total Collected</p>
                  <p className="text-xl font-bold text-green-900">1,247 kg</p>
                  <p className="text-xs text-green-600">+15% vs last period</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Peak Month</p>
                  <p className="text-xl font-bold text-blue-900">January</p>
                  <p className="text-xs text-blue-600">327 kg by bots</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-700 font-medium">Collection Rate</p>
                  <p className="text-xl font-bold text-orange-900">92.3%</p>
                  <p className="text-xs text-orange-600">Bot efficiency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report 3: Water Quality */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-cyan-100 p-2 rounded-lg">
                    <Droplets className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Water Quality Report</h3>
                    <p className="text-sm text-gray-600">Real-time monitoring • All zones</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/*
                  Mock data for water quality indicators
                */}
                {['pH Levels', 'Dissolved O₂', 'Turbidity', 'Temperature'].map((label, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${i === 0 ? 'bg-green-50 border-green-200' :
                      i === 1 ? 'bg-blue-50 border-blue-200' :
                        i === 2 ? 'bg-yellow-50 border-yellow-200' :
                          'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${i === 0 ? 'text-green-700' :
                          i === 1 ? 'text-blue-700' :
                            i === 2 ? 'text-yellow-700' :
                              'text-red-700'
                        }`}>{label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${i === 0 ? 'bg-green-100 text-green-700' :
                          i === 1 ? 'bg-blue-100 text-blue-700' :
                            i === 2 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                        }`}>
                        {['Good', 'Excellent', 'Moderate', 'Critical'][i]}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${i === 0 ? 'text-green-900' :
                        i === 1 ? 'text-blue-900' :
                          i === 2 ? 'text-yellow-900' :
                            'text-red-900'
                      }`}>
                      {i === 0 ? '7.4' : i === 1 ? '8.5 mg/L' : i === 2 ? '12 NTU' : '26.8°C'}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Recommendation:</strong> Monitor turbidity levels in Zone 3. Consider increased filtration systems for optimal clarity.
                </p>
              </div>
            </div>
          </div>

          {/* Report 4: Bot Performance */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Bot className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Autonomous Bot Fleet Performance</h3>
                    <p className="text-sm text-gray-600">Last 7 days • Fleet operational metrics</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {['AGOS-001', 'AGOS-002', 'AGOS-003'].map((id, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${['bg-green-100', 'bg-yellow-100', 'bg-red-100'][i]
                        }`}>
                        <Bot className={`h-5 w-5 ${['text-green-600', 'text-yellow-600', 'text-red-600'][i]
                          }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{id}</p>
                        <p className="text-sm text-gray-600">{['Pasig River Zone A', 'Marikina River Zone B', 'Taguig River Zone C'][i]}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{['45.2 kg', '38.7 kg', '0 kg'][i]}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{['94%', '87%', '0%'][i]} operational</span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${['bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-700', 'bg-red-100 text-red-700'][i]
                          }`}>
                          {['Active', 'Active', 'Maintenance'][i]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    <strong>Fleet Efficiency:</strong> 94.5% autonomous operation vs 92% target
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Report 5: Improved Hotspot Mapping */}
          <div className="bg-white rounded-xl shadow-sm border lg:col-span-2">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pollution Hotspot Detection & Mapping</h3>
                    <p className="text-sm text-gray-600">AI-identified high-density areas • Last 30 days</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Mock Map */}
              <div className="h-48 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg flex items-center justify-center mb-6 border border-red-100">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-red-400 mx-auto mb-3" />
                  <p className="text-sm text-red-600 font-medium">AI-Powered Hotspot Detection Map</p>
                  <p className="text-xs text-red-500">Automated pollution density analysis</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-red-600" />
                    Top 5 Critical Pollution Zones
                  </h4>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">AI Detected</span>
                </div>

                {[
                  { 
                    name: 'Pasig Bridge Area', 
                    reason: 'High debris accumulation from water currents', 
                    density: 'Very High'
                  },
                  { 
                    name: 'Marikina Junction', 
                    reason: 'Convergence point of multiple water streams', 
                    density: 'High'
                  },
                  { 
                    name: 'Taguig Riverside', 
                    reason: 'Slow water flow causing debris settling', 
                    density: 'High'
                  },
                  { 
                    name: 'Calapan Bend', 
                    reason: 'Natural debris trap due to river curvature', 
                    density: 'Medium'
                  },
                  { 
                    name: 'Makati Confluence', 
                    reason: 'Multiple drainage outlets concentration', 
                    density: 'Medium'
                  }
                ].map((location, i) => (
                  <div key={i} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-semibold text-gray-900">{location.name}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            location.density === 'Very High' ? 'bg-red-100 text-red-700' :
                            location.density === 'High' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {location.density} Density
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{location.reason}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            location.density === 'Very High' ? 'bg-red-500' :
                            location.density === 'High' ? 'bg-orange-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <span className="text-xs text-gray-500">#{i + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-xl">
            {/* Compact Header */}
            <div className="bg-blue-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Generate Report</h3>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Configuration */}
                <div className="space-y-4">
                  {/* Report Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type
                    </label>
                    <select
                      value={selectedReportType}
                      onChange={(e) => handleReportTypeChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      {reportTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {selectedReportData && (
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${selectedReportData.category === 'environmental' ? 'bg-green-100 text-green-700' :
                          selectedReportData.category === 'operational' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                        }`}>
                        {selectedReportData.category}
                      </span>
                    )}
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {reportConfig.allowedTimelines.slice(0, 6).map(period => (
                        <button
                          key={period}
                          onClick={() => setTimeline(period)}
                          className={`px-2 py-2 text-xs rounded-lg border transition-all ${timeline === period
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {period === 'custom' ? 'Custom' : period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                      ))}
                    </div>

                    {timeline === 'custom' && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={customDateRange.start}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Start Date"
                        />
                        <input
                          type="date"
                          value={customDateRange.end}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="End Date"
                        />
                      </div>
                    )}
                  </div>

                  {/* Comparison Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comparison
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {reportConfig.allowedComparisons.map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setComparisonMode(mode)}
                          className={`px-2 py-2 text-xs rounded-lg border transition-all ${comparisonMode === mode
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {mode === 'none' ? 'None' :
                            mode === 'areas' ? 'Areas' :
                              mode === 'timelines' ? 'Periods' : 'Bots'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Areas Selection */}
                  {reportConfig.requiresAreas && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Areas ({selectedAreas.length} selected)
                      </label>
                      <div className="border border-gray-300 rounded-lg p-2 max-h-24 overflow-y-auto bg-gray-50">
                        <div className="grid grid-cols-2 gap-1">
                          {areas.map(area => (
                            <label key={area.id} className="flex items-center space-x-2 p-1 hover:bg-white rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedAreas.includes(area.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAreas(prev => [...prev, area.id]);
                                  } else {
                                    setSelectedAreas(prev => prev.filter(id => id !== area.id));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3 w-3"
                              />
                              <span className="text-xs text-gray-700">{area.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Export Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Export Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'pdf', label: 'PDF', icon: FileText },
                        { id: 'excel', label: 'Excel', icon: BarChart3 },
                        { id: 'csv', label: 'CSV', icon: Download }
                      ].map((format) => (
                        <label key={format.id} className="flex items-center justify-center space-x-1 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="format"
                            value={format.id}
                            checked={selectedFormat === format.id}
                            onChange={(e) => setSelectedFormat(e.target.value)}
                            className="text-blue-600 focus:ring-blue-500 h-3 w-3"
                          />
                          <format.icon className="h-3 w-3 text-gray-600" />
                          <span className="text-xs font-medium text-gray-900">{format.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center text-sm">
                    <Eye className="h-4 w-4 mr-2 text-blue-600" />
                    Preview
                  </h4>

                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-sm">{selectedReportData?.name}</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            {timeline === 'custom' ?
                              (customDateRange.start && customDateRange.end ?
                                `${customDateRange.start} to ${customDateRange.end}` :
                                'Custom period') :
                              `This ${timeline}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {comparisonMode !== 'none' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                        <p className="text-xs font-medium text-green-800 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {comparisonMode === 'areas' ? `Comparing ${selectedAreas.length} areas` :
                            comparisonMode === 'timelines' ? 'Period comparison' :
                              'Bot comparison'}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-gray-600">
                      <p className="font-medium mb-1">Includes:</p>
                      <ul className="space-y-0.5 text-xs">
                        <li>• Data visualizations</li>
                        <li>• Key insights</li>
                        <li>• Trend analysis</li>
                        <li>• Recommendations</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-blue-800">
                        <strong>Format:</strong> {selectedFormat.toUpperCase()} document
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Footer with Generate Button */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-600">
                Report will be generated and downloaded
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={reportConfig.requiresAreas && selectedAreas.length === 0}
                  className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center ${(reportConfig.requiresAreas && selectedAreas.length === 0)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
                 