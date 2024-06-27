import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchWeatherData, WeatherApiResponse } from '../services/weatherApi';

const useWeatherData = (city: string): UseQueryResult<WeatherApiResponse, Error> => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchWeatherData(city),
    enabled: !!city,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('No matching location found')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export default useWeatherData;
