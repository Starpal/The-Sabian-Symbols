import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import HomeScreen from '@/app/index';
import { router } from 'expo-router';

// Mock dei componenti
jest.mock('@/components/Star', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockStar({ testID = 'star' }: any) {
    return React.createElement(View, { testID });
  };
});

jest.mock('@/components/ui/home-button', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockHomeButton({ title, onPress }: any) {
    return React.createElement(
      View,
      { testID: `button-${title}`, onStartShouldSetResponder: onPress },
      React.createElement(Text, null, title)
    );
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main title and subtitle', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Sabian Symbols')).toBeTruthy();
    expect(screen.getByText('✧ 360 degrees of the zodiac ✧')).toBeTruthy();
  });

  it('renders all three home buttons', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Search a Degree')).toBeTruthy();
    expect(screen.getByText('Natal Chart')).toBeTruthy();
    expect(screen.getByText('Ask the Oracle')).toBeTruthy();
  });

  it('navigates to search screen when Search button is pressed', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByText('Search a Degree'));
    expect(router.push).toHaveBeenCalledWith('/search');
  });

  it('navigates to natal screen when Natal Chart button is pressed', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByText('Natal Chart'));
    expect(router.push).toHaveBeenCalledWith('/natal');
  });

  it('navigates to results with random mode when Ask the Oracle is pressed', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByText('Ask the Oracle'));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/results',
      params: { mode: 'random' },
    });
  });
});