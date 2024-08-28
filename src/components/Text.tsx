import { Colors } from "@/constants/Colors";
import type React from "react";
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  useColorScheme,
} from "react-native";

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "button"
  | "caption"
  | "overline";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  style?: StyleProp<TextStyle>;
}

const Text: React.FC<TextProps> = ({ variant = "body1", style, ...props }) => {
  const scheme = useColorScheme();
  const textStyle = styles[variant] || styles.body1;

  return (
    <RNText
      style={[
        textStyle,
        { color: scheme === "dark" ? Colors.dark.text : Colors.light.text },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: "Geist-Bold",
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: "Geist-Bold",
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Geist-Bold",
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Geist-Bold",
  },
  h5: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: "Geist-Bold",
  },
  h6: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Geist-Bold",
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Geist-Medium",
  },
  subtitle2: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Geist-Medium",
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Geist-Regular",
  },
  body2: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Geist-Regular",
  },
  button: {
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: "Geist-Medium",
  },
  caption: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Geist-Regular",
  },
  overline: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "Geist-Regular",
  },
});

export { Text };
