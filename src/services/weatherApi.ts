export interface WeatherApiResponse {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

export interface WeatherApiError {
  error: {
    code: number;
    message: string;
  };
}

const API_KEY = '81256061d2294ffe9e6121044242506';
const BASE_URL = 'https://api.weatherapi.com/v1';

export const fetchWeatherData = async (city: string): Promise<WeatherApiResponse> => {
  const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch weather data');
  }

  return data;
};
