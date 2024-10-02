import { ListItem, Text } from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks";
import { useRouter } from "expo-router";
import { Image, ScrollView, View, useColorScheme } from "react-native";

export default function Profile() {
  const router = useRouter();
  const session = useSession();
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        flexDirection: "column",
        rowGap: 8,
        paddingVertical: 20,
        paddingHorizontal: 20,
      }}
    >
      {session.unit ? (
        <View
          style={{
            backgroundColor: Colors[colorScheme || "light"].background,
            borderRadius: 16,
            marginBottom: 12,
            padding: 16,
            elevation: 2,
            flexDirection: "row",
            columnGap: 20,
          }}
        >
          <Image
            src={session.unit.image_unit}
            width={100}
            height={100}
            style={{ height: 100, width: 100, borderRadius: 8 }}
          />
          <View style={{ flex: 1, flexDirection: "column", rowGap: 8 }}>
            <View>
              <Text variant="h6">Kode Aset</Text>
              <Text>{session.unit.asset_code}</Text>
            </View>
            <View>
              <Text variant="h6">Plat Nomor</Text>
              <Text>{session.unit.plate}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <ListItem
        title="Riwayat"
        icon="history"
        onPress={() => {
          router.navigate("/(tabs)/history");
        }}
        detail
      />
      <ListItem
        title="Keluar"
        icon="logout"
        onPress={() => {
          session.signOut();
        }}
        detail
      />
    </ScrollView>
  );
}
