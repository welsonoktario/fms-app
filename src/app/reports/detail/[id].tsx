import {
  Button,
  RadioGroup,
  RadioGroupItem,
  Text,
  TextArea,
  TextField,
} from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks";
import type { UnitCondition, UnitReport } from "@/types";
import { $fetch } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Fragment } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const schema = z.object({
  name: z.coerce.string({
    required_error: "Nama Lengkap tidak boleh kosong",
    invalid_type_error: "Nama Lengkap harus berupa teks",
  }),
  nik: z.coerce.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
  conditions: z.array(
    z.object({
      id: z.coerce.number(),
      name: z.coerce.string(),
      value: z.union([z.literal("C"), z.literal("K")]),
      issue: z.string().nullable(),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

export default function ReportDetail() {
  const { id } = useLocalSearchParams();
  const { session } = useSession();

  const getUnitReport = async () => {
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

  const getUnitConditions = async () => {
    const res = await $fetch<UnitCondition[]>(BASE_URL + "/unit-conditions");

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
      }))
    );
    form.trigger("conditions");

    return res.data;
  };

  const reportQuery = useQuery({
    queryKey: ["report", id],
    enabled: !!id && !!session,
    queryFn: getUnitReport,
  });
  const unitConditionsQuery = useQuery({
    queryKey: ["unitConditions"],
    queryFn: () => getUnitConditions(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      nik: "",
      conditions: reportQuery.data?.conditions || [],
    },
  });

  const conditionsForm = useFieldArray({
    control: form.control,
    name: "conditions",
  });

  const onSubmit = () => {
    const values = form.getValues();
    console.log(values);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        rowGap: 16,
        paddingHorizontal: 20,
        paddingBottom: 20,
      }}
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={{
              flexDirection: "column",
              rowGap: 4,
            }}
          >
            <Text variant="body1">Nama Lengkap</Text>
            <TextField
              placeholder="user@gmail.com"
              textContentType="emailAddress"
              autoComplete="email"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {form.formState.errors.name && (
              <Text style={{ color: Colors.dark.destructive }}>
                {form.formState.errors.name.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={form.control}
        name="nik"
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={{
              flexDirection: "column",
              rowGap: 4,
            }}
          >
            <Text variant="body1">NIK</Text>
            <TextField
              placeholder="user@gmail.com"
              keyboardType="numeric"
              autoCapitalize="none"
              inputMode="numeric"
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
              }}
              value={value}
            />
            {form.formState.errors.nik && (
              <Text style={{ color: Colors.dark.destructive }}>
                {form.formState.errors.nik.message}
              </Text>
            )}
          </View>
        )}
      />

      {form.getValues("conditions") &&
        form.getValues("conditions").length > 0 &&
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
                    style={{
                      flexDirection: "row",
                      columnGap: 10,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", columnGap: 4, alignItems: "center" }}
                    >
                      <RadioGroupItem
                        value="C"
                        selectedValue={value}
                        onPress={(optValue) => {
                          onChange(optValue);
                          form.trigger("conditions");
                          // form.setValue(`conditions.${i}.value`, optValue as any);
                        }}
                      />
                      <Text>C</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", columnGap: 4, alignItems: "center" }}
                    >
                      <RadioGroupItem
                        value="K"
                        selectedValue={value}
                        onPress={(optValue) => {
                          onChange(optValue);
                          form.trigger("conditions");
                          // form.setValue(`conditions.${i}.value`, optValue as any);
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
                    onChangeText={onChange}
                    value={value || undefined}
                    onBlur={onBlur}
                  />
                )}
              />
            ) : null}
          </Fragment>
        ))}

      <Button
        onPress={() => {
          onSubmit();
        }}
        style={{ marginTop: 20 }}
      >
        Simpan
      </Button>
    </View>
  );
}
