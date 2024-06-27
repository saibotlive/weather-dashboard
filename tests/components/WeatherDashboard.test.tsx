import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import WeatherDashboard from '../../src/components/WeatherDashboard';

jest.mock('../../src/hooks/useWeatherData', () => ({
  __esModule: true,
  default: (city: string) => ({
    data: {
      location: { name: city },
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
    },
    error: null,
    isLoading: false,
  }),
}));

test('renders WeatherDashboard component', () => {
  render(<WeatherDashboard />);
  expect(screen.getByText(/no cities added/i)).toBeInTheDocument();
});

test('adds a city and displays it in the dashboard', async () => {
  render(<WeatherDashboard />);

  const input = screen.getByLabelText(/enter city name/i);
  const button = screen.getByRole('button', { name: /search/i });

  fireEvent.change(input, { target: { value: 'London' } });
  fireEvent.click(button);

  await waitFor(() => expect(screen.getByText(/London/i)).toBeInTheDocument());
  expect(screen.getByText(/Temperature: 20°C/i)).toBeInTheDocument();
});

test('pins and unpins a city', async () => {
  render(<WeatherDashboard />);

  const input = screen.getByLabelText(/enter city name/i);
  const button = screen.getByRole('button', { name: /search/i });

  fireEvent.change(input, { target: { value: 'London' } });
  fireEvent.click(button);

  await waitFor(() => expect(screen.getByText(/London/i)).toBeInTheDocument());

  const pinButton = screen.getByRole('button', { name: /pin/i });
  fireEvent.click(pinButton);

  await waitFor(() => expect(screen.getByRole('button', { name: /unpin/i })).toBeInTheDocument());

  const unpinButton = screen.getByRole('button', { name: /unpin/i });
  fireEvent.click(unpinButton);

  await waitFor(() => expect(screen.getByRole('button', { name: /pin/i })).toBeInTheDocument());
});
