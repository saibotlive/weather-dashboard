import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, CircularProgress } from '@mui/material';
import useWeatherData from '../hooks/useWeatherData';
import { WeatherApiResponse } from '../services/weatherApi';
import { normalizeCityName } from '../utils';

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
  setCities: (cities: City[]) => void;
  cities: City[];
}

const CityCard: React.FC<CityCardProps> = ({ city, onRemove, onPin, onUnpin, onError, setCities, cities }) => {
  const { data, error, isLoading } = useWeatherData(city.name);

  useEffect(() => {
    if (error) {
      onError((error as Error).message);
      setCities(cities.filter((c) => normalizeCityName(c.name) !== normalizeCityName(city.name)));
    } else if (data) {
      const correctCityName = normalizeCityName(data.location.name);

      if (cities.some((c) => normalizeCityName(c.name) === correctCityName && c.name !== city.name)) {
        setCities(cities.filter((c) => normalizeCityName(c.name) !== normalizeCityName(city.name)));
        onError(`${data.location.name} already exists in the list.`);
      } else if (!cities.some((c) => normalizeCityName(c.name) === correctCityName)) {
        setCities([
          ...cities.filter((c) => normalizeCityName(c.name) !== normalizeCityName(city.name)),
          { ...city, name: correctCityName },
        ]);
      }
    }
  }, [data, error, onError, setCities, cities, city]);

  if (isLoading) {
    return (
      <Card variant="outlined" className="flex items-center justify-center w-full my-2 min-h-72">
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
    <Card variant="outlined" className="flex flex-col justify-between w-full h-full mb-4">
      <CardContent className="flex-grow">
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
