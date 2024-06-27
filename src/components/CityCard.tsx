import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, CircularProgress } from '@mui/material';
import useWeatherData from '../hooks/useWeatherData';
import { WeatherApiResponse } from '../services/weatherApi';

interface City {
  name: string;
  pinned: boolean;
}

interface CityCardProps {
  city: City;
  onRemove: () => void;
  onPin: () => void;
  onUnpin: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  setCities: (cities: City[]) => void;
  cities: City[];
}

const CityCard: React.FC<CityCardProps> = ({
  city,
  onRemove,
  onPin,
  onUnpin,
  onError,
  onSuccess,
  setCities,
  cities,
}) => {
  const { data, error, isLoading } = useWeatherData(city.name);

  const normalizeCityName = (city: string) => city.trim().toLowerCase();

  useEffect(() => {
    if (error) {
      onError((error as Error).message);
      setCities(cities.filter((c) => normalizeCityName(c.name) !== normalizeCityName(city.name)));
    } else if (data) {
      const correctCityName = data.location.name.trim().toLowerCase();
      if (cities.some((c) => normalizeCityName(c.name) === correctCityName && c.name !== city.name)) {
        setCities(cities.filter((c) => normalizeCityName(c.name) !== normalizeCityName(city.name)));
      } else if (!cities.some((c) => normalizeCityName(c.name) === correctCityName)) {
        setCities([
          ...cities.filter((c) => normalizeCityName(c.name) !== normalizeCityName(city.name)),
          { ...city, name: correctCityName },
        ]);
        onSuccess(`${data.location.name} has been added successfully.`);
      }
    }
  }, [data, error, onError, onSuccess, setCities, cities, city]);

  if (isLoading) {
    return (
      <Card variant="outlined" className="flex justify-center items-center min-h-72 w-full my-2">
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return null;
  }

  const weatherData: WeatherApiResponse = data;

  return (
    <Card variant="outlined" className="w-full mb-4">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h5">{weatherData.location.name}</Typography>
          <div className="flex gap-2">
            {city.pinned ? (
              <Button variant="contained" color="primary" onClick={onUnpin} className="bg-blue-500">
                Unpin
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={onPin} className="bg-blue-500">
                Pin
              </Button>
            )}
            <Button variant="contained" color="secondary" onClick={onRemove} className="bg-red-600">
              Remove
            </Button>
          </div>
        </div>
        <Typography>Temperature: {weatherData.current.temp_c}°C</Typography>
        <Typography>Humidity: {weatherData.current.humidity}%</Typography>
        <Typography>Wind Speed: {weatherData.current.wind_kph} kph</Typography>
        <Typography variant="h6" className="mt-4">
          5-day Forecast:
        </Typography>
        <Grid container spacing={2}>
          {weatherData.forecast.forecastday.map((day) => (
            <Grid item xs key={day.date} className="text-center">
              <Typography>{day.date}</Typography>
              <img src={day.day.condition.icon} alt={day.day.condition.text} className="mx-auto" />
              <Typography>
                {day.day.maxtemp_c}°C / {day.day.mintemp_c}°C
              </Typography>
              <Typography>{day.day.condition.text}</Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CityCard;
