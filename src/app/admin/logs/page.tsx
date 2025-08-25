'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Bot,
  Settings,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug' | 'success';
  category: 'system' | 'bot' | 'user' | 'auth' | 'api' | 'database';
  message: string;
  details?: string;
  userId?: string;
  userName?: string;
  botId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock log data - replace with actual API call
  const generateMockLogs = (): LogEntry[] => {
    const levels: LogEntry['level'][] = ['info', 'warn', 'error', 'debug', 'success'];
    const categories: LogEntry['category'][] = ['system', 'bot', 'user', 'auth', 'api', 'database'];
    
    const messages = {
      system: [
        'System startup completed successfully',
        'Background cleanup job started',
        'Configuration updated',
        'System health check passed',
        'Memory usage optimization completed'
      ],
      bot: [
        'Bot AGOS-001 deployed to Calapan River',
        'Bot AGOS-002 collected 45.2kg of trash',
        'Bot AGOS-003 returned to charging station',
        'Bot AGOS-001 detected pollution hotspot',
        'Bot fleet status synchronization completed'
      ],
      user: [
        'Field operator Maria Santos logged in',
        'Admin updated bot assignment',
        'User profile updated successfully',
        'Password reset requested',
        'New operator account created'
      ],
      auth: [
        'User authentication successful',
        'Failed login attempt detected',
        'Session expired for user',
        'API key rotation completed',
        'Two-factor authentication enabled'
      ],
      api: [
        'Weather data API call successful',
        'Geocoding service request completed',
        'External API rate limit reached',
        'Database connection established',
        'Real-time data sync completed'
      ],
      database: [
        'Database backup completed',
        'Index optimization finished',
        'Data migration successful',
        'Connection pool optimized',
        'Query performance improved'
      ]
    };

    return Array.from({ length: 100 }, (_, index) => {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      return {
        id: `log-${index + 1}`,
        timestamp,
        level,
        category,
        message: messages[category][Math.floor(Math.random() * messages[category].length)],
        details: Math.random() > 0.7 ? 'Additional context and detailed information about this log entry...' : undefined,
        userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 10)}` : undefined,
        userName: Math.random() > 0.5 ? ['Maria Santos', 'Juan Dela Cruz', 'Ana Reyes', 'Admin User'][Math.floor(Math.random() * 4)] : undefined,
        botId: category === 'bot' ? `AGOS-00${Math.floor(Math.random() * 3) + 1}` : undefined,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: Math.random() > 0.5 ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124' : undefined,
        metadata: Math.random() > 0.8 ? { action: 'update', resource: 'bot_assignment' } : undefined
      };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  // Initialize logs
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockLogs = generateMockLogs();
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const newLogs = generateMockLogs();
      setLogs(newLogs);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter logs based on search term, level, category, and time range
  useEffect(() => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.botId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // Time range filter
    const now = new Date();
    if (selectedTimeRange !== 'all') {
      const timeRanges = {
        'today': 24 * 60 * 60 * 1000,
        'week': 7 * 24 * 60 * 60 * 1000,
        'month': 30 * 24 * 60 * 60 * 1000
      };
      
      const range = timeRanges[selectedTimeRange as keyof typeof timeRanges];
      if (range) {
        filtered = filtered.filter(log => 
          now.getTime() - log.timestamp.getTime() <= range
        );
      }
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedLevel, selectedCategory, selectedTimeRange]);

  const getLevelIcon = (level: LogEntry['level']) => {
    const icons = {
      info: <Info className="h-4 w-4" />,
      warn: <AlertCircle className="h-4 w-4" />,
      error: <XCircle className="h-4 w-4" />,
      debug: <Settings className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />
    };
    return icons[level];
  };

  const getLevelColor = (level: LogEntry['level']) => {
    const colors = {
      info: 'text-blue-600 bg-blue-50 border-blue-200',
      warn: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      error: 'text-red-600 bg-red-50 border-red-200',
      debug: 'text-gray-600 bg-gray-50 border-gray-200',
      success: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[level];
  };

  const getCategoryIcon = (category: LogEntry['category']) => {
    const icons = {
      system: <Settings className="h-4 w-4" />,
      bot: <Bot className="h-4 w-4" />,
      user: <User className="h-4 w-4" />,
      auth: <Settings className="h-4 w-4" />,
      api: <FileText className="h-4 w-4" />,
      database: <FileText className="h-4 w-4" />
    };
    return icons[category];
  };

  const handleExport = () => {
    const csvContent = [
      'Timestamp,Level,Category,Message,User,Bot ID,IP Address',
      ...filteredLogs.map(log => 
        `"${log.timestamp.toISOString()}","${log.level}","${log.category}","${log.message}","${log.userName || ''}","${log.botId || ''}","${log.ipAddress || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agos-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const refreshLogs = () => {
    setLoading(true);
    setTimeout(() => {
      const newLogs = generateMockLogs();
      setLogs(newLogs);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Compact Header matching Reports */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">System Logs</h1>
              <p className="text-slate-600 text-sm">Monitor system activities and events in real-time</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  autoRefresh 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg' 
                    : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700 shadow-md hover:shadow-lg'
                }`}
              >
                <Clock className="h-3 w-3 mr-1.5" />
                {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
              </button>
              <button
                onClick={refreshLogs}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Download className="h-3 w-3 mr-1.5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Filters */}
        <div className="bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50 p-4 mb-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="debug">Debug</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="system">System</option>
                <option value="bot">Bot</option>
                <option value="user">User</option>
                <option value="auth">Auth</option>
                <option value="api">API</option>
                <option value="database">Database</option>
              </select>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Time Range</label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>

          {/* Compact Summary Stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="text-center p-2 bg-gradient-to-br from-slate-50/50 to-slate-100/50 rounded-lg">
              <div className="text-base font-bold text-slate-900">{filteredLogs.length}</div>
              <div className="text-xs text-slate-500">Total Logs</div>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-red-50/50 to-red-100/50 rounded-lg">
              <div className="text-base font-bold text-red-600">
                {filteredLogs.filter(log => log.level === 'error').length}
              </div>
              <div className="text-xs text-slate-500">Errors</div>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-yellow-50/50 to-yellow-100/50 rounded-lg">
              <div className="text-base font-bold text-yellow-600">
                {filteredLogs.filter(log => log.level === 'warn').length}
              </div>
              <div className="text-xs text-slate-500">Warnings</div>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-blue-50/50 to-blue-100/50 rounded-lg">
              <div className="text-base font-bold text-blue-600">
                {filteredLogs.filter(log => log.level === 'info').length}
              </div>
              <div className="text-xs text-slate-500">Info</div>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-green-50/50 to-green-100/50 rounded-lg">
              <div className="text-base font-bold text-green-600">
                {filteredLogs.filter(log => log.level === 'success').length}
              </div>
              <div className="text-xs text-slate-500">Success</div>
            </div>
          </div>
        </div>

        {/* Compact Logs Table */}
        <div className="bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50 overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                System Logs
              </h3>
              {autoRefresh && (
                <div className="flex items-center text-green-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs font-medium">Live</span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User/Bot
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-600 mr-2" />
                        <span className="text-slate-500 text-sm">Loading logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500 text-sm">
                      No logs found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-900">
                          {log.timestamp.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(log.level)}`}>
                            {getLevelIcon(log.level)}
                            <span className="ml-1 capitalize">{log.level}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {getCategoryIcon(log.category)}
                            <span className="ml-2 text-xs text-slate-900 capitalize">{log.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-900">
                          <div className="max-w-md truncate">{log.message}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                          {log.userName && (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {log.userName}
                            </div>
                          )}
                          {log.botId && (
                            <div className="flex items-center">
                              <Bot className="h-3 w-3 mr-1" />
                              {log.botId}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                          <button
                            onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                            className="text-blue-600 hover:text-blue-700 flex items-center"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {expandedLog === log.id ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedLog === log.id && (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 bg-slate-50">
                            <div className="text-xs">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <h4 className="font-medium text-slate-900 mb-2">Details</h4>
                                  <p className="text-slate-700">{log.details || 'No additional details available'}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900 mb-2">Metadata</h4>
                                  <div className="space-y-1 text-slate-600">
                                    {log.ipAddress && <div><strong>IP:</strong> {log.ipAddress}</div>}
                                    {log.userAgent && <div><strong>User Agent:</strong> {log.userAgent}</div>}
                                    {log.metadata && (
                                      <div><strong>Metadata:</strong> {JSON.stringify(log.metadata)}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
