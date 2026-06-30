import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import BackButton from './back-button';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

type Props = {
  right?: React.ReactNode;
  onBack?: () => void;
};

export default function ScreenHeader({ right, onBack }: Props) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Ionicons name="arrow-back" size={20} color={colors.accent} />
        </TouchableOpacity>
      ) : (
        <BackButton />
      )}
      {right && <View>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 8 : 0,
    paddingBottom: 16,
  },
});
