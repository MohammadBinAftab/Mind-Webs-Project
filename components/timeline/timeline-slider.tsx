'use client';

import { Range } from 'react-range';
import { format, addHours, subDays, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard-store';
import React, { useEffect, useState } from 'react';

export function TimelineSlider() {
  const {
    timeline,
    setTimelineMode,
    setSelectedTime,
    setTimeRange,
    togglePlayback,
    updatePolygonColors,
  } = useDashboardStore();

  // Create 30-day window (15 days before and after today)
  const today = new Date();
  const startDate = subDays(today, 15);
  const endDate = addDays(today, 15);
  
  // Convert to hours for slider
  const totalHours = 30 * 24; // 30 days * 24 hours
  const TimeComponent = () => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  if (!time) return null; // or a fallback

  return <div>{time}</div>;
};
  //const startTimestamp = startDate.getTime();
  
  //const getHourFromValue = (value: number): Date => {
   // return new Date(startTimestamp + value * 60 * 60 * 1000);
 // };

  //const getValueFromHour = (date: Date): number => {
    //return Math.floor((date.getTime() - startTimestamp) / (60 * 60 * 1000));
  //};

  const [sliderValues, setSliderValues] = useState([
    getValueFromHour(timeline.selectedTime)
  ]);

  const [rangeValues, setRangeValues] = useState([
    getValueFromHour(timeline.startTime || subDays(today, 1)),
    getValueFromHour(timeline.endTime || addDays(today, 1))
  ]);

  // Auto-play functionality
  useEffect(() => {
    if (!timeline.isPlaying) return;

    const interval = setInterval(() => {
      if (timeline.mode === 'single') {
        const currentValue = sliderValues[0];
        const nextValue = (currentValue + 1) % totalHours;
        const nextTime = getHourFromValue(nextValue);
        
        setSliderValues([nextValue]);
        setSelectedTime(nextTime);
        updatePolygonColors();
      }
    }, 200); // Update every 200ms for smooth animation

    return () => clearInterval(interval);
  }, [timeline.isPlaying, timeline.mode, sliderValues, totalHours]);

  const handleSingleSliderChange = (values: number[]) => {
    const newTime = getHourFromValue(values[0]);
    setSliderValues(values);
    setSelectedTime(newTime);
    updatePolygonColors();
  };

  const handleRangeSliderChange = (values: number[]) => {
    const startTime = getHourFromValue(values[0]);
    const endTime = getHourFromValue(values[1]);
    setRangeValues(values);
    setTimeRange(startTime, endTime);
    updatePolygonColors();
  };

  const resetToNow = () => {
    const nowValue = getValueFromHour(new Date());
    setSliderValues([nowValue]);
    setSelectedTime(new Date());
    updatePolygonColors();
  };

  const formatSliderValue = (value: number): string => {
    const date = getHourFromValue(value);
    return format(date, 'MMM dd, HH:mm');
  };

  return (
    <Card className="p-6 mb-6 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Timeline Control</h3>
            </div>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={timeline.mode === 'single' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimelineMode('single')}
                className="px-3 py-1 text-sm"
              >
                Single Point
              </Button>
              <Button
                variant={timeline.mode === 'range' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimelineMode('range')}
                className="px-3 py-1 text-sm"
              >
                Time Range
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToNow}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Now
            </Button>
            
            {timeline.mode === 'single' && (
              <Button
                variant={timeline.isPlaying ? 'secondary' : 'default'}
                size="sm"
                onClick={togglePlayback}
                className="flex items-center gap-2"
              >
                {timeline.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {timeline.isPlaying ? 'Pause' : 'Play'}
              </Button>
            )}
          </div>
        </div>

        {/* Timeline Display */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{format(startDate, 'MMM dd, yyyy')}</span>
            <span className="font-medium text-gray-900">
              {timeline.mode === 'single' 
                ? format(timeline.selectedTime, 'MMM dd, yyyy HH:mm')
                : `${format(timeline.startTime || startDate, 'MMM dd HH:mm')} - ${format(timeline.endTime || endDate, 'MMM dd HH:mm')}`
              }
            </span>
            <span>{format(endDate, 'MMM dd, yyyy')}</span>
          </div>

          {/* Single Point Slider */}
          {timeline.mode === 'single' && (
            <div className="px-4">
              <Range
                step={1}
                min={0}
                max={totalHours - 1}
                values={sliderValues}
                onChange={handleSingleSliderChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="w-full h-2 bg-gray-200 rounded-full relative"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      style={{
                        width: `${(sliderValues[0] / (totalHours - 1)) * 100}%`,
                      }}
                    />
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-6 h-6 bg-blue-600 border-2 border-white rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                  />
                )}
              />
            </div>
          )}

          {/* Range Slider */}
          {timeline.mode === 'range' && (
            <div className="px-4">
              <Range
                step={1}
                min={0}
                max={totalHours - 1}
                values={rangeValues}
                onChange={handleRangeSliderChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="w-full h-2 bg-gray-200 rounded-full relative"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full absolute"
                      style={{
                        left: `${(rangeValues[0] / (totalHours - 1)) * 100}%`,
                        width: `${((rangeValues[1] - rangeValues[0]) / (totalHours - 1)) * 100}%`,
                      }}
                    />
                    {children}
                  </div>
                )}
                renderThumb={({ props, index }) => (
                  <div
                    {...props}
                    className={`w-6 h-6 border-2 border-white rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${
                      index === 0 ? 'bg-teal-600' : 'bg-teal-700'
                    }`}
                  />
                )}
              />
              
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{formatSliderValue(rangeValues[0])}</span>
                <span>{formatSliderValue(rangeValues[1])}</span>
              </div>
            </div>
          )}
        </div>

        {/* Hour markers */}
        <div className="flex justify-between text-xs text-gray-400 px-4">
          {Array.from({ length: 7 }, (_, i) => {
            const dayOffset = (i - 3) * 5; // Show every 5 days
            const markerDate = addDays(today, dayOffset);
            return (
              <span key={i} className="text-center">
                {format(markerDate, 'MMM dd')}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
}