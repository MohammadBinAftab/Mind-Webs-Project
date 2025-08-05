import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Polygon, DataSource, ColorRule, TimelineState, MapState } from '@/lib/types';
import { apiService } from '@/lib/api';

interface DashboardStore {
  // Timeline state
  timeline: TimelineState;
  setTimelineMode: (mode: 'single' | 'range') => void;
  setSelectedTime: (time: Date) => void;
  setTimeRange: (start: Date, end: Date) => void;
  togglePlayback: () => void;

  // Map state
  map: MapState;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  setDrawingMode: (enabled: boolean) => void;
  setCurrentPolygon: (coordinates: [number, number][]) => void;

  // Polygons
  polygons: Polygon[];
  addPolygon: (coordinates: [number, number][], dataSourceId: string) => void;
  deletePolygon: (id: string) => void;
  updatePolygonColor: (id: string, color: string) => void;
  updatePolygonValue: (id: string, value: number) => void;
  renamePolygon: (id: string, name: string) => void;

  // Data sources
  dataSources: DataSource[];
  addDataSource: (dataSource: Omit<DataSource, 'id'>) => void;
  toggleDataSource: (id: string) => void;
  updateDataSourceColor: (id: string, color: string) => void;

  // Color rules
  colorRules: ColorRule[];
  addColorRule: (rule: Omit<ColorRule, 'id'>) => void;
  deleteColorRule: (id: string) => void;
  updateColorRule: (id: string, updates: Partial<ColorRule>) => void;

  // Actions
  updatePolygonColors: () => Promise<void>;
  resetMap: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      // Initial timeline state
      timeline: {
        mode: 'single',
        selectedTime: new Date(),
        isPlaying: false,
      },

      // Initial map state
      map: {
        center: [52.52, 13.41], // Berlin
        zoom: 13,
        drawingMode: false,
        currentPolygon: [],
      },

      // Initial data
      polygons: [],
      dataSources: [
        {
          id: 'open-meteo-temp',
          name: 'Temperature (°C)',
          apiEndpoint: 'https://archive-api.open-meteo.com/v1/archive',
          field: 'temperature_2m',
          color: '#3B82F6',
          enabled: true,
        },
      ],
      colorRules: [
        {
          id: 'cold',
          dataSourceId: 'open-meteo-temp',
          operator: '<',
          value: 10,
          color: '#3B82F6',
          label: 'Cold',
        },
        {
          id: 'mild',
          dataSourceId: 'open-meteo-temp',
          operator: '>=',
          value: 10,
          color: '#10B981',
          label: 'Mild',
        },
        {
          id: 'hot',
          dataSourceId: 'open-meteo-temp',
          operator: '>=',
          value: 25,
          color: '#F59E0B',
          label: 'Hot',
        },
      ],

      // Timeline actions
      setTimelineMode: (mode) =>
        set((state) => ({
          timeline: { ...state.timeline, mode },
        })),

      setSelectedTime: (time) =>
        set((state) => ({
          timeline: { ...state.timeline, selectedTime: time },
        })),

      setTimeRange: (start, end) =>
        set((state) => ({
          timeline: { ...state.timeline, startTime: start, endTime: end },
        })),

      togglePlayback: () =>
        set((state) => ({
          timeline: { ...state.timeline, isPlaying: !state.timeline.isPlaying },
        })),

      // Map actions
      setMapCenter: (center) =>
        set((state) => ({
          map: { ...state.map, center },
        })),

      setMapZoom: (zoom) =>
        set((state) => ({
          map: { ...state.map, zoom },
        })),

      setDrawingMode: (enabled) =>
        set((state) => ({
          map: { ...state.map, drawingMode: enabled },
        })),

      setCurrentPolygon: (coordinates) =>
        set((state) => ({
          map: { ...state.map, currentPolygon: coordinates },
        })),

      // Polygon actions
      addPolygon: (coordinates, dataSourceId) => {
        const id = `polygon-${Date.now()}`;
        const name = `Region ${get().polygons.length + 1}`;
        const dataSource = get().dataSources.find((ds) => ds.id === dataSourceId);
        
        set((state) => ({
          polygons: [
            ...state.polygons,
            {
              id,
              name,
              coordinates,
              dataSource: dataSourceId,
              color: dataSource?.color || '#3B82F6',
              createdAt: new Date(),
            },
          ],
          map: { ...state.map, drawingMode: false, currentPolygon: [] },
        }));

        // Update colors after adding
        get().updatePolygonColors();
      },

      deletePolygon: (id) =>
        set((state) => ({
          polygons: state.polygons.filter((p) => p.id !== id),
        })),

      updatePolygonColor: (id, color) =>
        set((state) => ({
          polygons: state.polygons.map((p) =>
            p.id === id ? { ...p, color } : p
          ),
        })),

      updatePolygonValue: (id, value) =>
        set((state) => ({
          polygons: state.polygons.map((p) =>
            p.id === id ? { ...p, value } : p
          ),
        })),

      renamePolygon: (id, name) =>
        set((state) => ({
          polygons: state.polygons.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        })),

      // Data source actions
      addDataSource: (dataSource) =>
        set((state) => ({
          dataSources: [
            ...state.dataSources,
            { ...dataSource, id: `ds-${Date.now()}` },
          ],
        })),

      toggleDataSource: (id) =>
        set((state) => ({
          dataSources: state.dataSources.map((ds) =>
            ds.id === id ? { ...ds, enabled: !ds.enabled } : ds
          ),
        })),

      updateDataSourceColor: (id, color) =>
        set((state) => ({
          dataSources: state.dataSources.map((ds) =>
            ds.id === id ? { ...ds, color } : ds
          ),
        })),

      // Color rule actions
      addColorRule: (rule) =>
        set((state) => ({
          colorRules: [...state.colorRules, { ...rule, id: `rule-${Date.now()}` }],
        })),

      deleteColorRule: (id) =>
        set((state) => ({
          colorRules: state.colorRules.filter((r) => r.id !== id),
        })),

      updateColorRule: (id, updates) =>
        set((state) => ({
          colorRules: state.colorRules.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      // Update polygon colors based on data and rules
      updatePolygonColors: async () => {
        const { polygons, colorRules, timeline } = get();
        
        for (const polygon of polygons) {
          try {
            const value = await apiService.getTemperatureForPolygon(
              polygon.coordinates,
              timeline.selectedTime
            );

            // Find matching color rule
            const rules = colorRules
              .filter((r) => r.dataSourceId === polygon.dataSource)
              .sort((a, b) => b.value - a.value); // Sort by value descending

            let color = '#3B82F6'; // Default color
            
            for (const rule of rules) {
              if (
                (rule.operator === '<' && value < rule.value) ||
                (rule.operator === '>' && value > rule.value) ||
                (rule.operator === '<=' && value <= rule.value) ||
                (rule.operator === '>=' && value >= rule.value) ||
                (rule.operator === '=' && Math.abs(value - rule.value) < 0.1)
              ) {
                color = rule.color;
                break;
              }
            }

            get().updatePolygonColor(polygon.id, color);
            get().updatePolygonValue(polygon.id, value);
          } catch (error) {
            console.error(`Error updating polygon ${polygon.id}:`, error);
          }
        }
      },

      resetMap: () =>
        set((state) => ({
          map: {
            ...state.map,
            center: [52.52, 13.41],
            zoom: 13,
            drawingMode: false,
            currentPolygon: [],
          },
        })),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        polygons: state.polygons,
        dataSources: state.dataSources,
        colorRules: state.colorRules,
      }),
    }
  )
);