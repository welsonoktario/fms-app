import { Redirect, Tabs } from "expo-router";

import { type IconName, TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/hooks/useSession";

const reportScreens = [
  {
    name: "index",
    title: "Home",
    icon: "home-outline",
    iconFocused: "home",
  },
  {
    name: "explore",
    title: "Explore",
    icon: "code-brackets",
    iconFocused: "code-brackets",
  },
] satisfies {
  name: string;
  title: string;
  icon: IconName;
  iconFocused: IconName;
}[];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/auth/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      {reportScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarLabelStyle: {
              fontFamily: "Geist-Regular",
              fontSize: 12,
            },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? screen.iconFocused : screen.icon}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
