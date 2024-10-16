import { Button, Card, CardContent, CardTitle, ListItem, Text } from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks/useSession";
import type { UnitReportDriver } from "@/types";
import { $fetch } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import {
  type LocationObject,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const getTodayHistory = async (session: string): Promise<UnitReportDriver[]> => {
  const res = await $fetch<UnitReportDriver[]>(
    `${BASE_URL}/daily-monitoring-units/today`,
    {
      headers: { Authorization: `Bearer ${session}` },
    }
  );

  if (res.status === "fail") {
    throw new Error(res.message);
  }

  return res.data;
};

export default function Reports() {
  const { session, unit } = useSession();
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);

  const [location, setLocation] = useState<LocationObject | null>(null);

  const { data, isPending, refetch } = useQuery({
    queryKey: ["today-reports"],
    queryFn: () => getTodayHistory(session!),
  });

  useEffect(() => {
    (async () => {
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let currentLocation = await getCurrentPositionAsync({});
      setLocation(currentLocation);
      mapRef.current?.setCamera({
        center: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        zoom: 16,
      });
    })();
  }, []);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
      }}
    >
      <Text variant="h5">
        Unit {unit?.asset_code} {unit?.project ? `(${unit?.project?.name})` : null}
      </Text>

      <View style={{ marginTop: 16, height: 250, borderRadius: 8, overflow: "hidden" }}>
        <MapView
          ref={(map) => (mapRef.current = map)}
          loadingEnabled={!location}
          provider={PROVIDER_GOOGLE}
          style={{ width: "100%", height: "100%" }}
          loadingIndicatorColor={Colors["light"].primary}
          showsUserLocation
          followsUserLocation
        />
      </View>

      {!isPending && data !== undefined ? (
        <Card
          style={{
            marginTop: 32,
            backgroundColor: "transparent",
            elevation: 0,
            borderColor: "transparent",
          }}
        >
          <CardTitle style={{ margin: 0 }}>Checklist Hari Ini</CardTitle>
          <CardContent style={{ marginTop: 8, paddingHorizontal: 0 }}>
            <Button
              style={{ marginBottom: 12 }}
              onPress={() => {
                router.navigate("/reports/create");
              }}
            >
              Tambah Checklist
            </Button>
            <View style={{ rowGap: 8 }}>
              {data.length === 0 ? (
                <Text style={{ textAlign: "center" }}>Belum ada data</Text>
              ) : (
                data.map((history) => (
                  <ListItem
                    key={history.id}
                    onPress={() => {
                      router.navigate(`/reports/detail/${history.id}`);
                    }}
                    icon={
                      history.status_unit === "READY" ? "check-circle" : "close-circle"
                    }
                    iconColor={history.status_unit === "READY" ? "green" : "red"}
                    title={`${history.driver.name} - ${formatDate(history.created_at!, "HH:mm:ss")}`}
                    detail
                  />
                ))
              )}
            </View>
          </CardContent>
        </Card>
      ) : null}
    </ScrollView>
  );
}
