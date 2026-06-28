
import {
  CormorantGaramond_300Light,
  CormorantGaramond_300Light_Italic,
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium,
} from '@expo-google-fonts/cormorant-garamond';
import { Inter_300Light, Inter_400Regular } from '@expo-google-fonts/inter';
import * as Font from 'expo-font';
 
export const useFonts = async (): Promise<void> => {
  await Font.loadAsync({
    CormorantGaramond_300Light,
    CormorantGaramond_300Light_Italic,
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium,
    Inter_300Light,
    Inter_400Regular,
  });
};
 