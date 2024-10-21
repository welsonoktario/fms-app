import { Icon } from "@/components/Icon";
import { Colors } from "@/constants/Colors";
import type React from "react";
import {
  type StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewProps,
  type ViewStyle,
  useColorScheme,
} from "react-native";

// RadioGroup Component
interface RadioGroupProps extends ViewProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  children,
  style,
}) => {
  return <View style={[styles.group, style]}>{children}</View>;
};

// RadioGroupItem Component
interface RadioGroupItemProps extends ViewProps {
  value: string;
  selectedValue: string;
  onPress: (value: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  selectedValue,
  onPress,
  disabled,
  style,
}) => {
  const isSelected = value === selectedValue;
  const scheme = useColorScheme(); // Get current color scheme

  const themeColors = Colors[scheme || "light"]; // Fallback to light if scheme is undefined

  return (
    <TouchableOpacity
      style={[
        styles.radioItem,
        {
          borderColor: isSelected ? themeColors.primary : themeColors.border,
          backgroundColor: themeColors.background,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={() => onPress(value)}
      disabled={disabled}
    >
      {isSelected && (
        <Icon name="check" size={18} color={themeColors.primary} />
      )}
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  group: {
    flexDirection: "column",
    gap: 8,
  },
  radioItem: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

export { RadioGroup, RadioGroupItem };
