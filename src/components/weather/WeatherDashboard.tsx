'use client';

import React, { useState, useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import { weatherService } from '@/services/weatherService';
import CurrentWeatherCard from './CurrentWeatherCard';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await weatherService.getCompleteWeatherData();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !weatherData) {
    return (
      <div className="space-y-6">
        {/* Current Weather Loading */}
        <div className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 rounded-xl">
          <div className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
            <div className="text-white/90 text-lg font-medium">Loading current weather...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200/50 rounded-xl p-6 shadow-lg">
        <div className="text-center space-y-4">
          <div className="p-3 bg-red-100 rounded-full w-fit mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-red-800 font-semibold text-lg mb-2">Weather Service Unavailable</h3>
            <p className="text-red-600 text-sm leading-relaxed max-w-md mx-auto">{error}</p>
            <button 
              onClick={fetchWeatherData}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {weatherData && (
        <>
          {/* Current Weather with Integrated Forecast */}
          <CurrentWeatherCard 
            weather={weatherData.current} 
            forecast={weatherData.forecast}
            onRefresh={fetchWeatherData}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
           