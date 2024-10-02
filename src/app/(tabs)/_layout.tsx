import { Button, Icon } from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks";
import { applyAlpha } from "@/utils";
import { Redirect, Tabs, useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export default function ReportsLayout() {
  const router = useRouter();
  const session = useSession();
  const colorScheme = useColorScheme();

  if (!session.session) {
    return <Redirect href="/auth/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme || "light"].primary,
        headerPressColor: applyAlpha(Colors[colorScheme || "light"].primary, 0.7),
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontFamily: "Geist-SemiBold",
          fontSize: 20,
        },
        headerLeftContainerStyle: {
          marginLeft: 20,
        },
        headerRightContainerStyle: {
          marginEnd: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Unit",
          tabBarIcon: ({ color }) => <Icon size={28} name="truck" color={color} />,
          tabBarLabelStyle: {
            fontFamily: "Geist-Medium",
            fontSize: 12,
          },
          headerRight: () => (
            <Button
              size="icon"
              onPress={() => {
                router.navigate("/reports/create");
              }}
            >
              <Icon name="plus" color={Colors[colorScheme || "light"].background} />
            </Button>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color }) => <Icon size={28} name="history" color={color} />,
          tabBarLabelStyle: {
            fontFamily: "Geist-Medium",
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <Icon size={28} name="account" color={color} />,
          tabBarLabelStyle: {
            fontFamily: "Geist-Medium",
            fontSize: 12,
          },
        }}
      />
    </Tabs>
  );
}
