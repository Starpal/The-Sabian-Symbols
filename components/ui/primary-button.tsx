import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/constants/theme';

type Props = TouchableOpacityProps & {
  label: string;
  toScreen?: string;
  isLoading?: boolean;
};

export default function PrimaryButton({ label, isLoading, disabled, style, toScreen, ...rest }: Props) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[styles.btn, isDisabled && styles.btnDisabled, style]}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityHint={`Navigate to ${toScreen} screen.`}
      accessibilityRole="button"
      accessibilityState={{ disabled: false }}
      {...rest}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.accentMuted} />
      ) : (
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    btn: {
    width: "100%",
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentBorder,
    borderRadius: 2,
    alignItems: "center",
    marginBottom: 24,
  },
  btnDisabled: {
    borderColor: colors.textDisabled,
  },
  label: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 25,
    letterSpacing: 3,
    color: colors.accent,
  },
  labelDisabled: {
    color: colors.textDisabled,
  },
});
