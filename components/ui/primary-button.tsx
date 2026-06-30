import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { colors, fonts } from '@/constants/theme';

type Props = TouchableOpacityProps & {
  label: string;
  isLoading?: boolean;
};

export default function PrimaryButton({ label, isLoading, disabled, style, ...rest }: Props) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[styles.btn, isDisabled && styles.btnDisabled, style]}
      disabled={isDisabled}
      activeOpacity={0.7}
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
  // btn: {
  //   width: '100%',
  //   paddingVertical: 15,
  //   borderWidth: StyleSheet.hairlineWidth,
  //   borderColor: colors.accentBorder,
  //   borderRadius: 2,
  //   alignItems: 'center',
  // },
  // btnDisabled: {
  //   borderColor: colors.dividerLight,
  // },
  // label: {
  //   fontFamily: fonts.serif,
  //   fontSize: 25,
  //   letterSpacing: 3,
  //   color: colors.accent,
  //   textAlign: 'center',
  // },
  // labelDisabled: {
  //   color: colors.textDisabled,
  //   textAlign: 'center',
  //   submitBtn: {
  //   width: "100%",
  //   paddingVertical: 15,
  //   borderWidth: StyleSheet.hairlineWidth,
  //   borderColor: colors.accentBorder,
  //   borderRadius: 2,
  //   alignItems: "center",
  //   marginBottom: 24,
  // },
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
