'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CurrentWeather, WeatherForecast } from '@/types/weather';
import ForecastDialog from './ForecastDialog';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  MapPin, 
  AlertTriangle,
  RefreshCw,
  Calendar
} from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  forecast?: WeatherForecast;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function CurrentWeatherCard({ 
  weather, 
  forecast,
  onRefresh, 
  isLoading = false 
}: CurrentWeatherCardProps) {
  const [showForecast, setShowForecast] = useState(false);

  return (
    <>
      <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-500/90 via-blue-600/90 to-indigo-700/90 backdrop-blur-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
        
        <CardContent className="relative p-4">
          {/* Header - Compact */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Thermometer className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Current Weather</h2>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-2.5 w-2.5 text-white/80" />
                  <span className="text-xs text-white/90">{weather.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {weather.isStormWarning && (
                <Badge className="bg-red-500/90 hover:bg-red-600/90 border-0 text-white shadow-lg text-xs px-2 py-1">
                  <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                  Alert
                </Badge>
              )}
              {forecast && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForecast(true)}
                  className="bg-white/20 hover:bg-white/30 border-0 text-white shadow-lg text-xs px-2 py-1 h-auto"
                >
                  <Calendar className="h-2.5 w-2.5 mr-1" />
                  3-Day Forecast
                </Button>
              )}
              {onRefresh && (
                <button 
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-white ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Main Content - Horizontal Layout */}
          <div className="flex items-center justify-between">
            {/* Temperature & Condition */}
            <div className="text-left">
              <div className="text-4xl font-light text-white">
                {Math.round(weather.temperature)}°C
              </div>
              <div className="text-sm text-white/90 font-medium">{weather.condition}</div>
              <div className="text-xs text-white/70">
                Feels like {Math.round(weather.temperature + 2)}°C
              </div>
            </div>

            {/* Weather Details - Compact Grid */}
            <div className="flex space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center min-w-[80px]">
                <div className="flex justify-center mb-1">
                  <Droplets className="h-3.5 w-3.5 text-white/80" />
                </div>
                <div className="text-white/70 text-xs font-medium uppercase tracking-wide">Humidity</div>
                <div className="text-white text-sm font-semibold">{weather.humidity}%</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center min-w-[80px]">
                <div className="flex justify-center mb-1">
                  <Wind className="h-3.5 w-3.5 text-white/80" />
                </div>
                <div className="text-white/70 text-xs font-medium uppercase tracking-wide">Wind</div>
                <div className="text-white text-sm font-semibold">{weather.windSpeed} km/h</div>
                <div className="text-white/60 text-xs">{weather.windDirection}</div>
              </div>
            </div>
          </div>

          {/* Last Updated - More Compact */}
          <div className="text-center mt-3 pt-2 border-t border-white/20">
            <div className="text-white/60 text-xs">
              Updated {new Date(weather.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Dialog */}
      {forecast && (
        <ForecastDialog
          open={showForecast}
          onOpenChange={setShowForecast}
          forecast={forecast}
        />
      )}
    </>
  );
}
