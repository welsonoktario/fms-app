/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    primary: "hsl(236, 71%, 48%)",
    secondary: "hsl(0, 0%, 96.1%)",
    muted: "hsl(0, 0%, 96.1%)",
    mutedForeground: "hsl(0 0% 45.1%)",
    destructive: "hsl(0, 84.2%, 60.2%)",
    text: "hsl(0, 0%, 3.9%)",
    background: "hsl(0, 0%, 100%)",
    border: "hsl(0, 0%, 89.8%)",
    ring: "hsl(0, 0%, 3.9%)",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: "hsl(236, 66%, 53%)",
    secondary: "hsl(0, 0%, 14.9%)",
    muted: "hsl(0, 0%, 14.9%)",
    mutedForeground: "hsl(0 0% 63.9%)",
    destructive: "hsl(0, 35%, 45%)",
    text: "hsl(0, 0%, 98%)",
    background: "hsl(240, 4%, 9%)",
    border: "hsl(0, 0%, 14.9%)",
    ring: "hsl(0, 0%, 83.1%)",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
