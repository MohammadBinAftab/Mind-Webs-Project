'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TimelineSlider } from '@/components/timeline/timeline-slider';
import { DataSourceSidebar } from '@/components/sidebar/data-source-sidebar';
import { useDashboardStore } from '@/store/dashboard-store';

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(
  () => import('@/components/map/interactive-map').then((mod) => mod.InteractiveMap),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function Dashboard() {
  const { updatePolygonColors } = useDashboardStore();

  // Update polygon colors on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePolygonColors();
    }, 1000);

    return () => clearTimeout(timer);
  }, [updatePolygonColors]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Geospatial Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Interactive mapping with temporal data analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Real-time weather data from Open-Meteo API
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 pt-6">
        <TimelineSlider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Map Container */}
        <div className="flex-1 p-6 pr-0">
          <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <InteractiveMap />
          </div>
        </div>

        {/* Sidebar */}
        <DataSourceSidebar />
      </div>
    </div>
  );
}