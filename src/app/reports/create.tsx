import {
  AutoComplete,
  Button,
  RadioGroup,
  RadioGroupItem,
  Text,
  TextArea,
  TextField,
} from "@/components";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/hooks";
import type { Unit, UnitCondition } from "@/types";
import { $fetch } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Fragment } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { View } from "react-native";
import type { AutocompleteDropdownItem } from "react-native-autocomplete-dropdown";
import { z } from "zod";

const schema = z.object({
  nik: z.coerce.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
  conditions: z.array(
    z.object({
      id: z.coerce.number(),
      name: z.coerce.string(),
      value: z.union([z.literal("C"), z.literal("K")]),
      issue: z.string().nullable(),
    })
  ),
  issues: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function ReportDetail() {
  const { id } = useLocalSearchParams();
  const { session } = useSession();

  const getUnit = async () => {
    const res = await $fetch<Unit>(`http://10.10.0.58:8000/api/units/${id}`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    if (res.status !== "ok") {
      throw new Error(res.message);
    }
    console.log(res.data);

    return res.data;
  };

  const getUnitConditions = async () => {
    const res = await $fetch<UnitCondition[]>(
      "http://10.10.0.58:8000/api/unit-conditions"
    );

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

  const getDrivers = async (q = "") => {
    const res = await $fetch<AutocompleteDropdownItem[]>(
      "http://10.10.0.58:8000/api/drivers?q=" + q
    );

    if (res.status !== "ok") {
      throw new Error(res.message);
    }

    return res.data;
  };

  const unitQuery = useQuery({
    queryKey: ["report", id],
    enabled: !!id && !!session,
    queryFn: getUnit,
  });
  const unitConditionsQuery = useQuery({
    queryKey: ["unitConditions"],
    queryFn: () => getUnitConditions(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      nik: "",
      conditions: [],
      issues: null,
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

  console.log(unitQuery.data);

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
      <Text variant="body1">Kode Unit</Text>
      <TextField
        placeholder="user@gmail.com"
        textContentType="emailAddress"
        autoComplete="email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={unitQuery.data?.asset_code ?? ""}
        readOnly
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
            {/* <TextField
              placeholder="user@gmail.com"
              keyboardType="numeric"
              autoCapitalize="none"
              inputMode="numeric"
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
              }}
              value={value}
            /> */}
            <AutoComplete
              fetchSuggestions={getDrivers}
              placeholder="Ketik NIK..."
              debounceTime={500}
              onItemSelected={(item) => {
                onChange(item?.id);
              }}
              inputContainerStyle={{ marginTop: 32 }}
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

      <Controller
        control={form.control}
        name="issues"
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={{
              flexDirection: "column",
              rowGap: 4,
            }}
          >
            <Text variant="body1">Kendala (jika ada)</Text>
            <TextArea
              placeholder="Isikan kendala"
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
              }}
              value={value || undefined}
            />
            {form.formState.errors.issues && (
              <Text style={{ color: Colors.dark.destructive }}>
                {form.formState.errors.issues.message}
              </Text>
            )}
          </View>
        )}
      />

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
