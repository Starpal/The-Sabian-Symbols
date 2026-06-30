import '@testing-library/react-native/extend-expect';

// globali testing mocks 
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Silece React Native warnings during tests
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');