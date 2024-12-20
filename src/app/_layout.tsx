import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/hooks/useSession";
import { SessionProvider } from "@/providers/SessionProvider";
import { darkTheme, lightTheme } from "@/utils";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { setDefaultOptions } from "date-fns";
import { id } from "date-fns/locale";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

/* export const unstable_settings = {
  initialRouteName: "index",
}; */

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
setDefaultOptions({
  locale: id,
});

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
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    async function checkAndApplyUpdates() {
      try {
        // Check if an update is available
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setUpdateAvailable(true);
          // Download the update
          await Updates.fetchUpdateAsync();
          // Apply the update (you can choose to reload the app right after)
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error("Error checking or applying updates", error);
      }
    }

    if (!__DEV__) {
      checkAndApplyUpdates();
    }
  }, []);

  useEffect(() => {
    if (__DEV__) {
      if (!isLoading && fontLoaded) {
        SplashScreen.hideAsync();
      }
    } else {
      if (!isLoading && fontLoaded && !updateAvailable) {
        SplashScreen.hideAsync();
      }
    }
  }, [fontLoaded, isLoading, updateAvailable]);

  if (!fontLoaded || isLoading || (!__DEV__ && updateAvailable)) {
    // While font or session is loading, or if an update is in progress, keep the screen blank
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? darkTheme : lightTheme}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <AutocompleteDropdownContextProvider>
            <Stack
              screenOptions={{
                headerBackTitleVisible: false,
                headerTitleStyle: {
                  fontFamily: "Geist-SemiBold",
                  fontSize: 18,
                },
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerTitle: "Home",
                  headerBackButtonMenuEnabled: false,
                  headerBackVisible: false,
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="auth/sign-in"
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="reports/create"
                options={{
                  headerTitle: "Tambah Checklist Unit",
                }}
              />

              <Stack.Screen
                name="reports/detail/[id]"
                options={{
                  headerTitle: "Detail Checklist",
                }}
              />

              <Stack.Screen
                name="camera"
                options={{
                  headerTitle: "Ambil Foto Unit",
                }}
              />

              <Stack.Screen name="+not-found" />
            </Stack>
          </AutocompleteDropdownContextProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
