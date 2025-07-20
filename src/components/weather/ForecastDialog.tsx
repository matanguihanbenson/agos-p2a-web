'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeatherForecast, DailyForecast, HourlyForecast } from '@/types/weather';
import { Calendar, Cloud, Droplets, Sun, CloudRain, CloudSnow, Zap, CloudDrizzle, Eye, Wind, X } from 'lucide-react';

interface ForecastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forecast: WeatherForecast;
}

export default function ForecastDialog({ open, onOpenChange, forecast }: ForecastDialogProps) {
  const [activeTab, setActiveTab] = useState('0');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTabLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getWeatherIcon = (condition: string, size: string = 'h-5 w-5') => {
    const normalizedCondition = condition.toLowerCase();
    
    if (normalizedCondition.includes('storm') || normalizedCondition.includes('thunder')) {
      return <Zap className={`${size} text-yellow-500`} />;
    }
    if (normalizedCondition.includes('heavy rain') || normalizedCondition.includes('downpour')) {
      return <CloudRain className={`${size} text-blue-600`} />;
    }
    if (normalizedCondition.includes('light rain') || normalizedCondition.includes('drizzle') || normalizedCondition.includes('sprinkle')) {
      return <CloudDrizzle className={`${size} text-blue-400`} />;
    }
    if (normalizedCondition.includes('rain') || normalizedCondition.includes('shower')) {
      return <CloudRain className={`${size} text-blue-500`} />;
    }
    if (normalizedCondition.includes('snow') || normalizedCondition.includes('blizzard') || normalizedCondition.includes('flurr')) {
      return <CloudSnow className={`${size} text-blue-300`} />;
    }
    if (normalizedCondition.includes('wind') || normalizedCondition.includes('breezy') || normalizedCondition.includes('gusty')) {
      return <Wind className={`${size} text-slate-500`} />;
    }
    if (normalizedCondition.includes('fog') || normalizedCondition.includes('mist') || normalizedCondition.includes('haze')) {
      return <Eye className={`${size} text-slate-400`} />;
    }
    if (normalizedCondition.includes('overcast') || normalizedCondition.includes('cloudy')) {
      return <Cloud className={`${size} text-slate-500`} />;
    }
    if (normalizedCondition.includes('partly') || normalizedCondition.includes('partial')) {
      return <Cloud className={`${size} text-slate-400`} />;
    }
    
    return <Sun className={`${size} text-yellow-500`} />;
  };

  const getWeatherIconBackground = (condition: string) => {
    const normalizedCondition = condition.toLowerCase();
    
    if (normalizedCondition.includes('storm') || normalizedCondition.includes('thunder')) {
      return 'bg-yellow-100';
    }
    if (normalizedCondition.includes('rain') || normalizedCondition.includes('shower') || normalizedCondition.includes('drizzle')) {
      return 'bg-blue-100';
    }
    if (normalizedCondition.includes('snow')) {
      return 'bg-blue-50';
    }
    if (normalizedCondition.includes('wind')) {
      return 'bg-slate-100';
    }
    if (normalizedCondition.includes('fog') || normalizedCondition.includes('mist')) {
      return 'bg-slate-50';
    }
    if (normalizedCondition.includes('cloud')) {
      return 'bg-slate-100';
    }
    
    return 'bg-yellow-100';
  };

  const getPrecipitationColor = (chance: number) => {
    if (chance >= 70) return 'text-blue-600 bg-blue-50';
    if (chance >= 40) return 'text-blue-500 bg-blue-50';
    return 'text-slate-500 bg-slate-50';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 gap-0 bg-white border-0 shadow-2xl"
        style={{ 
          width: '80vw', 
          maxWidth: '80vw',
          height: '90vh',
          maxHeight: '90vh'
        }}
        showCloseButton={false}
      >
        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Weather Forecast</h2>
                <p className="text-xs text-slate-600">3-day detailed outlook</p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col h-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            {/* Ultra Compact Tab Navigation */}
            <div className="px-3 pt-2 pb-2 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3 bg-slate-50 p-0.5 rounded-lg h-auto">
                {forecast.dailyForecasts.map((day: DailyForecast, index: number) => (
                  <TabsTrigger 
                    key={index} 
                    value={index.toString()}
                    className="flex flex-col items-center p-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all data-[state=active]:text-blue-600"
                  >
                    <div className="flex items-center space-x-1 mb-0.5">
                      <div className={`p-1 rounded ${getWeatherIconBackground(day.condition)}`}>
                        {getWeatherIcon(day.condition, 'h-2.5 w-2.5')}
                      </div>
                      <span className="font-medium text-xs">{getTabLabel(day.date)}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Compact Tab Content */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {forecast.dailyForecasts.map((day: DailyForecast, index: number) => (
                <TabsContent key={index} value={index.toString()} className="mt-0 space-y-3">
                  {/* Compact Day Overview Card */}
                  <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-0.5">{formatDate(day.date)}</h3>
                          <p className="text-xs text-slate-600">
                            {new Date(day.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline space-x-1 mb-2">
                            <span className="text-2xl font-light text-slate-800">{Math.round(day.maxTemp)}°</span>
                            <span className="text-lg text-slate-500">/ {Math.round(day.minTemp)}°</span>
                          </div>
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPrecipitationColor(day.precipitationChance)}`}>
                            <Droplets className="h-2.5 w-2.5" />
                            <span>{day.precipitationChance}% rain</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 mt-3">
                        <div className={`p-2.5 ${getWeatherIconBackground(day.condition)} rounded-xl`}>
                          {getWeatherIcon(day.condition, 'h-6 w-6')}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-800">{day.condition}</p>
                          <p className="text-xs text-slate-600">Throughout the day</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Hourly Breakdown */}
                  <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-800">Hourly Breakdown</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Temperature and precipitation throughout the day</p>
                    </div>
                    
                    <div className="p-3">
                      {/* Compact horizontal scrolling */}
                      <div className="w-full overflow-x-auto">
                        <div className="flex space-x-2 pb-2" style={{ width: 'max-content' }}>
                          {day.hourlyForecasts.map((hour: HourlyForecast, hourIndex: number) => (
                            <div key={hourIndex} className="flex-shrink-0 w-16">
                              <div className="bg-slate-50 rounded-lg p-2 hover:bg-blue-50 transition-colors hover:shadow-sm border border-transparent hover:border-blue-100">
                                <div className="text-center space-y-2">
                                  <div className="text-xs font-semibold text-slate-700">
                                    {hour.time.replace(':00', '')}
                                  </div>
                                  
                                  <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center ${getWeatherIconBackground(hour.condition)}`}>
                                    {getWeatherIcon(hour.condition, 'h-4 w-4')}
                                  </div>
                                  
                                  <div className="text-sm font-bold text-slate-800">
                                    {Math.round(hour.temperature)}°
                                  </div>
                                  
                                  <div className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getPrecipitationColor(hour.precipitationChance)}`}>
                                    {hour.precipitationChance}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
        
        {/* Compact Summary Footer */}
        <div className="border-t border-slate-100 bg-slate-50 p-3 flex-shrink-0">
          <div className="text-center">
            <h3 className="text-xs font-medium text-slate-700 mb-2">3-Day Summary</h3>
            <div className="flex justify-center space-x-8 text-xs">
              <div className="text-center">
                <div className="font-bold text-slate-800 text-lg mb-0.5">
                  {Math.round(Math.max(...forecast.dailyForecasts.map(d => d.maxTemp)))}°C
                </div>
                <div className="text-slate-600">Highest</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800 text-lg mb-0.5">
                  {Math.round(Math.min(...forecast.dailyForecasts.map(d => d.minTemp)))}°C
                </div>
                <div className="text-slate-600">Lowest</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800 text-lg mb-0.5">
                  {Math.round(forecast.dailyForecasts.reduce((sum, d) => sum + d.precipitationChance, 0) / forecast.dailyForecasts.length)}%
                </div>
                <div className="text-slate-600">Avg Rain</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
