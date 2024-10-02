import { Text } from "@/components/Text";
import { Colors } from "@/constants/Colors";
import { applyAlpha } from "@/utils/color";
import type React from "react";
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
  useColorScheme,
} from "react-native";

type ButtonVariant =
  | "default"
  | "destructive"
  | "destructiveOutline"
  | "destructiveGhost"
  | "outline"
  | "secondary"
  | "secondaryOutline"
  | "secondaryGhost"
  | "ghost"
  | "link";

type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = "default",
  size = "default",
  disabled = false,
  style,
  textStyle,
}) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        baseStyles.button,
        variantButtonStyles[variant](colors),
        sizeButtonStyles[size],
        pressed && variantButtonPressedStyles[variant](colors),
        disabled && baseStyles.disabledButton,
        style,
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            baseStyles.text,
            variantTextStyles[variant](colors),
            sizeTextStyles[size],
            pressed && variantTextPressedStyles[variant](colors),
            disabled && baseStyles.disabledText,
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

const baseStyles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    fontFamily: "Geist-Regular",
  },
  text: {
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});

const variantButtonStyles: Record<
  ButtonVariant,
  (colors: typeof Colors.light) => ViewStyle
> = {
  default: (colors) => ({ backgroundColor: colors.primary }),
  destructive: (colors) => ({ backgroundColor: colors.destructive }),
  destructiveOutline: (colors) => ({
    backgroundColor: "transparent",
    borderWidth: 0.6,
    borderColor: colors.destructive,
  }),
  destructiveGhost: (colors) => ({
    backgroundColor: "transparent",
  }),
  outline: (colors) => ({
    backgroundColor: "transparent",
    borderWidth: 0.6,
    borderColor: colors.text,
  }),
  secondary: (colors) => ({ backgroundColor: colors.secondary }),
  secondaryOutline: (colors) => ({
    backgroundColor: "transparent",
    borderWidth: 0.6,
    borderColor: colors.secondary,
  }),
  secondaryGhost: (colors) => ({ backgroundColor: "transparent" }),
  ghost: (colors) => ({ backgroundColor: "transparent" }),
  link: (colors) => ({ backgroundColor: "transparent" }),
};

const variantTextStyles: Record<
  ButtonVariant,
  (colors: typeof Colors.light) => TextStyle
> = {
  default: (colors) => ({ color: Colors.dark.text }),
  destructive: (colors) => ({ color: colors.text }),
  destructiveOutline: (colors) => ({ color: colors.destructive }),
  destructiveGhost: (colors) => ({ color: colors.destructive }),
  outline: (colors) => ({ color: colors.text }),
  secondary: (colors) => ({ color: colors.primary }),
  secondaryOutline: (colors) => ({ color: colors.secondary }),
  secondaryGhost: (colors) => ({ color: colors.secondary }),
  ghost: (colors) => ({ color: colors.primary }),
  link: (colors) => ({
    color: colors.primary,
    textDecorationLine: "underline",
  }),
};

const variantButtonPressedStyles: Record<
  ButtonVariant,
  (colors: typeof Colors.light) => ViewStyle
> = {
  default: (colors) => ({ backgroundColor: applyAlpha(colors.primary, 0.9) }),
  destructive: (colors) => ({
    backgroundColor: applyAlpha(colors.destructive, 0.9),
  }),
  destructiveOutline: (colors) => ({
    backgroundColor: applyAlpha(colors.destructive, 0.9),
    borderColor: applyAlpha(colors.destructive, 0.9),
  }),
  destructiveGhost: (colors) => ({
    backgroundColor: applyAlpha(colors.destructive, 0.2),
  }),
  outline: (colors) => ({
    backgroundColor: applyAlpha(colors.primary, 0.9),
    borderColor: applyAlpha(colors.primary, 0.9),
  }),
  secondary: (colors) => ({
    backgroundColor: applyAlpha(colors.secondary, 0.9),
  }),
  secondaryOutline: (colors) => ({
    backgroundColor: applyAlpha(colors.secondary, 0.9),
    borderColor: applyAlpha(colors.secondary, 0.9),
  }),
  secondaryGhost: (colors) => ({
    backgroundColor: applyAlpha(colors.secondary, 0.2),
  }),
  ghost: (colors) => ({ backgroundColor: applyAlpha(colors.primary, 0.2) }),
  link: (colors) => ({ opacity: 0.8 }),
};

const variantTextPressedStyles: Record<
  ButtonVariant,
  (colors: typeof Colors.light) => TextStyle
> = {
  default: () => ({
    color: Colors.dark.text,
  }),
  destructive: (colors) => ({
    color: applyAlpha(colors.text, 0.8),
  }),
  destructiveOutline: (colors) => ({
    color: applyAlpha(colors.destructive, 0.8),
  }),
  destructiveGhost: (colors) => ({
    color: colors.destructive,
  }),
  outline: (colors) => ({
    color: applyAlpha(colors.text, 0.8),
  }),
  secondary: (colors) => ({
    color: applyAlpha(colors.text, 0.8),
  }),
  secondaryOutline: (colors) => ({
    color: applyAlpha(colors.secondary, 0.8),
  }),
  secondaryGhost: (colors) => ({
    color: colors.secondary,
  }),
  ghost: (colors) => ({
    color: colors.primary,
  }),
  link: (colors) => ({
    color: applyAlpha(colors.primary, 0.8),
  }),
};

const sizeButtonStyles: Record<ButtonSize, ViewStyle> = {
  default: { height: 36, paddingHorizontal: 16 },
  sm: { height: 32, paddingHorizontal: 12 },
  lg: { height: 40, paddingHorizontal: 32 },
  icon: { width: 36, height: 36, borderRadius: 9999 },
};

const sizeTextStyles: Record<ButtonSize, TextStyle> = {
  default: { fontSize: 16 },
  sm: { fontSize: 12 },
  lg: { fontSize: 20 },
  icon: { fontSize: 16 },
};

export { Button };
