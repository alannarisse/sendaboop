import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Quattrocento-Regular': require('@/assets/fonts/Quattrocento/Quattrocento-Regular.ttf'),
    'Quattrocento-Bold': require('@/assets/fonts/Quattrocento/Quattrocento-Bold.ttf'),
    'QuattrocentoSans-Regular': require('@/assets/fonts/Quattrocento_Sans/QuattrocentoSans-Regular.ttf'),
    'QuattrocentoSans-Bold': require('@/assets/fonts/Quattrocento_Sans/QuattrocentoSans-Bold.ttf'),
    'QuattrocentoSans-Italic': require('@/assets/fonts/Quattrocento_Sans/QuattrocentoSans-Italic.ttf'),
    'QuattrocentoSans-BoldItalic': require('@/assets/fonts/Quattrocento_Sans/QuattrocentoSans-BoldItalic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdf2f8' }}>
        <ActivityIndicator size="large" color="#f472b6" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8b4d9',
          },
          headerTintColor: '#1f2937',
          headerTitleStyle: {
            fontFamily: 'Quattrocento-Bold',
          },
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}
      >

        <Stack.Screen
          name="index"
          options={{
            title: 'Send a Boop 🐕',
          }}
        />

        <Stack.Screen
          name="success"
          options={{
            title: 'Boop Sent!',
            headerBackVisible: false,
          }}
        />
      </Stack>
    </>
  );
}
