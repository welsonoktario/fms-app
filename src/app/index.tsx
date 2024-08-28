import { Text } from "@/components";
import Block from "@/components/Block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { useSession } from "@/hooks/useSession";
import { chunk } from "@/utils";
import { type Href, Redirect, useRouter } from "expo-router";
import { View } from "react-native";

const menus = [
  {
    href: "/report",
    label: "Lapor",
    icon: "",
  },
  {
    href: "/report",
    label: "Lapor",
    icon: "",
  },
  {
    href: "/report",
    label: "Lapor",
    icon: "",
  },
] satisfies {
  href: Href;
  label: string;
  icon: string;
}[];

export default function Menu() {
  const { session } = useSession();
  const router = useRouter();

  if (!session) {
    return <Redirect href="/auth/sign-in" />;
  }

  const handleMenuClick = (href: Href) => {
    router.navigate(href);
  };

  const renderItem = (item: (typeof menus)[0]) => (
    <Card onPress={() => handleMenuClick(item.href)} style={{ flex: 1 }}>
      <CardHeader>
        <CardTitle>Lapor</CardTitle>
      </CardHeader>
      <CardContent>
        <Text variant="body2">Hello World!</Text>
      </CardContent>
    </Card>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {chunk(menus, 2).map((chunk, i) => (
        <Block
          key={`chunk-${i}`}
          gap={10}
          style={{ marginTop: i === 0 ? 0 : 10, maxHeight: 180 }}
          row
        >
          {chunk.map((menu) => renderItem(menu))}
        </Block>
      ))}
    </View>
  );
}
