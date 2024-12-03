import { Button, ListItem, Text } from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { Image, ScrollView, View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SvgUri } from "react-native-svg";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function Profile() {
  const router = useRouter();
  const session = useSession();
  const colorScheme = useColorScheme();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const handleShowBarcode = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <GestureHandlerRootView>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          flexDirection: "column",
          rowGap: 8,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <BottomSheetModalProvider>
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
                src={`${BASE_URL}/storage/${session.unit?.image_unit}`}
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

          <Button onPress={handleShowBarcode} style={{ marginBottom: 8 }}>
            Tampilkan Barcode Unit
          </Button>

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

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enableDynamicSizing={false}
          >
            <BottomSheetView
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                rowGap: 8,
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 32,
              }}
            >
              {session.unit ? (
                <SvgUri
                  uri={`${BASE_URL}/${session.unit?.image_barcode}`}
                  width="100%"
                  height="100%"
                />
              ) : null}
              <Text variant="h6">{session.unit?.asset_code}</Text>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
