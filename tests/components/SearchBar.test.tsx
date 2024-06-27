import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../src/components/SearchBar';

test('renders SearchBar component', () => {
  render(<SearchBar onSearch={jest.fn()} />);
  expect(screen.getByLabelText(/enter city name/i)).toBeInTheDocument();
});

test('calls onSearch with the city name when the form is submitted', () => {
  const onSearchMock = jest.fn();
  render(<SearchBar onSearch={onSearchMock} />);

  const input = screen.getByLabelText(/enter city name/i);
  const button = screen.getByRole('button', { name: /search/i });

  fireEvent.change(input, { target: { value: 'London' } });
  fireEvent.click(button);

  expect(onSearchMock).toHaveBeenCalledWith('London');
  expect(input).toHaveValue('');
});
