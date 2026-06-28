import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DegreeCard from '@/components/DegreeCard';
import { SIGNS } from '@/constants/appConstants';
import { fetchDegreeBySignAndDegree, fetchRandomDegree } from '@/services/api';
import { Degree } from '@/types/api';

type Mode = 'search' | 'random';

const getNextSign = (current: string, direction: 'plus' | 'minus'): string => {
  const signs = SIGNS.filter((s) => s !== 'Sign');
  const idx = signs.indexOf(current);
  if (direction === 'plus') return idx === signs.length - 1 ? signs[0] : signs[idx + 1];
  return idx === 0 ? signs[signs.length - 1] : signs[idx - 1];
};

export default function ResultsScreen() {
  const { sign: initialSign, degree: initialDegree, mode } = useLocalSearchParams<{
    sign: string;
    degree: string;
    mode: Mode;
  }>();

  const [degree, setDegree] = useState<Degree | null>(null);
  const [currentSign, setCurrentSign] = useState(initialSign ?? '');
  const [currentDegree, setCurrentDegree] = useState(Number(initialDegree) || 1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDegree = useCallback(async (sign: string, deg: number) => {
    setIsLoading(true);
    try {
      const data = mode === 'random' && !sign
        ? await fetchRandomDegree()
        : await fetchDegreeBySignAndDegree(sign, deg);

      const result = Array.isArray(data) ? data[0] : data;
      setDegree(result);
      setCurrentSign(result.sign);
      setCurrentDegree(result.degree);
    } catch (e) {
      console.error('[ResultsScreen]', e);
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchDegree(currentSign, currentDegree);
  }, []);

  const navigate = (direction: 'plus' | 'minus') => {
    let newDeg = direction === 'plus' ? currentDegree + 1 : currentDegree - 1;
    let newSign = currentSign;

    if (newDeg > 30) {
      newDeg = 1;
      newSign = getNextSign(currentSign, 'plus');
    } else if (newDeg < 1) {
      newDeg = 30;
      newSign = getNextSign(currentSign, 'minus');
    }

    setCurrentSign(newSign);
    setCurrentDegree(newDeg);
    fetchDegree(newSign, newDeg);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
        <View style={styles.navButtons}>
          <TouchableOpacity
            onPress={() => navigate('minus')}
            style={styles.navBtn}
            disabled={isLoading}
            hitSlop={12}>
            <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate('plus')}
            style={styles.navBtn}
            disabled={isLoading}
            hitSlop={12}>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="rgba(200,185,240,0.6)" />
        </View>
      ) : degree ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <DegreeCard
            sign={degree.sign}
            degree={degree.degree}
            title={degree.title}
            keynote={degree.keynote}
            description={degree.description}
          />
          <TouchableOpacity
            style={styles.homeLink}
            onPress={() => router.back()}>
            <Text style={styles.homeLinkText}>Return</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No result found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
    paddingBottom: 16,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  navBtn: {
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  homeLink: {
    marginTop: 32,
    alignItems: 'center',
  },
  homeLinkText: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 12,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.15)',
    textTransform: 'uppercase',
  },
  errorText: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
});
