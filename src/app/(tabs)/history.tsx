import { Card, CardContent, CardTitle, Text } from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks";
import type { UnitReportDriver } from "@/types";
import { $fetch } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { RefreshControl, ScrollView, View } from "react-native";

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

const HistoryCard: React.FC<{ history: UnitReportDriver }> = ({ history }) => (
  <Card key={`history-${history.id}`}>
    <CardTitle>{formatDate(history.created_at!, "dd-MM-y")}</CardTitle>
    <CardContent>
      <Text>Driver: {history.driver.name}</Text>
      <Text>
        Status:{" "}
        <Text
          style={{
            color:
              history.status_unit === "READY"
                ? Colors.light.primary
                : Colors.light.destructive,
          }}
        >
          {history.status_unit}
        </Text>
      </Text>
      <Text>Isu: {history.issue || "-"}</Text>
    </CardContent>
  </Card>
);

export default function History() {
  const { session } = useSession();

  const { data, isPending, refetch } = useQuery({
    queryKey: ["history"],
    queryFn: () => getHistory(session!),
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "column",
        rowGap: 8,
        padding: 20,
      }}
      refreshControl={
        <RefreshControl refreshing={isPending} onRefresh={refetch} />
      }
    >
      {data &&
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
                <HistoryCard key={`history-${history.id}`} history={history} />
              ))}
            </View>
          </View>
        ))}
    </ScrollView>
  );
}
