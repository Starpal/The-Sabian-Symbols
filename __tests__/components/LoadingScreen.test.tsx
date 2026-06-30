import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LoadingScreen from '@/components/LoadingScreen';

// Mock di Star
jest.mock('@/components/Star', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockStar({ testID = 'star' }: any) {
    return React.createElement(View, { testID });
  };
});

// Mock di Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ testID, ...props }: any) => null,
}));

describe('LoadingScreen', () => {
  it('renders correctly', () => {
    render(<LoadingScreen />);
    // Verifica che il componente sia renderizzato
    expect(screen.root).toBeTruthy();
  });
});