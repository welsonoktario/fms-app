import { Icon } from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks";
import type { Unit } from "@/types";
import { $fetch, applyAlpha } from "@/utils";
import { Redirect, Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, useColorScheme } from "react-native";

export default function ReportsLayout() {
  const router = useRouter();
  const { session, isLoading, setUnit } = useSession();
  const colorScheme = useColorScheme();

  const [unitLoading, setUnitLoading] = useState(true);

  useEffect(() => {
    async function getUnit() {
      const res = await $fetch<Unit>(
        `${process.env.EXPO_PUBLIC_API_URL}/units`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        },
      );

      if (res.status === "fail") {
        router.replace("/auth/sign-in");
        return;
      }

      setUnit(res.data);
      setUnitLoading(false);
    }

    if (!isLoading && session) {
      getUnit();
    }
  }, [isLoading, session]);

  if (!session) {
    return <Redirect href="/auth/sign-in" />;
  }

  if (isLoading || unitLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme || "light"].primary,
        headerPressColor: applyAlpha(
          Colors[colorScheme || "light"].primary,
          0.7,
        ),
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
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="home" color={color} />
          ),
          tabBarLabelStyle: {
            fontFamily: "Geist-Medium",
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="history" color={color} />
          ),
          tabBarLabelStyle: {
            fontFamily: "Geist-Medium",
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="account" color={color} />
          ),
          tabBarLabelStyle: {
            fontFamily: "Geist-Medium",
            fontSize: 12,
          },
        }}
      />
    </Tabs>
  );
}
