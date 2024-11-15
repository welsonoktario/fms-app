import {
  AutoComplete,
  Button,
  Icon,
  RadioGroup,
  RadioGroupItem,
  Text,
  TextArea,
  TextField,
} from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks";
import { useCameraStore } from "@/stores/camera-store";
import type { UnitCondition, UnitReport } from "@/types";
import { $fetch } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { getCurrentPositionAsync } from "expo-location";
import { useRouter } from "expo-router";
import { Fragment, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import type { AutocompleteDropdownItem } from "react-native-autocomplete-dropdown";
import { z } from "zod";

const schema = z.object({
  driver: z.number({
    required_error: "Isi driver",
  }),
  conditions: z.array(
    z.object({
      id: z.coerce.number(),
      name: z.coerce.string(),
      value: z.union([z.literal("C"), z.literal("K")]),
      issue: z.string().nullable(),
    }),
  ),
  status: z
    .union([z.literal("READY"), z.literal("NOT READY")])
    .default("READY"),
  issue: z.string().nullable(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

type FormValues = z.infer<typeof schema>;

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export default function ReportDetail() {
  const { session, unit } = useSession();
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { takenPicture } = useCameraStore();

  const getUnitConditions = async () => {
    const res = await $fetch<UnitCondition[]>(`${BASE_URL}/unit-conditions`);

    if (res.status !== "ok") {
      throw new Error(res.message);
    }

    form.setValue(
      "conditions",
      res.data.map((c) => ({
        id: c.id,
        name: c.name,
        value: "C",
        issue: null,
      })),
    );
    form.trigger("conditions");

    return res.data;
  };

  const getDrivers = async (q = "") => {
    const res = await $fetch<AutocompleteDropdownItem[]>(
      `${BASE_URL}/drivers?q=${q}`,
    );

    if (res.status !== "ok") {
      throw new Error(res.message);
    }

    return res.data;
  };

  const unitConditionsQuery = useQuery({
    queryKey: ["unitConditions"],
    queryFn: () => getUnitConditions(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      driver: undefined,
      conditions: [],
      issue: null,
    },
  });

  const onSubmit = async () => {
    const location = await getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    form.setValue("location.lat", latitude);
    form.setValue("location.lng", longitude);

    const values = form.getValues();

    try {
      const res = await $fetch<UnitReport>(
        `${BASE_URL}/daily-monitoring-units`,
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            Authorization: `Bearer ${session}`,
          },
        },
      );

      if (res.status === "fail") {
        throw new Error(res.message);
      }

      queryClient.refetchQueries({
        exact: true,
        queryKey: ["today-reports"],
      });
      router.back();
      // biome-ignore lint/suspicious/noExplicitAny: exception not yet implemented
    } catch (e: any) {
      Alert.alert("Error", e.message, [
        {
          text: "OK",
        },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={88}
    >
      <ScrollView
        ref={scrollViewRef} // Attach the ScrollView to the ref
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled" // Allow taps to propagate through keyboard dismissal
      >
        <View style={{ flex: 1, flexDirection: "column", rowGap: 16 }}>
          <View>
            <Text variant="body1">Tanggal Checklist</Text>
            <Text style={{ marginTop: 4 }} variant="body2">
              {formatDate(new Date(), "dd-MM-yyyy")}
            </Text>
          </View>

          <View>
            <Text variant="body1">Kode Unit</Text>
            <TextField
              style={{ marginTop: 4 }}
              placeholder="DT-0001"
              value={unit?.asset_code}
              readOnly
            />
          </View>

          <Controller
            control={form.control}
            name="driver"
            render={({ field: { onChange, onBlur } }) => (
              <View style={{ flexDirection: "column", rowGap: 4 }}>
                <Text variant="body1">Driver</Text>
                <AutoComplete
                  fetchSuggestions={getDrivers}
                  placeholder="Ketik Nama/NIK"
                  debounceTime={500}
                  onItemSelected={(item) => {
                    onChange(item?.id);
                    form.trigger("driver");
                  }}
                  onBlur={onBlur}
                />
                {form.formState.errors.driver && (
                  <Text
                    style={{
                      color: Colors.dark.destructive,
                    }}
                  >
                    {form.formState.errors.driver.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="status"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ flexDirection: "column", rowGap: 4 }}>
                <Text variant="body1">Driver</Text>
                <RadioGroup
                  value={value}
                  onValueChange={onChange}
                  style={{ flexDirection: "column", rowGap: 4 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: 4,
                      alignItems: "center",
                    }}
                  >
                    <RadioGroupItem
                      value="READY"
                      selectedValue={value}
                      onPress={(optValue) => {
                        onChange(optValue);
                        form.trigger("status");
                      }}
                    />
                    <Text>Ready</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: 4,
                      alignItems: "center",
                    }}
                  >
                    <RadioGroupItem
                      value="NOT READY"
                      selectedValue={value}
                      onPress={(optValue) => {
                        onChange(optValue);
                        form.trigger("status");
                      }}
                    />
                    <Text>Not Ready</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: 4,
                      alignItems: "center",
                    }}
                  >
                    <RadioGroupItem
                      value="NOT READY"
                      selectedValue={value}
                      onPress={(optValue) => {
                        onChange(optValue);
                        form.trigger("status");
                      }}
                    />
                    <Text>Needs Maintenance</Text>
                  </View>
                </RadioGroup>
                {form.formState.errors.status && (
                  <Text
                    style={{
                      color: Colors.dark.destructive,
                    }}
                  >
                    {form.formState.errors.status.message}
                  </Text>
                )}
              </View>
            )}
          />

          {form.getValues("conditions") &&
          form.getValues("conditions").length > 0 ? (
            form.getValues("conditions").map((uc, i) => (
              <Fragment key={uc.id}>
                <Controller
                  control={form.control}
                  name={`conditions.${i}.value`}
                  render={({ field: { onChange, value } }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="body1">{uc.name}</Text>
                      <RadioGroup
                        value={value}
                        onValueChange={onChange}
                        style={{ flexDirection: "row", columnGap: 10 }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            columnGap: 4,
                            alignItems: "center",
                          }}
                        >
                          <RadioGroupItem
                            value="C"
                            selectedValue={value}
                            onPress={(optValue) => {
                              onChange(optValue);
                              form.trigger("conditions");
                            }}
                          />
                          <Text>C</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            columnGap: 4,
                            alignItems: "center",
                          }}
                        >
                          <RadioGroupItem
                            value="K"
                            selectedValue={value}
                            onPress={(optValue) => {
                              onChange(optValue);
                              form.trigger("conditions");
                            }}
                          />
                          <Text>K</Text>
                        </View>
                      </RadioGroup>
                    </View>
                  )}
                />

                {form.getValues(`conditions.${i}.value`) === "K" ? (
                  <Controller
                    control={form.control}
                    name={`conditions.${i}.issue`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextArea
                        placeholder="Alasan"
                        onChangeText={(text) => {
                          onChange(text);
                          // Ensure this scrolls to the TextArea when focused
                          setTimeout(() => {
                            scrollViewRef.current?.scrollToEnd({
                              animated: true,
                            });
                          }, 100);
                        }}
                        value={value || undefined}
                        onBlur={onBlur}
                      />
                    )}
                  />
                ) : null}
              </Fragment>
            ))
          ) : (
            <ActivityIndicator style={{ marginTop: 8 }} />
          )}

          <Controller
            control={form.control}
            name="issue"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ flexDirection: "column", rowGap: 4 }}>
                <Text variant="body1">Kendala (jika ada)</Text>
                <TextArea
                  style={{ marginTop: 4 }}
                  placeholder="Isikan kendala"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    // Automatically scroll when the TextArea is focused
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                  }}
                  value={value || undefined}
                />
                {form.formState.errors.issue && (
                  <Text style={{ color: Colors.dark.destructive }}>
                    {form.formState.errors.issue.message}
                  </Text>
                )}
              </View>
            )}
          />

          <View>
            <Text>Foto Unit</Text>
            <Pressable
              style={{ marginTop: 4 }}
              onPress={() => {
                router.navigate("/camera");
              }}
            >
              {takenPicture ? (
                <View style={{ overflow: "hidden", borderRadius: 8 }}>
                  <Image
                    source={{
                      uri: takenPicture.uri,
                    }}
                    resizeMode="cover"
                    style={{
                      width: "100%",
                      aspectRatio: "9/16",
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 1,
                    borderColor: "#A9A9A9",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 52,
                    }}
                  >
                    <Icon name="image" size={44} color="#A9A9A9" />
                    <Text style={{ marginTop: 16, color: "#A9A9A9" }}>
                      Ambil foto dari kamera
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          </View>

          <Button
            style={{ marginTop: 8 }}
            onPress={() => {
              onSubmit();
            }}
            disabled={!form.formState.isValid}
          >
            Simpan
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
