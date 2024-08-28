import { Button, Text, TextField } from "@/components";
import { useSession } from "@/hooks/useSession";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { session, signIn } = useSession();

  if (session) {
    return <Redirect href="/" />;
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
          Sign In
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
            />
          </View>
          <View style={{ flexDirection: "column", rowGap: 4 }}>
            <Text>Password</Text>
            <TextField
              placeholder="******"
              textContentType="password"
              autoComplete="password"
              secureTextEntry
            />
          </View>

          <Button onPress={signIn} style={{ marginTop: 8 }}>
            Sign In
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
