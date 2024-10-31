import {
  Button,
  Card,
  CardContent,
  CardTitle,
  ListItem,
  Text,
} from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks/useSession";
import type { UnitReportDriver } from "@/types";
import { $fetch, applyAlpha, isInProjectsLocation } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import Constants from "expo-constants";
import {
  type LocationObject,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import MapView, {
  Callout,
  Circle,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";

const isRunningInExpoGo = Constants.appOwnership === "expo";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const getTodayHistory = async (
  session: string,
): Promise<UnitReportDriver[]> => {
  const res = await $fetch<UnitReportDriver[]>(
    `${BASE_URL}/daily-monitoring-units/today`,
    {
      headers: { Authorization: `Bearer ${session}` },
    },
  );

  if (res.status === "fail") {
    throw new Error(res.message);
  }

  return res.data;
};

export default function Home() {
  const { session, unit, signOut } = useSession();
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);

  const [location, setLocation] = useState<LocationObject | null>(null);

  const { data, isPending, refetch } = useQuery({
    queryKey: ["today-reports"],
    queryFn: () => getTodayHistory(session!),
  });

  useEffect(() => {
    (async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const currentLocation = await getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  useEffect(() => {
    if (unit?.project?.location && unit.project.radius) {
      mapRef.current?.animateCamera({
        center: {
          latitude: unit.project.location.coordinates[1],
          longitude: unit.project.location.coordinates[0],
        },
        zoom: 16,
      });
    }
  }, [unit]);

  const handleAddChecklist = async () => {
    const location = await getCurrentPositionAsync({});

    if (unit?.project?.location && unit.project.radius) {
      // Check if distance is within the radius
      if (isInProjectsLocation(unit.project, location.coords)) {
        router.navigate("/reports/create");
      } else {
        Alert.alert("Error", "Anda berada diluar jangkauan proyek", [
          {
            text: "OK",
          },
        ]);
      }
    }
  };

  const formatRadius = (radius: number) => {
    const formattedRadius = Number(radius).toFixed(2); // Format to 2 decimals initially
    const decimalPart = formattedRadius.split(".")[1]; // Get the decimal part

    // Remove decimals if it's .00
    if (decimalPart === "00") {
      return Number(formattedRadius).toFixed(0);
    }

    // Show one decimal if it's like .50, .10, .20, etc.
    if (decimalPart[1] === "0") {
      return Number(formattedRadius).toFixed(1);
    }

    // Otherwise, show two decimals
    return formattedRadius;
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isPending} onRefresh={refetch} />
      }
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
      }}
    >
      <Text variant="h5">
        Unit {unit?.asset_code}{" "}
        {unit?.project ? `(${unit?.project?.name})` : null}
      </Text>

      <View
        style={{
          marginTop: 16,
          height: 300,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <MapView
          ref={(map) => {
            mapRef.current = map;
          }}
          loadingEnabled={!location}
          provider={
            Platform.OS === "ios" && !isRunningInExpoGo
              ? PROVIDER_GOOGLE
              : undefined
          }
          style={{ width: "100%", height: "100%" }}
          loadingIndicatorColor={Colors.light.primary}
          showsUserLocation
        >
          {unit?.project?.location?.coordinates && unit.project.radius ? (
            <>
              <Marker
                title={unit.project.name}
                coordinate={{
                  latitude: unit.project.location.coordinates[1],
                  longitude: unit.project.location.coordinates[0],
                }}
              >
                <Callout tooltip={true}>
                  <Card>
                    <CardTitle>{unit.project.name}</CardTitle>
                    <CardContent>
                      <Text>
                        Jangkauan proyek:{" "}
                        {formatRadius(Number(unit.project.radius))}m
                      </Text>
                    </CardContent>
                  </Card>
                </Callout>
              </Marker>
              <Circle
                center={{
                  latitude: unit.project.location.coordinates[1],
                  longitude: unit.project.location.coordinates[0],
                }}
                radius={Number(unit.project.radius)}
                fillColor={applyAlpha(Colors.light.primary, 0.2, "rgba")}
                strokeColor={applyAlpha(Colors.light.primary, 0.5, "rgba")}
              />
            </>
          ) : null}
        </MapView>
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
                handleAddChecklist();
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
                      history.status_unit === "READY"
                        ? "check-circle"
                        : "close-circle"
                    }
                    iconColor={
                      history.status_unit === "READY" ? "green" : "red"
                    }
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
