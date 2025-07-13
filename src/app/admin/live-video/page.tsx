'use client';

import React, { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  RotateCw,
  Camera,
  Circle,
  Download,
  Settings,
  Wifi,
  Battery,
  MapPin,
  Clock,
  Pause,
  Play,
  SkipBack,
  SkipForward
} from 'lucide-react';

export default function LiveVideoViewer() {
  const [selectedBot, setSelectedBot] = useState('AGOS-001');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const bots = [
    {
      id: 'AGOS-001',
      name: 'River Cleaner Alpha',
      status: 'Online',
      location: 'Pasig River - Zone A',
      battery: 87,
      signal: 'Strong',
      operator: 'Maria Santos',
      streamQuality: 'HD 1080p',
      lastUpdate: 'Live'
    },
    {
      id: 'AGOS-002',
      name: 'Aqua Guardian Beta',
      status: 'Online',
      location: 'Pasig River - Zone A',
      battery: 92,
      signal: 'Strong',
      operator: 'Maria Santos',
      streamQuality: 'HD 1080p',
      lastUpdate: 'Live'
    },
    {
      id: 'AGOS-003',
      name: 'Water Sentinel Gamma',
      status: 'Offline',
      location: 'Charging Station 1',
      battery: 45,
      signal: 'Good',
      operator: 'Juan dela Cruz',
      streamQuality: 'N/A',
      lastUpdate: '2 hours ago'
    },
    {
      id: 'AGOS-004',
      name: 'Eco Defender Delta',
      status: 'Maintenance',
      location: 'Workshop',
      battery: 23,
      signal: 'Offline',
      operator: 'Ana Reyes',
      streamQuality: 'N/A',
      lastUpdate: '1 day ago'
    }
  ];

  const currentBot = bots.find(bot => bot.id === selectedBot);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'maintenance': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Video Viewer</h1>
              <p className="text-gray-600 mt-1">Monitor onboard cameras from AGOS bots in real-time</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRecording 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <Circle className="h-4 w-4 mr-2" />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export Stream
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusDot(currentBot?.status || 'offline')} animate-pulse`}></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{currentBot?.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{currentBot?.id}</span>
                        <span>•</span>
                        <span>{currentBot?.location}</span>
                        <span>•</span>
                        <span className={getStatusColor(currentBot?.status || 'offline')}>
                          {currentBot?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isRecording && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">REC</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-600">{currentBot?.streamQuality}</span>
                  </div>
                </div>
              </div>
              
              {/* Video Player */}
              <div className="relative bg-black aspect-video">
                {currentBot?.status === 'Online' ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Live video placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
                      {/* Simulated water movement */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
                      </div>
                      
                      {/* Simulated trash detection overlay */}
                      <div className="absolute top-20 left-20 w-16 h-16 border-2 border-red-500 rounded-lg">
                        <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Plastic Bottle
                        </div>
                      </div>
                      
                      <div className="absolute bottom-32 right-24 w-12 h-12 border-2 border-yellow-500 rounded-lg">
                        <div className="absolute -top-6 right-0 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Food Container
                        </div>
                      </div>
                      
                      {/* Timestamp overlay */}
                      <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded">
                        LIVE • {new Date().toLocaleTimeString()}
                      </div>
                      
                      {/* Bot info overlay */}
                      <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-3 py-2 rounded">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Battery className="h-4 w-4" />
                            <span>{currentBot.battery}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Wifi className="h-4 w-4" />
                            <span>{currentBot.signal}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>GPS Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <VideoOff className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-medium">Camera Offline</p>
                      <p className="text-sm">Bot is currently {currentBot?.status.toLowerCase()}</p>
                    </div>
                  </div>
                )}
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
                        <SkipBack className="h-5 w-5" />
                      </button>
                      <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
                        <SkipForward className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                      <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
                        <Camera className="h-5 w-5" />
                      </button>
                      <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
                        <RotateCw className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                      >
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stream Info */}
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Operator:</span>
                    <span className="ml-2 font-medium text-gray-900">{currentBot?.operator}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quality:</span>
                    <span className="ml-2 font-medium text-gray-900">{currentBot?.streamQuality}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Update:</span>
                    <span className="ml-2 font-medium text-gray-900">{currentBot?.lastUpdate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Stream Duration:</span>
                    <span className="ml-2 font-medium text-gray-900">02:34:17</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detection Statistics */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Detection Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-gray-600">Items Detected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-sm text-gray-600">Successfully Collected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">6</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">75%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bot Selection */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Available Cameras</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {bots.map((bot) => (
                    <button
                      key={bot.id}
                      onClick={() => setSelectedBot(bot.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedBot === bot.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusDot(bot.status)}`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{bot.id}</p>
                            <p className="text-xs text-gray-600">{bot.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${getStatusColor(bot.status)}`}>
                            {bot.status}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Battery className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{bot.battery}%</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stream Settings */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Stream Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Quality</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="1080p">HD 1080p</option>
                    <option value="720p">HD 720p</option>
                    <option value="480p">SD 480p</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frame Rate</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="30">30 FPS</option>
                    <option value="60">60 FPS</option>
                    <option value="15">15 FPS</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Detection Overlay</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Show trash detection boxes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Show bot telemetry</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Show water quality data</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Recordings */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Recordings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { name: 'AGOS-001_2024-01-15_14-30', duration: '1:45:23', size: '2.3 GB' },
                    { name: 'AGOS-002_2024-01-15_12-15', duration: '2:12:45', size: '3.1 GB' },
                    { name: 'AGOS-001_2024-01-14_16-45', duration: '0:58:12', size: '1.2 GB' },
                  ].map((recording, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{recording.name}</p>
                        <p className="text-xs text-gray-600">{recording.duration} • {recording.size}</p>
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
