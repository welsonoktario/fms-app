import { Colors } from "@/constants/Colors";
import { useCallback, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import {
  AutocompleteDropdown,
  type AutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";

type AutocompleteProps = {
  fetchSuggestions: (query: string) => Promise<AutocompleteDropdownItem[]>;
  placeholder?: string;
  onItemSelected?: (item: AutocompleteDropdownItem | null) => void;
  debounceTime?: number;
  inputStyle?: object;
  inputContainerStyle?: object;
};

export const AutoComplete: React.FC<AutocompleteProps> = ({
  fetchSuggestions,
  placeholder = "Type to search...",
  onItemSelected,
  debounceTime = 600,
  inputStyle = {},
  inputContainerStyle = {},
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState<
    AutocompleteDropdownItem[] | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem | null>(null);
  const scheme = useColorScheme();

  const getSuggestions = useCallback(
    async (q: string) => {
      if (typeof q !== "string" || q.length < 3) {
        setSuggestionsList(null);
        return;
      }
      setLoading(true);
      const suggestions = await fetchSuggestions(q);
      setSuggestionsList(suggestions);
      setLoading(false);
    },
    [fetchSuggestions]
  );

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const themeColors = Colors[scheme || "light"];

  return (
    <View style={styles.container}>
      <AutocompleteDropdown
        direction={Platform.select({ ios: "down" })}
        dataSet={suggestionsList}
        onChangeText={getSuggestions}
        onSelectItem={(item) => {
          setSelectedItem(item);
          onItemSelected?.(item);
        }}
        debounce={debounceTime}
        suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
        onClear={onClearPress}
        loading={loading}
        useFilter={false} // set false to prevent rerender twice
        textInputProps={{
          placeholder,
          autoCorrect: false,
          autoCapitalize: "none",
          keyboardType: "number-pad",
          style: [
            styles.input,
            {
              color: themeColors.text,
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
            },
            inputStyle,
          ],
        }}
        inputContainerStyle={[
          styles.inputContainer,
          {
            backgroundColor: themeColors.background,
            borderColor: themeColors.border,
          },
          inputContainerStyle,
        ]}
        suggestionsListContainerStyle={{
          backgroundColor: themeColors.background,
        }}
        containerStyle={{ flexGrow: 1, flexShrink: 1 }}
        renderItem={(item, text) => (
          <Text style={{ color: themeColors.text, padding: 15 }}>{item.title}</Text>
        )}
        inputHeight={100}
        showChevron={false}
        closeOnBlur={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    ...Platform.select({ ios: { zIndex: 10 } }),
  },
  input: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: "Geist-Regular",
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 0.8,
    height: 36,
  },
});
