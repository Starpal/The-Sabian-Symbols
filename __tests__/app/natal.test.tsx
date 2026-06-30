import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NatalScreen from '@/app/natal';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock('@/components/ui/screen-header', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockScreenHeader({ onBack, right }: any) {
    return React.createElement(
      View,
      { testID: 'screen-header' },
      onBack && React.createElement(View, { testID: 'back-button' }),
      right
    );
  };
});

jest.mock('@/components/ui/primary-button', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockPrimaryButton({ label, onPress, disabled, isLoading }: any) {
    return React.createElement(
      View,
      { 
        testID: `button-${label}`,
        onStartShouldSetResponder: onPress,
      },
      React.createElement(Text, null, isLoading ? 'Loading...' : label)
    );
  };
});

jest.mock('@/components/PlanetRow', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockPlanetRow({ label, degrees }: any) {
    return React.createElement(
      View,
      { testID: `planet-${label}` },
      React.createElement(Text, null, label),
      React.createElement(Text, null, degrees)
    );
  };
});

jest.mock('@expo-google-fonts/cormorant-garamond', () => ({
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock('@expo-google-fonts/inter', () => ({
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// ✅ Mock delle API - SENZA public nei parametri
jest.mock('@/services/api', () => {
  class MockApiError extends Error {
    context: string;
    status?: number;
    constructor(message: string, context: string, status?: number) {
      super(message);
      this.name = 'ApiError';
      this.context = context;
      this.status = status;
    }
  }
  return {
    fetchCoordinates: jest.fn(),
    fetchDegreeBySignAndDegree: jest.fn(),
    fetchRandomDegree: jest.fn(),
    ApiError: MockApiError,
  };
});

// ✅ Mock di astrologia
jest.mock('@/services/astrology', () => ({
  computePlanetDegrees: jest.fn(() => [
    {
      key: 'sun',
      label: 'Sun',
      sign: 'Aries',
      signKey: 'aries',
      degrees: "10°30'",
    },
    {
      key: 'moon',
      label: 'Moon',
      sign: 'Taurus',
      signKey: 'taurus',
      degrees: "15°45'",
    },
  ]),
}));

// ✅ Importa dopo i mock
import { fetchCoordinates } from '@/services/api';

const renderWithGestureHandler = (component: React.ReactElement) => {
  return render(
    <GestureHandlerRootView>
      {component}
    </GestureHandlerRootView>
  );
};

describe('NatalScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the natal chart form', () => {
    renderWithGestureHandler(<NatalScreen />);
    expect(screen.getByText('Natal chart')).toBeTruthy();
    expect(screen.getByText('Date of birth')).toBeTruthy();
    expect(screen.getByText('Place of birth')).toBeTruthy();
    expect(screen.getByText('Calculate')).toBeTruthy();
  });

  it('searches for locations when location is entered', async () => {
    const mockLocations = [
      { id: '1', name: 'Rome, Italy', lat: '41.9028', lon: '12.4964' },
    ];
    (fetchCoordinates as jest.Mock).mockResolvedValue(mockLocations);

    renderWithGestureHandler(<NatalScreen />);

    const locationInput = screen.getByPlaceholderText('City, country');
    fireEvent.changeText(locationInput, 'Rome');
    fireEvent(locationInput, 'submitEditing');

    await waitFor(() => {
      expect(screen.getByText('Rome, Italy')).toBeTruthy();
    });
  });

  it('selects a location from search results', async () => {
    const mockLocations = [
      { id: '1', name: 'Rome, Italy', lat: '41.9028', lon: '12.4964' },
    ];
    (fetchCoordinates as jest.Mock).mockResolvedValue(mockLocations);

    renderWithGestureHandler(<NatalScreen />);

    const locationInput = screen.getByPlaceholderText('City, country');
    fireEvent.changeText(locationInput, 'Rome');
    fireEvent(locationInput, 'submitEditing');

    await waitFor(() => {
      fireEvent.press(screen.getByText('Rome, Italy'));
    });

    expect(screen.getByText('✓ Rome, Italy')).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    (fetchCoordinates as jest.Mock).mockRejectedValue(new Error('Network error'));

    renderWithGestureHandler(<NatalScreen />);

    const locationInput = screen.getByPlaceholderText('City, country');
    fireEvent.changeText(locationInput, 'InvalidCity');
    fireEvent(locationInput, 'submitEditing');

    await waitFor(() => {
      expect(screen.getByText(/Couldn't reach the server/i)).toBeTruthy();
    });
  });
});