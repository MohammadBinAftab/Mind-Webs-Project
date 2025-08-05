import { WeatherData } from './types';

const OPEN_METEO_BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export class ApiService {
  private cache = new Map<string, WeatherData>();

  async fetchWeatherData(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string
  ): Promise<WeatherData> {
    const cacheKey = `${latitude}_${longitude}_${startDate}_${endDate}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `${OPEN_METEO_BASE_URL}?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      const data: WeatherData = await response.json();
      this.cache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Return mock data for development
      return {
        latitude,
        longitude,
        hourly: {
          time: [new Date().toISOString()],
          temperature_2m: [Math.random() * 30 + 5] // Random temperature between 5-35°C
        }
      };
    }
  }

  async getTemperatureForPolygon(
    coordinates: [number, number][],
    time: Date
  ): Promise<number> {
    // Calculate polygon centroid
    const centroid = this.calculateCentroid(coordinates);
    
    const startDate = new Date(time);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const data = await this.fetchWeatherData(
      centroid[0],
      centroid[1],
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    // Find the closest hour
    const targetHour = time.getHours();
    const temperatures = data.hourly.temperature_2m;
    
    return temperatures[targetHour] || temperatures[0] || 20; // Fallback to 20°C
  }

  private calculateCentroid(coordinates: [number, number][]): [number, number] {
    const sum = coordinates.reduce(
      (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng],
      [0, 0]
    );
    return [sum[0] / coordinates.length, sum[1] / coordinates.length];
  }
}

export const apiService = new ApiService();