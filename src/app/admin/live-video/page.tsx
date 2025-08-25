'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { useBots, Bot } from '@/hooks/useBots';

// Add HLS.js type declaration
declare global {
  interface Window {
    Hls?: {
      new (config?: HlsConfig): HlsInstance;
      isSupported(): boolean;
      Events: {
        MANIFEST_PARSED: string;
        ERROR: string;
        FRAG_LOADED: string;
      };
      ErrorTypes: {
        NETWORK_ERROR: string;
        MEDIA_ERROR: string;
      };
    };
  }
}

interface HlsConfig {
  enableWorker?: boolean;
  lowLatencyMode?: boolean;
  backBufferLength?: number;
  maxBufferLength?: number;
  maxMaxBufferLength?: number;
  manifestLoadingTimeOut?: number;
  manifestLoadingMaxRetry?: number;
  manifestLoadingRetryDelay?: number;
  levelLoadingTimeOut?: number;
  levelLoadingMaxRetry?: number;
  levelLoadingRetryDelay?: number;
  fragLoadingTimeOut?: number;
  fragLoadingMaxRetry?: number;
  fragLoadingRetryDelay?: number;
}

interface HlsInstance {
  loadSource(url: string): void;
  attachMedia(media: HTMLVideoElement): void;
  on(event: string, callback: (event: string, data: HlsErrorData) => void): void;
  destroy(): void;
  startLoad(): void;
  recoverMediaError(): void;
}

interface HlsErrorData {
  fatal: boolean;
  type: string;
  details: string;
}

// Simplified Live Video Player Component
function SimpleLivePlayer({ streamUrl }: { streamUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hlsLoaded, setHlsLoaded] = useState(false);
  const hlsRef = useRef<HlsInstance | null>(null);

  // Load HLS.js from CDN
  useEffect(() => {
    if ('Hls' in window) {
      setHlsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = () => {
      console.log('HLS.js loaded from CDN');
      setHlsLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load HLS.js from CDN');
      setHlsLoaded(true); // Continue without HLS.js
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !streamUrl || !hlsLoaded) return;

    setError(null);
    setIsLoading(true);

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // If it's HLS (.m3u8), use Hls.js
    if (streamUrl.endsWith('.m3u8') || streamUrl.includes('m3u8')) {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
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

        hlsRef.current = hls;
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);

        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed');
          setIsLoading(false);
        });

        hls.on(window.Hls.Events.FRAG_LOADED, () => {
          console.log('Fragment loaded, clearing any previous errors');
          setError(null);
        });

        hls.on(window.Hls.Events.ERROR, (_: string, data: HlsErrorData) => {
          console.error('HLS error', data);
          
          if (data.fatal) {
            switch (data.type) {
              case window.Hls?.ErrorTypes.NETWORK_ERROR:
                console.log('Fatal network error, attempting recovery...');
                setError('Network error - attempting to recover...');
                setTimeout(() => {
                  if (hlsRef.current) {
                    hlsRef.current.startLoad();
                  }
                }, 2000);
                break;
              
              case window.Hls?.ErrorTypes.MEDIA_ERROR:
                console.log('Fatal media error, attempting recovery...');
                setError('Media error - attempting to recover...');
                if (hlsRef.current) {
                  hlsRef.current.recoverMediaError();
                }
                break;
              
              default:
                console.log('Fatal error, cannot recover');
                setError('Stream error: ' + data.details);
                setIsLoading(false);
                break;
            }
          } else {
            // Non-fatal errors - handle buffer stalled error specifically
            if (data.details.includes('bufferStalled')) {
              console.log('Buffer stalled, attempting to recover...');
              setError('Buffering issue - recovering...');
              // Clear error after attempting recovery
              setTimeout(() => {
                setError(null);
                if (hlsRef.current) {
                  hlsRef.current.startLoad();
                }
              }, 3000);
            } else {
              console.log('Non-fatal HLS error:', data.details);
              setError('Stream issue: ' + data.details);
              // Clear non-fatal errors after a delay
              setTimeout(() => setError(null), 5000);
            }
          }
        });
        
        return () => {
          if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
          }
        };
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        videoRef.current.src = streamUrl;
        setIsLoading(false);
      } else {
        setError('HLS not supported');
        setIsLoading(false);
      }
      return;
    }

    // If it's a WHEP (WebRTC) URL
    if (streamUrl.endsWith('/whep')) {
      (async () => {
        try {
          const pc = new RTCPeerConnection();
          pc.ontrack = (event) => {
            if (videoRef.current) {
              videoRef.current.srcObject = event.streams[0];
              setIsLoading(false);
            }
          };

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          const res = await fetch(streamUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/sdp' },
            body: offer.sdp || '',
          });

          const answer = await res.text();
          await pc.setRemoteDescription({ type: 'answer', sdp: answer });
        } catch (err) {
          console.error('WebRTC error', err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError('WebRTC connection failed: ' + errorMessage);
          setIsLoading(false);
        }
      })();
      return;
    }

    // For direct video URLs (MP4, WebM, etc.) or local streams
    if (videoRef.current) {
      videoRef.current.src = streamUrl;
      videoRef.current.load();
    }
    
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(false);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Failed to load video stream');
      setIsLoading(false);
    };
    
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [streamUrl, hlsLoaded]);

  // Add retry functionality
  const retryStream = () => {
    console.log('Retrying stream...');
    setError(null);
    setIsLoading(true);
    
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    // Trigger re-initialization
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
      }
    }, 1000);
  };

  return (
    <div className="relative w-full bg-black aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        controls={false}
        className="w-full h-full object-cover"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black/70">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black/70">
          <div className="text-center">
            <VideoOff className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm mb-3">{error}</p>
            <button 
              onClick={retryStream}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Retry Stream
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveVideoViewer() {
  const [selectedBot, setSelectedBot] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

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

  const isOnline = (bot: Bot | undefined) => {
    return bot?.stream_url && bot?.stream_url.trim() !== '';
  };

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
                {isOnline(currentBot) && currentBot && currentBot.stream_url ? (
                  <div className="absolute inset-0">
                    {/* Simplified Live Player */}
                    <SimpleLivePlayer streamUrl={currentBot.stream_url} />
                    
                    {/* Timestamp overlay */}
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      LIVE • {currentTime}
                    </div>
                    
                    {/* Bot info overlay */}
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Battery className="h-3 w-3" />
                          <span>{currentBot.battery}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Wifi className="h-3 w-3" />
                          <span>{currentBot.signal}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>GPS Active</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stream URL display for debugging */}
                    <div className="absolute bottom-10 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded max-w-md">
                      <div>Stream: {currentBot.stream_url}</div>
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
  );
}