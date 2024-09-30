import { View } from "react-native";

import { Button, UnitCard } from "@/components";
import { useSession } from "@/hooks/useSession";
import type { Unit } from "@/types";
import { $fetch } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const getUnits = async (session: string) => {
  const res = await $fetch<Unit & { today_report: any }>(
    "http://10.10.0.58:8000/api/daily-monitoring-units",
    {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    }
  );

  if (res.status === "fail") {
    throw new Error(res.message);
  }
  return res.data;
};

export default function Reports() {
  const router = useRouter();
  const { session, signOut } = useSession();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["reports"],
    queryFn: () => getUnits(session!),
  });

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}
    >
      {!isPending && data ? <UnitCard unit={data} /> : null}
      <Button
        onPress={() => {
          router.navigate("/reports/create");
        }}
      >
        Tambah
      </Button>
    </View>
  );
}
