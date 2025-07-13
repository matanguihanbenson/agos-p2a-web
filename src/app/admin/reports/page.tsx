'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp,
  PieChart,
  BarChart3,
  Map,
  RefreshCw
} from 'lucide-react';

export default function AdminReports() {
  const [selectedDateRange, setSelectedDateRange] = useState('7days');
  const [selectedReportType, setSelectedReportType] = useState('overview');

  const exportReport = (format: string) => {
    // TODO: Implement report export functionality
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive environmental and operational insights</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <div className="relative">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select 
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="overview">System Overview</option>
                <option value="environmental">Environmental Impact</option>
                <option value="operational">Operational Performance</option>
                <option value="maintenance">Maintenance Reports</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select 
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 3 Months</option>
                <option value="1year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Locations</option>
                <option value="pasig">Pasig River</option>
                <option value="marikina">Marikina River</option>
                <option value="taguig">Taguig Area</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bot Filter</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Bots</option>
                <option value="active">Active Only</option>
                <option value="maintenance">In Maintenance</option>
                <option value="specific">Specific Bot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trash Collected</p>
                <p className="text-3xl font-bold text-gray-900">1,247 kg</p>
                <p className="text-sm text-green-600">+15% vs last period</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Water Quality</p>
                <p className="text-3xl font-bold text-gray-900">8.2/10</p>
                <p className="text-sm text-blue-600">+0.3 improvement</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operation Efficiency</p>
                <p className="text-3xl font-bold text-gray-900">94.5%</p>
                <p className="text-sm text-green-600">+2.1% vs target</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage Area</p>
                <p className="text-3xl font-bold text-gray-900">45.2 km²</p>
                <p className="text-sm text-cyan-600">12 active zones</p>
              </div>
              <div className="bg-cyan-100 p-3 rounded-lg">
                <Map className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Environmental Impact Report */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Environmental Impact Analysis</h3>
                  <button 
                    onClick={() => exportReport('environmental')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Trash Collection Breakdown */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Trash Collection Breakdown</h4>
                    <div className="space-y-3">
                      {[
                        { type: 'Plastic Bottles', amount: 542, percentage: 43.5, color: 'bg-blue-500' },
                        { type: 'Food Containers', amount: 298, percentage: 23.9, color: 'bg-green-500' },
                        { type: 'Plastic Bags', amount: 186, percentage: 14.9, color: 'bg-yellow-500' },
                        { type: 'Metal Cans', amount: 142, percentage: 11.4, color: 'bg-purple-500' },
                        { type: 'Other Debris', amount: 79, percentage: 6.3, color: 'bg-gray-500' },
                      ].map((item) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="text-sm text-gray-900">{item.type}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">{item.amount} items</span>
                            <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Water Quality Trends */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Water Quality Trends</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">pH Levels</p>
                          <p className="text-lg font-semibold text-gray-900">7.2 - 7.6</p>
                          <p className="text-xs text-green-600">Within optimal range</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Dissolved Oxygen</p>
                          <p className="text-lg font-semibold text-gray-900">8.5 mg/L</p>
                          <p className="text-xs text-green-600">Excellent quality</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Turbidity</p>
                          <p className="text-lg font-semibold text-gray-900">12 NTU</p>
                          <p className="text-xs text-yellow-600">Moderate clarity</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temperature</p>
                          <p className="text-lg font-semibold text-gray-900">26.8°C</p>
                          <p className="text-xs text-green-600">Normal range</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Export Options */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Export Reports</h3>
              </div>
              <div className="p-6 space-y-3">
                <button 
                  onClick={() => exportReport('pdf')}
                  className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-red-600" />
                    <span className="text-red-900 font-medium">PDF Report</span>
                  </div>
                </button>
                <button 
                  onClick={() => exportReport('excel')}
                  className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="text-green-900 font-medium">Excel Spreadsheet</span>
                  </div>
                </button>
                <button 
                  onClick={() => exportReport('csv')}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-900 font-medium">CSV Data</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { name: 'Weekly Environmental Summary', date: '2024-01-15', size: '2.3 MB' },
                    { name: 'Monthly Operations Report', date: '2024-01-01', size: '5.7 MB' },
                    { name: 'Water Quality Analysis', date: '2023-12-28', size: '1.8 MB' },
                    { name: 'Maintenance Schedule', date: '2023-12-20', size: '890 KB' },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.name}</p>
                        <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  
                