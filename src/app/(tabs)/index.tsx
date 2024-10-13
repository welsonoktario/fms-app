import { Card, CardContent, CardTitle, ListItem, Text } from "@/components";
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
import React, { useEffect, useState } from "react";
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

      let location = await getCurrentPositionAsync({});
      setLocation(location);
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
          loadingEnabled={!location}
          provider={PROVIDER_GOOGLE}
          style={{ width: "100%", height: "100%" }}
          showsUserLocation
          followsUserLocation
        />
      </View>

      {!isPending && data ? (
        <Card style={{ marginTop: 16 }}>
          <CardTitle>Checklist Hari Ini</CardTitle>
          <CardContent>
            {data.length === 0 ? (
              <Text style={{ marginTop: 16, textAlign: "center" }}>Belum ada data</Text>
            ) : (
              data.map((history) => (
                <ListItem
                  key={history.id}
                  onPress={() => {}}
                  title={formatDate(history.created_at!, "dd-MM-y")}
                />
              ))
            )}
          </CardContent>
        </Card>
      ) : null}
    </ScrollView>
  );
}
