import { render, fireEvent, screen } from '@testing-library/react';
import CityCard from '../../src/components/CityCard';
import { WeatherApiResponse } from '../../src/services/weatherApi';

const mockWeatherData: WeatherApiResponse = {
  location: { name: 'London' },
  current: { temp_c: 20, humidity: 65, wind_kph: 10 },
  forecast: {
    forecastday: [
      {
        date: '2024-06-30',
        day: {
          maxtemp_c: 25,
          mintemp_c: 15,
          condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          },
        },
      },
    ],
  },
};

jest.mock('../../src/hooks/useWeatherData', () => ({
  __esModule: true,
  default: () => ({
    data: mockWeatherData,
    error: null,
    isLoading: false,
  }),
}));

test('renders CityCard component with weather data', () => {
  render(
    <CityCard
      city={{ name: 'London', pinned: false }}
      onRemove={jest.fn()}
      onPin={jest.fn()}
      onUnpin={jest.fn()}
      onError={jest.fn()}
      setCities={jest.fn()}
      cities={[]}
    />
  );

  expect(screen.getByText(/London/i)).toBeInTheDocument();
  expect(screen.getByText(/Temperature: 20°C/i)).toBeInTheDocument();
  expect(screen.getByText(/Humidity: 65%/i)).toBeInTheDocument();
  expect(screen.getByText(/Wind Speed: 10 kph/i)).toBeInTheDocument();
  expect(screen.getByText(/5-day Forecast:/i)).toBeInTheDocument();
});

test('calls onRemove when the remove button is clicked', () => {
  const onRemoveMock = jest.fn();
  render(
    <CityCard
      city={{ name: 'London', pinned: false }}
      onRemove={onRemoveMock}
      onPin={jest.fn()}
      onUnpin={jest.fn()}
      onError={jest.fn()}
      setCities={jest.fn()}
      cities={[]}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: /remove/i }));
  expect(onRemoveMock).toHaveBeenCalled();
});
