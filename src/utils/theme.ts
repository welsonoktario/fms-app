import { Colors } from "@/constants/Colors";
import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const lightTheme: Theme = {
  colors: {
    ...DefaultTheme.colors,
    background: "hsl(0, 8%, 97%)",
    border: Colors.light.border,
    card: Colors.light.background,
    primary: Colors.light.primary,
    text: Colors.light.text,
  },
  dark: false,
};

export const darkTheme: Theme = {
  colors: {
    ...DarkTheme.colors,
    background: "hsl(0, 0%, 4%)",
    border: Colors.dark.border,
    card: Colors.dark.background,
    primary: Colors.dark.primary,
    text: Colors.dark.text,
  },
  dark: true,
};
