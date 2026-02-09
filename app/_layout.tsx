import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Nav } from '@/components/Nav';
import { colors, gradients } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Quattrocento-Regular': require('@/assets/fonts/Quattrocento/Quattrocento-Regular.ttf'),
    'Quattrocento-Bold': require('@/assets/fonts/Quattrocento/Quattrocento-Bold.ttf'),
    'QuattrocentoSans-Regular': require('@/assets/fonts/Quattrocento_Sans/QuattrocentoSans-Regular.ttf'),
    'QuattrocentoSans-Bold': require('@/assets/fonts/Quattrocento_Sans/QuattrocentoSans-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <LinearGradient
        colors={gradients.background.colors}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Nav />
      <LinearGradient
        colors={gradients.background.colors}
        style={styles.content}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="success" />
          <Stack.Screen name="about" />
          <Stack.Screen name="contact" />
        </Stack>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gradient[0],
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
