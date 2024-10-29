import { useStorageState } from "@/hooks/useStorageState";
import type { Unit } from "@/types";
import { router } from "expo-router";
import { type PropsWithChildren, createContext, useState } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  unit?: Unit;
  setUnit: (unit: Unit | undefined) => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  unit: undefined,
  setUnit: (unit: Unit | undefined) => null,
  session: null,
  isLoading: false,
});

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session"); // Store session token
  const [unit, setUnit] = useState<Unit | undefined>(undefined);

  const signIn = async (email: string, password: string) => {
    try {
      // Use fetch to send a POST request to the Laravel backend for sign-in
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const { status, data, message } = await response.json();

      if (!response.ok) {
        throw new Error(message);
      }

      if (status === "fail") {
        throw new Error(message);
      }

      const token = data.token;

      // Set session token and loading state
      setSession(token);

      // Navigate to the home screen after successful login
      if (router.canGoBack()) {
        router.dismissAll();
      }
      router.replace("/");
    } catch (e: any) {
      console.error("Login error:", e);
      Alert.alert("Login Gagal", e.message);
      setSession(null);
    }
  };

  const signOut = () => {
    setSession(null);

    router.replace("/auth/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        unit,
        setUnit,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
