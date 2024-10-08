import { Button, Text, TextField } from "@/components";
import { useSession } from "@/hooks/useSession";
import { Redirect } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { session, signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          rowGap: 50,
          paddingVertical: 20,
        }}
      >
        <Text variant="h1" style={{ textAlign: "center", paddingTop: "20%" }}>
          Checklist Unit
        </Text>

        <View
          style={{
            flexDirection: "column",
            rowGap: 16,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              rowGap: 4,
            }}
          >
            <Text variant="body1">Email</Text>
            <TextField
              placeholder="user@gmail.com"
              textContentType="emailAddress"
              autoComplete="email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={{ flexDirection: "column", rowGap: 4 }}>
            <Text>Password</Text>
            <TextField
              placeholder="******"
              textContentType="password"
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button
            onPress={() => {
              signIn(email, password);
            }}
            style={{ marginTop: 8 }}
          >
            Masuk
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
