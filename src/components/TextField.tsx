import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
  useColorScheme,
} from "react-native";

interface TextFieldProps extends TextInputProps {
  style?: StyleProp<TextStyle>; // Custom style prop
}

const TextField: React.FC<TextFieldProps> = React.forwardRef<TextInput, TextFieldProps>(
  ({ style, ...props }, ref) => {
    const scheme = useColorScheme();
    const [focused, setFocused] = useState(false);
    const placeholderTextColor = Colors[scheme || "light"].mutedForeground;

    return (
      <TextInput
        ref={ref}
        selectionColor={Colors[scheme || "light"].primary}
        placeholderTextColor={placeholderTextColor}
        style={[
          styles.input,
          {
            color: Colors[scheme || "light"].text,
            backgroundColor: Colors[scheme || "light"].background,
            borderColor: focused
              ? Colors[scheme || "light"].ring
              : Colors[scheme || "light"].border,
          },
          style,
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 0.8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: "Geist-Regular",
  } as ViewStyle,
});

export { TextField };
