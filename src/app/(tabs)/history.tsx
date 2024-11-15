import { Button, Card, CardContent, CardTitle, Text } from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks";
import type { UnitReport, UnitReportDriver } from "@/types";
import { $fetch, isInProjectsLocation } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { getCurrentPositionAsync } from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type HistoryType = Record<string, UnitReportDriver[]>;

const getHistory = async (session: string): Promise<HistoryType> => {
  const res = await $fetch<HistoryType>(`${BASE_URL}/daily-monitoring-units`, {
    headers: { Authorization: `Bearer ${session}` },
  });

  if (res.status === "fail") {
    throw new Error(res.message);
  }

  return res.data;
};

const HistoryCard: React.FC<{ history: UnitReportDriver }> = ({ history }) => {
  const router = useRouter();
  const statusColorMap: Record<UnitReport["status_unit"], string> = {
    READY: Colors.light.primary,
    "NOT READY": Colors.light.destructive,
    "NEEDS MAINTENANCE": "#F09F0A",
  };

  return (
    <Card
      key={`history-${history.id}`}
      onPress={() => {
        router.navigate(`/reports/detail/${history.id}`);
      }}
    >
      <CardTitle>{formatDate(history.created_at!, "dd-MM-y")}</CardTitle>
      <CardContent>
        <Text>Driver: {history.driver.name}</Text>
        <Text>
          Status:{" "}
          <Text
            style={{
              color: statusColorMap[history.status_unit],
            }}
          >
            {history.status_unit}
          </Text>
        </Text>
        <Text>Isu: {history.issue || "-"}</Text>
      </CardContent>
    </Card>
  );
};

export default function History() {
  const { session, unit } = useSession();
  const router = useRouter();
  const [checklistLoading, setChecklistLoading] = useState(false);

  const { data, isPending, refetch } = useQuery({
    queryKey: ["history"],
    queryFn: () => getHistory(session!),
  });

  const dataLength = data ? Object.keys(data).length : undefined;

  const handleAddChecklistPress = async () => {
    setChecklistLoading(true);
    if (unit?.project?.location && unit.project.radius) {
      const location = await getCurrentPositionAsync();

      if (isInProjectsLocation(unit.project, location.coords)) {
        router.navigate("/reports/create");
      } else {
        Alert.alert("Error", "Anda berada diluar jangkauan proyek", [
          {
            text: "OK",
          },
        ]);
      }
    } else {
      router.navigate("/(tabs)");
    }
    setChecklistLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "column",
        rowGap: 8,
        padding: 20,
        flex: 1,
      }}
      refreshControl={
        <RefreshControl refreshing={isPending} onRefresh={refetch} />
      }
    >
      {data ? (
        dataLength! > 0 ? (
          Object.entries(data).map(([date, histories]) => (
            <View key={date}>
              <Text>{date}</Text>
              <View
                style={{
                  marginTop: 8,
                  flexDirection: "column",
                  rowGap: 8,
                  marginBottom: 16,
                }}
              >
                {histories.map((history) => (
                  <HistoryCard
                    key={`history-${history.id}`}
                    history={history}
                  />
                ))}
              </View>
            </View>
          ))
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text>Belum ada riwayat checklist</Text>
            <Button
              style={{ marginTop: 16 }}
              onPress={() => {
                handleAddChecklistPress();
              }}
              disabled={checklistLoading}
            >
              Tambah Checklist
            </Button>
          </View>
        )
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      )}
    </ScrollView>
  );
}
