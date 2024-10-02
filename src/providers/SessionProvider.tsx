import { useStorageState } from "@/hooks/useStorageState";
import type { Unit } from "@/types";
import { router } from "expo-router";
import { type PropsWithChildren, createContext } from "react";

export const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  unit: Unit | null;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  unit: null,
  session: null,
  isLoading: false,
});

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session"); // Store session token
  const [[isUnitLoading, unit], setUnit] = useStorageState("unit");

  const signIn = async (email: string, password: string) => {
    try {
      // Use fetch to send a POST request to the Laravel backend for sign-in
      const response = await fetch(BASE_URL + "/auth/login", {
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

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { status, data } = await response.json();

      const token = data.token;

      // Set session token and loading state
      setSession(token);
      setUnit(JSON.stringify(data.unit));

      // Navigate to the home screen after successful login
      if (router.canGoBack()) {
        router.dismissAll();
      }
      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      setSession(null);
    }
  };

  const signOut = () => {
    setSession(null);
    setUnit(null);

    if (router.canGoBack()) {
      router.dismissAll();
    }

    router.replace("/auth/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        unit: unit ? JSON.parse(unit) : null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
