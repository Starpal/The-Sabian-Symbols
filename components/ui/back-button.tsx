import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme';

export default function BackButton() {
  return (
    <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
      <Ionicons name="arrow-back" size={20} color={colors.accent} />
    </TouchableOpacity>
  );
}
