import { Colors } from "@/constants/Colors";
import { type StyleProp, type TextStyle, useColorScheme } from "react-native";
import VectorIcon from "react-native-vector-icons/MaterialCommunityIcons";

type IconProps = {
  name: typeof VectorIcon.name;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color, style }) => {
  const colorScheme = useColorScheme();
  const defaultStyle: TextStyle = {
    lineHeight: size,
  };

  return (
    <VectorIcon
      name={name}
      size={size}
      color={color || Colors[colorScheme || "light"].background}
      style={[defaultStyle, style]}
    />
  );
};

export { Icon };
