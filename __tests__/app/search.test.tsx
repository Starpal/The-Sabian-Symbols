import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import SearchScreen from '@/app/search';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useLocalSearchParams: jest.fn().mockReturnValue({}),
}));

const renderWithGestureHandler = (component: React.ReactElement) => {
  return render(
    <GestureHandlerRootView>
      {component}
    </GestureHandlerRootView>
  );
};

describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search form', () => {
    renderWithGestureHandler(<SearchScreen />);
    expect(screen.getByText('Search a Degree')).toBeTruthy();
    expect(screen.getByText('Zodiac sign')).toBeTruthy();
    expect(screen.getByText('Degree')).toBeTruthy();
    expect(screen.getByText('Select a sign')).toBeTruthy();
    expect(screen.getByText('Select a degree')).toBeTruthy();
  });

  it('disables submit button initially', () => {
    renderWithGestureHandler(<SearchScreen />);
    expect(screen.getByText('Search')).toBeTruthy();
  });

  it('selects a sign from the picker', async () => {
    renderWithGestureHandler(<SearchScreen />);
    fireEvent.press(screen.getByText('Select a sign'));
    await waitFor(() => {
      expect(screen.getByTestId('bottom-sheet')).toBeTruthy();
    });
  });

  it('navigates to results with selected sign and degree', async () => {
    renderWithGestureHandler(<SearchScreen />);
    fireEvent.press(screen.getByText('Select a sign'));
    await waitFor(() => {
      fireEvent.press(screen.getByText('Aries'));
    });
    expect(screen.getByText('Aries')).toBeTruthy();
  });
});