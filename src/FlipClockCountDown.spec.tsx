import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import FlipClockCountdown from './FlipClockCountDown';

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning: ReactDOM.render is no longer supported in React 18./.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('should render a countdown', () => {
  render(<FlipClockCountdown from={new Date().getTime()} to={new Date().getTime() + 24 * 3600 * 1000 + 5000} />);
  expect(screen.getByTestId('fcc-container')).toBeInTheDocument();
  expect(screen.getByText('Days')).toBeInTheDocument();
  expect(screen.getByText('Hours')).toBeInTheDocument();
  expect(screen.getByText('Minutes')).toBeInTheDocument();
  expect(screen.getByText('Seconds')).toBeInTheDocument();
});

test('should instant render the completed component (children)', () => {
  const { container } = render(
    <FlipClockCountdown from={new Date().getTime()} to={new Date().getTime() - 5000}>
      <div>Completed</div>
    </FlipClockCountdown>
  );
  expect(() => screen.getByTestId('fcc-container')).toThrowError();
  expect(container.textContent).toBe('Completed');
});


test('should render the countdown with custom styles', () => {
  render(
    <FlipClockCountdown
      from={new Date().getTime()}
      to={new Date().getTime() + 24 * 3600 * 1000 + 5000}
      labelStyle={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase' }}
      digitBlockStyle={{ width: 40, height: '60px', fontSize: 30, color: 'red' }}
      dividerStyle={{ color: 'red', height: 1 }}
      separatorStyle={{ color: 'red', size: 6 }}
      duration={0.5}
    />
  );
  const container = screen.getByTestId('fcc-container');
  expect(container).toBeInTheDocument();
  expect(container).toHaveStyle('--fcc-flip-duration: 0.5s');
  expect(container).toHaveStyle('--fcc-digit-block-width: 40px');
  expect(container).toHaveStyle('--fcc-digit-block-height: 60px');
  expect(container).toHaveStyle('--fcc-digit-font-size: 30px');
  expect(container).toHaveStyle('--fcc-digit-color: red');
  expect(container).toHaveStyle('--fcc-divider-color: red');
  expect(container).toHaveStyle('--fcc-divider-height: 1px');
  expect(container).toHaveStyle('--fcc-label-font-size: 10px');
  expect(container).toHaveStyle('--fcc-separator-size: 6px');
  expect(container).toHaveStyle('--fcc-separator-color: red');

  const dLabel = screen.getByText('Days');
  expect(dLabel).toBeInTheDocument();
  expect(dLabel).toHaveStyle('font-weight: 500');
  expect(dLabel).toHaveStyle('text-transform: uppercase');
});

test('should render the countdown with default labels', () => {
  render(<FlipClockCountdown from={new Date().getTime()} to={new Date().getTime() + 24 * 3600 * 1000 + 5000} />);
  expect(screen.getByText('Days')).toBeInTheDocument();
  expect(screen.getByText('Hours')).toBeInTheDocument();
  expect(screen.getByText('Minutes')).toBeInTheDocument();
  expect(screen.getByText('Seconds')).toBeInTheDocument();

  cleanup();
  render(<FlipClockCountdown from={new Date().getTime()} to={new Date().getTime() + 24 * 3600 * 1000 + 5000} labels={['D', 'H', 'S']} />);
  expect(() => screen.getByText('D')).toThrowError();
  expect(() => screen.getByText('H')).toThrowError();
  expect(screen.getByText('Days')).toBeInTheDocument();
  expect(screen.getByText('Hours')).toBeInTheDocument();
  expect(screen.getByText('Minutes')).toBeInTheDocument();
  expect(screen.getByText('Seconds')).toBeInTheDocument();
});

test('should render the countdown with custom labels', () => {
  render(<FlipClockCountdown from={new Date().getTime()} to={new Date().getTime() + 24 * 3600 * 1000 + 5000} labels={['D', 'H', 'M', 'S']} />);
  expect(() => screen.getByText('Days')).toThrowError();
  expect(() => screen.getByText('Hours')).toThrowError();
  expect(() => screen.getByText('Minutes')).toThrowError();
  expect(() => screen.getByText('Seconds')).toThrowError();
  expect(screen.getByText('D')).toBeInTheDocument();
  expect(screen.getByText('H')).toBeInTheDocument();
  expect(screen.getByText('M')).toBeInTheDocument();
  expect(screen.getByText('S')).toBeInTheDocument();

  cleanup();
  render(
    <FlipClockCountdown from={new Date().getTime()} to={new Date().getTime() + 24 * 3600 * 1000 + 5000} labels={['D', 'H', 'M', 'S', 'MS']} />
  );
  expect(screen.getByText('D')).toBeInTheDocument();
  expect(screen.getByText('H')).toBeInTheDocument();
  expect(screen.getByText('M')).toBeInTheDocument();
  expect(screen.getByText('S')).toBeInTheDocument();
  expect(() => screen.getByText('MS')).toThrowError();
});

test('should render the countdown with no labels', () => {
  render(<FlipClockCountdown from={new Date().getTime()} to={new Date().getTime() + 24 * 3600 * 1000 + 5000} showLabels={false} />);
  expect(() => screen.getByText('Days')).toThrowError();
  expect(() => screen.getByText('Hours')).toThrowError();
  expect(() => screen.getByText('Minutes')).toThrowError();
  expect(() => screen.getByText('Seconds')).toThrowError();
});

test('should render the countdown with no separators', () => {
  render(<FlipClockCountdown from={new Date().getTime()} to={new Date().getTime() + 24 * 3600 * 1000 + 5000} showSeparators={false} />);
  expect(screen.getByTestId('fcc-container')).toHaveStyle('--fcc-separator-color: transparent');
});

test('should render the countdown with separators', () => {
  render(<FlipClockCountdown from={new Date().getTime()} to={new Date().getTime() + 24 * 3600 * 1000 + 5000} showSeparators={true} />);
  const container = screen.getByTestId('fcc-container');
  expect(container).not.toHaveStyle('--fcc-separator-color: transparent');
});
