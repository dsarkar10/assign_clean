import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PendingActionsScreen } from './src/screens/PendingActionsScreen';
import { colors, typography } from '@clear-energy/shared';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    JetBrainsMono_500Medium,
  });

  const onNavigationReady = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Animated.View entering={FadeIn.duration(350)} style={{ flex: 1, backgroundColor: colors.bg }}>
          <NavigationContainer onReady={onNavigationReady}>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: colors.bg },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: {
                  fontFamily: typography.fontFamily.bodyMedium,
                  fontSize: typography.size.lg,
                },
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen
                name="PendingActions"
                component={PendingActionsScreen}
                options={{ title: 'Pending Actions' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Animated.View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
