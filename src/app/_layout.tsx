import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/hooks/useSession";
import { SessionProvider } from "@/providers/SessionProvider";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontLoaded] = useFonts({
    "Geist-Thin": require("../assets/fonts/Geist-Thin.ttf"),
    "Geist-UltraLight": require("../assets/fonts/Geist-UltraLight.ttf"),
    "Geist-Light": require("../assets/fonts/Geist-Light.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
    "Geist-Black": require("../assets/fonts/Geist-Black.ttf"),
    "Geist-UltraBlack": require("../assets/fonts/Geist-UltraBlack.ttf"),
  });
  const { isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, isLoading]);

  if (!fontLoaded || isLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerTitle: "Menu",
              }}
            />

            <Stack.Screen name="auth/sign-in" options={{ headerShown: false }} />

            <Stack.Screen name="report" options={{ headerShown: false }} />

            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
