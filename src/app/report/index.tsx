import { View } from "react-native";

import { Button, Text } from "@/components";
import { useSession } from "@/hooks/useSession";

export default function HomeScreen() {
  const { signOut } = useSession();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hello world!</Text>
      <Button variant="destructiveGhost" onPress={signOut}>
        Sign Out
      </Button>
    </View>
  );
}
