import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Degree } from '@/types/api';

type Props = Pick<Degree, 'sign' | 'degree' | 'title' | 'keynote' | 'description'>;

export default function DegreeCard({ sign, degree, title, keynote, description }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.signRow}>
        <MaterialCommunityIcons
          name={`zodiac-${sign.toLowerCase()}` as any}
          size={32}
          color="rgba(200,185,240,0.6)"
        />
        <Text style={styles.signLabel}>{sign} · {degree}°</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.keynote}>{keynote}</Text>

      <View style={styles.descriptionBox}>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  signLabel: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 14,
    letterSpacing: 2,
    color: 'rgba(200,185,240,0.7)',
    textTransform: 'uppercase',
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 24,
    color: '#ffffff',
    lineHeight: 32,
    marginBottom: 10,
  },
  keynote: {
    fontFamily: 'Inter_300Light',
    fontSize: 9,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  descriptionBox: {
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
  },
  description: {
    fontFamily: 'CormorantGaramond_300Light',
    fontSize: 17,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 28,
  },
});
