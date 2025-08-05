'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Pencil, Home, Square } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard-store';
import 'leaflet/dist/leaflet.css';

// Map event handler component
function MapEventHandler() {
  const {
    map,
    setCurrentPolygon,
    setDrawingMode,
    addPolygon,
    dataSources,
  } = useDashboardStore();

  const mapInstance = useMap();

  useMapEvents({
    click: (e) => {
      if (!map.drawingMode) return;

      const newCoord: [number, number] = [e.latlng.lat, e.latlng.lng];
      const updatedPolygon = [...map.currentPolygon, newCoord];

      // Limit to 12 points maximum
      if (updatedPolygon.length <= 12) {
        setCurrentPolygon(updatedPolygon);
      }

      // Auto-complete polygon if we have enough points and user clicks near the start
      if (updatedPolygon.length >= 3) {
        const firstPoint = updatedPolygon[0];
        const distance = Math.sqrt(
          Math.pow(e.latlng.lat - firstPoint[0], 2) + 
          Math.pow(e.latlng.lng - firstPoint[1], 2)
        );

        // If clicked near the starting point, complete the polygon
        if (distance < 0.001 && updatedPolygon.length >= 3) {
          const activeDataSource = dataSources.find(ds => ds.enabled) || dataSources[0];
          addPolygon(updatedPolygon, activeDataSource.id);
        }
      }
    },
  });

  return null;
}

// Map center controller
function MapController() {
  const { map, setMapCenter, setMapZoom } = useDashboardStore();
  const mapInstance = useMap();

  useEffect(() => {
    mapInstance.setView(map.center, map.zoom);
  }, [map.center, map.zoom, mapInstance]);

  return null;
}

export function InteractiveMap() {
  const {
    map,
    polygons,
    setDrawingMode,
    setCurrentPolygon,
    resetMap,
    deletePolygon,
    addPolygon,
    dataSources,
  } = useDashboardStore();

  const mapRef = useRef<any>(null);

  const handleStartDrawing = () => {
    setCurrentPolygon([]);
    setDrawingMode(true);
  };

  const handleCancelDrawing = () => {
    setCurrentPolygon([]);
    setDrawingMode(false);
  };

  const handleCompletePolygon = () => {
    if (map.currentPolygon.length >= 3) {
      const activeDataSource = dataSources.find(ds => ds.enabled) || dataSources[0];
      addPolygon(map.currentPolygon, activeDataSource.id);
    }
  };

  const getPolygonOpacity = (polygonId: string) => {
    return polygons.find(p => p.id === polygonId)?.value !== undefined ? 0.7 : 0.4;
  };

  return (
    <div className="relative h-full">
      {/* Map Controls */}
      <Card className="absolute top-4 left-4 z-[1000] p-3 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
        <div className="flex flex-col gap-2">
          <Button
            variant={map.drawingMode ? 'secondary' : 'default'}
            size="sm"
            onClick={map.drawingMode ? handleCancelDrawing : handleStartDrawing}
            className="flex items-center gap-2"
          >
            {map.drawingMode ? (
              <>
                <Square className="w-4 h-4" />
                Cancel ({map.currentPolygon.length}/12)
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4" />
                Draw Polygon
              </>
            )}
          </Button>
          
          {map.drawingMode && map.currentPolygon.length >= 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompletePolygon}
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Complete
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={resetMap}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Reset View
          </Button>
        </div>
      </Card>

      {/* Drawing Instructions */}
      {map.drawingMode && (
        <Card className="absolute top-4 right-4 z-[1000] p-4 bg-blue-50/95 backdrop-blur-sm border border-blue-200 shadow-lg max-w-sm">
          <div className="text-sm text-blue-900">
            <h4 className="font-semibold mb-2">Drawing Mode Active</h4>
            <ul className="space-y-1">
              <li>• Click to add points (min: 3, max: 12)</li>
              <li>• Current points: {map.currentPolygon.length}</li>
              <li>• Click near the first point to auto-complete</li>
              <li>• Or use the Complete button when ready</li>
            </ul>
          </div>
        </Card>
      )}

      {/* Polygon List */}
      {polygons.length > 0 && (
        <Card className="absolute bottom-4 left-4 z-[1000] p-4 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg max-w-sm">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Polygons ({polygons.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {polygons.map((polygon) => (
                <div
                  key={polygon.id}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: polygon.color }}
                    />
                    <span className="text-sm font-medium">{polygon.name}</span>
                    {polygon.value !== undefined && (
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {polygon.value.toFixed(1)}°C
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePolygon(polygon.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Map Container */}
      <MapContainer
        ref={mapRef}
        center={map.center}
        zoom={map.zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventHandler />
        <MapController />

        {/* Render existing polygons */}
        {polygons.map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.coordinates}
            pathOptions={{
              color: polygon.color,
              fillColor: polygon.color,
              fillOpacity: getPolygonOpacity(polygon.id),
              opacity: 0.8,
              weight: 2,
            }}
          >
            <Tooltip>
              <div className="text-sm">
                <div className="font-semibold">{polygon.name}</div>
                {polygon.value !== undefined && (
                  <div>Temperature: {polygon.value.toFixed(1)}°C</div>
                )}
                <div className="text-xs text-gray-600">
                  {polygon.coordinates.length} vertices
                </div>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {/* Render current drawing polygon */}
        {map.drawingMode && map.currentPolygon.length >= 3 && (
          <Polygon
            positions={map.currentPolygon}
            pathOptions={{
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.3,
              opacity: 1,
              weight: 2,
              dashArray: '10, 10',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}