import { Block, Text } from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { useSession } from "@/hooks/useSession";
import { Redirect, useRouter } from "expo-router";
import { View } from "react-native";

export default function Menu() {
  const { session } = useSession();
  const router = useRouter();

  if (!session) {
    return <Redirect href="/auth/sign-in" />;
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <Card onPress={() => router.navigate("/reports")} style={{ width: "100%" }}>
        <CardHeader>
          <CardTitle>Checklist Unit</CardTitle>
        </CardHeader>
      </Card>
    </View>
  );
}
