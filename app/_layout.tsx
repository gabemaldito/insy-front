import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "@shopify/react-native-skia";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import "../global.css";

import { theme } from "../constants/theme";
import { supabase } from "../utils/supabase";
import { useInsyStore } from "../store/useInsyStore";
import { useRouter, useSegments } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const setUser = useInsyStore((state) => state.setUser);
  const session = useInsyStore((state) => state.session);
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Checar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session, session?.user ?? null);
      setIsReady(true);
    });

    // 2. Escutar mudanças de auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session, session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 3. Capturar Magic Links vindos de fora do app
  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;
      
      const parsed = Linking.parse(url);
      const fragment = url.split("#")[1];
      let access_token = parsed.queryParams?.access_token as string;
      let refresh_token = parsed.queryParams?.refresh_token as string;

      if (!access_token && fragment) {
        const params = new URLSearchParams(fragment);
        access_token = params.get("access_token") || "";
        refresh_token = params.get("refresh_token") || "";
      }

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (!error) console.log("-> Magic Link: Sessão ativada via Deep Link!");
      }
    };

    Linking.getInitialURL().then(handleDeepLink);
    const subscription = Linking.addEventListener("url", (event) => handleDeepLink(event.url));

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isReady || !loaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      // Se não houver sessão e não estiver no grupo auth, vai pra login
      router.replace("/(auth)");
    } else if (session && inAuthGroup) {
      // Se houver sessão e estiver no login, vai pro dashboard
      router.replace("/(tabs)");
    }
  }, [session, segments, isReady, loaded]);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady]);

  if (!loaded || !isReady) {
    return null;
  }

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: theme.colors.background,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={customDarkTheme}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.colors.background },
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
