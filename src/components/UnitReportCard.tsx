import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { Colors } from "@/constants/Colors";
import type { Unit } from "@/types";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View, useColorScheme } from "react-native";

type UnitCardProps = { unit: Unit & { today_report: any } };

const UnitCard = ({ unit }: UnitCardProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <Pressable
      onPress={() => {
        router.push(`/reports/detail/${unit.id}`);
      }}
      style={[
        { backgroundColor: Colors[colorScheme || "light"].background },
        styles.card,
      ]}
    >
      <View style={styles.cardContent}>
        <Text style={styles.title}>{unit.asset_code}</Text>
      </View>
      <View style={styles.statusContainer}>
        {unit.today_report ? (
          <Icon name="check-circle" color="green" />
        ) : (
          <Icon name="alert-circle" color="yellow" />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 16,
    elevation: 1,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: 80,
    height: 80,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  statusContainer: {
    justifyContent: "center",
    padding: 16,
  },
});

export { UnitCard, type UnitCardProps };
