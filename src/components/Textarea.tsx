import { Colors } from "@/constants/Colors";
import { forwardRef, useState } from "react";
import {
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputProps,
  type TextStyle,
  useColorScheme,
} from "react-native";

type TextAreaProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
};

const TextArea = forwardRef<TextInput, TextAreaProps>(({ style, ...props }, ref) => {
  const colorScheme = useColorScheme();
  const [focused, setFocused] = useState(false);
  const placeholderTextColor = Colors[colorScheme || "light"].muted;
  const textColor = Colors[colorScheme || "light"].text;
  const backgroundColor = Colors[colorScheme || "light"].background;

  return (
    <TextInput
      ref={ref}
      selectionColor={Colors[colorScheme || "light"].primary}
      placeholderTextColor={placeholderTextColor}
      style={[
        styles.textarea,
        {
          color: textColor,
          backgroundColor,
          borderColor: focused
            ? Colors[colorScheme || "light"].ring
            : Colors[colorScheme || "light"].border,
        },
        style,
      ]}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      multiline
      {...props}
    />
  );
});
TextArea.displayName = "TextArea";

const styles = StyleSheet.create({
  textarea: {
    minHeight: 60,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    textAlignVertical: "top",
    fontFamily: "Geist-Regular",
  },
});

export { TextArea };
