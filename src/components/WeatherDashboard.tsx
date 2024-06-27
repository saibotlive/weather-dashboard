import React, { useState, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import SearchBar from './SearchBar';
import CityCard from './CityCard';
import CustomSnackbar from './CustomSnackbar';
import useLocalStorage from '../hooks/useLocalStorage';
import { normalizeCityName } from '../utils';

interface City {
  name: string;
  pinned: boolean;
}

const WeatherDashboard: React.FC = () => {
  const [cities, setCities] = useLocalStorage<City[]>('cities', []);
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const newCityRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = (city: string) => {
    const normalizedCity = normalizeCityName(city);
    if (!cities.some((c) => normalizeCityName(c.name) === normalizedCity)) {
      setCities([...cities, { name: city, pinned: false }]);
      setTimeout(() => {
        newCityRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
        {sortedCities.map((city, index) => (
          <div key={city.name} ref={index === cities.length - 1 ? newCityRef : null}>
            <CityCard
              city={city}
              onRemove={() => handleRemoveCity(city.name)}
              onPin={() => handlePinCity(city.name)}
              onUnpin={() => handleUnpinCity(city.name)}
              onError={(message) => {
                setMessage(message);
                setSeverity('error');
              }}
              setCities={setCities}
              cities={cities}
            />
          </div>
        ))}
      </div>
    </Box>
  );
};

export default WeatherDashboard;
