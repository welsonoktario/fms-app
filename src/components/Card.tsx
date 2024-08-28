import { Text } from "@/components/Text";
import { Colors } from "@/constants/Colors";
import React from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  type TextProps,
  type TextStyle,
  View,
  type ViewProps,
  type ViewStyle,
  useColorScheme
} from "react-native";

type CardProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
};

const Card = ({ style, ...props }: CardProps) => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme || "light"].background;
  const borderColor = Colors[colorScheme || "light"].border;

  return (
    <Pressable
      style={[styles.card, { backgroundColor, borderColor }, style]}
      {...props}
    />
  );
};
Card.displayName = "Card";

type CardHeaderProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

const CardHeader = React.forwardRef<View, CardHeaderProps>(({ style, ...props }, ref) => {
  return <View ref={ref} style={[styles.cardHeader, style]} {...props} />;
});
CardHeader.displayName = "CardHeader";

type CardTitleProps = TextProps & {
  style?: StyleProp<TextStyle>;
};

const CardTitle = ({ style, ...props }: CardTitleProps) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme || "light"].text;

  return <Text style={[styles.cardTitle, { color }, style]} {...props} />;
};
CardTitle.displayName = "CardTitle";

type CardDescriptionProps = TextProps & {
  style?: StyleProp<TextStyle>;
};

const CardDescription = ({ style, ...props }: CardDescriptionProps) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme || "light"].muted;

  return <Text style={[styles.cardDescription, { color }, style]} {...props} />;
};
CardDescription.displayName = "CardDescription";

type CardContentProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

const CardContent = React.forwardRef<View, CardContentProps>(
  ({ style, ...props }, ref) => {
    return <View ref={ref} style={[styles.cardContent, style]} {...props} />;
  }
);
CardContent.displayName = "CardContent";

type CardFooterProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

const CardFooter = React.forwardRef<View, CardFooterProps>(({ style, ...props }, ref) => {
  return <View ref={ref} style={[styles.cardFooter, style]} {...props} />;
});
CardFooter.displayName = "CardFooter";

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "column",
    padding: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: "Geist-SemiBold",
    fontSize: 18,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
  },
});

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
