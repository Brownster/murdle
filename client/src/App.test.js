import { render, screen } from '@testing-library/react';
import App from './App';

test('renders name entry modal', () => {
  render(<App />);
  const heading = screen.getByText(/Enter Name/i);
  expect(heading).toBeInTheDocument();
});
