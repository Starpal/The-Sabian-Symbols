import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import ResultsScreen from '@/app/results';
import { useRandomDegree, useSearchDegree } from '@/hooks/use-degree';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: jest.fn().mockReturnValue({
    sign: 'Aries',
    degree: '15',
    mode: 'search',
  }),
}));

// ✅ Mock dei componenti
jest.mock('@/components/DegreeCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockDegreeCard({ title, keynote, description }: any) {
    return React.createElement(
      View,
      null,
      React.createElement(Text, null, title),
      React.createElement(Text, null, keynote),
      React.createElement(Text, null, description)
    );
  };
});

jest.mock('@/components/LoadingScreen', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockLoadingScreen() {
    return React.createElement(View, { testID: 'planet-icon' });
  };
});

jest.mock('@/components/ui/primary-button', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockPrimaryButton({ label, onPress }: any) {
    return React.createElement(
      View,
      { onStartShouldSetResponder: onPress },
      React.createElement(Text, null, label)
    );
  };
});

// ✅ Mock di use-degree per questo test
jest.mock('@/hooks/use-degree', () => ({
  useRandomDegree: jest.fn(),
  useSearchDegree: jest.fn(),
}));

describe('ResultsScreen', () => {
  const mockSymbolData = {
    sign: 'Aries',
    degree: 15,
    title: 'A Test Symbol',
    keynote: 'THE KEYNOTE OF THE SYMBOL',
    description: 'This is a test description.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchDegree as jest.Mock).mockReturnValue({
      data: mockSymbolData,
      isFetching: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    (useRandomDegree as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('renders symbol data when loaded', async () => {
    render(<ResultsScreen />);
    await waitFor(() => {
      expect(screen.getByText('A Test Symbol')).toBeTruthy();
      expect(screen.getByText('THE KEYNOTE OF THE SYMBOL')).toBeTruthy();
      expect(screen.getByText('This is a test description.')).toBeTruthy();
    });
  });

  it('shows error state when query fails', () => {
    (useSearchDegree as jest.Mock).mockReturnValue({
      data: null,
      isFetching: false,
      isError: true,
      error: new Error('API Error'),
      refetch: jest.fn(),
    });

    render(<ResultsScreen />);
    expect(screen.getByText(/Something went wrong/i)).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
  });

  it('returns to previous screen when Return button is pressed', async () => {
    render(<ResultsScreen />);
    await waitFor(() => {
      const returnButton = screen.getByText('Return');
      fireEvent.press(returnButton);
      expect(router.back).toHaveBeenCalled();
    });
  });
});