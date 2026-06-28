import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { DimensionValue } from 'react-native';


type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Results: { screen: string; sign?: string; degree?: number };
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const STARS = [
  { top: '10%', left: '18%', size: 1 },
  { top: '16%', left: '72%', size: 2 },
  { top: '7%', left: '50%', size: 1 },
  { top: '30%', left: '90%', size: 1 },
  { top: '70%', left: '8%', size: 1 },
  { top: '80%', left: '85%', size: 2 },
];

const FadeInView: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};

export default function HomeScreen({ navigation }: Props) {
<View style={styles.container}>
      {STARS.map((star, i) => {
        const starStyle = {
          top: star.top as DimensionValue,
          left: star.left as DimensionValue,
          width: star.size,
          height: star.size,
        };

        return (
          <View
            key={i}
            style={[styles.star, starStyle]}
          />
        );
      })}

      <FadeInView>
        <Text style={styles.eyebrow}>Sabian Symbols</Text>
      </FadeInView>

      <FadeInView delay={200}>
        <Text style={styles.title}>The Oracle</Text>
        <Text style={styles.subtitle}>360 degrees of the zodiac</Text>
      </FadeInView>

      <FadeInView delay={400} >
        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.7}>
          <Ionicons name="search-outline" size={14} color="rgba(200,185,240,0.7)" />
          <Text style={[styles.btnText, styles.btnTextPrimary]}>Search a degree</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Results', { screen: 'Random' })}
          activeOpacity={0.7}>
          <Ionicons name="sparkles-outline" size={14} color="rgba(255,255,255,0.4)" />
          <Text style={styles.btnText}>Draw from the oracle</Text>
        </TouchableOpacity>

        <View style={styles.smallDivider} />

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Results', { screen: 'NatalChart' })}
          activeOpacity={0.7}>
          <Ionicons name="planet-outline" size={14} color="rgba(255,255,255,0.4)" />
          <Text style={styles.btnText}>Natal chart</Text>
        </TouchableOpacity>
      </FadeInView>
    </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  star: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  eyebrow: {
    fontFamily: 'Inter_300Light',
    fontSize: 9,
    letterSpacing: 4,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'CormorantGaramond_300Light_Italic',
    fontSize: 52,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 56,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'CormorantGaramond_300Light',
    fontSize: 12,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
    marginBottom: 44,
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
  },
  smallDivider: {
    width: 30,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'center',
    marginVertical: 8,
  },
  btn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 10,
  },
  btnPrimary: {
    borderColor: 'rgba(180,160,220,0.35)',
  },
  btnText: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 15,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.7)',
  },
  btnTextPrimary: {
    color: 'rgba(200,185,240,0.9)',
  },
});
