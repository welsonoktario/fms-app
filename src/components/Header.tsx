import { Colors } from "@/constants/Colors";
import { applyAlpha, darkTheme, lightTheme } from "@/utils";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Pressable, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "./Icon";
import { Text } from "./Text";

export function Header(props: NativeStackHeaderProps) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={{
        paddingTop: 30,
        paddingHorizontal: 20,
        flex: 1,
        flexDirection: "row",
        height: 100,
        alignItems: "center",
        columnGap: 16,
        backgroundColor:
          colorScheme === "dark"
            ? darkTheme.colors.background
            : lightTheme.colors.background,
      }}
    >
      {props.navigation.canGoBack() && (
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={({ pressed }) => ({
            flex: 1,
            maxHeight: 32,
            maxWidth: 32,
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
        <Text variant="h4" style={{ height: 28 }}>
          {String(props.options.headerTitle)}
        </Text>
      ) : null}
      {props.options.headerRight
        ? props.options.headerRight({
            canGoBack: props.navigation.canGoBack(),
          })
        : null}
    </SafeAreaView>
  );
}
