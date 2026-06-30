import '@testing-library/react-native/extend-expect';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react-native';

afterEach(cleanup);

// ✅ Definisci fetch GLOBALE
global.fetch = jest.fn();

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn().mockReturnValue({
    sign: 'Aries',
    degree: '15',
    mode: 'search',
  }),
  Stack: {
    Screen: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
  MaterialCommunityIcons: () => null,
}));

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

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  class MockBottomSheet extends React.Component {
    expand = jest.fn();
    close = jest.fn();
    snapTo = jest.fn();
    
    render() {
      const { children, testID, ...props } = this.props as any;
      return React.createElement(
        View,
        { testID: testID || 'bottom-sheet', ...props },
        children
      );
    }
  }
  
  const MockBottomSheetFlatList = ({ data, renderItem, testID, ...props }: any) => {
    return React.createElement(
      View,
      { testID: testID || 'bottom-sheet-flatlist', ...props },
      data?.map((item: any, index: number) => renderItem({ item, index }))
    );
  };
  
  return {
    __esModule: true,
    default: MockBottomSheet,
    BottomSheetFlatList: MockBottomSheetFlatList,
  };
});

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  ScrollView: ({ children, ...props }: any) => {
    const React = require('react');
    const { ScrollView: RNScrollView } = require('react-native');
    return React.createElement(RNScrollView, props, children);
  },
}));

jest.mock('@/services/astrology', () => ({
  computePlanetDegrees: jest.fn(() => [
    { key: 'sun', label: 'Sun', sign: 'Aries', signKey: 'aries', degrees: "10°30'" },
    { key: 'moon', label: 'Moon', sign: 'Taurus', signKey: 'taurus', degrees: "15°45'" },
  ]),
}));

// ✅ NON mockare @/services/api qui - sarà mockato nei test

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};