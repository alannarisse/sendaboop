import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
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
            fontWeight: 'bold',
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
