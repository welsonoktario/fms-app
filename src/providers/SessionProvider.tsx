import { useStorageState } from "@/hooks/useStorageState";
import { router } from "expo-router";
import { type PropsWithChildren, createContext } from "react";

export const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session"); // Store session token

  const signIn = async (email: string, password: string) => {
    try {
      // Use fetch to send a POST request to the Laravel backend for sign-in
      const response = await fetch(`http://10.10.0.58:8000/api/auth/login`, {
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

      // Assuming the Sanctum token is in the response, store it securely
      const token = data.token; // Adjust this based on your Laravel response structure

      // Set session token and loading state
      setSession(token);

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
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
