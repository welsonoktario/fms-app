import { Text } from "@/components";
import { useSession } from "@/hooks/useSession";
import type { Unit } from "@/types";
import { $fetch } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, RefreshControl, ScrollView, View } from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const getUnits = async (session: string) => {
  const res = await $fetch<Unit>(BASE_URL + "/units", {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  });

  if (res.status === "fail") {
    throw new Error(res.message);
  }
  return res.data;
};

export default function Reports() {
  const { width } = Dimensions.get("window"); // Get screen width
  const { session } = useSession();

  // State to hold image dimensions
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false); // Track if image is loaded

  const { isPending, data, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: () => getUnits(session!),
  });

  const padding = 20;
  const imageWidth = width - padding * 2; // Adjust the image width for container padding

  // Function to get the image size
  const getImageSize = (uri: string) => {
    Image.getSize(
      uri,
      (width, height) => {
        setImageDimensions({ width, height });
        setImageLoaded(true); // Mark image as loaded
      },
      (error) => {
        console.error("Failed to load image size:", error);
      }
    );
  };

  // Fetch image size when data is available
  useEffect(() => {
    if (data && data.image_unit) {
      getImageSize(data.image_unit); // Call to get image size
    }
  }, [data]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
      contentContainerStyle={{
        flexGrow: 1,
        padding,
      }}
    >
      {!isPending && data ? (
        <View style={{ flexDirection: "column", rowGap: 16 }}>
          {/* Image Section */}
          <View>
            <Text variant="h6">Foto</Text>
            {imageLoaded && imageDimensions ? (
              <Image
                source={{ uri: data.image_unit }} // Use source prop for React Native Image
                style={{
                  width: imageWidth, // Full width minus padding
                  height: (imageWidth * imageDimensions.height) / imageDimensions.width, // Maintain aspect ratio
                  borderRadius: 8,
                }}
                resizeMode="cover" // Choose "cover" or "contain" based on your design
              />
            ) : (
              <View
                style={{
                  width: imageWidth,
                  height: imageWidth,
                  backgroundColor: "#eee",
                  borderRadius: 8,
                }}
              />
            )}
          </View>

          {/* Text Sections */}
          <View>
            <Text variant="h6">Kode Unit</Text>
            <Text>{data.asset_code}</Text>
          </View>
          <View>
            <Text variant="h6">Plat Nomor</Text>
            <Text>{data.plate}</Text>
          </View>
          <View>
            <Text variant="h6">Model / Tahun</Text>
            <Text>
              {data.model} / {data.year}
            </Text>
          </View>
          <View>
            <Text variant="h6">Warna</Text>
            <Text>{data.colour}</Text>
          </View>
          <View>
            <Text variant="h6">Proyek</Text>
            <Text>{data.project_id}</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
