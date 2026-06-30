import { Dimensions, Platform } from "react-native";

const { height } = Dimensions.get("window");

export const STARS = Array.from({ length: 200 }).map(() => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 0.5, // 0.5 → 2.5 px
}));

export const SIGNS: string[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
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
  "December",
];

// Device detection
const isIOS = Platform.OS === "ios";
const isAndroid = Platform.OS === "android";

export const IS_IOS_TABLET: boolean = isIOS && height > 1300;
export const IS_ANDROID_TABLET: boolean = isAndroid && height > 1200;
export const IS_TABLET: boolean = IS_IOS_TABLET || IS_ANDROID_TABLET;
export const IS_IPHONE5: boolean = isIOS && height < 700;
