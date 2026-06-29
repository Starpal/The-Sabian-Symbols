import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import BackButton from './back-button';

type Props = {
  right?: React.ReactNode;
};

export default function ScreenHeader({ right }: Props) {
  return (
    <View style={styles.header}>
      <BackButton />
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
