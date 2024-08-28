import { useStorageState } from "@/hooks/useStorageState";
import { router } from "expo-router";
import { type PropsWithChildren, createContext } from "react";

export const AuthContext = createContext<{
  signIn: () => void;
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
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          setSession("xxx");
          router.replace("/");
        },
        signOut: () => {
          setSession(null);
          router.replace("/auth/sign-in");
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
