import { Colors } from "@/constants/Colors";
import { applyAlpha } from "@/utils";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Pressable, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Block } from "./Block";
import { Icon } from "./Icon";
import { Text } from "./Text";

export function Header(props: NativeStackHeaderProps) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 20,
        minHeight: 104,
        justifyContent: "space-between",
        backgroundColor:
          colorScheme === "dark"
            ? DarkTheme.colors.background
            : DefaultTheme.colors.background,
      }}
    >
      <Block alignItems="center" columnGap={16} row>
        {props.navigation.canGoBack() && (
          <Pressable
            onPress={() => props.navigation.goBack()}
            style={({ pressed }) => ({
              flex: 1,
              maxHeight: 36,
              maxWidth: 36,
              paddingRight: 2,
              alignItems: "center",
              justifyContent: "center",
              aspectRatio: "1 / 1",
              backgroundColor: pressed
                ? applyAlpha(Colors[colorScheme || "light"].primary, 0.7)
                : Colors[colorScheme || "light"].primary,
              borderRadius: 9999,
            })}
          >
            <Icon name="chevron-left" color="white" />
          </Pressable>
        )}
        {props.options.headerTitle ? (
          <Text variant="h3">{String(props.options.headerTitle)}</Text>
        ) : null}
      </Block>
    </SafeAreaView>
  );
}
