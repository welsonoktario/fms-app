import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

const getReportDetail = async (id: string) => {
  return {
    id,
  };
};

export default function ReportDetail() {
  const { id } = useLocalSearchParams();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["report", id],
    enabled: !!id,
    queryFn: () => getReportDetail(id as string),
  });


}
