'use client';

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { 
  VideoOff, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  RotateCw,
  Camera,
  Circle,
  Download,
  Wifi,
  Battery,
  MapPin,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBots } from '@/hooks/useBots';

export default function LiveVideoViewer() {
  const [selectedBot, setSelectedBot] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [hlsError, setHlsError] = useState<string | null>(null);
  const [hlsLoaded, setHlsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { user, loading: authLoading } = useAuth();
  const { bots, loading: botsLoading, error } = useBots(user?.uid || null);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set first bot as selected when bots are loaded
  useEffect(() => {
    if (bots.length > 0 && !selectedBot) {
      setSelectedBot(bots[0].id);
    }
  }, [bots, selectedBot]);

  const currentBot = bots.find(bot => bot.id === selectedBot);

  const getStatusColor = (status: string) => {
    if (!status) return 'text-gray-600';
    switch (status.toLowerCase()) {
      case 'active':
      case 'idle': return 'text-green-600';
      case 'offline':
      case 'returning': return 'text-red-600';
      case 'maintenance': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDot = (status: string) => {
    if (!status) return 'bg-gray-500';
    switch (status.toLowerCase()) {
      case 'active':
      case 'idle': return 'bg-green-500';
      case 'offline':
      case 'returning': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const isOnline = (bot: any) => {
    return bot?.stream_url && bot?.stream_url.trim() !== '';
  };

  // Load HLS.js dynamically
  useEffect(() => {
    const loadHlsJs = async () => {
      if (typeof window !== 'undefined') {
        // Check if HLS.js is already loaded
        if ('Hls' in window) {
          setHlsLoaded(true);
          return;
        }

        try {
          // Dynamically import HLS.js
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
          script.onload = () => {
            console.log('HLS.js loaded successfully');
            setHlsLoaded(true);
          };
          script.onerror = () => {
            console.error('Failed to load HLS.js');
            setHlsError('Failed to load HLS.js library');
          };
          document.head.appendChild(script);
        } catch (error) {
          console.error('Error loading HLS.js:', error);
          setHlsError('Error loading HLS.js library');
        }
      }
    };

    loadHlsJs();
  }, []);

  // Handle HLS stream loading
  useEffect(() => {
    if (!currentBot?.stream_url || !videoRef.current || !hlsLoaded) return;

    const video = videoRef.current;
    const streamUrl = currentBot.stream_url;
    
    // Reset errors
    setVideoError(null);
    setHlsError(null);

    console.log('Loading stream:', streamUrl);

    // Check if HLS.js is available and supported
    if (typeof window !== 'undefined' && 'Hls' in window) {
      const Hls = (window as any).Hls;
      if (Hls.isSupported()) {
        console.log('Using HLS.js for playback');
        const hls = new Hls({
          enableWorker: false,
          xhrSetup: function (xhr: XMLHttpRequest, url: string) {
            // Add CORS headers for ngrok and general CORS handling
            xhr.setRequestHeader('ngrok-skip-browser-warning', 'true');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Access-Control-Allow-Headers', 'Range');
          },
          // Add retry configuration
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 3,
          manifestLoadingRetryDelay: 1000,
          levelLoadingTimeOut: 10000,
          levelLoadingMaxRetry: 3,
          levelLoadingRetryDelay: 1000,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 3,
          fragLoadingRetryDelay: 1000,
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed successfully');
          if (isPlaying) {
            video.play().catch((error) => {
              console.error('Video play error:', error);
              setVideoError(`Playback error: ${error.message}`);
            });
          }
        });

        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          console.error('HLS error:', data);
          
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Fatal network error encountered');
                setHlsError(`Network Error: ${data.details} - Check if the stream URL is accessible`);
                // Try to recover
                setTimeout(() => {
                  console.log('Attempting to recover from network error...');
                  hls.startLoad();
                }, 2000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Fatal media error, trying to recover...');
                setHlsError(`Media Error: ${data.details}`);
                hls.recoverMediaError();
                break;
              default:
                console.log('Fatal error, cannot recover');
                setHlsError(`Fatal Error: ${data.type} - ${data.details}`);
                hls.destroy();
                break;
            }
          } else {
            // Non-fatal error
            setHlsError(`Warning: ${data.type} - ${data.details}`);
          }
        });

        hls.on(Hls.Events.FRAG_LOADED, () => {
          console.log('Fragment loaded successfully');
          // Clear any previous errors if fragments are loading
          if (hlsError && !hlsError.includes('Fatal')) {
            setHlsError(null);
          }
        });
        
        return () => {
          hls.destroy();
        };
      } else {
        console.log('HLS.js not supported, trying native HLS');
        setHlsError('HLS.js not supported in this browser');
      }
    }
    
    // Fallback: Try direct iframe embed for ngrok streams
    console.log('Trying iframe fallback for ngrok stream');
    
  }, [currentBot?.stream_url, isPlaying, hlsLoaded]);

  // Control video playback
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Control video mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Test stream accessibility
  const testStreamUrl = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      console.log('Stream URL test:', response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error('Stream URL test failed:', error);
      return false;
    }
  };

  // Test stream when bot changes
  useEffect(() => {
    if (currentBot?.stream_url) {
      testStreamUrl(currentBot.stream_url);
    }
  }, [currentBot?.stream_url]);

  // Show loading state until mounted
  if (!mounted || authLoading || botsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your bots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading bots</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <VideoOff className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No bots available</p>
          <p className="text-gray-500 text-sm">Contact support to get your bots assigned</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Live Video Viewer</h1>
                <p className="text-gray-600 text-sm">Monitor onboard cameras from AGOS bots in real-time</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isRecording 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  <Circle className="h-3 w-3 mr-1" />
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                  <Download className="h-3 w-3 mr-1" />
                  Export Stream
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Video Player */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusDot(currentBot?.realtimeData?.status || currentBot?.status || 'offline')} animate-pulse`}></div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{currentBot?.name}</h3>
                        <div className="flex items-center space-x-3 text-xs text-gray-600">
                          <span>{currentBot?.id}</span>
                          <span>•</span>
                          <span>{currentBot?.location}</span>
                          <span>•</span>
                          <span className={getStatusColor(currentBot?.realtimeData?.status || currentBot?.status || 'offline')}>
                            {currentBot?.realtimeData?.status || currentBot?.status || 'offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isRecording && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium">REC</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-600">{currentBot?.streamQuality}</span>
                    </div>
                  </div>
                </div>
                
                {/* Video Player */}
                <div className="relative bg-black aspect-video">
                  {isOnline(currentBot) ? (
                    <div className="absolute inset-0">
                      {/* Try video element first */}
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        controls={false}
                        autoPlay
                        muted={isMuted}
                        playsInline
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Video element error:', e);
                          const target = e.target as HTMLVideoElement;
                          setVideoError(`Video error: ${target.error?.message || 'Unknown error'}`);
                        }}
                        onLoadStart={() => {
                          console.log('Video load started');
                        }}
                        onLoadedMetadata={() => {
                          console.log('Video metadata loaded');
                        }}
                        onCanPlay={() => {
                          console.log('Video can play');
                        }}
                        onPlay={() => {
                          console.log('Video started playing');
                          setVideoError(null);
                        }}
                      />
                      
                      {/* Fallback iframe for ngrok streams */}
                      {(videoError || hlsError) && currentBot?.stream_url?.includes('ngrok') && (
                        <div className="absolute inset-0 bg-black">
                          <iframe
                            src={currentBot.stream_url}
                            className="w-full h-full border-0"
                            allow="autoplay; fullscreen"
                            title="Live Stream"
                          />
                        </div>
                      )}
                      
                      {/* Error overlay - only show if both video and iframe fail */}
                      {(videoError || hlsError) && !currentBot?.stream_url?.includes('ngrok') && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                          <div className="text-center text-white p-4 max-w-md">
                            <VideoOff className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm font-medium mb-2">Stream Error</p>
                            <p className="text-xs opacity-80 mb-3">{videoError || hlsError}</p>
                            <div className="space-y-2">
                              <button 
                                onClick={() => {
                                  setVideoError(null);
                                  setHlsError(null);
                                  // Force reload
                                  if (videoRef.current) {
                                    videoRef.current.load();
                                  }
                                }}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 mr-2"
                              >
                                Retry
                              </button>
                              <button 
                                onClick={() => {
                                  // Try opening stream in new tab
                                  window.open(currentBot?.stream_url, '_blank');
                                }}
                                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                              >
                                Open in New Tab
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Timestamp overlay */}
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        LIVE • {currentTime}
                      </div>
                      
                      {/* Bot info overlay */}
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Battery className="h-3 w-3" />
                            <span>{currentBot?.battery}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Wifi className="h-3 w-3" />
                            <span>{currentBot?.signal}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>GPS Active</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Stream URL display for debugging */}
                      <div className="absolute bottom-10 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded max-w-md">
                        <div>Stream: {currentBot?.stream_url}</div>
                        <div>HLS.js Loaded: {hlsLoaded ? 'Yes' : 'No'}</div>
                        <div>HLS.js Available: {typeof window !== 'undefined' && 'Hls' in window ? 'Yes' : 'No'}</div>
                        <div>HLS.js Supported: {typeof window !== 'undefined' && 'Hls' in window && (window as any).Hls?.isSupported() ? 'Yes' : 'No'}</div>
                        <div>Native HLS: {videoRef.current?.canPlayType('application/vnd.apple.mpegurl') || 'No'}</div>
                        
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <VideoOff className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm font-medium">Camera Offline</p>
                        <p className="text-xs">
                          {currentBot?.stream_url 
                            ? 'Stream URL available but video not loading' 
                            : 'No stream URL available'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white transition-colors">
                          <SkipBack className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white transition-colors">
                          <SkipForward className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                        <button className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white transition-colors">
                          <Camera className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white transition-colors">
                          <RotateCw className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setIsFullscreen(!isFullscreen)}
                          className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
                        >
                          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stream Info */}
                <div className="p-3 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">Command:</span>
                      <span className="ml-1 font-medium text-gray-900">{currentBot?.command || 'No command'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Quality:</span>
                      <span className="ml-1 font-medium text-gray-900">{currentBot?.streamQuality}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Update:</span>
                      <span className="ml-1 font-medium text-gray-900">{currentBot?.lastUpdate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Organization:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {currentBot?.organization || 'No organization assigned'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detection Statistics */}
                <div className="p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Real-time Detection Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="text-xl font-bold text-blue-600">24</div>
                      <div className="text-xs text-gray-600">Items Detected</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="text-xl font-bold text-green-600">18</div>
                      <div className="text-xs text-gray-600">Successfully Collected</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="text-xl font-bold text-yellow-600">6</div>
                      <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="text-xl font-bold text-purple-600">75%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Available Cameras ({bots.length})</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {bots.map((bot) => (
                      <button
                        key={bot.id}
                        onClick={() => setSelectedBot(bot.id)}
                        className={`w-full text-left p-2 rounded border transition-colors ${
                          selectedBot === bot.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusDot(bot.realtimeData?.status || bot.status)}`}></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{bot.id}</p>
                              <p className="text-xs text-gray-600">{bot.name}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className={`text-xs font-medium ${getStatusColor(bot.realtimeData?.status || bot.status)}`}>
                              {bot.realtimeData?.status || bot.status}
                            </p>
                            <div className="flex items-center space-x-1 mt-0.5">
                              <Battery className="h-2.5 w-2.5 text-gray-400" />
                              <span className="text-xs text-gray-600">{bot.battery}%</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}