// ListItem.tsx
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { Colors } from "@/constants/Colors";
import { applyAlpha } from "@/utils";
import { Pressable, StyleSheet, View, useColorScheme } from "react-native";

// Define the props interface
interface ListItemProps {
  title: string;
  description?: string;
  icon?: string; // Optional icon path for an image
  detail?: boolean;
  onPress: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  icon,
  detail,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const listBgColor = Colors[colorScheme || "light"].background;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? applyAlpha(listBgColor, 0.7) : listBgColor,
        },
      ]}
      onPress={onPress}
    >
      <View style={{ marginRight: icon ? 16 : 0 }}>
        {icon ? <Icon name={icon} style={styles.icon} size={28} /> : null}
      </View>
      <View style={styles.textContainer}>
        <Text variant="body1">{title}</Text>
        {description ? <Text variant="body2">{description}</Text> : null}
      </View>
      {detail ? <Icon name="chevron-right" size={28} /> : null}
    </Pressable>
  );
};

// Styles for the ListItem component
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 8,
  },
  icon: {
    textAlign: "center",
    width: 28,
    height: 28,
  },
  textContainer: {
    flex: 1,
  },
});

export { ListItem };