import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import PlanetRow from '@/components/PlanetRow';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock di vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: () => null,
  Ionicons: () => null,
}));

describe('PlanetRow', () => {
  const mockProps = {
    label: 'Sun',
    sign: 'Aries',
    signKey: 'aries',
    degrees: "10°30'",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders planet information correctly', () => {
    render(<PlanetRow {...mockProps} />);
    expect(screen.getByText('Sun')).toBeTruthy();
    expect(screen.getByText("10°30'")).toBeTruthy();
  });

  it('navigates to results when pressed', () => {
    render(<PlanetRow {...mockProps} />);
    fireEvent.press(screen.getByText('Sun'));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/results',
      params: { sign: 'Aries', degree: 10, mode: 'search' },
    });
  });

  it('parses degree correctly - rounds up when minutes > 30', () => {
    render(<PlanetRow {...mockProps} degrees="10°45'" />);
    fireEvent.press(screen.getByText('Sun'));
    expect(router.push).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({ degree: 11 }),
      })
    );
  });

  it('parses degree correctly - rounds down when minutes <= 30', () => {
    render(<PlanetRow {...mockProps} degrees="10°30'" />);
    fireEvent.press(screen.getByText('Sun'));
    expect(router.push).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({ degree: 10 }),
      })
    );
  });
});