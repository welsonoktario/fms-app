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
    <View style={{ flex: 1, padding: 20, marginTop: 40 }}>
      <Block gap={10} style={{ maxHeight: 180 }} row>
        <Card onPress={() => router.navigate("/reports")} style={{ flex: 1 }}>
          <CardHeader>
            <CardTitle>Lapor</CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="body2">Hello World!</Text>
          </CardContent>
        </Card>
      </Block>
    </View>
  );
}
