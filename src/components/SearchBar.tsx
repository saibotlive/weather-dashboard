import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (city) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSearch} className="flex w-full max-w-md gap-4 mx-auto mb-4">
      <TextField
        variant="outlined"
        fullWidth
        label="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-grow"
      />
      <Button variant="contained" color="primary" type="submit" className="bg-blue-500">
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
