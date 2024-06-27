import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import SearchBar from './SearchBar';
import CityCard from './CityCard';
import CustomSnackbar from './CustomSnackbar';
import useLocalStorage from '../hooks/useLocalStorage';

interface City {
  name: string;
  pinned: boolean;
}

const WeatherDashboard: React.FC = () => {
  const [cities, setCities] = useLocalStorage<City[]>('cities', []);
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const normalizeCityName = useMemo(() => (city: string) => city.trim().toLowerCase(), []);

  const handleSearch = (city: string) => {
    const normalizedCity = normalizeCityName(city);
    if (!cities.some((c) => normalizeCityName(c.name) === normalizedCity)) {
      setCities([...cities, { name: city, pinned: false }]);
    } else {
      setMessage('City already exists in the list.');
      setSeverity('error');
    }
  };

  const handleRemoveCity = (cityName: string) => {
    setCities(cities.filter((c) => normalizeCityName(c.name) !== normalizeCityName(cityName)));
  };

  const handlePinCity = (cityName: string) => {
    setCities(
      cities.map((c) => (normalizeCityName(c.name) === normalizeCityName(cityName) ? { ...c, pinned: true } : c))
    );
    setMessage('City pinned successfully.');
    setSeverity('success');
  };

  const handleUnpinCity = (cityName: string) => {
    setCities(
      cities.map((c) => (normalizeCityName(c.name) === normalizeCityName(cityName) ? { ...c, pinned: false } : c))
    );
    setMessage('City unpinned successfully.');
    setSeverity('success');
  };

  const handleCloseSnackbar = () => {
    setMessage(null);
  };

  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1)),
    [cities]
  );

  return (
    <Box className="flex flex-col items-center w-full p-4 mx-auto">
      <SearchBar onSearch={handleSearch} />
      {message && (
        <CustomSnackbar open={!!message} message={message} severity={severity} onClose={handleCloseSnackbar} />
      )}
      {cities.length === 0 && <p className="mt-4 text-gray-500">No cities added. Please search for a city to add.</p>}
      <div className="flex flex-col items-center w-full">
        {sortedCities.map((city) => (
          <CityCard
            key={city.name}
            city={city}
            onRemove={() => handleRemoveCity(city.name)}
            onPin={() => handlePinCity(city.name)}
            onUnpin={() => handleUnpinCity(city.name)}
            onError={(message) => {
              setMessage(message);
              setSeverity('error');
            }}
            onSuccess={(message) => {
              setMessage(message);
              setSeverity('success');
            }}
            setCities={setCities}
            cities={cities}
          />
        ))}
      </div>
    </Box>
  );
};

export default WeatherDashboard;
