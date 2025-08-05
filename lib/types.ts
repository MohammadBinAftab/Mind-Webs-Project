export interface Polygon {
  id: string;
  name: string;
  coordinates: [number, number][];
  dataSource: string;
  color: string;
  value?: number;
  createdAt: Date;
}

export interface DataSource {
  id: string;
  name: string;
  apiEndpoint: string;
  field: string;
  color: string;
  enabled: boolean;
}

export interface ColorRule {
  id: string;
  dataSourceId: string;
  operator: '=' | '<' | '>' | '<=' | '>=';
  value: number;
  color: string;
  label?: string;
}

export interface TimelineState {
  mode: 'single' | 'range';
  selectedTime: Date;
  startTime?: Date;
  endTime?: Date;
  isPlaying: boolean;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  drawingMode: boolean;
  currentPolygon: [number, number][];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}