import { Text } from "@/components";
import { useSession } from "@/hooks";
import type { UnitReport } from "@/types";
import { $fetch } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { RefreshControl, ScrollView, View } from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const getUnitReport = async (session: string, id: string) => {
  const res = await $fetch<UnitReport>(BASE_URL + `/daily-monitoring-units/${id}`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  });

  if (res.status !== "ok") {
    throw new Error(res.message);
  }

  return res.data;
};

export default function ReportDetail() {
  const { id } = useLocalSearchParams();
  const { session } = useSession();

  const { data, isPending, refetch } = useQuery({
    queryKey: ["reports", id],
    enabled: !!id && !!session,
    queryFn: () => getUnitReport(session!, id.toString()),
  });

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
      contentContainerStyle={{
        flex: 1,
        flexDirection: "column",
        rowGap: 16,
        padding: 20,
      }}
    >
      {!isPending && data ? (
        <View style={{ flex: 1, flexDirection: "column", rowGap: 8 }}>
          <View>
            <Text variant="h5">Tanggal Checklist</Text>
            <Text>{formatDate(data.created_at!, "d MMMM y, HH:mm:ss ")}</Text>
          </View>
          <View>
            <Text variant="h5">Status Unit</Text>
            <Text style={{ color: data?.status_unit === "READY" ? "green" : "red" }}>
              {data?.status_unit}
            </Text>
          </View>
          <View>
            <Text variant="h5">Driver</Text>
            <Text>{data?.driver?.name}</Text>
          </View>
          <View>
            <Text variant="h5">Kondisi Unit</Text>
            {(data.conditions || []).map((condition) => (
              <>
                <Text key={`condition-${condition.id}`}>
                  {condition.name} - {condition.value}
                </Text>
                {condition.value === "K" ? (
                  <Text
                    key={`condition-${condition.id}-issue`}
                    variant="body2"
                    style={{ marginBottom: 4 }}
                  >
                    Isu: {condition.issue}
                  </Text>
                ) : null}
              </>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
