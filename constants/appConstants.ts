import { Dimensions, Platform } from 'react-native';

const { height } = Dimensions.get('window');

// Zodiac signs — first item is the placeholder for the picker
export const SIGNS: string[] = [
  'Sign',
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

// Animation for loading text and submit button
export interface PulseAnimation {
  0: { scale: number };
  0.5: { scale: number };
  1: { scale: number };
}

export const PULSE: PulseAnimation = {
  0: { scale: 1 },
  0.5: { scale: 1.095 },
  1: { scale: 1 },
};

// Collapsible header options
export interface HeaderOptions {
  navigationOptions: {
    headerStyle: {
      height: number;
      elevation: number;
      shadowOpacity: number;
      borderBottomWidth: number;
    };
  };
}

export const HEADER_OPTIONS: HeaderOptions = {
  navigationOptions: {
    headerStyle: {
      height: 80,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  },
};

// Device detection
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

export const IS_IOS_TABLET: boolean = isIOS && height > 1300;
export const IS_ANDROID_TABLET: boolean = isAndroid && height > 1200;
export const IS_TABLET: boolean = IS_IOS_TABLET || IS_ANDROID_TABLET;
export const IS_IPHONE5: boolean = isIOS && height < 700;